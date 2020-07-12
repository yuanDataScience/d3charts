import * as d3chart from './d3chart';
import * as d3 from 'd3';




// let myBarChart = d3chart.barChart()
//     .width(400)
//     .height(400)
//     .x(function(d) { return d.letter; })
//     .y(function(d) { return d.frequency; });

// let myScatterplot = d3chart.scatterPlot()
//     .width(400)
//     .height(400)
//     .x(d => d.letter)
//     .y(d => d.frequency);


// let formatDate = d3.timeParse("%Y");
// let myTimeSeriesChart = d3chart.timeSeriesLineChart()
//     .width(450)
//     .height(500)
//     .x(d => formatDate(d.year))
//     .y(d => +d.value);

// let myAreaChart = d3chart.areaChart()
//     .width(600)
//     .height(400)
//     .x('date')
//     .y1('close');

// let myAreachart2 = d3chart.areaChart()
//     .width(400)
//     .height(400)
//     .x('date')
//     .y1('Firefox')
//     .y0('Internet Explorer');

// let myStackAreaChart = d3chart.stackAreaChart()
//     .width(400)
//     .height(400)
//     .x('date')
//     .y(["Google Chrome", "Internet Explorer", "Firefox", "Safari"]);

// let myPieChart = d3chart.pieChart()
//     .width(400)
//     .height(500)
//     .x('age')
//     .y(d => d.population);

//     let myDonutChart = d3chart.donutChart()
//     .width(400)
//     .height(500)
//     .x('age')
//     .y(d => d.population);    

// const parseDate = d3.timeParse("%Y %b %d");

// function percentage(d, i, columns) {

//     for (let i = 0, n = columns.length; i < n; ++i) {
//         d[columns[i]] = d[columns[i]].trim();
//     }
//     d.date = parseDate(d.date);
//     for (let i = 1, n = columns.length; i < n; ++i) {
//         d[columns[i]] = +d[columns[i]] / 100;
//     }

//     return d;
// }

// const area_date_parser = d3.timeParse("%d-%b-%y")

// function processTSV(d, i, columns) {
//     for (let i = 0, n = columns.length; i < n; ++i) {
//         d[columns[i]] = d[columns[i]].trim();
//     }
//     d.date = area_date_parser(d.date);

//     for (let i = 1, n = columns.length; i < n; ++i) {
//         d[columns[i]] = +d[columns[i]];
//     }

//     return d;
// }


plot();

let myBoxPlot = d3chart.boxPlot()
                       .width(400)
                       .height(500)
                       .x('Pclass')
                       .y('Age')
                       .hue('Sex')
                      ;

                      
let myDragForceChart = d3chart.dragForceChart()
                              .width(1000)
                              .height(1000)
                              .node_property('nodes')
                              .node_group('group')
                              .link_property('links')
                              .linkby( d=>d.id)
                              .linkwidth ( d=> Math.sqrt(d.value));
                              


async function plot() {
    try {

        let data = await d3.csv("./data/train.csv", d=> {
            d.Age = +d.Age;
            return d;
        });

        data = data.filter(function(d){ return d.Age >0});
       
        d3.select("#boxplot")
          .datum(data)
          .call(myBoxPlot);


        let network_data = await d3.json("../data/force.json");
        d3.select("#dragforce")
          .datum(network_data)
          .call(myDragForceChart);

        // let data = await d3.csv("../data/data.tsv", function(d) {
        //     d.frequency = +d.frequency;
        //     return d;
        // });

        // let timeSeriesData = await d3.json("../data/example.json");

        // let browser_data = await d3.tsv("../data/browser_usage.tsv", percentage);

        // let area_data = await d3.tsv("../data/area.tsv", processTSV);

        // let pie_data = await d3.csv("../data/pie.csv", d => { d.population = +d.population; return d; });


        // d3.select("#barchart")
        //     .datum(data)
        //     .call(myBarChart);

        // d3.select("#scatterplot")
        //     .datum(data)
        //     .call(myScatterplot);

        // d3.select("#timeserieschart")
        //     .datum(timeSeriesData)
        //     .call(myTimeSeriesChart);

        // d3.select("#areachart")
        //     .datum(area_data)
        //     .call(myAreaChart);

        // d3.select("#areachart2")
        //     .datum(browser_data)
        //     .call(myAreachart2);

        // d3.select("#stackareachart")
        //     .datum(browser_data)
        //     .call(myStackAreaChart);

        // d3.select("#piechart")
        //     .datum(pie_data)
        //     .call(myPieChart);

        // d3.select("#donutchart")
        //   .datum(pie_data)
        //   .call(myDonutChart);    

    } catch (e) {
        console.log(e)
    }

}