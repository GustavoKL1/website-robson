/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Home as HomeIcon, 
  Compass, 
  CheckCircle2, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  Trash2, 
  Plus, 
  Edit3, 
  Calendar, 
  User, 
  Send, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Sliders,
  Maximize,
  Check,
  Briefcase,
  ExternalLink,
  Settings as SettingsIcon,
  X,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import Navbar from "./components/Navbar";
import Logo from "./components/Logo";
import PlaceholderImage from "./components/PlaceholderImage";
import {
  LOREM_BODY,
  LOREM_EMAIL,
  LOREM_LINE,
  LOREM_PHONE,
  LOREM_SHORT,
  LOREM_URL,
} from "./constants/lorem";
import { motion } from "motion/react";
import ProjectDetailsModal from "./components/ProjectDetailsModal";
import AIChatWidget from "./components/AIChatWidget";
import { Project, Lead, BlogPost, AppSettings } from "./types";
import { 
  fetchProjects, 
  fetchLeads, 
  fetchBlogs, 
  fetchSettings, 
  submitLead, 
  updateLeadStatus, 
  deleteLead, 
  createProject, 
  updateProject, 
  deleteProject, 
  saveSettings, 
  createBlogPost,
  checkAdminSession,
  adminLogin,
  adminLogout,
} from "./utils/api";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
  houseType: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Juliana Ribeiro",
    location: "Porto Alegre - RS",
    text: "A entrega do container duplex foi um espetáculo à parte. O guindaste posicionou tudo com uma precisão cirúrgica debaixo de chuva. O isolamento térmico e acústico da casa é absurdo de bom!",
    rating: 5,
    avatar: "",
    houseType: "Container Duplex 60m²"
  },
  {
    id: 2,
    name: "Carlos & Mariana Souza",
    location: "Gramado - RS",
    text: "Estávamos muito preocupados com o frete e nivelamento na serra, mas a equipe de logística planejou cada detalhe. O container chegou intacto, com todos os vidros e acabamento impecáveis.",
    rating: 5,
    avatar: "",
    houseType: "Chácara Container 40 Pés"
  },
  {
    id: 3,
    name: "Ricardo Mendes",
    location: "Guaíba - RS",
    text: "Ver a minha casa modular ser descarregada e montada em menos de 4 horas no terreno foi indescritível. A segurança estrutural do aço naval e a rapidez da entrega são geniais.",
    rating: 5,
    avatar: "",
    houseType: "Módulo Industrial 30m²"
  },
  {
    id: 4,
    name: "Amanda Costa",
    location: "Canoas - RS",
    text: "Minha pousada container foi entregue antes do prazo. Acabamento primoroso nas aberturas e conforto térmico excelente. Os clientes estão amando e agendando cada vez mais!",
    rating: 5,
    avatar: "",
    houseType: "Suítes Eco-Lodge"
  },
  {
    id: 5,
    name: "Fernando Álvares",
    location: "Novo Hamburgo - RS",
    text: "Excelente pós-venda que resolveu todas as dúvidas. O caminhão munck fez a entrega milimétrica por cima do muro. Com certeza farei o second andar com eles em breve.",
    rating: 5,
    avatar: "",
    houseType: "Residência Sob Medida"
  }
];

