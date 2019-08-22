sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";

   return Controller.extend("demo.survey2.SurveyDemo2.controller.Overview", {
   		onInit: function (oEvent) {
   			var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
			sap.ui.getCore().setModel(userModel, "userapi");
			
   		},
   		
		onPressHome: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		}
   });
});