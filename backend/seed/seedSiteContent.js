require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const SiteContent = require('../models/SiteContent');

const content = [
  // ── Hero ──
  { key: 'hero_title', value: 'CRAZY ADS', group: 'hero' },
  { key: 'hero_video_url', value: 'https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4', group: 'hero' },
  { key: 'hero_poster_url', value: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920', group: 'hero' },
  { key: 'hero_eyebrow_en', value: "MENA's Boldest Creative Agency", group: 'hero' },
  { key: 'hero_eyebrow_ar', value: 'أجرأ وكالة إبداعية في الشرق الأوسط', group: 'hero' },
  { key: 'hero_sub_en', value: 'We engineer <em>unforgettable</em> brand experiences across the Arab world. From Riyadh to Dubai to Beirut — we don\'t advertise. We <em>ignite</em>.', group: 'hero' },
  { key: 'hero_sub_ar', value: 'نصمم تجارب علامات تجارية <em>لا تُنسى</em> في العالم العربي. من الرياض إلى دبي إلى بيروت — نحن لا نعلن. نحن <em>نشعل</em>.', group: 'hero' },

  // ── Taglines ──
  { key: 'tagline_1_en', value: "WE DON'T FOLLOW TRENDS —", group: 'taglines' },
  { key: 'tagline_1_ar', value: 'لا نتبع الاتجاهات —', group: 'taglines' },
  { key: 'tagline_2_en', value: 'WE BUILD OBSESSIONS.', group: 'taglines' },
  { key: 'tagline_2_ar', value: 'نحن نصنع الهوس.', group: 'taglines' },
  { key: 'tagline_3_en', value: 'YOUR BRAND DESERVES CRAZY.', group: 'taglines' },
  { key: 'tagline_3_ar', value: 'علامتك تستحق الجنون.', group: 'taglines' },

  // ── Counters ──
  { key: 'counter_years_value', value: 14, group: 'counters' },
  { key: 'counter_years_suffix', value: '+', group: 'counters' },
  { key: 'counter_campaigns_value', value: 300, group: 'counters' },
  { key: 'counter_campaigns_suffix', value: '+', group: 'counters' },
  { key: 'counter_markets_value', value: 8, group: 'counters' },
  { key: 'counter_markets_suffix', value: '', group: 'counters' },
  { key: 'counter_awards_value', value: 47, group: 'counters' },
  { key: 'counter_awards_suffix', value: '', group: 'counters' },

  // ── Clients ──
  { key: 'client_list', value: [
    { abbr: 'NK', name: 'NovaBrand' },
    { abbr: 'PX', name: 'Pixelate Co.' },
    { abbr: 'RM', name: 'RedMark' },
    { abbr: 'AL', name: 'Alwan Group' },
    { abbr: 'ZN', name: 'Zenova' },
    { abbr: 'FX', name: 'FluxMedia' },
    { abbr: 'DW', name: 'Dawali' },
    { abbr: 'SP', name: 'Spark Labs' },
    { abbr: 'OR', name: 'Orion' },
    { abbr: 'HV', name: 'Hive Digital' },
  ], group: 'clients' },

  // ── Contact ──
  { key: 'contact_email', value: 'hello@crazy-ads.com', group: 'contact' },
  { key: 'contact_phones', value: [
    { country: 'UAE', flag: '🇦🇪', number: '+971 50 205 7272', tel: 'tel:+971502057272' },
    { country: 'KSA', flag: '🇸🇦', number: '+966 51 133 8191', tel: 'tel:+966511338191' },
    { country: 'Lebanon', flag: '🇱🇧', number: '+961 76 702 611', tel: 'tel:+96176702611' },
    { country: 'Syria', flag: '🇸🇾', number: '+963 998 237 120', tel: 'tel:+963998237120' },
  ], group: 'contact' },

  // ── About ──
  { key: 'about_since', value: 'Since 2012', group: 'about' },
  { key: 'about_story_p1_en', value: "Crazy Ads was founded with a single belief: that the Arab world deserved bold, world-class creative work — not watered-down global templates.", group: 'about' },
  { key: 'about_story_p1_ar', value: 'تأسست Crazy Ads بإيمان واحد: أن العالم العربي يستحق أعمالاً إبداعية جريئة وعالمية المستوى — وليس قوالب عالمية مخففة.', group: 'about' },
  { key: 'about_story_p2_en', value: "From our first office in Beirut to operations across 4 countries, we've built a reputation for campaigns that don't just get noticed — they get remembered.", group: 'about' },
  { key: 'about_story_p2_ar', value: 'من مكتبنا الأول في بيروت إلى عمليات في 4 دول، بنينا سمعة لحملات لا تُلاحظ فقط — بل تُتذكر.', group: 'about' },
  { key: 'about_story_p3_en', value: 'Today, our team of strategists, creatives, and technologists serves brands from Riyadh to Dubai, bringing the same obsessive energy to every project.', group: 'about' },
  { key: 'about_story_p3_ar', value: 'اليوم، فريقنا من الاستراتيجيين والمبدعين والتقنيين يخدم العلامات من الرياض إلى دبي، بنفس الطاقة المهووسة في كل مشروع.', group: 'about' },
  { key: 'about_offices', value: [
    { id: 'lb', city: 'Beirut', country: 'Lebanon', hq: true },
    { id: 'ae', city: 'Dubai', country: 'UAE', hq: false },
    { id: 'sa', city: 'Riyadh', country: 'KSA', hq: false },
    { id: 'sy', city: 'Damascus', country: 'Syria', hq: false },
  ], group: 'about' },
];

const seed = async () => {
  try {
    await connectDB();
    await SiteContent.deleteMany();

    const data = await SiteContent.insertMany(content);
    console.log(`Seeded: ${data.length} site content entries`);
    console.log('Site content seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed site content error:', err.message);
    process.exit(1);
  }
};

seed();
