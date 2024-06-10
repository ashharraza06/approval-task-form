sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ushell/services/UserInfo"
  ],
  function (BaseController) {
    "use strict";
    var mainServiceUrl;
    var oData;
    var complainttype;
    var pan;
    var vencode;
    var po;
    var status;
    var compdesc;
    let files;
    let comm;
    let workflow;;
    var uid;
    let filesids = [];
    var username;
    var compno;
    var clevel;
    var approveddata;
    var commout;
    var oData1;
    return BaseController.extend("form.workflowuimodule.controller.App", {
      onInit() {
        debugger
        username = new sap.ushell.services.UserInfo().getEmail();
        this.byId("appid").setText(username);
        // *****************ajax call to fill the form***************************************************************
        compno = this.getOwnerComponent().oModels.context.oData.complainno;
        clevel = this.getOwnerComponent().oModels.context.oData.clevel;
        var mainService = this.getOwnerComponent().oModels.context.oData.baseurl;
        mainServiceUrl = "https://" + mainService;
        //****************************************************************************************** */
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
      // var commresult = this.getOwnerComponent().oModels.context.oData.commentsin;
        var commresult = oData.comptocomm;

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

      // onOpenPressed: function (oEvent) {
      //   debugger;
      //   oEvent.preventDefault();
      //   var attach = oEvent.oSource.mProperties.url;
      //   var url = "https://10134ddctrial-dev-vendorapp-srv.cfapps.us10-001.hana.ondemand.com" + attach;
      //   // Open the URL in a new tab
      //   window.open(url);


      // },

      onBeforeRendering: async function () {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        debugger
        this.byId("appid").setText(username);
        username = new sap.ushell.services.UserInfo().getEmail();
        compno = this.getOwnerComponent().oModels.context.oData.complainno;
        clevel = this.getOwnerComponent().oModels.context.oData.clevel;
        var mainService = this.getOwnerComponent().oModels.context.oData.baseurl;
        mainServiceUrl = "https://" + mainService;
        await $.ajax({
          // url: `${mainServiceUrl}/odata/v4/my/VOB_Screen4?$filter=id eq ${vobid}&$expand=vob_yoy_scr4,vob_suplier4($expand=*),vob_comments,vob_files,vob_to_Workflow_History`,
          url: `${mainServiceUrl}/odata/v4/my/complains?$filter=complainno eq '${compno}'&$expand=comptofile,comptocomm,comptoworkflow`,

          method: 'GET',
          success: function (response) {
            debugger
            oData = response.value[0]
            console.log('Success:', response);
            // Handle successful response here
          },
          error: function (xhr, status, error) {
            debugger
            console.error('Error:', error);
            // Handle error here
          }
        });
        complainttype = oData.ccomplain_about;
        po = oData.cpono;
        pan = oData.cpannum;
        vencode = oData.cvencode;
        status = oData.cstatus;
        compdesc = oData.cdesc;
        files = oData.comptofile;
        comm = oData.comptocomm;
        workflow = oData.comptoworkflow;

        this.byId("pan_valvw").setText(pan);
        this.byId("ven_valvw").setText(vencode);
        if (po == '-') {
          this.byId("povw").setVisible(false);
        }
        else {
          this.byId("po_valvw").setText(po);
        }
        this.byId("status_valvw").setText(status);
        this.byId("dsc_valvw").setValue(compdesc);
        this.byId("typ_valvw").setText(complainttype);


        // Create a JSON model and set the data
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData({ table: workflow });

        // Get reference to your table by its ID
        // var oTable = sap.ui.getCore().byId("table");
        var oTable = this.byId("table");


        // Set the model to the table
        oTable.setModel(oModel);

        // Bind the items aggregation of the table to the model
        oTable.bindAggregation("items", {
          path: "/table",
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: "{level}" }),
              new sap.m.Text({ text: "{Employee_ID}" }),
              new sap.m.Text({ text: "{Begin_DateAND_Time}" }),
              new sap.m.Text({ text: "{End_DateAND_Time}" }),
              new sap.m.Text({ text: "{Days_Taken}" }),
              new sap.m.Text({ text: "{Notification_Status}" }),
              new sap.m.Text({ text: "{Approved_by}" })
            ]
          })
        });

        var oUploadSet = this.byId("uploadSet");
        // this.byId("").setText();
        for (let i = 0; i < files.length; i++) {

          oUploadSet.addItem(new sap.m.upload.UploadSetItem({
            visibleEdit: false,
            visibleRemove: false,
            url: `${files[i].url}`,
            fileName: `${files[i].fileName}`,
            mediaType: `${files[i].mediaType}`,
            openPressed: function (oEvent) {
              debugger;
              oEvent.preventDefault();
              var attach = oEvent.oSource.mProperties.url;
              var url = mainServiceUrl + attach;
              // Open the URL in a new tab
              window.open(url);
            },
            removePressed: function (oEvent) {
              debugger
            }
          }))

        }

        // var bd = this.getOwnerComponent().oModels.context.oData.table[0].Begin_DateAND_Time;
        var bd = workflow[0].Begin_DateAND_Time;
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

      },
      commchange: function (oEvent) {
        debugger
      //   commout = this.byId("ta").getValue();
      //   approveddata = {
      //     commout: commout,
      //     compno: compno,
      //     username: username,
      //     clevel: clevel,
      //     url: mainServiceUrl,
      //     comptype: complainttype
      // }
      //   this.getView().getModel("device").setProperty("/approveddata", JSON.stringify(approveddata));
        
      },
      onAfterRendering: async function (oEvent){
        debugger;
        this.byId("appid").setText(username);
      //   compno = this.getOwnerComponent().oModels.context.oData.complainno;
      //   clevel = this.getOwnerComponent().oModels.context.oData.clevel;
      //   complainttype = oData.ccomplain_about;
      //   var inclevel = parseFloat(clevel);
      //   inclevel += 1; 
      //   var newLevelString = (Math.round(inclevel * 10) / 10).toFixed(1).toString();

      //   var mainService = this.getOwnerComponent().oModels.context.oData.baseurl;
      //   mainServiceUrl = "https://" + mainService;
        
        
      //   await $.ajax({
      //     url: `${mainServiceUrl}/odata/v4/my/levels?$filter=level eq '${newLevelString}' and complainttype eq '${complainttype}'`,
      //     method: 'GET',
      //     success: function (response) {
      //       debugger
      //       oData1 = response.value[0]
      //       console.log('Success:', response);
      //       // Handle successful response here
      //     },
      //     error: function (xhr, status, error) {
      //       debugger
      //       console.error('Error:', error);
      //       // Handle error here
      //     }
      //   });
      //  if (oData1 !== null){
      //  this.byId("lvl").setText(oData1.level);
      //  this.byId("nextusers").setText(oData1.employeid);
      //  this.byId("wds").setText(oData1.Workingdays); 
      //  }
      //  else
      //   {
      //     this.byId("lvl").setText("");
      //  this.byId("nextusers").setText("");
      //  this.byId("wds").setText(""); 
      //   }
      },

      //     **********************upload attachments****************************************************
      onAfterItemAdded: function (oEvent) {
        debugger;
        var url1 = mainServiceUrl + `/odata/v4/my/`;
        // var url1 = `/odata/v4/my/`
        var item = oEvent.getParameter("item");
        var complaintno = this.getOwnerComponent().oModels.context.oData.complainno;
        var _createEntity = function (item) {
          debugger;
          var data = {
            mediaType: item.getMediaType(),
            fileName: item.getFileName(),
            size: item.getFileObject().size,
            complaintno: complaintno
          };

          var settings = {
            // url: "/odata/v4/my/files",
            url: url1 + `files`,
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            data: JSON.stringify(data)
          };

          return new Promise((resolve, reject) => {
            $.ajax(settings)
              .done((results, textStatus, request) => {
                resolve(results.ID);
                debugger
                filesids.push(results.ID);
                uid = results.ID;
              })
              .fail((err) => {
                reject(err);
              });
          });
        };

        _createEntity(item)
          .then((id) => {
            debugger
            // var url = `/odata/v4/my/files(${id})/content`;
            var url = url1 + `files(${id})/content`
            item.setUploadUrl(url);
            item.setUrl(url);
            var oUploadSet = this.byId("uploadSet");
            oUploadSet.setHttpRequestMethod("PUT");
            oUploadSet.uploadItem(item);

          })
          .catch((err) => {
            console.log(err);
          });
      },

      onUploadCompleted: async function (oEvent) {
        debugger
        var oUploadSet = this.byId("uploadSet");
        oUploadSet.removeAllIncompleteItems();
        // let funct = 'submitcomplaints';
        // var ofunc = this.getView().getModel().bindContext(`/${funct}(...)`);
        // var dat = JSON.stringify({
        //   uid: uid,
        //   createdBy: username1
        // });
        // ofunc.setParameter('data', dat);
        // ofunc.setParameter('status', JSON.stringify({ status: 'patchattach' }));
        // await ofunc.execute();
        oUploadSet.getBinding("items").refresh();
      },
      onRemovePressed: function (oEvent) {
        debugger
        oEvent.preventDefault();
        oEvent.getParameter("item").getBindingContext().delete();
        sap.m.MessageToast.show("Selected file has been deleted");
      },

      onOpenPressed: function (oEvent) {
        debugger;
        oEvent.preventDefault();
        var item = oEvent.getSource();
        var fileName = item.getFileName();
        // var url2 = this.oView.getModel().sServiceUrl
        // url2 = url2.replace('/odata/v4/my/', '');
        var url2 = mainServiceUrl + `/odata/v4/my/`;

        var _download = function (item) {
          var settings = {
            url: url2 + item.getUrl(),
            // url: item.getUrl(),
            method: "GET",
            headers: {
              "Content-type": "application/octet-stream"
            },
            xhrFields: {
              responseType: 'blob'
            }
          };

          return new Promise((resolve, reject) => {
            $.ajax(settings)
              .done((result) => {
                resolve(result);
              })
              .fail((err) => {
                reject(err);
              });
          });
        };

        _download(item)
          .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            // Open the URL in a new tab
            window.open(url, '_blank');
          })
          .catch((err) => {
            console.log(err);
          });
      },


      _download: function (item) {
        debugger;
        var settings = {
          url: item.getUrl(),
          method: "GET",
          headers: {
            "Content-type": "application/octet-stream"
          },
          xhrFields: {
            responseType: 'blob'
          }
        }

        return new Promise((resolve, reject) => {
          $.ajax(settings)
            .done((result) => {
              resolve(result)
            })
            .fail((err) => {
              reject(err)
            })
        });
      },

      _createEntity: function (item) {
        debugger
        var data = {
          mediaType: item.getMediaType(),
          fileName: item.getFileName(),
          size: item.getFileObject().size
        };

        var settings = {
          url: "/attachments/files",
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          data: JSON.stringify(data)
        }

        return new Promise((resolve, reject) => {
          $.ajax(settings)
            .done((results, textStatus, request) => {
              resolve(results.ID);
              debugger
              arr.push(results.ID);
            })
            .fail((err) => {
              reject(err);
            })
        })
      },

      _uploadContent: function (item, id) {
        debugger
        var url = `/attachments/Files(${id})/content`
        item.setUploadUrl(url);
        item.addAttribute(new sap.m.ObjectAttribute({
          title: "Upload by",
          text: "test",
          active: true
        }));
        var oUploadSet = this.byId("uploadSet");
        oUploadSet.setHttpRequestMethod("PUT")
        oUploadSet.uploadItem(item);
      },

      //formatters
      formatThumbnailUrl: function (mediaType) {
        debugger;
        var iconUrl;
        switch (mediaType) {
          case "image/png":
            iconUrl = "sap-icon://card";
            break;
          case "text/plain":
            iconUrl = "sap-icon://document-text";
            break;
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            iconUrl = "sap-icon://excel-attachment";
            break;
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            iconUrl = "sap-icon://doc-attachment";
            break;
          case "application/pdf":
            iconUrl = "sap-icon://pdf-attachment";
            break;
          default:
            iconUrl = "sap-icon://attachment";
        }
        return iconUrl;
      }



    });
  }
);
