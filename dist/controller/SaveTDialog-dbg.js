sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/Fragment"
], function (ManagedObject, Fragment) {
	"use strict";

	return ManagedObject.extend("demo.survey2.SurveyDemo2.controller.SaveTDialog", {

		constructor : function (oView) {
			this._oView = oView;
		},

		exit : function () {
			delete this._oView;
		},

		open : function () {
			var oView = this._oView;

			// create dialog lazily
			if (!oView.byId("saveTDialog")) {
				var oFragmentController = {
					onCloseDialog : function () {
						oView.byId("saveTDialog").close();
					}
				};
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "demo.survey2.SurveyDemo2.view.SaveTDialog",
					controller: oFragmentController
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				oView.byId("saveTDialog").open();
			}
		}

	});

});

/** Code to write to database
 * var oModel = new sap.ui.model.odata.v2.ODataModel("/SurveycrocdbDest/survey_pkg/myservice.xsodata/");
			var oData = {
				SURVEYID:100, SNAME:"Test2", SOWNER:"Ian", STYPE:"Quiz", SDATE: new Date(),  SLENGTH:1, SQUESTION:"Question", SANSWERS:"Answers"
			};
			oModel.create("/SURVEYS", oData);
 */