// @ts-nocheck

const getScriptUrl = () => {
  const url = ScriptApp.getService().getUrl();
  return url;
};

//Function to Create template from the index File...
const doGet = () => {
  return HtmlService.createTemplateFromFile("frontend/index")
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag(
      "viewport",
      "width=device-width , initial-scale=1, shrink-to-fit=no"
    )
    .setTitle("LDMG FORMS");
};

const includeFile = (filename) => {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};

//Function to get All Forms list...
const getFormsList = () => {
  try {
    const functionsData = getSheetContents(functionSheet);
    const functionsColumnIndexes = getSheetColumnsIndex(functionSheet);
    const deptList = [];
    const formsList = [];

    for (let dept of functionsData) {
      if (`${dept[functionsColumnIndexes.type - 1]}` === `1`) {
        let deptData = {};
        deptData.mySQLId = dept[functionsColumnIndexes.functionID - 1];
        deptData.deptRefId = dept[functionsColumnIndexes.ref - 1];
        deptData.deptTitle = dept[functionsColumnIndexes.title - 1];
        deptData.deptDescription =
          dept[functionsColumnIndexes["Descriptions"] - 1];
        deptData.deptID = `${dept[functionsColumnIndexes.ref - 1]} ${
          dept[functionsColumnIndexes.title - 1]
        }`;
        deptList.push(deptData);
      }
    }

    for (let form of functionsData) {
      if (
        `${form[functionsColumnIndexes.type - 1]}` === `24` &&
        form[functionsColumnIndexes.functionID - 1] !== "" &&
        `${form[functionsColumnIndexes.status - 1]}` !== "10"
      ) {
        let formData = {};
        let formDeptID = form[functionsColumnIndexes.parentFunctionID - 1];
        for (let deptData of deptList) {
          if (`${formDeptID}` === `${deptData.mySQLId}`) {
            formData["formDepartmentID"] = deptData["mySQLId"];
            formData["formDepartmentTitle"] = deptData["deptTitle"];
            formData[
              "formDeptID"
            ] = `${deptData["deptID"]} ${deptData["deptTitle"]}`;
            formData["formId"] = `${deptData["deptRefId"]} ${
              form[functionsColumnIndexes["title"] - 1]
            }`;
            break;
          }
        }
        formData["mySQLId"] = form[functionsColumnIndexes.functionID - 1];
        `${form[functionsColumnIndexes["Descriptions"] - 1]}` === ""
          ? (formData["formDescription"] = "")
          : (formData["formDescription"] =
              form[functionsColumnIndexes["Descriptions"] - 1]);
        formsList.push(formData);
      }
    }

    return formsList;
  } catch (error) {
    console.log(`getFormsListError: ${error.message}`);
    return;
  }
};

//Function to get All Departments list...
const getDepartmentsList = () => {
  try {
    const functionsData = getSheetContents(functionSheet);
    const functionsColumnIndexes = getSheetColumnsIndex(functionSheet);
    const deptList = [];

    for (let dept of functionsData) {
      if (`${dept[functionsColumnIndexes.type - 1]}` === `1`) {
        let deptData = {};
        deptData.mySQLId = dept[functionsColumnIndexes.functionID - 1];
        deptData.deptrefId = dept[functionsColumnIndexes.ref - 1];
        deptData.deptTitle = dept[functionsColumnIndexes.title - 1];
        deptData.deptDescription =
          dept[functionsColumnIndexes["Descriptions"] - 1];
        deptData.deptID = `${dept[functionsColumnIndexes.ref - 1]} ${
          dept[functionsColumnIndexes.title - 1]
        }`;
        deptList.push(deptData);
      }
    }

    return deptList;
  } catch (error) {
    console.log(`getDepartmentsListError: ${error.message}`);
    return;
  }
};

