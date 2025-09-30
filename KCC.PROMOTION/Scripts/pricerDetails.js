var tblItems = null;
var tblItemsBL = null;
var itemRow = null;
var selectedRowElem = null;
var theElement;
var tblFreeListItems = null;
var transactionStatus = null;
var conflictCnt = 0;

$(function () {
    var $scrollingLoader = $("#loadingcontainer");
    var $scrollingAdminVerification = $("#PopAdminAcctContainer");
    $(window).scroll(function (e) {
        $scrollingLoader.stop().animate({ "marginTop": ($(window).scrollTop() + 200) + "px" }, "slow");
    });

    $(window).scroll(function (e) {
        $scrollingAdminVerification.stop().animate({ "marginTop": ($(window).scrollTop() + 200) + "px" }, "slow");
    });


    $(window).scroll(function (e) {
        $scrollingLoader.stop().animate({ "marginTop": ($(window).scrollTop() + 200) + "px" }, "slow");
    });

    $('#divFreeList').hide();

    //gets the head Id from the hidden field
    var headId = $('#hfHeadId').val();
   

    getTransactionDetail(headId);
    initEvent();
});

function initEvent() {
    $("#lnkLogoutCntr").on("click", function () {
        if (confirm("Do you want to logout?")) {
            javascript: __doPostBack('ctl00$MainContent$lnklogout', '');
        }
    })

    $('#btnApprove').on('click', function () {
        if (checkIfSetAllDate() == false) {
            notifyWarning("Please Select Date Before Setting new Date Or Saving", true);
        } else {
            if (confirm("Do you want to Approve this transaction?")) {
                if (conflictCnt > 0) {
                    if (confirm("This Transaction have Items with Ongoing Discounts! Approve Anyways?", true)){
                        approve();
                    }
                } else {
                    approve();
                }
            }
        }
    })

    $('#btnPreview').on('click', function () {
        if (checkIfSetAllDate()) {
            var headId = $('#hfHeadId').val();
            CheckDates(headId);
        } else {
            notifyWarning("Please set and save the dates before generating the report", true);
        }
    })

    $('#btnModifyDate').on('click', function () {
        if (transactionStatus == 'PRINTED' || transactionStatus == 'SUBMITTED') {
            if (checkIfSetAllDate()) {
                var headId = $('#hfHeadId').val();
                GetTransactionDates(headId);
            } else {
                notifyWarning("Please set the dates before saving", true);
            }
        } else {
            $('#txtAdminUsername').val('');
            $('#txtAdminPassword').val('');
            revealModal('PopUpAdminAcctOutline');
        }       
    })

    $('#btnApproveModification').on('click', function () {
        var username = $('#txtAdminUsername').val();
        var password = $('#txtAdminPassword').val();

        if (username == "" || password == "") {
            notifyWarning("Please type your Username and Password", true);
        } else {
            if (confirm("Do you want to Approve changes?")) {
                checkAdminAccount();
            }
        }        
    })
} //end of initialization

function checkIfSetAllDate() {
    var cntr = true;
    $('#tblDates tbody tr input[type="text"]').each(function () {
        if ($(this).val() == '') {
            var elemId = $(this).prop('id');
            $("#" + elemId).focus();
            // notifyOnInput("Please Select Date Before Setting new Date Or Saving", "warning", "#" + elemId);
            cntr = false;
            return false;
        }
    })

    if (cntr == true)
        return true;
    else
        return false;
} //end of checkIfSetAllDate function


function checkAdminAccount() {
    var username = $('#txtAdminUsername').val();
    var password = $('#txtAdminPassword').val();

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == 1) {
                if (checkIfSetAllDate() == false) {
                    hideModal('PopUpAdminAcctOutline');
                    $('#txtAdminUsername').val("");
                    $('#txtAdminPassword').val("");

                    notifyWarning("Please Select Date Before Setting new Date Or Saving", true);
                } else {
                    modifyDate();
                }
            } else if (response.status == 0) {
                notifyWarning(response.message);
            } else {
                notifyError(response.message);
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/checkAdminAccount", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'username':'" + username + "','password':'" + password + "'}");
} //end of checkAdminAccount Function




