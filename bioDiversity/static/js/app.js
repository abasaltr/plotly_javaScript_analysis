// intialize function to read from samples.json within D3 .then statement
// call the functions to create visualizations on sample demographics panel, top 10 OTU bar plot, 
// washing frequency gauge, and an OTU bubble chart by user selected subject id number from html   
function init(data) {
    // output read object data to console
    console.log(data);
    var i;
    // initialize 'bio' arrays for each specific data attribute assignment used per visualization
    bioSamples = [];
    bioNames = [];
    bioDemos = [];
    bioFreqs = [];
    // loop through each sample of the object dataset read and assign to the specific array listings
    for (i = 0; i < data.samples.length; i++) {
        // initialize a single sample array for each iteration of the dataset
        oneSample = [];
        // assign sample id to the id attribute of the object samples array
        var sample_id = data.samples[i].id;
        // assign otu ids to the otu_ids attributes of the object samples array 
        var otu_ids = data.samples[i].otu_ids;
        // initialize otu description array used for storing the concatenated "OTU" text to the otu ids
        var otu_desc = []
        // loop through each otu id to append the concatenated text to the otu description array
        for (j = 0; j < otu_ids.length; j++) {
            var otu = "OTU " + otu_ids[j];
            otu_desc.push(otu);
        }
        // assign otu labels to the otu_labels attributes of the object samples array
        var otu_labels = data.samples[i].otu_labels;
        // assign sample values to the sample_values attributes of the object samples array
        var sample_values = data.samples[i].sample_values;
        // append all assigned attributes above to the single sample array list
        oneSample.push(sample_id, otu_desc, otu_labels, sample_values, otu_ids);
        // append the single sample array list to the 'bio' samples array
        bioSamples.push(oneSample);
        // append sample id array list to the 'bio' names array used in populating dropdown options
        bioNames.push(sample_id);
    }
    // append object metadata array list to the 'bio' demos array
    bioDemos.push(data.metadata);
    
    // call function to create option values for selecting a subject id number on html dropdown menu
    // passing in parameter 'bio' names array
    setOptions(bioNames);
    // call function to create the sample demographics panel passing in parameter 'bio' demos array
    displayDemo([bioDemos[0][0]]);
    // call function to create the top 10 OTU bar plot passing in parameter 'bio' samples array  
    buildPlot(bioSamples[0]);
    // call function to create the bubble chart passing in parameter 'bio' samples array
    buildBubble(bioSamples[0]);
    // call function to create washing frequency gauge passing in parameter 'bio' demos array
    buildGauge([bioDemos[0][0]]);
}

// from html called after user selects a subject id number and thus a change in sample id
// subsequently all visualizations will be updated to reflect this change by calling the appropriate functions
// passing parameter the index value of the sample id
function changeSample(index) {
    buildPlot(bioSamples[index]);
    // overwrite the demographics panel by first calling function to remove the html contents of the current panel 
    removeDemo();
    displayDemo([bioDemos[0][index]]);
    buildBubble(bioSamples[index]);
    buildGauge([bioDemos[0][index]]);
}

// function to populate html dropdown menu options with the sample id using d3.select
// passing in parameter 'bio' names array list from init() function
// option value assigned to the index position of the sample id being displayed
function setOptions(bioNames) {
    //console.log(bioNames);
    d3.select("select")
        .selectAll("option")
        .data(bioNames)
        .enter()
        .append("option")
        .text(function (d) { return d; })
        .attr("value", function (d, i) { return i; });
}

// function to overwrite the demographics panel by removing the html contents of the current panel using d3.select
// called from changeSample() function
function removeDemo() {
    d3.select(".panel-body").selectAll("div").remove();
}

// function to display the demographics panel using d3.select
// passing in parameter 'bio' demos array list from init() or changeSample() function
function displayDemo(bioDemo) {
    //console.log(bioDemo);
    d3.select(".panel-body")
        .selectAll("div")
        .data(bioDemo)
        .enter()
        .append("div")
        .classed("panel-demo", true)
        .style("font-weight", function (d) { return "bold" })
        .html(function (d) {
            return `<h6>id: ${d.id}</h6>
                <h6>ethnicity: ${d.ethnicity}</h6>
                <h6>gender: ${d.gender}</h6>
                <h6>age: ${d.age}</h6>
                <h6>location: ${d.location}</h6>
                <h6>bbtype: ${d.bbtype}</h6>
                <h6>wfreq: ${d.wfreq}</h6>`
        });
}

// function to create the bar plot for the top 10 OTU
// passing in parameter 'bio' samples array list from init() or changeSample() function 
function buildPlot(bioSample) {
    //console.log(bioSample);
    // define trace to the appropriate dataset at the specific index position in the array list
    // since dataset is sorted in descending order by sample value the top OTU is 
    // the first 10 values in the array list by using array .slice() method
    var trace1 = {
        x: bioSample[3].slice(0, 10),
        y: bioSample[1].slice(0, 10),
        text: bioSample[2].slice(0, 10),
        type: "bar",
        orientation: 'h'
    };
    //console.log(trace1);
    // assign data to the trace name
    var data = [trace1];
    // define layout to the attributes required for the plot settings (title, axis, background color)
    var layout = {
        title: { text: "TOP 10 OTUs", font: { family: "Arial", size: 22, color: "337AB7" } },
        xaxis: { title: "Sample Values" },
        yaxis: { autorange: 'reversed' },
        plot_bgcolor: "azure",
        paper_bgcolor: "azure"
    };
    // create the plot using Plotly JavaScript Open Source Graphing Library
    Plotly.newPlot("bar", data, layout);
}