//Function to get given Form Steps list by giving a form SQLId...
const getAFormStepsList = (mySQLFormId) => {
  try {
    const stepsDataFromSQL = getDataFromMySQLTable(
      "stepID,functionID, orders,title,descriptions,type,Action,	Question,AnswerType,Answer1,Answer2,Answer3,Answer4,photo1,photo2,photo3,video1,video2,video2,trainee,status,checked,background",
      "tbl_step",
      "functionID",
      mySQLFormId
    );
    const stepsList = [];

    for (let data of stepsDataFromSQL) {
      if (`${data[20]}` !== "5") {
        let step = {};
        step.mySQLId = data[0];
        step.mySQLFormId = data[1];
        step.stepCode = data[2];
        step.stepTitle = data[3];
        step.descriptions = data[4];
        step.type = data[5];
        step.action = data[6];
        step.question = data[7];
        step.answerType = data[8];
        step.answer1 = data[9];
        step.answer2 = data[10];
        step.answer3 = data[11];
        step.answer4 = data[12];
        step.photo1 = data[13];
        step.photo2 = data[14];
        step.photo3 = data[15];
        step.video1 = data[16];
        step.video2 = data[17];
        step.video3 = data[18];
        step.trainee = data[19];
        step.status = data[20];
        step.checked = data[21];
        step.background = data[22];

        stepsList.push(step);
      }
    }

    return stepsList;
  } catch (error) {
    console.log(`getAFormStepsListError: ${error.message}`);
    return;
  }
};

//Function to add New Form...
const addNewForm = (newFormInfos) => {
  try {
    const formDepartmentID = newFormInfos.formDepartmentId;
    const title = newFormInfos.title;
    const description = newFormInfos.description;
    const date = getFormatDateAndHour();
    const userId = getDataFromMySQLTable(
      "contactID",
      "tbl_contact",
      "workemail",
      `${Session.getActiveUser().getEmail()}`
    )[0][0];
    const id = generatesRandomId();

    if (!userId)
      return `${Session.getActiveUser().getEmail()} is not added to the Contact List Yet`;

    appendDataToASheet(functionSheet, [id]);

    //Add the New form in MysqlDB
    const conn = getDBCon();
    const statement = conn.createStatement();
    statement.execute(
      `INSERT INTO tbl_function (functionID,title,type,status,Descriptions,parentFunctionID,assignor,assignee,functiondate,priority,createdBy,dueDate,notificationChecker,flagChecker,chaseChecker) VALUES('${id}',"${title}",'${24}','${9}',"${description}","${formDepartmentID}",'${userId}','${1}','${date}','${1}','${userId}','${date}','${0}','${0}','${0}');`
    );

    statement.close();
    conn.close();

    //Add the New form in the CACHE Sheet
    const idRowIndex = getRowIndexFromName(functionSheet, id);
    const functionsColumnIndexes = getSheetColumnsIndex(functionSheet);

    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.title)
      .setValue(title);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.type)
      .setValue(24);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.status)
      .setValue(9);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.Descriptions)
      .setValue(description);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.parentFunctionID)
      .setValue(formDepartmentID);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.assignor)
      .setValue(userId);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.assignee)
      .setValue(1);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.functiondate)
      .setValue(date);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.priority)
      .setValue(1);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.createdBy)
      .setValue(userId);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.dueDate)
      .setValue(date);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.notificationChecker)
      .setValue(0);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.flagChecker)
      .setValue(0);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.chaseChecker)
      .setValue(0);

    Utilities.sleep(2000);
    return getFormsList();
  } catch (error) {
    console.log(`addNewFormError: ${error.message}`);
    return;
  }
};

