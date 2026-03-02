
var chart    = document.getElementById('timechart').getContext('2d'),
    gradient = chart.createLinearGradient(0, 0, 0, 200);

gradient.addColorStop(0, 'rgba(0, 56, 186, 0.5)');
gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

 



var data  = {
    labels: [ '1', '2', '3', '4', '5', '6','7', '8', '9' ], 
    datasets: [{
			label: '',
			backgroundColor: gradient,
			pointBackgroundColor: '#fff',
			borderWidth: 2, 
			borderColor: '#0038ba',
			data: [100, 400, 600, 300, 500, 100, 200, 400, 50 ]
    }]
};


 


var options = {
	  layout: {
    padding: {
      top: 35, left:10, right:10, bottom:10,
    }
  },
	responsive: true,
	maintainAspectRatio: false,
	animation: {
		easing: 'easeInOutQuad',
		duration: 10
	},

	
 
  scales: {
    yAxes: [{
 display: false,
      gridLines: {
        display: false,
 
      }
    }],
    xAxes: [{
		 display: false,
      gridLines: {
        display: false
      }
    }]
  },
	
	
 
	legend: {
		display: false
	},
	point: {
		backgroundColor: '#0038ba',
	},

	
	 tooltips: { 
		backgroundColor: '#282828',
		titleFontColor: '#fff',
		caretSize: 5, 
		cornerRadius: 2, bodyFontSize:12,  
  
	//remove label colorbox from tooltips	 
     custom: function(tooltip) {
     if (!tooltip) return;
     tooltip.displayColors = false;
     },
		 
     callbacks: {
     label: function(tooltipItem, data) {
     return tooltipItem.xLabel + " RS." + tooltipItem.yLabel;
     },
     title: function(tooltipItem, data) {
     return;
     }
     }
		 
     },
	

		  
};

var chartInstance = new Chart(chart, {
    type: 'line',
    data: data,
		options: options
});
