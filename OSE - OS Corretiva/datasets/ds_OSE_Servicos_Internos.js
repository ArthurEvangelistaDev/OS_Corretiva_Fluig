function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    log.info("QUERY: " + myQuery);
    var dataSource = "/jdbc/Banco RM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
    
    var myQuery = getQuery()
    	
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

function getQuery(){
	
	return "" +
	"SELECT" +
	" TPRODUTO.CODCOLPRD," +
	" TPRODUTO.IDPRD," +
	" TPRODUTO.CODIGOPRD," +
	" TPRODUTO.NOMEFANTASIA," +
	" TPRODUTO.CODIGOREDUZIDO," +
	" TPRODUTO.DESCRICAO," +
	" TPRODUTODEF.CODUNDCOMPRA," +
	" TUND.DESCRICAO AS UNIDADECOMPRA," +
	" ISNULL(TPRODUTODEF.PRECO5, 0.0000) AS ULTIMOPRECO," +
	" TPRODUTODEF.CODTB2FAT AS CODGRUPOCOMPONENTE,"+
	" TTB2.DESCRICAO AS GRUPOCOMPONENTE,"+
	" (TPRODUTO.CODIGOPRD +'  -  '+TPRODUTO.NOMEFANTASIA) AS DESCRICAOCOMPLETA" +
	
	" FROM TPRODUTO (NOLOCK)" +
	
	" LEFT OUTER JOIN TPRODUTODEF (NOLOCK)" +
	" ON (TPRODUTO.IDPRD = TPRODUTODEF.IDPRD)" +
		
	" LEFT OUTER JOIN TUND (NOLOCK)" +
	" ON (TPRODUTODEF.CODUNDCOMPRA = TUND.CODUND)" +

	" LEFT OUTER JOIN TTB2 (NOLOCK)" +
	" ON (TPRODUTODEF.CODCOLIGADA = TTB2.CODCOLIGADA AND TPRODUTODEF.CODTB2FAT = TTB2.CODTB2FAT)" +
	
	" WHERE (TPRODUTO.CODIGOPRD LIKE '1.10.%' OR TPRODUTO.CODIGOPRD LIKE '1.30.%')" +
	" 	AND TPRODUTO.INATIVO = 0" +
	" 	AND TPRODUTO.CODCOLPRD = 1";
	
}

function defineStructure() {
    addColumn("CODCOLPRD");
    addColumn("IDPRD");
    addColumn("CODIGOPRD");
    addColumn("NOMEFANTASIA");
    addColumn("CODIGOREDUZIDO");
    addColumn("DESCRICAO");
    addColumn("CODUNDCOMPRA");
    addColumn("UNIDADECOMPRA");
    addColumn("ULTIMOPRECO");
    addColumn("CODGRUPOCOMPONENTE");
    addColumn("GRUPOCOMPONENTE");
    addColumn("DESCRICAOCOMPLETA");
}