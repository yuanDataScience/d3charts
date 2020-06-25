import * as d3 from 'd3';


export const timeSeriesLineChart = () => {

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