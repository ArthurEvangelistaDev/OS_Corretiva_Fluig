function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    log.info("QUERY: " + myQuery);
    var dataSource = "/jdbc/Banco RM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;

    var usuario = "Gabriel.furtado"
		
		for (var i = 0; i < constraints.length; i++) {
			log.info("const " + i + "------");
			log.info("Chave " + i + ": " + constraints[i].fieldName);
			log.info("Valor " + i + ": " + constraints[i].initialValue);

			if (constraints[i].fieldName == "CODUSUARIO") {
				usuario = constraints[i].initialValue;
			}
		}
    
    var myQuery = getQuery(usuario)
    	
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

function getQuery(usuario){
	
	return "" +
	"SELECT\
	CASE\
	WHEN TEMACESSO = 'FALSE' THEN COUNT(TEMACESSO)\
	WHEN TEMACESSO IS NULL THEN COUNT(TEMACESSO)\
	ELSE 0\
	END AS SOMA,\
	ISNULL(TEMACESSO, 'FALSE') AS TEMACESSO,\
	ISNULL(CODUSUARIO, '') AS CODUSUARIO\
	\
	FROM\
	(SELECT 'N' AS COLUNA\
	UNION ALL\
	SELECT 'T' AS COLUNA\
	UNION ALL\
	SELECT '1.1.20' AS COLUNA\
	UNION ALL\
	SELECT '1.1.22' AS COLUNA) AS TABELA2\
	LEFT OUTER JOIN\
	(\
	SELECT\
	CASE\
	WHEN SUBSTRING(PERMISSOES, 4, 1) = '*' THEN 'TRUE'\
	ELSE 'FALSE'\
	END AS TEMACESSO,\
	SUBSTRING(PERMISSOES, 2, 1) AS INCLUIR,\
	SUBSTRING(PERMISSOES, 4, 1) AS ALTERAR,\
	SUBSTRING(PERMISSOES, 1, 1) AS CONSULTAR,\
	CODSISTEMA,\
	CODPERFIL,\
	'"+usuario+"' AS CODUSUARIO\
	\
	FROM GAUTZMENU (NOLOCK)\
	\
	WHERE CODPERFIL IN (SELECT CODPERFIL\
	\
						FROM GUSRPERFIL (NOLOCK)\
	\
						WHERE CODUSUARIO = '"+usuario+"'\
						  AND CODSISTEMA IN ('N')\
						  AND CODCOLIGADA = 1)\
	  AND TAGMENU = '814000043'\
	\
	UNION ALL\
	\
	SELECT\
	CASE\
	WHEN SUBSTRING(PERMISSOES, 6, 1) = '*' THEN 'TRUE'\
	ELSE 'FALSE'\
	END AS TEMACESSO,\
	SUBSTRING(PERMISSOES, 6, 1) AS INCLUIR,\
	SUBSTRING(PERMISSOES, 1, 1) AS ALTERAR,\
	SUBSTRING(PERMISSOES, 1, 1) AS CONSULTAR,\
	CODSISTEMA,\
	CODPERFIL,\
	'"+usuario+"' AS CODUSUARIO\
	\
	FROM GAUTZMENU (NOLOCK)\
	\
	WHERE CODPERFIL IN (SELECT CODPERFIL\
	\
						FROM GUSRPERFIL (NOLOCK)\
	\
						WHERE CODUSUARIO = '"+usuario+"'\
						  AND CODSISTEMA IN ('N')\
						  AND CODCOLIGADA = 1)\
	  AND TAGMENU = '814000024'\
	\
	UNION ALL\
	\
	SELECT\
	CASE\
	WHEN SUBSTRING(PERMISSOES, 2, 1) = '*' AND SUBSTRING(PERMISSOES, 4, 1) = '*' THEN 'TRUE'\
	ELSE 'FALSE'\
	END AS TEMACESSO,\
	SUBSTRING(PERMISSOES, 2, 1) AS INCLUIR,\
	SUBSTRING(PERMISSOES, 4, 1) AS ALTERAR,\
	SUBSTRING(PERMISSOES, 1, 1) AS CONSULTAR,\
	CODSISTEMA,\
	CODPERFIL,\
	'"+usuario+"' AS CODUSUARIO\
	\
	FROM GAUTZMENU (NOLOCK)\
	\
	WHERE CODPERFIL IN (SELECT CODPERFIL\
	\
						FROM GUSRPERFIL (NOLOCK)\
	\
						WHERE CODUSUARIO = '"+usuario+"'\
						  AND CODSISTEMA IN ('T')\
						  AND CODCOLIGADA = 1)\
	  AND TAGMENU = '815000036'\
	\
	UNION ALL\
	\
	SELECT\
	CASE\
	WHEN INCLUIR = 1 AND ALTERAR = 1 AND CONSULTAR = 1 THEN 'TRUE'\
	ELSE 'FALSE'\
	END AS TEMACESSO,\
	CAST(INCLUIR AS VARCHAR) AS INCLUIR,\
	CAST(ALTERAR AS VARCHAR) AS ALTERAR,\
	CAST(CONSULTAR AS VARCHAR) AS CONSULTAR,\
	CODTMV AS CODSISTEMA,\
	CODUSUARIO AS CODPERFIL,\
	CODUSUARIO\
	\
	FROM TUSRTMV (NOLOCK)\
	\
	WHERE CODCOLIGADA = 1\
	  AND CODTMV IN ('1.1.20', '1.1.22')\
	  AND CODUSUARIO = '"+usuario+"'\
	) AS TABELA\
	ON (TABELA.CODSISTEMA = TABELA2.COLUNA)\
	\
	GROUP BY TEMACESSO, CODUSUARIO";
	
}