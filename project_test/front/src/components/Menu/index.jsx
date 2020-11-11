/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Divider,
  fade,
  FormControl,
  InputLabel,
  Select,
  Menu,
  MenuItem,
  Badge,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import TabsMenu from '../Shared/Tabs';
import routes from '../../routes';
import { fetchProjectByIdAsync, fetchProjectsAsync } from '../../store/project/reducer';
import { fetchSites, SELECT_SITE } from '../../store/project/actions';
import { LogOutAsync } from '../../store/auth/reducer';
import { setCurrentDashboard } from '../../store/dashboard/actions';
import api from '../../store/api';
import './style.scss';
import AlertIcon from '../Shared/AlertIcon';


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  devider: {
    backgroundColor: fade(theme.palette.common.white, 0.5),
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    marginTop: '5px',
    marginBottom: '5px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      font: 'normal bold 20px / 21px Source Sans Pro',
      letterSpacing: '4px',
      opacity: 1,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginLeft: '20px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  select: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    color: fade(theme.palette.common.white, 0.5),
    marginRight: theme.spacing(2),
    width: '100%',
  },
  selectIcon: {
    color: fade(theme.palette.common.white, 0.5),
  },
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  notificationsFooter: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
}));

export default function ManuAppBar() {
  const { projects, currentProject, currentSite } = useSelector((state) => state.project);
  const { notification } = useSelector((state) => state.alert);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const { sites } = currentProject || { sites: [] };

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.status === 200) {
          console.log(res.data);
          setNotifications(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getNotifications();
  }, [notification]);

  useEffect(() => {
    dispatch(fetchProjectsAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSites);
  }, [currentProject, dispatch]);

  const selectProjectHandler = (id) => {
    dispatch(setCurrentDashboard(null));
    dispatch(fetchProjectByIdAsync(id));
  };

  const selectSiteHandler = (site) => {
    dispatch({ type: SELECT_SITE, payload: site });
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const getProfilePageHandler = () => {
    history.push('/profile');
    handleMenuClose();
  };
  const getAlertPageHandler = () => {
    history.push('/alerts');
    handleMenuClose();
    handleNotificationsMenuClose();
  };
  const menuId = 'primary-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={getProfilePageHandler}>Profile</MenuItem>
      <MenuItem onClick={() => dispatch(LogOutAsync(history))}>Disconnect</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-menu-mobile';
  const notificationsMenuId = 'primary-menu-notifications';

  const parseDate = (createdAt) => (createdAt ? moment(new Date(createdAt)).format('D/M/Y HH:mm:ss') : '--:--');
  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      id={notificationsMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isNotificationsMenuOpen}
      onClose={handleNotificationsMenuClose}
    >
      <MenuItem><p>Notifications</p></MenuItem>
      {
        notifications && notifications.length > 0
        && notifications.map((notif) => (
          <MenuItem dense selected={notif.read} key={notif.id}>
            <ListItemAvatar>
              <AlertIcon type={notif.payload.type} />
            </ListItemAvatar>
            <ListItemText
              primary={notif.payload.type}
              secondary={(
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    Alert Timestamp:
                    {' '}
                    {parseDate(notif.payload.timestamp)}
                  </Typography>
                  <br />
                  <>
                    Notification Timestamp:
                    {' '}
                    {parseDate(notif.created_at)}
                  </>
                </>
              )}
            />
          </MenuItem>
        ))
      }
      <MenuItem
        onClick={getAlertPageHandler}
        className={classes.notificationsFooter}
      >
        <p>Show More</p>
      </MenuItem>
    </Menu>
  );
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotificationsMenuOpen}>
        <IconButton aria-label="show new notifications" color="inherit">
          <Badge badgeContent={notifications ? notifications.length.toString() : '0'} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={getProfilePageHandler}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={() => dispatch(LogOutAsync(history))}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Disconnect</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography as="div" className={classes.title} variant="h6" noWrap>
            <NavLink style={{ textDecoration: 'none', color: 'white' }} to="/">THMInsight</NavLink>
          </Typography>
          <Divider className={classes.devider} variant="middle" orientation="vertical" flexItem />
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.selectIcon} id="project-select-label">
              Select Project
            </InputLabel>
            <Select
              labelId="project-select-label"
              id="project-select"
              disableUnderline
              className={classes.select}
              inputProps={{
                classes: {
                  icon: classes.selectIcon,
                },
              }}
              value={currentProject ? currentProject.name : {}}
            >
              {projects && projects.length > 0 && projects.map((project) => (
                <MenuItem
                  key={project.id}
                  value={project.name}
                  onClick={() => selectProjectHandler(project.id)}
                >
                  <span className={classes.selectItem}>{project.name}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel className={classes.selectIcon} id="site-select-label">
              Select Site
            </InputLabel>
            <Select
              labelId="site-select-label"
              id="site-select"
              disableUnderline
              className={classes.select}
              inputProps={{
                classes: {
                  icon: classes.selectIcon,
                },
              }}
              value={currentSite ? currentSite.name : {}}
            >
              <MenuItem
                key={0}
                value="all_sites"
                onClick={() => selectSiteHandler({ id: 0, name: 'all_sites' })}
              >
                <span className={classes.selectItem}>All Sites</span>
              </MenuItem>
              {sites && sites.length > 0 && sites.map((site) => (
                <MenuItem
                  key={site.id}
                  value={site.name}
                  onClick={() => selectSiteHandler(site)}
                >
                  <span className={classes.selectItem}>{site.name}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={classes.grow} />
          <Divider variant="middle" className={classes.devider} orientation="vertical" flexItem />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show new notifications"
              aria-controls={notificationsMenuId}
              aria-haspopup="true"
              onClick={handleNotificationsMenuOpen}
              color="inherit"
            >
              <Badge badgeContent={notifications ? notifications.length.toString() : '0'} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar alt="Remy Sharp" src="/images/cementys.jpg" className={classes.large} />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <TabsMenu routes={routes} />
      {renderMobileMenu}
      {renderNotificationsMenu}
      {renderMenu}
    </div>
  );
}
