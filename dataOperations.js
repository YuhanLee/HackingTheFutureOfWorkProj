
var income="Average Income, 2011";

var cost="Current cost of abour force";

var employed="Employed Canadian Labour Force, 2011";

var group="Major Occupation Group";

var noc="NOC #";

var occ="Occupation";

var probAuto="Probability of automation in the next 10-20 years (Frey and Osborne)";

var proportion="Proportion of tasks that can be automated (McKinsey & Company)";

var reduction="Savings in labour force";

var saving="Total Savings";

var allData=[];
var occupations=[];
var salaryComp=[];
var employeeComp=[];
var occupationComp=[];
var currentCostComp=[];
var futureCostComp=[];

var pie;
class Occupation {

    constructor(noc, group, occ, proportion, income, employed,probAuto ) {
        this.noc = noc;
        this.group = group;
        this.occ = occ; 
        this.proportion = proportion; 
        this.income = income; 
        this.employed = employed; 
        this.probAuto = probAuto; 
    }
    toString() {
        return "NOC#"+ this.noc + "Occupation group: "+ this.group+ " Occupation: "+this.occ+"<br />";

    }
}    



$.getJSON( "https://api.myjson.com/bins/1cbott", function( data ) {
    var items = [];
    var count=0;
    $.each( data, function( key, val ) {
        items.push(   "<li id='" + key + "'>" + "NOC #"+ val[noc]+ "</li>"
                   + "<li id='" + key + "'>" + val[group]+ "</li>"
                   + "<li id='" + key + "'>" + val[occ]+ "</li>"
                   + "<li id='" + key + "'>" +"Salary: "+ val[cost]+ "</li>"
                   + "<li id='" + key + "'>" + val[employed]+ "</li>"
                   + "<li id='" + key + "'>" + val[noc]+ "</li>"
                   + "<li id='" + key + "'>" + val[probAuto]+ "</li>"
                   + "<li id='" + key + "'>" + val[proportion]+ "</li>"
                   + "<li id='" + key + "'>" + val[reduction]+ "</li>"
                   + "<li id='" + key + "'>" + val[saving]+ "</li>"
                   + "<li id='" + key + "'>" +" ------------- " + "</li>"
                  );
        var name=  val[noc];
        console.log(noc); 
        var name = new Occupation(val[noc],val[group],val[occ],val[proportion],val[income],val[employed],val[probAuto]);
        allData.push(name);
        //$("#JSON").append(name.toString()+"\n");

occupations.push(val[occ]);
    });
    /*
                  $( "<ul/>", {
                        "class": "my-new-list",
                    html: items.join( "" )}).appendTo( "body" );
                    */
      $( function() {
   
    $( "#tags" ).autocomplete({
      source: occupations
    });
  } ); 
    calculateDefault();
}); 
function show(){
    
    for(var i = 0; i <occupations.length;i++ ){
        if (document.getElementById("tags").value==occupations[i]){
             document.getElementById("employees").value =allData[i].employed ;
             document.getElementById("salary").value =allData[i].income;
            
        }
    }
}


function calculate(){
   
    var totalCostOfLabour=0;
    var position;
     var salary;
    var numEmployees;
    var occupationString=document.getElementById("tags").value;
    for (var i = 0 ;i<allData.length;i++)
    {
       // var a =allData[i].noc;
        if (allData[i].occ==occupationString)
        {
            position=i;
        } 
    }
    /*
    var inputNoc= document.getElementById("noc").value;
    for (var i = 0 ;i<allData.length;i++)
    {
        var a =allData[i].noc;
        if (allData[i].noc==inputNoc)
        {
            position=i;
        } 
    }*/
    numEmployees=document.getElementById('employees').value;
    salary=document.getElementById('salary').value;
    var currentCost= parseInt(salary*numEmployees);
    var totalCostOfLabour= (currentCost)-(allData[position].proportion*salary*numEmployees*allData[position].probAuto);
    
    var totalCostOfLabourText=   "$"+ totalCostOfLabour.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

    $("#total").html("<br />"+"Total savings in labour cost: "+totalCostOfLabourText+"<br />"
                       + "currentCost: "+currentCost);
    var f=Math.trunc(totalCostOfLabour);
    var ctx = document.getElementById('chart').getContext('2d');
    var graphTitle = allData[position].occ;

 salaryComp.push(salary);
 currentCostComp.push(currentCost);
    futureCostComp.push(totalCostOfLabour);
 occupationComp.push(occupationString);
    
 
    
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["Current Costs","Estimate of future costs in  10-20 years"],
            datasets: [{
                label: "Projected cost of labour force",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [currentCost,totalCostOfLabour],
                 fill: false,
            }]
        },

        // Configuration options go here
        options: {
            
            title: {
                display: true,
                text: graphTitle
            },
            scales: {
            yAxes: [{
                ticks: {
                        beginAtZero:true
                        },
                        afterTickToLabelConversion : function(q){
                            for(var tick in q.ticks){
                                q.ticks[tick] += ' ';
                            }
                        }
                    }]
                    }
                }
        });


    
    
    
  // pie.setTransform(1, 0, 0, 1, 0, 0);
      //  pie.clearRect(0,0, canvas.width, canvas.height);
    
    $('#chart2').remove();
    $('#canvas2').append('<canvas id="chart2"><canvas>');
      var   pie=document.getElementById('chart2').getContext('2d');
        
    var myPieChart = new Chart(pie,{
    type: 'pie',
    data:  {
        
    datasets: [{
        data: currentCostComp,
                    backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],

    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: occupationComp,
        
},
           options: {
                 responsive: false,
            title: {
                display: true,
                text: "Current costs"
            },
          
                }
   
});
    
    
    $('#chartfuture').remove();
    $('#canvas2').append('<canvas id="chartfuture"><canvas>');
      var   pie2 =document.getElementById('chartfuture').getContext('2d');
      
    var myPieChart2 = new Chart(pie2,{
    type: 'pie',
    data:  {
        
    datasets: [{
        data: futureCostComp,
                    backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],

    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: occupationComp
}, options: {
      responsive: false,
            title: {
                display: true,
                text: "Future costs"
            },
          
                }
   
});
    $("#details").empty();
    for (var i= 0; i<occupationComp.length;i++){
        $("#details").append(occupationComp[i].toUpperCase()+"<br /> employees: "+ numEmployees+" <br /> Current costs "+currentCostComp[i].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " <br /> future costs: " +futureCostComp[i].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"<br /><br />" );
        
    }
    
    
    
    
}