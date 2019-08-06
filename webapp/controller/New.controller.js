sap.ui.define([
   "./BaseController",
   	"sap/ui/model/json/JSONModel",
   "sap/ui/core/routing/History"
], function (BaseController, JSONModel, History) {
   "use strict";

	var sObjectId;

   return BaseController.extend("demo.survey2.SurveyDemo2.controller.New", {
   		onInit : function(){
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
				SQ_TYPE: sObjectId,		// this seems to be saving as undefined??
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
		}
	
	});

});

 