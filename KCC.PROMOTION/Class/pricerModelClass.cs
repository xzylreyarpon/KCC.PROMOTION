using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Oracle.DataAccess;
using Oracle.DataAccess.Client;
using promotions;


/// <summary>
/// Summary description for pricerModelClass
/// </summary>
public class pricerModelClass
{
    public pricerModelClass() {   //
        // TODO: Add constructor logic here
        //
    }

    public DataTable get_prc_items_transaction(string headId) {
        OracleParameter[] param = new OracleParameter[2];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "O_DATA";
        parameter.OracleDbType = OracleDbType.RefCursor;
        parameter.Direction = ParameterDirection.Output;
        param[1] = parameter;

        DataTable dtItems = new DataTable();
        basegeneral obj = new basegeneral();

        dtItems = obj.GetDataTable(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.get_prc_items_transaction", CommandType.StoredProcedure, param);
        return dtItems;
    }

    public DataTable get_prc_items_freelist(string headId) {
        OracleParameter[] param = new OracleParameter[2];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "O_DATA";
        parameter.OracleDbType = OracleDbType.RefCursor;
        parameter.Direction = ParameterDirection.Output;
        param[1] = parameter;

        DataTable dtItems = new DataTable();
        basegeneral obj = new basegeneral();

        dtItems = obj.GetDataTable(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.get_prc_items_freelist", CommandType.StoredProcedure, param);
        return dtItems;
    }

    public DataTable get_prc_items_notfl(string headId) {
        OracleParameter[] param = new OracleParameter[2];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "O_DATA";
        parameter.OracleDbType = OracleDbType.RefCursor;
        parameter.Direction = ParameterDirection.Output;
        param[1] = parameter;

        DataTable dtItems = new DataTable();
        basegeneral obj = new basegeneral();

        dtItems = obj.GetDataTable(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.get_prc_items_notfl", CommandType.StoredProcedure, param);
        return dtItems;
    }

    public DataTable get_all_byr_transactions(string username) {
        OracleParameter[] param = new OracleParameter[2];
        OracleParameter parameter = new OracleParameter();
        parameter = new OracleParameter();

        parameter.ParameterName = "I_USERNAME";
        parameter.OracleDbType = OracleDbType.Varchar2;
        parameter.Value = username;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "O_DATA";
        parameter.OracleDbType = OracleDbType.RefCursor;
        parameter.Direction = ParameterDirection.Output;
        param[1] = parameter;

        DataTable dtTransactions = new DataTable();
        basegeneral obj = new basegeneral();

        dtTransactions = obj.GetDataTable(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.get_all_byr_transactions", CommandType.StoredProcedure, param);
        return dtTransactions;
    }

    public DataTable get_all_transactions(string username, string rolename) {
        OracleParameter[] param = new OracleParameter[3];
        OracleParameter parameter = new OracleParameter();


        parameter = new OracleParameter();

        parameter.ParameterName = "I_USERNAME";
        parameter.OracleDbType = OracleDbType.Varchar2;
        parameter.Value = username;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;


        parameter = new OracleParameter();
        parameter.ParameterName = "I_ROLENAME";
        parameter.OracleDbType = OracleDbType.Varchar2;
        parameter.Value = rolename;
        parameter.Direction = ParameterDirection.Input;
        param[1] = parameter;


        parameter = new OracleParameter();
        parameter.ParameterName = "O_DATA";
        parameter.OracleDbType = OracleDbType.RefCursor;
        parameter.Direction = ParameterDirection.Output;
        param[2] = parameter;


        DataTable dtTransactions = new DataTable();
        basegeneral obj = new basegeneral();

        dtTransactions = obj.GetDataTable(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.get_all_transactions", CommandType.StoredProcedure, param);
        return dtTransactions;
    }

    public DataTable get_promo_dates(string headId) {
        OracleParameter[] param = new OracleParameter[2];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "O_DATA";
        parameter.OracleDbType = OracleDbType.RefCursor;
        parameter.Direction = ParameterDirection.Output;
        param[1] = parameter;

        DataTable dtItems = new DataTable();
        basegeneral obj = new basegeneral();

        dtItems = obj.GetDataTable(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.get_promo_date", CommandType.StoredProcedure, param);
        return dtItems;
    }

    public void update_approver(int headId, string username, ref basegeneral obj) {
        OracleParameter[] param = new OracleParameter[2];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "I_USERNAME";
        parameter.OracleDbType = OracleDbType.Varchar2;
        parameter.Value = username;
        parameter.Direction = ParameterDirection.Input;
        param[1] = parameter;

        obj.executeNoCommit(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.UPDATE_APPROVER", CommandType.StoredProcedure, param);
    }

    public string insert_itemlist(int headId, string username, int rewardApplication, ref basegeneral obj) {
        OracleParameter[] param = new OracleParameter[4];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "I_USERNAME";
        parameter.OracleDbType = OracleDbType.Varchar2;
        parameter.Value = username;
        parameter.Direction = ParameterDirection.Input;
        param[1] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "I_REWARDAPPLICATION";
        parameter.OracleDbType = OracleDbType.Int16;
        parameter.Value = rewardApplication;
        parameter.Direction = ParameterDirection.Input;
        param[2] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "O_ITEMLISTNO";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Direction = ParameterDirection.Output;
        param[3] = parameter;

        obj.executeNoCommit(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.INSERT_ITEMLIST", CommandType.StoredProcedure, param);
        string itemListNo = param[3].Value.ToString();
        return itemListNo;
    }

    public void update_printedby(int headId, string username, ref basegeneral obj) {
        OracleParameter[] param = new OracleParameter[2];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "I_USERNAME";
        parameter.OracleDbType = OracleDbType.Varchar2;
        parameter.Value = username;
        parameter.Direction = ParameterDirection.Input;
        param[1] = parameter;


        obj.executeNoCommit(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.UPDATE_PRC_PRINTEDBY", CommandType.StoredProcedure, param);
    }

    public DataTable get_item_promo_type(string headId)
    {
        OracleParameter[] param = new OracleParameter[2];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "O_DATA";
        parameter.OracleDbType = OracleDbType.RefCursor;
        parameter.Direction = ParameterDirection.Output;
        param[1] = parameter;

        DataTable dtItems = new DataTable();
        basegeneral obj = new basegeneral();

        dtItems = obj.GetDataTable(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.GET_ITEM_PROMO_TYPE", CommandType.StoredProcedure, param);
        return dtItems;
    }
}