/**
 * Input validation and sanitization utilities
 */

// Sanitize string input to prevent XSS attacks
export function sanitizeString(input: string | undefined): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 500); // Limit length
}

// Validate email format
export function validateEmail(email: string | undefined): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Validate phone number (basic validation)
export function validatePhone(phone: string | undefined): boolean {
  if (!phone) return false;
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.length >= 7 && phone.length <= 20;
}

// Validate bank account name
export function validateAccountName(name: string | undefined): boolean {
  if (!name) return false;
  const nameRegex = /^[a-zA-Z\s\-'.&]+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 100;
}

// Validate bank account number (basic validation)
export function validateAccountNumber(accountNumber: string | undefined): boolean {
  if (!accountNumber) return false;
  const accountRegex = /^[\d\-\s]+$/;
  return accountRegex.test(accountNumber) && accountNumber.length >= 8 && accountNumber.length <= 34;
}

// Validate bank name
export function validateBankName(bank: string | undefined): boolean {
  if (!bank) return false;
  return bank.length >= 2 && bank.length <= 100;
}

// Validate sermon title
export function validateSermonTitle(title: string | undefined): boolean {
  if (!title) return false;
  return title.length >= 3 && title.length <= 200;
}

// Validate Google Drive link
export function validateDriveLink(link: string | undefined): boolean {
  if (!link) return false;
  try {
    const url = new URL(link);
    return (
      url.hostname.includes('drive.google.com') ||
      url.hostname.includes('docs.google.com')
    );
  } catch {
    return false;
  }
}

// Validate file size (in bytes)
export function validateFileSize(
  sizeInBytes: number,
  maxSizeInMB: number = 10
): boolean {
  return sizeInBytes <= maxSizeInMB * 1024 * 1024;
}

// Validate image file type
export function validateImageType(mimeType: string | undefined): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(mimeType || '');
}

// Sanitize object (recursively)
export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
