const db = require('../models/dataModels');
const moment = require('moment-timezone');

const artistController = {};

//////////// QUERIES ///////////////
const signupQuery =
  'INSERT INTO artist (name, username, password, location, join_date) VALUES ($1, $2, $3, $4, $5) RETURNING id';
const loginQuery = 'SELECT name, password, id FROM artist WHERE username=$1';
const updateCookie = 'UPDATE artist SET cookie=$1 WHERE id=$2';
const verifyCookie = 'SELECT cookie FROM artist WHERE id=$1';
const createCampaignQuery =
  'INSERT INTO campaign (artist_id, name, active, video, facebook, twitter, instagram, youtube, soundcloud, tiktok, spotify, bio ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
const retrieveCampaign = 'SELECT * FROM campaign WHERE id = $1 AND active = true';
const updateCampaign =
  'UPDATE campaign SET name = $2, video = $3, facebook = $4, twitter = $5, instagram = $6, youtube = $7, soundcloud = $8, tiktok = $9, spotify = $10, bio = $11 WHERE id = $1 AND active = true';
const getDashboardQuery = 'SELECT * FROM campaign WHERE artist_id=$1 ORDER BY active DESC, id DESC';
const deactivateCampaignQuery = 'UPDATE campaign SET active=false WHERE id=$1';
const getCitiesQuery =
  'SELECT DISTINCT location FROM datapoint WHERE campaign_id=$1';
const getCityCountsQuery =
  'SELECT COUNT(id) FROM datapoint WHERE campaign_id=$1 AND location=$2';
const getLatLongQuery = 'SELECT lat, long FROM datapoint WHERE campaign_id=$1';

// used for query data populating

const today = moment(new Date())
  .tz('America/Los_Angeles')
  .format()
  .slice(0, 10);

/////////// CONTROLLERS //////////////////
// Creates a user in the database
artistController.createUser = (req, res, next) => {
  // signupQuery inserts the artist signup information into the database
  db.query(signupQuery, [
    req.body.name,
    req.body.username,
    req.body.password,
    req.body.location,
    today
  ])
    .then((data) => {
      res.locals.userId = data.rows[0].id;
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occured in artistController.createUser',
        status: 400,
        message: { err: err }
      });
    });
};

// Attempts to log the user in by querying the database for the user's password, and logging them in dependent upon the submitted password being equal to the password associated with the submitted username in the database
artistController.loginUser = (req, res, next) => {
  // Queries the database for the password associated with the given username
  db.query(loginQuery, [req.body.username])
    .then(dbPw => {
      console.log(dbPw.rows[0]);
      if (dbPw.rows[0].password === req.body.password) {
        res.locals.artistId = dbPw.rows[0].id;
        res.locals.artistName = dbPw.rows[0].name;
        return next();
      } else {
        return res.status(400).send('Invalid username/password');
      }
    })
    .catch((err) => {
      return next({
        log: 'Error occured in artistController.loginUser',
        status: 400,
        message: { err: err }
      });
    });
};

// Sets the cookie
artistController.setCookie = (req, res, next) => {
  // create a random number to randomize the cookie
  const random = Math.floor(Math.random() * 999).toString();
  // ArtistI can be interpreted as ArtistID
  res.cookie('artistI', res.locals.artistId, { httpOnly: true });
  res.cookie('cookie', random, { httpOnly: true, overwrite: true });
  db.query(updateCookie, [random, res.locals.userId])
    .then((res) => {
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occured in artistController.setCookie',
        status: 400,
        message: { err: err }
      });
    });
};

// Verifies the cookie
artistController.verifyCookie = (req, res, next) => {
  if (!req.cookies.artistI || !req.cookies.cookie) {
    res.locals.verify = false;
    return next();
  }
  db.query(verifyCookie, [req.cookies.artistI]).then(verif => {
    if (verif.rows[0].cookie == req.cookies.cookie) {
      res.locals.verify = true;
      return next();
    } else {
      res.locals.verify = false;
      return next();
    }
  });
};

// Creates an artist campaign in the database
artistController.createCampaign = (req, res, next) => {
  // Sets campaign params to input into the database
  const params = [
    req.body.artist_id, // passed in from state
    req.body.name,
    true, // campaign defaults to active during creation
    req.body.video,
    req.body.facebook,
    req.body.twitter,
    req.body.instagram,
    req.body.youtube,
    req.body.soundcloud,
    req.body.tiktok,
    req.body.spotify,
    req.body.bio
  ];

  // Query inserts the campaign data into the database
  db.query(createCampaignQuery, params)
    .then((result) => {
      console.log('Campaign created successfully');
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occured in artistController.createCampaign',
        status: 400,
        message: { error: err.detail }
      });
    });
};

// query db to retrieve current campaign data in order to populate input fields
artistController.editCampaign = (req, res, next) => {
  // receive artist_id from state login session
  const id = [req.body.campaignId];

  // query campaign db for campaign data, return data to server thru locals.campaignData
  db.query(retrieveCampaign, id)
    .then((result) => {
      res.locals.campaignData = result.rows[0];
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occured in artistController.editCampaign',
        status: 400,
        message: { err: err.detail }
      });
    });
};

artistController.updateCampaign = (req, res, next) => {
  //  FROM QUERY: name = $2, video = $3, facebook = $4, twitter = $5,
  //instagram = $6, youtube = $7, soundcloud = $8, tiktok = $9, spotify = $10,
  // bio = $11) WHERE artist_id = $1 AND active = true";
  const params = [
    req.body.id, // campaign_id passed in from fetch post, passed down thru state
    req.body.name,
    req.body.video,
    req.body.facebook,
    req.body.twitter,
    req.body.instagram,
    req.body.youtube,
    req.body.soundcloud,
    req.body.tiktok,
    req.body.spotify,
    req.body.bio
  ];
  db.query(updateCampaign, params)
    .then((result) => {
      return next();
    }) // result from query isn't needed when updating
    .catch((err) => {
      return next({
        log: 'Error occured in artistController.updateCampaign',
        status: 400,
        message: { error: err.detail }
      });
    });
};

// Retrieves the dashboard data from the database
artistController.getDashboard = (req, res, next) => {
  const id = req.cookies.artistI;
  db.query(getDashboardQuery, [id])
    .then((data) => {
      res.locals.campaignData = data.rows;
      return next();
    })
    .catch(err => {
      return next({
        log: 'Error occured in artistController.getDashboard',
        status: 400,
        message: { err: err }
      });
    });
};

// submit updated inputs from edit campaign to update campaign db

// Deactivates the dashboard by switching the active column for the given campaign id to false
artistController.deactivateCampaign = (req, res, next) => {
  db.query(deactivateCampaignQuery, [req.body.id])
    .then((result) => {
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occured in artistController.deactivateCampaign',
        status: 400,
        message: { error: err.detail }
      });
    });
};

artistController.getCampaignDetails = async (req, res, next) => {
  try {
    const cities = await db.query(getCitiesQuery, [req.params.id]);
    const details = [];
    let total = 0;
    for (let i = 0; i < cities.rows.length; i++) {
      const data = await db.query(getCityCountsQuery, [
        req.params.id,
        cities.rows[i].location,
      ]);
      total += +data.rows[0].count;
      details.push({
        city: cities.rows[i].location,
        count: +data.rows[0].count,
      });
    }
    details.push({ total: total });
    res.locals.campaign.details = details;
    return next();
  } catch (err) {
    return next({
      log: 'Error occured in artistController.getCampaignDetails',
      status: 400,
      message: { error: err.detail },
    });
  }
};

module.exports = artistController;
