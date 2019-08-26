sap.ui.define([
   "./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter"
], function (BaseController, JSONModel, History, formatter) {
   "use strict";
	
	var sPercent;
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.QuizComplete", {
   		onInit : function() {
   			this.getRouter().getRoute("quizComplete").attachPatternMatched(this._onObjectMatched, this);
   		},
   	
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			}
			else {
				this.getRouter().navTo("overview", {}, true);
			}
		},
		
		onPressHome: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		},
		
		_onObjectMatched : function (oEvent) {
			sPercent = oEvent.getParameter("arguments").objectId;
			this.byId("score").setText("Your score is " + sPercent + "%");
		}

   	});
});