const TweetModel = require('../models/Tweet');

const AccountModel = require('../models/Account'); // Adjust the path accordingly


const uchatpanelPage = (req, res) => res.render('app');


const makeTweet = async (req, res) => {
  if (!req.body.resName || !req.body.tweetmsg) {
    return res.status(400).json({ error: 'Receiver username and message are required!' });
  }

  const senderId = req.session.account._id;
  const receiverUsername = req.body.resName;

  try {
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
    const query = {};
    const docs = await TweetModel.find(query).populate('sender receiver', 'username').lean().exec();

    return res.json({ tweets: docs });
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

const addFriend = async (req, res) => {
  const userId = req.session.account._id;
  const friendId = req.params.friendId;

  try {
      // Check if the friend is already added
      const user = await AccountModel.findById(userId).exec();
      if (user.friends.includes(friendId)) {
          return res.status(400).json({ error: 'This user is already your friend.' });
      }

      // Add friend
      user.friends.push(friendId);
      await user.save();

      // You can also update the friend's list on the client side

      return res.status(200).json({ friend: { _id: friendId, username: 'username' } });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while adding a friend.' });
  }
};

const searchUser = async (req, res) => {
  const searchUsername = req.query.username;

  try {
      const users = await AccountModel.find({ username: { $regex: searchUsername, $options: 'i' } }).exec();
      return res.json({ results: users });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while searching for users.' });
  }
};






module.exports = {
  uchatpanelPage,
  makeTweet,
  getTweets,
  getUserData,
  addFriend,
  searchUser,
  
};
