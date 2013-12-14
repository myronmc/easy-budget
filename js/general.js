var disableIncomeModal = false;
var disableExpenseModal = false;
var incomeUndoBuffer = null;
var expenseUndoBuffer = null;
var activeIncomeColumn = false;
var activeExpenseColumn = false;
var totalIncome = 0;
var totalExpense = 0; 
var incomeEntries = [];
var expenseEntries = [];

var debug = true;
function showLog(msg) {
	if (debug)
		console.log(msg);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
$(document).foundation(); //initialize foundation

$(document).ready(function() {
	//set todays date on change date accordion
	$('#change-date').empty().append(
		$.datepicker.formatDate("DD: MM dd, yy", $( "#calendar" ).datepicker( "getDate" ))); 
	
	//load values
	changeValues();	
});

// load date picker
$( "#calendar" ).datepicker({
	dateFormat: "DD: MM dd, yy",
	onSelect: function(dateText, inst) {			
		$('#change-date').empty().append(dateText);
		changeValues();			
	}	
}); 

// Load the Visualization API and the piechart package.
  google.load('visualization', '1.0', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {

    updateChartValues();
    
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
    chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);    
  }  

/*
 * income auto complete
 */
$(function() {
    incomeEntries = [
      "salary",
      "tips",
      "gifts",
      "government subsidy"      
    ];
    $( "#add-income-desc" ).autocomplete({
      source: incomeEntries
    });
 });

/*
 * expense auto complete
 */
$(function() {
    expenseEntries = [
      "bus fare",
      "taxi fare",
      "grocery",
      "movies"      
    ];
    $( "#add-expense-desc" ).autocomplete({
      source: expenseEntries
    });
 });

/*
 * income modal ok button
 */
 $('#edit-income').click(function() {
 	disableIncomeModal = ($('#no-show-income-modal-again').prop('checked')) ? true : false;
 	$('#income-panel button').prop('disabled',false); 	
 	/*
	 activeIncomeColumn = true;
		  activeExpenseColumn = false;*/
	 		
 	$('#income-modal').foundation('reveal', 'close'); //close panel 	
 	$('#income-panel').addClass('callout'); //highlight it as active
 	$('#income-panel').find('*').prop("disabled", false);  //enable income panel elements
 	$('#income-panel').find('[contenteditable]').prop("contenteditable", true);  //enable income panel elements
 	$('#add-income-value').focus();
 	$('#expense-panel').removeClass('callout').find('*').prop("disabled", true);  //disable expense panel elements
 	$('#expense-panel button').prop('disabled',true);
});  

/*
 * expense modal ok button*
*/
 $('#edit-expense').click(function() { 	
 	disableExpenseModal = ($('#no-show-expense-modal-again').prop('checked')) ? true : false;
 	$('#expense-panel button').prop('disabled',false);
 	/*
	 activeIncomeColumn = false;
		  activeExpenseColumn = true;*/
	 
 	$('#expense-modal').foundation('reveal', 'close'); //close panel 	
 	$('#expense-panel').addClass('callout'); //highlight it as active
 	$('#expense-panel').find('*').prop("disabled", false);  //enable expense panel elements
 	$('#expense-panel').find('[contenteditable]').prop("contenteditable", true);  //enable expense editable fields panel elements
 	$('#add-expense-value').focus();
 	$('#income-panel').removeClass('callout').find('*').prop("disabled", true);  //disable income panel elements
 	$('#income-panel button').prop('disabled',true);
}); 
  
function updateChartValues() {
	totalIncome = 0, totalExpense = 0;
	$('#income-list .value-column').each(function( index ) {
	  totalIncome += parseInt($(this).text(),10);
	});
	
	$('#expense-list .value-column').each(function( index ) {
	  totalExpense += parseInt($(this).text(),10);
	});	
	
	var expensePercentage = (totalExpense/(totalIncome + totalExpense)) * 100;
	if (expensePercentage >= 80) {
		$('#budget-notifications').removeClass('success info').addClass('warning');
		$('#budget-notifications-icon').removeClass('fi-alert fi-like').addClass('fi-dislike');
    	$('#budget-notifications-message').empty().append('Stop spending, or increase your income before you go broke!');
    }
    if (expensePercentage > 50 && expensePercentage < 80) {
    	$('#budget-notifications').removeClass('success warning').addClass('info');
		$('#budget-notifications-icon').removeClass('fi-dislike fi-like').addClass('fi-alert');
    	$('#budget-notifications-message').empty().append('Not bad, try not to let your expenses pass 80%');
    }	
    if (expensePercentage <= 50) {
    	$('#budget-notifications').removeClass('info warning').addClass('success');
		$('#budget-notifications-icon').removeClass('fi-dislike fi-alert').addClass('fi-like');
    	$('#budget-notifications-message').empty().append('Good job, keep increasing the gap!');
	}
	showLog("Income: " + totalIncome + ", Expense: " + totalExpense);
}  
 
/*
 * add income row
 */
$('#add-income').click(function(e) {
	e.preventDefault();
	var incomeDesc = $('#add-income-desc');
	var incomeValue = $('#add-income-value');
	
	incomeEntries.push(incomeDesc.val());
	
	var newIncomeItem =
	"<tr>" +
		"<td contenteditable='true'>" + incomeDesc.val() + "</td>" +
		"<td contenteditable='true' class='value-column'>" + incomeValue.val() + "</td>" +		
		"<td><button class='mini radius delete-this-item fi-trash secondary' title='Delete this entry'></button></td>" +
	"</tr>";	
	
	incomeDesc.val("");
	incomeValue.val("");
			
	$('#income-list tbody').append(newIncomeItem);
	
	drawChart();	
});

/*
 * add expense row
 */
$('#add-expense').click(function(e) {
	e.preventDefault();
	var expenseDesc = $('#add-expense-desc');
	var expenseValue = $('#add-expense-value');
	
	expenseEntries.push(expenseDesc.val());
	
	var newExpenseItem =
	"<tr>" +
		"<td contenteditable='true'>" + expenseDesc.val() + "</td>" +
		"<td contenteditable='true' class='value-column'>" + expenseValue.val() + "</td>" +		
		"<td><button class='mini radius delete-this-item fi-trash secondary' title='Delete this entry'></button></td>" +
	"</tr>";
	
	expenseDesc.val("");
	expenseValue.val("");
			
	$('#expense-list tbody').append(newExpenseItem);
	drawChart();
});


/*
 * edit rows
 */
//$(".item-list-tables td[contenteditable=true]").
$(document).on('blur change','.item-list-tables td[contenteditable=true]',function() {
    drawChart();
});

/*
 * delete income row
 */
$(document).on('click','#income-list .delete-this-item', function(e) {	
	incomeUndoBuffer = $(this).parents('tr');
	showLog(incomeUndoBuffer);
	$(this).parents('tr').remove();
	$('#income-alert-box').show();	
	
	drawChart();
});

/*
 * undo delete income row
 */
$('#income-alert-box .undo-delete').click(function (e) {
	e.preventDefault();
	$('#income-list tbody').append(incomeUndoBuffer);
	drawChart();
	$(this).parent().hide();
});

/*
 * delete expense row
 */
$(document).on('click','#expense-list .delete-this-item', function(e) {	
	expenseUndoBuffer = $(this).parents('tr');
	showLog(expenseUndoBuffer);
	$(this).parents('tr').remove();
	drawChart();
	$('#expense-alert-box').show();	
});

/*
 * undo delete expense row
 */
$('#expense-alert-box .undo-delete').click(function (e) {
	e.preventDefault();
	$('#expense-list tbody').append(expenseUndoBuffer);
	drawChart();
	$(this).parent().hide();
});

/*
 * change income and expense values for demo purposes
 */
function changeValues() {
	var incomeRecords = getRandomInt(1,10);
	var expenseRecords = getRandomInt(1,10);
	
	//make income records
	$('#income-list tbody').empty();
	for (var i = 0; i < incomeRecords; i++) {
		var newIncomeItem =
		"<tr>" +
			"<td contenteditable='false'>Income " + (i+1) + "</td>" +
			"<td contenteditable='false' class='value-column'>" + getRandomInt(1,100) + "</td>" +		
			"<td><button disabled class='mini radius delete-this-item fi-trash secondary' title='Delete this entry'></button></td>" +
		"</tr>";
		$('#income-list tbody').append(newIncomeItem);		
	}
	
	//make expense records
	$('#expense-list tbody').empty();
	for (var i = 0; i < expenseRecords; i++) {
		var newExpenseItem =
		"<tr>" +
			"<td contenteditable='false'>Expense " + (i+1) + "</td>" +
			"<td contenteditable='false' class='value-column'>" + getRandomInt(1,100) + "</td>" +		
			"<td><button disabled class='mini radius delete-this-item fi-trash secondary' title='Delete this entry'></button></td>" +
		"</tr>";
		$('#expense-list tbody').append(newExpenseItem);		
	}
	drawChart();
}
