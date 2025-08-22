// ISCO-08 Job Classifications with multilingual support and sub-categorization

export interface JobClassification {
  code: string;
  titleEn: string;
  titles: Record<string, string>;
  majorGroup: string;
  subMajorGroup: string;
  category: string;
  subCategory: string;
  keywords?: string[];
}

export const jobClassifications: JobClassification[] = [
  // ============= LEGAL & COMPLIANCE =============
  
  // General Legal (Generic Jobs)
  {
    code: "2610",
    titleEn: "Legal Professional",
    titles: {
      en: "Legal Professional",
      fr: "Juriste",
      es: "Profesional Legal",
      de: "Jurist",
      it: "Professionista Legale",
      pt: "Profissional Jurídico",
      ru: "Юрист",
      zh: "法律专业人员",
      ja: "法務専門家",
      ko: "법무 전문가",
      ar: "مهني قانوني"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "General Legal",
    keywords: ["legal", "juriste", "law", "professional", "general"]
  },
  {
    code: "2610b",
    titleEn: "Compliance Professional",
    titles: {
      en: "Compliance Professional",
      fr: "Professionnel de la Conformité",
      es: "Profesional de Cumplimiento",
      de: "Compliance-Experte",
      it: "Professionista della Compliance",
      pt: "Profissional de Compliance",
      ru: "Специалист по комплаенсу",
      zh: "合规专业人员",
      ja: "コンプライアンス専門家",
      ko: "컴플라이언스 전문가",
      ar: "مهني الامتثال"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "General Legal",
    keywords: ["compliance", "regulatory", "professional", "general"]
  },

  // Legal Practice
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
    subCategory: "Legal Practice",
    keywords: ["lawyer", "attorney", "legal", "advocate"]
  },
  {
    code: "2611b",
    titleEn: "Corporate Lawyer",
    titles: {
      en: "Corporate Lawyer",
      ar: "محامي شركات",
      es: "Abogado Corporativo",
      fr: "Avocat d'Entreprise",
      it: "Avvocato Aziendale",
      ja: "企業弁護士",
      ko: "기업 변호사",
      zh: "公司律师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Legal Practice",
    keywords: ["corporate", "lawyer", "business", "company"]
  },
  {
    code: "2611c",
    titleEn: "Criminal Defense Lawyer",
    titles: {
      en: "Criminal Defense Lawyer",
      ar: "محامي دفاع جنائي",
      es: "Abogado Defensor Penal",
      fr: "Avocat Pénaliste",
      it: "Avvocato Penalista",
      ja: "刑事弁護士",
      ko: "형사 변호사",
      zh: "刑事辩护律师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Legal Practice",
    keywords: ["criminal", "defense", "lawyer", "attorney"]
  },
  {
    code: "2611d",
    titleEn: "Family Law Attorney",
    titles: {
      en: "Family Law Attorney",
      ar: "محامي قانون الأسرة",
      es: "Abogado de Derecho Familiar",
      fr: "Avocat en Droit de la Famille",
      it: "Avvocato Familiarista",
      ja: "家族法弁護士",
      ko: "가족법 변호사",
      zh: "家庭法律师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Legal Practice",
    keywords: ["family", "law", "attorney", "divorce"]
  },
  {
    code: "2611e",
    titleEn: "Immigration Lawyer",
    titles: {
      en: "Immigration Lawyer",
      ar: "محامي الهجرة",
      es: "Abogado de Inmigración",
      fr: "Avocat en Immigration",
      it: "Avvocato Immigrazione",
      ja: "移民弁護士",
      ko: "이민 변호사",
      zh: "移民律师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Legal Practice",
    keywords: ["immigration", "lawyer", "visa", "citizenship"]
  },

  // Legal Support
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
      ko: "법무사",
      zh: "律师助理"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Legal Associate Professionals",
    category: "Legal & Compliance",
    subCategory: "Legal Support",
    keywords: ["paralegal", "legal", "assistant", "support"]
  },
  {
    code: "2612b",
    titleEn: "Legal Assistant",
    titles: {
      en: "Legal Assistant",
      ar: "مساعد قانوني",
      es: "Asistente Legal",
      fr: "Assistant Juridique",
      it: "Assistente Legale",
      ja: "法務アシスタント",
      ko: "법무 보조원",
      zh: "法务助理"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Legal Associate Professionals",
    category: "Legal & Compliance",
    subCategory: "Legal Support",
    keywords: ["legal", "assistant", "support", "clerical"]
  },
  {
    code: "2612c",
    titleEn: "Court Reporter",
    titles: {
      en: "Court Reporter",
      ar: "مراسل المحكمة",
      es: "Reportero Judicial",
      fr: "Greffier Sténographe",
      it: "Stenografo Giudiziario",
      ja: "法廷記録者",
      ko: "법정 기록관",
      zh: "法庭记录员"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Legal Associate Professionals",
    category: "Legal & Compliance",
    subCategory: "Legal Support",
    keywords: ["court", "reporter", "stenographer", "transcript"]
  },
  {
    code: "2612d",
    titleEn: "Legal Secretary",
    titles: {
      en: "Legal Secretary",
      ar: "سكرتير قانوني",
      es: "Secretario Legal",
      fr: "Secrétaire Juridique",
      it: "Segretaria Legale",
      ja: "法務秘書",
      ko: "법무 비서",
      zh: "法务秘书"
    },
    majorGroup: "Clerical Support Workers",
    subMajorGroup: "Legal Clerical Support",
    category: "Legal & Compliance",
    subCategory: "Legal Support",
    keywords: ["legal", "secretary", "administrative", "clerical"]
  },

  // Judicial System
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
    subCategory: "Judicial System",
    keywords: ["judge", "judicial", "court", "magistrate"]
  },
  {
    code: "2614b",
    titleEn: "Magistrate",
    titles: {
      en: "Magistrate",
      ar: "قاضي صلح",
      es: "Magistrado",
      fr: "Magistrat",
      it: "Magistrato",
      ja: "治安判事",
      ko: "치안판사",
      zh: "地方法官"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Judicial System",
    keywords: ["magistrate", "judge", "court", "justice"]
  },
  {
    code: "2614c",
    titleEn: "Court Clerk",
    titles: {
      en: "Court Clerk",
      ar: "كاتب المحكمة",
      es: "Secretario Judicial",
      fr: "Greffier",
      it: "Cancelliere",
      ja: "書記官",
      ko: "법원 서기",
      zh: "法院书记员"
    },
    majorGroup: "Clerical Support Workers",
    subMajorGroup: "Legal Clerical Support",
    category: "Legal & Compliance",
    subCategory: "Judicial System",
    keywords: ["court", "clerk", "registry", "administrative"]
  },
  {
    code: "2614d",
    titleEn: "Bailiff",
    titles: {
      en: "Bailiff",
      ar: "مأمور التنفيذ",
      es: "Alguacil",
      fr: "Huissier",
      it: "Ufficiale Giudiziario",
      ja: "廷吏",
      ko: "집행관",
      zh: "法警"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Protective Services Workers",
    category: "Legal & Compliance",
    subCategory: "Judicial System",
    keywords: ["bailiff", "court", "enforcement", "sheriff"]
  },

  // Notarial Services
  {
    code: "2615",
    titleEn: "Notary Public",
    titles: {
      en: "Notary Public",
      ar: "كاتب عدل",
      es: "Notario Público",
      fr: "Notaire",
      it: "Notaio",
      ja: "公証人",
      ko: "공증인",
      zh: "公证员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Notarial Services",
    keywords: ["notary", "notarize", "authentication", "witness"]
  },
  {
    code: "2615b",
    titleEn: "Commissioner for Oaths",
    titles: {
      en: "Commissioner for Oaths",
      ar: "مفوض اليمين",
      es: "Comisionado de Juramentos",
      fr: "Commissaire aux Serments",
      it: "Commissario Giurato",
      ja: "宣誓委員",
      ko: "선서 위원",
      zh: "宣誓专员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Notarial Services",
    keywords: ["commissioner", "oaths", "sworn", "affidavit"]
  },

  // Compliance & Regulatory
  {
    code: "2616",
    titleEn: "Compliance Officer",
    titles: {
      en: "Compliance Officer",
      ar: "مسؤول الامتثال",
      es: "Oficial de Cumplimiento",
      fr: "Responsable Conformité",
      it: "Responsabile Compliance",
      ja: "コンプライアンス責任者",
      ko: "규정 준수 담당자",
      zh: "合规官"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Compliance & Regulatory",
    keywords: ["compliance", "regulatory", "risk", "governance"]
  },
  {
    code: "2616b",
    titleEn: "Regulatory Affairs Specialist",
    titles: {
      en: "Regulatory Affairs Specialist",
      ar: "أخصائي الشؤون التنظيمية",
      es: "Especialista en Asuntos Regulatorios",
      fr: "Spécialiste Affaires Réglementaires",
      it: "Specialista Affari Regolatori",
      ja: "薬事専門家",
      ko: "규제 업무 전문가",
      zh: "监管事务专员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Compliance & Regulatory",
    keywords: ["regulatory", "affairs", "specialist", "compliance"]
  },
  {
    code: "2616c",
    titleEn: "Legal Auditor",
    titles: {
      en: "Legal Auditor",
      ar: "مدقق قانوني",
      es: "Auditor Legal",
      fr: "Auditeur Juridique",
      it: "Revisore Legale",
      ja: "法務監査人",
      ko: "법무 감사관",
      zh: "法务审计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Legal Professionals",
    category: "Legal & Compliance",
    subCategory: "Compliance & Regulatory",
    keywords: ["legal", "auditor", "compliance", "review"]
  },

  // ============= HEALTHCARE & MEDICAL =============
  
  // General Healthcare (Generic Jobs)
  {
    code: "2200",
    titleEn: "Healthcare Professional",
    titles: {
      en: "Healthcare Professional",
      fr: "Professionnel de la Santé",
      es: "Profesional de la Salud",
      de: "Gesundheitsfachkraft",
      it: "Professionista Sanitario",
      pt: "Profissional de Saúde",
      ru: "Медицинский специалист",
      zh: "医疗保健专业人员",
      ja: "医療従事者",
      ko: "의료 전문가",
      ar: "مهني الرعاية الصحية"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "General Healthcare",
    keywords: ["healthcare", "medical", "health", "professional", "general"]
  },
  {
    code: "2200b",
    titleEn: "Medical Professional",
    titles: {
      en: "Medical Professional",
      fr: "Professionnel Médical",
      es: "Profesional Médico",
      de: "Medizinische Fachkraft",
      it: "Professionista Medico",
      pt: "Profissional Médico",
      ru: "Медицинский работник",
      zh: "医疗专业人员",
      ja: "医療専門家",
      ko: "의료 전문가",
      ar: "مهني طبي"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "General Healthcare",
    keywords: ["medical", "healthcare", "professional", "general"]
  },

  // Medical Doctors
  {
    code: "2211",
    titleEn: "General Practitioner",
    titles: {
      en: "General Practitioner",
      ar: "طبيب عام",
      es: "Médico General",
      fr: "Médecin Généraliste",
      it: "Medico di Base",
      ja: "一般医",
      ko: "일반의",
      zh: "全科医生"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Medical Doctors",
    keywords: ["general", "practitioner", "GP", "family", "doctor"]
  },
  {
    code: "2211b",
    titleEn: "Surgeon",
    titles: {
      en: "Surgeon",
      ar: "جراح",
      es: "Cirujano",
      fr: "Chirurgien",
      it: "Chirurgo",
      ja: "外科医",
      ko: "외과의사",
      zh: "外科医生"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Medical Doctors",
    keywords: ["surgeon", "surgery", "operation", "medical"]
  },
  {
    code: "2211c",
    titleEn: "Cardiologist",
    titles: {
      en: "Cardiologist",
      ar: "طبيب قلب",
      es: "Cardiólogo",
      fr: "Cardiologue",
      it: "Cardiologo",
      ja: "心臓病専門医",
      ko: "심장내과의사",
      zh: "心脏病专家"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Medical Doctors",
    keywords: ["cardiologist", "heart", "cardiac", "specialist"]
  },
  {
    code: "2211d",
    titleEn: "Pediatrician",
    titles: {
      en: "Pediatrician",
      ar: "طبيب أطفال",
      es: "Pediatra",
      fr: "Pédiatre",
      it: "Pediatra",
      ja: "小児科医",
      ko: "소아과의사",
      zh: "儿科医生"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Medical Doctors",
    keywords: ["pediatrician", "children", "pediatric", "kids"]
  },
  {
    code: "2211e",
    titleEn: "Psychiatrist",
    titles: {
      en: "Psychiatrist",
      ar: "طبيب نفسي",
      es: "Psiquiatra",
      fr: "Psychiatre",
      it: "Psichiatra",
      ja: "精神科医",
      ko: "정신과의사",
      zh: "精神科医生"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Medical Doctors",
    keywords: ["psychiatrist", "mental", "health", "psychology"]
  },

  // Nursing
  {
    code: "2221",
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
    subCategory: "Nursing",
    keywords: ["registered", "nurse", "RN", "nursing"]
  },
  {
    code: "2221b",
    titleEn: "Licensed Practical Nurse",
    titles: {
      en: "Licensed Practical Nurse",
      ar: "ممرض عملي مرخص",
      es: "Enfermero Práctico Licenciado",
      fr: "Infirmier Auxiliaire",
      it: "Infermiere Pratico",
      ja: "准看護師",
      ko: "준간호사",
      zh: "执业护士"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Health Associate Professionals",
    category: "Healthcare & Medical",
    subCategory: "Nursing",
    keywords: ["licensed", "practical", "nurse", "LPN"]
  },
  {
    code: "2221c",
    titleEn: "Nurse Practitioner",
    titles: {
      en: "Nurse Practitioner",
      ar: "ممرض ممارس",
      es: "Enfermero Especialista",
      fr: "Infirmier Praticien",
      it: "Infermiere Specialista",
      ja: "ナースプラクティショナー",
      ko: "전문간호사",
      zh: "执业护师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Nursing",
    keywords: ["nurse", "practitioner", "NP", "advanced"]
  },
  {
    code: "2221d",
    titleEn: "Nursing Assistant",
    titles: {
      en: "Nursing Assistant",
      ar: "مساعد تمريض",
      es: "Asistente de Enfermería",
      fr: "Aide-Soignant",
      it: "Assistente Infermieristico",
      ja: "看護助手",
      ko: "간호조무사",
      zh: "护理助理"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Personal Care Workers",
    category: "Healthcare & Medical",
    subCategory: "Nursing",
    keywords: ["nursing", "assistant", "aide", "care"]
  },

  // Allied Health
  {
    code: "2264",
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
    subCategory: "Allied Health",
    keywords: ["physical", "therapist", "physiotherapy", "PT"]
  },
  {
    code: "2264b",
    titleEn: "Occupational Therapist",
    titles: {
      en: "Occupational Therapist",
      ar: "أخصائي العلاج المهني",
      es: "Terapeuta Ocupacional",
      fr: "Ergothérapeute",
      it: "Terapista Occupazionale",
      ja: "作業療法士",
      ko: "작업치료사",
      zh: "职业治疗师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Allied Health",
    keywords: ["occupational", "therapist", "OT", "rehabilitation"]
  },
  {
    code: "2264c",
    titleEn: "Speech Therapist",
    titles: {
      en: "Speech Therapist",
      ar: "أخصائي علاج النطق",
      es: "Terapeuta del Habla",
      fr: "Orthophoniste",
      it: "Logopedista",
      ja: "言語聴覚士",
      ko: "언어치료사",
      zh: "语言治疗师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Allied Health",
    keywords: ["speech", "therapist", "language", "pathology"]
  },
  {
    code: "2264d",
    titleEn: "Respiratory Therapist",
    titles: {
      en: "Respiratory Therapist",
      ar: "أخصائي العلاج التنفسي",
      es: "Terapeuta Respiratorio",
      fr: "Thérapeute Respiratoire",
      it: "Terapista Respiratorio",
      ja: "呼吸療法士",
      ko: "호흡치료사",
      zh: "呼吸治疗师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Allied Health",
    keywords: ["respiratory", "therapist", "breathing", "pulmonary"]
  },

  // Pharmacy
  {
    code: "2262",
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
    subCategory: "Pharmacy",
    keywords: ["pharmacist", "pharmacy", "medication", "drugs"]
  },
  {
    code: "2262b",
    titleEn: "Pharmacy Technician",
    titles: {
      en: "Pharmacy Technician",
      ar: "تقني صيدلة",
      es: "Técnico en Farmacia",
      fr: "Technicien en Pharmacie",
      it: "Tecnico di Farmacia",
      ja: "薬局技師",
      ko: "약국기사",
      zh: "药房技师"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Health Associate Professionals",
    category: "Healthcare & Medical",
    subCategory: "Pharmacy",
    keywords: ["pharmacy", "technician", "medication", "assistant"]
  },

  // Dental
  {
    code: "2261",
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
    subCategory: "Dental",
    keywords: ["dentist", "dental", "teeth", "oral"]
  },
  {
    code: "2261b",
    titleEn: "Dental Hygienist",
    titles: {
      en: "Dental Hygienist",
      ar: "أخصائي صحة الأسنان",
      es: "Higienista Dental",
      fr: "Hygiéniste Dentaire",
      it: "Igienista Dentale",
      ja: "歯科衛生士",
      ko: "치과위생사",
      zh: "牙科卫生师"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Health Associate Professionals",
    category: "Healthcare & Medical",
    subCategory: "Dental",
    keywords: ["dental", "hygienist", "teeth", "cleaning"]
  },
  {
    code: "2261c",
    titleEn: "Dental Assistant",
    titles: {
      en: "Dental Assistant",
      ar: "مساعد طبيب أسنان",
      es: "Asistente Dental",
      fr: "Assistant Dentaire",
      it: "Assistente Dentale",
      ja: "歯科助手",
      ko: "치과조무사",
      zh: "牙科助理"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Personal Care Workers",
    category: "Healthcare & Medical",
    subCategory: "Dental",
    keywords: ["dental", "assistant", "teeth", "support"]
  },

  // Medical Support
  {
    code: "3256",
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
    subCategory: "Medical Support",
    keywords: ["medical", "assistant", "healthcare", "clinic"]
  },
  {
    code: "3256b",
    titleEn: "Medical Technician",
    titles: {
      en: "Medical Technician",
      ar: "تقني طبي",
      es: "Técnico Médico",
      fr: "Technicien Médical",
      it: "Tecnico Medico",
      ja: "医療技師",
      ko: "의료기사",
      zh: "医疗技师"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Health Associate Professionals",
    category: "Healthcare & Medical",
    subCategory: "Medical Support",
    keywords: ["medical", "technician", "lab", "equipment"]
  },
  {
    code: "3256c",
    titleEn: "Radiologic Technologist",
    titles: {
      en: "Radiologic Technologist",
      ar: "تقني الأشعة",
      es: "Tecnólogo en Radiología",
      fr: "Technicien en Radiologie",
      it: "Tecnico di Radiologia",
      ja: "診療放射線技師",
      ko: "방사선사",
      zh: "放射科技师"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Health Associate Professionals",
    category: "Healthcare & Medical",
    subCategory: "Medical Support",
    keywords: ["radiologic", "technologist", "x-ray", "imaging"]
  },
  {
    code: "3256d",
    titleEn: "Laboratory Technician",
    titles: {
      en: "Laboratory Technician",
      ar: "تقني مختبر",
      es: "Técnico de Laboratorio",
      fr: "Technicien de Laboratoire",
      it: "Tecnico di Laboratorio",
      ja: "臨床検査技師",
      ko: "임상병리사",
      zh: "检验技师"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Health Associate Professionals",
    category: "Healthcare & Medical",
    subCategory: "Medical Support",
    keywords: ["laboratory", "technician", "lab", "testing"]
  },

  // Mental Health
  {
    code: "2634",
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
    subCategory: "Mental Health",
    keywords: ["psychologist", "psychology", "mental", "health"]
  },
  {
    code: "2635",
    titleEn: "Social Worker",
    titles: {
      en: "Social Worker",
      ar: "عامل اجتماعي",
      es: "Trabajador Social",
      fr: "Travailleur Social",
      it: "Assistente Sociale",
      ja: "ソーシャルワーカー",
      ko: "사회복지사",
      zh: "社会工作者"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Mental Health",
    keywords: ["social", "worker", "counseling", "support"]
  },
  {
    code: "2635b",
    titleEn: "Counselor",
    titles: {
      en: "Counselor",
      ar: "مستشار",
      es: "Consejero",
      fr: "Conseiller",
      it: "Consulente",
      ja: "カウンセラー",
      ko: "상담사",
      zh: "咨询师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Health Professionals",
    category: "Healthcare & Medical",
    subCategory: "Mental Health",
    keywords: ["counselor", "therapy", "mental", "guidance"]
  },

  // ============= INFORMATION TECHNOLOGY =============
  
  // General IT (Generic Jobs)
  {
    code: "2500",
    titleEn: "IT Professional",
    titles: {
      en: "IT Professional",
      fr: "Professionnel IT",
      es: "Profesional de TI",
      de: "IT-Fachkraft",
      it: "Professionista IT",
      pt: "Profissional de TI",
      ru: "ИТ-специалист",
      zh: "IT专业人员",
      ja: "IT専門家",
      ko: "IT 전문가",
      ar: "مهني تكنولوجيا المعلومات"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "General IT",
    keywords: ["IT", "information", "technology", "professional", "general"]
  },
  {
    code: "2500b",
    titleEn: "Technology Professional",
    titles: {
      en: "Technology Professional",
      fr: "Professionnel Technologique",
      es: "Profesional de Tecnología",
      de: "Technologie-Experte",
      it: "Professionista Tecnologico",
      pt: "Profissional de Tecnologia",
      ru: "Технологический специалист",
      zh: "技术专业人员",
      ja: "テクノロジー専門家",
      ko: "기술 전문가",
      ar: "مهني التكنولوجيا"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "General IT",
    keywords: ["technology", "tech", "professional", "general"]
  },

  // Software Development
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
    subCategory: "Software Development",
    keywords: ["software", "developer", "programmer", "coding"]
  },
  {
    code: "2511b",
    titleEn: "Frontend Developer",
    titles: {
      en: "Frontend Developer",
      ar: "مطور الواجهة الأمامية",
      es: "Desarrollador Frontend",
      fr: "Développeur Frontend",
      it: "Sviluppatore Frontend",
      ja: "フロントエンド開発者",
      ko: "프론트엔드 개발자",
      zh: "前端开发员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Software Development",
    keywords: ["frontend", "developer", "UI", "javascript", "react"]
  },
  {
    code: "2511c",
    titleEn: "Backend Developer",
    titles: {
      en: "Backend Developer",
      ar: "مطور الخلفية",
      es: "Desarrollador Backend",
      fr: "Développeur Backend",
      it: "Sviluppatore Backend",
      ja: "バックエンド開発者",
      ko: "백엔드 개발자",
      zh: "后端开发员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Software Development",
    keywords: ["backend", "developer", "server", "API", "database"]
  },
  {
    code: "2511d",
    titleEn: "Full Stack Developer",
    titles: {
      en: "Full Stack Developer",
      ar: "مطور متكامل",
      es: "Desarrollador Full Stack",
      fr: "Développeur Full Stack",
      it: "Sviluppatore Full Stack",
      ja: "フルスタック開発者",
      ko: "풀스택 개발자",
      zh: "全栈开发员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Software Development",
    keywords: ["full", "stack", "developer", "frontend", "backend"]
  },
  {
    code: "2511e",
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
    subCategory: "Software Development",
    keywords: ["mobile", "app", "developer", "iOS", "Android"]
  },

  // Data & Analytics
  {
    code: "2512",
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
    subCategory: "Data & Analytics",
    keywords: ["data", "scientist", "analytics", "machine learning"]
  },
  {
    code: "2512b",
    titleEn: "Data Analyst",
    titles: {
      en: "Data Analyst",
      ar: "محلل البيانات",
      es: "Analista de Datos",
      fr: "Analyste de Données",
      it: "Analista di Dati",
      ja: "データアナリスト",
      ko: "데이터 분석가",
      zh: "数据分析师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Data & Analytics",
    keywords: ["data", "analyst", "analytics", "statistics"]
  },
  {
    code: "2512c",
    titleEn: "Business Intelligence Analyst",
    titles: {
      en: "Business Intelligence Analyst",
      ar: "محلل ذكاء الأعمال",
      es: "Analista de Inteligencia de Negocios",
      fr: "Analyste Business Intelligence",
      it: "Analista Business Intelligence",
      ja: "ビジネスインテリジェンスアナリスト",
      ko: "비즈니스 인텔리전스 분석가",
      zh: "商业智能分析师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Data & Analytics",
    keywords: ["business", "intelligence", "analyst", "BI", "reporting"]
  },
  {
    code: "2512d",
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
    subCategory: "Data & Analytics",
    keywords: ["database", "administrator", "DBA", "SQL"]
  },

  // Infrastructure & Operations
  {
    code: "2513",
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
    subCategory: "Infrastructure & Operations",
    keywords: ["system", "administrator", "IT", "infrastructure"]
  },
  {
    code: "2513b",
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
    subCategory: "Infrastructure & Operations",
    keywords: ["network", "engineer", "infrastructure", "cisco"]
  },
  {
    code: "2513c",
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
    subCategory: "Infrastructure & Operations",
    keywords: ["devops", "engineer", "deployment", "automation"]
  },
  {
    code: "2513d",
    titleEn: "Cloud Engineer",
    titles: {
      en: "Cloud Engineer",
      ar: "مهندس السحابة",
      es: "Ingeniero de Nube",
      fr: "Ingénieur Cloud",
      it: "Ingegnere Cloud",
      ja: "クラウドエンジニア",
      ko: "클라우드 엔지니어",
      zh: "云工程师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Infrastructure & Operations",
    keywords: ["cloud", "engineer", "AWS", "Azure", "infrastructure"]
  },

  // Cybersecurity
  {
    code: "2514",
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
    subCategory: "Cybersecurity",
    keywords: ["cybersecurity", "security", "analyst", "protection"]
  },
  {
    code: "2514b",
    titleEn: "Information Security Officer",
    titles: {
      en: "Information Security Officer",
      ar: "مسؤول أمن المعلومات",
      es: "Oficial de Seguridad de la Información",
      fr: "Responsable Sécurité Information",
      it: "Responsabile Sicurezza Informazioni",
      ja: "情報セキュリティ責任者",
      ko: "정보보안 담당자",
      zh: "信息安全官"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Cybersecurity",
    keywords: ["information", "security", "officer", "CISO"]
  },
  {
    code: "2514c",
    titleEn: "Penetration Tester",
    titles: {
      en: "Penetration Tester",
      ar: "مختبر اختراق",
      es: "Probador de Penetración",
      fr: "Testeur d'Intrusion",
      it: "Penetration Tester",
      ja: "ペネトレーションテスター",
      ko: "모의해킹 전문가",
      zh: "渗透测试员"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Cybersecurity",
    keywords: ["penetration", "tester", "ethical", "hacker", "security"]
  },

  // Design & User Experience
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
    subCategory: "Design & User Experience",
    keywords: ["UX", "UI", "designer", "user experience"]
  },
  {
    code: "2515b",
    titleEn: "Web Designer",
    titles: {
      en: "Web Designer",
      ar: "مصمم ويب",
      es: "Diseñador Web",
      fr: "Designer Web",
      it: "Web Designer",
      ja: "ウェブデザイナー",
      ko: "웹 디자이너",
      zh: "网页设计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Information Technology",
    category: "Information Technology",
    subCategory: "Design & User Experience",
    keywords: ["web", "designer", "website", "visual"]
  },
  {
    code: "2515c",
    titleEn: "Graphic Designer",
    titles: {
      en: "Graphic Designer",
      ar: "مصمم جرافيك",
      es: "Diseñador Gráfico",
      fr: "Graphiste",
      it: "Grafico",
      ja: "グラフィックデザイナー",
      ko: "그래픽 디자이너",
      zh: "平面设计师"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Creative and Cultural Professionals",
    category: "Information Technology",
    subCategory: "Design & User Experience",
    keywords: ["graphic", "designer", "visual", "creative"]
  },

  // Support & Management
  {
    code: "2516",
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
    subCategory: "Support & Management",
    keywords: ["IT", "support", "specialist", "helpdesk"]
  },
  {
    code: "2516b",
    titleEn: "IT Manager",
    titles: {
      en: "IT Manager",
      ar: "مدير تقنية المعلومات",
      es: "Gerente de TI",
      fr: "Responsable IT",
      it: "Manager IT",
      ja: "ITマネージャー",
      ko: "IT 관리자",
      zh: "IT经理"
    },
    majorGroup: "Management",
    subMajorGroup: "IT Management",
    category: "Information Technology",
    subCategory: "Support & Management",
    keywords: ["IT", "manager", "technology", "management"]
  },
  {
    code: "2516c",
    titleEn: "Technical Support",
    titles: {
      en: "Technical Support",
      ar: "الدعم الفني",
      es: "Soporte Técnico",
      fr: "Support Technique",
      it: "Supporto Tecnico",
      ja: "テクニカルサポート",
      ko: "기술 지원",
      zh: "技术支持"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Information Technology Associate",
    category: "Information Technology",
    subCategory: "Support & Management",
    keywords: ["technical", "support", "help", "assistance"]
  },
  {
    code: "2516d",
    titleEn: "Help Desk Technician",
    titles: {
      en: "Help Desk Technician",
      ar: "تقني مكتب المساعدة",
      es: "Técnico de Mesa de Ayuda",
      fr: "Technicien Help Desk",
      it: "Tecnico Help Desk",
      ja: "ヘルプデスク技術者",
      ko: "헬프데스크 기술자",
      zh: "帮助台技术员"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Information Technology Associate",
    category: "Information Technology",
    subCategory: "Support & Management",
    keywords: ["help", "desk", "technician", "support"]
  }
];

export const majorGroups = [
  {
    code: "1",
    titleEn: "Managers",
    titles: {
      en: "Managers",
      ar: "المديرون",
      es: "Gerentes",
      fr: "Dirigeants",
      it: "Manager",
      ja: "管理者",
      ko: "관리자",
      zh: "经理人员"
    }
  },
  {
    code: "2",
    titleEn: "Professionals",
    titles: {
      en: "Professionals",
      ar: "المهنيون",
      es: "Profesionales",
      fr: "Professions Intellectuelles",
      it: "Professionisti",
      ja: "専門職",
      ko: "전문가",
      zh: "专业技术人员"
    }
  },
  {
    code: "3",
    titleEn: "Technicians and Associate Professionals",
    titles: {
      en: "Technicians and Associate Professionals",
      ar: "التقنيون والمهنيون المساعدون",
      es: "Técnicos y Profesionales Asociados",
      fr: "Professions Intermédiaires",
      it: "Tecnici e Professionisti Associati",
      ja: "技術者・准専門職",
      ko: "기술자 및 준전문가",
      zh: "技术员和辅助专业人员"
    }
  },
  {
    code: "4",
    titleEn: "Clerical Support Workers",
    titles: {
      en: "Clerical Support Workers",
      ar: "العاملون في الدعم الكتابي",
      es: "Personal de Apoyo Administrativo",
      fr: "Employés de Type Administratif",
      it: "Impiegati di Concetto",
      ja: "事務従事者",
      ko: "사무 종사자",
      zh: "办事人员"
    }
  },
  {
    code: "5",
    titleEn: "Service and Sales Workers",
    titles: {
      en: "Service and Sales Workers",
      ar: "عمال الخدمات والمبيعات",
      es: "Trabajadores de Servicios y Ventas",
      fr: "Personnel des Services et Vendeurs",
      it: "Addetti ai Servizi e Vendite",
      ja: "サービス・販売従事者",
      ko: "서비스 및 판매 종사자",
      zh: "服务和销售人员"
    }
  },
  {
    code: "6",
    titleEn: "Skilled Agricultural, Forestry and Fishery Workers",
    titles: {
      en: "Skilled Agricultural, Forestry and Fishery Workers",
      ar: "العمال المهرة في الزراعة والغابات ومصايد الأسماك",
      es: "Trabajadores Calificados Agropecuarios, Forestales y Pesqueros",
      fr: "Agriculteurs et Ouvriers Qualifiés",
      it: "Agricoltori e Operai Specializzati",
      ja: "農林漁業従事者",
      ko: "농림어업 숙련 종사자",
      zh: "技能农业、林业和渔业工人"
    }
  },
  {
    code: "7",
    titleEn: "Craft and Related Trades Workers",
    titles: {
      en: "Craft and Related Trades Workers",
      ar: "عمال الحرف والمهن ذات الصلة",
      es: "Oficiales, Operarios y Artesanos",
      fr: "Artisans et Ouvriers des Métiers de Type Artisanal",
      it: "Artigiani, Operai Specializzati e Agricoltori",
      ja: "技能工・関連職業従事者",
      ko: "기능원 및 관련 기능 종사자",
      zh: "手工艺及相关行业工人"
    }
  },
  {
    code: "8",
    titleEn: "Plant and Machine Operators and Assemblers",
    titles: {
      en: "Plant and Machine Operators and Assemblers",
      ar: "مشغلو المصانع والآلات والمجمعون",
      es: "Operadores de Instalaciones y Máquinas y Ensambladores",
      fr: "Conducteurs d'Installations et de Machines et Ouvriers de l'Assemblage",
      it: "Conduttori di Impianti, Operatori di Macchinari e Operai Addetti al Montaggio",
      ja: "機械運転・組立従事者",
      ko: "장치・기계조작 및 조립 종사자",
      zh: "机器操作员和装配工"
    }
  },
  {
    code: "9",
    titleEn: "Elementary Occupations",
    titles: {
      en: "Elementary Occupations",
      ar: "المهن الأساسية",
      es: "Ocupaciones Elementales",
      fr: "Professions Élémentaires",
      it: "Professioni non Qualificate",
      ja: "単純作業従事者",
      ko: "단순노무 종사자",
      zh: "非技术工人"
    }
  }
  ,
  
  // ============= FINANCE & ACCOUNTING =============
  
  // General Finance (Generic Jobs)
  {
    code: "2400",
    titleEn: "Finance Professional",
    titles: {
      en: "Finance Professional",
      fr: "Professionnel de la Finance",
      es: "Profesional de Finanzas",
      de: "Finanzfachkraft",
      it: "Professionista Finanziario",
      pt: "Profissional de Finanças",
      ru: "Финансовый специалист",
      zh: "金融专业人员",
      ja: "金融専門家",
      ko: "금융 전문가",
      ar: "مهني مالي"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "General Finance",
    keywords: ["finance", "financial", "professional", "general"]
  },
  {
    code: "2400b",
    titleEn: "Banking Professional",
    titles: {
      en: "Banking Professional",
      fr: "Professionnel Bancaire",
      es: "Profesional Bancario",
      de: "Bankfachkraft",
      it: "Professionista Bancario",
      pt: "Profissional Bancário",
      ru: "Банковский специалист",
      zh: "银行专业人员",
      ja: "銀行専門家",
      ko: "은행 전문가",
      ar: "مهني مصرفي"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "General Banking",
    keywords: ["banking", "banker", "bank", "financial", "professional"]
  },
  {
    code: "2400c",
    titleEn: "Accounting Professional",
    titles: {
      en: "Accounting Professional",
      fr: "Professionnel Comptable",
      es: "Profesional Contable",
      de: "Buchhaltungsfachkraft",
      it: "Professionista Contabile",
      pt: "Profissional Contábil",
      ru: "Бухгалтерский специалист",
      zh: "会计专业人员",
      ja: "会計専門家",
      ko: "회계 전문가",
      ar: "مهني محاسبي"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "General Accounting",
    keywords: ["accounting", "accountant", "bookkeeper", "professional"]
  },

  // Banking
  {
    code: "2411",
    titleEn: "Bank Teller",
    titles: {
      en: "Bank Teller",
      fr: "Caissier de Banque",
      es: "Cajero Bancario",
      de: "Bankkassierer",
      it: "Cassiere Bancario",
      pt: "Caixa Bancário",
      ru: "Кассир банка",
      zh: "银行出纳员",
      ja: "銀行窓口係",
      ko: "은행 창구직원",
      ar: "أمين صندوق البنك"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Sales Workers",
    category: "Finance & Accounting",
    subCategory: "Banking",
    keywords: ["bank", "teller", "cashier", "customer", "service"]
  },
  {
    code: "2411b",
    titleEn: "Loan Officer",
    titles: {
      en: "Loan Officer",
      fr: "Agent de Crédit",
      es: "Oficial de Préstamos",
      de: "Kreditberater",
      it: "Funzionario Prestiti",
      pt: "Oficial de Empréstimos",
      ru: "Кредитный специалист",
      zh: "信贷员",
      ja: "融資担当者",
      ko: "대출 담당자",
      ar: "موظف القروض"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "Banking",
    keywords: ["loan", "officer", "credit", "mortgage", "banking"]
  },
  {
    code: "2411c",
    titleEn: "Investment Banker",
    titles: {
      en: "Investment Banker",
      fr: "Banquier d'Investissement",
      es: "Banquero de Inversión",
      de: "Investmentbanker",
      it: "Banchiere d'Investimento",
      pt: "Banqueiro de Investimento",
      ru: "Инвестиционный банкир",
      zh: "投资银行家",
      ja: "投資銀行家",
      ko: "투자은행가",
      ar: "مصرفي الاستثمار"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "Banking",
    keywords: ["investment", "banker", "banking", "finance", "securities"]
  },
  {
    code: "2411d",
    titleEn: "Bank Manager",
    titles: {
      en: "Bank Manager",
      fr: "Directeur de Banque",
      es: "Gerente Bancario",
      de: "Bankfilialleiter",
      it: "Direttore Bancario",
      pt: "Gerente Bancário",
      ru: "Управляющий банком",
      zh: "银行经理",
      ja: "銀行支店長",
      ko: "은행 지점장",
      ar: "مدير البنك"
    },
    majorGroup: "Managers",
    subMajorGroup: "Administrative and Commercial Managers",
    category: "Finance & Accounting",
    subCategory: "Banking",
    keywords: ["bank", "manager", "branch", "banking", "management"]
  },

  // Accounting
  {
    code: "2412",
    titleEn: "Accountant",
    titles: {
      en: "Accountant",
      fr: "Comptable",
      es: "Contador",
      de: "Buchhalter",
      it: "Contabile",
      pt: "Contador",
      ru: "Бухгалтер",
      zh: "会计师",
      ja: "会計士",
      ko: "회계사",
      ar: "محاسب"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "Accounting",
    keywords: ["accountant", "accounting", "bookkeeping", "CPA"]
  },
  {
    code: "2412b",
    titleEn: "Certified Public Accountant",
    titles: {
      en: "Certified Public Accountant",
      fr: "Expert-Comptable",
      es: "Contador Público Certificado",
      de: "Wirtschaftsprüfer",
      it: "Dottore Commercialista",
      pt: "Contador Público Certificado",
      ru: "Дипломированный бухгалтер",
      zh: "注册会计师",
      ja: "公認会計士",
      ko: "공인회계사",
      ar: "محاسب عام معتمد"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "Accounting",
    keywords: ["CPA", "certified", "accountant", "auditing"]
  },
  {
    code: "2412c",
    titleEn: "Bookkeeper",
    titles: {
      en: "Bookkeeper",
      fr: "Teneur de Livres",
      es: "Tenedor de Libros",
      de: "Buchführer",
      it: "Addetto alla Contabilità",
      pt: "Escriturário",
      ru: "Делопроизводитель",
      zh: "记账员",
      ja: "簿記係",
      ko: "부記담당자",
      ar: "محاسب الكتب"
    },
    majorGroup: "Clerical Support Workers",
    subMajorGroup: "Numerical and Material Recording Clerks",
    category: "Finance & Accounting",
    subCategory: "Accounting",
    keywords: ["bookkeeper", "bookkeeping", "records", "accounting"]
  },
  {
    code: "2412d",
    titleEn: "Financial Analyst",
    titles: {
      en: "Financial Analyst",
      fr: "Analyste Financier",
      es: "Analista Financiero",
      de: "Finanzanalyst",
      it: "Analista Finanziario",
      pt: "Analista Financeiro",
      ru: "Финансовый аналитик",
      zh: "财务分析师",
      ja: "財務アナリスト",
      ko: "재무분석가",
      ar: "محلل مالي"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "Financial Analysis",
    keywords: ["financial", "analyst", "analysis", "finance", "investment"]
  },
  {
    code: "2412e",
    titleEn: "Auditor",
    titles: {
      en: "Auditor",
      fr: "Auditeur",
      es: "Auditor",
      de: "Prüfer",
      it: "Revisore",
      pt: "Auditor",
      ru: "Аудитор",
      zh: "审计师",
      ja: "監査人",
      ko: "감사관",
      ar: "مدقق"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "Accounting",
    keywords: ["auditor", "audit", "financial", "review"]
  },

  // Financial Advisory
  {
    code: "2413",
    titleEn: "Financial Advisor",
    titles: {
      en: "Financial Advisor",
      fr: "Conseiller Financier",
      es: "Asesor Financiero",
      de: "Finanzberater",
      it: "Consulente Finanziario",
      pt: "Consultor Financeiro",
      ru: "Финансовый консультант",
      zh: "财务顾问",
      ja: "ファイナンシャルアドバイザー",
      ko: "재무 상담사",
      ar: "مستشار مالي"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "Financial Advisory",
    keywords: ["financial", "advisor", "planning", "investment", "wealth"]
  },
  {
    code: "2413b",
    titleEn: "Investment Analyst",
    titles: {
      en: "Investment Analyst",
      fr: "Analyste en Investissement",
      es: "Analista de Inversiones",
      de: "Investmentanalyst",
      it: "Analista degli Investimenti",
      pt: "Analista de Investimentos",
      ru: "Инвестиционный аналитик",
      zh: "投资分析师",
      ja: "投資アナリスト",
      ko: "투자분석가",
      ar: "محلل الاستثمار"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Finance Professionals",
    category: "Finance & Accounting",
    subCategory: "Financial Advisory",
    keywords: ["investment", "analyst", "portfolio", "securities", "stocks"]
  },
  {
    code: "2413c",
    titleEn: "Insurance Agent",
    titles: {
      en: "Insurance Agent",
      fr: "Agent d'Assurance",
      es: "Agente de Seguros",
      de: "Versicherungsvertreter",
      it: "Agente Assicurativo",
      pt: "Corretor de Seguros",
      ru: "Страховой агент",
      zh: "保险代理人",
      ja: "保険代理店",
      ko: "보험 설계사",
      ar: "وكيل التأمين"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Sales Workers",
    category: "Finance & Accounting",
    subCategory: "Financial Advisory",
    keywords: ["insurance", "agent", "policy", "coverage", "risk"]
  },

  // ============= SALES & MARKETING =============

  // General Sales & Marketing (Generic Jobs)
  {
    code: "2420",
    titleEn: "Sales Professional",
    titles: {
      en: "Sales Professional",
      fr: "Professionnel des Ventes",
      es: "Profesional de Ventas",
      de: "Verkaufsfachkraft",
      it: "Professionista delle Vendite",
      pt: "Profissional de Vendas",
      ru: "Специалист по продажам",
      zh: "销售专业人员",
      ja: "営業専門家",
      ko: "영업 전문가",
      ar: "مهني المبيعات"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Sales Workers",
    category: "Sales & Marketing",
    subCategory: "General Sales",
    keywords: ["sales", "selling", "professional", "general"]
  },
  {
    code: "2420b",
    titleEn: "Marketing Professional",
    titles: {
      en: "Marketing Professional",
      fr: "Professionnel du Marketing",
      es: "Profesional de Marketing",
      de: "Marketingfachkraft",
      it: "Professionista del Marketing",
      pt: "Profissional de Marketing",
      ru: "Маркетинговый специалист",
      zh: "营销专业人员",
      ja: "マーケティング専門家",
      ko: "마케팅 전문가",
      ar: "مهني التسويق"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Sales & Marketing",
    subCategory: "General Marketing",
    keywords: ["marketing", "promotion", "advertising", "professional"]
  },

  // Sales
  {
    code: "5221",
    titleEn: "Sales Representative",
    titles: {
      en: "Sales Representative",
      fr: "Représentant Commercial",
      es: "Representante de Ventas",
      de: "Vertriebsmitarbeiter",
      it: "Rappresentante di Vendita",
      pt: "Representante de Vendas",
      ru: "Торговый представитель",
      zh: "销售代表",
      ja: "営業担当者",
      ko: "영업 대표",
      ar: "مندوب مبيعات"
    },
    majorGroup: "Service and Sales Workers",
    subMajorGroup: "Sales Workers",
    category: "Sales & Marketing",
    subCategory: "Sales",
    keywords: ["sales", "representative", "selling", "customer"]
  },
  {
    code: "1221",
    titleEn: "Sales Manager",
    titles: {
      en: "Sales Manager",
      fr: "Directeur des Ventes",
      es: "Gerente de Ventas",
      de: "Vertriebsleiter",
      it: "Direttore Vendite",
      pt: "Gerente de Vendas",
      ru: "Менеджер по продажам",
      zh: "销售经理",
      ja: "営業マネージャー",
      ko: "영업 관리자",
      ar: "مدير المبيعات"
    },
    majorGroup: "Managers",
    subMajorGroup: "Administrative and Commercial Managers",
    category: "Sales & Marketing",
    subCategory: "Sales",
    keywords: ["sales", "manager", "management", "team", "revenue"]
  },

  // Marketing
  {
    code: "2431",
    titleEn: "Marketing Manager",
    titles: {
      en: "Marketing Manager",
      fr: "Directeur Marketing",
      es: "Gerente de Marketing",
      de: "Marketingleiter",
      it: "Direttore Marketing",
      pt: "Gerente de Marketing",
      ru: "Менеджер по маркетингу",
      zh: "营销经理",
      ja: "マーケティングマネージャー",
      ko: "마케팅 관리자",
      ar: "مدير التسويق"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Sales & Marketing",
    subCategory: "Marketing",
    keywords: ["marketing", "manager", "promotion", "brand", "campaigns"]
  },
  {
    code: "2431b",
    titleEn: "Digital Marketer",
    titles: {
      en: "Digital Marketer",
      fr: "Spécialiste Marketing Digital",
      es: "Especialista en Marketing Digital",
      de: "Digital Marketing Spezialist",
      it: "Specialista Marketing Digitale",
      pt: "Especialista em Marketing Digital",
      ru: "Цифровой маркетолог",
      zh: "数字营销专员",
      ja: "デジタルマーケター",
      ko: "디지털 마케터",
      ar: "مسوق رقمي"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Sales & Marketing",
    subCategory: "Marketing",
    keywords: ["digital", "marketing", "online", "social", "media", "SEO"]
  },

  // ============= EDUCATION & TRAINING =============

  // General Education (Generic Jobs)
  {
    code: "2300",
    titleEn: "Education Professional",
    titles: {
      en: "Education Professional",
      fr: "Professionnel de l'Éducation",
      es: "Profesional de la Educación",
      de: "Bildungsfachkraft",
      it: "Professionista dell'Educazione",
      pt: "Profissional da Educação",
      ru: "Специалист по образованию",
      zh: "教育专业人员",
      ja: "教育専門家",
      ko: "교육 전문가",
      ar: "مهني التعليم"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    subCategory: "General Education",
    keywords: ["education", "teaching", "professional", "general"]
  },
  {
    code: "2300b",
    titleEn: "Teacher",
    titles: {
      en: "Teacher",
      fr: "Enseignant",
      es: "Profesor",
      de: "Lehrer",
      it: "Insegnante",
      pt: "Professor",
      ru: "Учитель",
      zh: "教师",
      ja: "教師",
      ko: "교사",
      ar: "معلم"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    subCategory: "General Education",
    keywords: ["teacher", "teaching", "education", "instructor"]
  },

  // Teaching
  {
    code: "2341",
    titleEn: "Elementary School Teacher",
    titles: {
      en: "Elementary School Teacher",
      fr: "Instituteur Primaire",
      es: "Maestro de Primaria",
      de: "Grundschullehrer",
      it: "Maestro Elementare",
      pt: "Professor do Ensino Fundamental",
      ru: "Учитель начальных классов",
      zh: "小学教师",
      ja: "小学校教師",
      ko: "초등학교 교사",
      ar: "معلم المرحلة الابتدائية"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    subCategory: "Teaching",
    keywords: ["elementary", "primary", "teacher", "children", "school"]
  },
  {
    code: "2330",
    titleEn: "High School Teacher",
    titles: {
      en: "High School Teacher",
      fr: "Professeur de Lycée",
      es: "Profesor de Secundaria",
      de: "Gymnasiallehrer",
      it: "Professore di Scuola Superiore",
      pt: "Professor do Ensino Médio",
      ru: "Учитель средней школы",
      zh: "中学教师",
      ja: "高校教師",
      ko: "고등학교 교사",
      ar: "معلم المرحلة الثانوية"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    subCategory: "Teaching",
    keywords: ["high", "school", "secondary", "teacher", "subject"]
  },
  {
    code: "2310",
    titleEn: "University Professor",
    titles: {
      en: "University Professor",
      fr: "Professeur d'Université",
      es: "Profesor Universitario",
      de: "Universitätsprofessor",
      it: "Professore Universitario",
      pt: "Professor Universitário",
      ru: "Профессор университета",
      zh: "大学教授",
      ja: "大学教授",
      ko: "대학교수",
      ar: "أستاذ جامعي"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Teaching Professionals",
    category: "Education & Training",
    subCategory: "Teaching",
    keywords: ["university", "professor", "higher", "education", "research"]
  },

  // Training & Development
  {
    code: "2424",
    titleEn: "Corporate Trainer",
    titles: {
      en: "Corporate Trainer",
      fr: "Formateur d'Entreprise",
      es: "Formador Corporativo",
      de: "Unternehmensausbilder",
      it: "Formatore Aziendale",
      pt: "Treinador Corporativo",
      ru: "Корпоративный тренер",
      zh: "企业培训师",
      ja: "企業トレーナー",
      ko: "기업 교육담당자",
      ar: "مدرب الشركات"
    },
    majorGroup: "Professionals",
    subMajorGroup: "Business and Administration Professionals",
    category: "Education & Training",
    subCategory: "Training & Development",
    keywords: ["corporate", "trainer", "training", "development", "skills"]
  },
  {
    code: "2424b",
    titleEn: "Training Coordinator",
    titles: {
      en: "Training Coordinator",
      fr: "Coordinateur de Formation",
      es: "Coordinador de Capacitación",
      de: "Ausbildungskoordinator",
      it: "Coordinatore Formazione",
      pt: "Coordenador de Treinamento",
      ru: "Координатор обучения",
      zh: "培训协调员",
      ja: "研修コーディネーター",
      ko: "교육 조정자",
      ar: "منسق التدريب"
    },
    majorGroup: "Associate Professionals",
    subMajorGroup: "Business and Administration Associate Professionals",
    category: "Education & Training",
    subCategory: "Training & Development",
    keywords: ["training", "coordinator", "development", "programs"]
  }
];

export const popularJobs = [
  // Generic Popular Jobs
  "2610", // Legal Professional
  "2400b", // Banking Professional  
  "2500", // IT Professional
  "2200", // Healthcare Professional
  "2420", // Sales Professional
  "2300b", // Teacher
  
  // Specific Popular Jobs
  "2511", // Software Developer  
  "2611", // Lawyer
  "2211", // General Practitioner
  "2221", // Registered Nurse
  "2412", // Accountant
  "2411", // Bank Teller
  "5221", // Sales Representative
  "2341", // Elementary School Teacher
  "1113", // Operations Manager
  "1115", // Project Manager
  "2512", // Data Scientist
  "2515", // UX/UI Designer
  "2516", // IT Support Specialist
  "2612", // Paralegal
  "2262", // Pharmacist
  "2261", // Dentist
  "2264", // Physical Therapist
  "2513", // System Administrator
  "2514", // Cybersecurity Analyst
  "2634", // Psychologist
  "2635", // Social Worker
  "2511b", // Frontend Developer
  "2511c", // Backend Developer
  "2511d"  // Full Stack Developer
];

// Utility functions
export const getJobByCode = (code: string): JobClassification | undefined => {
  return jobClassifications.find(job => job.code === code);
};

export const getJobsByCategory = (category: string): JobClassification[] => {
  return jobClassifications.filter(job => job.category === category);
};

export const getJobsBySubCategory = (subCategory: string): JobClassification[] => {
  return jobClassifications.filter(job => job.subCategory === subCategory);
};

export const getJobsByMajorGroup = (majorGroup: string): JobClassification[] => {
  return jobClassifications.filter(job => job.majorGroup === majorGroup);
};

export const searchJobs = (query: string, language: string = 'en'): JobClassification[] => {
  if (!query.trim()) return jobClassifications;
  
  const searchTerm = query.toLowerCase().trim();
  
  return jobClassifications.filter(job => {
    // Search in current language title
    const currentTitle = job.titles[language]?.toLowerCase() || '';
    
    // Search in English title (fallback)
    const englishTitle = job.titleEn.toLowerCase();
    
    // Search in keywords
    const keywords = job.keywords?.join(' ').toLowerCase() || '';
    
    // Search in category and subcategory
    const category = job.category.toLowerCase();
    const subCategory = job.subCategory.toLowerCase();
    
    return currentTitle.includes(searchTerm) || 
           englishTitle.includes(searchTerm) || 
           keywords.includes(searchTerm) ||
           category.includes(searchTerm) ||
           subCategory.includes(searchTerm);
  });
};

export const getSubCategories = (category: string): string[] => {
  const jobs = getJobsByCategory(category);
  const subCategories = [...new Set(jobs.map(job => job.subCategory))];
  return subCategories.sort();
};

export const getCategories = (): string[] => {
  const categories = [...new Set(jobClassifications.map(job => job.category))];
  return categories.sort();
};