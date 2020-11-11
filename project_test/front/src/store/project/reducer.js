import {
  FETCH_PROJECTS,
  SELECT_PROJECT,
  FETCH_SITES,
  SELECT_SITE,
  SET_ERROR,
  SET_IMAGE_POPUPS_DATA,
} from './actions';
import api from '../api';
import {
  getProject, setProject, getCurrentSite, setCurrentSite,
} from '../../utils/project';

const imagePlaceHolderUrl = '/images/placeholder-600x400.png';
const initialState = {
  projects: [],
  ...getProject(),
  ...getCurrentSite(),
  imagePopupsData: { coords: [], image_url: imagePlaceHolderUrl },
  error: null,
};

export default function project(state = initialState, action) {
  switch (action.type) {
    case SET_ERROR:
      return { ...state, error: action.payload };

    case FETCH_PROJECTS:
      return { ...state, projects: action.payload };

    case SELECT_PROJECT:
      setProject(action.payload);
      return { ...state, currentProject: action.payload };

    case FETCH_SITES: {
      const currentProject = { ...state.currentProject, sites: action.payload };
      setProject(currentProject);
      return { ...state, currentProject };
    }

    case SET_IMAGE_POPUPS_DATA: {
      const imagePopupsData = { ...action.payload };
      return { ...state, imagePopupsData };
    }

    case SELECT_SITE:
      setCurrentSite(action.payload);
      return { ...state, currentSite: action.payload };

    default:
      return state;
  }
}

export const fetchProjectsAsync = () => (dispatch) => api.get('/projects')
  .then((response) => dispatch({ type: FETCH_PROJECTS, payload: response.data.projects }))
  .catch((error) => dispatch({ type: SET_ERROR, payload: error }));

export const fetchProjectByIdAsync = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/projects/${id}`);
    if (res.status === 200) {
      dispatch({ type: SELECT_PROJECT, payload: res.data });
      const resSites = await api.get(`/projects/${id}/sites`);
      dispatch({ type: FETCH_SITES, payload: resSites.data });
      localStorage.removeItem('dashboard');
      localStorage.removeItem('dashboards');
    } else {
      dispatch({ type: SET_ERROR, payload: 'Api Error' });
    }
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: error });
  }
};

export const createImagePopupsAsync = (payload, ratio, projectId) => async (dispatch) => {
  try {
    const coords = (payload.coords.length > 0 && ratio) ? payload.coords.map((m) => ({
      ...m,
      x: m.x / ratio,
      y: m.y / ratio,
    })) : [];
    if (payload.id) {
      const res = await api.put(`/dashboard/components/${payload.id}/update`, { payload: { ...payload, coords } });
      if (res.status === 200) {
        dispatch({
          type: SET_IMAGE_POPUPS_DATA,
          payload: {
            id: res.data.id,
            ...res.data.payload,
          },
        });
      }
    } else {
      const res = await api.post(`/dashboard/${projectId}/components/create`, { type: 'IMAGE_POPUPS', payload: { ...payload, coords } });
      if (res.status === 200) {
        dispatch({
          type: SET_IMAGE_POPUPS_DATA,
          payload: {
            id: res.data.id,
            ...res.data.payload,
          },
        });
      }
    }
  } catch (error) {
    dispatch({
      type: SET_IMAGE_POPUPS_DATA,
      payload: { coords: [], image_url: imagePlaceHolderUrl },
    });
    dispatch({ type: SET_ERROR, payload: error });
  }
};
export const getImagePopupsDataAsync = (siteId, projectId) => async (dispatch) => {
  try {
    if (siteId >= 0) {
      const res = await api.get(`/sites/${projectId}/${siteId}/image_popups`);
      if (res.status === 200) {
        if (res.data.payload) {
          dispatch({
            type: SET_IMAGE_POPUPS_DATA,
            payload: {
              id: res.data.id,
              ...res.data.payload,
            },
          });
        } else {
          dispatch({
            type: SET_IMAGE_POPUPS_DATA,
            payload: { coords: [], image_url: imagePlaceHolderUrl },
          });
        }
      } else {
        dispatch({
          type: SET_IMAGE_POPUPS_DATA,
          payload: { coords: [], image_url: imagePlaceHolderUrl },
        });
      }
    }
  } catch (error) {
    dispatch({
      type: SET_IMAGE_POPUPS_DATA,
      payload: { coords: [], image_url: imagePlaceHolderUrl },
    });
    dispatch({ type: SET_ERROR, payload: error });
  }
};

export const fetchSites = (projectId) => (dispatch) => api.get(`/projects/${projectId}/sites`)
  .then((response) => dispatch({ type: FETCH_SITES, payload: response.data }))
  .catch((error) => dispatch({ type: SET_ERROR, payload: error }));
