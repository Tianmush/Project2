const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age ||!req.body.level) {
    return res.status(400).json({ error: 'All Fields are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age level').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};
const deleteDomo = async (req, res) => {
  const domoIdToDelete = req.body.domoId; // Assuming you send the Domo _id from the client

  try {
    // Find and remove the Domo from the database
    const result = await Domo.findByIdAndRemove(domoIdToDelete);
    
    if (result) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: 'Domo not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting Domo' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
