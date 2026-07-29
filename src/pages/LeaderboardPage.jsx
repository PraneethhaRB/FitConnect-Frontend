import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import Navbar from "../components/layout/Navbar";
import Avatar from "../components/ui/Avatar";
import PageWrapper from "../components/layout/PageWrapper";
import { ArrowLeft, Trophy } from "lucide-react";

const RANK_STYLES = {
  1: { bg: "bg-amber-100", text: "text-amber-700", label: "🥇" },
  2: { bg: "bg-gray-100",  text: "text-gray-600",  label: "🥈" },
  3: { bg: "bg-orange-100",text: "text-orange-700",label: "🥉" },
};

export default function LeaderboardPage() {
  const { communityId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/communities/${communityId}/leaderboard`)
      .then(res => setLeaderboard(res.data.data))
      .finally(() => setLoading(false));
  }, [communityId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-text">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link
            to={`/community/${communityId}`}
            className="flex items-center gap-1 text-sm text-text mb-6 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to chat
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <Trophy size={22} className="text-primary" />
            <h1 className="font-heading text-2xl font-bold text-text">Leaderboard</h1>
          </div>

          {leaderboard.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No check-ins yet — be the first to post a progress photo!
            </p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => {
                const rankStyle = RANK_STYLES[entry.rank];
                return (
                  <div
                    key={entry.userId}
                    className="bg-card rounded-xl p-4 shadow-sm flex items-center gap-4"
                  >
                    {/* Rank badge */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        rankStyle ? `${rankStyle.bg} ${rankStyle.text}` : "bg-border text-text"
                      }`}
                    >
                      {rankStyle ? rankStyle.label : `#${entry.rank}`}
                    </div>

                    {/* Avatar */}
                    <Avatar name={entry.name} color={entry.avatarColor} />

                    {/* Name + stats */}
                    <div className="flex-1">
                      <p className="font-medium text-text">{entry.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {entry.checkInCount} check-ins
                        {entry.currentStreak > 0 && (
                          <span className="ml-2 text-warning">
                            🔥 {entry.currentStreak} day streak
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-24 text-right">
                      <p className="text-sm font-bold text-primary mb-1">
                        {entry.goalProgress}%
                      </p>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${entry.goalProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}