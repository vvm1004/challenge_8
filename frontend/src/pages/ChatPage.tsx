import { useEffect, useState } from "react"
import { ChatSidebar } from "@/components/ChatSidebar"
import { ChatWindow } from "@/components/ChatWindow"
import { getUsersAPI, getOnlineUsersAPI } from "@/services/api"

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [users, setUsers] = useState<IUser[]>([])
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

    const interval = setInterval(fetchOnlineUsers, 3000)
    return () => clearInterval(interval)
  }, [])

  const selectedUser = users.find((u) => u._id === selectedUserId)

  const handleUserSelect = (id: string) => {
    setSelectedUserId(id)
    if (isMobile) setShowSidebar(false)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[600px] w-full md:w-[900px] border rounded-lg shadow-md mx-auto my-4 overflow-hidden bg-white">
      {(showSidebar || !isMobile) && (
        <ChatSidebar
          selectedUserId={selectedUserId}
          setSelectedUserId={handleUserSelect}
          users={users}
          onlineUserIds={onlineUserIds}
        />
      )}

      {selectedUser && (!showSidebar || !isMobile) && (
        <ChatWindow
          selectedUser={selectedUser}
          onBack={() => setShowSidebar(true)}
          isMobile={isMobile}
          isOnline={onlineUserIds.includes(selectedUser._id)}
        />
      )}

    </div>
  )
}
