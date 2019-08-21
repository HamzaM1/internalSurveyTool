sap.ui.define([
	"./BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function (BaseController, Fragment, JSONModel, History) {
	"use strict";
	
	var oModel;
	var oData;
	var answers;
	var sObjectId;
	var sQuestionCount;
	var sType;
	var controller;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.SurveyQuestion", {
		onInit : function () {
			controller = this;
			oData = {
					answer0 : "Yes",
					answer1 : "No",
					answer2 : "Maybe",
					answer3 : "",
					answer4 : ""
			};
			oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
			sap.ui.getCore().setModel(oJsonModel, "answersCount");
			this.getRouter().getRoute("surveyQuestion").attachMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched : function(oEvent) {
			answers = 2;
			sObjectId =  oEvent.getParameter("arguments").type;
			sQuestionCount = oEvent.getParameter("arguments").count;
			sType = oEvent.getParameter("arguments").sq;
			var oQuestionCount = sap.ui.getCore().getModel("qcount").getData().qcount;
			var oSQID = sap.ui.getCore().getModel("currentsq").getData().currentsq;
			var QuestionsoData = {
					QUESTIONID: oSQID + oQuestionCount,
					SQID: oSQID,
					QUESTION_TITLE: "Question " + (oQuestionCount + 1), 
					QUESTION: "",
					ANSWER_TYPE: sObjectId,
					NUM_OF_ANSWERS: answers
				};
				//oModel.create("/Questions", QuestionsoData);
			this.createAnswers();

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
			var sValue = oEvent.getParameter("value");
			var oJsonModel = new sap.ui.model.json.JSONModel({question : sValue});
			sap.ui.getCore().setModel(oJsonModel, "question0");
		},
		
		createAnswers : function (){
			if (sObjectId === "Slide") {
				var oSlide = new sap.m.Slider({
					id: "slide0",
					enableTickmarks: true,
					value: 5,
					width: "60%",
					min: 0,
					max: 10,
					showAdvancedTooltip: true,
					showHandleTooltip: false,
					inputsAsTooltips: true
				});
				this.getView().byId("vbox").addItem(oSlide);
			}
			else if (sObjectId === "Text") {
				var oInput = new sap.m.Input({
					id: "input0",
					width: "50%",
					value: "{/answer0}"
				});
				this.getView().byId("vbox").addItem(oInput);
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
   					id: "input0",
   					value: "{/answer0}",
   					valueLiveUpdate: true
   					});
   				oInputList0.addContent(oInput0);
   				var oInputList1 = new sap.m.InputListItem({
   					id: "inputlist1"
   					});
   				var oInput1 = new sap.m.Input({
   					id: "input1",
   					value: "{/answer1}",
   					valueLiveUpdate: true
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
						id: "radio"
					});
					var oRadioButton0 = new sap.m.RadioButton({
   						id: "radio0",
   						text: "{/answer0}"
   						});
   					var oRadioButton1 = new sap.m.RadioButton({
   						id: "radio1",
   						text: "{/answer1}"
   						});
   					oRadioGroup.addButton(oRadioButton0);
   					oRadioGroup.addButton(oRadioButton1);
   					oForm = new sap.ui.layout.form.SimpleForm({
					editable: true,
					content: [oRadioGroup]
				});
				}
				else {
					var oCheckGroup = new sap.m.VBox({
						id: "check"
					});
					var oCheckBox0 = new sap.m.CheckBox({
   						id: "check0",
   						text: "{/answer0}"
   						});
   					var oCheckBox1 = new sap.m.CheckBox({
   						id: "check1",
   						text: "{/answer1}"
   						});
   					oCheckGroup.addItem(oCheckBox0);
   					oCheckGroup.addItem(oCheckBox1);
   					oForm = new sap.ui.layout.form.SimpleForm({
						editable: true,
						content: [oCheckGroup] 
					});
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
			}
		},
		
		onAdd : function () {
			if (answers < 5) {
				if (sObjectId === "Radio") {
					var oRadioButton = new sap.m.RadioButton({
   						id: "radio" + answers,
   						text: "{/answer" + answers + "}"
   						});
   					(this.getView().byId("vbox").getItems()[0].getContent()[0]).addButton(oRadioButton);
				}
				else{
   					var oCheckBox = new sap.m.CheckBox({
   						id: "check" + answers,
   						text: "{/answer" + answers + "}"
   						});
   					(this.getView().byId("vbox").getItems()[0].getContent()[0]).addItem(oCheckBox);
				}
   			
   				var oInputList = new sap.m.InputListItem({
   					id: "inputlist" + answers
   					});
   				var oInput = new sap.m.Input({
   					id: "input" + answers,
   					value: "{/answer" + answers + "}",
   					valueLiveUpdate: true
   					});
   				oInputList.addContent(oInput);
   				(this.getView().byId("vbox").getItems()[0].getContent()[1]).addItem(oInputList);
   			
   				answers++;
   				var oJsonModel = new sap.ui.model.json.JSONModel({answersCount : answers});
				sap.ui.getCore().setModel(oJsonModel, "answersCount");
			}
		}
		
	});
});