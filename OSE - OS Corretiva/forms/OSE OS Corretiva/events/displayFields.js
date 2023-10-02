function displayFields(form,customHTML){

	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
	//form.setValue("NUMSTATE", getValue("WKNumState"))
	customHTML.append('<script>document.getElementById("TABELA_MAODEOBRA").style.setProperty("nodeletebutton", "true")</script>');
	if (getValue("WKNumState") != "0" && getValue("WKNumState") != "4" && getValue("WKNumState") != "16"){
		
		customHTML.append("<script>$('#TABELA_MAODEOBRA_BOTAO').prop('disabled', true);</script>");

		customHTML.append("<script>$('.btn-block').prop('disabled', true);</script>");
		customHTML.append("<script>$('.btn-block').hide();</script>");
		
		customHTML.append("<script>$('#DETALHESTECNICOS_BOTAO').prop('disabled', true);</script>");
		
	}

	if (getValue("WKNumState") != "0" && getValue("WKNumState") != "4" && getValue("WKNumState") != "5"){
		customHTML.append("<script>$('#TABELA_PECAORIGINAL_BOTAO').prop('disabled', true);</script>");
		customHTML.append("<script>$('#TABELA_PECAAUXILIAR_BOTAO').prop('disabled', true);</script>");
		customHTML.append("<script>$('#TABELA_PNEUS_BOTAO').prop('disabled', true);</script>");
		customHTML.append("<script>$('#TABELA_OLEOS_BOTAO').prop('disabled', true);</script>");
		customHTML.append("<script>$('#TABELA_SERVICOSINTERNOS_BOTAO').prop('disabled', true);</script>");
		customHTML.append("<script>$('#TABELA_SERVICOSEXTERNOS_BOTAO').prop('disabled', true);</script>");
	}

	if (getValue("WKNumState") == "0" || getValue("WKNumState") == "4"){
		form.setVisibleById("DIVHITORICOANALISE",false);
		form.setVisibleById("DIVHITORICOREQUISICOES",false);
	}
	
}