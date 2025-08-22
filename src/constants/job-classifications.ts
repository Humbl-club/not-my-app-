// ISCO-08 Job Classifications with multilingual support

export interface JobClassification {
  code: string;
  titleEn: string;
  titles: Record<string, string>;
  majorGroup: string;
  subMajorGroup: string;
  category: string;
  keywords?: string[];
}

export const jobClassifications: JobClassification[] = [
  // 1. Managers
  {
    code: "1111",
    titleEn: "Chief Executive Officer",
    titles: {
      en: "Chief Executive Officer",
      ar: "الرئيس التنفيذي",
      es: "Director Ejecutivo",
      fr: "Directeur Général",
      it: "Amministratore Delegato",
      ja: "最高経営責任者",
      ko: "최고경영자",
      zh: "首席执行官"
    },
    majorGroup: "Managers",
    subMajorGroup: "Chief Executives, Senior Officials and Legislators", 
    category: "Executive Management",
    keywords: ["CEO", "chief", "executive", "director"]
  },
  {
    code: "1112",
    titleEn: "Senior Government Official",
    titles: {
      en: "Senior Government Official",
      ar: "مسؤول حكومي كبير",
      es: "Alto Funcionario del Gobierno",
      fr: "Haut Fonctionnaire",
      it: "Alto Funzionario Governativo",
      ja: "政府高官",
      ko: "고위 정부 관료",
      zh: "高级政府官员"
    },
    majorGroup: "Managers",
    subMajorGroup: "Chief Executives, Senior Officials and Legislators",
    category: "Government Management"
  },
  {
    code: "1120",
    titleEn: "Managing Director",
    titles: {
      en: "Managing Director",
      ar: "المدير العام",
      es: "Director General",
      fr: "Directeur Général",
      it: "Direttore Generale",
      ja: "専務取締役",
      ko: "전무이사",
      zh: "总经理"
    },
    majorGroup: "Managers",
    subMajorGroup: "Administrative and Commercial Managers",
    category: "Executive Management",
    keywords: ["director", "general", "managing"]
  },
  {
    code: "1211",
    titleEn: "Finance Manager",
    titles: {
      en: "Finance Manager",
      ar: "مدير مالي",
      es: "Gerente de Finanzas",
      fr: "Directeur Financier",
      it: "Direttore Finanziario",
      ja: "財務部長",
      ko: "재무 관리자",
      zh: "财务经理"
    },
    majorGroup: "Managers",
    subMajorGroup: "Administrative and Commercial Managers",
    category: "Finance Management",
    keywords: ["finance", "financial", "budget", "accounting"]
  },
  {
    code: "1212",
    titleEn: "Human Resource Manager",
    titles: {
      en: "Human Resource Manager",
      ar: "مدير الموارد البشرية",
      es: "Gerente de Recursos Humanos",
      fr: "Directeur des Ressources Humaines",
      it: "Direttore delle Risorse Umane",
      ja: "人事部長",
      ko: "인사 관리자",
      zh: "人力资源经理"
    },
    majorGroup: "Managers",
    subMajorGroup: "Administrative and Commercial Managers",
    category: "HR Management",
    keywords: ["human", "resources", "personnel", "HR"]
  },
  {
    code: "1213",
    titleEn: "Policy and Planning Manager",
    titles: {
      en: "Policy and Planning Manager",
      ar: "مدير السياسات والتخطيط",
      es: "Gerente de Políticas y Planificación",
      fr: "Directeur des Politiques et de la Planification",
      it: "Direttore delle Politiche e Pianificazione",
      ja: "政策企画部長",
      ko: "정책 기획 관리자",
      zh: "政策规划经理"
    },
    majorGroup: "Managers",
    subMajorGroup: "Administrative and Commercial Managers",
    category: "Strategic Management"
  },

  // 2. Professionals
  {
    code: "2111",
    titleEn: "Physicist",
    titles: {
      en: "Physicist",
      ar: "فيزيائي",
      es: "Físico",
      fr: "Physicien",
      it: "Fisico",
      ja: "物理学者",
      ko: "물리학자",
      zh: "物理学家"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Science & Research",
    keywords: ["physics", "scientist", "research"]
  },
  {
    code: "2112",
    titleEn: "Meteorologist",
    titles: {
      en: "Meteorologist",
      ar: "عالم أرصاد جوية",
      es: "Meteorólogo",
      fr: "Météorologue",
      it: "Meteorologo",
      ja: "気象学者",
      ko: "기상학자",
      zh: "气象学家"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Science & Research"
  },
  {
    code: "2113",
    titleEn: "Chemist",
    titles: {
      en: "Chemist",
      ar: "كيميائي",
      es: "Químico",
      fr: "Chimiste", 
      it: "Chimico",
      ja: "化学者",
      ko: "화학자",
      zh: "化学家"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Science & Research",
    keywords: ["chemistry", "laboratory", "research"]
  },
  {
    code: "2131",
    titleEn: "Biologist",
    titles: {
      en: "Biologist",
      ar: "عالم أحياء",
      es: "Biólogo",
      fr: "Biologiste",
      it: "Biologo",
      ja: "生物学者",
      ko: "생물학자",
      zh: "生物学家"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Science & Research",
    keywords: ["biology", "life", "science", "research"]
  },
  {
    code: "2141",
    titleEn: "Industrial Engineer",
    titles: {
      en: "Industrial Engineer",
      ar: "مهندس صناعي",
      es: "Ingeniero Industrial",
      fr: "Ingénieur Industriel",
      it: "Ingegnere Industriale",
      ja: "産業エンジニア",
      ko: "산업 엔지니어",
      zh: "工业工程师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Engineering",
    keywords: ["engineering", "industrial", "production", "manufacturing"]
  },
  {
    code: "2142",
    titleEn: "Civil Engineer",
    titles: {
      en: "Civil Engineer",
      ar: "مهندس مدني",
      es: "Ingeniero Civil",
      fr: "Ingénieur Civil",
      it: "Ingegnere Civile",
      ja: "土木エンジニア",
      ko: "토목 기사",
      zh: "土木工程师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Engineering",
    keywords: ["civil", "construction", "infrastructure", "building"]
  },
  {
    code: "2143",
    titleEn: "Environmental Engineer",
    titles: {
      en: "Environmental Engineer",
      ar: "مهندس بيئي",
      es: "Ingeniero Ambiental",
      fr: "Ingénieur Environnemental",
      it: "Ingegnere Ambientale",
      ja: "環境エンジニア",
      ko: "환경 기사",
      zh: "环境工程师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Engineering"
  },
  {
    code: "2144",
    titleEn: "Mechanical Engineer",
    titles: {
      en: "Mechanical Engineer",
      ar: "مهندس ميكانيكي",
      es: "Ingeniero Mecánico",
      fr: "Ingénieur Mécanique",
      it: "Ingegnere Meccanico",
      ja: "機械エンジニア",
      ko: "기계 기사",
      zh: "机械工程师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Engineering",
    keywords: ["mechanical", "machinery", "design", "manufacturing"]
  },
  {
    code: "2145",
    titleEn: "Chemical Engineer",
    titles: {
      en: "Chemical Engineer",
      ar: "مهندس كيميائي",
      es: "Ingeniero Químico",
      fr: "Ingénieur Chimique",
      it: "Ingegnere Chimico",
      ja: "化学エンジニア",
      ko: "화학 기사",
      zh: "化学工程师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Science and Engineering Professionals",
    category: "Engineering"
  },
  {
    code: "2211",
    titleEn: "General Medical Practitioner",
    titles: {
      en: "General Medical Practitioner",
      ar: "طبيب عام",
      es: "Médico General",
      fr: "Médecin Généraliste",
      it: "Medico Generale",
      ja: "一般医",
      ko: "일반의",
      zh: "全科医生"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare",
    keywords: ["doctor", "physician", "medical", "GP"]
  },
  {
    code: "2212",
    titleEn: "Specialist Medical Practitioner",
    titles: {
      en: "Specialist Medical Practitioner",
      ar: "طبيب مختص",
      es: "Médico Especialista", 
      fr: "Médecin Spécialiste",
      it: "Medico Specialista",
      ja: "専門医",
      ko: "전문의",
      zh: "专科医生"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare",
    keywords: ["specialist", "doctor", "physician", "medical"]
  },
  {
    code: "2221",
    titleEn: "Nursing Professional",
    titles: {
      en: "Nursing Professional",
      ar: "ممرض محترف",
      es: "Profesional de Enfermería",
      fr: "Professionnel Infirmier",
      it: "Infermiere Professionale",
      ja: "看護師",
      ko: "간호사",
      zh: "护理专业人员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare",
    keywords: ["nurse", "nursing", "healthcare", "medical"]
  },
  {
    code: "2230",
    titleEn: "Traditional and Complementary Medicine Professional",
    titles: {
      en: "Traditional and Complementary Medicine Professional",
      ar: "محترف الطب التقليدي والتكميلي",
      es: "Profesional de Medicina Tradicional y Complementaria",
      fr: "Professionnel de Médecine Traditionnelle et Complémentaire",
      it: "Professionista di Medicina Tradizionale e Complementare",
      ja: "伝統・補完医学専門家",
      ko: "전통 보완의학 전문가",
      zh: "传统和补充医学专业人员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare"
  },

  // 3. Technicians and Associate Professionals
  {
    code: "3111",
    titleEn: "Chemical and Physical Science Technician",
    titles: {
      en: "Chemical and Physical Science Technician",
      ar: "فني العلوم الكيميائية والفيزيائية",
      es: "Técnico en Ciencias Químicas y Físicas",
      fr: "Technicien en Sciences Chimiques et Physiques",
      it: "Tecnico di Scienze Chimiche e Fisiche",
      ja: "化学・物理学技師",
      ko: "화학 물리학 기사",
      zh: "化学物理科学技术员"
    },
    majorGroup: "Technicians and Associate Professionals",
    subMajorGroup: "Science and Engineering Associate Professionals",
    category: "Technical Support",
    keywords: ["technician", "laboratory", "science", "technical"]
  },
  {
    code: "3112",
    titleEn: "Civil Engineering Technician",
    titles: {
      en: "Civil Engineering Technician",
      ar: "فني هندسة مدنية",
      es: "Técnico en Ingeniería Civil",
      fr: "Technicien en Génie Civil",
      it: "Tecnico di Ingegneria Civile",
      ja: "土木工学技師",
      ko: "토목공학 기사",
      zh: "土木工程技术员"
    },
    majorGroup: "Technicians and Associate Professionals",
    subMajorGroup: "Science and Engineering Associate Professionals",
    category: "Technical Support"
  },
  {
    code: "3113",
    titleEn: "Electrical Engineering Technician",
    titles: {
      en: "Electrical Engineering Technician",
      ar: "فني هندسة كهربائية",
      es: "Técnico en Ingeniería Eléctrica",
      fr: "Technicien en Génie Électrique",
      it: "Tecnico di Ingegneria Elettrica",
      ja: "電気工学技師",
      ko: "전기공학 기사",
      zh: "电气工程技术员"
    },
    majorGroup: "Technicians and Associate Professionals",
    subMajorGroup: "Science and Engineering Associate Professionals",
    category: "Technical Support",
    keywords: ["electrical", "technician", "engineering"]
  },

  // 4. Clerical Support Workers
  {
    code: "4110",
    titleEn: "General Office Clerk",
    titles: {
      en: "General Office Clerk",
      ar: "كاتب مكتب عام",
      es: "Empleado de Oficina General",
      fr: "Employé de Bureau Général",
      it: "Impiegato d'Ufficio Generale",
      ja: "一般事務員",
      ko: "일반 사무원",
      zh: "普通办公室职员"
    },
    majorGroup: "Clerical Support Workers",
    subMajorGroup: "General and Keyboard Clerks",
    category: "Administration",
    keywords: ["clerk", "office", "administrative", "general"]
  },
  {
    code: "4120",
    titleEn: "Secretary (General)",
    titles: {
      en: "Secretary (General)",
      ar: "سكرتير عام",
      es: "Secretario General",
      fr: "Secrétaire Général",
      it: "Segretario Generale",
      ja: "秘書",
      ko: "비서",
      zh: "秘书"
    },
    majorGroup: "Clerical Support Workers",
    subMajorGroup: "General and Keyboard Clerks",
    category: "Administration",
    keywords: ["secretary", "administrative", "assistant"]
  },

  // 5. Service and Sales Workers  
  {
    code: "5111",
    titleEn: "Travel Attendant",
    titles: {
      en: "Travel Attendant",
      ar: "مضيف سفر",
      es: "Auxiliar de Viaje",
      fr: "Agent de Voyage",
      it: "Assistente di Viaggio",
      ja: "旅行添乗員",
      ko: "여행 어텐던트",
      zh: "旅行服务员"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Personal Service Workers",
    category: "Hospitality & Tourism",
    keywords: ["travel", "attendant", "tourism", "hospitality"]
  },
  {
    code: "5120",
    titleEn: "Cook",
    titles: {
      en: "Cook",
      ar: "طباخ",
      es: "Cocinero",
      fr: "Cuisinier",
      it: "Cuoco",
      ja: "調理師",
      ko: "요리사",
      zh: "厨师"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Personal Service Workers",
    category: "Food Service",
    keywords: ["cook", "chef", "culinary", "kitchen"]
  },
  {
    code: "5131",
    titleEn: "Waiter",
    titles: {
      en: "Waiter",
      ar: "نادل",
      es: "Camarero",
      fr: "Serveur",
      it: "Cameriere",
      ja: "ウェイター",
      ko: "웨이터",
      zh: "服务员"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Personal Service Workers",
    category: "Food Service",
    keywords: ["waiter", "waitress", "server", "restaurant"]
  },

  // 6. Skilled Agricultural, Forestry and Fishery Workers
  {
    code: "6111",
    titleEn: "Field Crop Grower",
    titles: {
      en: "Field Crop Grower",
      ar: "مزارع المحاصيل الحقلية",
      es: "Cultivador de Cultivos de Campo",
      fr: "Cultivateur de Cultures de Plein Champ",
      it: "Coltivatore di Colture",
      ja: "畑作農家",
      ko: "작물 재배자",
      zh: "大田作物种植者"
    },
    majorGroup: "Skilled Agricultural, Forestry and Fishery Workers",
    subMajorGroup: "Market-oriented Skilled Agricultural Workers",
    category: "Agriculture & Farming",
    keywords: ["farmer", "agriculture", "crops", "farming"]
  },

  // 7. Craft and Related Trades Workers
  {
    code: "7111",
    titleEn: "House Builder",
    titles: {
      en: "House Builder",
      ar: "باني منازل",
      es: "Constructor de Casas",
      fr: "Constructeur de Maisons",
      it: "Costruttore di Case",
      ja: "住宅建設者",
      ko: "주택 건설자",
      zh: "房屋建筑工"
    },
    majorGroup: "Craft and Related Trades Workers",
    subMajorGroup: "Building and Related Trades Workers",
    category: "Construction & Building",
    keywords: ["builder", "construction", "house", "building"]
  },
  {
    code: "7212",
    titleEn: "Welder and Flame Cutter",
    titles: {
      en: "Welder and Flame Cutter",
      ar: "لحام وقطع باللهب",
      es: "Soldador y Cortador de Llama",
      fr: "Soudeur et Oxycoupeur",
      it: "Saldatore e Tagliatore a Fiamma",
      ja: "溶接工",
      ko: "용접공",
      zh: "焊工和火焰切割工"
    },
    majorGroup: "Craft and Related Trades Workers",
    subMajorGroup: "Metal, Machinery and Related Trades Workers",
    category: "Manufacturing & Production",
    keywords: ["welder", "welding", "metal", "fabrication"]
  },

  // 8. Plant and Machine Operators and Assemblers
  {
    code: "8111",
    titleEn: "Miner and Quarry Worker",
    titles: {
      en: "Miner and Quarry Worker",
      ar: "عامل منجم ومحجر",
      es: "Minero y Trabajador de Cantera",
      fr: "Mineur et Ouvrier de Carrière",
      it: "Minatore e Operaio di Cava",
      ja: "鉱山労働者",
      ko: "광부",
      zh: "矿工和采石工"
    },
    majorGroup: "Plant and Machine Operators and Assemblers",
    subMajorGroup: "Stationary Plant and Machine Operators",
    category: "Industrial Operations",
    keywords: ["miner", "mining", "quarry", "extraction"]
  },

  // 9. Elementary Occupations
  {
    code: "9111",
    titleEn: "Domestic Cleaner and Helper",
    titles: {
      en: "Domestic Cleaner and Helper",
      ar: "منظف ومساعد منزلي",
      es: "Limpiador y Ayudante Doméstico",
      fr: "Nettoyeur et Aide Domestique",
      it: "Addetto alle Pulizie Domestiche",
      ja: "家事手伝い",
      ko: "가사도우미",
      zh: "家庭清洁工和帮手"
    },
    majorGroup: "Elementary Occupations",
    subMajorGroup: "Cleaners and Helpers",
    category: "Support Services",
    keywords: ["cleaner", "domestic", "helper", "housekeeping"]
  },

  // Popular Technology Jobs
  {
    code: "2511",
    titleEn: "Systems Analyst",
    titles: {
      en: "Systems Analyst",
      ar: "محلل نظم",
      es: "Analista de Sistemas",
      fr: "Analyste de Systèmes",
      it: "Analista di Sistemi",
      ja: "システムアナリスト",
      ko: "시스템 분석가",
      zh: "系统分析师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information and Communications Technology Professionals",
    category: "Information Technology",
    keywords: ["analyst", "systems", "IT", "technology"]
  },
  {
    code: "2512",
    titleEn: "Software Developer",
    titles: {
      en: "Software Developer",
      ar: "مطور برمجيات",
      es: "Desarrollador de Software",
      fr: "Développeur de Logiciels",
      it: "Sviluppatore Software",
      ja: "ソフトウェア開発者",
      ko: "소프트웨어 개발자",
      zh: "软件开发人员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information and Communications Technology Professionals",
    category: "Information Technology",
    keywords: ["developer", "programmer", "software", "coding", "programming"]
  },
  {
    code: "2513",
    titleEn: "Web and Multimedia Developer",
    titles: {
      en: "Web and Multimedia Developer",
      ar: "مطور ويب ووسائط متعددة",
      es: "Desarrollador Web y Multimedia",
      fr: "Développeur Web et Multimédia",
      it: "Sviluppatore Web e Multimediale",
      ja: "ウェブ・マルチメディア開発者",
      ko: "웹 및 멀티미디어 개발자",
      zh: "网页和多媒体开发人员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information and Communications Technology Professionals",
    category: "Information Technology",
    keywords: ["web", "developer", "multimedia", "frontend", "backend"]
  },
  {
    code: "2514",
    titleEn: "Applications Programmer",
    titles: {
      en: "Applications Programmer",
      ar: "مبرمج تطبيقات",
      es: "Programador de Aplicaciones",
      fr: "Programmeur d'Applications",
      it: "Programmatore di Applicazioni",
      ja: "アプリケーションプログラマー",
      ko: "응용프로그램 개발자",
      zh: "应用程序员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information and Communications Technology Professionals",
    category: "Information Technology",
    keywords: ["programmer", "applications", "coding", "development"]
  },
  {
    code: "2519",
    titleEn: "Software and Applications Developer (Other)",
    titles: {
      en: "Software and Applications Developer (Other)",
      ar: "مطور برمجيات وتطبيقات (أخرى)",
      es: "Desarrollador de Software y Aplicaciones (Otros)",
      fr: "Développeur de Logiciels et Applications (Autres)",
      it: "Sviluppatore Software e Applicazioni (Altri)",
      ja: "ソフトウェア・アプリケーション開発者（その他）",
      ko: "소프트웨어 및 애플리케이션 개발자 (기타)",
      zh: "软件和应用开发人员（其他）"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information and Communications Technology Professionals",
    category: "Information Technology"
  },

  // Popular Business & Finance Jobs
  {
    code: "2411",
    titleEn: "Accountant",
    titles: {
      en: "Accountant",
      ar: "محاسب",
      es: "Contador",
      fr: "Comptable",
      it: "Contabile",
      ja: "会計士",
      ko: "회계사",
      zh: "会计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Finance & Accounting",
    keywords: ["accountant", "accounting", "finance", "bookkeeping"]
  },
  {
    code: "2412",
    titleEn: "Financial and Investment Adviser",
    titles: {
      en: "Financial and Investment Adviser",
      ar: "مستشار مالي واستثماري",
      es: "Asesor Financiero y de Inversiones",
      fr: "Conseiller Financier et en Investissement",
      it: "Consulente Finanziario e Investimenti",
      ja: "金融・投資アドバイザー",
      ko: "금융 투자 상담사",
      zh: "金融和投资顾问"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Finance & Accounting",
    keywords: ["financial", "adviser", "investment", "consultant"]
  },

  // Education Jobs
  {
    code: "2341",
    titleEn: "Primary School Teacher",
    titles: {
      en: "Primary School Teacher",
      ar: "معلم مدرسة ابتدائية",
      es: "Maestro de Escuela Primaria",
      fr: "Instituteur d'École Primaire",
      it: "Insegnante di Scuola Primaria",
      ja: "小学校教諭",
      ko: "초등학교 교사",
      zh: "小学教师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    keywords: ["teacher", "primary", "education", "school"]
  },
  {
    code: "2342",
    titleEn: "Early Childhood Educator",
    titles: {
      en: "Early Childhood Educator",
      ar: "مربي طفولة مبكرة",
      es: "Educador de Primera Infancia",
      fr: "Éducateur de la Petite Enfance",
      it: "Educatore della Prima Infanzia",
      ja: "幼児教育者",
      ko: "유아교육자",
      zh: "幼儿教育工作者"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    keywords: ["educator", "early", "childhood", "preschool"]
  },
  {
    code: "2343",
    titleEn: "Secondary School Teacher",
    titles: {
      en: "Secondary School Teacher",
      ar: "معلم مدرسة ثانوية",
      es: "Profesor de Escuela Secundaria",
      fr: "Professeur d'École Secondaire",
      it: "Insegnante di Scuola Secondaria",
      ja: "中学校・高校教諭",
      ko: "중고등학교 교사",
      zh: "中学教师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    keywords: ["teacher", "secondary", "high", "school"]
  }
];

// Major groups for categorization
export const majorGroups = [
  {
    code: "1",
    name: "Managers",
    titleEn: "Managers",
    titles: {
      en: "Managers",
      ar: "المدراء",
      es: "Gerentes",
      fr: "Gestionnaires",
      it: "Manager",
      ja: "管理者",
      ko: "관리자",
      zh: "管理人员"
    }
  },
  {
    code: "2", 
    name: "Professionals",
    titleEn: "Professionals",
    titles: {
      en: "Professionals",
      ar: "المهنيون",
      es: "Profesionales",
      fr: "Professionnels", 
      it: "Professionisti",
      ja: "専門職",
      ko: "전문직",
      zh: "专业人员"
    }
  },
  {
    code: "3",
    name: "Technicians and Associate Professionals", 
    titleEn: "Technicians and Associate Professionals",
    titles: {
      en: "Technicians and Associate Professionals",
      ar: "الفنيون والمهنيون المساعدون",
      es: "Técnicos y Profesionales Asociados",
      fr: "Techniciens et Professionnels Associés",
      it: "Tecnici e Professionisti Associati",
      ja: "技術者・准専門職",
      ko: "기술자 및 준전문가",
      zh: "技术员和助理专业人员"
    }
  },
  {
    code: "4",
    name: "Clerical Support Workers",
    titleEn: "Clerical Support Workers", 
    titles: {
      en: "Clerical Support Workers",
      ar: "عمال الدعم الكتابي",
      es: "Trabajadores de Apoyo Administrativo",
      fr: "Employés de Bureau",
      it: "Impiegati di Supporto",
      ja: "事務従事者",
      ko: "사무 지원 근로자",
      zh: "文书支持人员"
    }
  },
  {
    code: "5",
    name: "Service and Sales Workers",
    titleEn: "Service and Sales Workers",
    titles: {
      en: "Service and Sales Workers", 
      ar: "عمال الخدمات والمبيعات",
      es: "Trabajadores de Servicios y Ventas",
      fr: "Personnel des Services et Vendeurs",
      it: "Addetti ai Servizi e alle Vendite",
      ja: "サービス・販売従事者",
      ko: "서비스 및 판매 근로자", 
      zh: "服务和销售人员"
    }
  },
  {
    code: "6",
    name: "Skilled Agricultural, Forestry and Fishery Workers",
    titleEn: "Skilled Agricultural, Forestry and Fishery Workers",
    titles: {
      en: "Skilled Agricultural, Forestry and Fishery Workers",
      ar: "العمال المهرة في الزراعة والغابات ومصايد الأسماك",
      es: "Trabajadores Calificados Agropecuarios, Forestales y Pesqueros",
      fr: "Agriculteurs et Ouvriers Qualifiés de l'Agriculture, de la Sylviculture et de la Pêche",
      it: "Lavoratori Qualificati dell'Agricoltura, delle Foreste e della Pesca",
      ja: "農林漁業従事者",
      ko: "농림어업 숙련 근로자",
      zh: "技能农业、林业和渔业工人"
    }
  },
  {
    code: "7",
    name: "Craft and Related Trades Workers",
    titleEn: "Craft and Related Trades Workers",
    titles: {
      en: "Craft and Related Trades Workers",
      ar: "عمال الحرف والمهن ذات الصلة", 
      es: "Oficiales, Operarios y Artesanos",
      fr: "Artisans et Ouvriers des Métiers de Type Artisanal",
      it: "Artigiani e Operai Specializzati",
      ja: "技能工・関連職業従事者",
      ko: "기능원 및 관련 기능 종사자",
      zh: "手工艺和相关行业工人"
    }
  },
  {
    code: "8",
    name: "Plant and Machine Operators and Assemblers", 
    titleEn: "Plant and Machine Operators and Assemblers",
    titles: {
      en: "Plant and Machine Operators and Assemblers",
      ar: "مشغلو المصانع والآلات والمجمعون",
      es: "Operadores de Instalaciones y Máquinas y Ensambladores",
      fr: "Conducteurs d'Installations et de Machines et Ouvriers de l'Assemblage",
      it: "Conduttori di Impianti e Operatori di Macchinari e Addetti al Montaggio",
      ja: "設備・機械運転・組立従事者",
      ko: "장치, 기계조작 및 조립 종사자",
      zh: "工厂和机器操作员及装配工"
    }
  },
  {
    code: "9",
    name: "Elementary Occupations",
    titleEn: "Elementary Occupations", 
    titles: {
      en: "Elementary Occupations",
      ar: "المهن الأولية",
      es: "Ocupaciones Elementales",
      fr: "Professions Élémentaires",
      it: "Professioni Elementari", 
      ja: "単純労働従事者",
      ko: "단순노무 종사자",
      zh: "基础职业"
    }
  }
];

// Popular jobs that should appear at the top
export const popularJobs = [
  "2512", // Software Developer
  "2513", // Web Developer
  "2411", // Accountant
  "2211", // Doctor
  "2221", // Nurse
  "2341", // Teacher
  "1212", // HR Manager
  "2144", // Mechanical Engineer
  "2142", // Civil Engineer
  "5120"  // Cook
];

export const getJobByCode = (code: string): JobClassification | undefined => {
  return jobClassifications.find(job => job.code === code);
};

export const getJobsByCategory = (category: string): JobClassification[] => {
  return jobClassifications.filter(job => job.category === category);
};

export const getJobsByMajorGroup = (majorGroup: string): JobClassification[] => {
  return jobClassifications.filter(job => job.majorGroup === majorGroup);
};

export const searchJobs = (query: string, language: string = 'en'): JobClassification[] => {
  if (!query.trim()) return jobClassifications;
  
  const searchTerm = query.toLowerCase().trim();
  
  return jobClassifications.filter(job => {
    // Search in title for current language
    const title = job.titles[language] || job.titleEn;
    if (title.toLowerCase().includes(searchTerm)) return true;
    
    // Search in English title
    if (job.titleEn.toLowerCase().includes(searchTerm)) return true;
    
    // Search in keywords
    if (job.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))) return true;
    
    // Search in category
    if (job.category.toLowerCase().includes(searchTerm)) return true;
    
    // Search in major group
    if (job.majorGroup.toLowerCase().includes(searchTerm)) return true;
    
    return false;
  });
};