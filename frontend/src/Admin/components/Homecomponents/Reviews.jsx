import { useState, useEffect } from "react";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaTags,
  FaSwatchbook,
  FaSmile,
  FaHardHat,
} from "react-icons/fa";

// ---------- Reviews Data ----------
const reviews = [
  {
    name: "Aanya Sharma",
    role: "Architect",
    image: "https://i.pravatar.cc/150?img=1",
    text: "Absolutely loved working with Material Depot. The convenience and variety are unmatched!",
  },
  {
    name: "Rohit Mehta",
    role: "Interior Designer",
    image: "https://i.pravatar.cc/150?img=2",
    text: "My clients are thrilled. Super smooth delivery and amazing laminate choices.",
  },
  {
    name: "Diya Patel",
    role: "Home Renovator",
    image: "https://i.pravatar.cc/150?img=3",
    text: "Found all I needed in one place. Zero stress and high quality materials.",
  },
  {
    name: "Kabir Singh",
    role: "Project Manager",
    image: "https://i.pravatar.cc/150?img=4",
    text: "Material Depot’s platform is game-changing. Fast, reliable and well-priced.",
  },
  {
    name: "Isha Jain",
    role: "Freelance Designer",
    image: "https://i.pravatar.cc/150?img=5",
    text: "Best experience so far. Loved their customer support and easy selection.",
  },
  {
    name: "Aryan Desai",
    role: "Architectural Consultant",
    image: "https://i.pravatar.cc/150?img=6",
    text: "The best site for laminate and tile sourcing. Timely updates and superb service.",
  },
  {
    name: "Neha Reddy",
    role: "Contractor",
    image: "https://i.pravatar.cc/150?img=7",
    text: "Everything from MDF to plywood was top-notch. Highly recommend!",
  },
  {
    name: "Shaan Kapoor",
    role: "Interior Stylist",
    image: "https://i.pravatar.cc/150?img=8",
    text: "Very intuitive to use. Beautiful UX and great product discovery.",
  },
  {
    name: "Rhea Malhotra",
    role: "Builder",
    image: "https://i.pravatar.cc/150?img=9",
    text: "Great vendor connections and fast execution. Helped complete projects faster.",
  },
];

// ---------- Component ----------
export default function ReviewsSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const nextSlide = () => {
    setStartIndex((prev) => (prev + visibleCount) % reviews.length);
  };

  const prevSlide = () => {
    setStartIndex(
      (prev) => (prev - visibleCount + reviews.length) % reviews.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const visibleReviews = [...reviews, ...reviews].slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <div className="bg-gray-50 py-20 font-montreal">
      {/* -------- Reviews Carousel -------- */}
      <div className="max-w-7xl mx-auto px-4 relative bg-[#f9f9f9] rounded-xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-14">
          Happy Customers
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {visibleReviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-8 text-center hover:shadow-2xl transition"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 right-2 bg-white rounded-full px-2 py-1 flex items-center shadow-md">
                  <FaStar className="text-yellow-500 text-sm mr-1" />
                  <span className="text-sm font-semibold">5</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {review.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{review.role}</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 hover:bg-gray-100 p-3 rounded-full shadow-md transition"
        >
          <FaChevronLeft className="text-gray-700" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 hover:bg-gray-100 p-3 rounded-full shadow-md transition"
        >
          <FaChevronRight className="text-gray-700" />
        </button>
      </div>

      {/* -------- Stats Block -------- */}
      <div className="max-w-7xl mx-auto mt-24 px-4 font-montreal">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <StatBlock number="200+" label="brands" icon={<FaTags size={32} />} />
          <StatBlock
            number="250,000+"
            label="Products to choose from"
            icon={<FaSwatchbook size={32} />}
          />
          <StatBlock
            number="10,000+"
            label="Happy Customers"
            icon={<FaSmile size={32} />}
          />
          <StatBlock
            number="100,000+"
            label="Architects and Designers using our platform"
            icon={<FaHardHat size={32} />}
          />
        </div>
      </div>

      {/* -------- Trusted Clients -------- */}
      <div className="max-w-7xl mx-auto mt-24 px-4 text-center font-montreal">
        <h3 className="text-2xl font-semibold mb-6">
          Trusted by Leading Clients
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-12">
          <img
            src="/images/clients/client1.jpg"
            className="h-24 w-24 object-contain"
            alt="client"
          />
          <img
            src="/images/clients/client2.jpeg"
            className="h-24 w-24 object-contain"
            alt="client"
          />
          <img
            src="/images/clients/client3.png"
            className="h-24 w-24 object-contain"
            alt="client"
          />
          <img
            src="/images/clients/client4.png"
            className="h-24 w-24 object-contain"
            alt="client"
          />
        </div>
      </div>

      {/* -------- Top Stories -------- */}
      <div className="max-w-7xl mx-auto mt-24 px-4 font-montreal">
        <h3 className="text-2xl font-semibold text-center mb-8">Top Stories</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <StoryCard
            image="/images/clients/story1.jpeg"
            title="Design Trends 2025"
            description="The latest in luxury, minimalism, and eco-conscious spaces."
          />
          <StoryCard
            image="/images/clients/story2.jpeg"
            title="How Architects Choose Materials"
            description="Insights from 100+ top architects across India."
          />
          <StoryCard
            image="/images/clients/story3.jpeg"
            title="Customer Journey Spotlight"
            description="A family’s full home transformation using our platform."
          />
        </div>
      </div>
    </div>
  );
}

// -------- Reusable Components --------
function StatBlock({ number, label, icon }) {
  return (
    <div className="flex flex-col items-center text-center font-montreal">
      <div className="mb-3 text-black">{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{number}</p>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}

function StoryCard({ image, title, description }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition font-montreal">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="p-5">
        <h4 className="font-semibold text-lg mb-2 text-gray-800">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
} 