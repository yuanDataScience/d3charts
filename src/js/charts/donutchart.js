import * as d3 from 'd3';


export const donutChart = () => {

    let margin = { top: 100, right: 100, bottom: 10, left:50 },
        height = 500,
        width = 800,
        title="",  
        
        color = d3.scaleOrdinal(d3.schemeCategory10),
        donut = false,
        xValue = "",
        yValue = function(d) { return d[1]; };

    function chart(selection) {
        selection.each(function(data) {

            // if svg already exists.
            const svg = d3.select(this).selectAll("svg").data([data]);
            const keys = data.map(d => d[xValue]);

        let    innerHeight = height - margin.top - margin.bottom,
        innerWidth = width - margin.left - margin.right,
        radius = Math.min(innerWidth, innerHeight) / 2
        ;

            // Otherwise, create the skeletal chart.
            const svgEnter = svg.enter().append("svg")
            svgEnter.append("g");

            // Update the outer dimensions.
            svg.merge(svgEnter).attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            const g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight*3 / 4 + ")");

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

            g.append("text")
                .attr("transform", `translate(0,${-innerHeight/2-margin.top/2})`)
                .style("font-size", "3rem")
                .attr("text-anchor","middle")
                .text(`${title}`)    



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

    chart.title = function(_){
        if (!arguments.length) return title;
        title = _;
        return chart;
    };

    

    return chart;
}