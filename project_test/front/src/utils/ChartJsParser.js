const ChartJsParser = {
  getannotation(annotation) {
    const annotations = [];
    let scaleid = null;
    let type = null;
    if (annotation !== undefined) {
      annotation.forEach((d) => {
        if (d.axes === 'x') {
          scaleid = 'x-axis-0';
          type = 'vertical';
        } else {
          type = 'horizontal';
          scaleid = 'y-axis-0';
        }
        annotations.push({
          borderColor: d.color,
          borderWidth: 2,
          value: d.value,
          type: 'line',
          mode: type,
          scaleID: scaleid,
        });
      });
    }
    return annotations;
  },


  /*

   */

  getboxannotation(annotation) {
    const annotations = [];
    annotation.forEach((d) => {
      annotations.push({
        type: 'box',
        drawTime: 'beforeDatasetsDraw',
        id: 'a-box-1',
        xScaleID: 'x-axis-0',
        yScaleID: 'y-axis-0',
        yMax: d.ymax,
        yMin: d.ymin,
        backgroundColor: 'rgba(101, 33, 171, 0.5)',
        borderWidth: 2,
        yAdjust: 50,
        label: {
          backgroundColor: 'white',
          content: 'Test Label',
          enabled: true,
        },
      });

      annotations.push({
        type: 'line',
        drawTime: 'beforeDatasetsDraw',
        id: 'a-try-1',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: (d.ymin + d.ymax) / 2,
        borderColor: 'transparent',
        label: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          fontFamily: 'sans-serif',
          fontSize: 12,
          fontStyle: 'bold',
          fontColor: '#fff',
          xPadding: 12,
          yPadding: 6,
          cornerRadius: 4,
          position: 'center',
          enabled: true,
          content: d.name,
        },
      });
    });
    return annotations;
  },


};
export default ChartJsParser;
