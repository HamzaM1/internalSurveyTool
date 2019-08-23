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
	var oFilter;
	var updated = false;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.Question", {
   		onInit: function (oEvent) {
   			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});

			this.getRouter().getRoute("question").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "questionView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				}
			);
   			this.getRouter().getRoute("question").attachPatternMatched(this._onObjectMatched, this);
   		},
   		
   		
   		onUpdateFinished : function (oEvent) {
			if (updated == false){
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
   		
		onPressHome: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		},
		
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("overview", {}, true);
			}
		},
		
		_onObjectMatched : function (oEvent) {
			sObjectId =  oEvent.getParameter("arguments").objectId;
			oFilter = new Filter({
				path: "QUESTIONID",
				operator: "EQ",
				value1: sObjectId
			});
			var oTable = this.byId("list"),
				oViewModel = this.getModel("questionView");
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("Questions", {
					QUESTIONID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
			
			oTable.getBinding("items").filter(oFilter, "Application");
		
			// Change O or 1 to Correct or Incorrect answer
			// TODO
			
			//alert(oTable.getMetadata().getPublicMethods());
			//var x = oTable.getItems("items");
			//alert(x);
			//for (var i in oTable.getItems("items")) {
			//	alert(i);
			//}
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
		
		onFilter : function () {
			var oFilter1 = []; 
			oFilter1.push(new Filter({
				path: "ANSWERID",
				operator: FilterOperator.StartsWith,
				value1: sObjectId
			}));
			oFilter1.push(new Filter({
				path: "SELECTED",
				operator: "EQ",
				value1: 1
			}));
			var oTable = this.byId("list1"); 
			oTable.getBinding("items").filter(oFilter1, "Application");
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
		}
   });
});