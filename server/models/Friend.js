const mongoose = require('mongoose');


const FriendSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  friend: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
 
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// ... rest of the schema remains unchanged


FriendSchema.statics.toAPI = (doc) => ({
  sender: doc.sender,
  receiver:doc.receiver,
  message:  doc.message,
 
});

const FriendModel = mongoose.model('Friend', FriendSchema);
module.exports = FriendModel;
