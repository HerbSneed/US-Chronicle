// Import mongoose module for MongoDB connection
const mongoose = require('mongoose');

// Connect to MongoDB Atlas cluster
mongoose.connect('mongodb+srv://hmsneed79:Sneed2628191931@us-chronicle-cluster.lkumjq8.mongodb.net/?retryWrites=true&w=majority');

// Export the database connection
module.exports = mongoose.connection;
