sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, Fragment, JSONModel) {
	"use strict";
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.SurveyTitle", {
		onInit: function () {
			//var oJsonModel = new sap.ui.model.json.JSONModel({data : {}});
			//sap.ui.getCore().setModel(oJsonModel, "title");

			//var oData = sap.ui.getCore().getModel("title").getData();
			//var oJsonModel = new JSONModel({data : {}});
			//this.getView().setModel(oJsonModel);
			this.setModel(sap.ui.getCore().getModel("titleType"), "new");
		},
		
		getTitle   : function () {
			// read msg from i18n model
			var sRecipient = sap.ui.getCore().getModel("title").getData().title;
			// show message
			MessageToast.show(sRecipient);
		},
		onOpenTDialog : function () {
			this.getOwnerComponent().openSaveTDialog();
		},
		handleLiveChange : function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oJsonModel = new sap.ui.model.json.JSONModel({title : sValue});
			sap.ui.getCore().setModel(oJsonModel, "title");
			//this.byId("enterT").setText(sValue);
		},
		
		onPress : function (oEvent) {
			 if (oEvent.getSource().getPressed()) {
				var oJsonModel = new sap.ui.model.json.JSONModel({anon : 1});
				sap.ui.getCore().setModel(oJsonModel, "anon");
			} else {
				var oJsonModel = new sap.ui.model.json.JSONModel({anon : 0});
				sap.ui.getCore().setModel(oJsonModel, "anon");
			}
		}
	});
});