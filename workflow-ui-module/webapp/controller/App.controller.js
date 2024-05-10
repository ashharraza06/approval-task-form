sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("form.workflowuimodule.controller.App", {
      onInit() {
        debugger
        var username = new sap.ushell.services.UserInfo().getEmail();
        this.byId("appid").setText(username);
        var pono = this.getOwnerComponent().oModels.context.oData.cpono;
        if (pono == null) {
          this.byId("povw").setVisible(false);
        }
      },
      comments: async function (oEvent) {
        debugger
        var cdialog = new sap.m.Dialog({
          title: "Comments",
          endButton: new sap.m.Button({
            text: "Close",
            press: async function () {
              cdialog.close();
            },
            layoutData: new sap.m.FlexItemData({
              // Add layoutData for flexible item behavior
              growFactor: 5,
              alignSelf: "End" // Align the button to the end (right)
            })
          })
        });
        cdialog.addContent(new sap.m.VBox({
          width: "60vw"
        }));

        function generateUniqueId() {
          var randomNumber = Math.floor(Math.random() * 1000000);
          var timestamp = new Date().getTime();
          var uniqueId = timestamp + '-' + randomNumber;
          return uniqueId;
        }
        debugger
        var commresult = this.getOwnerComponent().oModels.context.oData.commentsin;
        var pic = "https://toppng.com/public/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png";
        for (var i = 0; i < commresult.length; i++) {


          var oTimelineItem = new sap.suite.ui.commons.TimelineItem("thisuniqid1" + generateUniqueId(), {
            dateTime: commresult[i].createdAt,
            userNameClickable: false,
            // title: title,
            // userNameClicked: "onUserNameClick",
            // select: onPressItems,
            userPicture: pic,
            text: commresult[i].comments,
            userName: commresult[i].createdBy
          });
          cdialog.addContent(oTimelineItem);
        }
        // var t;
        // function onPressItems(oEvent) {
        //   debugger
        //   // Get the clicked timeline item
        //   t = oEvent.getSource().mProperties.text;
        //   commnetbox.setValue(t);
        //   cdialog.close();
        // }

        cdialog.open();
      },

      onOpenPressed: function (oEvent) {
        debugger;
        oEvent.preventDefault();
        var attach = oEvent.oSource.mProperties.url;
        var url = "https://10134ddctrial-dev-vendorapp-srv.cfapps.us10-001.hana.ondemand.com" + attach;
        // Open the URL in a new tab
        window.open(url);


      },
      onAfterRendering: function () {
        debugger
        var username = new sap.ushell.services.UserInfo().getEmail();
        this.byId("appid").setText(username);
        var pono = this.getOwnerComponent().oModels.context.oData.cpono;
        if (pono == null) {
          this.byId("povw").setVisible(false);
        }


      },
      onBeforeRendering: function () {
        var bd = this.getOwnerComponent().oModels.context.oData.table[0].Begin_DateAND_Time;
        const d = new Date();
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const startDateParts = bd.split("-").map(Number);
        const endDateParts = formattedDate.split("-").map(Number);
        const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
        const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);

        // Calculate the difference in milliseconds
        const differenceInMs = endDate - startDate;

        // Convert milliseconds to days
        const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
        // var days = daysDiff.toString();
        var lvl = this.getOwnerComponent().oModels.context.oData.clevel;
        if (lvl == "1.0") {
          const workingdays = 7;

          var notify = (workingdays - days) + " days left to take action";
          // var notifyControl = sap.ui.getCore().byId("approval::complainsObjectPage--fe::CustomSubSection::Noti--notification");
          var notifyControl = this.byId("notification");

          // Remove existing color classes if any
          notifyControl.removeStyleClass("greenText yellowText redText");

          // Add color class based on the value of days
          if (days <= 2) {
            notifyControl.addStyleClass("greenText");
          } else if (days >= 3 && days <= 5) {
            notifyControl.addStyleClass("yellowText");
          } else {
            notifyControl.addStyleClass("redText");
          }

          notifyControl.setText(notify);
        }

        else if (lvl == "2.0") {
          const workingdays = 21;

          var notify = (workingdays - days) + " days left to take action";
          // var notifyControl = sap.ui.getCore().byId("approval::complainsObjectPage--fe::CustomSubSection::Noti--notification");
          var notifyControl = this.byId("notification");

          // Remove existing color classes if any
          notifyControl.removeStyleClass("greenText yellowText redText");

          // Add color class based on the value of days
          if (days <= 6) {
            notifyControl.addStyleClass("greenText");
          } else if (days >= 6 && days <= 16) {
            notifyControl.addStyleClass("yellowText");
          } else {
            notifyControl.addStyleClass("redText");
          }

          notifyControl.setText(notify);
        }












      }


    });
  }
);