// function to define RGB numerical color values used for each bubble depending on the OTU ID range
// passing in parameter otu ids that is within the 'bio' samples array list called from buildBubble() function
// returns an array list of corresponding RGB numberical color values in text string format 
function getRGB(otu_ids) {
    //console.log(otu_ids);
    // initialize rgb array list
    var rgbOTU = [];
    // loop through the otu ids at each index iteration to define its RGB by concatenating 
    // numerical text string specific to the color per conditional statement on each otu ids
    // condition depends on the range the OTU IDs are within
    for (i = 0; i < otu_ids.length; i++) {
        var rgb = "rgb";
        //console.log(otu_ids[i]);
        if (otu_ids[i] < 250) { rgb = rgb + '(255,153,153)'; }
        else if (otu_ids[i] < 500) { rgb = rgb + '(255,204,153)'; }
        else if (otu_ids[i] < 750) { rgb = rgb + '(255,255,153)'; }
        else if (otu_ids[i] < 1000) { rgb = rgb + '(204,255,153)'; }
        else if (otu_ids[i] < 1250) { rgb = rgb + '(153,255,153)'; }
        else if (otu_ids[i] < 1500) { rgb = rgb + '(153,255,204)'; }
        else if (otu_ids[i] < 1750) { rgb = rgb + '(153,255,255)'; }
        else if (otu_ids[i] < 2000) { rgb = rgb + '(153,204,255)'; }
        else if (otu_ids[i] < 2250) { rgb = rgb + '(153,153,255)'; }
        else if (otu_ids[i] < 2500) { rgb = rgb + '(204,153,255)'; }
        else if (otu_ids[i] < 2750) { rgb = rgb + '(255,153,255)'; }
        else if (otu_ids[i] < 3000) { rgb = rgb + '(255,153,204)'; }
        else { rgb = rgb + '(255,102,102)' }
        // append rgb text string to the rgb array list per otu id iteration
        rgbOTU.push(rgb);
    }
    // return the rgb array list upon completion of iterating through the loop
    return rgbOTU;
}

// function to create a bubble chart based on OTU IDs versus sample values
// passing in parameter 'bio' samples array list from init() or changeSample() function  
// otu labels will be the text value upon user hovering over each bubble
// each bubble will be colored according to the sequential range of OTU IDs by calling getRGB() function
function buildBubble(bioSample) {
    //console.log(bioSample);
    // define trace to the appropriate dataset at the specific index position in the array list
    // set marker size to the sample values and color to RGB value for the OTU ID range
    var trace2 = {
        x: bioSample[4],
        y: bioSample[3],
        text: bioSample[2],
        mode: 'markers',
        marker: {
            size: bioSample[3],
            color: getRGB(bioSample[4])
        }
    }
    // assign data to the trace name
    var data = [trace2];
    // define layout to the attributes required for the plot settings (title, axis, legend)
    var layout = {
        title: { text: "OTU Bubble Chart", font: { family: "Arial", size: 22, color: "337AB7" } },
        xaxis: { title: "OTU ID" },
        showlegend: false
    };
    // set the Plotly responsive attribute equal to true (using the config object), 
    // bubble chart will be automatically resized when the browser window size changes
    // **note that for the responsive attribute to take effect, layout width and height cannot be defined
    var config = { responsive: true };
    // create the plot using Plotly JavaScript Open Source Graphing Library
    Plotly.newPlot('bubble', data, layout, config);
}

// function to create a guage chart depicting the washing frequency from subject demographic
// passing in parameter 'bio' demos array list from init() or changeSample() function 
function buildGauge(bioFreq) {
    //console.log(bioFreq[0].wfreq);
    // define trace to the appropriate dataset at the specific index position in the array list
    // the gauge is defined for frequency values ranging from 0 through 9 and displays varying colors filled for each range
    // a delta indicator is used display the actual frequency next to an increasing icon 
    var trace3 = {
        domain: { x: [0, 9], y: [0, 1] },
        value: bioFreq[0].wfreq,
        title: { text: "Belly Button Washing Frequency <br>scrubs per week", font: { family: "Arial", size: 22, color: "#337AB7" } },
        type: "indicator",
        mode: "gauge+delta",
        delta: { reference: 0, increasing: { color: "darkblue" }, font: { size: 30 } },
        gauge: {
            axis: { range: [null, 9], tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            steps: [
                { range: [0, 1], color: "#ADD8E6" },
                { range: [1, 2], color: "#B0E0E6" },
                { range: [2, 3], color: "#87CEEB" },
                { range: [3, 4], color: "#87CEFA" },
                { range: [4, 5], color: "#00BFFF" },
                { range: [5, 6], color: "#6495ED" },
                { range: [6, 7], color: "#1E90FF" },
                { range: [7, 8], color: "#4169E1" },
                { range: [8, 9], color: "#0000FF" },
            ]
        }
    }
    // assign data to the trace name
    var data = [trace3];
    // define layout to the attributes required for the plot settings (font, height, width, background color)
    var layout = {
        font: { family: "Arial", size: 22, color: "#337AB7" }, width: 450, height: 450, margin: { t: 0, b: 0 }, plot_bgcolor: "azure",
        paper_bgcolor: "azure"
    };
    // create the plot using Plotly JavaScript Open Source Graphing Library
    Plotly.newPlot('gauge', data, layout);
}

// YOUR CODE HERE!
console.log('This is bioDiversity plotly js file - Reza Abasaltian');

// Fetch the JSON data and call function init
d3.json("./samples.json").then(data => init(data));