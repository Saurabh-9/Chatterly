import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";

interface ChatBubbleProps {
  message: string;
  sender: string;
  timestamp: Timestamp;
  isCurrentUser: boolean;
  isSticker?: boolean;
  className?: string;
}

export const ChatBubble = ({ 
  message, 
  sender, 
  timestamp, 
  isCurrentUser,
  isSticker = false,
  className 
}: ChatBubbleProps) => {
  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div 
      className={cn(
        "flex w-full animate-bounce-in group",
        isCurrentUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div className={cn(
        "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md font-inter relative",
        "transition-all duration-300 hover:shadow-glow group-hover:scale-[1.02]",
        isSticker && "px-2 py-2 bg-gradient-sticker border-2 border-primary/20",
        !isSticker && isCurrentUser && "bg-gradient-primary text-primary-foreground rounded-br-sm shadow-lg",
        !isSticker && !isCurrentUser && "bg-chat-bubble-received text-chat-bubble-received-foreground border border-border/50 rounded-bl-sm backdrop-blur-sm"
      )}>
        {!isCurrentUser && (
          <div className="text-xs font-semibold text-primary mb-1 font-space">
            {sender}
          </div>
        )}
        {isSticker ? (
          <div className="flex flex-col items-center text-center">
            <span className="text-5xl mb-2 animate-sticker-bounce hover:scale-110 transition-transform cursor-pointer">{message}</span>
            <span className="text-xs font-medium text-primary-foreground/80">
              Sticker
            </span>
          </div>
        ) : (
          <div className="text-sm leading-relaxed break-words">
            {message}
          </div>
        )}
        <div className={cn(
          "text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};