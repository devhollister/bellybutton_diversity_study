function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples
    //console.log(samplesArray)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFilter = samplesArray.filter(sampleObj => sampleObj.id == sample)
    //console.log(sampleFilter)
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleFilter[0];
    //console.log(firstSample);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    //console.log(otu_ids);
    var otu_labels = firstSample.otu_labels;
    //console.log(otu_labels)
    var sample_values = firstSample.sample_values.sort((a,b)=>b-a).slice(0,10);
    var bubble_sample = firstSample.sample_values;
    //console.log(sample_values)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.sort(function(a,b){
      return parseFloat(b.sample_values)-parseFloat(a.sample_values)}).slice(0,10);
    //console.log(yticks)
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values.reverse(),
      y: yticks,
      text: otu_labels.sort(function (a, b) { return parseFloat(b.sample_values) - parseFloat(a.sample_values) }),
      type: "bar",
      orientation: 'h'
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var layout = {
      //paper_bgcolor: 'rgba(0, 0, 0, 0)',
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        type: 'category'}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, layout)

    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: otu_ids,
      y: bubble_sample,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: bubble_sample,
        color: otu_ids,
        colorscale: 'Portland',
        opacity: 0.70
      }

    };

    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      autosize: true,
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      margin: {
        l:50,
        r:50,
        b:100,
        t:100,
        pad:4
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    // 4. Create the trace for the gauge chart.
    var metadataArray = data.metadata;
    var metadataFilter = metadataArray.filter(sampleObj => sampleObj.id == sample);
    var firstMetadata = metadataFilter[0];
    var wfreq = parseFloat(firstMetadata.wfreq);
    console.log(wfreq);


    var gaugeTrace = {
      value: wfreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {text: 'Belly Button Washing Frequency <br> Scrubs per Week'},
      gauge: {
        bar: {
          color:'black'},
        axis: { range: [null, 10]},
        steps: [
          {range: [0,2], color:'red'},
          { range: [2, 4], color: 'orange' },
          { range: [4, 6], color: 'yellow' },
          { range: [6, 8], color: 'yellowgreen' },
          { range: [8, 10], color: 'green' }
        ]
      }
    };
    
    
    
    var gaugeData = [gaugeTrace];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      width: 600,
      heght: 500,
      margin: {
        t: 0,
        b: 0
      }

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}

    