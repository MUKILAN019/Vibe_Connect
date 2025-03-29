import { useState } from "react";

export default function SignUp() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-950 text-white p-4">
      <div className="w-96 p-8 rounded-2xl shadow-2xl bg-green-800 border border-green-700">
        <h2 className="text-3xl font-extrabold text-center text-green-300 mb-6">Create an Account</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-green-300 mb-1">Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Enter your username" 
              value={form.username} 
              onChange={handleChange} 
              className="w-full p-3 bg-green-700 text-white border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-300 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              value={form.email} 
              onChange={handleChange} 
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
              className="w-full p-3 bg-green-700 text-white border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg font-semibold text-lg shadow-md transition duration-300">Sign Up</button>
        </div>
        <p className="text-center text-green-400 mt-4 text-sm">Already have an account? <a href="#" className="text-green-300 underline hover:text-green-200">Log in</a></p>
      </div>
    </div>
  );
}