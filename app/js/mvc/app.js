'use strict';

var easyBudget = angular.module('easyBudget', []);

var budgetEntry = function (desc, value) {
	this.desc = desc;
	this.value = value;
};

easyBudget.controller('IncomeCtrl', ['$scope', function ($scope) {
  // Controller magic
	$scope.addIncome = function() { 
  	  var incomeArr = [];
	  var incomeRecord = new budgetEntry($scope.addIncomeDesc, $scope.addIncomeValue);
	  incomeArr.push(incomeRecord);
	  console.log(incomeArr[0].addIncomeDesc + ", " + incomeArr[0].addIncomeValue);
	};
}]);

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

