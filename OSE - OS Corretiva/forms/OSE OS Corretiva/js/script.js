//==============================================================================================================================================
$(document).ready(function() {

    $('.PECAS').hide();
    $('.SERVICOS').hide();
    
  $('li').click(function() {
    // Remover classe "active" de outros itens da lista
    $('li').removeClass('active');

    // Adicionar classe "active" no item clicado
    $(this).addClass('active');

    var opcaoEscolhida = $(this).text();
    if(opcaoEscolhida == "OS"){
        $('.OS').show();
        $('.PECAS').hide();
        $('.SERVICOS').hide();
    } else if(opcaoEscolhida == "SERVIÇO"){
        $('.OS').hide();
        $('.PECAS').hide();
        $('.SERVICOS').show();
    } else if(opcaoEscolhida == "PEÇA"){
        $('.OS').hide();
        $('.PECAS').show();
        $('.SERVICOS').hide();
    }
  });
  

	var table = document.getElementById("TABELA_RMOS").rows.length;
	table < 1 ? addLinhaTabela("TABELA_RMOS") : consultaRMdaOS("TABELA_RMOS");

	table = document.getElementById("TABELA_RSOS").rows.length;
	table < 1 ? addLinhaTabela("TABELA_RSOS") : consultaRSdaOS("TABELA_RSOS");
});
//==============================================================================================================================================
function addLinhaTabela(tabela){

	wdkAddChild(tabela);

	if(tabela = 'TABELA_PECAORIGINAL'){
		var tabela = document.getElementById('TABELA_PECAORIGINAL');
		var inputs = tabela.querySelectorAll('select[id^="CODIGOPECAORIGINAL___"]');
	
		inputs.forEach(function(input) {
		  var id = input.id;
		  //console.log(id)
		  //console.log($("#CODFABRICANTE").val())
		  reloadZoomFilterValues(id, "CODIGOFABRICANTE," + $("#CODFABRICANTE").val());
		});
	}

}
//==============================================================================================================================================
function deleteLinhaTabela(campo, tabela){
	
	if (tabela != "TABELA_MAODEOBRA"){
		fnWdkRemoveChild(campo);
	} else {
		if ((campo.closest('tr').querySelectorAll('.form-group.col-md-2 input')[0].value) == ""){
			fnWdkRemoveChild(campo);
		} else {
			FLUIGC.toast({
				title: 'Atenção: ',
				message: 'Você não pode exluir um HHT que foi iniciado e pausado!',
				type: 'info'
			});
		}
	}

}
//==============================================================================================================================================
function iniciaOS(campo){
	
	var index = $(campo).closest('.row').prev().find('input[id^="MAODEOBRAHORAINICIO___"]').attr('id').split("___")[1];
	if ((document.getElementById('MAODEOBRAHORAINICIO___'+index).value != "" && document.getElementById('MAODEOBRAHORAFIM___'+index).value != "")
		|| (document.getElementById('MAODEOBRAHORAINICIO___'+index).value == "" && document.getElementById('MAODEOBRAHORAFIM___'+index).value == "")){
		document.getElementById('MAODEOBRAHORAINICIO___'+index).value = moment().format('DD/MM/YYYY HH:mm:ss');
		document.getElementById('MAODEOBRAHORAFIM___'+index).value = "";
	} else {
		FLUIGC.toast({
			title: 'Atenção: ',
			message: 'Você já iniciou a OS!',
			type: 'info'
		});
	}
	
}
//==============================================================================================================================================
function finalizaOS(campo){
	
	var index = $(campo).closest('.row').prev().find('input[id^="MAODEOBRAHORAINICIO___"]').attr('id').split("___")[1];
	
	// Obter os valores dos campos de texto
	var dataInicialStr = document.getElementById('MAODEOBRAHORAINICIO___'+index).value;
	

	if (dataInicialStr != "" && document.getElementById('MAODEOBRAHORAFIM___'+index).value == ""){
		
		document.getElementById('MAODEOBRAHORAFIM___'+index).value = moment().format('DD/MM/YYYY HH:mm:ss');
		var dataFinalStr = document.getElementById('MAODEOBRAHORAFIM___'+index).value;
		
		// Converter as datas em objetos Moment
		var dataInicial = moment(dataInicialStr, 'DD/MM/YYYY HH:mm:ss');
		var dataFinal = moment(dataFinalStr, 'DD/MM/YYYY HH:mm:ss');
	
		// Calcular a diferença em horas e minutos
		var diferencaHoras = dataFinal.diff(dataInicial, 'hours');
		var diferencaMinutos = dataFinal.diff(dataInicial, 'minutes') % 60;
		
		diferencaMinutos = diferencaMinutos < 10 ? "0" + diferencaMinutos : diferencaMinutos;
			
		
		addLinhaTabela("MAODEOBRAHHT");
		
		$('input[id^="MAODEOBRANOMEHHT___"]:last').val(document.getElementById('MAODEOBRANOME___'+index).value);
		$('input[id^="MAODEOBRAHORAINICIOHHT___"]:last').val(document.getElementById('MAODEOBRAHORAINICIO___'+index).value); 
		$('input[id^="MAODEOBRAHORAFIMHHT___"]:last').val(document.getElementById('MAODEOBRAHORAFIM___'+index).value);
		$('input[id^="MAODEOBRAHORASTOTAISHHT___"]:last').val(diferencaHoras+":"+diferencaMinutos);
		
		var horasTotais = "00:00"
		$('#MAODEOBRAHHT tr').each(function() {
		    var nome = $(this).find('input[name^="MAODEOBRANOMEHHT"]').val(); // Obter o valor da coluna "MAODEOBRANOMEHHT"
		    var horas = $(this).find('input[name^="MAODEOBRAHORASTOTAISHHT"]').val(); // Obter o valor da coluna "MAODEOBRAHORASTOTAISHHT"
		    
		    
		    if (nome == document.getElementById('MAODEOBRANOME___'+index).value){
		    // Converter os valores para objetos Moment.js
		    	
		    horas = horas.split(":")[0] == "0" ? "0"+horas : horas;
		    
		    var momento1 = moment(horasTotais, 'HH:mm')
		    var momento2 = moment(horas, 'HH:mm');
		    
		    // Somar os momentos
		    var duracao = moment.duration(momento1).add(momento2);
		    var segundos = duracao.asSeconds();
		    var resultado = moment.utc(segundos * 1000).format('HH:mm');

		    horasTotais = resultado;
		    }
		});
		document.getElementById('MAODEOBRAHORASTOTAIS___'+index).value = horasTotais;
		

		var horasTotais = "00:00"
		$('#MAODEOBRAHHT tr').each(function() {
		    var horas = $(this).find('input[name^="MAODEOBRAHORASTOTAISHHT___"]').val(); // Obter o valor da coluna "MAODEOBRAHORASTOTAISHHT"
			if (horas != undefined){
		    	horas = horas.split(":")[0] == "0" ? "0"+horas : horas;
			    
			    var momento1 = moment(horasTotais, 'HH:mm')
			    var momento2 = moment(horas, 'HH:mm');
			    // Somar os momentos
			    var duracao = moment.duration(momento1).add(momento2);
			    var segundos = duracao.asSeconds();
			    horasTotais = moment.utc(segundos * 1000).format('HH:mm');
			}
		});
	    document.getElementById("TOTALHORASEXECUTADAS").value = horasTotais;
		
	} else {
		FLUIGC.toast({
			title: 'Atenção: ',
			message: 'Você precisa iniciar a OS para poder pausar!',
			type: 'info'
		});
	}
}
//==============================================================================================================================================
function consultaRMdaOS(tabela){

	try{
		var c1 = DatasetFactory.createConstraint("IDMOVOS", document.getElementById('OSIDMOV').value,
																document.getElementById('OSIDMOV').value, ConstraintType.MUST);
		
		var constraints = new Array(c1);
		var dataset = DatasetFactory.getDataset('ds_OSE_RM_Status',null,constraints,null);
		
		if(dataset.values.length>0){
			
			var table = document.getElementById(tabela);
			var rowCount = table.rows.length;

			for (var i = 1; i < rowCount; i++) {
		    	fnWdkRemoveChild($('input[id^="RMNUMEROMOV___"]:last')[0]);
		    }
			
			for(var i=0;i<dataset.values.length;i++){
					
				wdkAddChild(tabela);
	
		        var row = dataset.values[i];

				$('input[id^="RMIDMOV___"]:last').val( row["IDMOV"] );
				$('input[id^="RMNUMEROMOV___"]:last').val( row["NUMEROMOV"] );
				$('input[id^="RMSTATUS___"]:last').val( row["STATUS"] );
				$('input[id^="RMAPROVACAO___"]:last').val( row["DATAAPROVACAO"] );
				
			}
			
		}
	} catch (e){
		console.log("error: "+e);
	}
}
//==============================================================================================================================================
function consultaRSdaOS(tabela){
	
	try{
		var c1 = DatasetFactory.createConstraint("IDMOVOS", document.getElementById('OSIDMOV').value,
																document.getElementById('OSIDMOV').value, ConstraintType.MUST);
		
		var constraints = new Array(c1);
		var dataset = DatasetFactory.getDataset('ds_OSE_RS_Status',null,constraints,null);
		
		if(dataset.values.length>0){
			
			var table = document.getElementById(tabela);
			var rowCount = table.rows.length;

			for (var i = 1; i < rowCount; i++) {
		    	fnWdkRemoveChild($('input[id^="RSNUMEROMOV___"]:last')[0]);
		    }

			for(var i=0;i<dataset.values.length;i++){
					
				wdkAddChild(tabela);
	
		        var row = dataset.values[i];
				
				$('input[id^="RSIDMOV___"]:last').val( row["IDMOV"] );
				$('input[id^="RSNUMEROMOV___"]:last').val( row["NUMEROMOV"] );
				$('input[id^="RSSTATUS___"]:last').val( row["STATUS"] );
				$('input[id^="RSAPROVACAO___"]:last').val( row["DATAAPROVACAO"] );
				
			}
			
		}
	} catch (e){
		console.log("error: "+e);
	}
	
}





