/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Dashboard as DashboardIcon, Warning, Equalizer } from '@material-ui/icons';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import GraphsEditor from '../pages/Graphs/GraphsEditor';
import Sensor from '../pages/Graphs';
import Alerts from '../pages/Alerts';
import AddDashboard from '../components/AddDashboard';
import SensorEditor from '../pages/SensorsEditor';
import ProfilePage from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import RequestPage from '../pages/ResetPassword/ReqestPage';
import ProjectsPage from '../pages/Projects';

export default [
  {
    path: '/',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    component: Dashboard,
    privateRoute: true,
    menu: true,
    exact: true,
  },
  {
    path: '/login',
    title: 'Login',
    component: Login,
    exact: true,
  },
  {
    path: '/resetpassword/:token',
    title: 'Reset Password',
    component: ResetPassword,
    exact: true,
  },
  {
    path: '/forgot',
    title: 'Request Password',
    component: RequestPage,
    exact: true,
  },
  {
    path: '/home',
    title: 'Dashboard',
    component: Dashboard,
    privateRoute: true,
    exact: true,
  },
  {
    path: '/alerts',
    title: 'Alerts',
    icon: <Warning />,
    component: Alerts,
    privateRoute: true,
    menu: true,
    exact: true,
  },
  {
    path: '/graphs',
    title: 'Graphs',
    icon: <Equalizer />,
    component: Sensor,
    privateRoute: true,
    menu: true,
    exact: true,
  },
  {
    path: '/graphs/editor',
    title: 'Graphs',
    component: GraphsEditor,
    privateRoute: true,
    exact: true,
  },
  {
    path: '/graphs/:id',
    title: 'Graphs',
    component: Sensor,
    privateRoute: true,
    exact: true,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: ProfilePage,
    privateRoute: true,
    exact: true,
  },
  {
    path: '/dashboard/create',
    title: 'dashboard',
    component: AddDashboard,
    privateRoute: true,
    exact: true,
  },
  {
    path: '/sensor/create',
    title: 'sensor editor',
    component: SensorEditor,
    icon: <DashboardIcon />,
    menu: true,
    privateRoute: true,
    exact: true,
  },
  {
    path: '/projects/create',
    title: 'create new project',
    component: ProjectsPage,
    icon: <DashboardIcon />,
    menu: true,
    privateRoute: true,
    exact: true,
  },
  {
    path: '*',
    component: Dashboard,
    privateRoute: true,
    exact: true,
  },
];
