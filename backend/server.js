
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes= require('./routes/cartRoutes');
const favouriteRoutes = require("./routes/favouriteRoutes");
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes')
const configRoutes = require('./routes/configRoutes');
const pushRoutes = require("./routes/push");
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/favourites',favouriteRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/config', configRoutes);
app.use('/api/push',pushRoutes)
// Fallback route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
