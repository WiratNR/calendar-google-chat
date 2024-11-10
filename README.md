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

