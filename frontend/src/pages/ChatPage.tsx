import { useEffect, useState } from "react"
import { ChatSidebar } from "@/components/ChatSidebar"
import { ChatWindow } from "@/components/ChatWindow"
import { getUsersAPI, getOnlineUsersAPI } from "@/services/api"

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [users, setUsers] = useState<IUser[]>([])
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsersAPI();
      const userList = res.data?.result || [];
      setUsers(userList)
      if (userList.length > 0) setSelectedUserId(userList[0]._id)
    }

    const fetchOnlineUsers = async () => {
      const res = await getOnlineUsersAPI()
      setOnlineUserIds(res.data?.online || [])
    }

    fetchUsers()
    fetchOnlineUsers()

    const interval = setInterval(fetchOnlineUsers, 3000) // cập nhật mỗi 3s

    return () => clearInterval(interval)
  }, [])

  const selectedUser = users.find((u) => u._id === selectedUserId)

  return (
    <div className="flex h-[600px] w-[900px] border rounded-lg shadow-md mx-auto my-10 overflow-hidden bg-white">
      <ChatSidebar
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        users={users}
        onlineUserIds={onlineUserIds}
      />
      {selectedUser && (
        <ChatWindow selectedUser={selectedUser} />
      )}
    </div>
  )
}