function approve() {
    var headId = $('#hfHeadId').val();
    var promoDates = getPromoDates();

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == 1) {
                notif({
                    msg: response.message,
                    type: "info",
                    multiline: true,
                    position: "center"
                });

                transactionStatus = 'APPROVED';
                $('#btnModifyDate').val('Modify');
                if (response.itemListNoFreelist == null || response.itemListNoFreelist == 'null') {
                    $("#lblItemListNo").text(response.itemListNo);
                } else {
                    $("#lblItemListNo").text(response.itemListNo + " | " + response.itemListNoFreelist);
                }

                $("#btnApprove").prop("disabled", true);
                $("#btnPreview").prop("disabled", false);

                getPromoDate(headId, 'APPROVED');
                enableAvailableDate();
            } else if (response.status == 0) {
                notifyWarning(response.message);
            } else {
                notifyError(response.message);
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/approve", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'headId':" + headId + "}");
} //end of checkConflict Function


function modifyDate() {
    var headId = $('#hfHeadId').val();
    var promoDates = getPromoDates();

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == 1) {
                notif({
                    msg: response.message,
                    type: "info",
                    multiline: true,
                    position: "center"
                });

                hideModal('PopUpAdminAcctOutline');
                $('#txtAdminUsername').val("");
                $('#txtAdminPassword').val("");
            } else if (response.status == 0) {
                notifyWarning(response.message);
            } else {
                notifyError(response.message);
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/modifyDate", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send(JSON.stringify({ headId: headId, promoDatesObj: promoDates}));
} //end of checkConflict Function


function getPromoDate(head,tranStatus) {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == 1) {
                populateDateFields(response.dates, tranStatus);               
            } else if (response.status == 0) {
                NoPromoDatesPopulateDateFields();
            } else {
                notifyError(response.message);
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/getPromoDate", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'headId':'" + head + "'}");
}

var dateIdCntr = 1;
function populateDateFields(dateObj,tranStatus) {

    var dtNow = new Date();
    dtNow = dtNow.format('yyyy-MM-dd');

    $('#tblDates').html('');
    for (var x = 0; x < dateObj.length; x++) {
        var tbl = document.getElementById('tblDates');
        var row = tbl.insertRow(-1);
        var cellStartDate = row.insertCell(0);
        var cellEndDate = row.insertCell(1);
        var cellRemoveAddDate = row.insertCell(2);

        cellStartDate.innerHTML = "<input type='text' id='txtStartDate" + dateIdCntr + "' value='" + dateObj[x].START_DATE + "' class='inputs' readonly='readonly'/>";
        cellEndDate.innerHTML = "<input type='text' id='txtEndDate" + dateIdCntr + "' value='" + dateObj[x].END_DATE + "' class='inputs' readonly='readonly'/>";
        if (x == 0) {
            cellRemoveAddDate.innerHTML = "<input id='btnAddDate' type='button' value='Add' class='button-primary'/>";

            $("#btnAddDate").on("click", function () {
                if (checkIfSetAllDate()) {
                    var tbl = document.getElementById('tblDates');
                    var row = tbl.insertRow(-1);
                    var cellStartDate = row.insertCell(0);
                    var cellEndDate = row.insertCell(1);
                    var cellRemove = row.insertCell(2);

                    cellStartDate.innerHTML = "<input id='txtStartDate" + dateIdCntr + "'  type='text' class='inputs' readonly='readonly' placeholder='Start Date'/>";
                    cellEndDate.innerHTML = "<input id='txtEndDate" + dateIdCntr + "'  type='text' class='inputs' readonly='readonly' placeholder='End Date'/>";
                    cellRemove.innerHTML = '<input type="button" class="button-primary removeDate" value="Remove"/>';

                    initDateField('txtStartDate' + dateIdCntr, 'txtEndDate' + dateIdCntr);
                    initRemoveDate();
                    dateIdCntr += 1;
                } else {
                    notifyWarning("Please Select Date Before Setting new Date Or Saving", true);
                }
            })
        }

        var fromDate = new Date(dateObj[x].START_DATE);
        var toDate = new Date(dateObj[x].END_DATE);
        if (x > 0 && (fromDate.format('yyyy-MM-dd') > dtNow && toDate.format('yyyy-MM-dd') > dtNow)) {
            cellRemoveAddDate.innerHTML = "<input type='button' value='Remove' class='button-primary removeDate'/>";
            initRemoveDate();
        }

        initDateField('txtStartDate' + dateIdCntr, 'txtEndDate' + dateIdCntr);
        dateIdCntr += 1;
    }

    //if (tranStatus == 'PRINTED') {
    //    disableAllDateElements();
    //}
}

