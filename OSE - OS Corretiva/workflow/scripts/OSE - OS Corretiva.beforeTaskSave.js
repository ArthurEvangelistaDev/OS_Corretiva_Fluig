function beforeTaskSave(colleagueId,nextSequenceId,userList){
	
	if (nextSequenceId == "5" || nextSequenceId == "18"){
		// Obtém a data e hora atuais
		var dataAtual = new Date();
		
		// Extrai as partes necessárias da data e hora
		var dia = dataAtual.getDate() < 10 ? '0' + dataAtual.getDate() : dataAtual.getDate();
		var mes = (dataAtual.getMonth() + 1) < 10 ? '0' + (dataAtual.getMonth() + 1) : (dataAtual.getMonth() + 1); // Mês começa em zero
		var ano = dataAtual.getFullYear();
		var hora = dataAtual.getHours() < 10 ? '0' + dataAtual.getHours() : dataAtual.getHours();
		var minutos = dataAtual.getMinutes() < 10 ? '0' + dataAtual.getMinutes() : dataAtual.getMinutes();

		// Formata a data e hora no padrão desejado
		var dataFormatada = dia + '/' + mes + '/' + ano + ' - ' + hora + ':' + minutos;

		console.log(dataFormatada);
		nextSequenceId == "5" ? hAPI.setCardValue("DATAINICIOOS", dataFormatada) : hAPI.setCardValue("DATATERMINOOS", dataFormatada);
		if (nextSequenceId == "18" && hAPI.getCardValue("DATAINICIOOS") == ""){
			hAPI.setCardValue("DATAINICIOOS", dataFormatada);
		}
	}
	
	if ((nextSequenceId == 14 || nextSequenceId == 16) && getValue("WKNumState") != "16"){
		atualizacaoCamposControlador();
	}
	
	if (nextSequenceId == 24 || nextSequenceId == 47){
		validacaoHorimetroCorreto();
	}
	
	if (nextSequenceId == 16){
		validacaoRMRSPendente();
	}
	
	var login = fluigAPI.getUserService().getCurrent().getLogin();
	var primeiraLetra = login.substring(0, 1).toUpperCase();
	var restoDaString = login.slice(1);
	var codusuario = primeiraLetra + restoDaString;
	
	var dataset = DatasetFactory.getDataset("ds_OSE_Valida_Acessos", 
	        null, 
	        [DatasetFactory.createConstraint("CODUSUARIO", codusuario, codusuario, ConstraintType.MUST)],
	        null);
	var temacesso = true
	for(var i = 0; i < dataset.rowsCount; i++) {
        if (dataset.getValue(i, "TEMACESSO") == 'FALSE'){temacesso = false};
    }
	
		if ((getValue("WKNumState") == "0" || getValue("WKNumState") == "4") && nextSequenceId == 5){
			if (temacesso){criacaoOSCorretiva()} else {throw "\n\nVocê não tem todos os acessos para proseguir com o processo!\n\n"}
		}
		if ((getValue("WKNumState") == "0" || getValue("WKNumState") == "4") && nextSequenceId == 18){
			if (temacesso){criaFinalizaOSCorretiva();} else {throw "\n\nVocê não tem todos os acessos para proseguir com o processo!\n\n"}
		}
		if (getValue("WKNumState") == "16" && nextSequenceId == 18){
			if (temacesso){finalizacaoOSCorretiva();} else {throw "\n\nVocê não tem todos os acessos para proseguir com o processo!\n\n"}
		}
	
}

