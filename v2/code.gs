// code.gs
// แก้บรรทัดที่ 4,5,6 และ 15

const LINE_CHANNEL_ACCESS_TOKEN = 'กรอก Channel access token';
const LINE_CHANNEL_SECRET = 'กรอก Channel secret';
const FOLDER_ID = 'ID ของโฟลเดอร์หลักที่ต้องการเก็บไฟล์';


/**
 * เปิดเว็บแอพเมื่อเปิดสคริปต์
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Google Drive File Manager')
    .setFaviconUrl('https://www.krujeen.com/wp-content/uploads/2020/04/logo_krujeen3.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}


// ฟังก์ชันสำหรับแทรกไฟล์ HTML อื่นๆ
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}



function doPost(e) {
  const json = JSON.parse(e.postData.contents);
  const event = json.events[0];
  const userId = event.source.userId;
  const replyToken = event.replyToken;
  const message = event.message;

  const cache = CacheService.getUserCache();
  let category = cache.get(userId) || 'Uncategorized';

  // -----------------------------
  // ✅ 1. กรณีข้อความเริ่มต้นด้วย "/"
  // -----------------------------

  // ✅ ตรวจสอบคำสั่งหมวดหมู่
  if (message.type === 'text' && message.text.startsWith("/")) {
    const command = message.text.substring(1).trim(); // ตัด '/' ด้านหน้า

    if (command.toLowerCase() === "reset") {
      cache.remove(userId);
      replyWithQuickReply(replyToken, "🗂 โปรดเลือกหมวดหมู่ใหม่:");
    } else {
      cache.put(userId, command, 3600); // จำไว้ 1 ชั่วโมง
      replyToLine(replyToken, `✅ ตั้งค่าหมวดหมู่เป็น: ${command}`);
    }

    return ContentService.createTextOutput(JSON.stringify({ 'status': 'category command handled' })).setMimeType(ContentService.MimeType.JSON);
  }

  // -----------------------------
  // ✅ 2. กรณีรับ "ไฟล์"
  // -----------------------------
  if (message.type === 'file') {
    const messageId = message.id;
    const messageName = message.fileName;
    const file = getFileFromLine(messageId, messageName);

    const now = new Date();
    const todayDate = now.toISOString().slice(0, 10);
    const fileName = `${todayDate}_${file.name}`;
    const fileId = saveFileToDrive(fileName, file.data, category);
    const fileLink = `https://drive.google.com/file/d/${fileId}/view`;

    const responseMessage = `📁 ${category}\n${fileName}\n🔗 ${fileLink}`;
    replyToLine(replyToken, responseMessage);
  }

  // -----------------------------
  // ✅ 3. กรณีรับ "รูปภาพ"
  // -----------------------------
  if (message.type === 'image') {
    const messageId = message.id;
    const file = getFileFromLine(messageId, "image.jpg");

    const now = new Date();
    const todayDate = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '-');
    const fileName = `${todayDate}_${time}_image.jpg`;

    const fileId = saveFileToDrive(fileName, file.data, category);
    const fileLink = `https://drive.google.com/file/d/${fileId}/view`;

    const responseMessage = `📁 ${category}\n🖼️ ${fileName}\n🔗 ${fileLink}`;
    replyToLine(replyToken, responseMessage);
  }

  return ContentService.createTextOutput(JSON.stringify({ 'status': 'ok' })).setMimeType(ContentService.MimeType.JSON);
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

function saveFileToDrive(fileName, fileData, category = 'Uncategorized') {
  const rootFolder = DriveApp.getFolderById(FOLDER_ID);
  let subFolder;
  
  // Check if folder exists
  const folders = rootFolder.getFoldersByName(category);
  if (folders.hasNext()) {
    subFolder = folders.next();
  } else {
    subFolder = rootFolder.createFolder(category);
  }

  const file = subFolder.createFile(fileData);
  file.setName(fileName);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getId();
}

function getFiles() {
  const files = [];
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const subFolders = folder.getFolders();

  while (subFolders.hasNext()) {
    const sub = subFolders.next();
    const filesIterator = sub.getFiles();
    while (filesIterator.hasNext()) {
      const file = filesIterator.next();
      files.push({
        id: file.getId(),
        name: `[${sub.getName()}] ${file.getName()}`,
        link: `https://drive.google.com/file/d/${file.getId()}/view`
      });
    }
  }

  return files;
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


function replyWithQuickReply(replyToken, text) {
  const url = "https://api.line.me/v2/bot/message/reply";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + LINE_CHANNEL_ACCESS_TOKEN
  };

  const quickReplies = [
    "วิทยาการคำนวณ",
    "วิทยาศาสตร์",
    "รายงานอบรม",
    "อื่น ๆ"
  ].map(category => ({
    type: "action",
    action: {
      type: "message",
      label: category,
      text: `/${category}`
    }
  }));

  const payload = JSON.stringify({
    replyToken: replyToken,
    messages: [{
      type: "text",
      text: text,
      quickReply: {
        items: quickReplies
      }
    }]
  });

  UrlFetchApp.fetch(url, {
    method: "post",
    headers: headers,
    payload: payload
  });
}


// ฟังก์ชันเสริมสำหรับแปลง role เป็น permission
function getRolePermission(role) {
  switch (role) {
    case "writer":
      return DriveApp.Permission.EDIT;
    case "commenter":
      return DriveApp.Permission.COMMENT;
    case "reader":
    default:
      return DriveApp.Permission.VIEW;
  }
}


/**
 * ดึงข้อมูลไฟล์และโฟลเดอร์ในโฟลเดอร์ที่ระบุ
 */
