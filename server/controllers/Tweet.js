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






module.exports = {
  uchatpanelPage,
  makeTweet,
  getTweets,
  getUserData,
  
};
