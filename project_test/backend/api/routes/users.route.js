const express = require('express');
const {
  postAuthenticateHandler,
  getUserProfileHandler,
  getUserHandler,
  getUserCompaniesHandler,
  subscribeToNotificationHandler,
  updateUserProfileHandler,
  resetUserPasswordHandler,
  changeUserPasswordHandler,
  userLogoutHandler,
} = require('../controllers/users.controller');
const authentication = require('../middleware/auth');

const router = express.Router();

router.post('/login', postAuthenticateHandler);
router.get('/profile', authentication, getUserProfileHandler);
router.post('/logout', authentication, userLogoutHandler);
router.get('/:userId', authentication, getUserHandler);
router.get('/:userId/companies', authentication, getUserCompaniesHandler);
router.post('/notifications/subscribe', authentication, subscribeToNotificationHandler);
router.post('/resetpassword', resetUserPasswordHandler);
router.post('/changePassword', authentication, changeUserPasswordHandler);
router.put('/', authentication, updateUserProfileHandler);

module.exports = router;
