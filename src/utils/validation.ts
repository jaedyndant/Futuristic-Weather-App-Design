// Input validation utilities

export const validateEmail = (email: string): boolean => {
  try {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  } catch {
    return false;
  }
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeString = (input: string): string => {
  try {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>\"'&]/g, '');
  } catch {
    return '';
  }
};

export const validateNumber = (value: any, min?: number, max?: number): boolean => {
  try {
    if (value === null || value === undefined || value === '') return false;
    const num = Number(value);
    if (isNaN(num) || !isFinite(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: any): boolean => {
  try {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  } catch {
    return false;
  }
};

export const validateLength = (value: string, min: number, max?: number): boolean => {
  try {
    if (typeof value !== 'string') return false;
    if (value.length < min) return false;
    if (max !== undefined && value.length > max) return false;
    return true;
  } catch {
    return false;
  }
};