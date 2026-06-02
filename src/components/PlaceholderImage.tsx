import React from "react";
import { ImageIcon } from "lucide-react";

interface PlaceholderImageProps {
  className?: string;
  label?: string;
  rounded?: boolean;
  compact?: boolean;
}

const PlaceholderImage = React.memo(function PlaceholderImage({
  className = "",
  label = "Placeholder",
  rounded = false,
  compact = false,
}: PlaceholderImageProps) {
  // Dynamically resolve high-quality production placeholders from Unsplash
  const getUnsplashUrl = (term: string) => {
    const lower = term.toLowerCase();
    if (lower.includes("hero")) {
      return "https://images.unsplash.com/photo-1693515185000-ee4c3786ecea?q=80&w=1042&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Premium Container House Exterior
    }
    if (lower.includes("juliana") || lower.includes("amanda")) {
      return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"; // Female Client Avatar
    }
    if (lower.includes("carlos") || lower.includes("ricardo") || lower.includes("fernando")) {
      return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"; // Male Client Avatar
    }
    if (lower.includes("duplex") || lower.includes("chácara")) {
      return "https://images.unsplash.com/photo-1631215320889-7cf5eb3224f8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbnRhaW5lciUyMGhvdXNlfGVufDB8fDB8fHww"; // Luxury Modular Architecture
    }
    if (lower.includes("industrial") || lower.includes("escritório")) {
      return "https://images.unsplash.com/photo-1745566589290-d678de04f990?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29udGFpbmVyJTIwaG91c2V8ZW58MHx8MHx8fDA%3D"; // Modern Workspace / Office Container
    }
    if (lower.includes("artigo") || lower.includes("blog") || lower.includes("construção")) {
      return "https://www.thespruce.com/thmb/TaDe5BVo822vf69V2Qfl3QuG3FA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/yaryna-bakhovska-gVa3uv7dJoA-unsplash-543bc738774c4f3bbcc451997aa4f1bd.jpg"; // Engineering / Technical Blog Cover
    }
    // General high-end container living fallback
    return "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80";
  };

  const imageUrl = getUnsplashUrl(label);

  return (
    <div
      className={`relative bg-neutral-800 flex flex-col items-center justify-center overflow-hidden ${rounded ? "rounded-full" : ""} ${className}`}
      role="img"
      aria-label={label}
    >
      <img 
        src={imageUrl} 
        alt={label}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-90 group-hover:scale-105 group-hover:opacity-100"
        loading="lazy"
      />
      {/* Subtle overlay to guarantee text readability in grid overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      
      {compact && (
        <div className="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ImageIcon className="w-3 h-3 text-white/80" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
});

export default PlaceholderImage;