function NoPromoDatesPopulateDateFields() {

    var dtNow = new Date();
    dtNow = dtNow.format('yyyy-MM-dd');

    $('#tblDates').html('');
    var tbl = document.getElementById('tblDates');
    var row = tbl.insertRow(-1);
    var cellStartDate = row.insertCell(0);
    var cellEndDate = row.insertCell(1);
    var cellRemoveAddDate = row.insertCell(2);

    cellStartDate.innerHTML = "<input type='text' id='txtStartDate" + dateIdCntr + "' value='' class='inputs' readonly='readonly' placeholder='Start Date'/>";
    cellEndDate.innerHTML = "<input type='text' id='txtEndDate" + dateIdCntr + "' value='' class='inputs' readonly='readonly' placeholder='End Date'/>";
    
    cellRemoveAddDate.innerHTML = "<input id='btnAddDate' type='button' value='Add' class='button-primary'/>";

    $("#btnAddDate").on("click", function () {
        if (checkIfSetAllDate()) {
            var tbl = document.getElementById('tblDates');
            var row = tbl.insertRow(-1);
            var cellStartDate = row.insertCell(0);
            var cellEndDate = row.insertCell(1);
            var cellRemove = row.insertCell(2);

            cellStartDate.innerHTML = "<input id='txtStartDate" + dateIdCntr + "'  type='text' class='inputs' readonly='readonly' placeholder='Start Date'/>";
            cellEndDate.innerHTML = "<input id='txtEndDate" + dateIdCntr + "'  type='text' class='inputs' readonly='readonly' placeholder='End Date'/>";
            cellRemove.innerHTML = '<input type="button" class="button-primary removeDate" value="Remove"/>';

            initDateField('txtStartDate' + dateIdCntr, 'txtEndDate' + dateIdCntr);
            initRemoveDate();
            dateIdCntr += 1;
        } else {
            notifyWarning("Please Select Date Before Setting new Date Or Saving", true);
        }
    });

    //var fromDate = new Date(dateObj[x].START_DATE);
    //var toDate = new Date(dateObj[x].END_DATE);
    //if (x > 0 && (fromDate.format('yyyy-MM-dd') > dtNow && toDate.format('yyyy-MM-dd') > dtNow)) {
    //    cellRemoveAddDate.innerHTML = "<input type='button' value='Remove' class='button-primary removeDate'/>";
    //    initRemoveDate();
    //}

    initRemoveDate();

    initDateField('txtStartDate' + dateIdCntr, 'txtEndDate' + dateIdCntr);
    dateIdCntr += 1;
}

function initRemoveDate() {
    $('.removeDate').click(function () {
        $(this).closest('tr').remove();
        return false;
    })
}

