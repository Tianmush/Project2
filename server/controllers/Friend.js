
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
    if (userId.toString() === friend._id.toString()) {
      return res.status(400).json({ error: 'You cannot add yourself as a friend!' });
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

    return res.status(201).json({ error: 'Friend added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while adding friend!' });
  }
};

const getFriends = async (req, res) => {
  const userId = req.session.account._id;

  try {
    // Find friends of the current user
    const friends = await FriendModel.find({ user: userId })
      .populate('friend', 'username') // Populate the 'friend' field with the 'username'
      .exec();

    res.json({ friends, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while getting friends!' });
  }
};
const selectFriend = async (req, res) => {
  const userId = req.session.account._id;
  const friendId = req.params.friendId;

  try {
    // Check if the friend exists and is associated with the current user
    const friend = await FriendModel.findOne({ user: userId, friend: friendId }).exec();

    if (!friend) {
      return res.status(404).json({ error: 'Friend not found!' });
    }

    // Perform the selection logic (you can update this as per your requirements)
    // For example, you might want to set a selected flag in the database

    return res.status(200).json({ error: 'Friend selected successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while selecting friend!' });
  }
};

const deleteFriend = async (req, res) => {
  const userId = req.session.account._id;
  const friendId = req.params.friendId;

  try {
    // Check if the friend exists and is associated with the current user
    const friend = await FriendModel.findOneAndDelete({ user: userId, friend: friendId }).exec();

    if (!friend) {
      return res.status(404).json({ error: 'Friend not found!' });
    }

    return res.status(200).json({ message: 'Friend deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while deleting friend!' });
  }
};
module.exports = {
  uchatpanelPage,
  addFriend,
  getFriends,
  selectFriend,
  deleteFriend,

};

