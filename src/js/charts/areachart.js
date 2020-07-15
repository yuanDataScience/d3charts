import * as d3 from 'd3';


export const areaChart = () => {

    let margin = { top: 40, right: 150, bottom: 60, left: 50 },
        height = 450,
        width = 400,
        
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),

        x_label="",
        y_label="",
        title="",
        x_text_rotate=0,
        y_text_rotate=0,

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

            let innerHeight = height - margin.top - margin.bottom,
            innerWidth = width - margin.left - margin.right;
            
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

            xAxis.call(xAxisCall.scale(xScale)).selectAll("text").attr("transform",`rotate(${x_text_rotate})`);
            yAxis.call(yAxisCall.scale(yScale)).selectAll("text").attr("transform",`rotate(${y_text_rotate})`);

            g.append("text")
                .attr("transform", `translate(${innerWidth/2},-10)`)
                .style("font-size", "3rem")
                .attr("text-anchor","middle")
                .text(`${title}`)    

            g.append("text")
                .attr("transform", `translate(-35, ${innerHeight/2}) rotate(-90)`)
                .attr("text-anchor", "middle")
                .text(`${y_label}`);

            g.append("text")
               .attr("transform", `translate(${innerWidth/2}, ${innerHeight+margin.top+20})`)    
               .style("text-anchor", "middle")
               .text(`${x_label}`);

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

    chart.x_lab = function(_) {
        if (!arguments.length) return x_label;
        x_label = _;
        return chart;
    }

    chart.y_lab = function(_) {
        if (!arguments.length) return y_label;
        y_label = _;
        return chart;
    }

    chart.title = function(_){
        if (!arguments.length) return title;
        title = _;
        return chart;
    }

    chart.xScale = function(_){
        if (!arguments.length) return xScale;
        xScale = _;
        return chart;

    }

    chart.yScale = function(_){
        if (!arguments.length) return yScale;
        yScale =_;
        return chart;
    }

    chart.xTextRotate = function(_){
        if(!arguments.length) return x_text_rotate;
        x_text_rotate =_;
        return chart;
    }

    chart.yTextRotate = function(_){
        if(!arguments.length) return y_text_rotate;
        y_text_rotate =_;
        return chart;
    }

       
    return chart;
}