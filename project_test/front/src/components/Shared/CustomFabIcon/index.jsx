// import React from 'react';
// import PropTypes from 'prop-types';
// import { CircularProgress, Fab, makeStyles } from '@material-ui/core';
// import clsx from 'clsx';


// const useStyles = makeStyles((theme) => ({
//   wrapper: {
//     margin: theme.spacing(1),
//   },
//   buttonSuccess: {
//     backgroundColor: green[500],
//     '&:hover': {
//       backgroundColor: green[700],
//     },
//   },
//   fabProgress: {
//     color: green[500],
//     position: 'absolute',
//     top: 2,
//     left: 2,
//     zIndex: 1,
//   },
// }));
// function CustomFabIcon({ icon, onClick }) {
//   const [loading, setLoading] = React.useState(false);
//   const [success, setSuccess] = React.useState(false);
//   const classes = useStyles();
//   const buttonClassname = clsx({
//     [classes.buttonSuccess]: success,
//   });
//   const onClickHandler = async () => {
//     if (selectedProject && name && layouts[currentBreakpoint].length > 0) {
//       try {
//         if (!loading) {
//           setSuccess(false);
//           setLoading(true);
//           timer.current = setTimeout(() => {
//             setSuccess(true);
//             setLoading(false);
//             dispatch({ type: UPDATE_LAYOUTS, payload: { lg: [], xxs: [] } });
//             setSelectedProject(null);
//             setName('');
//           }, 2000);
//         }
//         if (!editMode) {
//           dispatch(createDashboardAsync(selectedProject.id, name, layouts));
//         } else {
//           dispatch(updateDashboardAsync(dashboard.id, selectedProject.id, name));
//         }
//       } catch (error) {
//         dispatch({ type: SET_ERROR, payload: error });
//       }
//     }
//   };
//   return (
//     <div className={classes.wrapper}>
//       <Fab
//         aria-label="Delete"
//         color="primary"
//         className={buttonClassname}
//         onClick={onClickHandler}
//       >
//         {icon}
//       </Fab>
//       {loading && <CircularProgress size={68} className={classes.fabProgress} />}
//     </div>
//   );
// }

// CustomFabIcon.propTypes = {
//   icon: PropTypes.node.isRequired,
//   onClick: PropTypes.func.isRequired,
// };

// export default CustomFabIcon;
