// import React, { useEffect, useRef, useState } from 'react';
// import Chart from 'chart.js';
// import 'chartjs-plugin-annotation';
// import 'chartjs-plugin-zoom';
// import './cumulativeline.scss';
// import 'chartjs-plugin-responsive-downsample';
// import Row from 'react-bootstrap/Row';
// import PropTypes from 'prop-types';
// import ChartJsParser from '../../../utils/ChartJsParser';
// import ColorArray from '../../../utils/ColorArray';

// // construct dataset object for each line
// function getdataset(data, color) {
//   const datasets = []; // add 'datasets' array element to object
//   data.forEach((d, i) => {
//     datasets.push({
//       label: d.name,
//       data: d.data,
//       borderColor: color[i],
//       backgroundColor: 'transparent',
//       pointBackgroundColor: color[i],
//     });
//   });
//   return datasets;
// }

// export default function CumulativeLine(props) {
//   const { data, title, annotation } = props;
//   const chartRef = useRef(null);
//   const [myChart, setMyChart] = useState(null);
//   const [isZoomed, setIsZoomed] = useState(false);
//   const [isDisable, setisDisable] = useState(false);
//   const color = ColorArray.getarray(data.length);
//   const annotations = ChartJsParser.getboxannotation(annotation);

//   const chartConfig = {
//     type: 'line',
//     data: {
//       datasets: getdataset(data, color),
//     },

//     options: {
//       title: {
//         display: true,
//         text: title,
//       },

//       showLines: true, // display line

//       animation: {
//         duration: 0, // general animation time , 0 for better performance
//       },

//       hover: {
//         animationDuration: 0, // duration of animations when hovering an item
//       },

//       responsiveAnimationDuration: 0, // animation duration after a resize
//       elements: {
//         line: {
//           tension: 0.3, // curve of line
//         },
//         point: {
//           radius: 2,
//         },

//       },
//       legend: {
//         display: true,
//         position: 'bottom', // position of legend
//       },
//       spanGaps: false, // Nan in data
//       responsive: true,
//       maintainAspectRatio: false,
//       scales: {
//         xAxes: [{
//           type: 'linear',
//           scaleLabel: {
//             display: true,
//             labelString: 'Date',
//           },
//           ticks: {
//             suggestedMin: -10,
//             suggestedMax: 50,

//           },
//         }],
//         yAxes: [{
//           ticks: {
//             suggestedMin: 0,
//             suggestedMax: 50,
//           },
//         }],
//       },
//       // legend on cursor
//       tooltips: {
//         mode: 'nearest', // for cursor plugin
//         intersect: true,
//         callbacks: {
//           title(a) {
//             // return a[0].xLabel.toFixed(2);
//             return a[0].xLabel;
//           },
//           label(i, d) {
//             return (
//               `${d.datasets[i.datasetIndex].label}: ${i.yLabel.toFixed(2)}`
//             );
//           },
//         },
//       },

//       // annotations
//       annotation: {
//         drawTime: 'afterDraw',
//         annotations,
//       },

//       plugins: {
//         crosshair: false,
//         zoom: {
//           pan: {
//             enabled: false,
//             mode: 'xy',
//           },
//           zoom: {
//             drag: {
//               borderColor: '#F66',
//               borderWidth: 3,
//               backgroundColor: 'rgb(225,225,225)',
//               animationDuration: 1,
//             },
//             enabled: true,
//             mode: 'xy',
//             onZoomComplete() {
//               setIsZoomed(!isZoomed);
//             },
//           },

//         },
//       },
//     },
//   };

//   useEffect(() => {
//     if (chartRef && chartRef.current) {
//       const newChartInstance = new Chart(chartRef.current, chartConfig);
//       setMyChart(newChartInstance);
//     }
//   }, [chartRef]);

//   const resetZoom = () => {
//     setIsZoomed(false);
//     myChart.data.datasets = getdataset(data, color);
//     myChart.resetZoom();
//   };

//   const disableAll = () => {
//     const state = !isDisable;
//     myChart.data.datasets.forEach((ds) => {
//       const legend = ds;
//       legend.hidden = state;
//     });
//     setisDisable(!isDisable);
//     myChart.update();
//   };

//   return (
//     <Row>
//       <div className="canvas-cumulative">
//         <canvas
//           id="canvas"
//           ref={chartRef}
//         />
//         <div className="button-container">
//           <button type="button" className="button" onClick={disableAll}>
//             {' '}
//             {isDisable ? 'Enable All' : 'Disable all'}
//           </button>
//           {isZoomed
//           && <button type="button" className="button" onClick={resetZoom}> Reset zoom</button>}
//         </div>
//       </div>
//     </Row>
//   );
// }

// CumulativeLine.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string,
//       data: PropTypes.arrayOf(
//         PropTypes.shape({
//           x: PropTypes.number,
//           y: PropTypes.number,
//         }),
//       ),
//     }),
//   ).isRequired,
//   title: PropTypes.string.isRequired,
//   annotation: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string,
//       color: PropTypes.string,
//       ymax: PropTypes.number,
//       ymin: PropTypes.number,
//     }),
//   ),
// };

// CumulativeLine.defaultProps = {
//   annotation: [],
// };
