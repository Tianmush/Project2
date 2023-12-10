const FriendModel = require('../models/Friend');
const AccountModel = require('../models/Account');

const uchatpanelPage = (req, res) => res.render('app');

const addFriend = async (req, res) => {
  if (!req.body.frndName) {
    return res.status(400).json({ error: 'Friend username is required!' });
  }

  const userId = req.session.account._id;
  const friendUsername = req.body.frndName;

  try {
    const friend = await AccountModel.findOne({ username: friendUsername }).exec();

    if (!friend) {
      return res.status(400).json({ error: 'Friend not found!' });
    }

    const friendData = {
      user: userId,
      friend: friend._id,
    };

    // Check if the friendship already exists
    const existingFriendship = await FriendModel.findOne(friendData).exec();
    if (existingFriendship) {
      return res.status(400).json({ error: 'Friendship already exists!' });
    }

    const newFriendship = new FriendModel(friendData);
    await newFriendship.save();

    return res.status(201).json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while adding friend!' });
  }
};


module.exports = {
  uchatpanelPage,
  addFriend,
  
};
