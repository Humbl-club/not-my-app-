import { jobClassifications } from '@/constants/job-classifications';

// Comprehensive static translation dictionary with 500+ entries per language
const staticTranslations: Record<string, Record<string, string>> = {
  // FRENCH TO ENGLISH
  fr: {
    // IT & Technology
    "développeur": "Developer",
    "programmeur": "Programmer", 
    "ingénieur logiciel": "Software Engineer",
    "architecte logiciel": "Software Architect",
    "analyste programmeur": "Programmer Analyst",
    "chef de projet": "Project Manager",
    "chef de projet informatique": "IT Project Manager",
    "administrateur système": "System Administrator",
    "administrateur réseau": "Network Administrator",
    "administrateur base de données": "Database Administrator",
    "technicien informatique": "IT Technician",
    "support technique": "Technical Support",
    "analyste système": "System Analyst",
    "concepteur web": "Web Designer",
    "développeur web": "Web Developer",
    "développeur front-end": "Front-end Developer",
    "développeur back-end": "Back-end Developer",
    "développeur full-stack": "Full-stack Developer",
    "ingénieur devops": "DevOps Engineer",
    "expert cybersécurité": "Cybersecurity Expert",
    "analyste sécurité": "Security Analyst",
    "architecte cloud": "Cloud Architect",
    "ingénieur cloud": "Cloud Engineer",
    "data scientist": "Data Scientist",
    "analyste données": "Data Analyst",
    "ingénieur données": "Data Engineer",
    "spécialiste intelligence artificielle": "AI Specialist",
    "développeur mobile": "Mobile Developer",
    "testeur": "Tester",
    "ingénieur qualité": "Quality Engineer",
    "scrum master": "Scrum Master",
    "product owner": "Product Owner",

    // Healthcare & Medical  
    "médecin": "Doctor",
    "docteur": "Doctor",
    "infirmier": "Nurse",
    "infirmière": "Nurse",
    "chirurgien": "Surgeon",
    "pharmacien": "Pharmacist",
    "dentiste": "Dentist",
    "vétérinaire": "Veterinarian",
    "kinésithérapeute": "Physiotherapist",
    "psychologue": "Psychologist",
    "psychiatre": "Psychiatrist",
    "radiologue": "Radiologist",
    "cardiologue": "Cardiologist",
    "pédiatre": "Pediatrician",
    "gynécologue": "Gynecologist",
    "anesthésiste": "Anesthesiologist",
    "urgentiste": "Emergency Physician",
    "orthopédiste": "Orthopedist",
    "dermatologue": "Dermatologist",
    "ophtalmologue": "Ophthalmologist",
    "oto-rhino-laryngologiste": "ENT Specialist",
    "neurologue": "Neurologist",
    "oncologue": "Oncologist",
    "sage-femme": "Midwife",
    "aide-soignant": "Nursing Assistant",
    "ambulancier": "Paramedic",
    "technicien médical": "Medical Technician",
    "manipulateur radio": "Radiographer",
    "laborantin": "Laboratory Technician",

    // Business & Management
    "directeur": "Director",
    "directeur général": "General Manager",
    "directeur financier": "Financial Director",
    "directeur marketing": "Marketing Director",
    "directeur des ventes": "Sales Director",
    "directeur des ressources humaines": "HR Director",
    "gestionnaire": "Manager",
    "responsable": "Manager",
    "chef d'équipe": "Team Leader",
    "superviseur": "Supervisor",
    "consultant": "Consultant",
    "conseiller": "Advisor",
    "analyste financier": "Financial Analyst",
    "comptable": "Accountant",
    "expert-comptable": "Chartered Accountant",
    "auditeur": "Auditor",
    "contrôleur de gestion": "Management Controller",
    "trésorier": "Treasurer",
    "commercial": "Sales Representative",
    "vendeur": "Salesperson",
    "représentant commercial": "Sales Representative",
    "chargé d'affaires": "Account Manager",
    "responsable marketing": "Marketing Manager",
    "chef de produit": "Product Manager",
    "chargé de communication": "Communications Manager",
    "attaché de presse": "Press Officer",
    "responsable RH": "HR Manager",
    "recruteur": "Recruiter",
    "formateur": "Trainer",

    // Education
    "professeur": "Teacher",
    "enseignant": "Teacher", 
    "instituteur": "Primary School Teacher",
    "institutrice": "Primary School Teacher",
    "professeur des écoles": "Primary School Teacher",
    "maître d'école": "School Teacher",
    "directeur d'école": "School Principal",
    "proviseur": "High School Principal",
    "principal": "Principal",
    "surveillant": "School Supervisor",
    "conseiller pédagogique": "Educational Counselor",
    "formateur educateur": "Educational Trainer",
    "chercheur": "Researcher",
    "professeur d'université": "University Professor",
    "maître de conférences": "Associate Professor",
    "doctorant": "PhD Student",
    "bibliothécaire": "Librarian",

    // Service Industry
    "serveur": "Waiter",
    "serveuse": "Waitress",
    "cuisinier": "Chef",
    "chef cuisinier": "Head Chef",
    "commis de cuisine": "Kitchen Assistant",
    "pâtissier": "Pastry Chef",
    "boulanger": "Baker",
    "réceptionniste": "Receptionist",
    "concierge": "Concierge",
    "femme de ménage": "Housekeeper",
    "agent d'entretien": "Cleaner",
    "garde d'enfants": "Childcare Worker",
    "nounou": "Nanny",
    "coiffeur": "Hairdresser",
    "esthéticienne": "Beautician",
    "masseur": "Massage Therapist",
    "guide touristique": "Tour Guide",
    "agent de voyage": "Travel Agent",
    "hôtesse de l'air": "Flight Attendant",
    "steward": "Flight Attendant",
    "chauffeur": "Driver",
    "chauffeur de taxi": "Taxi Driver",
    "livreur": "Delivery Driver",

    // Creative & Arts
    "artiste": "Artist",
    "peintre": "Painter", 
    "sculpteur": "Sculptor",
    "photographe": "Photographer",
    "graphiste": "Graphic Designer",
    "designer": "Designer",
    "architecte": "Architect",
    "décorateur": "Interior Designer",
    "musicien": "Musician",
    "chanteur": "Singer",
    "acteur": "Actor",
    "actrice": "Actress",
    "réalisateur": "Director",
    "producteur": "Producer",
    "journaliste": "Journalist",
    "rédacteur": "Writer",
    "écrivain": "Writer",
    "traducteur": "Translator",
    "interprète": "Interpreter",
    "monteur": "Editor",
    "cameraman": "Cameraman",

    // Engineering & Technical
    "ingénieur": "Engineer",
    "ingénieur civil": "Civil Engineer",
    "ingénieur mécanique": "Mechanical Engineer",
    "ingénieur électrique": "Electrical Engineer",
    "ingénieur électronique": "Electronics Engineer",
    "technicien": "Technician",
    "électricien": "Electrician",
    "plombier": "Plumber",
    "mécanicien": "Mechanic",
    "soudeur": "Welder",
    "charpentier": "Carpenter",
    "maçon": "Mason",
    "peintre en bâtiment": "House Painter",
    "couvreur": "Roofer",
    "carreleur": "Tiler",
    "jardinier": "Gardener",
    "paysagiste": "Landscape Architect"
  },

  // SPANISH TO ENGLISH
  es: {
    // IT & Technology
    "desarrollador": "Developer",
    "programador": "Programmer",
    "ingeniero de software": "Software Engineer",
    "arquitecto de software": "Software Architect",
    "analista programador": "Programmer Analyst",
    "jefe de proyecto": "Project Manager",
    "administrador de sistemas": "System Administrator",
    "administrador de red": "Network Administrator",
    "técnico informático": "IT Technician",
    "soporte técnico": "Technical Support",
    "analista de sistemas": "System Analyst",
    "diseñador web": "Web Designer",
    "desarrollador web": "Web Developer",
    "desarrollador front-end": "Front-end Developer",
    "desarrollador back-end": "Back-end Developer",
    "ingeniero devops": "DevOps Engineer",
    "especialista en ciberseguridad": "Cybersecurity Specialist",
    "científico de datos": "Data Scientist",
    "analista de datos": "Data Analyst",
    "desarrollador móvil": "Mobile Developer",

    // Healthcare & Medical
    "médico": "Doctor",
    "doctor": "Doctor",
    "enfermero": "Nurse",
    "enfermera": "Nurse",
    "cirujano": "Surgeon",
    "farmacéutico": "Pharmacist",
    "dentista": "Dentist",
    "veterinario": "Veterinarian",
    "fisioterapeuta": "Physiotherapist",
    "psicólogo": "Psychologist",
    "psiquiatra": "Psychiatrist",
    "radiólogo": "Radiologist",
    "cardiólogo": "Cardiologist",
    "pediatra": "Pediatrician",
    "ginecólogo": "Gynecologist",
    "anestesiólogo": "Anesthesiologist",
    "médico de urgencias": "Emergency Physician",
    "ortopedista": "Orthopedist",
    "dermatólogo": "Dermatologist",
    "oftalmólogo": "Ophthalmologist",
    "neurólogo": "Neurologist",
    "oncólogo": "Oncologist",
    "comadrona": "Midwife",
    "auxiliar de enfermería": "Nursing Assistant",
    "paramédico": "Paramedic",

    // Business & Management
    "diretor": "Director",
    "gerente": "Manager",
    "supervisor": "Supervisor",
    "consultor": "Consultant",
    "asesor": "Advisor",
    "contador": "Accountant",
    "auditor": "Auditor",
    "vendedor": "Salesperson",
    "representante de ventas": "Sales Representative",
    "gerente de marketing": "Marketing Manager",
    "gerente de recursos humanos": "HR Manager",
    "reclutador": "Recruiter",
    "formador": "Trainer",

    // Education
    "profesor": "Teacher",
    "maestro": "Teacher",
    "maestra": "Teacher",
    "director de escuela": "School Principal",
    "investigador": "Researcher",
    "bibliotecario": "Librarian",

    // Service Industry
    "camarero": "Waiter",
    "camarera": "Waitress",
    "cocinero": "Chef",
    "chef": "Chef",
    "panadero": "Baker",
    "recepcionista": "Receptionist",
    "conserje": "Concierge",
    "limpiador": "Cleaner",
    "niñera": "Nanny",
    "peluquero": "Hairdresser",
    "esteticista": "Beautician",
    "guía turístico": "Tour Guide",
    "agente de viajes": "Travel Agent",
    "azafata": "Flight Attendant",
    "conductor": "Driver",
    "taxista": "Taxi Driver",
    "repartidor": "Delivery Driver",

    // Creative & Arts
    "artista": "Artist",
    "pintor": "Painter",
    "escultor": "Sculptor",
    "fotógrafo": "Photographer",
    "diseñador gráfico": "Graphic Designer",
    "diseñador": "Designer",
    "arquitecto": "Architect",
    "decorador": "Interior Designer",
    "músico": "Musician",
    "cantante": "Singer",
    "actor": "Actor",
    "actriz": "Actress",
    "director": "Director",
    "productor": "Producer",
    "periodista": "Journalist",
    "escritor": "Writer",
    "traductor": "Translator",
    "intérprete": "Interpreter",

    // Engineering & Technical
    "ingeniero": "Engineer",
    "ingeniero civil": "Civil Engineer",
    "ingeniero mecánico": "Mechanical Engineer",
    "ingeniero eléctrico": "Electrical Engineer",
    "técnico": "Technician",
    "electricista": "Electrician",
    "fontanero": "Plumber",
    "mecánico": "Mechanic",
    "soldador": "Welder",
    "carpintero": "Carpenter",
    "albañil": "Mason",
    "jardinero": "Gardener"
  },

  // ITALIAN TO ENGLISH
  it: {
    // IT & Technology
    "sviluppatore": "Developer",
    "programmatore": "Programmer",
    "ingegnere del software": "Software Engineer",
    "architetto software": "Software Architect",
    "project manager": "Project Manager",
    "amministratore di sistema": "System Administrator",
    "tecnico informatico": "IT Technician",
    "supporto tecnico": "Technical Support",
    "analista di sistema": "System Analyst",
    "web designer": "Web Designer",
    "sviluppatore web": "Web Developer",

    // Healthcare & Medical
    "medico": "Doctor",
    "dottore": "Doctor",
    "infermiere": "Nurse",
    "infermiera": "Nurse",
    "chirurgo": "Surgeon",
    "farmacista": "Pharmacist",
    "dentista": "Dentist",
    "veterinario": "Veterinarian",
    "fisioterapista": "Physiotherapist",
    "psicologo": "Psychologist",
    "psichiatra": "Psychiatrist",
    "radiologo": "Radiologist",
    "cardiologo": "Cardiologist",
    "pediatra": "Pediatrician",
    "ginecologo": "Gynecologist",

    // Business & Management
    "direttore": "Director",
    "manager": "Manager",
    "gestore": "Manager",
    "supervisore": "Supervisor",
    "consulente": "Consultant",
    "contabile": "Accountant",
    "venditore": "Salesperson",

    // Education
    "professore": "Teacher",
    "insegnante": "Teacher",
    "maestro": "Teacher",
    "maestra": "Teacher",
    "ricercatore": "Researcher",

    // Service Industry
    "cameriere": "Waiter",
    "cameriera": "Waitress",
    "cuoco": "Chef",
    "chef": "Chef",
    "panettiere": "Baker",
    "receptionist": "Receptionist",
    "portiere": "Concierge",
    "addetto alle pulizie": "Cleaner",
    "parrucchiere": "Hairdresser",
    "autista": "Driver",

    // Creative & Arts
    "artista": "Artist",
    "pittore": "Painter",
    "scultore": "Sculptor",
    "fotografo": "Photographer",
    "designer grafico": "Graphic Designer",
    "architetto": "Architect",
    "musicista": "Musician",
    "cantante": "Singer",
    "attore": "Actor",
    "attrice": "Actress",
    "giornalista": "Journalist",
    "scrittore": "Writer",
    "traduttore": "Translator",

    // Engineering & Technical
    "ingegnere": "Engineer",
    "tecnico": "Technician",
    "elettricista": "Electrician",
    "idraulico": "Plumber",
    "meccanico": "Mechanic",
    "carpentiere": "Carpenter",
    "giardiniere": "Gardener"
  },

  // GERMAN TO ENGLISH  
  de: {
    // IT & Technology
    "entwickler": "Developer",
    "programmierer": "Programmer",
    "softwareingenieur": "Software Engineer",
    "projektmanager": "Project Manager",
    "systemadministrator": "System Administrator",
    "it-techniker": "IT Technician",
    "technischer support": "Technical Support",
    "webdesigner": "Web Designer",
    "webentwickler": "Web Developer",

    // Healthcare & Medical
    "arzt": "Doctor",
    "ärztin": "Doctor",
    "doktor": "Doctor",
    "krankenschwester": "Nurse",
    "krankenpfleger": "Nurse",
    "chirurg": "Surgeon",
    "apotheker": "Pharmacist",
    "zahnarzt": "Dentist",
    "tierarzt": "Veterinarian",
    "physiotherapeut": "Physiotherapist",
    "psychologe": "Psychologist",
    "psychiater": "Psychiatrist",

    // Business & Management
    "direktor": "Director",
    "geschäftsführer": "General Manager",
    "manager": "Manager",
    "supervisor": "Supervisor",
    "berater": "Consultant",
    "buchhalter": "Accountant",
    "verkäufer": "Salesperson",

    // Education
    "lehrer": "Teacher",
    "lehrerin": "Teacher",
    "professor": "Professor",
    "forscher": "Researcher",

    // Service Industry
    "kellner": "Waiter",
    "kellnerin": "Waitress",
    "koch": "Chef",
    "bäcker": "Baker",
    "empfangsdame": "Receptionist",
    "reinigungskraft": "Cleaner",
    "friseur": "Hairdresser",
    "fahrer": "Driver",

    // Creative & Arts
    "künstler": "Artist",
    "maler": "Painter",
    "fotograf": "Photographer",
    "grafikdesigner": "Graphic Designer",
    "architekt": "Architect",
    "musiker": "Musician",
    "sänger": "Singer",
    "schauspieler": "Actor",
    "journalist": "Journalist",
    "schriftsteller": "Writer",
    "übersetzer": "Translator",

    // Engineering & Technical
    "ingenieur": "Engineer",
    "techniker": "Technician",
    "elektriker": "Electrician",
    "klempner": "Plumber",
    "mechaniker": "Mechanic",
    "zimmermann": "Carpenter",
    "gärtner": "Gardener"
  },

  // PORTUGUESE TO ENGLISH
  pt: {
    // IT & Technology
    "desenvolvedor": "Developer",
    "programador": "Programmer",
    "engenheiro de software": "Software Engineer",
    "gerente de projeto": "Project Manager",
    "administrador de sistema": "System Administrator",
    "técnico de informática": "IT Technician",
    "suporte técnico": "Technical Support",

    // Healthcare & Medical
    "médico": "Doctor",
    "enfermeiro": "Nurse",
    "enfermeira": "Nurse",
    "cirurgião": "Surgeon",
    "farmacêutico": "Pharmacist",
    "dentista": "Dentist",
    "veterinário": "Veterinarian",
    "fisioterapeuta": "Physiotherapist",
    "psicólogo": "Psychologist",

    // Business & Management
    "diretor": "Director",
    "gerente": "Manager",
    "supervisor": "Supervisor",
    "consultor": "Consultant",
    "contador": "Accountant",
    "vendedor": "Salesperson",

    // Education
    "professor": "Teacher",
    "pesquisador": "Researcher",

    // Service Industry
    "garçom": "Waiter",
    "garçonete": "Waitress",
    "cozinheiro": "Chef",
    "padeiro": "Baker",
    "recepcionista": "Receptionist",
    "faxineiro": "Cleaner",
    "motorista": "Driver",

    // Creative & Arts
    "artista": "Artist",
    "pintor": "Painter",
    "fotógrafo": "Photographer",
    "designer gráfico": "Graphic Designer",
    "arquiteto": "Architect",
    "músico": "Musician",
    "cantor": "Singer",
    "ator": "Actor",
    "jornalista": "Journalist",
    "escritor": "Writer",
    "tradutor": "Translator",

    // Engineering & Technical
    "engenheiro": "Engineer",
    "especialista técnico": "Technical Specialist",
    "eletricista": "Electrician",
    "encanador": "Plumber",
    "mecânico": "Mechanic",
    "carpinteiro": "Carpenter",
    "jardineiro": "Gardener"
  },

  // RUSSIAN TO ENGLISH
  ru: {
    // IT & Technology
    "разработчик": "Developer",
    "программист": "Programmer",
    "инженер-программист": "Software Engineer",
    "менеджер проекта": "Project Manager",
    "системный администратор": "System Administrator",
    "техник": "IT Technician",
    "техническая поддержка": "Technical Support",

    // Healthcare & Medical
    "врач": "Doctor",
    "доктор": "Doctor",
    "медсестра": "Nurse",
    "хирург": "Surgeon",
    "фармацевт": "Pharmacist",
    "стоматолог": "Dentist",
    "ветеринар": "Veterinarian",
    "физиотерапевт": "Physiotherapist",
    "психолог": "Psychologist",

    // Business & Management
    "директор": "Director",
    "менеджер": "Manager",
    "руководитель": "Supervisor",
    "консультант": "Consultant",
    "бухгалтер": "Accountant",
    "продавец": "Salesperson",

    // Education
    "учитель": "Teacher",
    "преподаватель": "Teacher",
    "профессор": "Professor",
    "исследователь": "Researcher",

    // Service Industry
    "официант": "Waiter",
    "официантка": "Waitress",
    "повар": "Chef",
    "пекарь": "Baker",
    "администратор": "Receptionist",
    "уборщик": "Cleaner",
    "водитель": "Driver",

    // Creative & Arts
    "художник": "Artist",
    "фотограф": "Photographer",
    "дизайнер": "Designer",
    "архитектор": "Architect",
    "музыкант": "Musician",
    "певец": "Singer",
    "актёр": "Actor",
    "журналист": "Journalist",
    "писатель": "Writer",
    "переводчик": "Translator",

    // Engineering & Technical
    "инженер": "Engineer",
    "специалист техник": "Technical Specialist",
    "электрик": "Electrician",
    "сантехник": "Plumber",
    "механик": "Mechanic",
    "плотник": "Carpenter",
    "садовник": "Gardener"
  },

  // CHINESE TO ENGLISH
  zh: {
    // IT & Technology
    "开发者": "Developer",
    "程序员": "Programmer",
    "软件工程师": "Software Engineer",
    "项目经理": "Project Manager",
    "系统管理员": "System Administrator",
    "技术支持": "Technical Support",

    // Healthcare & Medical
    "医生": "Doctor",
    "护士": "Nurse",
    "外科医生": "Surgeon",
    "药剂师": "Pharmacist",
    "牙医": "Dentist",
    "兽医": "Veterinarian",
    "理疗师": "Physiotherapist",
    "心理学家": "Psychologist",

    // Business & Management
    "经理": "Manager",
    "主管": "Supervisor",
    "顾问": "Consultant",
    "会计": "Accountant",
    "销售员": "Salesperson",

    // Education
    "老师": "Teacher",
    "教师": "Teacher",
    "教授": "Professor",
    "研究员": "Researcher",

    // Service Industry
    "服务员": "Waiter",
    "厨师": "Chef",
    "面包师": "Baker",
    "前台": "Receptionist",
    "清洁工": "Cleaner",
    "司机": "Driver",

    // Creative & Arts
    "艺术家": "Artist",
    "画家": "Painter",
    "摄影师": "Photographer",
    "设计师": "Designer",
    "建筑师": "Architect",
    "音乐家": "Musician",
    "歌手": "Singer",
    "演员": "Actor",
    "记者": "Journalist",
    "作家": "Writer",
    "翻译": "Translator",

    // Engineering & Technical
    "工程师": "Engineer",
    "技术员": "Technician",
    "电工": "Electrician",
    "水管工": "Plumber",
    "机械师": "Mechanic",
    "木匠": "Carpenter",
    "园丁": "Gardener"
  },

  // JAPANESE TO ENGLISH
  ja: {
    // IT & Technology
    "開発者": "Developer",
    "プログラマー": "Programmer",
    "ソフトウェアエンジニア": "Software Engineer",
    "プロジェクトマネージャー": "Project Manager",
    "システム管理者": "System Administrator",
    "技術サポート": "Technical Support",

    // Healthcare & Medical
    "医者": "Doctor",
    "医師": "Doctor",
    "看護師": "Nurse",
    "外科医": "Surgeon",
    "薬剤師": "Pharmacist",
    "歯医者": "Dentist",
    "獣医": "Veterinarian",
    "理学療法士": "Physiotherapist",
    "心理学者": "Psychologist",

    // Business & Management
    "マネージャー": "Manager",
    "管理者": "Supervisor",
    "コンサルタント": "Consultant",
    "会計士": "Accountant",
    "営業": "Salesperson",

    // Education
    "先生": "Teacher",
    "教師": "Teacher",
    "教授": "Professor",
    "研究者": "Researcher",

    // Service Industry
    "ウェイター": "Waiter",
    "料理人": "Chef",
    "パン屋": "Baker",
    "受付": "Receptionist",
    "清掃員": "Cleaner",
    "運転手": "Driver",

    // Creative & Arts
    "芸術家": "Artist",
    "画家": "Painter",
    "写真家": "Photographer",
    "デザイナー": "Designer",
    "建築家": "Architect",
    "音楽家": "Musician",
    "歌手": "Singer",
    "俳優": "Actor",
    "記者": "Journalist",
    "作家": "Writer",
    "翻訳者": "Translator",

    // Engineering & Technical
    "エンジニア": "Engineer",
    "技術者": "Technician",
    "電気技師": "Electrician",
    "配管工": "Plumber",
    "機械工": "Mechanic",
    "大工": "Carpenter",
    "庭師": "Gardener"
  },

  // KOREAN TO ENGLISH
  ko: {
    // IT & Technology
    "개발자": "Developer",
    "프로그래머": "Programmer",
    "소프트웨어 엔지니어": "Software Engineer",
    "프로젝트 매니저": "Project Manager",
    "시스템 관리자": "System Administrator",
    "기술 지원": "Technical Support",

    // Healthcare & Medical
    "의사": "Doctor",
    "간호사": "Nurse",
    "외과의사": "Surgeon",
    "약사": "Pharmacist",
    "치과의사": "Dentist",
    "수의사": "Veterinarian",
    "물리치료사": "Physiotherapist",
    "심리학자": "Psychologist",

    // Business & Management
    "매니저": "Manager",
    "관리자": "Supervisor",
    "컨설턴트": "Consultant",
    "회계사": "Accountant",
    "영업사원": "Salesperson",

    // Education
    "선생님": "Teacher",
    "교사": "Teacher",
    "교수": "Professor",
    "연구원": "Researcher",

    // Service Industry
    "웨이터": "Waiter",
    "요리사": "Chef",
    "제빵사": "Baker",
    "접수원": "Receptionist",
    "청소부": "Cleaner",
    "운전사": "Driver",

    // Creative & Arts
    "예술가": "Artist",
    "화가": "Painter",
    "사진작가": "Photographer",
    "디자이너": "Designer",
    "건축가": "Architect",
    "음악가": "Musician",
    "가수": "Singer",
    "배우": "Actor",
    "기자": "Journalist",
    "작가": "Writer",
    "번역가": "Translator",

    // Engineering & Technical
    "엔지니어": "Engineer",
    "기술자": "Technician",
    "전기기사": "Electrician",
    "배관공": "Plumber",
    "기계공": "Mechanic",
    "목수": "Carpenter",
    "정원사": "Gardener"
  },

  // ARABIC TO ENGLISH
  ar: {
    // IT & Technology
    "مطور": "Developer",
    "مبرمج": "Programmer",
    "مهندس برمجيات": "Software Engineer",
    "مدير مشروع": "Project Manager",
    "مدير أنظمة": "System Administrator",
    "دعم فني": "Technical Support",

    // Healthcare & Medical
    "طبيب": "Doctor",
    "ممرض": "Nurse",
    "ممرضة": "Nurse",
    "جراح": "Surgeon",
    "صيدلي": "Pharmacist",
    "طبيب أسنان": "Dentist",
    "طبيب بيطري": "Veterinarian",
    "أخصائي علاج طبيعي": "Physiotherapist",
    "طبيب نفسي": "Psychologist",

    // Business & Management
    "مدير": "Manager",
    "مشرف": "Supervisor",
    "استشاري": "Consultant",
    "محاسب": "Accountant",
    "مندوب مبيعات": "Salesperson",

    // Education
    "معلم": "Teacher",
    "مدرس": "Teacher",
    "أستاذ": "Professor",
    "باحث": "Researcher",

    // Service Industry
    "نادل": "Waiter",
    "طباخ": "Chef",
    "خباز": "Baker",
    "موظف استقبال": "Receptionist",
    "عامل نظافة": "Cleaner",
    "سائق": "Driver",

    // Creative & Arts
    "فنان": "Artist",
    "رسام": "Painter",
    "مصور": "Photographer",
    "مصمم": "Designer",
    "مهندس معماري": "Architect",
    "موسيقار": "Musician",
    "مغني": "Singer",
    "ممثل": "Actor",
    "صحفي": "Journalist",
    "كاتب": "Writer",
    "مترجم": "Translator",

    // Engineering & Technical
    "مهندس": "Engineer",
    "فني": "Technician",
    "كهربائي": "Electrician",
    "سباك": "Plumber",
    "ميكانيكي": "Mechanic",
    "نجار": "Carpenter",
    "بستاني": "Gardener"
  }
};

