import * as d3 from 'd3';
import d3Tip from 'd3-tip';


export const barChart = () => {

    let margin = { top: 40, right: 150, bottom: 60, left: 50 },
        width = 400,
        height = 450,
        x_label="",
        y_label="",
        title="",

        x_text_rotate=0,
        y_text_rotate=0,
        
        xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; },
        xScale = d3.scaleBand().padding(0.1),
        yScale = d3.scaleLinear();

    function chart(selection) {
        selection.each(function(data) {

            data = data.map(d => {
                return [xValue(d), yValue(d)];
            });

        let    innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;

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
                         
            
            //Update the inner dimensions.
            const g = svg.merge(svgEnter).select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            xScale.rangeRound([0, innerWidth])
                .domain(data.map(d => d[0]));
            yScale.rangeRound([innerHeight, 0])
                .domain([0, d3.max(data, d => d[1])]);

            g.select(".x.axis")
                .attr("transform", "translate(0," + innerHeight + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text").attr("transform",`rotate(${x_text_rotate})`)
                ;

            g.select(".y.axis")
                .call(d3.axisLeft(yScale).ticks(10, "%"))
                .selectAll("text").attr("transform",`rotate(${y_text_rotate})`)
                ;

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