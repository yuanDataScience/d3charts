   let myBarChart = barChart()
       .width(600)
       .height(500)
       .x(function(d) { return d.letter; })
       .y(function(d) { return d.frequency; });

   let myScatterplot = scatterPlot()
       .width(600)
       .height(500)
       .x(d => d.letter)
       .y(d => d.frequency);


   let formatDate = d3.timeParse("%Y");
   let myTimeSeriesChart = timeSeriesLineChart()
       .width(600)
       .height(500)
       .x(d => formatDate(d.year))
       .y(d => +d.value);

   let myAreaChart = areaChart()
       .width(1000)
       .height(500)
       .x('date')
       .y1('close');

   let myAreachart2 = areaChart()
       .width(3000)
       .height(500)
       .x('date')
       .y1('Firefox')
       .y0('Internet Explorer');

   let myStackAreaChart = stackAreaChart()
       .width(1000)
       .height(700)
       .x('date')
       .y(["Google Chrome", "Internet Explorer", "Firefox", "Safari"]);

   let myPieChart = pieChart()
       .width(500)
       .height(700)
       .x('age')
       .y(d => d.population);

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

       } catch (e) {
           console.log(e)
       }

   }