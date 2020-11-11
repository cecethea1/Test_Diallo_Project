const TreatData = {
  largestTriangleThreeBucket(_data, threshold, min, max) {
    const { floor } = Math;
    const { abs } = Math;
    let data = _data;
    // use min,max
    if (min && max && min !== 'NaN' && max !== 'NaN') {
      const indexOfMinValue = data.reduce((iMax, d, i) => (d.x <= min ? i : iMax), 0);
      const indexOfMaxValue = data.reduce((iMax, d, i) => (d.x <= max ? i : iMax), 0);
      data = data.slice(indexOfMinValue, indexOfMaxValue);
      // add first
      if (_data[0] !== data[0]) {
        data.splice(0, 0, _data[0]);
      }
      // add last
      if (_data[_data.length - 1] !== data[data.length - 1]) {
        data.splice(data.length, 0, _data[_data.length - 1]);
      }
    }

    const dataLength = data.length;
    if (threshold >= dataLength || threshold === 0) {
      return data; // Nothing to do
    }

    const sampled = [];
    let sampledIndex = 0;

    // Bucket size. Leave room for start and end data points
    const every = (dataLength - 2) / (threshold - 2);

    let a = 0; // Initially a is the first point in the triangle
    let maxAreaPoint;
    let maxArea;
    let area;
    let nextA;

    sampled[sampledIndex] = data[a]; // Always add the first point
    sampledIndex += 1;

    for (let i = 0; i < threshold - 2; i += 1) {
      // Calculate point average for next bucket (containing c)
      let avgX = 0;
      let avgY = 0;
      let avgRangeStart = floor((i + 1) * every) + 1;
      let avgRangeEnd = floor((i + 2) * every) + 1;
      avgRangeEnd = avgRangeEnd < dataLength ? avgRangeEnd : dataLength;

      const avgRangeLength = avgRangeEnd - avgRangeStart;

      for (; avgRangeStart < avgRangeEnd; avgRangeStart += 1) {
        avgX += data[avgRangeStart].x * 1; // * 1 enforces Number (value may be Date)
        avgY += data[avgRangeStart].y * 1;
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;

      // Get the range for this bucket
      let rangeOffs = floor((i + 0) * every) + 1;
      const rangeTo = floor((i + 1) * every) + 1;

      // Point a
      const pointAX = data[a].x * 1; // enforce Number (value may be Date)
      const pointAY = data[a].y * 1;
      area = -1;
      maxArea = area;

      for (; rangeOffs < rangeTo; rangeOffs += 1) {
        // Calculate triangle area over three buckets
        area = abs((pointAX - avgX) * (data[rangeOffs].y - pointAY)
                    - (pointAX - data[rangeOffs].x) * (avgY - pointAY)) * 0.5;
        if (area > maxArea) {
          maxArea = area;
          maxAreaPoint = data[rangeOffs];
          nextA = rangeOffs; // Next a is this b
        }
      }

      sampled[sampledIndex] = maxAreaPoint; // Pick this point from the bucket
      sampledIndex += 1;
      a = nextA; // This a is the next a (chosen b)
    }
    sampled[sampledIndex] = data[dataLength - 1]; // Always add last
    return sampled;
  },
};

module.exports = TreatData;
