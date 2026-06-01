import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  Maximize2, 
  Shield, 
  Thermometer, 
  Paintbrush, 
  Zap, 
  Check, 
  Compass, 
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { Project } from "../types";
import PlaceholderImage from "./PlaceholderImage";

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
  onCustomize: (project: Project) => void;
}

type SpecSection = "all" | "structure" | "insulation" | "finishing" | "systems";

const ProjectDetailsModal = React.memo(function ProjectDetailsModal({
  project,
  onClose,
  onCustomize
}: ProjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<SpecSection>("all");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, onClose]);

  // Dynamically map standard or custom specs to different categories
  const getCategorizedSpecs = () => {
    const rawSpecs = project.specs && project.specs.length > 0 
      ? project.specs 
      : [
          "Estrutura naval de aço corten impermeabilizada",
          "Isolamento térmo acústico com placas minerais especiais",
          "Paredes e revestimentos internos em gesso acartonado liso",
          "Banheiro completo com box Blindex temperado, sanitário e pia",
          "Piso vinílico click de alta durabilidade residencial",
          "Instalação pronta para 110V/220V e disjuntores dedicados"
        ];

    const structureKeywords = ["aço", "naval", "corten", "estrutura", "perfil", "blindagem", "solda"];
    const insulationKeywords = ["isolamento", "térmico", "acústico", "lã de rocha", "lã de vidro", "eps", "pu", "poliuretano", "placas minerais", "climatização"];
    const finishingKeywords = ["gesso", "revestimento", "piso", "vinílico", "drywall", "pintura", "box", "blindex", "sanitário", "pia", "acabamento", "granito", "torneira", "banheiro"];
    const systemsKeywords = ["elétrica", "hidráulica", "disjuntor", "fiação", "tomada", "interruptor", "split", "espera", "110v", "220v", "trifásica", "esgoto"];

    const structureList: string[] = [];
    const insulationList: string[] = [];
    const finishingList: string[] = [];
    const systemsList: string[] = [];

    rawSpecs.forEach(spec => {
      const lower = spec.toLowerCase();
      if (structureKeywords.some(keyword => lower.includes(keyword))) {
        structureList.push(spec);
      } else if (insulationKeywords.some(keyword => lower.includes(keyword))) {
        insulationList.push(spec);
      } else if (systemsKeywords.some(keyword => lower.includes(keyword))) {
        systemsList.push(spec);
      } else {
        // Fall back to finishing or distribute evenly
        finishingList.push(spec);
      }
    });

    // Make sure lists are not completely empty for fallback aesthetics
    if (structureList.length === 0) {
      structureList.push("Chassis de aço estrutural reforçado contra intempéries", "Estrutura naval de aço corten com tratamento antiferrugem");
    }
    if (insulationList.length === 0) {
      insulationList.push("Paredes preparadas com sanduíche termoacústico de alta barreira", "Conforto interno regulado independentemente do clima externo");
    }
    if (finishingList.length === 0) {
      finishingList.push("Acabamento de alto padrão pronto para pintura ou papel de parede", "Equadrias e aberturas em acabamento preto premium fosco");
    }
    if (systemsList.length === 0) {
      systemsList.push("Rede de escoamento rápido de água pluvial e esgoto", "Rede elétrica em conduítes antichamas normatizados");
    }

    return {
      all: rawSpecs,
      structure: structureList,
      insulation: insulationList,
      finishing: finishingList,
      systems: systemsList
    };
  };

  const specCategories = getCategorizedSpecs();

  return (
    <>
      {/* Lightbox Mode Overlay */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 transition-all duration-300">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-red-500 bg-white/10 hover:bg-white/20 p-3 rounded-full cursor-pointer transition-colors z-30"
            aria-label="Fechar zoom"
          >
            <X size={24} />
          </button>
          
          <div className="relative w-full max-w-5xl h-[75vh] flex items-center justify-center select-none">
            <PlaceholderImage className="w-full h-full max-h-[75vh] rounded-lg" label={project.title} />
          </div>
        </div>
      )}

      {/* Main Expanded Modal Drawer/Div */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden relative border border-gray-100 dark:border-neutral-800 flex flex-col my-4 md:my-8 max-h-[92vh]">
          {/* Top Close Bar button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-500 bg-black/45 hover:bg-black/80 p-2.5 rounded-full cursor-pointer transition-colors z-40"
            aria-label="Fechar modal"
            id="modal-close-btn"
          >
            <X size={18} />
          </button>

          {/* Modal Grid Body */}
          <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
            
            {/* Left Column: Premium Carousel View (5 cols on large screen) */}
            <div className="lg:col-span-5 bg-neutral-900 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800 lg:h-full lg:overflow-y-auto">
              
              {/* Carousel Content */}
              <div className="relative aspect-video lg:aspect-auto lg:flex-1 w-full bg-neutral-950 flex items-center justify-center overflow-hidden min-h-[280px] lg:min-h-[460px]">
                <PlaceholderImage className="absolute inset-0 w-full h-full" label={project.title} />

                {/* Image overlay bottom-gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Expand Image overlay Button */}
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-4 right-4 bg-black/60 hover:bg-red-600 text-white p-2 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center space-x-1.5 transition-all shadow cursor-pointer z-10"
                  title="Expandir Imagem"
                >
                  <Maximize2 size={13} />
                  <span className="hidden sm:inline">Zoom</span>
                </button>

                {/* Badge Category overlay */}
                <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded shadow">
                  {project.category}
                </span>
              </div>


              {/* Quick Specs Bento Row */}
              <div className="p-6 bg-neutral-900 border-t border-neutral-800 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-800/60 p-3 rounded-xl border border-neutral-700/30">
                    <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider block">Dimensões / Área</span>
                    <span className="text-white font-extrabold text-xs block mt-0.5">{project.dimensions || "30m²"}</span>
                  </div>
                  <div className="bg-neutral-800/60 p-3 rounded-xl border border-neutral-700/30">
                    <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider block">Quartos & Banho</span>
                    <span className="text-white font-extrabold text-xs block mt-0.5">{project.rooms || "1 Quarto"}</span>
                  </div>
                  <div className="bg-neutral-800/60 p-3 rounded-xl border border-neutral-700/30">
                    <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider block">Instalação de Fábrica</span>
                    <span className="text-white font-extrabold text-xs block mt-0.5">{project.deliveryTime || "45 dias"}</span>
                  </div>
                  <div className="bg-neutral-800/60 p-3 rounded-xl border border-neutral-700/20">
                    <span className="text-[9px] text-neutral-400 uppercase font-black tracking-wider block">Orçamento Base</span>
                    <span className="text-red-500 font-extrabold text-sm block mt-0.5">
                      {project.priceEstimate ? `R$ ${project.priceEstimate.toLocaleString("pt-BR")}` : "Sob Consulta"}
                    </span>
                  </div>
                </div>
              </div>

            </div>

             {/* Right Column: Descriptions & Detailed Spec Tabs Breakdown (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between lg:h-full lg:overflow-hidden bg-white dark:bg-neutral-900 select-text min-h-0">
              
              {/* Main Content Area: Split into two columns on larger screens to prevent overflow */}
              <div className="p-6 sm:p-8 lg:flex-1 lg:overflow-y-auto overflow-x-hidden min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Left Column: Descriptions & Info */}
                  <div className="space-y-6">
                    {/* Title & Short Description */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-snug mb-3">
                        {project.title}
                      </h3>
                      <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed font-normal bg-gray-50/50 dark:bg-neutral-850/20 p-4 rounded-xl border border-gray-100/50 dark:border-neutral-800/50">
                        {project.description}
                      </p>
                    </div>

                    {/* Factory warranty & Logistics card */}
                    <div className="bg-red-50/40 dark:bg-red-950/5 rounded-2xl p-5 border border-red-100 dark:border-red-900/20 flex items-start space-x-4">
                      <div className="bg-red-600 text-white p-3 rounded-xl mt-0.5 shrink-0">
                        <Layers size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-extrabold text-sm text-gray-900 dark:text-white leading-tight">Logística de Entrega Inclusa e Garantia de Fábrica</h5>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed">
                          Possuímos suporte completo para descarregamento por guindaste ou munck. Toda a blindagem metálica estrutural acompanha garantia contra oxidação estrutural e vazamentos hidráulicos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spec tabs: full width below description so tabs are not squeezed in half-column */}
                  <div className="space-y-4 md:col-span-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black uppercase text-gray-400 dark:text-neutral-550 tracking-widest mb-2.5">
                        Ficha Técnica & Memorial de Acabamento
                      </span>
                      
                      {/* Tabs Header */}
                      <div
                        role="tablist"
                        className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-5 gap-0 border-b border-gray-100 dark:border-neutral-850"
                      >
                        <button 
                          role="tab"
                          aria-selected={activeTab === "all"}
                          onClick={() => setActiveTab("all")}
                          className={`px-2 py-2 sm:px-2.5 sm:py-2.5 text-[11px] sm:text-xs font-extrabold border-b-2 transition-all cursor-pointer justify-center ${
                            activeTab === "all" 
                              ? "border-red-600 text-red-600 dark:text-red-500" 
                              : "border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white"
                          }`}
                        >
                          Visão Geral
                        </button>
                        <button 
                          role="tab"
                          aria-selected={activeTab === "structure"}
                          onClick={() => setActiveTab("structure")}
                          className={`px-2 py-2 sm:px-2.5 sm:py-2.5 text-[11px] sm:text-xs font-extrabold border-b-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === "structure" 
                              ? "border-red-600 text-red-600 dark:text-red-500" 
                              : "border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white"
                          }`}
                        >
                          <Shield size={13} />
                          <span>Estrutura</span>
                        </button>
                        <button 
                          role="tab"
                          aria-selected={activeTab === "insulation"}
                          onClick={() => setActiveTab("insulation")}
                          className={`px-2 py-2 sm:px-2.5 sm:py-2.5 text-[11px] sm:text-xs font-extrabold border-b-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === "insulation" 
                              ? "border-red-600 text-red-600 dark:text-red-500" 
                              : "border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white"
                          }`}
                        >
                          <Thermometer size={13} />
                          <span>Isolamento</span>
                        </button>
                        <button 
                          role="tab"
                          aria-selected={activeTab === "finishing"}
                          onClick={() => setActiveTab("finishing")}
                          className={`px-2 py-2 sm:px-2.5 sm:py-2.5 text-[11px] sm:text-xs font-extrabold border-b-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === "finishing" 
                              ? "border-red-600 text-red-600 dark:text-red-500" 
                              : "border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white"
                          }`}
                        >
                          <Paintbrush size={13} />
                          <span>Acabamento</span>
                        </button>
                        <button 
                          role="tab"
                          aria-selected={activeTab === "systems"}
                          onClick={() => setActiveTab("systems")}
                          className={`px-2 py-2 sm:px-2.5 sm:py-2.5 text-[11px] sm:text-xs font-extrabold border-b-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTab === "systems" 
                              ? "border-red-600 text-red-600 dark:text-red-500" 
                              : "border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white"
                          }`}
                        >
                          <Zap size={13} />
                          <span>Sistemas</span>
                        </button>
                      </div>
                    </div>

                    {/* Tabs Body Content */}
                    <div className="bg-gray-50 dark:bg-neutral-850/40 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 min-h-[180px] animate-fadeIn">
                      
                      {/* Header specific to tab */}
                      {activeTab === "all" && (
                        <p className="text-xs text-gray-400 dark:text-neutral-500 font-bold mb-4 uppercase tracking-wider">
                          Especificações Técnicas Completas do Container
                        </p>
                      )}
                      {activeTab === "structure" && (
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-red-300 mb-3 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-100/50 dark:border-red-900/30">
                          <Shield className="text-red-600 dark:text-red-400 w-4 h-4 shrink-0" />
                          <span className="text-xs font-black tracking-wide uppercase text-red-600 dark:text-red-400">Blindagem & Resistência Naval</span>
                        </div>
                      )}
                      {activeTab === "insulation" && (
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-red-300 mb-3 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-100/50 dark:border-red-900/30">
                          <Thermometer className="text-red-600 dark:text-red-400 w-4 h-4 shrink-0" />
                          <span className="text-xs font-black tracking-wide uppercase text-red-600 dark:text-red-400">Eficiência Térmoacústica</span>
                        </div>
                      )}
                      {activeTab === "finishing" && (
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-red-300 mb-3 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-100/50 dark:border-red-900/30">
                          <Paintbrush className="text-red-600 dark:text-red-400 w-4 h-4 shrink-0" />
                          <span className="text-xs font-black tracking-wide uppercase text-red-600 dark:text-red-400">Revestimentos & Acabamento Fino</span>
                        </div>
                      )}
                      {activeTab === "systems" && (
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-red-300 mb-3 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-100/50 dark:border-red-900/30">
                          <Zap className="text-red-600 dark:text-red-400 w-4 h-4 shrink-0" />
                          <span className="text-xs font-black tracking-wide uppercase text-red-600 dark:text-red-400">Redes Elétricas, Hidráulicas e Ar</span>
                        </div>
                      )}

                      {/* Spec List under Active Tab */}
                      <div className="space-y-3">
                        {specCategories[activeTab].map((spec, idx) => (
                          <div key={idx} className="flex items-start space-x-3 text-sm">
                             <div className="p-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                              <Check size={14} className="stroke-[3]" />
                            </div>
                            <span className="text-gray-750 dark:text-neutral-350 leading-normal font-medium">{spec}</span>
                          </div>
                        ))}
                      </div>

                      {/* Additional standard manufacture certifications */}
                      <div className="mt-5 border-t border-gray-250/60 dark:border-neutral-800/80 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-gray-400 dark:text-neutral-550 gap-2">
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 size={12} className="text-gray-400 dark:text-neutral-500" />
                          <span>Aço Marítimo de Alta Resistência (Corten AA)</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 size={12} className="text-gray-400 dark:text-neutral-500" />
                          <span>Atende Normas ABNT de Isolamento Térmico</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Bottom Actions */}
              <div className="p-6 bg-gray-50 dark:bg-neutral-850/40 border-t border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="text-xs text-gray-400 dark:text-neutral-500 text-left w-full sm:w-auto">
                  <span>Incluso faturamento em até 10x ou BNDES para empresas.</span>
                </div>
                <div className="flex space-x-2.5 w-full sm:w-auto">
                  <button 
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-5 py-3 border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 font-extrabold rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button 
                    onClick={() => onCustomize(project)}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 group cursor-pointer"
                  >
                    <span>Solicitar Customização</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
})

export default ProjectDetailsModal;
