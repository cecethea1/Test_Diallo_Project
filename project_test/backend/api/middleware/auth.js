const {
  validateJwt, isAllowedToAccessProject, isAllowedToAccessSite,
} = require('../services/users.service');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    req.user = await validateJwt(token); // throw an error if token is invalid

    if ((req.params && req.params.userId) && req.params.userId !== req.user.id.toString()) {
      throw (new Error('User is not allowed to access this ressource'));
    }

    if (req.params && req.params.projectId) {
      const { id } = req.user;
      const { projectId } = req.params;
      await isAllowedToAccessProject(id, projectId);
    }

    // TODO: Check All Site Permission
    if (req.params && req.params.siteId && Number(req.params.siteId) === 0 && req.params.projectId) {
      const { id } = req.user;
      const { projectId } = req.params;
      await isAllowedToAccessProject(id, projectId);
    } else if (req.params && req.params.siteId) {
      const { id } = req.user;
      const { siteId } = req.params;
      await isAllowedToAccessSite(id, siteId);
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(403).json('Access forbidden');
  }
};
