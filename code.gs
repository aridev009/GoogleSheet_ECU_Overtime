function onFormSubmit(e){

  const info = e.namedValues;
  const pdfFile = createPdf(info);


  const entryRow = e.range.getRow();
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Mother OT Response').getRange(entryRow,16).setValue(pdfFile.getUrl());

  sendEmail(info['Email Address'][0],pdfFile);
}

function sendEmail(email,pdfFile){
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Mother OT Response');
  var lr = ss.getLastRow();
  var enggName = ss.getRange(lr,15).getValue();
  var misName = ss.getRange(lr,5).getValue();
  var mazName = ss.getRange(lr,6).getValue();
  var driName = ss.getRange(lr,7).getValue();
  var facOt = ss.getRange(lr,13).getValue();
  var nonfacOt = ss.getRange(lr,14).getValue();
  var dateDuty = ss.getRange(lr,3).getDisplayValue();
  var dShift = ss.getRange(lr,4).getValue();
  var jobDetails = ss.getRange(lr,8).getValue();

  var html = HtmlService.createTemplateFromFile("msg.html"); //here the template file is in msg.html
  var htmlText = html.getRawContent().replace("{Engineer Name}",enggName).replace("{Engineer Name}",enggName).replace("{Mistry Name}",misName).replace("{Mazdoor Name}",mazName).replace("{Driver Name}",driName).replace("{Factory O/T}",facOt).replace("{Non Factory O/T}",nonfacOt).replace("{Date of duty}",dateDuty).replace("{Duty Shift}",dShift).replace("{Job details}",jobDetails);
    GmailApp.sendEmail(email,pdfFile.getName(),"Please find the ECU Overtime Slip as attached herewith",
    {
    htmlBody: htmlText,
    attachments: [pdfFile],
    name: 'Overtime Module',
    cc: "EMAIL_ID_SOMEONE@rpsg.in", //where mail to be sent to concerned engg
    bcc: 'EMAIL_ID_SOMEONE@rpsg.in'//where mail to be sent to concerned engg
    })

}



function createPdf(info){

  var templateDoc = DriveApp.getFileById("1r-_slRT8vXvbgPlPpGSKyzuFIQaOdqIs4GodOnW-rno"); //GDRIVE ID
  var pdfFolder = DriveApp.getFolderById("1W0xj2e05-EKTf6_6CKOaE5pZpG_YRHi-"); //PDF FOLDER ID WHERE PDF WILL GET STORED
  var tempFolder = DriveApp.getFolderById("1bdyIqttKJYmJrKj88TItLYuvmhcKH5aO"); //A TEMPORARY FOLDER NEEDS TO BE MADE

var tempDoc = templateDoc.makeCopy(tempFolder);
const openDoc = DocumentApp.openById(tempDoc.getId());
const body = openDoc.getBody();
body.replaceText("{{Mistry Name}}",info['Mistry Name'][0]);
body.replaceText("{{Mazdoor Name}}",info['Mazdoor Name'][0]);
body.replaceText("{{Engineer Name}}",info['Engineer Name'][0]);
body.replaceText("{{Driver Name}}",info['Driver Name'][0]);
body.replaceText("{{Job starting time}}",info['Job starting time'][0]);
body.replaceText("{{Job end time}}",info['Job end time'][0]);
body.replaceText("{{Duty Shift}}",info['Duty Shift'][0]);
body.replaceText("{{Date of duty}}",info['Date of duty'][0]);
body.replaceText("{{Factory O/T}}",info['Factory O/T'][0]);
body.replaceText("{{Non Factory O/T}}",info['Non Factory O/T'][0]);
body.replaceText("{{Job details}}",info['Job details '][0]);
body.replaceText("{{Job Date}}",info['Job Date'][0]);
body.replaceText("{{Operation Job at Factory Premise}}",info['Operation Job at Factory Premise'][0]);

openDoc.saveAndClose();




var blobPdf = tempDoc.getAs('application/pdf');
const pdfFile = pdfFolder.createFile(blobPdf).setName("Overtime Slip by " + info['Engineer Name'][0] + ' ' + info['Job Date'][0]);
tempFolder.removeFile(tempDoc);


return pdfFile;
}
