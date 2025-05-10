# 📤 LINE Bot Google Drive Uploader (v3)

โปรเจกต์นี้เป็นระบบอัปโหลดไฟล์ผ่าน **LINE Bot** โดยใช้ **Google Apps Script** เชื่อมกับ **Google Drive** พร้อมหน้าเว็บสำหรับจัดการไฟล์ และความสามารถใหม่ในเวอร์ชันนี้:

* ✅ เพิ่มระบบรักษาความปลอดภัย: ตรวจสอบรหัสผ่านก่อน **ลบ/เปลี่ยนชื่อ** ไฟล์หรือโฟลเดอร์

---

## 🚀 ฟีเจอร์

* อัปโหลดไฟล์จากผู้ใช้ LINE Bot ไปยัง Google Drive
* รองรับการอัปโหลด **ไฟล์** และ **รูปภาพ**
* จัดเก็บไฟล์แยกหมวดหมู่ตามที่ผู้ใช้ส่งมา
* ส่งลิงก์กลับหาผู้ใช้ผ่าน **LINE Messaging API**
* Web Interface สำหรับจัดการไฟล์ (ดู, ลบ, แก้ชื่อ, ย้าย, แชร์)
* ✅ **ระบบยืนยันรหัสผ่านก่อนลบหรือแก้ไขไฟล์**

---

## 🛠️ วิธีใช้งาน

### 1. ตั้งค่า Google Apps Script

1. เข้าไปที่ [Google Apps Script](https://script.google.com/)

2. สร้างโปรเจกต์ใหม่

3. สร้าง 2 ไฟล์:

   * `code.gs` → วางโค้ดจาก `code.gs`
   * `index.html` → วางโค้ดจาก `index.html`

4. เปิดใช้งาน API ที่จำเป็น:

   * **Google Drive API**
   * **LINE Messaging API** (ผ่าน LINE Developer Console)

### 2. ตั้งค่า LINE Developer

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง Channel ใหม่
3. ตั้งค่า Webhook URL ให้ชี้ไปยัง Web App URL จากการ Deploy Apps Script
4. คัดลอก `Channel Access Token` และ `Channel Secret` มาใส่ใน `code.gs`

### 3. Deploy Web App

* คลิก `Deploy` > `Manage deployments` > `New deployment`
* เลือกประเภท `Web App`

  * Execute as: **Me**
  * Who has access: **Anyone**
* คลิก Deploy แล้วคัดลอก URL ไปใช้ตั้งค่า Webhook

---

## 🔐 ระบบรหัสผ่าน (NEW!)

* ก่อนจะ **ลบ/เปลี่ยนชื่อไฟล์หรือโฟลเดอร์** ผู้ใช้ต้องกรอกรหัสผ่าน
* รหัสผ่านถูกกำหนดไว้ใน `code.gs` ที่ตัวแปร:

  ```js
  const ADMIN_PASSWORD = 'yourpassword';
  ```
* ฝั่ง Web (`index.html`) จะมี `prompt()` ขอรหัสผ่านเมื่อมีการดำเนินการสำคัญ

---

## 🧾 โครงสร้างไฟล์

```
v2/
├── code.gs         # โค้ดหลักที่ใช้จัดการ LINE Webhook และ Web Interface
└── index.html      # ส่วนติดต่อผู้ใช้สำหรับดูและจัดการไฟล์
```

---

## 🔧 การตั้งค่าที่ต้องแก้ไข

### 🔹 code.gs

บรรทัดที่ 3-5:

```js
const LINE_CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';
const LINE_CHANNEL_SECRET = 'YOUR_CHANNEL_SECRET';
const FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';
```

บรรทัดที่ \~6:

```js
const ADMIN_PASSWORD = 'yourpassword';  // ✅ เพิ่มรหัสผ่านตรงนี้
```

---

### 🔹 index.html

บรรทัดที่ \~604:

```js
const ROOT_FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';
```

---

## 📌 หมายเหตุ

* โฟลเดอร์หลักควรกำหนดสิทธิ์ให้ผู้ที่มีลิงก์สามารถดูได้
* ทดสอบ Webhook ผ่าน LINE Developer Console หรือ Postman
* ระบบสามารถพัฒนาเพิ่ม เช่น:

  * บันทึกข้อมูลไฟล์ลง Google Sheet
  * สถิติการอัปโหลด
  * ระบบล็อกอิน

---

## 🙏 ขอบคุณ

โปรเจกต์นี้พัฒนาโดย [@krujeen](https://github.com/krujeen) เพื่ออำนวยความสะดวกแก่ผู้ที่ต้องการอัปโหลดและจัดการไฟล์ผ่าน LINE Bot และ Google Drive อย่างง่ายดาย

---
