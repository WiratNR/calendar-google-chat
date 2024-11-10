# การรวม Google Calendar

โปรเจกต์นี้เป็นการรวม Google Calendar กับสองส่วนประกอบ:

- **CalendarApp**
- **GoogleCalendarApi**

## ส่วนประกอบ

### CalendarApp
ส่วนประกอบนี้ใช้บริการในตัว `CalendarApp` ของ Google Apps Script ในการโต้ตอบกับ Google Calendar ซึ่งจะให้ฟังก์ชันที่ง่ายในการสร้าง, ลบ, แก้ไข และดึงข้อมูลเหตุการณ์จากปฏิทิน

### GoogleCalendarApi
ส่วนประกอบนี้ใช้ Google Calendar API ในการเข้าถึงข้อมูลจาก Google Calendar ที่มีความยืดหยุ่นมากกว่า โดยสามารถดึงข้อมูลเหตุการณ์ทั้งหมดมาแสดงผลได้ รวมถึงรองรับการทำงานหลายรูปแบบ ซึ่งเหมาะสำหรับกรณีที่ `CalendarApp` อาจจะไม่รองรับหรือเมื่อจำเป็นต้องทำงานกับข้อมูลปฏิทินในรูปแบบที่ซับซ้อนกว่า

## ความแตกต่าง
- **CalendarApp**: จำกัดฟังก์ชันการใช้งานตามบริการ `CalendarApp` ที่ Google Apps Script จัดเตรียมมา
- **GoogleCalendarApi**: รองรับรูปแบบข้อมูลเหตุการณ์ที่หลากหลายและมีฟังก์ชันการทำงานที่กว้างขวาง รวมถึงสามารถดึงข้อมูลเหตุการณ์ทั้งหมดได้ในหลายรูปแบบ

## ข้อกำหนด

1. **Google Apps Script**: ตั้งค่า Google Apps Script พร้อมสิทธิ์ที่เหมาะสมในการเข้าถึงข้อมูล Google Calendar
2. **Google Calendar API**: เปิดใช้งาน Google Calendar API ใน Google Cloud Console และตั้งค่า OAuth2 credentials



# การรวม Google Calendar กับ Line Notify และ Webhook

โปรเจกต์นี้ช่วยในการดึงข้อมูลกิจกรรมจาก Google Calendar และส่งการแจ้งเตือนผ่าน Line Notify หรือ Webhook Google Chat 

## ส่วนประกอบของโปรเจกต์

### 1. **ใช้ `CalendarApp` จาก Google Apps Script**
   - ดึงข้อมูลกิจกรรมจาก Google Calendar ด้วยบริการ `CalendarApp` ของ Google Apps Script
   - ฟังก์ชัน `useCalendarApp()` จะดึงกิจกรรมในวันปัจจุบันหรือวันที่ที่กำหนด และส่งการแจ้งเตือนหากพบกิจกรรม

### 2. **ใช้ Google Calendar API**
   - ดึงข้อมูลกิจกรรมจาก Google Calendar โดยใช้ Google Calendar API
   - ฟังก์ชัน `useServiceCalandarAPI()` จะดึงข้อมูลกิจกรรมในช่วงเวลาที่กำหนด และส่งการแจ้งเตือนหากพบกิจกรรม
   - รองรับการดึงข้อมูล Google Meet ลิงก์และไฟล์แนบ (ถ้ามี)

### 3. **ฟังก์ชันการแจ้งเตือน**
   - **`sendLineNotify_()`**: ใช้สำหรับส่งข้อความแจ้งเตือนผ่าน Line Notify
   - **`sendChatNotification_()`**: ใช้สำหรับส่งข้อความแจ้งเตือนผ่าน Webhook ไปยังบริการต่างๆ (เช่น Slack, Microsoft Teams)
   
### 4. **ฟังก์ชันเสริม**
   - **`stripHtmlTags_()`**: ฟังก์ชันที่ใช้ลบ HTML tags จากข้อความ
   - **`getDateConfig_()`**: ฟังก์ชันที่ใช้คำนวณช่วงเวลาเริ่มต้นและสิ้นสุดตามวันที่ที่ต้องการ
   - **`convertDateTothai_()`** และ **`convertTimeTothai_()`**: ฟังก์ชันที่ใช้แปลงวันที่และเวลาให้อยู่ในรูปแบบภาษาไทย

## การตั้งค่า

1. **ตั้งค่า `CALENDAR_ID`**
   - ให้ตั้งค่า `CALENDAR_ID` เป็น ID ของ Google Calendar ที่ต้องการดึงข้อมูลจาก
   - ตัวอย่างเช่น `CALENDAR_ID = "calendar_id@domain.com"`

2. **ตั้งค่า `TOKEN`**
   - ให้ตั้งค่า `TOKEN` เป็น `Line Notify token` ที่ได้รับจาก Line Notify API
   - ใช้ token นี้ในการส่งข้อความแจ้งเตือนไปยัง Line

3. **ตั้งค่า Webhook URL Google Chat**
   - ให้ตั้งค่า URL ใน `sendChatNotification_()` เป็น URL ของ Webhook ที่จะใช้ในการส่งข้อความแจ้งเตือนไปยังบริการต่างๆ Google Chat 

## ฟังก์ชันหลัก

### 1. **`useCalendarApp()`**
   ฟังก์ชันนี้จะดึงกิจกรรมจาก Google Calendar ด้วยบริการ `CalendarApp` และส่งการแจ้งเตือนผ่าน Webhook หากมีกิจกรรมในวันที่กำหนด

   ```javascript
   function useCalendarApp() {
     const CALENDAR_ID = "CALENDAR_ID"
     const TOKEN = "TOKEN"

     const DATE_CONFIG = new Date().getDate() + 0
     const cal = CalendarApp.getCalendarById(CALENDAR_ID)
     var txt = ""
     const events = cal.getEventsForDay(new Date(new Date().setDate(DATE_CONFIG)))
     events.forEach((row) => {
       txt += "\n\nเรื่อง : " + row.getTitle() + "\n" +
         "รายละเอียด  : " + stripHtmlTags_(row.getDescription()) + "\n" +
         "กำหนดการ : " + convertDateTothai_(row.getStartTime()) + "\n" +
         "เวลา : " + convertTimeTothai_(row.getStartTime()) + " ถึง " + convertTimeTothai_(row.getEndTime()) + "\n" +
         "สถานที่ : " + (row.getLocation() || '') + "\n"
     })

     if (events.length > 0) sendChatNotification_(txt)
   }
