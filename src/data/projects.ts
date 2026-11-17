import { BilingualText } from '../i18n/translations';

export type ProjectCategory =
  | 'branding'
  | 'logo'
  | 'identity'
  | 'graphic'
  | 'uiux'
  | 'motion3d';

export type LayoutVariant =
  | 'monograph'
  | 'chromatic-essay'
  | 'brutalist-grid'
  | 'kinetic-specimen';

export interface ProjectTheme {
  bg: string;
  surface: string;
  ink: string;
  accent: string;
  isDark: boolean;
}

import type { BeforeAfterPair, ExtraPlate } from '../components/BeforeAfterShowcase';
import type { MarketplaceSeriesItem } from '../components/MarketplaceSeriesShowcase';
import type { EncyclopediaSpread } from '../components/EncyclopediaReader';
import type { LogofolioPlate } from '../components/LogofolioShowcase';
import type { BrandbookSlide } from '../components/BrandbookShowcase';
import type { IdentityCarrierPlate } from '../components/IdentityShowcase';

export interface ProjectStage {
  label: BilingualText;
  title: BilingualText;
  description: BilingualText;
}

export interface ProjectCase {
  id: string;
  slug: string;
  slotCode: string;
  watermarkWord?: string;
  isSlotPlaceholder: boolean;
  category: ProjectCategory;
  categoryLabel: BilingualText;
  year: string;
  layoutVariant: LayoutVariant;
  gridSpan: 'wide' | 'tall' | 'square' | 'panorama';
  theme: ProjectTheme;
  coverImage: string;
  coverFit?: 'cover' | 'contain';
  coverBg?: string;
  isLogoCover?: boolean;
  coverElevation?: boolean;
  preserveTypographyMedia?: boolean;
  heroImage?: string;
  secondaryImages: string[];
  beforeAfter?: {
    pairs: BeforeAfterPair[];
    extraPlates?: ExtraPlate[];
  };
  marketplaceSeries?: MarketplaceSeriesItem[];
  encyclopediaData?: {
    spreads: EncyclopediaSpread[];
    pdfUrl: string;
  };
  logofolioData?: {
    coverPlateSrc?: string;
    plates: LogofolioPlate[];
  };
  brandbookData?: {
    slides: BrandbookSlide[];
  };
  identityPlates?: IdentityCarrierPlate[];
  title: BilingualText;
  subtitle: BilingualText;
  task: BilingualText;
  problem: BilingualText;
  concept: BilingualText;
  processStages: ProjectStage[];
  visualSystemNotes: BilingualText;
  typographySpec: {
    display: string;
    body: string;
    palette: string[];
  };
  graphicDecisions: BilingualText[];
  applications: BilingualText[];
}

