const API_BASE = "https://api.aladhan.com/v1/timings";

const prayerElements = {
  Fajr: document.getElementById("fajr"),
  Dhuhr: document.getElementById("dhuhr"),
  Asr: document.getElementById("asr"),
  Maghrib: document.getElementById("maghrib"),
  Isha: document.getElementById("isha"),
};

const nextPrayerElement = document.getElementById("nextPrayer");
const countdownElement = document.getElementById("countdown");

let nextPrayer = null;
let countdownInterval = null;

// تحويل الوقت لشكل 12 ساعة
function formatTime(time24) {
  const [h, m] = time24.split(":");
  let hour = +h;

  const ampm = hour >= 12 ? "م" : "ص";
  hour = hour % 12 || 12;

  return `${hour}:${m} ${ampm}`;
}

// تحويل إلى Date
function toDate(time) {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(+h, +m, 0, 0);
  return d;
}

async function loadPrayerTimes(lat, lon) {
  const res = await fetch(
    `${API_BASE}?latitude=${lat}&longitude=${lon}&method=5`
  );

  const data = await res.json();
  const t = data.data.timings;

  // عرض كل الصلوات + وقتها
  prayerElements.Fajr.textContent = formatTime(t.Fajr);
  prayerElements.Dhuhr.textContent = formatTime(t.Dhuhr);
  prayerElements.Asr.textContent = formatTime(t.Asr);
  prayerElements.Maghrib.textContent = formatTime(t.Maghrib);
  prayerElements.Isha.textContent = formatTime(t.Isha);

  setNextPrayer(t);
}

// تحديد الصلاة القادمة
function setNextPrayer(t) {
  const prayers = [
    { name: "الفجر", time: toDate(t.Fajr) },
    { name: "الظهر", time: toDate(t.Dhuhr) },
    { name: "العصر", time: toDate(t.Asr) },
    { name: "المغرب", time: toDate(t.Maghrib) },
    { name: "العشاء", time: toDate(t.Isha) },
  ];

  const now = new Date();

  let next = prayers.find(p => p.time > now);

  if (!next) {
    next = prayers[0];
    next.time.setDate(next.time.getDate() + 1);
  }

  nextPrayer = next;

  nextPrayerElement.textContent = `الصلاة القادمة: ${next.name}`;

  startCountdown();
}

// العد التنازلي
function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    if (!nextPrayer) return;

    const diff = nextPrayer.time - new Date();

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    countdownElement.textContent =
      `باقي ${h} ساعة ${m} دقيقة ${s} ثانية`;
  }, 1000);
}

// تشغيل الموقع
navigator.geolocation.getCurrentPosition(
  (pos) => {
    loadPrayerTimes(pos.coords.latitude, pos.coords.longitude);
  },
  () => {
    alert("فعّل الموقع عشان نجيب مواقيت الصلاة");
  }
);
