'use strict';

/*
 * classes
 */
var budgetEntry = function (desc, value) {
	this.desc = desc;
	this.value = value;
};

/* Controllers */

var easyBudget = angular.module('easyBudget', []);

easyBudget.controller('BudgetNotificationsCtrl', ['$scope', function ($scope) {
	//$scope.expensePercentage = (totalExpense/(totalIncome + totalExpense)) * 100;
	
	
		var expensePercentage = (totalExpense/(totalIncome + totalExpense)) * 100;
		if (expensePercentage >= 80) {		
			$scope.alertBoxClass = 'warning';
			$scope.budgetNotificationsIcon = 'fi-dislike';
	    	$scope.budgetNotifcationsMessage = 'Stop spending, or increase your income before you go broke!';
	    }
	    if (expensePercentage > 50 && expensePercentage < 80) {
	    	$scope.alertBoxClass = 'info';
			$scope.budgetNotificationsIcon = 'fi-alert';
	    	$scope.budgetNotifcationsMessage = 'Not bad, try not to let your expenses pass 80%';
	    }	
	    if (expensePercentage <= 50) {
	    	$scope.alertBoxClass = 'success';
			$scope.budgetNotificationsIcon = 'fi-like';
	    	$scope.budgetNotifcationsMessage = 'Good job, keep increasing the gap!';
		}
	
}]);

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
	  var incomeRecord = new budgetEntry($scope.addIncomeDesc, parseInt($scope.addIncomeValue));
	  $scope.incomeArr.unshift(incomeRecord);	//add new record at the top of the array  
	  	  
	  $scope.addIncomeDesc = "";
	  $scope.addIncomeValue = "";
	  
	  updateChartValues();
	  
	  console.log("IncomeArr Length: " + $scope.incomeArr.length);
	};
	
	$scope.editIncome = function(recordPosition) {		
		$scope.addIncomeDesc = $scope.incomeArr[recordPosition].desc; 
		$scope.addIncomeValue = $scope.incomeArr[recordPosition].value;
		editRecordPos = recordPosition;		
		$('#add-income-value').focus();	//this might not be best practice, book sys avoid direct DOM manip via jQuery, but then is this manipulation?
		$scope.showUpdate = true;		
	};
	
	$scope.updateIncome = function() {
		$scope.incomeArr[editRecordPos].desc = ($scope.addIncomeDesc);
		$scope.incomeArr[editRecordPos].value = parseInt($scope.addIncomeValue);		
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
	
	$scope.enableIncomeState = function() {
		appState = 'INCOME';
		$('#income-modal').foundation('reveal', 'close'); //close panel
		$('#add-income-value').focus();
	};
	
	$scope.isAppState = function(state) {
		return (state == appState);
	};

}]);

easyBudget.controller('ExpenseCtrl', ['$scope', function ($scope) {
	$scope.expenseArr = [];
  	$scope.showUpdate = false;  	
	var expenseUndoBuffer = [];
	var editRecordPos = 0;
  	
  	//generate expense records on 1st load	
	var expenseRecords = getRandomInt(1,5);	
	for (var i = 0; i < expenseRecords; i++) {
		var expenseRecord = new budgetEntry("Expense " + (i+1), getRandomInt(1,100));
	  	$scope.expenseArr.push(expenseRecord);
	}
	
	function updateChartValues() {
		totalExpense = getBudgetTotal($scope.expenseArr);	  
		drawChart();
	}
	
	updateChartValues();
	
	$scope.addExpense = function() {	  
	  var expenseRecord = new budgetEntry($scope.addExpenseDesc, parseInt($scope.addExpenseValue));
	  $scope.expenseArr.unshift(expenseRecord);	//add new record at the top of the array  
	  	  
	  $scope.addExpenseDesc = "";
	  $scope.addExpenseValue = "";
	  
	  updateChartValues();
	  
	  console.log("ExpenseArr Length: " + $scope.expenseArr.length);
	};
	
	$scope.editExpense = function(recordPosition) {		
		$scope.addExpenseDesc = $scope.expenseArr[recordPosition].desc; 
		$scope.addExpenseValue = $scope.expenseArr[recordPosition].value;
		editRecordPos = recordPosition;		
		$('#add-expense-value').focus();	//this might not be best practice, book sys avoid direct DOM manip via jQuery, but then is this manipulation?
		$scope.showUpdate = true;		
	};
	
	$scope.updateExpense = function() {
		$scope.expenseArr[editRecordPos].desc = ($scope.addExpenseDesc);
		$scope.expenseArr[editRecordPos].value = parseInt($scope.addExpenseValue);		
		$scope.addExpenseDesc = "";
	  	$scope.addExpenseValue = "";
	  	updateChartValues();
		$scope.showUpdate = false;		
	};
	
	$scope.deleteExpense = function(recordPosition) { 
		expenseUndoBuffer = [$scope.expenseArr[recordPosition]]; //backup record before deleting
		$scope.expenseArr.splice(recordPosition,1); //delete 1 record		
		$scope.isUndoDeleteExpense = true; //show undo panel
		updateChartValues();
		console.log("ExpenseArr Length: " + $scope.expenseArr.length);
	};
	
	$scope.undoDeleteExpense = function() {
		$scope.expenseArr.unshift(expenseUndoBuffer[0]); //undo by adding deleted record to the top of the table
		updateChartValues();
		$scope.isUndoDeleteExpense = false; //hide undo panel
	};
	
	$scope.enableExpenseState = function() {
		appState = 'EXPENSE';
		$('#expense-modal').foundation('reveal', 'close'); //close panel
		$('#add-expense-value').focus();
	};
	
	$scope.isAppState = function(state) {
		return (state == appState);
	};

}]);