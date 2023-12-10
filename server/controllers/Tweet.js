const TweetModel = require('../models/Tweet');

const AccountModel = require('../models/Account'); // Adjust the path accordingly
const FriendModel = require('../models/Friend');


const uchatpanelPage = (req, res) => res.render('app');


const makeTweet = async (req, res) => {
  if (!req.body.resName || !req.body.tweetmsg) {
    return res.status(400).json({ error: 'Receiver username and message are required!' });
  }

  const senderId = req.session.account._id;
  const receiverUsername = req.body.resName;

  try {
    // Fetch sender's friends
    const senderFriends = await FriendModel.find({ user: senderId }).populate('friend').exec();

    // Check if the receiver is a friend
    const isFriend = senderFriends.some(friend => friend.friend.username === receiverUsername);

    if (!isFriend) {
      return res.status(400).json({ error: 'You can only send messages to friends!' });
    }

    const receiver = await AccountModel.findOne({ username: receiverUsername }).exec();

    if (!receiver) {
      return res.status(400).json({ error: 'Receiver not found!' });
    }

    const tweetData = {
      sender: senderId,
      receiver: receiver._id,
      message: req.body.tweetmsg,
    };

    const newTweet = new TweetModel(tweetData);
    await newTweet.save();

    return res.status(201).json({ name: newTweet.name, tweetmsg: newTweet.tweetmsg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while Chatting!' });
  }
};
const getTweets = async (req, res) => {
  try {
    const userId = req.session.account._id;

    // Find tweets where the current user is the sender or receiver
    const query = {
      $or: [{ sender: userId }, { receiver: userId }],
    };

    const docs = await TweetModel.find(query)
      .populate('sender receiver', 'username')
      .lean()
      .exec();

    return res.json({ tweets: docs, userId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving chats!' });
  }
};

const getUserData = (req, res) => {
  const userData = {
    username: req.session.account.username,
    email: req.session.account.email,
    // Add other user data fields as needed
  };
  return res.json({ userData });
};

const getAllUsers = async (req, res) => {
  try {
    let query = {};

    // Check if a search query is provided
    if (req.query.search) {
      query = { username: { $regex: req.query.search, $options: 'i' } };
    }

    const users = await AccountModel.find(query, 'username').lean().exec();
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error retrieving users!' });
  }
};

// Update the getTweetsForFriend function in server/controllers/Tweet.js
const getTweetsForFriend = async (req, res) => {
  try {
    const userId = req.session.account._id;
    const friendId = req.params.friendId;

    // Find tweets where the current user is the sender and the selected friend is the receiver,
    // or the current user is the receiver and the selected friend is the sender
    const query = {
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    };

    const docs = await TweetModel.find(query)
      .populate('sender receiver', 'username')
      .lean()
      .exec();

    return res.json({ tweets: docs, userId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving chats!' });
  }
};




module.exports = {
  uchatpanelPage,
  makeTweet,
  getTweets,
  getUserData,
  getAllUsers,
  getTweetsForFriend,
};
