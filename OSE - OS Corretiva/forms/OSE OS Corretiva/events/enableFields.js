function enableFields(form){
	
	form.setEnhancedSecurityHiddenInputs(true);
	
	if (getValue("WKNumState") != "0" && getValue("WKNumState") != "4"){
        //form.setEnabled("TABELA_MAODEOBRA_BOTAO",false);
        form.setEnabled("OBJETODEMANUTENCAO",false);
        form.setEnabled("HORIMETROMEDIDOR",false);
        form.setEnabled("LOCALESTOQUE",false);
        form.setEnabled("SERVICOASEREXECUTADO",false);
        
        var indexes = form.getChildrenIndexes("TABELA_MAODEOBRA");
        for (var i = 0; i < indexes.length; i++) {
            form.setEnabled("MAODEOBRANOME___" + indexes[i], false);
        }
        
        ///=-=-=-=-=-=-=-=-=-=-=

		var indexes = form.getChildrenIndexes("TABELA_PECAORIGINAL");
        for (var i = 0; i < indexes.length; i++) {
            form.setEnabled("CODIGOPECAORIGINAL___" + indexes[i], false);
            form.setEnabled("QUANTIDADEPECAORIGINAL___" + indexes[i], false);
            form.setEnabled("GRUPODECOMPONENTESPECAORIGINAL___" + indexes[i], false);
        }

        var indexes = form.getChildrenIndexes("TABELA_PECAAUXILIAR");
        for (var i = 0; i < indexes.length; i++) {
            form.setEnabled("CODIGOPECAAUXILIAR___" + indexes[i], false);
            form.setEnabled("QUANTIDADEPECAAUXILIAR___" + indexes[i], false);
            form.setEnabled("GRUPODECOMPONENTESPECAAUXILIAR___" + indexes[i], false);
        }

        var indexes = form.getChildrenIndexes("TABELA_PNEUS");
        for (var i = 0; i < indexes.length; i++) {
            form.setEnabled("CODIGOPNEUS___" + indexes[i], false);
            form.setEnabled("QUANTIDADEPNEUS___" + indexes[i], false);
            form.setEnabled("GRUPODECOMPONENTESPNEUS___" + indexes[i], false);
        }

        var indexes = form.getChildrenIndexes("TABELA_OLEOS");
        for (var i = 0; i < indexes.length; i++) {
            form.setEnabled("CODIGOOLEO___" + indexes[i], false);
            form.setEnabled("QUANTIDADEOLEO___" + indexes[i], false);
            form.setEnabled("GRUPODECOMPONENTESOLEO___" + indexes[i], false);
        }

        var indexes = form.getChildrenIndexes("TABELA_SERVICOSINTERNOS");
        for (var i = 0; i < indexes.length; i++) {
            form.setEnabled("DESCRICAOCOMPLETASERVINTERNO___" + indexes[i], false);
            form.setEnabled("QUANTIDADESERVICOINTERNO___" + indexes[i], false);
            form.setEnabled("GRUPODECOMPONENTESSERVINTERNO___" + indexes[i], false);
        }

        var indexes = form.getChildrenIndexes("TABELA_SERVICOSEXTERNOS");
        for (var i = 0; i < indexes.length; i++) {
            form.setEnabled("DESCRICAOCOMPLETASERVEXTERNO___" + indexes[i], false);
            form.setEnabled("QUANTIDADESERVICOEXTERNO___" + indexes[i], false);
            form.setEnabled("GRUPODECOMPONENTESSERVEXTERNO___" + indexes[i], false);
        }
	}
	
	if (getValue("WKNumState") != "0" && getValue("WKNumState") != "4" && getValue("WKNumState") != "5"){
        form.setEnabled("CLASSEDAMANUTENCAO",false);
	}
	
	if (getValue("WKNumState") != "0" && getValue("WKNumState") != "4" && getValue("WKNumState") != "16"){
        form.setEnabled("SOLUCAO",false);
	}
	
	if (getValue("WKNumState") != "5" && getValue("WKNumState") != "14"){
        form.setEnabled("FOLLOWUP",false);
	}
	
	if (getValue("WKNumState") != "5"){
        form.setEnabled("HORASPREVISTASEXECUCAO",false);
        form.setEnabled("PRIMEIRAPREVLIBERACAO",false);
        //form.setEnabled("RMCONSULTARAPROVACAO",false);
        //form.setEnabled("RSCONSULTARAPROVACAO",false);
	}
	
	if (getValue("WKNumState") != "14"){
        form.setEnabled("SEGUNDAPREVLIBERACAO",false);
        form.setEnabled("TERCEIRAPREVLIBERACAO",false);
        form.setEnabled("DATALIBERACAOMAQUINA",false);
	}
	
}