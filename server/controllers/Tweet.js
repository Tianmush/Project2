const models = require('../models');

const { Tweet } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.tweetmsg) {
    return res.status(400).json({ error: 'All Fields are required!' });
  }

  const domoData = {
    name: req.body.name,
    tweetmsg: req.body.tweetmsg,
    owner: req.session.account._id,
    
  };

  try {
    const newTweet = new Tweet(domoData);
    await newTweet.save();
    return res.status(201).json({ name: newTweet.name, tweetmsg: newTweet.tweetmsg });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tweet already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};


const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Tweet.find(query).select('name tweetmsg ').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};
const deleteDomo = async (req, res) => {
  const domoIdToDelete = req.body.domoId; // Assuming you send the Tweet _id from the client

  try {
    // Find and remove the Tweet from the database
    const result = await Tweet.findByIdAndRemove(domoIdToDelete);
    
    if (result) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: 'Tweet not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting Tweet' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
