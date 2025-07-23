import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "./EmojiPicker";
import { StickerPanel } from "./StickerPanel";
import { useTyping } from "@/hooks/useTyping";
import { useAuth } from "@/hooks/useAuth";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onStickerSend: (sticker: { id: string; emoji: string; name: string }) => void;
  className?: string;
}

export const MessageInput = ({ onSendMessage, onStickerSend, className }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { startTyping, stopTyping } = useTyping(user);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (e.target.value.trim()) {
      startTyping();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      stopTyping();
    }
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleStickerSelect = (sticker: { id: string; emoji: string; name: string }) => {
    onStickerSend(sticker);
    stopTyping();
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  return (
    <div className={cn(
      "flex items-end gap-3 p-4 bg-card/95 border-t border-border/50",
      "backdrop-blur-md shadow-lg",
      className
    )}>
      <div className="flex items-center space-x-2">
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        <StickerPanel onStickerSelect={handleStickerSelect} />
      </div>
      
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message... ✨"
          className="min-h-[44px] max-h-[120px] resize-none bg-muted/50 border-border/50 focus:border-primary transition-all duration-300 hover:shadow-glow focus:shadow-glow rounded-xl font-inter pr-12"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8 shrink-0 bg-gradient-primary hover:opacity-90 transition-all duration-300 animate-glow-pulse hover:scale-110 rounded-lg disabled:opacity-50 disabled:scale-100"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};