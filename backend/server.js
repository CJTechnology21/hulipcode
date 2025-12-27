// Load environment variables FIRST before any other requires
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
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
const transactionRoutes = require('./routes/transactionRoutes')
const projectAttendanceRoutes = require('./routes/projectAttendanceRoutes')
const staffRoutes = require('./routes/staffRoutes')
const subConRoutes = require("./routes/subConRoutes")
const siteRoutes = require('./routes/siteMeasurementsRoutes')
const rfqRoutes = require('./routes/rfqRoutes');
const pendingMaterialRoutes = require('./routes/pendingMaterialRoutes')
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes')
const walletRoutes = require('./routes/walletRoutes')
const contractRoutes = require('./routes/contractRoutes')
const ledgerRoutes = require('./routes/ledgerRoutes')
const webhookRoutes = require('./routes/webhookRoutes')
const adminRoutes = require('./routes/adminRoutes')
const portfolioRoutes = require('./routes/portfolioRoutes')
const portfolioProfileRoutes = require('./routes/portfolioProfileRoutes')
const shortlistRoutes = require('./routes/shortlistRoutes')

// Connect to MongoDB with retry logic
let dbConnected = false;
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('✅ Database connection established');
      return;
    } catch (err) {
      console.error(`❌ Connection attempt ${i + 1}/${retries} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ Failed to connect to MongoDB after all retries.');
        console.error('Please check:');
        console.error('   1. MongoDB is running (local or Atlas)');
        console.error('   2. MONGO_URI in .env file is correct');
        console.error('   3. Network connectivity');
        dbConnected = false;
      }
    }
  }
};

connectWithRetry();

const app = express();

//  CORS Configuration — allow only your frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://first-task-alpha.vercel.app',
  'https://first-task-1pscijvoq-coyipo7369-wenkuucoms-projects.vercel.app',
  'https://first-task-9ud7w7v0t-coyipo7369-wenkuucoms-projects.vercel.app',
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

// Serve static files from uploads directory (for local storage fallback)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Route registrations
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/shortlist', shortlistRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/config', configRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/location', locationRoutes);
app.use("/api/vendor", vendorTokenRoutes);
app.use("/api/leads", leadRoutes);
app.use('/api/projects', projectRoutes)
app.use('/api/s3', s3Routes)
app.use("/api/upload", uploadRoutes);
app.use("/api/tasks", taskRoutes)
app.use('/api/invoice', invoiceRoutes)
app.use('/api/attendance', attendanceRoutes);
app.use('/api/photo', photoRoutes)
app.use("/api/2dlayout", twoDRoutes)
app.use("/api/party", partyRoutes)
app.use("/api/todo", todoRoutes)
app.use("/api/quote", quoteRoutes)
app.use("/api/vendorOrders", vendorOrderRoutes)
app.use("/api/transaction", transactionRoutes)
app.use("/api/proattendance", projectAttendanceRoutes)
app.use("/api/staff", staffRoutes)
app.use("/api/subcon", subConRoutes)
app.use('/api/site', siteRoutes)
app.use('/api/rfq', rfqRoutes)
app.use('/api/pending-materials', pendingMaterialRoutes)
app.use('/api/purchase-orders', purchaseOrderRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/contracts', contractRoutes)
app.use('/api/ledger', ledgerRoutes)
app.use('/webhooks', webhookRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/portfolio-profile', portfolioProfileRoutes)
// app.use("/api/categories",categoryRoutes);
// app.use("/api/subcategories",subcategoryRoutes)

//  Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server running on port ${PORT}`);
});