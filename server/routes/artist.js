/* eslint-disable function-paren-newline */
const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const userController = require('../controllers/userController');

// api for artist to login
router.post('/login', artistController.loginUser, artistController.setCookie, (req, res) => {
  return res.status(200).json({ id: res.locals.artistId, name: res.locals.artistName });
});

// api for artist to signup, as well as set the cookie for persistent login
router.post('/signup', artistController.createUser, artistController.setCookie, (req, res) => {
  return res.status(200).json({ id: res.locals.userId });
});

// api to access the artist's personal dashboard after login
router.get('/dashboard', artistController.getDashboard, (req, res) => {
  return res.status(200).json({ campaigns: res.locals.campaignData });
});

// api for artist to send data to db in order to create a campaign
router.post('/createcampaign', artistController.createCampaign, (req, res) => {
  return res.status(200).json('Successful Campaign Creation');
});

// api that sends data to the artist so they can see their current information
router.post('/editcampaign', artistController.editCampaign, (req, res) => {
  return res.status(200).json(res.locals.campaignData);
});

// api for artist to update their campaign information in the db
router.post('/updateCampaign', artistController.updateCampaign, (req, res) => {
  return res.status(200).json('Successful Campaign Update');
});

// api for artist to deactivate their campaign
router.patch('/deactivatecampaign', artistController.deactivateCampaign, (req, res) => {
  return res.status(200).json('Campaign successfully deactivated');
});

router.get(
  '/campaign/:id',
  userController.retrieveCampaignLocationData,
  artistController.getCampaignDetails,
  (req, res) => {
    return res.status(200).json(res.locals.campaign);
  }
);

module.exports = router;
