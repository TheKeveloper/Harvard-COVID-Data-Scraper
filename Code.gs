function getSpreadsheetUrl(){
  return "https://docs.google.com/spreadsheets/d/1pJUpky9QRHA2tcaNMgS3gjq4pjrlUnjMZ2stXsaMOB0/edit#gid=0";
}

function getSrcSheetUrl() {
  return "https://docs.google.com/spreadsheets/d/1XQWh_XM69XBkhcRi2x6hL2U8k36W6GCzsMBghAAuoC0/edit#gid=718131249"; 
}

function getSrcWebsiteUrl() {
  return "https://www.harvard.edu/coronavirus/harvard-university-wide-covid-19-testing-dashboard";
}


function updateDailyValues(values, sheet) {
  const lastDate = sheet.getRange("A2").getValues()[0][0];
  const newRows = []
  for(var i = 0; i < values.length; i++){
    var row = values[i];
    var date = row[0];
    date.setDate(date.getDate() + 1);
    if(date <= lastDate) {
      break;
    }
    newRows.push([date, row[1], row[3], row[5], row[7]]);
  }
  if(newRows.length > 0) {
    sheet.insertRowsBefore(2, newRows.length);
    const newRange = sheet.getRange(2, 1, newRows.length, 5);
    newRange.setValues(newRows);
  }
}

function updateTotals(sheet) {
  const content = UrlFetchApp.fetch(getSrcWebsiteUrl()).getContentText();
  const getValue = function(header) {
    const regexString = `<h3 class="card__title">
					#TITLE
				<\/h3>
	
				<p class="txt-h6">
					
				<\/p>
	
				<div class="card__text">
					<h1>(.+?)<`.replace("#TITLE", header)
    const regex = new RegExp(regexString);
    return content.match(regex)[1];
  }
  const totalPositive = getValue("Total positive cases");
  const undergradPositive = getValue("Total undergraduate student positive cases");
  const graduatePositive = getValue("Total graduate student positive cases");
  const otherPositive = getValue("Total faculty, staff, or other affiliates positive cases");
  const totalTests = getValue("Total tests conducted");
  const undergradTests = getValue("Total undergraduate student tests");
  const graduateTests = getValue("Total graduate student tests");
  const otherTests = getValue("Total faculty, staff, or other affiliates tests");
  
  sheet.insertRowsBefore(2, 1);
  const newRange = sheet.getRange(2, 1, 1, 9);
  newRange.setValues([[new Date(), totalPositive, undergradPositive, graduatePositive, otherPositive,
                     totalTests, undergradTests, graduateTests, otherTests]]);
}

function scrapeCovidCases() {
  const spreadsheet = SpreadsheetApp.openByUrl(getSpreadsheetUrl());
  const totalSheet = spreadsheet.getSheets()[0];
  const dailySheet = spreadsheet.getSheets()[1];
  
  const srcSpreadsheet = SpreadsheetApp.openByUrl(getSrcSheetUrl());
  const srcSheet = srcSpreadsheet.getSheets()[0];
  const srcValues = srcSheet.getRange("A2:H8").getValues();
  updateDailyValues(srcValues, dailySheet);
  updateTotals(totalSheet);
}
