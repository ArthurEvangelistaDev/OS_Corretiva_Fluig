function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    log.info("QUERY: " + myQuery);
    var dataSource = "/jdbc/Banco RM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;

    var OBJETODEMANUTENCAO = "%"
		if (constraints != null){
			for (var i = 0; i < constraints.length; i++) {
				log.info("const " + i + "------");
				log.info("Chave " + i + ": " + constraints[i].fieldName);
				log.info("Valor " + i + ": " + constraints[i].initialValue);
	
				if (constraints[i].fieldName == "IDOBJOF") {
					OBJETODEMANUTENCAO = constraints[i].initialValue;
				}
			}
		}
    
    var myQuery = getQuery(OBJETODEMANUTENCAO)
    	
    try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(myQuery); 
        var columnCount = rs.getMetaData().getColumnCount();
        while (rs.next()) {
            if (!created) {
            	var i = 1
            	do{

                    newDataset.addColumn(rs.getMetaData().getColumnName(i));

                i++
            	} while (i <= columnCount)
                created = true;
            }
            var Arr = new Array();
            var i = 1
            
            do{

                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "NÃO PREENCHIDO NO TOTVS";
                }
                
            i++
            } while (i <= columnCount)
            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
    } finally {
        if (rs != null) {
            rs.close();
        }
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
    return newDataset;
}

function getQuery(OBJETODEMANUTENCAO){
	
	return "" +
	"SELECT" +

	" OFOBJOFICINA.CODCOLIGADA," +
	" OFOBJOFICINA.IDOBJOF," +
	" OFOBJOFICINA.CHAPARESP," +
	" OFOBJOFICINA.IDOBJOF2 AS SERIE," +
	" OFOBJOFICINA.STATUS AS CODSTATUS," +
	" OFSTATUSEQP.DESCRICAO AS STATUS," +
	" OFOBJOFICINA.CODMODELO AS CODMODELO," +
	" OFMODELO.MODELO," +
	" OFOBJOFICINA.CODSUBMODELO," +
	" OFSUBMODELO.DESCRICAO AS SUBMODELO," +
	" OFOBJOFICINA.IDTIPOOBJ AS CODTIPOOBJ," +
	" OFTIPOOBJ.DESCRICAO AS TIPOOBJ," +
	" OFMODELO.CODFAB AS CODFABRICANTE," +
	" TFAB.NOME AS FABRICANTE," +
	" OFOBJOFICINA.CODFILIAL AS CODFILIAL," +
	" GFILIAL.NOME AS FILIAL," +
	" OFOBJOFICINA.CODCFO," +
	
	" OFOBJOFICINA.CODCCUSTO AS CODCENTRODECUSTO," +
	" GCCUSTO.NOME AS CENTRODECUSTO," +
	
	" OFOBJOFICINA.CODLOCAL AS CODLOCALIZACAO," +
	" ILOCAL.NOME AS LOCALIZACAO," +
	
	" GDEPTO.CODDEPARTAMENTO AS CODDEPARTAMENTO," +
	" GDEPTO.NOME AS DEPARTAMENTO," +
	
	" HORIMETRO.ID AS IDHORIMETRO," +
	" HORIMETRO.DATACOLETA AS DATACOLETA," +
	" HORIMETRO.VALORMEDIDOR1 AS HOTRIMETRO," +
	" HORIMETRO.VALORMEDIDOR1 + (DATEDIFF(HOUR, HORIMETRO.DATACOLETA, GETDATE())) AS HORASMAXIMAS," +
	
	" ISNULL((SELECT CASE\
                 WHEN ( IDOBJOF LIKE '%TCR%'\
                         OR IDOBJOF LIKE '%TPE%'\
                         OR IDOBJOF LIKE '%AGR%'\
                         OR IDOBJOF LIKE '%TPG%'\
                         OR IDOBJOF LIKE '%TLA%'\
                         OR IDOBJOF LIKE '%TGG%' ) THEN LEFT(CONVERT(VARCHAR, DATACRIACAO, 120), 10)\
                 ELSE CAMPOLIVRE3\
               END\
        FROM   TMOV (NOLOCK)\
        WHERE  IDMOV = (SELECT MAX(IDMOV)\
                        FROM   TMOV (NOLOCK)\
                        WHERE  OFOBJOFICINA.CODCOLIGADA = TMOV.CODCOLIGADA\
                               AND OFOBJOFICINA.IDOBJOF = TMOV.IDOBJOF\
                               AND TMOV.CODTMV = '1.1.22'\
                               AND TMOV.STATUS <> 'C')),0)    AS ULTIMO_VENCIMENTO"+
	
	
	" FROM OFOBJOFICINA (NOLOCK)" +
	
	" LEFT OUTER JOIN GFILIAL (NOLOCK)" +
	" ON (OFOBJOFICINA.CODCOLIGADA = GFILIAL.CODCOLIGADA AND OFOBJOFICINA.CODFILIAL = GFILIAL.CODFILIAL)" +
	
	" LEFT OUTER JOIN IPATRIMONIO (NOLOCK)" +
	" ON (OFOBJOFICINA.CODCOLIGADA = IPATRIMONIO.CODCOLIGADA AND OFOBJOFICINA.IDOBJOF = IPATRIMONIO.IDOBJOF)" +
	
	" LEFT OUTER JOIN GDEPTO (NOLOCK)" +
	" ON (IPATRIMONIO.CODCOLIGADADEPARTAMENTO = GDEPTO.CODCOLIGADA AND IPATRIMONIO.CODFILIAL = GDEPTO.CODFILIAL AND IPATRIMONIO.CODDEPARTAMENTO = GDEPTO.CODDEPARTAMENTO)" +
	
	" LEFT OUTER JOIN GCCUSTO (NOLOCK)" +
	" ON (IPATRIMONIO.CODCOLIGADA = GCCUSTO.CODCOLIGADA AND IPATRIMONIO.CODCENTROCUSTO = GCCUSTO.CODCCUSTO)" +
	
	" LEFT OUTER JOIN ILOCAL (NOLOCK)" +
	" ON (IPATRIMONIO.CODCOLIGADA = ILOCAL.CODCOLIGADA AND IPATRIMONIO.CODLOCAL = ILOCAL.CODLOCAL)" +
	
	" LEFT OUTER JOIN OFSTATUSEQP (NOLOCK)" +
	" ON (OFOBJOFICINA.CODCOLIGADA = OFSTATUSEQP.CODCOLIGADA AND OFOBJOFICINA.STATUS = OFSTATUSEQP.CODSTATUS)" +
	
	" LEFT OUTER JOIN OFTIPOOBJ (NOLOCK)" +
	" ON (OFOBJOFICINA.IDTIPOOBJ = OFTIPOOBJ.IDTIPOOBJ)" +
	
	" LEFT OUTER JOIN OFMODELO (NOLOCK)" +
	" ON (OFOBJOFICINA.IDTIPOOBJ = OFMODELO.IDTIPOOBJ AND OFOBJOFICINA.CODMODELO = OFMODELO.CODMODELO)" +
	
	" LEFT OUTER JOIN OFSUBMODELO (NOLOCK)" +
	" ON (OFOBJOFICINA.IDTIPOOBJ = OFSUBMODELO.IDTIPOOBJ AND OFOBJOFICINA.CODMODELO = OFSUBMODELO.CODMODELO AND OFOBJOFICINA.CODSUBMODELO = OFSUBMODELO.CODSUBMODELO)" +
	
	" LEFT OUTER JOIN TFAB (NOLOCK)" +
	" ON (OFMODELO.CODCOLFAB = TFAB.CODCOLIGADA AND OFMODELO.CODFAB = TFAB.CODFAB)" +
	
	" LEFT OUTER JOIN (SELECT" +
	" 					MAX(IDHISTINDICADOR) AS ID," +
	" 					MAX(IDOBJOF) AS OBJ," +
	" 					MAX(DATACOLETA) AS DATACOLETA," +
	" 					MAX(VALORMEDIDOR1) AS VALORMEDIDOR1" +
	
	" 					FROM OFHISTINDICADOR (NOLOCK)" +
	
	" 					WHERE OFHISTINDICADOR.CODCOLIGADA = 1" +
	" 					GROUP BY CODCOLIGADA, IDOBJOF) AS HORIMETRO" +
	
	" ON (OFOBJOFICINA.IDOBJOF = HORIMETRO.OBJ AND OFOBJOFICINA.CODCOLIGADA = 1)" +
	
	" WHERE OFOBJOFICINA.STATUS NOT IN ('6', '9')" +
	"  AND OFOBJOFICINA.IDOBJOF LIKE '"+OBJETODEMANUTENCAO+"%'";
	
}

