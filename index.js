#!/usr/bin/env node

const vorpal = require('vorpal')();

const Combinatorics = require('js-combinatorics');
const R = require('ramda');
const fs = require('fs');
const json2xls = require('json2xls');
const jsonfile = require('jsonfile');

var ientalpy = require('./entalpy.json');
var ielements = require('./elements.json');
var idensities = require('./densities.json');
var ielectronegativities = require('./electronegativity.json');
var imeltingPoints = require('./melting-points.json');
var iradius = require('./radius.json');

const allcom = require('./alloy-calc');

let alloyPartsNo = 5;

let allowedXi = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];

let filename;

let initData = {
    entalpy: ientalpy,
    elements: ielements,
    densities: idensities,
    electronegativities: ielectronegativities,
    meltingPoints: imeltingPoints,
    radius: iradius,
}

let option = {}

let data = initData;
let alloys = Combinatorics.bigCombination(R.keys(data.elements), alloyPartsNo);

vorpal
    .command('start')
    .option('-f, --filter')
    .action(function (args, fn) {
        filename = Date.now()
        this.log('starting...');
        // if (elements.length == 5) {

        // } else {
            args.options.filter ? startCalc(data, 100,Ci() , option) : startCalc(data, 100, Ci());
        // }

        fn()
    })

vorpal
    .command('in [el...]')
    .action(function (args, fn) {
        let el = args.el.map(el => el.charAt(0).toUpperCase() + el.slice(1)).map(x => initData.elements.indexOf(x));
        data = allcom.include(initData, el)
        alloys = Combinatorics.bigCombination(R.keys(data.elements), alloyPartsNo);
        this.log(`${data.elements}`);
        fn()
    })

vorpal
    .command('ex [el...]')
    .action(function (args, fn) {
        let el = args.el.map(el => el.charAt(0).toUpperCase() + el.slice(1)).map(x => initData.elements.indexOf(x));
        data = allcom.exclude(initData, el)
        alloys = Combinatorics.bigCombination(R.keys(data.elements), alloyPartsNo);
        this.log(`${data.elements}`);
        fn()
    })

vorpal
    .command('nop [number]')
    .action(function (args, fn) {
        alloyPartsNo = args.number
        this.log(args);
        fn()
    })

vorpal
    .command('xi [number...]')
    .action(function (args, fn) {
        allowedXi = args.number
        this.log(args);
        fn()
    })

    vorpal
    .command('H')
    .option('-l, --low <min>')
    .option('-h, --high <max>')
    .action(function (args, fn) {
        if(args.options.low) option.mindH = Number(args.options.low.slice(1, args.options.low.length - 1));
        if(args.options.high) option.maxdH = Number(args.options.high.slice(1, args.options.high.length - 1));
        this.log(`Hmin: ${option.mindH} Hmax: ${option.maxdH}`);
        fn()
    })

    vorpal
    .command('S')
    .option('-l, --low <min>')
    .option('-h, --high <max>')
    .action(function (args, fn) {
        if(args.options.low) option.mindS = Number(args.options.low.slice(1, args.options.low.length - 1));
        if(args.options.high) option.maxdS = Number(args.options.high.slice(1, args.options.high.length - 1));
        this.log(`Smin: ${option.mindS} Smax: ${option.maxdS}`);
        fn()
    })

    vorpal
    .command('Dn')
    .option('-l, --low <min>')
    .option('-h, --high <max>')
    .action(function (args, fn) {
        if(args.options.low) option.mindn = Number(args.options.low.slice(1, args.options.low.length - 1));
        if(args.options.high) option.maxdn = Number(args.options.high.slice(1, args.options.high.length - 1));
        this.log(`Dn min: ${option.mindn} Dnmax: ${option.maxdn}`);
        fn()
    })

    vorpal
    .command('O')
    .option('-l, --low <min>')
    .option('-h, --high <max>')
    .action(function (args, fn) {
        if(args.options.low) option.minOmega = Number(args.options.low.slice(1, args.options.low.length - 1));
        if(args.options.high) option.maxOmega = Number(args.options.high.slice(1, args.options.high.length - 1));
        this.log(`Omin: ${option.minOmega} Omax: ${option.maxOmega}`);
        fn()
    })

    vorpal
    .command('D')
    .option('-l, --low <min>')
    .option('-h, --high <max>')
    .action(function (args, fn) {
        if(args.options.low) option.minDelta = Number(args.options.low.slice(1, args.options.low.length - 1));
        if(args.options.high) option.maxDelta = Number(args.options.high.slice(1, args.options.high.length - 1));
        this.log(`Dmin: ${option.minDelta} Dmax: ${option.maxDelta}`);
        fn()
    })

    vorpal
    .command('E')
    .option('-l, --low <min>')
    .option('-h, --high <max>')
    .action(function (args, fn) {
        if(args.options.low) option.minEN = Number(args.options.low.slice(1, args.options.low.length - 1));
        if(args.options.high) option.maxEN = Number(args.options.high.slice(1, args.options.high.length - 1));
        this.log(`Emin: ${option.minEN} Emax: ${option.maxEN}`);
        fn()
    })

