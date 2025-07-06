import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { stringToColor, getInitials } from "@/helper";

interface Props {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  users: IUser[];
  onlineUserIds: string[];
}

export function ChatSidebar({
  selectedUserId,
  setSelectedUserId,
  users,
  onlineUserIds,
}: Props) {
  return (
    <aside className="flex flex-col w-full md:w-1/3 h-[100dvh] border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Chats ({users.length})</h2>
      <ScrollArea className="flex-1 overflow-y-auto">
        {users.map((user) => {
          const isOnline = onlineUserIds.includes(user._id);

          return (
            <div
              key={user._id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent",
                selectedUserId === user._id && "bg-muted"
              )}
              onClick={() => setSelectedUserId(user._id)}
            >
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: stringToColor(user.email) }}
                >
                  {getInitials(user.name)}
                </div>

                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </aside>
  );
}

