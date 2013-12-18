'use strict';
var totalIncome = 10;
var totalExpense = 20; 

$(document).foundation(); //initialize foundation

 // Load the Visualization API and the piechart package.
  google.load('visualization', '1.0', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {

    //updateChartValues();
    
    // Create the data table.
    var data = google.visualization.arrayToDataTable([
    ['Income $', 'Expenses  $'],
    ['Income $', totalIncome],
    ['Expense $', totalExpense]
  ]);

    // Set chart options
    var options = {'title':'',
                   chartArea:{left:20,top:20,width:'100%',height:'100%'},
                   'width': 250,
                   'height': 300, 
                   'pieSliceText': 'value',
                   'legend': 'top',                    
                   colors: ['#43ac6a', '#ea2f10']};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);    
  }  

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getBudgetTotal (budgetArr) {
	var budgetTotal = 0;
	for (var i = 0; i < budgetArr.length; i++) {
		budgetTotal += budgetArr[i].value;
	}
	return budgetTotal;
}

// Declare app level module which depends on filters, and services
/*
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);*/

