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
  return (
    <div
      className={`bg-gray-200 dark:bg-neutral-800 flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500 ${rounded ? "rounded-full" : ""} ${className}`}
      role="img"
      aria-label={label}
    >
      <ImageIcon
        className={compact ? "w-4 h-4 opacity-40" : "w-8 h-8 opacity-40 mb-1"}
        strokeWidth={1.5}
      />
      {!compact && (
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
          {label}
        </span>
      )}
    </div>
  );
});

export default PlaceholderImage;
