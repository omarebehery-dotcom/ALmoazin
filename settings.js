const settingsBtn = document.getElementById("settingsBtn");

const settings = document.createElement("div");
settings.id = "settingsMenu";

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
<div class="settings-content" style="padding:20px;">
<h2 style="color:white; text-align:center; margin-bottom:25px;">⚙️ الإعدادات</h2>
<button class="azkar-btn" onclick="toggleDarkMode()">🌙 الوضع الليلي</button>
<button class="azkar-btn" onclick="toggleNotifications()">🔔 إشعارات الصلاة</button>
<button class="azkar-btn" onclick="toggleAdhan()">🔊 صوت الأذان</button>
<button class="azkar-btn" onclick="changeLanguage()">🌍 اللغة</button>
<button class="azkar-btn" onclick="toggle24Hour()">🕒 نظام 12 / 24 ساعة</button>
<button class="azkar-btn" onclick="refreshLocation()">📍 تحديث الموقع</button>
<button class="azkar-btn" onclick="changeTheme()">🎨 تغيير لون التطبيق</button>
<button class="azkar-btn" onclick="aboutApp()">ℹ️ حول التطبيق</button>
<button class="close-btn" onclick="closeSettings()">❌ إغلاق</button>
</div>
`;

document.body.appendChild(settings);

settingsBtn.addEventListener("click", () => {
    document.body.classList.add("settings-open");
    settings.style.right = "0";
});

function closeSettings() {
    document.body.classList.remove("settings-open");
    settings.style.right = "-350px";
}

function toggleDarkMode() { document.body.classList.toggle("dark"); localStorage.setItem("darkMode", document.body.classList.contains("dark")); }
if (localStorage.getItem("darkMode") === "true") { document.body.classList.add("dark"); }

function toggleNotifications() { alert("سيتم إضافة إشعارات الصلاة قريبًا."); }
function toggleAdhan() { alert("سيتم إضافة تشغيل وإيقاف صوت الأذان قريبًا."); }
function changeLanguage() { alert("سيتم إضافة اللغة العربية والإنجليزية قريبًا."); }
function toggle24Hour() { alert("سيتم إضافة نظام 12 و24 ساعة قريبًا."); }
function refreshLocation() { location.reload(); }
function changeTheme() { alert("سيتم إضافة عدة ألوان للتطبيق قريبًا."); }
function aboutApp() { alert("Prayer Pro\nالإصدار 1.0\nتم التطوير بواسطة\nOmar Beheiry"); }
