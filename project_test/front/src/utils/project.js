export const getProject = () => {
  try {
    const currentProject = JSON.parse(localStorage.getItem('current_project'));
    if (currentProject) {
      return { currentProject };
    }
    return { currentProject: null };
  } catch (e) {
    return { currentProject: null };
  }
};


export const setProject = (project) => {
  try {
    localStorage.setItem('current_project', JSON.stringify(project));
  } catch (err) {
    throw (new Error('Cannot set project'));
  }
};

export const getCurrentSite = () => {
  try {
    const currentSite = JSON.parse(localStorage.getItem('current_site'));
    if (currentSite) {
      return { currentSite };
    }
    return { currentSite: { id: 0, name: 'all_sites' } };
  } catch (e) {
    return { currentSite: { id: 0, name: 'all_sites' } };
  }
};

export const setCurrentSite = (site) => {
  try {
    localStorage.setItem('current_site', JSON.stringify(site));
  } catch (err) {
    throw (new Error('Cannot set site'));
  }
};
