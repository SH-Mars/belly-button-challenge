// json file path
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// select the dropdown from index.html
const dropDown = d3.select("#selDataset");
let options;

// get data from json file
d3.json(url).then((data) => {
    console.log(data);

    // call the function to display the dashboard
    dashBoard(data);
})

// function to display the dashboard
const dashBoard = (data) => {
    
    // get the id from key called names
    let id = Object.values(data.names);
    console.log(id);

    // get the metadata
    let metadata = Object.values(data.metadata);
    console.log(metadata);

    // get the samples data
    let samples = Object.values(data.samples);
    console.log(samples);

    // call the function to make id array into the options of the dropdown
    dropDownOptions(id);

    // define user pick from the dropdown
    let userPick = dropDown.property("value");
    // filter the sample to get the one from user pick
    sample = samples.filter(sample => sample.id == userPick);
    console.log(`User Pick: ${sample}`);

    // call the function for horizontal barchart and bubble chart
    ploting(sample);

    // call the function for displaying demographic info 
    demoInfo(metadata, userPick);

    // update based on the dropdown selection
    // when a new option is selected, update the dashboard
    dropDown.on("change", function() {
        let newPick = dropDown.property("value");
        newPick = optionChanged(newPick);
        console.log(`Now ID# ${newPick} is selected`);

        demoInfo(metadata, newPick);

        newSample = samples.filter(sample => sample.id == newPick);
        ploting(newSample);
    });
};

// function to make id array into the options of the dropdown
const dropDownOptions = (id) => {
    
    for (let i = 0; i < id.length; i++) {
        options = dropDown.append('option');
        options.attr('value', id[i]).text(id[i]);
    }
};

function optionChanged(newPick) {
    return newPick;
};

// horizontal barchart and bubble chart
function ploting(sample) {

    // sample is already filtered, select the first element
    pickedSample = sample[0];
    
    let otuIds = Object.values(pickedSample.otu_ids);
    let sampleValues =  Object.values(pickedSample.sample_values);
    let otuLabels =  Object.values(pickedSample.otu_labels);

    // select the top 10 otu ids
    let top10Ids = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();
    let top10Samples = sampleValues.slice(0, 10).reverse();
    let top10Labels = otuLabels.slice(0, 10).reverse();

    // create the trace for the bar chart
    trace1 = {
        x: top10Samples,
        y:top10Ids,
        text: top10Labels,
        type: 'bar',
        orientation: 'h',
    };

    dataBar = [trace1];
    layoutBar = {
        title: `Top 10 OTUs of ID# ${pickedSample.id}`,
        xaxis: {title: "Sample Values"},
        yaxis: {title: "OTU IDs"}
    };
    Plotly.newPlot('bar', dataBar, layoutBar);

    // create the trace for the bubble chart
    trace2 = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        type: 'bubble',
        mode: 'markers',
        marker: {
            color: otuIds,
            size: sampleValues
        }
    };

    bubbleData = [trace2];
    layoutBubble = {
        title: `OTU ID Distribution of ID# ${pickedSample.id}`,
        xaxis: {title: "OTU IDs"},
        yaxis: {title: "Sample Values"}
    };
    Plotly.newPlot('bubble', bubbleData, layoutBubble);
};

// function to display demographic info
function demoInfo(metadata, userPick) {
    
    allMeta = parseInt(metadata.length);

    newMeta = metadata.filter(item => item.id == userPick)[0];

    meta = d3.select("#sample-metadata").text("");
    d3.entries(newMeta).forEach(item => {
        key = item.key;
        value = item.value;
        meta.append("span").text(`${key}: ${value}`)
        meta.append("br");
    });
};
