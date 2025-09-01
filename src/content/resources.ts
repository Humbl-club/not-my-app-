export interface ResourceSection {
  heading: string;
  paragraphs: string[];
}

export interface ResourceFAQ {
  question: string;
  answer: string;
}

export interface ResourceItem {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  heroImage: string;
  heroAlt: string;
  author: string;
  datePublished: string;
  lastModified: string;
  readingTime: string;
  tags: string[];
  sections: ResourceSection[];
  faq: ResourceFAQ[];
  related: string[]; // slugs
}

export const resources: ResourceItem[] = [
  {
    slug: 'uk-eta-requirements-documents-eligibility',
    title: 'UK ETA Requirements: Documents, Eligibility, and Photo Specs',
    description: 'Everything you need to qualify for the UK Electronic Travel Authorisation (ETA): eligible nationalities, documents, and photo specifications.',
    keywords: 'UK ETA requirements, documents for UK ETA, ETA eligibility UK, UK travel authorization requirements, UK ETA photo requirements',
    heroImage: 'https://source.unsplash.com/1200x630/?passport,uk,travel',
    heroAlt: 'UK passport and travel documents on a table',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-01',
    lastModified: '2025-08-28',
    readingTime: '6 min read',
    tags: ['Requirements', 'Documents', 'Eligibility'],
    sections: [
      {
        heading: 'Who Needs a UK ETA?',
        paragraphs: [
          'The UK ETA applies to eligible nationalities traveling to the United Kingdom for short stays (tourism, business, transit). It is linked to your passport and required before boarding.',
          'Travelers from visa-exempt countries and certain nationalities must obtain an ETA. Always verify your eligibility before booking flights.'
        ]
      },
      {
        heading: 'Required Documents',
        paragraphs: [
          'To complete your ETA application, you’ll need: a valid passport, a compliant digital photo, an active email address, and a payment method. Families or groups can apply together using one reference.',
          'Ensure your passport is valid for the duration of your trip and that your personal details match exactly across documents.'
        ]
      },
      {
        heading: 'Photo Specifications',
        paragraphs: [
          'Your photo must be recent, clear, and taken against a plain background. No filters, hats, or tinted glasses. Minimum 600×600 px, JPG/PNG accepted. Our photo tool checks brightness, face position, and background uniformity before upload.'
        ]
      }
    ],
    faq: [
      { question: 'Do I need a visa or an ETA?', answer: 'If you are from an eligible visa‑exempt country, you need an ETA. Otherwise, you may need a standard visa.' },
      { question: 'How long is the ETA valid?', answer: 'Typically up to 2 years or until your passport expires—whichever comes first.' }
    ],
    related: ['how-to-apply-uk-eta-step-by-step', 'uk-eta-photo-requirements-checklist']
  },
  {
    slug: 'how-to-apply-uk-eta-step-by-step',
    title: 'How to Apply for the UK ETA: A Step‑by‑Step Guide',
    description: 'Follow our five-step UK ETA application guide—personal details, document upload, verification, payment, and submission—plus tips to avoid delays.',
    keywords: 'apply UK ETA, UK ETA application process, UK travel authorization apply, UK ETA online form',
    heroImage: 'https://source.unsplash.com/1200x630/?uk,london,guide',
    heroAlt: 'London cityscape with travel planning on a laptop',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-01',
    lastModified: '2025-08-28',
    readingTime: '7 min read',
    tags: ['Application', 'Guides'],
    sections: [
      { heading: 'Step 1: Create Your Application', paragraphs: ['Choose individual or group. You can add up to 50 travelers in one application and track everything with a single reference.'] },
      { heading: 'Step 2: Enter Personal Details', paragraphs: ['Names must match the passport exactly. Use uppercase for names as shown in MRZ where applicable.'] },
      { heading: 'Step 3: Upload Documents', paragraphs: ['Upload passport bio page and a compliant photo. Our system validates quality automatically and flags issues instantly.'] },
      { heading: 'Step 4: Review & Confirm', paragraphs: ['Check spelling, dates, and passport numbers. Correct errors before payment to avoid delays.'] },
      { heading: 'Step 5: Submit', paragraphs: ['Submit securely. You’ll receive a reference number and status updates by email.'] }
    ],
    faq: [
      { question: 'Can I save and resume later?', answer: 'Yes. Your progress is saved for 30 minutes on this device and synced when signed in.' },
      { question: 'Can I apply for my family?', answer: 'Yes. Use group mode to apply for multiple travelers and pay once.' }
    ],
    related: ['common-mistakes-uk-eta-avoid', 'track-uk-eta-application-status']
  },
  {
    slug: 'uk-eta-photo-requirements-checklist',
    title: 'UK ETA Photo Requirements: The Complete Checklist',
    description: 'Avoid photo rejections: size, background, lighting, and framing requirements for a compliant UK ETA photo.',
    keywords: 'UK ETA photo, photo requirements UK ETA, biometric photo UK ETA, passport photo UK ETA',
    heroImage: 'https://source.unsplash.com/1200x630/?portrait,photo,studio',
    heroAlt: 'Neutral studio background for compliant ID photo',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-01',
    lastModified: '2025-08-28',
    readingTime: '5 min read',
    tags: ['Photo', 'Compliance'],
    sections: [
      { heading: 'Image Quality', paragraphs: ['Minimum 600×600 px, clear focus, natural lighting. Avoid shadows and glare.'] },
      { heading: 'Background & Pose', paragraphs: ['Plain, light background. Face the camera directly with a neutral expression.'] },
      { heading: 'Accessories', paragraphs: ['No hats or sunglasses. Religious headwear is permitted if it doesn’t obscure facial features.'] }
    ],
    faq: [
      { question: 'Can I take a selfie?', answer: 'Yes, if lighting and framing meet requirements. Our tool flags common issues.' }
    ],
    related: ['how-to-apply-uk-eta-step-by-step', 'common-mistakes-uk-eta-avoid']
  },
  {
    slug: 'group-uk-eta-applications-family-and-teams',
    title: 'Group UK ETA Applications for Families and Teams',
    description: 'Apply for multiple travelers in one go. Learn how to add applicants, upload documents, and track a group UK ETA with one reference.',
    keywords: 'group UK ETA, family UK ETA, multiple applicants UK ETA, apply for family UK ETA',
    heroImage: 'https://source.unsplash.com/1200x630/?family,travel,airport',
    heroAlt: 'Family at an airport departure hall',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-02',
    lastModified: '2025-08-28',
    readingTime: '6 min read',
    tags: ['Group', 'Families'],
    sections: [
      { heading: 'Add Applicants Easily', paragraphs: ['Add travelers, reuse addresses, and duplicate details safely for family members.'] },
      { heading: 'Single Checkout', paragraphs: ['One payment covers all applicants. Each applicant gets individually tracked status.'] }
    ],
    faq: [
      { question: 'Is each ETA separate?', answer: 'Yes, each traveler receives an individual authorization linked to their passport.' }
    ],
    related: ['how-to-apply-uk-eta-step-by-step', 'track-uk-eta-application-status']
  },
  {
    slug: 'processing-times-uk-eta-what-to-expect',
    title: 'UK ETA Processing Times: What to Expect',
    description: 'Typical UK ETA processing times, peak seasons, and how to avoid delays with accurate data and compliant photos.',
    keywords: 'UK ETA processing time, how long UK ETA, ETA UK timeline',
    heroImage: 'https://source.unsplash.com/1200x630/?clock,time,airport',
    heroAlt: 'Clock with airport interior in background',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-03',
    lastModified: '2025-08-28',
    readingTime: '4 min read',
    tags: ['Timing', 'Planning'],
    sections: [
      { heading: 'Typical Timelines', paragraphs: ['Most applications complete within 48–72 hours. Some may take longer during peak travel times.'] },
      { heading: 'Avoiding Delays', paragraphs: ['Double-check personal details, ensure photo compliance, and submit early when possible.'] }
    ],
    faq: [
      { question: 'Can I expedite?', answer: 'Expedited processing is not guaranteed. Submit early and ensure documents are correct.' }
    ],
    related: ['common-mistakes-uk-eta-avoid', 'track-uk-eta-application-status']
  },
  {
    slug: 'track-uk-eta-application-status',
    title: 'How to Track Your UK ETA Application Status',
    description: 'Track by reference number and email. Set alerts, understand status stages, and learn when to contact support.',
    keywords: 'track UK ETA, check ETA status UK, UK visa tracking, ETA reference number',
    heroImage: 'https://source.unsplash.com/1200x630/?tracking,progress,phone',
    heroAlt: 'User tracking application status on a phone',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-03',
    lastModified: '2025-08-28',
    readingTime: '4 min read',
    tags: ['Tracking'],
    sections: [
      { heading: 'Find Your Reference', paragraphs: ['Your reference appears on the confirmation screen and email. Use it for all status checks and support.'] },
      { heading: 'Status Stages', paragraphs: ['Draft → Submitted → Processing → Approved/Rejected. We notify you at each step.'] }
    ],
    faq: [
      { question: 'I lost my reference. What now?', answer: 'Check your email inbox/spam for the confirmation. If you created an account, it appears in your dashboard.' }
    ],
    related: ['processing-times-uk-eta-what-to-expect', 'how-to-apply-uk-eta-step-by-step']
  },
  {
    slug: 'common-mistakes-uk-eta-avoid',
    title: '10 Common UK ETA Mistakes (and How to Avoid Them)',
    description: 'From typos to poor photos—avoid the errors that most frequently delay UK ETA approvals.',
    keywords: 'UK ETA mistakes, ETA rejected photo, UK ETA error, avoid delays UK ETA',
    heroImage: 'https://source.unsplash.com/1200x630/?mistake,warning,form',
    heroAlt: 'Form with error warnings highlighted',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-04',
    lastModified: '2025-08-28',
    readingTime: '6 min read',
    tags: ['Guides', 'Quality'],
    sections: [
      { heading: 'Top Errors to Avoid', paragraphs: ['Name mismatch, wrong passport number, out-of-date photo, inconsistent dates. Review carefully before submitting.'] },
      { heading: 'Quality Checks', paragraphs: ['Use our built-in validators and preview screens to catch errors early.'] }
    ],
    faq: [
      { question: 'Can I edit after payment?', answer: 'Edits are limited. Fix issues before payment whenever possible.' }
    ],
    related: ['uk-eta-photo-requirements-checklist', 'how-to-apply-uk-eta-step-by-step']
  },
  {
    slug: 'uk-eta-vs-standard-visa-differences',
    title: 'UK ETA vs Standard Visa: Key Differences Explained',
    description: 'Understand when an ETA is enough and when you need a full visa. Compare eligibility, processing, and permitted activities.',
    keywords: 'UK ETA vs visa, do I need a visa UK, UK travel authorization versus visa',
    heroImage: 'https://source.unsplash.com/1200x630/?uk,border,immigration',
    heroAlt: 'UK border control signage',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-05',
    lastModified: '2025-08-28',
    readingTime: '5 min read',
    tags: ['Guides', 'Eligibility'],
    sections: [
      { heading: 'When ETA Applies', paragraphs: ['Short stays for tourism, business, transit for eligible nationalities. No right to work or study long-term.'] },
      { heading: 'When Visa Is Required', paragraphs: ['Longer stays, work/study, or if your nationality is not eligible for ETA.'] }
    ],
    faq: [
      { question: 'Can ETA holders work?', answer: 'No. ETA does not permit work or long-term study.' }
    ],
    related: ['uk-eta-requirements-documents-eligibility', 'how-to-apply-uk-eta-step-by-step']
  },
  {
    slug: 'privacy-security-gdpr-uk-eta',
    title: 'Privacy & Security: How We Protect Your UK ETA Data',
    description: 'Learn about encryption, GDPR compliance, data retention, and how to request deletion. Your security is our priority.',
    keywords: 'UK ETA privacy, GDPR UK ETA, secure visa application, data protection UK ETA',
    heroImage: 'https://source.unsplash.com/1200x630/?security,lock,gdpr',
    heroAlt: 'Digital lock representing data protection',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-06',
    lastModified: '2025-08-28',
    readingTime: '5 min read',
    tags: ['Security', 'GDPR'],
    sections: [
      { heading: 'Encryption & Storage', paragraphs: ['We use strong encryption in transit and at rest. Your photos and documents are stored in secure buckets with signed URLs.'] },
      { heading: 'Your Rights', paragraphs: ['You can request access or deletion of your personal data in line with GDPR.'] }
    ],
    faq: [
      { question: 'Do you store card data?', answer: 'We do not store card numbers. Payments are processed by PCI‑certified providers.' }
    ],
    related: ['common-mistakes-uk-eta-avoid', 'how-to-apply-uk-eta-step-by-step']
  },
  {
    slug: 'refunds-cancellations-uk-eta',
    title: 'Refunds & Cancellations: UK ETA Policy',
    description: 'Understand when refunds apply, how to cancel, and what fees are non‑refundable.',
    keywords: 'UK ETA refund, cancel UK ETA, refund policy ETA',
    heroImage: 'https://source.unsplash.com/1200x630/?refund,policy,help',
    heroAlt: 'Help desk sign illustrating support and policy',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-06',
    lastModified: '2025-08-28',
    readingTime: '4 min read',
    tags: ['Policy'],
    sections: [
      { heading: 'Before Processing', paragraphs: ['If your application hasn’t entered processing, you may be eligible for a partial refund of service fees. Government fees may be non‑refundable.'] },
      { heading: 'After Processing', paragraphs: ['Once submitted to authorities, fees are generally non‑refundable.'] }
    ],
    faq: [
      { question: 'How do I request a refund?', answer: 'Contact support with your reference number. We’ll confirm eligibility and next steps.' }
    ],
    related: ['track-uk-eta-application-status', 'processing-times-uk-eta-what-to-expect']
  },
  {
    slug: 'uk-entry-tips-airport-immigration',
    title: 'UK Entry Tips: Airport & Immigration Best Practices',
    description: 'Smooth arrivals: documents to have on hand, customs tips, and how to present your ETA at the border.',
    keywords: 'UK border tips, UK immigration tips, arriving UK ETA',
    heroImage: 'https://source.unsplash.com/1200x630/?uk,airport,arrival',
    heroAlt: 'Travelers arriving at a UK airport',
    author: 'UK ETA Gateway Editorial',
    datePublished: '2025-08-07',
    lastModified: '2025-08-28',
    readingTime: '5 min read',
    tags: ['Travel Tips'],
    sections: [
      { heading: 'Before You Fly', paragraphs: ['Check your ETA approval, ensure your passport matches the application, and keep accommodation details handy.'] },
      { heading: 'At the Border', paragraphs: ['Present your passport; ETA is verified electronically. Answer routine questions concisely and truthfully.'] }
    ],
    faq: [
      { question: 'Do I need to print the ETA?', answer: 'Not required, but it helps to carry the approval email as a backup.' }
    ],
    related: ['uk-eta-vs-standard-visa-differences', 'processing-times-uk-eta-what-to-expect']
  }
];

export type ResourcesIndex = typeof resources;
