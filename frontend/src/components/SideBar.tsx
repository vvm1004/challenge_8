import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
  users: { id: string; name: string }[]
  currentUserId: string
  onSelectUser: (userId: string) => void
}

export function SideBar({ users, currentUserId, onSelectUser }: SidebarProps) {
  return (
    <div className="w-64 border-r p-4 bg-white">
      <h3 className="font-bold mb-4">Online Users</h3>
      <ScrollArea className="h-[calc(100vh-100px)]">
        {users
          .filter((u) => u.id !== currentUserId)
          .map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              {user.name}
            </div>
          ))}
      </ScrollArea>
    </div>
  )
}
