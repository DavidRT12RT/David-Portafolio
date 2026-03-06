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
      present: "Present",
      jobs: [
        {
          company: "ScaleFlow Tech",
          location: "Monterrey, N.L.",
          role: "Full Stack Developer",
          period: "April 2024 — Present",
          description:
            "Design and development of web and mobile applications using React and React Native, with backend solutions on Firebase and AWS. Leading the integration of AI systems using the OpenAI Agents SDK, designing multi-agent architectures with vector stores, handoff patterns, guardrails, and agent orchestration for production-ready intelligent solutions. AWS services include Cognito, SES, ECR, S3, RDS, and CI/CD with GitHub Actions.",
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
          period: "January 2024 — Present",
          description:
            "Development of Kapli, a production-grade educational platform used by multiple institutions. Built with React, React Native, and Laravel. Created Kappi, an AI-powered educational agent using RAG, vector stores, multimodal capabilities, and agent handoff patterns for intelligent academic automation.",
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
            "Full-stack development of GraphQL APIs using NestJS, microservices architecture, and databases like PostgreSQL and MongoDB. Creation of web platforms with ReactJS and mobile platforms with React Native.",
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
    contact: {
      title: "How I",
      titleHighlight: "Work.",
      steps: [
        {
          number: "01",
          title: "Discovery & Planning",
          description:
            "We align on goals, scope, and technical requirements. I map out the architecture and identify the right tools.",
        },
        {
          number: "02",
          title: "System Architecture",
          description:
            "Designing scalable systems with clean separation of concerns, API contracts, and cloud infrastructure.",
        },
        {
          number: "03",
          title: "Rapid Development",
          description:
            "Building with clean code and continuous feedback. Every feature is tested and iterated upon.",
        },
        {
          number: "04",
          title: "AI Integration",
          description:
            "Embedding intelligent agents, RAG pipelines, and multi-agent orchestration into your product.",
        },
        {
          number: "05",
          title: "Quality Assurance",
          description:
            "Rigorous testing, code reviews, and performance optimization before any deployment.",
        },
        {
          number: "06",
          title: "Ship & Scale",
          description:
            "Production-ready delivery with CI/CD, monitoring, and infrastructure that scales with your business.",
        },
      ],
    },
    footer: {
      rights: "All rights reserved.",
      built: "Built with Next.js, Three.js & AI",
      cta1: "If you\u2019re building a product",
      cta2: "and need thoughtful engineering,",
      ctaHighlight: "I\u2019m here.",
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
      present: "Presente",
      jobs: [
        {
          company: "ScaleFlow Tech",
          location: "Monterrey, N.L.",
          role: "Full Stack Developer",
          period: "Abril 2024 — Presente",
          description:
            "Diseño y desarrollo de aplicaciones web y móviles con React y React Native, con soluciones backend en Firebase y AWS. Liderando la integración de sistemas de IA usando el OpenAI Agents SDK, diseñando arquitecturas multi-agente con vector stores, patrones de handoff, guardrails y orquestación de agentes para soluciones inteligentes listas para producción. Servicios AWS incluyen Cognito, SES, ECR, S3, RDS y CI/CD con GitHub Actions.",
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
          period: "Enero 2024 — Presente",
          description:
            "Desarrollo de Kapli, una plataforma educativa de nivel producción utilizada por múltiples instituciones. Construida con React, React Native y Laravel. Creación de Kappi, un agente educativo potenciado por IA usando RAG, vector stores, capacidades multimodales y patrones de handoff de agentes para automatización académica inteligente.",
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
            "Desarrollo full-stack de APIs GraphQL usando NestJS, arquitectura de microservicios y bases de datos como PostgreSQL y MongoDB. Creación de plataformas web con ReactJS y plataformas móviles con React Native.",
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
    contact: {
      title: "Cómo",
      titleHighlight: "Trabajo.",
      steps: [
        {
          number: "01",
          title: "Descubrimiento & Planeación",
          description:
            "Alineamos objetivos, alcance y requisitos técnicos. Mapeo la arquitectura e identifico las herramientas correctas.",
        },
        {
          number: "02",
          title: "Arquitectura del Sistema",
          description:
            "Diseño de sistemas escalables con separación limpia de responsabilidades, contratos de API e infraestructura cloud.",
        },
        {
          number: "03",
          title: "Desarrollo Ágil",
          description:
            "Construcción con código limpio y retroalimentación continua. Cada feature es probada e iterada.",
        },
        {
          number: "04",
          title: "Integración de IA",
          description:
            "Incorporando agentes inteligentes, pipelines RAG y orquestación multi-agente en tu producto.",
        },
        {
          number: "05",
          title: "Aseguramiento de Calidad",
          description:
            "Testing riguroso, revisiones de código y optimización de rendimiento antes de cada despliegue.",
        },
        {
          number: "06",
          title: "Lanzar & Escalar",
          description:
            "Entrega lista para producción con CI/CD, monitoreo e infraestructura que escala con tu negocio.",
        },
      ],
    },
    footer: {
      rights: "Todos los derechos reservados.",
      built: "Construido con Next.js, Three.js & IA",
      cta1: "Si est\u00e1s construyendo un producto",
      cta2: "y necesitas ingenier\u00eda de calidad,",
      ctaHighlight: "aqu\u00ed estoy.",
    },
  },
};

export type Language = "en" | "es";
export type Translations = typeof translations.en;
