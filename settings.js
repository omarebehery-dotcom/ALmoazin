// ==========================
// Prayer Pro - Settings
// ==========================

const settingsBtn = document.getElementById("settingsBtn");

// إنشاء نافذة الإعدادات
const settings = document.createElement("div");
settings.id = "settingsMenu";

// تنسيق القائمة الجانبية بالكامل بألوان متناسقة ومريحة
settings.style.position = "fixed";
settings.style.top = "0";
settings.style.right = "-360px"; // مخفية خارج الشاشة يميناً
settings.style.width = "340px";
settings.style.height = "100%";
settings.style.background = "#0b7a57"; // اللون الأخضر الأساسي للتطبيق
settings.style.transition = "right .3s ease-in-out";
settings.style.zIndex = "99999";
settings.style.overflowY = "auto";
settings.style.boxShadow = "-5px 0 25px rgba(0,0,0,.4)";
settings.style.padding = "20px";
settings.style.boxSizing = "border-box";
settings.style.direction = "rtl"; // اتجاه عربي سليم

// حقن محتوى القائمة مع تنسيق الأزرار ككروت كاملة العرض وبنفس الحجم والترتيب
settings.innerHTML = `
<div class="settings-container" style="display: flex; flex-direction: column; gap: 15px; height: 100%;">

    <h2 style="color: #ffffff; text-align: center; margin-top: 10px; margin-bottom: 20px; font-family: 'Cairo', sans-serif; font-weight: 800; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 15px;">⚙️ الإعدادات</h2>

    <div class="settings-list" style="display: flex; flex-direction: column; gap: 12px; flex-grow: 1;">
        
        <button class="setting-btn" onclick="toggleDarkMode()">
            <span style="font-weight: 700; font-family: 'Cairo', sans-serif;">الوضع الليلي</span>
            <span>🌙</span>
        </button>

        <button class="setting-btn" onclick="toggleNotifications()">
            <span style="font-weight: 700; font-family: 'Cairo', sans-serif;">إشعارات الصلاة</span>
            <span>🔔</span>
        </button>

        <button class="setting-btn" onclick="toggleAdhan()">
            <span style="font-weight: 700; font-family: 'Cairo', sans-serif;">صوت الأذان</span>
            <span>🔊</span>
        </button>

        <button class="setting-btn" onclick="changeLanguage()">
            <span style="font-weight: 700; font-family: 'Cairo', sans-serif;">اللغة</span>
            <span>🌍</span>
        </button>

        <button class="setting-btn" onclick="toggle24Hour()">
            <span style="font-weight: 700; font-family: 'Cairo', sans-serif;">نظام 12 / 24 ساعة</span>
            <span>🕒</span>
        </button>

        <button class="setting-btn" onclick="refreshLocation()">
            <span style="font-weight: 700; font-family: 'Cairo', sans-serif;">تحديث الموقع</span>
            <span>📍</span>
        </button>

        <button class="setting-btn" onclick="changeTheme()">
            <span style="font-weight: 700; font-family: 'Cairo', sans-serif;">تغيير لون التطبيق</span>
            <span>🎨</span>
        </button>

        <button class="setting-btn" onclick="aboutApp()">
            <span style="font-weight: 700; font-family: 'Cairo', sans-serif;">حول التطبيق</span>
            <span>ℹ️</span>
        </button>

    </div>

    <!-- زر إغلاق أحمر فخم بالأسفل -->
    <button class="close-btn" onclick="closeSettings()" style="width: 100%; padding: 15px; background: #e74c3c; color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; font-family: 'Cairo', sans-serif; cursor: pointer; transition: 0.3s; margin-top: auto; display: flex; justify-content: center; align-items: center; gap: 8px;">
        <span>إغلاق ❌</span>
    </button>

</div>
`;

document.body.appendChild(settings);

// إضافة ستايل إضافي ديناميكي للأزرار عشان تظهر بشكل كروت متناسقة وتتفاعل عند اللمس
const style = document.createElement('style');
style.textContent = `
    .setting-btn {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100% !important;
        padding: 14px 18px !important;
        background: rgba(255, 255, 255, 0.15) !important; /* خلفية بيضاء شفافة وفخمة فوق الأخضر */
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        font-size: 15px !important;
        cursor: pointer !important;
        transition: all 0.25s ease !important;
        box-sizing: border-box !important;
    }
    .setting-btn:hover, .setting-btn:active {
        background: rgba(255, 255, 255, 0.25) !important;
        transform: scale(0.98);
    }
    .close-btn:hover, .close-btn:active {
        background: #c0392b !important;
    }
`;
document.head.appendChild(style);

// فتح الإعدادات
settingsBtn.addEventListener("click", () => {
    settings.style.right = "0";
});

// غلق الإعدادات
function closeSettings() {
    settings.style.right = "-360px";
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
