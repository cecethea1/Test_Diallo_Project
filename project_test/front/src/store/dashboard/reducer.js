/* eslint-disable no-param-reassign */
import {
  SET_CURRENT_DASHBOARD,
  UPDATE_LAYOUTS,
  SET_CURRENT_BREAKPOINT,
  SELECT_COMPONENT,
  REMOVE_COMPONENT,
  SET_DASHBOARDS,
  SET_ERROR,
  SELECT_PROJECT,
  UPDATE_ADD_LAYOUTS,
} from './actions';
import {
  getDashboard, getDashboards, storeDashboard, storeDashboards,
} from '../../utils/dashboards';
import api from '../api';
import constants from '../../utils/constants';

const upsert = (arr, item) => {
  const index = arr.findIndex((c) => c.i === item.i);
  if (index > -1) arr[index] = item;
  else arr.push(item);
  return [...arr];
};
const initialState = {
  constants,
  error: null,
  currentBreakpoint: 'lg',
  project: null,
  layouts: { lg: [], xxs: [] },
  addLayouts: { lg: [], xxs: [] },
  ...getDashboards(),
  ...getDashboard(),
};
export default function dashboard(state = initialState, action) {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state, error: action.payload, editMode: false, addLayouts: { lg: [], xxs: [] },
      };

    case SELECT_PROJECT:
      return { ...state, project: action.payload };

    case SET_CURRENT_DASHBOARD: {
      storeDashboard(action.payload);
      const layouts = action.payload ? action.payload.payload : { lg: [], xxs: [] };
      return { ...state, dashboard: action.payload, layouts };
    }

    case SET_DASHBOARDS: {
      storeDashboards(action.payload);
      const newDashboard = (!state.dashboard || !localStorage.getItem('dashboard')) ? action.payload[0] : state.dashboard;
      return { ...state, dashboards: action.payload, dashboard: newDashboard };
    }

    case UPDATE_LAYOUTS:
      return { ...state, layouts: action.payload };

    case UPDATE_ADD_LAYOUTS:
      return { ...state, addLayouts: action.payload };

    case SET_CURRENT_BREAKPOINT:
      return { ...state, currentBreakpoint: action.payload };

    case REMOVE_COMPONENT: {
      const filteredLg = state.addLayouts.lg.filter((c) => c.i !== action.payload.i);
      const filteredXxs = state.addLayouts.xxs.filter((c) => c.i !== action.payload.i);
      const filteredLayouts = { lg: [...filteredLg], xxs: [...filteredXxs] };
      return { ...state, addLayouts: filteredLayouts };
    }
    case SELECT_COMPONENT: {
      const newLayouts = { lg: [], xxs: [] };
      if (state.currentBreakpoint === 'lg') {
        newLayouts.lg = upsert(state.addLayouts.lg, action.payload);
        const xxsExist = state.addLayouts.xxs.find((c) => (c.i === action.payload.i));
        if (!xxsExist) {
          newLayouts.xxs = [constants.xxs.find((c) => c.i === action.payload.i)];
        }
      }

      if (state.currentBreakpoint === 'xxs') {
        newLayouts.lg = upsert(state.addLayouts.xxs, action.payload);
        const glExist = state.addLayouts.lg.find((c) => (c.i === action.payload.i));
        if (!glExist) {
          newLayouts.lg = [constants.lg.find((c) => c.i === action.payload.i)];
        }
      }
      return { ...state, addLayouts: newLayouts };
    }
    default:
      return state;
  }
}


const filteredLayoutsMaper = (baseLayouts) => {
  let fixed = {};
  const filteredLayouts = {};
  const keys = Object.keys(baseLayouts);
  keys.forEach((key) => {
    fixed = baseLayouts[key].map((e) => ({
      h: e.h, i: e.i, w: e.w, x: e.x, y: e.y,
    }));
    filteredLayouts[key] = [...fixed];
  });
  return filteredLayouts;
};


export const fetchDashboardsAsync = (projectId) => (dispatch) => api.get(`/dashboard/${projectId}`)
  .then((response) => {
    dispatch({ type: SET_DASHBOARDS, payload: response.data });
  })
  .catch((error) => dispatch({ type: SET_ERROR, payload: error }));


export const createDashboardAsync = (projectId, dashboardName, layouts) => (dispatch) => api.post(`/dashboard/${projectId}`, {
  payload: filteredLayoutsMaper(layouts),
  name: dashboardName,
}).then(() => {
  dispatch(fetchDashboardsAsync(projectId));
  dispatch({ type: UPDATE_ADD_LAYOUTS, payload: { lg: [], xxs: [] } });
})
  .catch((error) => dispatch({ type: SET_ERROR, payload: error }));

export const updateDashboardAsync = (id, projectId, name, layouts) => (dispatch) => api.put(`/dashboard/${id}`, {
  payload: filteredLayoutsMaper(layouts),
  name,
}).then((res) => {
  dispatch(fetchDashboardsAsync(projectId));
  dispatch({ type: SET_CURRENT_DASHBOARD, payload: res.data[0] });
  dispatch({ type: UPDATE_ADD_LAYOUTS, payload: { lg: [], xxs: [] } });
})
  .catch((error) => dispatch({ type: SET_ERROR, payload: error }));

export const deleteDashboardAsync = (id) => (dispatch, getState) => api.delete(`/dashboard/${id}`).then(() => {
  // TODO: compare stored dashboard id with deleted id
  dispatch({ type: SET_CURRENT_DASHBOARD, payload: null });
  dispatch(fetchDashboardsAsync(getState().project.currentProject.id));
})
  .catch((error) => dispatch({ type: SET_ERROR, payload: error }));
