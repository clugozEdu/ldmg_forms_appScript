const maxTimeDiff = 20; // 20 minutes
const brainsDbSpreadSheet = SpreadsheetApp.openById(
  "1NkzDbH28GAsOgIQRbZDiM95iV4BWvSW09Um9ZlSnJNs"
);
const functionSheet = brainsDbSpreadSheet.getSheetByName("tbl_function");
const PROPERTY_KEY = "Row index";
const Database_Host = "161.153.133.156";
const Database_Name = "brain";
const Database_username = "dev_alldzdef";
const Database_password = "dev_all_ldm04zzeftt";
const Port_number = "3306";

//Dev Welcome Function...
const hi = () => {
  console.log("LDMG STEPS");
  console.log(getFormatDateAndHour());
  return;
};

//Function to Generates random id;
const generatesRandomId = () => {
  const guid = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return guid() + guid() + guid();
};

//Function to set batch set values to a given Sheet...
const batchSetValuesToSheet = (
  sheet,
  numberOfRows,
  numberOfColumns,
  valuesToSet
) => {
  //const sheetStartRow = sheet.getLastRow() + 1;
  sheet.getRange(1, 1, numberOfRows, numberOfColumns).setValues(valuesToSet);
  return;
};

//Function to check if a specific Row exist From a given Name
const isRowExist = (sheet, rowName) => {
  const sheetValues = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues();
  for (let i = 0; i < sheetValues.length; i++) {
    if (sheetValues[i][0] === rowName) return true;
  }
  return false;
};

//Function To check if a given number is within a range of numbers...
const isInRange = (num, lower, upper) => num >= lower && num <= upper;

//Function to get a specific Row Index From its Name...
const getRowIndexFromName = (sheet, rowName) => {
  const sheetValues = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues();
  for (let i = 0; i < sheetValues.length; i++) {
    if (`${sheetValues[i][0]}` === `${rowName}`) return i + 2;
  }
  return "Not Found";
};

//Function to get a specific Column Index From its Name...
const getColumnIndexFromName = (sheet, columnName) => {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] === columnName) return i + 1;
  }
  return "Not Found";
};

//Function to get a last row of a Column...
const getLastRowOfColumnIndex = (sheet, column) => {
  let lastRow = sheet.getLastRow();
  const data = sheet.getRange(1, column, lastRow + 1).getValues();
  while (lastRow > -1 && data[lastRow] == "") {
    lastRow--;
  }
  if (lastRow === -1) {
    return "Empty Column";
  } else {
    return lastRow + 1;
  }
};

//Function to append data to a specific sheet...
const appendDataToASheet = (sheet, values) => sheet.appendRow(values);

//Function to append list of values to a specific sheet...
const appendListOfDataToASheet = (sheet, arrayOfValues) => {
  Utilities.sleep(1000);
  for (let value of arrayOfValues) {
    appendDataToASheet(sheet, [value]);
    Utilities.sleep(1000);
  }
  return;
};

//Function to set batch set values to a given Sheet starting from sheet last Row...
const batchSetValuesToSheet2 = (
  sheet,
  numberOfRows,
  numberOfColumns,
  valuesToSet
) => {
  const sheetStartRow = sheet.getLastRow() + 1;
  sheet
    .getRange(sheetStartRow, 1, numberOfRows, numberOfColumns)
    .setValues(valuesToSet);
  return;
};

//Function to clear all contents of a given sheet...
const clearSheetContents = (sheet) => {
  if (sheet.getLastRow() < 2) return;
  let rangeToClear = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    sheet.getLastColumn()
  );
  rangeToClear.clear();
  return;
};

//Function to get all contents of a given sheet's First Column from its row 2...
const getSheetFirstColumnContents = (sheet) => {
  if (sheet.getLastRow() < 2) return "Empty";
  let values = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return values;
};

//Function to get all contents of a given sheet from its row 2...
const getSheetContents = (sheet) => {
  if (sheet.getLastRow() < 2) return "Empty";
  let values = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
    .getValues();
  return values;
};

const setRowIndex = (rowIndex) => {
  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.setProperty(PROPERTY_KEY, rowIndex);
};

const getRowIndex = () => {
  const scriptProps = PropertiesService.getScriptProperties();
  const rowIndex = scriptProps.getProperty(PROPERTY_KEY);
  return rowIndex;
};

const createTrigger = () => {
  ScriptApp.newTrigger("setFunctionDataToSheet")
    .timeBased()
    .after(60 * 1000 * 2) // Next execution after 2 minutes
    .create();
};

//Function to get a given Sheet Columns Index...
const getSheetColumnsIndex = (sheet) => {
  const sheetHeaders = getSheetFirstColumnContents(sheet);
  const columnsIndexesList = {};

  for (let value of sheetHeaders) {
    columnsIndexesList[value] = getColumnIndexFromName(sheet, value);
  }

  return columnsIndexesList;
};

//Function to Check if we get connection to the MySQL database...
const getDBCon = () => {
  const url = "jdbc:mysql://160.153.133.149:3306/brains";
  const conn = Jdbc.getConnection(url, "lxwb4uimofyb", "Ldm-group1*");
  return conn;
};

