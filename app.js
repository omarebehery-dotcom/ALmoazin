// =========================
// Prayer Pro - app.js
// =========================

// عناصر الصفحة
const dayName = document.getElementById("dayName");
const gregorianDate = document.getElementById("gregorianDate");
const hijriDate = document.getElementById("hijriDate");

const cityName =
  document.getElementById("cityName") ||
  document.getElementById("city");

const countdown = document.getElementById("countdown");

const fajr = document.getElementById("fajr");
const sunrise = document.getElementById("sunrise");
const dhuhr = document.getElementById("dhuhr");
const asr = document.getElementById("asr");
const maghrib = document.getElementById("maghrib");
const isha = document.getElementById("isha");

const nextPrayer =
  document.getElementById("nextPrayer");

// API
const API =
  "https://api.aladhan.com/v1/timings";

// متغيرات
let nextTime = null;
let timer = null;

// الأيام
const days = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت"
];

// تحديث التاريخ
function updateDate() {

  const now = new Date();

  dayName.textContent =
    days[now.getDay()];

  gregorianDate.textContent =
    now.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

}

updateDate();

// تحويل الوقت إلى 12 ساعة
function format(time) {

  const clean =
    time.split(" ")[0];

  const parts =
    clean.split(":");

  let hour =
    parseInt(parts[0]);

  const minute =
    parts[1];

  const ampm =
    hour >= 12 ? "م" : "ص";

  hour =
    hour % 12;

  if (hour === 0)
    hour = 12;

  return `${hour}:${minute} ${ampm}`;

}

// تحويل النص إلى Date
function toDate(time) {

  const clean =
    time.split(" ")[0];

  const [h, m] =
    clean.split(":");

  const d = new Date();

  d.setHours(
    parseInt(h),
    parseInt(m),
    0,
    0
  );

  return d;

}
// جلب مواقيت الصلاة
async function loadPrayers(lat, lon) {

  try {

    const response = await fetch(
      `${API}?latitude=${lat}&longitude=${lon}&method=5`
    );

    const result = await response.json();

    const data = result.data;

    const t = data.timings;

    // عرض المواقيت
    fajr.textContent = format(t.Fajr);
    sunrise.textContent = format(t.Sunrise);
    dhuhr.textContent = format(t.Dhuhr);
    asr.textContent = format(t.Asr);
    maghrib.textContent = format(t.Maghrib);
    isha.textContent = format(t.Isha);

    // المدينة
    if (cityName) {

      cityName.textContent =
        "📍 القاهرة - مصر";

    }

    // التاريخ الهجري
    if (hijriDate) {

      hijriDate.textContent =
        `${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year}`;

    }

    // التاريخ الميلادي
    gregorianDate.textContent =
      data.date.gregorian.date;

    // اليوم
    dayName.textContent =
      data.date.gregorian.weekday.ar;

    // حساب الصلاة القادمة
    setNextPrayer(t);

  }

  catch (error) {

    console.error(error);

    if (cityName) {

      cityName.textContent =
        "تعذر تحميل البيانات";

    }

  }

}

// حساب الصلاة القادمة
function setNextPrayer(t) {

  const prayers = [

    ["الفجر", t.Fajr],

    ["الظهر", t.Dhuhr],

    ["العصر", t.Asr],

    ["المغرب", t.Maghrib],

    ["العشاء", t.Isha]

  ];

  const now = new Date();

  let next = null;

  for (let prayer of prayers) {

    const prayerTime = toDate(prayer[1]);

    if (prayerTime > now) {

      next = {

        name: prayer[0],

        time: prayerTime

      };

      break;

    }

  }

  // إذا انتهت جميع الصلوات
  if (!next) {

    const fajrTomorrow = toDate(prayers[0][1]);

    fajrTomorrow.setDate(

      fajrTomorrow.getDate() + 1

    );

    next = {

      name: prayers[0][0],

      time: fajrTomorrow

    };

  }

  nextTime = next.time;

  nextPrayer.textContent = next.name;

  startCountdown();

}

// تشغيل العداد
function startCountdown() {

  if (timer)

    clearInterval(timer);

  function update() {

    const now = new Date();

    const diff = nextTime - now;

    if (diff <= 0) {

      clearInterval(timer);

      getLocation();

      return;

    }

    const hours = Math.floor(

      diff / 3600000

    );

    const minutes = Math.floor(

      (diff % 3600000) / 60000

    );

    const seconds = Math.floor(

      (diff % 60000) / 1000

    );

    countdown.textContent =

      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

  }

  update();

  timer = setInterval(update, 1000);

}
// الحصول على الموقع
function getLocation() {

  if (!navigator.geolocation) {

    if (cityName) {

      cityName.textContent =
        "📍 القاهرة - مصر";

    }

    loadPrayers(30.0444, 31.2357);

    return;

  }

  navigator.geolocation.getCurrentPosition(

    (position) => {

      const lat = position.coords.latitude;

      const lon = position.coords.longitude;

      loadPrayers(lat, lon);

    },

    () => {

      if (cityName) {

        cityName.textContent =
          "📍 القاهرة - مصر";

      }

      // موقع احتياطي: القاهرة
      loadPrayers(30.0444, 31.2357);

    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

  );

}

// تحديث التاريخ كل دقيقة
setInterval(updateDate, 60000);

// تشغيل التطبيق
window.addEventListener("load", () => {

  updateDate();

  getLocation();

});
