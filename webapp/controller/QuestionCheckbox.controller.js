sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function (Controller, MessageToast, Fragment, JSONModel, History) {
	"use strict";
	
	var oModel;
	var oData;
	var answers = 2;

	
	return Controller.extend("demo.survey2.SurveyDemo2.controller.QuestionCheckbox", {
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("new", {}, true);
			}
		},
		
		onPressHome: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		},
		/**
		onPressPublish: function (oEvent) {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/test/dummy_pkg/myservice.xsodata/");
			var oData = {
				SQID: 0, SQ_TITLE: "Test"
			};
			oModel.create("/SQ", oData);
		}
		*/
		
		
		onPressPublish: function (oEvent) {
			var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
			var oTitle = sap.ui.getCore().getModel("title").getData().title;
			var oOwner = sap.ui.getCore().getModel("user").getData().user;
			var oQuizCount = "004";
			var oQuestionCount = "0"; //to do
			var d = new Date();
			
			// create survey
			var SQoData = {
				SQID: oOwner + oQuizCount,
				SQ_TITLE: oTitle, 
				SQ_LINK: "www.placeholder.com", //to do
				SQ_TYPE: sObjectId,
				DATE: d /**(d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()) */,
				SQ_OWNER: oOwner,
				NUM_OF_QUESTIONS: 10 //to do
			};
			oModel.create("/SQ", SQoData);
			
			// create questions
			var i = 0;
			var oAnswersCount = sap.ui.getCore().getModel("answersCount").getData().answersCount;
			var oQuestion;
			var QuestionsoData;
			
			while (i < 1) { //need to make "1" amount of questions on quiz
				//oQuestion = sap.ui.getCore().getModel("question" + i).getData.question;
				oQuestion = sap.ui.getCore().getModel("question" + i).getData().question;
				
				QuestionsoData = {
					QUESTIONID: oOwner + oQuizCount + oQuestionCount,
					SQID: oOwner + oQuizCount,
					QUESTION_TITLE: "Title", //Needed?
					QUESTION: oQuestion,
					ANSWER_TYPE: "Radio", //to do
					NUM_OF_ANSWERS: oAnswersCount
				};
				oModel.create("/Questions", QuestionsoData);
				i += 1; 
			}
			
			// create answers
			var oAnswer;
			var AnswersoData;
			i = 0;
			
		  	while (i < oAnswersCount) { //need to make "1" amount of questions on quiz
				//oQuestion = sap.ui.getCore().getModel("question" + i).getData.question;
				//oAnswer = sap.ui.getCore().getModel("answer" + i).getData().answer;
				AnswersoData = {
					ANSWERID: oOwner + oQuizCount + oQuestionCount + i,
					QUESTIONID: oOwner + oQuizCount + oQuestionCount,
					ANSWER: "xxx",
					ANSWER_CORRECT: 0,
					ORDER: i
				};
				oModel.create("/Answers", AnswersoData);
				i += 1; 
		  	}
		},
		
		getQuestion : function () {
			// read msg from i18n model
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/InputValue");
			var sMsg = oBundle.getText("question", [sRecipient]);

			// show message
			MessageToast.show(sMsg);
		},
		onOpenQDialog : function () {
			this.getOwnerComponent().openSaveQDialog();
		},
		onInit : function () {
			this.getRouter().getRoute("new").attachPatternMatched(this._onObjectMatched, this);
			oData = {
				//answers : {
					answer0 : "True",
					answer1 : "False",
					answer2 : "Maybe",
					answer3 : "",
					answer4 : ""
				//} 
			};
			oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
			sap.ui.getCore().setModel(oJsonModel, "answersCount");
		},
		
		handleLiveChange : function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oJsonModel = new sap.ui.model.json.JSONModel({question : sValue});
			sap.ui.getCore().setModel(oJsonModel, "question0");
		},
		
		onRemove : function () {
			if (answers > 2){
				answers -= 1;
				this.getView().byId("check" + answers).setVisible(false);
				this.getView().byId("inputlist" + answers).setVisible(false);
				var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
				sap.ui.getCore().setModel(oJsonModel, "answersCount");
			}
		},
		
		onAdd : function () {
			if (answers < 5){
				this.getView().byId("check" + answers).setVisible(true);
				this.getView().byId("inputlist" + answers).setVisible(true);
				answers += 1;
				var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
				sap.ui.getCore().setModel(oJsonModel, "answersCount");
			}
		},
		
		_onObjectMatched : function (oEvent) {
			sObjectId =  oEvent.getParameter("arguments").type;
			
		}
	});
});