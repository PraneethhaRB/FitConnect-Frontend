import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import api from "../api/axiosInstance";
import Navbar from "../components/layout/Navbar";
import Avatar from "../components/ui/Avatar";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { Trophy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";

export default function CommunityChatPage() {
  const { communityId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [milestone, setMilestone] = useState(null);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await api.get(`/communities/${communityId}/messages`);
      // backend returns newest-first, we want oldest-first for display
      setMessages([...response.data.data].reverse());
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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

  const [coachInsight, setCoachInsight] = useState(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  
  const getCoachAdvice = async () => {
    setLoadingCoach(true);
    try {
      const res = await api.get(`/communities/${communityId}/coach`);
      setCoachInsight(res.data.data);
    } catch (err) {
      console.error("Coach unavailable", err);
    } finally {
      setLoadingCoach(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe(
          `/topic/community/${communityId}`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMessage]);
            if (newMessage.milestoneMessage) {
              setMilestone(newMessage.milestoneMessage);
              setTimeout(() => setMilestone(null), 5000);
            }
          },
          { Authorization: `Bearer ${token}` }
        );
      },
      onStompError: (err) => console.error("STOMP error:", err),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate(); // cleanup: disconnect when leaving this page
    };
  }, [communityId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text">
        Loading chat...
      </div>
    );
  }

  return (
//     <PageWrapper>
//       <div className="min-h-screen bg-background flex flex-col">
//         <Navbar />

//         <div className="flex items-center justify-between px-4 pt-4">
//           <Link
//             to="/communities"
//             className="flex items-center gap-1 text-sm text-text hover:text-primary transition-colors"
//           >
//             <ArrowLeft size={16} /> Communities
//           </Link>
//           <Link
//             to={`/community/${communityId}/leaderboard`}
//             className="flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors"
//           >
//             <Trophy size={16} /> Leaderboard
//           </Link>
//         </div>

//         {milestone && (
//           <div className="mx-4 mt-2 bg-success/10 border border-success text-success text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 animate-fadeIn">
//             🎉 {milestone}
//           </div>
//         )}
// <button
//   onClick={getCoachAdvice}
//   disabled={loadingCoach}
//   className="flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors"
// >
//   {loadingCoach ? "Thinking..." : "🤖 Ask Coach"}
// </button>

// {coachInsight && (
//   <div className="mx-4 mb-3 bg-primary/10 border border-primary rounded-xl p-4 animate-fadeIn">
//     <p className="text-xs text-primary font-medium mb-1">FitConnect Coach</p>
//     <p className="text-sm text-text leading-relaxed">{coachInsight}</p>
//     <button
//       onClick={() => setCoachInsight(null)}
//       className="text-xs text-gray-400 mt-2 hover:text-text"
//     >
//       Dismiss
//     </button>
//   </div>
// )}
<PageWrapper>
       <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-3xl w-full mx-auto px-4 pt-4">
  <div className="flex items-center justify-between">
    {/* Left Side */}
    <Link
      to="/communities"
      className="flex items-center gap-1 text-sm text-text hover:text-primary transition-colors"
    >
      <ArrowLeft size={16} />
      Communities
    </Link>

    {/* Right Side */}
    <div className="flex items-center gap-5">
      <button
        onClick={getCoachAdvice}
        disabled={loadingCoach}
        className="flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors disabled:opacity-50"
      >
        {loadingCoach ? "Thinking..." : "🤖 Ask Coach"}
      </button>

      <Link
        to={`/community/${communityId}/leaderboard`}
        className="flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors"
      >
        <Trophy size={16} />
        Leaderboard
      </Link>
    </div>
  </div>

  {milestone && (
    <div className="mt-3 bg-success/10 border border-success text-success text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 animate-fadeIn">
      🎉 {milestone}
    </div>
  )}

  {coachInsight && (
    <div className="mt-3 bg-primary/10 border border-primary rounded-xl p-4 animate-fadeIn">
      <p className="text-xs text-primary font-medium mb-1">
        FitConnect Coach
      </p>

      <p className="text-sm text-text leading-relaxed">
        {coachInsight}
      </p>

      <button
        onClick={() => setCoachInsight(null)}
        className="text-xs text-gray-500 mt-3 hover:text-text transition-colors"
      >
        Dismiss
      </button>
    </div>
  )}
</div>
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
                      <img
                        src={msg.imageUrl}
                        alt="attachment"
                        className="rounded-lg max-w-full max-h-64 object-cover"
                      />
                      {msg.imageCaption && (
                        <p className="text-xs text-gray-500 mt-1">{msg.imageCaption}</p>
                      )}
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
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 mb-2 text-sm text-text">
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
    </PageWrapper>
  );
}
