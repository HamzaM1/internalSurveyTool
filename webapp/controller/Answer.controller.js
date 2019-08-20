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
	var oOwner;
	var oAnswer;
	var controller;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.Answer", {
   		onInit: function (oEvent) {
   			oOwner = sap.ui.getCore().getModel("userapi").getData().name;
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
			this.getRouter().getRoute("answer").attachMatched(this._onRouteMatched, this);
   			//this.getRouter().getRoute("answer").attachPatternMatched(this._onObjectMatched, this);
   		},	
   		
   		_onRouteMatched : function (oEvent) {
   			sObjectId =  oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("Questions", {
					QUESTIONID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
			this._initAnswers();
   		},
   		
		onPressHome: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		},
		
		onNavBack : function() {
			controller.byId("answers").destroyContent();
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("overview", {}, true);
			}
		},
		
		onPressNext : function() {
			controller.byId("answers").destroyContent();
			var count = controller.getModel("answerCount").getData().answerCount;
			var quiz = sObjectId.slice(0,10);
			var question = sObjectId.slice(10,11);
			
			question++;
			if (count + 1 !== question) {
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
			controller.byId("answers").destroyContent();
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
					var oType = new sap.ui.model.json.JSONModel({answerType : oData.ANSWER_TYPE});
					controller.setModel(oCount, "answerCount");
					controller.setModel(oType, "answerType"); 
					controller._readAnswers();
					}
				}
			);	
   		},
   		
   		_readAnswers : function (oEvent) {
			var oCount = controller.getModel("answerCount").getData().answerCount; 
			var i = 0; 
   			while (i < oCount){
   				oAnswer = sObjectId + i;
   				oModel.read(
				"/Answers('" + oAnswer + "')",
				{
					success: function(oData) {
						var UserAnswersoData = {
							UAID: (oOwner + oData.ANSWERID),
							USERID: oOwner,
							ANSWERID: oData.ANSWERID,
							ANSWER: oData.ANSWER,
							SELECTED: 0
						};
						oModel.create("/UserAnswers", UserAnswersoData);
						controller._displayAnswer(oData);
					}
				}
				);
   				i++;
   			}
   			
   		}, 
   		
   		_displayAnswer : function (oData) {
   			var oType = controller.getModel("answerType").getData().answerType;
   			if(oType === "Radio") {
   				var oRadioButton = new sap.m.RadioButton({
   					id: oOwner + oData.ANSWERID,
   					text: oData.ANSWER,
   					select: function(oEvent) {
   						controller.onSelect(oEvent);
   					} 
   				});
   				controller.byId("answers").addContent(oRadioButton);
   			}
   			else if (oType === "Check") {
   				var oCheckBox = new sap.m.CheckBox({
   					id: oOwner + oData.ANSWERID,
   					text: oData.ANSWER,
   					select: function(oEvent) {
   						controller.onSelect(oEvent);
   					}
   				});
   				controller.byId("answers").addContent(oCheckBox);
   			}
   			else if (oType === "Slide") {
   				var oSlider = new sap.m.Slider({
   					id: oOwner + oData.ANSWERID,
   					min: 0,
   					max: 10,
   					change: function(oEvent) {
   						controller.onSlide(oEvent);
   					}
   				});
   				controller.byId("answers").addContent(oSlider);
   			}
   			else if (oType === "Text") {
   				var oInput = new sap.m.Input({
   					id: oOwner + oData.ANSWERID,
   					liveChange: function(oEvent) {
   						controller.onType(oEvent);
   					}
   				});
   				controller.byId("answers").addContent(oInput);
   			}
   		},
   		
   		onSelect : function (oEvent) {
   			var oButton = oEvent.getSource();
   			var oUAId = oButton.getId(); 
   			var oAnswerId = oUAId.slice(7,19);
   			
   			var path = "/UserAnswers('"+ oUAId + "')";
   			oModel.read(path, 
   				{success: function(oData){
   					var UserAnswersoData;
   					if (oData.SELECTED === 0) {
   						UserAnswersoData = {
							UAID: oUAId,
							USERID: oOwner,
							ANSWERID: oAnswerId,
							ANSWER: oButton.getText(),
							SELECTED: 1
						};
   					}
   					else {
   						UserAnswersoData = {
							UAID: oUAId,
							USERID: oOwner,
							ANSWERID: oAnswerId,
							ANSWER: oButton.getText(),
							SELECTED: 0
   						};
   					}
					oModel.update(path, UserAnswersoData);
   				}
   			});
   		},
   		
   		onSlide : function (oEvent) {
   			var oSlide = oEvent.getSource();
   			var oUAId = oSlide.getId();
   			var oAnswerId = oUAId.slice(7, 19);
   			var path = "/UserAnswers('"+ oUAId + "')";
   			var UserAnswersoData = {
   				UAID: oUAId,
   				USERID: oOwner,
   				ANSWERID: oAnswerId,
   				ANSWER: oSlide.getValue().toString(),
   				SELECTED: 1
   			};
   			oModel.update(path, UserAnswersoData);
   		},
   		
   		onType : function (oEvent) {
   			var oType = oEvent.getSource();
   			var oUAId = oType.getId();
   			var oAnswerId = oUAId.slice(7, 19);
   			var path = "/UserAnswers('"+ oUAId + "')";
   			var UserAnswersoData = {
   				UAID: oUAId,
   				USERID: oOwner,
   				ANSWERID: oAnswerId,
   				ANSWER: oType.getValue(),
   				SELECTED: 1
   			};
   			oModel.update(path, UserAnswersoData);
   		}
   });
});