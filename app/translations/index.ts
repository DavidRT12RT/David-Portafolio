export const translations = {
  en: {
    nav: {
      about: "About",
      experience: "Experience",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      badge: "FULL STACK DEVELOPER & AI ENGINEER",
      title1: "Building Intelligent",
      title2: "Systems That Think",
      description:
        "I architect full-stack applications powered by AI agents, multi-agent orchestration, and cloud-native infrastructure. From React to AWS to OpenAI — I build the future.",
      cta1: "View My Work",
      cta2: "Get In Touch",
    },
    about: {
      title: "About",
      titleHighlight: "Me.",
      subtitle: "Who I am and what drives my work",
      p1: "I'm David Arcos Melgarejo, a Full Stack Developer specialized in building production-grade web and mobile applications with a strong focus on Artificial Intelligence and cloud architecture.",
      p2: "With experience across React, React Native, Node.js, Laravel, NestJS, Firebase, and AWS, I deliver end-to-end solutions that are scalable, secure, and intelligent. My passion lies in designing multi-agent AI architectures using the OpenAI Agents SDK, implementing RAG systems, and building AI-powered tools that solve real-world problems.",
      p3: "I believe technology should be purposeful — every line of code I write is aimed at creating impact.",
      stats: {
        years: "Years of Experience",
        projects: "Projects Delivered",
        technologies: "Technologies",
        ai: "AI Systems Built",
      },
    },
    experience: {
      title: "Work",
      titleHighlight: "Experience.",
      subtitle: "Companies and projects I've contributed to",
      present: "Present",
      jobs: [
        {
          company: "ScaleFlow Tech",
          location: "Monterrey, N.L.",
          role: "Full Stack Developer",
          period: "April 2024 — Present",
          description:
            "At ScaleFlow, I led the delivery of three independent AI-driven products. I built AI-powered ERP and CRM platforms delivered as SaaS solutions using Next.js and React, developed end-to-end on Firebase (Firestore, Auth, Cloud Functions, and Storage). I also developed a medical desktop platform with intelligent detection capabilities using Electron and a retrained YOLOv8 model, fully integrated with Firebase services. Additionally, I designed and implemented a custom multi-agent AI framework using the Agents SDK, deployed entirely on AWS, leveraging cloud-native services for orchestration, scalability, and security.",
          tags: [
            "React",
            "React Native",
            "AWS",
            "Firebase",
            "OpenAI Agents SDK",
            "Multi-Agent AI",
            "CI/CD",
          ],
        },
        {
          company: "Kapli",
          location: "Medellín",
          role: "Full Stack Developer",
          period: "May 2024 — Present",
          description:
            "Full-stack developer behind Kapli’s mobile and web platforms, built with Laravel and React Native. Led all AI development as the sole architect, creating smart features that power the app’s learning experience.",
          tags: [
            "React",
            "React Native",
            "Laravel",
            "RAG",
            "AI Agents",
            "Vector Stores",
            "Multimodal AI",
          ],
        },
        {
          company: "Grupo KPA",
          location: "",
          role: "Full Stack Developer",
          period: "March 2024 — December 2024",
          description:
            "At Grupo KPA, I developed “Bola,” a sports padel management platform, designed to handle memberships, coaches, scheduling, and operational workflows. The system was built using Laravel for the backend and React as a Single Page Application (SPA) for the frontend, and was deployed on AWS, leveraging cloud infrastructure for scalability, reliability, and secure access.",
          tags: [
            "NestJS",
            "GraphQL",
            "PostgreSQL",
            "MongoDB",
            "React",
            "React Native",
            "Microservices",
          ],
        },
        {
          company: "IOE Distribuidora",
          location: "",
          role: "Full Stack Developer",
          period: "December 2023 — March 2024",
          description:
            "Development of internal company tools for supplier order management, with additional support for VBA applications using SQL and PostgreSQL.",
          tags: ["React", "SQL", "PostgreSQL", "VBA", "Internal Tools"],
        },
        {
          company: "Vivero Garcia",
          location: "",
          role: "Full Stack Developer",
          period: "June 2023 — November 2023",
          description:
            "Development of an internal system for management and storage of chemicals in the agricultural sector, utilizing NestJS, React Native, and SQL.",
          tags: ["NestJS", "React Native", "SQL", "Agriculture Tech"],
        },
        {
          company: "Sanz Constructora",
          location: "",
          role: "Full Stack Developer",
          period: "January 2022 — March 2023",
          description:
            "Development of the company's internal management system using React for the frontend and Express for the backend, all under the Node.js framework.",
          tags: ["React", "Express", "Node.js", "Internal Systems"],
        },
      ],
    },
    skills: {
      title: "Tech",
      titleHighlight: "Stack.",
      subtitle: "Tools and technologies I work with daily",
      categories: {
        ai: {
          title: "AI & Machine Learning",
          items: [
            "OpenAI Agents SDK",
            "Multi-Agent Architectures",
            "RAG (Retrieval-Augmented Generation)",
            "Vector Stores & Embeddings",
            "Agent Handoff & Orchestration",
            "Guardrails & Safety",
            "YOLO (Object Detection)",
            "Computer Vision",
            "LLM Integration",
            "Multimodal AI",
          ],
        },
        frontend: {
          title: "Frontend",
          items: [
            "React / Next.js",
            "React Native",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Three.js / R3F",
          ],
        },
        backend: {
          title: "Backend",
          items: [
            "Node.js / Express",
            "NestJS",
            "Laravel (PHP)",
            "GraphQL",
            "REST APIs",
            "Microservices",
          ],
        },
        cloud: {
          title: "Cloud & DevOps",
          items: [
            "AWS (Cognito, SES, ECR, S3, RDS)",
            "Firebase / Google Cloud",
            "GitHub Actions CI/CD",
            "Docker",
            "PostgreSQL / MongoDB",
            "Serverless Functions",
          ],
        },
      },
    },
    treasury: {
      intro:
        "Athens struck its silver with Athena's owl, and those coins paid for the fleet and the Parthenon. These are mine: each technology in the metal of its trade, with the works where it has already paid its way.",
      metals: { gold: "gold", silver: "silver", bronze: "bronze", electrum: "electrum" },
      details: {
        openai: "Agents SDK",
        yolo: "Object Detection",
        laravel: "PHP",
        amazonwebservices: "Cognito, SES, ECR, S3, RDS",
        githubactions: "CI/CD",
      },
      inWorks: "In the works",
      also: "Also",
    },
    projects: {
      title: "Selected",
      titleHighlight: "Projects.",
      subtitle: "A selection of my most impactful work",
      items: [
        {
          title: "Solomon — Multi-Agent Consulting System",
          description:
            "Advanced multi-agent AI consulting platform powered by the OpenAI Agents SDK. Features orchestrated agent handoffs, specialized domain agents, vector store RAG, guardrails, and real-time streaming responses for enterprise-grade consulting workflows.",
          tags: ["OpenAI Agents SDK", "Multi-Agent", "RAG", "React", "NestJS"],
        },
        {
          title: "Kapli — AI-Powered Educational Platform",
          description:
            "Production-grade educational platform used by multiple institutions. Includes web and mobile apps built with React and React Native. Features Kappi, an AI educational agent with RAG, vector stores, multimodal capabilities, and agent handoff patterns.",
          tags: ["React", "React Native", "Laravel", "AI Agents", "RAG"],
        },
        {
          title: "ScaleFlow Suite — CRM/ERP with AI Agents",
          description:
            "Enterprise management suite with WhatsApp API integration, lead pipelines, and AI-driven multi-agent architectures. Built on AWS and Firebase with CI/CD pipelines and real-time data handling.",
          tags: ["React", "AWS", "Firebase", "OpenAI", "Multi-Agent"],
        },
        {
          title: "ADVANCE — AI-Assisted Medical Detection",
          description:
            "Intelligent medical imaging system using YOLO for real-time polyp detection during colonoscopies, combined with LLM-based analysis summaries. Features CNN-based detection sessions and AI-assisted diagnostic reports.",
          tags: ["YOLO", "Computer Vision", "LLM", "React", "Real-Time AI"],
        },
      ],
    },
    giants: {
      title: "The fall of",
      titleHighlight: "the giants.",
      subtitle: "What happens when a system is built by brute force",
      intro:
        "The giants tried to take Olympus by piling mountain upon mountain, with no plan but their strength. Jacob Jordaens painted the moment it all comes down on them. Software knows that fall too, and it nearly always starts the same way: building faster than thinking.",
      story: [
        {
          title: "Mountain upon mountain",
          text: "To reach the sky they piled up mountains with no foundations. Code goes the same way: patches, shortcuts and dependencies pile up until something gives. So I start with the architecture: every part with one responsibility, clear API contracts and infrastructure designed from day one.",
          detail: "The giants falling from the sky",
          practice: "specialised domain agents, each with its own job, handing work to one another",
          project: 0,
        },
        {
          title: "Brute force",
          text: "This giant holds his rock up by sheer strength, and that is how many systems are held up: deploying by hand, testing by hand, hoping at every release. It holds for a while, until the weight wins. What repeats, I automate: every change goes through tests and ships through a pipeline.",
          detail: "The giant lifting the rock",
          practice: "CI/CD pipelines on AWS and Firebase",
          project: 2,
        },
        {
          title: "What carries the weight",
          text: "In the middle, a giant carries the mountain on his back. A system in production carries something like it: users, data and whole institutions that depend on it standing. I design it so the load is shared and it can grow without buckling.",
          detail: "The giant under the mountain",
          practice: "a web and mobile platform used by several institutions",
          project: 1,
        },
        {
          title: "When it falls, it falls on someone",
          text: "Below lies the one who was crushed. When a system fails, the blow does not land on the code: it lands on a person. In some software getting it wrong is not an option, so I test it, review it and monitor it before and after it reaches production.",
          detail: "The crushed giant",
          practice: "real-time polyp detection during colonoscopies",
          project: 3,
        },
        {
          title: "Order beats force",
          text: "The gods did not win by being stronger, but by fighting with order. Strength without method ends up under its own mountain; that is why everything I build starts with a plan and ends in production.",
          detail: "The whole battle",
          practice: "",
          project: null,
        },
      ],
      inPractice: "In practice",
      seeWork: "See the work",
      seeWorks: "See the works",
    },
    oracle: {
      title: "AI in",
      titleHighlight: "Production.",
      subtitle: "The AI I build already answers inside real products",
      intro:
        "At Delphi, whoever needed an answer climbed to Apollo's sanctuary, asked their question and waited for the oracle to speak. Camillo Miola painted that moment, and it is how I see artificial intelligence: a system that listens, answers and is accountable for what it says.",
      story: [
        {
          title: "The question",
          text: "It always starts with someone who needs something: a business with its clients, a student with a doubt, a doctor in front of an image. Before writing a single line of code, I listen for the real question.",
          detail: "The consultants and their offerings",
        },
        {
          title: "The voice",
          text: "The Pythia spoke in a trance, wrapped in the vapours rising from the chasm. A language model is much the same: a powerful voice that, without context or limits, can also be wrong.",
          detail: "The Pythia on her tripod",
        },
        {
          title: "The interpreters",
          text: "Beside her, the priests listened, wrote down and shaped her words into an answer. That is my work around the model: specialised agents, RAG over the right sources, guardrails and orchestration, so the answer is useful and reliable.",
          detail: "The priest who writes it down",
        },
        {
          title: "What is written down",
          text: "Answers were carved in stone so that no one could twist them. In my systems every answer is tested and monitored, before and after it reaches production.",
          detail: "The inscribed stele",
        },
        {
          title: "Nothing in excess",
          text: "Apollo's temple bore the words “nothing in excess”. So I use AI where it truly solves something, and today those answers run every day inside real products.",
          detail: "The whole sanctuary",
        },
      ],
      listLead: "Four capabilities, each one running in a real project.",
      capabilities: [
        {
          name: "Multi-agent orchestration",
          description:
            "Specialised domain agents that hand work to one another, with guardrails, vector-store RAG and real-time streamed answers.",
          project: 0,
        },
        {
          name: "RAG and knowledge agents",
          description:
            "Kappi, an educational agent that answers from vector stores, with multimodal capabilities and agent handoffs, used by several institutions.",
          project: 1,
        },
        {
          name: "Agents in CRM and ERP",
          description: "Multi-agent architectures inside a management suite, with WhatsApp API integration and lead pipelines.",
          project: 2,
        },
        {
          name: "Computer vision",
          description: "Real-time polyp detection with YOLO during colonoscopies, with LLM-based analysis summaries.",
          project: 3,
        },
      ],
      runningIn: "Running in",
      seeWork: "See the work",
    },
    contact: {
      title: "How I",
      titleHighlight: "Work.",
      subtitle: "My process from discovery to delivery",
      steps: [
        {
          number: "01",
          title: "Discovery & Planning",
          description:
            "We align on goals, scope, and technical requirements. I map out the architecture and identify the right tools.",
          detail: "The giants storm Olympus",
        },
        {
          number: "02",
          title: "System Architecture",
          description:
            "Designing scalable systems with clean separation of concerns, API contracts, and cloud infrastructure.",
          detail: "Minerva, with spear and shield",
        },
        {
          number: "03",
          title: "Rapid Development",
          description:
            "Building with clean code and continuous feedback. Every feature is tested and iterated upon.",
          detail: "Mercury, the messenger",
        },
        {
          number: "04",
          title: "AI Integration",
          description:
            "Embedding intelligent agents, RAG pipelines, and multi-agent orchestration into your product.",
          detail: "Jupiter raises the thunderbolt",
        },
        {
          number: "05",
          title: "Quality Assurance",
          description:
            "Rigorous testing, code reviews, and performance optimization before any deployment.",
          detail: "The giants fall",
        },
        {
          number: "06",
          title: "Ship & Scale",
          description:
            "Production-ready delivery with CI/CD, monitoring, and infrastructure that scales with your business.",
          detail: "All of Olympus",
        },
      ],
    },
    footer: {
      rights: "All rights reserved.",
      built: "Built with Next.js, Three.js & AI",
      cta1: "If you’re building a product",
      cta2: "and need thoughtful engineering,",
      ctaHighlight: "I’m here.",
      emailLabel: "Email me",
    },
    rooms: {
      about: { greek: "ΛΟΓΟΣ", translit: "lógos", gloss: "reason" },
      experience: { greek: "ΟΔΥΣΣΕΙΑ", translit: "odýsseia", gloss: "the journey" },
      skills: { greek: "ΤΕΧΝΗ", translit: "téchnē", gloss: "the craft" },
      projects: { greek: "ΕΡΓΑ", translit: "érga", gloss: "the works" },
      method: { greek: "ΜΕΘΟΔΟΣ", translit: "méthodos", gloss: "the way" },
      oracle: { greek: "ΜΑΝΤΕΙΟΝ", translit: "manteîon", gloss: "the oracle" },
      giants: { greek: "ΓΙΓΑΝΤΟΜΑΧΙΑ", translit: "gigantomachía", gloss: "the battle of the giants" },
      contact: { greek: "ΧΑΙΡΕ", translit: "chaîre", gloss: "greetings" },
    },
    paintings: {
      consummation: {
        artist: "Thomas Cole",
        title: "The Consummation of Empire",
        series: "The Course of Empire",
        date: "1836",
        collection: "New-York Historical Society",
      },
      olympus: {
        artist: "Francisco Bayeu",
        title: "Olympus: The Fall of the Giants",
        series: "Sketch for a ceiling of the Royal Palace, Madrid",
        date: "1764",
        collection: "Museo del Prado",
      },
      amazons: {
        artist: "Peter Paul Rubens",
        title: "The Battle of the Amazons",
        series: "",
        date: "c. 1618",
        collection: "Alte Pinakothek, Munich",
      },
      giants: {
        artist: "Jacob Jordaens",
        title: "The Fall of the Giants",
        series: "",
        date: "1636–1638",
        collection: "Museo del Prado, Madrid",
      },
      oracle: {
        artist: "Camillo Miola",
        title: "The Oracle",
        series: "",
        date: "1880",
        collection: "The J. Paul Getty Museum, Los Angeles",
      },
      parthenon: {
        artist: "Frederic Edwin Church",
        title: "The Parthenon",
        series: "",
        date: "1871",
        collection: "The Metropolitan Museum of Art, New York",
      },
    },
    figures: {
      credit: "3D scan: SMK, Statens Museum for Kunst · Public domain",
      athena: {
        title: "Athena Parthenos (head)",
        medium: "Plaster cast · 80.5 × 58 × 48 cm",
        origin: "Greek original, c. 440 BC. Hellenistic copy from Pergamon, 200–150 BC.",
        inventory: "KAS 2272",
      },
      plato: {
        title: "Plato (427–347 BC)",
        medium: "Plaster cast · 49 cm",
        origin: "Greek original, c. 350 BC. Roman copy.",
        inventory: "KAS 2111",
      },
      homer: {
        title: "Homer",
        medium: "Plaster cast · 33 × 37 cm",
        origin: "Hellenistic original, 2nd century BC. Roman copy, formerly in the Farnese collection.",
        inventory: "KAS 210",
      },
      discobolus: {
        title: "Discobolus",
        medium: "Painted plaster cast · 168 × 100 × 50.5 cm",
        origin: "Greek original by Myron, c. 450 BC.",
        inventory: "KAS 1074",
      },
      apollo: {
        title: "Apollo Belvedere",
        medium: "Plaster cast · 232 × 103 × 126 cm",
        origin: "Greek original, c. 330 BC. Roman copy found near Antium in the late 15th century.",
        inventory: "KAS 353",
      },
    },
    ui: {
      skip: "Skip to main content",
      navLabel: "Main navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      menuTitle: "Rooms",
      languageLabel: "Language",
      switchLanguage: "Cambiar a Español",
      viewScreens: "View screenshots",
      close: "Close",
      previous: "Previous image",
      next: "Next image",
      imageOf: "Image {n} of {total}",
      previousWork: "Previous work",
      nextWork: "Next work",
      workOf: "Work {n} of {total}",
      signatureGloss: "“David made this”, the way Greek sculptors signed their work.",
      sculptures: "Sculptures: public-domain 3D scans from SMK, Copenhagen.",
      paintingCredit:
        "Paintings: Thomas Cole (1836), Peter Paul Rubens (c. 1618), Francisco Bayeu (1764), Camillo Miola (1880), Frederic Edwin Church (1871) and Jacob Jordaens (1636–1638), public domain.",
      methodDetail: "Detail",
    },
  },
  es: {
    nav: {
      about: "Acerca",
      experience: "Experiencia",
      skills: "Habilidades",
      projects: "Proyectos",
      contact: "Contacto",
    },
    hero: {
      badge: "FULL STACK DEVELOPER & AI ENGINEER",
      title1: "Construyendo Sistemas",
      title2: "Inteligentes Que Piensan",
      description:
        "Diseño aplicaciones full-stack impulsadas por agentes de IA, orquestación multi-agente e infraestructura cloud-native. De React a AWS a OpenAI — construyo el futuro.",
      cta1: "Ver Mi Trabajo",
      cta2: "Contáctame",
    },
    about: {
      title: "Sobre",
      titleHighlight: "Mí.",
      subtitle: "Quién soy y qué impulsa mi trabajo",
      p1: "Soy David Arcos Melgarejo, un Desarrollador Full Stack especializado en la construcción de aplicaciones web y móviles de nivel producción con un fuerte enfoque en Inteligencia Artificial y arquitectura en la nube.",
      p2: "Con experiencia en React, React Native, Node.js, Laravel, NestJS, Firebase y AWS, entrego soluciones end-to-end que son escalables, seguras e inteligentes. Mi pasión radica en diseñar arquitecturas de IA multi-agente usando el OpenAI Agents SDK, implementar sistemas RAG y construir herramientas potenciadas por IA que resuelven problemas del mundo real.",
      p3: "Creo que la tecnología debe tener propósito — cada línea de código que escribo está dirigida a crear impacto.",
      stats: {
        years: "Años de Experiencia",
        projects: "Proyectos Entregados",
        technologies: "Tecnologías",
        ai: "Sistemas de IA Construidos",
      },
    },
    experience: {
      title: "Experiencia",
      titleHighlight: "Laboral.",
      subtitle: "Empresas y proyectos en los que he contribuido",
      present: "Presente",
      jobs: [
        {
          company: "ScaleFlow Tech",
          location: "Monterrey, N.L.",
          role: "Full Stack Developer",
          period: "Abril 2024 — Presente",
          description:
            "En ScaleFlow, lideré la entrega de tres productos independientes impulsados por IA. Construí plataformas ERP y CRM potenciadas por inteligencia artificial, entregadas como soluciones SaaS utilizando Next.js y React, desarrolladas de extremo a extremo sobre Firebase (Firestore, Auth, Cloud Functions y Storage). También desarrollé una plataforma médica de escritorio con capacidades de detección inteligente utilizando Electron y un modelo YOLOv8 reentrenado, completamente integrado con los servicios de Firebase. Además, diseñé e implementé un framework personalizado de IA multiagente utilizando el Agents SDK, desplegado completamente en AWS, aprovechando servicios nativos de la nube para orquestación, escalabilidad y seguridad.",
          tags: [
            "React",
            "React Native",
            "AWS",
            "Firebase",
            "OpenAI Agents SDK",
            "Multi-Agent AI",
            "CI/CD",
          ],
        },
        {
          company: "Kapli",
          location: "Medellín",
          role: "Full Stack Developer",
          period: "Mayo 2024 — Presente",
          description:
            "Desarrollador Full Stack detrás de las plataformas móvil y web de Kapli, construidas con Laravel y React Native. Lideré todo el desarrollo de IA como arquitecto único, creando funcionalidades inteligentes que impulsan la experiencia de aprendizaje de la aplicación.",
          tags: [
            "React",
            "React Native",
            "Laravel",
            "RAG",
            "AI Agents",
            "Vector Stores",
            "Multimodal AI",
          ],
        },
        {
          company: "Grupo KPA",
          location: "",
          role: "Full Stack Developer",
          period: "Marzo 2024 — Diciembre 2024",
          description:
            "En Grupo KPA, desarrollé “Bola”, una plataforma de gestión deportiva para pádel, diseñada para administrar membresías, entrenadores, programación de horarios y flujos operativos. El sistema fue construido utilizando Laravel para el backend y React como una Single Page Application (SPA) para el frontend, y fue desplegado en AWS, aprovechando la infraestructura en la nube para garantizar escalabilidad, confiabilidad y acceso seguro.",
          tags: [
            "NestJS",
            "GraphQL",
            "PostgreSQL",
            "MongoDB",
            "React",
            "React Native",
            "Microservicios",
          ],
        },
        {
          company: "IOE Distribuidora",
          location: "",
          role: "Full Stack Developer",
          period: "Diciembre 2023 — Marzo 2024",
          description:
            "Desarrollo de herramientas internas para la gestión de pedidos a proveedores, con soporte adicional para aplicaciones VBA usando SQL y PostgreSQL.",
          tags: ["React", "SQL", "PostgreSQL", "VBA", "Herramientas Internas"],
        },
        {
          company: "Vivero Garcia",
          location: "",
          role: "Full Stack Developer",
          period: "Junio 2023 — Noviembre 2023",
          description:
            "Desarrollo de un sistema interno para la gestión y almacenamiento de químicos en el sector agrícola, utilizando NestJS, React Native y SQL.",
          tags: ["NestJS", "React Native", "SQL", "AgriTech"],
        },
        {
          company: "Sanz Constructora",
          location: "",
          role: "Full Stack Developer",
          period: "Enero 2022 — Marzo 2023",
          description:
            "Desarrollo del sistema de gestión interna de la empresa utilizando React para el frontend y Express para el backend, todo bajo el framework Node.js.",
          tags: ["React", "Express", "Node.js", "Sistemas Internos"],
        },
      ],
    },
    skills: {
      title: "Stack",
      titleHighlight: "Tecnológico.",
      subtitle: "Especializado en desarrollo full-stack potenciado por IA",
      categories: {
        ai: {
          title: "IA & Machine Learning",
          items: [
            "OpenAI Agents SDK",
            "Arquitecturas Multi-Agente",
            "RAG (Generación Aumentada por Recuperación)",
            "Vector Stores & Embeddings",
            "Handoff & Orquestación de Agentes",
            "Guardrails & Seguridad",
            "YOLO (Detección de Objetos)",
            "Visión por Computadora",
            "Integración de LLMs",
            "IA Multimodal",
          ],
        },
        frontend: {
          title: "Frontend",
          items: [
            "React / Next.js",
            "React Native",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Three.js / R3F",
          ],
        },
        backend: {
          title: "Backend",
          items: [
            "Node.js / Express",
            "NestJS",
            "Laravel (PHP)",
            "GraphQL",
            "REST APIs",
            "Microservicios",
          ],
        },
        cloud: {
          title: "Cloud & DevOps",
          items: [
            "AWS (Cognito, SES, ECR, S3, RDS)",
            "Firebase / Google Cloud",
            "GitHub Actions CI/CD",
            "Docker",
            "PostgreSQL / MongoDB",
            "Funciones Serverless",
          ],
        },
      },
    },
    treasury: {
      intro:
        "Atenas acuñaba su plata con la lechuza de Atenea, y esas monedas pagaron la flota y el Partenón. Estas son las mías: cada tecnología en el metal de su oficio, con las obras donde ya ha pagado su parte.",
      metals: { gold: "oro", silver: "plata", bronze: "bronce", electrum: "electro" },
      details: {
        openai: "Agents SDK",
        yolo: "Detección de Objetos",
        laravel: "PHP",
        amazonwebservices: "Cognito, SES, ECR, S3, RDS",
        githubactions: "CI/CD",
      },
      inWorks: "En las obras",
      also: "También",
    },
    projects: {
      title: "Proyectos",
      titleHighlight: "Seleccionados.",
      subtitle: "Una selección de mi trabajo más impactante",
      items: [
        {
          title: "Solomon — Sistema de Consultoría Multi-Agente",
          description:
            "Plataforma avanzada de consultoría con IA multi-agente impulsada por el OpenAI Agents SDK. Incluye handoffs orquestados entre agentes, agentes de dominio especializados, RAG con vector stores, guardrails y respuestas en streaming en tiempo real para flujos de consultoría empresarial.",
          tags: ["OpenAI Agents SDK", "Multi-Agent", "RAG", "React", "NestJS"],
        },
        {
          title: "Kapli — Plataforma Educativa con IA",
          description:
            "Plataforma educativa de nivel producción utilizada por múltiples instituciones. Incluye aplicaciones web y móviles construidas con React y React Native. Cuenta con Kappi, un agente educativo con IA con RAG, vector stores, capacidades multimodales y patrones de handoff de agentes.",
          tags: ["React", "React Native", "Laravel", "AI Agents", "RAG"],
        },
        {
          title: "ScaleFlow Suite — CRM/ERP con Agentes IA",
          description:
            "Suite de gestión empresarial con integración de API WhatsApp, pipelines de leads y arquitecturas multi-agente impulsadas por IA. Construido sobre AWS y Firebase con pipelines CI/CD y manejo de datos en tiempo real.",
          tags: ["React", "AWS", "Firebase", "OpenAI", "Multi-Agent"],
        },
        {
          title: "ADVANCE — Detección Médica Asistida por IA",
          description:
            "Sistema inteligente de imágenes médicas usando YOLO para detección de pólipos en tiempo real durante colonoscopías, combinado con resúmenes de análisis basados en LLM. Incluye sesiones de detección CNN y reportes diagnósticos asistidos por IA.",
          tags: [
            "YOLO",
            "Visión por Computadora",
            "LLM",
            "React",
            "IA Tiempo Real",
          ],
        },
      ],
    },
    giants: {
      title: "La caída de",
      titleHighlight: "los gigantes.",
      subtitle: "Lo que pasa cuando un sistema se construye a la fuerza",
      intro:
        "Los gigantes quisieron tomar el Olimpo amontonando montaña sobre montaña, sin más plan que su fuerza. Jacob Jordaens pintó el instante en que todo se les viene encima. El software también conoce esa caída, y casi siempre empieza igual: construir más rápido de lo que se piensa.",
      story: [
        {
          title: "Montaña sobre montaña",
          text: "Para alcanzar el cielo apilaron montañas sin cimientos. En el código pasa igual: parches, atajos y dependencias que se acumulan hasta que algo cede. Por eso empiezo por la arquitectura: cada parte con una sola responsabilidad, contratos de API claros e infraestructura pensada desde el primer día.",
          detail: "Los gigantes que caen del cielo",
          practice: "agentes de dominio especializados, cada uno con su tarea, que se pasan el trabajo con handoffs",
          project: 0,
        },
        {
          title: "La fuerza bruta",
          text: "Este gigante sostiene su roca a pulso, y así se sostienen muchos sistemas: desplegar a mano, probar a mano, cruzar los dedos en cada versión. Aguanta un tiempo, hasta que el peso gana. Lo que se repite lo automatizo: cada cambio pasa por pruebas y sale por un pipeline.",
          detail: "El gigante que levanta la roca",
          practice: "pipelines de CI/CD sobre AWS y Firebase",
          project: 2,
        },
        {
          title: "Lo que carga el peso",
          text: "En el centro, un gigante carga la montaña sobre la espalda. Un sistema en producción carga algo parecido: usuarios, datos e instituciones enteras que dependen de que siga en pie. Lo diseño para que el peso se reparta y pueda crecer sin doblarse.",
          detail: "El gigante bajo la montaña",
          practice: "una plataforma web y móvil usada por múltiples instituciones",
          project: 1,
        },
        {
          title: "Cuando cae, cae sobre alguien",
          text: "Abajo queda el que fue aplastado. Cuando un sistema falla, el golpe no lo recibe el código: lo recibe una persona. Hay software donde equivocarse no es opción, así que lo pruebo, lo reviso y lo monitoreo antes y después de llegar a producción.",
          detail: "El gigante aplastado",
          practice: "detección de pólipos en tiempo real durante colonoscopías",
          project: 3,
        },
        {
          title: "El orden vence a la fuerza",
          text: "Los dioses no ganaron por ser más fuertes, sino por pelear con orden. La fuerza sin método acaba bajo su propia montaña; por eso todo lo que construyo empieza con un plan y termina en producción.",
          detail: "La batalla entera",
          practice: "",
          project: null,
        },
      ],
      inPractice: "En la práctica",
      seeWork: "Ver la obra",
      seeWorks: "Ver las obras",
    },
    oracle: {
      title: "IA en",
      titleHighlight: "Producción.",
      subtitle: "La IA que construyo ya responde dentro de productos reales",
      intro:
        "En Delfos, quien necesitaba una respuesta subía al santuario de Apolo, hacía su pregunta y esperaba a que el oráculo hablara. Camillo Miola pintó ese momento, y así entiendo la inteligencia artificial: un sistema que escucha, responde y rinde cuentas de lo que dice.",
      story: [
        {
          title: "La pregunta",
          text: "Todo empieza con alguien que necesita algo: un negocio con sus clientes, un alumno con una duda, un médico frente a una imagen. Antes de escribir una sola línea de código, escucho la pregunta de verdad.",
          detail: "Los consultantes y sus ofrendas",
        },
        {
          title: "La voz",
          text: "La pitia hablaba en trance, envuelta en los vapores que subían de la grieta. Un modelo de lenguaje se le parece: una voz poderosa que, sin contexto ni límites, también puede equivocarse.",
          detail: "La pitia sobre el trípode",
        },
        {
          title: "Los intérpretes",
          text: "A su lado, los sacerdotes escuchaban, anotaban y daban forma de respuesta a sus palabras. Ese es mi trabajo alrededor del modelo: agentes especializados, RAG con las fuentes correctas, guardrails y orquestación, para que la respuesta sea útil y confiable.",
          detail: "El sacerdote que la anota",
        },
        {
          title: "Lo que queda escrito",
          text: "Las respuestas se grababan en piedra para que nadie pudiera torcerlas. En mis sistemas cada respuesta se prueba y se monitorea, antes y después de llegar a producción.",
          detail: "La estela grabada",
        },
        {
          title: "Nada en exceso",
          text: "En el templo de Apolo se leía «nada en exceso». Por eso uso la IA donde de verdad resuelve algo, y hoy esas respuestas funcionan todos los días dentro de productos reales.",
          detail: "El santuario entero",
        },
      ],
      listLead: "Cuatro capacidades, cada una funcionando en un proyecto real.",
      capabilities: [
        {
          name: "Orquestación multi-agente",
          description:
            "Agentes de dominio especializados que se pasan el trabajo con handoffs, con guardrails, RAG con vector stores y respuestas en streaming en tiempo real.",
          project: 0,
        },
        {
          name: "RAG y agentes de conocimiento",
          description:
            "Kappi, un agente educativo que responde desde vector stores, con capacidades multimodales y handoffs, usado por múltiples instituciones.",
          project: 1,
        },
        {
          name: "Agentes en CRM y ERP",
          description: "Arquitecturas multi-agente dentro de una suite de gestión, con integración de API WhatsApp y pipelines de leads.",
          project: 2,
        },
        {
          name: "Visión por computadora",
          description: "Detección de pólipos en tiempo real con YOLO durante colonoscopías, con resúmenes de análisis basados en LLM.",
          project: 3,
        },
      ],
      runningIn: "En producción en",
      seeWork: "Ver la obra",
    },
    contact: {
      title: "Cómo",
      titleHighlight: "Trabajo.",
      subtitle: "Mi proceso desde el descubrimiento hasta la entrega",
      steps: [
        {
          number: "01",
          title: "Descubrimiento & Planeación",
          description:
            "Alineamos objetivos, alcance y requisitos técnicos. Mapeo la arquitectura e identifico las herramientas correctas.",
          detail: "Los gigantes asaltan el Olimpo",
        },
        {
          number: "02",
          title: "Arquitectura del Sistema",
          description:
            "Diseño de sistemas escalables con separación limpia de responsabilidades, contratos de API e infraestructura cloud.",
          detail: "Minerva, con lanza y escudo",
        },
        {
          number: "03",
          title: "Desarrollo Ágil",
          description:
            "Construcción con código limpio y retroalimentación continua. Cada feature es probada e iterada.",
          detail: "Mercurio, el mensajero",
        },
        {
          number: "04",
          title: "Integración de IA",
          description:
            "Incorporando agentes inteligentes, pipelines RAG y orquestación multi-agente en tu producto.",
          detail: "Júpiter alza el rayo",
        },
        {
          number: "05",
          title: "Aseguramiento de Calidad",
          description:
            "Testing riguroso, revisiones de código y optimización de rendimiento antes de cada despliegue.",
          detail: "Los gigantes caen",
        },
        {
          number: "06",
          title: "Lanzar & Escalar",
          description:
            "Entrega lista para producción con CI/CD, monitoreo e infraestructura que escala con tu negocio.",
          detail: "El Olimpo entero",
        },
      ],
    },
    footer: {
      rights: "Todos los derechos reservados.",
      built: "Construido con Next.js, Three.js & IA",
      cta1: "Si est\u00e1s construyendo un producto",
      cta2: "y necesitas ingenier\u00eda de calidad,",
      ctaHighlight: "aqu\u00ed estoy.",
      emailLabel: "Escríbeme",
    },
    rooms: {
      about: { greek: "ΛΟΓΟΣ", translit: "lógos", gloss: "la razón" },
      experience: { greek: "ΟΔΥΣΣΕΙΑ", translit: "odýsseia", gloss: "el viaje" },
      skills: { greek: "ΤΕΧΝΗ", translit: "téchnē", gloss: "el oficio" },
      projects: { greek: "ΕΡΓΑ", translit: "érga", gloss: "las obras" },
      method: { greek: "ΜΕΘΟΔΟΣ", translit: "méthodos", gloss: "el camino" },
      oracle: { greek: "ΜΑΝΤΕΙΟΝ", translit: "manteîon", gloss: "el oráculo" },
      giants: { greek: "ΓΙΓΑΝΤΟΜΑΧΙΑ", translit: "gigantomachía", gloss: "la batalla de los gigantes" },
      contact: { greek: "ΧΑΙΡΕ", translit: "chaîre", gloss: "un saludo" },
    },
    paintings: {
      consummation: {
        artist: "Thomas Cole",
        title: "La consumación del imperio",
        series: "El curso del imperio",
        date: "1836",
        collection: "New-York Historical Society",
      },
      olympus: {
        artist: "Francisco Bayeu",
        title: "El Olimpo: batalla con los gigantes",
        series: "Boceto para un techo del Palacio Real de Madrid",
        date: "1764",
        collection: "Museo del Prado",
      },
      amazons: {
        artist: "Peter Paul Rubens",
        title: "La batalla de las amazonas",
        series: "",
        date: "c. 1618",
        collection: "Alte Pinakothek, Múnich",
      },
      giants: {
        artist: "Jacob Jordaens",
        title: "La caída de los gigantes",
        series: "",
        date: "1636–1638",
        collection: "Museo del Prado, Madrid",
      },
      oracle: {
        artist: "Camillo Miola",
        title: "El oráculo",
        series: "",
        date: "1880",
        collection: "The J. Paul Getty Museum, Los Ángeles",
      },
      parthenon: {
        artist: "Frederic Edwin Church",
        title: "El Partenón",
        series: "",
        date: "1871",
        collection: "The Metropolitan Museum of Art, Nueva York",
      },
    },
    figures: {
      credit: "Escaneo 3D: SMK, Statens Museum for Kunst · Dominio público",
      athena: {
        title: "Atenea Partenos (cabeza)",
        medium: "Vaciado en yeso · 80,5 × 58 × 48 cm",
        origin: "Original griego, c. 440 a. C. Copia helenística de Pérgamo, 200–150 a. C.",
        inventory: "KAS 2272",
      },
      plato: {
        title: "Platón (427–347 a. C.)",
        medium: "Vaciado en yeso · 49 cm",
        origin: "Original griego, c. 350 a. C. Copia romana.",
        inventory: "KAS 2111",
      },
      homer: {
        title: "Homero",
        medium: "Vaciado en yeso · 33 × 37 cm",
        origin: "Original helenístico, s. II a. C. Copia romana, antigua colección Farnese.",
        inventory: "KAS 210",
      },
      discobolus: {
        title: "Discóbolo",
        medium: "Vaciado en yeso pintado · 168 × 100 × 50,5 cm",
        origin: "Original griego de Mirón, c. 450 a. C.",
        inventory: "KAS 1074",
      },
      apollo: {
        title: "Apolo del Belvedere",
        medium: "Vaciado en yeso · 232 × 103 × 126 cm",
        origin: "Original griego, c. 330 a. C. Copia romana hallada cerca de Antium a finales del s. XV.",
        inventory: "KAS 353",
      },
    },
    ui: {
      skip: "Saltar al contenido",
      navLabel: "Navegación principal",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      menuTitle: "Salas",
      languageLabel: "Idioma",
      switchLanguage: "Switch to English",
      viewScreens: "Ver capturas",
      close: "Cerrar",
      previous: "Imagen anterior",
      next: "Imagen siguiente",
      imageOf: "Imagen {n} de {total}",
      previousWork: "Obra anterior",
      nextWork: "Obra siguiente",
      workOf: "Obra {n} de {total}",
      signatureGloss: "«David lo hizo», como firmaban sus obras los escultores griegos.",
      sculptures: "Esculturas: escaneos 3D de dominio público del SMK, Copenhague.",
      paintingCredit:
        "Pinturas: Thomas Cole (1836), Peter Paul Rubens (c. 1618), Francisco Bayeu (1764), Camillo Miola (1880), Frederic Edwin Church (1871) y Jacob Jordaens (1636–1638), dominio público.",
      methodDetail: "Detalle",
    },
  },
};

export type Language = "en" | "es";
export type Translations = typeof translations.en;
