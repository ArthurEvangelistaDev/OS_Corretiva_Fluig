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
	"SELECT " +
	" CODCOLIGADA," +
	" IDCLASSMOV," +
	" CODCLASSMOV," +
	" DSCCLASSMOV," +
	
	" CASE" +
	" WHEN CODCLASSMOV IN ('02','16','19') THEN '01'" +
	" WHEN CODCLASSMOV IN ('05') THEN '08'" +
	" ELSE '03'" +
	" END AS CODCLASSEDECOMPRA," +
	
	" CASE" +
	" WHEN CODCLASSMOV IN ('02','16','19') THEN 'Máquina Parada (02 dias úteis)'" +
	" WHEN CODCLASSMOV IN ('05') THEN 'Reforma (07 dias úteis)'" +
	" ELSE 'Normal (07 dias úteis)'" +
	" END AS CLASSEDECOMPRA" +
	
	" FROM TCLASSMOV (NOLOCK)" +
	" WHERE CODCLASSMOV IN ('01','02','04','05','10','11','13','14','15','16','17','18','19')";
	
}

function defineStructure() {
    addColumn("CODCOLIGADA");
    addColumn("IDCLASSMOV");
    addColumn("CODCLASSMOV");
    addColumn("DSCCLASSMOV");
    addColumn("CODCLASSEDECOMPRA");
    addColumn("CLASSEDECOMPRA");
}