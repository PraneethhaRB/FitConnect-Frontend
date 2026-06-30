import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import Navbar from "../components/layout/Navbar";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { ArrowLeft, Check, X } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";

export default function CommunityManagePage() {
  const { communityId } = useParams();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const fetchPending = async () => {
    try {
      const response = await api.get(`/communities/${communityId}/pending`);
      setPending(response.data.data);
    } catch (err) {
      console.error("Failed to load pending requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [communityId]);

  const handleDecision = async (membershipId, action) => {
    setActingId(membershipId);
    try {
      await api.post(`/communities/${communityId}/${action}/${membershipId}`);
      setPending((prev) => prev.filter((m) => m.membershipId !== membershipId));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text">Loading...</div>;
  }

  return (
    <PageWrapper>
    <div className="min-h-screen bg-background">
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link to="/communities" className="flex items-center gap-1 text-sm text-text mb-6 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to communities
        </Link>

        <h1 className="font-heading text-2xl font-bold text-text mb-6">Pending Requests</h1>

        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending requests right now.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((m) => (
              <div key={m.membershipId} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                <Avatar name={m.userName} color={m.userAvatarColor} />
                <div className="flex-1">
                  <p className="font-medium text-text">{m.userName}</p>
                  <p className="text-xs text-gray-400">
                    Requested {new Date(m.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDecision(m.membershipId, "approve")}
                    disabled={actingId === m.membershipId}
                    className="p-2 rounded-full bg-secondary/20 text-accent hover:bg-secondary hover:text-white transition-colors disabled:opacity-50"
                    title="Approve"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => handleDecision(m.membershipId, "reject")}
                    disabled={actingId === m.membershipId}
                    className="p-2 rounded-full bg-error/20 text-error hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
    </PageWrapper>
  );
}