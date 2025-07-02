import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "./Header";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    priceClient: "",
    priceArchitect: "",
    category: "",
    subCategory: "",
    brand: "",
    size: "",
    thickness: "",
    finish: "",
    countInStock: "",
    images: [""],
  });

  const [role, setRole] = useState("");
  const [vendorId, setVendorId] = useState("");

  useEffect(() => {
    const crmRole = localStorage.getItem("crm_role");
    const crmId = localStorage.getItem("crm_user_id");

    setRole(crmRole);
    setVendorId(crmId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (role !== "vendor") {
    toast.error("Only vendors are allowed to add products");
    return;
  }

  const token = localStorage.getItem("crm_token");
  if (!token) {
    toast.error("No token found. Please login again.");
    return;
  }

  try {
    const payload = {
      name: form.name,
      description: form.description,
      price: {
        client: Number(form.priceClient),
        architect: Number(form.priceArchitect),
      },
      category: form.category,
      subCategory: form.subCategory,
      brand: form.brand,
      images: form.images.filter(Boolean),
      inStock: true,
      countInStock: Number(form.countInStock),
      size: form.size,
      thickness: form.thickness,
      finish: form.finish,
      vendor: vendorId,
      vendorName: "Vendor",
    };

    const res = await axios.post("http://localhost:5000/api/products", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Product added successfully!");
    // Reset form
    setForm({
      name: "",
      description: "",
      priceClient: "",
      priceArchitect: "",
      category: "",
      subCategory: "",
      brand: "",
      size: "",
      thickness: "",
      finish: "",
      countInStock: "",
      images: [""],
    });
  } catch (err) {
    console.error(err);
    toast.error("Failed to add product");
  }
};

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-xl shadow-xl my-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Add New Product
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="input"
            required
          />
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="input"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="input"
            required
          />
          <input
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            placeholder="Subcategory"
            className="input"
            required
          />
          <input
            name="priceClient"
            type="number"
            value={form.priceClient}
            onChange={handleChange}
            placeholder="Price (Client)"
            className="input"
            required
          />
          <input
            name="priceArchitect"
            type="number"
            value={form.priceArchitect}
            onChange={handleChange}
            placeholder="Price (Architect)"
            className="input"
            required
          />
          <input
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="Size (e.g., 8ft x 4ft or 120cm)"
            className="input"
          />
          <input
            name="thickness"
            value={form.thickness}
            onChange={handleChange}
            placeholder="Thickness (e.g., 1mm)"
            className="input"
          />
          <input
            name="finish"
            value={form.finish}
            onChange={handleChange}
            placeholder="Finish (e.g., Matte, Glossy)"
            className="input"
          />
          <input
            name="countInStock"
            type="number"
            value={form.countInStock}
            onChange={handleChange}
            placeholder="Stock Count"
            className="input"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="input md:col-span-2 h-24"
            required
          />

          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold text-gray-700">
              Images (URLs)
            </label>
            {form.images.map((img, idx) => (
              <input
                key={idx}
                value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                placeholder={`Image URL ${idx + 1}`}
                className="input mb-2"
              />
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-blue-600 hover:underline text-sm mt-2"
            >
              + Add another image
            </button>
          </div>

          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-all duration-200"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
