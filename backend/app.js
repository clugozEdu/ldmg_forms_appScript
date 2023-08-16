// // @ts-nocheck

// const getScriptUrl = () => {
//   const url = ScriptApp.getService().getUrl();
//   return url;
// };

// //Function to get All Forms list...
// const getFormsList = () => {
//   Utilities.sleep(2000);
//   try {
//     const functionsData = getSheetContents(functionSheet);
//     const functionsColumnIndexes = getSheetColumnsIndex(functionSheet);
//     const deptList = [];
//     const formsList = [];

//     for (let dept of functionsData) {
//       if (`${dept[functionsColumnIndexes.type - 1]}` === `1`) {
//         let deptData = {};
//         deptData.mySQLId = dept[functionsColumnIndexes.functionID - 1];
//         deptData.deptRefId = dept[functionsColumnIndexes.ref - 1];
//         deptData.deptTitle = dept[functionsColumnIndexes.title - 1];
//         deptData.deptShortName =
//           dept[functionsColumnIndexes["Dept Shortname"] - 1];
//         deptData.deptDescription =
//           dept[functionsColumnIndexes["Descriptions"] - 1];
//         deptList.push(deptData);
//       }
//     }

//     for (let form of functionsData) {
//       if (
//         `${form[functionsColumnIndexes.type - 1]}` === `24` &&
//         form[functionsColumnIndexes.functionID - 1] !== ""
//       ) {
//         let formData = {};
//         let formDeptID = form[functionsColumnIndexes.parentFunctionID - 1];
//         for (let deptData of deptList) {
//           if (`${formDeptID}` === `${deptData.mySQLId}`) {
//             formData["formDepartmentID"] = deptData.mySQLId;
//             formData["formDepartmentTitle"] = deptData.deptTitle;
//             formData["formDeptID"] = deptData.deptRefId;
//             formData["formDeptShortname"] = deptData.deptShortName;
//             formData["formId"] = `${deptData.deptRefId} ${
//               form[functionsColumnIndexes.title - 1]
//             }`;
//             break;
//           }
//         }
//         formData["mySQLId"] = form[functionsColumnIndexes.functionID - 1];
//         `${form[functionsColumnIndexes["Descriptions"] - 1]}` === ""
//           ? (formData["formDescription"] = "")
//           : (formData["formDescription"] =
//               form[functionsColumnIndexes["Descriptions"] - 1]);
//         formsList.push(formData);
//       }
//     }

//     return formsList;
//   } catch (error) {
//     console.log(`getFormsListError: ${error.message}`);
//     return;
//   }
// };

// //Function to get All Departments list...
// const getDepartmentsList = () => {
//   try {
//     const functionsData = getSheetContents(functionSheet);
//     const functionsColumnIndexes = getSheetColumnsIndex(functionSheet);
//     const deptList = [];

//     for (let dept of functionsData) {
//       if (`${dept[functionsColumnIndexes.type - 1]}` === `1`) {
//         let deptData = {};
//         deptData.mySQLId = dept[functionsColumnIndexes.functionID - 1];
//         deptData.deptId = dept[functionsColumnIndexes.ref - 1];
//         deptData.deptTitle = dept[functionsColumnIndexes.title - 1];
//         deptData.deptDescription =
//           dept[functionsColumnIndexes["Descriptions"] - 1];
//         deptData.deptShortName =
//           dept[functionsColumnIndexes["Dept Shortname"] - 1];
//         deptList.push(deptData);
//       }
//     }

//     console.log(deptList);

//     return deptList;
//   } catch (error) {
//     console.log(`getDepartmentsListError: ${error.message}`);
//     return;
//   }
// };

// //Function to get given Form Steps list by giving a form SQLId...
// const getAFormStepsList = (mySQLFormId) => {
//   try {
//     const stepsDataFromSQL = getDataFromMySQLTable(
//       "stepID,functionID, orders,title,descriptions,type,Action,	Question,AnswerType,Answer1,Answer2,Answer3,Answer4,photo1,photo2,photo3,video1,video2,video2,trainee,status,checked,background",
//       "tbl_step",
//       "functionID",
//       mySQLFormId
//     );
//     const stepsList = [];

