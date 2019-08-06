 sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter"
], function (BaseController, JSONModel, History, formatter) {
	"use strict";
	
	var oModel = new sap.ui.model.odata.v2.ODataModel("/project/intern-project/intern-project-odata.xsodata/");

	var sObjectId;
	
	return BaseController.extend("demo.survey2.SurveyDemo2.controller.Object", {

		formatter: formatter,

		
		// Initialization of application
		onInit:function(){
			
			/**
			var oChart = this.byId("pieid");
			oChart.setVizProperties({
				legend:{
    				title:{visible:false}
				},
			title: {
    			text: "Surveys Test"
				}
			});
			
			var oJsonModel = new sap.ui.model.json.JSONModel('/SurveycrocdbDest/survey_pkg/myservice.xsodata/SURVEYS/?$format=json');
			
			//var oModel = new sap.ui.model.odata.v2.ODataModel("/SURVEYS");
		
			// Loading data to model
			//json.loadData("placeholder.json",null,false);
		
			// Setting model to current view
			//this.getView().setModel(oJsonModel);
    		//          OR
			// Setting model to pie chart
			oChart.setModel(oJsonModel);
			//}
			*/
	//	});
	//});


		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */

		//onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				}
			);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

	
		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */

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
		
		onPressQuiz: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//alert("{SQID}");
			oRouter.navTo("quizpage"
				//, {objectId: oItem.getBindingContext().getProperty("SQID")}
				);
		},
		
		onDelete : function (oEvent) {
			
			oModel.remove(this.getModel().createKey("/SQ", {
					SQID :  sObjectId
				}));
			
			var i = 0;
			while(i < 1){ //need to replace with no of questions
				oModel.remove(this.getModel().createKey("/Questions", {
						QUESTIONID :  sObjectId + i
					}));
				var j = 0;
				while (j < 1 /** sap.ui.getCore().getModel("answersCount").getData().answersCount */) {
					oModel.remove(this.getModel().createKey("/Answers", {
						ANSWERID :  sObjectId + i + j
					}));
					j += 1;
				}
			i += 1;
			}
			
			
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
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
			sObjectId =  oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("SQ", {
					SQID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */

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

 