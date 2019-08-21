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
		
		
		//TODO link to previous question
		onPress : function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("surveyQuestion", {sq: sObjectId, type: "Radio", count: "0"});
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
				SQ_LINK: "", //TODO 
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
			/**
			// create questions
			var i = 0;
			var j = 0;
			var oAnswersCount = 2; //sap.ui.getCore().getModel("answersCount").getData().answersCount;
			var oQuestionsCount = 2; //to do
			var oQuestion = "test";
			var QuestionsoData;
			// create answers
			var oAnswer = "test";
			var AnswersoData;
			
			while (i < oQuestionsCount) { //need to make "1" amount of questions on quiz
				//oQuestion = sap.ui.getCore().getModel("question" + i).getData.question;
				//oQuestion = sap.ui.getCore().getModel("question" + i).getData().question;
				
				QuestionsoData = {
					QUESTIONID: oOwner + oQuizCount + i,
					SQID: oOwner + oQuizCount,
					QUESTION_TITLE: "Question " + (i + 1), 
					QUESTION: oQuestion,
					ANSWER_TYPE: "Radio", //to do
					NUM_OF_ANSWERS: oAnswersCount
				};
				oModel.create("/Questions", QuestionsoData);
				var oCorrect;
				if (sObjectId == "Quiz") {
					oCorrect = 0;
					}
				
				j = 0;
		  		while (j < oAnswersCount) { //need to make "1" amount of questions on quiz
					//oQuestion = sap.ui.getCore().getModel("question" + i).getData.question;
					//oAnswer = sap.ui.getCore().getModel("answer" + i).getData().answer;
					
					AnswersoData = {
						ANSWERID: oOwner + oQuizCount + i + j,
						QUESTIONID: oOwner + oQuizCount + i,
						ANSWER: "This is Answer " + (j + 1),
						ANSWER_CORRECT: oCorrect,
						ORDER: j + 1
					};
					oModel.create("/Answers", AnswersoData);
					j += 1; 
		  		}
				i += 1; 
			}
			
			
			**/
		  	
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
			updated++;
			
		}
		
	});

});

 