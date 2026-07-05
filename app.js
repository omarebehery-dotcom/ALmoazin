// =========================
// Prayer Pro - app.js
// =========================

// عناصر الصفحة
const dayName = document.getElementById("dayName");
const gregorianDate = document.getElementById("gregorianDate");
const cityName = document.getElementById("cityName");
const countdown = document.getElementById("countdown");

const fajr = document.getElementById("fajr");
const sunrise = document.getElementById("sunrise");
const dhuhr = document.getElementById("dhuhr");
const asr = document.getElementById("asr");
const maghrib = document.getElementById("maghrib");
const isha = document.getElementById("isha");
const nextPrayer = document.getElementById("nextPrayer");

// API
const API = "https://api.aladhan.com/v1/timingsByCity";

let nextTime = null;
let timer;

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

// التاريخ
function updateDate() {
  const now = new Date();

  dayName.textContent = days[now.getDay()];

  gregorianDate.textContent = now.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

updateDate();

// الساعة
function updateClock() {
  const now = new Date();
  countdown.textContent = now.toLocaleTimeString("ar-EG");
}

setInterval(updateClock, 1000);
updateClock();


// تحويل وقت
function toDate(time) {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(+h, +m, 0, 0);
  return d;
}

// تنسيق وقت
function format(time) {
  const [h, m] = time.split(":");
  let hour = +h;
  const ampm = hour >= 12 ? "م" : "ص";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}


// جلب مواقيت الصلاة
async function loadPrayers(lat, lon) {
  try {
    const res = await fetch(
      `${API}?latitude=${lat}&longitude=${lon}&method=5`
    );

    const data = await res.json();
    const t = data.data.timings;

    fajr.textContent = format(t.Fajr);
    sunrise.textContent = format(t.Sunrise);
    dhuhr.textContent = format(t.Dhuhr);
    asr.textContent = format(t.Asr);
    maghrib.textContent = format(t.Maghrib);
    isha.textContent = format(t.Isha);

    cityName.textContent = `📍 موقعك الحالي`;

    setNextPrayer(t);

  } catch (e) {
    console.log(e);
    nextPrayer.textContent = "فشل تحميل المواقيت";
  }
}


// الصلاة القادمة
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

  for (let p of prayers) {
    const d = toDate(p[1]);
    if (d > now) {
      next = { name: p[0], time: d };
      break;
    }
  }

  if (!next) {
    next = { name: "الفجر", time: toDate(prayers[0][1]) };
    next.time.setDate(next.time.getDate() + 1);
  }

  nextTime = next.time;

  nextPrayer.textContent = `الصلاة القادمة: ${next.name}`;

  startTimer();
}


// عداد الصلاة القادمة
function startTimer() {
  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    const diff = nextTime - new Date();

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    countdown.textContent =
      `باقي ${h} ساعة ${m} دقيقة ${s} ثانية`;
  }, 1000);
}


// GPS
function getLocation() {
  if (!navigator.geolocation) {
    cityName.textContent = "جهازك لا يدعم GPS";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      loadPrayers(pos.coords.latitude, pos.coords.longitude);
    },
    () => {
      cityName.textContent 
      loadPrayers(30.0444, 31.2357); // القاهرة احتياطي
    }
  );
}

getLocation();
