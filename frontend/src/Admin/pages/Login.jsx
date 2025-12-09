import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../components/Input";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../images/logo.jpg";
import homeImage from "../images/Home.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
// import { requestFirebaseNotificationPermission } from "../../services/firebase";
// import { storeVendorToken } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object().shape({
  emailOrPhone: yup
    .string()
    .required("Email or phone is required")
    .test("emailOrPhone", "Enter valid email or phone", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ to capture redirect from responses
  const { login, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const redirectAfterLogin = (user) => {
    // ✅ If supplier, always redirect to responses page
    if (user.role === "Material Supplier") {
      // If we came from /responses/:id redirect back
      const fromResponses = location.state?.from;
      if (fromResponses) {
        navigate(fromResponses, { replace: true });
      } else {
        navigate("/responses"); // default responses page
      }
      return;
    }

    // ✅ Other roles
    if (user.role === "vendor") {
      navigate("/vendordashboard");
    } else if (user.role === "architect") {
      navigate("/architectdashboard");
    } else if (user.role === "client") {
      // ✅ Client/Homeowner should go to portal (projects page)
      navigate("/projects");
    } else if (user.role === "admin") {
      // ✅ Admin should go to dashboard
      navigate("/dashboard/");
    } else {
      // ✅ Default fallback for other roles (e.g., Site Staff, etc.) - send to portal
      navigate("/projects");
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await login(data.emailOrPhone, data.password);
      const { user } = res;

      localStorage.setItem("crm_user_id", user.id || user._id);
      localStorage.setItem("crm_role", user.role);

      toast.success("Login successful");

      redirectAfterLogin(user);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const googleLoginHandler = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await googleLogin(codeResponse.code); // ✅ use context
        const { user } = res;

        toast.success("Signed in with Google!");

        localStorage.setItem("crm_user_id", user.id || user._id);
        localStorage.setItem("crm_role", user.role);

        redirectAfterLogin(user);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Google login failed");
      }
    },
    onError: () => toast.error("Google login was unsuccessful"),
  });

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section */}
      <div className="lg:w-[40%] bg-black text-white flex flex-col justify-center items-center px-4 py-6 sm:px-6">
        <img src={logo} alt="Your Logo" className="h-24 w-60 mb-10 sm:mb-24" />
        <img
          src={homeImage}
          alt="Home"
          className="w-3/4 max-w-[500px] h-auto mb-10 sm:mb-16"
        />
        <h2 className="text-[24px] sm:text-[30px] font-bold text-center mb-2">
          Lorem Ispam
        </h2>
        <p className="text-xs text-center max-w-xs">
          Lorem Ipsam is simply dummy text of the printing and typesetting
          industry.
        </p>
      </div>

      {/* Right Section */}
      <div className="lg:w-[60%] bg-gray-100 flex justify-center items-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-md sm:max-w-lg">
          <h2 className="text-[36px] sm:text-[53.33px] font-bold mb-2">
            Welcome Back
          </h2>
          <p className="text-sm mb-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600">
              Sign Up
            </a>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="emailOrPhone"
              placeholder="Email ID / Phone"
              register={register}
              error={errors.emailOrPhone}
            />
            <Input
              name="password"
              placeholder="Password"
              register={register}
              error={errors.password}
              type="password"
              showToggle
            />

            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-blue-600">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 text-sm"
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
            onClick={googleLoginHandler}
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

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import Input from "../../components/Input";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import logo from "../images/logo.jpg";
// import homeImage from "../images/Home.png";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { useGoogleLogin } from "@react-oauth/google";
// import { requestFirebaseNotificationPermission } from "../../services/firebase";
// import { storeVendorToken } from "../../services/authServices";
// import { useAuth } from "../../context/AuthContext"; 

