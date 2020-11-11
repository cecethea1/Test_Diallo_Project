import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Chip, FormControl, FormGroup, FormLabel, Grid, Input, InputLabel, makeStyles, MenuItem, Paper, Select,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './sensoreditor.scss';
import _ from 'underscore';
import api from '../../../store/api';
import Timeseries from '../../../components/Graphe/Timeseries';
import PageContainer from '../../../components/Shared/PageContainer';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 600,
    textAlign: 'center',
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: 50,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  chip: {
    margin: 2,
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export default function SensorEditor() {
  const { currentSite, currentProject } = useSelector((state) => state.project);
  const classes = useStyles();
  const siteId = currentSite ? currentSite.id : null;
  const [sensors, setSensors] = useState(null);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [newId, setNewId] = useState(null);
  const [minX, setMinX] = useState();
  const [maxX, setMaxX] = useState();
  const [minY, setMinY] = useState();
  const [maxY, setMaxY] = useState();
  const [metric, setMetric] = useState([]);
  const [currentMetric, setcurrentMetric] = useState(null);
  const [title, setTitle] = useState('');

  const currentSensors = sensors ? sensors.filter((el) => !selectedSensors.includes(el)) : [];

  const types = ['timeseries', 'cumulative'];
  let type = types[0];

  useEffect(() => {
    const getSensorsList = async () => {
      if (siteId > 0) {
        try {
          const res = await api.get(`/sites/${siteId}/sensors`);
          setSensors(res.data);
        } catch (err) {
          console.log(err);
        }
      } else {
        const toProcess = [];
        currentProject.sites.forEach(async (site) => {
          try {
            toProcess.push(api.get(`/sites/${site.id}/sensors`));
          } catch (err) {
            console.log(err);
          }
        });
        const res = await Promise.all(toProcess);
        let result = [];
        res.forEach((sensor) => {
          result = result.concat(sensor.data);
        });
        setSensors(result);
      }
    };
    if (siteId != null) {
      setSelectedSensors([])
      getSensorsList();
    }
  }, [siteId]);


  useEffect(() => {
    const getMetricList = async () => {
      const toProcess = [];
      for (let id = 0; id < selectedSensors.length; id += 1) {
        try {
          toProcess.push(api.get(`/sites/${selectedSensors[id].siteid}/sensors/${selectedSensors[id].id}`));
        } catch (err) {
          console.log(err);
        }
      }
      const allcaptors = await Promise.all(toProcess);
      const allmetric = [];
      allcaptors.forEach((captor) => {
        captor.data[0].metric.forEach((newmetric) => {
          if (!allmetric.some((existMetric) => existMetric.id === newmetric.id)) {
            allmetric.push(newmetric);
          }
        });
      });
      setMetric(allmetric);
      setcurrentMetric(allmetric[0]);
    };

    if (selectedSensors.length > 0) {
      getMetricList();
    } else {
      setMetric([]);
    }
  }, [selectedSensors]);

  const removeSensor = (id) => {
    const toremove = selectedSensors.find((sensor) => sensor.id === id);
    const index = selectedSensors.indexOf(toremove);
    const temp = selectedSensors;
    temp.splice(index, 1);
    setSelectedSensors([...temp]);
  };

  const handleChangeMultiple = (event) => {
    setSelectedSensors((prevSensors) => (_.union(prevSensors, event.target.value)));
  };
  const save = async () => {
    const currtitle = title.length > 0 ? title : 'default';
    const arrayId = [];
    selectedSensors.forEach((sensor) => {
      arrayId.push(sensor.id);
    });
    const params = {
      graph: {
        siteId,
        name: currtitle,
        metric: currentMetric.id,
        type,
        captorsId: arrayId,
        minX: parseInt(minX, 10) || null,
        maxX: parseInt(maxX, 10) || null,
        minY: parseInt(minY, 10) || null,
        maxY: parseInt(maxY, 10) || null,
      },
    };

    try {
      const res = await api.post('graphs/insert', params);

      if (res.data) {
        setNewId(res.data);
        setSelectedSensors([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getGraph = () => {
    const currtitle = title.length > 0 ? title : 'default';
    const arrayId = [];
    selectedSensors.forEach((captor) => {
      arrayId.push(parseInt(captor.id, 10));
    });
    const limX = [parseInt(minX, 10) || null, parseInt(maxX, 10) || null];
    const limY = [parseInt(minY, 10) || null, parseInt(maxY, 10) || null];
    switch (true) {
      case type === 'timeseries':
        return (
          <Timeseries title={currtitle} limX={limX} limY={limY} sensors={arrayId} metric={currentMetric.id} />
        );
      case type === 'cumulative':
        break;
      // add cumulative
      default:
        break;
    }

    return null;
  };
  return (
    <PageContainer>
      <Paper className={classes.paper}>
        <Grid container className="sensoreditor">
          <Grid item lg={12}>
            <h1>Graph Editor</h1>
          </Grid>
          <Grid item lg={12}>
            {newId && (
              <Alert variant="success">
                <p>
                  ` Le graph a été ajouté avec l&apos;ID
                  {newId}
                  , vous maintenant le consulter sur la page graphique`
                </p>
              </Alert>
            )}
            <Grid container>
              <Grid lg={6} item>
                <FormGroup>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="title">Choose a title</InputLabel>
                    <Input id="name" value={title} placeholder="Choose a title" onChange={(e) => setTitle(e.target.value)} />
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="type-label">Graph type</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type"
                      value={type}
                      onChange={(e) => {
                        type = e.target.value;
                      }}
                      input={<Input id="select-sensors" />}
                      MenuProps={MenuProps}
                    >
                      {types && types.length > 0 && types.map((e) => (
                        <MenuItem key={e} value={e}>{e}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="sensors-label">Sensors</InputLabel>
                    <Select
                      labelId="sensors-label"
                      id="sensors"
                      multiple
                      value={selectedSensors}
                      onChange={handleChangeMultiple}
                      input={<Input id="select-sensors" />}
                      MenuProps={MenuProps}
                    >
                      {currentSensors && currentSensors.length > 0 && currentSensors.map((s) => (
                        <MenuItem key={s.id} value={s}>
                          {s.name}
                          {' '}
                          {s.type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <FormLabel>Capteurs séléctionnés </FormLabel>
                    <Grid container>
                      {selectedSensors && selectedSensors.map((sensor) => (
                        <Chip key={sensor.id} label={`${sensor.name} ${sensor.type}`} className={classes.chip} onDelete={() => removeSensor(sensor.id)} />
                      ))}
                    </Grid>
                  </FormControl>
                </FormGroup>
              </Grid>
              <Grid lg={6} item>
                <FormGroup>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="metric-label">Metric type</InputLabel>
                    <Select
                      labelId="metric-label"
                      id="metric"
                      value={currentMetric ? currentMetric.name : ''}
                      onChange={(e) => {
                        setcurrentMetric(metric.find((m) => m.name === e.target.value));
                      }}
                      input={<Input id="select-metric" />}
                      MenuProps={MenuProps}
                    >
                      {metric && metric.length > 0 && metric.map((e) => (
                        <MenuItem key={e} value={e.name}>{e.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormGroup>
                <Grid container>
                  <Grid lg={6} item>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="minX">MinX</InputLabel>
                      <Input id="minX" type="number" placeholder="Choose MinX" onChange={(e) => setMinX(e.target.value)} />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="maxX">MaxX</InputLabel>
                      <Input id="maxX" type="number" placeholder="Choose MaxX" onChange={(e) => setMaxX(e.target.value)} />
                    </FormControl>
                  </Grid>
                  <Grid lg={6} item>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="minY">MinY</InputLabel>
                      <Input id="minY" type="number" placeholder="Choose MinY" onChange={(e) => setMinY(e.target.value)} />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="maxY">MaxY</InputLabel>
                      <Input id="maxY" type="number" placeholder="Choose MaxY" onChange={(e) => setMaxY(e.target.value)} />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              {currentMetric && selectedSensors.length > 0
                && (
                  <Grid container>
                    <Grid container>
                      <Grid item lg={12}>
                        {title && getGraph()}
                      </Grid>
                    </Grid>
                    <Grid container justify="center">
                      <Grid item>
                        <Button
                          className="button-save"
                          type="button"
                          onClick={async () => save()}
                        >
                          Save graph
                      </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </PageContainer>
  );
}