//Function Data to Sheet...
const setFunctionDataToSheet = () => {
  try {
    const startTime = new Date();
    const functionDataSSheet = SpreadsheetApp.openById(
      "1RygKqsJhL2aN10rFnuNXY8cOqegaZH2pPMaPPWcih3s"
    );
    const dataSheet = functionDataSSheet.getSheetByName("DevTest");
    const conn = getDBCon();
    const statement = conn.createStatement();
    const results = statement.executeQuery(`SELECT * FROM tbl_function`);
    const metaData = results.getMetaData();
    const numCols = metaData.getColumnCount();
    let rowIndex = parseInt(getRowIndex());
    let arr = [];
    let row = [];

    if (!rowIndex || rowIndex == 0) {
      // Clear sheet and add metadata if first execution
      dataSheet.clearContents();
      for (var col = 0; col < numCols; col++) {
        row.push(metaData.getColumnName(col + 1));
      }
      arr.push(row);
    } else {
      results.relative(rowIndex); // Move to current row
    }
    while (results.next()) {
      row = [];
      for (let col = 0; col < numCols; col++) {
        row.push(results.getString(col + 1));
      }
      arr.push(row);
      if (getMinutesBetween(startTime, new Date()) > maxTimeDiff) break; // End iteration if long time
    }
    const currentRow = results.getRow(); // 0 if all rows have been iterated
    const lastRow = dataSheet.getLastRow();
    setRowIndex(currentRow);

    dataSheet
      .getRange(lastRow + 1, 1, arr.length, arr[0].length)
      .setValues(arr);

    results.close();
    statement.close();
    conn.close();

    if (currentRow) createTrigger(); // Create trigger if iteration is not finished

    return "Success";
  } catch (error) {
    Logger.log(`setFunctionDataToSheetError: ${error.message}`);
    return;
  }
};

//Function to check data from a specific Table in MySql Database...
const checkDataFromMySQLTable = (
  searchTableName,
  searchColumnName,
  searchColumnValue
) => {
  try {
    //Utilities.sleep(1000);
    const conn = getDBCon();
    const statement = conn.createStatement();
    let query = statement.executeQuery(
      `SELECT * FROM ${searchTableName} WHERE ${searchColumnName}='${searchColumnValue}'`
    );
    const metaData = query.getMetaData();
    const numCols = metaData.getColumnCount();
    let tableContactData = [];

    while (query.next()) {
      let element = [];
      for (let col = 0; col < numCols; col++) {
        element.push(query.getString(col + 1));
      }
      tableContactData.push(element);
    }

    query.close();
    statement.close();
    conn.close();
    return tableContactData;
  } catch (error) {
    /* if (error.message.toLowerCase().includes(sqlConnFailsError.toLowerCase())) {
       getDataFromMySQLTable(searchTableName, searchColumnName, searchColumnValue);
     };*/
    Logger.log(`getDataFromMySQLTableError: ${error.message}`);
    return;
  }
};

//Function to get certain columns in a given table on MySQL with a given condition (Without additional Null cond)...
const getDataFromMySQLTable = (
  searchValues,
  searchTableName,
  searchColumnName,
  searchColumnValue
) => {
  try {
    const conn = getDBCon();
    const statement = conn.createStatement();
    let query = statement.executeQuery(
      `SELECT ${searchValues} FROM ${searchTableName} WHERE ${searchColumnName}='${searchColumnValue}'`
    );
    const metaData = query.getMetaData();
    const numCols = metaData.getColumnCount();
    let tableContactData = [];

    while (query.next()) {
      let element = [];
      for (let col = 0; col < numCols; col++) {
        element.push(query.getString(col + 1));
      }
      tableContactData.push(element);
    }

    query.close();
    statement.close();
    conn.close();
    return tableContactData;
  } catch (error) {
    console.log(`getUserDataFromMySQLTableError: ${error.message}`);
    return;
  }
};

//Function to get certain columns in a given table on MySQL with a given conditions...
const getDataFromMySQLTableWithNullCond = (
  searchValues,
  searchTableName,
  searchColumnName1,
  searchColumnName2,
  searchColumnValue
) => {
  try {
    const conn = getDBCon();
    const statement = conn.createStatement();
    let query = statement.executeQuery(
      `SELECT ${searchValues} FROM ${searchTableName} WHERE ${searchColumnName1}='${searchColumnValue}' AND ${searchColumnName2} IS NOT NULL`
    );
    const metaData = query.getMetaData();
    const numCols = metaData.getColumnCount();
    let tableContactData = [];

    while (query.next()) {
      let element = [];
      for (let col = 0; col < numCols; col++) {
        element.push(query.getString(col + 1));
      }
      tableContactData.push(element);
    }

    query.close();
    statement.close();
    conn.close();
    return tableContactData;
  } catch (error) {
    console.log(`getDataFromMySQLTableWithNullCondError: ${error.message}`);
    return;
  }
};

//Function to check if a record already exists in tbl_function...
const existsInTblFunction = (
  searchTableName,
  searchColumnName,
  searchColumnValue
) => {
  const search = checkDataFromMySQLTable(
    searchTableName,
    searchColumnName,
    searchColumnValue
  );
  Utilities.sleep(3000);
  if (search.length === 0) return false;
  return true;
};

//Function to Delete A record from a given table in MySQL by its ID...
const deleteRecordfromSQL = (tableName, idColumnName, recordId) => {
  try {
    const conn = getDBCon();
    const statement = conn.createStatement();
    statement.executeUpdate(
      `DELETE FROM ${tableName} WHERE ${idColumnName}='${recordId}';`
    );

    statement.close();
    conn.close();
    return "Success";
  } catch (error) {
    console.log(`deleteRecordfromSQLError: ${error.message}`);
    return;
  }
};
