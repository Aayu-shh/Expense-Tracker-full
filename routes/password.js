const express = require('express');
const passwordController = require('../controllers/password');

const router = express.Router();

router.post('/forgot', passwordController.forgotPass)

router.get('/reset/:uuid', passwordController.resetPass);

router.post('/update/:uuid', passwordController.updatePass);

module.exports = router;
