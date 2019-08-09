sap.ui.define([
   "./BaseController",
   	"sap/ui/model/json/JSONModel",
   "sap/ui/core/routing/History"
], function (BaseController, JSONModel, History) {
   "use strict";

	var sObjectId;
	var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
	var oOwner;
	
   return BaseController.extend("demo.survey2.SurveyDemo2.controller.New", {
   		onInit : function(){
   			oOwner = sap.ui.getCore().getModel("userapi").getData().name;
   			//alert("/Users('" + oOwner + "')");
   			oModel.read(
				"/Users('" + oOwner + "')",
				{
					success: function(oData) {
    					var oCount = new sap.ui.model.json.JSONModel({count : oData.NUM_OF_SQ});
    					
						sap.ui.getCore().setModel(oCount, "count");
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
			
			var oTitle = sap.ui.getCore().getModel("title").getData().title;
			
			//var oCount = new sap.ui.model.json.JSONModel({count : 0});
			//sap.ui.getCore().setModel(oCount, "count");
			
			var oQuizCount = ("00" + (sap.ui.getCore().getModel("count").getData().count)).slice(-3);
			//alert(oQuizCount);
			var d = new Date();

			
			// create survey
			var SQoData = {
				SQID: oOwner + oQuizCount,
				SQ_TITLE: oTitle, 
				SQ_LINK: "www." + oTitle + ".com", //to do
				SQ_TYPE: sObjectId,		// this seems to be saving as undefined??
				DATE: d /**(d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()) */,
				SQ_OWNER: oOwner,
				NUM_OF_QUESTIONS: 10 //to do
			};
			oModel.create("/SQ", SQoData);
			
			// create questions
			var i = 0;
			var j = 0;
			var oAnswersCount = 1; //sap.ui.getCore().getModel("answersCount").getData().answersCount;
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
					QUESTION_TITLE: "Question" + (i + 1), 
					QUESTION: oQuestion,
					ANSWER_TYPE: "Radio", //to do
					NUM_OF_ANSWERS: oAnswersCount
				};
				oModel.create("/Questions", QuestionsoData);
				
				j = 0;
		  		while (j < oAnswersCount) { //need to make "1" amount of questions on quiz
					//oQuestion = sap.ui.getCore().getModel("question" + i).getData.question;
					//oAnswer = sap.ui.getCore().getModel("answer" + i).getData().answer;
					AnswersoData = {
						ANSWERID: oOwner + oQuizCount + i + j,
						QUESTIONID: oOwner + oQuizCount + oQuestionsCount,
						ANSWER: "Answer" + (j + 1),
						ANSWER_CORRECT: 0,
						ORDER: i
					};
					oModel.create("/Answers", AnswersoData);
					j += 1; 
		  		}
				i += 1; 
			}
			
			
			
		  	
		  	var oUpdate = {
				USERID: oOwner,
				NUM_OF_SQ: (sap.ui.getCore().getModel("count").getData().count) + 1
				}
			oModel.update(
				"/Users('" + oOwner + "')",
				oUpdate
			);
			
			var oCount = new sap.ui.model.json.JSONModel({count : (sap.ui.getCore().getModel("count").getData().count + 1)});
			sap.ui.getCore().setModel(oCount, "count");
			
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
		}
		
	});

});

 