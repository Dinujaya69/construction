"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgI from "@/assets/img.jpg";
import { useAuth } from "@/context/AuthContext";


export default function AuthPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { login, register, user, loading, error } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/pages/dashboard");
    }
  }, [user, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let success;

      if (isLogin) {
        // Login
        const loginData = {
          email: formData.email,
          password: formData.password,
        };
        success = await login(loginData);
      } else {
        // Register
        success = await register(formData);
      }

      if (success) {
        router.push("/pages/dashboard");
      } else {
        setErrorMessage(error || "Authentication failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-cover bg-center">
      <Image
        src={bgI}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0"
      />
      <div className="relative bg-blue-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-96 z-10">
        <h2 className="text-white text-2xl mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full p-3 rounded bg-gray-200"
              onChange={handleChange}
              value={formData.name}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded bg-gray-200"
            onChange={handleChange}
            value={formData.email}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded bg-gray-200"
            onChange={handleChange}
            value={formData.password}
          />

          <button
            type="submit"
            className={`w-full p-3 rounded ${
              isSubmitting ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
            } text-white uppercase`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-gray-200 text-sm mt-4 text-center">
          {isLogin ? "Not Registered? " : "Already Registered? "}
          <span
            className="text-green-400 cursor-pointer"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ name: "", email: "", password: "" });
              setErrorMessage("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
