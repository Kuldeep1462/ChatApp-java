"use client"

import { useEffect, useRef, useState } from "react"
import { Stomp } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import "./App.css"
import "./style/chat.css"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Login from "./components/Login"

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("chatUser")
    return saved ? JSON.parse(saved) : null
  })
  const [messages, setMessages] = useState([])
  const messagesRef = useRef([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const [sender, setSender] = useState(user ? user.username : "")
  const [content, setContent] = useState("")
  const [connected, setConnected] = useState(false)
  const [selectedContact, setSelectedContact] = useState("__global__")
  const stompClient = useRef(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fetch chat history for the selected contact
  useEffect(() => {
    if (!user || !selectedContact) return

    console.log("Fetching history for:", selectedContact)

    if (selectedContact === "__global__") {
      fetch(`/api/chat/history/global`)
        .then(async (res) => {
          console.log("Global history response status:", res.status)
          if (!res.ok) return []
          try {
            return await res.json()
          } catch {
            return []
          }
        })
        .then((data) => {
          console.log("Global history data:", data)
          if (!Array.isArray(data)) data = []
          setMessages(data)
        })
        .catch((error) => {
          console.error("Error fetching global history:", error)
          setMessages([])
        })
    } else {
      fetch(`/api/chat/history/${user.username}`)
        .then(async (res) => {
          console.log("User history response status:", res.status)
          if (!res.ok) return []
          try {
            return await res.json()
          } catch {
            return []
          }
        })
        .then((data) => {
          console.log("User history data:", data)
          if (!Array.isArray(data)) data = []
          setMessages(data)
        })
        .catch((error) => {
          console.error("Error fetching user history:", error)
          setMessages([])
        })
    }
  }, [user, selectedContact])

  // WebSocket connection and real-time updates
  useEffect(() => {
    if (!user) return

    console.log("Connecting to WebSocket...")
    // Use full backend URL for development; use relative in production
    const wsUrl = process.env.NODE_ENV === "production"
      ? "/chat"
      : "http://localhost:8080/chat"
    const socket = new SockJS(wsUrl)
    stompClient.current = Stomp.over(socket)
    // Disable debug logs in production
    stompClient.current.debug = process.env.NODE_ENV === "production" ? () => {} : console.log

    let reconnectTimeout = null

    const connect = () => {
      stompClient.current.connect(
        {},
        () => {
          setConnected(true)
          console.log("Connected to WebSocket")

          // Subscribe to private messages (Spring convention)
          stompClient.current.subscribe("/user/queue/messages", (msg) => {
            const body = JSON.parse(msg.body)
            console.log("Received private message:", body)
            setMessages((prevMessages) => {
              if (prevMessages.some((m) => m.id === body.id)) {
                return prevMessages
              }
              return [...prevMessages, body]
            })
          })

          // Subscribe to global messages
          stompClient.current.subscribe("/topic/global", (msg) => {
            const body = JSON.parse(msg.body)
            console.log("Received global message:", body)
            setMessages((prevMessages) => {
              if (prevMessages.some((m) => m.id === body.id)) {
                return prevMessages
              }
              return [...prevMessages, body]
            })
          })
        },
        (error) => {
          console.error("WebSocket connection error:", error)
          setConnected(false)
          // Try to reconnect after 3 seconds
          reconnectTimeout = setTimeout(() => {
            console.log("Attempting to reconnect...")
            if (!stompClient.current || !stompClient.current.connected) {
              connect()
            }
          }, 3000)
        },
      )
    }
    connect()

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (stompClient.current && stompClient.current.connected) {
        console.log("Disconnecting WebSocket...")
        stompClient.current.disconnect()
      }
    }
  }, [user])

  const sendMessage = (e) => {
    e.preventDefault()
    if (stompClient.current && stompClient.current.connected && sender && content.trim() && selectedContact) {
      const messageData = {
        sender,
        recipient: selectedContact === "__global__" ? null : selectedContact,
        content: content.trim(),
      }

      console.log("Sending message:", messageData)
      stompClient.current.send("/app/sendMessage", {}, JSON.stringify(messageData))
      setContent("")
    } else {
      console.warn("Cannot send message:", {
        connected: stompClient.current?.connected,
        sender,
        content: content.trim(),
        selectedContact,
      })
    }
  }

  const handleLogout = () => {
    setUser(null)
    setSender("")
    localStorage.removeItem("chatUser")
  }

  if (!user) {
    return (
      <Login
        onLogin={(user) => {
          setUser(user)
          setSender(user.username)
          localStorage.setItem("chatUser", JSON.stringify(user))
        }}
      />
    )
  }

  // Filter messages for the selected chat
  let visibleMessages = []
  if (selectedContact === "__global__") {
    visibleMessages = messages.filter(
      (m) =>
        m.recipient === "GLOBAL" ||
        m.recipient === "__global__" ||
        m.recipient === null
    )
  } else {
    visibleMessages = messages.filter(
      (m) =>
        (m.sender === user.username && m.recipient === selectedContact) ||
        (m.sender === selectedContact && m.recipient === user.username),
    )
  }

  console.log("Visible messages for", selectedContact, ":", visibleMessages)

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="main-layout">
        <Sidebar currentUser={user.username} onSelectContact={setSelectedContact} selectedContact={selectedContact} />
        {connected !== null && (
          <div className={`connection-status ${connected ? "connected" : "disconnected"}`}>
            {connected ? "● Connected" : "● Disconnected"}
          </div>
        )}
        <div className="chat-window">
          {selectedContact ? (
            <>
              <div className="messages">
                {visibleMessages.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "rgba(255,255,255,0.6)",
                      padding: "40px",
                      fontSize: "1.1rem",
                    }}
                  >
                    {selectedContact === "__global__"
                      ? "No messages in global chat yet. Be the first to say hello!"
                      : `No messages with ${selectedContact} yet. Start the conversation!`}
                  </div>
                ) : (
                  visibleMessages.map((msg, idx) => (
                    <div
                      key={msg.id || idx}
                      className={msg.sender === user.username ? "message outgoing" : "message incoming"}
                    >
                      {msg.sender !== user.username && <div className="sender-name">{msg.sender}</div>}
                      <div className="message-content">{msg.content}</div>
                      <div className="timestamp">
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-form" onSubmit={sendMessage}>
                <button type="button" className="attachment-icon" tabIndex="-1" title="Attach file">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a1.5 1.5 0 01-2.12-2.12l8.49-8.49" />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Name"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  required
                  className="input-name"
                  disabled
                />
                <input
                  type="text"
                  placeholder={
                    selectedContact === "__global__" ? "Message everyone..." : `Message ${selectedContact}...`
                  }
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="input-message"
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={!connected || !content.trim()}
                  title="Send message"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="no-contact-selected">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <div>Select a contact to start chatting</div>
              <div style={{ fontSize: "0.9rem", opacity: "0.7", marginTop: "8px" }}>
                Choose from your contacts or search by user ID
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
