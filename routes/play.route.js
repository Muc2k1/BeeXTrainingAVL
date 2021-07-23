const express = require('express');
const router = express.Router();

const playController = require('../controllers/PlayController.js');

// router.use('/showSite', siteController.showSite); //cai chi tiet nam tren
router.post('/', playController.index)

module.exports = router;
