```markdown
# 🤖 LINE Bot + Google Drive Uploader (v1 - Filename Preserved)

ระบบนี้เป็น LINE Bot ที่พัฒนาด้วย **Google Apps Script** ซึ่งสามารถ:
- รับไฟล์จากผู้ใช้ที่ส่งมาทาง LINE
- บันทึกไฟล์ลง Google Drive โดยใช้ชื่อเดิมที่แนบมาพร้อมวันที่ส่ง
- ตอบกลับลิงก์ดาวน์โหลดไฟล์ให้ผู้ใช้ใน LINE

---

## 📌 คุณสมบัติ (Features)

- ✅ รับไฟล์จากผู้ใช้ผ่าน LINE Messaging API
- ✅ อัปโหลดไฟล์ไปยังโฟลเดอร์ที่ระบุใน Google Drive
- ✅ ตั้งชื่อไฟล์เป็น: `วันที่ส่ง_ชื่อไฟล์ที่ส่งมา` เช่น `2024-07-11_ใบสมัคร.pdf`
- ✅ ส่งข้อความตอบกลับผู้ใช้เป็น:  
  ```
  2024-07-11_ใบสมัคร.pdf https://drive.google.com/file/d/FILE_ID/view
  ```

---

## ⚙️ การติดตั้ง (Installation)

### 1. ตั้งค่า LINE Bot

- สร้าง Channel ใน [LINE Developers Console](https://developers.line.biz/)
- เปิดใช้งาน Messaging API
- บันทึก **Channel Access Token** และ **Channel Secret**

### 2. ตั้งค่า Google Apps Script

- เข้า [Google Apps Script](https://script.google.com/)
- สร้างโปรเจกต์ใหม่
- วางโค้ดจาก `Code.gs` ลงไป
- แก้ไขค่าต่อไปนี้ในต้นไฟล์:
  ```javascript
  const LINE_CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';
  const LINE_CHANNEL_SECRET = 'YOUR_CHANNEL_SECRET';
  const FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';
  ```
- `FOLDER_ID` คือ ID ของโฟลเดอร์ใน Google Drive ที่ต้องการให้บันทึกไฟล์

### 3. Deploy เป็น Web App

- ไปที่เมนู **Deploy > New deployment**
- เลือก **Web app**
- ตั้งค่า Access: `Anyone`
- คัดลอก **Web App URL**

### 4. ตั้งค่า Webhook URL ใน LINE Console

- กลับไปที่ LINE Developers Console
- วาง Web App URL ที่ได้จากขั้นตอนก่อนหน้าในช่อง **Webhook URL**
- เปิดใช้งาน Webhook

---

## 💬 วิธีใช้งาน

1. ผู้ใช้ส่งไฟล์ (PDF, รูปภาพ ฯลฯ) มายัง Bot ทางแชท LINE
2. Bot จะ:
   - ดาวน์โหลดไฟล์จาก LINE
   - เปลี่ยนชื่อไฟล์เป็น `วันที่ส่ง_ชื่อไฟล์เดิม`
   - อัปโหลดไฟล์ไปยัง Google Drive
   - ตั้งค่าการแชร์เป็น Anyone with the link
   - ตอบกลับผู้ใช้ในแชท LINE ด้วยลิงก์ของไฟล์

---

## 🧪 ตัวอย่างข้อความตอบกลับ

```
2024-07-11_ใบสมัคร.pdf https://drive.google.com/file/d/1AbCdeF.../view
```

---

## ⚠️ ข้อจำกัด

- Bot รองรับเฉพาะการส่ง **ไฟล์ (File Message)** ไม่รองรับข้อความหรือรูปภาพโดยตรงในเวอร์ชันนี้
- ต้องใช้บัญชี Google ที่มีสิทธิ์เข้าถึง Google Drive โฟลเดอร์เป้าหมาย

---
