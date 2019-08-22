sap.ui.define([
   "./BaseController",
   "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
   "use strict";

   return BaseController.extend("demo.survey2.SurveyDemo2.controller.Home", {
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
			this.getRouter().getRoute("answer").attachPatternMatched(this._onObjectMatched, this);
		},
	onPressQ: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oViewModel = new JSONModel({titleType : "Quiz"});
   			sap.ui.getCore().setModel(oViewModel, "titleType");
			oRouter.navTo("new", {type : "Quiz"});
		}
   });
});