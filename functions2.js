$(document).ready(function () {
	var data;
	$.ajax({
		async: false,
	    type: "GET",
	    url: "https://api.myjson.com/bins/1cbott",
	    contentType: "application/json",
	    dataType: "json",
	    success: function (response) {
	        data = response;
	    }       
	});
	var array = [];
	$(data).each(function() {
		var appendingValue = $(this)[0]["Major Occupation Group"];
		if (array.indexOf(appendingValue) == -1) {
			array.push(appendingValue);
		}
	});

	for (var i = 0; i < array.length; i++) {
		var markUp = "<option value='" + array[i] + "'>" + array[i] + "</option>";
		$('.yDropdownContainer').append(markUp);
	}

	var occupationArray = [];
	var valueArray = [];
	var myChart = new Chart(document.getElementById("chart"));
	$('select.yDropdownContainer').change(function() {
		var majorOcc = $(this).val();
		occupationArray = [];
		valueArray = [];
		$(data).each(function() {
			if ($(this)[0]["Major Occupation Group"] == majorOcc) {
				var occupationValue = $(this)[0].Occupation;
				occupationArray.push(occupationValue);
				var proportion = $(this)[0]["Proportion of tasks that can be automated (McKinsey & Company)"];
				var probability = $(this)[0]["Probability of automation in the next 10-20 years (Frey and Osborne)"];
				var total = (proportion*probability)*100;
				console.log(occupationValue);
				console.log(proportion);
				console.log(probability);
				console.log(total);
				valueArray.push(total);
			}
		});

		console.log(occupationArray);
		console.log(valueArray);
		myChart.destroy();
		myChart = new Chart(document.getElementById("chart"), {
		    type: 'bar',
		    data: {
		      labels: occupationArray,
		      datasets: [
		        {
		          label: "Percentage of Automation (%)",
		          backgroundColor: '#008080',
                  borderColor: '#008080',
		          data: valueArray
		        }
		      ]
		    },
		    options: {
		    	title: {
		    		display: true,
		    		text: "General Bar Chart"		    	
		    	},
		    	scales: {
		    		xAxes: [{
		    			stacked: true,
		    			ticks: {
		    				autoSkip: false
		    			}
		    		}],
		    		yAxes: [{
		    			ticks: {
		    				beginAtZero: true
		    			},
		    			afterTickToLabelConversion: function(q) {
		    				for (var tick in q.ticks) {
		    					q.ticks[tick] += ' %';
		    				}
		    			}
		    		}]
		    	}
		    }
		});
	});
});