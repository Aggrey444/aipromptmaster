import { FrameworkType, FormSelections } from '../types';

export function assemblePrompt(framework: FrameworkType, selections: FormSelections): string {
  if (framework === 'CLEAR') {
    return assembleCLEARPrompt(selections);
  } else if (framework === 'SAEALD') {
    return assembleSAEALDPrompt(selections);
  } else if (framework === 'SCENE') {
    return assembleSCENEPrompt(selections);
  }
  return '';
}

function cleanLabel(raw?: string): string {
  if (!raw) return '';
  return raw.replace(/^\d+\s*/, '').trim();
}

function getVal(selections: FormSelections, key: string) {
  const item = selections[key] || {};
  return {
    single: item.singleOption,
    multi: item.selectedOptions || [],
    text: item.customText,
    customOther: item.customOther,
    fileName: item.fileName,
  };
}

function getCombinedList(selections: FormSelections, key: string): string[] {
  const item = selections[key] || {};
  const items: string[] = [];
  
  if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
    item.selectedOptions.forEach(opt => {
      const c = cleanLabel(opt);
      if (c && !items.includes(c)) items.push(c);
    });
  }

  if (item.singleOption) {
    const c = cleanLabel(item.singleOption);
    if (c && !items.includes(c)) items.push(c);
  }

  if (item.customOther && item.customOther.trim()) {
    const c = item.customOther.trim();
    if (c && !items.includes(c)) items.push(c);
  }

  return items;
}

function assembleCLEARPrompt(selections: FormSelections): string {
  const parts: string[] = [];

  // 1. Context
  const purposes = getCombinedList(selections, 'c_purpose');
  const industries = getCombinedList(selections, 'c_industry');
  const audiences = getCombinedList(selections, 'c_audience');
  const goals = getCombinedList(selections, 'c_goal');
  const topic = getVal(selections, 'c_topic_details').text;
  const attachment = getVal(selections, 'c_attachment').fileName;

  let contextSentence = 'Create content';
  if (purposes.length > 0) contextSentence += ` for ${purposes.join(' and ')}`;
  if (industries.length > 0) contextSentence += ` in the ${industries.join(', ')} industry`;
  if (audiences.length > 0) contextSentence += ` targeted at ${audiences.join(', ')}`;
  if (goals.length > 0) contextSentence += ` with the primary goal to ${goals.join(' & ')}`;
  contextSentence += '.';
  parts.push(contextSentence);

  if (topic && topic.trim()) {
    parts.push(`Topic & Specific Background:\n"${topic.trim()}"`);
  }

  if (attachment) {
    parts.push(`Reference File Attached: ${attachment}. Refer to its contents and structure.`);
  }

  // 2. Length
  const lengths = getCombinedList(selections, 'l_length_type');
  const customWords = getVal(selections, 'l_custom_words').text;

  if (customWords && customWords.trim()) {
    parts.push(`Target Length: ${customWords.trim()}.`);
  } else if (lengths.length > 0) {
    parts.push(`Target Length: ${lengths.join(', ')}.`);
  }

  // 3. Examples
  const examples = getCombinedList(selections, 'e_examples');
  const sampleText = getVal(selections, 'e_sample_reference').text;

  if (examples.length > 0) {
    parts.push(`Examples to include/use: ${examples.join(', ')}.`);
  }
  if (sampleText && sampleText.trim()) {
    parts.push(`Reference Sample Phrasing:\n"${sampleText.trim()}"`);
  }

  // 4. Action
  const actions = getCombinedList(selections, 'a_action');
  const cta = getVal(selections, 'a_call_to_action').text;

  if (actions.length > 0) {
    parts.push(`Action Required: ${actions.join(', ')}.`);
  }
  if (cta && cta.trim()) {
    parts.push(`Call to Action: "${cta.trim()}".`);
  }

  // 5. Restrictions
  const styles = getCombinedList(selections, 'r_writing_style');
  const formats = getCombinedList(selections, 'r_output_format');
  const rules = getCombinedList(selections, 'r_rules');

  if (styles.length > 0) {
    parts.push(`Writing Style & Tone: ${styles.join(', ')}.`);
  }
  if (formats.length > 0) {
    parts.push(`Output Format: ${formats.join(', ')}.`);
  }
  if (rules.length > 0) {
    parts.push(`Rules & Negative Constraints: ${rules.join('; ')}.`);
  }

  return parts.join('\n\n');
}