// const schema = yup.object().shape({
//   emailOrPhone: yup
//     .string()
//     .required("Email or phone is required")
//     .test("emailOrPhone", "Enter valid email or phone", (value) => {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const phoneRegex = /^\d{10}$/;
//       return emailRegex.test(value) || phoneRegex.test(value);
//     }),
//   password: yup
//     .string()
//     .required("Password is required")
//     .min(6, "Min 6 characters"),
// });

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, googleLogin } = useAuth(); 
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: yupResolver(schema) });

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       const res = await login(data.emailOrPhone, data.password);
//       const { user } = res;

//       localStorage.setItem("crm_user_id", user.id || user._id);
//       localStorage.setItem("crm_role", user.role);

//       toast.success("Login successful");

//       if (user.role === "vendor") {
//         // const fcmToken = await requestFirebaseNotificationPermission();
//         // if (fcmToken) {
//         //   await storeVendorToken(user._id, fcmToken);
//         // }
//         navigate("/vendordashboard");
//       } else if (user.role === "architect") {
//         navigate("/architectdashboard");
//       } else {
//         navigate("/ecom");
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const googleLoginHandler = useGoogleLogin({
//     flow: "auth-code",
//     onSuccess: async (codeResponse) => {
//       try {
//         const res = await googleLogin(codeResponse.code); // ✅ use context
//         const { user } = res;

//         toast.success("Signed in with Google!");

//         localStorage.setItem("crm_user_id", user.id || user._id);
//         localStorage.setItem("crm_role", user.role);

//         if (user?.role === "vendor") {
//           // const fcmToken = await requestFirebaseNotificationPermission();
//           // if (fcmToken) {
//           //   await storeVendorToken(user._id, fcmToken);
//           // }
//           navigate("/vendordashboard");
//         } else if (user?.role === "architect") {
//           navigate("/architectdashboard");
//         } else {
//           navigate("/ecom");
//         }
//       } catch (err) {
//         toast.error(err?.response?.data?.message || "Google login failed");
//       }
//     },
//     onError: () => toast.error("Google login was unsuccessful"),
//   });

//   return (
//     <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
//       {/* Left Section */}
//       <div className="lg:w-[40%] bg-black text-white flex flex-col justify-center items-center px-4 py-6 sm:px-6">
//         <img src={logo} alt="Your Logo" className="h-24 w-60 mb-10 sm:mb-24" />
//         <img
//           src={homeImage}
//           alt="Home"
//           className="w-3/4 max-w-[500px] h-auto mb-10 sm:mb-16"
//         />
//         <h2 className="text-[24px] sm:text-[30px] font-bold text-center mb-2">
//           Lorem Ispam
//         </h2>
//         <p className="text-xs text-center max-w-xs">
//           Lorem Ipsam is simply dummy text of the printing and typesetting
//           industry.
//         </p>
//       </div>

//       {/* Right Section */}
//       <div className="lg:w-[60%] bg-gray-100 flex justify-center items-center px-4 py-6 sm:px-6">
//         <div className="w-full max-w-md sm:max-w-lg">
//           <h2 className="text-[36px] sm:text-[53.33px] font-bold mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-sm mb-6">
//             Don’t have an account?{" "}
//             <a href="/signup" className="text-blue-600">
//               Sign Up
//             </a>
//           </p>

//           <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//             <Input
//               name="emailOrPhone"
//               placeholder="Email ID / Phone"
//               register={register}
//               error={errors.emailOrPhone}
//             />
//             <Input
//               name="password"
//               placeholder="Password"
//               register={register}
//               error={errors.password}
//               type="password"
//               showToggle
//             />

//             <div className="text-right">
//               <a href="/forgot-password" className="text-sm text-blue-600">
//                 Forgot Password?
//               </a>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 text-sm"
//             >
//               {loading ? "Logging in..." : "LOGIN"}
//             </button>
//           </form>

//           <div className="flex items-center my-4">
//             <hr className="flex-grow border-gray-300" />
//             <span className="mx-2 text-xs text-gray-500">or</span>
//             <hr className="flex-grow border-gray-300" />
//           </div>

//           <button
//             onClick={googleLoginHandler}
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

// export default Login;
