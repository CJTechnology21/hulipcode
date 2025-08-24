const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/db');
// Import custom modules
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
const leadRoutes = require("./routes/leadRoutes")
const projectRoutes = require('./routes/projectRoutes');
const vendorTokenRoutes = require('./routes/vendorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subCategoryRoutes')
const s3Routes = require('./routes/s3Routes')
const uploadRoutes = require('./routes/upload')
const taskRoutes = require('./routes/taskRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes')
const photoRoutes = require("./routes/photoRoutes")
const twoDRoutes = require("./routes/twoDRoutes")
const partyRoutes = require("./routes/partyRoutes")
const todoRoutes = require('./routes/todoRoutes')
const quoteRoutes = require('./routes/quoteRoutes')
const vendorOrderRoutes = require('./routes/vendorOrdersRoutes')
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

//  CORS Configuration — allow only your frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://first-task-alpha.vercel.app',
  'https://first-task-1pscijvoq-coyipo7369-wenkuucoms-projects.vercel.app',
];
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming request origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(" Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

//  Middleware to parse JSON
app.use(express.json());

//  Route registrations
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
app.use("/api/leads",leadRoutes);
app.use('/api/projects',projectRoutes)
app.use('/api/s3',s3Routes)
app.use("/api/upload", uploadRoutes);
app.use("/api/tasks",taskRoutes)
app.use('/api/invoice',invoiceRoutes)
app.use('/api/attendance',attendanceRoutes);
app.use('/api/photo',photoRoutes) 
app.use("/api/2dlayout",twoDRoutes)
app.use("/api/party",partyRoutes)
app.use("/api/todo",todoRoutes)
app.use("/api/quote",quoteRoutes)
app.use("/api/vendorOrders",vendorOrderRoutes)
// app.use("/api/categories",categoryRoutes);
// app.use("/api/subcategories",subcategoryRoutes)

//  Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