function initDateField(startDateFieldId, endDateFieldId) {
    var dtNow = new Date();
    dtNow = dtNow.format('yyyy-MM-dd');

    var startDate = new Date($("#" + startDateFieldId).val());
    startDate = startDate.format('yyyy-MM-dd')

    var endDate = new Date($("#" + endDateFieldId).val());
    endDate = endDate.format('yyyy-MM-dd')

    if ($("#" + startDateFieldId).val() != "" && startDate <= dtNow) {
        $("#" + startDateFieldId).prop("disabled","disabled");
    } else {
    var pickerStart = new Pikaday({
        field: document.getElementById(startDateFieldId),
        firstDay: 1,
        numberOfMonths: 1,
        format: 'MMM DD, YYYY',
        onSelect: function () {
            var dateClassObj = new date_class();
            var toDate = document.getElementById(endDateFieldId).value;

            if (toDate != "") {
                if (dateClassObj.dates.getdifference(this, toDate) < 0) {
                    notifyWarning("From Date Must be Less than To Date", true);
                    document.getElementById(startDateFieldId).value = "";
                }
            }
            var selectedDate = new Date(this);
            selectedDate = selectedDate.format('yyyy-MM-dd')

            if (selectedDate < dtNow) {
                notifyWarning("Start Date Must be Today and Above", true);
                document.getElementById(startDateFieldId).value = "";
            } else if (checkDateHasConflict(this, startDateFieldId) == true) {
                notifyWarning("there's an overlap/Conflict in Specified Date", true);
                document.getElementById(startDateFieldId).value = "";
            } else if (document.getElementById(endDateFieldId).value != "") {
                checkConflict(startDateFieldId, this, toDate);
            }

        }
    });
    
    }

    if ($("#" + endDateFieldId).val() != "" && endDate <= dtNow) {
        $("#" + endDateFieldId).prop("disabled", "disabled");
    } else {
        var pickerEnd = new Pikaday({
            field: document.getElementById(endDateFieldId),
            firstDay: 1,
            numberOfMonths: 1,
            format: 'MMM DD, YYYY',
            onSelect: function () {
                var dateClassObj = new date_class();
                //var fromDate = $('#' + endDateFieldId).closest('tr').find('td input[type="text"]')[0].value;
                var fromDate = document.getElementById(startDateFieldId).value;
                if (fromDate != "") {
                    if (dateClassObj.dates.getdifference(fromDate, this) < 0) {
                        notifyWarning("To Date Must be greater than From Date", true);
                        document.getElementById(endDateFieldId).value = "";
                    }
                }
                var selectedDate = new Date(this);
                selectedDate = selectedDate.format('yyyy-MM-dd')
                if (selectedDate < dtNow) {
                    notifyWarning("End Date Must be Today and Above", true);
                    document.getElementById(endDateFieldId).value = "";
                } else if (checkDateHasConflict(this, endDateFieldId) == true) {
                    notifyWarning("there's an overlap/Conflict in Specified Date", true);
                    document.getElementById(endDateFieldId).value = "";
                } else if (document.getElementById(startDateFieldId).value != "") {
                    checkConflict(endDateFieldId, fromDate, this)
                }

               
            }
        });
    }

    
}

function disableAllDateElements() {
    $('#tblDates tbody tr input').prop('disabled', 'disabled');
}

function enableAvailableDate() {
    //enables all datefields that applicable and available for any changes
    var dtNow = new Date();
    dtNow = dtNow.format('yyyy-MM-dd');

    $("#tblDates tbody tr input[type='text']").each(function () {
        var currentDt = new Date(this.value);
        currentDt = currentDt.format('yyyy-MM-dd')
        if (currentDt > dtNow) {
            $(this).prop("disabled", '');
        }
    })

    $("#btnAddDate").prop("disabled", false);
    //$("#btnAddDate").prop("disabled", "disabled");
}

function checkDateHasConflict(toBeComparedDate,dateFieldId) {
    var dtfrom;
    var dtto;
    var dateClassObj = new date_class();

    var currentRow = $('#tblDates tbody tr:eq(' + $('#' + dateFieldId).parent().parent().index() + ')');
    var dtfrom_current_selected = $(currentRow).find('input[type="text"]')[0].value;
    var dtto_current_selected = $(currentRow).find('input[type="text"]')[1].value;
    var ret = false;

    $('#tblDates tbody tr:not(:eq(' + $('#' + dateFieldId).parent().parent().index() + '))').each(function () {

        dtfrom = $(this).find('td input[type="text"]')[0].value;
        dtto = $(this).find('td input[type="text"]')[1].value;
        //if it is true;means the date selected has conflict

        if (dateClassObj.dates.isBetween(toBeComparedDate, dtfrom, dtto)) {
            ret = true;

            //to end each function
            return false;
            //("there's an overlap/Conflict in Specified Date", true);
        } else {
            //if the prev_from_date and prev_to_date is not null
            //double check if the current_from_date and the current_to_date
            //doesn't overlap or prev_from_date and prev_to_date is not between 
            //the current_from_date and the current_to_date
            //if it is true means there is a conflict and overlapping of dates
            if (dtfrom_current_selected != "" && dtto_current_selected != "") {
                if (dateClassObj.dates.isBetween(dtfrom, dtfrom_current_selected, dtto_current_selected) || dateClassObj.dates.isBetween(dtto, dtfrom_current_selected, dtto_current_selected)) {
                    //if true means there is a conflict in selected date
                    ret = true;
                    //to end each function
                    return false;
                }
            }
        }

    })//end of each

    return ret;
}

