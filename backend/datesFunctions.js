//Function to make hour string from a giving minutes...
const makeHourString = (totalMinutes) => {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  return `${hours}h${minutes > 0 ? `${minutes}min` : ''}`;
};

//Function to format dates from sheets to English Format (mm/dd/yyyy)...
const formatDate = (date) => {
  let tempDate = new Date(`${date}`);
  //tempDate.setDate(tempDate.getDate() + 1);
  return tempDate.toLocaleString("en-US").split(',')[0];
};

//Function to format dates and Hours for Sheets 2023-05-22 03:40:00...
const formatDateAndHour = (date) => {
  let tempDate = new Date(`${date}`);
  const dateAndHour = tempDate.toISOString().split('.')[0];
  return `${dateAndHour.split('T')[0]} ${dateAndHour.split('T')[1]}`;
};

//Function to get the formatted dates and Hours from Sheets 2023-05-22 03:40:00...
const getFormatDateAndHour = (date = new Date()) => {
  let tempDate = date.toLocaleString("en-GB");
  const onlyDate = tempDate.split(',')[0];
  const hour = tempDate.split(' ')[1];
  const splitDate = onlyDate.split('/');
  const fDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
  return `${fDate} ${hour}`;
};

//Function to format of a given date to Us Format "20/12/2012 03:00:00"...
const formatToUkDate = (date = new Date()) => date.toLocaleString("en-GB")

//Function to get the formatted dates from Sheets 2023-05-22...
const getFormatDate = (date = new Date()) => {
  let tempDate = date.toLocaleString("en-GB");
  const onlyDate = tempDate.split(',')[0];
  const splitDate = onlyDate.split('/');
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
};

//Function to Calculate days between two dates...
const getDaysBetween = (date2 = new Date(), date1 = new Date()) => {
  let difference = date1.getTime() - date2.getTime();
  return Math.abs(Math.ceil(difference / (1000 * 3600 * 24)));
};

//Function to Calculate minutes between two dates...
const getMinutesBetween = (date2 = new Date(), date1 = new Date()) => {
  let differenceValue = (date2.getTime() - date1.getTime()) / 1000;
  differenceValue /= 60;
  return Math.abs(Math.round(differenceValue));
};

//Function to format of a given date to Us Format 07/23/1994...
const formatToUsDate = (date = new Date()) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

//Function reverse the format of a given date from 07/23/1994 to 1994-07-23 ...
const reverseFormatDate = (date = new Date()) => {
  let tempDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  const splitDate = tempDate.split('/');
  return new Date(`${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`);
};

//function to check if a date is a weekend...
const isWeekend = (date = new Date()) => {
  return date.getDay() === 6 || date.getDay() === 0;
};

//Function to get tomorrow Date...
const getTomorrowDate = (date = new Date()) => {
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

//Function to check if tomorrow is weekend...
const isTomorrowWeekend = () => {
  return isWeekend(new Date(getTomorrowDate()));
};

//Function to get next monday date...
const getNextMondayDate = (date = new Date()) => {
  const dateCopy = new Date(date.getTime());
  const nextMonday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
    ),
  );
  return JSON.stringify(nextMonday).split('T')[0].replace(/["']/g, '');
};

//Function to Add Hours to a given date...
const hoursAdder = (date = new Date(), numberOfhours) => {
  date.setHours(date.getHours() + numberOfhours);
  return date;
};

//Function to Add minutes to a given date...
const minutesAdder = (date = new Date(), numberOfMinutes) => {
  const dateCopy = new Date(date.getTime());
  dateCopy.setMinutes(dateCopy.getMinutes() + numberOfMinutes);
  return dateCopy;
};

//Function to Add Hours to a given date...
const checkBusinessDay = (date = new Date()) => {
  const isTodayWeekend = isWeekend(date);
  const nextMonday = getNextMondayDate(date);
  const onlyDate = formatDateAndHour(date).split(' ')[0];
  const businessDateToUse = isTodayWeekend === true ? nextMonday : onlyDate;
  return businessDateToUse;
};

//Function to check if today is 7 days before a Surgery Date...
const is7DaysBeforeSurgeryDate = (date = new Date()) => {
  const today = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
};

//Function to check if today is the Surgery Date...
const isTodaySurgeryDate = (date) => {
  const today = new Date();
  return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
};

//Function to check if today is 1 Month after a Surgery Date...
const is1MonthAfterSurgeryDate = (date = new Date()) => {
  const today = new Date();
  date.setMonth(date.getMonth() + 1);
  let checkedDate = checkBusinessDay(date);
  return checkedDate === today.toISOString().split('T')[0];
};

