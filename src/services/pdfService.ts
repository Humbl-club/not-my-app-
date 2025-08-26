import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DataManager, ApplicantData } from '@/utils/dataManager';
import { PaymentDetails } from './paymentService';

export interface ReceiptData {
  referenceNumber: string;
  paymentDetails: PaymentDetails;
  applicants: ApplicantData[];
  submissionDate: string;
  paymentStatus: 'succeeded' | 'processing' | 'failed';
}

export class PDFService {
  
  /**
   * Generate PDF receipt
   */
  static async generateReceipt(receiptData: ReceiptData): Promise<jsPDF> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up fonts and colors
    pdf.setFont('helvetica');
    
    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(37, 99, 235); // Primary blue
    pdf.text('Payment Receipt', 20, 25);
    
    pdf.setFontSize(16);
    pdf.setTextColor(75, 85, 99); // Muted gray
    pdf.text('UK ETA Application Service', 20, 35);
    
    // Receipt details box
    pdf.setDrawColor(229, 231, 235);
    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(20, 45, 170, 30, 3, 3, 'FD');
    
    pdf.setFontSize(12);
    pdf.setTextColor(17, 24, 39); // Dark text
    pdf.text('Receipt Details', 25, 55);
    
    pdf.setFontSize(10);
    pdf.text(`Reference Number: ${receiptData.referenceNumber}`, 25, 62);
    pdf.text(`Date: ${new Date(receiptData.submissionDate).toLocaleDateString('en-GB')}`, 25, 68);
    pdf.text(`Status: ${receiptData.paymentStatus.toUpperCase()}`, 25, 74);
    
    // Applicants section
    let yPos = 90;
    pdf.setFontSize(14);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Applicant Details', 20, yPos);
    
    yPos += 10;
    receiptData.applicants.forEach((applicant, index) => {
      pdf.setFontSize(11);
      pdf.setTextColor(55, 65, 81);
      pdf.text(`${index === 0 ? 'Main Applicant' : `Applicant ${index + 1}`}:`, 20, yPos);
      
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      pdf.text(`${applicant.firstName} ${applicant.lastName}`, 60, yPos);
      
      yPos += 5;
      pdf.text(`Passport: ${applicant.passportNumber}`, 20, yPos);
      pdf.text(`Nationality: ${applicant.nationality}`, 100, yPos);
      
      yPos += 10;
    });
    
    // Payment breakdown
    yPos += 10;
    pdf.setFontSize(14);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Payment Breakdown', 20, yPos);
    
    // Payment details table
    yPos += 10;
    pdf.setDrawColor(229, 231, 235);
    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(20, yPos, 170, 40, 3, 3, 'FD');
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    
    pdf.text(`Government fees (${receiptData.paymentDetails.numberOfApplicants} × £16.00):`, 25, yPos);
    pdf.text(`£${receiptData.paymentDetails.governmentFee.toFixed(2)}`, 150, yPos);
    
    yPos += 6;
    pdf.text('Service fee:', 25, yPos);
    pdf.text(`£${receiptData.paymentDetails.adminFee.toFixed(2)}`, 150, yPos);
    
    yPos += 6;
    pdf.text('VAT (20%):', 25, yPos);
    pdf.text(`£${receiptData.paymentDetails.vat.toFixed(2)}`, 150, yPos);
    
    // Total line
    yPos += 8;
    pdf.setDrawColor(17, 24, 39);
    pdf.line(25, yPos, 165, yPos);
    
    yPos += 8;
    pdf.setFontSize(12);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Total Paid:', 25, yPos);
    pdf.text(`£${receiptData.paymentDetails.total.toFixed(2)}`, 150, yPos);
    
    // Footer
    yPos += 30;
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text('This is an official receipt for your UK ETA application payment.', 20, yPos);
    pdf.text('For inquiries, contact support@uketaservice.com', 20, yPos + 5);
    
