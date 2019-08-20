sap.ui.define([
	"./BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function (BaseController, Fragment, JSONModel, History) {
	"use strict";
	
	var oModel;
	var oData;
	var answers = 2;
	var sObjectId;
	var controller;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.SurveyQuestion", {
		onInit : function () {
			controller = this;
			oData = {
					answer0 : "Yes",
					answer1 : "No",
					answer2 : "Maybe",
					answer3 : "",
					answer4 : ""
			};
			oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
			sap.ui.getCore().setModel(oJsonModel, "answersCount");
			
			this.getRouter().getRoute("surveyQuestion").attachPatternMatched(this._onObjectMatched, this);
		},
		
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("overview", {}, true);
			}
		},
		
		onPressHome: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		},
		
		getQuestion : function () {
			// read msg from i18n model
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/InputValue");
			var sMsg = oBundle.getText("question", [sRecipient]);

			// show message
		},
		onOpenQDialog : function () {
			this.getOwnerComponent().openSaveQDialog();
		},
		
		handleLiveChange : function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oJsonModel = new sap.ui.model.json.JSONModel({question : sValue});
			sap.ui.getCore().setModel(oJsonModel, "question0");
		},
		
		//TODO add and remove question options
		
		onRemove : function () {
			if (answers > 2){
				answers -= 1;
				this.getView().byId("radio" + answers).setVisible(false);
				this.getView().byId("inputlist" + answers).setVisible(false);
				var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
				sap.ui.getCore().setModel(oJsonModel, "answersCount");
			}
		},
		
		onAdd : function () {
			var oRadioButton = new sap.m.RadioButton({
   					id: "radio0",
   					text: "{/answer0}"
   				});
   			this.getView().byId("answers").addButton(oRadioButton);
			if (answers < 5){
				//this.getView().byId("radio" + answers).setVisible(true);
				//this.getView().byId("inputlist" + answers).setVisible(true);
				//answers += 1;
				//var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
				//sap.ui.getCore().setModel(oJsonModel, "answersCount");
			}
		},
		
		_onObjectMatched : function (oEvent) {
			sObjectId =  oEvent.getParameter("arguments").type;
		}
		
	});
});