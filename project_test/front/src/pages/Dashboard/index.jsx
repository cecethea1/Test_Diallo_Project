/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import SideBar from '../../components/Dashboard/SideBar';
import Layout from '../../components/Dashboard/Layout';
import PageContainer from '../../components/Shared/PageContainer';
import { fetchDashboardsAsync } from '../../store/dashboard/reducer';
import { UPDATE_LAYOUTS } from '../../store/dashboard/actions';

export default function Dashboard() {
  const {
    dashboard, dashboards, layouts,
  } = useSelector((state) => state.dashboard);
  const {
    currentProject,
  } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentProject) {
      dispatch(fetchDashboardsAsync(currentProject.id));
    }
  }, [currentProject, dispatch]);

  useEffect(() => {
    if (dashboard) {
      dispatch({ type: UPDATE_LAYOUTS, payload: dashboard.payload });
    }
  }, [dashboard, dispatch]);

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item lg={2} xs={12}>
          <SideBar dashboard={dashboard} dashboards={dashboards} />
        </Grid>
        <Grid item lg={10} xs={12}>
          {currentProject
            && layouts
            && layouts.lg.length > 0
            && dashboard
            && dashboards && (
              <Layout className="active" layouts={layouts} project={currentProject} />
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
