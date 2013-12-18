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
	var incomeUndoBuffer = [];
  	
  	//generate income records on 1st load	
	var incomeRecords = getRandomInt(1,5);	
	for (var i = 0; i < incomeRecords; i++) {
		var incomeRecord = new budgetEntry("Income " + (i+1), getRandomInt(1,100));
	  	$scope.incomeArr.push(incomeRecord);
	}
	totalIncome = getBudgetTotal($scope.incomeArr);	  
	drawChart();
	
	$scope.addIncome = function() {   	  
	  var incomeRecord = new budgetEntry($scope.addIncomeDesc, $scope.addIncomeValue);
	  $scope.incomeArr.push(incomeRecord);
	  
	  $scope.addIncomeDesc = "";
	  $scope.addIncomeValue = "";
	  
	  totalIncome = getBudgetTotal($scope.incomeArr);	  
	  drawChart();	
	  
	  console.log("IncomeArr Length: " + $scope.incomeArr.length);
	};
	
	$scope.editIncome = function(recordPosition) { 
		console.log("1. Edit: " + $scope.incomeArr[recordPosition].desc + ", " + $scope.incomeArr[recordPosition].value)
		$scope.incomeArr[recordPosition].setDesc($scope.editIncomeDesc);
		$scope.incomeArr[recordPosition].setValue($scope.editIncomeValue);
		console.log("2. Edit: " + $scope.incomeArr[recordPosition].desc + ", " + $scope.incomeArr[recordPosition].value)
	};
	
	$scope.deleteIncome = function(recordPosition) { 
		incomeUndoBuffer = [$scope.incomeArr[recordPosition]]; //backup record before deleting
		$scope.incomeArr.splice(recordPosition,1); //delete 1 record		
		$scope.isUndoDeleteIncome = true; //show undo panel
		console.log("IncomeArr Length: " + $scope.incomeArr.length);
	};
	
	$scope.undoDeleteIncome = function() {
		$scope.incomeArr.unshift(incomeUndoBuffer[0]); //undo by adding deleted record to the top of the table
		$scope.isUndoDeleteIncome = false; //hide undo panel
	};
}]);
