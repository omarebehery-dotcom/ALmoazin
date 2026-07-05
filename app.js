const API_BASE = "https://api.aladhan.com/v1/timings";

const prayerElements = {
  Fajr: document.getElementById("fajr"),
  Sunrise: document.getElementById("sunrise"),
  Dhuhr: document.getElementById("dhuhr"),
  Asr: document.getElementById("asr"),
  Maghrib: document.getElementById("maghrib"),
  Isha: document.getElementById("isha"),
};

const cityElement = document.getElementById("city");
const nextPrayerElement = document.getElementById("nextPrayer");
const countdownElement = document.getElementById("countdown");

function formatTime(time24) {
  const [h, m] = time24.split(":");
  let hour = parseInt(h);
  const ampm = hour >= 12 ? "م" : "ص";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${m} ${ampm}`;
}

async function loadPrayerTimes(lat, lon) {
  try {
    const response = await fetch(
      `${API_BASE}?latitude=${lat}&longitude=${lon}&method=5`
    );

    const data = await response.json();

    const timings = data.data.timings;

    prayerElements.Fajr.textContent = formatTime(timings.Fajr);
    prayerElements.Sunrise.textContent = formatTime(timings.Sunrise);
    prayerElements.Dhuhr.textContent = formatTime(timings.Dhuhr);
    prayerElements.Asr.textContent = formatTime(timings.Asr);
    prayerElements.Maghrib.textContent = formatTime(timings.Maghrib);
    prayerElements.Isha.textContent = formatTime(timings.Isha);

    cityElement.textContent =
      data.data.meta.timezone.replace("_", " ");

    updateNextPrayer(timings);

  } catch (e) {
    console.log(e);
  }
}

function updateNextPrayer(timings) {
  const prayers = [
    ["الفجر", timings.Fajr],
    ["الظهر", timings.Dhuhr],
    ["العصر", timings.Asr],
    ["المغرب", timings.Maghrib],
    ["العشاء", timings.Isha],
  ];

  const now = new Date();

  let next = null;

  for (let p of prayers) {
    const [h, m] = p[1].split(":");

    const d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    d.setSeconds(0);

    if (d > now) {
      next = {
        name: p[0],
        time: d,
      };
      break;
    }
  }

  if (!next) {
    const [h, m] = prayers[0][1].split(":");
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(h);
    d.setMinutes(m);
    next = {
      name: prayers[0][0],
      time: d,
    };
  }

  nextPrayerElement.textContent = next.name;

  function tick() {
    const now = new Date();

    const diff = next.time - now;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    countdownElement.textContent =
      `${h} ساعة ${m} دقيقة ${s} ثانية`;
  }

  tick();

  setInterval(tick, 1000);
}

navigator.geolocation.getCurrentPosition(
  (pos) => {
    loadPrayerTimes(
      pos.coords.latitude,
      pos.coords.longitude
    );
  },
  () => {
    alert("يرجى السماح بالوصول إلى الموقع.");
  }
);
