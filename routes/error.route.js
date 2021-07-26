const express = require('express');
const router = express.Router();

const errorController = require('../controllers/ErrorController.js');

// router.use('/showSite', siteController.showSite); //cai chi tiet nam tren
router.post('/', errorController.index)

module.exports = router;
