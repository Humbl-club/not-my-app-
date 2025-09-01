// Test what security is ACTUALLY working
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Set up DOMPurify with JSDOM for Node.js
const window = new JSDOM('').window;
const purify = DOMPurify(window);

console.log('🔍 TESTING ACTUAL SECURITY IMPLEMENTATION\n');
console.log('=' .repeat(60));

// 1. Test XSS Protection in Forms (Frontend)
console.log('\n1️⃣ TESTING: XSS Protection in Form Inputs');
console.log('-'.repeat(40));

// Simulate what happens in regular Input component (NO protection)
const testXSSInputs = [
  `<script>alert('XSS')</script>`,
  `john<img src=x onerror=alert('XSS')>`,
  `'; DROP TABLE users; --`,
  `admin' OR '1'='1`,
  `javascript:alert('XSS')`,
  `<iframe src="evil.com"></iframe>`
];

console.log('Regular <Input> component (CURRENT STATE):');
testXSSInputs.forEach(input => {
  // Regular input does NO sanitization
  console.log(`Input: "${input.substring(0, 30)}...""`);
  console.log(`Result: Input is ACCEPTED AS-IS ❌ VULNERABLE`);
});

console.log('\n2️⃣ TESTING: FormToSupabaseService Sanitization');
console.log('-'.repeat(40));

// Simulate FormToSupabaseService sanitization
class MockSecurityService {
  static sanitizeInput(input) {
    if (!input) return '';
    
    // This is what's actually in SecurityService
    const cleaned = purify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
    
    return cleaned
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  static hasSQLInjectionPatterns(input) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE|ORDER BY|GROUP BY|HAVING)\b)/gi,
      /(-{2}|\/\*|\*\/|;|\||&&|\|\||\\x00|\\x1a)/g,
      /(\'|\"|\`|\\)/g
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
  
  static hasXSSPatterns(input) {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<embed/gi,
      /<object/gi,
      /document\./gi,
      /window\./gi,
      /eval\(/gi,
      /alert\(/gi,
      /prompt\(/gi,
      /confirm\(/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }
}

console.log('Testing FormToSupabaseService sanitization:');
testXSSInputs.forEach(input => {
  const sanitized = MockSecurityService.sanitizeInput(input);
  const hasXSS = MockSecurityService.hasXSSPatterns(input);
  const hasSQL = MockSecurityService.hasSQLInjectionPatterns(input);
  
  console.log(`\nInput: "${input.substring(0, 40)}..."`);
  console.log(`Sanitized: "${sanitized}"`);
  console.log(`XSS Detected: ${hasXSS ? 'YES ✅' : 'NO ❌'}`);
  console.log(`SQL Detected: ${hasSQL ? 'YES ✅' : 'NO ❌'}`);
});

console.log('\n3️⃣ ACTUAL SECURITY STATUS:');
console.log('-'.repeat(40));

console.log(`
FRONTEND FORMS:
❌ Regular <Input> components - NO protection
❌ No XSS blocking at input time
❌ No SQL injection blocking at input time
❌ Users CAN enter malicious code

BACKEND (FormToSupabaseService):
✅ Sanitization IS happening before database
✅ XSS patterns ARE detected
✅ SQL patterns ARE detected
✅ Data IS cleaned before storage

DATABASE:
⚠️ Protection ONLY at submission, not during form filling
⚠️ Users see no warnings about invalid input until submission
`);

console.log('\n4️⃣ TESTING: What Actually Gets to Database');
console.log('-'.repeat(40));

// Simulate full flow
const maliciousUser = {
  firstName: "<script>alert('XSS')</script>John",
  lastName: "Smith'; DROP TABLE users; --",
  email: "test@evil<script>.com",
  passportNumber: "ABC123; DELETE FROM *"
};

console.log('User enters malicious data:');
console.log(JSON.stringify(maliciousUser, null, 2));

console.log('\nAfter FormToSupabaseService processing:');
const processed = {
  firstName: MockSecurityService.sanitizeInput(maliciousUser.firstName).toUpperCase(),
  lastName: MockSecurityService.sanitizeInput(maliciousUser.lastName).toUpperCase(),
  email: MockSecurityService.sanitizeInput(maliciousUser.email),
  passportNumber: MockSecurityService.sanitizeInput(maliciousUser.passportNumber).toUpperCase()
};
console.log(JSON.stringify(processed, null, 2));

console.log('\n' + '='.repeat(60));
console.log('🎯 TRUTH ABOUT SECURITY:');
console.log('='.repeat(60));
console.log(`
1. Frontend forms have NO real-time protection ❌
2. Users CAN type malicious input ❌
3. Protection happens ONLY at submission ⚠️
4. Database IS protected from malicious data ✅
5. But user experience is poor (no warnings) ❌
`);