function getFolderContents(folderId) {
  try {
    let folder;
    
    if (folderId === 'root') {
      folder = DriveApp.getRootFolder();
    } else {
      folder = DriveApp.getFolderById(folderId);
    }
    
    // ดึงโฟลเดอร์ทั้งหมด
    const folderIterator = folder.getFolders();
    const folders = [];
    
    while (folderIterator.hasNext()) {
      const subFolder = folderIterator.next();
      folders.push({
        id: subFolder.getId(),
        name: subFolder.getName()
      });
    }
    
    // ดึงไฟล์ทั้งหมด
    const fileIterator = folder.getFiles();
    const files = [];
    
    while (fileIterator.hasNext()) {
      const file = fileIterator.next();
      files.push({
        id: file.getId(),
        name: file.getName(),
        link: file.getUrl()
      });
    }
    
    return {
      folders: folders,
      files: files
    };
  } catch (e) {
    throw new Error("ไม่สามารถดึงข้อมูลได้: " + e.toString());
  }
}

/**
 * ดึงชื่อโฟลเดอร์จาก ID
 */
function getFolderName(folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    return folder.getName();
  } catch (e) {
    throw new Error("ไม่สามารถดึงชื่อโฟลเดอร์ได้: " + e.toString());
  }
}

/**
 * ลบไฟล์
 */
function deleteFile(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return true;
  } catch (e) {
    throw new Error("ไม่สามารถลบไฟล์ได้: " + e.toString());
  }
}

/**
 * เปลี่ยนชื่อไฟล์
 */
function renameFile(fileId, newName) {
  try {
    const file = DriveApp.getFileById(fileId);
    file.setName(newName);
    return true;
  } catch (e) {
    throw new Error("ไม่สามารถเปลี่ยนชื่อไฟล์ได้: " + e.toString());
  }
}

/**
 * เปลี่ยนชื่อโฟลเดอร์
 */
function renameFolder(folderId, newName) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    folder.setName(newName);
    return true;
  } catch (e) {
    throw new Error("ไม่สามารถเปลี่ยนชื่อโฟลเดอร์ได้: " + e.toString());
  }
}

/**
 * ลบโฟลเดอร์
 */
function deleteFolder(folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    folder.setTrashed(true);
    return true;
  } catch (e) {
    throw new Error("ไม่สามารถลบโฟลเดอร์ได้: " + e.toString());
  }
}

/**
 * ดึงรายการโฟลเดอร์ทั้งหมดที่อยู่ภายใต้โฟลเดอร์หลัก
 */
