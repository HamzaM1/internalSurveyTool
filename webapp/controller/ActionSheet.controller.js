sap.ui.define([
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Fragment, Controller, MessageToast) {
	"use strict";
	
	var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
	
	var CController = Controller.extend("demo.survey2.SurveyDemo2.C", {
		handleOpen : function (oEvent) {
			var oButton = oEvent.getSource();

			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment(
					"demo.survey2.SurveyDemo2.view.ActionSheet",
					this
				);
				this.getView().addDependent(this._actionSheet);
			}

			this._actionSheet.openBy(oButton);
		},

		//TODO update amount of questions on db
		questionCheckbox : function(oEvent){
			var oSQType = sap.ui.getCore().getModel("sqtype").getData().sqtype;
			var oQuestionCount = sap.ui.getCore().getModel("qcount").getData().qcount;
			var oJsonModel = new sap.ui.model.json.JSONModel({qcount : (oQuestionCount + 1)});
				sap.ui.getCore().setModel(oJsonModel, "qcount");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {sq: oSQType, type: "Check", count: oQuestionCount});
		},
		
		questionRadio : function(oEvent){
			var oSQType = sap.ui.getCore().getModel("sqtype").getData().sqtype;
			var oQuestionCount = sap.ui.getCore().getModel("qcount").getData().qcount;
			var oJsonModel = new sap.ui.model.json.JSONModel({qcount : (oQuestionCount + 1)});
				sap.ui.getCore().setModel(oJsonModel, "qcount");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {sq: oSQType, type: "Radio", count: oQuestionCount});
		},
		
		questionTextbox : function(oEvent){
			var oSQType = sap.ui.getCore().getModel("sqtype").getData().sqtype;
			var oQuestionCount = sap.ui.getCore().getModel("qcount").getData().qcount;
			var oJsonModel = new sap.ui.model.json.JSONModel({qcount : (oQuestionCount + 1)});
				sap.ui.getCore().setModel(oJsonModel, "qcount");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {sq: oSQType, type: "Text", count: oQuestionCount});
		},
		
		questionSlider : function(oEvent){
			var oSQType = sap.ui.getCore().getModel("sqtype").getData().sqtype;
			var oQuestionCount = sap.ui.getCore().getModel("qcount").getData().qcount;
			var oJsonModel = new sap.ui.model.json.JSONModel({qcount : (oQuestionCount + 1)});
				sap.ui.getCore().setModel(oJsonModel, "qcount");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {sq: oSQType, type: "Slide", count: oQuestionCount});
		}
	});

	return CController;

});