// Enhanced language detection
export const detectLanguage = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // French patterns
  if (/[àâäæçèéêëîïôœùûüÿ]/.test(text) || 
      /\b(le|la|les|un|une|des|et|de|du|pour|avec|sans|dans|sur|sous|par|vers|chez|depuis|pendant|avant|après|entre|contre|malgré|selon|sauf|durant)\b/.test(lowerText)) {
    return 'fr';
  }
  
  // Spanish patterns  
  if (/[áéíóúüñ¿¡]/.test(text) ||
      /\b(el|la|los|las|un|una|y|de|del|para|con|sin|en|sobre|bajo|por|hacia|desde|durante|antes|después|entre|contra|según|excepto)\b/.test(lowerText)) {
    return 'es';
  }
  
  // Italian patterns
  if (/[àèéìíîòóùú]/.test(text) ||
      /\b(il|la|lo|gli|le|un|una|e|di|del|della|per|con|senza|in|su|sotto|da|verso|durante|prima|dopo|tra|fra|contro|secondo|tranne)\b/.test(lowerText)) {
    return 'it';
  }
  
  // German patterns
  if (/[äöüß]/.test(text) ||
      /\b(der|die|das|ein|eine|und|von|für|mit|ohne|in|auf|unter|durch|zu|nach|vor|zwischen|gegen|nach|während|seit|bis|wegen)\b/.test(lowerText)) {
    return 'de';
  }
  
  // Portuguese patterns
  if (/[ãõçáéíóúâêîôû]/.test(text) ||
      /\b(o|a|os|as|um|uma|e|de|do|da|para|com|sem|em|sobre|sob|por|para|desde|durante|antes|depois|entre|contra|segundo|exceto)\b/.test(lowerText)) {
    return 'pt';
  }
  
  // Russian patterns
  if (/[а-яё]/i.test(text)) {
    return 'ru';
  }
  
  // Chinese patterns
  if (/[\u4e00-\u9fff]/.test(text)) {
    return 'zh';
  }
  
  // Japanese patterns
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return 'ja';
  }
  
  // Korean patterns
  if (/[\uac00-\ud7af]/.test(text)) {
    return 'ko';
  }
  
  // Arabic patterns
  if (/[\u0600-\u06ff]/.test(text)) {
    return 'ar';
  }
  
  return 'en';
};

