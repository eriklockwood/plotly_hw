function getMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      //filter for selected json object
      var filterArr = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = filterArr[0];
      //get a handle on metadata panel
      var panel = d3.select("#sample-metadata");
      // clear panel before population
      panel.html("");
      //add panel content
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    });
  }


//make selected sample bar and bubble chart
function makeSelectCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var filterArr = samples.filter(sampleObj => sampleObj.id == sample);
    var select = filterArr[0];

    var ids = select.otu_ids;
    var labels = select.otu_labels;
    var values = select.sample_values;


    //bar
    var yticks = ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var selectData = [
      {
        y: yticks,
        x: values.slice(0, 10).reverse(),
        text: labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria - Selected Subjects",
    };

    Plotly.newPlot("bar1", selectData, barLayout);


    //bubble
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
    };
    var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          size: values,
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}


//make aggrigate-sum bar chart for top 10 of all samples
function makeSummaryBar() {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;

//I cant get this to work...

    //var aggObj = samples.forEach(sampleObj => {
      // Object.entries(sampleObj).forEach( ([otu_ids, otu_labels, sample_values]) => {
        //append all otu_ids, otu_labels, & sample_values to coresponding lists in aggObj

      // })
    // });

    var ids = samples.otu_ids;
    var labels = samples.otu_labels;
    var values = samples.sample_values;
    var yticks = ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    var aggData = [{
        y: yticks,
        x: values.slice(0, 10).reverse(),
        transforms: [{
          type: "aggregate",
          groups: ids,
          aggregations: [
            {target: "x", func: "sum", enabled: true},
          ]
        }],
        text: labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }];

    var barLayout = {
      title: "Top 10 Bacteria - All Subjects",
    };

    Plotly.newPlot("bar2", aggData, barLayout);
  });
}


//define initialziation
function init() {
  //dropdown optinons
  var select = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(sampleNames)

    sampleNames.forEach((sample) => {
      select
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    //use first sample in data durring initialization
    var initSample = sampleNames[0];
    makeSelectCharts(initSample);
    makeSummaryBar();
    getMetadata(initSample);
  });
}


function optionChanged(selectSample) {
  //get sample data and refresh charts on new sample selection
  getMetadata(selectSample);
  makeSelectCharts(selectSample);
}


init();
