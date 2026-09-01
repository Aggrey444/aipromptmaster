export type FrameworkType = 'CLEAR' | 'SAEALD' | 'SCENE';

export type InputType = 'checkbox' | 'radio' | 'dropdown' | 'text' | 'textarea' | 'file';

export interface Option {
  id: string;
  label: string;
  description?: string;
  defaultSelected?: boolean;
}

export interface Question {
  id: string;
  sectionLetter: string;
  questionText: string;
  inputType: InputType;
  required?: boolean;
  options?: Option[];
  placeholder?: string;
  description?: string;
  allowCustomOther?: boolean;
  helperTip?: string;
}

export interface FrameworkSection {
  letter: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface FrameworkDefinition {
  id: FrameworkType;
  name: string;
  acronym: string;
  tagline: string;
  description: string;
  examples: string[];
  sections: FrameworkSection[];
  color: {
    primary: string;
    lightBg: string;
    border: string;
    badgeBg: string;
    text: string;
  };
}

export type SelectionValue = {
  selectedOptions?: string[]; // Array of option labels or IDs
  singleOption?: string;      // For radio / dropdown
  customText?: string;        // Text input / textarea / custom "Other"
  customOther?: string;       // Custom "Other" entry
  fileName?: string;          // Attached file name
  fileData?: string;          // Attached file base64 or preview
};

export type FormSelections = Record<string, SelectionValue>;

export interface PromptItem {
  id: string;
  userId?: string;
  title: string;
  framework: FrameworkType;
  selections: FormSelections;
  generatedPrompt: string;
  editedPrompt: string;
  completenessScore: number;
  missingFields: string[];
  isFavourite?: boolean;
  isDraft?: boolean;
  createdDate: string;
  updatedDate: string;
  contentType?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  placeholder: string;
}

export interface ContentTemplateItem {
  id: string;
  userId?: string;
  name: string;
  category: string;
  frameworkType?: FrameworkType;
  sections: TemplateSection[];
  createdDate: string;
  updatedDate: string;
  isCustom?: boolean;
  isFavourite?: boolean;
}

export interface UserProfile {
  id: string;
  googleId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  signedInDate: string;
  lastActiveDate: string;
  isPaid?: boolean;
  paymentDate?: string;
  paymentRef?: string;
  paymentMethod?: string;
  amountPaid?: number;
}

export interface PaymentRecord {
  email: string;
  fullName: string;
  amount: number;
  currency: string;
  orderId: string;
  transRefNo: string;
  mobileNumber: string;
  mobileNetwork: string;
  paymentDate: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
}

export interface QualityCheckResult {
  score: number;
  missingFields: string[];
  feedbackMessages: string[];
  passedChecksCount: number;
  totalChecksCount: number;
}
