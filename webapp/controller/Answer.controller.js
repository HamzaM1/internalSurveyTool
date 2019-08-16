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
	var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
	var updated = false;
	var controller;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.Answer", {
   		onInit: function (oEvent) {
   			controller = this;
   			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "questionView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				}
			);
   			this.getRouter().getRoute("answer").attachPatternMatched(this._onObjectMatched, this);
   		},
   		
		onPressHome: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		},
		
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("overview", {}, true);
			}
		},
		
		onPressNext : function() {
			var count = controller.getModel("answerCount").getData().answerCount;
			var quiz = sObjectId.slice(0,10);
			var question = sObjectId.slice(10,11);
			question++;
			if (count !== question) {
				this.getRouter().navTo("answer", {
					objectId: quiz + question
				});
			}
			else {
				this.getRouter().navTo("quizpage", {
					objectId: quiz
				});
			}
		},
		
		onPressMenu : function() {
			var quiz = sObjectId.slice(0,10);
			this.getRouter().navTo("quizpage", {
					objectId: quiz
				});	
		},
		
		_onObjectMatched : function (oEvent) {
			sObjectId =  oEvent.getParameter("arguments").objectId;
	
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("Questions", {
					QUESTIONID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
			if (updated === false){ 
				this._initAnswers();
				updated = true;
			}
		},
		
		_bindView : function (sObjectPath) {
			var oViewModel = this.getModel("questionView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		
		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("questionView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.QUESTIONID,
				sObjectName = oObject.QUESTION_TITLE;

			oViewModel.setProperty("/busy", false);

			oViewModel.setProperty("/shareSendEmailSubject",
			oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
			oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},
		
		_initAnswers : function (oEvent) {
   			oModel.read(
			"/Questions('" + sObjectId + "')",
			{	
				success: function(oData) {
					var oCount = new sap.ui.model.json.JSONModel({answerCount : oData.NUM_OF_ANSWERS});
					controller.setModel(oCount, "answerCount");
					controller._readAnswers();
					}
				}
			);	
   		},
   		
   		_readAnswers : function (oEvent) {
			var oCount = controller.getModel("answerCount").getData().answerCount; 
			var i = 0; 
   			while (i < oCount){
   				var oAnswer = sObjectId + i;
   				oModel.read(
				"/Answers('" + oAnswer + "')",
				{
					success: function(oData) {
						controller._displayAnswer(oData);
						}
					}
				);
   				i++;
   			}
   		}, 
   		
   		_displayAnswer : function (oData) {
   			//TODO Display various types
   			
   			var oRadioButton = new sap.m.RadioButton({
   					text: oData.ANSWER
   			});
   			controller.byId("answers").addContent(oRadioButton);
   		},
   		
   		_writeAnswers : function () {
   			//TODO write answers chosen when page is routed from
   		}
   });
});