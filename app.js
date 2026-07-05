// =========================
// Prayer Pro - app.js
// =========================

// عناصر الصفحة
const dayName = document.getElementById("dayName");
const gregorianDate = document.getElementById("gregorianDate");
const cityName = document.getElementById("cityName");
const countdown = document.getElementById("countdown");

// أسماء الأيام
const days = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت"
];

// عرض التاريخ
function updateDate() {

    const now = new Date();

    dayName.textContent = days[now.getDay()];

    gregorianDate.textContent =
        now.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

}

updateDate();


// الساعة
function updateClock() {

    const now = new Date();

    countdown.textContent =
        now.toLocaleTimeString("ar-EG");

}

setInterval(updateClock, 1000);

updateClock();


// الموقع
function getLocation() {

    if (!navigator.geolocation) {

        cityName.textContent = "جهازك لا يدعم GPS";

        return;
    }

    navigator.geolocation.getCurrentPosition(

        success,

        error

    );

}

function success(position) {

    const lat = position.coords.latitude.toFixed(5);
    const lon = position.coords.longitude.toFixed(5);

    cityName.textContent =
        `📍 ${lat} , ${lon}`;

}

function error() {

    cityName.textContent =
        "❌ تم رفض الوصول للموقع";

}

getLocation();


// أماكن مواقيت الصلاة (مؤقتًا)
document.getElementById("fajr").textContent = "--:--";
document.getElementById("sunrise").textContent = "--:--";
document.getElementById("dhuhr").textContent = "--:--";
document.getElementById("asr").textContent = "--:--";
document.getElementById("maghrib").textContent = "--:--";
document.getElementById("isha").textContent = "--:--";

document.getElementById("nextPrayer").textContent =
    "جارِ تحميل المواقيت...";
