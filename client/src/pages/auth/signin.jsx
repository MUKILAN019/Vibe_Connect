import { useState } from "react";
import { login } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await login(form.email, form.password, navigate); 
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/home"); 
      }, 1500);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-950 text-white p-4">
      <div className="w-96 p-8 rounded-2xl shadow-2xl bg-green-800 border border-green-700">
        <h2 className="text-3xl font-extrabold text-center text-green-300 mb-6">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-green-300 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              value={form.email} 
              onChange={handleChange} 
              required
              className="w-full p-3 bg-green-700 text-white border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-300 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              value={form.password} 
              onChange={handleChange} 
              required
              className="w-full p-3 bg-green-700 text-white border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg font-semibold text-lg shadow-md transition duration-300"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {message && <p className="text-center text-green-300 mt-4">{message}</p>}
        {error && <p className="text-center text-red-400 mt-4">{error}</p>}

        <p className="text-center text-green-400 mt-4 text-sm">
          Don't have an account? 
          <Link to="/signup" className="text-green-300 underline hover:text-green-200">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
