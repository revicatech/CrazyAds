require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const caseStudyRoutes = require('./routes/caseStudyRoutes');
const caseCategoryRoutes = require('./routes/caseCategoryRoutes');
const industryRoutes = require('./routes/industryRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const portfolioCategoryRoutes = require('./routes/portfolioCategoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const teamRoutes = require('./routes/teamRoutes');
const whyUsRoutes = require('./routes/whyUsRoutes');

// Connect to database
connectDB();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Mount routes
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/case-categories', caseCategoryRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/portfolio-categories', portfolioCategoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/why-us', whyUsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Crazy Ads API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});