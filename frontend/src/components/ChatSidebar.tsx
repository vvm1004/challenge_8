// components/chat/ChatSidebar.tsx

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { users } from "./data"

interface Props {
  selectedUserId: string
  setSelectedUserId: (id: string) => void
}

export function ChatSidebar({ selectedUserId, setSelectedUserId }: Props) {
  return (
    <aside className="w-1/3 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Chats ({users.length})</h2>
      <ScrollArea className="h-[calc(100%-2rem)]">
        {users.map((user) => (
          <div
            key={user.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent",
              selectedUserId === user.id && "bg-muted"
            )}
            onClick={() => setSelectedUserId(user.id)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: user.color }}
            >
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              {user.typing && <p className="text-xs text-muted-foreground">{user.name.split(" ")[0]}: Typing...</p>}
            </div>
          </div>
        ))}
      </ScrollArea>
    </aside>
  )
}
