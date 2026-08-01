
import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/layout/Navbar";
import PageWrapper from "../components/layout/PageWrapper";
import ErrorMessage from "../components/ui/ErrorMessage";
import {
  Users,
  MapPin,
  Flame,
  Salad,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Signature motif: a heartbeat / pulse trace, reused three ways —   */
/*  as a background texture, as the progress-bar shape, and as a     */
/*  section divider. One idea, three jobs.                            */
/* ------------------------------------------------------------------ */
function PulseTrace({ className = "", strokeWidth = 3 }) {
  return (
    <svg
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <path
        d="M0 20 H130 L145 6 L160 34 L172 20 H400"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pulse-draw"
      />
    </svg>
  );
}

function PulseProgressBar({ percent }) {
  const clamped = Math.min(100, Math.max(0, percent || 0));
  return (
    <div className="relative w-full h-8 rounded-full bg-border/60 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 flex items-center transition-all duration-700 ease-out"
        style={{ width: `${clamped}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full" />
        <PulseTrace
          className="relative z-10 w-full h-full text-white/70"
          strokeWidth={2.5}
        />
      </div>
      {clamped === 0 && (
        <span className="absolute inset-0 flex items-center pl-3 text-xs text-text/40">
          No progress logged yet
        </span>
      )}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center gap-3 my-2 text-primary/25">
      <div className="h-px flex-1 bg-border" />
      <PulseTrace className="w-16 h-4" strokeWidth={2} />
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton — shimmer instead of flat gray blocks             */
/* ------------------------------------------------------------------ */
function Shimmer({ className = "" }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Shimmer className="h-9 w-72 mb-3" />
        <Shimmer className="h-4 w-48 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <Shimmer className="h-44 md:col-span-2" />
          <Shimmer className="h-44" />
        </div>
        <Shimmer className="h-40 mb-10 max-w-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Shimmer key={i} className="h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Community card                                                     */
/* ------------------------------------------------------------------ */
function CommunityCard({ c, index }) {
  return (
    <div
      className="group bg-card rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 fade-up"
      style={{ borderColor: c.coverColor, animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-heading font-semibold text-text text-[15px] leading-snug">
          {c.name}
        </h3>
        <ArrowRight
          size={16}
          className="text-text/20 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
        />
      </div>
      <p className="text-sm text-text/55 mt-1.5 line-clamp-2">{c.description}</p>
      <p className="text-xs font-mono font-semibold mt-4 tracking-wide" style={{ color: c.coverColor }}>
        {String(c.memberCount).padStart(2, "0")} MEMBERS
      </p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="border border-dashed border-border rounded-2xl py-8 text-center">
      <p className="text-text/40 text-sm">{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [foodQuery, setFoodQuery] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);
  const [goal, setGoal] = useState("");
const [plan, setPlan] = useState(null);
const [generatingPlan, setGeneratingPlan] = useState(false);
const [planError, setPlanError] = useState("");
  
  const askQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    try {
      const res = await api.post("/dashboard/ask", { question });
      setAnswer(res.data.data);
    } finally {
      setAsking(false);
    }
  };
  const generatePlan = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setGeneratingPlan(true);
    setPlanError("");
    try {
      const res = await fetch("https://fitness-agent-pipeline.onrender.com/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      setPlanError("Couldn't generate a plan right now — try again in a moment.");
    } finally {
      setGeneratingPlan(false);
    }
  };
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let params = {};
        if (navigator.geolocation) {
          await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                params = {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                };
                resolve();
              },
              () => resolve(),
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

  const analyzeFood = async (e) => {
    e.preventDefault();
    if (!foodQuery.trim()) return;
    setAnalyzing(true);
    try {
      const res = await api.post("/nutrition/analyze", { query: foodQuery });
      setNutrition(res.data.data);
    } catch {
      alert("Could not analyze that food — try being more specific");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  const greetingHour = new Date().getHours();
  const timeGreeting =
    greetingHour < 12 ? "Good morning" : greetingHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .fade-up { animation: fadeUp 0.5s ease-out both; }
          @keyframes drawPulse { from { stroke-dashoffset: 420; } to { stroke-dashoffset: 0; } }
          .pulse-draw { stroke-dasharray: 420; animation: drawPulse 1.1s ease-out forwards; }
          @keyframes shimmerMove { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
          .shimmer {
            background: linear-gradient(90deg, #e9ede8 25%, #f5f7f3 37%, #e9ede8 63%);
            background-size: 800px 100%;
            animation: shimmerMove 1.4s infinite linear;
          }
          .font-mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
        `}</style>

        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-8 fade-up">
            <p className="text-accent text-xs font-mono font-semibold uppercase tracking-widest mb-1">
              {timeGreeting}
            </p>
            <h1 className="font-heading text-3xl font-bold text-text">
              Welcome back, {dashboard.user.name}
            </h1>
          </div>

          {/* Hero: streak + weather suggestion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            {/* Streak / goal card — the signature moment */}
            <div className="relative md:col-span-2 bg-primary rounded-2xl p-6 shadow-sm overflow-hidden fade-up">
              <PulseTrace
                className="absolute -bottom-4 left-0 w-full h-24 text-white/10"
                strokeWidth={3}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 bg-warning/15 text-warning px-3 py-1.5 rounded-full text-sm font-mono font-semibold">
                    <Flame size={15} className="fill-warning/30" />
                    {dashboard.user.currentStreak}-DAY STREAK
                  </div>
                  {dashboard.user.longestStreak > 0 && (
                    <div className="text-xs text-white/50 font-mono">
                      BEST {dashboard.user.longestStreak}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-baseline mb-3">
                  <p className="text-sm font-medium text-white/85">
                    {dashboard.user.goalText}
                  </p>
                  <span className="text-2xl font-mono font-bold text-white">
                    {dashboard.user.goalProgress}
                    <span className="text-sm text-white/50">%</span>
                  </span>
                </div>

                <PulseProgressBar percent={dashboard.user.goalProgress} />

                <p className="text-xs text-white/45 font-mono mt-3">
                  {dashboard.user.checkInCount} CHECK-INS
                  {dashboard.user.lastCheckInAt &&
                    ` · LAST ${new Date(dashboard.user.lastCheckInAt)
                      .toLocaleDateString()
                      .toUpperCase()}`}
                </p>
              </div>
            </div>

            {/* Weather-based suggestion */}
            {dashboard.workoutSuggestion ? (
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border fade-up" style={{ animationDelay: "80ms" }}>
                <div className="flex items-center gap-1.5 text-accent mb-3">
                  <Sparkles size={14} />
                  <p className="text-xs font-mono font-semibold uppercase tracking-wide">
                    Today's pick
                  </p>
                </div>
                <p className="font-heading font-semibold text-text leading-snug">
                  {dashboard.workoutSuggestion.title}
                </p>
                <p className="text-sm text-text/55 mt-2 leading-relaxed">
                  {dashboard.workoutSuggestion.description}
                </p>
                {dashboard.workoutSuggestion.temperatureCelsius != null && (
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-text/40 border-t border-border pt-3 w-full">
                    {dashboard.workoutSuggestion.temperatureCelsius}°C OUTSIDE
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-dashed border-border flex items-center justify-center text-center">
                <p className="text-text/40 text-sm">No suggestion for today yet</p>
              </div>
            )}
          </div>

          {/* Nutrition checker */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-10 max-w-md fade-up" style={{ animationDelay: "120ms" }}>
            <p className="font-heading font-semibold text-text mb-3 flex items-center gap-2">
              <Salad size={18} className="text-primary" />
              Nutrition checker
            </p>
            <form onSubmit={analyzeFood} className="flex gap-2">
              <input
                type="text"
                value={foodQuery}
                onChange={(e) => setFoodQuery(e.target.value)}
                placeholder="e.g. 2 eggs and oatmeal"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-border text-sm text-text bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
              <button
                type="submit"
                disabled={analyzing}
                className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 shrink-0"
              >
                {analyzing ? "…" : "Check"}
              </button>
            </form>

            {nutrition && (
              <div className="mt-4 grid grid-cols-4 gap-2 fade-up">
                {[
                  { label: "CAL", value: nutrition.calories, color: "text-accent" },
                  { label: "PRO", value: nutrition.proteinG, color: "text-primary" },
                  { label: "CARB", value: nutrition.carbsG, color: "text-text" },
                  { label: "FAT", value: nutrition.fatG, color: "text-warning" },
                ].map((item) => (
                  <div key={item.label} className="bg-background rounded-xl p-2.5 text-center border border-border">
                    <p className="text-[10px] font-mono text-text/40 tracking-widest">{item.label}</p>
                    <p className={`font-mono font-bold text-sm mt-0.5 ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>



<div className="bg-card rounded-xl p-5 shadow-sm mb-8 max-w-md">
  <p className="font-heading font-semibold text-text mb-3">
    🧠 Ask your fitness coach
  </p>
  <form onSubmit={askQuestion} className="flex gap-2 mb-3">
    <input
      type="text"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      placeholder="e.g. How much protein do I need?"
      className="flex-1 px-3 py-2 rounded-lg border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
    />
    <button
      type="submit"
      disabled={asking}
      className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-accent transition-colors disabled:opacity-50"
    >
      {asking ? "..." : "Ask"}
    </button>
  </form>
  {answer && (
    <div className="bg-primary/5 rounded-lg p-3 animate-fadeIn">
      <p className="text-sm text-text leading-relaxed">{answer}</p>
    </div>
  )}
</div>
<div className="bg-card rounded-xl p-5 shadow-sm mb-8 max-w-md">
  <p className="font-heading font-semibold text-text mb-3 flex items-center gap-2">
    <Sparkles size={18} className="text-primary" />
    Generate a weekly plan
  </p>
  <form onSubmit={generatePlan} className="flex gap-2 mb-3">
    <input
      type="text"
      value={goal}
      onChange={(e) => setGoal(e.target.value)}
      placeholder="e.g. lose 10kg in 3 months"
      className="flex-1 px-3 py-2 rounded-lg border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
    />
    <button
      type="submit"
      disabled={generatingPlan}
      className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-accent transition-colors disabled:opacity-50 shrink-0"
    >
      {generatingPlan ? "Generating…" : "Generate"}
    </button>
  </form>

  {generatingPlan && (
    <p className="text-xs text-text/40 font-mono">
      This can take 10–15s — 4 agents are working on it.
    </p>
  )}

  {planError && (
    <p className="text-sm text-warning">{planError}</p>
  )}

  {plan && !generatingPlan && (
    <div className="bg-primary/5 rounded-lg p-4 mt-3 max-h-96 overflow-y-auto animate-fadeIn">
      <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{plan}</p>
      <button
        onClick={() => setPlan(null)}
        className="text-xs text-gray-400 mt-3 hover:text-text"
      >
        Dismiss
      </button>
    </div>
  )}
</div>
          {/* Joined communities */}
          <section className="mb-4">
            <h2 className="font-heading text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <Users size={19} className="text-primary" /> My communities
            </h2>
            {dashboard.joinedCommunities.length === 0 ? (
              <EmptyState text="You haven't joined a community yet — find one below and dive in." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {dashboard.joinedCommunities.map((c, i) => (
                  <CommunityCard key={c.id} c={c} index={i} />
                ))}
              </div>
            )}
          </section>

          <SectionDivider />

          {/* Recommended communities */}
          <section className="mb-10 mt-4">
            <h2 className="font-heading text-lg font-semibold text-text mb-4">
              Recommended for you
            </h2>
            {dashboard.recommendedCommunities.length === 0 ? (
              <EmptyState text="No recommendations right now — check back after a few more check-ins." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {dashboard.recommendedCommunities.map((c, i) => (
                  <CommunityCard key={c.id} c={c} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* Nearby lab offers */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <MapPin size={19} className="text-primary" /> Nearby lab offers
            </h2>
            {dashboard.nearbyLabOffers.length === 0 ? (
              <EmptyState text="No lab offers near you right now." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboard.nearbyLabOffers.map((offer, i) => (
                  <div
                    key={offer.id}
                    className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow fade-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-text">{offer.labName}</h3>
                      <span className="text-xs font-mono text-text/40">{offer.distance}</span>
                    </div>
                    <p className="text-sm text-accent mt-2 font-medium">{offer.offerText}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </PageWrapper>
  );
}
