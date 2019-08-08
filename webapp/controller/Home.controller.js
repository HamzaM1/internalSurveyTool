sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
   "use strict";

   return Controller.extend("demo.survey2.SurveyDemo2.controller.Home", {
   	onInit: function () {
			var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
			this.getView().setModel(userModel, "userapi");
			sap.ui.getCore().setModel(userModel, "userapi");
			
		},
	onPressS: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oViewModel = new JSONModel({titleType : "Survey"});
   			sap.ui.getCore().setModel(oViewModel, "titleType");
			oRouter.navTo("new", {type: "Survey"});
		},
	onPressQ: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oViewModel = new JSONModel({titleType : "Quiz"});
   			sap.ui.getCore().setModel(oViewModel, "titleType");
			oRouter.navTo("new", {type : "Quiz"});
		}
   });
});