//Function to add New Step...
const addNewSteps = (newStepsInfosArray) => {
  try {
    const conn = getDBCon();
    const statement = conn.createStatement();
    const userId = getDataFromMySQLTable(
      "contactID",
      "tbl_contact",
      "workemail",
      `${Session.getActiveUser().getEmail()}`
    )[0][0];

    if (!userId)
      return `${Session.getActiveUser().getEmail()} is not added to the Contact List Yet`;

    for (let newStepInfos of newStepsInfosArray) {
      let formID = newStepInfos.mySQLFormId;
      let title = newStepInfos.title;
      let description = newStepInfos.description;
      let order = newStepInfos.stepCode;
      let type = newStepInfos.type;
      let action = newStepInfos.action;
      let question = newStepInfos.question;
      let answerType = newStepInfos.answerType;
      let answer1 = newStepInfos.answer1;
      let answer2 = newStepInfos.answer2;
      let answer3 = newStepInfos.answer3;
      let answer4 = newStepInfos.answer4;
      let photo1 = newStepInfos.photo1;
      let photo2 = newStepInfos.photo2;
      let photo3 = newStepInfos.photo3;
      let video1 = newStepInfos.video1;
      let video2 = newStepInfos.video2;
      let video3 = newStepInfos.video3;
      let status = newStepInfos.status;
      let checked = `${newStepInfos.checked.checked}` === "true" ? "1" : "0";
      let background = newStepInfos.background;

      statement.execute(
        `INSERT INTO tbl_step (stepID,functionID, orders,title,descriptions,type,Action,	Question,AnswerType,Answer1,Answer2,Answer3,Answer4,photo1,photo2,photo3,video1,video2,video3,trainee,status,checked,background) VALUES('${generatesRandomId()}',"${formID}",'${order}','${title}',"${description}","${type}",'${action}','${question}','${answerType}','${answer1}','${answer2}','${answer3}','${answer4}','${photo1}','${photo2}','${photo3}','${video1}','${video2}','${video3}','${userId}','${status}','${checked}','${background}');`
      );
    }

    statement.close();
    conn.close();
    Utilities.sleep(2000);
    return getAFormStepsList(newStepsInfosArray[0]["mySQLFormId"]);
  } catch (error) {
    console.log(`addNewStepsError: ${error.message}`);
    return;
  }
};

//Function to Update a Form...
const updateForm = (formInfos) => {
  try {
    const formID = formInfos.formId;
    const formDepartmentID = formInfos.formDepartmentId;
    const title = formInfos.title;
    const description = formInfos.description;
    const userId = getDataFromMySQLTable(
      "contactID",
      "tbl_contact",
      "workemail",
      `${Session.getActiveUser().getEmail()}`
    )[0][0];
    const checker = existsInTblFunction(
      "tbl_function",
      "functionID",
      `${formID}`
    );

    if (!userId)
      return `${Session.getActiveUser().getEmail()} is not added to the Contact List Yet`;

    if (checker === false)
      return `the given Form SQLId is not found in the Database`;

    //Update the form in MysqlDB
    const conn = getDBCon();
    const statement = conn.createStatement();
    statement.executeUpdate(
      `UPDATE tbl_function SET title="${title}",Descriptions="${description}",assignor='${userId}',priority='${1}',type='${24}',parentFunctionID='${formDepartmentID}' WHERE functionID='${formID}';`
    );

    statement.close();
    conn.close();

    //Update the form in the CACHE Sheet
    const idRowIndex = getRowIndexFromName(functionSheet, formID);
    const functionsColumnIndexes = getSheetColumnsIndex(functionSheet);

    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.title)
      .setValue(title);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.type)
      .setValue(24);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.Descriptions)
      .setValue(description);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.parentFunctionID)
      .setValue(formDepartmentID);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.assignor)
      .setValue(userId);
    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.priority)
      .setValue(1);

    Utilities.sleep(2000);
    return getFormsList();
  } catch (error) {
    console.log(`updateFormError: ${error.message}`);
    return;
  }
};

