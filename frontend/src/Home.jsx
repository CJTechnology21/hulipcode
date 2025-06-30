import { useState, useEffect } from "react";
import left_image from "../src/Admin/images/home_left.png";
// import left_image from "../images/home_left.png";
import right_image from "../src/Admin/images/home_right.png";
import microsoft from "../src/Admin/images/Microsoft.png";
import airbnb from "../src/Admin/images/Airbnb.png";
import bissel from "../src/Admin/images/Bissell.png";
import pink_shirt from "../src/Admin/images/pink_shirt.png";
import blue_shirt from "../src/Admin/images/blueshirt.png";
import yellow_pant from "../src/Admin/images/yellow_pant.png";
import girl from "../src/Admin/images/girl.png";
import logo from "../src/Admin/images/logo.jpg";
import support from "../src/Admin/images/support.svg";
import {
  FaFileAlt,
  FaBoxOpen,
  FaHeadphonesAlt,
  FaStar,
  FaAward,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaApple,
  FaAndroid,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../src/client/components/CategoryBar";
import { useDispatch } from "react-redux";
import SuggestionCategory from "../src/Admin/components/SuggestionCategory";
import { clearCart } from "./app/features/cart/cartSlice";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    dispatch(clearCart);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="bg-white min-h-screen font-montreal">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-6 shadow-sm relative z-50 ">
        <div>
          <img className="h-10 w-20" src={logo} alt="" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-700">
          <a href="/ecom">Ecom</a>
          <a href="/architectdashboard">Architect Dashboard</a>
          <a href="/vendordashboard">Vendor Dashboard</a>
          <a href="/lorem">Lorem Ipsum</a>
        </nav>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Auth + Search */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-1 border rounded-lg text-sm"
          />
          <select className="text-sm border rounded-lg px-2 py-1">
            <option>Talent</option>
          </select>

          {!isLoggedIn ? (
            <>
              <button className="text-sm" onClick={() => navigate("/login")}>
                Log In
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
                onClick={() => navigate("/login")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              className="bg-red-500 text-white px-4 py-1 rounded-md text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col gap-4 md:hidden z-30">
            <a href="/ecom">Ecom</a>
            <a href="/architectdashboard">Architect Dashboard</a>
            <a href="/vendordashboard">Vendor Dashboard</a>
            <a href="/lorem">Lorem Ipsum</a>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search"
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <select className="text-sm border rounded-lg px-2 py-2">
                <option>Talent</option>
              </select>
              {!isLoggedIn ? (
                <>
                  <button
                    className="text-sm"
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => navigate("/login")}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      <CategoryBar />
      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 py-12">
        <div
          className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between rounded-xl shadow-lg p-8 gap-8"
          style={{ backgroundColor: "rgba(242, 247, 241, 1)" }}
        >
          {/* Left Image Stack */}
          <div className="hidden md:block">
            <img
              src={left_image}
              alt="Left"
              width={178}
              height={502}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Center Content */}
          <div className="flex-1 text-center flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 max-w-2xl">
              Lorem Ipsum is simply dummy text of the printing
            </h1>
            <p className="text-gray-600 mb-10 max-w-xl">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Get Started
              </button>
              <button className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
                Learn how to hire
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm mt-2">
              <span>Trusted by</span>
              <img src={microsoft} alt="Microsoft" width={80} />
              <img src={airbnb} alt="Airbnb" width={60} />
              <img src={bissel} alt="Bissell" width={60} />
            </div>
          </div>

          {/* Right Image Stack */}
          <div className="hidden md:block">
            <img
              src={right_image}
              alt="Right"
              width={178}
              height={502}
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
      {/* Suggestion-section */}
      <SuggestionCategory />
      {/* Review Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Lorem Ipsum is simply dummy text
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Looking for work?{" "}
          <a href="/lroem" className="text-blue-600 font-medium">
            Browse jobs
          </a>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
              <h3 className="text-gray-800 font-semibold text-sm mb-2">
                Lorem Ipsum is simply
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <span className="text-blue-500 mr-1">★</span>
                {(4 + Math.random()).toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">
                {Math.floor(Math.random() * 1000)} skills
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* Section 1 - Text with dark background and right image */}

      <section className="max-w-7xl mx-auto px-4 py-6 flex flex-col-reverse md:flex-row bg-[#0b1c38] text-white rounded-xl overflow-hidden mb-10">
        {/* Left Content */}
        <div className="flex-1 p-4 md:p-8 flex flex-col justify-center gap-4">
          <span className="text-sm font-medium">Lorem Ipsum</span>

          <h2 className="text-[28px] md:text-[38px] font-bold leading-tight ">
            Lorem Ipsum is <span className="text-blue-400">simply dummy</span>
            <br />
            <span className="text-blue-400">text of the printing</span>
          </h2>

          <p className="text-sm text-white/80 max-w-xl">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>

          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <FaFileAlt className="text-blue-400 mt-1 min-w-[16px]" />
              <span>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaBoxOpen className="text-blue-400 mt-1 min-w-[16px]" />
              <span>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaHeadphonesAlt className="text-blue-400 mt-1 min-w-[16px]" />
              <span>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </span>
            </li>
          </ul>

          <button className="mt-4 px-5 py-2 bg-white text-black text-sm rounded-full font-medium hover:bg-gray-200 w-fit">
            Learn more
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
          <img
            src={pink_shirt} // Replace with your image
            alt="Right visual"
            className="w-full max-w-[320px] md:max-w-[400px] h-auto object-cover"
          />
        </div>
      </section>

      {/* Section 2 - For Clients */}
      <section className="relative max-w-7xl mx-auto mb-16 px-4">
        <div className="relative bg-black text-white rounded-xl overflow-hidden h-auto lg:h-[600px]">
          <img
            src={blue_shirt}
            alt="Client background"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between h-full">
            {/* Text Section */}
            <div className="max-w-3xl">
              <span className="bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                For Clients
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-6 leading-tight">
                Lorem Ipsum is <span className="block">simply</span>
              </h2>
              <p className="text-base sm:text-lg text-white/90 mt-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 lg:mt-32 w-full">
              <div className="bg-[#0077FF] hover:bg-blue-700 transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
                <h3 className="text-xl font-bold mb-2">
                  Lorem Ipsum is simply dummy
                  <div>
                    <h3>simply dummy text.</h3>
                  </div>
                </h3>
                <p className="text-sm font-medium underline mt-4">
                  Talent Marketplace™ →
                </p>
              </div>
              <div className="bg-[#0077FF] hover:bg-blue-700 transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
                <h3 className="text-xl font-bold mb-2">
                  Lorem Ipsum is simply dummy
                  <div>
                    <h3>simply dummy text.</h3>
                  </div>
                </h3>
                <p className="text-sm font-medium underline mt-4">
                  Project Catalog™ →
                </p>
              </div>
              <div className="bg-[#002144] hover:bg-[#002150] transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
                <h3 className="text-xl font-bold mb-2 text-[#007AFF]">
                  Lorem Ipsum is simply dummy
                  <div>
                    <h3>simply dummy text.</h3>
                  </div>
                </h3>
                <p className="text-sm font-medium underline mt-4">
                  Talent Scout™ →
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Side-by-side Features */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative bg-[#f2f7f4] rounded-xl p-6 lg:p-10 flex flex-col lg:flex-row items-stretch justify-between gap-10 overflow-hidden">
          {/* Left Section */}
          <div className="flex-1 space-y-6 z-10 min-h-[340px]">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Lorem Ipsum is simply dummy text.
            </h2>
            <ul className="space-y-4 text-sm text-gray-700">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-lg mt-1 text-gray-800">
                    <FaStar />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Lorem Ipsum</p>
                    <p className="text-gray-600">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Illustration */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
            <img
              src={yellow_pant}
              alt="Illustration"
              className="w-64 h-[340px] object-contain"
            />
          </div>

          {/* Right Blue Card */}
          <div className="flex-1 bg-[#0077ff] text-white rounded-xl p-6 lg:p-8 z-10 flex flex-col justify-center lg:ml-[250px]">
            <h3 className="text-lg font-bold leading-snug">
              Lorem Ipsum is simply dummy text of the printing.
            </h3>
            <p className="text-sm opacity-90 mt-1">
              Lorem Ipsum is simply dummy text.
            </p>

            {/* Rating */}
            <div className="mt-6 flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow">
                <FaStar className="text-yellow-400 w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">4.9/5</p>
                <p className="text-xs opacity-90">
                  Lorem Ipsum is simply dummy text.
                </p>
              </div>
            </div>

            {/* Award */}
            <div className="mt-4 flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow">
                <FaAward className="text-blue-600 w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Award winner</p>
                <p className="text-xs opacity-90">
                  Lorem Ipsum is simply dummy text.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section-4 */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden bg-white shadow-lg">
          {/* Left - Image */}
          <div className="h-64 md:h-auto">
            <img
              src={girl}
              alt="Person working"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-[#001e3c] text-white flex flex-col justify-between px-6 sm:px-8 py-8">
            {/* Top Content */}
            <div>
              <p className="text-base sm:text-lg lg:text-xl font-medium mb-2 mt-10">
                For Talent
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3fb5ff] leading-snug mt-10">
                Find a great <br /> worker
              </h2>
              <p className="mt-3 text-sm sm:text-base lg:text-lg text-white/80 max-w-md">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>

            {/* Feature Row */}
            <div className="mt-10 sm:mt-12 md:mt-16 border-t border-white/30 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm lg:text-base">
              <p>Find opportunities for every stage of your freelance career</p>
              <p>Control when, where, and how you work</p>
              <p>Explore different ways to earn</p>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <button className="bg-white text-[#001e3c] text-sm lg:text-base px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
                Find Opportunities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* section-5 */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-semibold text-[#1c3c2e] mb-10">
          Lorem Ipsum is simply <br /> dummy text.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nasdaq Card */}
          <div className="bg-[#3d0d50] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between ">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {/* Logo Icon Placeholder */}
                <span className="text-2xl font-bold">ℕ</span> Nasdaq
              </h3>
              <p className="text-sm mt-4 leading-relaxed">
                “Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry’s
                standard dummy.”
              </p>
              <p className="text-xs mt-4 opacity-80">
                Josh Machiz, Chief Digital Officer
              </p>
            </div>

            {/* Results */}
            <div className="mt-8 border-t border-white/30 pt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold">Emmy Winning</p>
                <p className="text-xs opacity-80">Facebook Watch Program</p>
              </div>
              <div>
                <p className="font-bold">Millions</p>
                <p className="text-xs opacity-80">
                  Of impressions generated per client per IPO
                </p>
              </div>
            </div>
          </div>

          {/* Microsoft Card */}
          <div className="bg-[#4717f6] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between relative">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {/* Logo Icon Placeholder */}
                <span className="text-xl font-bold">🧊</span> Microsoft
              </h3>
              <p className="text-sm mt-4 leading-relaxed">
                “Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry’s
                standard dummy.”
              </p>
              <p className="text-xs mt-4 opacity-80">
                Carrol Tylor, Director of Content Experience
              </p>
            </div>

            {/* Results */}
            <div className="mt-8 border-t border-white/30 pt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold">50% Faster</p>
                <p className="text-xs opacity-80">Launch of projects</p>
              </div>
              <div>
                <p className="font-bold">10.000</p>
                <p className="text-xs opacity-80">Projects completed</p>
              </div>
            </div>

            {/* Arrow Button */}
            <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2">
              <button className="w-10 h-10 rounded-full bg-[#1f1ce1] flex items-center justify-center shadow-lg hover:scale-105 transition">
                <span className="text-white text-xl">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* support banner */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-[#f4f9f5] rounded-2xl flex flex-col sm:flex-row items-center justify-between px-6 py-6 sm:py-8 shadow-sm">
          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              We support
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1 mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <button className="text-sm border border-blue-600 text-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-50 transition">
              Learn more
            </button>
          </div>

          {/* Image */}
          <div className="mt-6 sm:mt-0 sm:ml-6 w-32 sm:w-40 shrink-0">
            <img
              src={support}
              alt="Support illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
      {/* text-section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="border border-dashed border-blue-400 rounded-lg p-6 flex flex-col sm:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="sm:w-48 flex flex-col text-sm font-medium space-y-3">
            <button className="text-blue-600">Top skills</button>
            <button className="text-gray-400">Trending skills</button>
            <button className="text-gray-400">Top skills in US</button>
            <button className="text-gray-300">Project Catalog™</button>
          </div>

          {/* Skills List */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-gray-800">
            {[
              "Data Entry Specialists",
              "Video Editors",
              "Data Analyst",
              "Shopify Developer",
              "Ruby on Rails Developer",
              "Android Developer",
              "Bookkeeper",
              "Content Writer",
              "Copywriter",
              "Database Administrator",
              "Data Scientist",
              "Front-End Developer",
              "Game Developer",
              "Graphic Designer",
              "iOS Developer",
              "Java Developer",
              "JavaScript Developer",
              "Logo Designer",
              "Mobile App Developer",
              "PHP Developer",
              "Python Developer",
              "Resume Writer",
              "SEO Expert",
              "Social Media Manager",
              "Software Developer",
              "Software Engineer",
              "Technical Writer",
              "UI Designer",
              "UX Designer",
              "Virtual Assistant",
              "Web Designer",
              "Wordpress Developer",
            ].map((skill, index) => (
              <p key={index}>{skill}</p>
            ))}
          </div>
        </div>
      </section>
      {/* footer */}
      <section className="max-w-7xl mx-auto px-4 py-6 flex flex-col-reverse md:flex-row bg-[#0b1c38] text-white rounded-xl overflow-hidden mb-10">
        <div className="w-full">
          {/* Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm mb-2">For Clients</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <li key={j} className="hover:text-white cursor-pointer">
                      Lorem Ipsum
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social & App Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-600 pt-4 gap-4 font-montreal">
            {/* Social Icons */}
            <div className="flex items-center gap-2 text-xs">
              <span>Follow Us</span>
              <div className="flex gap-2 text-white">
                <IconWrapper icon={<FaFacebookF />} />
                <IconWrapper icon={<FaLinkedinIn />} />
                <IconWrapper icon={<FaTwitter />} />
                <IconWrapper icon={<FaInstagram />} />
                <IconWrapper icon={<FaYoutube />} />
              </div>
            </div>

            {/* Mobile Apps */}
            <div className="flex items-center gap-2 text-xs">
              <span>Mobile Apps</span>
              <IconWrapper icon={<FaApple />} />
              <IconWrapper icon={<FaAndroid />} />
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 mt-4">
            <p className="text-center sm:text-left">
              © 2025{" "}
              <span className="font-semibold text-white">Lorem Ipsum</span> ®
              All Right Reserved.
            </p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <a href="/lorem" className="hover:text-white">
                Terms of Service
              </a>
              <a href="/lorem" className="hover:text-white">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
function IconWrapper({ icon }) {
  return (
    <button className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 hover:bg-white hover:text-black transition">
      {icon}
    </button>
  );
}

export default Home;
