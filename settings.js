// ==========================
// Prayer Pro - Settings
// ==========================

const settingsBtn = document.getElementById("settingsBtn");

// إنشاء نافذة الإعدادات
const settings = document.createElement("div");
settings.id = "settingsMenu";

// تنسيق القائمة
settings.style.position = "fixed";
settings.style.top = "0";
settings.style.right = "-350px";
settings.style.width = "320px";
settings.style.height = "100%";
settings.style.background = "#0f6b50";
settings.style.transition = "right .3s ease";
settings.style.zIndex = "99999";
settings.style.overflowY = "auto";
settings.style.boxShadow = "-5px 0 20px rgba(0,0,0,.4)";

settings.innerHTML = `
<div class="settings-content">

<h2>⚙️ الإعدادات</h2>

<button class="setting-btn" onclick="toggleDarkMode()">
🌙 الوضع الليلي
</button>

<button class="setting-btn" onclick="toggleNotifications()">
🔔 إشعارات الصلاة
</button>

<button class="setting-btn" onclick="toggleAdhan()">
🔊 صوت الأذان
</button>

<button class="setting-btn" onclick="changeLanguage()">
🌍 اللغة
</button>

<button class="setting-btn" onclick="toggle24Hour()">
🕒 نظام 12 / 24 ساعة
</button>

<button class="setting-btn" onclick="refreshLocation()">
📍 تحديث الموقع
</button>

<button class="setting-btn" onclick="changeTheme()">
🎨 تغيير لون التطبيق
</button>

<button class="setting-btn" onclick="aboutApp()">
ℹ️ حول التطبيق
</button>

<button class="close-btn" onclick="closeSettings()">
❌ إغلاق
</button>

</div>
`;

document.body.appendChild(settings);

// فتح الإعدادات
settingsBtn.addEventListener("click", () => {
    settings.style.right = "0";
});

// غلق الإعدادات
function closeSettings() {
    settings.style.right = "-350px";
}

// ==========================
// الوضع الليلي
// ==========================

function toggleDarkMode() {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
}

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

// ==========================
// إشعارات الصلاة
// ==========================

function toggleNotifications() {
    alert("سيتم إضافة إشعارات الصلاة قريبًا.");
}

// ==========================
// صوت الأذان
// ==========================

function toggleAdhan() {
    alert("سيتم إضافة تشغيل وإيقاف صوت الأذان قريبًا.");
}

// ==========================
// اللغة
// ==========================

function changeLanguage() {
    alert("سيتم إضافة اللغة العربية والإنجليزية قريبًا.");
}

// ==========================
// نظام الوقت
// ==========================

function toggle24Hour() {
    alert("سيتم إضافة نظام 12 و24 ساعة قريبًا.");
}

// ==========================
// تحديث الموقع
// ==========================

function refreshLocation() {
    location.reload();
}

// ==========================
// تغيير اللون
// ==========================

function changeTheme() {
    alert("سيتم إضافة عدة ألوان للتطبيق قريبًا.");
}

// ==========================
// حول التطبيق
// ==========================

function aboutApp() {
    alert(`Prayer Pro

الإصدار 1.0

تم التطوير بواسطة

Omar Beheiry`);
}
