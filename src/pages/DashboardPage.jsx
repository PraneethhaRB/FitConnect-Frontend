import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/layout/Navbar";
import { Users, MapPin } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import ErrorMessage from "../components/ui/ErrorMessage";
import Skeleton from "../components/ui/Skeleton";
export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let params = {};
        if (navigator.geolocation) {
          await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                params = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                resolve();
              },
              () => resolve(), // permission denied or failed — fall back to no location
              { timeout: 3000 }
            );
          });
        }
        const response = await api.get("/dashboard", { params });
        setDashboard(response.data.data);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-36" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    

<PageWrapper>
<div className="min-h-screen bg-background">
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="font-heading text-2xl font-bold text-text mb-1">
          Welcome back, {dashboard.user.name} 👋
        </h1>
        {/* <p className="text-gray-600 mb-8">{dashboard.user.goalText}</p> */}
        <div className="bg-card rounded-xl p-5 shadow-sm mb-8 max-w-md">
  <div className="flex justify-between items-center mb-2">
    <p className="text-sm font-medium text-text">{dashboard.user.goalText}</p>
    <span className="text-sm font-bold text-primary">{dashboard.user.goalProgress}%</span>
  </div>
  <div className="w-full bg-border rounded-full h-2.5">
    <div
      className="bg-primary h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${dashboard.user.goalProgress}%` }}
    />
  </div>
  <p className="text-xs text-gray-400 mt-2">
    {dashboard.user.checkInCount} check-ins
    {dashboard.user.lastCheckInAt && ` · last ${new Date(dashboard.user.lastCheckInAt).toLocaleDateString()}`}
  </p>
</div>
        <section className="mb-10">
          <h2 className="font-heading text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Users size={20} className="text-primary" /> My Communities
          </h2>
          {dashboard.joinedCommunities.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven't joined any communities yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dashboard.joinedCommunities.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4"
                  style={{ borderColor: c.coverColor }}
                >
                  <h3 className="font-heading font-semibold text-text">{c.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                  <p className="text-xs text-accent mt-3 font-medium">{c.memberCount} members</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-lg font-semibold text-text mb-4">Recommended for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dashboard.recommendedCommunities.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4"
                style={{ borderColor: c.coverColor }}
              >
                <h3 className="font-heading font-semibold text-text">{c.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                <p className="text-xs text-accent mt-3 font-medium">{c.memberCount} members</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary" /> Nearby Lab Offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboard.nearbyLabOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-text">{offer.labName}</h3>
                <p className="text-sm text-gray-500">{offer.distance} away</p>
                <p className="text-sm text-accent mt-2">{offer.offerText}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
    </PageWrapper>
  );
}