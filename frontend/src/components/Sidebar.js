"use client"

import { useEffect, useState } from "react"
import "../style/sidebar.css"

function Sidebar({ currentUser, onSelectContact, selectedContact }) {
  const [search, setSearch] = useState("")
  const [contacts, setContacts] = useState([])
  const [searchResult, setSearchResult] = useState(null)
  const [searchError, setSearchError] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!currentUser) return

    console.log("Fetching contacts for user:", currentUser)

    // Fetch user's chat history to build contact list
    fetch(`/api/chat/contacts/${currentUser}`)
      .then(async (res) => {
        console.log("Contacts response status:", res.status)
        if (!res.ok) {
          console.error("Failed to fetch contacts:", res.status)
          return []
        }
        try {
          const data = await res.json()
          console.log("Raw contacts data:", data)
          return data
        } catch (e) {
          console.error("Error parsing contacts JSON:", e)
          return []
        }
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("Contacts data is not an array:", data)
          data = []
        }

        // Group messages by the other user (sent or received)
        const contactMap = {}
        data.forEach((msg) => {
          if (!msg.sender || !msg.content) return

          const other = msg.sender === currentUser ? msg.recipient : msg.sender
          if (!other || other === "GLOBAL" || other === currentUser) return

          if (!contactMap[other] || new Date(msg.timestamp) > new Date(contactMap[other].rawTimestamp)) {
            contactMap[other] = {
              name: other,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(other)}&background=7c3aed&color=fff&size=48`,
              preview: msg.content.length > 50 ? msg.content.substring(0, 50) + "..." : msg.content,
              time: msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "",
              unread: 0,
              rawTimestamp: msg.timestamp,
            }
          }
        })

        // Sort contacts by most recent message
        const sortedContacts = Object.values(contactMap).sort(
          (a, b) => new Date(b.rawTimestamp) - new Date(a.rawTimestamp),
        )

        console.log("Processed contacts:", sortedContacts)
        setContacts(sortedContacts)
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error)
        setContacts([])
      })
  }, [currentUser])

  // Search for user by ID
  useEffect(() => {
    setSearchResult(null)
    setSearchError("")

    if (search && /^\d+$/.test(search.trim())) {
      const searchId = search.trim()

      // Don't search if already in contacts
      if (contacts.some((c) => c.name === searchId)) {
        return
      }

      setIsSearching(true)
      console.log("Searching for user ID:", searchId)

      fetch(`/api/user/search/${searchId}`)
        .then(async (res) => {
          console.log("Search response status:", res.status)
          if (!res.ok) {
            if (res.status === 404) {
              setSearchError("User not found")
            } else {
              setSearchError("Search failed")
            }
            return null
          }
          try {
            return await res.json()
          } catch (e) {
            console.error("Error parsing search JSON:", e)
            setSearchError("Search failed")
            return null
          }
        })
        .then((data) => {
          console.log("Search result:", data)
          if (data && data.username) {
            setSearchResult({
              name: data.username,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}&background=7c3aed&color=fff&size=48`,
              preview: "No messages yet. Start a conversation!",
              time: "",
              unread: 0,
              userId: data.userId,
            })
            setSearchError("")
          }
        })
        .catch((error) => {
          console.error("Search error:", error)
          setSearchError("Search failed")
        })
        .finally(() => {
          setIsSearching(false)
        })
    } else if (search && search.trim()) {
      // If search is not a number, show error
      setSearchError("Please enter a valid user ID (numbers only)")
    }
  }, [search, contacts])

  const filteredContacts = contacts.filter((c) => (c.name || "").toLowerCase().includes((search || "").toLowerCase()))

  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search chats or user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sidebar-search-input"
        />
      </div>
      <div className="sidebar-contacts">
        {/* Global Chat */}
        <div
          className={`sidebar-contact global${selectedContact === "__global__" ? " selected" : ""}`}
          onClick={() => onSelectContact("__global__")}
        >
          <div
            className="sidebar-avatar"
            style={{
              background: "#fbbf24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            🌐
          </div>
          <div className="sidebar-contact-info">
            <div className="sidebar-contact-top">
              <span className="sidebar-contact-name">Global Chat</span>
            </div>
            <div className="sidebar-contact-bottom">
              <span className="sidebar-contact-preview">Message everyone in the app</span>
            </div>
          </div>
        </div>

        {/* Search Result */}
        {isSearching && (
          <div className="sidebar-contact highlight">
            <div className="sidebar-avatar" style={{ background: "#9ca3af" }}>
              ...
            </div>
            <div className="sidebar-contact-info">
              <div className="sidebar-contact-top">
                <span className="sidebar-contact-name">Searching...</span>
              </div>
              <div className="sidebar-contact-bottom">
                <span className="sidebar-contact-preview">Please wait...</span>
              </div>
            </div>
          </div>
        )}

        {searchResult && !isSearching && (
          <div
            className={`sidebar-contact highlight${selectedContact === searchResult.name ? " selected" : ""}`}
            key={searchResult.userId}
            onClick={() => onSelectContact(searchResult.name)}
          >
            <img src={searchResult.avatar || "/placeholder.svg"} alt={searchResult.name} className="sidebar-avatar" />
            <div className="sidebar-contact-info">
              <div className="sidebar-contact-top">
                <span className="sidebar-contact-name">{searchResult.name}</span>
                <span className="sidebar-contact-time">ID: {searchResult.userId}</span>
              </div>
              <div className="sidebar-contact-bottom">
                <span className="sidebar-contact-preview">{searchResult.preview}</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Error */}
        {searchError && !isSearching && <div className="sidebar-contact-error">{searchError}</div>}

        {/* Existing Contacts */}
        {filteredContacts.map((contact) => (
          <div
            className={`sidebar-contact${selectedContact === contact.name ? " selected" : ""}`}
            key={contact.name}
            onClick={() => onSelectContact(contact.name)}
          >
            <img src={contact.avatar || "/placeholder.svg"} alt={contact.name} className="sidebar-avatar" />
            <div className="sidebar-contact-info">
              <div className="sidebar-contact-top">
                <span className="sidebar-contact-name">{contact.name}</span>
                <span className="sidebar-contact-time">{contact.time}</span>
              </div>
              <div className="sidebar-contact-bottom">
                <span className="sidebar-contact-preview">{contact.preview}</span>
                {contact.unread > 0 && <span className="sidebar-unread-badge">{contact.unread}</span>}
              </div>
            </div>
          </div>
        ))}

        {/* No contacts message */}
        {filteredContacts.length === 0 && !searchResult && !searchError && !isSearching && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.9rem",
            }}
          >
            No conversations yet.
            <br />
            Search for a user ID to start chatting!
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
