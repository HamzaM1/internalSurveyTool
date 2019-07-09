sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","../model/formatter"],function(e,t,o,n){"use strict";return e.extend("demo.survey2.SurveyDemo2.controller.Object",{formatter:n,onInit:function(){var e=this.byId("pieid");e.setVizProperties({legend:{title:{visible:false}},title:{text:"Surveys Test"}});var o=new sap.ui.model.json.JSONModel("/SurveycrocdbDest/survey_pkg/myservice.xsodata/SURVEYS/?$format=json");e.setModel(o);var n,i=new t({busy:true,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);n=this.getView().getBusyIndicatorDelay();this.setModel(i,"objectView");this.getOwnerComponent().getModel().metadataLoaded().then(function(){i.setProperty("/delay",n)})},onNavBack:function(){var e=o.getInstance().getPreviousHash();if(e!==undefined){history.go(-1)}else{this.getRouter().navTo("overview",{},true)}},onPressHome:function(e){var t=sap.ui.core.UIComponent.getRouterFor(this);t.navTo("overview")},onPressQuiz:function(e){var t=sap.ui.core.UIComponent.getRouterFor(this);t.navTo("quiz",{objectId:"SURVEYID"})},_onObjectMatched:function(e){var t=e.getParameter("arguments").objectId;this.getModel().metadataLoaded().then(function(){var e=this.getModel().createKey("SURVEYS",{SURVEYID:t});this._bindView("/"+e)}.bind(this))},_bindView:function(e){var t=this.getModel("objectView"),o=this.getModel();this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){o.metadataLoaded().then(function(){t.setProperty("/busy",true)})},dataReceived:function(){t.setProperty("/busy",false)}}})},_onBindingChange:function(){var e=this.getView(),t=this.getModel("objectView"),o=e.getElementBinding();if(!o.getBoundContext()){this.getRouter().getTargets().display("objectNotFound");return}var n=this.getResourceBundle(),i=e.getBindingContext().getObject(),s=i.SURVEYID,r=i.SNAME;t.setProperty("/busy",false);t.setProperty("/shareSendEmailSubject",n.getText("shareSendEmailObjectSubject",[s]));t.setProperty("/shareSendEmailMessage",n.getText("shareSendEmailObjectMessage",[r,s,location.href]))}})});