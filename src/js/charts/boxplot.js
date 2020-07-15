import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { ascending } from 'd3';


export const boxPlot = () => {

    let margin = { top: 40, right: 150, bottom: 60, left: 50 },
        width = 400,
        height = 450,

        x_label="",
        y_label="",
        title="",
        y_text_rotate=0,
        x_text_rotate=0,
        
        xValue = "",
        yValue = "",
        hue ="",
        xScale = d3.scaleBand().padding([0.5]),
        yScale = d3.scaleLinear(),
        colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const boxQuartiles = d =>{
            return [d3.quantile(d, .25), d3.quantile(d, .5), d3.quantile(d, .75)];
        }

        
        const groupBoxData = (data, key_name, value_name, color_column) => {
            // return the result as a dictionary
            const rs = {};
            
            //the data part of the returned results
            let rs_data = [];

            //establish global array that combines all the data on value column
            let globle_array = [];
            data.sort((x,y)=>d3.ascending(x[value_name],y[value_name]));

            //group by the input data using d3.nest
            let data_array;
            if (color_column ===""){
                data_array = d3.nest()
                               .key(d => d[key_name])
                               .entries(data);
                //console.log(data_array);  
                
                for (const d of data_array){
                    const item ={};
                    item.key = d.key;
                    item.el_number =1;
                    item.color_column = d.key;
                    item.values = d.values.map(d => d[value_name]);
                    item.index =0;
                    item.whiskers = d3.extent(item.values);
                    item.quantiles= boxQuartiles(item.values);
                    globle_array = globle_array.concat(item.values);
                   
                    rs_data.push(item);

                    
                }
            }
            else{
                data_array = d3.nest()
                                .key(d => d[key_name])
                                .key(d => d[color_column])
                                .entries(data);
                        

                for (const d of data_array){
                    const category_key = d.key;
                    const element_number = d.values.length;
                    let index = 0;

                    for (const v of d.values){
                        const item = {};
                        item.key = category_key;
                        item.el_number = element_number;
                        item.color_column = v.key;
                        item.values = v.values.map(d => d[value_name]);
                        item.index = index;
                        item.whiskers = d3.extent(item.values);
                        item.quantiles= boxQuartiles(item.values);
                        globle_array = globle_array.concat(item.values);
                        index +=1;
                        rs_data.push(item);
                    }
                }
            }
            
            rs_data.sort((x,y) => d3.descending(x.quantiles[1],y.quantiles[1]));

            const unique_colors = rs_data.map(d => d.color_column).filter((v, i, d)=> d.indexOf(v)===i);

            rs.data = rs_data;
            rs.y_range = d3.extent(globle_array);
            rs.unique_colors = unique_colors;
            return rs;
            
        }
        

    function chart(selection) {
        selection.each(function(input_data) {

            // data = data.map(d => {
            //     return [xValue(d), yValue(d)];
            // });

            const grouped_data = groupBoxData(input_data,xValue, yValue, hue);
            const data = grouped_data.data;
            const yvalue_range = grouped_data.y_range;
            const keys = grouped_data.unique_colors;

            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

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
                .domain(data.map(d => d.key));
            yScale.rangeRound([innerHeight, 0])
                .domain([yvalue_range[0]-5, yvalue_range[1]+5]);

            g.select(".x.axis")
                .attr("transform", "translate(0," + innerHeight + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("transform", `rotate(${x_text_rotate})`)
                ;

            g.select(".y.axis")
                .call(d3.axisLeft(yScale))
                .selectAll("text")
                .attr("transform", `rotate(${y_text_rotate})`)
                ;

            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Frequency");

            //add vertical lines
            const vertical_lines = g.selectAll(".vertical_line")
            .data(data);
            
            vertical_lines.enter().append("line")
                .attr("class", "vertical_line")
                .merge(vertical_lines)
                .attr("x1", d => {
                    if (d.el_number >1){
                        return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)
                    }
                    else {
                        return xScale(d.key)+xScale.bandwidth()/2;
                    }
                }) 
                .attr("y1", d => yScale(d.whiskers[0]))
                .attr("x2", d => {
                    if (d.el_number >1){
                        return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)
                    }
                    else {
                        return xScale(d.key)+xScale.bandwidth()/2;
                    }
                }) 
                .attr("y2", d => yScale(d.whiskers[1]))
                .attr("stroke","#000")
                .attr("stroke-width", 1)
                .attr("fill", "none")
                ;

            vertical_lines.exit().remove();

            const box_bar = g.selectAll(".box_bar")
                              .data(data);

            box_bar.enter()
                   .append("rect")
                   .attr("class", "box_bar")
                   .merge(box_bar)
                   .attr("x",d => {
                    if (d.el_number >1){
                        return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)-xScale.bandwidth()/(2*(d.el_number));
                    }
                    else {
                        return xScale(d.key);
                    }
                })
                .attr("y", d=>yScale(d.quantiles[2]))
                .attr("width", d=> xScale.bandwidth()/d.el_number)
                .attr("height", d => yScale(d.quantiles[0])-yScale(d.quantiles[2]))
                .attr("fill", d=>colorScale(d.color_column))
                .attr("stroke","#000")
                .attr("stroke-width", 1);
                
            box_bar.exit().remove();

            const h_lines = g.selectAll(".h_line")
            .data(data);

            h_lines.enter()
                   .append("line")
                   .attr("class", ".h_line")
                   .merge(h_lines)
                   .attr("x1", d => {
                    if (d.el_number >1){
                        return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)-xScale.bandwidth()/(2*(d.el_number));
                    }
                    else {
                        return xScale(d.key);
                    }
                })
                .attr("y1", d=> yScale(d.quantiles[1]))
                .attr("x2", d=>{
                    if (d.el_number >1){
                        return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)+xScale.bandwidth()/(2*(d.el_number));
                    }
                    else {
                        return xScale(d.key)+xScale.bandwidth()/(2*(d.el_number));
                    }

                })
                .attr("y2", d=>yScale(d.quantiles[1]))
                .attr("stroke","#000")
                .attr("stroke-width", 2);

                h_lines.exit().remove();

                const top_lines = g.selectAll(".top_line")
                                   .data(data);

                top_lines.enter()
                   .append("line")
                   .attr("class", ".top_line")
                   .merge(top_lines)
                   .attr("x1", d => {
                    if (d.el_number >1){
                        return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)-xScale.bandwidth()/(2*(d.el_number));
                    }
                    else {
                        return xScale(d.key);
                    }
                })
                .attr("y1", d=> yScale(d.whiskers[1]))
                .attr("x2", d=>{
                    if (d.el_number >1){
                        return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)+xScale.bandwidth()/(2*(d.el_number));
                    }
                    else {
                        return xScale(d.key)+xScale.bandwidth()/(2*(d.el_number));
                    }

                })
                .attr("y2", d=>yScale(d.whiskers[1]))
                .attr("stroke","#000")
                .attr("stroke-width", 1);

                top_lines.exit().remove();


        const bottom_lines = g.selectAll(".bottom_line")
        .data(data);

        bottom_lines.enter()
        .append("line")
        .attr("class", ".bottom_line")
        .merge(bottom_lines)
        .attr("x1", d => {
        if (d.el_number >1){
            return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)-xScale.bandwidth()/(2*(d.el_number));
        }
        else {
            return xScale(d.key);
        }
        })
        .attr("y1", d=> yScale(d.whiskers[0]))
        .attr("x2", d=>{
        if (d.el_number >1){
            return xScale(d.key)+xScale.bandwidth()*d.index/(d.el_number-1)+xScale.bandwidth()/(2*(d.el_number));
        }
        else {
            return xScale(d.key)+xScale.bandwidth()/(2*(d.el_number));
        }

        })
        .attr("y2", d=>yScale(d.whiskers[0]))
        .attr("stroke","#000")
        .attr("stroke-width", 1);

        bottom_lines.exit().remove(); 
        
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
               .attr("class","title_text")    
               .style("text-anchor", "middle")
               .text(`${x_label}`);

               const legend = g.append("g")
               .attr("transform", "translate(" + (innerWidth + 20) +
                   "," + (innerHeight / 2 + 30) + ")");

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

    // The x-accessor for the path generator; xScale ∘ xValue.
    function X(d) {
        return xScale(d.key);
    }

    // The y-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
        return yScale(d.quantiles[1]);
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

    chart.hue = function(_) {
        if (!arguments.length) return yValue;
        hue = _;
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