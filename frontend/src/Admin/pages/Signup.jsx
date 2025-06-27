import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../images/logo.png";
import homeImage from "../images/Home.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const [agree, setAgree] = React.useState(false);
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [googleUser, setGoogleUser] = React.useState(null);
  const [extra, setExtra] = React.useState({ role: "", phoneNumber: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phoneNumber ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      return toast.error("All fields are required");
    }

    if (!agree) {
      return toast.error(
        "Please agree to the Terms of service and Privacy policy"
      );
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_BASE}/api/auth/signup `,
        form
      );
      toast.success("Account created successfully!");
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
      const message = err?.response?.data?.message || "Signup failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!extra.role || !extra.phoneNumber) {
      return toast.error("Please fill in role and phone number");
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_BASE}/api/auth/google/details`,
        {
          ...googleUser,
          ...extra,
        }
      );

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
      toast.error(err?.response?.data?.message || "Google signup failed");
    } finally {
      setShowModal(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.post(`${process.env.REACT_BASE}/api/auth/google`, {
          code: codeResponse.code,
        });

        if (!res.data.user?.phoneNumber || !res.data.user?.role) {
          setGoogleUser(res.data.user);
          setShowModal(true);
        } else {
          toast.success("Signed in with Google!");
          localStorage.setItem("crm_token", res.data.token);
    
          if (res.data.user?.role === "vendor") {
            navigate("/vendordashboard");
          } else if (res.data.user?.role === "architect") {
            navigate("/architectdashboard");
          } else {
            navigate("/ecom");
          }
        }
      } catch (err) {
        console.error("Google Login Error:", err);
        toast.error(err?.response?.data?.message || "Google login failed");
      }
    },
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section */}
      <div className="lg:w-[40%] bg-black text-white flex flex-col justify-center items-center px-4 py-6 sm:px-6">
        <img src={logo} alt="Logo" className="h-24 w-60 mb-10 sm:mb-24 ml-16" />
        <img
          src={homeImage}
          alt="Home"
          className="w-3/4 max-w-[500px] h-auto mb-10 sm:mb-16"
        />
        <h2 className="font-inter font-bold text-[24px] sm:text-[30px] text-center lg:text-left leading-tight mb-2 sm:mr-52">
          Lorem Ispam
        </h2>
        <p className="text-xs text-center lg:text-left  lg:mx-0 max-w-xs">
          Lorem Ipsam is simply dummy text of the printing and typesetting
          industry.
        </p>
      </div>

      {/* Right Section */}
      <div className="lg:w-[60%] bg-gray-100 flex justify-center items-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-md sm:max-w-lg">
          <h2 className="font-inter font-bold text-xl sm:text-[53.33px] leading-none mb-2">
            Create account
          </h2>
          <p className="text-sm mb-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600">
              Login
            </a>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-3 lg:space-y-0">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                className="w-full lg:w-1/2 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                name="phoneNumber"
                type="text"
                placeholder="Phone"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full lg:w-1/2 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email ID"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
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
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select User</option>
              <option value="architect">Architect</option>
              <option value="vendor">Vendor</option>
              <option value="client">Client</option>
            </select>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 mt-1 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm leading-snug">
                I agree to the Terms of service and Privacy policy
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 text-sm"
            >
              {loading ? "Creating..." : "CREATE ACCOUNT"}
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

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm space-y-4">
                <h3 className="text-lg font-bold mb-2">Complete Signup</h3>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={extra.phoneNumber}
                  onChange={(e) =>
                    setExtra({ ...extra, phoneNumber: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <select
                  name="role"
                  value={extra.role}
                  onChange={(e) => setExtra({ ...extra, role: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Role</option>
                  <option value="client">Client</option>
                  <option value="vendor">Vendor</option>
                  <option value="architect">Architect</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGoogleSignup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
// import React from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import logo from "../images/logo.png";
// import homeImage from "../images/Home.png";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";

// const SignUp = () => {
//   const [agree, setAgree] = React.useState(false);
//   const navigate = useNavigate();
//   const [form, setForm] = React.useState({
//     name: "",
//     phoneNumber: "",
//     email: "",
//     password: "",
//     role: "",
//   });
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.phoneNumber || !form.email || !form.password || !form.role) {
//       return toast.error("All fields are required");
//     }

//     if (!agree) {
//       return toast.error("Please agree to the Terms of service and Privacy policy");
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post("http://localhost:5000/api/auth/signup", form);
//       toast.success("Account created successfully!");
//       localStorage.setItem("crm_token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       const message = err?.response?.data?.message || "Signup failed";
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Google Sign-in Flow
//   const googleLogin = useGoogleLogin({
//   onSuccess: async (codeResponse) => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/google", {
//         code: codeResponse.code,
//       });

//       toast.success("Signed in with Google!");
//       localStorage.setItem("crm_token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Google Login Error:", err);
//       toast.error(err?.response?.data?.message || "Google login failed");
//     }
//   },
//   flow: "auth-code",
// });

//   return (
//     <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
//       {/* Left Section */}
//       <div className="lg:w-[40%] bg-black text-white flex flex-col justify-center items-center px-4 py-6 sm:px-6">
//         <img src={logo} alt="Logo" className="h-24 w-60 mb-10 sm:mb-24 ml-16" />
//         <img src={homeImage} alt="Home" className="w-3/4 max-w-[500px] h-auto mb-10 sm:mb-16" />
//         <h2 className="font-inter font-bold text-[24px] sm:text-[30px] text-center lg:text-left leading-tight mb-2 sm:mr-52">
//           Lorem Ispam
//         </h2>
//         <p className="text-xs text-center lg:text-left  lg:mx-0 max-w-xs">
//           Lorem Ipsam is simply dummy text of the printing and typesetting industry.
//         </p>
//       </div>

//       {/* Right Section */}
//       <div className="lg:w-[60%] bg-gray-100 flex justify-center items-center px-4 py-6 sm:px-6">
//         <div className="w-full max-w-md sm:max-w-lg">
//           <h2 className="font-inter font-bold text-xl sm:text-[53.33px] leading-none mb-2">
//             Create account
//           </h2>
//           <p className="text-sm mb-6">
//             Already have an account?{" "}
//             <a href="/login" className="text-blue-600">
//               Login
//             </a>
//           </p>

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-3 lg:space-y-0">
//               <input
//                 name="name"
//                 type="text"
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={handleChange}
//                 autoComplete="name"
//                 className="w-full lg:w-1/2 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//               <input
//                 name="phoneNumber"
//                 type="text"
//                 placeholder="Phone"
//                 value={form.phoneNumber}
//                 onChange={handleChange}
//                 className="w-full lg:w-1/2 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <input
//               name="email"
//               type="email"
//               placeholder="Email ID"
//               value={form.email}
//               onChange={handleChange}
//               autoComplete="email"
//               className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <div className="relative">
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={handleChange}
//                 autoComplete="current-password"
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//               >
//                 {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//               </button>
//             </div>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//               <option value="">Select User</option>
//               <option value="architect">Architect</option>
//               <option value="vendor">Vendor</option>
//               <option value="client">Client</option>
//             </select>
//             <div className="flex items-start gap-2">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={agree}
//                 onChange={(e) => setAgree(e.target.checked)}
//                 className="w-4 h-4 mt-1 border-gray-300 rounded"
//               />
//               <label htmlFor="terms" className="text-sm leading-snug">
//                 I agree to the Terms of service and Privacy policy
//               </label>
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 text-sm"
//             >
//               {loading ? "Creating..." : "CREATE ACCOUNT"}
//             </button>
//           </form>

//           <div className="flex items-center my-4">
//             <hr className="flex-grow border-gray-300" />
//             <span className="mx-2 text-xs text-gray-500">or</span>
//             <hr className="flex-grow border-gray-300" />
//           </div>

//           <button
//             onClick={googleLogin}
//             className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-md mb-3 text-sm hover:bg-gray-50"
//           >
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

// export default SignUp;
