sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, History) {
	"use strict";
	
	var oModel;
	var oModel1 = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
	var oData1;
	var answers;
	var sObjectId;
	var sQuestionCount;
	var sType;
	var oSQID;
	var sValue;
	var controller;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.SurveyQuestion", {
		onInit : function () {
			controller = this;
			oData1 = {
					answer0 : "Yes",
					answer1 : "No",
					answer2 : "Maybe",
					answer3 : "",
					answer4 : ""
			};
			oModel = new JSONModel(oData1);
			this.getView().setModel(oModel);
			var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
			sap.ui.getCore().setModel(oJsonModel, "answersCount");
			this.getRouter().getRoute("surveyQuestion").attachMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched : function(oEvent) {
			sObjectId =  oEvent.getParameter("arguments").type;
			sQuestionCount = oEvent.getParameter("arguments").count;
			var oQuestionCount = sap.ui.getCore().getModel("qcount").getData().qcount;
			sType = oEvent.getParameter("arguments").sq;
			if (sObjectId === "Radio" || sObjectId === "Check") {
				answers = 2;
			}
			else {
				answers = 1;
			}
			oSQID = sap.ui.getCore().getModel("currentsq").getData().currentsq;
			
			// if a new question
			if (sQuestionCount.toString() === oQuestionCount.toString()) {
				var SQoData = {
					SQID: oSQID,
					NUM_OF_QUESTIONS: (parseInt(sQuestionCount, 10) + 1)
					};
				oModel1.update("/SQ('" + oSQID + "')", SQoData);
				oQuestionCount++;
				var oJsonModel = new sap.ui.model.json.JSONModel({qcount : oQuestionCount});
				sap.ui.getCore().setModel(oJsonModel, "qcount");
				
				var QuestionsoData = {
					QUESTIONID: oSQID + sQuestionCount,
					SQID: oSQID,
					QUESTION_TITLE: "Question " + (parseInt(sQuestionCount, 10) + 1), 
					QUESTION: "",
					ANSWER_TYPE: sObjectId,
					NUM_OF_ANSWERS: answers
				};
			oModel1.create("/Questions", QuestionsoData);
			
			}
			this.createAnswers();
			//TODO display old answers if old question
		},
		
		onNavBack : function() {
			controller.byId("vbox").destroyItems();

			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("overview", {}, true);
			}
		},
		
		onPressHome: function (oEvent) {
			controller.byId("vbox").destroyItems();
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
			sValue = oEvent.getParameter("value");
			var QuestionsoData = {
					QUESTIONID: oSQID + sQuestionCount,
					SQID: oSQID,
					QUESTION_TITLE: "Question " + (parseInt(sQuestionCount, 10) + 1),
					QUESTION: sValue,
					ANSWER_TYPE: sObjectId,
					NUM_OF_ANSWERS: answers
				};
				oModel1.update("/Questions('" + oSQID + sQuestionCount + "')", QuestionsoData);
		},
		
		createAnswers : function (){
			var active = true;
			if (sType === "Survey") {
				active = false;
			}
			var AnswersoData;
			var correct0;
			var correct1;
				if (sType === "Quiz") {
					correct0 = 0;
					correct1 = 1;
				}
			if (sObjectId === "Slide") {
				var oSlide = new sap.m.Slider({
					id: oSQID + sQuestionCount + "0",
					enabled: active,
					enableTickmarks: true,
					value: 5,
					width: "60%",
					min: 0,
					max: 10,
					showAdvancedTooltip: true,
					showHandleTooltip: false,
					inputsAsTooltips: true,
					change: function(oEvent) {
   						controller.onSlide(oEvent);
   					}
				});
				this.getView().byId("vbox").addItem(oSlide);
				
				AnswersoData = {
						ANSWERID: oSQID + sQuestionCount + "0",
						QUESTIONID: oSQID + sQuestionCount,
						ANSWER: "0",
						ANSWER_CORRECT: correct0,
						ORDER: 1
					};
				oModel1.create("/Answers", AnswersoData);
			}
			else if (sObjectId === "Text") {
				var oInput = new sap.m.Input({
					id: oSQID + sQuestionCount + "0",
					enabled: active,
					width: "50%",
					value: "{/answer0}",
					liveChange: function(oEvent) {
   						controller.onType(oEvent);
   					}
				});
				this.getView().byId("vbox").addItem(oInput);
				
				AnswersoData = {
						ANSWERID: oSQID + sQuestionCount + "0",
						QUESTIONID: oSQID + sQuestionCount,
						ANSWER: oData1.answer0,
						ANSWER_CORRECT: correct0,
						ORDER: 1
					};
				oModel1.create("/Answers", AnswersoData);
			}
			else if (sObjectId === "Radio" || sObjectId === "Check") {
				var oForm; 
				var oList = new sap.m.List({
					id: "list",
					width: "50%",
					backgroundDesign: "Transparent"	
				});
				var oInputList0 = new sap.m.InputListItem({
   					id: "inputlist0"
   					});
   				var oInput0 = new sap.m.Input({
   					id: oSQID + sQuestionCount + "0t",
   					value: "{/answer0}",
   					valueLiveUpdate: true,
   					liveChange: function(oEvent) {
   						controller.onType2(oEvent);
   					}
   					});
   				oInputList0.addContent(oInput0);
   				var oInputList1 = new sap.m.InputListItem({
   					id: "inputlist1"
   					});
   				var oInput1 = new sap.m.Input({
   					id: oSQID + sQuestionCount + "1t",
   					value: "{/answer1}",
   					valueLiveUpdate: true,
   					liveChange: function(oEvent) {
   						controller.onType2(oEvent);
   					}
   					});
   				oInputList1.addContent(oInput1);
   				oList.addItem(oInputList0);
   				oList.addItem(oInputList1);
				var oButton0 = new sap.m.Button({
					id: "button0",
					icon: "sap-icon://add",
					press: function(){
						controller.onAdd();
						}
					});
				var oButton1 = new sap.m.Button({
					id: "button1",
					icon: "sap-icon://less",
					press: function(){
						controller.onRemove();
						}
					});
				if (sObjectId === "Radio") {
					var oRadioGroup = new sap.m.RadioButtonGroup({
						id: "radio",
						enabled: active
					});
					var oRadioButton0 = new sap.m.RadioButton({
   						id: oSQID + sQuestionCount + "0",
   						text: "{/answer0}",
   						select: function(oEvent) {
   							controller.onSelect(oEvent);
   							} 
   						});
   					var oRadioButton1 = new sap.m.RadioButton({
   						id: oSQID + sQuestionCount + "1",
   						text: "{/answer1}",
   						select: function(oEvent) {
   							controller.onSelect(oEvent);
   							} 
   						});
   					oRadioGroup.addButton(oRadioButton0);
   					oRadioGroup.addButton(oRadioButton1);
   					oForm = new sap.ui.layout.form.SimpleForm({
					editable: true,
					content: [oRadioGroup]
					});
					
					AnswersoData = {
						ANSWERID: oSQID + sQuestionCount + "0",
						QUESTIONID: oSQID + sQuestionCount,
						ANSWER: oData1.answer0,
						ANSWER_CORRECT: correct1,
						ORDER: 1
					};
					oModel1.create("/Answers", AnswersoData);
				
					AnswersoData = {
						ANSWERID: oSQID + sQuestionCount + "1",
						QUESTIONID: oSQID + sQuestionCount,
						ANSWER: oData1.answer1,
						ANSWER_CORRECT: correct0,
						ORDER: 2
					};
					oModel1.create("/Answers", AnswersoData);
				
				}
				else {
					var oCheckGroup = new sap.m.VBox({
						id: "check"
					});
					var oCheckBox0 = new sap.m.CheckBox({
   						id: oSQID + sQuestionCount + "0",
   						enabled: active,
   						text: "{/answer0}",
   						select: function(oEvent) {
   							controller.onSelect(oEvent);
   							} 
   						});
   					var oCheckBox1 = new sap.m.CheckBox({
   						id: oSQID + sQuestionCount + "1",
   						enabled: active,
   						text: "{/answer1}",
   						select: function(oEvent) {
   							controller.onSelect(oEvent);
   							} 
   						});
   					oCheckGroup.addItem(oCheckBox0);
   					oCheckGroup.addItem(oCheckBox1);
   					oForm = new sap.ui.layout.form.SimpleForm({
						editable: true,
						content: [oCheckGroup] 
					
					});
					
					AnswersoData = {
						ANSWERID: oSQID + sQuestionCount + "0",
						QUESTIONID: oSQID + sQuestionCount,
						ANSWER: oData1.answer0,
						ANSWER_CORRECT: correct0,
						ORDER: 1
					};
					oModel1.create("/Answers", AnswersoData);
				
					AnswersoData = {
						ANSWERID: oSQID + sQuestionCount + "1",
						QUESTIONID: oSQID + sQuestionCount,
						ANSWER: oData1.answer1,
						ANSWER_CORRECT: correct0,
						ORDER: 2
					};
					oModel1.create("/Answers", AnswersoData);
				}
				oForm.addContent(oList);
				this.getView().byId("vbox").addItem(oForm);
				this.getView().byId("vbox").addItem(oButton0);
				this.getView().byId("vbox").addItem(oButton1);
			}
		},
		
		onRemove : function () {
			if (answers > 2){
				answers -= 1;
				if (sObjectId === "Radio") {
					(this.getView().byId("vbox").getItems()[0].getContent()[0].getButtons()[answers]).destroy();
				}
				else {
					(this.getView().byId("vbox").getItems()[0].getContent()[0].getItems()[answers]).destroy();
				}
				(this.getView().byId("vbox").getItems()[0].getContent()[1].getItems()[answers]).destroy();
				var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
				sap.ui.getCore().setModel(oJsonModel, "answersCount");
				var QuestionsoData = {
					QUESTIONID: oSQID + sQuestionCount,
					SQID: oSQID,
					QUESTION_TITLE: "Question " + (parseInt(sQuestionCount, 10) + 1),
					QUESTION: sValue,
					ANSWER_TYPE: sObjectId,
					NUM_OF_ANSWERS: answers
				};
				oModel1.update("/Questions('" + oSQID + sQuestionCount + "')", QuestionsoData);
				oModel1.remove("/Answers('" + oSQID + sQuestionCount + answers + "')");
			}
		},
		
		onAdd : function () {
			var active = true;
			if (sType === "Survey") {
				active = false;
			}
			var ans;
			if (answers === 2) {
				ans = oData1.answer2;
			}
			else if (answers === 3) {
				ans = oData1.answer3;
			}
			else if (answers === 4) {
				ans = oData1.answer4;
			}
			var correct0;
				if (sType === "Quiz") {
					correct0 = 0;
				}
			if (answers < 5) {
				if (sObjectId === "Radio") {
					var oRadioButton = new sap.m.RadioButton({
   						id: oSQID + sQuestionCount + answers,
   						text: "{/answer" + answers + "}",
   						select: function(oEvent) {
   							controller.onSelect(oEvent);
   							} 
   						});
   					(this.getView().byId("vbox").getItems()[0].getContent()[0]).addButton(oRadioButton);
				}
				else{
   					var oCheckBox = new sap.m.CheckBox({
   						id: oSQID + sQuestionCount + answers,
   						enabled: active,
   						text: "{/answer" + answers + "}",
   						select: function(oEvent) {
   							controller.onSelect(oEvent);
   							} 
   						});
   					(this.getView().byId("vbox").getItems()[0].getContent()[0]).addItem(oCheckBox);
				}
   				
   				var AnswersoData = {
						ANSWERID: oSQID + sQuestionCount + answers,
						QUESTIONID: oSQID + sQuestionCount,
						ANSWER: ans,
						ANSWER_CORRECT: correct0,
						ORDER: (answers + 1) 
					};
					oModel1.create("/Answers", AnswersoData);
   				
   				var oInputList = new sap.m.InputListItem({
   					id: "inputlist" + answers
   					});
   				var oInput = new sap.m.Input({
   					id: oSQID + sQuestionCount + answers + "t",
   					value: "{/answer" + answers + "}",
   					valueLiveUpdate: true,
   					liveChange: function(oEvent) {
   						controller.onType2(oEvent);
   					}
   					});
   				oInputList.addContent(oInput);
   				(this.getView().byId("vbox").getItems()[0].getContent()[1]).addItem(oInputList);
   			
   				answers++;
   				var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
				sap.ui.getCore().setModel(oJsonModel, "answersCount");

				var QuestionsoData = {
					QUESTIONID: oSQID + sQuestionCount,
					SQID: oSQID,
					QUESTION_TITLE: "Question " + (parseInt(sQuestionCount, 10) + 1),
					QUESTION: sValue,
					ANSWER_TYPE: sObjectId,
					NUM_OF_ANSWERS: answers
				};
				oModel1.update("/Questions('" + oSQID + sQuestionCount + "')", QuestionsoData);
			}
		},
		
		onSelect : function (oEvent) {
			var oButton = oEvent.getSource();
   			var oAnswerId = oButton.getId(); 
   			var path = "/Answers('"+ oAnswerId + "')";
   			oModel1.read(path, 
   				{success : function(oData){
   					var AnswersoData;
   					if (oData.ANSWER_CORRECT !== 1) {
   						AnswersoData = {
   							ANSWER: oButton.getText(),
							ANSWER_CORRECT: 1
						};
   					}
   					else {
   						AnswersoData = {
							ANSWER: oButton.getText(),
							ANSWER_CORRECT: 0
   						};
   					}
					oModel1.update(path, AnswersoData);
   				}
   			});
		},
		
		onSlide : function (oEvent) {
			var oSlide = oEvent.getSource();
   			var oAnswerId = oSlide.getId();
   			var path = "/Answers('"+ oAnswerId + "')";
   			var AnswersoData = {
   				ANSWER: oSlide.getValue().toString()
   				};
   			oModel1.update(path, AnswersoData);
		},
		
		onType : function (oEvent) {
   			var oType = oEvent.getSource();
   			var oAnswerId = oType.getId();
   			var path = "/Answers('"+ oAnswerId + "')";
   			var UserAnswersoData = {
   				ANSWER: oType.getValue()
   			};
   			oModel1.update(path, UserAnswersoData);
		},
		
		onType2 : function (oEvent) {
			var oType = oEvent.getSource();
   			var oAnswerId = oType.getId().slice(0, -1);
   			var path = "/Answers('"+ oAnswerId + "')";
   			var UserAnswersoData = {
   				ANSWER: oType.getValue()
   			};
   			oModel1.update(path, UserAnswersoData);
		}
		
		
	});
});