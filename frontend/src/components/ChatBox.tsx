import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ChatBoxProps {
  messages: { sender: string; content: string; timestamp: string }[]
  onSend: (msg: string) => void
}

export function ChatBox({ messages, onSend }: ChatBoxProps) {
  const [msg, setMsg] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (msg.trim()) {
      onSend(msg)
      setMsg("")
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className="bg-gray-200 p-2 rounded">
            <div className="text-sm font-bold">{m.sender}</div>
            <div>{m.content}</div>
            <div className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex p-4 border-t bg-white">
        <Input
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 mr-2"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  )
}
