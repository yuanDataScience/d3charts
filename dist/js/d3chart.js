
const areaChart = () => {

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
};


const barChart = () => {

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
};


const boxPlot = () => {

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
};

const donutChart = () => {

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
};



const dragForceChart = () => {

    let margin = { top: 70, right: 100, bottom: 10, left:50 },
        width = 400,
        height = 450,
        colorScale = d3.scaleOrdinal(d3.schemeCategory10),

        title="",

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

            keys = node_group_name ===""?[]:data[node_property].map(d => d[node_group_name]).filter((v,i,d)=> d.indexOf(v)===i);

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
                const svgEnter = svg.enter().append("svg")
                svgEnter.append("g"); 
                              
                // Update the outer dimensions. merged_svg contains all the slected svg plus g
                // because each time when enter() new svg, 'g' will be appended
                const merged_svg = svg.merge(svgEnter).attr("width", width)
                    .attr("height", height);

                // Update the inner dimensions.
                
                const g = merged_svg.select("g")
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

                g.append("text")
                .attr("transform", `translate(${innerWidth/2},-45)`)
                .style("font-size", "3rem")
                .attr("text-anchor","middle")
                .text(`${title}`)    
            
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

    chart.title = function(_){
        if (!arguments.length) return title;
        title = _;
        return chart;
    }

   

    return chart;
};


const lineChart = () => {

    var margin = { top: 60, right: 50, bottom: 60, left: 150 },
        height = 450,
        width = 400,
        
        xScale = d3.scaleBand(),
        yScale = d3.scaleLinear(),

        x_label="",
        y_label="",
        title="",
        x_text_rotate=0,
        y_text_rotate=0,

        xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; };

    function chart(selection) {
        selection.each(function(data) {

            data = data.map(d => {
                return [xValue(d), yValue(d)];
            });

            //console.log("line chart width", width);
            let innerHeight = height - margin.top - margin.bottom,
            innerWidth = width - margin.left - margin.right;

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

            
            xAxis.call(xAxisCall.scale(xScale)).selectAll("text").attr("transform",`rotate(${x_text_rotate})`);
            yAxis.call(yAxisCall.scale(yScale)).selectAll("text").attr("transform",`rotate(${y_text_rotate})`);

            // Line path generator
            var line = d3.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[1]); });

            g.append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "#ff7730")
                .attr("stroke-with", "1px")
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

            g.append("text")
                .attr("transform", `translate(${innerWidth/2},-20)`)
                .style("font-size", "3rem")
                .attr("text-anchor","middle")
                .text(`${title}`)    

            g.append("text")
                .attr("transform", `translate(-50, ${innerHeight/2}) rotate(-90)`)
                .attr("text-anchor", "middle")
                .text(`${y_label}`);

            g.append("text")
               .attr("transform", `translate(${innerWidth/2}, ${innerHeight+margin.top})`)    
               .style("text-anchor", "middle")
               .text(`${x_label}`);


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
};


const pieChart = () => {

    let margin = { top: 100, right: 100, bottom: 10, left:50 },
        height = 450,
        width = 400,
        color = d3.scaleOrdinal(d3.schemeCategory10),
        donut = false,
        title="",        

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
                .attr("transform", "translate(" + innerWidth / 2 + "," + (innerHeight *3/4) + ")");

            const arc = d3.arc()
                .innerRadius(0)
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
};

const scatterPlot = () => {

    var margin = { top: 50, right: 100, bottom: 100, left:50 },
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
                .call(d3.axisBottom(xScale))
                .selectAll("text").attr("transform",`rotate(${x_text_rotate})`)
                ;

            g.select(".y.axis")
                .call(d3.axisLeft(yScale).ticks(10, "%"))
                .selectAll("text").attr("transform",`rotate(${x_text_rotate})`);
            g.append("text")
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
};


const stackAreaChart = () => {

    let margin = { top: 40, right: 150, bottom: 60, left: 50 },
        height = 500,
        width = 800,

        x_label="",
        y_label="",
        title="",
        x_text_rotate=0,
        y_text_rotate=0,
        
        xScale = d3.scaleLinear(),
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

        let    innerHeight = height - margin.top - margin.bottom,
        innerWidth = width - margin.left - margin.right;

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
                .attr("transform", "translate(0," + innerHeight + ")")
               
                ;
            var yAxis = gEnter.append("g")
                .attr("class", "y axis")

            //Y-Axis label
            

            xAxis.call(xAxisCall.scale(xScale)).selectAll("text").attr("transform",`rotate(${x_text_rotate})`);
            yAxis.call(yAxisCall.scale(yScale)).selectAll("text").attr("transform",`rotate(${y_text_rotate})`);

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

