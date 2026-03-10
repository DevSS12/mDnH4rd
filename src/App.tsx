/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Server, Shield, Code, X, Terminal, Layout, Hammer, LogIn, LogOut } from "lucide-react";
import { db, auth, login, logout, onAuthStateChanged, onSnapshot, doc, updateDoc, User, setDoc } from "./firebase";

export default function App() {
  const navItems = ["ABOUT", "EXPERIENCE", "GAMES", "PROJECTS", "STACK", "CONTACT"];
  const [selectedFeature, setSelectedFeature] = useState<null | number>(null);
  const [selectedProject, setSelectedProject] = useState<null | number>(null);
  const [selectedTech, setSelectedTech] = useState<null | { name: string, desc: string }>(null);
  const [lang, setLang] = useState<"EN" | "PT">("EN");
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("open");

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Firestore listener for status
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "portfolio"), (docSnap) => {
      if (docSnap.exists()) {
        setStatus(docSnap.data().status);
      } else {
        // Initialize if doesn't exist (will only work if rules allow)
        console.log("Settings document not found.");
      }
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === "pietromedinalopes@gmail.com";

  const toggleStatus = async () => {
    if (!isAdmin) return;
    const newStatus = status === "open" ? "closed" : "open";
    try {
      await setDoc(doc(db, "settings", "portfolio"), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAuth = async () => {
    if (user) {
      await logout();
    } else {
      try {
        await login();
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  const translations = {
    EN: {
      nav: ["ABOUT", "EXPERIENCE", "GAMES", "PROJECTS", "STACK", "CONTACT"],
      hero: {
        role: "UI Maker · Builder · Intermediate Scripter",
        desc: "Crafting immersive interfaces and detailed environments. Intermediate scripter focused on functional gameplay systems and clean user experiences.",
        scroll: "SCROLL"
      },
      stats: {
        dev: "DEVELOPMENT",
        visits: "TOTAL GAME VISITS",
        members: "COMMUNITY MEMBERS"
      },
      about: {
        title: "About",
        me: "me",
        p1: "I am a creative developer with a focus on UI design and environmental building. With intermediate scripting skills, I bring static worlds to life through functional code and intuitive interfaces.",
        p2: "My work bridges the gap between aesthetic design and technical implementation. Whether it's building complex maps or designing seamless UIs, I ensure every detail contributes to a cohesive player experience.",
        meta: {
          location: "LOCATION",
          languages: "LANGUAGES",
          email: "EMAIL",
          github: "GITHUB",
          twitter: "TWITTER",
          status: "STATUS",
          open: "Open to work"
        }
      },
      experience: {
        title: "Experience",
        items: [
          {
            role: "Builder",
            company: "Environmental Design",
            period: "2019 - 2026",
            desc: "Specialized in large-scale environmental building and map composition. Focused on creating immersive worlds with high attention to detail and atmospheric lighting."
          },
          {
            role: "UI Designer",
            company: "Interface Architecture",
            period: "2020 - 2026",
            desc: "Crafting modern and intuitive user interfaces. Expert in layout design, visual hierarchy, and creating seamless user experiences for various platforms."
          },
          {
            role: "Intermediate Scripter",
            company: "System Development",
            period: "2025 - 2026",
            desc: "Implementing functional gameplay systems and modular code. Focused on interaction systems, data management, and enhancing gameplay through Luau scripting."
          }
        ]
      },
      games: {
        title: "Games",
        subtitle: "Portfolio",
        playing: "playing",
        visits: "visits",
        group: "Community",
        play: "PLAY GAME",
        items: [
          {
            name: "Exercito do Alves [Em Desenvolvimento]",
            creator: "Nguyenchienmn6ay",
            tag: "ROLEPLAY",
            desc: "Become an agent of the Brazilian Army and fight crime, honor your country, order and progress!",
            active: "0",
            visits: "1.2M",
            members: "10k",
            url: "",
            color: "from-red-500/20"
          },
          {
            name: "MetaVerse Champions Club",
            creator: "Metaverse Events",
            tag: "ENTERTAINMENT",
            desc: "Metaverse Champions offers a chance to show everyone on Roblox that you have what it takes.",
            active: "22",
            visits: "121M+",
            members: "70",
            url: "https://www.roblox.com/pt/games/6674394294/Metaverse-Champions-Hub",
            color: "from-blue-500/20"
          },
          {
            name: "Coming Soon [NEW]",
            creator: "malevola",
            tag: "ENTERTAINMENT",
            desc: "Roblox Friends community [Banned!]",
            active: "0",
            visits: "17k+",
            members: "N/A",
            url: "https://www.roblox.com/pt/request-error?code=404",
            color: "from-purple-500/20"
          },
          {
            name: "FNAF: Eternal Nights 🍕",
            creator: "Cob - Studios",
            tag: "HORROR",
            desc: "🇧🇷 Um jogo feito com orgulho por desenvolvedores brasileiros! 🇧🇷.",
            active: "5k - 10k",
            visits: "204M+",
            members: "N/A",
            url: "https://www.roblox.com/pt/games/11392373641/FNAF-Eternal-Nights",
            color: "from-sky-500/20"
          }
        ]
      },
      projects: {
        title: "Projects",
        subtitle: "Technical Builds",
        materials: "Materials Used",
        build: "Build Info",
        items: [
          {
            name: "Atacadão",
            image: "/atacadao.png",
            desc: "Supermarket with automatic protection doors, store systems, and alarms.",
            materials: ["Part/Texture", "Images/Decal", "Realistic Graphics", "Luau Scripting"],
            build: "Features robbery and job systems, automatic security doors, and advanced store management logic."
          },
          {
            name: "Posto Ipiranga",
            image: "https://picsum.photos/seed/gas/800/600",
            desc: "Gas station with refueling system, dealership, store, alarm system, and automatic lighting.",
            materials: ["Part/Texture", "Images/Decal", "Realistic Graphics", "NPCs", "Scripts/Plugins"],
            build: "Includes refueling logic, car dealership system, automated lighting, and station management scripts."
          },
          {
            name: "Predio Central",
            image: "https://picsum.photos/seed/building/800/600",
            desc: "Central building with elevator system, alarm, automatic doors, and realistic glass.",
            materials: ["Part/Texture", "Images/Decal", "Realistic Graphics", "NPCs", "Scripts", "Realistic Glass"],
            build: "Features a functional elevator system, advanced security alarms, and detailed environmental ambientation."
          }
        ]
      },
      stack: {
        title: "Technology Set",
        subtitle: "Stack",
        categories: [
          {
            name: "LANGUAGES",
            items: [
              { name: "Lua / Luau", desc: "Primary language for Roblox development, used for game logic and systems." },
              { name: "Python", desc: "Versatile language used for automation and backend tools (Basic to Intermediate)." }
            ]
          },
          {
            name: "ROBLOX DEVELOPMENT",
            items: [
              { name: "Luau Scripting", desc: "Expertise in writing functional and optimized game logic." },
              { name: "Game Systems", desc: "Creating core mechanics like shops, inventories, and combat." },
              { name: "RemoteEvents", desc: "Handling client-server communication effectively." },
              { name: "RemoteFunctions", desc: "Synchronous communication between client and server." },
              { name: "Module Organization", desc: "Structuring code using ModuleScripts for scalability." }
            ]
          },
          {
            name: "UI / INTERFACE",
            items: [
              { name: "UI Creation", desc: "Designing and implementing intuitive user interfaces." },
              { name: "HUD Design", desc: "Creating clear and functional heads-up displays for players." },
              { name: "Menu Systems", desc: "Building interactive menus and navigation flows." }
            ]
          },
          {
            name: "BUILDER / CONSTRUCTION",
            items: [
              { name: "Map Construction", desc: "Building detailed environments and large-scale maps." },
              { name: "Environment Design", desc: "Focusing on lighting, atmosphere, and composition." },
              { name: "Asset Organization", desc: "Efficiently managing models and parts within Roblox Studio." }
            ]
          },
          {
            name: "TOOLS",
            items: [
              { name: "Roblox Studio", desc: "Primary development environment for all Roblox projects." }
            ]
          }
        ]
      },
      contact: {
        title: "Start a",
        titleAccent: "Project",
        subtitle: "Contact",
        desc: "I'm currently taking on new commissions. Let's build something exceptional together.",
        email: "mDnH4rds@proton.me",
        payment: "Pix · Robux · Promotion · Recognition",
        copyright: "© 2025 mDnH4rd",
        status: "Available",
        location: "Brazil",
        timezone: "GMT-3"
      },
      features: [
        {
          title: "UI Design",
          description: "Creating intuitive and visually stunning user interfaces.",
          details: "Specialized in crafting clean, modern UIs that enhance player engagement. Focused on usability, layout, and aesthetic consistency across all platforms."
        },
        {
          title: "Building",
          description: "Constructing detailed and immersive environments.",
          details: "Expertise in environmental design and map building. From small assets to large-scale worlds, I focus on lighting, composition, and atmospheric storytelling."
        },
        {
          title: "Scripting",
          description: "Implementing functional systems and gameplay logic.",
          details: "Intermediate scripter with experience in Luau and game logic. Building modular systems for interaction, data management, and dynamic gameplay elements."
        }
      ],
      modal: {
        close: "CLOSE"
      }
    },
    PT: {
      nav: ["SOBRE", "EXPERIÊNCIA", "JOGOS", "PROJETOS", "STACK", "CONTATO"],
      hero: {
        role: "UI Maker · Builder · Scripter Intermediário",
        desc: "Criando interfaces imersivas e ambientes detalhados. Scripter intermediário focado em sistemas de jogabilidade funcionais e experiências de usuário limpas.",
        scroll: "ROLAR"
      },
      stats: {
        dev: "DESENVOLVIMENTO",
        visits: "TOTAL DE VISITAS EM JOGOS",
        members: "MEMBROS DA COMUNIDADE"
      },
      about: {
        title: "Sobre",
        me: "mim",
        p1: "Sou um desenvolvedor criativo com foco em design de UI e construção de ambientes. Com habilidades intermediárias de scripting, dou vida a mundos estáticos através de código funcional e interfaces intuitivas.",
        p2: "Meu trabalho une o design estético à implementação técnica. Seja construindo mapas complexos ou projetando UIs fluidas, garanto que cada detalhe contribua para uma experiência coesa do jogador.",
        meta: {
          location: "LOCALIZAÇÃO",
          languages: "IDIOMAS",
          email: "E-MAIL",
          github: "GITHUB",
          twitter: "TWITTER",
          status: "STATUS",
          open: "Disponível para trabalho"
        }
      },
      experience: {
        title: "Experiência",
        items: [
          {
            role: "Builder",
            company: "Design Ambiental",
            period: "2019 - 2026",
            desc: "Especializado em construção de ambientes em larga escala e composição de mapas. Focado em criar mundos imersivos com alta atenção aos detalhes e iluminação atmosférica."
          },
          {
            role: "Designer de UI",
            company: "Arquitetura de Interface",
            period: "2020 - 2026",
            desc: "Criando interfaces de usuário modernas e intuitivas. Especialista em design de layout, hierarquia visual e criação de experiências de usuário fluidas para diversas plataformas."
          },
          {
            role: "Scripter Intermediário",
            company: "Desenvolvimento de Sistemas",
            period: "2025 - 2026",
            desc: "Implementando sistemas de jogabilidade funcionais e código modular. Focado em sistemas de interação, gerenciamento de dados e melhoria da jogabilidade através de scripting em Luau."
          }
        ]
      },
      games: {
        title: "Jogos",
        subtitle: "Portfólio",
        playing: "jogando",
        visits: "visitas",
        group: "Comunidade",
        play: "JOGAR AGORA",
        items: [
          {
            name: "Massacre",
            creator: "ABYSMAL COVENANT",
            tag: "TERROR",
            desc: "Terror assimétrico de esconde-esconde. Liderança de toda a arquitetura backend — sharding de DataStore e combate autoritativo.",
            active: "1.2k-2.2k",
            visits: "2.5M+",
            members: "177k",
            url: "https://www.roblox.com/games/16404764044/MASSACRE-HORROR",
            color: "from-red-500/20"
          },
          {
            name: "Animatronic Nights",
            creator: "PLAYBOX!",
            tag: "SOBREVIVÊNCIA",
            desc: "Sobrevivência de terror — caçe ou sobreviva como animatrônicos. Contribuição em infraestrutura de servidor escalável.",
            active: "2k-4k",
            visits: "25M+",
            members: "818k",
            url: "https://www.roblox.com/games/12345678",
            color: "from-blue-500/20"
          },
          {
            name: "Last Letter",
            creator: "MMIIGAMES",
            tag: "COMPETITIVO",
            desc: "Jogo de palavras competitivo — cada última letra conta. Desenvolvimento de sistemas centrais de jogabilidade.",
            active: "5k-7k",
            visits: "89M+",
            members: "N/A",
            url: "https://www.roblox.com/games/87654321",
            color: "from-purple-500/20"
          },
          {
            name: "Run For Brainrots",
            creator: "INDEPENDENT",
            tag: "MULTIPLAYER",
            desc: "Runner multiplayer de ritmo acelerado. Engenharia de máquinas de estado escaláveis e replicação de movimento.",
            active: "12k-60k",
            visits: "250M+",
            members: "N/A",
            url: "https://www.roblox.com/games/11223344",
            color: "from-sky-500/20"
          }
        ]
      },
      projects: {
        subtitle: "Construções Técnicas",
        materials: "Materiais Usados",
        build: "Informações da Build",
        items: [
          {
            name: "Atacadão",
            image: "/atacadao.png",
            desc: "Mercado com portas de proteção automática, sistemas de loja e alarmes.",
            materials: ["Part/Textura", "Imagens/Decal", "Gráficos Realistas", "Luau Scripting"],
            build: "Inclui sistemas de assalto e trabalho, portas de segurança automáticas e lógica avançada de gerenciamento de loja."
          },
          {
            name: "Posto Ipiranga",
            image: "https://picsum.photos/seed/gas/800/600",
            desc: "Posto de gasolina com sistema de abastecimento, concessionária, loja, sistema de alarme e iluminação automática.",
            materials: ["Part/Textura", "Imagens/Decal", "Gráficos Realistas", "NPCs", "Scripts/Plugins"],
            build: "Inclui lógica de abastecimento, sistema de concessionária, iluminação automatizada e scripts de gerenciamento do posto."
          },
          {
            name: "Prédio Central",
            image: "https://picsum.photos/seed/building/800/600",
            desc: "Prédio central com sistema de elevador, alarme, portas automáticas e vidro realista.",
            materials: ["Part/Textura", "Imagens/Decal", "Gráficos/Ambientação", "NPCs", "Scripts", "Vidro Realista"],
            build: "Inclui sistema de elevador funcional, alarmes de segurança avançados e ambientação detalhada."
          }
        ]
      },
      stack: {
        title: "Conjunto de Tecnologias",
        subtitle: "Stack",
        categories: [
          {
            name: "LÍNGUAS",
            items: [
              { name: "Lua / Luau", desc: "Linguagem principal para desenvolvimento Roblox, usada para lógica de jogo e sistemas." },
              { name: "Python", desc: "Linguagem versátil usada para automação e ferramentas de backend (Básico a Intermediário)." }
            ]
          },
          {
            name: "DESENVOLVIMENTO ROBLOX",
            items: [
              { name: "Scripting em Luau", desc: "Experiência em escrever lógica de jogo funcional e otimizada." },
              { name: "Sistemas de Jogo", desc: "Criando mecânicas centrais como lojas, inventários e combate." },
              { name: "RemoteEvents", desc: "Lidando com a comunicação cliente-servidor de forma eficaz." },
              { name: "RemoteFunctions", desc: "Comunicação síncrona entre cliente e servidor." },
              { name: "Organização de Módulos", desc: "Estruturando código usando ModuleScripts para escalabilidade." }
            ]
          },
          {
            name: "UI / INTERFACE",
            items: [
              { name: "Criação de UI", desc: "Projetando e implementando interfaces de usuário intuitivas." },
              { name: "Design de HUD", desc: "Criando displays claros e funcionais para os jogadores." },
              { name: "Sistemas de Menu", desc: "Construindo menus interativos e fluxos de navegação." }
            ]
          },
          {
            name: "BUILDER / CONSTRUÇÃO",
            items: [
              { name: "Construção de Mapas", desc: "Construindo ambientes detalhados e mapas em larga escala." },
              { name: "Design de Ambientes", desc: "Focando em iluminação, atmosfera e composição." },
              { name: "Organização de Assets", desc: "Gerenciando modelos e partes de forma eficiente no Roblox Studio." }
            ]
          },
          {
            name: "FERRAMENTAS",
            items: [
              { name: "Roblox Studio", desc: "Ambiente de desenvolvimento principal para todos os projetos Roblox." }
            ]
          }
        ]
      },
      contact: {
        title: "Iniciar um",
        titleAccent: "Projeto",
        subtitle: "Contato",
        desc: "Estou aceitando novas encomendas. Vamos construir algo excepcional juntos.",
        email: "mDnH4rds@proton.me",
        payment: "Pix · Robux · Divulgação · Reconhecimento",
        copyright: "© 2025 mDnH4rd",
        status: "Disponível",
        location: "Brasil",
        timezone: "GMT-3"
      },
      features: [
        {
          title: "Design de UI",
          description: "Criando interfaces de usuário intuitivas e visualmente impressionantes.",
          details: "Especializado em criar UIs limpas e modernas que aumentam o engajamento do jogador. Focado em usabilidade, layout e consistência estética em todas as plataformas."
        },
        {
          title: "Construção (Building)",
          description: "Construindo ambientes detalhados e imersivos.",
          details: "Experiência em design ambiental e construção de mapas. De pequenos assets a mundos em larga escala, foco em iluminação, composição e narrativa atmosférica."
        },
        {
          title: "Scripting",
          description: "Implementando sistemas funcionais e lógica de jogo.",
          details: "Scripter intermediário com experiência em Luau e lógica de jogo. Construindo sistemas modulares para interação, gerenciamento de dados e elementos dinâmicos de jogabilidade."
        }
      ],
      modal: {
        close: "FECHAR"
      }
    }
  };

  const t = translations[lang];

  const features = [
    {
      id: 1,
      icon: <Layout className="w-6 h-6" />,
      title: t.features[0].title,
      description: t.features[0].description,
      details: t.features[0].details
    },
    {
      id: 2,
      icon: <Hammer className="w-6 h-6" />,
      title: t.features[1].title,
      description: t.features[1].description,
      details: t.features[1].details
    },
    {
      id: 3,
      icon: <Code className="w-6 h-6" />,
      title: t.features[2].title,
      description: t.features[2].description,
      details: t.features[2].details
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-white selection:text-black overflow-x-hidden bg-[#050505]`}>
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-20" />
      <div className="fixed inset-0 scanline pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleAuth}
            className="text-xl font-black tracking-tighter text-white cursor-pointer select-none active:scale-95 transition-transform flex items-center gap-2 group"
            title={user ? "Logout" : "Login"}
          >
            mDnH4rd.
            {isAdmin && (
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 text-[8px] font-bold tracking-widest text-white/30"
          >
            <button 
              onClick={() => setLang("EN")}
              className={`hover:text-white transition-colors ${lang === "EN" ? "text-white" : ""}`}
            >
              EN
            </button>
            <span className="opacity-50">/</span>
            <button 
              onClick={() => setLang("PT")}
              className={`hover:text-white transition-colors ${lang === "PT" ? "text-white" : ""}`}
            >
              PT
            </button>
          </motion.div>
        </div>
        <div className="hidden md:flex gap-8">
          {t.nav.map((item, index) => (
            <motion.a
              key={item}
              href={`#${translations.EN.nav[index].toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-[10px] font-bold tracking-[0.2em] text-white/50 hover:text-white transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative h-screen flex flex-col justify-center px-8 md:px-24 overflow-hidden pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-white/30" />
              <span className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase">
                {t.hero.role}
              </span>
            </div>

            <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter font-display mb-6 leading-[0.8] text-white">
              mDnH4rd<span className="text-white/20">.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl font-light mb-12 border-l-2 border-white/10 pl-6">
              {t.hero.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
              <StatItem value="12" suffix="yr" label={t.stats.dev} />
              <StatItem value="350" suffix="M+" label={t.stats.visits} />
              <StatItem value="2" suffix="M+" label={t.stats.members} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="aspect-square w-full max-md mx-auto relative">
              <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[10rem] font-black text-white/5 font-display select-none">
                  01
                </div>
              </div>
              {/* Technical markers */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-[10px] font-mono text-white/20 tracking-widest mb-4">
                LAT: -23.5505 / LONG: -46.6333
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-16 left-8 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white/20"
          >
            <Terminal className="w-4 h-4" />
          </motion.div>
          
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="rotate-90 origin-left translate-x-3 group"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-white/20 uppercase group-hover:text-white transition-colors cursor-pointer">
              {t.hero.scroll}
            </span>
          </button>
        </motion.div>
      </main>

      {/* About Me Section */}
      <section id="about" className="py-24 px-8 md:px-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] w-8 bg-white/30" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">001</span>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 mb-24">
            {/* Left Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-12 font-display flex items-baseline gap-4">
                {t.about.title} <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>{t.about.me}</span>
              </h2>
              
              <div className="space-y-8 text-lg md:text-xl text-white/60 leading-relaxed font-light">
                <p>
                  {t.about.p1}
                </p>
                <p>
                  {t.about.p2}
                </p>
              </div>
            </motion.div>

            {/* Right Column: Metadata */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-end"
            >
              <div className="space-y-6 border-t border-white/5 pt-8">
                <MetadataItem label={t.about.meta.location} value="Brazil" />
                <MetadataItem label={t.about.meta.languages} value="Portuguese · English" />
                <MetadataItem label={t.about.meta.email} value="mDnH4rds@proton.me" isLink href="mailto:mDnH4rds@proton.me" />
                <MetadataItem label={t.about.meta.github} value="github.com/mDnH4rd" isLink href="https://github.com/mDnH4rd" />
                <MetadataItem label={t.about.meta.twitter} value="@inf0secc" isLink href="https://twitter.com/inf0secc" />
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex justify-between items-center py-3 px-2 -mx-2 group cursor-default hover:bg-white/[0.02] rounded-lg transition-colors"
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase group-hover:text-white/40 transition-colors">{t.about.meta.status}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${status === "open" ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]"}`} />
                    <span className={`text-sm font-medium ${status === "open" ? "text-sky-400" : "text-red-400"}`}>
                      {status === "open" ? (lang === "EN" ? "Open to work" : "Disponível") : (lang === "EN" ? "Closed to work" : "Indisponível")}
                    </span>
                    </div>
                    
                    {isAdmin && (
                      <button 
                        onClick={toggleStatus}
                        className="text-[8px] font-black tracking-widest bg-white text-black px-2 py-1 rounded hover:bg-zinc-200 transition-colors uppercase"
                      >
                        Toggle
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, y: -2 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedFeature(idx)}
                className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.04] hover:border-white/20 transition-all"
              >
                <div className="p-3 bg-white/5 rounded-xl text-white/80 w-fit mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-white text-xl font-bold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-center items-center text-center">
              <div className="text-[10px] font-mono text-white/20 tracking-[0.5em] uppercase mb-4">System Status</div>
              <div className="text-2xl font-black text-white tracking-tighter">OPERATIONAL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-8 md:px-24 border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] w-8 bg-white/30" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">002</span>
          </div>

          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Subtle Gradient Overlay */}
            <div className="absolute -left-8 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-16 font-display">
              {t.experience.title}<span className="text-white/20">.</span>
            </h2>

            <div className="space-y-12 relative z-0">
              {t.experience.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.2 + 0.5, duration: 0.8 }}
                  className="group relative pl-8 border-l border-white/10 hover:border-white/30 transition-colors"
                >
                  <div className="absolute top-0 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                  
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {item.role}
                    </h3>
                    <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                      {item.period}
                    </span>
                  </div>
                  
                  <div className="text-sm font-bold tracking-widest text-white/40 mb-4 uppercase">
                    {item.company}
                  </div>
                  
                  <p className="text-lg text-white/50 leading-relaxed max-w-3xl font-light">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-24 px-8 md:px-24 border-t border-white/5 bg-[#050505] relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute top-0 right-0 text-[20rem] font-black text-white/[0.01] font-display select-none pointer-events-none translate-x-1/4 -translate-y-1/4">
          GAMES
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[1px] w-12 bg-white/20" />
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white font-display">
              {t.games.title}<span className="text-white/20">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[700px]">
            {/* Game 1: Large Featured */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 group relative bg-zinc-900/40 border border-white/5 rounded-[1.5rem] overflow-hidden p-8 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${t.games.items[0].color} to-transparent opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-widest text-white/40 uppercase">
                    {t.games.items[0].tag}
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-white/20 uppercase">
                    {t.games.items[0].creator}
                  </span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                  {t.games.items[0].name}
                </h3>
                <p className="text-base text-white/40 leading-relaxed max-w-md font-light">
                  {t.games.items[0].desc}
                </p>
              </div>

              <div className="relative flex items-end justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-sky-400 font-mono tracking-tight">{t.games.items[0].active}</span>
                      <span className="text-[9px] font-bold text-white/40 font-mono">{t.games.playing}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-white font-mono tracking-tight">{t.games.items[0].visits}</span>
                      <span className="text-[9px] font-bold text-white/40 font-mono">{t.games.visits}</span>
                    </div>
                  </div>
                </div>
                <motion.a
                  href={t.games.items[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            {/* Game 2: Wide */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 md:row-span-1 group relative bg-zinc-900/40 border border-white/5 rounded-[1.5rem] overflow-hidden p-8 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${t.games.items[1].color} to-transparent opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-widest text-white/40 uppercase">
                    {t.games.items[1].tag}
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tighter">
                    {t.games.items[1].name}
                  </h3>
                </div>
                <p className="text-xs text-white/40 leading-relaxed max-w-sm font-light">
                  {t.games.items[1].desc}
                </p>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-sky-500" />
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-sky-400 font-mono">{t.games.items[1].active}</span>
                      <span className="text-[8px] font-bold text-white/40 font-mono">{t.games.playing}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-white font-mono">{t.games.items[1].visits}</span>
                      <span className="text-[8px] font-bold text-white/40 font-mono">{t.games.visits}</span>
                    </div>
                  </div>
                </div>
                <a href={t.games.items[1].url} target="_blank" rel="noopener noreferrer" className="text-white/20 group-hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Game 3: Small */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 md:row-span-1 group relative bg-zinc-900/40 border border-white/5 rounded-[1.5rem] overflow-hidden p-6 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div className="relative">
                <h3 className="text-xl font-black text-white tracking-tighter mb-1">
                  {t.games.items[2].name}
                </h3>
                <span className="text-[7px] font-black tracking-widest text-white/20 uppercase">
                  {t.games.items[2].tag}
                </span>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-1 rounded-full bg-sky-500" />
                  <span className="text-lg font-black text-sky-400 font-mono">{t.games.items[2].active}</span>
                  <span className="text-[7px] font-bold text-white/40 font-mono">{t.games.playing}</span>
                </div>
                <a href={t.games.items[2].url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black tracking-widest text-white/40 group-hover:text-white transition-colors uppercase">
                  {t.games.play} →
                </a>
              </div>
            </motion.div>

            {/* Game 4: Small */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-1 md:row-span-1 group relative bg-zinc-900/40 border border-white/5 rounded-[1.5rem] overflow-hidden p-6 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div className="relative">
                <h3 className="text-xl font-black text-white tracking-tighter mb-1">
                  {t.games.items[3].name}
                </h3>
                <span className="text-[7px] font-black tracking-widest text-white/20 uppercase">
                  {t.games.items[3].tag}
                </span>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-1 rounded-full bg-sky-500" />
                  <span className="text-lg font-black text-sky-400 font-mono">{t.games.items[3].active}</span>
                  <span className="text-[7px] font-bold text-white/40 font-mono">{t.games.playing}</span>
                </div>
                <a href={t.games.items[3].url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black tracking-widest text-white/40 group-hover:text-white transition-colors uppercase">
                  {t.games.play} →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-8 md:px-24 border-t border-white/5 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[1px] w-12 bg-white/20" />
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white font-display">
              {t.projects.title}<span className="text-white/20">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.projects.items.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedProject(idx)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 mb-6 group-hover:border-white/20 transition-all">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2 group-hover:text-sky-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-light line-clamp-2">
                  {project.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section id="stack" className="py-24 px-8 md:px-24 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[1px] w-8 bg-white/30" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">004</span>
          </div>

          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-20 font-display">
            {t.stack.title.split(' ')[0]} <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>{t.stack.title.split(' ').slice(1).join(' ')}</span>
          </h2>

          <div className="space-y-16">
            {t.stack.categories.map((category, catIdx) => (
              <div key={catIdx} className="space-y-8">
                <div className="flex items-center gap-6">
                  <h3 className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase shrink-0">
                    {category.name}
                  </h3>
                  <div className="h-[1px] w-full bg-white/5" />
                </div>

                <div className="flex flex-wrap gap-3">
                  {category.items.map((item, itemIdx) => (
                    <motion.button
                      key={itemIdx}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTech(item)}
                      className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-full text-sm font-medium text-white/50 hover:text-white transition-all"
                    >
                      {item.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-8 md:px-24 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main CTA Card */}
            <div className="md:col-span-2 p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">{t.contact.status}</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white font-display leading-[0.85] mb-8">
                  {t.contact.title} <br />
                  <span className="text-sky-400">{t.contact.titleAccent}</span>
                </h2>
              </div>
              <p className="text-xl text-white/40 leading-relaxed font-light max-w-md">
                {t.contact.desc}
              </p>
            </div>

            {/* Email Card */}
            <motion.a
              href={`mailto:${t.contact.email}`}
              whileHover={{ scale: 1.02 }}
              className="p-10 bg-sky-400 rounded-[3rem] flex flex-col justify-between group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black tracking-widest text-black/40 uppercase mb-2">Direct Mail</div>
                <div className="text-2xl text-black font-black tracking-tight break-all leading-tight">
                  {t.contact.email}
                </div>
              </div>
            </motion.a>

            {/* Social Cards */}
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col justify-between group"
            >
              <Terminal className="w-8 h-8 text-white/20 group-hover:text-white transition-colors" />
              <div>
                <div className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-1">Github</div>
                <div className="text-xl text-white font-bold">@mDnH4rd</div>
              </div>
            </motion.a>

            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col justify-between group"
            >
              <X className="w-8 h-8 text-white/20 group-hover:text-white transition-colors" />
              <div>
                <div className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-1">Twitter</div>
                <div className="text-xl text-white font-bold">@mDnH4rd</div>
              </div>
            </motion.a>

            {/* Info Card */}
            <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="text-[10px] font-black tracking-widest text-white/20 uppercase">Location</div>
                <div className="text-sm text-white/60 font-medium">{t.contact.location}</div>
              </div>
              <div className="mt-8">
                <div className="text-4xl font-black text-white tracking-tighter mb-1">
                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}
                </div>
                <div className="text-[10px] font-mono tracking-widest text-white/20 uppercase">{t.contact.timezone}</div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="md:col-span-3 p-10 bg-white/[0.01] border border-white/5 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-8">
                <div className="text-[10px] font-black tracking-widest text-white/20 uppercase">Payment</div>
                <div className="text-sm text-white/40 font-medium tracking-wide">
                  {t.contact.payment}
                </div>
              </div>
              <div className="text-[10px] font-mono tracking-widest text-white/20 uppercase">
                {t.contact.copyright}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal / Overlay */}
      <AnimatePresence>
        {selectedFeature !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <button 
                onClick={() => setSelectedFeature(null)}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-4 bg-white/5 rounded-2xl text-white w-fit mb-8">
                {features[selectedFeature].icon}
              </div>

              <h2 className="text-3xl font-black tracking-tighter text-white mb-4 font-display">
                {features[selectedFeature].title}
              </h2>
              
              <p className="text-white/60 leading-relaxed text-lg">
                {features[selectedFeature].details}
              </p>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="px-8 py-3 bg-white text-black text-xs font-bold tracking-[0.2em] rounded-full hover:bg-white/90 transition-colors"
                >
                  {t.modal.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="aspect-video w-full relative">
                <img 
                  src={t.projects.items[selectedProject].image} 
                  alt={t.projects.items[selectedProject].name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 md:p-12">
                <h2 className="text-4xl font-black tracking-tighter text-white mb-6 font-display">
                  {t.projects.items[selectedProject].name}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-[10px] font-black tracking-widest text-sky-400 uppercase mb-4">
                      {t.projects.materials}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {t.projects.items[selectedProject].materials.map((mat, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60 font-medium">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-black tracking-widest text-sky-400 uppercase mb-4">
                      {t.projects.build}
                    </h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light">
                      {t.projects.items[selectedProject].build}
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-10 py-4 bg-white text-black text-[10px] font-black tracking-[0.2em] rounded-full hover:bg-zinc-200 transition-colors uppercase"
                  >
                    {t.modal.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tech Modal */}
      <AnimatePresence>
        {selectedTech !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTech(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
              
              <button 
                onClick={() => setSelectedTech(null)}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-4 bg-sky-400/10 rounded-2xl text-sky-400 w-fit mb-8">
                <Code className="w-6 h-6" />
              </div>

              <h2 className="text-3xl font-black tracking-tighter text-white mb-4 font-display">
                {selectedTech.name}
              </h2>
              
              <p className="text-white/60 leading-relaxed text-lg">
                {selectedTech.desc}
              </p>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setSelectedTech(null)}
                  className="px-8 py-3 bg-white text-black text-xs font-bold tracking-[0.2em] rounded-full hover:bg-white/90 transition-colors"
                >
                  {t.modal.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetadataItem({ label, value, isLink, href }: { label: string; value: string; isLink?: boolean; href?: string }) {
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className="flex justify-between items-center py-3 px-2 -mx-2 border-b border-white/5 last:border-0 group cursor-default hover:bg-white/[0.02] rounded-lg transition-colors"
    >
      <span className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase group-hover:text-white/40 transition-colors">{label}</span>
      {isLink ? (
        <a 
          href={href} 
          target={href?.startsWith('http') ? "_blank" : undefined}
          rel={href?.startsWith('http') ? "noopener noreferrer" : undefined}
          className="text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-white/20 transition-colors"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm text-white/80 group-hover:text-white transition-colors">{value}</span>
      )}
    </motion.div>
  );
}

function StatItem({ value, suffix, label }: { value: string; suffix: string; label: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(count, numericValue, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [value, count]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      setDisplayValue(latest.toString());
    });
  }, [rounded]);

  return (
    <div className="flex gap-4 items-start group min-w-0">
      <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent group-hover:from-white transition-all duration-500 shrink-0" />
      <div className="flex flex-col min-w-0">
        <div className="flex items-baseline shrink-0">
          <motion.span className="text-3xl md:text-4xl font-black tracking-[-0.05em] font-display bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent">
            {displayValue}
          </motion.span>
          <span className="text-sm md:text-lg font-bold text-white/40 ml-1">{suffix}</span>
        </div>
        <span className="text-[8px] md:text-[9px] font-mono tracking-[0.1em] text-white/30 mt-1 group-hover:text-white/50 transition-colors leading-tight uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
