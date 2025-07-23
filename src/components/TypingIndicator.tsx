import { useTyping } from "@/hooks/useTyping";
import { useAuth } from "@/hooks/useAuth";

export const TypingIndicator = () => {
  const { user } = useAuth();
  const { typingUsers } = useTyping(user);

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].displayName} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].displayName} and ${typingUsers[1].displayName} are typing...`;
    } else {
      return `${typingUsers[0].displayName} and ${typingUsers.length - 1} others are typing...`;
    }
  };

  return (
    <div className="px-6 py-2 text-sm text-muted-foreground animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="italic">{getTypingText()}</span>
      </div>
    </div>
  );
};