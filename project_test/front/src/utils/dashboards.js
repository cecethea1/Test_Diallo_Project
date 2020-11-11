export const getDashboards = () => {
  try {
    const dashboards = JSON.parse(localStorage.getItem('dashboards'));
    if (dashboards) {
      return { dashboards };
    }
    return { dashboards: null };
  } catch (e) {
    return { dashboards: null };
  }
};
export const storeDashboards = (dashboards) => {
  try {
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
  } catch (err) {
    throw (new Error('Cannot set dashboards'));
  }
};
export const storeDashboard = (dashboard) => {
  try {
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
  } catch (err) {
    throw (new Error('Cannot set dashboard'));
  }
};
export const getDashboard = () => {
  try {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    if (dashboard) {
      return { dashboard };
    }
    return { dashboard: null };
  } catch (e) {
    return { dashboard: null };
  }
};
