export const FETCH_PROJECTS = 'FETCH_PROJECTS';
export const SELECT_PROJECT = 'SELECT_PROJECT';
export const FETCH_SITES = 'FETCH_SITES';
export const SELECT_SITE = 'SELECT_SITE';
export const SET_ERROR = 'SET_ERROR';
export const SET_IMAGE_POPUPS_DATA = 'SET_IMAGE_POPUPS_DATA';
export const fetchProjects = (projects) => ({
  type: FETCH_PROJECTS,
  payload: projects,
});

export const selectProject = (project) => ({
  type: SELECT_PROJECT,
  payload: project,
});

export const fetchSites = (sites) => ({
  type: FETCH_SITES,
  payload: sites,
});

export const selectSite = (site) => ({
  type: SELECT_SITE,
  payload: site,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const setImagePopupsData = (data) => ({
  type: SET_IMAGE_POPUPS_DATA,
  payload: data,
});
