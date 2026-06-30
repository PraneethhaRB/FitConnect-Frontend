import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import CreateCommunityModal from "../components/CreateCommunityModal";
import { Plus } from "lucide-react";

export default function CommunityBrowsePage() {
  const [dashboard, setDashboard] = useState(null);
  const [joiningId, setJoiningId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = async () => {
    const response = await api.get("/dashboard");
    setDashboard(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = async (communityId) => {
    setJoiningId(communityId);
    try {
      await api.post(`/communities/${communityId}/join`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send join request");
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text">Loading...</div>;
  }

  const allCommunities = [
    ...dashboard.joinedCommunities,
    ...dashboard.pendingCommunities,
    ...dashboard.recommendedCommunities,
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-2xl font-bold text-text">Explore Communities</h1>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
              <Plus size={18} /> Create
            </Button>
          </div>

          {showCreateModal && (
            <CreateCommunityModal
              onClose={() => setShowCreateModal(false)}
              onCreated={fetchData}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {allCommunities.map((c) => (
              <div
                key={c.id}
                className="bg-card rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 flex flex-col"
                style={{ borderColor: c.coverColor }}
              >
                <h3 className="font-heading font-semibold text-text">{c.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1">{c.description}</p>
                <p className="text-xs text-accent mt-3 font-medium mb-3">{c.memberCount} members</p>

                <div className="flex flex-col gap-2">
                  {c.admin && (
                    <Link to={`/community/${c.id}/manage`}>
                      <Button variant="outline" className="w-full text-sm py-2">Manage Requests</Button>
                    </Link>
                  )}

                  {(c.admin || c.membershipStatus === "APPROVED") ? (
                    <Link to={`/community/${c.id}`}>
                      <Button variant="secondary" className="w-full text-sm py-2">Open Chat</Button>
                    </Link>
                  ) : c.membershipStatus === "PENDING" ? (
                    <Button variant="outline" className="w-full text-sm py-2" disabled>
                      Request Pending
                    </Button>
                  ) : (
                    <Button
                      className="w-full text-sm py-2"
                      onClick={() => handleJoin(c.id)}
                      disabled={joiningId === c.id}
                    >
                      {joiningId === c.id ? "Sending..." : "Request to Join"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}