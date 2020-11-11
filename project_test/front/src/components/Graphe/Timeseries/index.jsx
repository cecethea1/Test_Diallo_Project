import React, {
  useState, useEffect, useRef,
} from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist';
import PropTypes from 'prop-types';
import ColorArray from '../../../utils/ColorArray';
import api from '../../../store/api';


const Plot = createPlotlyComponent(Plotly);
export default function Timeseries(props) {
  const {
    title, sensors, metric, limX, limY, downsampling,
  } = props;
  const [intervalX, setIntervalX] = useState(limX);
  const [intervalY, setIntervalY] = useState(limY);
  const scaleX = useRef(limX);
  const [data, setData] = useState(null);
  const [showline, setShowLine] = useState(false);
  const color = ColorArray.getarray(sensors.length);
  // const color = ColorArray.getarray(data.length);

  const downloadIcon = {
    width: 500,
    height: 600,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16.217" height="17.464" viewBox="0 0 16.217 17.464">'
      + '<g id="download" transform="translate(-17.066)"><g id="Groupe_485" data-name="Groupe 485" transform="translate(17.066 11.227)">'
      + '<g id="Groupe_484" data-name="Groupe 484" transform="translate(0)">'
      + '<path id="Tracé_521" data-name="Tracé 521" d="M32.659,307.2a.624.624,0,0,0-.624.624v3.742a.624.624,'
      + '0,0,1-.624.624H18.937a.624.624,0,0,1-.624-.624v-3.742a.624.624,0,0,0-1.247,0v3.742a1.871,1.871,0,0,0,1.871,1.871H31.412a1.871,1.871,0,'
      + '0,0,1.871-1.871v-3.742A.624.624,0,0,0,32.659,307.2Z" transform="translate(-17.066 -307.2)" fill="#626566"/></g></g>'
      + '<g id="Groupe_487" data-name="Groupe 487" transform="translate(21.44)"><g id="Groupe_486" data-name="Groupe 486">'
      + '<path id="Tracé_522" data-name="Tracé 522" d="M144.022,10.786a.624.624,0,0,0-.867,0L141.1,12.84V.624a.624.624,0,1,0-1.247,0V12.84L137.8'
      + '10.786a.624.624,0,0,0-.882.882l3.119,3.119a.624.624,0,0,0,.882,0h0l3.119-3.119A.624.624,0,0,0,144.022,10.786Z" transform="'
      + 'translate(-136.742)" fill="#626566"/></g></g></g></svg>',
  };

  const selectorOptions = {
    buttons: [
      {
        step: 'day',
        stepmode: 'backward',
        count: 1,
        label: '1d',
      },
      {
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m',
      }, {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m',
      }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y',
      }, {
        step: 'all',
      },
    ],
  };

  useEffect(() => {
    setIntervalX(limX);
    setIntervalY(limY);
  }, [limX, limY]);

  useEffect(() => {
    const getData = async (_sensors, _metric, _interval) => {
      const toProcess = [];
      const newData = [];
      const xScale = [null, null];
      _sensors.forEach(async (sensor) => {
        try {
          toProcess.push(api.get(`/sensors/${sensor}/data/${_metric}`, {
            params: {
              min: _interval[0],
              max: _interval[1],
              downsampling,
            },
          }));
        } catch (err) {
          console.log(err);
        }
      });
      const res = await Promise.all(toProcess);
      for (let i = 0; i < res.length; i += 1) {
        const x = [];
        const y = [];
        res[i].data.forEach((row, l) => {
          if (l !== 0 && (xScale[0] === null || row.x < xScale[0])) {
            xScale[0] = row.x;
          }
          if (l !== res[i].data.length - 1 && (xScale[1] === null || row.x > xScale[1])) {
            xScale[1] = row.x;
          }
          x.push(row.x);
          y.push(row.y);
        });
        newData.push({
          name: `captor${i}`,
          type: 'scatter',
          mode: 'markers+lines',
          x,
          y,
          line: {
            color: color[i],
          },
        });
      }
      scaleX.current = xScale;
      setData(newData);
    };
    getData(sensors, metric, intervalX);
  }, [intervalX, sensors, metric]);


  // handle zoom event
  const zoom = (layout) => {
    const minX = Date.parse(layout['xaxis.range[0]']);
    const maxX = Date.parse(layout['xaxis.range[1]']);
    const minY = layout['yaxis.range[0]'];
    const maxY = layout['yaxis.range[1]'];
    const resetAxis = layout['xaxis.autorange'];
    const showskipes = layout['xaxis.showspikes'];

    if ((minX && maxX) || (resetAxis === true)) {
      if (Number.isNaN(minX) || Number.isNaN(maxX)) {
        setIntervalX([null, null]);
      } else {
        setIntervalX([minX, maxX]);
      }
    }
    if ((minY && maxY) || resetAxis === true) {
      setIntervalY([minY, maxY]);
    }
    if (showskipes === true) {
      setShowLine(true);
    } else {
      setShowLine(false);
    }
  };

  const downloadCSV = async () => {
    const min = new Date(scaleX.current[0]).toISOString().slice(0, 10).replaceAll('-', '');
    const max = new Date(scaleX.current[1]).toISOString().slice(0, 10).replaceAll('-', '');
    const toProcess = [];
    sensors.forEach(async (sensor) => {
      try {
        toProcess.push(api.get(`/sensors/${sensor}/data/${metric}`, {
          params: {
            min: scaleX.current[0],
            max: scaleX.current[1],
          },
        }));
      } catch (err) {
        console.log(err);
      }
    });
    const res = await Promise.all(toProcess);
    let synchronized = [];
    const keys = { timestamp: null };
    res.forEach((l, i) => { keys[`captor${i}`] = null; });
    for (let i = 0; i < res.length; i += 1) {
      for (let j = 0; j < res[i].data.length; j += 1) {
        if (i !== 0) {
          const isEqual = (element) => element.timestamp === res[i].data[j].x;
          const index = synchronized.findIndex(isEqual);
          if (index !== -1) {
            synchronized[index][`captor${i}`] = res[i].data[j].y;
          } else {
            const newkeys = { ...keys };
            newkeys.timestamp = res[i].data[j].x;
            newkeys[`captor${i}`] = res[i].data[j].y;
            synchronized.push(newkeys);
          }
        } else {
          const newkeys = { ...keys };
          newkeys.timestamp = res[i].data[j].x;
          newkeys[`captor${i}`] = res[i].data[j].y;
          synchronized.push(newkeys);
        }
      }
    }
    synchronized = synchronized.sort((a, b) => a.timestamp - b.timestamp);
    // format as csv
    const array = [Object.keys(synchronized[0])].concat(synchronized);
    let csv = array.map((it) => Object.values(it).toString()).join('\n');
    const intro = 'Data displayed on THMInsight \n';
    const info = `Time period : ${min}>${max}\n`;
    const head = intro.concat(info);
    csv = head.concat(csv);

    // download file
    const blob = new Blob([csv], { type: 'text/csv' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, `thm_insight_${title}_${min}_${max}.csv`);
    } else {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = `thm_insight_${title}_${min}_${max}.csv`;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
    //
  };


  return (
    <Plot
      id="myDiv"
      data={data}
      layout={{
        autosize: true,
        title,
        xaxis: {
          range: scaleX.current,
          rangeselector: selectorOptions,
          type: 'date',
          showspikes: showline,
        },
        yaxis: {
          showspikes: showline,
          range: intervalY,
        },
        useResizeHandler: true,
      }}
      onRelayout={(layout) => zoom(layout)}
      onSelected={(e) => zoom(e)}
      config={
        {
          // modebar config
          modeBarButtonsToAdd: [
            {
              name: 'Download Data',
              icon: downloadIcon,
              click: () => downloadCSV(),
            },
          ],
          modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'zoomOut2d', 'zoomIn2d', 'autoScale2d'],
        }
      }
      style={{ width: '100%', marginTop: '10px' }}
    />
  );
}

Timeseries.propTypes = {
  title: PropTypes.string.isRequired,
  sensors: PropTypes.arrayOf(PropTypes.number).isRequired,
  metric: PropTypes.number.isRequired,
  limX: PropTypes.arrayOf(PropTypes.number),
  limY: PropTypes.arrayOf(PropTypes.number),
  downsampling: PropTypes.number,
};

Timeseries.defaultProps = {
  downsampling: 200,
  limX: [null, null],
  limY: [null, null],
};
