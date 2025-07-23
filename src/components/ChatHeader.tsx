import { Users, Wifi, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { toast } from "sonner";

interface ChatHeaderProps {
  isOnline?: boolean;
  className?: string;
}

export const ChatHeader = ({ 
  isOnline = false,
  className 
}: ChatHeaderProps) => {
  const { user, logout } = useAuth();
  const { totalOnline } = useOnlineUsers(user);
  
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logged out successfully");
    } else {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className={cn(
      "flex items-center justify-between p-4 bg-card/90 backdrop-blur-md border-b border-border",
      "shadow-lg font-inter sticky top-0 z-50",
      className
    )}>
      <div className="flex items-center space-x-3">
        <Logo size="sm" />
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isOnline ? "bg-green-500" : "bg-gray-400"
            )} />
            <Wifi className="w-3 h-3" />
            <span className="font-medium">{isOnline ? "Online" : "Offline"}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            <Users className="w-3 h-3" />
            <span className="font-medium">{totalOnline} online</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-sm text-muted-foreground mr-2">
          Welcome, <span className="font-medium text-foreground">{user?.displayName || user?.email?.split('@')[0]}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted/80 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};