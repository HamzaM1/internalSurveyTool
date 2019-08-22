function initModel() {
	var sUrl = "/project/intern-project/intern-project-odata.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}