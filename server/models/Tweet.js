const mongoose = require('mongoose');


const TweetSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// ... rest of the schema remains unchanged


TweetSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  tweetmsg:  doc.tweetmsg,
  
 
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;
