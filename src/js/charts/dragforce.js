import * as d3 from 'd3';
import d3Tip from 'd3-tip';


export const dragForceChart = () => {

    let margin = { top: 30, right: 100, bottom: 100, left: 40 },
        width = 400,
        height = 450,
        colorScale = d3.scaleOrdinal(d3.schemeCategory10),

        node_property ="",
        link_property = "",
        node_group = d => colorScale(d[0]),
        linkby = null,
        node_group_name ="",
        linkwidth = d => 1;           
        
            

    function chart(selection) {
        selection.each(function(data) {

            
            const innerWidth = width - margin.left - margin.right,
            innerHeight = height - margin.top - margin.bottom,

            keys = node_group_name ===""?data[node_property].map(d => d[0]).filter((v, i, d)=> d.indexOf(v)===i)
                                                      : data[node_property].map(d => d[node_group_name]).filter((v,i,d)=> d.indexOf(v)===i);

            //console.log(keys);
            

            let simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("collide", d3.forceCollide(10).strength(0.9));

            if (linkby!= null)
            simulation.force("link", d3.forceLink().id(linkby));
            
            
            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.5).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
            
                // Fix the position of the node that we are looking at
                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }
            
                // Let the node do what it wants again once we've looked at it
                function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }

            
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
                
                let link = g.append("g")
                            .attr("class", "links")
                            .selectAll("line") 
                            .data(data[link_property])
                            .enter()
                            .append("line")
                            .attr("stroke-width", linkwidth);
                            
                let node = g.append("g")
                            .attr("class", "nodes")
                            .selectAll("circle")
                            .data(data[node_property])
                            .enter()
                            .append("circle")
                            .attr("r",5)
                            .attr("fill", node_group)
                            .call(d3.drag()
                                .on("start", dragstarted)
                                .on("drag", dragged)
                                .on("end", dragended)
                                );
                                
                node.append("title")
                    .text(d => d.id);
                    
                simulation
                    .nodes(data.nodes)
                    .on("tick", ticked)
                    
                simulation.force("link")
                        .links(data.links)
                        
                function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
                }
                
                const legend = g.append("g")
                .attr("transform", "translate(" + (innerWidth  + 20) +
                    "," + (innerHeight/2) + ")");

                keys.forEach(function(d, i) {
                let legendRow = legend.append("g")
                    .attr("transform", "translate(0, " + (i * 20) + ")");

                legendRow.append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", colorScale(d));

                legendRow.append("text")
                    .attr("x", 20)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .style("text-transform", "capitalize")
                    .text(d);
                });
            
        });

    }

    
    chart.node_property = function(_){
        if (!arguments.length) return node_property;
        node_property = _;
        return chart;
    };

    chart.link_property = function(_){
        if (!arguments.length) return link_property;
        link_property = _;
        return chart;
    };

    chart.linkby = function(_){
        if (!arguments.length) return linkby;
        linkby = _;
        return chart;
    };

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.node_group = function(_){
        if (!arguments.length) return node_group;
        node_group = d => colorScale(d[_]);
        node_group_name = _;
        return chart;
    };

    chart.linkwidth = function(_){
        if (!arguments.length) return linkwidth;
        linkwidth = _;
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