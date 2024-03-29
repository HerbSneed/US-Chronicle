const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://hmsneed79:Sneed2628191931@us-chronicle-cluster.lkumjq8.mongodb.net/?retryWrites=true&w=majority');

module.exports = mongoose.connection;
