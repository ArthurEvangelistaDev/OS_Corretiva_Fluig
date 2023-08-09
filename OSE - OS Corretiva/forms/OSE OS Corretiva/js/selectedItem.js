//==============================================================================================================================================
function setSelectedZoomItem(selectedItem) {

	if (selectedItem.inputId == "OBJETODEMANUTENCAO") {

		var c1 = DatasetFactory.createConstraint("IDOBJOF", selectedItem["IDOBJOF"], selectedItem["IDOBJOF"], ConstraintType.MUST);
		var constraints = new Array(c1);
		try{
			var dataset = DatasetFactory.getDataset("ds_OSE_Objeto_de_Manutencao", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("SERIE").value = row["SERIE"]
			document.getElementById("STATUS").value = row["STATUS"]
			document.getElementById("CODMODELO").value = row["CODMODELO"]
			document.getElementById("MODELO").value = row["MODELO"]
			document.getElementById("CODSUBMODELO").value = row["CODSUBMODELO"]
			document.getElementById("SUBMODELO").value = row["SUBMODELO"]
			document.getElementById("CODTIPOOBJ").value = row["CODTIPOOBJ"]
			document.getElementById("TIPOOBJ").value = row["TIPOOBJ"]
			document.getElementById("CODFABRICANTE").value = row["CODFABRICANTE"]
			document.getElementById("FABRICANTE").value = row["FABRICANTE"]
			document.getElementById("HORIMETROACUMULADO").value = row["HOTRIMETRO"]
			document.getElementById("HORIMETROMAXIMO").value = row["HORASMAXIMAS"]
			document.getElementById("DATACOLETA").value = row["DATACOLETA"]
			document.getElementById("CODFILIAL").value = row["CODFILIAL"]
			document.getElementById("FILIAL").value = row["FILIAL"]
			document.getElementById("CODCENTRODECUSTO").value = row["CODCENTRODECUSTO"]
			document.getElementById("CENTRODECUSTO").value = row["CENTRODECUSTO"]
			document.getElementById("CODDEPARTAMENTO").value = row["CODDEPARTAMENTO"]
			document.getElementById("DEPARTAMENTO").value = row["DEPARTAMENTO"]
			document.getElementById("CODLOCALIZACAO").value = row["CODLOCALIZACAO"]
			document.getElementById("LOCALIZACAO").value = row["LOCALIZACAO"]
			document.getElementById("CHAPARESP").value = row["CHAPARESP"]
			document.getElementById("CODCFO").value = row["CODCFO"]
			
			
			var c1 = DatasetFactory.createConstraint("CODLOCAL", row["CODLOCALIZACAO"], row["CODLOCALIZACAO"], ConstraintType.MUST);
			var constraints = new Array(c1);
			var dataset = DatasetFactory.getDataset("ds_OSE_Local_de_Estoque", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("CODLOCALESTOQUE").value = row["CODLOC"];
			document.getElementById("LOCALESTOQUE").value = row["LOCALDEESTOQUE"];
			
		}catch(e){
			console.log("Erro ao consultar dataset: " + e);
		}
		
	}
	
	if (selectedItem.inputId == "CLASSEDAMANUTENCAO") {

		var c1 = DatasetFactory.createConstraint("DSCCLASSMOV", selectedItem["DSCCLASSMOV"], selectedItem["DSCCLASSMOV"], ConstraintType.MUST);
		var constraints = new Array(c1);
		try{
			var dataset = DatasetFactory.getDataset("ds_OSE_Classe_de_Manutencao_Compra", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("IDCLASSEDAMANUTENCAO").value = row["IDCLASSMOV"]
			document.getElementById("IDCLASSEDECOMPRA").value = row["CODCLASSEDECOMPRA"]
			document.getElementById("CLASSEDECOMPRA").value = row["CLASSEDECOMPRA"]
		}catch(e){
			console.log("Erro ao consultar dataset: " + e);
		}
	}
	
	if (selectedItem.inputId == "LOCALESTOQUE") {
		document.getElementById("CODLOCALESTOQUE").value = selectedItem["CODLOC"]
	}

	var string = selectedItem.inputId
	var index = string.slice(string.indexOf('___')+3, string.length)
	if (selectedItem.inputId.split('___', 1)[0] == "CODIGOPECAORIGINAL") {
		var c1 = DatasetFactory.createConstraint("CODIGOPRD", selectedItem["CODIGOPRD"], selectedItem["CODIGOPRD"], ConstraintType.MUST);
		var constraints = new Array(c1);
		try{
			var dataset = DatasetFactory.getDataset("ds_OSE_Pecas_Originais", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("DESCRICAOPECAORIGINAL___"+index).value = row["NOMEFANTASIA"]
			document.getElementById("UNIDADEPECAORIGINAL___"+index).value = row["UNIDADECOMPRA"]
			document.getElementById("IDPRDPECAORIGINAL___"+index).value = row["IDPRD"]
			document.getElementById("ULTIMOPRECOPECAORIGINAL___"+index).value = row["ULTIMOPRECO"]
			if(row["GRUPOCOMPONENTE"] != "null"){
			document.getElementById("CODCOMPONENTESPECAORIGINAL___"+index).value = row["CODGRUPOCOMPONENTE"]
			setZoomData("GRUPODECOMPONENTESPECAORIGINAL___"+index,row["GRUPOCOMPONENTE"])
			}
		}catch(e){
			console.log("Erro ao consultar dataset: " + e);
		}
	}
	if (selectedItem.inputId.split('___', 1)[0] == "GRUPODECOMPONENTESPECAORIGINAL") {
		document.getElementById("CODCOMPONENTESPECAORIGINAL___"+index).value = selectedItem["CODTB2FAT"]
	}
	
	if (selectedItem.inputId.split('___', 1)[0] == "CODIGOPECAAUXILIAR") {
		var c1 = DatasetFactory.createConstraint("CODIGOPRD", selectedItem["CODIGOPRD"], selectedItem["CODIGOPRD"], ConstraintType.MUST);
		var constraints = new Array(c1);
		try{
			var dataset = DatasetFactory.getDataset("ds_OSE_Pecas_Auxiliares", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("DESCRICAOPECAAUXILIAR___"+index).value = row["NOMEFANTASIA"]
			document.getElementById("UNIDADEPECAAUXILIAR___"+index).value = row["UNIDADECOMPRA"]
			document.getElementById("IDPRDPECAAUXILIAR___"+index).value = row["IDPRD"]
			document.getElementById("ULTIMOPRECOPECAAUXILIAR___"+index).value = row["ULTIMOPRECO"]
			if(row["GRUPOCOMPONENTE"] != "null"){
			document.getElementById("CODCOMPONENTESPECAAUXILIAR___"+index).value = row["CODGRUPOCOMPONENTE"]
			setZoomData("GRUPODECOMPONENTESPECAAUXILIAR___"+index,row["GRUPOCOMPONENTE"])
			}
		}catch(e){
			console.log("Erro ao consultar dataset: " + e);
		}
	}
	if (selectedItem.inputId.split('___', 1)[0] == "GRUPODECOMPONENTESPECAAUXILIAR") {
		document.getElementById("CODCOMPONENTESPECAAUXILIAR___"+index).value = selectedItem["CODTB2FAT"]
	}

	if (selectedItem.inputId.split('___', 1)[0] == "DESCRICAOCOMPLETAPNEUS") {
		var codigoprd = selectedItem["DESCRICAOCOMPLETA"].split("  -  ")[0]
		var c1 = DatasetFactory.createConstraint("CODIGOPRD", codigoprd, codigoprd, ConstraintType.MUST);
		var constraints = new Array(c1);
		try{
			var dataset = DatasetFactory.getDataset("ds_OSE_Pecas_Pneus", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("CODIGOPNEUS___"+index).value = row["CODIGOPRD"]
			document.getElementById("DESCRICAOPNEUS___"+index).value = row["NOMEFANTASIA"]
			document.getElementById("UNIDADEPNEUS___"+index).value = row["UNIDADECOMPRA"]
			document.getElementById("IDPRDPNEUS___"+index).value = row["IDPRD"]
			document.getElementById("ULTIMOPRECOPNEUS___"+index).value = row["ULTIMOPRECO"]
			if(row["GRUPOCOMPONENTE"] != "null"){
			document.getElementById("CODCOMPONENTESPNEUS___"+index).value = row["CODGRUPOCOMPONENTE"]
			setZoomData("GRUPODECOMPONENTESPNEUS___"+index,row["GRUPOCOMPONENTE"])
			}
		}catch(e){
			console.log("Erro ao consultar dataset: " + e);
		}
	}
	if (selectedItem.inputId.split('___', 1)[0] == "GRUPODECOMPONENTESPNEUS") {
		document.getElementById("CODCOMPONENTESPNEUS___"+index).value = selectedItem["CODTB2FAT"]
	}

	if (selectedItem.inputId.split('___', 1)[0] == "DESCRICAOCOMPLETAOLEO") {
		var codigoprd = selectedItem["DESCRICAOCOMPLETA"].split("  -  ")[0]
		var c1 = DatasetFactory.createConstraint("CODIGOPRD", codigoprd, codigoprd, ConstraintType.MUST);
		var constraints = new Array(c1);
		try{
			var dataset = DatasetFactory.getDataset("ds_OSE_Pecas_Oleos", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("CODIGOOLEO___"+index).value = row["CODIGOPRD"]
			document.getElementById("DESCRICAOOLEO___"+index).value = row["NOMEFANTASIA"]
			document.getElementById("UNIDADEOLEO___"+index).value = row["UNIDADECOMPRA"]
			document.getElementById("IDPRDOLEO___"+index).value = row["IDPRD"]
			document.getElementById("ULTIMOPRECOOLEO___"+index).value = row["ULTIMOPRECO"]
			if(row["GRUPOCOMPONENTE"] != "null"){
			document.getElementById("CODCOMPONENTESOLEO___"+index).value = row["CODGRUPOCOMPONENTE"]
			setZoomData("GRUPODECOMPONENTESOLEO___"+index,row["GRUPOCOMPONENTE"])
			}
		}catch(e){
			console.log("Erro ao consultar dataset: " + e);
		}
	}
	if (selectedItem.inputId.split('___', 1)[0] == "GRUPODECOMPONENTESOLEO") {
		document.getElementById("CODCOMPONENTESOLEO___"+index).value = selectedItem["CODTB2FAT"]
	}

	if (selectedItem.inputId.split('___', 1)[0] == "DESCRICAOCOMPLETASERVINTERNO") {
		var codigoprd = selectedItem["DESCRICAOCOMPLETA"].split("  -  ")[0]
		var c1 = DatasetFactory.createConstraint("CODIGOPRD", codigoprd, codigoprd, ConstraintType.MUST);
		var constraints = new Array(c1);
		try{
			var dataset = DatasetFactory.getDataset("ds_OSE_Servicos_Internos", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("CODIGOSERVICOINTERNO___"+index).value = row["CODIGOPRD"]
			document.getElementById("DESCRICAOSERVICOINTERNO___"+index).value = row["NOMEFANTASIA"]
			document.getElementById("UNIDADESERVICOINTERNO___"+index).value = row["UNIDADECOMPRA"]
			document.getElementById("IDPRDSERVICOINTERNO___"+index).value = row["IDPRD"]
			document.getElementById("ULTIMOPRECOSERVICOINTERNO___"+index).value = row["ULTIMOPRECO"]
			if(row["GRUPOCOMPONENTE"] != "null"){
			document.getElementById("CODCOMPONENTESSERVINTERNO___"+index).value = row["CODGRUPOCOMPONENTE"]
			setZoomData("GRUPODECOMPONENTESSERVINTERNO___"+index,row["GRUPOCOMPONENTE"])
			}
		}catch(e){
			console.log("Erro ao consultar dataset: " + e);
		}
	}
	if (selectedItem.inputId.split('___', 1)[0] == "GRUPODECOMPONENTESSERVINTERNO") {
		document.getElementById("CODCOMPONENTESSERVINTERNO___"+index).value = selectedItem["CODTB2FAT"]
	}

	if (selectedItem.inputId.split('___', 1)[0] == "DESCRICAOCOMPLETASERVEXTERNO") {
		var codigoprd = selectedItem["DESCRICAOCOMPLETA"].split("  -  ")[0]
		var c1 = DatasetFactory.createConstraint("CODIGOPRD", codigoprd, codigoprd, ConstraintType.MUST);
		var constraints = new Array(c1);
		try{
			var dataset = DatasetFactory.getDataset("ds_OSE_Servicos_Externos", null, constraints, null);
			var row = dataset.values[0];
			document.getElementById("CODIGOSERVICOEXTERNO___"+index).value = row["CODIGOPRD"]
			document.getElementById("DESCRICAOSERVICOEXTERNO___"+index).value = row["NOMEFANTASIA"]
			document.getElementById("UNIDADESERVICOEXTERNO___"+index).value = row["UNIDADECOMPRA"]
			document.getElementById("IDPRDSERVICOEXTERNO___"+index).value = row["IDPRD"]
			document.getElementById("ULTIMOPRECOSERVICOEXTERNO___"+index).value = row["ULTIMOPRECO"]
			if(row["GRUPOCOMPONENTE"] != "null"){
			document.getElementById("CODCOMPONENTESSERVEXTERNO___"+index).value = row["CODGRUPOCOMPONENTE"]
			setZoomData("GRUPODECOMPONENTESSERVEXTERNO___"+index,row["GRUPOCOMPONENTE"])
			}
		}catch(e){
			console.log("Erro ao consultar dataset: " + e);
		}
	}
	if (selectedItem.inputId.split('___', 1)[0] == "GRUPODECOMPONENTESSERVEXTERNO") {
		document.getElementById("CODCOMPONENTESSERVEXTERNO___"+index).value = selectedItem["CODTB2FAT"]
	}
	
}
//==============================================================================================================================================
function setZoomData(instance, value) {
	window[instance].setValue(value);
}
//==============================================================================================================================================
function removedZoomItem(removedItem) {

	if (removedItem.inputId == "OBJETODEMANUTENCAO") {
		document.getElementById("SERIE").value = ""
		document.getElementById("STATUS").value = ""
		document.getElementById("CODMODELO").value = ""
		document.getElementById("MODELO").value = ""
		document.getElementById("CODSUBMODELO").value = ""
		document.getElementById("SUBMODELO").value = ""
		document.getElementById("CODTIPOOBJ").value = ""
		document.getElementById("TIPOOBJ").value = ""
		document.getElementById("CODFABRICANTE").value = ""
		document.getElementById("FABRICANTE").value = ""
		document.getElementById("DATACOLETA").value = ""
		document.getElementById("HORIMETROACUMULADO").value = ""
		document.getElementById("HORIMETROMAXIMO").value = ""
		document.getElementById("CODFILIAL").value = ""
		document.getElementById("FILIAL").value = ""
		document.getElementById("CODCENTRODECUSTO").value = ""
		document.getElementById("CENTRODECUSTO").value = ""
		document.getElementById("CODDEPARTAMENTO").value = ""
		document.getElementById("DEPARTAMENTO").value = ""
		document.getElementById("CODLOCALIZACAO").value = ""
		document.getElementById("LOCALIZACAO").value = ""
		document.getElementById("CHAPARESP").value = ""
		document.getElementById("CODCFO").value = ""
	}
	
	if (removedItem.inputId == "CLASSEDAMANUTENCAO") {
		document.getElementById("IDCLASSEDAMANUTENCAO").value = ""
		document.getElementById("IDCLASSEDECOMPRA").value = ""
		document.getElementById("CLASSEDECOMPRA").value = ""
	}
	
	if (removedItem.inputId == "LOCALESTOQUE") {
		document.getElementById("CODLOCALESTOQUE").value = ""
	}

	var string = removedItem.inputId
	var index = string.slice(string.indexOf('___')+3, string.length)
	if (removedItem.inputId.split('___')[0] == "CODIGOPECAORIGINAL") {
		document.getElementById("DESCRICAOPECAORIGINAL___"+index).value = ""
		document.getElementById("UNIDADEPECAORIGINAL___"+index).value = ""
		document.getElementById("IDPRDPECAORIGINAL___"+index).value = ""
		document.getElementById("ULTIMOPRECOPECAORIGINAL___"+index).value = ""
		document.getElementById("CODCOMPONENTESPECAORIGINAL___"+index).value = ""
		setZoomData("GRUPODECOMPONENTESPECAORIGINAL___"+index,"")
		document.getElementById("QUANTIDADEPECAORIGINAL___"+index).value = ""
	}
	
	if (removedItem.inputId.split('___')[0] == "CODIGOPECAAUXILIAR") {
		document.getElementById("DESCRICAOPECAAUXILIAR___"+index).value = ""
		document.getElementById("UNIDADEPECAAUXILIAR___"+index).value = ""
		document.getElementById("IDPRDPECAAUXILIAR___"+index).value = ""
		document.getElementById("ULTIMOPRECOPECAAUXILIAR___"+index).value = ""
		document.getElementById("CODCOMPONENTESPECAAUXILIAR___"+index).value = ""
		setZoomData("GRUPODECOMPONENTESPECAAUXILIAR___"+index,"")
		document.getElementById("QUANTIDADEPECAAUXILIAR___"+index).value = ""
	}

	if (removedItem.inputId.split('___')[0] == "CODIGOPNEUS") {
		document.getElementById("CODIGOPNEUS___"+index).value = ""
		document.getElementById("DESCRICAOPNEUS___"+index).value = ""
		document.getElementById("UNIDADEPNEUS___"+index).value = ""
		document.getElementById("IDPRDPNEUS___"+index).value = ""
		document.getElementById("ULTIMOPRECOPNEUS___"+index).value = ""
		document.getElementById("CODCOMPONENTESPNEUS___"+index).value = ""
		setZoomData("GRUPODECOMPONENTESPNEUS___"+index,"")
		document.getElementById("QUANTIDADEPNEUS___"+index).value = ""
	}

	if (removedItem.inputId.split('___')[0] == "CODIGOOLEO") {
		document.getElementById("CODIGOOLEO___"+index).value = ""
		document.getElementById("DESCRICAOOLEO___"+index).value = ""
		document.getElementById("UNIDADEOLEO___"+index).value = ""
		document.getElementById("IDPRDOLEO___"+index).value = ""
		document.getElementById("ULTIMOPRECOOLEO___"+index).value = ""
		document.getElementById("CODCOMPONENTESOLEO___"+index).value = ""
		setZoomData("GRUPODECOMPONENTESOLEO___"+index,"")
		document.getElementById("QUANTIDADEOLEO___"+index).value = ""
	}

	if (removedItem.inputId.split('___')[0] == "DESCRICAOCOMPLETASERVINTERNO") {
		document.getElementById("CODIGOSERVICOINTERNO___"+index).value = ""
		document.getElementById("DESCRICAOSERVICOINTERNO___"+index).value = ""
		document.getElementById("UNIDADESERVICOINTERNO___"+index).value = ""
		document.getElementById("IDPRDSERVICOINTERNO___"+index).value = ""
		document.getElementById("ULTIMOPRECOSERVICOINTERNO___"+index).value = ""
		document.getElementById("CODCOMPONENTESSERVICOINTERNO___"+index).value = ""
		setZoomData("GRUPODECOMPONENTESSERVICOINTERNO___"+index,"")
		document.getElementById("QUANTIDADESERVICOINTERNO___"+index).value = ""
	}

	if (removedItem.inputId.split('___')[0] == "DESCRICAOCOMPLETASERVEXTERNO") {
		document.getElementById("CODIGOSERVICOEXTERNO___"+index).value = ""
		document.getElementById("DESCRICAOSERVICOEXTERNO___"+index).value = ""
		document.getElementById("UNIDADESERVICOEXTERNO___"+index).value = ""
		document.getElementById("IDPRDSERVICOEXTERNO___"+index).value = ""
		document.getElementById("ULTIMOPRECOSERVICOEXTERNO___"+index).value = ""
		document.getElementById("CODCOMPONENTESSERVICOEXTERNO___"+index).value = ""
		setZoomData("GRUPODECOMPONENTESSERVICOEXTERNO___"+index,"")
		document.getElementById("QUANTIDADESERVICOEXTERNO___"+index).value = ""
	}

}
//==============================================================================================================================================