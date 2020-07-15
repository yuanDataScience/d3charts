// import * as d3chart from './d3chart';
// import * as d3 from 'd3';






const state ={};

init();

function init(){
    state.active_bar = "barchart";
    state.active_pie = "piechart";
    state.active_line = "timeserieschart";
    
}

document.getElementById("bar_button").addEventListener('click', event =>{
    const barcharts = ["barchart","scatterplot","boxplot"];
    const index = (barcharts.indexOf(state.active_bar)+1)%barcharts.length;
    document.getElementById(state.active_bar).classList.toggle("active");
    state.active_bar = barcharts[index];
    document.getElementById(state.active_bar).classList.toggle("active");

});

document.getElementById("pie_button").addEventListener('click', event =>{
    const piecharts = ["piechart","stackareachart","donutchart"];
    const index = (piecharts.indexOf(state.active_pie)+1)%piecharts.length;
    document.getElementById(state.active_pie).classList.toggle("active");
    state.active_pie = piecharts[index];
    document.getElementById(state.active_pie).classList.toggle("active");

});

document.getElementById("line_button").addEventListener('click', event =>{
    const linecharts = ["timeserieschart","areachart","dragforce"];
    const index = (linecharts.indexOf(state.active_line)+1)%linecharts.length;
    document.getElementById(state.active_line).classList.toggle("active");
    state.active_line = linecharts[index];
    document.getElementById(state.active_line).classList.toggle("active");

});


