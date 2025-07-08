import { useEffect, useState } from "react"
import { ChatSidebar } from "@/components/ChatSidebar"
import { ChatBox } from "@/components/ChatBox"
import { getUsersAPI, getOnlineUsersAPI } from "@/services/api"
import { toast } from "sonner"

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
      try {
        const res = await getUsersAPI()

        if (res?.data?.result) {
          const userList = res.data.result || []
          setUsers(userList)
          if (userList.length > 0) setSelectedUserId(userList[0]._id)
        } else {
          const errorMsg = Array.isArray(res.message)
            ? res.message[0]
            : res.message
          toast.error(errorMsg || "Failed to load users.")
        }
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.message || "An error occurred. Please try again."
        toast.error(errMsg)
      }
    }

    const fetchOnlineUsers = async () => {
      try {
        const res = await getOnlineUsersAPI()

        if (res?.data?.online) {
          setOnlineUserIds(res.data.online || [])
        } else {
          const errorMsg = Array.isArray(res.message)
            ? res.message[0]
            : res.message
          toast.error(errorMsg || "Failed to load online users.")
        }
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.message || "An error occurred. Please try again."
        toast.error(errMsg)
      }
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
        <ChatBox
          selectedUser={selectedUser}
          onBack={() => setShowSidebar(true)}
          isMobile={isMobile}
          isOnline={onlineUserIds.includes(selectedUser._id)}
        />
      )}

    </div>
  )
}
