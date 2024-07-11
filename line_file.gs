const LINE_CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';
const LINE_CHANNEL_SECRET = 'YOUR_CHANNEL_SECRET';
const FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';

function doPost(e) {
  const json = JSON.parse(e.postData.contents);
  const replyToken = json.events[0].replyToken;
  const messageId = json.events[0].message.id;
  const messageName = json.events[0].message.fileName;
  
  // Get file from Line
  const file = getFileFromLine(messageId, messageName);

  // Save file to Google Drive
  const now = new Date();
  const todayDate = now.toISOString().slice(0, 10);
  const fileName = `${todayDate}_${file.name}`;
  const fileId = saveFileToDrive(fileName, file.data);
  
  // Get file link
  const fileLink = `https://drive.google.com/file/d/${fileId}/view`;

  // Send file link back to Line
  const message = `${fileName} ${fileLink}`;
  replyToLine(replyToken, message);

  return ContentService.createTextOutput(JSON.stringify({ 'status': 'success' })).setMimeType(ContentService.MimeType.JSON);
}

function getFileFromLine(messageId, messageName) {
  const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
  const headers = {
    "Authorization": "Bearer " + LINE_CHANNEL_ACCESS_TOKEN
  };
  const response = UrlFetchApp.fetch(url, { headers: headers });
  const blob = response.getBlob();
  return {
    name: messageName,
    data: blob
  };
}

function saveFileToDrive(fileName, fileData) {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const file = folder.createFile(fileData);
  file.setName(fileName);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getId();
}

function replyToLine(replyToken, message) {
  const url = "https://api.line.me/v2/bot/message/reply";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + LINE_CHANNEL_ACCESS_TOKEN
  };
  const payload = JSON.stringify({
    replyToken: replyToken,
    messages: [{
      type: "text",
      text: message
    }]
  });
  UrlFetchApp.fetch(url, {
    method: "post",
    headers: headers,
    payload: payload
  });
}
