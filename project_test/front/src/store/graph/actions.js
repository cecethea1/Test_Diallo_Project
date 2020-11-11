export const SET_CURRENT_CONFIG = 'SET_CURRENT_CONFIG';
export const SET_CONFIGS = 'SET_CONFIGS';
export const SET_ERROR = 'SET_ERROR';


export const setCurrentConfig = (config) => ({
  type: SET_CURRENT_CONFIG,
  payload: config,
});

export const setConfigs = (configs) => ({
  type: SET_CONFIGS,
  payload: configs,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});