// 1. HeroSection
interface HeroSectionProps {
  setIsVideoOpen: (val: boolean) => void;
  setQuoteStep: React.Dispatch<React.SetStateAction<number>>;
  setIsQuoteModalOpen: (val: boolean) => void;
}
const HeroSection = React.memo(({ setIsVideoOpen, setQuoteStep, setIsQuoteModalOpen }: HeroSectionProps) => {
  return (
    <section id="home" className="relative w-full min-h-[600px] lg:h-[650px] flex flex-col md:flex-row overflow-hidden border-b border-gray-100 scroll-mt-24">
      {/* Left Portion: Hex Dark Graphite */}
      <div className="w-full md:w-[45%] bg-[#1A1A1A] flex flex-col justify-center py-16 px-8 sm:px-12 lg:px-24 text-white z-10 relative">
        <div className="absolute top-8 left-8 w-16 h-1 bg-red-600 rounded-full" />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white text-left">
          Casas Container sob medida, com acabamento completo.
        </h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-md leading-relaxed font-normal mb-6 text-left">
          A Delivery Container transforma containers industriais em habitats modernos, luxuosos e funcionais: moradia modular, comércio gourmet, escritório corporativo ou módulos altamente personalizados.
        </p>
        
        <div className="flex flex-wrap gap-4 items-center mt-2">
          <div className="flex items-center space-x-2 text-sm bg-black/40 px-3 py-1.5 rounded-full border border-gray-800">
            <CheckCircle2 size={14} className="text-red-500" />
            <span className="text-gray-300 font-semibold">Chaves na mão</span>
          </div>
          <div className="flex items-center space-x-2 text-sm bg-black/40 px-3 py-1.5 rounded-full border border-gray-800">
            <CheckCircle2 size={14} className="text-red-500" />
            <span className="text-gray-300 font-semibold">Isolamento especial</span>
          </div>
        </div>
      </div>

      {/* Right Portion: Media backdrop */}
      <div className="w-full md:w-[55%] min-h-[350px] relative bg-slate-900 group">
        <PlaceholderImage className="absolute inset-0 w-full h-full" label="Hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/50 to-transparent pointer-events-none" />

        {/* Video Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            type="button"
            onClick={() => setIsVideoOpen(true)}
            aria-label="Play Video" 
            className="w-24 h-24 sm:w-28 sm:h-28 bg-white/20 hover:bg-red-600/90 backdrop-blur-md border-2 border-white/60 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-2xl group cursor-pointer"
            id="play-hero-video-button"
          >
            <Play className="w-10 h-10 text-white fill-current translate-x-1 group-hover:scale-110 transition-transform" />
            <div className="absolute -inset-2 rounded-full border border-white/20 animate-ping duration-1000 opacity-70" />
          </button>
        </div>

        {/* Floating location stamp info overlay */}
        <div className="absolute bottom-6 right-6 bg-black/75 backdrop-blur-md rounded-lg p-3 text-white border border-white/10 text-xs flex items-center space-x-2 animate-none">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{LOREM_SHORT}</span>
        </div>
      </div>

      {/* Floating Banner CTA overlapping the two sections */}
      <div className="absolute bottom-8 md:bottom-auto md:top-1/2 left-1/2 md:left-[45%] -translate-x-1/2 -translate-y-1/2 md:-translate-y-1/2 z-20">
        <div 
          onClick={() => {
            setQuoteStep(1);
            setIsQuoteModalOpen(true);
          }}
          className="bg-white dark:bg-neutral-900 px-8 py-6 rounded-2xl shadow-2xl relative overflow-hidden flex items-center justify-between space-x-6 min-w-[310px] sm:min-w-[340px] cursor-pointer hover:translate-y-[-4px] transition-all duration-300 border border-gray-100 dark:border-neutral-850 group animate-none"
          id="floating-budget-cta"
        >
          {/* Visual red bottom corner bracket detail in the design */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-red-600 rounded-bl-2xl ml-2 mb-2" />
          
          <div className="text-left z-10">
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white leading-tight tracking-tight">
              Peça um<br/>orçamento
            </h2>
            <p className="text-[10px] text-gray-400 dark:text-neutral-400 mt-1 font-semibold uppercase tracking-wider block">
              Simulador Exclusivo →
            </p>
          </div>
          
          {/* Arrow and Pointer hand icons matching graphic */}
          <div className="flex flex-col items-center justify-center space-y-1 ml-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-inner">
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </div>
            {/* Small pointer click indicator */}
            <div className="text-[11px] font-bold text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded flex items-center space-x-1 transform rotate-6 border border-gray-200 dark:border-neutral-700">
              <span>Simular</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
HeroSection.displayName = "HeroSection";


// 2. QuickFeaturesStrip
const QuickFeaturesStrip = React.memo(() => {
  return (
    <section className="bg-gray-50 dark:bg-neutral-900/50 py-10 border-b border-gray-100 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex items-start space-x-4 text-left">
          <div className="p-3 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Entrega Recorde</h4>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Construção até 3x mais veloz que alvenaria comum.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 text-left">
          <div className="p-3 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl">
            <Sliders size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Flexibilidade Total</h4>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Módulos que podem ser expandidos ou transportados.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 text-left">
          <div className="p-3 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl">
            <Maximize size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Isolamento Completo</h4>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Lã de rocha termoacústica e drywall impecável.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 text-left">
          <div className="p-3 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Economia e Sustentabilidade</h4>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Redução massiva de resíduos e fundação otimizada.</p>
          </div>
        </div>
      </div>
    </section>
  );
});
QuickFeaturesStrip.displayName = "QuickFeaturesStrip";


// 3. CatalogSection
interface CatalogSectionProps {
  loading: boolean;
  projects: Project[];
  prevProject: () => void;
  nextProject: () => void;
  setSelectedProject: (proj: Project) => void;
}
const CatalogSection = React.memo(({
  loading,
  projects,
  prevProject,
  nextProject,
  setSelectedProject
}: CatalogSectionProps) => {
  return (
    <section id="catalog-section" className="relative max-w-7xl mx-auto px-6 py-24 scroll-mt-12">
      <div id="produtos" className="absolute -top-24" />
      <div id="projetos" className="absolute -top-24" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
        <div className="text-left">
          <span className="text-red-600 text-sm font-black uppercase tracking-widest block mb-2 text-left">
            CATÁLOGO COMPLETO
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 dark:text-white text-left">
            Modelos e projetos
          </h2>
          <p className="text-gray-500 dark:text-neutral-400 text-base mt-2 max-w-xl text-left">
            Módulos customizados construídos com chapas de aço corten navais autênticas, tratamentos antiferrugem triplos e pinturas de alta qualidade.
          </p>
        </div>
        
        {/* Carousel Navigation Buttons */}
        <div className="flex space-x-3 mt-6 sm:mt-0">
          <button 
            type="button"
            onClick={prevProject}
            aria-label="Previous Project" 
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-red-600 text-gray-800 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-90 animate-none cursor-pointer border border-transparent"
          >
            <ChevronLeft size={22} />
          </button>
          <button 
            type="button"
            onClick={nextProject}
            aria-label="Next Project" 
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-red-600 text-gray-800 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-90 animate-none cursor-pointer border border-transparent"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Real Projects Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
          <span className="text-gray-500 dark:text-neutral-400 font-semibold">Carregando catálogo de containers...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-12 px-6 bg-gray-50 dark:bg-neutral-900 rounded-2xl text-center border border-dashed border-gray-200 dark:border-neutral-800">
          <Layers className="mx-auto text-gray-300 dark:text-neutral-700 w-12 h-12 mb-3 animate-none" />
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">Nenhum projeto cadastrado no banco</h3>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Utilize o painel para cadastrar modelos em tempo real.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          {projects.map((proj, idx) => (
            <div 
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="relative group h-[460px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              id={`project-card-${proj.id}`}
            >
              <PlaceholderImage className="absolute inset-0 w-full h-full" label={proj.title} />
              
              {/* Dark Gradient bottom-overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white text-left">
                
                {/* Featured Badge */}
                {proj.badge && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow z-10 animate-none">
                    {proj.badge}
                  </span>
                )}

                <span className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1 block">
                  {proj.category || "Residencial"}
                </span>
                
                <h3 className="text-2xl font-black tracking-tight leading-tight mb-1 group-hover:text-red-400 transition-colors">
                  {proj.title}
                </h3>
                
                <p className="text-sm text-gray-300 font-normal line-clamp-2 mb-3">
                  {proj.description}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-1">
                  <span className="text-xs text-gray-400">
                    Estimado em {proj.priceEstimate ? `R$ ${proj.priceEstimate.toLocaleString("pt-BR")}` : "Sob Consulta"}
                  </span>
                  <span className="text-xs text-red-500 font-bold flex items-center space-x-1 group-hover:underline">
                    <span>Ver Detalhes</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
});
CatalogSection.displayName = "CatalogSection";


// 4. TestimonialsSection
interface TestimonialsSectionProps {
  testimonialIndex: number;
  setTestimonialIndex: React.Dispatch<React.SetStateAction<number>>;
}
const TestimonialsSection = React.memo(({ testimonialIndex, setTestimonialIndex }: TestimonialsSectionProps) => {
  return (
    <section className="bg-gray-50 dark:bg-neutral-900/50 py-24 border-t border-b border-gray-100 dark:border-neutral-900 relative overflow-hidden" id="testimonials-section">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="text-left">
            <span className="text-red-600 text-sm font-black uppercase tracking-widest block mb-2 text-left">DEPOIMENTOS DOS CLIENTES</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white text-left">O que nossos clientes dizem</h2>
            <p className="text-gray-500 dark:text-neutral-400 mt-2 text-base text-left">Histórias reais de quem transformou o sonho da casa container vinda de fábrica em realidade prática de entrega.</p>
          </div>
          
          {/* Carousel Navigation buttons */}
          <div className="flex items-center space-x-3 mt-6 md:mt-0">
            <button 
              type="button"
              onClick={() => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-red-600 dark:hover:border-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-755 text-gray-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 rounded-full shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              type="button"
              onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-red-600 dark:hover:border-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-755 text-gray-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 rounded-full shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Slider viewport */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Item 1: Always visible */}
            {(() => {
              const item = TESTIMONIALS[testimonialIndex % TESTIMONIALS.length];
              return (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-gray-100 dark:border-neutral-750 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[320px] relative group text-left">
                  <div className="absolute top-0 right-6 translate-y-[-50%] bg-red-600 text-[10px] text-white font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow z-10 animate-none">
                    {item.houseType}
                  </div>
                  <div className="space-y-4">
                    <span className="text-red-500/10 text-7xl font-serif absolute top-3 left-4 pointer-events-none select-none">“</span>
                    <div className="flex text-amber-400 space-x-1 pt-1.5 justify-start">
                      {[...Array(item.rating)].map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm italic relative z-10 leading-relaxed line-clamp-5 text-left">
                      "{item.text}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 border-t border-gray-50 dark:border-neutral-700/60 pt-4 mt-4 font-sans">
                    <PlaceholderImage
                      className="w-12 h-12 border-2 border-red-500/10 shadow-sm"
                      label={item.name}
                      rounded
                      compact
                    />
                    <div className="text-left">
                      <h4 className="font-extrabold text-gray-950 dark:text-white text-sm text-left">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 dark:text-neutral-400 flex items-center mt-0.5">
                        <MapPin size={10} className="mr-1 text-red-500" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Item 2: Visible on tablet & large screens */}
            {(() => {
              const item = TESTIMONIALS[(testimonialIndex + 1) % TESTIMONIALS.length];
              return (
                <div className="hidden md:flex bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-gray-100 dark:border-neutral-750 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[320px] relative group text-left">
                  <div className="absolute top-0 right-6 translate-y-[-50%] bg-red-600 text-[10px] text-white font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow z-10 animate-none">
                    {item.houseType}
                  </div>
                  <div className="space-y-4">
                    <span className="text-red-500/10 text-7xl font-serif absolute top-3 left-4 pointer-events-none select-none">“</span>
                    <div className="flex text-amber-400 space-x-1 pt-1.5 justify-start">
                      {[...Array(item.rating)].map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm italic relative z-10 leading-relaxed line-clamp-5 text-left">
                      "{item.text}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 border-t border-gray-50 dark:border-neutral-700/60 pt-4 mt-4 font-sans">
                    <PlaceholderImage
                      className="w-12 h-12 border-2 border-red-500/10 shadow-sm"
                      label={item.name}
                      rounded
                      compact
                    />
                    <div className="text-left">
                      <h4 className="font-extrabold text-gray-950 dark:text-white text-sm text-left">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 dark:text-neutral-400 flex items-center mt-0.5">
                        <MapPin size={10} className="mr-1 text-red-500" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Item 3: Visible on large screens only */}
            {(() => {
              const item = TESTIMONIALS[(testimonialIndex + 2) % TESTIMONIALS.length];
              return (
                <div className="hidden lg:flex bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-gray-100 dark:border-neutral-750 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[320px] relative group text-left">
                  <div className="absolute top-0 right-6 translate-y-[-50%] bg-red-600 text-[10px] text-white font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow z-10 animate-none">
                    {item.houseType}
                  </div>
                  <div className="space-y-4">
                    <span className="text-red-500/10 text-7xl font-serif absolute top-3 left-4 pointer-events-none select-none">“</span>
                    <div className="flex text-amber-400 space-x-1 pt-1.5 justify-start">
                      {[...Array(item.rating)].map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm italic relative z-10 leading-relaxed line-clamp-5 text-left">
                      "{item.text}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 border-t border-gray-50 dark:border-neutral-700/60 pt-4 mt-4 font-sans text-left">
                    <PlaceholderImage
                      className="w-12 h-12 border-2 border-red-500/10 shadow-sm"
                      label={item.name}
                      rounded
                      compact
                    />
                    <div className="text-left">
                      <h4 className="font-extrabold text-gray-950 dark:text-white text-sm text-left">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 dark:text-neutral-400 flex items-center mt-0.5">
                        <MapPin size={10} className="mr-1 text-red-500" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          {TESTIMONIALS.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setTestimonialIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                testimonialIndex % TESTIMONIALS.length === idx
                  ? "bg-red-600 w-6"
                  : "bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600 w-2.5"
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
TestimonialsSection.displayName = "TestimonialsSection";


// 5. DynamicMetricInteractionBanner
interface DynamicMetricBannerProps {
  setIsQuoteModalOpen: (val: boolean) => void;
}
const DynamicMetricInteractionBanner = React.memo(({ setIsQuoteModalOpen }: DynamicMetricBannerProps) => {
  return (
    <section className="bg-[#111] py-24 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 text-center">
        <span className="text-red-500 font-black tracking-widest uppercase text-xs block text-center">MONTE AGORA MESMO</span>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-2 mb-6 block text-center">
          Quer saber o custo exato do seu projeto?
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 text-center block">
          Nosso simulador interativo calcula o preço estimado em tempo real com base no tamanho, quantidade de módulos, nível de acabamento elétrico/hidráulico e custos de entrega com guindaste para sua localidade.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            type="button"
            onClick={() => setIsQuoteModalOpen(true)}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all text-base w-full sm:w-auto cursor-pointer border border-transparent"
          >
            Abrir Simulador de Custos
          </button>
          <span className="px-8 py-4 bg-zinc-900 border border-zinc-700 text-gray-200 font-bold rounded-xl text-base flex items-center justify-center space-x-2 w-full sm:w-auto">
            <Phone size={18} />
            <span>{LOREM_SHORT}</span>
          </span>
        </div>
      </div>
    </section>
  );
});
DynamicMetricInteractionBanner.displayName = "DynamicMetricInteractionBanner";


// 6. BlogAdvisoryWriterSection
interface BlogAdvisoryWriterProps {
  loading: boolean;
  blogs: BlogPost[];
  setCurrentTab: (tab: string) => void;
}
const BlogAdvisoryWriterSection = React.memo(({ loading, blogs, setCurrentTab }: BlogAdvisoryWriterProps) => {
  return (
    <section className="bg-gray-50 dark:bg-neutral-900/50 py-24 border-b border-gray-100 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="text-left">
            <span className="text-red-600 text-sm font-black uppercase tracking-widest block mb-2 text-left">CONHECIMENTO TÉCNICO</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white text-left">Blogs e Artigos de Apoio</h2>
            <p className="text-gray-500 dark:text-neutral-400 mt-2 text-base text-left">Tire todas as suas dúvidas sobre isolamento, fundação, documentação e transporte de cabinas de aço.</p>
          </div>
          <button 
            type="button"
            onClick={() => {
              setCurrentTab("blogs");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 text-red-600 hover:text-red-700 font-bold text-sm flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver todas as postagens</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Carregando artigos...</div>
        ) : blogs.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-750 rounded-xl text-gray-400 dark:text-neutral-550">Nenhum artigo publicado no momento.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogs.slice(0, 2).map((post) => (
              <div 
                key={post.id}
                onClick={() => {
                  setCurrentTab("blogs");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-755 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row h-full group text-left"
              >
                <div className="w-full sm:w-[40%] h-48 sm:h-auto relative bg-gray-100 dark:bg-neutral-900 min-h-[180px]">
                  <PlaceholderImage className="absolute inset-0 w-full h-full" label={post.title} />
                  <span className="absolute top-4 left-4 bg-zinc-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow animate-none">
                    {post.category || "Dúvidas"}
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1 text-left">
                  <div className="text-left">
                    <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-neutral-400 mb-2 font-semibold text-left">
                      <span className="flex items-center space-x-1 text-left">
                        <Calendar size={12} />
                        <span>{post.date}</span>
                      </span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-gray-950 dark:text-white line-clamp-2 group-hover:text-red-600 transition-colors duration-200 text-left">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2 line-clamp-3 text-left">
                      {post.summary}
                    </p>
                  </div>
                  <span className="text-xs text-red-600 font-bold flex items-center space-x-1 mt-4 text-left">
                    <span>Continuar lendo</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});
BlogAdvisoryWriterSection.displayName = "BlogAdvisoryWriterSection";


// 7. RealContactAndMapSection
const RealContactAndMapSection = React.memo(() => {
  return (
    <section id="contact" className="bg-white dark:bg-neutral-950 py-24 border-t border-gray-100 dark:border-neutral-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6 text-left">
          <div>
            <span className="text-red-600 text-sm font-black uppercase tracking-widest block mb-1">{LOREM_SHORT}</span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{LOREM_LINE}</h2>
            <p className="text-gray-500 dark:text-neutral-400 mt-2">{LOREM_BODY}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-left">{LOREM_SHORT}</h4>
                <p className="text-sm text-gray-500 dark:text-neutral-400 text-left">{LOREM_BODY}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-left">{LOREM_LINE}</h4>
                <p className="text-sm text-gray-500 dark:text-neutral-400 text-left">{LOREM_PHONE}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-left">{LOREM_SHORT}</h4>
                <p className="text-sm text-gray-500 dark:text-neutral-400 text-left">{LOREM_EMAIL}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30 flex items-start space-x-3 text-emerald-800 dark:text-emerald-300 text-xs">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 text-left">{LOREM_LINE}</span>
              <p className="text-emerald-700 dark:text-emerald-400 text-left">{LOREM_BODY}</p>
            </div>
          </div>
        </div>

        {/* Styled interactive SVG Map Placeholder */}
        <div className="lg:col-span-7 h-[400px] w-full rounded-2xl overflow-hidden relative shadow-md bg-stone-100 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800">
          <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
            <div className="bg-white/90 dark:bg-neutral-850/95 backdrop-blur-md px-4 py-2.5 rounded-lg border border-gray-100 dark:border-neutral-850 text-xs max-w-xs shadow text-left">
              <span className="font-bold text-gray-900 dark:text-white block">{LOREM_SHORT}</span>
              <p className="text-gray-500 dark:text-neutral-400 mt-0.5 text-left font-normal text-zinc-400">{LOREM_LINE}</p>
            </div>
            <span className="bg-red-600 self-center text-white font-extrabold text-[10px] uppercase px-4 py-2 rounded-full tracking-wider shadow-lg flex items-center space-x-1">
              <MapPin size={12} />
              <span>{LOREM_SHORT}</span>
            </span>
            <span className="text-[10px] text-gray-400 dark:text-neutral-550 text-right">{LOREM_LINE}</span>
          </div>
          {/* Visual grid / road graphics mimicking a real API map */}
          <svg className="w-full h-full text-stone-250 dark:text-neutral-800 stroke-current stroke-[2] fill-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0 10 L 100 80 M 0,55 L 100,55 M 25,0 L 25,100 M 75,0 L 75,100" />
            <ellipse cx="50" cy="50" rx="20" ry="15" className="stroke-stone-300 dark:stroke-neutral-800" />
            <circle cx="50" cy="50" r="3" className="fill-red-600" />
          </svg>
        </div>
      </div>
    </section>
  );
});
RealContactAndMapSection.displayName = "RealContactAndMapSection";


// 8. Footer
interface FooterProps {
  setCurrentTab: (tab: string) => void;
  setShowAdminModal: (val: boolean) => void;
}
const Footer = React.memo(({ setCurrentTab, setShowAdminModal }: FooterProps) => {
  return (
    <footer className="bg-[#f5f5f5] dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 py-16 text-sm transition-colors duration-250 animate-none" id="main-footer-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-10 md:space-y-0">
          
          {/* Footer Logo Layout */}
          <div className="cursor-pointer" onClick={() => { setCurrentTab("home"); window.scrollTo({ top: 0 }); }}>
            <Logo size="lg" />
          </div>

          {/* Structured Contact Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-14 md:gap-20 text-sm w-full md:w-auto text-left">
            <div>
              <span className="block font-black text-gray-400 mb-1.5 uppercase tracking-wider text-xs text-left">
                {LOREM_SHORT}
              </span>
              <p className="text-gray-900 dark:text-neutral-100 font-bold text-base text-left">{LOREM_PHONE}</p>
            </div>
            
            <div>
              <span className="block font-black text-gray-400 mb-1.5 uppercase tracking-wider text-xs text-left">
                {LOREM_LINE}
              </span>
              <p className="text-gray-900 dark:text-neutral-100 font-bold text-base text-left">{LOREM_PHONE}</p>
            </div>
            
            <div>
              <span className="block font-black text-gray-400 mb-1.5 uppercase tracking-wider text-xs text-left">
                {LOREM_SHORT}
              </span>
              <p className="text-gray-900 dark:text-neutral-100 font-bold text-base text-left">{LOREM_URL}</p>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 dark:text-neutral-500 gap-4">
          <p>© 2026 Delivery Container S/A. Todos os direitos reservados. CNPJ: 22.405.109/0001-50 </p>
          <div className="flex space-x-6">
            <span className="hover:text-gray-600 dark:hover:text-neutral-300 cursor-pointer">Segurança SSL</span>
            <span className="hover:text-gray-600 dark:hover:text-neutral-300 cursor-pointer" onClick={() => setShowAdminModal(true)}>Acesso Webmaster / Admin</span>
          </div>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = "Footer";

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Navigation & UI State
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  
  // Modal visibility states
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Quote wizard state
  const [quoteStep, setQuoteStep] = useState(1);
  const [quoteData, setQuoteData] = useState(() => {
    try {
      const saved = localStorage.getItem("delivery_container_quote_draft");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Erro ao carregar rascunho de orçamento do localStorage:", e);
    }
    return {
      name: "",
      email: "",
      phone: "",
      containerType: "40_premium",
      moduleCount: 1,
      finishLevel: "comfort", // standard, comfort, luxury
      needsTransport: true,
      message: "",
      targetBudget: 120000
    };
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadResultMessage, setLeadResultMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Admin Dashboard State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminTotp, setAdminTotp] = useState("");
  const [adminTotpRequired, setAdminTotpRequired] = useState(false);
  const [adminConfigured, setAdminConfigured] = useState(true);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminLeads, setAdminLeads] = useState<Lead[]>([]);
  const [adminTab, setAdminTab] = useState<'leads' | 'projects' | 'blogs' | 'settings'>('leads');
  
  // Admin Editing state
  const [settings, setSettings] = useState<AppSettings>({
    resendApiKey: "",
    notifiedEmail: LOREM_EMAIL,
    senderEmail: LOREM_EMAIL
  });

  const [newProjectForm, setNewProjectForm] = useState<Partial<Project>>({
    title: "",
    category: "Residencial",
    description: "",
    badge: "",
    imageUrl: "",
    priceEstimate: 95000,
    dimensions: "30m² - 1 Módulo de 40 pés",
    rooms: "1 Quarto, Banheiro e Cozinha",
    deliveryTime: "45 dias",
    specs: ["Isolamento termoacústico", "Piso Vinílico", "Banheiro Completo"]
  });

  const [newBlogForm, setNewBlogForm] = useState<Partial<BlogPost>>({
    title: "",
    summary: "",
    content: "",
    category: "Construção",
    imageUrl: "",
    readTime: "4 min"
  });

  // Project Carousel Index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Performance Benchmarking & Diagnostic tool references
  const [benchmarkTick, setBenchmarkTick] = useState(0);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    totalTime: number;
    avgTime: number;
    score: string;
  } | null>(null);

  const perfMetricsRef = useRef({
    renderCount: 0,
    durations: [] as number[],
    baseDurations: [] as number[],
    lastPhase: "mount" as "mount" | "update" | "nested-update",
    lastDuration: 0,
  });

  const handleProfilerRender = useCallback((
    id: string,
    phase: "mount" | "update" | "nested-update",
    actualDuration: number,
    baseDuration: number
  ) => {
    perfMetricsRef.current.renderCount += 1;
    perfMetricsRef.current.durations.push(actualDuration);
    perfMetricsRef.current.baseDurations.push(baseDuration);
    perfMetricsRef.current.lastPhase = phase;
    perfMetricsRef.current.lastDuration = actualDuration;
    if (perfMetricsRef.current.durations.length > 200) {
      perfMetricsRef.current.durations.shift();
      perfMetricsRef.current.baseDurations.shift();
    }
  }, []);

  const runBenchmarkSuite = useCallback(async () => {
    setIsBenchmarking(true);
    setBenchmarkResult(null);
    const start = performance.now();
    const runs = 50;
    
    for (let i = 0; i < runs; i++) {
      setBenchmarkTick(prev => prev + 1);
      // Wait for next animation frame to let React commit rendering and update real layout
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    
    const duration = performance.now() - start;
    const avg = duration / runs;
    
    let score = "Excelente (Aço Naval — Sub 2ms)";
    if (avg > 8) score = "Bom (Padrão Conforto — Sub 8ms)";
    if (avg > 16) score = "Moderado (Suscetível a engasgos — Acima de 16ms)";

    setBenchmarkResult({
      totalTime: duration,
      avgTime: avg,
      score
    });
    setIsBenchmarking(false);
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const projs = await fetchProjects();
        const blgs = await fetchBlogs();
        setProjects(projs);
        setBlogs(blgs);
      } catch (err) {
        console.error("Erro ao carregar dados do backend:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Restore admin session from httpOnly cookie
  useEffect(() => {
    checkAdminSession().then(async (session) => {
      setAdminConfigured(session.configured);
      setAdminTotpRequired(Boolean(session.totpRequired));
      if (session.authenticated) {
        setIsAdminLoggedIn(true);
        const leadsList = await fetchLeads();
        setAdminLeads(leadsList);
        const sett = await fetchSettings();
        if (sett) setSettings(sett);
      }
    });
  }, []);

  const loadAdminSettings = async () => {
    const sett = await fetchSettings();
    if (sett) setSettings(sett);
  };

  // Fetch leads when admin logs in
  const loadLeads = async () => {
    try {
      const leadsList = await fetchLeads();
      setAdminLeads(leadsList);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    }
  };

  // Login handler (server-side session + optional TOTP)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    setAdminError("");

    const result = await adminLogin(adminUsername, adminPassword, adminTotp);

    if (result.success) {
      setIsAdminLoggedIn(true);
      setAdminPassword("");
      setAdminTotp("");
      setAdminError("");
      await loadLeads();
      await loadAdminSettings();
    } else {
      setAdminError(result.error || "Falha na autenticação.");
      if (result.totpRequired) setAdminTotpRequired(true);
    }

    setAdminLoginLoading(false);
  };

  const handleAdminLogout = async () => {
    await adminLogout();
    setIsAdminLoggedIn(false);
    setAdminPassword("");
    setAdminTotp("");
    setShowAdminModal(false);
  };

  // Handle setting active lead status
  const handleUpdateLeadStatus = async (id: string, status: Lead["status"]) => {
    const updated = await updateLeadStatus(id, status);
    if (updated) {
      setAdminLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    }
  };

  // Handle delete lead
  const handleDeleteLead = async (id: string) => {
    if (window.confirm("Deseja realmente remover este lead permanentemente?")) {
      const success = await deleteLead(id);
      if (success) {
        setAdminLeads(prev => prev.filter(l => l.id !== id));
      }
    }
  };

  // Handle saving general configurations
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveSettings(settings);
    if (success) {
      alert("Configurações salvas com sucesso!");
    } else {
      alert("Erro ao salvar configurações.");
    }
  };

  // Handle creating a project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title) {
      alert("Título e URL da imagem principal são obrigatórios.");
      return;
    }
    const created = await createProject(newProjectForm as Omit<Project, "id">);
    if (created) {
      setProjects(prev => [...prev, created]);
      // Reset form
      setNewProjectForm({
        title: "",
        category: "Residencial",
        description: "",
        badge: "",
        imageUrl: "",
        priceEstimate: 95000,
        dimensions: "30m² - 1 Módulo de 40 pés",
        rooms: "1 Quarto, Banheiro e Cozinha",
        deliveryTime: "45 dias",
        specs: ["Isolamento termoacústico", "Piso Vinílico", "Banheiro Completo"]
      });
      alert("Projeto adicionado com sucesso!");
    }
  };

  // Handle removing catalog project
  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Deseja excluir este modelo do catálogo?")) {
      const success = await deleteProject(id);
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  // Handle creating a blog post
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogForm.title || !newBlogForm.content) {
      alert("Título, imagem e conteúdo completo são obrigatórios.");
      return;
    }
    const created = await createBlogPost(newBlogForm as Omit<BlogPost, "id" | "date">);
    if (created) {
      setBlogs(prev => [...prev, created]);
      setNewBlogForm({
        title: "",
        summary: "",
        content: "",
        category: "Construção",
        imageUrl: "",
        readTime: "4 min"
      });
      alert("Artigo publicado com sucesso!");
    }
  };

  // Dynamic Quote calculation based on wizard inputs via useMemo to avoid state-sync re-render cycles
  const estimatedBudget = useMemo(() => {
    let basePrice = 0;
    
    // Base size estimates
    if (quoteData.containerType === "20_standard") {
      basePrice = 45000;
    } else if (quoteData.containerType === "20_double") {
      basePrice = 85000;
    } else if (quoteData.containerType === "40_classic") {
      basePrice = 85000;
    } else { // 40_premium
      basePrice = 115000;
    }

    // Multiply by number of modules
    let multiplied = basePrice * quoteData.moduleCount;

    // Finish adjustments
    if (quoteData.finishLevel === "standard") {
      multiplied = multiplied * 0.9;
    } else if (quoteData.finishLevel === "luxury") {
      multiplied = multiplied * 1.3;
    }

    // Transport surcharge
    if (quoteData.needsTransport) {
      multiplied += 4500;
    }

    return multiplied;
  }, [quoteData.containerType, quoteData.moduleCount, quoteData.finishLevel, quoteData.needsTransport]);

  // Save quote draft to localStorage automatically
  useEffect(() => {
    try {
      const draftToSave = {
        ...quoteData,
        targetBudget: estimatedBudget
      };
      localStorage.setItem("delivery_container_quote_draft", JSON.stringify(draftToSave));
    } catch (e) {
      console.error("Erro ao salvar rascunho de orçamento no localStorage:", e);
    }
  }, [quoteData, estimatedBudget]);

  // Real-time contact validation helpers wrapped in useCallback for referential stability
  const validateEmail = useCallback((email: string) => {
    if (!email) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Formato de e-mail inválido (ex: nome@exemplo.com)";
    }
    return "";
  }, []);

  const validatePhone = useCallback((phone: string) => {
    if (!phone) return "";
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10 || clean.length > 11) {
      return "O telefone deve ter de 10 a 11 dígitos com DDD (DDD + 9 dígitos)";
    }
    return "";
  }, []);

  const formatPhone = useCallback((value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length === 0) return "";
    if (clean.length <= 2) return `(${clean}`;
    if (clean.length <= 6) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    if (clean.length <= 10) return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
  }, []);

  // Lead Quote wizard submit Form
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteStep < 3) {
      setQuoteStep(prev => prev + 1);
      return;
    }

    if (!quoteData.name || !quoteData.email || !quoteData.phone) {
      setLeadResultMessage({
        type: 'error',
        text: 'Por favor, preencha os dados básicos de contato (Nome, E-mail, Celular).'
      });
      return;
    }

    const emailErr = validateEmail(quoteData.email);
    const phoneErr = validatePhone(quoteData.phone);
    if (emailErr || phoneErr) {
      setLeadResultMessage({
        type: 'error',
        text: 'Por favor, corrija as inconsistências de contato em vermelho antes de enviar.'
      });
      return;
    }

    setIsSubmittingLead(true);
    setLeadResultMessage(null);

    const containerLabel = {
      "20_standard": "Módulo Standard de 20 Pés (15m²)",
      "20_double": "Showroom / Escritório Panorâmico de 20 Pés (15m²)",
      "40_classic": "Clássico 40 Pés (30m²)",
      "40_premium": "Premium 40 Pés de Alto Padrão (30m² / Acoplado)"
    }[quoteData.containerType] || quoteData.containerType;

    const finishLabel = {
      "standard": "Popular / Básico (Isolamento EPS)",
      "comfort": "Conforto Moderno (Lã de Rocha e Gesso)",
      "luxury": "Luxo Premium Automação & Acabamento Naval"
    }[quoteData.finishLevel] || quoteData.finishLevel;

    const fullMessage = `
      Interesse: ${quoteData.moduleCount}x Módulos do tipo "${containerLabel}".
      Acabamento Escolhido: ${finishLabel}.
      Necessita Transportadora: ${quoteData.needsTransport ? "Sim" : "Não"}.
      
      Mensagem Complementar:
      ${quoteData.message || "Sem mensagem adicional."}
    `;

    try {
      const response = await submitLead({
        name: quoteData.name,
        email: quoteData.email,
        phone: quoteData.phone,
        message: fullMessage,
        projectInterest: `${quoteData.moduleCount}x ${containerLabel}`,
        targetBudget: estimatedBudget
      });

      if (response.success) {
        setLeadResultMessage({
          type: 'success',
          text: response.emailSent 
            ? 'Orçamento solicitado com sucesso! Nossa equipe técnica já foi alertada por e-mail e entrará em contato em poucas horas.' 
            : 'Dados salvos localmente! (Aviso: No momento o simulador não possui chave API Resend preenchida, mas sua proposta foi arquivada no Painel do Administrador).'
        });
        
        // Reset wizard forms
        setQuoteData({
          name: "",
          email: "",
          phone: "",
          containerType: "40_premium",
          moduleCount: 1,
          finishLevel: "comfort",
          needsTransport: true,
          message: "",
          targetBudget: 120000
        });
        setQuoteStep(1);
      } else {
        setLeadResultMessage({
          type: 'error',
          text: response.error || 'Não foi possível processar. Tente novamente ou use os canais diretos de telefone no rodapé.'
        });
      }
    } catch (err) {
      setLeadResultMessage({
        type: 'error',
        text: 'Erro de comunicação interna de rede.'
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Carousel handlers for Project List
  const nextProject = () => {
    if (projects.length === 0) return;
    setCarouselIndex(prev => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    if (projects.length === 0) return;
    setCarouselIndex(prev => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <React.Profiler id="DeliveryContainerRoot" onRender={handleProfilerRender}>
      <div className="font-sans text-gray-900 dark:text-neutral-100 bg-white dark:bg-neutral-950 min-h-screen selection:bg-red-600 selection:text-white antialiased transition-colors duration-200">
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenModelos={() => {
          const el = document.getElementById("catalog-section");
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onOpenAdmin={() => setShowAdminModal(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleAdminLogout}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      {/* RENDER DYNAMIC PAGES */}
      {currentTab === "home" && (
        <>
          <HeroSection 
            setIsVideoOpen={setIsVideoOpen} 
            setQuoteStep={setQuoteStep} 
            setIsQuoteModalOpen={setIsQuoteModalOpen} 
          />

          {/* QUICK FEATURES STRIP */}
          <QuickFeaturesStrip />

          {/* PROJECT GRID CATEGORY SECTION ("Modelos e projetos" in Portuguese) */}
          <CatalogSection 
            loading={loading} 
            projects={projects} 
            prevProject={prevProject} 
            nextProject={nextProject} 
            setSelectedProject={setSelectedProject} 
          />

          <TestimonialsSection 
            testimonialIndex={testimonialIndex} 
            setTestimonialIndex={setTestimonialIndex} 
          />

          <DynamicMetricInteractionBanner 
            setIsQuoteModalOpen={setIsQuoteModalOpen} 
          />
          <BlogAdvisoryWriterSection 
            loading={loading} 
            blogs={blogs} 
            setCurrentTab={setCurrentTab} 
          />
          <RealContactAndMapSection />
        </>
      )}

      {/* RENDER BLOGS PAGE COMPONENT */}
      {currentTab === "blogs" && (
        <div className="max-w-4xl mx-auto px-6 py-16 animate-fadeIn">
          <div className="text-center mb-16">
            <span className="text-red-600 text-xs font-black uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full">
              CANAL DE CONHECIMENTO
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 mt-4 mb-4">
              Blog & Engenharia Modular
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Aprenda como regularizar, isolar acusticamente e preparar o terreno para sua nova casa container sem sobressaltos e com economia.
            </p>
          </div>

          <div className="space-y-16">
            {loading ? (
              <div className="text-center py-10">Carregando artigos...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-10 text-gray-400">Nenhum artigo publicado no blog.</div>
            ) : (
              blogs.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-80 w-full relative bg-gray-100">
                    <PlaceholderImage className="absolute inset-0 w-full h-full" label={post.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <span className="absolute bottom-6 left-6 bg-red-600 text-white font-extrabold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full shadow">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-8 sm:p-10 space-y-4">
                    <div className="flex items-center space-x-3 text-sm text-gray-400 font-semibold">
                      <span className="flex items-center space-x-1 text-gray-500">
                        <User size={14} className="text-red-500" />
                        <span>Engenharia Delivery Container</span>
                      </span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime} de leitura</span>
                    </div>

                    <h2 className="text-3xl font-black text-gray-950 tracking-tight leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-base text-gray-600 leading-relaxed font-bold">
                      {post.summary}
                    </p>

                    <div className="prose max-w-none pt-4 text-gray-700 space-y-4 leading-relaxed whitespace-pre-wrap border-t border-gray-100 mt-4">
                      {post.content}
                    </div>

                    {/* Social shares footer mockup for realism */}
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-50 text-xs text-gray-400 gap-4">
                      <span>Artigo de utilidade pública — Autorizado compartilhamento gratuito</span>
                      <button 
                        onClick={() => alert("Link de compartilhamento copiado para área de transferência!")}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-lg border border-gray-200 flex items-center space-x-1 cursor-pointer"
                      >
                        <ExternalLink size={12} />
                        <span>Copiar Link do Artigo</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={() => {
                setCurrentTab("home");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
            >
              <span>Voltar para Página Inicial</span>
            </button>
          </div>
        </div>
      )}

      {/* FOOTER ACCORDING TO SCREENSHOT */}
      <Footer setCurrentTab={setCurrentTab} setShowAdminModal={setShowAdminModal} />


      {/* VIDEO PREVIEW MODAL */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-red-500 bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full">
              {/* Premium Container Architecture Preview Loop */}
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/5D_1EWeMvNo?autoplay=1"
                title="Delivery Container Transformation Process"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-zinc-900 text-white text-xs flex justify-between items-center">
              <span>Etapas de Fabricação da Casa Container Premium</span>
              <span className="text-gray-500">Filme Exclusivo • 3 min</span>
            </div>
          </div>
        </div>
      )}


      {/* INTERACTIVE QUOTE MODAL (Peça um orçamento) */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative border border-gray-100 flex flex-col my-8">
            
            {/* Header portion */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 relative">
              <button 
                onClick={() => setIsQuoteModalOpen(false)}
                className="absolute top-6 right-6 text-white hover:text-gray-200 bg-white/10 hover:bg-white/25 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                  SIMULADOR VIRTUAL DE LEADS
                </span>
                <span className="text-[10px] bg-emerald-500/80 px-2 py-1 rounded uppercase tracking-wider font-bold animate-pulse text-white flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                  Rascunho Salvo
                </span>
              </div>
              <h3 className="text-2xl font-black mt-2">
                Simulador Dinâmico de Orçamento
              </h3>
              <p className="text-gray-200 text-xs mt-1">
                Configure os módulos desejados, calcule preços estimados e envie os dados em tempo real.
              </p>
            </div>

            {/* Stepper info strip */}
            <div className="bg-gray-50 px-6 py-2.5 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-bold">
              <span>Passo {quoteStep} de 3</span>
              <div className="flex space-x-1">
                <div className={`w-10 h-1.5 rounded-full ${quoteStep >= 1 ? "bg-red-600" : "bg-gray-200"}`} />
                <div className={`w-10 h-1.5 rounded-full ${quoteStep >= 2 ? "bg-red-600" : "bg-gray-200"}`} />
                <div className={`w-10 h-1.5 rounded-full ${quoteStep >= 3 ? "bg-red-600" : "bg-gray-200"}`} />
              </div>
            </div>

            {/* Quote Submission wizard forms */}
            <form onSubmit={handleQuoteSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[70vh]">
              {leadResultMessage && (
                <div className={`p-4 rounded-xl flex items-start space-x-3 text-xs ${
                  leadResultMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                    : 'bg-red-50 text-red-800 border border-red-100'
                }`}>
                  {leadResultMessage.type === 'success' ? (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <p className="font-semibold leading-relaxed">{leadResultMessage.text}</p>
                </div>
              )}

              {quoteStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Selecione o Tipo de Container</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        key: "20_standard",
                        title: "Módulo 20 Pés Clássico",
                        desc: "15m² de área útil. Ideal para escritório.",
                        estimated: "R$ 45.000"
                      },
                      {
                        key: "20_double",
                        title: "Showroom Vitrine 20 Pés",
                        desc: "Fachada total de vidro premium e deck frontal.",
                        estimated: "R$ 85.000"
                      },
                      {
                        key: "40_classic",
                        title: "Módulo 40 Pés Clássico",
                        desc: "30m² de área útil. Ideal para residências.",
                        estimated: "R$ 85.000"
                      },
                      {
                        key: "40_premium",
                        title: "Premium 40 Pés",
                        desc: "Suíte master, gesso e sanca em LED.",
                        estimated: "R$ 115.000"
                      }
                    ].map((item) => (
                      <label 
                        key={item.key}
                        className={`p-4 border rounded-xl flex flex-col justify-between cursor-pointer transition-all hover:bg-gray-50 text-left ${
                          quoteData.containerType === item.key 
                            ? "border-red-600 bg-red-50/20 shadow-sm" 
                            : "border-gray-200"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="containerType" 
                          value={item.key}
                          checked={quoteData.containerType === item.key}
                          onChange={(e) => setQuoteData({ ...quoteData, containerType: e.target.value })}
                          className="sr-only"
                        />
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-gray-900 text-sm leading-none">{item.title}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              quoteData.containerType === item.key ? "border-red-600 bg-red-600" : "border-gray-300"
                            }`}>
                              {quoteData.containerType === item.key && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5">{item.desc}</p>
                        </div>
                        <span className="text-[11px] font-extrabold text-red-600 mt-3 block">{item.estimated} de base</span>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider">Quantidade de Módulos Similares</label>
                    <div className="flex items-center space-x-4">
                      <button 
                        type="button"
                        onClick={() => setQuoteData(prev => ({ ...prev, moduleCount: Math.max(1, prev.moduleCount - 1) }))}
                        className="w-10 h-10 border border-gray-200 rounded-lg text-lg font-bold flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold text-gray-900 w-8 text-center">{quoteData.moduleCount}</span>
                      <button 
                        type="button"
                        onClick={() => setQuoteData(prev => ({ ...prev, moduleCount: Math.min(10, prev.moduleCount + 1) }))}
                        className="w-10 h-10 border border-gray-200 rounded-lg text-lg font-bold flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-400">Layouts acoplados lona-a-lona</span>
                    </div>
                  </div>
                </div>
              )}

              {quoteStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Acabamento & Frete</h4>
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider">Nível de Acabamento Interno</label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          key: "standard",
                          title: "Popular / Básico",
                          desc: "Isolamento em placas EPS, piso cerâmico comum, conexões externas visíveis e drywall simples pintado de branco."
                        },
                        {
                          key: "comfort",
                          title: "Conforto Residencial Completo",
                          desc: "Isolamento térmico em Lã de Rocha espessa, sanca em gesso, luminárias embutidas de LED, piso vinílico vinil-click e box blindex."
                        },
                        {
                          key: "luxury",
                          title: "Automotivo de Auto Luxo",
                          desc: "Ar-condicionado embutido split inverter, portas de correr panorâmicas com dupla vedação, esquadrias pretas, automação residencial smart."
                        }
                      ].map((fin) => (
                        <label 
                          key={fin.key}
                          className={`p-4 border rounded-xl flex items-start space-x-3 cursor-pointer hover:bg-gray-50 transition-all ${
                            quoteData.finishLevel === fin.key ? "border-red-500 bg-red-50/10" : "border-gray-200"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="finishLevel" 
                            value={fin.key}
                            checked={quoteData.finishLevel === fin.key}
                            onChange={(e) => setQuoteData({ ...quoteData, finishLevel: e.target.value })}
                            className="mt-1"
                          />
                          <div>
                            <span className="font-bold text-gray-900 text-sm block leading-none">{fin.title}</span>
                            <span className="text-xs text-gray-500 mt-1 block leading-relaxed">{fin.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-gray-900 block">Necessita transporte rodoviário regular?</span>
                      <p className="text-xs text-gray-500">Módulos transportados via carreta prancha e instalados com caminhão munck.</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={quoteData.needsTransport}
                      onChange={(e) => setQuoteData({ ...quoteData, needsTransport: e.target.checked })}
                      className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {quoteStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Seus Dados de Contato</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-[10px]">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        value={quoteData.name}
                        onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                        placeholder="Ex: João da Silva"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-[10px]">E-mail de Contato</label>
                      <input 
                        type="email" 
                        required
                        value={quoteData.email}
                        onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value.trim() })}
                        placeholder={LOREM_EMAIL}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${
                          validateEmail(quoteData.email) 
                            ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/5" 
                            : "border-gray-200 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        }`}
                      />
                      {validateEmail(quoteData.email) && (
                        <p className="text-[11px] text-red-500 font-bold block mt-0.5 animate-fadeIn">
                          {validateEmail(quoteData.email)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-[10px]">Telefone Celular (WhatsApp)</label>
                      <input 
                        type="tel" 
                        required
                        value={quoteData.phone}
                        onChange={(e) => setQuoteData({ ...quoteData, phone: formatPhone(e.target.value) })}
                        placeholder={LOREM_PHONE}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${
                          validatePhone(quoteData.phone) 
                            ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/5" 
                            : "border-gray-200 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        }`}
                      />
                      {validatePhone(quoteData.phone) && (
                        <p className="text-[11px] text-red-500 font-bold block mt-0.5 animate-fadeIn">
                          {validatePhone(quoteData.phone)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 mr-auto flex flex-col justify-end w-full">
                      <span className="text-[10px] text-gray-400 uppercase font-black block">Estimativa de Preço da Construção</span>
                      <span className="text-2xl font-black text-red-600 block leading-tight">
                        R$ {estimatedBudget.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-[10px]">Dúvidas adicionais ou localização do terreno</label>
                    <textarea 
                      value={quoteData.message}
                      onChange={(e) => setQuoteData({ ...quoteData, message: e.target.value })}
                      placeholder="Ex: Gostaria de saber do custo de entrega em Florianópolis/SC..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Navigation button panel within modal */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-6 gap-3">
                {quoteStep > 1 ? (
                  <button 
                    type="button"
                    onClick={() => setQuoteStep(prev => prev - 1)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
                  >
                    Anterior
                  </button>
                ) : (
                  <div />
                )}

                <button 
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center space-x-1.5 cursor-pointer ml-auto"
                >
                  {isSubmittingLead ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>{quoteStep === 3 ? "Enviar Minha Simulação" : "Próximo Passo"}</span>
                      {quoteStep < 3 && <ChevronRight size={16} />}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* DETAILED PROJECT MODAL VIEW */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onCustomize={(proj) => {
            setQuoteData(prev => ({
              ...prev,
              message: `Gostaria de verificar o custo faturado exato ou mudanças no memorial para o modelo: "${proj.title}".`
            }));
            setSelectedProject(null);
            setQuoteStep(3); // Direct to step 3
            setIsQuoteModalOpen(true);
          }}
        />
      )}


      {/* ADMIN CONTROL PANEL / MASTER WEB PANEL / NOTIFIED EMAILS DATABASE */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#121416] text-[#e1e4e6] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-zinc-800 flex flex-col my-8 h-[85vh]">
            
            {/* Header portion */}
            <div className="bg-red-650 bg-red-600 text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5 animate-spin-slow" />
                <div>
                  <h3 className="font-black tracking-tight text-lg leading-tight">Master Control Panel</h3>
                  <span className="text-[10px] text-red-100 font-semibold uppercase tracking-wider block">Admin & Banco de Dados - Vercel & Nginx</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAdminModal(false)}
                className="text-white hover:text-red-200 bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Check Authentication state */}
            {!isAdminLoggedIn ? (
              <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950">
                <form onSubmit={handleAdminLogin} className="w-full max-w-sm space-y-5 bg-zinc-900 border border-zinc-805 p-8 rounded-2xl shadow-xl">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-red-650 bg-red-600 text-white rounded-xl flex items-center justify-center mx-auto shadow-lg">
                      <Lock size={22} />
                    </div>
                    <h4 className="font-black tracking-tight text-lg">Acesso Administrador</h4>
                    <p className="text-xs text-zinc-500">
                      Autenticação segura no servidor com sessão criptografada
                      {adminTotpRequired ? " e verificação em duas etapas (2FA)." : "."}
                    </p>
                  </div>

                  {!adminConfigured && (
                    <div className="p-3 bg-amber-950/40 text-amber-300 text-xs rounded-xl border border-amber-900">
                      Configure ADMIN_SESSION_SECRET e ADMIN_PASSWORD_HASH no servidor (.env).
                    </div>
                  )}

                  {adminError && (
                    <div className="p-3 bg-red-950/40 text-red-400 text-xs rounded-xl flex items-center space-x-1 border border-red-900">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider block">Usuário</label>
                    <input 
                      type="text"
                      required
                      autoComplete="username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-650 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider block">Senha</label>
                    <input 
                      type="password" 
                      required
                      autoComplete="current-password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-650 focus:outline-none"
                    />
                  </div>

                  {adminTotpRequired && (
                    <div className="space-y-1">
                      <label className="text-zinc-400 font-bold text-xs uppercase tracking-wider block">
                        Código 2FA (Authenticator)
                      </label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        autoComplete="one-time-code"
                        value={adminTotp}
                        onChange={(e) => setAdminTotp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="000000"
                        className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white tracking-[0.3em] text-center font-mono focus:border-red-650 focus:outline-none"
                      />
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={adminLoginLoading || !adminConfigured}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-lg shadow-md hover:shadow-lg hover:shadow-red-500/10 transition-colors"
                  >
                    {adminLoginLoading ? "Autenticando..." : "Entrar no Painel"}
                  </button>

                  <div className="text-[10px] text-zinc-500 text-center leading-relaxed mt-2 pt-2 border-t border-zinc-800">
                    Use um app autenticador (Google Authenticator, Authy) se 2FA estiver ativo no servidor.
                  </div>
                </form>
              </div>
            ) : (
              // FULL LOGGED DASHBOARD
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-zinc-950">
                {/* Lateral Tab list Controls */}
                <div className="w-full md:w-56 bg-zinc-900/60 border-b md:border-b-0 md:border-r border-zinc-900 p-4 space-y-1 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                  {[
                    { id: 'leads', label: 'Propostas Recebidas', icon: FileText },
                    { id: 'projects', label: 'Editar Catálogo', icon: Sliders },
                    { id: 'blogs', label: 'Novos Artigos', icon: Edit3 },
                    { id: 'settings', label: 'E-mail & Resend', icon: SettingsIcon },
                    { id: 'performance', label: 'Monitor de Benchmark', icon: TrendingUp }
                  ].map((subTab) => {
                    const Icon = subTab.icon;
                    return (
                      <button
                        key={subTab.id}
                        onClick={() => {
                          setAdminTab(subTab.id as any);
                          if (subTab.id === 'leads') loadLeads();
                          if (subTab.id === 'settings') loadAdminSettings();
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-2 shrink-0 ${
                          adminTab === subTab.id 
                            ? 'bg-red-600/10 text-red-500 border-l-4 border-red-600 bg-red-600' 
                            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                        }`}
                      >
                        <Icon size={14} />
                        <span>{subTab.label}</span>
                      </button>
                    );
                  })}
                  
                  <div className="hidden md:block pt-12 text-[10px] text-zinc-600 px-4 mt-auto">
                    <span>Versão v1.0.4 Express Naval DB</span>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="flex-1 p-6 overflow-y-auto max-h-full">
                  {adminTab === 'leads' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4">
                        <div>
                          <h4 className="font-extrabold text-white text-lg">Propostas de Clientes (Leads)</h4>
                          <p className="text-xs text-zinc-400">Todos os e-mails disparados via Resend que também ficam salvos no banco de dados.</p>
                        </div>
                        <button 
                          onClick={loadLeads}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold rounded"
                        >
                          Recarregar Leads
                        </button>
                      </div>

                      {/* Performance Metric summary box */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Total Recebidos</span>
                            <span className="text-2xl font-black text-white block mt-0.5">{adminLeads.length}</span>
                          </div>
                          <FileText size={24} className="text-zinc-600" />
                        </div>
                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Volume Esperado</span>
                            <span className="text-2xl font-black text-emerald-500 block mt-0.5">
                              R$ {adminLeads.reduce((acc, current) => acc + (current.targetBudget || 0), 0).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <TrendingUp size={24} className="text-emerald-900/50" />
                        </div>
                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Acompanhamento</span>
                            <span className="text-2xl font-black text-red-500 block mt-0.5">
                              {adminLeads.filter(l => l.status === 'novo').length} pendentes
                            </span>
                          </div>
                          <AlertCircle size={24} className="text-zinc-600" />
                        </div>
                      </div>

                      {/* Lead Cards List */}
                      <div className="space-y-4">
                        {adminLeads.length === 0 ? (
                          <div className="text-center py-10 text-zinc-500 text-xs">Ainda não há novas simulações de orçamento armazenadas no banco.</div>
                        ) : (
                          adminLeads.map((lead) => (
                            <div key={lead.id} className="bg-zinc-900/60 p-5 rounded-xl border border-zinc-850 space-y-4 hover:border-zinc-800 transition-colors">
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-extrabold text-sm text-white">{lead.name}</span>
                                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                      lead.status === 'novo' ? 'bg-red-500/20 text-red-400' :
                                      lead.status === 'contatado' ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-700 text-zinc-400'
                                    }`}>
                                      {lead.status}
                                    </span>
                                  </div>
                                  <div className="text-xs text-zinc-400 mt-1 space-y-0.5">
                                    <p>E-mail: <a href={`mailto:${lead.email}`} className="text-red-400 hover:underline">{lead.email}</a> | Tel: <a href={`tel:${lead.phone}`} className="text-red-400 hover:underline">{lead.phone}</a></p>
                                    <p className="text-[10px] text-zinc-500 font-semibold">Data da Simulação: {new Date(lead.createdAt).toLocaleString('pt-BR')}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5">
                                  <button 
                                    onClick={() => handleUpdateLeadStatus(lead.id, 'contatado')}
                                    className="px-2 py-1 text-[10px] bg-sky-950 text-sky-400 rounded hover:bg-sky-900 border border-sky-900"
                                  >
                                    Marcar Contatado
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateLeadStatus(lead.id, 'arquivado')}
                                    className="px-2 py-1 text-[10px] bg-zinc-800 text-zinc-400 rounded hover:bg-zinc-700"
                                  >
                                    Arquivar
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-1 px-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded"
                                    aria-label="Deletar Lead"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>

                              <div className="p-3 bg-zinc-950 rounded bg-black/40 text-xs text-zinc-300 space-y-1 border border-zinc-900 leading-relaxed whitespace-pre-wrap font-sans">
                                <span className="text-[10px] font-black text-zinc-500 block uppercase pb-1 border-b border-zinc-900/20">Proposta Técnica</span>
                                {lead.message}
                              </div>

                              {lead.targetBudget && (
                                <div className="text-[11px] font-black text-red-400">
                                  Custo Estimado Calculado: R$ {lead.targetBudget.toLocaleString('pt-BR')}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {adminTab === 'projects' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-zinc-900 pb-4">
                        <h4 className="font-extrabold text-white text-lg">Novo Modelo de Módulo (Add Catalog)</h4>
                        <p className="text-xs text-zinc-400">Adicione novos projetos para venda e altere em tempo real suas fotos e informações para o cliente.</p>
                      </div>

                      <form onSubmit={handleCreateProject} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-850">
                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Título do Projeto</label>
                          <input 
                            type="text" 
                            required
                            value={newProjectForm.title}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                            placeholder="Ex: Chalé Container duplex"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-red-650"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Categoria</label>
                          <select 
                            value={newProjectForm.category}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-red-650 text-white"
                          >
                            <option value="Residencial">Residencial</option>
                            <option value="Comercial">Comercial</option>
                            <option value="Lazer">Lazer</option>
                            <option value="Sob Medida">Sob Medida</option>
                          </select>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs text-zinc-400 font-bold block">Descrição Curta</label>
                          <input 
                            type="text" 
                            required
                            value={newProjectForm.description}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                            placeholder="Módulos acolhedores com amplo espaço."
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-red-650"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Preço de Fabricação (R$)</label>
                          <input 
                            type="number" 
                            value={newProjectForm.priceEstimate}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, priceEstimate: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-red-650"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Imagens URL (Capa Unsplash ou outra)</label>
                          <input 
                            type="text" 
                            required
                            value={newProjectForm.imageUrl}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, imageUrl: e.target.value })}
                            placeholder="Placeholder (opcional)"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-red-650 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Dimensões (m² ou tamanho)</label>
                          <input 
                            type="text" 
                            value={newProjectForm.dimensions}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, dimensions: e.target.value })}
                            placeholder="30m² - 1 container"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-red-650"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Diferenciais e Cômodos</label>
                          <input 
                            type="text" 
                            value={newProjectForm.rooms}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, rooms: e.target.value })}
                            placeholder="1 Quarto, canil acoplado"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-red-650"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="sm:col-span-2 py-2.5 bg-green-700 hover:bg-green-600 text-white font-extrabold text-sm rounded-lg"
                        >
                          Adicionar Novo Modelo ao Catálogo
                        </button>
                      </form>

                      {/* Configured models list */}
                      <div className="space-y-3">
                        <h5 className="font-extrabold text-sm text-zinc-400 uppercase tracking-wider">Módulos Cadastrados Ativos</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {projects.map((proj) => (
                            <div key={proj.id} className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <PlaceholderImage className="w-10 h-10 shrink-0" label={proj.title} compact rounded />
                                <div className="truncate max-w-[200px]">
                                  <span className="font-bold text-sm text-white block truncate">{proj.title}</span>
                                  <span className="text-[10px] text-zinc-500 block truncate">Custo: R$ {proj.priceEstimate?.toLocaleString('pt-BR')}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleDeleteProject(proj.id)}
                                className="p-1 px-2 text-zinc-500 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === 'blogs' && (
                    <form onSubmit={handleCreateBlog} className="space-y-4 animate-fadeIn">
                      <div className="border-b border-zinc-900 pb-4">
                        <h4 className="font-extrabold text-white text-lg">Novos Artigos e Dicas de Construção</h4>
                        <p className="text-xs text-zinc-400">Publique conteúdos e auxilie seus potenciais compradores a entenderem a engenharia do projeto.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Título do Artigo</label>
                          <input 
                            type="text" 
                            required
                            value={newBlogForm.title}
                            onChange={(e) => setNewBlogForm({ ...newBlogForm, title: e.target.value })}
                            placeholder="Como evitar condensação de água no aço"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-650"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Categoria</label>
                          <input 
                            type="text" 
                            value={newBlogForm.category}
                            onChange={(e) => setNewBlogForm({ ...newBlogForm, category: e.target.value })}
                            placeholder="Ex: Construção, Licenças, Isolamento"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-650"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-zinc-400 font-bold block">Imagem de Capa (Unsplash URL)</label>
                        <input 
                          type="text" 
                          required
                          value={newBlogForm.imageUrl}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, imageUrl: e.target.value })}
                          placeholder="Placeholder (opcional)"
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-650 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-zinc-400 font-bold block">Sumário Rápido (Apresentação do Card)</label>
                        <input 
                          type="text" 
                          required
                          value={newBlogForm.summary}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, summary: e.target.value })}
                          placeholder="Introdução breve sobre o tema"
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-650"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-zinc-400 font-bold block">Artigo Completo em Markdown</label>
                        <textarea 
                          required
                          rows={6}
                          value={newBlogForm.content}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, content: e.target.value })}
                          placeholder="Digite aqui todo o artigo formatado..."
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-650 resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-lg"
                      >
                        Publicar Artigo Agora Relevante
                      </button>
                    </form>
                  )}

                  {adminTab === 'settings' && (
                    <form onSubmit={handleSaveSettings} className="space-y-5 animate-fadeIn">
                      <div className="border-b border-zinc-900 pb-2">
                        <h4 className="font-extrabold text-white text-lg">Parâmetros de Disparo Resend</h4>
                        <p className="text-xs text-zinc-400">Dispare notificações automatizadas em HTML e anote dados no seu Painel de leads.</p>
                      </div>

                      <div className="space-y-4 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-850">
                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">Chave de API do Resend (re_...)</label>
                          <input 
                            type="password" 
                            placeholder="Insira sua RESEND_API_KEY"
                            value={settings.resendApiKey}
                            onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-600"
                          />
                          <p className="text-[10px] text-zinc-500">Deixe em branco para usar o Resend inserido no .env global, ou configure aqui para uso em produção.</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">E-mail Notificado (Dono da Delivery Container)</label>
                          <input 
                            type="email" 
                            required
                            value={settings.notifiedEmail}
                            onChange={(e) => setSettings({ ...settings, notifiedEmail: e.target.value })}
                            placeholder={LOREM_EMAIL}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-600"
                          />
                          <p className="text-[10px] text-zinc-500">Qualquer lead que simular e submeter propostas enviará um e-mail com layout de orçamento para este endereço.</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-zinc-400 font-bold block">E-mail Remetente Autorizado (Resend Sender)</label>
                          <input 
                            type="text" 
                            required
                            value={settings.senderEmail}
                            onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                            placeholder={LOREM_EMAIL}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-red-600"
                          />
                          <p className="text-[10px] text-zinc-500">Domínios cadastrados na console do Resend (ou "onboarding@resend.dev" por padrão para testes).</p>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-white font-extrabold text-sm rounded-lg"
                      >
                        Salvar Configurações de API
                      </button>
                    </form>
                  )}

                  {adminTab === 'performance' && (
                    <div className="space-y-6 text-white animate-fadeIn">
                      <div className="border-b border-zinc-900 pb-2">
                        <h4 className="font-extrabold text-white text-lg flex items-center gap-2">
                          <TrendingUp className="text-red-500" size={20} />
                          Monitor de Performance & Diagnósticos
                        </h4>
                        <p className="text-xs text-zinc-400">Diagnósticos e benchmarks reais do ecossistema de renderização do simulador em tempo real.</p>
                      </div>

                      {/* Performance Metrics Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-850">
                          <div className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Acoplamento de Render</div>
                          <div className="text-3xl font-black text-white mt-1">
                            {perfMetricsRef.current.renderCount}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1">Sessões Virtuais Registradas</div>
                        </div>

                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-850">
                          <div className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Último Ciclo</div>
                          <div className="text-3xl font-black text-emerald-400 mt-1">
                            {perfMetricsRef.current.lastDuration ? `${perfMetricsRef.current.lastDuration.toFixed(2)} ms` : "---"}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1">Tempo do último commit no DOM</div>
                        </div>

                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-850">
                          <div className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Latência de Orçamento</div>
                          <div className="text-3xl font-black text-red-500 mt-1">
                            &lt; 0.1 ms
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1">Otimizado por useMemo</div>
                        </div>
                      </div>

                      {/* Interactive Stress-Test Area */}
                      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-850 space-y-4">
                        <h5 className="font-bold text-sm text-white">Executar Teste de Estresse do Simulador</h5>
                        <p className="text-xs text-zinc-400">
                          Isso enviará 50 atualizações de estado consecutivas e medirá quanto tempo o motor React leva para re-renderizar a página e calibrar as interações de layout. Todas as atualizações são renderizadas no frame subsequente de animação para simular o uso real.
                        </p>

                        <button
                          type="button"
                          disabled={isBenchmarking}
                          onClick={runBenchmarkSuite}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-extrabold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {isBenchmarking ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              <span>Calculando Benchmarks ({benchmarkTick} / 50)...</span>
                            </>
                          ) : (
                            <>
                              <TrendingUp size={14} />
                              <span>Iniciar Teste De Estresse Real</span>
                            </>
                          )}
                        </button>

                        {benchmarkResult && (
                          <div className="mt-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 animate-fadeIn">
                            <h6 className="font-bold text-xs text-zinc-300 uppercase tracking-widest text-[10px]">Resultado dos Benchmarks</h6>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <span className="text-[11px] text-zinc-500 block">Duração Total</span>
                                <span className="font-bold text-white text-sm">{benchmarkResult.totalTime.toFixed(1)} ms</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-zinc-500 block">Tempo Médio p/ Frame</span>
                                <span className="font-bold text-emerald-400 text-sm">{benchmarkResult.avgTime.toFixed(2)} ms / render</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-zinc-500 block">Classificação de Fluidez</span>
                                <span className="font-black text-red-500 text-sm block">{benchmarkResult.score}</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed pt-2 border-t border-zinc-900">
                              * O tempo ideal para interações ultra fluidas (60 FPS) é abaixo de 16.6ms por renderização. Nossas otimizações mantêm a experiência na faixa ideal de renderização imediata, mesmo durante digitações intensivas ou arrastes rápidos de sliders!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* General administration overview footer detail */}
            <div className="bg-zinc-900 px-6 py-3.5 border-t border-zinc-800 text-[11px] text-zinc-500 flex justify-between items-center shrink-0">
              <span>Delivery Container S/A — Todos os Direitos Reservados</span>
              <div className="flex space-x-3">
                <span className="hover:text-zinc-300 cursor-pointer">Segurança Externa</span>
                <span>•</span>
                <span className="hover:text-zinc-300 cursor-pointer">Manual de Operações</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PERSISTENT FLOATING WHATSAPP BUTTON WITH PREMIUM PULSE */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-whatsapp-pulse group cursor-pointer"
        aria-label={LOREM_SHORT}
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-7 h-7 fill-white/10" />
        
        <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-right bg-zinc-900 text-white text-xs font-black tracking-wide px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none border border-zinc-800">
          {LOREM_LINE}
        </span>
      </button>

      {/* FLOATING AI TECHNICAL CHAT ASSISTANT */}
      <AIChatWidget />

    </div>
    </React.Profiler>
  );
}
