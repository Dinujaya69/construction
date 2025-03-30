"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgI from "@/assets/img.jpg";

export default function AuthPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

   
    router.push("/pages/dashboard");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="User Name"
            required
            className="w-full p-3 rounded bg-gray-200"
            onChange={handleChange}
          />
          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full p-3 rounded bg-gray-200"
              onChange={handleChange}
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded bg-gray-200"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full p-3 rounded bg-green-500 hover:bg-green-600 text-white uppercase"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-gray-200 text-sm mt-4 text-center">
          {isLogin ? "Not Registered? " : "Already Registered? "}
          <span
            className="text-green-400 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
