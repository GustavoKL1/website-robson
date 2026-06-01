import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
} as const;

const Logo = React.memo(function Logo({ className = "", size = "md" }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Delivery Container"
      className={`w-auto object-contain dark:invert dark:brightness-0 ${sizeClasses[size]} ${className}`}
    />
  );
});

export default Logo;
