import { ContentTemplateItem } from '../types';

export const DEFAULT_TEMPLATES: ContentTemplateItem[] = [
  {
    id: 'tmpl-email-1',
    name: 'Standard Business Email / Newsletter',
    category: 'Email',
    frameworkType: 'CLEAR',
    sections: [
      { id: 'sec-1', title: 'Subject Line & Preheader', placeholder: 'Compelling, concise subject line and preheader text.' },
      { id: 'sec-2', title: 'Greeting & Personalization', placeholder: 'Friendly greeting addressing the recipient by name or team.' },
      { id: 'sec-3', title: 'Context & Hook', placeholder: 'Brief explanation of why you are reaching out or opening news.' },
      { id: 'sec-4', title: 'Main Value Proposition / Core Message', placeholder: '2-3 paragraphs explaining the offer, update, or key information.' },
      { id: 'sec-5', title: 'Call to Action (CTA)', placeholder: 'Clear single action button or link (e.g. Schedule Call, Buy Now).' },
      { id: 'sec-6', title: 'Professional Sign-off & Contact Details', placeholder: 'Warm closing, sender name, title, and contact info.' }
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: 'tmpl-proposal-1',
    name: 'Executive Business Proposal',
    category: 'Proposal',
    frameworkType: 'CLEAR',
    sections: [
      { id: 'sec-1', title: 'Title Page & Header', placeholder: 'Project Title, Prepared For, Prepared By, Date.' },
      { id: 'sec-2', title: 'Executive Summary', placeholder: 'High-level snapshot of the problem, proposed solution, and value.' },
      { id: 'sec-3', title: 'Background & Problem Statement', placeholder: 'Detailed understanding of the client’s current challenges.' },
      { id: 'sec-4', title: 'Objectives & Scope of Work', placeholder: 'Specific goals, key deliverables, and boundaries.' },
      { id: 'sec-5', title: 'Deliverables & Methodology', placeholder: 'Step-by-step approach, tools, and milestone outcomes.' },
      { id: 'sec-6', title: 'Timeline & Project Roadmap', placeholder: 'Phases, start/end dates, and milestone reviews.' },
      { id: 'sec-7', title: 'Budget & Commercial Investment', placeholder: 'Pricing breakdown, payment schedules, and terms.' },
      { id: 'sec-8', title: 'Conclusion & Next Steps / Acceptance', placeholder: 'Summary call to action, contact info, signature lines.' }
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: 'tmpl-report-1',
    name: 'Structured Technical / Executive Report',
    category: 'Report',
    frameworkType: 'CLEAR',
    sections: [
      { id: 'sec-1', title: 'Report Title & Overview', placeholder: 'Title, Author, Date, Target Audience.' },
      { id: 'sec-2', title: 'Executive Summary', placeholder: 'Key findings and primary recommendations in brief.' },
      { id: 'sec-3', title: 'Introduction & Context', placeholder: 'Background context, scope of research or project.' },
      { id: 'sec-4', title: 'Methodology & Data Sources', placeholder: 'How data was gathered and analyzed.' },
      { id: 'sec-5', title: 'Findings & Key Results', placeholder: 'Detailed data analysis, metrics, and evidence.' },
      { id: 'sec-6', title: 'Strategic Recommendations', placeholder: 'Actionable steps based on findings.' },
      { id: 'sec-7', title: 'Conclusion', placeholder: 'Final wrap-up summary.' }
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: 'tmpl-social-1',
    name: 'High-Engagement Social Media Post',
    category: 'Social Media',
    frameworkType: 'CLEAR',
    sections: [
      { id: 'sec-1', title: 'Hook / Headline', placeholder: 'Attention-grabbing first line (question or bold statement).' },
      { id: 'sec-2', title: 'Main Story / Insight', placeholder: 'Relatable story, key lesson, or problem explanation.' },
      { id: 'sec-3', title: 'Key Takeaways / Bullet Points', placeholder: '3-5 scannable tips or actionable advice.' },
      { id: 'sec-4', title: 'Primary Call to Action (CTA)', placeholder: 'Prompt comment, click link, or share with a colleague.' },
      { id: 'sec-5', title: 'Relevant Hashtags & Tagging', placeholder: '#Business #AI #Innovation #Marketing' }
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: 'tmpl-flyer-1',
    name: 'Promotional Flyer Content Structure',
    category: 'Flyer',
    frameworkType: 'SAEALD',
    sections: [
      { id: 'sec-1', title: 'Main Catchy Headline', placeholder: 'Bold central headline (e.g., ANNUAL TECH SUMMIT 2026).' },
      { id: 'sec-2', title: 'Sub-headline / Value Hook', placeholder: 'Supporting sentence describing the main benefit or offer.' },
      { id: 'sec-3', title: 'Key Highlights / Features', placeholder: '3-4 bullet points highlighting speakers, agenda, or discounts.' },
      { id: 'sec-4', title: 'Main Visual Placeholder', placeholder: 'Description of hero image/subject placement.' },
      { id: 'sec-5', title: 'Offer & Time Limit', placeholder: 'Special price, early bird discount, or event date/time.' },
      { id: 'sec-6', title: 'Call to Action Button', placeholder: 'Prominent CTA text (e.g. REGISTER NOW / BUY TICKETS).' },
      { id: 'sec-7', title: 'Contact Details & QR Code Zone', placeholder: 'Phone, Email, Website URL, Social handles, Physical Address.' }
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  },
  {
    id: 'tmpl-video-1',
    name: 'Commercial & Promotional Video Storyboard',
    category: 'Video',
    frameworkType: 'SCENE',
    sections: [
      { id: 'sec-1', title: 'Scene 1: Opening Hook (0 - 5s)', placeholder: 'Visual: Frustrated user facing challenge. Audio: Intriguing opening question.' },
      { id: 'sec-2', title: 'Scene 2: Problem Agitation (5 - 10s)', placeholder: 'Visual: Close-up of chaos/delay. Audio: Relatable problem explanation.' },
      { id: 'sec-3', title: 'Scene 3: Solution Introduction (10 - 20s)', placeholder: 'Visual: Product reveal, clean UI motion graphics. Audio: Upbeat voiceover.' },
      { id: 'sec-4', title: 'Scene 4: Key Benefits & Social Proof (20 - 25s)', placeholder: 'Visual: Happy team using product, metric callouts. Audio: Benefit explanation.' },
      { id: 'sec-5', title: 'Scene 5: Closing & CTA Outro (25 - 30s)', placeholder: 'Visual: Animated company logo, URL, and phone number. Audio: Strong final CTA.' }
    ],
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  }
];
