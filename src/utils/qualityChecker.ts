import { FrameworkType, FormSelections, QualityCheckResult } from '../types';

export function calculateQualityScore(framework: FrameworkType, selections: FormSelections): QualityCheckResult {
  if (framework === 'CLEAR') {
    return checkCLEAR(selections);
  } else if (framework === 'SAEALD') {
    return checkSAEALD(selections);
  } else if (framework === 'SCENE') {
    return checkSCENE(selections);
  }

  return {
    score: 100,
    missingFields: [],
    feedbackMessages: ['Prompt structure complete.'],
    passedChecksCount: 1,
    totalChecksCount: 1,
  };
}

function hasValue(selections: FormSelections, key: string): boolean {
  const item = selections[key];
  if (!item) return false;
  if (item.singleOption && item.singleOption.trim() !== '') return true;
  if (item.selectedOptions && item.selectedOptions.length > 0) return true;
  if (item.customText && item.customText.trim() !== '') return true;
  if (item.customOther && item.customOther.trim() !== '') return true;
  if (item.fileName && item.fileName.trim() !== '') return true;
  return false;
}

function checkCLEAR(selections: FormSelections): QualityCheckResult {
  const checks = [
    { key: 'c_purpose', label: 'Purpose', tip: 'Select a purpose (e.g., Marketing, Report Writing).' },
    { key: 'c_industry', label: 'Industry', tip: 'Select an industry (e.g., Technology, Healthcare).' },
    { key: 'c_audience', label: 'Audience', tip: 'Identify your target audience (e.g., Professionals, Students).' },
    { key: 'c_goal', label: 'Goal', tip: 'Select a primary goal (e.g., Inform, Persuade).' },
    { key: 'l_length_type', label: 'Length', tip: 'Choose a target length or detail level.' },
    { key: 'a_action', label: 'Action', tip: 'Choose an action for the AI to take (e.g., Create, Explain).' }
  ];

  let passed = 0;
  const missingFields: string[] = [];
  const feedbackMessages: string[] = [];

  checks.forEach(check => {
    if (hasValue(selections, check.key) || (check.key === 'l_length_type' && hasValue(selections, 'l_custom_words'))) {
      passed++;
    } else {
      missingFields.push(check.label);
      feedbackMessages.push(check.tip);
    }
  });

  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  return {
    score,
    missingFields,
    feedbackMessages,
    passedChecksCount: passed,
    totalChecksCount: total,
  };
}

function checkSAEALD(selections: FormSelections): QualityCheckResult {
  const checks = [
    { key: 's_flyer_type', label: 'Flyer type', tip: 'Select flyer type (e.g., Product Promotion, Event Announcement).' },
    { key: 's_main_focus', label: 'Main focus', tip: 'Specify main focus (e.g., Person, Product, Technology).' },
    { key: 'a_purpose', label: 'Purpose', tip: 'Select flyer purpose (e.g., Sell a product, Advertise a service).' },
    { key: 'a_viewer_action', label: 'Viewer action / Call to action', tip: 'Select what viewers should do (e.g., Call us, Register).' },
    { key: 'e_orientation', label: 'Flyer orientation', tip: 'Select orientation (e.g., Square, Portrait, Story).' },
    { key: 'a_overall_style', label: 'Overall visual style', tip: 'Select overall style (e.g., Corporate, Modern, Luxury).' },
    { key: 'l_lighting_type', label: 'Lighting type', tip: 'Select lighting setup (e.g., Bright Studio, Soft Light).' }
  ];

  let passed = 0;
  const missingFields: string[] = [];
  const feedbackMessages: string[] = [];

  checks.forEach(check => {
    if (hasValue(selections, check.key)) {
      passed++;
    } else {
      missingFields.push(check.label);
      feedbackMessages.push(check.tip);
    }
  });

  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  return {
    score,
    missingFields,
    feedbackMessages,
    passedChecksCount: passed,
    totalChecksCount: total,
  };
}

function checkSCENE(selections: FormSelections): QualityCheckResult {
  const checks = [
    { key: 's_video_type', label: 'Video type', tip: 'Select a video category (e.g., Company Introduction, Product Advertisement).' },
    { key: 's_purpose', label: 'Purpose', tip: 'Select video purpose (e.g., Educate, Sell, Inform).' },
    { key: 'c_who_appears', label: 'Who appears', tip: 'Select who appears in the video.' },
    { key: 'e_environment', label: 'Environment', tip: 'Select where the story happens.' },
    { key: 'n_narration_style', label: 'Narration style', tip: 'Select narration style.' },
    { key: 'e_effects', label: 'Effects', tip: 'Select video effects.' }
  ];

  let passed = 0;
  const missingFields: string[] = [];
  const feedbackMessages: string[] = [];

  checks.forEach(check => {
    if (hasValue(selections, check.key)) {
      passed++;
    } else {
      missingFields.push(check.label);
      feedbackMessages.push(check.tip);
    }
  });

  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  return {
    score,
    missingFields,
    feedbackMessages,
    passedChecksCount: passed,
    totalChecksCount: total,
  };
}
