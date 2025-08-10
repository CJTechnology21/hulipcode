// services/mockServices.js

// Mock orders data
const mockOrders = [
  {
    id: "order1",
    products: [
      {
        id: "prod1",
        name: "Wireless Headphones",
        description: "High quality wireless headphones with noise cancellation.",
        price: 2999,
        image: "https://via.placeholder.com/150?text=Headphones",
      },
      {
        id: "prod2",
        name: "Smart Watch",
        description: "Smart watch with fitness tracking features.",
        price: 4999,
        image: "https://via.placeholder.com/150?text=Smart+Watch",
      },
    ],
  },
];

// Mock favourites data
const mockFavourites = [
  {
    _id: "fav1",
    productId: {
      id: "prod3",
      name: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with amazing sound.",
      price: 1999,
      image: "https://via.placeholder.com/150?text=Speaker",
    },
  },
];

// Mock addresses data
const mockAddresses = [
  { id: 1, label: "Home", details: "123 Main Street, City, State, 12345" },
  { id: 2, label: "Work", details: "456 Office Park, City, State, 67890" },
];

// Mock API calls (returning promises to simulate async)

export function getOrdersAPI() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOrders), 500); // 0.5 sec delay
  });
}

export function getFavouritesAPI() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockFavourites), 500);
  });
}

export function updateProfileAPI(updatedProfile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Profile updated:", updatedProfile);
      resolve({ success: true });
    }, 300);
  });
}

export function updateAddressAPI(addressId, newData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Address ${addressId} updated:`, newData);
      resolve({ success: true });
    }, 300);
  });
}

export function deleteAddressAPI(addressId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Address ${addressId} deleted`);
      resolve({ success: true });
    }, 300);
  });
}

export function addToCartAPI(productId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Product ${productId} added to cart`);
      resolve({ success: true });
    }, 300);
  });
}
// Example mock data & API functions

export async function getConnectedArchitectsAPI(clientId) {
  // Mock delay
  await new Promise((res) => setTimeout(res, 500));
  return [
    { id: 1, name: "Alice Architect", email: "alice@archi.com", status: "Connected" },
    { id: 2, name: "Bob Builder", email: "bob@build.com", status: "Pending" },
  ];
}

export async function getProjectsAPI(clientId) {
  await new Promise((res) => setTimeout(res, 500));
  return [
    {
      id: 101,
      title: "Dream Home Project",
      architectName: "Alice Architect",
      status: "Ongoing",
      description: "Construction of a modern 3-bedroom house.",
    },
    {
      id: 102,
      title: "Office Renovation",
      architectName: "Bob Builder",
      status: "Planning",
      description: "Revamping the 5th floor office space.",
    },
  ];
}
