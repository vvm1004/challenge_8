import { useEffect, useState } from "react"
import { ChatBox } from "@/components/ChatBox"
import { SideBar } from "@/components/SideBar"

export default function ChatPage() {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState([])

  // TODO: Connect socket, fetch online users, handle messages

  const handleSendMessage = (msg: string) => {
    // TODO: emit message via socket
    // const newMsg = {
    //   sender: "You",
    //   content: msg,
    //   timestamp: new Date().toISOString(),
    // }
    // setMessages((prev) => [...prev, newMsg])
  }

  return (
    <div className="flex h-screen">
      <SideBar users={onlineUsers} currentUserId="me" onSelectUser={setSelectedUserId} />
      <div className="flex-1">
        {selectedUserId ? (
          <ChatBox messages={messages} onSend={handleSendMessage} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">Select a user to start chatting</div>
        )}
      </div>
    </div>
  )
}