//     for (let data of stepsDataFromSQL) {
//       let step = {};
//       step.mySQLId = data[0];
//       step.mySQLFormId = data[1];
//       step.stepCode = data[2];
//       step.stepTitle = data[3];
//       step.descriptions = data[4];
//       step.type = data[5];
//       step.action = data[6];
//       step.question = data[7];
//       step.answerType = data[8];
//       step.answer1 = data[9];
//       step.answer2 = data[10];
//       step.answer3 = data[11];
//       step.answer4 = data[12];
//       step.photo1 = data[13];
//       step.photo2 = data[14];
//       step.photo3 = data[15];
//       step.video1 = data[16];
//       step.video2 = data[17];
//       step.video3 = data[18];
//       step.trainee = data[19];
//       step.status = data[20];
//       step.checked = data[21];
//       step.background = data[22];

//       stepsList.push(step);
//     }

//     return stepsList;
//   } catch (error) {
//     console.log(`getAFormStepsListError: ${error.message}`);
//     return;
//   }
// };

// //Function to add New Form...
// const addNewForm = (newFormInfos) => {
//   try {
//     const formDepartmentID = newFormInfos.formDepartmentId;
//     const title = newFormInfos.title;
//     const description = newFormInfos.description;
//     const date = formatToUkDate();
//     const userId = getDataFromMySQLTable(
//       "contactID",
//       "tbl_contact",
//       "workemail",
//       `${Session.getActiveUser().getEmail()}`
//     )[0][0];

//     if (!userId)
//       return `${Session.getActiveUser().getEmail()} is not added to the Contact List Yet`;

//     //Add the New form in MysqlDB
//     const conn = getDBCon();
//     const statement = conn.createStatement();
//     statement.execute(
//       `INSERT INTO tbl_function (functionID,title,type,status,Descriptions,parentFunctionID,assignor,assignee,functiondate,priority,createdBy,dueDate,notificationChecker,flagChecker,chaseChecker) VALUES('${generatesRandomId()}',"${title}",'${24}','${9}',"${description}","${formDepartmentID}",'${userId}','${1}','${date}','${1}','${userId}','${date}','${0}','${0}','${0}');`
//     );

//     statement.close();
//     conn.close();

//     //Add the New form in the CACHE Sheet

//     return "Success";
//   } catch (error) {
//     console.log(`addNewFormError: ${error.message}`);
//     return;
//   }
// };

// //Function to add New Step...
// const addNewStep = (newStepInfos) => {
//   try {
//     const formID = newStepInfos.mySQLFormId;
//     const title = newStepInfos.title;
//     const description = newStepInfos.description;
//     const order = newStepInfos.stepCode;
//     const type = newStepInfos.type;
//     const action = newStepInfos.action;
//     const question = newStepInfos.question;
//     const answerType = newStepInfos.answerType;
//     const answer1 = newStepInfos.answer1;
//     const answer2 = newStepInfos.answer2;
//     const answer3 = newStepInfos.answer3;
//     const answer4 = newStepInfos.answer4;
//     const photo1 = newStepInfos.photo1;
//     const photo2 = newStepInfos.photo2;
//     const photo3 = newStepInfos.photo3;
//     const video1 = newStepInfos.video1;
//     const video2 = newStepInfos.video2;
//     const video3 = newStepInfos.video3;
//     const status = newStepInfos.status;
//     const checked = newStepInfos.checked;
//     const background = newStepInfos.background;
//     const userId = getDataFromMySQLTable(
//       "contactID",
//       "tbl_contact",
//       "workemail",
//       `${Session.getActiveUser().getEmail()}`
//     )[0][0];
//     if (!userId)
//       return `${Session.getActiveUser().getEmail()} is not added to the Contact List Yet`;
//     const conn = getDBCon();
//     const statement = conn.createStatement();
//     statement.execute(
//       `INSERT INTO tbl_step (stepID,functionID, orders,title,descriptions,type,Action,	Question,AnswerType,Answer1,Answer2,Answer3,Answer4,photo1,photo2,photo3,video1,video2,video2,trainee,status,checked,background) VALUES('${generatesRandomId()}',"${formID}",'${order}','${title}',"${description}","${type}",'${action}','${question}','${answerType}','${answer1}','${answer2}','${answer3}','${answer4}','${photo1}','${photo2}','${photo3}','${video1}','${video2}','${video3}','${userId}','${status}','${checked}','${background}');`
//     );
//     statement.close();
//     conn.close();
//     return "Success";
//   } catch (error) {
//     console.log(`addNewStepError: ${error.message}`);
//     return;
//   }
// };

