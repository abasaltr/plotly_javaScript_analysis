// intialize function to read from samples.json within D3 statement
function init(data) {
    console.log(data);
    var i;
    bioSamples = [];
    bioNames = [];
    bioDemos = [];
    bioFreqs = [];
    for (i = 0; i < data.samples.length; i++) {
        oneSample = [];
        var sample_id = data.samples[i].id;
        var otu_ids = data.samples[i].otu_ids;
        var otu_desc = []
        for (j = 0; j < otu_ids.length; j++) {
            var otu = "OTU " + otu_ids[j];
            otu_desc.push(otu);
        }
        var otu_labels = data.samples[i].otu_labels;
        var sample_values = data.samples[i].sample_values;
        oneSample.push(sample_id, otu_desc, otu_labels, sample_values, otu_ids);
        bioSamples.push(oneSample);
        bioNames.push(sample_id);
    }
    bioDemos.push(data.metadata);
    setOptions(bioNames);
    displayDemo([bioDemos[0][0]]);
    buildPlot(bioSamples[0]);
    buildBubble(bioSamples[0]);
    buildGauge([bioDemos[0][0]]);
}

// from html 
function changeSample(index) {
    buildPlot(bioSamples[index]);
    removeDemo();
    displayDemo([bioDemos[0][index]]);
    buildBubble(bioSamples[index]);
    buildGauge([bioDemos[0][index]]);
}

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

function removeDemo() {
    d3.select(".panel-body").selectAll("div").remove();
}

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

function buildPlot(bioSample) {
    //console.log(bioSample);
    var trace1 = {
        x: bioSample[3].slice(0, 10),
        y: bioSample[1].slice(0, 10),
        text: bioSample[2].slice(0, 10),
        type: "bar",
        orientation: 'h'
    };
    //console.log(trace1);
    var data = [trace1];
    var layout = {
        title: { text: "TOP 10 OTUs", font: { family: "Arial", size: 22, color: "337AB7" } },
        xaxis: { title: "Sample Values" },
        yaxis: { autorange: 'reversed' },
        plot_bgcolor: "azure",
        paper_bgcolor: "azure"
    };
    Plotly.newPlot("bar", data, layout);
}

function getRGB(otu_ids) {
    //console.log(otu_ids);
    var rgbOTU = [];
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
        rgbOTU.push(rgb);
    }
    return rgbOTU;
}

function buildBubble(bioSample) {
    //console.log(bioSample);
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
    var data = [trace2];
    var layout = {
        title: { text: "OTU Bubble Chart", font: { family: "Arial", size: 22, color: "337AB7" } },
        xaxis: { title: "OTU ID" },
        showlegend: false
    };
    var config = { responsive: true };
    Plotly.newPlot('bubble', data, layout, config);
}

function buildGauge(bioFreq) {
    //console.log(bioFreq[0].wfreq);
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
    var data = [trace3];
    var layout = {
        font: { family: "Arial", size: 22, color: "#337AB7" }, width: 450, height: 450, margin: { t: 0, b: 0 }, plot_bgcolor: "azure",
        paper_bgcolor: "azure"
    };
    Plotly.newPlot('gauge', data, layout);
}

// YOUR CODE HERE!
console.log('This is bioDiversity plotly js file - Reza Abasaltian');

// Fetch the JSON data and call function init
d3.json("./samples.json").then(data => init(data));