const { Router } = require('express');
const users = require('./user');

const router = Router();

router.use('/users', users);

module.exports = router;