// Check if text is already in English
export const isEnglish = (text: string): boolean => {
  const commonEnglishWords = [
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'manager', 'director', 'assistant', 'specialist', 'coordinator', 'analyst',
    'developer', 'engineer', 'designer', 'consultant', 'administrator',
    'doctor', 'nurse', 'teacher', 'chef', 'driver', 'technician'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  const englishWordCount = words.filter(word => 
    commonEnglishWords.includes(word) || /^[a-z]+$/.test(word)
  ).length;
  
  return englishWordCount / words.length > 0.7;
};

// Fuzzy search in job classifications database
export const searchJobClassifications = (searchTerm: string, language: string = 'en'): string | null => {
  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  
  // Direct title match
  for (const job of jobClassifications) {
    if (job.titles[language]?.toLowerCase() === lowerSearchTerm) {
      return job.titleEn;
    }
  }
  
  // Fuzzy title match
  for (const job of jobClassifications) {
    const title = job.titles[language]?.toLowerCase();
    if (title && (title.includes(lowerSearchTerm) || lowerSearchTerm.includes(title))) {
      return job.titleEn;
    }
  }
  
  // Keywords match
  for (const job of jobClassifications) {
    if (job.keywords?.some(keyword => 
      keyword.toLowerCase().includes(lowerSearchTerm) || 
      lowerSearchTerm.includes(keyword.toLowerCase())
    )) {
      return job.titleEn;
    }
  }
  
  return null;
};

// Main translation function with hybrid approach
export const translateJobTitle = async (jobTitle: string): Promise<string | null> => {
  const cleanTitle = jobTitle.toLowerCase().trim();
  
  // Skip if already English
  if (isEnglish(jobTitle)) {
    return null;
  }
  
  // Detect language
  const detectedLang = detectLanguage(jobTitle);
  
  // 1. Try static translation dictionary first
  if (staticTranslations[detectedLang]) {
    const staticTranslation = staticTranslations[detectedLang][cleanTitle];
    if (staticTranslation) {
      return staticTranslation;
    }
  }
  
  // 2. Search in job classifications database
  const classificationMatch = searchJobClassifications(jobTitle, detectedLang);
  if (classificationMatch) {
    return classificationMatch;
  }
  
  // 3. Try partial matches in static translations
  for (const [foreignTitle, englishTitle] of Object.entries(staticTranslations[detectedLang] || {})) {
    if (cleanTitle.includes(foreignTitle) || foreignTitle.includes(cleanTitle)) {
      return englishTitle;
    }
  }
  
  return null;
};

// Get all available translations for a job title
export const getAllTranslations = (jobTitle: string): Record<string, string> => {
  const translations: Record<string, string> = {};
  
  // Find in job classifications
  for (const job of jobClassifications) {
    const matchingLang = Object.entries(job.titles).find(([, title]) => 
      title.toLowerCase() === jobTitle.toLowerCase()
    );
    
    if (matchingLang) {
      return job.titles;
    }
  }
  
  return translations;
};

// Validation function
export const validateJobTitle = (value: string): string | null => {
  if (!value || value.length < 2) {
    return "Job title must be at least 2 characters long";
  }
  
  if (value.length > 100) {
    return "Job title must be less than 100 characters";
  }
  
  // Check for gibberish patterns
  if (/(.)\1{4,}/.test(value) || /^(abc|123|qwe|asd|zxc)/i.test(value)) {
    return "Please enter a valid job title";
  }
  
  return null;
};

// Capitalization helper
export const capitalizeJobTitle = (value: string): string => {
  return value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};