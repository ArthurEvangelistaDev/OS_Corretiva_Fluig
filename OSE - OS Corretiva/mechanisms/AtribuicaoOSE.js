function resolve(process,colleague){

	var userList = new java.util.ArrayList();
	
	try{
		var c1 = DatasetFactory.createConstraint("groupPK.groupId", 'OSE_Mecanicos_',
																	'OSE_Mecanicos_', ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("groupDescription", hAPI.getCardValue("LOCALIZACAO"),
																	 hAPI.getCardValue("LOCALIZACAO"), ConstraintType.MUST);
		c1.setLikeSearch(true);
		c2.setLikeSearch(true);
		var constraints = new Array(c1, c2);
		var dtsGroup = DatasetFactory.getDataset('group',null,constraints,null);
		userList.add('Pool:Group:'+dtsGroup.getValue(0,"groupPK.groupId"));
	} catch (e){
		log.error("Erro na Atribuição: "+ e)
		userList.add('Pool:Group:OSE_Mecanicos_Matriz');
	}
	
	return userList;

}