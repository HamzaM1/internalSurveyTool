sap.ui.define([
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Fragment, Controller, MessageToast) {
	"use strict";

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

		
		questionCheckbox : function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {type: "Check"});
		},
		
		questionRadio : function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {type: "Radio"});
		},
		
		questionTextbox : function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {type: "Text"});
		},
		
		questionSlider : function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {type: "Slide"});
		}
	});

	return CController;

});