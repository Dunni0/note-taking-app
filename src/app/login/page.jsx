"use client";

import Logo from "@/assets/images/logo";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {signIn} from "next-auth/react"

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // New state for error message

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin) {
        // Registration flow
        const res = await axios.post("/api/register", { email, password });
        if (res.status === 201) {
          setIsLogin(true); // switch to login view
          return;
        } else {
          throw new Error(res.data.message || "Registration failed");
        }
      }

      // Login flow using NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error || "Invalid email or password");
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="border-[0.5px] border-gray-300 shadow-2xl rounded-[12px] p-[2rem] mx-auto mt-[8rem] max-w-[600px] bg-[#fff]">
        <div className="flex flex-col items-center gap-3 mb-8">
          <Logo className="mb-3" />
          <p className="font-[600]">Welcome to Notes!</p>
          <p className="text-gray-400">
            {isLogin ? "Please login to continue" : "Create an account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-3">
            <label className="font-[500]">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="email@example.com"
              required
              className="text-gray-400 outline-none focus:border-b-1 focus:p-1.5 border-gray-200 transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-3">
            <label className="font-[500]">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder={
                isLogin
                  ? "Enter your password"
                  : "Choose a password (min 8 characters)"
              }
              required
              minLength={8}
              className="text-gray-400 outline-none focus:border-b-1 focus:p-1.5 border-gray-200 transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading} // Disable button when loading
            className="mt-[3rem] rounded-sm w-[100%] bg-blue-700 text-white font-[600] p-[10px] cursor-pointer hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
          {error && (
            <div className=" text-red-700 text-[12px] font-semibold">
              {error}
            </div>
          )}

          {/* Toggle Link */}
          <p className="text-center text-gray-500 text-[12px] font-semibold">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-700 cursor-pointer"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
