function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    log.info("QUERY: " + myQuery);
    var dataSource = "/jdbc/Banco RM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;

    var OSIDMOV = "3543396"
		
		for (var i = 0; i < constraints.length; i++) {
			log.info("const " + i + "------");
			log.info("Chave " + i + ": " + constraints[i].fieldName);
			log.info("Valor " + i + ": " + constraints[i].initialValue);

			if (constraints[i].fieldName == "IDMOVOS") {
				OSIDMOV = constraints[i].initialValue;
			}
		}
    
    var myQuery = getQuery(OSIDMOV)
    	
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
                    Arr[i - 1] = "null";
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

function getQuery(OSIDMOV){
	 
	return "" +
	"SELECT TOP 100 OFMOV.IDMOVOS," +
	"OFMOV.IDMOV," +
	"TMOV.NUMEROMOV," +
	"TMOV.CODTMV," +
	"TMOV.CODFILIAL," +
	"CASE TMOV.STATUS" +
	"	WHEN 'A' THEN 'PENDENTE'" +
	"	WHEN 'B' THEN 'BLOQUEADO'" +
	"	WHEN 'C' THEN 'CANCELADO'" +
	"	WHEN 'F' THEN 'RECEBIDO'" +
	"	WHEN 'G' THEN 'PARCIALMENTE RECEBIDO'" +
	"	WHEN 'U' THEN 'EM FATURAMENTO'" +
	" END AS STATUS," +
	"CASE WHEN TMOVAPROVA.DATAAPROVACAO <> '' AND TMOVAPROVA.DATADESAPROVA IS NULL THEN 'APROVADO' ELSE 'NÃO APROVADO' END AS DATAAPROVACAO" +
																					
	" FROM OFMOV (NOLOCK)" +
	" LEFT OUTER JOIN TMOV (NOLOCK)" +
	" ON OFMOV.CODCOLIGADA = TMOV.CODCOLIGADA AND OFMOV.IDMOV = TMOV.IDMOV" +
	 																				
	" LEFT OUTER JOIN TMOVAPROVA (NOLOCK)" +
	" ON TMOV.CODCOLIGADA = TMOVAPROVA.CODCOLIGADA AND TMOV.IDMOV = TMOVAPROVA.IDMOV" +
	
	" WHERE OFMOV.IDMOVOS = " + OSIDMOV +
	"   AND TMOV.CODTMV LIKE '1.1.06'";
	
}