function checkConflict(txtDateElementId, startDate, endDate) {
    var loc = $('#locId').val();
    var dept = $('#deptId').val();
    var headId = $('#hfHeadId').val()
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == 1) {

            } else if (response.status == 0) {
                notifyWarning(response.message);
                document.getElementById(txtDateElementId).value = "";
            } else {
                notifyError(response.message);
                document.getElementById(txtDateElementId).value = "";
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
            document.getElementById(txtDateElementId).value = "";
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/checkConflict", true);
    xmlhttp.responseType = "json";
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'headId':'" + headId + "','location':" + loc + ",'department':" + dept + ",'startDate':'" + startDate + "','endDate':'" + endDate + "'}");
}


function getItemsTransaction(head, rewardApplication) {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);

            if (response.status == 1) {

                //this means that items to be loaded are buylist items
                if (rewardApplication == 1) {
                    var ScrollSize = "";
                    if ($("#cbPromoTypes").val() == 1) {
                        ScrollSize = "482px";
                    } else {
                        ScrollSize = "498px";
                    }
                    tblItems = $('#tblItems').DataTable({
                        "scrollY": ScrollSize,
                        "paging": false,
                        "filter": false,
                        "info": false,
                        "data": response.item,
                        "order": [],
                        "createdRow": function (row, data, index) {
                            var bCode = data["BARCODE"];
                            checkOngoingTran(bCode, index, row, 1);
                        },
                        "columns": [
                        { "data": "ORIN" },
                        { "data": "BARCODE",
                            "width": "75px"
                         },
                        { "data": "VPN" },
                        { "data": "ITEM_DESC" },
                        { "data": "SRP",
                          "width": "30px"
                        },
                        { "data": "AGE_CODE",
                            "width": "20px"
                        },
                        { "data": "QTY" ,
                            "width": "20px"
                        },
                        { "data": "CLR_TYPE_DESC",
                            "width": "70px"
                        },
                        { "data": "DISCOUNT",
                          "width": "50px"},
                        { "data": "PROMO_MARK_UP",
                            "width": "40px",
                            "render": function (data, type, row) {
                                if (data != null) {
                                    if (row.SRP < row.UNIT_COST) {
                                        return "<span style='color:red'>" + data + "%</span>";
                                    } else {
                                        return data + "%";
                                    }
                                } else {
                                    return data;
                                }
                            }
                        }
                         ,
                        {
                            "targets": [6],
                            "data": "BARCODE",
                            "width": "35px",
                            "render": function (data, type, row, meta) {
                                return '';
                            }
                        }
                        ,
                        {
                            "targets": [7],
                            "data": "BARCODE",
                            "width": "35px",
                            "render": function (data, type, row, meta) {
                                return '';
                            }
                        }
                    ]
                    });

                    if ($("#cbPromoTypes").val() != 1) {
                        //hide unused column
                        //if it's multibuy or threshold there are columns 
                        //that were unused and must be hidden
                         hideUnusedColumn();
                    }

                    if (tblHasItem("tblItems")) {
                        var total_items = $('#tblItems').find('tbody>tr').length;
                        $('#lblTotalItems').text(total_items);
                    }

                } else {

                    tblFreeListItems = $('#tblItemsFreeList').DataTable({
                        "scrollY": "326px",
                        "paging": false,
                        "info": false,
                        "data": response.item,
                        "createdRow": function (row, data, index) {
                            var bCode = data["BARCODE"];
                            checkOngoingTran(bCode, index, row, 0);
                        },
                        "columns": [
                                     { "data": "ORIN" },
                                     { "data": "BARCODE" },
                                     { "data": "VPN" },
                                     { "data": "ITEM_DESC" },
                                     { "data": "AGE_CODE",
                                         "width": "30px"
                                     },
                                     { "data": "QTY",
                                       "width": "30px"
                                     },
                                     { "data": "SRP" }
                                      ,
                        {
                            "targets": [7],
                            "data": "BARCODE",
                            "width": "35px",
                            "render": function (data, type, row, meta) {
                                return '';
                            }
                        }
                        ,
                        {
                            "targets": [8],
                            "data": "BARCODE",
                            "width": "35px",
                            "render": function (data, type, row, meta) {
                                return '';
                            }
                        }
                                     ]
                    });

//                    if (tblHasItem("tblItemsFreeList")) {
//                        var total_freeList_items = $('#tblItemsFreeList').find('tbody>tr').length;
//                        $('#total_freeList_items').text(total_freeList_items);
//                    }

                    $("#tblItemsFreeList_filter").css('padding-top', '5px');
                    $("#tblItemsFreeList_filter").css('padding-right', '10px');
                    $("#tblItemsFreeList_filter").css('font-weight', '600');
                }

            } else if (response.status == 0) {
                notifyWarning(response.message);
            } else {
                notifyError(response.message);
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/getItemsTransaction", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'headId':'" + head + "','rewardApplication':" + rewardApplication + "}");
}



