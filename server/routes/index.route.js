const express = require('express');
const businessRoutes = require('./business.route');
const dishRoutes = require('./dish.route');

const router = express.Router(); // eslint-disable-line new-cap
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);
router.use('/business', businessRoutes);
router.use('/dish', dishRoutes);
module.exports = router;
