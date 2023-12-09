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

FriendSchema.virtual('friends', {
  ref: 'Friend',
  localField: '_id',
  foreignField: 'user',
});

const FriendModel = mongoose.model('Friend', FriendSchema);
module.exports = FriendModel;