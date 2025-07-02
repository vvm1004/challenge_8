import { useEffect, useRef, useState } from "react"
import { users, messages } from "./data"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubbleAction,
  ChatBubbleActionWrapper
} from "@/components/ui/chat/chat-bubble"
import { ThumbsUp, Smile } from "lucide-react"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"

interface Props {
  selectedUserId: string
}

export function ChatWindow({ selectedUserId }: Props) {
  const user = users.find((u) => u.id === selectedUserId)
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [chatMessages, setChatMessages] = useState(messages[selectedUserId] || [])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSend = (text: string) => {
    const newMsg = {
      id: Date.now().toString(),
      senderId: "me",
      receiverId: selectedUserId,
      message: text,
      createdAt: new Date().toISOString(),
    }
    setChatMessages((prev) => [...prev, newMsg])
  }

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
  }, [chatMessages])

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (inputRef.current) {
      const cursor = inputRef.current.selectionStart
      const currentText = inputRef.current.value
      const newText =
        currentText.slice(0, cursor) + emojiData.emoji + currentText.slice(cursor)
      inputRef.current.value = newText
      inputRef.current.focus()

      setShowEmojiPicker(false)
    }
  }

  const handleLikeClick = () => {
    handleSend("👍")
  }

  return (
    <div className="flex flex-col w-2/3 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: user?.color }}
        >
          {user?.name[0]}
        </div>
        <div>
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">Active 2 mins ago</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => {
          const isMe = msg.senderId === "me"
          const sender = isMe ? { name: "You", color: "#18181B" } : user
          const bgColor = isMe ? "bg-[#18181B] text-white" : "bg-muted"

          return (
            <div className={`flex ${isMe ? "justify-end" : "justify-start"}`} key={msg.id}>
              <div className="flex items-end gap-2 max-w-[80%]">
                {!isMe && (
                  <ChatBubbleAvatar
                    fallback={sender?.name[0]}
                    className="w-8 h-8"
                  />
                )}
                <ChatBubble variant={isMe ? "sent" : "received"}>
                  {isMe && (
                    <ChatBubbleAvatar
                      fallback="Y"
                      className="w-8 h-8"
                    />
                  )}
                  <div className="relative">
                    <ChatBubbleMessage className={`${bgColor} px-4 py-3 rounded-lg`}>
                      {msg.message}
                    </ChatBubbleMessage>
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <ChatBubbleTimestamp
                        timestamp={new Date(msg.createdAt).toLocaleTimeString()}
                        className="text-xs"
                      />
                      {/* <ChatBubbleActionWrapper variant="sent">
                        <ChatBubbleAction
                          icon={<ThumbsUp className="w-4 h-4" />}
                          onClick={() => console.log("Liked", msg.id)}
                        />
                      </ChatBubbleActionWrapper> */}
                    </div>
                  </div>
                </ChatBubble>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input area */}
      <div className="border-t p-4 relative">
        <div className="flex items-center w-full">
          <div className="relative flex items-center w-full rounded-full border px-4 py-2 bg-white dark:bg-zinc-900 shadow-sm">
            <textarea
              ref={inputRef}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  const val = inputRef.current?.value.trim()
                  if (val) {
                    handleSend(val)
                    if (inputRef.current) inputRef.current.value = ""
                  }
                }
              }}
            />
            <button
              className="ml-2 text-muted-foreground hover:text-primary"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              type="button"
            >
              <Smile className="w-5 h-5 cursor-pointer" />
            </button>
          </div>

          {/* Like Button (bên ngoài ô input) */}
          <button
            className="ml-3 text-muted-foreground hover:text-primary cursor-pointer"
            onClick={handleLikeClick}
            type="button"
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-[60px] left-4 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} />
          </div>
        )}
      </div>
    </div>
  )
}
