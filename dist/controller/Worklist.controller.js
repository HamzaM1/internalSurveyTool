sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,i,a,r){"use strict";var s=new sap.ui.model.json.JSONModel({user:"I505340"});sap.ui.getCore().setModel(s,"user");var o=0;var n=new a({path:"LIVE",operator:"EQ",value1:1});return e.extend("demo.survey2.SurveyDemo2.controller.Worklist",{formatter:i,onInit:function(){var e,i,a=this.byId("list");i=a.getBusyIndicatorDelay();this._aTableSearchState=[];e=new t({worklistTableTitle:this.getResourceBundle().getText("worklistTableTitle"),shareOnJamTitle:this.getResourceBundle().getText("worklistTitle"),shareSendEmailSubject:this.getResourceBundle().getText("shareSendEmailWorklistSubject"),shareSendEmailMessage:this.getResourceBundle().getText("shareSendEmailWorklistMessage",[location.href]),tableNoDataText:this.getResourceBundle().getText("tableNoDataText"),tableBusyDelay:0});this.setModel(e,"worklistView");a.attachEventOnce("updateFinished",function(){e.setProperty("/tableBusyDelay",i)})},onUpdateFinished:function(e){if(o===2){var t=this.byId("list");var i=t.getItems();for(var r in i){if(i[r].getType()==="Navigation"){var s=i[r].getNumber();s=s.split(" ")[1]+"-"+s.split(" ")[2]+"-"+s.split(" ")[3];i[r].setNumber(s)}}}else if(o===1){var l=new a({path:"SQ_OWNER",operator:"EQ",value1:sap.ui.getCore().getModel("userapi").getData().name});var u=this.byId("list");var g=u.getBinding("items");g.filter(l)}o++;var h,t=e.getSource(),d=e.getParameter("total");if(d&&t.getBinding("items").isLengthFinal()){h=this.getResourceBundle().getText("worklistTableTitleCount",[d])}else{h=this.getResourceBundle().getText("worklistTableTitle")}this.getModel("worklistView").setProperty("/worklistTableTitle",h);this._applySearch(n)},onPress:function(e){this._showObject(e.getSource())},onFilter:function(e){var t=[];var i=e.getParameter("query");if(i){t.push(new a({caseSensitive:false,path:"SQ_TITLE",operator:r.Contains,value1:i}))}t.push(new a({path:"SQ_OWNER",operator:"EQ",value1:sap.ui.getCore().getModel("userapi").getData().name}));var s=this.byId("list");var n=s.getBinding("items");n.filter(t);o=2},onNavBack:function(){var e=History.getInstance().getPreviousHash();if(e!==undefined){history.go(-1)}else{this.getRouter().navTo("overview",{},true)}},onSearch:function(e){if(e.getParameters().refreshButtonPressed){this.onRefresh()}else{var t=[];var i=e.getParameter("query");if(i&&i.length>0){t=[new a({caseSensitive:false,path:"SQ_TITLE",operator:r.Contains,value1:i})]}this._applySearch(t)}},onRefresh:function(){var e=this.byId("list");e.getBinding("items").refresh();var t=new a({path:"SQ_OWNER",operator:"EQ",value1:sap.ui.getCore().getModel("userapi").getData().name});var i=e.getBinding("items");i.filter(t)},_showObject:function(e){this.getRouter().navTo("object",{objectId:e.getBindingContext().getProperty("SQID")})},_applySearch:function(e){var t=this.byId("list"),i=this.getModel("worklistView");t.getBinding("items").filter(e,"Application");if(e.length!==0){i.setProperty("/tableNoDataText",this.getResourceBundle().getText("worklistNoDataWithSearchText"))}}})});