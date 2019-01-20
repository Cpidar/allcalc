const R = require('ramda');

let dropIndex = R.compose(R.values, R.omit)
let pickIndex = R.compose(R.values, R.pickAll);

const exclude = (data, i) => {

    let dropEntalpy = R.compose((h) => h.map(x => dropIndex(i, x)), dropIndex);
    let entalpy = dropEntalpy(i, data.entalpy);
    let elements = dropIndex(i, data.elements);
    let densities = dropIndex(i, data.densities);
    let electronegativities = dropIndex(i, data.electronegativities);
    let meltingPoints = dropIndex(i, data.meltingPoints);
    let radius = dropIndex(i, data.radius);
    let aweight = dropIndex(i, data.aweight);
    return Object.assign({}, {
        entalpy,
        elements,
        aweight,
        densities,
        electronegativities,
        meltingPoints,
        radius
    })
}

const include = (data, i) => {

    return exclude(data, dropIndex(i, R.keys(data.elements)))
}


function calc(data, option = false) {

    const omegaCalc = (Tm, dH, dS) => Math.abs(-Tm * dS / (1000 * dH));

    let formula = data.elements.reduce((acc, cur) => acc + cur, '');
    let xi = data.xi;

    let weightTotal = R.compose(R.reduce(R.add, 0), R.zipWith)

    if (option) {
        let dH = data.entalpy.map(x => 4 * x[0] * xi[x[1]] * xi[x[2]]).reduce((acc, cur) => acc + cur, 0)
        let isdHPass = (typeof option.mindH == 'number' ? dH > option.mindH : true) && (typeof option.maxdH == 'number' ? dH < option.maxdH : true);
        if (!isdHPass) return;

        let aweight = weightTotal((x, y) => x * y, data.aweight, xi);
        let awaitPerDensity = weightTotal((x, y) => x / y, R.zipWith((x, y) => x * y, data.aweight, xi), data.densities);
        let density = aweight / awaitPerDensity;
        let isDnPass = (typeof option.maxdn == 'number' ? density < option.maxdn : true) && (typeof option.mindn == 'number' ? density > option.mindn : true)
        if (!isDnPass) return;

        let Ra = weightTotal((x, y) => x * y, data.radius, xi);
        let delta = data.radius.map((r, i) => xi[i] * (1 - r / Ra) ** 2).reduce((acc, cur) => acc + cur, 0) ** 0.5;
        let isDeltaPass = (typeof option.minDelta == 'number' ? delta > option.minDelta : true) && (typeof option.maxDelta == 'number' ? delta < option.maxDelta : true)
        if (!isDeltaPass) return;

        let dS = weightTotal((x, y) =>  -8.3144 * x * Math.log(y), xi, xi);
        let isdSPass = (typeof option.mindS == 'number' ? dS > option.mindS : true) && (typeof option.maxdS == 'number' ? dS < option.maxdS : true)
        if (!isdSPass) return;

        let Tm = weightTotal((x, y) => x * y, data.meltingPoints, xi);
        let omega = omegaCalc(Tm, dH, dS);
        let isOmegaPass = (typeof option.minOmega == 'number' ? omega > option.minOmega : true) && (typeof option.maxOmega == 'number' ? omega < option.maxOmega : true)
        if (!isOmegaPass) return


        let En = weightTotal((x, y) => x * y, data.electronegativities, xi);
        let deltaEN = (data.electronegativities.map((x, i) => xi[i] * (x - En) ** 2).reduce((acc, cur) => acc + cur, 0)) ** 0.5;
        let isEnPass = (typeof option.minEN == 'number' ? deltaEN > option.minEN : true) && (typeof option.maxEN == 'number' ? deltaEN < option.maxEN : true)
        if (!isEnPass) return;

        let info = { formula, xi, dH, dS, density, omega, delta, deltaEN };

        return info;


    } else {

        let dH = data.entalpy.map(x => 4 * x[0] * xi[x[1]] * xi[x[2]]).reduce((acc, cur) => acc + cur, 0)
        let dS = weightTotal((x, y) => -8.3144 * x * Math.log(y), xi, xi);
        let Tm = weightTotal((x, y) => x * y, data.meltingPoints, xi);
        let omega = omegaCalc(Tm, dH, dS);
        let Ra = weightTotal((x, y) => x * y, data.radius, xi);
        let aweight = weightTotal((x, y) => x * y, data.aweight, xi);
        let awaitPerDensity = weightTotal((x, y) => x / y, R.zipWith((x, y) => x * y, data.aweight, xi), data.densities);
        let density = aweight / awaitPerDensity;
        let delta = data.radius.map((r, i) => xi[i] * (1 - r / Ra) ** 2).reduce((acc, cur) => acc + cur, 0) ** 0.5;
        let En = weightTotal((x, y) => x * y, data.electronegativities, xi);
        let deltaEN = (data.electronegativities.map((x, i) => xi[i] * (x - En) ** 2).reduce((acc, cur) => acc + cur, 0)) ** 0.5;

        let info = { formula, xi, dH, dS, density, omega, delta, deltaEN, Ra, En, Tm };
        // if (info) fs.appendFileSync('result.json', JSON.stringify(info), (err, res) => err ? console.log(err) : console.log('success'));
        return info;
    }
}


module.exports = { calc, include, exclude };