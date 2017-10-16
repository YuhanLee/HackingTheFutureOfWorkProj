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

	$("#addRow").click(function() {
		var markUp = "<div>Number of Employees: <input type='text' name='numberOfEmployees'> NOC #: <input type='text' name='NOC#'> Salary: <input type='text' name='Salary'></div>";
		$("#inputContainer").find("div:last-child").after(markUp);
	});
	var pieLabels = [];
	var pieValues = [];
	var	myChart = new Chart(document.getElementById("chart"), {
	    type: 'pie',
	    data: {
	      labels: pieLabels,
	      datasets: [
	        {
	          backgroundColor: '#008080',
	          data: pieValues
	        }
	      ]
	    }
	});
	var salaryChart = new Chart(document.getElementById("salaryChart"));
	$("#submit").click(function() {
		var jsonData = [];
		$("#inputContainer").children('div').each(function() {
			var innerData = {};
			$(this).children('input').each(function() {
				var key = $(this).attr('name');
				var value = $(this).val();
				innerData[key] = value;
			});
			jsonData.push(innerData);
		});

		pieLabels = [];
		pieValues = [];
		$(jsonData).each(function() {
			var noc = $(this)[0]["NOC#"];
			var numberOfEmployees = parseFloat($(this)[0].numberOfEmployees);
			$(data).each(function(){
				if ($(this)[0]["NOC #"] == noc) {
					var majorOcc = $(this)[0]["Major Occupation Group"];
					if (pieLabels.indexOf(majorOcc) == -1) {
						pieLabels.push(majorOcc);
						pieValues.push(numberOfEmployees);
					} else {
						var index = pieLabels.indexOf(majorOcc);
						var oldValue = pieValues[index];
						pieValues[index] = oldValue + numberOfEmployees;
					}
				}
			});
		});
		myChart.destroy();
		myChart = new Chart(document.getElementById("chart"), {
		    type: 'pie',
		    data: {
		      labels: pieLabels,
		      datasets: [
		        {
		          backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
		          data: pieValues
		        }
		      ]
		    }
		});

		var salaryData = [];
		$("#inputContainer").children('div').each(function() {
				var innerSalaryData = {};
				var key = $(this).children('input[name="NOC#"]').attr('name');
				var value = $(this).children('input[name="NOC#"]').val();
				innerSalaryData[key] = value;
				var salaryBefore = parseFloat($(this).children('input[name="Salary"]').val()) * parseFloat($(this).children('input[name="numberOfEmployees"]').val());
				innerSalaryData.salaryBefore = salaryBefore;

				$(data).each(function() {
					if ($(this)[0]["NOC #"] == innerSalaryData["NOC#"]) {
						var key = "Major Occupation Group";
						var value = $(this)[0]["Major Occupation Group"];
						innerSalaryData[key] = value;
						var proportion = $(this)[0]["Proportion of tasks that can be automated (McKinsey & Company)"];
						var probability = $(this)[0]["Probability of automation in the next 10-20 years (Frey and Osborne)"];
						var total = proportion*probability;
						var salaryAfter = total * innerSalaryData.salaryBefore;
						innerSalaryData.salaryAfter = salaryAfter;
					}
				});
			salaryData.push(innerSalaryData);
		});

		var salaryLabels = [];
		var salaryBefore = [];
		var salaryAfter = [];
		$(salaryData).each(function() {
			var newBefore = parseFloat($(this)[0].salaryBefore);
			var newAfter = parseFloat($(this)[0].salaryAfter);
			var majorOccGroup = $(this)[0]["Major Occupation Group"];
			if (salaryLabels.indexOf(majorOccGroup) == -1) {
				salaryLabels.push(majorOccGroup);
				salaryBefore.push($(this)[0].salaryBefore);
				salaryAfter.push($(this)[0].salaryAfter);
			} else {
				var index = salaryLabels.indexOf(majorOccGroup);
				var oldBefore = salaryBefore[index];
				var oldAfter = salaryAfter[index];
				salaryBefore[index] = oldBefore + newBefore;
				salaryAfter[index] = oldAfter + newAfter;
			}
		});

		salaryChart.destroy();
		salaryChart = new Chart(document.getElementById("salaryChart"), {
		    type: 'bar',
		    data: {
		      labels: salaryLabels,
		      datasets: [
		        {
		          label: "Salary Before",
		          backgroundColor: 'red',
		          data: salaryBefore
		        },
		        {
		          label: "Salary After",
		          backgroundColor: 'blue',
		          data: salaryAfter
		        }
		      ]
		    },
		    options: {
		    	title: {
		    		display: true,
		    		text: "Salary Bar Chart"		    	
		    	},
		    	scales: {
		    		xAxes: [{
		    			stacked: false,
		    			ticks: {
		    				autoSkip: false
		    			}
		    		}]
		    	}
		    }
		});
	});
});
