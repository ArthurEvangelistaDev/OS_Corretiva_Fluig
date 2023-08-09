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
	"SELECT *,\
	(SELECT TOP 1NOME FROM TLOC (NOLOCK) WHERE TLOC.CODFILIAL = LTRIM(TABELA.CODFILIAL) AND TLOC.CODLOC = LTRIM(TABELA.CODLOC)) AS LOCALDEESTOQUE\
	\
	FROM (\
	SELECT\
	SUBSTRING(LEFT(GCONSIST.DESCRICAO, CHARINDEX(' - ', GCONSIST.DESCRICAO)-1), CHARINDEX(' ',LEFT(GCONSIST.DESCRICAO, CHARINDEX(' - ', GCONSIST.DESCRICAO)-1)), LEN(LEFT(GCONSIST.DESCRICAO, CHARINDEX(' - ', GCONSIST.DESCRICAO)-1))) AS CODFILIAL,\
	SUBSTRING(SUBSTRING(GCONSIST.DESCRICAO, CHARINDEX('Local', GCONSIST.DESCRICAO), 8), CHARINDEX(' ', SUBSTRING(GCONSIST.DESCRICAO, CHARINDEX('Local', GCONSIST.DESCRICAO), 8)), LEN(SUBSTRING(GCONSIST.DESCRICAO, CHARINDEX('Local', GCONSIST.DESCRICAO), 8))) AS CODLOC,\
	ILOCAL.CODLOCAL,\
	ILOCAL.NOME\
	\
	FROM ILOCAL (NOLOCK)\
	\
	LEFT OUTER JOIN ILOCALCOMPL (NOLOCK)\
	ON (ILOCAL.CODCOLIGADA = ILOCALCOMPL.CODCOLIGADA AND ILOCAL.CODLOCAL = ILOCALCOMPL.CODLOCAL)\
	\
	LEFT OUTER JOIN GCONSIST (NOLOCK)\
	ON (ILOCALCOMPL.LOCALDEESTOQUE = GCONSIST.CODCLIENTE AND GCONSIST.CODTABELA = 'LOCAL')\
	\
	WHERE ATIVO = 1\
	) AS TABELA\
	\
	ORDER BY CODLOCAL ASC";
	
}

function defineStructure() {
    addColumn("CODFILIAL");
    addColumn("CODLOC");
    addColumn("CODLOCAL");
    addColumn("NOME");
    addColumn("LOCALDEESTOQUE");
}