vorpal
    .command('excel [filename]')
    .action(function (args, fn) {
        args.filename ? toExcel(args.filename) : this.log('please specify filename')
        fn()
    })

vorpal
    .command('gen [number]')
    .action(function (args, fn) {
        generator(data, args.number, Ci())
        // sc.source(125800, generator, data, args.number, Ci()).collect().then(console.log)
        fn()
    })

vorpal
    .command('run')
    .action(function (args, fn) {
        var ds2 = sc.require({ all: './alloy-calc.js' }).textFile('src.json').map(x => JSON.parse(x)).map(x => x[0])

        ds1.cartesian(ds2).collect().then(x => console.log(x))
        // .map(x => all.calc(data, x[0], x[1])).collect(() => console.log('done'));
        fn()
    })

vorpal
    .delimiter('allcalc$')
    .show()


const CiCalc = () => {
    let pickIndex = R.compose(R.values, R.pickAll);
    let xi = Combinatorics.baseN(allowedXi, alloyPartsNo).toArray();
    let indexes = xi.map((x, i) => [i, x.reduce((acc, cur) => acc + cur)]).filter(x => x[1] == 1).map(x => x[0])
    return pickIndex(indexes, xi);
}

const Ci = R.memoize(() => CiCalc());

function startCalc(data, no, Ci, option = false) {
    fs.writeFileSync(`${filename}.json`, '[', err => console.log(err))
    let src = [];
    let i = 0;
    if (data.elements.length > 5) {
        while (a = alloys.next()) {


            let alloyData = allcom.include(data, a)
            let H = alloyData.entalpy.map((x, i) => R.take(i, x))
            alloyData.entalpy = R.unnest(H.map((x, i) => x.map((y, j) => [y, i, j])))


            let ds = Combinatorics.cartesianProduct([alloyData], Ci)
                // .toArray()
                .forEach(x => {
                    let obj = Object.assign(x[0], { xi: x[1] })
                    let info = allcom.calc(obj, option);
                    if(info != null) src.push(info)
                })
            // src = src.concat(ds);
            // console.log(ds[100])


            i++;
            vorpal.ui.redraw(`${i} of ${alloys.valueOf()}`)
            if ( i % no  == 0 ) {
                let str = JSON.stringify(src).slice(1, -1).concat(',')
                // console.log(str)
                fs.appendFileSync(`${filename}.json`, str, err => console.log(err));
                src = [];
            }


        }
    } else {
        console.log(data)
        let alloyData = data;
        let H = alloyData.entalpy.map((x, i) => R.take(i, x))
        alloyData.entalpy = R.unnest(H.map((x, i) => x.map((y, j) => [y, i, j])))


        let ds = Combinatorics.cartesianProduct([alloyData], Ci)
            .forEach(x => {
                let obj = Object.assign(x[0], { xi: x[1] })
                let info = allcom.calc(obj, option);
                if(info) src.push(info)
            })

            jsonfile.writeFileSync(`${filename}.json`, src, err => console.log(err));

    }
    src.push({})
    let str = JSON.stringify(src).slice(1)
    fs.appendFileSync(`${filename}.json`, str, err => console.log(err));
}

const toExcel = (excelfilename) => {
    const result = json2xls(JSON.parse(fs.readFileSync(`${filename}.json`)));
    fs.writeFileSync(`${excelfilename}.xlsx`, result, 'binary')

}
