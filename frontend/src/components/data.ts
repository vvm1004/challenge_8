// components/chat/data.ts

export const users = [
  { id: "jane-doe", name: "Jane Doe", color: "#f97316", typing: true },
  { id: "john-doe", name: "John Doe", color: "#e11d48", typing: false },
  { id: "elizabeth-smith", name: "Elizabeth Smith", color: "#ca8a04", typing: false },
  { id: "john-smith", name: "John Smith", color: "#15803d", typing: false },
]

export const messages: Record<string, any[]> = {
  "jane-doe": [
    {
      id: "1",
      senderId: "jane-doe",
      receiverId: "me",
      message: "Hey there!",
      createdAt: "2025-07-02T14:10:00Z",
    },
    {
      id: "2",
      senderId: "me",
      receiverId: "jane-doe",
      message:
        "It has been good. I went for a run this morning and then had a nice breakfast. How about you?",
      createdAt: "2025-07-02T14:10:50Z",
    },
    {
      id: "3",
      senderId: "jane-doe",
      receiverId: "me",
      message: "Awesome! I am just chilling outside.",
      createdAt: "2025-07-02T14:12:00Z",
    },
  ],
}