function getPromoDates() {
    var promoDateObjArr = [];

    $('#tblDates tbody tr').each(function () {
        var listDates = { startDate: $(this).find('input[type="text"]')[0].value, endDate: $(this).find('input[type="text"]')[1].value };
        promoDateObjArr.push(listDates);
    })
    //promoDateObjArr = JSON.stringify(promoDateObjArr);
    return promoDateObjArr;
}


function getTransactionDetail(head) {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == 1) {

                var transactionDetail = response.transactionDetail[0];
                transactionStatus = transactionDetail.STATUS;
                getPromoDate(head, transactionDetail.STATUS);

                $('#locName').val(transactionDetail.LOC + ' - ' + transactionDetail.LOC_NAME);
                $('#locId').val(transactionDetail.LOC);

                $('#deptName').val(transactionDetail.DEPT + ' - ' + transactionDetail.DEPT_NAME);
                $('#deptId').val(transactionDetail.DEPT);

                $('#deptName').val(transactionDetail.DEPT + ' - ' + transactionDetail.DEPT_NAME);
                $('#deptId').val(transactionDetail.DEPT);
                $('#lblTranNo').text(transactionDetail.TRAN_ID);
                $('#txtPromoDescription').val(transactionDetail.PROMOLIST_DESC);
                $('#cbPromoTypes').val(transactionDetail.PROMO_TYPE);

                if (transactionDetail.STATUS == 'APPROVED') {
                    $('#btnModifyDate').val('Modify');
                    $('#btnApprove').prop('disabled', 'disabled');

                    if (transactionDetail.PROMO_TYPE == 0 && transactionDetail.HAS_FREELIST == '1') {
                        $('#lblItemListNo').text(transactionDetail.ITEM_LIST_NO + " | " + transactionDetail.ITEM_LIST_NO_FREELIST);
                    } else {
                        $('#lblItemListNo').text(transactionDetail.ITEM_LIST_NO);
                    }

                    if (transactionDetail.PRC_PRINTED_BY == '' || transactionDetail.PRC_PRINTED_BY == null) {
                        $('#btnPreview').prop('disabled', '');
                    } else {
                        $('#btnPreview').prop('disabled', 'disabled');
                    }
                } else if (transactionDetail.STATUS == 'PRINTED' || transactionDetail.STATUS == 'SUBMITTED') {
                    $('#btnModifyDate').val('Save');
                    $('#btnPreview').prop('disabled', 'disabled');
                }

                getItemsTransaction(head, 1);

                if (transactionDetail.PROMO_TYPE == 0 && transactionDetail.HAS_FREELIST == '1') {
                    $('#divFreeList').show();
                    $('#chkFreeList').prop("checked", 'checked');

                    if (tblFreeListItems != null) {
                        tblFreeListItems.destroy();
                    }
                    getItemsTransaction(head, 0);
                }

            } else if (response.status == 0) {
                notifyWarning(response.message);
            } else {
                notifyError(response.message);
            }
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/getTransactionDetail", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'headId':'" + head + "'}");
}

