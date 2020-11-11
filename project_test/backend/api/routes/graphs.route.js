const express = require('express');
const { getGraphsByIdHandler, insertGraphHandler } = require('../controllers/graphs.controller');
const authentication = require('../middleware/auth');

const router = express.Router();

router.get('/:graphId', authentication, getGraphsByIdHandler);
router.post('/insert', authentication, insertGraphHandler);

module.exports = router;
