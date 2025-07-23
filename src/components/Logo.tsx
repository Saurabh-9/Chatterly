import { MessageCircle, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = "md", showText = true, className }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className={cn(
        "relative bg-gradient-primary rounded-2xl flex items-center justify-center animate-glow-pulse shadow-glow",
        sizeClasses[size]
      )}>
        <MessageCircle className={cn(
          "text-primary-foreground",
          size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"
        )} />
        <Sparkles className={cn(
          "absolute -top-1 -right-1 text-yellow-300 animate-pulse",
          size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5"
        )} />
        <Zap className={cn(
          "absolute -bottom-1 -left-1 text-blue-300 animate-bounce",
          size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
        )} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            "font-space font-bold text-foreground leading-none drop-shadow-sm",
            textSizeClasses[size]
          )}>
            Chatterly
          </h1>
          <p className={cn(
            "text-muted-foreground font-inter leading-none",
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
          )}>
            Connect • Chat • Create
          </p>
        </div>
      )}
    </div>
  );
};