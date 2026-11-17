export type Lang = 'ru' | 'en';

export interface BilingualText {
  ru: string;
  en: string;
}

export const translations = {
  nav: {
    home: { ru: 'Главная', en: 'Home' },
    works: { ru: 'Работы', en: 'Works' },
    about: { ru: 'О себе', en: 'About' },
    contacts: { ru: 'Контакты', en: 'Contacts' },
    cta: { ru: 'Обсудить проект', en: 'Start Project' },
    menu: { ru: 'Меню', en: 'Menu' },
    close: { ru: 'Закрыть', en: 'Close' },
  },
  utility: {
    soundOn: { ru: 'Звук вкл', en: 'Sound On' },
    soundOff: { ru: 'Звук выкл', en: 'Sound Off' },
    langLabel: { ru: 'Язык', en: 'Language' },
  },
  home: {
    role: {
      ru: 'Графический дизайнер · Визуальный криэйтор',
      en: 'Graphic Designer · Visual Creator',
    },
    thesisTitle: {
      ru: 'ВСЁ СВЯЗАНО',
      en: 'EVERYTHING IS CONNECTED',
    },
    heroLead: {
      ru: 'Авторские визуальные системы, где типографика, графика, ритм и движение работают как единый живой организм.',
      en: 'Authorial visual systems where typography, graphic form, rhythm, and motion operate as one living organism.',
    },
    heroExplore: {
      ru: 'Смотреть работы',
      en: 'Explore Works',
    },
    heroConnect: {
      ru: 'Связаться',
      en: 'Get in Touch',
    },
    tensionHint: {
      ru: 'Потяните или проведите по струнам связи — узлы реагируют физически',
      en: 'Drag or sweep the tension strings — connected nodes respond physically',
    },
    marqueeText: {
      ru: 'ВСЁ СВЯЗАНО · ТИПОГРАФИКА И СИСТЕМЫ · АЙДЕНТИКА · ГРАФИЧЕСКИЙ ДИЗАЙН · ДВИЖЕНИЕ И ФОРМА',
      en: 'EVERYTHING IS CONNECTED · TYPOGRAPHY & SYSTEMS · IDENTITY · GRAPHIC DESIGN · MOTION & FORM',
    },
    systemHeading: {
      ru: 'Живая система визуальных связей',
      en: 'A Living System of Visual Connections',
    },
    systemBody: {
      ru: 'Каждый знак рождает сетку. Сетка задаёт ритм типографики. Типографика управляет движением. Когда меняешь один элемент, откликается вся композиция.',
      en: 'Every mark generates a grid. The grid dictates typographic rhythm. Typography drives motion. Move one element and the entire composition responds.',
    },
    selectedHeading: {
      ru: 'Архив и слоты экспозиции',
      en: 'Exhibition Archive & Slots',
    },
    selectedSub: {
      ru: 'Модульная архитектура кейсов: каждый слот готов к публикации реального проекта со своей композицией и цветовым настроением.',
      en: 'Modular case architecture: each slot is ready to publish a real project with its own composition and chromatic mood.',
    },
    viewAllWorks: {
      ru: 'Все работы и слоты',
      en: 'All Works & Slots',
    },
    openCase: {
      ru: 'Открыть кейс',
      en: 'Open Case',
    },
    closingHeading: {
      ru: 'Готовы построить визуальную систему с характером?',
      en: 'Ready to build a visual system with character?',
    },
    closingBody: {
      ru: 'Открыт к проектам в области брендинга, визуальной айдентики, арт-дирекшна и экспериментальных цифровых интерфейсов.',
      en: 'Available for branding, visual identity, art direction, and experimental digital interface commissions.',
    },
    closingAction: {
      ru: 'Начать диалог',
      en: 'Start a Conversation',
    },
  },
  works: {
    title: { ru: 'Избранные работы', en: 'Selected Works' },
    lead: {
      ru: 'Авторская экспозиция проектов: брендинг, типографические системы, айдентика, плакатная графика и живые цифровые интерфейсы.',
      en: 'Curated exhibition of authorial commissions spanning branding, typographic systems, visual identity, posters, and interactive web.',
    },
    publishedBadge: { ru: 'Авторский кейс', en: 'Authorial Case' },
    categories: {
      all: { ru: 'Все направления', en: 'All Disciplines' },
      branding: { ru: 'Брендинг', en: 'Branding' },
      logo: { ru: 'Логотипы', en: 'Logo Design' },
      identity: { ru: 'Визуальная айдентика', en: 'Visual Identity' },
      graphic: { ru: 'Графический дизайн', en: 'Graphic Design' },
      uiux: { ru: 'UI/UX дизайн', en: 'UI/UX Design' },
      motion3d: { ru: '3D и Motion', en: '3D & Motion' },
    },
  },
  caseStudy: {
    backToWorks: { ru: 'Назад к работам', en: 'Back to Works' },
    sections: {
      task: { ru: '01. Задача проекта', en: '01. The Brief' },
      problem: { ru: '02. Исходная проблема', en: '02. Initial Challenge' },
      concept: { ru: '03. Концепция и творческая идея', en: '03. Concept & Creative Idea' },
      process: { ru: '04. Эскизы и процесс создания', en: '04. Sketches & Process' },
      system: { ru: '05. Развитие визуальной системы', en: '05. Visual System Development' },
      decisions: { ru: '06. Основные графические решения', en: '06. Key Graphic Decisions' },
      applications: { ru: '07. Применение дизайна', en: '07. Design Applications' },
      gallery: { ru: '08. Финальная экспозиция', en: '08. Final Exhibition Plates' },
    },
    nextProject: { ru: 'Следующий кейс', en: 'Next Case' },
    notFound: { ru: 'Слот проекта не найден', en: 'Project slot not found' },
  },
  about: {
    title: { ru: 'Графика, интерфейсы и ясная форма', en: 'Graphics, Interfaces & Clear Form' },
    intro: {
      ru: 'Кирилл Ковалёв — графический дизайнер из Нижнего Новгорода, студент выпускного 4 курса IT TOP. В дизайне с 2020 года: начинал с коммерческих задач и ретуши на Kwork, а сейчас закрываю полный спектр визуальных задач — с главным фокусом на UI/UX.',
      en: 'Kirill Kovalev — graphic designer based in Nizhny Novgorod, final-year (4th year) Graphic Design student at IT TOP. Practicing since 2020: started with commercial work on Kwork and now handle full-spectrum visual tasks with a primary focus on UI/UX.',
    },
    manifestoTitle: {
      ru: 'Три опоры в работе',
      en: 'Three Pillars of Practice',
    },
    pillars: [
      {
        index: '01',
        title: { ru: 'Быстро, удобно и по делу', en: 'Fast, Practical & Fair' },
        body: {
          ru: 'Быстрое погружение в задачу, комфортная коммуникация без лишней бюрократии и честная рыночная цена. Делаю дизайн, который решает задачу бизнеса и удобен в работе.',
          en: 'Rapid onboarding, clear communication without bureaucracy, and fair market pricing. Design built to solve real tasks cleanly and comfortably.',
        },
      },
      {
        index: '02',
        title: { ru: 'Приоритет — UI/UX и Figma', en: 'UI/UX & Figma First' },
        body: {
          ru: 'Могу закрыть любую визуальную задачу, но больше всего люблю и развиваю UI/UX. Главный инструмент — Figma, плюс уверенно владею HTML и CSS, поэтому интерфейсы проектируются с пониманием реальной вёрстки и адаптива.',
          en: 'Capable across all visual disciplines, with UI/UX as my primary focus. Figma is my favorite workspace, backed by hands-on HTML & CSS knowledge so every layout is built with real frontend structure in mind.',
        },
      },
      {
        index: '03',
        title: { ru: 'Заказы, команды и студии', en: 'Commissions, Teams & Studios' },
        body: {
          ru: 'Сейчас беру коммерческие заказы, при этом открыт к работе в студии, проектных командах и долгосрочным продуктам. Уверенно работаю во всём софте: от Illustrator и Photoshop до After Effects и Blender.',
          en: 'Currently taking commercial commissions while open to studios, product teams, and long-term projects. Fluent across Illustrator, Photoshop, After Effects, Blender, and more.',
        },
      },
    ],
    facts: [
      {
        label: { ru: 'Локация', en: 'Location' },
        value: { ru: 'Нижний Новгород, Россия', en: 'Nizhny Novgorod, Russia' },
      },
      {
        label: { ru: 'Образование', en: 'Education' },
        value: { ru: 'IT TOP · Графический дизайн · 4 курс', en: 'IT TOP · Graphic Design · 4th Year' },
      },
      {
        label: { ru: 'Опыт', en: 'Experience' },
        value: { ru: 'С 2020 года (Kwork → коммерция)', en: 'Since 2020 (Kwork → Commercial)' },
      },
      {
        label: { ru: 'Формат', en: 'Availability' },
        value: { ru: 'Заказы · Проекты · Студия / Команда', en: 'Commissions · Projects · Studio / Team' },
      },
    ],
    stackTitle: { ru: 'Инструменты, софт и вёрстка', en: 'Tools, Software & Code' },
    disciplinesTitle: { ru: 'Спектр задач', en: 'Disciplines & Scope' },
    disciplines: [
      { ru: 'UI/UX дизайн и веб-интерфейсы (приоритет)', en: 'UI/UX Design & Web Interfaces (Priority)' },
      { ru: 'Графический и плакатный дизайн', en: 'Graphic & Poster Design' },
      { ru: 'Брендинг и визуальная айдентика', en: 'Branding & Visual Identity' },
      { ru: 'Логотипы и знаковые системы', en: 'Logo & Mark Systems' },
      { ru: '3D-композиции и Motion-графика', en: '3D Compositions & Motion Graphics' },
      { ru: 'Ретушь, визуалы и любые задачи под ключ', en: 'Retouching, Visuals & Turnkey Tasks' },
    ],
    ctaButton: { ru: 'Перейти к контактам', en: 'Go to Contacts' },
  },
  contacts: {
    eyebrow: { ru: 'Сотрудничество и заказы', en: 'Commissions & Collaboration' },
    headline: {
      ru: 'ОБСУДИМ ЗАДАЧУ И СДЕЛАЕМ ЧИСТО',
      en: 'LET’S BUILD SOMETHING CLEAN & SHARP',
    },
    lead: {
      ru: 'Открыт к коммерческим заказам, проектным командам и работе в студии. Быстрый отклик, удобный процесс и честная рыночная стоимость — от графики до UI/UX.',
      en: 'Available for commercial commissions, team projects, and studio roles. Fast response, straightforward workflow, and fair market pricing — from graphic design to UI/UX.',
    },
    directChannels: { ru: 'Прямые каналы связи', en: 'Direct Channels' },
    copy: { ru: 'Копировать', en: 'Copy' },
    copied: { ru: 'Скопировано', en: 'Copied' },
    socialsTitle: { ru: 'Формат и площадки', en: 'Availability & Links' },
    form: {
      title: { ru: 'Запрос на проект', en: 'Project Inquiry' },
      name: { ru: 'Ваше имя или компания', en: 'Your Name or Studio' },
      email: { ru: 'Email или Telegram для ответа', en: 'Reply Email or Telegram' },
      scopeLabel: { ru: 'Направление задачи', en: 'Project Discipline' },
      message: { ru: 'Коротко о задаче, сроках и пожеланиях', en: 'Brief overview, timeline, and goals' },
      submit: { ru: 'Подготовить запрос', en: 'Prepare Inquiry' },
      successTitle: { ru: 'Запрос готов к отправке', en: 'Inquiry Ready to Send' },
      successBody: {
        ru: 'Выберите удобный канал — текст заявки подставится автоматически. Можно написать сразу в Telegram или отправить письмо на почту.',
        en: 'Pick your preferred channel below — your message is pre-filled. Send directly via Telegram or open your email app.',
      },
      openTelegram: { ru: 'Отправить в Telegram', en: 'Send via Telegram' },
      openMail: { ru: 'Отправить на почту', en: 'Send via Email' },
      copyBrief: { ru: 'Скопировать текст', en: 'Copy Brief' },
      copiedBrief: { ru: 'Текст скопирован', en: 'Brief Copied' },
      sendAnother: { ru: 'Новый запрос', en: 'New Inquiry' },
      validationError: {
        ru: 'Пожалуйста, укажите имя, контакт (email или @username) и пару слов о задаче.',
        en: 'Please fill in your name, contact (email or @username), and a short brief.',
      },
    },
  },
  footer: {
    statement: {
      ru: 'Графический и UI/UX дизайнер Кирилл Ковалёв. Нижний Новгород · коммерческие заказы, проекты и студии.',
      en: 'Graphic & UI/UX designer Kirill Kovalev. Nizhny Novgorod · commissions, teams, and studios.',
    },
    connected: {
      ru: 'Всё связано — форма, интерфейс, ритм и движение.',
      en: 'Everything is connected — form, interface, rhythm, and motion.',
    },
    rights: {
      ru: 'Кирилл Ковалёв',
      en: 'Kirill Kovalev',
    },
  },
} as const;
