import {
  SET_CURRENT_CONFIG,
  SET_CONFIGS,
  SET_ERROR,
} from './actions';
import api from '../api';

const initialState = {
  configs: [],
  currentConfig: null,
};

export default function graph(state = initialState, action) {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state, error: action.payload,
      };

    case SET_CURRENT_CONFIG: {
      return { ...state, currentConfig: action.payload };
    }

    case SET_CONFIGS: {
      return { ...state, configs: action.payload };
    }

    default:
      return state;
  }
}


export const fetchConfigsAsync = (siteId, sites) => async (dispatch) => {
  if (siteId !== 0) {
    api.get(`/sites/${siteId}/graphs`)
      .then((response) => {
        dispatch({ type: SET_CONFIGS, payload: response.data });
      })
      .catch((error) => dispatch({ type: SET_ERROR, payload: error }));
  } else {
    const toProcess = [];
    sites.forEach(async (site) => {
      try {
        toProcess.push(api.get(`/sites/${site.id}/graphs`));
      } catch (err) {
        dispatch({ type: SET_ERROR, payload: err });
      }
    });
    const res = await Promise.all(toProcess);
    let result = [];
    res.forEach((config) => {
      result = result.concat(config.data);
    });
    dispatch({ type: SET_CONFIGS, payload: result });
  }
};
