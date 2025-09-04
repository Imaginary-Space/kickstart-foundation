import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = "md",
  className 
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "transition-colors",
            readonly 
              ? "cursor-default" 
              : "cursor-pointer hover:scale-110 transition-transform"
          )}
          onClick={() => handleStarClick(star)}
          disabled={readonly}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300 hover:text-yellow-400"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;