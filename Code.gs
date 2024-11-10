// @credit--------------------TheDuctTech--------------------------
// ท่านใดที่ชอบคลิปนี้ สามารถสนับสนุนค่ากาแฟได้ที่บัญชี
// 0623645916 กสิกร
// นายวิรัตน์ นารี ขอบคุณครับ :)
// -----------------------------------------------------




function useCalendarApp() {

  const CALENDAR_ID = "CALENDAR_ID"
  const TOKEN = "TOKEN"

  const DATE_CONFIG = new Date().getDate() + 0
  // [+1] คือ แจ้งเตือนล้วงหน้า 1 วัน 
  // [-1] แจ้งเตือนย้อนหลัง 1 วัน
  // ถ้าไม่ใส่ จะแจ้งเตือนวันปัจจุบันเท่านั้น หรือ ใส่ 0
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

  // ถ้ามีกิจกรรม ก็จะทำการแจ้งเตือน
  if (events.length > 0) sendChatNotification_(txt)
  // console.log(txt)
}

function useServiceCalandarAPI() {
  const CALENDAR_ID = 'wirat.n@psru.ac.th';


  // [+1] คือ แจ้งเตือนล้วงหน้า 1 วัน 
  // [-1] แจ้งเตือนย้อนหลัง 1 วัน
  // ถ้าไม่ใส่ จะแจ้งเตือนวันปัจจุบันเท่านั้น หรือ ใส่ 0
  const DATE_CONFIG = getDateConfig_();

  const events = Calendar.Events.list(CALENDAR_ID, {
    timeMin: DATE_CONFIG.startTime,
    timeMax: DATE_CONFIG.endTime,
    singleEvents: true,
    orderBy: 'startTime'
  });

  let txt = "";

  if (events.items && events.items.length > 0) {
    events.items.forEach(event => {
      txt += "\n\nเรื่อง : " + (event.summary || "ไม่มีชื่อ") + "\n" +
        "รายละเอียด : \n" + stripHtmlTags_(event.description || "ไม่มีคำอธิบาย") + "\n" +
        "กำหนดการ : " + convertDateTothai_(event.start.dateTime || event.start.date) + "\n" +
        "เวลา : " + convertTimeTothai_(event.start.dateTime || event.start.date) +
        " ถึง " + convertTimeTothai_(event.end.dateTime || event.end.date) + "\n" +
        "สถานที่ : " + (event.location || "ไม่มีสถานที่") + "\n";

      if (event.conferenceData && event.conferenceData.entryPoints) {
        const meetLink = event.conferenceData.entryPoints.find(entry => entry.entryPointType === "video");
        if (meetLink) {
          txt += "Google Meet : " + meetLink.uri + "\n";
        } else {
          txt += "Google Meet : ไม่มี\n";
        }
      } else {
        txt += "Google Meet : ไม่มี\n";
      }

      // ดึงไฟล์แนบ (ถ้ามี)
      if (event.attachments && event.attachments.length > 0) {
        txt += "ไฟล์แนบ :\n";
        event.attachments.forEach(att => {
          txt += "  - " + att.fileUrl + " (" + att.title + ")\n";
        });
      } else {
        txt += "ไฟล์แนบ : ไม่มี\n";
      }

    });
  } else {
    txt = "ไม่พบกิจกรรมในช่วงวันที่ที่ระบุ";
  }

  // ถ้ามีกิจกรรม ก็จะทำการแจ้งเตือน
  if (events.items.length > 0) sendChatNotification_(txt)

  //  console.log(txt)

}


const sendLineNotify_ = (token, txt) => {
  //ฟังก์ชั่น Library แจงเตือน Linenotify
  //const notify = new lib.lineNotify(token)
  //notify.sendText(txt)

  //update new

  const url = "https://notify-api.line.me/api/notify";
  const headers = {
    "Authorization": "Bearer " + token
  };

  const payload = {
    "message": txt
  };

  const options = {
    "method": "post",
    "headers": headers,
    "payload": payload
  };

  UrlFetchApp.fetch(url, options);
}

function sendChatNotification_(txt) {

  const url = 'webhook'

  var message = {
    "text": txt
  };

  var options = {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(message)
  };

  UrlFetchApp.fetch(url, options);
}

function stripHtmlTags_(text) {
  if (!text) return "";

  // console.log(text)

  // 1. แทนที่ tag ที่ควรมีการขึ้นบรรทัดใหม่ด้วย \n ก่อน
  text = text.replace(/<\/?(p|div|br|h[1-6]|li|tr|title|thead|tbody)[^>]*>/gi, '\n');

  // console.log(text)

  // 2. ลบ HTML tags ทั้งหมด
  text = text.replace(/<[^>]+(>|$)/g, "");

  // console.log(text)

  // 3. จัดการกับการเว้นบรรทัด และเพิ่ม - หน้าข้อความ

  const a = text
    .split('\n')  // แยกเป็นอาร์เรย์ตามบรรทัด
    .map(line => line.trim())  // ตัดช่องว่างแต่ละบรรทัด
    .filter(line => line)  // กรองบรรทัดว่างออก
    .map(line => `- ${line}`)  // เพิ่ม - หน้าข้อความ
    .join('\n')  // รวมกลับเป็นข้อความ
    .trim();  // ตัดช่องว่างหัวท้าย

  // console.log(a)
  return a
}

function getDateConfig_(days = 0) {
  const today = new Date();

  // ปรับวันที่ตามจำนวนวันที่ต้องการล่วงหน้า (+) หรือลดย้อนหลัง (-)
  const adjustedStartDate = new Date(today);
  adjustedStartDate.setDate(today.getDate() + days);
  adjustedStartDate.setHours(0, 0, 0, 0);

  const adjustedEndDate = new Date(today);
  adjustedEndDate.setDate(today.getDate() + days);
  adjustedEndDate.setHours(23, 59, 59, 999);

  return {
    startTime: adjustedStartDate.toISOString(),
    endTime: adjustedEndDate.toISOString()
  };
}

function convertDateTothai_(d) {
  const date = new Date(d);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

function convertTimeTothai_(d) {
  const date = new Date(d);
  return date.toLocaleTimeString('th-TH', {
    timeZone: "Asia/Bangkok",
    hour: 'numeric',
    minute: 'numeric',
    hour12: false // ใช้รูปแบบ 24 ชั่วโมง
  });
}