function defineStructure() {
	addColumn("CODCOLIGADA", DatasetFieldType.STRING);
	addColumn("IDOBJOF", DatasetFieldType.STRING);
	addColumn("CHAPARESP", DatasetFieldType.STRING);
	addColumn("SERIE", DatasetFieldType.STRING);
	addColumn("CODSTATUS", DatasetFieldType.STRING);
	addColumn("STATUS", DatasetFieldType.STRING);
	addColumn("CODMODELO", DatasetFieldType.STRING);
	addColumn("MODELO", DatasetFieldType.STRING);
	addColumn("CODSUBMODELO", DatasetFieldType.STRING);
	addColumn("SUBMODELO", DatasetFieldType.STRING);
	addColumn("CODTIPOOBJ", DatasetFieldType.STRING);
	addColumn("TIPOOBJ", DatasetFieldType.STRING);
	addColumn("CODFABRICANTE", DatasetFieldType.STRING);
	addColumn("FABRICANTE", DatasetFieldType.STRING);
	addColumn("CODFILIAL", DatasetFieldType.STRING);
	addColumn("FILIAL", DatasetFieldType.STRING);
	addColumn("CODCFO", DatasetFieldType.STRING);
	addColumn("CODCENTRODECUSTO", DatasetFieldType.STRING);
	addColumn("CENTRODECUSTO", DatasetFieldType.STRING);
	addColumn("CODLOCALIZACAO", DatasetFieldType.STRING);
	addColumn("LOCALIZACAO", DatasetFieldType.STRING);
	addColumn("CODDEPARTAMENTO", DatasetFieldType.STRING);
	addColumn("DEPARTAMENTO", DatasetFieldType.STRING);
	addColumn("IDHORIMETRO", DatasetFieldType.STRING);
	addColumn("DATACOLETA", DatasetFieldType.STRING);
	addColumn("HOTRIMETRO", DatasetFieldType.STRING);
	addColumn("HORASMAXIMAS", DatasetFieldType.STRING);
	addColumn("ULTIMO_VENCIMENTO", DatasetFieldType.STRING);
}