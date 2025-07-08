import { useEffect, useRef, useState } from "react"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble"
import { ThumbsUp, Smile, ArrowLeft } from "lucide-react"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import { stringToColor, getInitials } from "@/helper"
import { getMessagesAPI } from "@/services/api"
import { useSocket } from "./context/socket.context"
import { useCurrentApp } from "./context/app.context"
import { toast } from "sonner"

interface Props {
  selectedUser: IUser
  onBack?: () => void
  isMobile?: boolean
  isOnline?: boolean
}

export function ChatBox({ selectedUser, onBack, isMobile, isOnline }: Props) {
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [chatMessages, setChatMessages] = useState<IMessage[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const { socket } = useSocket()
  const { user } = useCurrentApp()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getMessagesAPI(selectedUser._id)

        if (res?.data) {
          setChatMessages(res.data || [])
        } else {
          const errorMsg = Array.isArray(res.message)
            ? res.message[0]
            : res.message
          toast.error(errorMsg || "Failed to load messages.")
        }
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.message || "An error occurred. Please try again."
        toast.error(errMsg)
      }
    }

    setChatMessages([])
    if (selectedUser?._id) {
      fetchMessages()
    }
  }, [selectedUser])


  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight)
  }, [chatMessages])

  useEffect(() => {
    if (!socket) return

    const handleReceive = (message: IMessage) => {
      const isForThisChat =
        user &&
        (
          (message.senderId === selectedUser._id && message.receiverId === user._id) ||
          (message.senderId === user._id && message.receiverId === selectedUser._id)
        )

      if (isForThisChat) {
        setChatMessages((prev) => [...prev, message])
      }
    }

    socket.on("receive_message", handleReceive)

    return () => {
      socket.off("receive_message", handleReceive)
    }
  }, [socket, selectedUser])

  const handleSend = (text: string) => {
    if (!text.trim() || !user) return

    const newMessage = {
      receiverId: selectedUser._id,
      message: text.trim(),
      senderId: user._id,
    }

    socket?.emit("message", newMessage)
  }

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
    <div className="flex flex-col w-full h-[100dvh] md:h-full md:w-2/3">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        {isMobile && (
          <button
            onClick={onBack}
            className="mr-2 text-primary hover:text-primary/80 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: stringToColor(selectedUser.email) }}
        >
          {getInitials(selectedUser.name)}
        </div>
        <div>
          <p className="font-medium">{selectedUser.name}</p>
          {isOnline ? (
            <span className="flex items-center text-xs text-green-600">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1"></span>
              Online
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Offline</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => {
          const isMe = user ? msg.senderId === user._id : false
          const bgColor = isMe ? "bg-[#18181B] text-white" : "bg-muted"

          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-[80%]">
                {!isMe && (
                  <ChatBubbleAvatar
                    fallback={getInitials(selectedUser.name)}
                    className="w-8 h-8"
                  />
                )}
                <ChatBubble variant={isMe ? "sent" : "received"}>
                  {isMe && <ChatBubbleAvatar fallback="Y" className="w-8 h-8" />}
                  <div className="relative">
                    <ChatBubbleMessage className={`${bgColor} px-4 py-3 rounded-lg`}>
                      {msg.message}
                    </ChatBubbleMessage>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      <ChatBubbleTimestamp
                        timestamp={new Date(msg.createdAt).toLocaleTimeString()}
                        className="text-xs"
                      />
                    </div>

                  </div>
                </ChatBubble>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
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
          <button
            className="ml-3 text-muted-foreground hover:text-primary cursor-pointer"
            onClick={handleLikeClick}
            type="button"
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-[60px] left-4 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} />
          </div>
        )}
      </div>
    </div>
  )
}
