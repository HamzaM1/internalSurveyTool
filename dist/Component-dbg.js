sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"./controller/ErrorHandler",
	"sap/ui/model/json/JSONModel",
	"./controller/SaveQDialog",
	"./controller/SaveTDialog"
], function (UIComponent, Device, models, ErrorHandler, JSONModel, SaveQDialog, SaveTDialog) {
	"use strict";

	return UIComponent.extend("demo.survey2.SurveyDemo2.Component", {

		metadata : {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init : function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
			
			// set data model
			var oData = {
				recipient : {
					title : "Please enter the Survey Title here",
					question : "Please enter the question here"
					// question : sap.ui.getCore().byId("enterQ").getText()
				}
			};
			var oModel = new JSONModel(oData);
			//this.setModel(oModel);
			
			// set dialog
			this._saveQDialog = new SaveQDialog(this.getRootControl());
			this._saveTDialog = new SaveTDialog(this.getRootControl());
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy : function () {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				// eslint-disable-next-line sap-no-proprietary-browser-api
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},
		
		exit : function () {
			this._saveQDialog.destroy();
			this._saveTDialog.destroy();
			delete this._saveQDialog;
			delete this._saveTDialog;
		},
		openSaveQDialog : function () {
			this._saveQDialog.open();
		},
		openSaveTDialog : function () {
			this._saveTDialog.open();
		}
//Edward
	});

});