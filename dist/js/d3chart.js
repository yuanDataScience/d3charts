//import * as d3 from 'd3';


const pieChart = () => {

    let margin = { left: 80, right: 100, top: 50, bottom: 100 },
        height = 500,
        width = 800,
        innerHeight = height - margin.top - margin.bottom,
        innerWidth = width - margin.left - margin.right,
        color = d3.scaleOrdinal(d3.schemeCategory10),
        donut = false,
        radius = Math.min(innerWidth, innerHeight) / 2,

        xValue = "",
        yValue = function(d) { return d[1]; };

    function chart(selection) {
        selection.each(function(data) {

            // if svg already exists.
            const svg = d3.select(this).selectAll("svg").data([data]);

            const keys = data.map(d => d[xValue]);

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg")
            svgEnter.append("g");

            // Update the outer dimensions.
            svg.merge(svgEnter).attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            const g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + innerWidth / 4 + "," + innerHeight / 2 + ")");

            const arc = d3.arc()
                .innerRadius(radius - 80)
                .outerRadius(radius - 20);

            const pie = d3.pie()
                .value(yValue)
                .sort(null);

            const arcs = g.selectAll(".arc")
                .data(pie(data));

            const arcs_enter = arcs.enter()
                .append("g")
                .attr("class", "arc");


            arcs.merge(arcs_enter)
                .append("path")
                .attr("d", arc)
                .attr("fill", d => color(d.data[xValue]))

            arcs.exit().remove();

            const legend = g.append("g")
                .attr("transform", "translate(" + (innerWidth / 4 + 20) +
                    "," + (-innerHeight / 2 + 30) + ")");

            keys.forEach(function(d, i) {
                let legendRow = legend.append("g")
                    .attr("transform", "translate(0, " + (i * 20) + ")");

                legendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", color(d));

                legendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .style("text-transform", "capitalize")
                    .text(d);


            });



        });
    }


    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };


    return chart;
}


const barChart = () => {

    let margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 400,
        height = 400,
        innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom,
        xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; },
        xScale = d3.scaleBand().padding(0.1),
        yScale = d3.scaleLinear();

    function chart(selection) {
        selection.each(function(data) {

            data = data.map(d => {
                return [xValue(d), yValue(d)];
            });

            // if svg already exists.
            const svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg");
            const gEnter = svgEnter.append("g");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            // Update the outer dimensions.
            svg.merge(svgEnter).attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            const g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            xScale.rangeRound([0, innerWidth])
                .domain(data.map(d => d[0]));
            yScale.rangeRound([innerHeight, 0])
                .domain([0, d3.max(data, d => d[1])]);

            g.select(".x.axis")
                .attr("transform", "translate(0," + innerHeight + ")")
                .call(d3.axisBottom(xScale));

            g.select(".y.axis")
                .call(d3.axisLeft(yScale).ticks(10, "%"))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Frequency");

            const bars = g.selectAll(".bar")
                .data(data);

            bars.enter().append("rect")
                .attr("class", "bar")
                .merge(bars)
                .attr("x", X)
                .attr("y", Y)
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return innerHeight - Y(d); });

            bars.exit().remove();
        });

    }

    // The x-accessor for the path generator; xScale ∘ xValue.
    function X(d) {
        return xScale(d[0]);
    }

    // The y-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    return chart;
}

