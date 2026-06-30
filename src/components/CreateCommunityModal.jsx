import { useState } from "react";
import api from "../api/axiosInstance";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { X } from "lucide-react";

const GOAL_OPTIONS = [
  { value: "LOSE_WEIGHT", label: "Lose Weight" },
  { value: "BUILD_MUSCLE", label: "Build Muscle" },
  { value: "HEALTHY_LIFESTYLE", label: "Healthy Lifestyle" },
];

export default function CreateCommunityModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", description: "", goalFocus: "LOSE_WEIGHT" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/communities", form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-card rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-text/50 hover:text-error">
          <X size={20} />
        </button>

        <h2 className="font-heading text-xl font-bold text-text mb-4">Create a Community</h2>

        {error && <p className="text-error text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input label="Community name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Description" name="description" value={form.description} onChange={handleChange} />

          <label className="block text-sm font-medium text-text mb-1.5">Goal Focus</label>
          <select
            name="goalFocus"
            value={form.goalFocus}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-border mb-4 text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {GOAL_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Community"}
          </Button>
        </form>
      </div>
    </div>
  );
}