function getAllFolders(rootFolderId) {
  try {
    const rootFolder = DriveApp.getFolderById(rootFolderId);
    const folders = [];
    
    // เพิ่มโฟลเดอร์หลัก
    folders.push({
      id: rootFolder.getId(),
      name: rootFolder.getName() + " (หลัก)"
    });
    
    // ฟังก์ชันสำหรับเพิ่มโฟลเดอร์และโฟลเดอร์ย่อยเข้าไปในอาร์เรย์
    function addFoldersRecursively(parentFolder, depth = 0, maxDepth = 2) {
      if (depth >= maxDepth) return; // จำกัดความลึกเพื่อป้องกันการทำงานนานเกินไป
      
      const subFolders = parentFolder.getFolders();
      while (subFolders.hasNext()) {
        const folder = subFolders.next();
        
        // สร้างชื่อที่มีการเยื้องแสดงระดับ
        const indentation = "—".repeat(depth);
        const displayName = depth > 0 ? `${indentation} ${folder.getName()}` : folder.getName();
        
        folders.push({
          id: folder.getId(),
          name: displayName
        });
        
        // เรียกตัวเองเพื่อเพิ่มโฟลเดอร์ย่อยถัดไป
        addFoldersRecursively(folder, depth + 1, maxDepth);
      }
    }
    
    // เริ่มเพิ่มโฟลเดอร์ต่างๆ
    addFoldersRecursively(rootFolder);
    
    return folders;
  } catch (e) {
    throw new Error("ไม่สามารถดึงรายการโฟลเดอร์ได้: " + e.toString());
  }
}

/**
 * ย้ายไฟล์ไปยังโฟลเดอร์ปลายทาง
 */
function moveFile(fileId, targetFolderId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const targetFolder = DriveApp.getFolderById(targetFolderId);
    
    // เพิ่มไฟล์ไปยังโฟลเดอร์ปลายทาง
    targetFolder.addFile(file);
    
    // ลบไฟล์จากโฟลเดอร์เดิม
    const parents = file.getParents();
    while (parents.hasNext()) {
      const parent = parents.next();
      if (parent.getId() !== targetFolderId) {
        parent.removeFile(file);
      }
    }
    
    return true;
  } catch (e) {
    throw new Error("ไม่สามารถย้ายไฟล์ได้: " + e.toString());
  }
}

/**
 * ดึงลิงค์แชร์ปัจจุบัน
 */
function getShareLink(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
    
    // ตรวจสอบสิทธิ์การแชร์ปัจจุบัน
    var access = file.getSharingAccess();
    var permission = file.getSharingPermission();
    
    // แปลง permission เป็น role
    var role = "reader";
    if (permission == DriveApp.Permission.COMMENT) {
      role = "commenter";
    } else if (permission == DriveApp.Permission.EDIT) {
      role = "writer";
    }
    
    // ถ้าไฟล์ยังไม่ได้แชร์ ให้สร้างลิงค์แชร์ใหม่
    if (access == DriveApp.Access.PRIVATE) {
      return { link: null, role: role };
    }
    
    // ดึง URL ของไฟล์
    var url = file.getUrl();
    
    // แก้ไข URL ให้เป็นรูปแบบลิงค์แชร์
    if (url.indexOf('drive.google.com/file/d/') > -1) {
      // สำหรับไฟล์ทั่วไปที่มี URL รูปแบบ /file/d/
      url = url.replace('/file/d/', '/uc?id=').replace(/\/view.*$/, '');
    } else if (url.indexOf('drive.google.com/open') > -1) {
      // ไม่ต้องแก้ไขอะไร เพราะเป็นลิงค์แชร์อยู่แล้ว
    } else {
      // สำหรับเอกสาร Google (Docs, Sheets, Slides, etc.)
      url = url.replace(/\/edit.*$/, '/view');
    }
    
    return {
      link: url,
      role: role
    };
  } catch (e) {
    throw new Error("ไม่สามารถดึงลิงค์แชร์ได้: " + e.toString());
  }
}

/**
 * สร้างลิงค์แชร์
 */
function createShareLink(fileId, role) {
  try {
    var file = DriveApp.getFileById(fileId);
    
    // กำหนดการเข้าถึงไฟล์ให้ใครก็ได้ที่มีลิงค์
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, getRolePermission(role));
    
    // คืนค่าลิงค์แชร์โดยเรียกใช้ getShareLink
    return getShareLink(fileId);
  } catch (e) {
    throw new Error("ไม่สามารถสร้างลิงค์แชร์ได้: " + e.toString());
  }
}


/**
 * สร้างโฟลเดอร์ใหม่ในโฟลเดอร์ปัจจุบัน
 */
function createNewFolder(parentFolderId, folderName) {
  try {
    const parentFolder = DriveApp.getFolderById(parentFolderId);
    const newFolder = parentFolder.createFolder(folderName);
    
    return {
      id: newFolder.getId(),
      name: newFolder.getName()
    };
  } catch (e) {
    throw new Error("ไม่สามารถสร้างโฟลเดอร์ใหม่ได้: " + e.toString());
  }
}
