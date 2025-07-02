// components/ChatSidebar.tsx

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { stringToColor, getInitials } from "@/helper";

interface Props {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  users: IUser[];
}

export function ChatSidebar({ selectedUserId, setSelectedUserId, users }: Props) {
  return (
    <aside className="w-1/3 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Chats ({users.length})</h2>
      <ScrollArea className="h-[calc(100%-2rem)]">
        {users.map((user) => (
          <div
            key={user._id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent",
              selectedUserId === user._id && "bg-muted"
            )}
            onClick={() => setSelectedUserId(user._id)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: stringToColor(user.email) }}
            >
              {getInitials(user.name)}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
}
