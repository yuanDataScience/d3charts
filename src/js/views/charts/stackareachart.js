import * as d3 from 'd3';


export const stackAreaChart = () => {

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