export const DEFAULT_PROJECTS: ProjectCase[] = [
  {
    id: 'slot-01',
    slug: 'semya-dentistry-redesign',
    slotCode: 'СЕМЬЯ НН',
    watermarkWord: 'СЕМЬЯ',
    isSlotPlaceholder: false,
    category: 'uiux',
    categoryLabel: { ru: 'Ребрендинг сайта · UI/UX · SEO', en: 'Website Rebrand · UI/UX · SEO' },
    year: '2026 · НИЖНИЙ НОВГОРОД',
    layoutVariant: 'monograph',
    gridSpan: 'wide',
    theme: {
      bg: '#155EEF',
      surface: '#0A1322',
      ink: '#EFEFE9',
      accent: '#00C6FF',
      isDark: true,
    },
    coverImage: '/assets/aistudio/image_62a6c9c4.webp',
    coverFit: 'contain',
    coverBg: '#FFFFFF',
    isLogoCover: true,
    preserveTypographyMedia: true,
    heroImage: '/assets/aistudio/Screenshot_2026-05-16_184350_51c20aa2.webp',
    secondaryImages: [
      '/assets/aistudio/Screenshot_2026-05-16_184441_cc36e6e8.webp',
      '/assets/aistudio/Screenshot_2026-05-16_184505_8a77c64a.webp',
    ],
    beforeAfter: {
      pairs: [
        {
          id: 'hero',
          label: { ru: '01 · Первый экран', en: '01 · Hero & Nav' },
          beforeSrc: '/assets/aistudio/Screenshot_2026-02-13_025841_6a37a952.webp',
          afterSrc: '/assets/aistudio/Screenshot_2026-05-16_184350_51c20aa2.webp',
          beforeNote: {
            ru: 'Серый абстрактный фон, трудночитаемый рукописный шрифт, перегруженная двойная шапка и визуально тяжёлые кнопки-капсулы.',
            en: 'Muddy gray backdrop, low-legibility cursive script, cluttered double header, and heavy glowing pill buttons.',
          },
          afterNote: {
            ru: 'Много чистого воздуха, акцентный тёмно-синий круг с 3D-имплантом, чёткий девиз и прямой переход к записи на приём.',
            en: 'Generous medical whitespace, deep navy circular 3D implant composition, crisp tagline, and direct appointment CTA.',
          },
        },
        {
          id: 'services',
          label: { ru: '02 · Подача услуг', en: '02 · Services & 3D' },
          beforeSrc: '/assets/aistudio/Screenshot_2026-02-13_203538_d127794e.webp',
          afterSrc: '/assets/aistudio/Screenshot_2026-05-16_184505_8a77c64a.webp',
          beforeNote: {
            ru: 'Кислотно-голубое свечение вокруг стоковых фото, тени за текстом и нагромождение мелких блоков на тёмном фоне.',
            en: 'Harsh neon-cyan glow around stock images, heavy drop shadows behind script fonts, and cramped dark layout.',
          },
          afterNote: {
            ru: 'Лёгкая медицинская чистота, крупные 3D-визуалы элайнеров и чёткие тёмно-синие диагональные акценты из палитры клиники.',
            en: 'Clean clinical minimalism, large 3D aligner renders, and bold navy diagonal strokes echoing the clinic identity.',
          },
        },
        {
          id: 'curation',
          label: { ru: '03 · Имплантация и ГОСТ', en: '03 · Systems & GOST' },
          beforeSrc: '/assets/aistudio/Screenshot_2026-02-13_201222_2f3258de.webp',
          afterSrc: '/assets/aistudio/Screenshot_2026-05-16_184520_8fd522ec.webp',
          beforeNote: {
            ru: 'Разрозненная тёмная сетка с техническими артефактами на фото, несогласованные шрифты и отсутствие доступной среды.',
            en: 'Disjointed dark grid with image artifacts, inconsistent typeweights, and no medical accessibility compliance.',
          },
          afterNote: {
            ru: 'Структурное описание лечения, прозрачная подача процедур и встроенная по ГОСТ версия для слабовидящих в один клик.',
            en: 'Structured treatment hierarchy, crisp clinical visuals, and one-click GOST accessibility mode for visually impaired patients.',
          },
        },
        {
          id: 'trust',
          label: { ru: '04 · Доверие к клинике', en: '04 · Clinic Trust' },
          beforeSrc: '/assets/aistudio/Screenshot_2026-02-13_213718_f71eaa19.webp',
          afterSrc: '/assets/aistudio/Screenshot_2026-05-16_184441_cc36e6e8.webp',
          beforeNote: {
            ru: 'Повторяющиеся фотографии в разделе хирургии и агрессивные голубые плашки без чёткой иерархии смыслов.',
            en: 'Duplicated stock imagery in the surgery section and jarring neon buttons lacking clear visual hierarchy.',
          },
          afterNote: {
            ru: 'Акцент на 15+ летнем опыте врачей, деликатный семейный символ в синей палитре и понятные преимущества клиники.',
            en: 'Focus on 15+ years of clinical expertise, gentle blue family emblem, and scannable patient trust pillars.',
          },
        },
      ],
      extraPlates: [
        {
          src: '/assets/aistudio/Screenshot_2026-05-16_184601_83facf63.webp',
          tag: 'MAPS & CONTACTS',
          caption: {
            ru: 'Обновлённая презентация ООО «Доктор Филатов», Яндекс Карты (ул. Бекетова, 36) и яркие синие контактные блоки',
            en: 'Clean clinic branding, Yandex Maps integration (Beketova 36, Nizhny Novgorod), and bold blue contact cards',
          },
        },
        {
          src: '/assets/aistudio/Screenshot_2026-05-16_184623_cacacf6b.png',
          tag: 'CONVERSION & 152-FZ',
          caption: {
            ru: 'Сквозная форма заявки, доступная с любого экрана сайта — прямой поток обращений в клинику по стандарту ФЗ-152',
            en: 'Omnipresent booking form reachable from any page — direct clinic lead routing compliant with medical privacy law',
          },
        },
        {
          src: '/assets/aistudio/Screenshot_2026-02-13_213359_05ebf98d.webp',
          tag: 'ARCHIVE · BEFORE',
          caption: {
            ru: 'Исходный вид раздела протезирования до ребрендинга: иллюстрация того, почему клинике требовалась полная пересборка UX',
            en: 'Original prosthetics page before rebrand: illustrating why a complete structural overhaul was required',
          },
        },
      ],
    },
    title: {
      ru: 'Редизайн Сайта Стоматология Семья',
      en: 'Semya Dental Clinic — Website Redesign',
    },
    subtitle: {
      ru: 'Многостраничный ребрендинг клиники в Нижнем Новгороде: Figma, Tilda, чистый код, SEO и ГОСТ',
      en: 'Multi-page rebrand for a family dental clinic in Nizhny Novgorod: Figma stack, Tilda, custom code, SEO & GOST compliance',
    },
    task: {
      ru: 'Провести полный многостраничный ребрендинг сайта стоматологической клиники «Семья» (Нижний Новгород): разработать единый Figma-стек дизайна, собрать сайт на Tilda с доработками на коде, адаптировать под все экраны, настроить SEO и прямое получение заявок.',
      en: 'Execute a complete multi-page website rebrand for Semya dental clinic in Nizhny Novgorod: build a full Figma design system, implement on Tilda with custom code, optimize SEO, connect direct booking workflows, and ensure full mobile responsiveness.',
    },
    problem: {
      ru: 'Прежний сайт имел критически устаревший и неудобный UI/UX: серые градиенты с резким неоном, нечитаемый рукописный шрифт, дублирующиеся фото и хаотичная навигация вызывали недоверие, а в поиске сайт не ранжировался вообще.',
      en: 'The legacy website suffered from broken UI/UX: dark gray gradients, harsh cyan glow, illegible script typography, duplicated stock photos, and practically zero organic visibility in search engines.',
    },
    concept: {
      ru: 'Из трёх предложенных визуальных концепций мы с клиникой выбрали «больничный модный минимализм» — много чистого воздуха, крупные 3D-иллюстрации и выверенный синий контраст из логотипа клиники. Сквозной сценарий позволяет перейти к заявке из любой точки сайта.',
      en: 'Out of three presented directions, we chose "modern clinical minimalism" — generous white space, large 3D dental renders, crisp royal-blue contrast rooted in the clinic mark, and an omnipresent path to booking from every page.',
    },
    processStages: [
      {
        label: { ru: 'Этап 01', en: 'Phase 01' },
        title: { ru: 'Аудит и 3 дизайн-концепции в Figma', en: 'UX Audit & 3 Figma Directions' },
        description: {
          ru: 'Разобрали старый сайт и собрали полный дизайн-стек в Figma с 3 разными визуальными направлениями, утвердив чистый медицинский минимализм.',
          en: 'Audited the legacy site and built a complete Figma stack exploring 3 visual territories before locking modern clinical minimalism.',
        },
      },
      {
        label: { ru: 'Этап 02', en: 'Phase 02' },
        title: { ru: 'Tilda + кастомный код и заявки', en: 'Tilda + Custom Code & Lead Routing' },
        description: {
          ru: 'Перенесли многостраничную архитектуру на Tilda с подключением кастомных скриптов: заявки приходят напрямую администраторам клиники с любого раздела.',
          en: 'Implemented the multi-page architecture on Tilda enhanced with custom scripts routing patient inquiries directly to the clinic from any page.',
        },
      },
      {
        label: { ru: 'Этап 03', en: 'Phase 03' },
        title: { ru: 'SEO, мобильный адаптив и ГОСТ', en: 'SEO Setup, Mobile & GOST Accessibility' },
        description: {
          ru: 'Выполнили полную SEO-оптимизацию для выдачи в НН, проработали мобильные брейкпоинты и интегрировали версию для слабовидящих по требованиям ГОСТ.',
          en: 'Configured full local SEO visibility, responsive mobile layouts, and mandatory Russian medical GOST accessibility controls.',
        },
      },
    ],
    visualSystemNotes: {
      ru: 'Больничный минимализм строится на контрасте стерильного белого пространства (#FFFFFF), глубокого ночного индиго (#0A1322) и живого синего акцента (#155EEF), чтобы пациент сразу чувствовал порядок, заботу и технологичность.',
      en: 'Clinical minimalism balances sterile white space (#FFFFFF) with deep navy (#0A1322) and vibrant royal blue (#155EEF) to communicate precision, care, and trustworthiness.',
    },
    typographySpec: {
      display: 'Inter · Clean Medical Sans',
      body: 'System Grotesque · GOST Contrast',
      palette: ['#FFFFFF', '#0A1322', '#155EEF', '#00C6FF'],
    },
    graphicDecisions: [
      {
        ru: 'Сквозная точка входа на запись: на каждой странице, в шапке и в любом сценарии пациент в 1 клик попадает к форме заявки.',
        en: 'Omnipresent booking access: patients can jump straight to the appointment form from any screen or section in one click.',
      },
      {
        ru: 'Крупные 3D-объекты (имплант, элайнеры, кариес) на чистых контрастных подложках заменили разрозненные стоковые фото.',
        en: 'Clean large 3D renders (implant assembly, aligners, dental models) replaced fragmented stock photography.',
      },
      {
        ru: 'Встроенная версия для слабовидящих и юридические согласия в соответствии со стандартами ГОСТ и ФЗ-152 для медучреждений.',
        en: 'Integrated visual-impairment accessibility widget and compliant legal consent forms per medical GOST standards.',
      },
    ],
    applications: [
      { ru: 'Многостраничный веб-сайт (Tilda + Code)', en: 'Multi-Page Website (Tilda + Code)' },
      { ru: 'Полный дизайн-стек и компоненты в Figma', en: 'Full Figma Design Stack & System' },
      { ru: 'Техническое SEO и прямая маршрутизация заявок', en: 'SEO Architecture & Direct Lead Scripts' },
      { ru: 'Мобильная версия и режим ГОСТ для слабовидящих', en: 'Mobile Responsive & GOST Accessibility Mode' },
    ],
  },
  {
    id: 'slot-02',
    slug: 'wb-ozon-marketplace-typography',
    slotCode: 'WB · OZON',
    watermarkWord: 'ИНФОГРАФИКА',
    isSlotPlaceholder: false,
    category: 'graphic',
    categoryLabel: {
      ru: 'Карточки WB / Ozon · Типографика',
      en: 'WB / Ozon Cards · Commercial Typography',
    },
    year: '2025—2026 · E-COMMERCE',
    layoutVariant: 'chromatic-essay',
    gridSpan: 'tall',
    theme: {
      bg: '#1D1E26',
      surface: '#111218',
      ink: '#EFEFE9',
      accent: '#FF4393',
      isDark: true,
    },
    coverImage: '/assets/aistudio/image_cf7f3a44.webp',
    coverFit: 'contain',
    coverBg: '#FFFFFF',
    coverElevation: true,
    preserveTypographyMedia: true,
    heroImage: '/assets/aistudio/4_becce05d.webp',
    secondaryImages: [
      '/assets/aistudio/______d804c5ad.webp',
      '/assets/aistudio/f_64769fa72e404262_19048e6c.webp',
    ],
    marketplaceSeries: [
      {
        id: 'fen',
        code: '01',
        name: { ru: 'Фен Supersonic', en: 'Supersonic Hair Dryer' },
        productType: {
          ru: 'Бьюти-техника · 3 слайда инфографики + промо-обложка',
          en: 'Beauty Tech · 3 Infographic Slides + Promo Spread',
        },
        marketplaceTag: 'WILDBERRIES · 3:4',
        palette: ['#1E2028', '#D92B7A', '#F4A9C8', '#EFEFEF'],
        typographyLogic: {
          ru: 'Монументальный акцидентный заголовок «ФЕН SUPERSONIC» в нежно-розовом оттенке сразу отделяет премиальный прибор от тёмного графитового фона, а наклонный курсив задаёт динамику потока воздуха.',
          en: 'Monumental soft-pink display lettering «ФЕН SUPERSONIC» lifts the product above deep charcoal, paired with dynamic italics echoing airflow.',
        },
        hierarchyNote: {
          ru: '1-й экран фиксирует главные цифры (110 000 об/мин, 5 насадок, 2.8 м), 2-й визуализирует технологию Air Multiplier в разрезе, 3-й системно раскрывает назначение каждой насадки.',
          en: 'Slide 1 anchors hero specs (110k RPM, 5 nozzles, 2.8m cord), Slide 2 dissects Air Multiplier airflow, and Slide 3 maps all 5 magnetic attachments.',
        },
        spreadImage: {
          src: '/assets/aistudio/7_da188c0a.webp',
          caption: {
            ru: 'Презентация карточки «Фен Supersonic» с 3D-хромом в палитре фуксии',
            en: 'Supersonic hero card presentation framed with fuchsia chrome 3D rings',
          },
        },
        slides: [
          {
            src: '/assets/aistudio/image_cf7f3a44.webp',
            label: { ru: 'Слайд 01 · Обложка и УТП', en: 'Slide 01 · Hero & USPs' },
          },
          {
            src: '/assets/aistudio/image_5487a938.webp',
            label: { ru: 'Слайд 02 · Air Multiplier', en: 'Slide 02 · Air Multiplier' },
          },
          {
            src: '/assets/aistudio/image_777f7ecf.webp',
            label: { ru: 'Слайд 03 · 5 насадок', en: 'Slide 03 · 5 Attachments' },
          },
        ],
      },
      {
        id: 'iphone',
        code: '02',
        name: { ru: 'iPhone 16 Plus', en: 'Apple iPhone 16 Plus' },
        productType: {
          ru: 'Электроника · Минималистичная типографика и чистый воздух',
          en: 'Consumer Tech · Architectural Grid & Light Minimalism',
        },
        marketplaceTag: 'OZON / WB · 3:4',
        palette: ['#EDEDEF', '#16171A', '#1385EB', '#FFFFFF'],
        typographyLogic: {
          ru: 'Стерильная типографика в духе Apple-гротеска без визуального шума: крупные якорные цифры «27 часов» и «48 МП» заключены в мягкие белые плашки, а полупрозрачный фоновый текст задаёт глубину.',
          en: 'Clean grotesque hierarchy inspired by flagship tech packaging: anchor metrics «27h» and «48 MP» sit on crisp white cards above watermarked backdrop type.',
        },
        hierarchyNote: {
          ru: 'Обложка мгновенно считывается даже на мелкой превью в выдаче маркетплейса: модель, процессор A18 Bionic, 512 ГБ, автономность и плашка «Оригинал».',
          en: 'Built for micro-thumbnail legibility in marketplace search: instant read on model tier, A18 Bionic, 512 GB capacity, battery life, and authenticity badge.',
        },
        spreadImage: {
          src: '/assets/aistudio/______d804c5ad.webp',
          caption: {
            ru: 'Серия из 3 карточек iPhone 16 Plus в студийной композиции с 3D-хромом',
            en: 'Three-card iPhone 16 Plus series showcase with brushed chrome geometry',
          },
        },
        slides: [
          {
            src: '/assets/aistudio/image_ccc7c982.webp',
            label: { ru: 'Слайд 01 · Главная 16 Plus', en: 'Slide 01 · 16 Plus Hero' },
          },
          {
            src: '/assets/aistudio/image_d9093fc8.webp',
            label: { ru: 'Слайд 02 · Зум и камера', en: 'Slide 02 · 3x Optical Zoom' },
          },
          {
            src: '/assets/aistudio/image_51a28b86.webp',
            label: { ru: 'Слайд 03 · 5 оттенков', en: 'Slide 03 · Color Lineup' },
          },
        ],
      },
      {
        id: 'mouse',
        code: '03',
        name: { ru: 'Мышка G Pro X', en: 'Logitech G Pro X Mouse' },
        productType: {
          ru: 'Гейминг · Тёмный киберспорт-контраст и техническая сетка',
          en: 'Esports Gear · High-Contrast Dark UI Grid',
        },
        marketplaceTag: 'OZON / WB · 3:4',
        palette: ['#090B0E', '#D8DDE4', '#00A8E8', '#1A242D'],
        typographyLogic: {
          ru: 'Крупный контурный и залитый заголовок «G PRO X SUPERLIGHT» дополнен тонким голубым контурным набором справа и монолитной типографикой характеристик по левому краю.',
          en: 'Bold «G PRO X SUPERLIGHT» lockup balanced with cyan outline backdrop letters on the right and an ordered left-aligned spec column.',
        },
        hierarchyNote: {
          ru: 'Каждый слайд акцентирует ключевые триггеры киберспортсменов: ультралёгкий вес 63 г (с визуалом пера), сенсор HERO 25K DPI и автономность 70 часов по LIGHTSPEED.',
          en: 'Targets core gamer purchase triggers across every panel: featherlight 63g chassis, HERO 25K DPI sensor chip render, and 70-hour LIGHTSPEED wireless life.',
        },
        spreadImage: {
          src: '/assets/aistudio/f_64769fa72e404262_19048e6c.webp',
          caption: {
            ru: 'Разворот серии карточек Logitech G Pro X Superlight (обложка + бенто-сетка характеристик)',
            en: 'Logitech G Pro X Superlight full card lineup with bento spec grid',
          },
        },
        slides: [],
      },
      {
        id: 'kettle',
        code: '04',
        name: { ru: 'Чайник Xiaomi', en: 'Xiaomi Mi Smart Kettle Pro' },
        productType: {
          ru: 'Техника для дома · Тёплая интерьерная подача и шкала температур',
          en: 'Smart Home · Warm Editorial Grid & Temp Scale',
        },
        marketplaceTag: 'WB / OZON · 3:4',
        palette: ['#E9E7DF', '#1A1B19', '#FF6900', '#389E5D'],
        typographyLogic: {
          ru: 'Спокойная интерьерная база в паре с крупным гротеском «Mi Smart Kettle Pro», аккуратными иконками и цветовой температурной шкалой от 40°C до 90°C для разных напитков.',
          en: 'Warm architectural stone canvas paired with clean sans headlines, structured feature icons, and a color-coded 40°C–90°C brewing dial.',
        },
        hierarchyNote: {
          ru: 'Сложные технические плюсы (приложение Xiaomi Home, 1800 Вт, объём 1.5 л, сталь 304) разложены в мгновенно считываемые сценарии для семьи, чая и детского питания.',
          en: 'Translates technical specs (Xiaomi Home app, 1800W heating, 1.5L capacity, 304 steel) into practical daily scenarios for tea and family use.',
        },
        spreadImage: {
          src: '/assets/aistudio/_______131886f0.webp',
          caption: {
            ru: 'Комплексная серия карточек Xiaomi Mi Smart Kettle Pro с экранными инфографиками и 3D-разрезами',
            en: 'Xiaomi Mi Smart Kettle Pro full card suite showing UI screen, thermal dial & 304 steel cutaways',
          },
        },
        slides: [],
      },
      {
        id: 'socks',
        code: '05',
        name: { ru: 'Носки Хлопок', en: 'Artisan Patterned Socks' },
        productType: {
          ru: 'Одежда и аксессуары · Динамичная векторная типографика и макро-лупа',
          en: 'Apparel · Playful Dynamic Typography & Fabric Loupe',
        },
        marketplaceTag: 'WILDBERRIES · 3:4',
        palette: ['#E6E7EA', '#0C1220', '#FF9F29', '#008C6B'],
        typographyLogic: {
          ru: 'Массивный жирный «Комплект» и крупный размерный диапазон «35–45» в связке с лёгкой разрядкой «МУЖСКИХ НОСКОВ» и плашкой «100% хлопок» работают на мгновенный клик из ленты.',
          en: 'Heavy black «Комплект» and bold size indicator «35–45» contrast with tracked-out teal sublabels and crisp cotton fabric badges.',
        },
        hierarchyNote: {
          ru: 'Первый слайд цепляет цветом и фактом (2 пары в наборе + размеры), а второй с помощью крупной круглой макро-лупы доказывает качество вязки и плотности трикотажа.',
          en: 'Card 1 hooks shoppers with vibrant pattern contrast and pack count, while Card 2 uses a giant circular weave loupe to prove fabric quality.',
        },
        slides: [
          {
            src: '/assets/aistudio/image_df80af25.webp',
            label: { ru: 'Слайд 01 · Обложка 35–45', en: 'Slide 01 · Pack Cover 35–45' },
          },
          {
            src: '/assets/aistudio/image_dd1d2749.webp',
            label: { ru: 'Слайд 02 · Макро-лупа ткани', en: 'Slide 02 · Weave Close-Up' },
          },
        ],
      },
    ],
    title: {
      ru: 'Карточки WB / Ozon — Типографика и Инфографика',
      en: 'WB & Ozon Marketplace Cards — Typography Systems',
    },
    subtitle: {
      ru: 'Пять товарных серий с разным визуальным характером: от строгого техно-минимализма до игровой графики',
      en: 'Five product series tailored to marketplace conversion: from Apple-grade minimalism to kinetic gaming visuals',
    },
    task: {
      ru: 'Разработать серию продающих карточек и инфографики для Wildberries и Ozon по 5 разным нишам — фен Supersonic, iPhone 16 Plus, игровая мышь Logitech G Pro X, умный чайник Xiaomi и комплект носков, — подбирая индивидуальную типографику под психологию покупателя каждого товара.',
      en: 'Design high-converting Wildberries and Ozon card decks across 5 distinct product categories — Supersonic dryer, iPhone 16 Plus, Logitech G Pro X mouse, Xiaomi kettle, and cotton socks — adapting typography and hierarchy to each buyer mindset.',
    },
    problem: {
      ru: 'В ленте маркетплейсов карточки с одинаковыми «шаблонными» плашками сливаются в визуальный шум. Покупатель пролистывает товар за 0.8 секунды, если типографика не считывается с первого взгляда или перегружена мелким текстом.',
      en: 'Standard templated marketplace cards blend into visual noise. Shoppers scroll past in under a second unless the display type hooks attention instantly and key specs stay legible at thumbnail scale.',
    },
    concept: {
      ru: 'Для каждой из 5 категорий создана своя оптическая и типографическая система: акцентные цифры-якоря, жёсткая сетка преимуществ (до 3–5 тезисов на слайд), контраст светлых и тёмных палитр и студийная презентация серий на фоне 3D-хрома.',
      en: 'Each of the 5 product lines gets a custom optical system: bold numerical anchors, disciplined 3–5 bullet rhythm per slide, category-tuned palettes, and studio spreads framed with 3D liquid chrome.',
    },
    processStages: [
      {
        label: { ru: 'Этап 01', en: 'Phase 01' },
        title: { ru: 'Смыслы и УТП-матрица', en: 'Buyer Triggers & Copy Hierarchy' },
        description: {
          ru: 'Сократили длинные описания до ударных заголовков, числовых якорей (63 г, 110 000 об/мин, 27 ч, 1.5 л, 100% хлопок) и понятных бытовых сценариев.',
          en: 'Distilled dense specs into punchy headlines, numeric anchors (63g, 110k RPM, 27h, 1.5L, 100% cotton), and scannable use cases.',
        },
      },
      {
        label: { ru: 'Этап 02', en: 'Phase 02' },
        title: { ru: 'Характерная типографика', en: 'Category Typography Pairing' },
        description: {
          ru: 'Подобрали шрифтовые интонации под нишу: техно-гротеск для iPhone и Logitech, мягкую динамику для Supersonic, тёплую аккуратность для Xiaomi и сочный постерный гротеск для носков.',
          en: 'Tailored type voice per niche: surgical grotesque for iPhone & Logitech, fluid motion for Supersonic, calm editorial order for Xiaomi, and punchy poster weight for socks.',
        },
      },
      {
        label: { ru: 'Этап 03', en: 'Phase 03' },
        title: { ru: 'Склейка 3D-рендеров и портфолио', en: 'Retouching & 3D Chrome Spreads' },
        description: {
          ru: 'Выстроили глубину кадра (лупы ткани, 3D-разрез двигателя и стальной колбы), проверили читаемость в миниатюре и оформили презентационные развороты.',
          en: 'Built depth with weave loupes and cutaway product renders, stress-tested thumbnail legibility, and composed brushed-chrome presentation spreads.',
        },
      },
    ],
    visualSystemNotes: {
      ru: 'Главная сила инфографики на маркетплейсах — не количество текста, а иерархия масштаба: 1 главный триггер размером с плакат, 2–3 контрастных числа и чистый силуэт товара с отрывом от фона.',
      en: 'High-converting marketplace design relies on scale contrast rather than text volume: one poster-sized hero hook, 2–3 high-contrast numeric anchors, and clean figure-ground separation.',
    },
    typographySpec: {
      display: 'Display Neo-Grotesque · Wide & Poster Weights',
      body: 'Clean Technical Sans · Bento & Spec Grids',
      palette: ['#1D1E26', '#FF4393', '#1385EB', '#FF6900'],
    },
    graphicDecisions: [
      {
        ru: 'Разнесение масштаба текста в 4–6 раз между главным триггером («ФЕН», «63 г», «iPhone», «Комплект») и пояснительными подписями.',
        en: 'Establishing a 4x–6x typographic scale ratio between the primary visual hook and supporting feature captions.',
      },
      {
        ru: 'Адаптация композиции под вертикальный формат 3:4 с учётом безопасных полей и бейджей WB/Ozon в ленте поиска.',
        en: 'Composing within the 3:4 marketplace aspect ratio with protected safe zones for search-feed badges and price tags.',
      },
      {
        ru: 'Визуализация невидимых свойств товара через графику: воздушный поток Air Multiplier, чип HERO 25K, шкала заваривания 40–90°C и лупа хлопка.',
        en: 'Visualizing hidden product value directly: Air Multiplier airflow vectors, HERO 25K chip macro, 40–90°C brew dial, and cotton weave loupe.',
      },
    ],
    applications: [
      { ru: 'Серия «Фен Supersonic» (3 слайда + промо-баннер)', en: 'Supersonic Hair Dryer Deck (3 Slides + Promo)' },
      { ru: 'Серия «Apple iPhone 16 Plus» (3 слайда)', en: 'Apple iPhone 16 Plus Deck (3 Slides)' },
      { ru: 'Серия «Logitech G Pro X Superlight» (гейминг-линейка)', en: 'Logitech G Pro X Superlight Gaming Suite' },
      { ru: 'Серия «Xiaomi Mi Smart Kettle Pro» (бытовая техника)', en: 'Xiaomi Mi Smart Kettle Pro Smart Home Deck' },
      { ru: 'Серия «Комплект мужских носков» (2 слайда + макро)', en: 'Patterned Socks Pack (2 Slides + Fabric Loupe)' },
    ],
  },
  {
    id: 'slot-03',
    slug: 'mozhno-oshibatsya-encyclopedia',
    slotCode: 'ЗИН · 30 ГЛАВ',
    watermarkWord: 'ОШИБАТЬСЯ',
    isSlotPlaceholder: false,
    category: 'graphic',
    categoryLabel: {
      ru: 'Книга и вёрстка · Энциклопедия · Коллаж',
      en: 'Editorial Book · Graphic Design · Zine',
    },
    year: '2026 · 61 СТРАНИЦА',
    layoutVariant: 'brutalist-grid',
    gridSpan: 'square',
    theme: {
      bg: '#0B3AA4',
      surface: '#082C7D',
      ink: '#F3EBDC',
      accent: '#F6E238',
      isDark: true,
    },
    coverImage: '/assets/aistudio/image_15316a87.webp',
    coverFit: 'contain',
    coverBg: '#FFFFFF',
    coverElevation: true,
    preserveTypographyMedia: true,
    heroImage: '/assets/encyclopedia/spread-01.jpg',
    secondaryImages: [
      '/assets/encyclopedia/spread-09.jpg',
      '/assets/encyclopedia/spread-22.jpg',
    ],
    encyclopediaData: {
      pdfUrl: '/assets/aistudio/____2_0627acdf.pdf',
      spreads: [
        {
          chapter: '01',
          pages: '02–03',
          src: '/assets/encyclopedia/spread-01.jpg',
          title: { ru: 'С чего начать?', en: 'Where to Start?' },
          takeaway: { ru: 'Сначала смысл. Потом пиксели.', en: 'Meaning first. Pixels second.' },
        },
        {
          chapter: '02',
          pages: '04–05',
          src: '/assets/encyclopedia/spread-02.jpg',
          title: { ru: 'Вкус можно тренировать', en: 'Taste Can Be Trained' },
          takeaway: { ru: 'Сохраняй причину, а не картинку.', en: 'Save the reason, not just the picture.' },
        },
        {
          chapter: '03',
          pages: '06–07',
          src: '/assets/encyclopedia/spread-03.jpg',
          title: { ru: 'Бриф без тумана', en: 'A Brief Without Fog' },
          takeaway: { ru: 'Ясная задача экономит переделки.', en: 'Clear goals save endless revisions.' },
        },
        {
          chapter: '04',
          pages: '08–09',
          src: '/assets/encyclopedia/spread-04.jpg',
          title: { ru: 'Идея выдерживает одну фразу', en: 'An Idea Fits One Sentence' },
          takeaway: { ru: 'Идея выбирает за тебя.', en: 'A strong idea chooses for you.' },
        },
        {
          chapter: '05',
          pages: '10–11',
          src: '/assets/encyclopedia/spread-05.jpg',
          title: { ru: 'Иерархия внимания', en: 'Hierarchy of Attention' },
          takeaway: { ru: 'Если главное всё, главного нет.', en: 'If everything shouts, nothing leads.' },
        },
        {
          chapter: '06',
          pages: '12–13',
          src: '/assets/encyclopedia/spread-06.jpg',
          title: { ru: 'Сетка даёт свободу', en: 'The Grid Gives Freedom' },
          takeaway: { ru: 'Правило делает отклонение заметным.', en: 'Rules make breaking them visible.' },
        },
        {
          chapter: '07',
          pages: '14–15',
          src: '/assets/encyclopedia/spread-07.jpg',
          title: { ru: 'Воздух тоже работает', en: 'Whitespace Works Too' },
          takeaway: { ru: 'Воздух направляет взгляд.', en: 'Whitespace directs the eye.' },
        },
        {
          chapter: '08',
          pages: '16–17',
          src: '/assets/encyclopedia/spread-08.jpg',
          title: { ru: 'Контраст и ритм', en: 'Contrast & Rhythm' },
          takeaway: { ru: 'Сначала ритм. Потом сбой.', en: 'Establish rhythm before the break.' },
        },
        {
          chapter: '09',
          pages: '18–19',
          src: '/assets/encyclopedia/spread-09.jpg',
          title: { ru: 'Шрифт — это голос', en: 'Type Is Voice' },
          takeaway: { ru: 'Сначала прочитай. Потом оцени силуэт.', en: 'Readability first, silhouette second.' },
        },
        {
          chapter: '10',
          pages: '20–21',
          src: '/assets/encyclopedia/spread-10.jpg',
          title: { ru: 'Текст должен дышать', en: 'Text Needs Room to Breathe' },
          takeaway: { ru: 'Читаемость важнее вместимости.', en: 'Legibility beats packing density.' },
        },
        {
          chapter: '11',
          pages: '22–23',
          src: '/assets/encyclopedia/spread-11.jpg',
          title: { ru: 'Мелочи делают набор', en: 'Details Make the Typesetting' },
          takeaway: { ru: 'Аккуратность — это последовательность.', en: 'Precision is consistency.' },
        },
        {
          chapter: '12',
          pages: '24–25',
          src: '/assets/encyclopedia/spread-12.jpg',
          title: { ru: 'Буквы тоже формы', en: 'Letters Are Shapes Too' },
          takeaway: { ru: 'Глаз проверяет линейку.', en: 'The eye overrules the ruler.' },
        },
        {
          chapter: '13',
          pages: '26–27',
          src: '/assets/encyclopedia/spread-13.jpg',
          title: { ru: 'Цвет получает роль', en: 'Every Color Has a Role' },
          takeaway: { ru: 'У каждого цвета есть работа.', en: 'Assign every swatch a job.' },
        },
        {
          chapter: '14',
          pages: '28–29',
          src: '/assets/encyclopedia/spread-14.jpg',
          title: { ru: 'Контраст можно измерить', en: 'Contrast Can Be Measured' },
          takeaway: { ru: 'Проверяй то, что можно проверить.', en: 'Test what is measurable.' },
        },
        {
          chapter: '15',
          pages: '30–31',
          src: '/assets/encyclopedia/spread-15.jpg',
          title: { ru: 'Изображение рассказывает', en: 'Imagery Tells the Story' },
          takeaway: { ru: 'Кадр — это решение о смысле.', en: 'Framing is a meaning decision.' },
        },
        {
          chapter: '16',
          pages: '32–33',
          src: '/assets/encyclopedia/spread-16.jpg',
          title: { ru: 'Иллюстрация как система', en: 'Illustration as a System' },
          takeaway: { ru: 'Ограничение рождает характер.', en: 'Constraints forge character.' },
        },
        {
          chapter: '17',
          pages: '34–35',
          src: '/assets/encyclopedia/spread-17.jpg',
          title: { ru: 'Референс не равен ответу', en: 'A Reference Is Not the Answer' },
          takeaway: { ru: 'Заимствуй принцип. Создавай решение.', en: 'Borrow the principle, build your own answer.' },
        },
        {
          chapter: '18',
          pages: '36–37',
          src: '/assets/encyclopedia/spread-18.jpg',
          title: { ru: 'Эскиз дешевле переделки', en: 'Sketches Beat Late Rework' },
          takeaway: { ru: 'Проверяй дёшево, пока можно.', en: 'Explore fast before polishing.' },
        },
        {
          chapter: '19',
          pages: '38–39',
          src: '/assets/encyclopedia/spread-19.jpg',
          title: { ru: 'Файл — рабочее место', en: 'The File Is Your Workspace' },
          takeaway: { ru: 'Хорошая система переживает дедлайн.', en: 'Clean files outlive the deadline.' },
        },
        {
          chapter: '20',
          pages: '40–41',
          src: '/assets/encyclopedia/spread-20.jpg',
          title: { ru: 'Один элемент, много мест', en: 'One Component, Many Places' },
          takeaway: { ru: 'Повторяй правила, а не ошибки.', en: 'Reuse rules, not mistakes.' },
        },
        {
          chapter: '21',
          pages: '42–43',
          src: '/assets/encyclopedia/spread-21.jpg',
          title: { ru: 'Плакат читают издалека', en: 'Posters Are Read from Afar' },
          takeaway: { ru: 'Плакату дают секунды.', en: 'A poster only gets seconds.' },
        },
        {
          chapter: '22',
          pages: '44–45',
          src: '/assets/encyclopedia/spread-22.jpg',
          title: { ru: 'Айдентика живёт в серии', en: 'Identity Lives in Series' },
          takeaway: { ru: 'Узнавание складывается из повторов.', en: 'Recognition is built through repetition.' },
        },
        {
          chapter: '23',
          pages: '46–47',
          src: '/assets/encyclopedia/spread-23.jpg',
          title: { ru: 'Интерфейс — это поведение', en: 'Interface Is Behavior' },
          takeaway: { ru: 'Проектируй то, что случается.', en: 'Design every state that happens.' },
        },
        {
          chapter: '24',
          pages: '48–49',
          src: '/assets/encyclopedia/spread-24.jpg',
          title: { ru: 'Проверь на человеке', en: 'Test on a Real Person' },
          takeaway: { ru: 'Смотри, что делают люди.', en: 'Watch what people actually do.' },
        },
        {
          chapter: '25',
          pages: '50–51',
          src: '/assets/encyclopedia/spread-25.jpg',
          title: { ru: 'Критика — рабочий инструмент', en: 'Critique Is a Working Tool' },
          takeaway: { ru: 'Защищай решение, а не самолюбие.', en: 'Defend the decision, not your ego.' },
        },
        {
          chapter: '26',
          pages: '52–53',
          src: '/assets/encyclopedia/spread-26.jpg',
          title: { ru: 'Презентация ведёт мысль', en: 'Presentation Guides Thought' },
          takeaway: { ru: 'Показывай логику выбора.', en: 'Show the logic behind your choices.' },
        },
        {
          chapter: '27',
          pages: '54–55',
          src: '/assets/encyclopedia/spread-27.jpg',
          title: { ru: 'Печать любит подготовку', en: 'Print Rewards Preparation' },
          takeaway: { ru: 'Экспорт — часть дизайна.', en: 'Production export is part of design.' },
        },
        {
          chapter: '28',
          pages: '56–57',
          src: '/assets/encyclopedia/spread-28.jpg',
          title: { ru: 'Передача без сюрпризов', en: 'Handoff Without Surprises' },
          takeaway: { ru: 'Работа закончена, когда ею пользуются.', en: 'The job finishes when others can use it.' },
        },
        {
          chapter: '29',
          pages: '58–59',
          src: '/assets/encyclopedia/spread-29.jpg',
          title: { ru: 'Портфолио показывает мышление', en: 'Portfolio Shows Thinking' },
          takeaway: { ru: 'Покажи, как ты думаешь.', en: 'Show how your mind works.' },
        },
        {
          chapter: '30',
          pages: '60–61',
          src: '/assets/encyclopedia/spread-30.jpg',
          title: { ru: 'Расти можно без гонки', en: 'Grow Without Rushing' },
          takeaway: { ru: 'Следующая версия важнее идеальной.', en: 'The next iteration beats perfection.' },
        },
      ],
    },
    title: {
      ru: 'Можно ошибаться — Энциклопедия для первокурсников',
      en: 'Okay to Make Mistakes — Designer’s First-Year Encyclopedia',
    },
    subtitle: {
      ru: 'Авторская 61-страничная книга-зин из 30 разворотов о базе дизайна: от брифа и сетки до допечатки и портфолио',
      en: '61-page risograph-style editorial book across 30 illustrated spreads covering core design foundations',
    },
    task: {
      ru: 'Создать цельную, живую и визуально нескучную книгу-проводник для начинающих дизайнеров «Можно ошибаться»: объединить 30 фундаментальных тем профессии в тактильную коллажную вёрстку с примерами, практическими заданиями и рукописными заметками на полях.',
      en: 'Author and art-direct a tactile 30-spread beginner designer encyclopedia «Okay to Make Mistakes» — turning dry design theory into an engaging collage zine packed with case examples, try-it exercises, and handwritten margin notes.',
    },
    problem: {
      ru: 'Учебники по дизайну для первокурсников часто выглядят как сухие академические методички с перегруженными абзацами. Из-за страха сделать «неправильно» студенты застревают в сомнениях ещё до первого эскиза.',
      en: 'Introductory design textbooks often read like sterile academic manuals, making students freeze out of fear of breaking arbitrary rules before sketching a single idea.',
    },
    concept: {
      ru: 'Визуальный язык живого скетчбука в ризографической эстетике: рваная крафт-бумага, растровый халфтон, рукописные стрелки-ремарки и энергичная палитра (кобальт, неон-жёлтый, фуксия, киноварь). Каждый разворот построен как 1 правило → 1 метафора → «На примере» → «Попробуй».',
      en: 'A risograph-inspired sketchbook language: torn paper textures, halftone screens, handwritten annotations, and a bold CMYK-like ink system. Every spread follows one rhythm: core rule, visual metaphor, real example, and hands-on drill.',
    },
    processStages: [
      {
        label: { ru: 'Главы 01–10', en: 'Chapters 01–10' },
        title: { ru: 'Мышление, сетка и ритм', en: 'Mindset, Grid & Hierarchy' },
        description: {
          ru: 'Заложили фундамент: поиск смысла до пикселей, разбор брифа, тренировка насмотренности, воздух, контраст и дышащая вёрстка текста.',
          en: 'Built the structural base: purpose before pixels, fog-free briefs, taste training, spatial rhythm, and legible typesetting.',
        },
      },
      {
        label: { ru: 'Главы 11–20', en: 'Chapters 11–20' },
        title: { ru: 'Цвет, оптика и компоненты', en: 'Color, Optics & Components' },
        description: {
          ru: 'Раскрыли визуальную грамотность: кавычки-ёлочки и оптический кернинг «ЛА», роли цвета, проверку контраста WCAG 2.2, эскизы и порядок в файлах.',
          en: 'Detailed practical craft: punctuation accuracy, optical kerning, functional color roles, WCAG 2.2 contrast testing, rapid sketching, and clean files.',
        },
      },
      {
        label: { ru: 'Главы 21–30', en: 'Chapters 21–30' },
        title: { ru: 'Носители, защита и рост', en: 'Media, Handoff & Growth' },
        description: {
          ru: 'Довели книгу до реальной практики: плакат, серийная айдентика, состояния интерфейса, тесты на людях, вылеты 3 мм под печать и сборка портфолио.',
          en: 'Bridged into studio reality: posters, identity systems, UI edge states, user testing, 3mm print bleeds, handoff checklists, and portfolio storytelling.',
        },
      },
    ],
    visualSystemNotes: {
      ru: 'Единая 4-цветная «ризо-система» (кобальт #0B3AA4, ярко-жёлтый #F6E238, розовый #ED4B82, оранжевый #F05A24) на тёплой бумажной подложке (#F3EBDC) позволяет мгновенно отличать заголовок, блок примера, задание и иллюстрацию на всех 61 странице.',
      en: 'A unified 4-ink riso palette (cobalt #0B3AA4, paper yellow #F6E238, magenta #ED4B82, orange #F05A24) over textured cream stock (#F3EBDC) keeps all 61 pages rhythmic and effortlessly scannable.',
    },
    typographySpec: {
      display: 'Ultra Condensed Sans · Bold Collage',
      body: 'Clean Grotesque + Hand Margin Notes',
      palette: ['#F3EBDC', '#0B3AA4', '#F6E238', '#ED4B82'],
    },
    graphicDecisions: [
      {
        ru: 'Единый драматургический каркас всех 30 разворотов: гигантский номер с заголовком, текстовая колонка + рубрики «НА ПРИМЕРЕ» / «ПОПРОБУЙ» и полностраничная метафора.',
        en: 'Unified 30-spread dramaturgy pairing oversized numbered titles, scannable Example / Try-It boxes, and full-page visual metaphors.',
      },
      {
        ru: 'Живые рукописные пометки на полях и стрелки снимают академический пафос и превращают чтение в личный диалог с автором.',
        en: 'Hand-lettered margin scribbles and directional arrows break academic stiffness, reading like personal notes from a studio mentor.',
      },
      {
        ru: 'Сквозное обучение на реальных микро-артефактах: кириллица Д/Ж/Ы/Ф/Б, кернинг «ЛА», плёнки цвета, лупа WCAG и коробка доставки delivery.',
        en: 'Teaching through concrete visual artifacts: Cyrillic anatomy, optical kerning, color gels, WCAG magnifier, and a structured delivery box.',
      },
    ],
    applications: [
      { ru: 'Издание 61 стр. (30 двойных разворотов + PDF)', en: '61-Page Publication (30 Double Spreads + PDF)' },
      { ru: 'Серия авторских коллажных иллюстраций с нуля', en: 'Bespoke Collage & Halftone Illustration Series' },
      { ru: 'Методика упражнений «Попробуй» для студентов', en: '30 Hands-On First-Year Design Drills' },
      { ru: 'Печатный препресс и цифровая версия книги', en: 'Print-Ready Editorial Layout & Digital Edition' },
    ],
  },
  {
    id: 'slot-04',
    slug: 'logofolio-2024-2026',
    slotCode: 'ЛОГО · 10 ЗНАКОВ',
    watermarkWord: 'LOGOFOLIO',
    isSlotPlaceholder: false,
    category: 'logo',
    categoryLabel: {
      ru: 'Логофолио · Знаки · Монограммы',
      en: 'Logofolio · Marks & Symbols',
    },
    year: '2024–2026 · 10 ПЛАШЕК',
    layoutVariant: 'monograph',
    gridSpan: 'panorama',
    theme: {
      bg: '#346E71',
      surface: '#254E50',
      ink: '#EFEFE9',
      accent: '#2E302F',
      isDark: true,
    },
    coverImage: '/assets/aistudio/_______1_fb4c1100.png',
    coverFit: 'contain',
    coverBg: '#FFFFFF',
    coverElevation: false,
    preserveTypographyMedia: true,
    heroImage: '/assets/aistudio/1________b9d70268.png',
    secondaryImages: [
      '/assets/aistudio/3_4a5de5f7.png',
      '/assets/aistudio/7_1a85b4f3.png',
    ],
    logofolioData: {
      coverPlateSrc: '/assets/aistudio/1________b9d70268.png',
      plates: [
        {
          id: 'whale-note',
          code: 'MARK 01',
          year: '2024',
          brand: 'Whale Audio',
          niche: { ru: 'Музыкальный продакшн', en: 'Music Production' },
          cluster: 'craft',
          src: '/assets/aistudio/2_a410a25e.png',
          concept: {
            ru: 'Совмещение силуэта глубоководного кита и музыкальной ноты с флагом-хвостом: метафора массивного низкого звука, волны и студийного грува.',
            en: 'Combines a clean whale silhouette with an eighth-note flag tail — picturing deep sub-bass resonance, wave motion, and studio craft.',
          },
          formLogic: {
            ru: 'Цельный силуэт работает даже в 16px-фавиконе, а бирюзовая пунктирная перфорация задаёт живой акцент без перегрузки деталями.',
            en: 'The bold solid geometry scales cleanly down to favicons, punctuated by subtle slate-teal halftone dots.',
          },
        },
        {
          id: 'snap-focus',
          code: 'MARK 02',
          year: '2025',
          brand: 'SnapFocus',
          niche: { ru: 'Приложение для редактирования фото', en: 'Photo Editing App' },
          cluster: 'tech',
          src: '/assets/aistudio/2_1_6202e23c.png',
          concept: {
            ru: 'Шестилепестковая диафрагма объектива разделена по диагонали на две цветовые половины — процесс съёмки и мгновенной цветокоррекции.',
            en: 'A six-blade optical aperture split diagonally into two ink tones — representing capture paired with instant tonal editing.',
          },
          formLogic: {
            ru: 'Чёткие клинья диафрагмы создают энергичный вихрь вокруг белого центра, а слоган «Capture. Edit. Create!» поддержан акцентными точками.',
            en: 'Sharp radial geometry forms a tight central hexagon while teal punctuation anchors the three-word tagline.',
          },
        },
        {
          id: 'spin-cycle',
          code: 'MARK 03',
          year: '2025',
          brand: 'SpinCycle',
          niche: { ru: 'Велосипедный магазин', en: 'Bicycle Shop' },
          cluster: 'craft',
          src: '/assets/aistudio/3_4a5de5f7.png',
          concept: {
            ru: 'Велосипедное колесо и перекладины спиц разрезаны стремительной S-монограммой, сходящей на конус как шоссейный вираж.',
            en: 'A spoked bicycle wheel sliced diagonally by a taut S-monogram, echoing road speed and mechanical precision.',
          },
          formLogic: {
            ru: 'Двухцветное деление монограммы усиливает ощущение движения по кругу, а высокая антиква с кондёром в «SPIN CYCLE» даёт премиальный спортивный характер.',
            en: 'Two-tone split motion creates kinetic rotation above crisp high-contrast serif wordmark SPIN CYCLE.',
          },
        },
        {
          id: 'aroma-craft',
          code: 'MARK 04',
          year: '2025',
          brand: 'Aroma Craft',
          niche: { ru: 'Кофейня', en: 'Specialty Coffee & Roastery' },
          cluster: 'lifestyle',
          src: '/assets/aistudio/4_0cc79231.png',
          concept: {
            ru: 'Круглая эмблема обжарщика: кофейная чашка плавно переходит в зерно, обрамлена перекрещёнными совками для зёрен и вьющимся паром с листьями.',
            en: 'Roastery crest uniting a coffee cup cut with a roasted bean silhouette, crossed tasting scoops, and aromatic rising steam.',
          },
          formLogic: {
            ru: 'Классическая печать для крафтовых стаканчиков и упаковок зёрен — симметричный круг выдерживает тиснение и термопечать.',
            en: 'Stamp-ready circular symmetry designed to emboss cleanly onto roastery bags, sleeves, and cups.',
          },
        },
        {
          id: 'squiggle-studio',
          code: 'MARK 05',
          year: '2024',
          brand: 'Squiggle Studio',
          niche: { ru: 'Разработка игр', en: 'Indie Game Development' },
          cluster: 'tech',
          src: '/assets/aistudio/5_6e57edd7.png',
          concept: {
            ru: 'Игровой маскот-змейка из одной непрерывной гибкой линии превращается в живую петлю-дорожку с озорным взглядом.',
            en: 'A continuous playful serpentine path transforms into an expressive game studio mascot with bright eyes.',
          },
          formLogic: {
            ru: 'Изогнутый набор названия повторяет дугу тела персонажа, создавая дружелюбный инди-образ с запоминающимся силуэтом.',
            en: 'Curved display lettering hugs the creature’s arch, giving an unmistakable indie-game badge.',
          },
        },
        {
          id: 'double-click',
          code: 'MARK 06',
          year: '2026',
          brand: 'Double Click',
          niche: { ru: 'Креативное агентство', en: 'Creative Agency' },
          cluster: 'tech',
          src: '/assets/aistudio/5_1_5cd96f57.png',
          concept: {
            ru: 'Две смещённые литеры «K», пронзённые единым диагональным лучом: двойной импульс, двойная буква имени и щелчок смены кадра.',
            en: 'Twin interlocking K-stems pierced by a single diagonal stroke — embodying double momentum and a decisive click.',
          },
          formLogic: {
            ru: 'Жёсткая швейцарская модульность и плотный индустриальный гротеск «DOUBLE / CLICK» превращают знак в архитектурную решётку.',
            en: 'Structural modular geometry paired with compact condensed type turns the mark into an architectural grid.',
          },
        },
        {
          id: 'tool-thread',
          code: 'MARK 07',
          year: '2025',
          brand: 'Tool & Thread',
          niche: { ru: 'Творческая мастерская', en: 'Creative Studio & Workshop' },
          cluster: 'craft',
          src: '/assets/aistudio/6_d87289df.png',
          concept: {
            ru: 'Ассамбляж ремесленных инструментов — ножницы, клубок, игла с нитью, карандаш и киянка — собран в лёгкий органический букет.',
            en: 'Craft assemblage combining shears, yarn, needle-and-thread, pencil, and mallet into one balanced studio botanical silhouette.',
          },
          formLogic: {
            ru: 'Центральная игла с извилистой нитью связывает все инструменты по вертикальной оси симметрии с интеллигентной антиквенной подписью.',
            en: 'The central needle anchors orbiting craft tools along one spine above warm studio serif lettering.',
          },
        },
        {
          id: 'tuls-marine',
          code: 'MARK 08',
          year: '2025',
          brand: 'TULS Marine',
          niche: { ru: 'Парусный спорт', en: 'Sailing & Maritime Club' },
          cluster: 'craft',
          src: '/assets/aistudio/7_1a85b4f3.png',
          concept: {
            ru: 'Геральдический щит яхт-клуба: вертикальная колонка букв TULS уравновешивает два натянутых паруса и три дуги волн.',
            en: 'Nautical shield crest balancing stacked vertical TULS lettering alongside twin wind-filled sails and sweeping waves.',
          },
          formLogic: {
            ru: 'Высококонтрастный негативный спейс делает эмблему одинаково выразительной на вышивке яхтенной формы, бортах судов и цифровых флагах.',
            en: 'Bold negative-space cuts make the emblem equally crisp embroidered on apparel or scaled across yacht hulls.',
          },
        },
        {
          id: 'ascent-peak',
          code: 'MARK 09',
          year: '2026',
          brand: 'Ascent Peak',
          niche: { ru: 'Финансовые услуги', en: 'Financial Advisory & Growth' },
          cluster: 'lifestyle',
          src: '/assets/aistudio/8_4ec4da40.png',
          concept: {
            ru: 'Три пика, восходящие в монограмму «A»: внутренняя стрела роста указывает на вершину с белым заснеженным изломом.',
            en: 'Tri-peak geometry anchored inside an A-frame ascent, framing a clean upward chevron toward a crisp summit ridge.',
          },
          formLogic: {
            ru: 'Наклонный жирный гротеск с цветовой подсветкой первой «A» задаёт уверенную динамику финансовой стратегии.',
            en: 'Slanted display typography with a teal-tinted initial «A» underscores forward financial momentum.',
          },
        },
        {
          id: 'cloud-flow',
          code: 'MARK 10',
          year: '2025',
          brand: 'CloudFlow',
          niche: { ru: 'Облачный сервис', en: 'Cloud SaaS Platform' },
          cluster: 'tech',
          src: '/assets/aistudio/9_fc3426cb.png',
          concept: {
            ru: 'Силуэт облака рассечён восходящей стрелкой-потоком: мгновенный аплоад, масштабирование инфраструктуры и скорость передачи данных.',
            en: 'Clean cloud mass pierced upward by a sweeping trajectory arrow — expressing effortless upload, throughput, and cloud scale.',
          },
          formLogic: {
            ru: 'Динамичный наклон стрелы точно синхронизирован с курсивом «CloudFlow» и единой двухцветной палитрой подборки.',
            en: 'The arrow’s lean mirrors the italic slope of the CloudFlow logotype inside the unified palette.',
          },
        },
      ],
    },
    title: {
      ru: 'Logofolio — 10 авторских знаков и логотипов',
      en: 'Logofolio — 10 Brand Marks & Visual Metaphors',
    },
    subtitle: {
      ru: 'Единая витрина логотипов 2024–2026 в сдержанной графитово-бирюзовой палитре: от техно и игр до кофеен и парусного спорта',
      en: 'Curated archive of 10 brand marks crafted between 2024 and 2026 in a unified charcoal-and-teal exhibition system',
    },
    task: {
      ru: 'Собрать 10 разноплановых логотипов, разработанных в 2024–2026 годах для самых разных индустрий (музыка, фото, SaaS, геймдев, веломагазин, кофейня, мастерская, яхт-клуб, финансы, агентство), в единую презентационную систему с чёткой визуальной дисциплиной.',
      en: 'Curate 10 distinct brand marks created from 2024 to 2026 across music, tech, games, retail, coffee, craft, sailing, and finance into one unified exhibition presentation.',
    },
    problem: {
      ru: 'Когда портфолио состоит из пестрых логотипов с разными цветами, разным масштабом и разрозненной подачей, зритель видит набор случайных картинок вместо цельного авторского почерка.',
      en: 'When logos are shown with clashing backgrounds and inconsistent framing, viewers see unrelated deliverables instead of a cohesive design author.',
    },
    concept: {
      ru: 'Все 10 знаков переведены в единый графитовый колофон с акцентом цвета морской стали (#346E71) и выстроены в ритмичных 16:10 планшетах с авторским леттерингом «logofolio.» и единым нижним колонтитулом.',
      en: 'All 10 marks are presented through one disciplined charcoal (#2E302F) and slate-teal (#346E71) system on architectural 16:10 plates with bespoke «logofolio.» lettering and unified colophons.',
    },
    processStages: [
      {
        label: { ru: 'Этап 01', en: 'Phase 01' },
        title: { ru: 'Поиск двойного смысла', en: 'Semantic Fusion' },
        description: {
          ru: 'Для каждого бренда искалась живая визуальная метафора без штампов: кит + нота, колесо + S, чашка + зерно, облако + стрела роста.',
          en: 'Each identity fuses two ideas cleanly into one memorable silhouette: whale + note, wheel + S, cup + bean, cloud + arrow.',
        },
      },
      {
        label: { ru: 'Этап 02', en: 'Phase 02' },
        title: { ru: 'Геометрия и масштабируемость', en: 'Optics & Scale Testing' },
        description: {
          ru: 'Толщины штрихов, углы наклона и негативное пространство выверены так, чтобы знаки одинаково чисто работали и в иконке приложения, и на вывеске.',
          en: 'Stroke weights, negative cuts, and angles are balanced for legibility from tiny 16px app icons up to physical signage and apparel.',
        },
      },
      {
        label: { ru: 'Этап 03', en: 'Phase 03' },
        title: { ru: 'Единая выставочная подача', en: 'Archival Exhibition Grid' },
        description: {
          ru: 'Создана фирменная кинетическая строка «logofolio.» и унифицированная серия слайдов с маркировкой сферы бизнеса и года.',
          en: 'Designed bespoke angled «logofolio.» title typography and standardized 11 presentation slides tagged by industry and year.',
        },
      },
    ],
    visualSystemNotes: {
      ru: 'Объединение всего логофолио двумя цветами — глубоким графитом (#2E302F) и холодным бирюзовым (#346E71) — оголяет чистую форму знака и проверяет логотип на прочность без декоративных эффектов.',
      en: 'Distilling all ten logos into charcoal (#2E302F) and slate teal (#346E71) strips away decoration, proving every symbol works on pure silhouette and negative space.',
    },
    typographySpec: {
      display: 'Bespoke Slanted Heavy Sans · Serif Accents',
      body: 'Architectural Colophon Mono & Grotesque',
      palette: ['#FFFFFF', '#2E302F', '#346E71', '#E5E8E7'],
    },
    graphicDecisions: [
      {
        ru: 'Единый угол динамики (16°–18°) связывает титульный леттеринг «logofolio.», нижнюю подпись и диагональные штрихи в Double Click, CloudFlow, SpinCycle и Ascent Peak.',
        en: 'Consistent kinetic italic slant links the bespoke «logofolio.» title lockup, colophon signature, and marks like Double Click, CloudFlow, SpinCycle, and Ascent Peak.',
      },
      {
        ru: 'Неразрывная пара «знак + шрифтовая часть» в каждой плашке: от игривой дуги Squiggle Studio до строгого вертикального стека TULS.',
        en: 'Tight lockup pairing between symbol and custom wordmark — from playful curved lettering in Squiggle Studio to stacked heraldry in TULS Marine.',
      },
      {
        ru: 'Проверка монохромной контрастности: каждый логотип сохраняет узнаваемость даже в двухцветной печати и тиснении.',
        en: 'Verified two-ink silhouette discipline ensuring every emblem reproduces crisply across stamp, embroidery, and screens.',
      },
    ],
    applications: [
      { ru: '10 завершённых знаков и шрифтовых логотипов', en: '10 Production Brand Marks & Logotypes' },
      { ru: 'Авторский титульный леттеринг «logofolio.»', en: 'Bespoke «logofolio.» Exhibition Title Lockup' },
      { ru: 'Единый выставочный шаблон подачи 16:10', en: 'Unified 16:10 Exhibition Slide System' },
      { ru: 'Стикер- и мерч-готовность знаков (вектор)', en: 'Scalable Vector Print & Digital Deliverables' },
    ],
  },
  {
    id: 'slot-05',
    slug: 'pafos-seductions-brandbook',
    slotCode: 'PAFOS CLUB',
    watermarkWord: 'PAFOS',
    isSlotPlaceholder: false,
    category: 'identity',
    categoryLabel: {
      ru: 'Визуальная айдентика · Брендбук',
      en: 'Visual Identity · Brand Guidelines',
    },
    year: '2025 · BRAND GUIDELINES',
    layoutVariant: 'kinetic-specimen',
    gridSpan: 'wide',
    theme: {
      bg: '#140F16',
      surface: '#0E0B10',
      ink: '#F4F1EA',
      accent: '#E6007E',
      isDark: true,
    },
    coverImage: '/assets/aistudio/image_f0f056c2.webp',
    coverFit: 'cover',
    coverBg: '#140F16',
    coverElevation: true,
    preserveTypographyMedia: true,
    heroImage: '/assets/pafos/slide-04.jpg',
    secondaryImages: [
      '/assets/pafos/slide-06.jpg',
      '/assets/pafos/slide-01.jpg',
    ],
    brandbookData: {
      slides: [
        {
          page: '00 · COVER',
          src: '/assets/pafos/slide-01.jpg',
          sectionKey: 'intro',
          sectionLabel: { ru: 'Титул', en: 'Title Plate' },
          title: { ru: 'PAFOS Seduction’s — Объёмный знак', en: 'PAFOS Seduction’s — Metallic Emblem' },
          note: {
            ru: 'Фирменный логотип в сатинированном хроме на глубоком сливово-графитовом фоне #140F16.',
            en: 'Brushed metallic 3D wordmark floating over deep obsidian-plum #140F16.',
          },
        },
        {
          page: '01',
          src: '/assets/pafos/slide-02.jpg',
          sectionKey: 'intro',
          sectionLabel: { ru: 'Навигация', en: 'Contents' },
          title: { ru: 'Содержание брендбука', en: 'Brandbook Table of Contents' },
          note: {
            ru: 'Полная структура руководства: от философии клуба и геометрии знака до шести серий фирменных носителей.',
            en: 'Complete guideline map spanning philosophy, modular logo rules, typography, patterns, and 6 physical carriers.',
          },
        },
        {
          page: '02',
          src: '/assets/pafos/slide-03.jpg',
          sectionKey: 'intro',
          sectionLabel: { ru: 'Введение', en: 'Introduction' },
          title: { ru: 'Миссия и назначение стандартов', en: 'Identity Discipline' },
          note: {
            ru: 'Свод правил, защищающий цельность визуального языка ночного клуба на всех физических и цифровых точках контакта.',
            en: 'Core identity standards ensuring seamless luxury consistency across physical venue assets and digital media.',
          },
        },
        {
          page: '03',
          src: '/assets/pafos/slide-04.jpg',
          sectionKey: 'intro',
          sectionLabel: { ru: 'Концепция', en: 'Brand Concept' },
          title: { ru: 'Неоновая стена и 3 опоры бренда', en: 'Brand Concept & Neon Atmosphere' },
          note: {
            ru: 'Роскошь встречается с искушением: премиальность в деталях, атмосфера таинственности и выразительный визуальный статус.',
            en: 'Where luxury meets seduction: detail craftsmanship, nocturnal mystery, and unmistakable visual status.',
          },
        },
        {
          page: '04',
          src: '/assets/pafos/slide-05.jpg',
          sectionKey: 'logo',
          sectionLabel: { ru: 'Логотип', en: 'Logo Anatomy' },
          title: { ru: 'Форма знака и акцентная литера F', en: 'Custom Wordmark & Hero Stem F' },
          note: {
            ru: 'Массивная вытянутая геометрия букв контрастирует с пластичной литерой F, образующей визуальный якорь композиции.',
            en: 'Heavy condensed letterforms balance a fluid elongated F descender anchoring the sub-label SEDUCTION’S.',
          },
        },
        {
          page: '05',
          src: '/assets/pafos/slide-06.jpg',
          sectionKey: 'logo',
          sectionLabel: { ru: 'Сетка', en: 'Construction Grid' },
          title: { ru: 'Модульное строение 1x / 13x / 7x / 8x', en: 'Modular Construction 1x / 13x / 7x / 8x' },
          note: {
            ru: 'Базовая единица измерения X равна толщине основного вертикального штриха литеры P.',
            en: 'Proportional modular grid keyed off base unit X equal to the vertical stroke width of letter P.',
          },
        },
        {
          page: '06',
          src: '/assets/pafos/slide-07.jpg',
          sectionKey: 'logo',
          sectionLabel: { ru: 'Ограничения', en: 'Logo Misuse' },
          title: { ru: 'Недопустимое использование знака', en: 'Misuse Prevention Rules' },
          note: {
            ru: 'Запрещены перекрашивание, растягивание пропорций, переворот, дроп-тени и произвольные цветные градиенты.',
            en: 'Prohibits arbitrary tinting, non-uniform scaling, upside-down placement, glow distortions, and gradient fills.',
          },
        },
        {
          page: '07',
          src: '/assets/pafos/slide-08.jpg',
          sectionKey: 'logo',
          sectionLabel: { ru: 'Охранное поле', en: 'Clear Space' },
          title: { ru: 'Охранное поле кратное 2X', en: '2X Protective Clear Space' },
          note: {
            ru: 'Минимальная свободная зона вокруг логотипа гарантирует чистоту восприятия на афишах, картах и вывесках.',
            en: 'Enforced 2X breathing margin preserves emblem presence across crowded nightclub signage and print layouts.',
          },
        },
        {
          page: '08',
          src: '/assets/pafos/slide-09.jpg',
          sectionKey: 'system',
          sectionLabel: { ru: 'Типографика', en: 'Typography' },
          title: { ru: 'Roboto Flex · Наборная и заголовочная шкала', en: 'Roboto Flex · Variable Type Hierarchy' },
          note: {
            ru: 'Вариативный гротеск Roboto Flex обеспечивает чёткую читаемость как на тёмных VIP-носителях, так и в афишах.',
            en: 'Variable grotesque Roboto Flex delivers crisp legibility across dark luxury print stocks and large-scale posters.',
          },
        },
        {
          page: '09',
          src: '/assets/pafos/slide-10.jpg',
          sectionKey: 'system',
          sectionLabel: { ru: 'Паттерн', en: 'Brand Pattern' },
          title: { ru: 'Фирменный паттерн на основе F-элемента', en: 'Dynamic F-Motif Brand Pattern' },
          note: {
            ru: 'Ритмическое чередование изогнутого фирменного штриха и гранатовой точки создаёт узнаваемую клубную текстуру.',
            en: 'Repeating rotated stroke clusters punctuated by magenta accents form a signature tactile venue texture.',
          },
        },
        {
          page: '10',
          src: '/assets/pafos/slide-11.jpg',
          sectionKey: 'carriers',
          sectionLabel: { ru: 'Носители', en: 'Carriers Intro' },
          title: { ru: 'Система физических носителей клуба', en: 'Physical Touchpoint Architecture' },
          note: {
            ru: 'Перенос айдентики в материальную среду: тактильные бумаги, металл, стекло, неон и световые проекции.',
            en: 'Translating brand geometry into tactile dark cotton cardstocks, brushed metal, frosted acrylic, neon, and light.',
          },
        },
        {
          page: '11',
          src: '/assets/pafos/slide-12.jpg',
          sectionKey: 'carriers',
          sectionLabel: { ru: 'Полиграфия', en: 'Business Card' },
          title: { ru: 'Визитка с чёрным глянцевым тиснением', en: 'Blind-Debossed Obsidian Business Card' },
          note: {
            ru: 'Матовый чёрный фактурный картон с глубоким конгревом и селективным лаком на логотипе.',
            en: 'Heavy textured black paper stock stamped with tonal glossy deboss across the primary lockup.',
          },
        },
        {
          page: '12',
          src: '/assets/pafos/slide-13.jpg',
          sectionKey: 'carriers',
          sectionLabel: { ru: 'Сервис', en: 'Coat Check' },
          title: { ru: 'Гардеробный номерок № 047', en: 'Acrylic Coat Check Tag № 047' },
          note: {
            ru: 'Матовый чёрный акрил с гравировкой и хромированным логотипом — премиум-контакт с первых минут в клубе.',
            en: 'Matte black acrylic coat check tag combining metallic folio stamping with crisp tabular guest numbering.',
          },
        },
        {
          page: '13',
          src: '/assets/pafos/slide-14.jpg',
          sectionKey: 'carriers',
          sectionLabel: { ru: 'Интерьер', en: 'Neon Signage' },
          title: { ru: 'Световая вывеска в неоновом контуре', en: 'Electric Magenta Neon Wall Sign' },
          note: {
            ru: 'Фуксийный неон #E6007E превращает входную зону и фотоспоты в магнит для визуального контента гостей.',
            en: 'Vibrant magenta neon installation turning interior feature walls into effortless guest photo magnets.',
          },
        },
        {
          page: '14',
          src: '/assets/pafos/slide-15.jpg',
          sectionKey: 'carriers',
          sectionLabel: { ru: 'VIP-подача', en: 'Table Service' },
          title: { ru: 'Брендированная шампаньера из матовой стали', en: 'Matte Black Champagne Chiller' },
          note: {
            ru: 'Алюминиевый кулер с тонким серебряным нанесением подсвечивает статус VIP-столов.',
            en: 'Anodized dark bottle chiller finished with sharp metallic silver emblem for VIP bottle service.',
          },
        },
        {
          page: '15',
          src: '/assets/pafos/slide-16.jpg',
          sectionKey: 'carriers',
          sectionLabel: { ru: 'Комплект', en: 'VIP Suite' },
          title: { ru: 'Карта VIP MEMBER 0007, бар-меню, спички и номерок', en: 'VIP Suite · Member 0007 Card, Menu, Matchbox & Tag' },
          note: {
            ru: 'Комплексная сервировка гостевого опыта: от барной карты и металлизированной VIP-карты до брендированных спичек.',
            en: 'Cohesive nocturnal hospitality kit uniting bar menu, metallic VIP 0007 pass, coat tag, and custom matchbox.',
          },
        },
        {
          page: '16',
          src: '/assets/pafos/slide-17.jpg',
          sectionKey: 'carriers',
          sectionLabel: { ru: 'Свет', en: 'Floor Gobo' },
          title: { ru: 'Световая гобо-проекция в зале', en: 'Architectural Light Gobo Projection' },
          note: {
            ru: 'Высококонтрастный белый луч проецирует силуэт PAFOS Seduction’s прямо на бетонный пол танцпола сквозь дым.',
            en: 'Overhead spot projection casting clean emblem light geometry directly onto the textured concrete club floor.',
          },
        },
      ],
    },
    title: {
      ru: 'PAFOS Seduction’s — Фирменный стиль и брендбук',
      en: 'PAFOS Seduction’s — Brand Identity & Guidelines',
    },
    subtitle: {
      ru: 'Полное руководство по визуальной айдентике ночного клуба: 3D-логотип, модульная сетка, неоновый паттерн и 6 премиальных носителей',
      en: 'Complete 17-slide luxury nightclub identity system spanning brushed-chrome emblem, modular grid, neon pattern, and physical carriers',
    },
    task: {
      ru: 'Разработать цельную визуальную айдентику и подробный 17-страничный брендбук для премиального пространства PAFOS Seduction’s — от концепции и геометрии фирменного знака до охранных полей, типографики, паттерна и линейки физических носителей.',
      en: 'Develop a cohesive visual identity and 17-page brand guideline for nightlife venue PAFOS Seduction’s — covering brand ethos, proportional logo grid, clear space, typography, pattern system, and physical touchpoints.',
    },
    problem: {
      ru: 'Ночной и лаунж-сегмент перегружен шаблонным золотом и вычурной каллиграфией. Бренду требовался дерзкий, но статусный образ, который одинаково дорого смотрится и в темноте танцпола, и на тактильных VIP-носителях.',
      en: 'Nightlife branding frequently relies on generic gold gradients and cliché scripts. The venue needed an authoritative yet seductive identity legible both in low-light interiors and tactile print.',
    },
    concept: {
      ru: 'Баланс между массивной уверенностью и органической грацией: монументальный вытянутый шрифт с пластичной удлинённой литерой F на глубоком сливово-угольном фоне (#140F16) с электрическим пурпурным акцентом (#E6007E) и сатинированным хромом.',
      en: 'A tension between monumental authority and organic grace: ultra-condensed chrome letterforms anchored by a sweeping elongated F stem against deep plum-obsidian (#140F16) and electric neon magenta (#E6007E).',
    },
    processStages: [
      {
        label: { ru: 'Этап 01', en: 'Phase 01' },
        title: { ru: 'Логотип и модульная сетка 1x/13x', en: 'Emblem & 1x/13x Grid' },
        description: {
          ru: 'Выстроили строгие пропорции знака через базовый модуль X (толщина штриха литеры P), зафиксировали охранное поле 2X и правила недопустимого использования.',
          en: 'Locked mathematical proportions using base unit X (stem of P), establishing a mandatory 2X clear space and strict misuse safeguards.',
        },
      },
      {
        label: { ru: 'Этап 02', en: 'Phase 02' },
        title: { ru: 'Типографика и F-паттерн', en: 'Roboto Flex & Pattern System' },
        description: {
          ru: 'Интегрировали вариативную гарнитуру Roboto Flex и развернули на основе изогнутого элемента F фирменный повторяющийся паттерн с контрастной точкой.',
          en: 'Paired variable Roboto Flex hierarchy with a rhythmic repeating surface pattern derived directly from the curved F-terminal motif.',
        },
      },
      {
        label: { ru: 'Этап 03', en: 'Phase 03' },
        title: { ru: 'Линейка носителей и свет', en: 'VIP Carriers & Spatial Light' },
        description: {
          ru: 'Адаптировали систему под реальные материалы: конгрев на чёрных визитках, акриловые номерки, неон, шампаньеру, карту VIP Member 0007, меню, спички и гобо-проекцию.',
          en: 'Applied identity across debossed cardstock, matte acrylic coat tags, neon signs, champagne chillers, VIP Member 0007 cards, menus, and floor projections.',
        },
      },
    ],
    visualSystemNotes: {
      ru: 'Сила системы строится на взаимодействии света и фактуры: один и тот же векторный знак уверенно работает как глянцевое чёрное тиснение на матовом картоне, неон #E6007E на фактурной стене или луч гобо-прожектора на полу зала.',
      en: 'The system draws strength from material translation: the exact vector geometry shifts seamlessly between blind deboss on matte stock, vibrant #E6007E neon tubing, brushed steel, and overhead gobo light.',
    },
    typographySpec: {
      display: 'Custom Brushed Chrome Condensed · Variable Weights',
      body: 'Roboto Flex · Modular Guidelines Grid',
      palette: ['#140F16', '#E6007E', '#B8B8BE', '#FFFFFF'],
    },
    graphicDecisions: [
      {
        ru: 'Пластичная удлинённая литера F с каплевидным окончанием работает как самостоятельный графический маркер и строительный модуль фирменного паттерна.',
        en: 'The elongated drop-terminal stem of F doubles as an unmistakable brand silhouette and the repeating atom behind the club pattern.',
      },
      {
        ru: 'Жёсткая метрика построения (высота знака 7X / 8X с подстрочником SEDUCTION’S, ширина 13X) и охранная зона 2X для безупречной масштабируемости.',
        en: 'Disciplined proportional ratio (7X / 8X total height across 13X width) protected by a mandatory 2X exclusion zone.',
      },
      {
        ru: 'Высокий тактильный контраст на тёмных носителях: слепое тиснение, серебряная фольга, матовый акрил, бархатные ткани и неоновая контурная подсветка.',
        en: 'Tactile dark-on-dark layering combining gloss UV deboss, silver foil stamping, matte acrylic, velvet drapery, and neon illumination.',
      },
    ],
    applications: [
      { ru: 'Полный брендбук (17 презентационных слайдов)', en: 'Complete Brand Guidelines (17 Exhibition Slides)' },
      { ru: 'Чёрные визитки с глянцевым конгревом', en: 'Blind-Debossed Luxury Business Cards' },
      { ru: 'VIP Member 0007, барное меню, спички и номерок № 047', en: 'VIP 0007 Suite, Bar Menu, Matches & Acrylic Tag' },
      { ru: 'Неоновая вывеска, шампаньера и световая гобо-проекция', en: 'Neon Signage, Champagne Chiller & Floor Projection' },
    ],
  },
  {
    id: 'slot-06',
    slug: 'openspace-coworking-branding',
    slotCode: 'OPENSPACE',
    watermarkWord: 'OPENSPACE',
    isSlotPlaceholder: false,
    category: 'identity',
    categoryLabel: {
      ru: 'Брендинг · Полиграфия · UI/UX',
      en: 'Branding · Print · Web UI/UX',
    },
    year: '2025 · НИЖНИЙ НОВГОРОД',
    layoutVariant: 'brutalist-grid',
    gridSpan: 'wide',
    theme: {
      bg: '#0B4F78',
      surface: '#081426',
      ink: '#EFEFE9',
      accent: '#009FE3',
      isDark: true,
    },
    coverImage: '/assets/aistudio/open_space_2-Photoroom_1_d4bffab5.webp',
    coverFit: 'contain',
    coverBg: '#FFFFFF',
    isLogoCover: true,
    preserveTypographyMedia: true,
    heroImage: '/assets/aistudio/________1_v2_54930af9.webp',
    secondaryImages: [
      '/assets/aistudio/_____1_14cdffdb.png',
      '/assets/aistudio/Frame_2_15061e1a.webp',
    ],
    identityPlates: [
      {
        id: 'os-logo',
        code: '01 · SIGN',
        src: '/assets/aistudio/open_space_2-Photoroom_1_d4bffab5.webp',
        group: 'identity',
        surfaceBg: '#FFFFFF',
        title: {
          ru: 'Логотип Open Space',
          en: 'Primary Emblem Open Space',
        },
        note: {
          ru: 'Объёмный авторский леттеринг с толстой контрастной обводкой и символом облака — метафора лёгкости, открытой среды и свободы идей.',
          en: 'Bold outlined hand-drawn lettering paired with a buoyant cloud silhouette — expressing creative openness and community energy.',
        },
      },
      {
        id: 'os-pattern',
        code: '02 · PATTERN',
        src: '/assets/aistudio/________1_v2_54930af9.webp',
        group: 'identity',
        surfaceBg: '#DCE1E6',
        title: {
          ru: 'Топографический паттерн и фирменный фон',
          en: 'Topographic Wave Pattern',
        },
        note: {
          ru: 'Текучие изолинии задают движение, глубину пространства и работают фоновым ритмом для экранов, конвертов и стен коворкинга.',
          en: 'Flowing contour isolines create spatial depth and kinetic rhythm across digital screens, envelopes, and studio walls.',
        },
      },
      {
        id: 'os-web',
        code: '03 · WEBSITE UI/UX',
        src: '/assets/aistudio/_____1_14cdffdb.png',
        group: 'digital',
        surfaceBg: '#070E1A',
        title: {
          ru: 'Главная страница коворкинга (UI/UX)',
          en: 'Freelancer Coworking Website UI/UX',
        },
        note: {
          ru: 'Тёмный цифровой интерфейс со стеклянной карточкой преимуществ «Почему мы?» и круглой акцентной кнопкой «Изучить подробнее».',
          en: 'Midnight UI concept featuring a frosted-glass value panel, clear navigation, and an interactive circular exploration CTA.',
        },
      },
      {
        id: 'os-folder',
        code: '04 · FOLDER',
        src: '/assets/aistudio/Frame_2_15061e1a.webp',
        group: 'print',
        surfaceBg: '#FFFFFF',
        title: {
          ru: 'Фирменная папка «Твой творческий дом»',
          en: 'Presentation Folder · Creative Home',
        },
        note: {
          ru: 'Вырубная папка с интерьером резидентской зоны, воздушным голубым градиентом и ключевым слоганом сообщества.',
          en: 'Custom die-cut presentation folder combining studio photography with signature cerulean gradients and resident slogan.',
        },
      },
      {
        id: 'os-brochure',
        code: '05 · BROCHURE',
        src: '/assets/aistudio/_______1_75ae3097.webp',
        group: 'print',
        surfaceBg: '#FFFFFF',
        title: {
          ru: 'Евробуклет «Сообщество фрилансеров»',
          en: 'Trifold Brochure · Creative Studio',
        },
        note: {
          ru: 'Буклет о пространстве, контактах и резидентстве: чистая типографическая сетка на глубоком синем и белом полях.',
          en: 'Informational spread detailing workspace amenities and membership contacts over architectural slate-blue panels.',
        },
      },
      {
        id: 'os-letterhead',
        code: '06 · LETTERHEAD',
        src: '/assets/aistudio/____________________________1_f45f67b6.png',
        group: 'print',
        surfaceBg: '#FFFFFF',
        title: {
          ru: 'Деловой бланк «Наша работа — ваша работа»',
          en: 'Official A4 Letterhead',
        },
        note: {
          ru: 'Фирменный бланк формата A4 с геометрической пиксель-лентой в подвале, контактами в Нижнем Новгороде и адресной шапкой.',
          en: 'Corporate A4 stationery anchored by a geometric diamond ribbon footer and clear Nizhny Novgorod studio credentials.',
        },
      },
      {
        id: 'os-envelope',
        code: '07 · ENVELOPE',
        src: '/assets/aistudio/________94242f54.png',
        group: 'print',
        surfaceBg: '#FFFFFF',
        title: {
          ru: 'Почтовый конверт с окном',
          en: 'Branded Window Envelope',
        },
        note: {
          ru: 'Матовый светлый конверт с волнистой гравировкой по правому краю и блоком контактов на обороте.',
          en: 'Soft silver-gray mailer accented by curved contour lines on the front and centered contact specs on the flap.',
        },
      },
      {
        id: 'os-qr',
        code: '08 · INFO CARD',
        src: '/assets/aistudio/___________________2_0bcab8f8.png',
        group: 'print',
        surfaceBg: '#E6E7E9',
        title: {
          ru: 'QR-карта быстрого доступа',
          en: 'Quick-Access QR Pass Card',
        },
        note: {
          ru: 'Компактный вкладыш для резидентов и гостей: ключевые плюсы пространства, телефон, сайт и переход по QR-коду.',
          en: 'Compact desk insert highlighting flexible workspace perks with instant QR onboarding and contact details.',
        },
      },
      {
        id: 'os-notebook',
        code: '09 · NOTEBOOK',
        src: '/assets/aistudio/_______-Photoroom_1_f4760881.webp',
        group: 'merch',
        surfaceBg: '#FFFFFF',
        title: {
          ru: 'Блокнот на пружине «Вместе вдохновляем!»',
          en: 'Spiral Sketchbook · Inspire Together',
        },
        note: {
          ru: 'Рабочий скетчбук с акварельными голубыми фактурами, дугообразным девизом и центральным логотипом.',
          en: 'Studio notebook finished with atmospheric cyan watercolor washes and arched display typography.',
        },
      },
      {
        id: 'os-tote',
        code: '10 · MERCH TOTE',
        src: '/assets/aistudio/_____-Photoroom_1_e7ba0eea.webp',
        group: 'merch',
        surfaceBg: '#FFFFFF',
        title: {
          ru: 'Фирменный шоппер Open Space',
          en: 'Canvas Merch Tote Bag',
        },
        note: {
          ru: 'Плотный хлопковый шоппер для резидентов с живой авторской иллюстрацией: вспышки идей, листва вокруг облака и декоративный кант.',
          en: 'Resident cotton tote embellished with dynamic lightning sparks, botanical cloud accents, and custom bottom border.',
        },
      },
      {
        id: 'os-award',
        code: '11 · AWARD',
        src: '/assets/aistudio/image-Photoroom_1_35f80b90.webp',
        group: 'merch',
        surfaceBg: '#FFFFFF',
        title: {
          ru: 'Премия «Проект года» и медаль резидента',
          en: 'Annual Residency Trophy & Medal',
        },
        note: {
          ru: 'Фирменная гранёная стела из тонированного стекла и золотая медаль на ленте «Гуру дизайна» для внутренних конкурсов коворкинга.',
          en: 'Faceted smoked-glass award trophy and custom ribbon medal produced for community design showcases.',
        },
      },
    ],
    title: {
      ru: 'OpenSpace — Брендинг коворкинга для дизайнеров',
      en: 'OpenSpace — Designers Coworking Branding & UI/UX',
    },
    subtitle: {
      ru: 'Комплексная айдентика креативного пространства: логотип-облако, топографический паттерн, полиграфия, мерч и концепт веб-сайта',
      en: 'Full brand system for a creative coworking hub: cloud wordmark, contour pattern, stationery, merch, awards, and web UI/UX',
    },
    task: {
      ru: 'Разработать живой, дружелюбный и технологичный бренд коворкинга для дизайнеров и фрилансеров OpenSpace — от логотипа, слоганов и деловой полиграфии (бланк, папка, конверт, буклет, QR-карта) до линейки мерча, наград и главного экрана веб-сайта.',
      en: 'Build a vibrant, approachable brand ecosystem for OpenSpace, a coworking space for designers and freelancers — spanning the primary emblem, topographic pattern, print stationery suite, resident merch, trophy awards, and landing page UI/UX.',
    },
    problem: {
      ru: 'Большинство деловых коворкингов выглядят либо как стерильные корпоративные офисы из стекла и бетона, либо как случайный набор цветных стикеров без единой системы носителей.',
      en: 'Most coworking brands lean either too sterile and corporate or too fragmented without a cohesive system tying physical spaces, print, and digital onboarding together.',
    },
    concept: {
      ru: 'Объединить идею лёгкого «творческого дома» (знак-облако, голубые градиенты и живая ручная графика на шоппере) со структурной инженерной дисциплиной — топографическим паттерном, модульным бланком и тёмным цифровым UI/UX для резидентов.',
      en: 'Fuse the warmth of a «creative home» (buoyant cloud mark, sky-blue gradients, expressive tote illustration) with clean structural discipline — contour isolines, crisp stationery grids, and a dark glassmorphic web experience.',
    },
    processStages: [
      {
        label: { ru: 'Этап 01', en: 'Phase 01' },
        title: { ru: 'Знак и топография среды', en: 'Logo Mark & Contour System' },
        description: {
          ru: 'Создан дружелюбный контурный леттеринг с облаком и поддерживающий паттерн из текучих топографических линий, символизирующих поток идей.',
          en: 'Crafted the outlined cloud wordmark alongside a continuous topographic wave pattern symbolizing collaborative flow.',
        },
      },
      {
        label: { ru: 'Этап 02', en: 'Phase 02' },
        title: { ru: 'Полиграфия, мерч и награды', en: 'Print Suite, Merch & Awards' },
        description: {
          ru: 'Оформили полный набор контактов с резидентом: деловой бланк, папку, конверт, буклет, QR-карточку, блокнот, шоппер и премиальную стелу «Проект года».',
          en: 'Produced all physical touchpoints: A4 letterhead, die-cut folder, window envelope, trifold brochure, QR card, sketchbook, tote, and glass trophy.',
        },
      },
      {
        label: { ru: 'Этап 03', en: 'Phase 03' },
        title: { ru: 'Цифровой интерфейс (UI/UX)', en: 'Web UI/UX Experience' },
        description: {
          ru: 'Спроектировали тёмный лендинг «Коворкинг фрилансеров» со стеклянным блоком преимуществ, фотогалереей зала и круглой кнопкой входа в тур по пространству.',
          en: 'Designed a dark website hero featuring frosted glass benefits cards, interior preview, and an interactive circular exploration trigger.',
        },
      },
    ],
    visualSystemNotes: {
      ru: 'Система опирается на чистый небесно-лазурный акцент (#009FE3) и глубокий ночной синий (#0B4F78 / #081426): на светлых носителях (бланки, шоппер, блокнот) бренд дышит воздухом, а в диджитал-среде сайта переключается в глубокий контрастный ночной режим.',
      en: 'Anchored by crisp cerulean (#009FE3) and deep cobalt navy (#0B4F78 / #081426), the identity stays airy across stationery and canvas merch while shifting effortlessly into high-contrast midnight mode on web.',
    },
    typographySpec: {
      display: 'Rounded Custom Logo Lettering · Clean Grotesque',
      body: 'Geometric Sans · Print & Digital Grids',
      palette: ['#FFFFFF', '#009FE3', '#0B4F78', '#081426'],
    },
    graphicDecisions: [
      {
        ru: 'Пластичный двухслойный контур логотипа (белая обводка + графитовый кант) позволяет знаку уверенно лежать на фото, градиентах, акварели и топографическом паттерне.',
        en: 'Dual white-and-charcoal outline keeps the emblem crisp over coworking photos, watercolor washes, and complex isoline textures.',
      },
      {
        ru: 'Непрерывная линия топографии перетекает между баннерами, конвертом и фирменными носителями, связывая их в единый визуальный ландшафт.',
        en: 'Seamless contour waves travel across digital banners and envelopes, uniting disparate carriers into one spatial landscape.',
      },
      {
        ru: 'Разделение тональности: светлая тактильная полиграфия для офлайн-взаимодействия и стеклянный dark-mode интерфейс для онлайн-бронирования.',
        en: 'Dual atmospheric register: bright tactile stationery for physical visits paired with frosted dark-mode web UI for online booking.',
      },
    ],
    applications: [
      { ru: 'Фирменный логотип-облако и топографический паттерн', en: 'Cloud Logo Mark & Topographic Pattern' },
      { ru: 'Папка «Твой творческий дом», евробуклет и бланк A4', en: 'Presentation Folder, Brochure & A4 Letterhead' },
      { ru: 'Почтовый конверт, QR-карта и пружинный блокнот', en: 'Window Envelope, QR Pass & Spiral Sketchbook' },
      { ru: 'Фирменный шоппер и наградная стела «Проект года»', en: 'Merch Tote Bag & Glass Award Trophy' },
      { ru: 'Главный экран сайта коворкинга (UI/UX)', en: 'Coworking Landing Page Concept (UI/UX)' },
    ],
  },
];
