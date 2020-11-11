/* eslint-disable import/prefer-default-export */
const webpush = require('web-push');
const {
  authenticateUser,
  getUser,
  getCompanies,
  updateProfileUser,
  generateJwt,
  subscribeToNotification,
  resetPassword,
  changeUserPassword,
  userLogout,
} = require('../services/users.service');

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

/**
 * Authenticate a user with email and password
 * @param {*} req
 * @param {*} res
 */

const postAuthenticateHandler = async (req, res) => {
  try {
    const { body } = req;
    const token = await authenticateUser(body.email, body.password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(403).send('Access forbidden');
  }
};

/**
 * Get user from id. Id comes from JWT payload.
 * @param {*} req
 * @param {*} res
 */
const getUserHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUser(userId);
    res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
 * Get companie sfor a given user
 * @param {*} req
 * @param {*} res
 */
const getUserCompaniesHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const companies = await getCompanies(userId);
    res.status(200).json({ data: companies });
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
 * Subscribe user to notification system
 * @param {*} req
 * @param {*} res
 */
const subscribeToNotificationHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { subscription } = req.body;
    const savedSubscription = await subscribeToNotification(subscription, id);
    const payload = JSON.stringify({
      title: 'Subscription successful!',
      body: 'You are now subscribed to THM-Insight Alert Service.',
    });
    if (savedSubscription) {
      webpush.sendNotification({ endpoint: JSON.parse(savedSubscription).endpoint, keys: JSON.parse(savedSubscription).keys }, payload)
        .then((result) => console.log(`Notification Subscription StatusCode: ${result.statusCode} UserId: ${id}`))
        .catch((e) => console.log(e.message));
      return res.status(200).json({ success: true });
    }
    return res.status(400).send('Subscription Failed');
  } catch (err) {
    console.log(err);
    return res.status(403).send('Access forbidden');
  }
};
const updateUserProfileHandler = async (req, res) => {
  try {
    const {
      firstName, lastName, country, city, phoneNumber, position,
    } = req.body;
    const userId = req.user.id;
    const updatedProfile = await updateProfileUser(firstName, lastName, country, city, phoneNumber, position, userId);
    const token = generateJwt(updatedProfile);
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(403).send('Failed info');
  }
};
/**
 * Get user from id. Id comes from JWT payload.
 * @param {*} req
 * @param {*} res
 */
const getUserProfileHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await getUser(id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

const resetUserPasswordHandler = async (req, res) => {
  try {
    const { forgetMail, clientUrl } = req.body;
    await resetPassword(forgetMail, clientUrl);
    // besoin de renvoyer qqch ?
    return res.status(200).json();
  } catch (err) {
    console.log(err);
    return res.status(403).send('Request Failed');
  }
};

const changeUserPasswordHandler = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.headers.authorization;
    const { email } = req.user;
    await changeUserPassword(email, password, token);
    return res.status(200).json();
  } catch (err) {
    console.log(err);
    return res.status(403).send(err.message);
  }
};

const userLogoutHandler = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { id } = req.user;
    await userLogout(id, token);
    res.status(200).send('Log user');
  } catch (err) {
    console.log(err);
    res.status(403).send('Failed Logout in logs');
  }
};
module.exports = {
  postAuthenticateHandler,
  getUserHandler,
  getUserCompaniesHandler,
  subscribeToNotificationHandler,
  updateUserProfileHandler,
  getUserProfileHandler,
  resetUserPasswordHandler,
  changeUserPasswordHandler,
  userLogoutHandler,
};
