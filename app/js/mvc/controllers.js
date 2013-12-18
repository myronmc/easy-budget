'use strict';

/*
 * classes
 */
var budgetEntry = function (desc, value) {
	this.desc = desc;
	this.value = value;
	this.setDesc = function(newValue) {
		this.desc = newValue;
	};
	this.setValue = function(newValue) {
		this.value = newValue;
	};
};

/* Controllers */

var easyBudget = angular.module('easyBudget', []);

easyBudget.controller('IncomeCtrl', ['$scope', function ($scope) {
  	$scope.incomeArr = [];
  	$scope.showUpdate = false;
	var incomeUndoBuffer = [];
	var editRecordPos = 0;
  	
  	//generate income records on 1st load	
	var incomeRecords = getRandomInt(1,5);	
	for (var i = 0; i < incomeRecords; i++) {
		var incomeRecord = new budgetEntry("Income " + (i+1), getRandomInt(1,100));
	  	$scope.incomeArr.push(incomeRecord);
	}
	
	function updateChartValues() {
		totalIncome = getBudgetTotal($scope.incomeArr);	  
		drawChart();
	}
	
	updateChartValues();
	
	$scope.addIncome = function() {   	  
	  var incomeRecord = new budgetEntry($scope.addIncomeDesc, $scope.addIncomeValue);
	  $scope.incomeArr.push(incomeRecord);
	  
	  $scope.addIncomeDesc = "";
	  $scope.addIncomeValue = "";
	  
	  updateChartValues();
	  
	  console.log("IncomeArr Length: " + $scope.incomeArr.length);
	};
	
	$scope.editIncome = function(recordPosition) {		
		$scope.addIncomeDesc = $scope.incomeArr[recordPosition].desc; 
		$scope.addIncomeValue = $scope.incomeArr[recordPosition].value;
		editRecordPos = recordPosition;		
		$('#add-income-value').focus();	//this might not be best practice, book sys avoid direct DOM manip via jQuery, but then is this manipulatiion?
		updateChartValues();	
		$scope.showUpdate = true;		
	};
	
	$scope.updateIncome = function() {
		$scope.incomeArr[editRecordPos].setDesc($scope.addIncomeDesc);
		$scope.incomeArr[editRecordPos].setValue($scope.addIncomeValue);
		$scope.addIncomeDesc = "";
	  	$scope.addIncomeValue = "";
	  	updateChartValues();
		$scope.showUpdate = false;		
	};
	
	$scope.deleteIncome = function(recordPosition) { 
		incomeUndoBuffer = [$scope.incomeArr[recordPosition]]; //backup record before deleting
		$scope.incomeArr.splice(recordPosition,1); //delete 1 record		
		$scope.isUndoDeleteIncome = true; //show undo panel
		updateChartValues();
		console.log("IncomeArr Length: " + $scope.incomeArr.length);
	};
	
	$scope.undoDeleteIncome = function() {
		$scope.incomeArr.unshift(incomeUndoBuffer[0]); //undo by adding deleted record to the top of the table
		updateChartValues();
		$scope.isUndoDeleteIncome = false; //hide undo panel
	};
}]);
