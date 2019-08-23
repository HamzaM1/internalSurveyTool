
sap.ui.define([
   "./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
   "use strict";
	
	var sObjectId;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.QuizEntry", {
		
		formatter: formatter,
		
   		onInit : function() {
			this.getRouter().getRoute("quizEntry").attachPatternMatched(this._onObjectMatched, this);
		},

   		onPress : function (oEvent) {
			this.getRouter().navTo("quizpage", {
					objectId: sObjectId
				});
		},
		
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		
		_onObjectMatched : function (oEvent) {
			sObjectId =  oEvent.getParameter("arguments").objectId;
			var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
			sap.ui.getCore().setModel(userModel, "userapi");
		}
		
   	});
});
