import React, {
  useState, useEffect, useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TableSortLabel, withStyles,
} from '@material-ui/core';
import { UnfoldMore } from '@material-ui/icons';
import moment from 'moment';
import AlertBadge from '../Shared/AlertBadge';
import './style.scss';
import LoadingSpinner from '../Shared/LoadingSpinner';
import QuickDetailsList from './QuickDetailsList';
import { fetchAlertsAsync } from '../../store/alert/reducer';


const useStyles = makeStyles({
  table: {
    minWidth: 320,
  },
  tableRow: {
    height: 80,
  },
  loadMore: {
    cursor: 'pointer',
  },
});
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function Alerts() {
  const { alerts, loadingAlerts, alertsCount } = useSelector((state) => state.alert);
  const { currentProject } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [limit, setLimit] = useState(5);
  const [endlimit, setEndlimit] = useState();
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = React.useState('asc');
  const alertEnd = useRef();

  const loadMore = () => setLimit((prevLimit) => prevLimit + 5);
  const createSortHandler = (selectedOrderBy) => {
    setOrderBy(selectedOrderBy);
    setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    if (currentProject) {
      dispatch(fetchAlertsAsync(currentProject.id, limit, selectedOrderBy, order));
    }
  };
  useEffect(() => {
    const scrollToBottom = () => {
      if (limit > 5) {
        alertEnd.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    if (currentProject) {
      dispatch(fetchAlertsAsync(currentProject.id, limit));
    }
    scrollToBottom();
    if (limit >= alertsCount) {
      setEndlimit(true);
    }
  }, [currentProject, limit, dispatch, alertsCount]);

  return (
    <Grid spacing={2} container>
      <Grid item lg={8} xs={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="medium" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell sortDirection={orderBy === 'site_name' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'site_name'}
                    direction={orderBy === 'site_name' ? order : 'desc'}
                    onClick={() => createSortHandler('site_name')}
                  >
                    Site
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell sortDirection={orderBy === 'created_at' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'created_at'}
                    direction={orderBy === 'created_at' ? order : 'desc'}
                    onClick={() => createSortHandler('created_at')}
                  >
                    Date
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell sortDirection={orderBy === 'alert_level' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'alert_level'}
                    direction={orderBy === 'alert_level' ? order : 'desc'}
                    onClick={() => createSortHandler('alert_level')}
                  >
                    Alert Level
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell sortDirection={orderBy === 'value' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'value'}
                    direction={orderBy === 'value' ? order : 'desc'}
                    onClick={() => createSortHandler('value')}
                  >
                    Value
                  </TableSortLabel>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <LoadingSpinner show={loadingAlerts} />
                </TableCell>
              </TableRow>
              {
                !loadingAlerts && alerts && alerts.length > 0
                && (alerts.map((alert) => (
                  <TableRow hover key={alert.id} className={classes.tableRow}>
                    <TableCell>{alert.site_name}</TableCell>
                    <TableCell>{moment(new Date(alert.created_at)).format('D/M/Y hh:mm:ss ')}</TableCell>
                    <TableCell><AlertBadge alert={alert} /></TableCell>
                    <TableCell>
                      {alert.payload.value}
                      {' '}
                      {alert.payload.unit}
                    </TableCell>
                  </TableRow>
                ))
                )
              }
            </TableBody>
            {!endlimit
              && (
                <TableFooter ref={alertEnd}>
                  <TableRow>
                    <TableCell colSpan={4} rowSpan={1} className={classes.loadMore} align="center">
                      <UnfoldMore onKeyPress={loadMore} onClick={loadMore} role="presentation">Show More</UnfoldMore>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
          </Table>
        </TableContainer>
      </Grid>
      {currentProject && (
        <Grid item lg={4} xs={12}>
          <QuickDetailsList minHeight project={currentProject} />
        </Grid>
      )}
    </Grid>
  );
}
export default Alerts;
