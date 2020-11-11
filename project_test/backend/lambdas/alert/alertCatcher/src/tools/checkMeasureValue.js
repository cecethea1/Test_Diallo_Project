const hstore = require('pg-hstore')();

// this fuction will convert alert level to LEVEL_<Roman> if threshold length > 3
const convertToRoman = (num) => {
    const roman = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    let str = '';
    for (var i of Object.keys(roman)) {
        var q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }
    return str;
};

// Get Level type from threshold label length
const getLevelType = (length) => {
    switch (length) {
        case length = 1:
            return 'Warning';
        case length = 2:
            return 'Alert';
        case length = 3:
            return 'Contractual';
        case length > 3:
            return 'LEVEL' + convertToRoman(length);
    }
}

// check if measure value exeed threshold value
function exceedCheck(limit, measureValue, thresholdValue) {
    const isHeight = limit.toUpperCase().includes('H');
    return (isHeight ? (measureValue >= thresholdValue) : (measureValue <= thresholdValue));
}


module.exports = (measure) => {
    try {
        const threshold = hstore.parse(measure.threshold);
        // Create an array of threshold keys exp: [H, HH, HHH, L, LL, LLL]
        let limits = Object.keys(threshold).sort();
        // Create an array of ordered height threshold keys exp: [HHH, HH, H]	  
        const heightLimits = limits.slice(0, limits.length / 2).reverse();
        // Create an array of ordered low threshold keys exp: [LLL, LL, L]
        const lowLimits = limits.slice(limits.length / 2, limits.length + 1).reverse();
        // Merge two arrays exp: [HHH, HH, H, LLL, LL, L]
        limits = [...heightLimits, ...lowLimits]
        for (let i = 0; i < limits.length; i++) {
            const limit = limits[i];
            const measureValue = parseFloat(measure.value);
            const thresholdValue = parseFloat(threshold[limit]);
            const thresholdExceeded = exceedCheck(limit, measureValue, thresholdValue);
            if (thresholdExceeded) {
                // create Alert object if threshold exeeded
                const newAlert = { ...measure, limit: parseFloat(threshold[limit]), threshold: limit, type: getLevelType(limit.length) };
                return newAlert;
            }
        }
    }
    catch (error) {
        throw error;
    }
};

