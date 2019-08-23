sap.ui.define([
   "./BaseController",
   	"sap/ui/model/json/JSONModel",
   "sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, History, Filter, FilterOperator) {
   "use strict";

	var sObjectId;
	var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
	var oOwner;
	var controller;
	var updated = 0;
    
    return BaseController.extend("demo.survey2.SurveyDemo2.controller.New", {
   		onInit : function(){
   			controller = this;
   			var oJsonModel = new sap.ui.model.json.JSONModel({qcount : 0});
				sap.ui.getCore().setModel(oJsonModel, "qcount");
   			oJsonModel = new sap.ui.model.json.JSONModel({anon : 0});
				sap.ui.getCore().setModel(oJsonModel, "anon");
   			oOwner = sap.ui.getCore().getModel("userapi").getData().name;
   			oModel.read(
				"/Users('" + oOwner + "')",
				{
					success: function(oData) {
    					var oCount = new sap.ui.model.json.JSONModel({count : oData.NUM_OF_SQ});
						controller.setModel(oCount, "count");
						controller._onCreate(oData);
						}
					}
				);
   			this.getRouter().getRoute("new").attachPatternMatched(this._onObjectMatched, this);
   			this.setModel(sap.ui.getCore().getModel("titleType"), "new");
   		},
   		
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("overview", {}, true);
			}
		},
		
		
		//TODO get count of question + MAYBE have a "previously made" argument
		onPress : function (oEvent) {
			var c = parseInt(oEvent.getSource().getTitle().split(" ")[1], 10) - 1;
			var t = oEvent.getSource().getNumber();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {sq: sObjectId, type: t, count: c});
		},
		
		onPressHome: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		},
		
		onPressPublish: function (oEvent) {
			var oTitle = sap.ui.getCore().getModel("title").getData().title;
			var oQuizCount = ("00" + (controller.getModel("count").getData().count)).slice(-3);
			var oQuestionCount = sap.ui.getCore().getModel("qcount").getData().qcount;
			// create survey
			var SQoData = {
				SQID: oOwner + oQuizCount,
				SQ_TITLE: oTitle, 
				SQ_LINK: "https://internalsurveytool-i505340trial.dispatcher.hanatrial.ondemand.com/index.html?hc_reset#/quizEntry/" + oOwner + oQuizCount,
				SQ_TYPE: sObjectId,
				DATE: new Date(),
				SQ_OWNER: oOwner,
				NUM_OF_QUESTIONS: oQuestionCount,
				ANONYMOUS: sap.ui.getCore().getModel("anon").getData().anon,
				LIVE: 1
			};
			oModel.update("/SQ('" + oOwner + oQuizCount + "')", SQoData);
			
			var oJsonModel = new sap.ui.model.json.JSONModel({qcount : 0});
				sap.ui.getCore().setModel(oJsonModel, "qcount");
		  	
		  	var oUpdate = {
				USERID: oOwner,
				NUM_OF_SQ: (controller.getModel("count").getData().count) + 1
				};
			oModel.update(
				"/Users('" + oOwner + "')",
				oUpdate
			);
			
			var oCount = new sap.ui.model.json.JSONModel({count : (controller.getModel("count").getData().count + 1)});
			controller.setModel(oCount, "count");
		},
		
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */

		_onObjectMatched : function (oEvent) {
			sObjectId =  oEvent.getParameter("arguments").type;
			this.setModel(sap.ui.getCore().getModel("titleType"), "new");
			var oJsonModel = new sap.ui.model.json.JSONModel({sqtype : sObjectId});
				sap.ui.getCore().setModel(oJsonModel, "sqtype");
		},
		
		_onCreate : function (oData) {
			var oQuizCount = ("00" + (oData.NUM_OF_SQ)).slice(-3);
			var oJsonModel = new sap.ui.model.json.JSONModel({currentsq : (oOwner + oQuizCount)});
				sap.ui.getCore().setModel(oJsonModel, "currentsq");
			var oTable = this.byId("list");
			var oFilter = new Filter({
					path: "SQID",
					operator: "EQ",
					value1: sap.ui.getCore().getModel("currentsq").getData().currentsq
				}); 
			oTable.getBinding("items").filter(oFilter, "Application");
			var SQoData = {
				SQID: oOwner + oQuizCount,
				SQ_TITLE: "", 
				SQ_LINK: "",
				SQ_TYPE: sObjectId,
				DATE: new Date(), 
				SQ_OWNER: oOwner,
				NUM_OF_QUESTIONS: 0,
				ANONYMOUS: 0,
				LIVE: 0
			};
			oModel.create("/SQ", SQoData);
		},
		
		onUpdateFinished : function (oEvent) {
			if (updated === 1) { 
				var oJsonModel = new sap.ui.model.json.JSONModel({qcount : oEvent.getParameters().total});
				sap.ui.getCore().setModel(oJsonModel, "qcount");
			}
			if (updated > 0){
				var oTable = this.byId("list");
				var oFilter = new Filter({
					path: "SQID",
					operator: "EQ",
					value1: sap.ui.getCore().getModel("currentsq").getData().currentsq
				}); 
				oTable.getBinding("items").filter(oFilter, "Application");
			} 
			updated++;
		}
		
	});

});

 