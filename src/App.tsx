import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Sparkles,
  ChevronRight,
  Box,
  X,
  Phone,
  MessageCircle,
  Shield,
  MapPin,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import Navbar from "./components/Navbar";
import PlaceholderImage from "./components/PlaceholderImage";
import AIChatWidget from "./components/AIChatWidget";
import { submitLead } from "./utils/api";

const colors = {
  bg: "#1c1c1e",
  surface: "#26262a",
  border: "#3a3a40",
  accent: "#6b8f7a",
  accentHover: "#7da08c",
  text: "#e4e4e6",
  muted: "#8a8a94",
} as const;

const easeOut = [0.25, 1, 0.5, 1] as const;

interface CatalogItem {
  id: string;
  title: string;
  size: "20 pés" | "40 pés" | "40 pés HC";
  category: "Almoxarifado" | "Escritório" | "Sanitário" | "Especial";
  specs: { peso: string; chapa: string; dimensoes: string };
  basePrice: number;
  description: string;
  imageUrl: string;
}

const CONTAINER_IMAGE =
  "https://images.unsplash.com/photo-1693515185000-ee4c3786ecea?q=80&w=800&auto=format&fit=crop";
const OFFICE_IMAGE =
  "https://images.unsplash.com/photo-1745566589290-d678de04f990?fm=jpg&q=80&w=800&auto=format&fit=crop";
const MODULAR_IMAGE =
  "https://images.unsplash.com/photo-1631215320889-7cf5eb3224f8?fm=jpg&q=80&w=800&auto=format&fit=crop";
const AVATAR_FEMALE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80";
const AVATAR_MALE =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80";

const PRODUCT_CATALOG: CatalogItem[] = [
  {
    id: "c1", title: "Container Almoxarifado / Depósito Standard", size: "20 pés", category: "Almoxarifado",
    specs: { peso: "2.250 kg", chapa: "Aço Corten Naval 2.5mm", dimensoes: "6.05m x 2.44m x 2.59m" },
    basePrice: 16500, description: "Ideal para armazenamento seguro de ferramentas, insumos industriais e maquinários em canteiros de obras ou pátios logísticos.",
    imageUrl: CONTAINER_IMAGE,
  },
  {
    id: "c2", title: "Container Escritório Completo com Banheiro", size: "40 pés HC", category: "Escritório",
    specs: { peso: "3.800 kg", chapa: "Painel Isotérmico PU / EPS", dimensoes: "12.19m x 2.44m x 2.89m" },
    basePrice: 38500, description: "Módulo administrativo pronto com instalações elétricas embutidas, revestimento térmico, janelas de alumínio e lavatório completo.",
    imageUrl: OFFICE_IMAGE,
  },
  {
    id: "c3", title: "Módulo Sanitário Coletivo Industrial", size: "20 pés", category: "Sanitário",
    specs: { peso: "2.400 kg", chapa: "Piso Antiderrapante Lavável", dimensoes: "6.05m x 2.44m x 2.59m" },
    basePrice: 24000, description: "Configurado com divisórias privativas, vasos sanitários revestidos, mictórios e pias de alta resistência para alojamentos.",
    imageUrl: CONTAINER_IMAGE,
  },
  {
    id: "c4", title: "Container Especial 40 pés HC Isolado", size: "40 pés HC", category: "Especial",
    specs: { peso: "4.200 kg", chapa: "Aço Corten + Revestimento Isotérmico", dimensoes: "12.19m x 2.44m x 2.89m" },
    basePrice: 45000, description: "Container para aplicações especiais com isolamento térmico completo, estrutura reforçada e preparação para climatização.",
    imageUrl: MODULAR_IMAGE,
  },
];

