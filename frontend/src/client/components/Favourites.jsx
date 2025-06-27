import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify";

function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      const token = localStorage.getItem("crm_token");
      if (!token) {
        toast.warning("Please log in to view favourites");
        return;
      }

      const res = await fetch("http://localhost:5000/api/favourites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch favourites");

      const data = await res.json();
      setFavourites(data);
    } catch (err) {
      console.error("Error fetching favourites:", err);
      toast.error("Could not load favourites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">My Favourites</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : favourites.length === 0 ? (
          <p className="text-gray-500">You have no favourite products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {favourites
              .filter((fav) => fav.productId !== null)
              .map((fav) => (
                <ProductCard key={fav._id} product={fav.productId} />
              ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Favourites;
