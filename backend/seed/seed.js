require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const CaseStudy = require('../models/CaseStudy');
const CaseCategory = require('../models/CaseCategory');
const Industry = require('../models/Industry');
const Portfolio = require('../models/Portfolio');
const PortfolioCategory = require('../models/PortfolioCategory');
const Service = require('../models/Service');
const Team = require('../models/Team');
const WhyUs = require('../models/WhyUs');

// ── Data ────────────────────────────────────────────────────────────────

const caseStudies = [
  {
    slug: 'al-rajhi-the-future-is-ours',
    title: 'AL RAJHI — THE FUTURE IS OURS',
    tag: 'Banking · KSA · 2024',
    category: { en: 'Banking', ar: 'بنوك' },
    metrics: [
      { num: '+38%', label: 'Brand Recall' },
      { num: '2.1B', label: 'Impressions' },
      { num: '4x', label: 'App Downloads' },
    ],
    description: "A pan-Kingdom brand repositioning campaign that shifted Al Rajhi's perception from traditional bank to the bank of Saudi's next generation. We developed a full creative platform across TV, digital, OOH, and in-branch activation.",
    fullDescription: "Al Rajhi Bank needed to connect with a younger audience while maintaining trust with its existing base. Our team developed \"The Future Is Ours\" — a multi-channel brand platform that positioned the bank as a forward-thinking institution rooted in tradition. The campaign spanned TV commercials, a complete digital ecosystem overhaul, 800+ OOH placements across the Kingdom, and in-branch experiential activations during Riyadh Season.",
    challenge: 'Shift the perception of a heritage bank to appeal to Saudi youth (18–34) without alienating the existing customer base.',
    solution: 'A dual-narrative campaign: heritage stories told through modern visual language, paired with youth-first digital activations on Snapchat, TikTok, and Twitter.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900',
    ],
  },
  {
    slug: 'aldar-live-beyond',
    title: 'ALDAR — LIVE BEYOND',
    tag: 'Real Estate · UAE · 2023',
    category: { en: 'Real Estate', ar: 'عقارات' },
    metrics: [
      { num: '+55%', label: 'Lead Generation' },
      { num: '890M', label: 'Views (Digital)' },
      { num: 'Cannes', label: 'Shortlisted' },
    ],
    description: "A cinematic campaign for Abu Dhabi's leading developer, reframing luxury living as an emotional and cultural aspiration. The campaign launched three major developments simultaneously across UAE, UK, and China.",
    fullDescription: "Aldar Properties wanted to redefine what luxury real estate marketing looks like in the Middle East. We created \"Live Beyond\" — a cinematic brand world that moved past marble and gold clichés to focus on human stories, community, and cultural ambition. Three hero films launched simultaneously for Saadiyat Grove, Yas Acres, and Mamsha Al Saadiyat, each with its own visual identity yet united under a single emotional platform.",
    challenge: "Launch three distinct mega-developments under one brand umbrella without diluting any individual project's identity.",
    solution: 'A modular creative system with shared typography and motion language, but unique color palettes and narrative tones per development.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=900',
    ],
  },
  {
    slug: 'roadster-diner-still-here',
    title: 'ROADSTER DINER — STILL HERE',
    tag: 'FMCG · Lebanon · 2023',
    category: { en: 'F&B', ar: 'أغذية ومشروبات' },
    metrics: [
      { num: '+200%', label: 'Franchise Inquiries' },
      { num: '#1', label: 'Trending Lebanon' },
      { num: 'Global', label: 'Media Coverage' },
    ],
    description: "A defiant brand survival campaign during Lebanon's economic crisis. Born from a social media conversation, the campaign became a national rallying cry — and drove a 200% increase in franchise inquiries despite the broader market collapse.",
    fullDescription: "When Lebanon's economy collapsed, most brands went silent. Roadster Diner chose defiance. \"Still Here\" started as a single Instagram post responding to a customer asking if the brand was closing — and it became the most talked-about campaign in Lebanon that year. We turned the message into a full brand platform: billboards, limited-edition packaging, a documentary short, and a franchise expansion campaign targeting the Lebanese diaspora.",
    challenge: 'Maintain brand relevance and drive business growth during an unprecedented national economic crisis.',
    solution: 'Authentic, defiant storytelling that turned vulnerability into strength — meeting people where they were emotionally.',
    image: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=900',
    ],
  },
];

