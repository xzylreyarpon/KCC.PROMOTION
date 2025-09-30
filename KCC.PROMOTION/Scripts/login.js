﻿var conn = true;
var conn_type;

$(function () {
    var msg = "KCC Promotion System is now on production in Gensan and Marbel<BR/>"  +
              "Kindly choose from the option below for the desired application<br/>";
    notif({
        msg: msg,
        type: "info",
        autohide: false,
        position: "center",
        multiline:true
    });
    
    $("#cmbApplication").val(152);
    window.onkeydown = change_conn;
    $('#edt_setmultiple').val(2);
    var cnVal = $('#edt_setmultiple').val();

    if (cnVal == 1) {
        $('#spconntype').html(": Dev Connection")
    } else if (cnVal == 2) {
        $('#spconntype').html(": Prod Connection")
    }
    
    $('#txtusr').bind('keyup', function (e) {
        if (e.keyCode == 13) {
            check_user_access();
        }
    });

    $('#txtpwd').bind('keyup', function (e) {
        if (e.keyCode == 13) {
            check_user_access();
        }
    });

    $('#btnOk').on('click', function () {
        check_user_access();
    });

    $('#btnClear').on('click', function () {
        $("#txtusr").val("");
        $("#txtpwd").val("");
    });

    $("#lnkUserGuide").on("click", function () {
        var appId = $("#cmbApplication").val();
        if (appId == 168 || appId == 152) {
            window.open("userGuide.aspx", "_blank");
        } else if (appId == 129 || appId == 112) {
            window.open("http://192.168.32.178/md_user_guide/default.aspx", "_blank");
        }
    })

    $("#edt_setmultiple").on("change", function () {
        hideModal('PopUpConnectionOutline');
        conn = true; ;
        var val = $('#edt_setmultiple').val();
        if (val == 1) {
            conn_type = "rmsdev";
            $('#spconntype').html(": Dev Connection")
        } else if (val == 2) {
            conn_type = "rmsprd";
            $('#spconntype').html(": Prod Connection")
        }
    })


});

function getApplicationId() {
    var appId = $("#cmbApplication").val();
    var connType = $('#edt_setmultiple').val();

    if (appId == 152 && connType == 1) {
        appId = 152;
    } else if (appId == 112 && connType == 1) {
        appId = 112;
    } else if (appId == 193 && connType == 1) {
        appId = 173;
    }

    return appId;
}

function check_user_access() {
    var xmlhttp;
    var username = $("#txtusr").val();
    var password = $("#txtpwd").val();
    var connectionType = $("#edt_setmultiple").val();
    var applicationId = getApplicationId();

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

                window.location.href = response.url;
            } else {
                notif({
                    msg: response.message,
                    type: "warning",
                    autohide: false,
                    position: "center"
                });
            }
        }
    }
    xmlhttp.open("POST", "WebMethods/userWebMethod.aspx/check_user_access", true);
    xmlhttp.responseType = "json"
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send("{'username':'" + username + "','password':'" + password + "','applicationId':" + applicationId + ",'connectionType':'" + connectionType + "'}");
}

function change_conn(e) {
    var param = arguments;
    if (e.keyCode == 27) {
        if (conn == true) {
            revealModal('PopUpConnectionOutline');
            conn = false;
        } else {
            hideModal('PopUpConnectionOutline');
            conn = true;
        }
    }
};

function conn_onselect() {
    hideModal('PopUpConnectionOutline');
    conn = true; ;
    var val = $('#edt_setmultiple').val();
    if (val == 1) {
        conn_type = "rmsdev";
        $('#spconntype').html(": Dev Connection")
    } else if (val == 2) {
        conn_type = "rmsprd";
        $('#spconntype').html(": Prod Connection")
    }
}