function assembleSAEALDPrompt(selections: FormSelections): string {
  const parts: string[] = [];

  // 1. Subject
  const flyerTypes = getCombinedList(selections, 's_flyer_type');
  const mainFoci = getCombinedList(selections, 's_main_focus');
  const peopleAppear = getCombinedList(selections, 's_people_appear');
  const emotions = getCombinedList(selections, 's_emotion');

  let subjectSentence = `Design a high-quality ${flyerTypes.length > 0 ? flyerTypes.join('/') : 'flyer/graphic'}`;
  if (mainFoci.length > 0) subjectSentence += ` focusing on ${mainFoci.join(', ')}`;
  if (peopleAppear.length > 0 && !peopleAppear.some(p => p.toLowerCase() === 'no people')) {
    subjectSentence += `, featuring ${peopleAppear.join(', ')}`;
    if (emotions.length > 0) subjectSentence += ` with a ${emotions.join(', ')} expression`;
  }
  subjectSentence += '.';
  parts.push(subjectSentence);

  // 2. Action
  const purposes = getCombinedList(selections, 'a_purpose');
  const viewerActions = getCombinedList(selections, 'a_viewer_action');

  let actionSentence = '';
  if (purposes.length > 0) actionSentence += `Purpose: ${purposes.join(', ')}. `;
  if (viewerActions.length > 0) actionSentence += `Call to Action for Viewers: ${viewerActions.join(', ')}.`;
  if (actionSentence) parts.push(actionSentence.trim());

  // 3. Environment & Platform
  const platforms = getCombinedList(selections, 'e_platform');
  const orientations = getCombinedList(selections, 'e_orientation');

  let envSentence = '';
  if (orientations.length > 0) envSentence += `Format / Orientation: ${orientations.join(', ')}. `;
  if (platforms.length > 0) envSentence += `Target Platforms: ${platforms.join(', ')}.`;
  if (envSentence) parts.push(envSentence.trim());

  // 4. Art Style
  const styles = getCombinedList(selections, 'a_overall_style');
  const moods = getCombinedList(selections, 'a_colour_mood');

  let styleSentence = '';
  if (styles.length > 0) styleSentence += `Visual Style: ${styles.join(', ')}. `;
  if (moods.length > 0) styleSentence += `Colour Mood: ${moods.join(', ')}.`;
  if (styleSentence) parts.push(styleSentence.trim());

  // 5. Lighting
  const lightings = getCombinedList(selections, 'l_lighting_type');
  if (lightings.length > 0) parts.push(`Lighting Setup: ${lightings.join(', ')}.`);

  // 6. Details
  const companyName = getVal(selections, 'd_company_name').text;
  const phone = getVal(selections, 'd_phone').text;
  const email = getVal(selections, 'd_email').text;

  const brandColours = getCombinedList(selections, 'd_brand_colours');
  const includeItems = getCombinedList(selections, 'd_include_items');
  const imageQualities = getCombinedList(selections, 'd_image_quality');

  let detailsText = 'Flyer Contact & Brand Overlay Details:\n';
  if (companyName) detailsText += `• Company Name: ${companyName}\n`;
  if (phone) detailsText += `• Phone: ${phone}\n`;
  if (email) detailsText += `• Email: ${email}\n`;
  if (brandColours.length > 0) detailsText += `• Brand Colours: ${brandColours.join(', ')}\n`;
  if (includeItems.length > 0) detailsText += `• Elements to Include: ${includeItems.join(', ')}\n`;
  if (imageQualities.length > 0) detailsText += `• Resolution / Quality: ${imageQualities.join(', ')}\n`;

  parts.push(detailsText.trim());

  return parts.join('\n\n');
}

function assembleSCENEPrompt(selections: FormSelections): string {
  const parts: string[] = [];

  // 1. Story
  const videoTypes = getCombinedList(selections, 's_video_type');
  const purposes = getCombinedList(selections, 's_purpose');
  const storyArc = getVal(selections, 's_story_arc').text;

  let storySentence = `Create a video prompt for a ${videoTypes.length > 0 ? videoTypes.join('/') : 'video'}`;
  if (purposes.length > 0) storySentence += ` designed to ${purposes.join(', ')}`;
  storySentence += '.';
  parts.push(storySentence);

  if (storyArc && storyArc.trim()) {
    parts.push(`Storyline / Plot Arc:\n"${storyArc.trim()}"`);
  }

  // 2. Characters
  const characters = getCombinedList(selections, 'c_who_appears');
  const emotions = getCombinedList(selections, 'c_emotion');

  let charSentence = '';
  if (characters.length > 0) charSentence += `On-Screen Cast / Characters: ${characters.join(', ')}. `;
  if (emotions.length > 0) charSentence += `Emotional Tone: ${emotions.join(', ')}.`;
  if (charSentence) parts.push(charSentence.trim());

  // 3. Environment
  const environments = getCombinedList(selections, 'e_environment');
  if (environments.length > 0) parts.push(`Setting / Environment: ${environments.join(', ')}.`);

  // 4. Narration
  const narrationStyles = getCombinedList(selections, 'n_narration_style');
  const voices = getCombinedList(selections, 'n_voice');

  let audioSentence = '';
  if (narrationStyles.length > 0) audioSentence += `Narration Style: ${narrationStyles.join(', ')}. `;
  if (voices.length > 0) audioSentence += `Voice / Accent: ${voices.join(', ')}.`;
  if (audioSentence) parts.push(audioSentence.trim());

  // 5. Effects
  const effects = getCombinedList(selections, 'e_effects');
  if (effects.length > 0) parts.push(`Video Effects & Enhancements: ${effects.join(', ')}.`);

  return parts.join('\n\n');
}
