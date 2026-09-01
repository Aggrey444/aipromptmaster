import { UserProfile, PromptItem, ContentTemplateItem, PaymentRecord } from '../types';
import { DEFAULT_TEMPLATES } from '../data/templatesData';

const USER_KEY = 'prompt_master_user_profile';
const SAVED_PROMPTS_KEY = 'prompt_master_saved_prompts';
const SAVED_TEMPLATES_KEY = 'prompt_master_saved_templates';
const DRAFT_PROMPTS_KEY = 'prompt_master_draft_prompts';
const PAID_RECORDS_KEY = 'prompt_master_paid_records';
const CLEANUP_KEY = 'prompt_master_revoked_unverified_v2';

// Revoke all unverified paid statuses
export function revokeAllPaidStatuses(): void {
  try {
    localStorage.removeItem(PAID_RECORDS_KEY);
    const data = localStorage.getItem(USER_KEY);
    if (data) {
      const user: UserProfile = JSON.parse(data);
      user.isPaid = false;
      user.paymentRef = undefined;
      user.paymentDate = undefined;
      user.paymentMethod = undefined;
      user.amountPaid = undefined;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Error revoking paid statuses:', err);
  }
}

// Auto-run revocation on app load
if (typeof window !== 'undefined' && !localStorage.getItem(CLEANUP_KEY)) {
  revokeAllPaidStatuses();
  localStorage.setItem(CLEANUP_KEY, 'true');
}

// Load initial user state
export function getUserProfile(): UserProfile | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    const user: UserProfile = JSON.parse(data);
    // Check if email has been paid in payment records
    if (user && user.email) {
      const isPaid = isEmailPaid(user.email);
      user.isPaid = isPaid;
      if (isPaid) {
        const paymentRecord = getPaymentRecord(user.email);
        if (paymentRecord) {
          user.paymentRef = paymentRecord.transRefNo;
          user.paymentDate = paymentRecord.paymentDate;
          user.paymentMethod = paymentRecord.mobileNetwork || 'Interpay';
        }
      }
    }
    return user;
  } catch {
    return null;
  }
}

// Payment Storage Functions
export function getPaidRecords(): PaymentRecord[] {
  try {
    const data = localStorage.getItem(PAID_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isEmailPaid(email: string): boolean {
  if (!email) return false;
  const records = getPaidRecords();
  return records.some(r => r.email.trim().toLowerCase() === email.trim().toLowerCase() && r.status === 'PAID');
}

export function getPaymentRecord(email: string): PaymentRecord | undefined {
  if (!email) return undefined;
  const records = getPaidRecords();
  return records.find(r => r.email.trim().toLowerCase() === email.trim().toLowerCase() && r.status === 'PAID');
}

export function recordSuccessfulPayment(payment: PaymentRecord): void {
  const current = getPaidRecords();
  const existingIndex = current.findIndex(r => r.email.trim().toLowerCase() === payment.email.trim().toLowerCase());
  let updated: PaymentRecord[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = payment;
  } else {
    updated = [payment, ...current];
  }
  localStorage.setItem(PAID_RECORDS_KEY, JSON.stringify(updated));

  // Also update current user profile if logged in
  const currentUser = getUserProfile();
  if (currentUser && currentUser.email.trim().toLowerCase() === payment.email.trim().toLowerCase()) {
    currentUser.isPaid = true;
    currentUser.paymentDate = payment.paymentDate;
    currentUser.paymentRef = payment.transRefNo;
    currentUser.paymentMethod = payment.mobileNetwork || 'Interpay';
    saveUserProfile(currentUser);
  }
}

export function saveUserProfile(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (err) {
    console.error('Error saving user profile:', err);
  }
}

// Saved Prompts
export function getSavedPrompts(): PromptItem[] {
  try {
    const data = localStorage.getItem(SAVED_PROMPTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePromptItem(prompt: PromptItem): PromptItem[] {
  const current = getSavedPrompts();
  const index = current.findIndex(p => p.id === prompt.id);
  let updated: PromptItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...prompt, updatedDate: new Date().toISOString() };
  } else {
    updated = [prompt, ...current];
  }
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(updated));
  return updated;
}

export function deletePromptItem(id: string): PromptItem[] {
  const current = getSavedPrompts();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(updated));
  return updated;
}

export function togglePromptFavourite(id: string): PromptItem[] {
  const current = getSavedPrompts();
  const updated = current.map(p => {
    if (p.id === id) {
      return { ...p, isFavourite: !p.isFavourite };
    }
    return p;
  });
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(updated));
  return updated;
}

// Saved Templates
export function getSavedTemplates(): ContentTemplateItem[] {
  try {
    const data = localStorage.getItem(SAVED_TEMPLATES_KEY);
    if (!data) {
      localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES));
      return DEFAULT_TEMPLATES;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

export function saveTemplateItem(template: ContentTemplateItem): ContentTemplateItem[] {
  const current = getSavedTemplates();
  const index = current.findIndex(t => t.id === template.id);
  let updated: ContentTemplateItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...template, updatedDate: new Date().toISOString() };
  } else {
    updated = [template, ...current];
  }
  localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteTemplateItem(id: string): ContentTemplateItem[] {
  const current = getSavedTemplates();
  const updated = current.filter(t => t.id !== id);
  localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
}

// Temporary Drafts
export function saveDraft(key: string, data: any): void {
  try {
    localStorage.setItem(`${DRAFT_PROMPTS_KEY}_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save draft:', err);
  }
}

export function getDraft(key: string): any {
  try {
    const data = localStorage.getItem(`${DRAFT_PROMPTS_KEY}_${key}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearDraft(key: string): void {
  try {
    localStorage.removeItem(`${DRAFT_PROMPTS_KEY}_${key}`);
  } catch {}
}
