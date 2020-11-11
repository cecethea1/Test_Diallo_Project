const {
  getProjectById,
  getProjects,
  getMedia,
  getProjectSites,
  postNewProject,
} = require('../services/projects.service');

const insertNewProjectHandler = async (req, res) => {
  try {
    // const {
    //   projectPhoto,
    //   projectName,
    //   country,
    //   clientCompanyName,
    //   timeZone,
    //   city,
    //   startDate,
    //   projectDescription,
    // } = req.body;
    console.log(req.body);
    // const dataProject = await postNewProject(
    //   projectPhoto,
    //   projectName,
    //   country,
    //   clientCompanyName,
    //   timeZone,
    //   city,
    //   startDate,
    //   projectDescription,
    // );
    // res.status(200).json(dataProject);
  } catch (err) {
    console.log(err);
  }
};
/**
   * Get detail project by  ID
   * @param {*} req
   * @param {*} res
   */
const getProjectByIdHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectById(projectId);

    res.status(200).json(project);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
   * Get project for a given user
   * @param {*} req
   * @param {*} res
   */
const getProjectsHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const projects = await getProjects(id);
    res.status(200).json({ projects });
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
   * Get medias for a given project
   * @param {*} req
   * @param {*} res
   */
const getMediaHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { type } = req.query;
    const media = await getMedia(projectId, type);

    res.status(200).json({ media });
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

/**
   * Get sites for a given project
   * @param {*} req
   * @param {*} res
   */
const getProjectSitesHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const sites = await getProjectSites(projectId);
    res.status(200).json(sites);
  } catch (err) {
    console.log(err);
    res.status(403).send('Access forbidden');
  }
};

module.exports = {
  getProjectByIdHandler,
  getProjectsHandler,
  getMediaHandler,
  getProjectSitesHandler,
  insertNewProjectHandler,
};
