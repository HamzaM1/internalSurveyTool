
sap.ui.define([
   "./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, Fragment) {
   "use strict";
	
	var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
	var sObjectId;
	var dialog = 0; 
	var controller;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.QuizEntry", {
		
		formatter: formatter,
		
   		onInit : function() {
   			controller = this;
   			var oViewModel = new JSONModel({
				busy : true,
				delay : 0
			});
   			this.setModel(oViewModel, "entryView");
			this.getRouter().getRoute("quizEntry").attachPatternMatched(this._onObjectMatched, this);
		},

   		onPress : function (oEvent) {
   			var oOwner = sap.ui.getCore().getModel("userapi").getData().name;
   			oModel.read("/UsersSQ('" + oOwner + sObjectId + "')", {
   				success: function(oData){
   					if (oData.SUBMITTED === 0) { 
   						controller.getRouter().navTo("quizpage", {
							objectId: sObjectId
						});
   					} 
   					else {
   						controller.onPreviouslyCompleted();
   					}
   				},
   				error: function(oData){
   					controller.getRouter().navTo("quizpage", {
						objectId: sObjectId
					});
   				}
   			});
		},
		
		onPreviouslyCompleted : function (oEvent) {
			var oView = controller.getView();
			
			if (dialog === 0) {
				Fragment.load({
					id: "previouslyCompleted",
					controller: controller,
					type: "XML",
					name: "demo.survey2.SurveyDemo2.view.PreviouslyCompleted"
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					dialog = oDialog;
					oDialog.open();
				});
			}
			else {
				dialog.open();
			}

		},
		
		onCloseDialog : function () {
			dialog.close();
			controller.getRouter().navTo("overview");
		}, 
		
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		
		_onObjectMatched : function (oEvent) {
			sObjectId =  oEvent.getParameter("arguments").objectId;
			var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
			sap.ui.getCore().setModel(userModel, "userapi");
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("SQ", {
					SQID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
			
			
		},
		
		_bindView : function (sObjectPath) {

			var oViewModel = this.getModel("entryView");
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						var x = (controller.byId("anon").getText().split(" "));
						if (x[0] === "0") {
							controller.byId("anon").setText("This is a Non-Anonymous " + x[1]);
						}
						else {
							controller.byId("anon").setText("This is an Anonymous " + x[1]);
						}
						oViewModel.setProperty("/busy", false);
					}
				}
			});
			var x = (controller.byId("anon").getText().split(" "));
				if (x[0] === "0") {
					controller.byId("anon").setText("This is a Non-Anonymous " + x[1]);
					}
				else {
					controller.byId("anon").setText("This is an Anonymous " + x[1]);
					}
		}
		
   	});
});
