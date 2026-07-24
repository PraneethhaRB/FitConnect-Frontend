import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import api from "../api/axiosInstance";
import Navbar from "../components/layout/Navbar";
import Avatar from "../components/ui/Avatar";
import { Send, Image as ImageIcon, X } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
export default function CommunityChatPage() {
  const { communityId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fetchHistory = useCallback(async () => {
    try {
      const response = await api.get(`/communities/${communityId}/messages`);
      setMessages(response.data.data.reverse()); // backend returns newest-first, we want oldest-first for display
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  }, [communityId]);
  
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  // ... we'll fill in the rest step by step below
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;
  
    setSending(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text.trim());
      if (imageFile) formData.append("image", imageFile);
  
      await api.post(`/communities/${communityId}/messages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setText("");
      setImageFile(null);
      // No need to manually add the message to state — it'll arrive via WebSocket broadcast
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  
  //   const client = new Client({
  //     webSocketFactory: () => new SockJS("https://fitconnect-backend-production-f147.up.railway.app/ws"),
  //     connectHeaders: { Authorization: `Bearer ${token}` },
  //     onConnect: () => {
  //       client.subscribe(
  //         `/topic/community/${communityId}`,
  //         (message) => {
  //           const newMessage = JSON.parse(message.body);
  //           setMessages((prev) => [...prev, newMessage]);
  //         },
  //         { Authorization: `Bearer ${token}` }
  //       );
  //     },
  //     onStompError: (err) => console.error("STOMP error:", err),
  //     connectHeaders: {
  

  // debug: (msg) => console.log("STOMP:", msg),


  // onWebSocketError: (event) => {
  //   console.error("WS ERROR:", event);
  // },

  // onWebSocketClose: (event) => {
  //   console.log("WS CLOSED:", event);
  // },

  //   });
  
  //   client.activate();
  //   stompClientRef.current = client;
  
  //   return () => {
  //     client.deactivate(); // cleanup: disconnect when leaving this page
  //   };
  // }, [communityId]);
    useEffect(() => {
  const token = localStorage.getItem("token");

  const client = new Client({
    webSocketFactory: () =>
      new SockJS("https://fitconnect-backend-production-f147.up.railway.app/ws"),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    debug: (msg) => console.log("STOMP:", msg),

    onConnect: () => {
      console.log("✅ Connected");

      client.subscribe(
        `/topic/community/${communityId}`,
        (message) => {
          console.log("📩 Received:", message.body);

          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("✅ Subscribed");
    },

    onStompError: (frame) => {
      console.error("STOMP ERROR:", frame);
    },

    onWebSocketError: (event) => {
      console.error("WebSocket ERROR:", event);
    },

    onWebSocketClose: (event) => {
      console.log("WebSocket CLOSED:", event);
    },
  });

  client.activate();
  stompClientRef.current = client;

  return () => {
    client.deactivate();
  };
}, [communityId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (loading) {
    return <div className="min-h-screen bg-backgroundflex items-center justify-center text-text">Loading chat...</div>;
  }
  
  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
  
      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col px-4 py-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <Avatar name={msg.senderName} color={msg.senderAvatarColor} />
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm max-w-[75%]">
                <p className="text-xs font-semibold text-text mb-0.5">{msg.senderName}</p>
                {msg.text && <p className="text-sm text-gray-700">{msg.text}</p>}
                {msg.imageUrl && (
                  <div className="mt-2">
                    <img src={msg.imageUrl} alt="attachment" className="rounded-lg max-w-full max-h-64 object-cover" />
                    {msg.imageCaption && <p className="text-xs text-gray-500 mt-1">{msg.imageCaption}</p>}
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
  
        {imageFile && (
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 mb-2 text-sm text-texgt">
            <ImageIcon size={16} className="text-accent" />
            {imageFile.name}
            <button onClick={() => setImageFile(null)} className="ml-auto text-error">
              <X size={16} />
            </button>
          </div>
        )}
  
        <form onSubmit={handleSend} className="flex items-center gap-2 bg-white rounded-full shadow-sm px-3 py-2">
          <label className="cursor-pointer text-accent hover:text-text transition-colors">
            <ImageIcon size={20} />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 outline-none text-sm text-text"
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-primary text-card rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
    </div>
    </PageWrapper>
  );
}
