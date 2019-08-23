sap.ui.define([
   "./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
   "use strict";
	
	var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");
	var sObjectId;
	var oOwner;
	var controller;
	var oFilter;
	var updated = false;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.UserResults", {
		
		formatter: formatter,
		
   		onInit : function() {
   			controller = this; 
   			var oViewModel = new JSONModel({
				shareOnJamTitle: this.getResourceBundle().getText("questionTitle"),
				tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay : 0
			});
			this.setModel(oViewModel, "questionView");
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
				oViewModel = this.getModel("questionView");
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
			//sap.ui.controller("demo.survey2.SurveyDemo2.controller.Answer").onInit();
			this.getRouter().navTo("answer", {
				objectId: oItem.getBindingContext().getProperty("QUESTIONID")
			});
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
		
		onPressSubmit: function (oEvent) {
			oOwner = sap.ui.getCore().getModel("userapi").getData().name;
			var UserSQoData = {
				USQID: oOwner + sObjectId,
				USERID: oOwner,
				SQID: sObjectId,
				SUBMITTED: 1
			};
			var path = "/UserSQ('" + oOwner + sObjectId + "')";
			oModel.update(path, UserSQoData);
			
			oModel.read("/SQ('" + sObjectId + "')",
				{success : function(oData) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(controller);
					if (oData.SQ_TYPE === "Survey") {
						oRouter.navTo("surveyComplete");
					}
					else {
						oRouter.navTo("userResults", {
							objectId: oData.SQID
							});
					}
				}
			});
			
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
				SUBMITTED: 0
			};
			oModel.create("/UserSQ", UserSQoData);
			
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
		}
		
   	});
});


// IMPORTANT HOW TO ADD A RADIO BUTTON ECT. TO THE CORRESPONDING VIEW ***
   			// ********************************
   			
   			//var oRadioButton = new sap.m.RadioButton();
   			//this.byId("content").addContent(oRadioButton);
   			
   			//*********************************