function atualizacaoCamposControlador(){

	var nomeDataserver = "MOVMOVIMENTOTBCDATA"
	log.info("nomeDataserver: "+nomeDataserver)
	
	var user = DatasetFactory.getDataset("ds_connector", null, null, null);
	log.info("user: "+user)
	
	var usuario = user.getValue(0, "INTEGRADOR")
	log.info("usuario: "+usuario)
	var senha = user.getValue(0, "SENHA")
	//log.info("senha: "+senha)
	var email = user.getValue(0, "EMAIL")
	log.info("email: "+email)

	var login = fluigAPI.getUserService().getCurrent().getLogin();
	var primeiraLetra = login.substring(0, 1).toUpperCase();
	log.info("primeiraLetra: "+primeiraLetra)
	var restoDaString = login.slice(1);
	log.info("restoDaString: "+restoDaString)
	var codusuario = primeiraLetra + restoDaString;
	
	var contexto = "codcoligada=1;codusuario="+codusuario+";codsistema=N"
		log.info("contexto: "+contexto)
		
	var authService = getWebService(usuario, senha)
	log.info("authService: "+authService)
	
	
	var idmov = hAPI.getCardValue("OSIDMOV")
    //xml que envia as informaçoes para o RM    
	var xml = ""+
	"<MovMovimento>"+
	
	"<TMOV>"+
	"<CODCOLIGADA>1</CODCOLIGADA>"+
	"<IDMOV>"+idmov+"</IDMOV>"+
	"<IDCLASSMOV>"+hAPI.getCardValue("IDCLASSEDAMANUTENCAO")+"</IDCLASSMOV>"+
	"</TMOV>"+
	"<TMOVCOMPL>"+
	"<CODCOLIGADA>1</CODCOLIGADA>"+
	"<IDMOV>"+idmov+"</IDMOV>"+
	"<DATA1>"+hAPI.getCardValue("PRIMEIRAPREVLIBERACAO")+"</DATA1>"+
	"<DATA2>"+hAPI.getCardValue("SEGUNDAPREVLIBERACAO")+"</DATA2>"+
	"<DATA3>"+hAPI.getCardValue("TERCEIRAPREVLIBERACAO")+"</DATA3>"+
	"<OBV1>"+hAPI.getCardValue("FOLLOWUP")+"</OBV1>"+
	"</TMOVCOMPL>";

	xml = xml+"</MovMovimento>"
			
			log.error("xml: ")
			log.error(xml)
			
				
	var result = new String( authService.saveRecord(nomeDataserver, xml, contexto) );
	hAPI.setCardValue("OSIDMOV", result.split(";")[1])
	log.error("result: "+result);
	//String DataServerName, String XML, String UserName, String UserPassword, String contexto, String emailUsuarioContexto
	
	if (result.split(";")[0] != "1"){
		throw "ERRO AO ATUALIZAR CAMPOS DE ANÁLISE DE MANUTENÇÃO DA OS"
	}
		
}

