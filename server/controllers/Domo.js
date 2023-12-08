const models = require('../models');

const { Tweet } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.tweetmsg) {
    return res.status(400).json({ error: 'All Fields are required!' });
  }

  const tweetData = {
    name: req.body.name,
    tweetmsg: req.body.tweetmsg,
    owner: req.session.account._id,
    
  };

  try {
    const newTweet = new Tweet(tweetData);
    await newTweet.save();
    return res.status(201).json({ name: newTweet.name, tweetmsg: newTweet.tweetmsg });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tweet already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making tweet!' });
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


module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  
};
