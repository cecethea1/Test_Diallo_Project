export const FETCH_ALERTS = 'FETCH_ALERTS';
export const FETCH_ALERTS_COUNT = 'FETCH_ALERTS_COUNT';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING_ALERTS = 'SET_LOADING_ALERTS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';

export const fetchAlerts = (alerts) => ({
  type: FETCH_ALERTS,
  payload: alerts,
});

export const fetchAlertsCount = (count) => ({
  type: FETCH_ALERTS_COUNT,
  payload: count,
});

export const setError = (error) => ({
  type: FETCH_ALERTS_COUNT,
  payload: error,
});

export const setLoading = (loading) => ({
  type: SET_LOADING_ALERTS,
  payload: loading,
});

export const setNotifications = (payload) => ({
  type: SET_NOTIFICATIONS,
  payload,
});
