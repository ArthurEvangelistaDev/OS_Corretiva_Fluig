function validateForm(form){
	

	var numState = getValue("WKNumState");
	var nextState = getValue("WKNextState");

	//validacaoFinalizaOSComRMRSPendente(form);
	var msg = "<hr><h4>Erro:</h4><p>";

	if ((numState == "0" || numState == "4") && (nextState != "0" && nextState != "4")){
		validacaoServicoMinimo(form);
		validacaoMaoDeObraMinima(form);
		validacaoHorasOS(form);
	}
	if ((numState == "0" || numState == "4") && nextState == "47"){
		validacaoFinalizaOSDireto(form);
	}
	//==============================================================================================================================================
	if (numState == "16" && nextState == "33"){
		validacaoHorasOS(form);
		if (form.getValue("REQUISICOESPENDENTES") == "TEM"){
			throw "Você não pode finalizar essa OS pois existem requisições pendentes para ela!"
		}
	}
	//==============================================================================================================================================
	if (msg != "<hr><h4>Erro:</h4><p>"){
		
		msg += "</p><hr>";
		
		throw msg;
		
	}
	
}

function validacaoServicoMinimo(form){
	
	var servicoInterno = form.getChildrenIndexes("TABELA_SERVICOSINTERNOS");
	var servicoExterno = form.getChildrenIndexes("TABELA_SERVICOSEXTERNOS");

	if (servicoInterno.length+servicoExterno.length < 1){
		throw "É obrigatório ter pelo menos um serviço na OS!";
	} else if (servicoInterno.length > 0){
		for (var i = 0; i < servicoInterno.length; i++) {
	        if (form.getValue("DESCRICAOCOMPLETASERVINTERNO___" + servicoInterno[i]) == ""){
	        	throw "É obrigatório preencher a Descrição do serviço!";
	        }
	        if (form.getValue("GRUPODECOMPONENTESSERVINTERNO___" + servicoInterno[i]) == ""){
	        	throw "É obrigatório preencher o Component do serviço!";
	        }
	        if (form.getValue("QUANTIDADESERVICOINTERNO___" + servicoInterno[i]) == ""){
	        	throw "É obrigatório preencher a Quantidade do serviço!";
	        }
	    }
	} else if (servicoExterno.length > 0){
		for (var i = 0; i < servicoInterno.length; i++) {
	        if (form.getValue("DESCRICAOCOMPLETASERVEXTERNO___" + servicoInterno[i]) == ""){
	        	throw "É obrigatório preencher a Descrição do serviço!";
	        }
	        if (form.getValue("GRUPODECOMPONENTESSERVEXTERNO___" + servicoInterno[i]) == ""){
	        	throw "É obrigatório preencher o Component do serviço!";
	        }
	        if (form.getValue("QUANTIDADESERVICOEXTERNO___" + servicoInterno[i]) == ""){
	        	throw "É obrigatório preencher a Quantidade do serviço!";
	        }
	    }
	}
	
}

function validacaoFinalizaOSDireto(form){
	
	var servicoInterno = form.getChildrenIndexes("TABELA_SERVICOSINTERNOS");
	var servicoExterno = form.getChildrenIndexes("TABELA_SERVICOSEXTERNOS");
	var pecaOriginal = form.getChildrenIndexes("TABELA_PECAORIGINAL");
	var pecaAuxiliar = form.getChildrenIndexes("TABELA_PECAAUXILIAR");
	var pecaPneu = form.getChildrenIndexes("TABELA_PNEUS");
	var pecaOleo = form.getChildrenIndexes("TABELA_OLEOS");

	if (servicoInterno.length < 1 || servicoExterno.length > 0
			|| pecaOriginal.length > 0 || pecaAuxiliar.length > 0
			 	|| pecaPneu.length > 0 || pecaOleo.length > 0){
		throw "Só é possível finalizar a OS diretamente com Serviços Internos!";
	}
	
}

function validacaoMaoDeObraMinima(form){
	
	var maodeobra = form.getChildrenIndexes("TABELA_MAODEOBRA");

	if (maodeobra.length < 1){
		throw "É obrigatório ter pelo menos um registro de Mão de Obra!";
	}
	
}

function validacaoHorasOS(form){
	
	var indexes = form.getChildrenIndexes("TABELA_MAODEOBRA");
	
    for (var i = 0; i < indexes.length; i++) {
        if (form.getValue("MAODEOBRANOME___" + indexes[i]) == "") {throw "É obrigatório selecionar o técnico em Mão de Obra!"}
        if (form.getValue("MAODEOBRAHORASTOTAIS___" + indexes[i]) == "") {throw "Você não Pausou a OS para todos os técnicos!"}
    }
    
    if (form.getValue("HORIMETROMEDIDOR") == "") {throw "É obrigatório preencher o campo Horimetro Medidor!"}
    if (new String(form.getValue("HORIMETROMEDIDOR")).toLowerCase().match(/e/)) {throw "O campo Horimetro Medidor só aceita números, favor validar o preenchimento!"}
    if (form.getValue("CLASSEDAMANUTENCAO") == "") {throw "É obrigatório preencher o campo Classe da Manutenção!"}
    
}

function validacaoFinalizaOSComRMRSPendente(form){
	try{
		var c1 = DatasetFactory.createConstraint("IDMOVOS", form.getValue('OSNUMEROMOV'),
																form.getValue('OSNUMEROMOV'), ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("STATUS", 'BLOQUEADO', 'BLOQUEADO', ConstraintType.MUST_NOT);
		
		var constraints = new Array(c1, c2);
		var dataset = DatasetFactory.getDataset('ds_OSE_RM_Status',null,constraints,null);
		throw "TESTE" +dataset.values.length
		if(dataset.values.length>0){
		
			throw dataset
		
		}
		//==============================================================================================================================
		var c1 = DatasetFactory.createConstraint("IDMOVOS", form.getValue('OSNUMEROMOV'),
																form.getValue('OSNUMEROMOV'), ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("STATUS", 'RECEBIDO', 'RECEBIDO', ConstraintType.MUST_NOT);
		
		var constraints = new Array(c1, c2);
		var dataset = DatasetFactory.getDataset('ds_OSE_RS_Status',null,constraints,null);
		
		if(dataset.values.length>0){

			throw dataset
			
		}
	} catch (e){
		throw("error: "+e);
	}
	
}
