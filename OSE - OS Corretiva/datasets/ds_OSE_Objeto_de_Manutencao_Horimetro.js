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
	"SELECT\
	\
	OFOBJOFICINA.CODCOLIGADA,\
	OFOBJOFICINA.IDOBJOF,\
	\
	HORIMETRO.ID AS IDHORIMETRO,\
	HORIMETRO.DATACOLETA AS DATACOLETA,\
	HORIMETRO.VALORMEDIDOR1 AS HORIMETRO,\
	HORIMETRO.VALORMEDIDOR1 + (DATEDIFF(HOUR, HORIMETRO.DATACOLETA, GETDATE())) AS HORASMAXIMAS\
	\
	FROM OFOBJOFICINA (NOLOCK)\
	\
	LEFT OUTER JOIN (SELECT\
						MAX(IDHISTINDICADOR) AS ID,\
						MAX(IDOBJOF) AS OBJ,\
						MAX(DATACOLETA) AS DATACOLETA,\
						MAX(VALORMEDIDOR1) AS VALORMEDIDOR1\
	\
						FROM OFHISTINDICADOR (NOLOCK)\
	\
						WHERE OFHISTINDICADOR.CODCOLIGADA = 1\
						GROUP BY CODCOLIGADA, IDOBJOF) AS HORIMETRO\
	\
	ON (OFOBJOFICINA.IDOBJOF = HORIMETRO.OBJ AND OFOBJOFICINA.CODCOLIGADA = 1)\
	\
	WHERE OFOBJOFICINA.STATUS NOT IN ('6', '9')\
	 AND OFOBJOFICINA.IDOBJOF LIKE '"+OBJETODEMANUTENCAO+"'";
	
}