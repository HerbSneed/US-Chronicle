// Import Schema from mongoose
const { Schema } = require('mongoose');

// Define schema fro news Data
const newsSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    source_country: {
        type: String,
        required: true,
    },
    newsId: {
        type: String,
        required: true,
      },
    url: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    language: {
        type: String
    },
    latest_publish_date: {
        type: String
    },
    category: {
        type: String
    },

});


module.exports = newsSchema;
