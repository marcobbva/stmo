
(function($) {
    $.fn.hasVerticalScrollbar = function() {
        return this.get(0).scrollHeight > this.height();
    }
    
})(jQuery);

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

var column_aplicativo = 0;
var column_finalidad = 1;
var column_contiene = 2;
var column_funciona = 3;
var column_informacion = 4;

var data = [];





if(typeof String.prototype.trim !== 'function') { 
  String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, ''); 
  }
}                          
google.load('visualization', '1.1', {packages: ['controls','table']});
google.setOnLoadCallback(draw);

function draw() {

	var query = new google.visualization.Query('https://spreadsheets.google.com/a/bbva.com/tq?&tq=&key=1hVDWHJ2dj__4bdTJgoK3IP1vZIgdL9MdexVpWaiCKc4&gid=0');
	query.send(handleQueryResponse);
	
}


function handleQueryResponse(response) {
	if (response.isError()) {
			alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
			return;
	}
	data = response.getDataTable();
	loadDataTable();
}




function loadDataTable() {
	var cad = "";
	var aplicativo, finalidad, contiene, funciona, informacion;

	for (var row = 1; row < data.getNumberOfRows(); row++) {

		aplicativo = (data.getValue(row, column_aplicativo) == null) ? "" : data.getValue(row, column_aplicativo);
		finalidad = (data.getValue(row, column_finalidad) == null) ? "" : data.getValue(row, column_finalidad);
		contiene = (data.getValue(row, column_contiene) == null) ? "" : data.getValue(row, column_contiene);
		funciona = (data.getValue(row, column_funciona) == null) ? "" : data.getValue(row, column_funciona);
		informacion = (data.getValue(row, column_informacion) == null) ? "" : data.getValue(row, column_informacion);
		cad = cad + '<tr>';
		cad = cad + '<td class="vcenter-row">' + aplicativo + '</td>';
		cad = cad + '<td class="cell_style_justify">' + finalidad + '</td>';
		cad = cad + '<td class="cell_style_justify">' + contiene + '</td>';
		cad = cad + '<td class="cell_style_justify">' + funciona + '</td>';
		cad = cad + '<td class="vcenter-row">' + informacion + '</td>';
		
		cad = cad + '</tr>';
		
		
	}
	$("#tabla-aplicativos tbody").empty();
	$("#tabla-aplicativos tbody").append(cad);
	$('#tabla-aplicativos').fixedHeaderTable('destroy');
	$('#tabla-aplicativos').fixedHeaderTable();
	$('#tabla-aplicativos').fixedHeaderTable('show', 1000);
	ajustar();
	
	
}

function ajustar() {
	for (var i = 0; i < 5; i++) {
		$(".fht-thead tr:last").get(0).children[i].width = $(".fht-tbody tr:last").get(0).children[i].scrollWidth + 1;
		$(".fht-thead tr:last").get(0).children[i].scrollWidth = $(".fht-tbody tr:last").get(0).children[i].scrollWidth;
	}
	if ($('.fht-tbody').hasVerticalScrollbar() == false) {
		$(".fht-thead th:last").css("padding-right","6px");
	}
}