function criacaoOSCorretiva(){
	
	var user = DatasetFactory.getDataset("ds_connector", null, null, null);
	log.info("user: "+user)
	
	var usuario = user.getValue(0, "INTEGRADOR")
	log.info("usuario: "+usuario)
	var senha = user.getValue(0, "SENHA")
	//log.info("senha: "+senha)
	var email = user.getValue(0, "EMAIL")
	log.info("email: "+email)
	
	var login = fluigAPI.getUserService().getCurrent().getLogin();
	var primeiraLetra = login.substring(0, 1).toUpperCase();
	log.info("primeiraLetra: "+primeiraLetra)
	var restoDaString = login.slice(1);
	log.info("restoDaString: "+restoDaString)
	var codusuario = primeiraLetra + restoDaString;
	
	var contexto = "codcoligada=1;codusuario="+codusuario+";codsistema=N"
		log.info("contexto: "+contexto)
		
	var authService = getWebService(usuario, senha)
	log.info("authService: "+authService)
	
	var idmov = hAPI.getCardValue("OSIDMOV") != "" ? hAPI.getCardValue("OSIDMOV") : "-1";
	

	//=================================================================================
	
	var nomeDataserver = "MntHistIndicadorData";
	
	// Obtém a data atual
	var dataAtual = new Date();
	
	// Extrai os componentes da data
	var ano = dataAtual.getFullYear();
	var mes = (dataAtual.getMonth() + 1) < 10 ? "0"+(dataAtual.getMonth() + 1) : (dataAtual.getMonth() + 1); // Os meses são indexados a partir de 0
	var dia = (dataAtual.getDate()) < 10 ? "0"+(dataAtual.getDate()) : (dataAtual.getDate());
	var horas = (dataAtual.getHours()) < 10 ? "0"+(dataAtual.getHours()) : (dataAtual.getHours());
	var minutos = (dataAtual.getMinutes()) < 10 ? "0"+(dataAtual.getMinutes()) : (dataAtual.getMinutes());
	var segundos = (dataAtual.getSeconds()) < 10 ? "0"+(dataAtual.getSeconds()) : (dataAtual.getSeconds());
	
	// Formata a data
	var dataFormatada = ano+"-"+mes+"-"+dia+"T"+horas+":"+minutos+":"+segundos
            
	var dataColeta = hAPI.getCardValue("DATACOLETA").split(" ")[0]
	dataColeta = new Date(dataColeta.split("-")[0], dataColeta.split("-")[1]-1, dataColeta.split("-")[2]);
	log.error("DataColeta: " + dataColeta);
	log.error("DataAtual: " + new Date(ano, mes-1, dia));
	if ( (new Date(ano, mes-1, dia) > dataColeta) ||
					(new Date(ano, mes-1, dia) == dataColeta &&
							hAPI.getCardValue("HORIMETROMEDIDOR").replace(".", ",") != hAPI.getCardValue("HORIMETROACUMULADO").replace(".", ",")) ){
	    //xml que envia as informaçoes para o RM    
		var xml = "<NewDataSet>"+
					"<OFHistIndicador>"+
				    "<CODCOLIGADA>1</CODCOLIGADA>"+
					  "<IDOBJOF>" +hAPI.getCardValue("OBJETODEMANUTENCAO")+ "</IDOBJOF>"+
						"<IDHISTINDICADOR>-1</IDHISTINDICADOR>"+
						"<DATACOLETA>" +dataFormatada+ "</DATACOLETA>"+
						"<CODUSUARIO>" +codusuario+ "</CODUSUARIO>"+
						"<VALORMEDIDOR1>" +hAPI.getCardValue("HORIMETROMEDIDOR").replace(".", ",")+ "</VALORMEDIDOR1>"+
						"<VALORACUMULADO1>" +hAPI.getCardValue("HORIMETROMEDIDOR").replace(".", ",")+ "</VALORACUMULADO1>"+
					"</OFHistIndicador>"+
			"</NewDataSet>";
					
		var result = new String( authService.saveRecord(nomeDataserver, xml, contexto) );
		log.error("result: "+result);
		
		if (result.split(";")[1] != hAPI.getCardValue("OBJETODEMANUTENCAO")){
			throw "ERRO AO LANÇAR HORIMETRO DA MAQUINA"
		}
	}

	//=================================================================================
	

	var nomeDataserver = "MOVMOVIMENTOTBCDATA"
	log.info("nomeDataserver: "+nomeDataserver)
	
    //xml que envia as informaçoes para o RM    
	var xml = ""+
	"<MovMovimento>"+
	
	"<TMOV>"+
		"<CODCOLIGADA>1</CODCOLIGADA>"+
		"<IDMOV>"+idmov+"</IDMOV>"+
		"<CODFILIAL>"+hAPI.getCardValue("CODFILIAL")+"</CODFILIAL>"+
		"<CODTMV>1.1.20</CODTMV>"+
		"<CODLOC>"+hAPI.getCardValue("CODLOCALESTOQUE").trim()+"</CODLOC>"+
		"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
		"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
		"<CODTB1FAT>02</CODTB1FAT>"+
		"<CODTB3FAT>"+hAPI.getCardValue("IDCLASSEDECOMPRA")+"</CODTB3FAT>"+
		"<HISTORICOLONGO>"+hAPI.getCardValue("SERVICOASEREXECUTADO")+"</HISTORICOLONGO>"+
		"<IDCLASSMOV>"+hAPI.getCardValue("IDCLASSEDAMANUTENCAO")+"</IDCLASSMOV>"+
		"<IDOBJOF>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOF>";
		//"<CODCFO>"+hAPI.getCardValue("CODCFO")+"</CODCFO>";
	
		if (hAPI.getCardValue("CHAPARESP") == "NÃO PREENCHIDO NO TOTVS"){
			xml = xml+"<CHAPARESP>004738</CHAPARESP>";
		} else {
			xml = xml+"<CHAPARESP>"+hAPI.getCardValue("CHAPARESP")+"</CHAPARESP>";
		}
	xml = xml+"</TMOV>";
	
	
	var NSEQITMMOV = 1;
	var indexes = hAPI.getChildrenIndexes("TABELA_PECAORIGINAL");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDPECAORIGINAL___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADEPECAORIGINAL___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOPECAORIGINAL___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESPECAORIGINAL___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>"+idmov+"</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDPECAORIGINAL___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADEPECAORIGINAL___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOPECAORIGINAL___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESPECAORIGINAL___"+1)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_PECAAUXILIAR");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDPECAAUXILIAR___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADEPECAAUXILIAR___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOPECAAUXILIAR___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESPECAAUXILIAR___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>"+idmov+"</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDPECAAUXILIAR___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADEPECAAUXILIAR___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOPECAAUXILIAR___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESPECAAUXILIAR___"+1)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_PNEUS");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDPNEUS___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADEPNEUS___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOPNEUS___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESPNEUS___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>"+idmov+"</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDPNEUS___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADEPNEUS___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOPNEUS___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESPNEUS___"+i)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_OLEOS");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDOLEO___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADEOLEO___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOOLEO___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESOLEO___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>"+idmov+"</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDOLEO___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADEOLEO___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOOLEO___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESOLEO___"+1)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_SERVICOSINTERNOS");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDSERVICOINTERNO___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADESERVICOINTERNO___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOSERVICOINTERNO___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESSERVINTERNO___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>"+idmov+"</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDSERVICOINTERNO___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADESERVICOINTERNO___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOSERVICOINTERNO___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESSERVINTERNO___"+1)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_SERVICOSEXTERNOS");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDSERVICOEXTERNO___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADESERVICOEXTERNO___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOSERVICOEXTERNO___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESSERVEXTERNO___"+i) == "" ? true : false;
		if (!temValor){
				xml = xml+"<TITMMOV>"+
					"<CODCOLIGADA>1</CODCOLIGADA>"+
					"<IDMOV>"+idmov+"</IDMOV>"+
					"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
					"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
					"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
					"<IDPRD>"+hAPI.getCardValue("IDPRDSERVICOEXTERNO___"+i)+"</IDPRD>"+
					"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADESERVICOEXTERNO___"+i).replace(".",",")+"</QUANTIDADE>"+
					"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOSERVICOEXTERNO___"+i).replace(".",",")+"</PRECOUNITARIO>"+
					"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESSERVEXTERNO___"+1)+"</CODTB2FAT>"+
					"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
					"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
			 	"</TITMMOV>";
				NSEQITMMOV++;
		}
	}
 	
	xml = xml+"</MovMovimento>";
			
			log.error("xml: ")
			log.error(xml)
			
				
	var result = new String( authService.saveRecord(nomeDataserver, xml, contexto) );
	hAPI.setCardValue("OSIDMOV", result.split(";")[1])
	log.error("result: "+result);
	//String DataServerName, String XML, String UserName, String UserPassword, String contexto, String emailUsuarioContexto
	
	if (result.split(";")[0] != "1"){
		throw "ERRO AO CRIAR A OS"
	} else {
		var dataset = DatasetFactory.getDataset("ds_OSE_Numero_OS", 
				        null, 
				        [DatasetFactory.createConstraint("IDMOV", result.split(";")[1], result.split(";")[1], ConstraintType.MUST)],
				        null);
		hAPI.setCardValue("OSNUMEROMOV",  dataset.getValue(0, "NUMEROMOV"))
	}
	
	try{
		//Execução a seguir altera a OS criada do status "normal" para o "Aguardando Análise"
		var xml = "<MovMovimento>"+
					  "<TMOV>"+
					    "<CODCOLIGADA>1</CODCOLIGADA>"+
					    "<IDMOV>"+result.split(";")[1]+"</IDMOV>"+
					    "<STATUS>O</STATUS>"+
					  "</TMOV>"+
					"</MovMovimento>";
					    
		var result = new String( authService.saveRecord(nomeDataserver, xml, contexto) );
		log.error("result Status: "+result);
		
		if (result.split(";")[0] != "1"){
			throw "ERRO AO PREENCHER STATUS CORRETO DA OS"
		}
	}catch (e){
		throw e
	}
}

