import * as d3chart from './views/d3chart';
import * as d3 from 'd3';

let myBarChart = d3chart.barChart()
    .width(600)
    .height(500)
    .x(function(d) { return d.letter; })
    .y(function(d) { return d.frequency; });

let myScatterplot = d3chart.scatterPlot()
    .width(600)
    .height(500)
    .x(d => d.letter)
    .y(d => d.frequency);


let formatDate = d3.timeParse("%Y");
let myTimeSeriesChart = d3chart.timeSeriesLineChart()
    .width(600)
    .height(500)
    .x(d => formatDate(d.year))
    .y(d => +d.value);

let myAreaChart = d3chart.areaChart()
    .width(1000)
    .height(500)
    .x(d => d.date)
    .y1(d => d.close);

let myAreachart2 = d3chart.areaChart()
    .width(3000)
    .height(500)
    .x(d => d.date)
    .y1(d => d['Firefox'])
    .y0(d => d['Internet Explorer']);

let myStackAreaChart = d3chart.stackAreaChart()
    .width(1000)
    .height(700)
    .x('date')
    .y(["Google Chrome", "Internet Explorer", "Firefox", "Safari"]);

const parseDate = d3.timeParse("%Y %b %d");

function percentage(d, i, columns) {

    for (let i = 0, n = columns.length; i < n; ++i) {
        d[columns[i]] = d[columns[i]].trim();
    }
    d.date = parseDate(d.date);
    for (let i = 1, n = columns.length; i < n; ++i) {
        d[columns[i]] = +d[columns[i]] / 100;
    }

    return d;
}

const area_date_parser = d3.timeParse("%d-%b-%y")

function processTSV(d, i, columns) {
    for (let i = 0, n = columns.length; i < n; ++i) {
        d[columns[i]] = d[columns[i]].trim();
    }
    d.date = area_date_parser(d.date);

    for (let i = 1, n = columns.length; i < n; ++i) {
        d[columns[i]] = +d[columns[i]];
    }

    return d;
}


plot();


async function plot() {
    try {
        let data = await d3.csv("../data/data.tsv", function(d) {
            d.frequency = +d.frequency;
            return d;
        });

        let timeSeriesData = await d3.json("../data/example.json");

        let browser_data = await d3.tsv("../data/browser_usage.tsv", percentage);

        //console.log("browser data", browser_data);

        let area_data = await d3.tsv("../data/area.tsv", processTSV);
        //console.log("area data", area_data);

        d3.select("#barchart")
            .datum(data)
            .call(myBarChart);

        d3.select("#scatterplot")
            .datum(data)
            .call(myScatterplot);

        d3.select("#timeserieschart")
            .datum(timeSeriesData)
            .call(myTimeSeriesChart);

        d3.select("#areachart")
            .datum(area_data)
            .call(myAreaChart);

        d3.select("#areachart2")
            .datum(browser_data)
            .call(myAreachart2);

        d3.select("#stackareachart")
            .datum(browser_data)
            .call(myStackAreaChart);

    } catch (e) {
        console.log(e)
    }

}