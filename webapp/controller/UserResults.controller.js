sap.ui.define([
   "./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter"
], function (BaseController, JSONModel, History, formatter) {
   "use strict";
	
	var sObjectId;
	var controller;
	var oOwner;
	var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.UserResults", {
   		onInit : function() {
   			alert("called");
   			controller = this;
   			var oJsonModel = new sap.ui.model.json.JSONModel({correct : 0});
				this.setModel(oJsonModel, "correct");
			oJsonModel = new sap.ui.model.json.JSONModel({iscorrect : true});
				this.setModel(oJsonModel, "iscorrect");
			alert("called");
   			this.getRouter().getRoute("userResults").attachPatternMatched(this._onObjectMatched, this);
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
		
		_onObjectMatched : function (oEvent) {
			alert("called");
			sObjectId = oEvent.getParameter("arguments").objectId;
			oOwner = sap.ui.getCore().getModel("userapi").getData().name;
			alert("called");
			this.initSQ();
		},
		/**
			read each question from the quiz
				read each answer by the user
					compare the actual answer to the users answer
					increment 'correct' if right answer correct / num_of_questions = percentage
						 */
		initSQ : function (){
			alert("called1");
			var correct = 0;
			oModel.read("/SQ('" + sObjectId + "')",
				{success : function(oData) {
					//needed (NUM_OF_QUESTIONS)
					var i = 0;
					while(i < oData.NUM_OF_QUESTIONS) {
						controller.initQs(oData, i, oData.NUM_OF_QUESTIONS);
						i++;
					}
				}
			});
		},
		
		initQs : function (oData, i, qcount){
			alert("called2");
			oModel.read("/Questions('" + oData.SQID + i + "')",
				{success : function(oData1) {
					var j = 0;
					while (j < oData1.NUM_OF_ANSWERS) {
						controller.initAs(oData1, i, j, oData.ANSWER_TYPE, oData.NUM_OF_QUESTIONS, qcount);
						j++;
					}
				}
			});
		},
		
		initAs : function (oData, i, j, atype, acount, qcount){
			alert("called3");
			oModel.read("/Answers('" + oData.SQID + i + j + "')",
				{success : function(oData1) {
					controller.initUAs(oData1, i, j, atype, acount, qcount, oData1.ANSWER, oData1.ANSWER_CORRECT);
				}
			});
		},
		
		initUAs : function (oData, i, j, atype, acount, qcount, ans, acorrect){
			alert("called4");
			oModel.read("/UserAnswers('" + oOwner + oData.SQID + i + j + "')",
				{success : function(oData1) {
					if (atype === "Radio" || atype === "Check"){
						if (acorrect !== oData1.SELECTED) {
							alert("Incorrect Choice");
						}
					}
				}
			});
		}
   	});
});