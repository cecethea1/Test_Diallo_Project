export const SELECT_PROJECT = 'SELECT_PROJECT';
export const SET_CURRENT_DASHBOARD = 'SET_CURRENT_DASHBOARD';
export const SET_DASHBOARDS = 'SET_DASHBOARDS';
export const UPDATE_LAYOUTS = 'UPDATE_LAYOUTS';
export const SET_CURRENT_BREAKPOINT = 'SET_CURRENT_BREAKPOINT';
export const SELECT_COMPONENT = 'SELECT_COMPONENT';
export const REMOVE_COMPONENT = 'REMOVE_COMPONENT';
export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_ERROR = 'SET_ERROR';
export const UPDATE_ADD_LAYOUTS = 'UPDATE_ADD_LAYOUTS';

export const selectProject = (project) => ({
  type: SELECT_PROJECT,
  payload: project,
});

export const setCurrentDashboard = (dashboard) => ({
  type: SET_CURRENT_DASHBOARD,
  payload: dashboard,
});

export const setDashboards = (dashboards) => ({
  type: SET_DASHBOARDS,
  payload: dashboards,
});

export const updateLayouts = (layouts) => ({
  type: UPDATE_LAYOUTS,
  payload: layouts,
});

export const updateAddLayouts = (layouts) => ({
  type: UPDATE_ADD_LAYOUTS,
  payload: layouts,
});

export const setCurrentBreakpoint = (breakpoint) => ({
  type: SET_CURRENT_DASHBOARD,
  payload: breakpoint,
});

export const selectComponent = (component) => ({
  type: SELECT_COMPONENT,
  payload: component,
});

export const removeComponent = (i) => ({
  type: REMOVE_COMPONENT,
  payload: i,
});
export const setEditMode = (edit) => ({
  type: SET_EDIT_MODE,
  payload: edit,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});