function hideUnusedColumn() {
    var column = tblItems.column(7);
    column.visible(!column.visible());

    column = tblItems.column(8);
    column.visible(!column.visible());

    column = tblItems.column(9);
    column.visible(!column.visible());

}



function tblHasItem(tblId) {
    var row = $('#' + tblId + ' >tbody >tr');
    if (row.length > 0) {
        if (row[0].cells.length == 1 && row[0].cells[0].textContent == "No data available in table") {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function GetTransactionDates(head) {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == 1) {
                if (checkIfSetAllDate() == false) {
                    notifyWarning("Please Select Date Before Setting new Date Or Saving", true);
                } else {
                    modifyDate();
                }
            } else if (response.status == 0) {
                modifyDate();
            } else {
                notifyError(response.message);
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/getPromoDate", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'headId':'" + head + "'}");
}

function CheckDates(head) {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == 1) {
                window.location.href = "pricerReportViewer.aspx?headId=" + head;
            } else if (response.status == 0) {
                notifyWarning(response.message);
            } else {
                notifyError(response.message);
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
        }
    }
    xmlhttp.open("POST", "WebMethods/pricerWebMethod.aspx/getPromoDate", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'headId':'" + head + "'}");
}

function checkOngoingTran(item, index, row, appReward) {
    var loc = $('#locId').val();
    var dept = $('#deptId').val();
    var tranNo = document.getElementById('lblTranNo').innerHTML;
     var trans = "";
    if (appReward == 1) {
        if ($("#cbPromoTypes").val() != 1) {
            var table = "tblItems";
            var indIndex = 7;
            var tranIndex = 8;
        } else {
            var table = "tblItems";
            var indIndex = 10;
            var tranIndex = 11;
        }
    } else {
        var table = "tblItemsFreeList";
        var indIndex = 8;
        var tranIndex = 9;
    }

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response;
            response = jQuery.parseJSON(xmlhttp.response.d);
            if (response.status == "1") {
                if (response.message == null) {
                    document.getElementById(table).rows[index + 1].cells[indIndex].innerHTML = "N";
                } else {
                    for (var x = 0; x < response.data.length; x++) {
                        trans = trans + " " + response.data[x].TRAN_ID;
                    }
                    $('td', row).css('background-color', '#0ed641');
                    document.getElementById(table).rows[index + 1].cells[tranIndex].innerHTML = "P - " + trans;
                    document.getElementById(table).rows[index + 1].cells[indIndex].innerHTML = "Y";
                    conflictCnt++;
                }
            } else if (response.status == "0") {
                for (var x = 0; x < response.data.length; x++) {
                    trans = trans + " " + response.data[x].TRAN_ID;
                }
                $('td', row).css('background-color', '#0ed641');
                document.getElementById(table).rows[index + 1].cells[tranIndex].innerHTML = "M - " + trans;
                document.getElementById(table).rows[index + 1].cells[indIndex].innerHTML = "Y";
                conflictCnt++;
            } else {
                document.getElementById(table).rows[index + 1].cells[indIndex].innerHTML = "N";
            }
        } else if (xmlhttp.status == 500) {
            notifyError('Server Connection Error');
            document.getElementById(txtDateElementId).value = "";
        }
    }
    xmlhttp.open("POST", "WebMethods/generalWebMethod.aspx/checkOngoingTran", true);
    xmlhttp.responseType = "json";
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send("{'item':'" + item + "','location':" + loc + ",'department':" + dept + " ,'tranId':" + tranNo + "}");
}
