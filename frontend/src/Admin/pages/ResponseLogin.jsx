import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/authServices"; // adjust path

function ResponseLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const defaultPassword = "123456";

  const redirectAfterLogin = (user) => {
    // ✅ Material Supplier only
    if (user.role === "Material Supplier") {
      const fromResponses = location.state?.from;
      if (fromResponses) {
        navigate(fromResponses, { replace: true });
      } else {
        navigate("/responses");
      }
    } else {
      toast.error("This login is only for Material Suppliers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginUser(email, defaultPassword);
      const { user } = res;
      toast.success("You can add response now ");
      redirectAfterLogin(user);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="Response" />

      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-red-500">
            Enter Your Mail
          </h2>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* hidden password */}
          <input type="hidden" value={defaultPassword} readOnly />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "Waiting..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResponseLogin;

// import React, { useState } from "react";
// import Header from "../components/Header";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { loginUser } from "../../services/authServices"; // adjust path

// function ResponseLogin() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const defaultPassword = "123456";

//   const redirectAfterLogin = (user) => {
//     // ✅ Material Supplier only
//     if (user.role === "Material Supplier") {
//       const fromResponses = location.state?.from;
//       if (fromResponses) {
//         navigate(fromResponses, { replace: true });
//       } else {
//         navigate("/responses");
//       }
//     } else {
//       toast.error("This login is only for Material Suppliers");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await loginUser(email, defaultPassword);
//       const { user } = res;

//       localStorage.setItem("crm_user_id", user.id || user._id);
//       localStorage.setItem("crm_role", user.role);

//       toast.success("Login successful");
//       redirectAfterLogin(user);
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Header title="Response"/>
//         <div className="bg-white min-h-screen flex items-center justify-center">
//           <form
//             onSubmit={handleSubmit}
//             className="bg-gray-50 shadow-md rounded-xl p-6 w-full max-w-md"
//           >

//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>

//             {/* hidden password */}
//             <input type="hidden" value={defaultPassword} readOnly />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         </div>
//     </div>
//   );
// }

// export default ResponseLogin;
