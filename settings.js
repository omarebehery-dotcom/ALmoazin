// فتح الإعدادات
function openSettings() {
    document.getElementById("settingsModal").style.display = "flex";
}

// غلق الإعدادات
function closeSettings() {
    document.getElementById("settingsModal").style.display = "none";
}

// باقي وظائف الإعدادات (بدون الـ appendChild)
function toggleDarkMode() { document.body.classList.toggle("dark"); }
function toggleNotifications() { alert("سيتم إضافة إشعارات الصلاة."); }
function changeAthanSound() { alert("سيتم إضافة أصوات الأذان."); }
function changeLanguage() { alert("سيتم إضافة اللغات."); }
function toggleTimeFormat() { alert("سيتم إضافة نظام الوقت."); }
function updateLocation() { location.reload(); }
function changeAppColor() { alert("سيتم إضافة الألوان."); }
function aboutApp() { alert("Prayer Pro v1.0"); }
