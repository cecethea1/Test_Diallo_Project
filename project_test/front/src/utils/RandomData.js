
const RandomData = {
  generatetimeseries(nbitem, nbpoint) {
    const dataset = [];
    for (let j = 0; j < nbitem; j += 1) {
      const temp = [];
      const tempdate = new Date('December 17, 1995 03:24:00');
      for (let i = 0; i < nbpoint; i += 1) {
        temp.push({
          x: +tempdate,
          y: Math.random() * (20 - 5) + 5,
        });
        tempdate.setDate(tempdate.getDate() + 1);
      }
      dataset.push({
        name: `test${j}`,
        data: temp,
      });
    }
    return dataset;
  },

  generatecumulative(nbitem, nbpoint) {
    const dataset = [];
    const temppos = 1;
    const tempdate = new Date();
    for (let j = 1; j < nbitem; j += 1) {
      const temp = [];
      for (let i = 0; i < nbpoint; i += 1) {
        temp.push({
          x: Math.random() * (temppos + 1 - temppos) + temppos,
          y: i * 5,
        });
      }
      dataset.push({
        name: tempdate.toISOString(),
        data: temp,
      });
      tempdate.setDate(tempdate.getDate() + 1);
    }
    return dataset;
  },
};

export default RandomData;
