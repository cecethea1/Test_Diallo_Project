import {
  FETCH_ALERTS, FETCH_ALERTS_COUNT, SET_ERROR, SET_LOADING_ALERTS, SET_NOTIFICATIONS,
} from './actions';
import api from '../api';

const initialState = {
  alerts: [],
  alertsCount: '--',
  loadingAlerts: false,
  notification: false,
  error: null,
};

export default function alert(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALERTS:
      return { ...state, alerts: action.payload, loadingAlerts: false };

    case FETCH_ALERTS_COUNT:
      return { ...state, alertsCount: action.payload };

    case SET_LOADING_ALERTS:
      return { ...state, loadingAlerts: !!action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload, loadingAlerts: false };

    case SET_NOTIFICATIONS:
      return { ...state, notification: action.payload };

    default:
      return state;
  }
}

export const fetchAlertsAsync = (projectId, limit, orderBy, order) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING_ALERTS, payload: true });
    const response = await api.get(`/projects/${projectId}/alerts?limit=${limit}&orderBy=${orderBy}&order=${order}`);
    if (response.status === 200) {
      dispatch({ type: FETCH_ALERTS, payload: response.data });
    } else {
      dispatch({ type: SET_ERROR, payload: 'API ERROR' });
    }
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: error });
  }
};

export const fetchAlertsCountAsync = (projectId) => (dispatch) => api.get(`/projects/${projectId}/alerts/count`)
  .then((response) => dispatch({ type: FETCH_ALERTS_COUNT, payload: response.data.count }))
  .catch((error) => dispatch({ type: SET_ERROR, payload: error }));
