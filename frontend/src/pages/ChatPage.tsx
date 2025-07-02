
import { useState } from "react"
import { ChatSidebar } from "@/components/ChatSidebar"
import { ChatWindow } from "@/components/ChatWindow"

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState("jane-doe")

  return (
    <div className="flex h-[600px] w-[900px] border rounded-lg shadow-md mx-auto my-10 overflow-hidden bg-white">
      <ChatSidebar selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} />
      <ChatWindow selectedUserId={selectedUserId} />
    </div>
  )
}
