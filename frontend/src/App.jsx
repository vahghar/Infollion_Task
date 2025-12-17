import { useState, useRef, useEffect } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"

export default function ChatApp() {
  const [chatId, setChatId] = useState(Date.now().toString())
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const chatEndRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("chatId", chatId)

    try {
      setLoading(true)
      await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setUploadedFile(file.name)
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: `> FILE_ATTACHED: ${file.name}`,
        },
      ])
    } catch (error) {
      console.error("Upload failed", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }])
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:3000/api/chat", {
        chatId,
        message: userMessage,
      })
      setMessages((prev) => [...prev, { sender: "bot", text: response.data.response }])
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "system", text: "❌ ERROR: Connection failed" }])
    } finally {
      setLoading(false)
    }
  }

  const resetChat = async () => {
    await axios.post("http://localhost:3000/api/reset", { chatId })
    setChatId(Date.now().toString())
    setMessages([])
    setUploadedFile(null)
  }

  return (
    <div className="flex h-screen bg-[#1a1f1a] text-[#8fb89c] selection:bg-[#5a7a5f] selection:text-white">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col p-6 border-r border-[#3a4a3a] sticky top-0 h-screen bg-[#1f241f]">
        <div className="mb-8">
          {/* Pixelated Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10" style={{ imageRendering: "pixelated" }}>
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-[1px]">
                {/* Pixelated icon pattern */}
                {[
                  0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                  1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0,
                ].map((pixel, i) => (
                  <div
                    key={i}
                    className={pixel ? "bg-[#7fa88f]" : "bg-transparent"}
                    style={{ imageRendering: "pixelated" }}
                  />
                ))}
              </div>
            </div>
            <h1 className="text-lg font-semibold text-[#8fb89c] tracking-wide">GEMINI</h1>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="w-full px-4 py-3 bg-transparent border border-[#3a4a3a] text-[#8fb89c] hover:bg-[#2a342a] hover:border-[#5a7a5f] transition-all duration-200 text-sm font-medium tracking-wide rounded"
        >
          + New Chat
        </button>

        <div className="mt-auto">
          <div className="text-xs text-[#4a5a4a] text-center">Powered by Gemini</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full h-screen relative">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center p-4 bg-[#1f241f] border-b border-[#3a4a3a] sticky top-0 z-10">
          <h1 className="font-semibold text-[#8fb89c] text-lg">GEMINI</h1>
          <button
            onClick={resetChat}
            className="text-xs text-[#8fb89c] font-medium border border-[#3a4a3a] px-3 py-1.5 rounded"
          >
            New
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-16 h-16 grid grid-cols-8 grid-rows-8 gap-[2px]" style={{ imageRendering: "pixelated" }}>
                {[
                  0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0,
                  1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0,
                ].map((pixel, i) => (
                  <div
                    key={i}
                    className={pixel ? "bg-[#7fa88f]" : "bg-transparent"}
                    style={{ imageRendering: "pixelated" }}
                  />
                ))}
              </div>
              <h2 className="text-2xl font-semibold text-[#8fb89c] tracking-wide">Ready to start</h2>
              <p className="text-[#5a6a5a] max-w-md text-sm">Start typing to begin your conversation</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`
                  max-w-[85%] md:max-w-[70%] px-4 py-3 text-sm leading-relaxed rounded-lg border
                  ${
                    msg.sender === "user"
                      ? "bg-[#2a3f2f] text-[#b5d4be] border-[#3a5a3f]"
                      : "bg-transparent text-[#a5c4af] border-[#3a4a3a]"
                  }
                  ${msg.sender === "system" ? "w-full max-w-full bg-transparent border-none text-[#5a6a5a] text-center text-xs py-2" : ""}
                `}
              >
                {msg.sender === "user" && <div className="text-[#8fb89c] text-xs mb-1 font-medium">You</div>}
                {msg.sender === "bot" && <div className="text-[#8fb89c] text-xs mb-1 font-medium">AI</div>}
                {msg.sender !== "system" && <ReactMarkdown>{msg.text}</ReactMarkdown>}
                {msg.sender === "system" && <span>{msg.text}</span>}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-transparent px-4 py-3 border border-[#3a4a3a] rounded-lg flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-[#7fa88f] animate-pulse rounded-sm"
                  style={{ imageRendering: "pixelated", animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#7fa88f] animate-pulse rounded-sm"
                  style={{ imageRendering: "pixelated", animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#7fa88f] animate-pulse rounded-sm"
                  style={{ imageRendering: "pixelated", animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-transparent">
          <div className="max-w-4xl mx-auto relative bg-[#1f241f] border border-[#3a4a3a] focus-within:border-[#5a7a5f] transition-all overflow-hidden rounded-lg">
            {uploadedFile && (
              <div className="absolute top-0 left-0 right-0 bg-[#2a342a] px-4 py-2 flex items-center justify-between border-b border-[#3a4a3a]">
                <span className="text-xs text-[#8fb89c] font-medium flex items-center gap-2">{uploadedFile}</span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-[#8fb89c] hover:text-[#b5d4be] text-xs font-medium"
                >
                  ✕
                </button>
              </div>
            )}

            <div className={`flex items-end px-3 py-3 gap-2 ${uploadedFile ? "mt-10" : ""}`}>
              <label className="p-2 text-[#5a6a5a] hover:text-[#8fb89c] cursor-pointer transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <input type="file" hidden onChange={handleFileUpload} accept=".pdf,.txt,.png,.jpg,.jpeg" />
              </label>

              <textarea
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 text-[#b5d4be] placeholder-[#4a5a4a] px-2 py-2 text-sm resize-none outline-none"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                disabled={loading}
                style={{ minHeight: "40px", maxHeight: "200px" }}
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`
                  px-4 py-2 border transition-all duration-200 text-xs font-medium rounded
                  ${
                    input.trim()
                      ? "bg-[#3a5a3f] text-[#b5d4be] border-[#4a6a4f] hover:bg-[#4a6a4f]"
                      : "bg-transparent text-[#3a4a3a] border-[#2a342a] cursor-not-allowed"
                  }
                `}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
