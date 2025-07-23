import { Users, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export const OnlineUsersList = () => {
  const { user } = useAuth();
  const { onlineUsers, loading } = useOnlineUsers(user);

  if (loading) {
    return (
      <Card className="w-80 h-full border-border/50 bg-card/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Online Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 h-full border-border/50 bg-card/90 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-space">
          <Users className="w-5 h-5 text-primary" />
          Online Users
          <span className="text-sm font-normal text-muted-foreground">
            ({onlineUsers.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)] px-6 pb-6">
          {onlineUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No other users online</p>
              <p className="text-sm">Be the first to start chatting!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {onlineUsers.map((onlineUser) => (
                <div
                  key={onlineUser.uid}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {onlineUser.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-green-500 bg-card rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {onlineUser.displayName}
                    </p>
                    <p className="text-xs text-green-500 font-medium">
                      Online now
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};