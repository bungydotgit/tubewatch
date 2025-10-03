import { useRoomStore } from "@/store/useRoomStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { sendChatMessage, type Message } from "@/lib/socket";

export function Chat() {
  const { user } = useUser();
  const messages = useRoomStore((state) => state.messages);
  const addMessage = useRoomStore((state) => state.addMessage);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hostId = useRoomStore((state) => state.hostId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !user?.username) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      username: user.username,
      message: message.trim(),
      timestamp: new Date(),
    };

    // TODO: Send message via socket
    // sendChatMessage(newMessage);
    sendChatMessage(newMessage);

    addMessage(newMessage);
    setMessage("");
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/50">
            <MessageSquare className="w-12 h-12 mb-2 opacity-30" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Be the first to say hi! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.username === user?.username;
            const isHost = msg.username === hostId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  {!isCurrentUser && (
                    <span className="text-xs font-semibold text-base-content/70">
                      {msg.username}
                      {isHost && <span className="ml-1 text-warning">👑</span>}
                    </span>
                  )}
                  <span className="text-xs text-base-content/40">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl ${
                    isCurrentUser
                      ? "bg-primary text-primary-content rounded-tr-sm"
                      : "bg-base-100 text-base-content rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered flex-1 input-sm"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="btn btn-primary btn-sm btn-square"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

// Import this at the top if using lucide-react icons
import { MessageSquare } from "lucide-react";