//Function to Update a Step...
const updateSteps = (stepInfosArray) => {
  try {
    const conn = getDBCon();
    const statement = conn.createStatement();

    for (let stepInfos of stepInfosArray) {
      let stepID = stepInfos.mySQLstepId;
      let title = stepInfos.title;
      let description = stepInfos.description;
      let order = stepInfos.stepCode;
      let type = stepInfos.type;
      let action = stepInfos.action;
      let question = stepInfos.question;
      let answerType = stepInfos.answerType;
      let answer1 = stepInfos.answer1;
      let answer2 = stepInfos.answer2;
      let answer3 = stepInfos.answer3;
      let answer4 = stepInfos.answer4;
      let photo1 = stepInfos.photo1;
      let photo2 = stepInfos.photo2;
      let photo3 = stepInfos.photo3;
      let video1 = stepInfos.video1;
      let video2 = stepInfos.video2;
      let video3 = stepInfos.video3;
      let status = stepInfos.status;
      let checked = `${stepInfos.checked}` === "true" ? "1" : "0";
      let background = stepInfos.background;

      //const checker = existsInTblFunction('tbl_step', 'stepID', `${stepID}`);
      //if (checker === false) return `the given Step SQLId is not found in the Database`;

      statement.executeUpdate(
        `UPDATE tbl_step SET title='${title}',descriptions='${description}',orders='${order}',Action='${action}',type='${type}',Question='${question}',AnswerType="${answerType}",Answer1="${answer1}",Answer2='${answer2}',Answer3='${answer3}',Answer4='${answer4}',photo1='${photo1}',photo2="${photo2}",photo3="${photo3}",status='${status}',video1='${video1}',video2='${video2}',video3='${video3}',checked='${checked}',background='${background}' WHERE stepID='${stepID}';`
      );
    }

    statement.close();
    conn.close();
    return "Success";
  } catch (error) {
    console.log(`updateStepsError: ${error.message}`);
    return;
  }
};

//Function to set A form as deleted...
const deleteAForm = (mySQLFormId) => {
  try {
    const checker = existsInTblFunction(
      "tbl_function",
      "functionID",
      `${mySQLFormId}`
    );

    if (checker === false)
      return `the given Form SQLId is not found in the Database`;

    //Update the form in MysqlDB
    const conn = getDBCon();
    const statement = conn.createStatement();
    statement.executeUpdate(
      `UPDATE tbl_function SET status="${10}" WHERE functionID='${mySQLFormId}';`
    );

    statement.close();
    conn.close();

    //Update the form in the CACHE Sheet
    const idRowIndex = getRowIndexFromName(functionSheet, mySQLFormId);
    const functionsColumnIndexes = getSheetColumnsIndex(functionSheet);

    functionSheet
      .getRange(idRowIndex, functionsColumnIndexes.status)
      .setValue(10);

    Utilities.sleep(2000);
    return getFormsList();
  } catch (error) {
    console.log(`deleteAFormError: ${error.message}`);
    return;
  }
};

//Function to set A form as deleted...
const deleteSteps = (mySQLstepIdsArray) => {
  try {
    const conn = getDBCon();
    const statement = conn.createStatement();

    for (let mySQLstepId of mySQLstepIdsArray) {
      const checker = existsInTblFunction(
        "tbl_step",
        "stepID",
        `${mySQLstepId}`
      );
      if (checker === false)
        return `the given Step SQLId is not found in the Database`;

      statement.executeUpdate(
        `UPDATE tbl_step SET status="${5}" WHERE stepID='${mySQLstepId}';`
      );
    }

    statement.close();
    conn.close();

    return "Success";
  } catch (error) {
    console.log(`deleteStepsError: ${error.message}`);
    return;
  }
};

//Function to set a form's Steps Order in the DB...
const stepsOrderMaker = (stepsOrderArray) => {
  try {
    const conn = getDBCon();
    const statement = conn.createStatement();

    for (let data of stepsOrderArray) {
      Utilities.sleep(10000);
      statement.executeUpdate(
        `UPDATE tbl_step SET orders="${data["stepCode"]}" WHERE stepID='${data["idStepMySQL"]}';`
      );
    }

    statement.close();
    conn.close();
    return "Success";
  } catch (error) {
    console.log(`stepsOrderMakerError: ${error.message}`);
    return;
  }
};
