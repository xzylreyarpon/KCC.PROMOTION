﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Oracle.DataAccess;
using Oracle.DataAccess.Client;
using promotions;


/// <summary>
/// Summary description for buyerModelClass
/// </summary>
public class buyerModelClass
{
	public buyerModelClass()
	{   //
		// TODO: Add constructor logic here
		//
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


        obj.executeNoCommit(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.UPDATE_BYR_PRINTEDBY", CommandType.StoredProcedure, param);
    }

    public DataTable get_byr_items_transaction(string headId,int rewardApplication) {
      
        OracleParameter[] param = new OracleParameter[3];
        OracleParameter parameter = new OracleParameter();

        parameter = new OracleParameter();

        parameter.ParameterName = "I_HEADID";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = headId;
        parameter.Direction = ParameterDirection.Input;
        param[0] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "I_REWARDAPPLICATION";
        parameter.OracleDbType = OracleDbType.Int32;
        parameter.Value = rewardApplication;
        parameter.Direction = ParameterDirection.Input;
        param[1] = parameter;

        parameter = new OracleParameter();
        parameter.ParameterName = "O_DATA";
        parameter.OracleDbType = OracleDbType.RefCursor;
        parameter.Direction = ParameterDirection.Output;
        param[2] = parameter;

        DataTable dtItems = new DataTable();
        basegeneral obj = new basegeneral();

        dtItems = obj.GetDataTable(connection.userSchema + ".KCC_PROMOLIST_DATALAYER.get_byr_items_transaction", CommandType.StoredProcedure, param);
        return dtItems;
    }
 
}