// //Function to Update a Form...
// const updateForm = (formInfos) => {
//   try {
//     const formID = formInfos.formId;
//     const formDepartmentID = formInfos.formDepartmentId;
//     const title = formInfos.title;
//     const description = formInfos.description;
//     const userId = getDataFromMySQLTable(
//       "contactID",
//       "tbl_contact",
//       "workemail",
//       `${Session.getActiveUser().getEmail()}`
//     )[0][0];
//     const checker = existsInTblFunction(
//       "tbl_function",
//       "functionID",
//       `${formID}`
//     );
//     if (!userId)
//       return `${Session.getActiveUser().getEmail()} is not added to the Contact List Yet`;
//     if (checker === false)
//       return `the given Step SQLId is not found in the Database`;
//     //Update the form in MysqlDB
//     const conn = getDBCon();
//     const statement = conn.createStatement();
//     statement.executeUpdate(
//       `UPDATE tbl_function SET title="${title}",Descriptions="${description}",assignor='${userId}',priority='${1}',type='${24}',parentFunctionID='${formDepartmentID}') WHERE functionID='${formID}';`
//     );
//     statement.close();
//     conn.close();
//     //Update the form in the CACHE Sheet
//     return "Success";
//   } catch (error) {
//     console.log(`updateFormError: ${error.message}`);
//     return;
//   }
// };

// /*
// statement.executeUpdate(`DELETE FROM tbl_function WHERE functionID='${functID}';`)
//       statement.close();
//       conn.close();

// const conn = getDBCon();
//     const statement = conn.createStatement();
//     const functID = eventHasRecurrence(calEvent) === true ? formatRecurrentEventID(calEvent.id, calEvent.start.dateTime) : calEvent.id;
//     const checker = existsInTblFunction('tbl_function', 'functionID', `${functID}`);

//     if (checker === false) { // edge case: new event is created...
//         statement.execute(`INSERT INTO tbl_function (functionID,title,type,status,assignor,assignee,functiondate,priority,createdBy,timing,accountID,propertyID,dueDate,taskEndTime, 	notificationChecker) VALUES('${functID}',"${eventInfos.title}",'${eventType}','${eventStatus}','${eventAssignor}','${eventAssignee}','${eventFDate}','${eventPriority}','${eventAssignor}','${eventTiming}',NULLIF('${eventProjectID}',''),NULLIF('${eventPropertyID}',''),'${eventStartDate}','${eventEndDate}','${0}');`);
//         statement.close();
//         conn.close();
//         return;
//       }
//       else { // edge case: the event is updated...
//         statement.executeUpdate(`UPDATE tbl_function SET status='${eventStatus}',title="${eventInfos.title}",assignee='${eventAssignee}',priority='${eventPriority}',timing='${eventTiming}',dueDate='${eventStartDate}',taskEndTime='${eventEndDate}',accountID=NULLIF('${eventProjectID}',''), propertyID=NULLIF('${eventPropertyID}','') WHERE functionID='${functID}';`);
//         statement.close();
//         conn.close();
//       };

// INSERT INTO table_name (column_list)
// VALUES
//     (value_list_1),
//     (value_list_2),
//     ...
//     (value_list_n);

// create table Info(id integer, Cost integer,city nvarchar(200));
// INSERT INTO Info (id,Cost,city)
// VALUES (1,200, 'Pune'), (2, 150,'USA'), (3,345, 'France');

// select * from Info;

// */

// //console.log(getFormsList());
// //console.log(getAFormStepsList('2da9ac34'));
// //console.log(getDataFromMySQLTableWithNullCond('functionID,title', 'tbl_function', 'type','parentFunctionID', '24'));
