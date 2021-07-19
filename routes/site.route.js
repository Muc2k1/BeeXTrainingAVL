const express = require('express');
const router = express.Router();

const siteController = require('../controllers/SiteController.js');

router.use('/showSite', siteController.showSite); //cai chi tiet nam tren
router.use('/', siteController.index)

module.exports = router;