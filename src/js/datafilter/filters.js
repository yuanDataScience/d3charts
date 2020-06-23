import crossfilter from 'crossfilter2';
import { Datatable, DataTable } from 'simple-datatables';

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