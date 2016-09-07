
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

var column_estatus = 0;
var column_num_regla = 1;
var column_nombre = 2;
var column_portafolios = 3;
var column_descripcion = 4;
var column_tipo = 5;
var column_negocio = 6;
var column_propietario = 7;

var data = [];


var data_negocio = [];
var data_propietario = [];
var data_tipo = [];

if(typeof String.prototype.trim !== 'function') { 
  String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, ''); 
  }
}                          
google.load('visualization', '1.1', {packages: ['controls','table']});
google.setOnLoadCallback(draw);

function draw() {

	var query = new google.visualization.Query('https://spreadsheets.google.com/a/bbva.com/tq?&tq=&key=1IG-EgbHNBYIx7rV8uIlbkIXDDCrRP6AAwd-SlFvt2Bw&gid=0');
	query.send(handleQueryResponse);
	
}


function handleQueryResponse(response) {
	if (response.isError()) {
			alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
			return;
	}
	data = response.getDataTable();
	loadSelect();
	loadDataTable();
}



function loadSelect() {
	data_negocio = [];
	data_propietario = [];
	data_tipo = [];
	for (var row = 0; row < data.getNumberOfRows(); row++) {
		data_negocio.push(data.getValue(row, column_negocio));
		data_propietario.push(data.getValue(row, column_propietario));
		data_tipo.push(data.getValue(row, column_tipo));
		//data table
	}
	data_negocio = data_negocio.unique();
	data_propietario = data_propietario.unique();
	data_tipo = data_tipo.unique();
	
	data_negocio = data_negocio.sort();
	data_propietario = data_propietario.sort();
	data_tipo = data_tipo.sort();
	
	loadSelectOptions($("#sNegocio"), data_negocio);
	loadSelectOptions($("#sPropietario"), data_propietario);
	loadSelectOptions($("#sTipo"), data_tipo);
	
	$(".es-input").blur(function() {
		var id = $(this).get(0).parentNode.id;
		id = id.replace("c","h");
		$("#"+id).val($(this).val().trim());
		loadDataTable();
	});
	$("#sRegla").blur(function() {
		loadDataTable();
	});
	$("#sRegla").focus(function() {
		$(this).select();
	});
	$("#sRegla").keypress(function(event) {
		if (event.keyCode == 13) {
			loadDataTable();
		}
	});
	
	$("#sPortafolio").blur(function() {
		loadDataTable();
	});
	$("#sPortafolio").focus(function() {
		$(this).select();
	});
	$("#sPortafolio").keypress(function(event) {
		if (event.keyCode == 13) {
			loadDataTable();
		}
	});
	$(".es-input").focus(function() {
		$(this).select();
	});
	$(".es-input").keypress(function(event) {
		if (event.keyCode == 13) {
			var id = $(this).get(0).parentNode.id;
			id = id.replace("c","h");
			$("#"+id).val($(this).val().trim());
			loadDataTable();
		}
	});
	
}

function loadSelectOptions(combo, data_select) {
	var cad = "";
	for (var i = 0; i < data_select.length; i++) {
		cad = cad + '<option value="' + data_select[i] + '">' + data_select[i] + '</option>';
	}
	combo.empty();
	combo.append(cad);
	combo.editableSelect({
		onSelect: function (x) {
			var id = $(this).get(0).parentNode.id;
			id = id.replace("c","h");
			$("#"+id).val($(this).val().trim());
			loadDataTable();
			
		}
	});

}

