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
	var oOwner;
	var dialog = 0; 
	var controller;
	var oFilter;
	var updated = false;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.UserResults", {
		
		formatter: formatter,
		
   		onInit : function() {
   			var oCount = new sap.ui.model.json.JSONModel({acount : 0});
			sap.ui.getCore().setModel(oCount, "acount");
			var oCorrect = new sap.ui.model.json.JSONModel({correct : true});
			sap.ui.getCore().setModel(oCorrect, "correct");
   			controller = this; 
   			var oViewModel = new JSONModel({
   				unanswered: "test",
				shareOnJamTitle: this.getResourceBundle().getText("questionTitle"),
				tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay : 0
			});
			this.setModel(oViewModel, "quizView");
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay;
			oViewModel = new JSONModel({
				busy : true,
				delay : 0
				});

			this.getRouter().getRoute("quizpage").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				}
			);

		},
   		
   		onUpdateFinished : function (oEvent) {
			if (updated === false){
				this._applySearch(oFilter);
				updated = true;
			}
		},
		
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("list"),
				oViewModel = this.getModel("quizView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("questionNoDataWithSearchText"));
			}
		}, 
   		
   		onPress : function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},
		
		_showObject : function (oItem) {
			oModel.read("/SQ('" + sObjectId + "')",
				{success : function(oData) {
					controller.getRouter().navTo("answer", {
						objectId: oItem.getBindingContext().getProperty("QUESTIONID"),
						count: oData.NUM_OF_QUESTIONS
					});
				}});
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
		
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		
		_onObjectMatched : function (oEvent) {
			
			var url = window.location.href;
			var pieces = url.split("/");
			var id = pieces.length - 1;
			sObjectId =  pieces[id];
			oOwner = sap.ui.getCore().getModel("userapi").getData().name;
   			var UserSQoData = {
				USQID: oOwner + sObjectId,
				USERID: oOwner,
				SQID: sObjectId,
				SUBMITTED: 0,
				PASSED: -1
			};
			oModel.create("/UsersSQ", UserSQoData);
			
			oFilter = new Filter({
				path: "SQID",
				operator: "EQ",
				value1: sObjectId
			});
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("SQ", {
					SQID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView : function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
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
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.SQID,
				sObjectName = oObject.SQ_TITLE;

			oViewModel.setProperty("/busy", false);

			oViewModel.setProperty("/shareSendEmailSubject",
			oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
			oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},
		
		onPressSubmit: function (oEvent) {
			oOwner = sap.ui.getCore().getModel("userapi").getData().name;
			oModel.read("/SQ('" + sObjectId + "')",
				{success : function(oData) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(controller);
					var UserSQoData;
					var path = "/UsersSQ('" + oOwner + sObjectId + "')";
					if (oData.SQ_TYPE === "Survey") {
						UserSQoData = {
							SUBMITTED: 1
							};
						oModel.update(path, UserSQoData);
						oRouter.navTo("surveyComplete");
					}
					else if (oData.SQ_TYPE === "Quiz") {
						controller.onCalculate(oData);
					}
				}
			});
			
		},
		
		onCalculate : function (oData) {
			var i = 0;
			while (i < oData.NUM_OF_QUESTIONS) {
				oModel.read("/Questions('" + oData.SQID + i + "')",
					{success : function(oData1) {
						controller.calculateQuestion(oData1, oData);
					}
				}); 
				i++; 
			}
		},
		
		calculateQuestion : function (oData, oData2){	
			var i = 0;
			while (i < oData.NUM_OF_ANSWERS) {
				oModel.read("/Answers('" + oData.QUESTIONID + i + "')",
					{success : function(oData1) {
						controller.compareAnswers(oData1, oData, oData2);
					}
				}); 
				i++; 
			}
		},
		
		compareAnswers : function (oData, oData2, oData3) {
			oModel.read("/UserAnswers('" + oOwner + oData.ANSWERID + "')",
				{success : function(oData1) {
					var correct = sap.ui.getCore().getModel("correct").getData().correct;
					if (correct === true) {
						if (oData2.ANSWER_TYPE === "Radio" || oData2.ANSWER_TYPE === "Check") {
							correct = (oData.ANSWER_CORRECT === oData1.SELECTED);
						}
						// todo check answers in lowercase and try freetext similar answers
						else {
							correct = (oData.ANSWER.toLowerCase() === oData1.ANSWER.toLowerCase());
						}
					}
					var oCorrect = new sap.ui.model.json.JSONModel({correct : correct});
					sap.ui.getCore().setModel(oCorrect, "correct");
					if (oData.ORDER === oData2.NUM_OF_ANSWERS) {
						var count = sap.ui.getCore().getModel("acount").getData().acount;
						if (correct) {
							count++;
						}
						oCorrect = new sap.ui.model.json.JSONModel({correct : true});
						sap.ui.getCore().setModel(oCorrect, "correct");
						var oCount = new sap.ui.model.json.JSONModel({acount : count});
						sap.ui.getCore().setModel(oCount, "acount");
						if (oData3.NUM_OF_QUESTIONS === parseInt(oData2.QUESTIONID.slice(-1), 10) + 1) {
							var percent = (count / oData3.NUM_OF_QUESTIONS * 100);
							var pass = 0;
							if (percent >= 40.0) {
								pass = 1;
							}
							var path = "/UsersSQ('" + oOwner + oData3.SQID + "')";
							var UserSQoData = {
								SUBMITTED: 1,
								PASSED: pass
							};
							oModel.update(path, UserSQoData);
						
							controller.getRouter().navTo("userResults", {
								objectId: percent.toFixed(2)
							});
						}
					}
				},
			error : function () {
					if (oData.ANSWERID.slice(-1) === "0") {
						var msg = ("Question " + (parseInt(oData2.QUESTIONID.slice(-1), 10) + 1) + " has not been answered.");
						controller.onQuestionUnanswered(msg); 
					}
				}
			});
		},
		
		onQuestionUnanswered : function (msg) {
			var oView = controller.getView();
			
			if (dialog === 0) {
				Fragment.load({
					id: "questionUnanswered",
					controller: controller,
					type: "XML",
					name: "demo.survey2.SurveyDemo2.view.QuestionUnanswered"
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.getContent()[0].setText(msg);
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
		}
   	});
});


// IMPORTANT HOW TO ADD A RADIO BUTTON ECT. TO THE CORRESPONDING VIEW ***
   			// ********************************
   			
   			//var oRadioButton = new sap.m.RadioButton();
   			//this.byId("content").addContent(oRadioButton);
   			
   			//*********************************