function finalizacaoOSCorretiva(){
	
	var nomeDataserver = "MOVMOVIMENTOTBCDATA"
	log.info("nomeDataserver: "+nomeDataserver)
	
	var user = DatasetFactory.getDataset("ds_connector", null, null, null);
	log.info("user: "+user)
	
	var usuario = user.getValue(0, "INTEGRADOR")
	log.info("usuario: "+usuario)
	var senha = user.getValue(0, "SENHA")
	//log.info("senha: "+senha)
	var email = user.getValue(0, "EMAIL")
	log.info("email: "+email)

	var login = fluigAPI.getUserService().getCurrent().getLogin();
	var primeiraLetra = login.substring(0, 1).toUpperCase();
	log.info("primeiraLetra: "+primeiraLetra)
	var restoDaString = login.slice(1);
	log.info("restoDaString: "+restoDaString)
	var codusuario = primeiraLetra + restoDaString;
	
	var contexto = "codcoligada=1;codusuario="+codusuario+";codsistema=N"
		log.info("contexto: "+contexto)
		
	var authService = getWebService(usuario, senha)
	log.info("authService: "+authService)
	
	// Obtém a data atual
	var dataAtual = new Date();
	
	// Extrai os componentes da data
	var ano = dataAtual.getFullYear();
	var mes = (dataAtual.getMonth() + 1) < 10 ? "0"+(dataAtual.getMonth() + 1) : (dataAtual.getMonth() + 1); // Os meses são indexados a partir de 0
	var dia = (dataAtual.getDate()) < 10 ? "0"+(dataAtual.getDate()) : (dataAtual.getDate());
	var horas = (dataAtual.getHours()) < 10 ? "0"+(dataAtual.getHours()) : (dataAtual.getHours());
	var minutos = (dataAtual.getMinutes()) < 10 ? "0"+(dataAtual.getMinutes()) : (dataAtual.getMinutes());
	var segundos = (dataAtual.getSeconds()) < 10 ? "0"+(dataAtual.getSeconds()) : (dataAtual.getSeconds());
	
	// Formata a data
	var dataFormatada = ano+"-"+mes+"-"+dia+"T"+horas+":"+minutos+":"+segundos
	
	var historicoLongo = String(hAPI.getCardValue("SERVICOASEREXECUTADO")).replace(/\r?\n/g, '\n') + '\n' + String(hAPI.getCardValue("SOLUCAO")).replace(/\r?\n/g, '\n');
	
	var xml = "<MovMovimento>"+
				  "<TMOV>"+
				    "<CODCOLIGADA>1</CODCOLIGADA>"+
				    "<IDMOV>"+hAPI.getCardValue("OSIDMOV")+"</IDMOV>"+
				    "<STATUS>Z</STATUS>"+
				    "<DATAEXTRA1>"+dataFormatada+"</DATAEXTRA1>"+
				    "<DATAEXTRA2>"+dataFormatada+"</DATAEXTRA2>"+
					"<HISTORICOLONGO>"+historicoLongo+"</HISTORICOLONGO>"+
				  "</TMOV>"+
				  "<TMOVCOMPL>"+
					"<CODCOLIGADA>1</CODCOLIGADA>"+
					"<IDMOV>"+hAPI.getCardValue("OSIDMOV")+"</IDMOV>"+
					"<ATUALIZACAO2>"+dataFormatada+"</ATUALIZACAO2>"+
				  "</TMOVCOMPL>"+
				"</MovMovimento>";

	log.error("xml: ")
	log.error(xml)
				    
	var result = new String( authService.saveRecord(nomeDataserver, xml, contexto) );
	log.error("result Status: "+result);
	if (result != ("1;"+hAPI.getCardValue("OSIDMOV"))){
		throw "ERRO AO FINALIZAR OS"
	}
		
}