const caseCategories = [
  { en: 'Banking', ar: 'بنوك' },
  { en: 'Real Estate', ar: 'عقارات' },
  { en: 'F&B', ar: 'أغذية ومشروبات' },
];

const industries = [
  {
    name: 'Restaurants & F&B',
    nameAr: 'المطاعم والأغذية',
    headlineEn: 'We Serve Every Taste',
    headlineEmEn: 'Every Taste',
    colorIndex: 0,
    descEn: 'From fast-casual chains to fine dining, we craft campaigns that fill seats and build cult followings. Menu launches, delivery app strategies, franchise growth — we know what makes people hungry.',
    descAr: 'من سلاسل المطاعم السريعة إلى المطاعم الفاخرة، نصمم حملات تملأ المقاعد وتبني جمهوراً مخلصاً.',
    services: ['Brand Identity', 'Social Media', 'Menu Design', 'Packaging', 'Franchise Marketing'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Beauty & Cosmetics',
    nameAr: 'الجمال ومستحضرات التجميل',
    headlineEn: 'Amplify Your Beauty',
    headlineEmEn: 'Your Beauty',
    colorIndex: 1,
    descEn: 'We help beauty brands stand out in a saturated market. Influencer campaigns, product launches, e-commerce optimization, and visual storytelling that makes people stop scrolling.',
    descAr: 'نساعد علامات التجميل على التميز في سوق مشبع. حملات مؤثرين، إطلاق منتجات، وسرد بصري يوقف التمرير.',
    services: ['Influencer Marketing', 'Product Launch', 'E-commerce', 'Video Production', 'Packaging'],
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Education',
    nameAr: 'التعليم',
    headlineEn: 'Build Future Minds',
    headlineEmEn: 'Future Minds',
    colorIndex: 2,
    descEn: 'Universities, schools, and EdTech platforms trust us to drive enrollment and build institutional brands. We turn academic excellence into compelling stories.',
    descAr: 'الجامعات والمدارس ومنصات التعليم التقني تثق بنا لزيادة التسجيل وبناء علامات مؤسسية قوية.',
    services: ['Enrollment Campaigns', 'Brand Positioning', 'Digital Ads', 'Event Marketing', 'Content Strategy'],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Real Estate & Construction',
    nameAr: 'العقارات والبناء',
    headlineEn: 'Elevate Every Space',
    headlineEmEn: 'Every Space',
    colorIndex: 3,
    descEn: 'We sell visions, not just properties. CGI renders, cinematic walkthroughs, launch events, and lead-generation machines that move units before the paint dries.',
    descAr: 'نبيع رؤى، لا مجرد عقارات. عروض ثلاثية الأبعاد، جولات سينمائية، فعاليات إطلاق، ومحركات توليد عملاء.',
    services: ['CGI & 3D Renders', 'Sales Collateral', 'Launch Events', 'Lead Generation', 'Billboard Campaigns'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Healthcare',
    nameAr: 'الرعاية الصحية',
    headlineEn: 'Care That Converts',
    headlineEmEn: 'Converts',
    colorIndex: 4,
    descEn: 'Hospitals, clinics, and health-tech brands need trust and clarity. We build campaigns that educate, reassure, and drive patient acquisition — all while staying compliant.',
    descAr: 'المستشفيات والعيادات وشركات التكنولوجيا الصحية تحتاج الثقة والوضوح. نبني حملات تثقّف وتطمئن وتجذب المرضى.',
    services: ['Patient Acquisition', 'Trust Campaigns', 'Digital Presence', 'Health Content', 'Compliance-Ready Ads'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Fashion & Apparel',
    nameAr: 'الأزياء والملابس',
    headlineEn: 'Style That Sells',
    headlineEmEn: 'Sells',
    colorIndex: 1,
    descEn: 'Lookbooks, runway coverage, influencer seeding, and e-commerce conversion — we help fashion brands move from aspiration to transaction.',
    descAr: 'كتب الأزياء، تغطية العروض، حملات المؤثرين، وتحسين التجارة الإلكترونية — نساعد علامات الأزياء على التحول من الطموح إلى البيع.',
    services: ['Lookbook Production', 'Influencer Seeding', 'E-commerce Strategy', 'Runway Events', 'Social Content'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Government & Public Services',
    nameAr: 'الحكومة والخدمات العامة',
    headlineEn: 'Service That Scales',
    headlineEmEn: 'That Scales',
    colorIndex: 2,
    descEn: 'Public-sector campaigns that reach millions. Awareness drives, national branding initiatives, and citizen engagement programs built for impact at scale.',
    descAr: 'حملات القطاع العام التي تصل للملايين. حملات توعية، مبادرات هوية وطنية، وبرامج مشاركة المواطنين.',
    services: ['Awareness Campaigns', 'National Branding', 'Public Events', 'Bilingual Content', 'OOH Networks'],
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Specialized Sectors',
    nameAr: 'القطاعات المتخصصة',
    headlineEn: 'Solutions Without Limits',
    headlineEmEn: 'Without Limits',
    colorIndex: 0,
    descEn: 'Oil & gas, logistics, tech startups, sports, entertainment — whatever your niche, we bring the same obsessive energy. No sector is too complex when strategy leads.',
    descAr: 'النفط والغاز، اللوجستيات، الشركات الناشئة، الرياضة، الترفيه — مهما كان تخصصك، نقدم نفس الطاقة المهووسة.',
    services: ['Sector Research', 'Custom Strategy', 'B2B Campaigns', 'Trade Shows', 'Thought Leadership'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=900',
  },
];

const portfolio = [
  { titleEn: 'Advertising with edge', titleAr: 'إعلان بحدّة', category: { en: 'Restaurant', ar: 'مطعم' }, tags: ['Corporate Identity', 'Campaign Print'], image: 'https://i.pinimg.com/1200x/92/28/08/922808a27e2ba7766773d798334f67a8.jpg', featured: true },
  { titleEn: 'Experiential design', titleAr: 'تصميم تجريبي', category: { en: 'Museum', ar: 'متحف' }, tags: ['Brand Guidelines', 'Editorial Design'], image: 'https://i.pinimg.com/736x/03/04/cf/0304cfefa627fc371a10ad328db68e37.jpg', featured: false },
  { titleEn: 'Visionary designs', titleAr: 'تصاميم استشرافية', category: { en: 'Real Estate', ar: 'عقارات' }, tags: ['Logo System', 'Marketing Collateral'], image: 'https://i.pinimg.com/736x/49/30/d6/4930d6a27d760c781fffc6d15575cacd.jpg', featured: false },
  { titleEn: 'Event experience', titleAr: 'تجربة الفعاليات', category: { en: 'Events', ar: 'فعاليات' }, tags: ['Experiential', 'PR & Media'], image: 'https://i.pinimg.com/736x/9e/89/43/9e89431bd2d6ab208794576c787ef561.jpg', featured: false },
  { titleEn: 'Creative visions', titleAr: 'رؤى إبداعية', category: { en: 'Healthcare', ar: 'رعاية صحية' }, tags: ['Brand Strategy', 'Billboard Design'], image: 'https://i.pinimg.com/1200x/f1/42/81/f14281875b7b16d18596fab170cd9b29.jpg', featured: false },
  { titleEn: 'Urban dining', titleAr: 'تجربة طعام حضرية', category: { en: 'Restaurant', ar: 'مطعم' }, tags: ['Interior Branding', 'Menu Design'], image: 'https://i.pinimg.com/736x/7e/0e/39/7e0e39143c40c11f1b3ab9b80c498ded.jpg', featured: true },
  { titleEn: 'Heritage gallery', titleAr: 'معرض التراث', category: { en: 'Museum', ar: 'متحف' }, tags: ['Exhibition Design', 'Wayfinding'], image: 'https://i.pinimg.com/736x/a4/5e/18/a45e18b8a1a2e3b1c1f4d6a7b8c9d0e1.jpg', featured: false },
  { titleEn: 'Skyline towers', titleAr: 'أبراج الأفق', category: { en: 'Real Estate', ar: 'عقارات' }, tags: ['3D Renders', 'Sales Brochure'], image: 'https://i.pinimg.com/736x/b5/6f/29/b56f29c2d3e4f5a6b7c8d9e0f1a2b3c4.jpg', featured: false },
  { titleEn: 'Gala night', titleAr: 'ليلة الحفل', category: { en: 'Events', ar: 'فعاليات' }, tags: ['Stage Design', 'Digital Invites'], image: 'https://i.pinimg.com/736x/c6/70/3a/c6703ad4e5f6a7b8c9d0e1f2a3b4c5d6.jpg', featured: false },
  { titleEn: 'Wellness rebrand', titleAr: 'إعادة بناء العلامة الصحية', category: { en: 'Healthcare', ar: 'رعاية صحية' }, tags: ['Visual Identity', 'Social Media'], image: 'https://i.pinimg.com/736x/d7/81/4b/d7814be5f6a7b8c9d0e1f2a3b4c5d6e7.jpg', featured: false },
  { titleEn: 'Tech launch', titleAr: 'إطلاق تقني', category: { en: 'Technology', ar: 'تكنولوجيا' }, tags: ['Product Launch', 'Digital Campaign'], image: 'https://i.pinimg.com/736x/e8/92/5c/e8925cf6a7b8c9d0e1f2a3b4c5d6e7f8.jpg', featured: true },
  { titleEn: 'Fashion forward', titleAr: 'أزياء متقدمة', category: { en: 'Fashion', ar: 'أزياء' }, tags: ['Lookbook', 'E-commerce'], image: 'https://i.pinimg.com/736x/f9/a3/6d/f9a36da7b8c9d0e1f2a3b4c5d6e7f8a9.jpg', featured: false },
  { titleEn: 'Café culture', titleAr: 'ثقافة المقهى', category: { en: 'Restaurant', ar: 'مطعم' }, tags: ['Packaging', 'Brand Identity'], image: 'https://i.pinimg.com/736x/0a/b4/7e/0ab47eb8c9d0e1f2a3b4c5d6e7f8a9b0.jpg', featured: false },
  { titleEn: 'Art district', titleAr: 'حي الفنون', category: { en: 'Museum', ar: 'متحف' }, tags: ['Mural Design', 'Cultural Campaign'], image: 'https://i.pinimg.com/736x/1b/c5/8f/1bc58fc9d0e1f2a3b4c5d6e7f8a9b0c1.jpg', featured: false },
  { titleEn: 'Luxury living', titleAr: 'حياة فاخرة', category: { en: 'Real Estate', ar: 'عقارات' }, tags: ['CGI Animation', 'Print Ads'], image: 'https://i.pinimg.com/736x/2c/d6/90/2cd690d0e1f2a3b4c5d6e7f8a9b0c1d2.jpg', featured: false },
  { titleEn: 'Summit 2026', titleAr: 'قمة 2026', category: { en: 'Events', ar: 'فعاليات' }, tags: ['Conference Branding', 'Motion Graphics'], image: 'https://i.pinimg.com/736x/3d/e7/a1/3de7a1e1f2a3b4c5d6e7f8a9b0c1d2e3.jpg', featured: false },
];

const portfolioCategories = [
  { en: 'Restaurant', ar: 'مطعم' },
  { en: 'Museum', ar: 'متحف' },
  { en: 'Real Estate', ar: 'عقارات' },
  { en: 'Events', ar: 'فعاليات' },
  { en: 'Healthcare', ar: 'رعاية صحية' },
  { en: 'Technology', ar: 'تكنولوجيا' },
  { en: 'Fashion', ar: 'أزياء' },
];

const services = [
  { num: '01', en: 'Digital Marketing', ar: 'التسويق الرقمي', descEn: 'Performance-driven campaigns across search, social, and programmatic channels. We turn ad spend into measurable growth with data-obsessed strategy and relentless optimization.', descAr: 'حملات مدفوعة بالأداء عبر محركات البحث والتواصل الاجتماعي والقنوات البرمجية. نحوّل الإنفاق الإعلاني إلى نمو قابل للقياس.', features: ['SEO & SEM', 'Social Media Ads', 'Programmatic Buying', 'Email Marketing', 'Influencer Strategy'] },
  { num: '02', en: 'Video Production', ar: 'إنتاج الفيديو', descEn: 'From concept to final cut — cinematic TVCs, social-first reels, motion graphics, and documentary storytelling that captures attention and holds it.', descAr: 'من الفكرة إلى المونتاج النهائي — إعلانات سينمائية، محتوى اجتماعي، رسوم متحركة، وأفلام وثائقية تجذب الانتباه.', features: ['TVC Production', 'Social Reels', 'Motion Graphics', 'Documentary', 'Aerial Filming'] },
  { num: '03', en: 'Brand Identity', ar: 'هوية العلامة', descEn: 'We build brands from the ground up — strategy, naming, visual systems, and guidelines that make your identity unmistakable and unforgettable.', descAr: 'نبني العلامات التجارية من الصفر — استراتيجية، تسمية، أنظمة بصرية، ودليل هوية يجعل علامتك لا تُنسى.', features: ['Brand Strategy', 'Logo Design', 'Visual Identity', 'Brand Guidelines', 'Naming & Messaging'] },
  { num: '04', en: 'Web & App Dev', ar: 'تطوير المواقع', descEn: 'High-performance websites and mobile apps built with modern stacks. From landing pages to full platforms — designed to convert and engineered to scale.', descAr: 'مواقع وتطبيقات عالية الأداء مبنية بأحدث التقنيات. من صفحات الهبوط إلى المنصات الكاملة — مصممة للتحويل ومهندسة للتوسع.', features: ['Web Development', 'Mobile Apps', 'E-commerce', 'UI/UX Design', 'CMS Integration'] },
  { num: '05', en: 'Business Analytics', ar: 'تحليل الأعمال', descEn: "Dashboards, reports, and strategic insights that turn raw data into clear decisions. We help you understand what's working and what's burning budget.", descAr: 'لوحات بيانات وتقارير ورؤى استراتيجية تحوّل البيانات الخام إلى قرارات واضحة. نساعدك على فهم ما ينجح وما يستنزف الميزانية.', features: ['Data Dashboards', 'Campaign Analytics', 'Market Research', 'A/B Testing', 'ROI Tracking'] },
  { num: '06', en: 'Print & Production', ar: 'طباعة وإنتاج', descEn: 'Premium print collateral, packaging, OOH installations, and physical brand experiences — crafted with obsessive attention to material and finish.', descAr: 'مطبوعات ممتازة، تغليف، لوحات إعلانية خارجية، وتجارب مادية للعلامة التجارية — بتفاصيل دقيقة واهتمام مهووس بالمواد.', features: ['Packaging Design', 'OOH & Billboards', 'Exhibition Stands', 'Brochures & Catalogs', 'Signage Systems'] },
  { num: '07', en: 'Event Management', ar: 'إدارة الفعاليات', descEn: 'End-to-end event production — from intimate brand activations to large-scale conferences. We handle concept, logistics, design, and live execution.', descAr: 'إنتاج فعاليات متكامل — من التفعيلات الحميمة إلى المؤتمرات الكبرى. نتولى الفكرة واللوجستيات والتصميم والتنفيذ المباشر.', features: ['Brand Activations', 'Conferences', 'Product Launches', 'Stage Design', 'Live Production'] },
  { num: '08', en: 'Sales & CRM', ar: 'المبيعات وإدارة العملاء', descEn: 'We set up and optimize your sales engine — CRM implementation, lead nurturing workflows, and conversion funnels that actually close deals.', descAr: 'نبني ونحسّن محرك مبيعاتك — تنفيذ أنظمة CRM، سلاسل رعاية العملاء المحتملين، وقمع تحويل يغلق الصفقات فعلاً.', features: ['CRM Setup', 'Lead Nurturing', 'Sales Funnels', 'Pipeline Management', 'Automation'] },
  { num: '09', en: 'Custom Music', ar: 'موسيقى مخصصة', descEn: 'Original scores, jingles, and sonic branding tailored to your campaign. Sound that makes people feel before they think.', descAr: 'موسيقى أصلية، أناشيد إعلانية، وهوية صوتية مصممة خصيصاً لحملتك. صوت يجعل الناس يشعرون قبل أن يفكروا.', features: ['Original Scores', 'Jingles', 'Sonic Branding', 'Podcast Production', 'Sound Design'] },
];

const team = [
  { name: 'Karim Al-Rashid', roleKey: 'team_role_ceo', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
  { name: 'Nour Mansour', roleKey: 'team_role_cco', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' },
  { name: 'Fadi Khoury', roleKey: 'team_role_strategy', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600' },
  { name: 'Lara Hamdan', roleKey: 'team_role_digital', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600' },
];

const whyUs = [
  { eyebrowEn: 'Reason 01 / 05', headingEn: 'Full-Suite Solutions', bodyAr: 'من الحملة الرقمية إلى الطباعة والتدريب والأحداث — كل ما تحتاجه تحت سقف واحد. لا وسطاء، لا إهدار.', bodyEn: 'From digital campaigns to print, training, and events — everything you need under one roof. No middlemen, no waste.', tag: '360° Agency', bg: '#f1f1f1', accent: '#dc1e1e', textColor: '#111' },
  { eyebrowEn: 'Reason 02 / 05', headingEn: 'Global Reach, Local Insight', bodyAr: 'حضور عملياتي في الإمارات، السعودية، لبنان وسوريا. نفهم الأسواق العربية من الداخل — ثقافةً وجمهوراً وتوقيتاً.', bodyEn: 'Operational presence in UAE, KSA, Lebanon and Syria. We understand Arab markets from the inside — culture, audience, timing.', tag: '4 Countries', bg: '#111111', accent: '#ffffff', textColor: '#fff' },
  { eyebrowEn: 'Reason 03 / 05', headingEn: 'Expert Team', bodyAr: 'فريقنا يحمل خلفيات أكاديمية رفيعة وخبرة مكتسبة من شركات دولية متعددة. نجلب المعرفة العالمية لخدمة السوق المحلي.', bodyEn: 'Our team holds strong academic backgrounds and experience from multiple international firms. We bring global knowledge to serve the local market.', tag: 'World-Class', bg: '#dc1e1e', accent: '#ffffff', textColor: '#fff' },
  { eyebrowEn: 'Reason 04 / 05', headingEn: 'Problem Solvers First', bodyAr: 'لسنا مجرد وكالة إعلانات — نساعد الشركات في تشخيص وحل مشكلاتها الحقيقية. نبدأ دائماً بالسؤال الصحيح قبل الإعلان.', bodyEn: "We're not just an ad agency — we help businesses diagnose and solve their real problems. We always start with the right question before advertising.", tag: 'Strategic', bg: '#f5f3ef', accent: '#dc1e1e', textColor: '#111' },
  { eyebrowEn: 'Reason 05 / 05', headingEn: 'Results That Compound', bodyAr: 'نتائجنا تتراكم مع الوقت. علامتك تصل لجماهير جديدة، تكسب ولاء حقيقياً، وتنمو بثبات. نبقى إلى جانبك في كل خطوة.', bodyEn: 'Our results compound over time. Your brand reaches new audiences, earns real loyalty, and grows steadily. We stay beside you every step of the way.', tag: 'Long-term Growth', bg: '#1a1a1a', accent: '#dc1e1e', textColor: '#fff' },
];

// ── Seed ─────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await connectDB();

    // Clear all collections
    await Promise.all([
      CaseStudy.deleteMany(),
      CaseCategory.deleteMany(),
      Industry.deleteMany(),
      Portfolio.deleteMany(),
      PortfolioCategory.deleteMany(),
      Service.deleteMany(),
      Team.deleteMany(),
      WhyUs.deleteMany(),
    ]);
    console.log('Cleared all collections');

    // Insert all data
    const [cs, cc, ind, port, pc, svc, tm, wu] = await Promise.all([
      CaseStudy.insertMany(caseStudies),
      CaseCategory.insertMany(caseCategories),
      Industry.insertMany(industries),
      Portfolio.insertMany(portfolio),
      PortfolioCategory.insertMany(portfolioCategories),
      Service.insertMany(services),
      Team.insertMany(team),
      WhyUs.insertMany(whyUs),
    ]);

    console.log(`Seeded: ${cs.length} case studies`);
    console.log(`Seeded: ${cc.length} case categories`);
    console.log(`Seeded: ${ind.length} industries`);
    console.log(`Seeded: ${port.length} portfolio items`);
    console.log(`Seeded: ${pc.length} portfolio categories`);
    console.log(`Seeded: ${svc.length} services`);
    console.log(`Seeded: ${tm.length} team members`);
    console.log(`Seeded: ${wu.length} why-us items`);

    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
