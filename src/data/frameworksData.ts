import { FrameworkDefinition } from '../types';

export const FRAMEWORKS_DATA: Record<'CLEAR' | 'SAEALD', FrameworkDefinition> & { SCENE: FrameworkDefinition } = {
  CLEAR: {
    id: 'CLEAR',
    name: 'CLEAR Framework',
    acronym: 'C L E A R',
    tagline: 'Text Generation Framework',
    description: 'Structure text generation for emails, reports, proposals, business plans, social media posts, SOPs, research, and marketing copy.',
    examples: [
      'Emails',
      'Reports',
      'Proposals',
      'Business Plans',
      'Social Media Posts',
      'SOPs',
      'Research',
      'Marketing Copy'
    ],
    color: {
      primary: 'indigo-600',
      lightBg: 'indigo-50/50',
      border: 'indigo-200',
      badgeBg: 'indigo-100',
      text: 'indigo-900',
    },
    sections: [
      {
        letter: 'C',
        name: 'Context',
        description: 'What do you want the AI to create? Tells the AI why you need content and who it is for.',
        questions: [
          {
            id: 'c_purpose',
            sectionLetter: 'C',
            questionText: 'Purpose (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'p01', label: '01 Learn' },
              { id: 'p02', label: '02 Teach' },
              { id: 'p03', label: '03 Research' },
              { id: 'p04', label: '04 Marketing' },
              { id: 'p05', label: '05 Sales' },
              { id: 'p06', label: '06 Business' },
              { id: 'p07', label: '07 Customer Service' },
              { id: 'p08', label: '08 Social Media' },
              { id: 'p09', label: '09 Content Creation' },
              { id: 'p10', label: '10 Proposal Writing' },
              { id: 'p11', label: '11 Report Writing' },
              { id: 'p12', label: '12 Resume/CV' },
              { id: 'p13', label: '13 Documentation' },
              { id: 'p14', label: '14 Software Development' },
              { id: 'p15', label: '15 AI Prompt Engineering' },
              { id: 'p16', label: '16 Grant Writing' },
              { id: 'p17', label: '17 Book Writing' },
              { id: 'p18', label: '18 Presentation' },
              { id: 'p19', label: '19 Training Material' },
              { id: 'p20', label: '20 Other' }
            ]
          },
          {
            id: 'c_industry',
            sectionLetter: 'C',
            questionText: 'Industry (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'i21', label: '21 Technology' },
              { id: 'i22', label: '22 Healthcare' },
              { id: 'i23', label: '23 Education' },
              { id: 'i24', label: '24 Agriculture' },
              { id: 'i25', label: '25 Finance' },
              { id: 'i26', label: '26 Real Estate' },
              { id: 'i27', label: '27 Hospitality' },
              { id: 'i28', label: '28 Travel' },
              { id: 'i29', label: '29 NGO' },
              { id: 'i30', label: '30 Government' },
              { id: 'i31', label: '31 Manufacturing' },
              { id: 'i32', label: '32 Retail' },
              { id: 'i33', label: '33 Church' },
              { id: 'i34', label: '34 Logistics' },
              { id: 'i35', label: '35 Insurance' },
              { id: 'i36', label: '36 Legal' },
              { id: 'i37', label: '37 Other' }
            ]
          },
          {
            id: 'c_audience',
            sectionLetter: 'C',
            questionText: 'Audience (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'a41', label: '41 Beginners' },
              { id: 'a42', label: '42 Students' },
              { id: 'a43', label: '43 Professionals' },
              { id: 'a44', label: '44 Business Owners' },
              { id: 'a45', label: '45 CEOs' },
              { id: 'a46', label: '46 Employees' },
              { id: 'a47', label: '47 Customers' },
              { id: 'a48', label: '48 Investors' },
              { id: 'a49', label: '49 Government Officials' },
              { id: 'a50', label: '50 Church Members' },
              { id: 'a51', label: '51 Children' },
              { id: 'a52', label: '52 Teenagers' },
              { id: 'a53', label: '53 General Public' },
              { id: 'a54', label: '54 Experts' },
              { id: 'a55', label: '55 Other' }
            ]
          },
          {
            id: 'c_goal',
            sectionLetter: 'C',
            questionText: 'Goal (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'g61', label: '61 Inform' },
              { id: 'g62', label: '62 Educate' },
              { id: 'g63', label: '63 Persuade' },
              { id: 'g64', label: '64 Sell' },
              { id: 'g65', label: '65 Explain' },
              { id: 'g66', label: '66 Train' },
              { id: 'g67', label: '67 Inspire' },
              { id: 'g68', label: '68 Entertain' },
              { id: 'g69', label: '69 Solve a problem' },
              { id: 'g70', label: '70 Other' }
            ]
          },
          {
            id: 'c_topic_details',
            sectionLetter: 'C',
            questionText: 'Topic or specific background information:',
            inputType: 'textarea',
            placeholder: 'Enter key details, facts, or specific background context...'
          },
          {
            id: 'c_attachment',
            sectionLetter: 'C',
            questionText: 'Reference Document / File Upload (optional):',
            inputType: 'file'
          }
        ]
      },
      {
        letter: 'L',
        name: 'Length',
        description: 'How detailed should the response be?',
        questions: [
          {
            id: 'l_length_type',
            sectionLetter: 'L',
            questionText: 'Choose one or more',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'l81', label: '81 One sentence' },
              { id: 'l82', label: '82 One paragraph' },
              { id: 'l83', label: '83 Short' },
              { id: 'l84', label: '84 Medium' },
              { id: 'l85', label: '85 Long' },
              { id: 'l86', label: '86 Detailed' },
              { id: 'l87', label: '87 Comprehensive' },
              { id: 'l88', label: '88 Step-by-step Guide' },
              { id: 'l89', label: '89 Chapter' },
              { id: 'l90', label: '90 Book' }
            ]
          },
          {
            id: 'l_custom_words',
            sectionLetter: 'L',
            questionText: 'Custom word count or target length limit:',
            inputType: 'text',
            placeholder: 'e.g., Exactly 300 words or 3 pages'
          }
        ]
      },
      {
        letter: 'E',
        name: 'Examples',
        description: 'How should the AI write?',
        questions: [
          {
            id: 'e_examples',
            sectionLetter: 'E',
            questionText: 'Choose any that apply',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'ex101', label: '101 No examples' },
              { id: 'ex102', label: '102 One example' },
              { id: 'ex103', label: '103 Multiple examples' },
              { id: 'ex104', label: '104 Real-life example' },
              { id: 'ex105', label: '105 Business example' },
              { id: 'ex106', label: '106 Marketing example' },
              { id: 'ex107', label: '107 Case study' },
              { id: 'ex108', label: '108 Story' },
              { id: 'ex109', label: '109 Analogy' },
              { id: 'ex110', label: '110 Template' },
              { id: 'ex111', label: '111 Sample document' },
              { id: 'ex112', label: '112 Code example' }
            ]
          },
          {
            id: 'e_sample_reference',
            sectionLetter: 'E',
            questionText: 'Sample text to emulate (optional):',
            inputType: 'textarea',
            placeholder: 'Paste a reference sample or example text here...'
          }
        ]
      },
      {
        letter: 'A',
        name: 'Action',
        description: 'What should the AI do?',
        questions: [
          {
            id: 'a_action',
            sectionLetter: 'A',
            questionText: 'Choose one or more',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'act121', label: '121 Explain' },
              { id: 'act122', label: '122 Rewrite' },
              { id: 'act123', label: '123 Improve' },
              { id: 'act124', label: '124 Expand' },
              { id: 'act125', label: '125 Summarize' },
              { id: 'act126', label: '126 Create' },
              { id: 'act127', label: '127 Analyse' },
              { id: 'act128', label: '128 Compare' },
              { id: 'act129', label: '129 Brainstorm' },
              { id: 'act130', label: '130 Translate' },
              { id: 'act131', label: '131 Teach' },
              { id: 'act132', label: '132 Critique' },
              { id: 'act133', label: '133 Design' },
              { id: 'act134', label: '134 Plan' },
              { id: 'act135', label: '135 Generate ideas' },
              { id: 'act136', label: '136 Create SOP' },
              { id: 'act137', label: '137 Create Framework' },
              { id: 'act138', label: '138 Write Code' },
              { id: 'act139', label: '139 Debug Code' },
              { id: 'act140', label: '140 Other' }
            ]
          },
          {
            id: 'a_call_to_action',
            sectionLetter: 'A',
            questionText: 'Specific Call to Action (CTA):',
            inputType: 'text',
            placeholder: 'e.g., Visit booking link, reply to email, book consultation...'
          }
        ]
      },
      {
        letter: 'R',
        name: 'Restrictions',
        description: 'How should the AI respond?',
        questions: [
          {
            id: 'r_writing_style',
            sectionLetter: 'R',
            questionText: 'Writing Style (Choose any that apply)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'ws141', label: '141 Professional' },
              { id: 'ws142', label: '142 Friendly' },
              { id: 'ws143', label: '143 Formal' },
              { id: 'ws144', label: '144 Conversational' },
              { id: 'ws145', label: '145 Executive' },
              { id: 'ws146', label: '146 Technical' },
              { id: 'ws147', label: '147 Academic' },
              { id: 'ws148', label: '148 Beginner Friendly' },
              { id: 'ws149', label: '149 Persuasive' },
              { id: 'ws150', label: '150 Inspirational' }
            ]
          },
          {
            id: 'r_output_format',
            sectionLetter: 'R',
            questionText: 'Output Format (Choose any that apply)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'of151', label: '151 Paragraphs' },
              { id: 'of152', label: '152 Bullet Points' },
              { id: 'of153', label: '153 Numbered List' },
              { id: 'of154', label: '154 Table' },
              { id: 'of155', label: '155 Markdown' },
              { id: 'of156', label: '156 JSON' },
              { id: 'of157', label: '157 HTML' },
              { id: 'of158', label: '158 Microsoft Word' },
              { id: 'of159', label: '159 PowerPoint' },
              { id: 'of160', label: '160 Excel' }
            ]
          },
          {
            id: 'r_rules',
            sectionLetter: 'R',
            questionText: 'Rules (Choose any that apply)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'rl161', label: '161 No Jargon' },
              { id: 'rl162', label: '162 No Repetition' },
              { id: 'rl163', label: '163 No Fluff' },
              { id: 'rl164', label: '164 No Assumptions' },
              { id: 'rl165', label: '165 Cite Sources' },
              { id: 'rl166', label: '166 Simple English' },
              { id: 'rl167', label: '167 Practical Examples Only' },
              { id: 'rl168', label: '168 Actionable Advice Only' },
              { id: 'rl169', label: '169 Do Not Invent Information' },
              { id: 'rl170', label: '170 Other' }
            ]
          }
        ]
      }
    ]
  },
  SAEALD: {
    id: 'SAEALD',
    name: 'SAEALD Framework',
    acronym: 'S A E A L D',
    tagline: 'Image & Flyer Planning Worksheet',
    description: 'Structure prompts for flyers, posters, Facebook ads, logos, book covers, brochures, and social media graphics.',
    examples: [
      'Flyers',
      'Posters',
      'Facebook Ads',
      'Logos',
      'Book Covers',
      'Brochures',
      'Social Media Graphics'
    ],
    color: {
      primary: 'emerald-600',
      lightBg: 'emerald-50/50',
      border: 'emerald-200',
      badgeBg: 'emerald-100',
      text: 'emerald-900',
    },
    sections: [
      {
        letter: 'S',
        name: 'Subject',
        description: 'What should appear on the visual?',
        questions: [
          {
            id: 's_flyer_type',
            sectionLetter: 'S',
            questionText: 'What type of flyer are you creating? (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'ft_prod', label: 'Product Promotion' },
              { id: 'ft_serv', label: 'Service Advertisement' },
              { id: 'ft_comp', label: 'Company Introduction' },
              { id: 'ft_event', label: 'Event Announcement' },
              { id: 'ft_rec', label: 'Recruitment' },
              { id: 'ft_train', label: 'Training Advertisement' },
              { id: 'ft_disc', label: 'Discount/Sale' },
              { id: 'ft_test', label: 'Customer Testimonial' },
              { id: 'ft_hol', label: 'Holiday Greeting' },
              { id: 'ft_aware', label: 'Awareness Campaign' },
              { id: 'ft_thank', label: 'Thank You Message' },
              { id: 'ft_other', label: 'Other' }
            ]
          },
          {
            id: 's_main_focus',
            sectionLetter: 'S',
            questionText: 'Who is the main focus? (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'mf_person', label: 'A person' },
              { id: 'mf_team', label: 'Team of people' },
              { id: 'mf_prod', label: 'Product' },
              { id: 'mf_bldg', label: 'Building/Office' },
              { id: 'mf_tech', label: 'Technology' },
              { id: 'mf_laptop', label: 'Computer/Laptop' },
              { id: 'mf_mobile', label: 'Mobile Phone' },
              { id: 'mf_net', label: 'Network Equipment' },
              { id: 'mf_illus', label: 'Illustration' },
              { id: 'mf_logo', label: 'Logo only' }
            ]
          },
          {
            id: 's_people_appear',
            sectionLetter: 'S',
            questionText: 'Should people appear? (Select any)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'pa_no', label: 'No people' },
              { id: 'pa_one', label: 'One person' },
              { id: 'pa_small', label: 'Small team' },
              { id: 'pa_div', label: 'Diverse professionals' },
              { id: 'pa_cust', label: 'Customers' },
              { id: 'pa_owner', label: 'Business owner' }
            ]
          },
          {
            id: 's_emotion',
            sectionLetter: 'S',
            questionText: 'What emotion should people have? (Select any)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'em_happy', label: 'Happy' },
              { id: 'em_conf', label: 'Confident' },
              { id: 'em_prof', label: 'Professional' },
              { id: 'em_friend', label: 'Friendly' },
              { id: 'em_excite', label: 'Excited' },
              { id: 'em_serious', label: 'Serious' },
              { id: 'em_inspire', label: 'Inspirational' }
            ]
          }
        ]
      },
      {
        letter: 'A',
        name: 'Action',
        description: 'What message should the flyer communicate?',
        questions: [
          {
            id: 'a_purpose',
            sectionLetter: 'A',
            questionText: 'Purpose (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'ap_sell', label: 'Sell a product' },
              { id: 'ap_serv', label: 'Advertise a service' },
              { id: 'ap_staff', label: 'Recruit staff' },
              { id: 'ap_invite', label: 'Invite people' },
              { id: 'ap_brand', label: 'Build brand awareness' },
              { id: 'ap_edu', label: 'Educate' },
              { id: 'ap_celeb', label: 'Celebrate' },
              { id: 'ap_contact', label: 'Encourage people to contact us' }
            ]
          },
          {
            id: 'a_viewer_action',
            sectionLetter: 'A',
            questionText: 'What should viewers do? (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'va_call', label: 'Call us' },
              { id: 'va_wa', label: 'WhatsApp us' },
              { id: 'va_email', label: 'Email us' },
              { id: 'va_office', label: 'Visit our office' },
              { id: 'va_web', label: 'Visit our website' },
              { id: 'va_reg', label: 'Register' },
              { id: 'va_buy', label: 'Buy now' },
              { id: 'va_book', label: 'Book now' },
              { id: 'va_learn', label: 'Learn more' },
              { id: 'va_social', label: 'Follow our social media' }
            ]
          }
        ]
      },
      {
        letter: 'E',
        name: 'Environment',
        description: 'Where will people see it & orientation format?',
        questions: [
          {
            id: 'e_platform',
            sectionLetter: 'E',
            questionText: 'Platform (Select all that apply)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'plat_fb', label: 'Facebook' },
              { id: 'plat_ig', label: 'Instagram' },
              { id: 'plat_li', label: 'LinkedIn' },
              { id: 'plat_was', label: 'WhatsApp Status' },
              { id: 'plat_wast', label: 'WhatsApp Story' },
              { id: 'plat_x', label: 'X (Twitter)' },
              { id: 'plat_tt', label: 'TikTok' },
              { id: 'plat_web', label: 'Website' },
              { id: 'plat_print', label: 'Printed Flyer' },
              { id: 'plat_roll', label: 'Roll-up Banner' },
              { id: 'plat_bill', label: 'Billboard' }
            ]
          },
          {
            id: 'e_orientation',
            sectionLetter: 'E',
            questionText: 'Flyer Orientation (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'ori_sq', label: 'Square (1080 × 1080) — Best for Facebook & Instagram posts.' },
              { id: 'ori_port', label: 'Portrait (1080 × 1350) — Takes up more screen space on Instagram.' },
              { id: 'ori_story', label: 'Story (1080 × 1920) — For WhatsApp, Facebook and Instagram Stories.' },
              { id: 'ori_land', label: 'Landscape — Best for website banners and presentations.' }
            ]
          }
        ]
      },
      {
        letter: 'A',
        name: 'Art Style',
        description: 'How should it look?',
        questions: [
          {
            id: 'a_overall_style',
            sectionLetter: 'A',
            questionText: 'Overall Style (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'sty_corp', label: 'Corporate — Clean, trustworthy, professional.' },
              { id: 'sty_mod', label: 'Modern — Fresh and stylish.' },
              { id: 'sty_lux', label: 'Luxury — Premium and elegant.' },
              { id: 'sty_min', label: 'Minimal — Very clean with lots of white space.' },
              { id: 'sty_fut', label: 'Futuristic — AI, technology and innovation.' },
              { id: 'sty_creat', label: 'Creative — Bold colours and artistic layouts.' },
              { id: 'sty_flat', label: 'Flat Illustration — Cartoon/vector graphics.' },
              { id: 'sty_real', label: 'Realistic Photography — Looks like a professional photo.' },
              { id: 'sty_3d', label: '3D Design — Three-dimensional graphics.' },
              { id: 'sty_cine', label: 'Cinematic — Movie-like dramatic visuals.' }
            ]
          },
          {
            id: 'a_colour_mood',
            sectionLetter: 'A',
            questionText: 'Colour Mood (Select one or more)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'cm_bright', label: 'Bright' },
              { id: 'cm_soft', label: 'Soft' },
              { id: 'cm_dark', label: 'Dark' },
              { id: 'cm_color', label: 'Colourful' },
              { id: 'cm_mono', label: 'Monochrome' },
              { id: 'cm_brand', label: 'Brand Colours Only' }
            ]
          }
        ]
      },
      {
        letter: 'L',
        name: 'Lighting',
        description: 'How should the image be lit?',
        questions: [
          {
            id: 'l_lighting_type',
            sectionLetter: 'L',
            questionText: 'Lighting Type (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'lt_studio', label: 'Bright Studio — Very clean, perfect for business flyers.' },
              { id: 'lt_day', label: 'Natural Daylight — Looks like it was taken outdoors during the day.' },
              { id: 'lt_gold', label: 'Golden Hour — Warm sunrise or sunset glow.' },
              { id: 'lt_soft', label: 'Soft Light — Gentle lighting with smooth shadows.' },
              { id: 'lt_dram', label: 'Dramatic Lighting — Strong shadows for a powerful look.' },
              { id: 'lt_hk', label: 'High Key — Very bright with almost no shadows.' },
              { id: 'lt_lk', label: 'Low Key — Dark background with focused lighting.' },
              { id: 'lt_neon', label: 'Neon Lighting — Blue, green or purple futuristic lights.' },
              { id: 'lt_office', label: 'Office Lighting — Modern office environment.' },
              { id: 'lt_white', label: 'White Background — Perfect for corporate branding.' }
            ]
          }
        ]
      },
      {
        letter: 'D',
        name: 'Details',
        description: 'Company information, brand colours, overlay items, and image quality.',
        questions: [
          {
            id: 'd_company_name',
            sectionLetter: 'D',
            questionText: 'Company Name:',
            inputType: 'text',
            placeholder: 'e.g., Dennel Technologies'
          },
          {
            id: 'd_phone',
            sectionLetter: 'D',
            questionText: 'Phone:',
            inputType: 'text',
            placeholder: 'e.g., 0509468026'
          },
          {
            id: 'd_email',
            sectionLetter: 'D',
            questionText: 'Email:',
            inputType: 'text',
            placeholder: 'e.g., Denneltechnologies@gmail.com'
          },
          {
            id: 'd_brand_colours',
            sectionLetter: 'D',
            questionText: 'Brand Colours (Select all that apply)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'bc_green', label: 'Green' },
              { id: 'bc_yellow', label: 'Yellow' },
              { id: 'bc_white', label: 'White' },
              { id: 'bc_blue', label: 'Blue' },
              { id: 'bc_black', label: 'Black' },
              { id: 'bc_red', label: 'Red' }
            ]
          },
          {
            id: 'd_include_items',
            sectionLetter: 'D',
            questionText: 'Include on flyer (Checkboxes)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'inc_logo', label: 'Company Logo' },
              { id: 'inc_qr', label: 'QR Code' },
              { id: 'inc_phone', label: 'Phone Number' },
              { id: 'inc_email', label: 'Email' },
              { id: 'inc_web', label: 'Website' },
              { id: 'inc_social', label: 'Social Media Icons' },
              { id: 'inc_addr', label: 'Address' },
              { id: 'inc_cta', label: 'Call-to-Action Button' }
            ]
          },
          {
            id: 'd_image_quality',
            sectionLetter: 'D',
            questionText: 'Image Quality (Select one or more)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'iq_hd', label: 'HD' },
              { id: 'iq_fhd', label: 'Full HD' },
              { id: 'iq_4k', label: '4K' },
              { id: 'iq_8k', label: '8K' }
            ]
          }
        ]
      }
    ]
  },
  SCENE: {
    id: 'SCENE',
    name: 'SCENE Framework',
    acronym: 'S C E N E',
    tagline: 'Video Generation Framework',
    description: 'Construct video prompts for commercials, AI videos, movie scenes, explainer videos, training videos, reels, and documentaries.',
    examples: [
      'Commercials',
      'AI Videos',
      'Movie Scenes',
      'Explainer Videos',
      'Training Videos',
      'Reels',
      'Documentaries'
    ],
    color: {
      primary: 'amber-600',
      lightBg: 'amber-50/50',
      border: 'amber-200',
      badgeBg: 'amber-100',
      text: 'amber-900',
    },
    sections: [
      {
        letter: 'S',
        name: 'Story',
        description: 'What story should the video tell?',
        questions: [
          {
            id: 's_video_type',
            sectionLetter: 'S',
            questionText: 'Video Type (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'vt01', label: '01 Company Introduction' },
              { id: 'vt02', label: '02 Product Advertisement' },
              { id: 'vt03', label: '03 Documentary' },
              { id: 'vt04', label: '04 Customer Testimonial' },
              { id: 'vt05', label: '05 Tutorial' },
              { id: 'vt06', label: '06 Event Highlights' },
              { id: 'vt07', label: '07 Social Media Reel' },
              { id: 'vt08', label: '08 Promotional Video' },
              { id: 'vt09', label: '09 Brand Story' },
              { id: 'vt10', label: '10 Training Video' },
              { id: 'vt11', label: '11 Explainer Video' },
              { id: 'vt12', label: '12 Welcome Video' },
              { id: 'vt13', label: '13 Interview' },
              { id: 'vt14', label: '14 Travel Video' },
              { id: 'vt15', label: '15 Other' }
            ]
          },
          {
            id: 's_purpose',
            sectionLetter: 'S',
            questionText: 'Purpose (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'sp21', label: '21 Educate' },
              { id: 'sp22', label: '22 Entertain' },
              { id: 'sp23', label: '23 Sell' },
              { id: 'sp24', label: '24 Inform' },
              { id: 'sp25', label: '25 Inspire' },
              { id: 'sp26', label: '26 Motivate' },
              { id: 'sp27', label: '27 Recruit' },
              { id: 'sp28', label: '28 Celebrate' },
              { id: 'sp29', label: '29 Raise Awareness' },
              { id: 'sp30', label: '30 Other' }
            ]
          },
          {
            id: 's_story_arc',
            sectionLetter: 'S',
            questionText: 'Storyline / Script / Narrative Plot Arc:',
            inputType: 'textarea',
            placeholder: 'e.g., Starts with problem, moves to discovering product, ends with team success...'
          }
        ]
      },
      {
        letter: 'C',
        name: 'Characters',
        description: 'Who appears in the video?',
        questions: [
          {
            id: 'c_who_appears',
            sectionLetter: 'C',
            questionText: 'Who appears in the video? (Select any that apply)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'ch41', label: '41 CEO' },
              { id: 'ch42', label: '42 Business Professional' },
              { id: 'ch43', label: '43 Employee' },
              { id: 'ch44', label: '44 Customer' },
              { id: 'ch45', label: '45 Teacher' },
              { id: 'ch46', label: '46 Student' },
              { id: 'ch47', label: '47 Doctor' },
              { id: 'ch48', label: '48 Engineer' },
              { id: 'ch49', label: '49 Family' },
              { id: 'ch50', label: '50 Child' },
              { id: 'ch51', label: '51 Narrator Only' },
              { id: 'ch52', label: '52 AI Avatar' },
              { id: 'ch53', label: '53 Team' },
              { id: 'ch54', label: '54 No People' },
              { id: 'ch55', label: '55 Other' }
            ]
          },
          {
            id: 'c_emotion',
            sectionLetter: 'C',
            questionText: 'Emotion (Select any that apply)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'ce61', label: '61 Happy' },
              { id: 'ce62', label: '62 Professional' },
              { id: 'ce63', label: '63 Friendly' },
              { id: 'ce64', label: '64 Confident' },
              { id: 'ce65', label: '65 Inspirational' },
              { id: 'ce66', label: '66 Excited' },
              { id: 'ce67', label: '67 Serious' },
              { id: 'ce68', label: '68 Emotional' },
              { id: 'ce69', label: '69 Calm' },
              { id: 'ce70', label: '70 Other' }
            ]
          }
        ]
      },
      {
        letter: 'E',
        name: 'Environment',
        description: 'Where does the story happen?',
        questions: [
          {
            id: 'e_environment',
            sectionLetter: 'E',
            questionText: 'Where does the story happen? (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'env81', label: '81 Office' },
              { id: 'env82', label: '82 Classroom' },
              { id: 'env83', label: '83 Airport' },
              { id: 'env84', label: '84 Hotel' },
              { id: 'env85', label: '85 Restaurant' },
              { id: 'env86', label: '86 Home' },
              { id: 'env87', label: '87 Outdoor' },
              { id: 'env88', label: '88 Studio' },
              { id: 'env89', label: '89 Hospital' },
              { id: 'env90', label: '90 Factory' },
              { id: 'env91', label: '91 Technology Lab' },
              { id: 'env92', label: '92 Green Screen' },
              { id: 'env93', label: '93 White Background' },
              { id: 'env94', label: '94 Conference Room' },
              { id: 'env95', label: '95 Other' }
            ]
          }
        ]
      },
      {
        letter: 'N',
        name: 'Narration',
        description: 'How should the story be told?',
        questions: [
          {
            id: 'n_narration_style',
            sectionLetter: 'N',
            questionText: 'How should the story be told? (Select one or more)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'narr101', label: '101 Warm' },
              { id: 'narr102', label: '102 Friendly' },
              { id: 'narr103', label: '103 Professional' },
              { id: 'narr104', label: '104 Inspirational' },
              { id: 'narr105', label: '105 Storytelling' },
              { id: 'narr106', label: '106 Documentary' },
              { id: 'narr107', label: '107 Luxury' },
              { id: 'narr108', label: '108 Corporate' },
              { id: 'narr109', label: '109 Conversational' },
              { id: 'narr110', label: '110 Educational' },
              { id: 'narr111', label: '111 Motivational' },
              { id: 'narr112', label: '112 Dramatic' }
            ]
          },
          {
            id: 'n_voice',
            sectionLetter: 'N',
            questionText: 'Voice (Select one or more)',
            inputType: 'checkbox',
            allowCustomOther: true,
            options: [
              { id: 'v121', label: '121 Male' },
              { id: 'v122', label: '122 Female' },
              { id: 'v123', label: '123 AI Voice' },
              { id: 'v124', label: '124 British Accent' },
              { id: 'v125', label: '125 American Accent' },
              { id: 'v126', label: '126 African Accent' },
              { id: 'v127', label: '127 Child Voice' },
              { id: 'v128', label: '128 No Voice-over' }
            ]
          }
        ]
      },
      {
        letter: 'E',
        name: 'Effects',
        description: 'What effects should the video use?',
        questions: [
          {
            id: 'e_effects',
            sectionLetter: 'E',
            questionText: 'What effects should the video use? (Select any that apply)',
            inputType: 'checkbox',
            required: true,
            allowCustomOther: true,
            options: [
              { id: 'eff141', label: '141 Captions' },
              { id: 'eff142', label: '142 Subtitles' },
              { id: 'eff143', label: '143 Background Music' },
              { id: 'eff144', label: '144 Voice-over' },
              { id: 'eff145', label: '145 Drone Shots' },
              { id: 'eff146', label: '146 Slow Motion' },
              { id: 'eff147', label: '147 Fast Motion' },
              { id: 'eff148', label: '148 Motion Graphics' },
              { id: 'eff149', label: '149 Logo Animation' },
              { id: 'eff150', label: '150 AI Effects' },
              { id: 'eff151', label: '151 Cinematic Colour Grading' },
              { id: 'eff152', label: '152 Sound Effects' },
              { id: 'eff153', label: '153 Animated Text' },
              { id: 'eff154', label: '154 Scene Transitions' },
              { id: 'eff155', label: '155 Other' }
            ]
          }
        ]
      }
    ]
  }
};
