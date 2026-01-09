"use client";

import Logo from "@/assets/images/logo";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Auto-clear errors after 5 s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!isLogin) {
        // --- Registration flow ---
        const res = await axios.post("/api/register", { email, password });
        if (res.status === 201) {
          setIsLogin(true); // switch to login view
          setIsLoading(false);
          return;
        } else {
          throw new Error(res.data.message || "Registration failed");
        }
      }

      // --- Login flow using NextAuth ---
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password");
        setIsLoading(false);
      } else {
        // Keep spinner visible until navigation completes
        router.replace("/home");
        // Don't set loading to false — navigation will unmount component
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      await signIn("google", { callbackUrl: "/home" });
      // no set false — page will redirect
    } catch (err) {
      setError("Google sign-in failed");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="border-[0.5px] border-gray-300 rounded-[12px] p-[2rem] mx-auto mt-[1rem] max-w-[500px] bg-[#fff] shadow-xl">
        <Logo className="mb-5 mx-auto" />
        <div className="flex flex-col items-center gap-1 mb-8">
          <p className="font-[600] text-xl">
            {" "}
            {isLogin ? "Welcome to Notes!" : "Create an account"}
          </p>
          <p className="text-gray-600 text-center text-[14px]">
            {isLogin
              ? "Please login to continue"
              : "Sign up to start organizing your notes and boost your productivity."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="font-[500] text-sm">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="email@example.com"
              required
              className="py-2 pl-2 rounded-sm text-gray-400 outline-none border focus:p-3 border-gray-300 transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-[500] text-sm">Password</label>
              {/* <span className="font-[500] text-xs underline text-gray-600 cursor-pointer">
                {" "}
                Forgot password{" "}
              </span> */}
            </div>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder={
                  isLogin
                    ? "Enter your password"
                    : "Choose a password (min 8 characters)"
                }
                required
                minLength={8}
                className="py-2 rounded-sm pl-2 w-full pr-10 text-gray-400 outline-none border focus:p-3 border-gray-300 transition-all duration-300 ease-in-out"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-b border-gray-300 pb-5">
            <button
              type="submit"
              disabled={isLoading}
              className="mt-[1rem] rounded-sm w-[100%] bg-blue-700 text-white font-[600] p-[10px] cursor-pointer hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                    5.291A7.962 7.962 0 014 12H0c0 
                    3.042 1.135 5.824 3 7.938l3-2.647z"
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-700 text-[12px] font-semibold text-center">
              {error}
            </div>
          )}
          <p className="mt-[0.5rem] text-center text-gray-500 text-[12px] font-semibold">
            Or log in with
          </p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="rounded-sm w-[100%] border border-gray-300 font-[600] p-[10px] cursor-pointer flex gap-3 justify-center items-center"
          >
            <FaGoogle className="w-5 h-5" />
            Google
          </button>
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