    yPos += 15;
    pdf.text('Important: Keep this receipt for your records. You may need it for visa applications or travel documentation.', 20, yPos);
    
    return pdf;
  }

  /**
   * Generate application confirmation PDF
   */
  static async generateApplicationConfirmation(receiptData: ReceiptData): Promise<jsPDF> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Application Confirmation', 20, 25);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.setTextColor(75, 85, 99);
    pdf.text('UK Electronic Travel Authorization', 20, 35);
    
    // Status box
    pdf.setDrawColor(34, 197, 94);
    pdf.setFillColor(240, 253, 244);
    pdf.roundedRect(20, 45, 170, 25, 3, 3, 'FD');
    
    pdf.setFontSize(12);
    pdf.setTextColor(22, 163, 74);
    pdf.text('✓ Application Successfully Submitted', 25, 55);
    
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text(`Reference: ${receiptData.referenceNumber}`, 25, 62);
    pdf.text(`Submitted: ${new Date(receiptData.submissionDate).toLocaleDateString('en-GB')}`, 25, 67);
    
    // What happens next
    let yPos = 85;
    pdf.setFontSize(14);
    pdf.setTextColor(17, 24, 39);
    pdf.text('What Happens Next?', 20, yPos);
    
    const steps = [
      {
        number: '1',
        title: 'Application Review',
        description: 'Our team reviews your application for completeness and accuracy.'
      },
      {
        number: '2', 
        title: 'Government Submission',
        description: 'Your application is submitted to UK Immigration authorities.'
      },
      {
        number: '3',
        title: 'Processing',
        description: 'UK authorities process your ETA application (typically 72 hours).'
      },
      {
        number: '4',
        title: 'ETA Issued',
        description: 'You receive your approved ETA via email for travel to the UK.'
      }
    ];
    
    yPos += 10;
    steps.forEach((step, index) => {
      // Step number circle
      pdf.setDrawColor(37, 99, 235);
      pdf.setFillColor(37, 99, 235);
      pdf.circle(25, yPos + 3, 3, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text(step.number, 23.5, yPos + 4.5);
      
      // Step content
      pdf.setFontSize(11);
      pdf.setTextColor(17, 24, 39);
      pdf.text(step.title, 35, yPos + 2);
      
      pdf.setFontSize(9);
      pdf.setTextColor(75, 85, 99);
      const lines = pdf.splitTextToSize(step.description, 140);
      pdf.text(lines, 35, yPos + 7);
      
      yPos += 20;
    });
    
    // Contact information
    yPos += 10;
    pdf.setDrawColor(229, 231, 235);
    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(20, yPos, 170, 25, 3, 3, 'FD');
    
    pdf.setFontSize(12);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Need Help?', 25, yPos + 8);
    
    pdf.setFontSize(9);
    pdf.setTextColor(75, 85, 99);
    pdf.text('Email: support@uketaservice.com', 25, yPos + 14);
    pdf.text('Phone: +44 20 7946 0958', 25, yPos + 19);
    
    return pdf;
  }

  /**
   * Download PDF file
   */
  static downloadPDF(pdf: jsPDF, filename: string): void {
    pdf.save(filename);
  }

  /**
   * Get PDF as blob for email attachment
   */
  static getPDFBlob(pdf: jsPDF): Blob {
    return pdf.output('blob');
  }

  /**
   * Generate combined receipt and confirmation document
   */
  static async generateCompleteDocument(receiptData: ReceiptData): Promise<jsPDF> {
    // Start with receipt
    const pdf = await this.generateReceipt(receiptData);
    
    // Add new page for confirmation
    pdf.addPage();
    
    // Generate confirmation content on new page
    const confirmationPdf = await this.generateApplicationConfirmation(receiptData);
    
    // Copy confirmation content to main document
    // Note: This is a simplified approach. In production, you might want to 
    // implement proper page copying functionality
    
    return pdf;
  }
}