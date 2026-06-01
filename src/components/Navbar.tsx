/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Menu, X, Settings, LogIn, Sparkles, Sun, Moon } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenModelos: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Navbar = React.memo(function Navbar({
  currentTab,
  setCurrentTab,
  onOpenModelos,
  onOpenAdmin,
  isAdminLoggedIn,
  onLogout,
  darkMode,
  onToggleDarkMode
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Track window scroll state
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // invoke initially
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Produtos", id: "produtos" }, // "Produtos" points to Modelos Grid on Home
    { label: "Projetos", id: "projetos" }, // Section inside catalog
    { label: "Blogs", id: "blogs" },
    { label: "Contact", id: "contact" }
  ];

  // Dynamically track current section when scrolling on homepage
  React.useEffect(() => {
    if (currentTab === "blogs") {
      setActiveSection("blogs");
      return;
    }

    // Default to 'home'
    setActiveSection("home");

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // triggers when section dominates key viewport center
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const targetIds = ["home", "produtos", "projetos", "contact"];
    const elements: HTMLElement[] = [];

    targetIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
      observer.disconnect();
    };
  }, [currentTab]);

  const handleNavClick = (id: string) => {
    if (id === "blogs") {
      setCurrentTab("blogs");
      setActiveSection("blogs");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentTab("home");
      setActiveSection(id);

      if (currentTab === "blogs") {
        // Wait for home page to render, then scroll to section
        setTimeout(() => {
          if (id === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            const section = document.getElementById(id);
            if (section) {
              section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        }, 150);
      } else {
        if (id === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const section = document.getElementById(id);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    }
    setIsOpen(false);
  };

  return (
    <header className={`w-full px-6 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 border-b ${
      isScrolled 
        ? "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md py-2.5 shadow-md border-gray-200/50 dark:border-neutral-800/80" 
        : "bg-white dark:bg-neutral-900 py-4 shadow-sm border-gray-100 dark:border-neutral-800"
    }`}>
      {/* Brand logo */}
      <div 
        onClick={() => handleNavClick("home")}
        className="cursor-pointer group shrink-0"
        id="nav-logo"
      >
        <Logo
          size={isScrolled ? "sm" : "md"}
          className="transform group-hover:scale-[1.02] transition-all duration-300"
        />
      </div>

      {/* Navigation links */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item, index) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={index}
              onClick={() => handleNavClick(item.id)}
              className={`font-semibold text-sm transition-all py-1 cursor-pointer duration-200 relative ${
                isActive 
                  ? "text-gray-900 dark:text-white border-b-2 border-red-600 font-bold" 
                  : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Header operations / control */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-lg border border-gray-250 dark:border-neutral-850 text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95 duration-200 cursor-pointer"
          aria-label="Alternar tema"
          id="theme-toggle-btn"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {isAdminLoggedIn ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1.5 px-4 py-2 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-950/40 transition-all duration-200 active:scale-95"
            >
              <Settings size={15} className="animate-spin-slow" />
              <span>Painel</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-xs text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 transition-colors font-medium border border-gray-200 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              Sair
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center space-x-1 px-4 py-2 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all active:scale-95 duration-200"
          >
            <LogIn size={15} />
            <span>Painel</span>
          </button>
        )}
        
        <button
          onClick={onOpenModelos}
          className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 font-bold text-sm rounded-lg shadow-md hover:shadow-lg hover:shadow-red-500/10 active:scale-95 transition-all duration-300 flex items-center space-x-1.5"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>Ver Modelos</span>
        </button>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-gray-600 dark:text-neutral-300 md:hidden hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className={`absolute left-0 w-full bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 shadow-xl flex flex-col p-6 space-y-4 md:hidden z-40 transition-all duration-300 animate-fadeIn ${
          isScrolled ? "top-[54px]" : "top-[73px]"
        }`}>
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={index}
                onClick={() => handleNavClick(item.id)}
                className={`text-left font-semibold py-2 border-b border-gray-50 dark:border-neutral-800/60 text-base transition-colors ${
                  isActive ? "text-red-600 font-bold" : "text-gray-700 dark:text-neutral-300 hover:text-red-500 dark:hover:text-red-400"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {!isAdminLoggedIn && (
            <button
              onClick={() => { setIsOpen(false); onOpenAdmin(); }}
              className="flex items-center space-x-2 text-left font-semibold text-gray-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 py-2"
            >
              <LogIn size={16} />
              <span>Entrar no Painel</span>
            </button>
          )}

          {/* Mobile Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center space-x-2 text-left font-semibold text-gray-600 dark:text-neutral-350 hover:text-red-650 dark:hover:text-red-450 py-2.5 border-t border-gray-100 dark:border-neutral-800 mt-2 pt-3"
          >
            {darkMode ? (
              <>
                <Sun size={16} className="text-amber-500" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon size={16} className="text-zinc-400" />
                <span>Modo Escuro</span>
              </>
            )}
          </button>
        </div>
      )}
    </header>
  );
})

export default Navbar;
