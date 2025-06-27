// src/Login.js

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../images/logo.jpg";
import homeImage from "../images/Home.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.emailOrPhone || !form.password) {
      return toast.error("Both fields are required");
    }

    try {
      setLoading(true);

      const res = await axios.post(`${process.env.REACT_APP_API_BASE}/api/auth/login`, {
        email: form.emailOrPhone, // Assuming backend accepts either email or phone in "email" field
        password: form.password,
      });

      toast.success("Login successful");
      localStorage.setItem("crm_token", res.data.token);
      localStorage.setItem("crm_user_id", res.data.user.id);
      if (res.data.user?.role === "vendor") {
        navigate("/vendordashboard");
      } else if (res.data.user?.role === "architect") {
        navigate("/architectdashboard");
      } else {
        navigate("/ecom");
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE}/api/auth/google`, {
          code: codeResponse.code,
        });

        toast.success("Signed in with Google!");
        localStorage.setItem("crm_token", res.data.token);
        localStorage.setItem("crm_user_id", res.data.user.id);
        if (res.data.user?.role === "vendor") {
          navigate("/vendordashboard");
        } else if (res.data.user?.role === "architect") {
          navigate("/architectdashboard");
        } else {
          navigate("/ecom");
        }
      } catch (err) {
        console.error("Google Login Error:", err);
        toast.error(err?.response?.data?.message || "Google login failed");
      }
    },
    onError: (err) => {
      console.error("Google login error", err);
      toast.error("Google login was unsuccessful");
    },
  });

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section */}
      <div className="lg:w-[40%] bg-black text-white flex flex-col justify-center items-center px-4 py-6 sm:px-6">
        <div className="flex items-center mb-1 w-full justify-center">
          <img
            src={logo}
            alt="Your Logo"
            className="h-24 w-60 mb-10 sm:mb-24 "
          />

          {/* <img src={logo} alt="Your Logo" className="h-10 mb-10 sm:mb-24 ml-14" /> */}
        </div>
        <img
          src={homeImage}
          alt="Home"
          className="w-3/4 max-w-[500px] h-auto mb-10 sm:mb-16"
        />
        <h2 className="font-inter font-bold text-[24px] sm:text-[30px] text-center lg:text-left leading-tight mb-2 sm:mr-52">
          Lorem Ispam
        </h2>
        <p className="text-xs text-center mr-14 lg:text-left max-w-xs">
          Lorem Ipsam is simply dummy text of the printing and typesetting
          industry.
        </p>
      </div>

      {/* Right Section */}
      <div className="lg:w-[60%] bg-gray-100 flex justify-center items-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-md sm:max-w-lg">
          <h2 className="font-inter font-bold text-[36px] sm:text-[53.33px] leading-none mb-2">
            Welcome Back
          </h2>
          <p className="text-sm mb-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600">
              Sign Up
            </a>
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              name="emailOrPhone"
              type="text"
              placeholder="Email ID/Phone"
              value={form.emailOrPhone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-blue-600">
                Forgot Password
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 text-sm"
              style={{ backgroundColor: "#2563EB" }}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-xs text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-md mb-3 text-sm hover:bg-gray-50"
          >
            <FcGoogle size={20} className="mr-2" />
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <FaApple size={20} className="mr-2" />
            Continue with Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

// // src/Login.js

// import { useState } from 'react';
// import logo from '../images/logo.png';
// import homeImage from '../images/Home.png';
// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import { FcGoogle } from 'react-icons/fc';
// import { FaApple } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
//       {/* Left Section */}
//       <div className="lg:w-[40%] bg-black text-white flex flex-col justify-center items-center px-4 py-6 sm:px-6">
//         <div className="flex items-center mb-1 w-full">
//           <img src={logo} alt="Your Logo" className="h-10 mb-10 sm:mb-24 ml-14 " />
//         </div>
//         <img
//           src={homeImage}
//           alt="Home"
//           className="w-3/4 max-w-[500px] h-auto mb-10 sm:mb-16"
//         />
//         <h2 className="font-inter font-bold text-[24px] sm:text-[30px] text-center lg:text-left leading-tight mb-2 sm:mr-52">
//           Lorem Ispam
//         </h2>
//         <p className="text-xs text-center mr-14 lg:text-left max-w-xs">
//           Lorem Ipsam is simply dummy text of the printing and typesetting industry.
//         </p>
//       </div>

//       {/* Right Section */}
//       <div className="lg:w-[60%] bg-gray-100 flex justify-center items-center px-4 py-6 sm:px-6">
//         <div className="w-full max-w-md sm:max-w-lg">
//           <h2 className="font-inter font-bold text-[36px] sm:text-[53.33px] leading-none mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-sm mb-6">
//             Don’t have an account?{' '}
//             <a href="Signup" className="text-blue-600">
//               Sign Up
//             </a>
//           </p>

//           <form className="space-y-4">
//             <input
//               type="text"
//               placeholder="Email ID/Phone"
//               className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Password"
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//               >
//                 {showPassword ? (
//                   <AiOutlineEyeInvisible size={20} />
//                 ) : (
//                   <AiOutlineEye size={20} />
//                 )}
//               </button>
//             </div>
//             <div className="text-right">
//               <a href="/forgot-password" className="text-sm text-blue-600">
//                 Forgot Password
//               </a>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 text-sm"
//               onClick={()=>navigate('/dashboard')}
//               style={{ backgroundColor: '#2563EB' }}
//             >
//               LOGIN
//             </button>
//           </form>

//           <div className="flex items-center my-4">
//             <hr className="flex-grow border-gray-300" />
//             <span className="mx-2 text-xs text-gray-500">or</span>
//             <hr className="flex-grow border-gray-300" />
//           </div>

//           <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-md mb-3 text-sm hover:bg-gray-50">
//             <FcGoogle size={20} className="mr-2" />
//             Continue with Google
//           </button>
//           <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
//             <FaApple size={20} className="mr-2" />
//             Continue with Apple
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
