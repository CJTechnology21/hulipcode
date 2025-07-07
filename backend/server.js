const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Import custom modules
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favouriteRoutes = require("./routes/favouriteRoutes");
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const configRoutes = require('./routes/configRoutes');
const pushRoutes = require("./routes/push");
const locationRoutes = require('./routes/location');
const vendorTokenRoutes = require('./routes/vendorRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS Configuration — allow local and deployed frontends
const allowedOrigins = [
  'https://first-task-alpha.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ JSON parser middleware
app.use(express.json());

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/config', configRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/location', locationRoutes);
app.use("/api/vendor", vendorTokenRoutes);

// ✅ Health check or fallback route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./utils/db');
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const favouriteRoutes = require("./routes/favouriteRoutes");
// const userRoutes = require('./routes/userRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const subscribeRoutes = require('./routes/subscribeRoutes');
// const configRoutes = require('./routes/configRoutes');
// const pushRoutes = require("./routes/push");
// const locationRoutes = require('./routes/location')
// const vendorTokenRoutes = require('./routes/vendorRoutes')
// const cors = require('cors');

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // CORS Configuration: Allow both localhost and Vercel frontend
// const allowedOrigins = [
//   'https://first-task-alpha.vercel.app',
//   'http://localhost:3000'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));

// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/favourites', favouriteRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/subscribe', subscribeRoutes);
// app.use('/api/config', configRoutes);
// app.use('/api/push', pushRoutes);
// app.use('/api/location',locationRoutes)
// app.use("/api/vendor", vendorTokenRoutes); 

// // Fallback route (optional)
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
