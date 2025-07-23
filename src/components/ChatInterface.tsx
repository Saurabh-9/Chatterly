import { useRef, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatBubble } from "./ChatBubble";
import { MessageInput } from "./MessageInput";
import { OnlineUsersList } from "./OnlineUsersList";
import { TypingIndicator } from "./TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";

interface ChatInterfaceProps {
  // No props needed as we get user from auth
}

export const ChatInterface = ({}: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleStickerSend = (sticker: { id: string; emoji: string; name: string }) => {
    sendMessage(sticker.emoji, true);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gradient-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          isOnline={true}
        />
        
        <ScrollArea className="flex-1 p-6 custom-scrollbar relative z-10">
          <div className="space-y-4 max-w-4xl mx-auto">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex flex-col space-y-2 max-w-xs">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-16 w-full rounded-2xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-glow-pulse">
                  <MessageCircle className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-space font-semibold mb-2">Start the conversation!</h3>
                <p className="text-muted-foreground max-w-md">
                  Be the first to send a message and break the ice. Share your thoughts, ask questions, or just say hello! 👋
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.text}
                  sender={message.senderName}
                  timestamp={message.timestamp}
                  isCurrentUser={message.sender === user?.uid}
                  isSticker={message.isSticker}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <TypingIndicator />
        
        <div className="relative z-10">
          <MessageInput 
            onSendMessage={handleSendMessage} 
            onStickerSend={handleStickerSend}
          />
        </div>
      </div>
      
      {/* Online Users Sidebar */}
      <div className="hidden lg:block relative z-10">
        <OnlineUsersList />
      </div>
    </div>
  );
};