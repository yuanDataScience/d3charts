import * as d3chart from './d3chart';
import * as d3 from 'd3';




const myBarChart = d3chart.barChart()
    .width(1000)
    .height(400)
    .x(function(d) { return d.letter; })
    .y(function(d) { return d.frequency; })
    .x_lab("Letter")
    .y_lab("Frequency")
    .title("Frequency of Letters");

let myScatterplot = d3chart.scatterPlot()
    .width(1000)
    .height(400)
    .x(d => d.letter)
    .y(d => d.frequency)
    .x_lab("Letter")
    .y_lab("Frequency")
    .title("Frequency of Letters")
    ;


let formatDate = d3.timeParse("%Y");
let myTimeSeriesChart = d3chart.lineChart()
    .width(800)
    .height(400)
    .x(d => formatDate(d.year))
    .y(d => +d.value)
    .x_lab("Year")
    .y_lab("Population")
    .title("Population vs. Year")
    .xScale(d3.scaleTime())
    ;

let myAreaChart = d3chart.areaChart()
    .width(1000)
    .height(400)
    .x('date')
    .xScale(d3.scaleTime())
    .y1('close')
    .x_lab('Date')
    .y_lab("Close")
    .title("Close vs. Date");

let myAreachart2 = d3chart.areaChart()
    .width(800)
    .height(400)
    .x('date')
    .xScale(d3.scaleTime())
    .y1('Firefox')
    .y0('Internet Explorer')
    .x_lab("Date")
    .y_lab("Percentage")
    .title("Percentage of Browsers")
    ;

let myStackAreaChart = d3chart.stackAreaChart()
    .width(1000)
    .height(400)
    .x('date')
    .xScale(d3.scaleTime())
    .y(["Google Chrome", "Internet Explorer", "Firefox", "Safari"])
    .x_lab("Date")
    .y_lab("Percentage")
    .title("Market Share of Broswers");

let myPieChart = d3chart.pieChart()
    .width(1000)
    .height(450)
    .x('age')
    .y(d => d.population)
    .title("percentage of ages");

    let myDonutChart = d3chart.donutChart()
    .width(1000)
    .height(450)
    .x('age')
    .y(d => d.population)
    .title("percentage of ages")
    ;    

const parseDate = d3.timeParse("%Y %b %d");

function percentage(d, i, columns) {

    d.date = parseDate(d.date);
    for (let j = 1, n = columns.length; j < n; ++j) {
        d[columns[j]] = +d[columns[j]] / 100;
    }

    return d;
}



const area_date_parser = d3.timeParse("%d-%b-%y")

function processTSV(d, i, columns) {
   
    d.date = area_date_parser(d.date);

    for (let i = 1, n = columns.length; i < n; ++i) {
        d[columns[i]] = +d[columns[i]];
    }

    return d;
}


plot();

let myBoxPlot = d3chart.boxPlot()
                       .width(1000)
                       .height(400)
                       .x('Pclass')
                       .y('Age')
                       .hue('Sex')
                       .x_lab("Guest Class")
                       .y_lab("Age")
                       .title("Age of Titanic Guests in Different Classes")
                       
                      ;

                      
const myDragForceChart = d3chart.dragForceChart()
                              .width(1000)
                              .height(400)
                              .node_property('nodes')
                              .node_group('group')
                              .link_property('links')
                              .linkby( d=>d.id)
                              .linkwidth ( d=> Math.sqrt(d.value))
                              .title("Network of Characters in Les Miserable");
                              


async function plot() {
    try {

        let box_data = await d3.csv("./data/train.csv", d=> {
            d.Age = +d.Age;
            return d;
        });

        box_data = box_data.filter(function(d){ return d.Age >0});
       
        d3.select("#boxplot")
          .datum(box_data)
          .call(myBoxPlot);


        let network_data = await d3.json("../data/force.json");
        d3.select("#dragforce")
          .datum(network_data)
          .call(myDragForceChart);

        let data = await d3.csv("../data/data.tsv", function(d) {
            d.frequency = +d.frequency;
            return d;
        });

        let timeSeriesData = await d3.json("../data/example.json");

        let browser_data = await d3.tsv("../data/browser_usage.tsv", percentage);

        console.log("broswer data", browser_data);

        let area_data = await d3.tsv("../data/area.tsv", processTSV);

        let pie_data = await d3.csv("../data/pie.csv", d => { d.population = +d.population; return d; });


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

        d3.select("#piechart")
            .datum(pie_data)
            .call(myPieChart);

        d3.select("#donutchart")
          .datum(pie_data)
          .call(myDonutChart);    

    } catch (e) {
        console.log(e)
    }

}

const state ={};

init();

function init(){
    state.active_bar = "barchart";
    state.active_pie = "piechart";
    state.active_line = "timeserieschart";
    
}

document.getElementById("bar_button").addEventListener('click', event =>{
    const barcharts = ["barchart","scatterplot","boxplot"];
    const index = (barcharts.indexOf(state.active_bar)+1)%barcharts.length;
    document.getElementById(state.active_bar).classList.toggle("active");
    state.active_bar = barcharts[index];
    document.getElementById(state.active_bar).classList.toggle("active");

});

document.getElementById("pie_button").addEventListener('click', event =>{
    const piecharts = ["piechart","stackareachart","donutchart"];
    const index = (piecharts.indexOf(state.active_pie)+1)%piecharts.length;
    document.getElementById(state.active_pie).classList.toggle("active");
    state.active_pie = piecharts[index];
    document.getElementById(state.active_pie).classList.toggle("active");

});

document.getElementById("line_button").addEventListener('click', event =>{
    const linecharts = ["timeserieschart","areachart","dragforce"];
    const index = (linecharts.indexOf(state.active_line)+1)%linecharts.length;
    document.getElementById(state.active_line).classList.toggle("active");
    state.active_line = linecharts[index];
    document.getElementById(state.active_line).classList.toggle("active");

});