const areaChart = () => {

    let margin = { left: 80, right: 100, top: 50, bottom: 100 },
        height = 500,
        width = 800,
        innerHeight = height - margin.top - margin.bottom,
        innerWidth = width - margin.left - margin.right,
        xScale = d3.scaleTime(),
        yScale = d3.scaleLinear(),

        xValue = "",
        y1Value = "",
        y0Value = ""

    // xValue = function(d) { return d[0]; },
    // y1Value = function(d) { return d[1]; },
    //y0Value = function(d) { return 0; };

    function chart(selection) {
        selection.each(function(data) {
            //console.log("key test", xValue(data[0]));
            //console.log("data columns", data.columns);
            const keys = data.columns;

            if (xValue === "") {
                xValue = keys[0];
            }
            if (y1Value === "") {
                y1Value = keys[1];
            }
            if ((!keys.includes(xValue)) || (!keys.includes(y1Value)) || (y0Value != "" && !keys.includes(y0Value))) {
                alert("x, y1 or y0 column names are not valid");
                return;
            }
            data = data.map(d => {
                if (y0Value != "") {
                    return [d[xValue], d[y0Value], d[y1Value]];
                } else {
                    return [d[xValue], 0, d[y1Value]];
                }

            });

            // if svg already exists.
            const svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg");
            const gEnter = svgEnter.append("g");

            // Update the outer dimensions.
            svg.merge(svgEnter).attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            const g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Scales
            xScale.rangeRound([0, innerWidth])
                .domain(d3.extent(data, d => d[0]));

            yScale.range([innerHeight, 0])
                //.domain(d3.extent([].concat(data.map(d => d[1]), data.map(d => d[2]))));
                .domain(d3.extent([].concat(data.map(d => d[2]), data.map(d => d[1]))));


            let area = d3.area()
                .x(X)
                .y0(Y0)
                .y1(Y1);

            // Axis generators
            var xAxisCall = d3.axisBottom()
            var yAxisCall = d3.axisLeft()
                .ticks(6);

            // Axis groups
            var xAxis = gEnter.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerHeight + ")");
            var yAxis = gEnter.append("g")
                .attr("class", "y axis")

            // Y-Axis label
            yAxis.append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .attr("fill", "#5D6971")
                //.text("Population)");

            xAxis.call(xAxisCall.scale(xScale));
            yAxis.call(yAxisCall.scale(yScale));

            g.append("path")
                .attr("fill", "steelblue")
                .attr("d", area(data));

            var line_1 = d3.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[1]); });

            g.append("path")
                .attr("class", "arealine")
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-with", "3px")
                .attr("d", line_1(data));

            var line_2 = d3.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[2]); });

            g.append("path")
                .attr("class", "arealine")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-with", "3px")
                .attr("d", line_2(data));

            const legend = g.append("g")
                .attr("transform", "translate(" + (innerWidth + 10) +
                    "," + 50 + ")");

            const legend_labels = y0Value === "" ? [y1Value] : [y0Value, y1Value];
            const colors = y0Value === "" ? ["red"] : ["green", "red"];
            legend_labels.forEach(function(d, i) {
                let legendRow = legend.append("g")
                    .attr("transform", "translate(0, " + (i * 20) + ")");

                legendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", colors[i]);

                legendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .style("text-transform", "capitalize")
                    .text(legend_labels[i]);


            })

        });
    }

    // The x-accessor for the path generator; xScale ∘ xValue.
    function X(d) {
        return xScale(d[0]);
    }

    // The y-accessor for the path generator; yScale ∘ yValue.
    function Y0(d) {
        return yScale(d[1]);
    }

    function Y1(d) {
        return yScale(d[2]);
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y0 = function(_) {
        if (!arguments.length) return y0Value;
        y0Value = _;
        return chart;
    };

    chart.y1 = function(_) {
        if (!arguments.length) return y1Value;
        y1Value = _;
        return chart;
    };
    return chart;
}

const scatterPlot = () => {

    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 400,
        height = 400,
        innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom,
        xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; },
        xScale = d3.scaleBand().padding(0.1),
        yScale = d3.scaleLinear();

    function chart(selection) {
        selection.each(function(data) {

            data = data.map(d => {
                return [xValue(d), yValue(d)];
            });

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var svgEnter = svg.enter().append("svg");
            var gEnter = svgEnter.append("g");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            // Update the outer dimensions.
            svg.merge(svgEnter).attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            xScale.rangeRound([0, innerWidth])
                .domain(data.map(function(d) { return d[0]; }));
            yScale.rangeRound([innerHeight, 0])
                .domain([0, d3.max(data, function(d) { return d[1]; })]);

            g.select(".x.axis")
                .attr("transform", "translate(0," + innerHeight + ")")
                .call(d3.axisBottom(xScale));

            g.select(".y.axis")
                .call(d3.axisLeft(yScale).ticks(10, "%"))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Frequency");

            var points = g.selectAll(".point")
                .data(data);

            points.enter().append("circle")
                .attr("class", "point")
                .merge(points)
                .attr("cx", X)
                .attr("cy", Y)
                .attr("r", 5);

            points.exit().remove();
        });

    }

    // The x-accessor for the path generator; xScale ∘ xValue.
    function X(d) {
        return xScale(d[0]);
    }

    // The y-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    return chart;
}

