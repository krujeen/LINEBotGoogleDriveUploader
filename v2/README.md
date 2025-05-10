# 📤 LINE Bot Google Drive Uploader (v2)

โปรเจกต์นี้เป็นการสร้างระบบอัปโหลดไฟล์ผ่าน **LINE Bot** โดยใช้ Google Apps Script เชื่อมกับ Google Drive ซึ่งในเวอร์ชันนี้ (`v2`) จะประกอบด้วย:
- `code.gs`: สคริปต์หลักสำหรับจัดการ webhook และการอัปโหลดไฟล์ไปยัง Google Drive
- `index.html`: ส่วนของ Web Interface สำหรับอัปโหลดไฟล์ผ่านหน้าเว็บ

---

## 🚀 ฟีเจอร์
- รองรับการอัปโหลดไฟล์จากผู้ใช้ LINE Bot ไปยัง Google Drive
- จัดการไฟล์ใน Drive ได้อย่างเป็นระบบ
- มี Web Interface สำหรับอัปโหลดไฟล์เพิ่มเติม
- รองรับการตอบกลับผ่าน LINE Messaging API

---

## 🛠️ วิธีใช้งาน

### 1. ตั้งค่า Google Apps Script
1. ไปที่ [Google Apps Script](https://script.google.com/)
2. สร้างโปรเจกต์ใหม่ แล้วนำโค้ดจาก `code.gs` และ `index.html` ไปวางในไฟล์ `Code.gs` และ `index.html` ตามลำดับ
3. เปิดใช้งาน API ต่าง ๆ ที่จำเป็น เช่น:
   - Google Drive API
   - LINE Messaging API (จัดการผ่าน Developer Console)

### 2. ตั้งค่า LINE Developer
1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง Channel และตั้งค่า Webhook URL ให้ชี้ไปที่ Apps Script Web App URL ที่ได้จากการ Deploy
3. นำ Channel Access Token และ Secret ไปใส่ใน `code.gs`

### 3. Deploy Web App
- คลิก `Deploy` > `Manage Deployments` > `New Deployment`
- เลือก `Web App` และตั้งค่าเป็น:
  - Execute as: **Me**
  - Who has access: **Anyone**
- กด Deploy และคัดลอก URL เพื่อใช้กับ LINE

---

## 🧾 โครงสร้างไฟล์

```
v2/
├── code.gs         # โค้ดหลักที่ใช้จัดการ LINE Webhook และการจัดเก็บไฟล์
└── index.html      # หน้าเว็บสำหรับอัปโหลดไฟล์
```

---

## แก้ไขไฟล์ code.gs  บรรทัดที่ 3, 4 และ 5
```
const LINE_CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';
const LINE_CHANNEL_SECRET = 'YOUR_CHANNEL_SECRET';
const FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';
```


## แก้ไขไฟล์ index.html บรรทัดที่ 604
```
const ROOT_FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';  // แก้ไข FOLDER_ID
```

## 📌 หมายเหตุ
- ควรตั้งค่าสิทธิ์โฟลเดอร์ Google Drive ให้เหมาะสม
- อย่าลืมทดสอบ Webhook URL ด้วย Postman หรือ LINE Developer Console
- ระบบนี้สามารถพัฒนาเพิ่มเติม เช่น การจัดหมวดหมู่ไฟล์ หรือการเพิ่มฐานข้อมูลร่วมกับ Google Sheet

---

## 🙏 
พัฒนาโดย [@krujeen](https://github.com/krujeen) เพื่อช่วยอำนวยความสะดวกในการจัดการไฟล์ผ่าน LINE Bot

---







