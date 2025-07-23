import { useState } from "react";
import { Sticker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Sticker categories with fun animated characters
const STICKER_CATEGORIES = {
  animals: [
    { id: "cat-happy", emoji: "😸", name: "Happy Cat" },
    { id: "dog-love", emoji: "🐶", name: "Love Dog" },
    { id: "panda", emoji: "🐼", name: "Panda" },
    { id: "unicorn", emoji: "🦄", name: "Unicorn" },
    { id: "penguin", emoji: "🐧", name: "Penguin" },
    { id: "fox", emoji: "🦊", name: "Fox" },
    { id: "koala", emoji: "🐨", name: "Koala" },
    { id: "tiger", emoji: "🐅", name: "Tiger" }
  ],
  emotions: [
    { id: "love-struck", emoji: "😍", name: "Love Struck" },
    { id: "party", emoji: "🥳", name: "Party" },
    { id: "cool", emoji: "😎", name: "Cool" },
    { id: "laugh", emoji: "😂", name: "Laugh" },
    { id: "wink", emoji: "😉", name: "Wink" },
    { id: "kiss", emoji: "😘", name: "Kiss" },
    { id: "hug", emoji: "🤗", name: "Hug" },
    { id: "think", emoji: "🤔", name: "Think" }
  ],
  reactions: [
    { id: "fire", emoji: "🔥", name: "Fire" },
    { id: "sparkles", emoji: "✨", name: "Sparkles" },
    { id: "star", emoji: "⭐", name: "Star" },
    { id: "boom", emoji: "💥", name: "Boom" },
    { id: "rainbow", emoji: "🌈", name: "Rainbow" },
    { id: "lightning", emoji: "⚡", name: "Lightning" },
    { id: "crown", emoji: "👑", name: "Crown" },
    { id: "diamond", emoji: "💎", name: "Diamond" }
  ]
};

interface StickerPanelProps {
  onStickerSelect: (sticker: { id: string; emoji: string; name: string }) => void;
}

export const StickerPanel = ({ onStickerSelect }: StickerPanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof STICKER_CATEGORIES>("animals");

  const handleStickerClick = (sticker: { id: string; emoji: string; name: string }) => {
    onStickerSelect(sticker);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-accent shrink-0 animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <Sticker className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 animate-slide-up bg-gradient-sticker border-2 border-primary/20" align="start">
        <div className="space-y-4">
          <h3 className="font-space font-semibold text-lg text-primary-foreground">Sticker Magic ✨</h3>
          
          {/* Category Tabs */}
          <div className="flex space-x-2 border-b border-primary/20 pb-3">
            {Object.keys(STICKER_CATEGORIES).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category as keyof typeof STICKER_CATEGORIES)}
                className="capitalize text-xs font-medium"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sticker Grid */}
          <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
            {STICKER_CATEGORIES[selectedCategory].map((sticker, index) => (
              <Button
                key={sticker.id}
                variant="ghost"
                onClick={() => handleStickerClick(sticker)}
                className="h-16 w-16 p-2 flex flex-col items-center justify-center bg-card/50 hover:bg-card/80 border border-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-sticker animate-sticker-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-2xl mb-1">{sticker.emoji}</span>
                <span className="text-xs font-medium text-muted-foreground truncate w-full">
                  {sticker.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};