import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import logo from "../images/logo.png";
import homeImage from "../images/Home.png";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext"; // ✅ Import useAuth

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phoneNumber: yup.string().required("Phone is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .when("isGoogle", {
      is: false,
      then: (schema) => schema.min(6).required("Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  role: yup.string().required("Role is required"),
  isGoogle: yup.boolean(),
});

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, googleLogin, googleInit, googleComplete } = useAuth(); // ✅ Use context functions

  const [agree, setAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showProfileForm, setShowProfileForm] = React.useState(false);
  const [googleUserData, setGoogleUserData] = React.useState(null);
  const [profileForm, setProfileForm] = React.useState({ role: "", phoneNumber: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { isGoogle: false },
  });

  const onSubmit = async (data) => {
    if (!agree) return toast.error("Please agree to the Terms");

    try {
      setLoading(true);
      const res = await signup({ ...data, isGoogle: false }); // ✅ Use signup from context
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await googleLogin(codeResponse.code); // ✅ Use googleLogin from context
        const user = res.user || res;

        if (!user?.phoneNumber || !user?.role) {
          setGoogleUserData(user);
          setShowProfileForm(true);
        } else {
          toast.success("Signed in with Google!");
          navigate("/dashboard");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Google signup failed");
      }
    },
    flow: "auth-code",
  });

  const handleCompleteProfile = async () => {
    if (!profileForm.role || !profileForm.phoneNumber) {
      return toast.error("Please complete all fields");
    }

    try {
      const updatedUser = {
        ...googleUserData,
        phoneNumber: profileForm.phoneNumber,
        role: profileForm.role,
        isGoogle: true,
        password: "google_dummy_password_123",
      };

      const res = await googleComplete(updatedUser); // ✅ Use googleComplete from context
      toast.success("Signup completed!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Profile completion failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section */}
      <div className="lg:w-[40%] bg-black text-white flex flex-col justify-center items-center px-4 py-6 sm:px-6">
        <img src={logo} alt="Logo" className="h-24 w-60 mb-10 sm:mb-24 ml-16" />
        <img src={homeImage} alt="Home" className="w-3/4 max-w-[500px] h-auto mb-10 sm:mb-16" />
        <h2 className="font-inter font-bold text-[24px] sm:text-[30px] text-center lg:text-left leading-tight mb-2 sm:mr-52">
          Lorem Ipsum
        </h2>
        <p className="text-xs text-center lg:text-left max-w-xs">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-3 lg:space-y-0">
              <Input name="name" placeholder="Name" register={register} error={errors.name} />
              <Input name="phoneNumber" placeholder="Phone" register={register} error={errors.phoneNumber} />
            </div>
            <Input name="email" placeholder="Email ID" register={register} error={errors.email} />
            <Input name="password" placeholder="Password" register={register} error={errors.password} showToggle />
            <div>
              <select
                {...register("role")}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select User</option>
                <option value="architect">Architect</option>
                <option value="vendor">Vendor</option>
                <option value="client">Client</option>
                <option value="Site Staff">Site Staff</option>
                <option value="Labour Contractor">Labour Contractor</option>
                <option value="Subcon">Subcon</option>
                <option value="Material Supplier">Material Supplier</option>
                <option value="Service Provider">Service Provider</option>
              </select>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>
            <input type="hidden" value={false} {...register("isGoogle")} />
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

            <Button type="submit" loading={loading}>
              CREATE ACCOUNT
            </Button>
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

      {/* Profile Completion Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-center">Complete Your Profile</h2>
            <select
              value={profileForm.role}
              onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Role</option>
              <option value="architect">Architect</option>
              <option value="vendor">Vendor</option>
              <option value="client">Client</option>
              <option value="Site Staff">Site Staff</option>
              <option value="Labour Contractor">Labour Contractor</option>
              <option value="Subcon">Subcon</option>
              <option value="Material Supplier">Material Supplier</option>
              <option value="Service Provider">Service Provider</option>
            </select>
            <input
              type="text"
              placeholder="Phone Number"
              value={profileForm.phoneNumber}
              onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Button onClick={handleCompleteProfile}>Complete Signup</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;

// import React from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";

// import logo from "../images/logo.png";
// import homeImage from "../images/Home.png";
// import Input from "../../components/Input";
// import Button from "../../components/Button";
// import { signupUser, googleLoginUser } from "../../services/authServices";

// // ✅ Schema with conditional password
// const schema = yup.object().shape({
//   name: yup.string().required("Name is required"),
//   phoneNumber: yup.string().required("Phone is required"),
//   email: yup.string().email().required("Email is required"),
//   password: yup
//     .string()
//     .when("isGoogle", {
//       is: false,
//       then: (schema) => schema.min(6).required("Password is required"),
//       otherwise: (schema) => schema.notRequired(),
//     }),
//   role: yup.string().required("Role is required"),
//   isGoogle: yup.boolean(),
// });

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [agree, setAgree] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);

//   const [showProfileForm, setShowProfileForm] = React.useState(false);
//   const [googleUserData, setGoogleUserData] = React.useState(null);
//   const [profileForm, setProfileForm] = React.useState({
//     role: "",
//     phoneNumber: "",
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       isGoogle: false, // for conditional password validation
//     },
//   });

//   const onSubmit = async (data) => {
//     if (!agree) {
//       return toast.error("Please agree to the Terms of service and Privacy policy");
//     }

//     try {
//       setLoading(true);
//       const res = await signupUser({ ...data, isGoogle: false });
//       toast.success("Account created successfully!");
//       localStorage.setItem("crm_token", res.token);
//       navigate("/dashboard");
//     } catch (err) {
//       const msg = err?.response?.data?.message || "Signup failed";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const googleLogin = useGoogleLogin({
//     onSuccess: async (codeResponse) => {
//       try {
//         const res = await googleLoginUser(codeResponse.code);
//         const user = res.user;

//         if (!user?.phoneNumber || !user?.role) {
//           setGoogleUserData(res);
//           setShowProfileForm(true);
//         } else {
//           localStorage.setItem("crm_token", res.token);
//           toast.success("Signed in with Google!");
//           navigate("/dashboard");
//         }
//       } catch (err) {
//         toast.error(err?.response?.data?.message || "Google signup failed");
//       }
//     },
//     flow: "auth-code",
//   });

//   const handleCompleteProfile = async () => {
//     if (!profileForm.role || !profileForm.phoneNumber) {
//       return toast.error("Please complete all fields");
//     }

//     try {
//       const res = await signupUser({
//         ...googleUserData.user,
//         phoneNumber: profileForm.phoneNumber,
//         role: profileForm.role,
//         isGoogle: true,
//         password: "google_dummy_password_123", // Dummy password
//       });

//       localStorage.setItem("crm_token", res.token);
//       toast.success("Signup completed!");
//       navigate("/dashboard");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Profile completion failed");
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
//       {/* Left Section */}
//       <div className="lg:w-[40%] bg-black text-white flex flex-col justify-center items-center px-4 py-6 sm:px-6">
//         <img src={logo} alt="Logo" className="h-24 w-60 mb-10 sm:mb-24 ml-16" />
//         <img src={homeImage} alt="Home" className="w-3/4 max-w-[500px] h-auto mb-10 sm:mb-16" />
//         <h2 className="font-inter font-bold text-[24px] sm:text-[30px] text-center lg:text-left leading-tight mb-2 sm:mr-52">
//           Lorem Ispam
//         </h2>
//         <p className="text-xs text-center lg:text-left max-w-xs">
//           Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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

//           <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//             <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-3 lg:space-y-0">
//               <Input
//                 name="name"
//                 placeholder="Name"
//                 register={register}
//                 error={errors.name}
//               />
//               <Input
//                 name="phoneNumber"
//                 placeholder="Phone"
//                 register={register}
//                 error={errors.phoneNumber}
//               />
//             </div>
//             <Input
//               name="email"
//               placeholder="Email ID"
//               register={register}
//               error={errors.email}
//             />
//             <Input
//               name="password"
//               placeholder="Password"
//               register={register}
//               error={errors.password}
//               showToggle
//             />
//             <div>
//               <select
//                 {...register("role")}
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">Select User</option>
//                 <option value="architect">Architect</option>
//                 <option value="vendor">Vendor</option>
//                 <option value="client">Client</option>
//               </select>
//               {errors.role && (
//                 <p className="text-xs text-red-500">{errors.role.message}</p>
//               )}
//             </div>
//             <input type="hidden" value={false} {...register("isGoogle")} />
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

//             <Button type="submit" loading={loading}>
//               CREATE ACCOUNT
//             </Button>
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

//       {/* Modal for Profile Completion */}
//       {showProfileForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-lg w-[90%] max-w-md space-y-4 shadow-lg">
//             <h2 className="text-lg font-semibold text-center">Complete Your Profile</h2>
//             <select
//               value={profileForm.role}
//               onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
//               className="w-full p-2 border border-gray-300 rounded"
//             >
//               <option value="">Select Role</option>
//               <option value="client">Client</option>
//               <option value="vendor">Vendor</option>
//               <option value="architect">Architect</option>
//             </select>
//             <input
//               type="text"
//               placeholder="Phone Number"
//               value={profileForm.phoneNumber}
//               onChange={(e) =>
//                 setProfileForm({ ...profileForm, phoneNumber: e.target.value })
//               }
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//             <Button onClick={handleCompleteProfile}>Complete Signup</Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SignUp;
