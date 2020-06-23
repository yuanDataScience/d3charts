import * as d3chart from './views/d3chart';
import * as d3 from 'd3';

let myBarChart = d3chart.barChart()
    .width(600)
    .height(500)
    .x(function(d) { return d.letter; })
    .y(function(d) { return d.frequency; });

plot();

async function plot() {
    try {
        let data = await d3.csv("../data/data.tsv", function(d) {
            d.frequency = +d.frequency;
            return d;
        });

        //console.log(data);

        d3.select("#chart")
            .datum(data)
            .call(myBarChart);

    } catch (e) {
        console.log(e)
    }

}