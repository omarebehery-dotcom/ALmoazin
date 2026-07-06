// ==========================
// Prayer Pro - Settings
// ==========================

const settingsBtn = document.getElementById("settingsBtn");

// إنشاء نافذة الإعدادات
const settings = document.createElement("div");
settings.id = "settingsMenu";

settings.innerHTML = `
<div class="settings-content">

<h2>⚙️ الإعدادات</h2>

<button class="setting-btn" onclick="toggleDarkMode()">
🌙 الوضع الليلي
</button>

<button class="setting-btn" onclick="changeLanguage()">
🌍 اللغة
</button>

<button class="setting-btn" onclick="toggle24Hour()">
🕒 نظام الوقت
</button>

<button class="setting-btn" onclick="refreshLocation()">
📍 تحديث الموقع
</button>

<button class="setting-btn" onclick="aboutApp()">
ℹ️ حول التطبيق
</button>

<button class="close-btn" onclick="closeSettings()">
إغلاق
</button>

</div>
`;

document.body.appendChild(settings);

// فتح الإعدادات
settingsBtn.onclick = () => {
    settings.style.right = "0";
};

// غلق الإعدادات
function closeSettings() {
    settings.style.right = "-350px";
}

// الوضع الليلي
function toggleDarkMode() {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );

}

// تحميل الوضع الليلي
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

// تغيير اللغة
function changeLanguage() {

    alert("سيتم إضافة العربية والإنجليزية قريبًا.");

}

// نظام الوقت
function toggle24Hour() {

    alert("سيتم إضافة نظام 12 / 24 ساعة قريبًا.");

}

// تحديث الموقع
function refreshLocation() {

    location.reload();

}

// حول التطبيق
function aboutApp() {

    alert(
`Prayer Pro

الإصدار 1.0

تم التطوير بواسطة Omar`
    );

}