const FAQ_ITEMS = [
  { q: "Quanto tempo leva a fabricação e entrega?", a: "O prazo médio de fabricação é de 15 a 25 dias úteis, dependendo do nível de customização. Containers brutos (sem modificações) podem ser entregues em até 10 dias úteis." },
  { q: "Vocês entregam em todo o Brasil?", a: "Sim. Atendemos todo o território nacional com logística própria. O frete é calculado individualmente com base no CEP de destino e tipo de container." },
  { q: "Qual a garantia dos containers Delivery Container?", a: "Oferecemos garantia estrutural de 5 anos contra oxidação perfurante e defeitos de fabricação. Revestimentos e instalações hidráulicas/elétricas possuem garantia de 1 ano." },
  { q: "É possível parcelar a compra?", a: "Sim. Aceitamos parcelamento em até 12x no cartão de crédito, Boleto Bancário à vista com 5% de desconto e condições especiais para pessoa jurídica via BNDES." },
  { q: "O container já vem pronto para uso?", a: "Sim. Containers modificados saem de fábrica com instalações elétricas, hidráulicas e revestimentos prontos para conexão. Containers brutos são entregues conforme especificação." },
];

const TESTIMONIALS = [
  { id: 1, name: "Juliana Ribeiro", location: "Porto Alegre - RS", text: "A entrega do container almoxarifado no canteiro de obras foi perfeita. Estrutura robusta, aço corten legítimo e pintura naval impecável.", rating: 5, houseType: "Almoxarifado 20 Pés", avatarUrl: AVATAR_FEMALE },
  { id: 2, name: "Carlos & Mariana Souza", location: "Gramado - RS", text: "Transformamos o container escritório da Delivery Container em nossa recepção comercial. O isolamento térmico superou as expectativas para o inverno da serra.", rating: 5, houseType: "Escritório 40 Pés", avatarUrl: AVATAR_MALE },
  { id: 3, name: "Ricardo Mendes", location: "Guaíba - RS", text: "Logística milimétrica na entrega com caminhão munck. O container sanitário chegou pronto para conectar na rede hidráulica.", rating: 5, houseType: "Módulo Sanitário", avatarUrl: AVATAR_MALE },
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function App() {
  const [builderSize, setBuilderSize] = useState<"20 pés" | "40 pés" | "40 pés HC">("20 pés");
  const [builderType, setBuilderType] = useState<string>("almoxarifado");
  const [builderIsolamento, setBuilderIsolamento] = useState(true);
  const [builderModificacoes, setBuilderModificacoes] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [quoteData, setQuoteData] = useState({ name: "", email: "", phone: "", cidade: "", mensagem: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const heroRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 120, damping: 30 };
  const badgeOffsetY = useTransform(scrollYProgress, [0, 1], [10, -15]);
  const headingOffsetY = useTransform(scrollYProgress, [0, 1], [30, -40]);
  const imageOffsetY = useTransform(scrollYProgress, [0, 1], [60, -85]);
  const clipPct = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const headingClip = useTransform(clipPct, (v) => `inset(0 0 ${v * 100}% 0)`);

  const badgeY = useSpring(badgeOffsetY, springConfig);
  const headingY = useSpring(headingOffsetY, springConfig);
  const imageY = useSpring(imageOffsetY, springConfig);

  const computedPrice = useMemo(() => {
    let price = builderSize === "20 pés" ? 16500 : builderSize === "40 pés" ? 29000 : 34000;
    if (builderType === "escritorio") price += 15000;
    if (builderType === "sanitario") price += 12000;
    if (builderIsolamento && builderType === "almoxarifado") price += 4500;
    price += builderModificacoes * 1500;
    return price;
  }, [builderSize, builderType, builderIsolamento, builderModificacoes]);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!quoteData.name.trim()) errors.name = "Nome é obrigatório";
    if (!quoteData.email.trim()) errors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(quoteData.email)) errors.email = "E-mail inválido";
    if (!quoteData.phone.trim()) errors.phone = "Telefone é obrigatório";
    else if (quoteData.phone.replace(/\D/g, "").length < 10) errors.phone = "Telefone incompleto";
    if (!quoteData.cidade.trim()) errors.cidade = "Cidade é obrigatória";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [quoteData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmittingLead(true);
    try {
      await submitLead({
        name: quoteData.name, email: quoteData.email, phone: quoteData.phone,
        message: `Tipo ${builderType}, Tamanho ${builderSize}, Isolamento: ${builderIsolamento}. Adicionais: ${builderModificacoes}. Destino: ${quoteData.cidade}.`,
        projectInterest: `Container ${builderSize} - ${builderType}`,
        targetBudget: computedPrice,
      });
      setToast({ message: "Orçamento gerado! Nossa equipe entrará em contato via WhatsApp em até 2 horas.", type: "success" });
      setIsQuoteModalOpen(false);
      setQuoteData({ name: "", email: "", phone: "", cidade: "", mensagem: "" });
      setFormErrors({});
    } catch {
      setToast({ message: "Erro ao processar envio. Tente novamente.", type: "error" });
    } finally {
      setIsSubmittingLead(false);
    }
  }, [builderSize, builderType, builderIsolamento, builderModificacoes, quoteData, computedPrice, validateForm]);

  return (
    <div style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: "Poppins, sans-serif" }}>
      <style>{`
        .hover-scale:hover { opacity: 0.85; transform: scale(1.03); }
        .hover-border:hover { border-color: ${colors.accent}; }
        .focus-ring:focus-visible { outline: 2px solid ${colors.accent}; outline-offset: 2px; }
        .btn-press:active { transform: scale(0.96); }
        .input-glow:focus { border-color: ${colors.accent}; box-shadow: 0 0 0 3px rgba(107,143,122,0.15); }

        @keyframes sect-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @supports (animation-timeline: scroll()) {
          .reveal-section {
            animation: sect-in linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 100%;
          }
          .reveal-item {
            animation: fade-up linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 50%;
          }
          .reveal-item:nth-child(2) { animation-range: entry 5% entry 55%; }
          .reveal-item:nth-child(3) { animation-range: entry 10% entry 60%; }
          .reveal-item:nth-child(4) { animation-range: entry 15% entry 65%; }
        }

        .scroll-track {
          position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 9999;
          pointer-events: none;
        }
        @supports (animation-timeline: scroll()) {
          .scroll-bar {
            height: 100%; background: ${colors.accent};
            animation: progress-grow linear;
            animation-timeline: scroll();
          }
        }
        @keyframes progress-grow {
          from { width: 0%; }
          to { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal-section, .reveal-item {
            animation: none !important;
            opacity: 1 !important; transform: none !important;
          }
        }
      `}</style>

      {/* SCROLL PROGRESS BAR */}
      <div className="scroll-track"><div className="scroll-bar" /></div>

      {/* TOP BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
        style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "5px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: colors.muted }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <MapPin size={12} color={colors.muted} />
          <span>Atendimento Sul do Brasil</span>
          <span style={{ color: colors.border }}>|</span>
          <span>Seg a Sex: 08:00 às 18:00</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: colors.text }}>
          <Phone size={12} color={colors.accent} />
          <span style={{ fontWeight: 700 }}>(51) 99999-9999</span>
        </div>
      </motion.div>

      {/* NAVIGATION */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
        style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "15px 20px", display: "flex", alignItems: "center", gap: "15px", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "auto" }}>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: easeOut }}
            src="/logo.png" alt="Delivery Container"
            style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "10px" }} />
          <div>
            <div style={{ fontFamily: "Track", fontSize: "20px", fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>DELIVERY CONTAINER</div>
            <div style={{ fontSize: "10px", color: colors.muted, letterSpacing: "0.05em" }}>CONTAINERS E MÓDULOS</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", fontSize: "12px" }}>
          <a href="#catalogo" className="hover-scale focus-ring btn-press" style={{ padding: "10px 15px", borderRadius: "10px", transition: "all 0.2s", textDecoration: "none", color: colors.muted }}>Modelos</a>
          <a href="#simulador" className="hover-scale focus-ring btn-press" style={{ padding: "10px 15px", borderRadius: "10px", transition: "all 0.2s", textDecoration: "none", color: colors.muted }}>Simular</a>
          <a href="#depoimentos" className="hover-scale focus-ring btn-press" style={{ padding: "10px 15px", borderRadius: "10px", transition: "all 0.2s", textDecoration: "none", color: colors.muted }}>Quem Comprou</a>
          <a href="#faq" className="hover-scale focus-ring btn-press" style={{ padding: "10px 15px", borderRadius: "10px", transition: "all 0.2s", textDecoration: "none", color: colors.muted }}>FAQ</a>
          <a href="#simulador" className="hover-scale focus-ring btn-press" style={{ backgroundColor: colors.accent, color: colors.text, padding: "10px 20px", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "12px", transition: "all 0.2s" }}>Solicitar Orçamento</a>
        </div>
      </motion.nav>

      {/* SVG FILTER: steel noise texture */}
      <svg width="0" height="0" style={{ position: "absolute", visibility: "hidden" }}>
        <filter id="steel-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>

      {/* HERO */}
      <section ref={heroRef} style={{ padding: "100px 0", borderBottom: `1px solid ${colors.border}`, overflow: "hidden" }}>
        <div style={{ maxWidth: "992px", margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: easeOut }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <motion.div style={!isReduced ? { y: badgeY } : {}}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: colors.surface, border: `1px solid ${colors.border}`, padding: "5px 15px", borderRadius: "10px", fontSize: "11px", color: colors.accent, fontWeight: 700, letterSpacing: "0.05em" }}>
                <Shield size={12} />
                <span>AÇO CORTEN MARÍTIMO HOMOLOGADO</span>
              </div>
            </motion.div>
            <motion.h1 style={{
              fontFamily: "Track", fontSize: "64px", fontWeight: 700, color: colors.text,
              lineHeight: 1.2, margin: 0, textWrap: "balance",
              ...(!isReduced ? { y: headingY, clipPath: headingClip } : {}),
            }}>
              Venda de Containers<br />Prontos e Modificados<br />de Fábrica.
            </motion.h1>
            <p style={{ fontSize: "16px", color: colors.muted, lineHeight: 1.5, maxWidth: "450px" }}>
              A Delivery Container entrega módulos brutos, escritórios ou soluções sanitárias completas prontos para descarregar no seu terreno.
            </p>
            <div style={{ display: "flex", gap: "10px", paddingTop: "10px" }}>
              <a href="#simulador" className="hover-scale focus-ring btn-press" style={{ backgroundColor: colors.accent, color: colors.text, padding: "10px 20px", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em", transition: "all 0.2s" }}>SIMULAR ORÇAMENTO</a>
              <a href="#catalogo" className="hover-scale focus-ring btn-press" style={{ backgroundColor: "transparent", border: `1px solid ${colors.border}`, color: colors.text, padding: "10px 20px", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em", transition: "all 0.2s" }}>VER CATÁLOGO</a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
            style={!isReduced ? { y: imageY, aspectRatio: "1/1", backgroundColor: colors.surface, borderRadius: "10px", overflow: "hidden", border: `1px solid ${colors.border}`, position: "relative" } : { aspectRatio: "1/1", backgroundColor: colors.surface, borderRadius: "10px", overflow: "hidden", border: `1px solid ${colors.border}`, position: "relative" }}>
            <PlaceholderImage className="w-full h-full object-cover" label="hero" />
            {/* Noise overlay */}
            <div style={{ position: "absolute", inset: 0, filter: "url(#steel-noise)", opacity: 0.06, pointerEvents: "none", backgroundColor: "#ffffff", mixBlendMode: "overlay" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${colors.bg}, transparent)`, pointerEvents: "none" }} />
          </motion.div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="reveal-section" style={{ padding: "100px 0", borderBottom: `1px solid ${colors.border}`, scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "992px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ borderBottom: `2px solid ${colors.accent}`, paddingBottom: "15px", marginBottom: "40px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: colors.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>Catálogo</span>
            <h2 style={{ fontFamily: "Track", fontSize: "50px", fontWeight: 700, color: colors.text, margin: "5px 0 0", textWrap: "balance" }}>Modelos Comerciais em Destaque</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {PRODUCT_CATALOG.map((item, i) => (
              <div
                key={item.id}
                className="hover-border reveal-item"
                style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.2s" }}>
                <div style={{
                  aspectRatio: "16/9",
                  background: `linear-gradient(135deg, ${colors.surface}, ${colors.bg})`,
                  overflow: "hidden", position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Box size={40} color={colors.muted} style={{ opacity: 0.3 }} />
                  <img src={item.imageUrl} alt={item.title} loading="lazy"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <span style={{ backgroundColor: colors.bg, color: colors.muted, fontSize: "11px", fontWeight: 700, padding: "5px 10px", borderRadius: "5px", textTransform: "uppercase" }}>{item.size} // {item.category}</span>
                    <span style={{ fontSize: "11px", color: colors.muted, fontFamily: "Track" }}>Ref: CH-{item.id}</span>
                  </div>
                  <h3 style={{ fontFamily: "Track", fontSize: "20px", fontWeight: 700, color: colors.text, margin: 0, textWrap: "balance" }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", color: colors.muted, lineHeight: 1.5, margin: 0 }}>{item.description}</p>
                  <div style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, padding: "10px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.border}`, paddingBottom: "5px", marginBottom: "5px", fontSize: "11px", color: colors.muted }}>
                      <span>Estrutura Base:</span>
                      <span style={{ color: colors.text, fontWeight: 700 }}>{item.specs.chapa}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${colors.border}`, paddingBottom: "5px", marginBottom: "5px", fontSize: "11px", color: colors.muted }}>
                      <span>Peso de Tara:</span>
                      <span style={{ color: colors.text, fontWeight: 700 }}>{item.specs.peso}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: colors.muted }}>
                      <span>Dimensões:</span>
                      <span style={{ color: colors.text, fontWeight: 700 }}>{item.specs.dimensoes}</span>
                    </div>
                  </div>
                  <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "10px", color: colors.muted, fontWeight: 700, textTransform: "uppercase", display: "block" }}>A partir de</span>
                      <span style={{ fontSize: "24px", fontWeight: 700, color: colors.accent }}>R$ {item.basePrice.toLocaleString("pt-BR")}</span>
                    </div>
                    <a href="#simulador" className="hover-scale focus-ring btn-press" style={{ color: colors.accent, fontSize: "12px", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "5px", transition: "all 0.2s" }}>
                      SIMULAR <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMULADOR */}
      <section id="simulador" className="reveal-section" style={{ padding: "100px 0", backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "992px", margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: colors.accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>Passo a Passo</span>
              <h2 style={{ fontFamily: "Track", fontSize: "50px", fontWeight: 700, color: colors.text, margin: "5px 0 0", textWrap: "balance" }}>Configurador de Orçamento</h2>
              <p style={{ fontSize: "16px", color: colors.muted, lineHeight: 1.5, marginTop: "10px" }}>Escolha o tamanho padrão do container, a finalidade e os opcionais para calcular o preço estimado em tempo real.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "5px" }}>1. Tamanho da Cabine</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px" }}>
                  {(["20 pés", "40 pés", "40 pés HC"] as const).map((sz) => (
                    <button key={sz} onClick={() => setBuilderSize(sz)}
                      className="focus-ring btn-press"
                      style={{
                        padding: "10px", fontSize: "12px",
                        border: builderSize === sz ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                        borderRadius: "10px", backgroundColor: builderSize === sz ? colors.accent : "transparent",
                        color: builderSize === sz ? colors.text : colors.muted, fontWeight: builderSize === sz ? 700 : 400,
                        cursor: "pointer", transition: "all 0.15s", fontFamily: "Track",
                      }}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "5px" }}>2. Tipo de Projeto</label>
                <select value={builderType} onChange={(e) => setBuilderType(e.target.value)}
                  className="focus-ring"
                  style={{ width: "100%", backgroundColor: colors.bg, border: `1px solid ${colors.border}`, padding: "10px", borderRadius: "10px", color: colors.text, fontSize: "14px", outline: "none", transition: "border-color 0.15s" }}>
                  <option value="almoxarifado">Almoxarifado Padrão (Sem divisórias)</option>
                  <option value="escritorio">Escritório Customizado (+ R$ 15.000)</option>
                  <option value="sanitario">Módulo Banheiro Coletivo (+ R$ 12.000)</option>
                </select>
              </div>

              {builderType === "almoxarifado" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "10px", overflow: "hidden" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: colors.text, fontWeight: 700, display: "block" }}>Revestimento Térmico</span>
                    <span style={{ fontSize: "10px", color: colors.muted }}>Forração EPS/Lã de Vidro (+ R$ 4.500)</span>
                  </div>
                  <input type="checkbox" checked={builderIsolamento} onChange={(e) => setBuilderIsolamento(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: colors.accent, cursor: "pointer" }} />
                </motion.div>
              )}

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>3. Aberturas Adicionais</label>
                  <span style={{ fontSize: "12px", color: colors.text, fontFamily: "Track" }}>{builderModificacoes > 0 ? `${builderModificacoes} un. (portas, janelas)` : "0 un."}</span>
                </div>
                <input type="range" min="0" max="4" value={builderModificacoes} onChange={(e) => setBuilderModificacoes(Number(e.target.value))}
                  style={{ width: "100%", accentColor: colors.accent, cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: colors.muted, marginTop: "2px" }}>
                  <span>Padrão</span>
                  <span>1 (porta)</span>
                  <span>2 (porta + janela)</span>
                  <span>3</span>
                  <span>4 (máximo)</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "10px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Resumo da Estrutura</h4>
                  <h3 style={{ fontFamily: "Track", fontSize: "20px", fontWeight: 700, color: colors.text, margin: "5px 0 0" }}>Módulo Customizado Delivery Container</h3>
                </div>
                <Box size={24} color={colors.muted} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: colors.muted }}>
                  <span>Estrutura ({builderSize}):</span>
                  <span style={{ color: colors.text, fontWeight: 700 }}>Inclusa</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: colors.muted }}>
                  <span>Finalidade:</span>
                  <span style={{ color: colors.text, fontWeight: 700, textTransform: "capitalize" }}>{builderType}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: colors.muted }}>
                  <span>Modificações:</span>
                  <span style={{ color: colors.text, fontWeight: 700 }}>{builderModificacoes > 0 ? `${builderModificacoes} aberturas` : "Padrão"}</span>
                </div>
              </div>
            </div>
            <motion.div
              key={computedPrice}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "20px", marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "10px", color: colors.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Valor Estimado</span>
                <span style={{ fontFamily: "Track", fontSize: "32px", fontWeight: 700, color: colors.accent }}>R$ {computedPrice.toLocaleString("pt-BR")}</span>
              </div>
              <button onClick={() => setIsQuoteModalOpen(true)}
                className="hover-scale focus-ring btn-press"
                style={{ backgroundColor: colors.accent, color: colors.text, padding: "10px 20px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.15s" }}>
                SOLICITAR PROPOSTA
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="reveal-section" style={{ padding: "100px 0", borderBottom: `1px solid ${colors.border}`, scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "992px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ marginBottom: "40px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: colors.accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>Depoimentos</span>
            <h2 style={{ fontFamily: "Track", fontSize: "50px", fontWeight: 700, color: colors.text, margin: "5px 0 0" }}>Quem Compra Confia</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.id}
                className="hover-border reveal-item"
                style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "240px", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ color: colors.accent, fontSize: "14px" }}>★★★★★</div>
                  <p style={{ fontSize: "14px", color: colors.muted, lineHeight: 1.5, fontStyle: "italic", margin: 0 }}>"{t.text}"</p>
                </div>
                <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "12px", display: "flex", alignItems: "center", gap: "10px", fontSize: "11px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <span style={{ fontSize: "11px", color: colors.muted, fontWeight: 700 }}>{t.name.charAt(0)}</span>
                    <img src={t.avatarUrl} alt={t.name}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: colors.text, fontWeight: 700, display: "block" }}>{t.name}</span>
                    <span style={{ color: colors.muted }}>{t.location}</span>
                  </div>
                  <span style={{ backgroundColor: colors.bg, color: colors.muted, padding: "3px 8px", borderRadius: "5px", fontSize: "9px", fontWeight: 700, textTransform: "uppercase" }}>{t.houseType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="reveal-section" style={{ padding: "100px 0", borderBottom: `1px solid ${colors.border}`, scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "992px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "Track", fontSize: "50px", fontWeight: 700, color: colors.text, margin: 0, textWrap: "balance" }}>Dúvidas Frequentes</h2>
            <p style={{ fontSize: "16px", color: colors.muted, lineHeight: 1.5, marginTop: "10px" }}>Tire suas principais dúvidas sobre prazos, entregas, garantias e formas de pagamento.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 * i, ease: easeOut }}
                className="hover-border"
                style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.2s" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="focus-ring btn-press"
                  style={{ width: "100%", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "none", background: "none", color: colors.text, fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif", textAlign: "left" }}>
                  <span>{item.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                  >
                    <ChevronDown size={16} color={colors.muted} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: easeOut }}
                      style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 20px 15px", fontSize: "14px", color: colors.muted, lineHeight: 1.5 }}>
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: colors.surface, padding: "100px 0 40px", borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: "992px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "30px", paddingBottom: "40px", borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ fontFamily: "Track", fontSize: "24px", fontWeight: 700, color: colors.text }}>DELIVERY CONTAINER</div>
              <p style={{ fontSize: "12px", color: colors.muted, lineHeight: 1.5, margin: 0 }}>Soluções em containers e módulos habitacionais industriais. Qualidade certificada e entrega em todo o Sul do Brasil.</p>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: colors.accent }}>
                <MessageCircle size={14} />
                <span style={{ fontWeight: 700 }}>(51) 99999-9999</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: "Track", fontSize: "16px", fontWeight: 700, color: colors.text, margin: "0 0 15px" }}>WEBSITE</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Inicial", "Vendas", "Modificações", "Vendidos", "Sobre nós", "FAQ"].map((link) => (
                  <li key={link}><a href="#" className="hover-scale focus-ring" style={{ fontSize: "12px", color: colors.muted, textDecoration: "none", transition: "all 0.15s" }}>{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: "Track", fontSize: "16px", fontWeight: 700, color: colors.text, margin: "0 0 15px" }}>CONTATO</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ fontSize: "12px", color: colors.muted }}>contato@deliverycontainer.com.br</li>
                <li style={{ fontSize: "12px", color: colors.muted }}>(51) 99999-9999</li>
                <li style={{ fontSize: "12px", color: colors.muted }}>Porto Alegre - RS</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: "Track", fontSize: "16px", fontWeight: 700, color: colors.text, margin: "0 0 15px" }}>HORÁRIOS</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ fontSize: "12px", color: colors.muted }}>Seg a Sex: 08:00 às 18:00</li>
                <li style={{ fontSize: "12px", color: colors.muted }}>Sáb: 08:00 às 12:00</li>
              </ul>
            </div>
          </div>
          <div style={{ paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: colors.muted }}>
            <span>© 2026 Delivery Container. Todos os direitos reservados.</span>
            <div style={{ display: "flex", gap: "15px" }}>
              <span style={{ color: colors.border }}>ISO 830</span>
              <span style={{ color: colors.border }}>SSL</span>
            </div>
          </div>
        </div>
      </footer>

      {/* QUOTE MODAL */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { if (e.target === e.currentTarget) setIsQuoteModalOpen(false); }}
            onKeyDown={(e) => { if (e.key === "Escape") setIsQuoteModalOpen(false); }}
            tabIndex={-1}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: easeOut }}
              style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "10px", maxWidth: "480px", width: "100%", overflow: "hidden" }}>
              <div style={{ backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}`, padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "12px", color: colors.text, textTransform: "uppercase" }}>Solicitar Cotação</span>
                <button onClick={() => setIsQuoteModalOpen(false)} className="focus-ring btn-press" style={{ background: "none", border: "none", color: colors.muted, cursor: "pointer", padding: "5px", transition: "all 0.15s" }}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ backgroundColor: colors.bg, padding: "10px", borderRadius: "10px", fontSize: "12px", color: colors.muted, display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span style={{ color: colors.text, fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>Módulo Selecionado:</span>
                  <span>Container {builderSize} para {builderType}</span>
                  <span>Valor: R$ {computedPrice.toLocaleString("pt-BR")}</span>
                </div>
                {(["name", "email", "phone", "cidade"] as const).map((field) => (
                  <div key={field}>
                    <label style={{ fontSize: "10px", color: colors.muted, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: "5px" }}>
                      {field === "name" ? "Nome Completo" : field === "email" ? "E-mail" : field === "phone" ? "WhatsApp" : "Cidade/Estado"}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      required
                      value={quoteData[field]}
                      onChange={(e) => {
                        const val = field === "phone" ? formatPhone(e.target.value) : e.target.value;
                        setQuoteData({ ...quoteData, [field]: val });
                        if (formErrors[field]) setFormErrors({ ...formErrors, [field]: "" });
                      }}
                      onBlur={validateForm}
                      placeholder={field === "phone" ? "(51) 99999-9999" : field === "cidade" ? "Ex: Guaíba - RS" : ""}
                      className={`focus-ring ${!formErrors[field] ? "input-glow" : ""}`}
                      style={{
                        width: "100%", backgroundColor: colors.bg,
                        border: `1px solid ${formErrors[field] ? "#c94a4a" : colors.border}`,
                        padding: "10px", borderRadius: "10px", color: colors.text, fontSize: "14px",
                        outline: "none", boxSizing: "border-box", transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                    />
                    {formErrors[field] && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: "11px", color: "#c94a4a", marginTop: "3px", display: "block" }}>{formErrors[field]}</motion.span>
                    )}
                  </div>
                ))}
                <motion.button
                  type="submit"
                  disabled={isSubmittingLead}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="focus-ring"
                  style={{ backgroundColor: isSubmittingLead ? colors.muted : colors.accent, color: colors.text, padding: "12px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em", cursor: "pointer", transition: "background-color 0.15s" }}>
                  {isSubmittingLead ? "Enviando..." : "CONFIRMAR E ENVIAR"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: easeOut }}
            style={{
              position: "fixed", top: "20px", right: "20px", zIndex: 2000,
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
              borderRadius: "10px", padding: "15px 20px", maxWidth: "400px",
              display: "flex", alignItems: "center", gap: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
            {toast.type === "success" ? (
              <CheckCircle size={20} color={colors.accent} />
            ) : (
              <AlertCircle size={20} color="#c94a4a" />
            )}
            <span style={{ fontSize: "13px", color: colors.text, lineHeight: 1.4 }}>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WHATSAPP FLOATING BUTTON */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1, ease: easeOut }}
        style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999 }}>
        <motion.a
          href="https://wa.me/5551999999999" target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="focus-ring"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", backgroundColor: colors.accent, borderRadius: "50%",
            color: colors.text, cursor: "pointer",
          }}>
          <MessageCircle size={28} fill="currentColor" />
        </motion.a>
      </motion.div>

      <AIChatWidget />
    </div>
  );
}