function loadDataTable() {
	var cad = "";
	var found = true;
	for (var row = 0; row < data.getNumberOfRows(); row++) {
		found = true;
		if ($("#sRegla").val() != '') {
			if (!($("#sRegla").val().trim() == data.getValue(row, column_num_regla))) {
					found = false;
				}
		}
		if (found == true && $("#sPortafolio").val() != '' && data.getValue(row, column_portafolios) != null) {
			if (!(data.getValue(row, column_portafolios).search($("#sPortafolio").val().trim()) != -1)) {
					found = false;
				}
		}
		
		
		if (found == true && $("#hNegocio").val() != '') {
			if (!($("#hNegocio").val() == data.getValue(row, column_negocio))) {
					found = false;
				}
		}
		
		if (found == true && $("#hPropietario").val() != '') {
			if (!($("#hPropietario").val() == data.getValue(row, column_propietario))) {
					found = false;
				}
		}
		
		if (found == true && $("#hTipo").val() != '') {
			if (!($("#hTipo").val() == data.getValue(row, column_tipo))) {
					found = false;
				}
		}
		
		if (found == true) {
			cad = cad + '<tr>';
			var estilo_estatus = '';
			var regla_num_id = data.getValue(row, column_num_regla);
			if (data.getValue(row, column_estatus) != "Y") {
				estilo_estatus = "subrayado_rojo";
			} else {
				estilo_estatus = "subrayado_verde";
			}
			cad = cad + '<td class="vcenter-row hcenter-row"><a id="' + data.getValue(row, column_num_regla) + '" class="detalle_regla ' + estilo_estatus + '" href="#detalle_regla_content" onclick="getDetalle(this);">' + regla_num_id + '</a></td>';
			cad = cad + '<td class="vcenter-row">' + data.getValue(row, column_nombre) + '</td>';
			cad = cad + '<td class="vcenter-row hcenter-row ">' + data.getValue(row, column_tipo) + '</td>';
			cad = cad + '<td class="vcenter-row hcenter-row ">' + data.getValue(row, column_negocio) + '</td>';
			cad = cad + '<td class="vcenter-row hcenter-row ">' + data.getValue(row, column_propietario) + '</td>';
			
			//cad = cad + '<td class="vcenter-row hcenter-row ">' + data.getValue(row, column_fecha_estatus) + '</td>';
			/*
			var fecha_compromiso = getFechaCompromiso(data.getValue(row, column_fecha_compromiso));
			var estilo_fecha_compromiso = "";
			
			if (data.getValue(row, column_clave_estatus) == 2) {
				if (((((fecha_actual - fecha_compromiso)/1000)/60)/60)/24 >= 2) {
					estilo_fecha_compromiso = 'class="subrayado_rojo"';
				}
			}
			
			cad = cad + '<td class="vcenter-row hcenter-row "><div ' + estilo_fecha_compromiso + '>' + data.getValue(row, column_fecha_compromiso) + '</div></td>';
			if (data.getValue(row, column_ind) == "1")
				circle = "&#9899;";
			else
				circle == "";
			cad = cad + '<td class="vcenter-row hcenter-row " style="color:red;">' + circle + '</td>';
			
			if (data.getValue(row, column_oc) > 1)
				cad = cad + '<td class="vcenter-row hcenter-row"><a id="' + data.getValue(row, column_folio) + '" class="detalle_oc" href="#detalle_oc_content" onclick="getOcurrencias(this);">' + data.getValue(row, column_oc) + '</a></td>';
			else
				cad = cad + '<td class="vcenter-row hcenter-row ">' + data.getValue(row, column_oc) + '</td>';
			
			cad = cad + '<td class="vcenter-row hcenter-row ">' + data.getValue(row, column_area_resolutoria) + '</td>';
			*/
			cad = cad + '</tr>';
		}
		
	}
	$("#tabla-reglas tbody").empty();
	$("#tabla-reglas tbody").append(cad);
	$('#tabla-reglas').fixedHeaderTable('destroy');
	$('#tabla-reglas').fixedHeaderTable();
	$('#tabla-reglas').fixedHeaderTable('show', 1000);
	ajustar();
	$(".detalle_regla").colorbox({inline:true, width:"70%", height:"90%"});
	
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

function getDetalle(elemento) {
	var found;
	var cadportafolios = "";
	var caddescripcion = "";
	for (var row = 0; row < data.getNumberOfRows(); row++) {
		found = true;

		
		if (!(elemento.id == data.getValue(row, column_num_regla))) {
					found = false;
		}
		if (found == true) {
			$("#sNumeroRegla").val(data.getValue(row, column_num_regla));
			$("#sReglaNombre").val(data.getValue(row, column_nombre));
			if (data.getValue(row, column_estatus) != "Y") {
				$("#sEstatus").css("color","red");
			} else {
				$("#sEstatus").css("color","#00FF00");
			}
			var portafolios = data.getValue(row, column_portafolios);
			if (portafolios != null) {
				portafolios = portafolios.split('>').join('&#62');
				portafolios = portafolios.split('<').join('&#60');
				portafolios = portafolios.split('"').join('&#34');
				
				
				cadportafolios = cadportafolios + '<tr>';
				cadportafolios = cadportafolios + '<td class="cell_style_justify">' + portafolios + '</td>';
				cadportafolios = cadportafolios + '</tr>';
				
			}
			var descripcion = data.getValue(row, column_descripcion);
			if (descripcion != null) {
				descripcion = descripcion.split('>').join('&#62');
				descripcion = descripcion.split('<').join('&#60');
				descripcion = descripcion.split('"').join('&#34');
				
				
				caddescripcion = caddescripcion + '<tr>';
				caddescripcion = caddescripcion + '<td class="cell_style_justify">' + descripcion + '</td>';
				caddescripcion = caddescripcion + '</tr>';
				
			}
			break;
			
		}
	}
	
	$("#tabla-portafolios tbody").empty();
	$("#tabla-portafolios tbody").append(cadportafolios);
	$("#tabla-descripcion tbody").empty();
	$("#tabla-descripcion tbody").append(caddescripcion);
}

function limpiar() {
	$("input:hidden").val('');
	$(".es-input").val('');
	$("#sRegla").val('');
	$("#sPortafolio").val('');
	loadDataTable();
}