function criaFinalizaOSCorretiva(){
	
	var nomeDataserver = "MOVMOVIMENTOTBCDATA"
	log.info("nomeDataserver: "+nomeDataserver)
	
	var user = DatasetFactory.getDataset("ds_connector", null, null, null);
	log.info("user: "+user)
	
	var usuario = user.getValue(0, "INTEGRADOR")
	log.info("usuario: "+usuario)
	var senha = user.getValue(0, "SENHA")
	//log.info("senha: "+senha)
	var email = user.getValue(0, "EMAIL")
	log.info("email: "+email)
	
	var login = fluigAPI.getUserService().getCurrent().getLogin();
	var primeiraLetra = login.substring(0, 1).toUpperCase();
	log.info("primeiraLetra: "+primeiraLetra)
	var restoDaString = login.slice(1);
	log.info("restoDaString: "+restoDaString)
	var codusuario = primeiraLetra + restoDaString;
	
	var contexto = "codcoligada=1;codusuario="+codusuario+";codsistema=N";
		log.info("contexto: "+contexto)
		
	var authService = getWebService(usuario, senha)
	log.info("authService: "+authService)
	
    //xml que envia as informaçoes para o RM    
	var xml = ""+
	"<MovMovimento>"+
	
	"<TMOV>"+
		"<CODCOLIGADA>1</CODCOLIGADA>"+
		"<IDMOV>-1</IDMOV>"+
		"<CODFILIAL>"+hAPI.getCardValue("CODFILIAL")+"</CODFILIAL>"+
		"<CODTMV>1.1.20</CODTMV>"+
		"<CODLOC>"+hAPI.getCardValue("CODLOCALESTOQUE").trim()+"</CODLOC>"+
		"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
		"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
		"<CODTB1FAT>02</CODTB1FAT>"+
		"<CODTB3FAT>"+hAPI.getCardValue("IDCLASSEDECOMPRA")+"</CODTB3FAT>"+
		"<HISTORICOLONGO>"+hAPI.getCardValue("SERVICOASEREXECUTADO")+"</HISTORICOLONGO>"+
		"<IDCLASSMOV>"+hAPI.getCardValue("IDCLASSEDAMANUTENCAO")+"</IDCLASSMOV>"+
		"<IDOBJOF>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOF>";
		//"<CODCFO>"+hAPI.getCardValue("CODCFO")+"</CODCFO>";
	
		if (hAPI.getCardValue("CHAPARESP") == "NÃO PREENCHIDO NO TOTVS"){
			xml = xml+"<CHAPARESP>004738</CHAPARESP>";
		} else {
			xml = xml+"<CHAPARESP>"+hAPI.getCardValue("CHAPARESP")+"</CHAPARESP>";
		}
	xml = xml+"</TMOV>";
	
	
	var NSEQITMMOV = 1;
	var indexes = hAPI.getChildrenIndexes("TABELA_PECAORIGINAL");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDPECAORIGINAL___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADEPECAORIGINAL___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOPECAORIGINAL___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESPECAORIGINAL___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>-1</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDPECAORIGINAL___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADEPECAORIGINAL___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOPECAORIGINAL___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESPECAORIGINAL___"+1)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_PECAAUXILIAR");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDPECAAUXILIAR___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADEPECAAUXILIAR___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOPECAAUXILIAR___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESPECAAUXILIAR___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>-1</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDPECAAUXILIAR___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADEPECAAUXILIAR___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOPECAAUXILIAR___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESPECAAUXILIAR___"+1)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_PNEUS");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDPNEUS___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADEPNEUS___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOPNEUS___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESPNEUS___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>-1</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDPNEUS___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADEPNEUS___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOPNEUS___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESPNEUS___"+i)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_OLEOS");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDOLEO___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADEOLEO___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOOLEO___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESOLEO___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>-1</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDOLEO___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADEOLEO___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOOLEO___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESOLEO___"+1)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_SERVICOSINTERNOS");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDSERVICOINTERNO___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADESERVICOINTERNO___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOSERVICOINTERNO___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESSERVINTERNO___"+i) == "" ? true : false;
		if (!temValor){
			xml = xml+"<TITMMOV>"+
				"<CODCOLIGADA>1</CODCOLIGADA>"+
				"<IDMOV>-1</IDMOV>"+
				"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
				"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
				"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
				"<IDPRD>"+hAPI.getCardValue("IDPRDSERVICOINTERNO___"+i)+"</IDPRD>"+
				"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADESERVICOINTERNO___"+i).replace(".",",")+"</QUANTIDADE>"+
				"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOSERVICOINTERNO___"+i).replace(".",",")+"</PRECOUNITARIO>"+
				"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESSERVINTERNO___"+1)+"</CODTB2FAT>"+
				"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
				"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
		 	"</TITMMOV>";
			NSEQITMMOV++;
		}
	}
	//==================================================================================================
	var indexes = hAPI.getChildrenIndexes("TABELA_SERVICOSEXTERNOS");

	for (var i = 1; i <= indexes.length; ++i) {
		var temValor = hAPI.getCardValue("IDPRDSERVICOEXTERNO___"+i) == "" ? true :
						   hAPI.getCardValue("QUANTIDADESERVICOEXTERNO___"+i) == "" ? true :
							   hAPI.getCardValue("ULTIMOPRECOSERVICOEXTERNO___"+i) == "" ? true :
								   hAPI.getCardValue("CODCOMPONENTESSERVEXTERNO___"+i) == "" ? true : false;
		if (!temValor){
				xml = xml+"<TITMMOV>"+
					"<CODCOLIGADA>1</CODCOLIGADA>"+
					"<IDMOV>-1</IDMOV>"+
					"<NSEQITMMOV>"+NSEQITMMOV+"</NSEQITMMOV>"+
					"<CODCCUSTO>"+hAPI.getCardValue("CODCENTRODECUSTO")+"</CODCCUSTO>"+
					"<CODDEPARTAMENTO>"+hAPI.getCardValue("CODDEPARTAMENTO")+"</CODDEPARTAMENTO>"+
					"<IDPRD>"+hAPI.getCardValue("IDPRDSERVICOEXTERNO___"+i)+"</IDPRD>"+
					"<QUANTIDADE>"+hAPI.getCardValue("QUANTIDADESERVICOEXTERNO___"+i).replace(".",",")+"</QUANTIDADE>"+
					"<PRECOUNITARIO>"+hAPI.getCardValue("ULTIMOPRECOSERVICOEXTERNO___"+i).replace(".",",")+"</PRECOUNITARIO>"+
					"<CODTB2FAT>"+hAPI.getCardValue("CODCOMPONENTESSERVEXTERNO___"+1)+"</CODTB2FAT>"+
					"<IDOBJOFICINA>"+hAPI.getCardValue("OBJETODEMANUTENCAO")+"</IDOBJOFICINA>"+
					"<IDTIPOOBJ>"+hAPI.getCardValue("CODTIPOOBJ")+"</IDTIPOOBJ>"+
			 	"</TITMMOV>";
				NSEQITMMOV++;
		}
	}
 	
	xml = xml+"</MovMovimento>"
			
			log.error("xml: ")
			log.error(xml)
			
				
	var result = new String( authService.saveRecord(nomeDataserver, xml, contexto) );
	hAPI.setCardValue("OSIDMOV", result.split(";")[1])
	log.error("result: "+result);
	//String DataServerName, String XML, String UserName, String UserPassword, String contexto, String emailUsuarioContexto
	
	if (result.split(";")[0] != "1"){
		throw "ERRO AO CRIAR A OS"
	} else {
		var dataset = DatasetFactory.getDataset("ds_OSE_Numero_OS", 
				        null, 
				        [DatasetFactory.createConstraint("IDMOV", result.split(";")[1], result.split(";")[1], ConstraintType.MUST)],
				        null);
		hAPI.setCardValue("OSNUMEROMOV",  dataset.getValue(0, "NUMEROMOV"))
	}

	// Obtém a data atual
	var dataAtual = new Date();
	
	// Extrai os componentes da data
	var ano = dataAtual.getFullYear();
	var mes = (dataAtual.getMonth() + 1) < 10 ? "0"+(dataAtual.getMonth() + 1) : (dataAtual.getMonth() + 1); // Os meses são indexados a partir de 0
	var dia = (dataAtual.getDate()) < 10 ? "0"+(dataAtual.getDate()) : (dataAtual.getDate());
	var horas = (dataAtual.getHours()) < 10 ? "0"+(dataAtual.getHours()) : (dataAtual.getHours());
	var minutos = (dataAtual.getMinutes()) < 10 ? "0"+(dataAtual.getMinutes()) : (dataAtual.getMinutes());
	var segundos = (dataAtual.getSeconds()) < 10 ? "0"+(dataAtual.getSeconds()) : (dataAtual.getSeconds());
	
	// Formata a data
	var dataFormatada = ano+"-"+mes+"-"+dia+"T"+horas+":"+minutos+":"+segundos
	
	var historicoLongo = String(hAPI.getCardValue("SERVICOASEREXECUTADO")).replace(/\r?\n/g, '\n') + '\n' + String(hAPI.getCardValue("SOLUCAO")).replace(/\r?\n/g, '\n');
	
	//Execução a seguir altera a OS criada do status "normal" para o "Aguardando Análise"
	var xml = "<MovMovimento>"+
				  "<TMOV>"+
				    "<CODCOLIGADA>1</CODCOLIGADA>"+
				    "<IDMOV>"+hAPI.getCardValue("OSIDMOV")+"</IDMOV>"+
				    "<STATUS>Z</STATUS>"+
				    "<DATAEXTRA1>"+dataFormatada+"</DATAEXTRA1>"+
				    "<DATAEXTRA2>"+dataFormatada+"</DATAEXTRA2>"+
					"<HISTORICOLONGO>"+historicoLongo+"</HISTORICOLONGO>"+
				  "</TMOV>"+
				  "<TMOVCOMPL>"+
					"<CODCOLIGADA>1</CODCOLIGADA>"+
					"<IDMOV>"+hAPI.getCardValue("OSIDMOV")+"</IDMOV>"+
					"<ATUALIZACAO2>"+dataFormatada+"</ATUALIZACAO2>"+
				  "</TMOVCOMPL>"+
				"</MovMovimento>";
				    
	var result = new String( authService.saveRecord(nomeDataserver, xml, contexto) );
	log.error("result Status: "+result);
	
	if (result.split(";")[0] != "1"){
		throw "ERRO AO FINALIZAR STATUS DA OS"
	}
		
}

