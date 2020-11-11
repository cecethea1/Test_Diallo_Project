const nodemailer = require('nodemailer');
const shajs = require('sha.js');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const {
  SECRET, JWT_SECRET, MAIL_USER, MAIL_PASSWORD,
} = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER, // replace with the email address
    pass: MAIL_PASSWORD, // replace with the password
  },
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log('Mail Server Ready');
  }
});

/**
 * Format user before response
 * @param {object} userDb
 */
const formatUser = (userDb) => ({
  id: userDb.id,
  email: userDb.email,
  firstName: userDb.first_name,
  lastName: userDb.last_name,
  country: userDb.country,
  city: userDb.city,
  position: userDb.position,
  phoneNumber: userDb.phone_number,
  createdAt: userDb.created_at,
  updatedAt: userDb.updated_at,
});

/**
 * Generate hash password
 * Generate online: https://emn178.github.io/online-tools/sha256.html
 * @param {string} email
 * @param {string} password
 */
const hashPassword = (email, password) => shajs('sha256').update(`${email}${password}${SECRET}`).digest('hex');

/**
 * Generate a new JWT token
 * @param {*} payload
 */
const generateJwt = (payload, expiresIn = '1 days') => jwt.sign(payload, JWT_SECRET, { expiresIn });

/**
 * Validate if token still valid
 * @param {string} token
 */
const validateJwt = (token) => jwt.verify(token, JWT_SECRET);

/**
 * Get companies for a user
 * @param {number} User id
 */
const getCompanies = async (id) => {
  const companiesRes = await db.query(`
    SELECT c.id, c.name
    FROM users u INNER JOIN companies c ON u.company_id = c.id
    WHERE u.id = $1;
  `, [id]);

  if (companiesRes.rowCount > 0) {
    return companiesRes.rows;
  }

  return [];
};

// insert date.now when user login
const userLogin = async (id, token) => {
  const res = await db.query(`
  INSERT INTO users_logs (login,user_id,token)
  VALUES (now(),$1,$2)
  RETURNING id;
  `, [id, token]);
  if (res.rowCount > 0) {
    return true;
  }
  throw (new Error('Cannot insert logs'));
};

/**
 * Authenticate an user, throw an error if credentials don't work or user doesn't exist
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} token
 */

const authenticateUser = async (email, password) => {
  const hash = hashPassword(email, password);
  const queryText = {
    text: ` SELECT s.id, s.email, s.first_name as firstName, s.last_name as lastName
            FROM users s
            WHERE email = $1 AND password = $2`,
    values: [email, hash],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      const user = rows[0];
      const companies = await getCompanies(user.id);
      const authUser = { ...user, companies };
      const token = generateJwt(authUser);
      await userLogin(authUser.id, token);
      return token;
    }
    throw (new Error('Bad credentials'));
  } catch (error) {
    throw (new Error('Bad credentials'));
  }
};

const isAllowedToAccessProject = async (id, projectId) => {
  const res = await db.query(`
    SELECT u.id
    FROM users u
      INNER JOIN projects_companies pc ON u.company_id = pc.company_id
      WHERE u.id = $1
      AND pc.project_id = $2;
  `, [id, projectId]);

  if (res.rowCount === 1) {
    return true;
  }

  throw (new Error('User not allowed to access project'));
};

const isAllowedToAccessSite = async (id, siteId) => {
  const res = await db.query(`
  SELECT u.id
  FROM users u
    INNER JOIN projects_companies pc ON u.company_id = pc.company_id
    INNER JOIN sites s ON  s.project_id = pc.project_id
    WHERE u.id = $1 AND s.id = $2 ;
  `, [id, siteId]);
  if (res.rowCount === 1) {
    return true;
  }

  throw (new Error('User not allowed to access site'));
};

/**
 * Get user details from id
 * @param {number} id User id
 * @returns {object} user
 */
const getUser = async (id) => {
  const res = await db.query(`
    SELECT id, email, first_name, last_name, country, city, phone_number, position, created_at, updated_at
    FROM users
    WHERE id = $1;
  `, [id]);

  if (res.rowCount === 1) {
    const user = formatUser(res.rows[0]);
    return user;
  }

  throw (new Error('User unknown'));
};

const subscribeToNotification = async (pushSub, userId) => {
  const queryText = {
    text: `
    update users set push_sub = $1 where id = $2 RETURNING push_sub;`,
    values: [pushSub, userId],
  };
  const res = await db.query(queryText);
  if (res.rowCount > 0) {
    return res.rows[0].push_sub;
  }
  throw (new Error('Subscription Failed'));
};

const getPushSubscriptionToken = async (userId) => {
  const queryText = {
    text: `
    select push_sub from users where id = $1;`,
    values: [userId],
  };
  const res = await db.query(queryText);
  if (res.rowCount > 0) {
    return res.rows[0].push_sub;
  }
  throw (new Error('user not subscribed'));
};
const updateProfileUser = async (FirstName, LastName, Country, City, PhoneNumber, Position, userId) => {
  const request = {
    text: ` UPDATE users
            SET (first_name, last_name, country, city, phone_number, position) = ($1, $2, $3, $4, $5, $6)
            WHERE id = $7
            returning id, email, first_name, last_name, country, city, phone_number, position, created_at, updated_at;`,
    values: [FirstName, LastName, Country, City, PhoneNumber, Position, userId],
  };
  const res = await db.query(request);

  if (res.rowCount === 1) {
    const user = formatUser(res.rows[0]);
    return user;
  }
  return null;
};
const resetPassword = async (forgetMail, clientUrl) => {
  const userRes = await db.query(`
    SELECT s.id, s.email, s.first_name, s.last_name
    FROM users s
    WHERE email = $1
  `, [forgetMail]);

  if (userRes.rowCount === 1) {
    const user = formatUser(userRes.rows[0]);
    const token = await generateJwt(user, '1h');
    const mail = {
      from: 'THM SUPPORT',
      to: forgetMail,
      subject: 'ResetPassword',
      text: `${clientUrl}resetpassword/${token}`,
    };
    const request = {
      text: ` UPDATE users
              SET pw_change_token = $1
              WHERE email = $2`,
      values: [token, forgetMail],
    };
    await db.query(request);
    transporter.sendMail(mail, (err) => {
      if (err) {
        throw (new Error('Failed to send email'));
      } else {
        return true;
      }
    });
  } else {
    throw (new Error('Email unknow'));
  }
};

const changeUserPassword = async (email, password, token) => {
  const hash = hashPassword(email, password);
  const res = await db.query(`
    UPDATE users SET (password, pw_change_token) = ($1, null) WHERE email = $2 and pw_change_token = $3;
  `, [hash, email, token]);
  if (res.rowCount > 0) {
    return true;
  }
  throw (new Error('Your token is invalid please request a new one'));
};

// insert date.now when user logout
const userLogout = async (id, token) => {
  await db.query(`
  UPDATE users_logs
  SET logout = now()
  WHERE id IN (
    SELECT id
    FROM users_logs
    WHERE user_id=$1 and token=$2
    ORDER BY login
    LIMIT 1
  )
  `, [id, String(token)]);
};

module.exports = {
  updateProfileUser,
  authenticateUser,
  isAllowedToAccessProject,
  isAllowedToAccessSite,
  validateJwt,
  generateJwt,
  getUser,
  getCompanies,
  subscribeToNotification,
  getPushSubscriptionToken,
  resetPassword,
  changeUserPassword,
  userLogout,
};
