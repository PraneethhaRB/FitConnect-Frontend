import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageWrapper from "../components/layout/PageWrapper";
import ErrorMessage from "../components/ui/ErrorMessage";
export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", goal: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/signup", form);
      const { token, user } = response.data.data;
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
    <div className="min-h-screen bg-background">
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Create your account</h1>
        <p className="text-gray-500 mb-6">Start your fitness journey today</p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <Input label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="Bob Smith" required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 8 characters" required minLength={8} />
          <Input label="Your goal (optional)" name="goal" value={form.goal} onChange={handleChange} placeholder="e.g. Lose weight" />

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
    </div></PageWrapper>
  );
}