const API_BASE = "https://api.aladhan.com/v1/timingsByCity";

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
let timer = null;

// تحويل 24h -> 12h
function formatTime(time) {
  const [h, m] = time.split(":");
  let hour = +h;
  const ampm = hour >= 12 ? "م" : "ص";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

// تحويل لوقت Date
function toDate(time) {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(+h, +m, 0, 0);
  return d;
}

// تحميل المواقيت (القاهرة)
async function loadPrayerTimes() {
  const res = await fetch(
    `${API_BASE}?city=Cairo&country=EG&method=5`
  );

  const data = await res.json();
  const t = data.data.timings;

  prayerElements.Fajr.textContent = formatTime(t.Fajr);
  prayerElements.Dhuhr.textContent = formatTime(t.Dhuhr);
  prayerElements.Asr.textContent = formatTime(t.Asr);
  prayerElements.Maghrib.textContent = formatTime(t.Maghrib);
  prayerElements.Isha.textContent = formatTime(t.Isha);

  setNextPrayer(t);
}

// الصلاة القادمة
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

  startTimer();
}

// العد التنازلي
function startTimer() {
  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    const diff = nextPrayer.time - new Date();

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    countdownElement.textContent =
      `باقي ${h} ساعة ${m} دقيقة ${s} ثانية`;
  }, 1000);
}

loadPrayerTimes();