function getWebService(usuario, senha){
	
	var nomeServico = "wsDataServer"
		log.info("nomeServico: "+nomeServico)
		
	var caminhoServico = "com.totvs.WsDataServer"
		log.info("caminhoServico: "+caminhoServico)
		
	var dataServerService = ServiceManager.getServiceInstance(nomeServico);
	log.info("dataServerService: "+dataServerService)
	
	if (dataServerService == null){
		throw "Erro ao encontrar serviço!";
	}
	
	var locator = dataServerService.instantiate(caminhoServico);
	log.info("locator: "+locator)

	if (locator == null){
		throw "Erro ao instanciar serviço!";
	}
	
	var service = locator.getRMIwsDataServer();
	log.info("service: "+service)

	if (service == null){
		throw "Erro instancia incorreta ou com problemas!";
	}
	
	var serviceHelper = dataServerService.getBean();
	log.info("serviceHelper: "+serviceHelper)

	if (serviceHelper == null){
		throw "Erro no serviço de autenticação!";
	}
	
	var authService = serviceHelper.getBasicAuthenticatedClient(service, "com.totvs.IwsDataServer", usuario, senha)
	log.info("authService: "+authService)

	if (authService == null){
		throw "Erro ao autenticar dataserver!";
	}
	
	return authService;

}
 