const stackAreaChart = () => {

    let margin = { left: 80, right: 100, top: 50, bottom: 100 },
        height = 500,
        width = 800,
        innerHeight = height - margin.top - margin.bottom,
        innerWidth = width - margin.left - margin.right,
        xScale = d3.scaleTime(),
        yScale = d3.scaleLinear(),
        color = d3.scaleOrdinal(d3.schemeCategory10),
        //formatNumber = d3.format(".1f"),
        //formatBillion = function(x) { return formatNumber(x / 1e9); },

        xValue = "",
        yValue = [];

    function chart(selection) {
        selection.each(function(data) {

            let keys = d3.keys(data[0]);

            if (xValue === "") {

                xValue = keys[0];

                if (yValue.length > 0) {
                    alert("can not set up measure keys without an index key");
                    return chart;
                } else {

                    yValue = keys.slice(1);
                }
            } else {
                if (yValue.length == 0) {
                    yValue = keys.filter(d => d != xValue);

                } else if (yValue.includes(xValue)) {
                    alert("measure keys should not include index key");
                    return chart;
                }
            }

            //console.log("xValue", xValue, "yValue", yValue);


            // if svg already exists.
            const svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg");
            const gEnter = svgEnter.append("g");

            // Update the outer dimensions.
            svg.merge(svgEnter).attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            const g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //Scales
            color.domain(yValue);
            xScale.rangeRound([0, innerWidth])
                .domain(d3.extent(data, d => d[xValue]));

            const maxDateVal = d3.max(data, function(d) {
                let vals = d3.keys(d).map(function(key) { return key !== xValue ? d[key] : 0 });
                return d3.sum(vals);
            });

            //console.log("xrange", d3.extent(data, d => d[xValue]));
            yScale.range([innerHeight, 0])
                .domain([0, maxDateVal]);

            var area = d3.area()
                .x(function(d) { return xScale(d.data[xValue]); })
                .y0(function(d) { return yScale(d[0]); })
                .y1(function(d) { return yScale(d[1]); });

            //Axis generators
            var xAxisCall = d3.axisBottom()
            var yAxisCall = d3.axisLeft()
                .ticks(6);
            //.tickFormat(formatBillion);

            //Axis groups
            var xAxis = gEnter.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerHeight + ")");
            var yAxis = gEnter.append("g")
                .attr("class", "y axis")

            //Y-Axis label
            yAxis.append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .attr("fill", "#5D6971")
                //.text("Population)");

            xAxis.call(xAxisCall.scale(xScale));
            yAxis.call(yAxisCall.scale(yScale));

            var stack = d3.stack();
            stack.keys(yValue);

            stack.order(d3.stackOrderNone);
            stack.offset(d3.stackOffsetNone);

            const browser = g.selectAll('.browser')
                .data(stack(data))

            const browser_enter = browser
                .enter().append('g')
                .attr('class', "browser");

            browser.merge(browser_enter)
                .attr('fill-opacity', 0.5)
                .append("path")
                .attr('class', 'area')
                .attr("d", area)
                .style('fill', d => color(d.key));

            browser.exit().remove();

            const legend = g.append("g")
                .attr("transform", "translate(" + (innerWidth + 10) +
                    "," + 50 + ")");

            yValue.forEach(function(d, i) {
                let legendRow = legend.append("g")
                    .attr("transform", "translate(0, " + (i * 20) + ")");

                legendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", color(d));

                legendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .style("text-transform", "capitalize")
                    .text(d);


            })
        });

    }


    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };


    return chart;
}

const timeSeriesLineChart = () => {

    let margin = { left: 80, right: 100, top: 50, bottom: 100 },
        height = 500,
        width = 800,
        innerHeight = height - margin.top - margin.bottom,
        innerWidth = width - margin.left - margin.right,
        xScale = d3.scaleTime(),
        yScale = d3.scaleLinear(),

        xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; };

    function chart(selection) {
        selection.each(function(data) {

            data = data.map(d => {
                return [xValue(d), yValue(d)];
            });

            // if svg already exists.
            const svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg");
            const gEnter = svgEnter.append("g");

            // Update the outer dimensions.
            svg.merge(svgEnter).attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            const g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            let bisectDate = d3.bisector(function(d) { return d[0]; }).left;

            // Scales
            xScale.rangeRound([0, innerWidth])
                .domain(d3.extent(data, function(d) { return d[0]; }));

            yScale.rangeRound([innerHeight, 0])
                .domain([d3.min(data, function(d) { return d[1]; }) / 1.005,
                    d3.max(data, function(d) { return d[1]; }) * 1.005
                ]);

            // Axis generators
            var xAxisCall = d3.axisBottom()
            var yAxisCall = d3.axisLeft()
                .ticks(6)
                .tickFormat(function(d) { return parseInt(d / 1000) + "k"; });

            // Axis groups
            var xAxis = gEnter.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerHeight + ")");
            var yAxis = gEnter.append("g")
                .attr("class", "y axis")

            // Y-Axis label
            yAxis.append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .attr("fill", "#5D6971")
                .text("Population)");

            xAxis.call(xAxisCall.scale(xScale));
            yAxis.call(yAxisCall.scale(yScale));

            // Line path generator
            var line = d3.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[1]); });

            g.append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "grey")
                .attr("stroke-with", "3px")
                .attr("d", line(data));

            /******************************** Tooltip Code ********************************/

            var focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("line")
                .attr("class", "x-hover-line hover-line")
                .attr("y1", 0)
                .attr("y2", innerHeight);

            focus.append("line")
                .attr("class", "y-hover-line hover-line")
                .attr("x1", 0)
                .attr("x2", innerWidth);

            focus.append("circle")
                .attr("r", 7.5);

            focus.append("text")
                .attr("x", 15)
                .attr("dy", ".31em");

            g.append("rect")
                .attr("class", "overlay")
                .attr("width", innerWidth)
                .attr("height", innerHeight)
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);


            function mousemove() {
                var x0 = xScale.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + xScale(d[0]) + "," + yScale(d[1]) + ")");
                focus.select("text").text(d[1]);
                focus.select(".x-hover-line").attr("y2", innerHeight - yScale(d[1]));
                focus.select(".y-hover-line").attr("x2", -xScale(d[0]));


            }


            /******************************** Tooltip Code ********************************/


        })
    }

    // The x-accessor for the path generator; xScale ∘ xValue.
    function X(d) {
        return xScale(d[0]);
    }

    // The y-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    return chart;
}