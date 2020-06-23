import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import crossfilter from 'crossfilter2';
import { Datatable, DataTable } from 'simple-datatables';
//import axios from 'axios';


const cf = {};
cf.dimensions = new Map();

// extract the properties of input json obj array 
// and convert the resulting json array to json string
// for simple data table
const dataTableProcess = (data) => {
    const rs = data.map(d => {
        const element = {
            "id": d.id,
            "property_1": d.property1
        }
    })

    return JSON.stringify(rs);

}

const renderDataTable = (data) => {
    const rs = dataTableProcess(data);
    document.getElementById("demoTableSection").innerHTML("");

    let markup = `<table id ="demoTable1">`;
    document.getElementById("demoTableSection").insertAdjacentElement('beforeend', markup);
    let dataTable = new DataTable("demoTable1");

    dataTable.import({
        type: "json",
        data: rs
    })
}

export const renderInit = async query_id => {
    const data = await getDataAPI(query_id);
    cf.data = crossfilter(data);
    cf.dimensions.set('dimension1', cf.data.dimension(d => d.dimension1));
    cf.filteredData = cf.data.allFiltered();

    //cf.propertyRange = d3.extent(cf.dimensions.get('dimension').group().all().map(d=>d.key));

    // renderD3(cf.fitleredData);
    renderDataTable(data);
}

export const barChart = () => {

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
            console.log("in chart ", [data]);
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
                .domain(data.map(xValue));
            yScale.rangeRound([innerHeight, 0])
                .domain([0, d3.max(data, yValue)]);

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
                .data(function(d) { return d; });

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
        return xScale(xValue(d));
    }

    // The y-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
        return yScale(yValue(d));
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