function validacaoHorimetroCorreto(){

	try {
		
		var c1 = DatasetFactory.createConstraint("IDOBJOF", hAPI.getCardValue('OBJETODEMANUTENCAO'),
				hAPI.getCardValue('OBJETODEMANUTENCAO'), ConstraintType.MUST);

		var constraints = new Array(c1);
		var dataset = DatasetFactory.getDataset('ds_OSE_Objeto_de_Manutencao_Horimetro',null,constraints,null);
		
        //form.setValue('DATACOLETA', dataset.getValue(0, "DATACOLETA"));
        
        var horimetroAtual = +(hAPI.getCardValue('HORIMETROMEDIDOR'))
        var horimetroMaximo = +(dataset.getValue(0, "HORASMAXIMAS"))
        var horimetroAcumulado = +(dataset.getValue(0, "HORIMETRO"))
        
        log.error("horimetroAtual: "+horimetroAtual)
        log.error("horimetroMaximo: "+horimetroMaximo)
        log.error("horimetroAcumulado: "+horimetroAcumulado)
        if(horimetroAtual > horimetroMaximo){
        	throw "\n\n O Horimetro digitado é maior que o prazo desde a ultima medição! \n\n"; 
        }
        if(horimetroAtual < horimetroAcumulado){
        	throw "\n\n O Horimetro digitado é menor que o Horimetro acumulado! \n\n"; 
        }

	}catch (e){
		log.error("Erro ao validar Horimetro, favor tente novamente online\n\n"+e)
		throw e
	}
	
}
 
function validacaoRMRSPendente(){

	try {
		
		var c1 = DatasetFactory.createConstraint("IDMOVOS", hAPI.getCardValue('OSIDMOV'),
			hAPI.getCardValue('OSIDMOV'), ConstraintType.MUST);

		var constraints = new Array(c1);
		var dataset = DatasetFactory.getDataset('ds_OSE_RMRS_Pendente',null,constraints,null);
		

        if(dataset.rowsCount > 0){
        	hAPI.setCardValue('REQUISICOESPENDENTES', "TEM")
        }else{
        	hAPI.setCardValue('REQUISICOESPENDENTES', "NÃOTEM")
        }

	}catch (e){
		log.error(e)
	}
	
}