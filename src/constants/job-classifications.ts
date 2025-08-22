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
  // ============= MANAGEMENT & EXECUTIVE =============
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
    majorGroup: "Management",
    subMajorGroup: "Executive Management",
    category: "Management & Executive",
    keywords: ["CEO", "chief", "executive", "director"]
  },
  {
    code: "1112",
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
    majorGroup: "Management",
    subMajorGroup: "Executive Management",
    category: "Management & Executive",
    keywords: ["director", "general", "managing"]
  },
  {
    code: "1113",
    titleEn: "Operations Manager",
    titles: {
      en: "Operations Manager",
      ar: "مدير العمليات",
      es: "Gerente de Operaciones",
      fr: "Directeur des Opérations",
      it: "Direttore Operativo",
      ja: "運営管理者",
      ko: "운영 관리자",
      zh: "运营经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Operations Management",
    category: "Management & Executive",
    keywords: ["operations", "manager", "supervisor"]
  },
  {
    code: "1114",
    titleEn: "General Manager",
    titles: {
      en: "General Manager",
      ar: "المدير العام",
      es: "Gerente General",
      fr: "Directeur Général",
      it: "Direttore Generale",
      ja: "ゼネラルマネージャー",
      ko: "총괄 관리자",
      zh: "总经理"
    },
    majorGroup: "Management",
    subMajorGroup: "General Management",
    category: "Management & Executive",
    keywords: ["general", "manager", "director"]
  },
  {
    code: "1115",
    titleEn: "Project Manager",
    titles: {
      en: "Project Manager",
      ar: "مدير المشروع",
      es: "Gerente de Proyecto",
      fr: "Chef de Projet",
      it: "Project Manager",
      ja: "プロジェクトマネージャー",
      ko: "프로젝트 관리자",
      zh: "项目经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Project Management",
    category: "Management & Executive",
    keywords: ["project", "manager", "coordinator"]
  },
  {
    code: "1116",
    titleEn: "Product Manager",
    titles: {
      en: "Product Manager",
      ar: "مدير المنتج",
      es: "Gerente de Producto",
      fr: "Chef de Produit",
      it: "Product Manager",
      ja: "プロダクトマネージャー",
      ko: "제품 관리자",
      zh: "产品经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Product Management",
    category: "Management & Executive",
    keywords: ["product", "manager", "development"]
  },
  {
    code: "1117",
    titleEn: "Department Head",
    titles: {
      en: "Department Head",
      ar: "رئيس القسم",
      es: "Jefe de Departamento",
      fr: "Chef de Département",
      it: "Capo Dipartimento",
      ja: "部長",
      ko: "부서장",
      zh: "部门主管"
    },
    majorGroup: "Management",
    subMajorGroup: "Department Management",
    category: "Management & Executive",
    keywords: ["department", "head", "supervisor"]
  },
  {
    code: "1118",
    titleEn: "Team Leader",
    titles: {
      en: "Team Leader",
      ar: "قائد الفريق",
      es: "Líder de Equipo",
      fr: "Chef d'Équipe",
      it: "Capo Team",
      ja: "チームリーダー",
      ko: "팀 리더",
      zh: "团队负责人"
    },
    majorGroup: "Management",
    subMajorGroup: "Team Management",
    category: "Management & Executive",
    keywords: ["team", "leader", "supervisor"]
  },

  // ============= INFORMATION TECHNOLOGY =============
  {
    code: "2511",
    titleEn: "Software Developer",
    titles: {
      en: "Software Developer",
      ar: "مطور البرمجيات",
      es: "Desarrollador de Software",
      fr: "Développeur Logiciel",
      it: "Sviluppatore Software",
      ja: "ソフトウェア開発者",
      ko: "소프트웨어 개발자",
      zh: "软件开发员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["software", "developer", "programmer", "coding"]
  },
  {
    code: "2512",
    titleEn: "Web Developer",
    titles: {
      en: "Web Developer",
      ar: "مطور الويب",
      es: "Desarrollador Web",
      fr: "Développeur Web",
      it: "Sviluppatore Web",
      ja: "ウェブ開発者",
      ko: "웹 개발자",
      zh: "网页开发员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["web", "developer", "frontend", "backend"]
  },
  {
    code: "2513",
    titleEn: "Data Scientist",
    titles: {
      en: "Data Scientist",
      ar: "عالم البيانات",
      es: "Científico de Datos",
      fr: "Data Scientist",
      it: "Data Scientist",
      ja: "データサイエンティスト",
      ko: "데이터 사이언티스트",
      zh: "数据科学家"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["data", "scientist", "analytics", "machine learning"]
  },
  {
    code: "2514",
    titleEn: "System Administrator",
    titles: {
      en: "System Administrator",
      ar: "مدير النظم",
      es: "Administrador de Sistemas",
      fr: "Administrateur Système",
      it: "Amministratore di Sistema",
      ja: "システム管理者",
      ko: "시스템 관리자",
      zh: "系统管理员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["system", "administrator", "IT", "infrastructure"]
  },
  {
    code: "2515",
    titleEn: "UX/UI Designer",
    titles: {
      en: "UX/UI Designer",
      ar: "مصمم تجربة المستخدم",
      es: "Diseñador UX/UI",
      fr: "Designer UX/UI",
      it: "Designer UX/UI",
      ja: "UX/UIデザイナー",
      ko: "UX/UI 디자이너",
      zh: "用户体验设计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["UX", "UI", "designer", "user experience"]
  },
  {
    code: "2516",
    titleEn: "DevOps Engineer",
    titles: {
      en: "DevOps Engineer",
      ar: "مهندس DevOps",
      es: "Ingeniero DevOps",
      fr: "Ingénieur DevOps",
      it: "Ingegnere DevOps",
      ja: "DevOpsエンジニア",
      ko: "DevOps 엔지니어",
      zh: "DevOps工程师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["devops", "engineer", "deployment", "automation"]
  },
  {
    code: "2517",
    titleEn: "Cybersecurity Analyst",
    titles: {
      en: "Cybersecurity Analyst",
      ar: "محلل الأمن السيبراني",
      es: "Analista de Ciberseguridad",
      fr: "Analyste Cybersécurité",
      it: "Analista Cybersecurity",
      ja: "サイバーセキュリティアナリスト",
      ko: "사이버보안 분석가",
      zh: "网络安全分析师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["cybersecurity", "security", "analyst", "protection"]
  },
  {
    code: "2518",
    titleEn: "Database Administrator",
    titles: {
      en: "Database Administrator",
      ar: "مدير قاعدة البيانات",
      es: "Administrador de Base de Datos",
      fr: "Administrateur Base de Données",
      it: "Amministratore Database",
      ja: "データベース管理者",
      ko: "데이터베이스 관리자",
      zh: "数据库管理员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["database", "administrator", "DBA", "SQL"]
  },
  {
    code: "2519",
    titleEn: "Network Engineer",
    titles: {
      en: "Network Engineer",
      ar: "مهندس الشبكات",
      es: "Ingeniero de Redes",
      fr: "Ingénieur Réseau",
      it: "Ingegnere di Rete",
      ja: "ネットワークエンジニア",
      ko: "네트워크 엔지니어",
      zh: "网络工程师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["network", "engineer", "infrastructure", "cisco"]
  },
  {
    code: "2520",
    titleEn: "Mobile App Developer",
    titles: {
      en: "Mobile App Developer",
      ar: "مطور تطبيقات الجوال",
      es: "Desarrollador de Apps Móviles",
      fr: "Développeur Applications Mobiles",
      it: "Sviluppatore App Mobile",
      ja: "モバイルアプリ開発者",
      ko: "모바일 앱 개발자",
      zh: "移动应用开发员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["mobile", "app", "developer", "iOS", "Android"]
  },
  {
    code: "2521",
    titleEn: "IT Support Specialist",
    titles: {
      en: "IT Support Specialist",
      ar: "أخصائي دعم تقني",
      es: "Especialista en Soporte IT",
      fr: "Spécialiste Support IT",
      it: "Specialista Supporto IT",
      ja: "ITサポートスペシャリスト",
      ko: "IT 지원 전문가",
      zh: "IT支持专员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    keywords: ["IT", "support", "specialist", "helpdesk"]
  },

  // ============= HEALTHCARE & MEDICAL =============
  {
    code: "2211",
    titleEn: "Medical Doctor",
    titles: {
      en: "Medical Doctor",
      ar: "طبيب",
      es: "Médico",
      fr: "Médecin",
      it: "Medico",
      ja: "医師",
      ko: "의사",
      zh: "医生"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    keywords: ["doctor", "physician", "medical", "MD"]
  },
  {
    code: "2212",
    titleEn: "Registered Nurse",
    titles: {
      en: "Registered Nurse",
      ar: "ممرض مسجل",
      es: "Enfermero Registrado",
      fr: "Infirmier Diplômé",
      it: "Infermiere Registrato",
      ja: "正看護師",
      ko: "간호사",
      zh: "注册护士"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    keywords: ["nurse", "nursing", "RN", "healthcare"]
  },
  {
    code: "2213",
    titleEn: "Pharmacist",
    titles: {
      en: "Pharmacist",
      ar: "صيدلي",
      es: "Farmacéutico",
      fr: "Pharmacien",
      it: "Farmacista",
      ja: "薬剤師",
      ko: "약사",
      zh: "药剂师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    keywords: ["pharmacist", "pharmacy", "medication", "drugs"]
  },
  {
    code: "2214",
    titleEn: "Physical Therapist",
    titles: {
      en: "Physical Therapist",
      ar: "أخصائي العلاج الطبيعي",
      es: "Fisioterapeuta",
      fr: "Kinésithérapeute",
      it: "Fisioterapista",
      ja: "理学療法士",
      ko: "물리치료사",
      zh: "物理治疗师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    keywords: ["physical", "therapist", "physiotherapy", "rehabilitation"]
  },
  {
    code: "2215",
    titleEn: "Dentist",
    titles: {
      en: "Dentist",
      ar: "طبيب أسنان",
      es: "Dentista",
      fr: "Dentiste",
      it: "Dentista",
      ja: "歯科医師",
      ko: "치과의사",
      zh: "牙医"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    keywords: ["dentist", "dental", "teeth", "oral"]
  },
  {
    code: "2216",
    titleEn: "Medical Assistant",
    titles: {
      en: "Medical Assistant",
      ar: "مساعد طبي",
      es: "Asistente Médico",
      fr: "Assistant Médical",
      it: "Assistente Medico",
      ja: "医療助手",
      ko: "의료 보조원",
      zh: "医疗助理"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Health Associate Professionals",
    category: "Healthcare & Medical",
    keywords: ["medical", "assistant", "healthcare", "clinic"]
  },
  {
    code: "2217",
    titleEn: "Veterinarian",
    titles: {
      en: "Veterinarian",
      ar: "طبيب بيطري",
      es: "Veterinario",
      fr: "Vétérinaire",
      it: "Veterinario",
      ja: "獣医師",
      ko: "수의사",
      zh: "兽医"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    keywords: ["veterinarian", "vet", "animal", "pet"]
  },
  {
    code: "2218",
    titleEn: "Psychologist",
    titles: {
      en: "Psychologist",
      ar: "عالم نفس",
      es: "Psicólogo",
      fr: "Psychologue",
      it: "Psicologo",
      ja: "心理学者",
      ko: "심리학자",
      zh: "心理学家"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    keywords: ["psychologist", "psychology", "mental", "therapy"]
  },

  // ============= FINANCE & ACCOUNTING =============
  {
    code: "2411",
    titleEn: "Accountant",
    titles: {
      en: "Accountant",
      ar: "محاسب",
      es: "Contador",
      fr: "Comptable",
      it: "Ragioniere",
      ja: "会計士",
      ko: "회계사",
      zh: "会计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Finance & Accounting",
    keywords: ["accountant", "accounting", "bookkeeper", "CPA"]
  },
  {
    code: "2412",
    titleEn: "Financial Analyst",
    titles: {
      en: "Financial Analyst",
      ar: "محلل مالي",
      es: "Analista Financiero",
      fr: "Analyste Financier",
      it: "Analista Finanziario",
      ja: "金融アナリスト",
      ko: "금융 분석가",
      zh: "金融分析师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Finance & Accounting",
    keywords: ["financial", "analyst", "finance", "investment"]
  },
  {
    code: "2413",
    titleEn: "Investment Advisor",
    titles: {
      en: "Investment Advisor",
      ar: "مستشار استثماري",
      es: "Asesor de Inversiones",
      fr: "Conseiller en Investissement",
      it: "Consulente Investimenti",
      ja: "投資アドバイザー",
      ko: "투자 고문",
      zh: "投资顾问"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Finance & Accounting",
    keywords: ["investment", "advisor", "financial", "portfolio"]
  },
  {
    code: "2414",
    titleEn: "Bank Manager",
    titles: {
      en: "Bank Manager",
      ar: "مدير مصرف",
      es: "Gerente de Banco",
      fr: "Directeur de Banque",
      it: "Direttore di Banca",
      ja: "銀行マネージャー",
      ko: "은행 관리자",
      zh: "银行经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Finance Management",
    category: "Finance & Accounting",
    keywords: ["bank", "manager", "banking", "financial"]
  },
  {
    code: "2415",
    titleEn: "Insurance Agent",
    titles: {
      en: "Insurance Agent",
      ar: "وكيل تأمين",
      es: "Agente de Seguros",
      fr: "Agent d'Assurance",
      it: "Agente Assicurativo",
      ja: "保険エージェント",
      ko: "보험 에이전트",
      zh: "保险代理人"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Sales Workers",
    category: "Finance & Accounting",
    keywords: ["insurance", "agent", "policy", "coverage"]
  },
  {
    code: "2416",
    titleEn: "Tax Consultant",
    titles: {
      en: "Tax Consultant",
      ar: "مستشار ضريبي",
      es: "Consultor Fiscal",
      fr: "Conseiller Fiscal",
      it: "Consulente Fiscale",
      ja: "税務コンサルタント",
      ko: "세무 컨설턴트",
      zh: "税务顾问"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Finance & Accounting",
    keywords: ["tax", "consultant", "taxation", "fiscal"]
  },

  // ============= EDUCATION & TRAINING =============
  {
    code: "2310",
    titleEn: "University Professor",
    titles: {
      en: "University Professor",
      ar: "أستاذ جامعي",
      es: "Profesor Universitario",
      fr: "Professeur d'Université",
      it: "Professore Universitario",
      ja: "大学教授",
      ko: "대학교수",
      zh: "大学教授"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    keywords: ["professor", "university", "academic", "research"]
  },
  {
    code: "2320",
    titleEn: "Secondary School Teacher",
    titles: {
      en: "Secondary School Teacher",
      ar: "مدرس المرحلة الثانوية",
      es: "Profesor de Secundaria",
      fr: "Professeur du Secondaire",
      it: "Professore di Scuola Secondaria",
      ja: "中学校教師",
      ko: "중등학교 교사",
      zh: "中学教师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    keywords: ["teacher", "secondary", "school", "education"]
  },
  {
    code: "2330",
    titleEn: "Primary School Teacher",
    titles: {
      en: "Primary School Teacher",
      ar: "مدرس المرحلة الابتدائية",
      es: "Profesor de Primaria",
      fr: "Professeur des Écoles",
      it: "Maestro di Scuola Primaria",
      ja: "小学校教師",
      ko: "초등학교 교사",
      zh: "小学教师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    keywords: ["teacher", "primary", "elementary", "school"]
  },
  {
    code: "2341",
    titleEn: "Early Childhood Educator",
    titles: {
      en: "Early Childhood Educator",
      ar: "مربي الطفولة المبكرة",
      es: "Educador de Primera Infancia",
      fr: "Éducateur de Petite Enfance",
      it: "Educatore Prima Infanzia",
      ja: "幼児教育者",
      ko: "유아교육자",
      zh: "幼儿教育工作者"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    keywords: ["early", "childhood", "educator", "preschool"]
  },
  {
    code: "2350",
    titleEn: "Education Administrator",
    titles: {
      en: "Education Administrator",
      ar: "إداري تعليمي",
      es: "Administrador Educativo",
      fr: "Administrateur Éducatif",
      it: "Amministratore Scolastico",
      ja: "教育管理者",
      ko: "교육 관리자",
      zh: "教育管理员"
    },
    majorGroup: "Management",
    subMajorGroup: "Education Management",
    category: "Education & Training",
    keywords: ["education", "administrator", "school", "management"]
  },
  {
    code: "2360",
    titleEn: "Training Specialist",
    titles: {
      en: "Training Specialist",
      ar: "أخصائي التدريب",
      es: "Especialista en Capacitación",
      fr: "Spécialiste Formation",
      it: "Specialista Formazione",
      ja: "研修専門家",
      ko: "교육 전문가",
      zh: "培训专员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Training and Development Professionals",
    category: "Education & Training",
    keywords: ["training", "specialist", "development", "instructor"]
  },

  // ============= SALES & MARKETING =============
  {
    code: "2431",
    titleEn: "Marketing Manager",
    titles: {
      en: "Marketing Manager",
      ar: "مدير التسويق",
      es: "Gerente de Marketing",
      fr: "Directeur Marketing",
      it: "Direttore Marketing",
      ja: "マーケティングマネージャー",
      ko: "마케팅 관리자",
      zh: "营销经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Marketing Management",
    category: "Sales & Marketing",
    keywords: ["marketing", "manager", "promotion", "advertising"]
  },
  {
    code: "5220",
    titleEn: "Sales Representative",
    titles: {
      en: "Sales Representative",
      ar: "ممثل مبيعات",
      es: "Representante de Ventas",
      fr: "Représentant Commercial",
      it: "Rappresentante Vendite",
      ja: "営業担当者",
      ko: "영업 담당자",
      zh: "销售代表"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Sales Workers",
    category: "Sales & Marketing",
    keywords: ["sales", "representative", "selling", "commercial"]
  },
  {
    code: "2432",
    titleEn: "Digital Marketing Specialist",
    titles: {
      en: "Digital Marketing Specialist",
      ar: "أخصائي التسويق الرقمي",
      es: "Especialista en Marketing Digital",
      fr: "Spécialiste Marketing Digital",
      it: "Specialista Marketing Digitale",
      ja: "デジタルマーケティングスペシャリスト",
      ko: "디지털 마케팅 전문가",
      zh: "数字营销专员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Marketing and Sales Professionals",
    category: "Sales & Marketing",
    keywords: ["digital", "marketing", "online", "social media"]
  },
  {
    code: "2433",
    titleEn: "Business Development Manager",
    titles: {
      en: "Business Development Manager",
      ar: "مدير تطوير الأعمال",
      es: "Gerente de Desarrollo de Negocios",
      fr: "Directeur Développement Commercial",
      it: "Direttore Sviluppo Business",
      ja: "事業開発マネージャー",
      ko: "사업개발 관리자",
      zh: "业务发展经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Business Development",
    category: "Sales & Marketing",
    keywords: ["business", "development", "growth", "strategy"]
  },
  {
    code: "5221",
    titleEn: "Account Manager",
    titles: {
      en: "Account Manager",
      ar: "مدير حساب",
      es: "Gerente de Cuenta",
      fr: "Gestionnaire de Compte",
      it: "Account Manager",
      ja: "アカウントマネージャー",
      ko: "계정 관리자",
      zh: "客户经理"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Sales Workers",
    category: "Sales & Marketing",
    keywords: ["account", "manager", "client", "relationship"]
  },

  // ============= CREATIVE ARTS & DESIGN =============
  {
    code: "2621",
    titleEn: "Graphic Designer",
    titles: {
      en: "Graphic Designer",
      ar: "مصمم جرافيك",
      es: "Diseñador Gráfico",
      fr: "Graphiste",
      it: "Grafico Designer",
      ja: "グラフィックデザイナー",
      ko: "그래픽 디자이너",
      zh: "平面设计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Creative Professionals",
    category: "Creative Arts & Design",
    keywords: ["graphic", "designer", "visual", "creative"]
  },
  {
    code: "2622",
    titleEn: "Photographer",
    titles: {
      en: "Photographer",
      ar: "مصور فوتوغرافي",
      es: "Fotógrafo",
      fr: "Photographe",
      it: "Fotografo",
      ja: "写真家",
      ko: "사진작가",
      zh: "摄影师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Creative Professionals",
    category: "Creative Arts & Design",
    keywords: ["photographer", "photography", "camera", "visual"]
  },
  {
    code: "2623",
    titleEn: "Video Editor",
    titles: {
      en: "Video Editor",
      ar: "محرر فيديو",
      es: "Editor de Video",
      fr: "Monteur Vidéo",
      it: "Video Editor",
      ja: "ビデオエディター",
      ko: "영상 편집자",
      zh: "视频编辑"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Creative Professionals",
    category: "Creative Arts & Design",
    keywords: ["video", "editor", "editing", "production"]
  },
  {
    code: "2624",
    titleEn: "Content Creator",
    titles: {
      en: "Content Creator",
      ar: "منشئ المحتوى",
      es: "Creador de Contenido",
      fr: "Créateur de Contenu",
      it: "Content Creator",
      ja: "コンテンツクリエイター",
      ko: "콘텐츠 크리에이터",
      zh: "内容创作者"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Creative Professionals",
    category: "Creative Arts & Design",
    keywords: ["content", "creator", "social", "media"]
  },
  {
    code: "2625",
    titleEn: "Interior Designer",
    titles: {
      en: "Interior Designer",
      ar: "مصمم داخلي",
      es: "Diseñador de Interiores",
      fr: "Architecte d'Intérieur",
      it: "Designer d'Interni",
      ja: "インテリアデザイナー",
      ko: "인테리어 디자이너",
      zh: "室内设计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Creative Professionals",
    category: "Creative Arts & Design",
    keywords: ["interior", "designer", "decoration", "space"]
  },
  {
    code: "2626",
    titleEn: "Fashion Designer",
    titles: {
      en: "Fashion Designer",
      ar: "مصمم أزياء",
      es: "Diseñador de Moda",
      fr: "Styliste",
      it: "Stilista",
      ja: "ファッションデザイナー",
      ko: "패션 디자이너",
      zh: "时装设计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Creative Professionals",
    category: "Creative Arts & Design",
    keywords: ["fashion", "designer", "clothing", "style"]
  },

  // ============= SKILLED TRADES & CONSTRUCTION =============
  {
    code: "7111",
    titleEn: "Electrician",
    titles: {
      en: "Electrician",
      ar: "كهربائي",
      es: "Electricista",
      fr: "Électricien",
      it: "Elettricista",
      ja: "電気技師",
      ko: "전기기사",
      zh: "电工"
    },
    majorGroup: "Skilled Trades",
    subMajorGroup: "Electrical Trades",
    category: "Skilled Trades & Construction",
    keywords: ["electrician", "electrical", "wiring", "power"]
  },
  {
    code: "7112",
    titleEn: "Plumber",
    titles: {
      en: "Plumber",
      ar: "سباك",
      es: "Fontanero",
      fr: "Plombier",
      it: "Idraulico",
      ja: "配管工",
      ko: "배관공",
      zh: "水管工"
    },
    majorGroup: "Skilled Trades",
    subMajorGroup: "Plumbing Trades",
    category: "Skilled Trades & Construction",
    keywords: ["plumber", "plumbing", "pipes", "water"]
  },
  {
    code: "7113",
    titleEn: "Carpenter",
    titles: {
      en: "Carpenter",
      ar: "نجار",
      es: "Carpintero",
      fr: "Charpentier",
      it: "Falegname",
      ja: "大工",
      ko: "목수",
      zh: "木工"
    },
    majorGroup: "Skilled Trades",
    subMajorGroup: "Construction Trades",
    category: "Skilled Trades & Construction",
    keywords: ["carpenter", "wood", "construction", "building"]
  },
  {
    code: "7114",
    titleEn: "HVAC Technician",
    titles: {
      en: "HVAC Technician",
      ar: "فني تكييف وتهوية",
      es: "Técnico HVAC",
      fr: "Technicien CVC",
      it: "Tecnico HVAC",
      ja: "空調技術者",
      ko: "공조기술자",
      zh: "暖通空调技师"
    },
    majorGroup: "Skilled Trades",
    subMajorGroup: "HVAC Trades",
    category: "Skilled Trades & Construction",
    keywords: ["HVAC", "heating", "cooling", "air conditioning"]
  },
  {
    code: "7115",
    titleEn: "Construction Worker",
    titles: {
      en: "Construction Worker",
      ar: "عامل بناء",
      es: "Obrero de Construcción",
      fr: "Ouvrier du Bâtiment",
      it: "Operaio Edile",
      ja: "建設作業員",
      ko: "건설 작업자",
      zh: "建筑工人"
    },
    majorGroup: "Skilled Trades",
    subMajorGroup: "Construction Trades",
    category: "Skilled Trades & Construction",
    keywords: ["construction", "worker", "building", "labor"]
  },
  {
    code: "7116",
    titleEn: "Welder",
    titles: {
      en: "Welder",
      ar: "لحام",
      es: "Soldador",
      fr: "Soudeur",
      it: "Saldatore",
      ja: "溶接工",
      ko: "용접공",
      zh: "焊工"
    },
    majorGroup: "Skilled Trades",
    subMajorGroup: "Metal Trades",
    category: "Skilled Trades & Construction",
    keywords: ["welder", "welding", "metal", "fabrication"]
  },

  // ============= SERVICE INDUSTRY & HOSPITALITY =============
  {
    code: "5120",
    titleEn: "Chef",
    titles: {
      en: "Chef",
      ar: "طباخ",
      es: "Chef",
      fr: "Chef",
      it: "Cuoco",
      ja: "シェフ",
      ko: "요리사",
      zh: "厨师"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Food Service Workers",
    category: "Service Industry & Hospitality",
    keywords: ["chef", "cook", "kitchen", "restaurant"]
  },
  {
    code: "4222",
    titleEn: "Customer Service Representative",
    titles: {
      en: "Customer Service Representative",
      ar: "ممثل خدمة العملاء",
      es: "Representante de Atención al Cliente",
      fr: "Représentant Service Client",
      it: "Rappresentante Servizio Clienti",
      ja: "カスタマーサービス担当者",
      ko: "고객서비스 담당자",
      zh: "客户服务代表"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Customer Service Workers",
    category: "Service Industry & Hospitality",
    keywords: ["customer", "service", "support", "help"]
  },
  {
    code: "1431",
    titleEn: "Hotel Manager",
    titles: {
      en: "Hotel Manager",
      ar: "مدير فندق",
      es: "Gerente de Hotel",
      fr: "Directeur d'Hôtel",
      it: "Direttore Hotel",
      ja: "ホテルマネージャー",
      ko: "호텔 관리자",
      zh: "酒店经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Hospitality Management",
    category: "Service Industry & Hospitality",
    keywords: ["hotel", "manager", "hospitality", "accommodation"]
  },
  {
    code: "5131",
    titleEn: "Waiter/Waitress",
    titles: {
      en: "Waiter/Waitress",
      ar: "نادل/نادلة",
      es: "Camarero/Camarera",
      fr: "Serveur/Serveuse",
      it: "Cameriere/Cameriera",
      ja: "ウェイター/ウェイトレス",
      ko: "웨이터/웨이트리스",
      zh: "服务员"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Food Service Workers",
    category: "Service Industry & Hospitality",
    keywords: ["waiter", "waitress", "server", "restaurant"]
  },
  {
    code: "5132",
    titleEn: "Bartender",
    titles: {
      en: "Bartender",
      ar: "نادل بار",
      es: "Cantinero",
      fr: "Barman",
      it: "Barista",
      ja: "バーテンダー",
      ko: "바텐더",
      zh: "调酒师"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Food Service Workers",
    category: "Service Industry & Hospitality",
    keywords: ["bartender", "bar", "drinks", "cocktails"]
  },

  // ============= LEGAL & COMPLIANCE =============
  {
    code: "2611",
    titleEn: "Lawyer",
    titles: {
      en: "Lawyer",
      ar: "محامي",
      es: "Abogado",
      fr: "Avocat",
      it: "Avvocato",
      ja: "弁護士",
      ko: "변호사",
      zh: "律师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    keywords: ["lawyer", "attorney", "legal", "law"]
  },
  {
    code: "2612",
    titleEn: "Paralegal",
    titles: {
      en: "Paralegal",
      ar: "مساعد قانوني",
      es: "Asistente Legal",
      fr: "Assistant Juridique",
      it: "Assistente Legale",
      ja: "パラリーガル",
      ko: "법무보조원",
      zh: "律师助理"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Legal Associate Professionals",
    category: "Legal & Compliance",
    keywords: ["paralegal", "legal", "assistant", "law"]
  },
  {
    code: "2613",
    titleEn: "Compliance Officer",
    titles: {
      en: "Compliance Officer",
      ar: "ضابط الامتثال",
      es: "Oficial de Cumplimiento",
      fr: "Responsable Conformité",
      it: "Responsabile Compliance",
      ja: "コンプライアンス責任者",
      ko: "컴플라이언스 담당자",
      zh: "合规官"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    keywords: ["compliance", "officer", "regulations", "audit"]
  },
  {
    code: "2614",
    titleEn: "Judge",
    titles: {
      en: "Judge",
      ar: "قاضي",
      es: "Juez",
      fr: "Juge",
      it: "Giudice",
      ja: "裁判官",
      ko: "판사",
      zh: "法官"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    keywords: ["judge", "court", "justice", "legal"]
  },

  // ============= TRANSPORTATION & LOGISTICS =============
  {
    code: "8322",
    titleEn: "Truck Driver",
    titles: {
      en: "Truck Driver",
      ar: "سائق شاحنة",
      es: "Conductor de Camión",
      fr: "Chauffeur de Camion",
      it: "Autista di Camion",
      ja: "トラック運転手",
      ko: "트럭 운전사",
      zh: "卡车司机"
    },
    majorGroup: "Plant and Machine Operators",
    subMajorGroup: "Transport Operators",
    category: "Transportation & Logistics",
    keywords: ["truck", "driver", "transport", "delivery"]
  },
  {
    code: "8323",
    titleEn: "Taxi Driver",
    titles: {
      en: "Taxi Driver",
      ar: "سائق تاكسي",
      es: "Conductor de Taxi",
      fr: "Chauffeur de Taxi",
      it: "Tassista",
      ja: "タクシー運転手",
      ko: "택시 운전사",
      zh: "出租车司机"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Transport Workers",
    category: "Transportation & Logistics",
    keywords: ["taxi", "driver", "transport", "passenger"]
  },
  {
    code: "1324",
    titleEn: "Logistics Manager",
    titles: {
      en: "Logistics Manager",
      ar: "مدير الخدمات اللوجستية",
      es: "Gerente de Logística",
      fr: "Responsable Logistique",
      it: "Responsabile Logistica",
      ja: "物流マネージャー",
      ko: "물류 관리자",
      zh: "物流经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Supply Chain Management",
    category: "Transportation & Logistics",
    keywords: ["logistics", "manager", "supply", "chain"]
  },
  {
    code: "2151",
    titleEn: "Pilot",
    titles: {
      en: "Pilot",
      ar: "طيار",
      es: "Piloto",
      fr: "Pilote",
      it: "Pilota",
      ja: "パイロット",
      ko: "조종사",
      zh: "飞行员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Transport Professionals",
    category: "Transportation & Logistics",
    keywords: ["pilot", "aviation", "aircraft", "flying"]
  },

  // ============= MANUFACTURING & PRODUCTION =============
  {
    code: "8111",
    titleEn: "Production Manager",
    titles: {
      en: "Production Manager",
      ar: "مدير الإنتاج",
      es: "Gerente de Producción",
      fr: "Directeur de Production",
      it: "Direttore di Produzione",
      ja: "生産管理者",
      ko: "생산 관리자",
      zh: "生产经理"
    },
    majorGroup: "Management",
    subMajorGroup: "Production Management",
    category: "Manufacturing & Production",
    keywords: ["production", "manager", "manufacturing", "operations"]
  },
  {
    code: "8112",
    titleEn: "Quality Control Inspector",
    titles: {
      en: "Quality Control Inspector",
      ar: "مفتش مراقبة الجودة",
      es: "Inspector de Control de Calidad",
      fr: "Inspecteur Qualité",
      it: "Ispettore Qualità",
      ja: "品質管理検査員",
      ko: "품질관리 검사원",
      zh: "质量控制检验员"
    },
    majorGroup: "Technicians",
    subMajorGroup: "Quality Control Technicians",
    category: "Manufacturing & Production",
    keywords: ["quality", "control", "inspector", "testing"]
  },
  {
    code: "8113",
    titleEn: "Machine Operator",
    titles: {
      en: "Machine Operator",
      ar: "مشغل آلة",
      es: "Operador de Máquina",
      fr: "Opérateur Machine",
      it: "Operatore Macchina",
      ja: "機械オペレーター",
      ko: "기계 조작원",
      zh: "机器操作员"
    },
    majorGroup: "Plant and Machine Operators",
    subMajorGroup: "Machine Operators",
    category: "Manufacturing & Production",
    keywords: ["machine", "operator", "equipment", "production"]
  },
  {
    code: "8114",
    titleEn: "Assembly Line Worker",
    titles: {
      en: "Assembly Line Worker",
      ar: "عامل خط التجميع",
      es: "Trabajador de Línea de Montaje",
      fr: "Ouvrier Chaîne de Montage",
      it: "Operaio Catena di Montaggio",
      ja: "組立ライン作業員",
      ko: "조립라인 작업자",
      zh: "装配线工人"
    },
    majorGroup: "Plant and Machine Operators",
    subMajorGroup: "Assembly Workers",
    category: "Manufacturing & Production",
    keywords: ["assembly", "line", "worker", "manufacturing"]
  },

  // ============= SELF-EMPLOYED & FREELANCERS =============
  {
    code: "9001",
    titleEn: "Freelancer",
    titles: {
      en: "Freelancer",
      ar: "عامل حر",
      es: "Freelancer",
      fr: "Freelance",
      it: "Freelancer",
      ja: "フリーランサー",
      ko: "프리랜서",
      zh: "自由职业者"
    },
    majorGroup: "Self-Employed",
    subMajorGroup: "Independent Contractors",
    category: "Self-Employed & Freelancers",
    keywords: ["freelancer", "independent", "contractor", "self-employed"]
  },
  {
    code: "9002",
    titleEn: "Consultant",
    titles: {
      en: "Consultant",
      ar: "مستشار",
      es: "Consultor",
      fr: "Consultant",
      it: "Consulente",
      ja: "コンサルタント",
      ko: "컨설턴트",
      zh: "顾问"
    },
    majorGroup: "Self-Employed",
    subMajorGroup: "Independent Contractors",
    category: "Self-Employed & Freelancers",
    keywords: ["consultant", "advisor", "expert", "specialist"]
  },
  {
    code: "9003",
    titleEn: "Entrepreneur",
    titles: {
      en: "Entrepreneur",
      ar: "رائد أعمال",
      es: "Emprendedor",
      fr: "Entrepreneur",
      it: "Imprenditore",
      ja: "起業家",
      ko: "기업가",
      zh: "企业家"
    },
    majorGroup: "Self-Employed",
    subMajorGroup: "Business Owners",
    category: "Self-Employed & Freelancers",
    keywords: ["entrepreneur", "business", "owner", "startup"]
  },
  {
    code: "9004",
    titleEn: "Small Business Owner",
    titles: {
      en: "Small Business Owner",
      ar: "صاحب عمل صغير",
      es: "Propietario de Pequeña Empresa",
      fr: "Propriétaire de Petite Entreprise",
      it: "Proprietario Piccola Impresa",
      ja: "小企業経営者",
      ko: "소기업 소유자",
      zh: "小企业主"
    },
    majorGroup: "Self-Employed",
    subMajorGroup: "Business Owners",
    category: "Self-Employed & Freelancers",
    keywords: ["small", "business", "owner", "entrepreneur"]
  },

  // ============= GOVERNMENT & PUBLIC SERVICE =============
  {
    code: "3411",
    titleEn: "Police Officer",
    titles: {
      en: "Police Officer",
      ar: "ضابط شرطة",
      es: "Oficial de Policía",
      fr: "Agent de Police",
      it: "Agente di Polizia",
      ja: "警察官",
      ko: "경찰관",
      zh: "警察"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Protective Service Workers",
    category: "Government & Public Service",
    keywords: ["police", "officer", "law", "enforcement"]
  },
  {
    code: "3412",
    titleEn: "Firefighter",
    titles: {
      en: "Firefighter",
      ar: "رجل إطفاء",
      es: "Bombero",
      fr: "Pompier",
      it: "Vigile del Fuoco",
      ja: "消防士",
      ko: "소방관",
      zh: "消防员"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Protective Service Workers",
    category: "Government & Public Service",
    keywords: ["firefighter", "fire", "emergency", "rescue"]
  },
  {
    code: "3413",
    titleEn: "Social Worker",
    titles: {
      en: "Social Worker",
      ar: "أخصائي اجتماعي",
      es: "Trabajador Social",
      fr: "Travailleur Social",
      it: "Assistente Sociale",
      ja: "ソーシャルワーカー",
      ko: "사회복지사",
      zh: "社会工作者"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Social and Human Service Professionals",
    category: "Government & Public Service",
    keywords: ["social", "worker", "welfare", "community"]
  },
  {
    code: "3414",
    titleEn: "Government Administrator",
    titles: {
      en: "Government Administrator",
      ar: "إداري حكومي",
      es: "Administrador Gubernamental",
      fr: "Administrateur Gouvernemental",
      it: "Amministratore Governativo",
      ja: "政府管理者",
      ko: "정부 행정관",
      zh: "政府管理员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Government Professionals",
    category: "Government & Public Service",
    keywords: ["government", "administrator", "public", "service"]
  },

  // ============= OTHER COMMON JOBS =============
  {
    code: "8001",
    titleEn: "Cleaner",
    titles: {
      en: "Cleaner",
      ar: "منظف",
      es: "Limpiador",
      fr: "Agent d'Entretien",
      it: "Addetto alle Pulizie",
      ja: "清掃員",
      ko: "청소원",
      zh: "清洁工"
    },
    majorGroup: "Elementary Occupations",
    subMajorGroup: "Cleaning Workers",
    category: "Other",
    keywords: ["cleaner", "cleaning", "janitor", "maintenance"]
  },
  {
    code: "8002",
    titleEn: "Security Guard",
    titles: {
      en: "Security Guard",
      ar: "حارس أمن",
      es: "Guardia de Seguridad",
      fr: "Agent de Sécurité",
      it: "Guardia di Sicurezza",
      ja: "警備員",
      ko: "경비원",
      zh: "保安"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Protective Service Workers",
    category: "Other",
    keywords: ["security", "guard", "protection", "safety"]
  },
  {
    code: "8003",
    titleEn: "Delivery Driver",
    titles: {
      en: "Delivery Driver",
      ar: "سائق توصيل",
      es: "Conductor de Reparto",
      fr: "Livreur",
      it: "Fattorino",
      ja: "配達ドライバー",
      ko: "배달 기사",
      zh: "送货司机"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Transport Workers",
    category: "Other",
    keywords: ["delivery", "driver", "courier", "transport"]
  },
  {
    code: "8004",
    titleEn: "Retail Associate",
    titles: {
      en: "Retail Associate",
      ar: "مندوب مبيعات تجزئة",
      es: "Asociado de Ventas",
      fr: "Vendeur",
      it: "Addetto Vendite",
      ja: "小売店員",
      ko: "소매점 직원",
      zh: "零售店员"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Sales Workers",
    category: "Other",
    keywords: ["retail", "associate", "sales", "store"]
  },
  {
    code: "8005",
    titleEn: "Administrative Assistant",
    titles: {
      en: "Administrative Assistant",
      ar: "مساعد إداري",
      es: "Asistente Administrativo",
      fr: "Assistant Administratif",
      it: "Assistente Amministrativo",
      ja: "事務アシスタント",
      ko: "행정 보조원",
      zh: "行政助理"
    },
    majorGroup: "Clerical Support Workers",
    subMajorGroup: "General Office Clerks",
    category: "Other",
    keywords: ["administrative", "assistant", "office", "clerk"]
  },
  {
    code: "8006",
    titleEn: "Receptionist",
    titles: {
      en: "Receptionist",
      ar: "موظف استقبال",
      es: "Recepcionista",
      fr: "Réceptionniste",
      it: "Receptionist",
      ja: "受付係",
      ko: "접수원",
      zh: "接待员"
    },
    majorGroup: "Clerical Support Workers",
    subMajorGroup: "Customer Information Clerks",
    category: "Other",
    keywords: ["receptionist", "reception", "front", "desk"]
  },
  {
    code: "8007",
    titleEn: "Real Estate Agent",
    titles: {
      en: "Real Estate Agent",
      ar: "وكيل عقارات",
      es: "Agente Inmobiliario",
      fr: "Agent Immobilier",
      it: "Agente Immobiliare",
      ja: "不動産エージェント",
      ko: "부동산 중개인",
      zh: "房地产经纪人"
    },
    majorGroup: "Service Workers",
    subMajorGroup: "Sales Workers",
    category: "Other",
    keywords: ["real", "estate", "agent", "property"]
  },
  {
    code: "8008",
    titleEn: "Mechanic",
    titles: {
      en: "Mechanic",
      ar: "ميكانيكي",
      es: "Mecánico",
      fr: "Mécanicien",
      it: "Meccanico",
      ja: "整備士",
      ko: "정비사",
      zh: "机修工"
    },
    majorGroup: "Skilled Trades",
    subMajorGroup: "Vehicle Maintenance",
    category: "Other",
    keywords: ["mechanic", "automotive", "repair", "maintenance"]
  }
];

// Major groups for categorization
export const majorGroups = [
  {
    code: "MGMT",
    name: "Management & Executive",
    titleEn: "Management & Executive",
    titles: {
      en: "Management & Executive",
      ar: "الإدارة والتنفيذ",
      es: "Gestión y Ejecutivo", 
      fr: "Direction et Exécutif",
      it: "Management ed Esecutivo",
      ja: "経営・幹部",
      ko: "경영진 및 임원",
      zh: "管理与行政人员"
    }
  },
  {
    code: "IT",
    name: "Information Technology",
    titleEn: "Information Technology",
    titles: {
      en: "Information Technology",
      ar: "تقنية المعلومات",
      es: "Tecnología de la Información",
      fr: "Technologies de l'Information",
      it: "Tecnologie dell'Informazione",
      ja: "情報技術",
      ko: "정보기술",
      zh: "信息技术"
    }
  },
  {
    code: "HLTH",
    name: "Healthcare & Medical",
    titleEn: "Healthcare & Medical",
    titles: {
      en: "Healthcare & Medical",
      ar: "الرعاية الصحية والطبية",
      es: "Salud y Medicina",
      fr: "Santé et Médical",
      it: "Sanitario e Medico",
      ja: "医療・保健",
      ko: "의료 및 보건",
      zh: "医疗保健"
    }
  },
  {
    code: "FIN",
    name: "Finance & Accounting",
    titleEn: "Finance & Accounting",
    titles: {
      en: "Finance & Accounting",
      ar: "المالية والمحاسبة",
      es: "Finanzas y Contabilidad",
      fr: "Finance et Comptabilité",
      it: "Finanza e Contabilità",
      ja: "金融・会計",
      ko: "재무 및 회계",
      zh: "金融会计"
    }
  },
  {
    code: "EDU",
    name: "Education & Training",
    titleEn: "Education & Training",
    titles: {
      en: "Education & Training",
      ar: "التعليم والتدريب",
      es: "Educación y Capacitación",
      fr: "Éducation et Formation",
      it: "Educazione e Formazione",
      ja: "教育・研修",
      ko: "교육 및 훈련",
      zh: "教育培训"
    }
  },
  {
    code: "SALES",
    name: "Sales & Marketing",
    titleEn: "Sales & Marketing",
    titles: {
      en: "Sales & Marketing",
      ar: "المبيعات والتسويق",
      es: "Ventas y Marketing",
      fr: "Vente et Marketing",
      it: "Vendite e Marketing",
      ja: "営業・マーケティング",
      ko: "영업 및 마케팅",
      zh: "销售营销"
    }
  },
  {
    code: "ARTS",
    name: "Creative Arts & Design",
    titleEn: "Creative Arts & Design",
    titles: {
      en: "Creative Arts & Design",
      ar: "الفنون الإبداعية والتصميم",
      es: "Artes Creativas y Diseño",
      fr: "Arts Créatifs et Design",
      it: "Arti Creative e Design",
      ja: "クリエイティブ・アート・デザイン",
      ko: "창작 예술 및 디자인",
      zh: "创意艺术设计"
    }
  },
  {
    code: "TRADES",
    name: "Skilled Trades & Construction",
    titleEn: "Skilled Trades & Construction",
    titles: {
      en: "Skilled Trades & Construction",
      ar: "المهن المهرة والبناء",
      es: "Oficios Especializados y Construcción",
      fr: "Métiers Spécialisés et Construction",
      it: "Mestieri Specializzati e Costruzioni",
      ja: "熟練技能・建設",
      ko: "숙련 기술직 및 건설",
      zh: "技能行业建筑"
    }
  },
  {
    code: "HOSP",
    name: "Service Industry & Hospitality",
    titleEn: "Service Industry & Hospitality",
    titles: {
      en: "Service Industry & Hospitality",
      ar: "صناعة الخدمات والضيافة",
      es: "Industria de Servicios y Hospitalidad",
      fr: "Services et Hôtellerie",
      it: "Servizi e Ospitalità",
      ja: "サービス・ホスピタリティ",
      ko: "서비스업 및 접객업",
      zh: "服务业酒店业"
    }
  },
  {
    code: "LEGAL",
    name: "Legal & Compliance",
    titleEn: "Legal & Compliance",
    titles: {
      en: "Legal & Compliance",
      ar: "القانونية والامتثال",
      es: "Legal y Cumplimiento",
      fr: "Juridique et Conformité",
      it: "Legale e Compliance",
      ja: "法務・コンプライアンス",
      ko: "법무 및 컴플라이언스",
      zh: "法律合规"
    }
  },
  {
    code: "TRANS",
    name: "Transportation & Logistics",
    titleEn: "Transportation & Logistics",
    titles: {
      en: "Transportation & Logistics",
      ar: "النقل والخدمات اللوجستية",
      es: "Transporte y Logística",
      fr: "Transport et Logistique",
      it: "Trasporti e Logistica",
      ja: "運輸・物流",
      ko: "운송 및 물류",
      zh: "交通物流"
    }
  },
  {
    code: "MFG",
    name: "Manufacturing & Production",
    titleEn: "Manufacturing & Production",
    titles: {
      en: "Manufacturing & Production",
      ar: "التصنيع والإنتاج",
      es: "Manufactura y Producción",
      fr: "Fabrication et Production",
      it: "Manifattura e Produzione",
      ja: "製造・生産",
      ko: "제조 및 생산",
      zh: "制造生产"
    }
  },
  {
    code: "SELF",
    name: "Self-Employed & Freelancers",
    titleEn: "Self-Employed & Freelancers",
    titles: {
      en: "Self-Employed & Freelancers",
      ar: "العمل الحر والمستقلون",
      es: "Autónomos y Freelancers",
      fr: "Indépendants et Freelances",
      it: "Autonomi e Freelancer",
      ja: "自営業・フリーランス",
      ko: "자영업 및 프리랜서",
      zh: "自雇自由职业"
    }
  },
  {
    code: "GOV",
    name: "Government & Public Service",
    titleEn: "Government & Public Service",
    titles: {
      en: "Government & Public Service",
      ar: "الحكومة والخدمة العامة",
      es: "Gobierno y Servicio Público",
      fr: "Gouvernement et Service Public",
      it: "Governo e Servizio Pubblico",
      ja: "政府・公共サービス",
      ko: "정부 및 공공서비스",
      zh: "政府公共服务"
    }
  },
  {
    code: "OTHER",
    name: "Other",
    titleEn: "Other",
    titles: {
      en: "Other",
      ar: "أخرى",
      es: "Otros",
      fr: "Autres",
      it: "Altri",
      ja: "その他",
      ko: "기타",
      zh: "其他"
    }
  }
];

// Popular jobs that should appear at the top
export const popularJobs = [
  // Technology & IT - Most in demand
  "2511", // Software Developer
  "2512", // Web Developer
  "2513", // Data Scientist
  "2515", // UX/UI Designer
  "2516", // DevOps Engineer
  "2517", // Cybersecurity Analyst
  "2520", // Mobile App Developer
  "2521", // IT Support Specialist
  
  // Business & Management - Very common
  "1115", // Project Manager
  "1116", // Product Manager
  "1113", // Operations Manager
  "1117", // Department Head
  "1118", // Team Leader
  "2431", // Marketing Manager
  "2433", // Business Development Manager
  
  // Finance & Accounting - Always needed
  "2411", // Accountant
  "2412", // Financial Analyst
  "2413", // Investment Advisor
  "2415", // Insurance Agent
  
  // Healthcare - Essential services
  "2211", // Medical Doctor
  "2212", // Registered Nurse
  "2213", // Pharmacist
  "2214", // Physical Therapist
  "2216", // Medical Assistant
  
  // Education - Common profession
  "2310", // University Professor
  "2320", // Secondary School Teacher
  "2330", // Primary School Teacher
  "2341", // Early Childhood Educator
  
  // Sales & Customer Service - High volume
  "5220", // Sales Representative
  "4222", // Customer Service Representative
  "5221", // Account Manager
  "8007", // Real Estate Agent
  
  // Creative & Design - Growing field
  "2621", // Graphic Designer
  "2622", // Photographer
  "2623", // Video Editor
  "2624", // Content Creator
  
  // Skilled Trades - Always in demand
  "7111", // Electrician
  "7112", // Plumber
  "7113", // Carpenter
  "7114", // HVAC Technician
  "8008", // Mechanic
  
  // Service Industry - Large employment sector
  "5120", // Chef
  "5131", // Waiter/Waitress
  "8005", // Administrative Assistant
  "8006", // Receptionist
  
  // Self-Employed - Growing category
  "9001", // Freelancer
  "9002", // Consultant
  "9003", // Entrepreneur
  "9004", // Small Business Owner
  
  // Legal - Professional services
  "2611", // Lawyer
  "2612", // Paralegal
  
  // Other Common Jobs
  "8001", // Cleaner
  "8002", // Security Guard
  "8003", // Delivery Driver
  "8004", // Retail Associate
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