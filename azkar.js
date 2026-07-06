// ==========================
// Prayer Pro - Azkar Menu
// ==========================

const menuBtn = document.getElementById("menuBtn");

// إنشاء القائمة
const menu = document.createElement("div");
menu.id = "azkarMenu";

menu.innerHTML = `
<div class="menu-content">

<h2>📿 الأذكار</h2>

<button class="azkar-btn" onclick="showAzkar('أذكار الصباح')">🌅 أذكار الصباح</button>

<button class="azkar-btn" onclick="showAzkar('أذكار المساء')">🌙 أذكار المساء</button>

<button class="azkar-btn" onclick="showAzkar('أذكار النوم')">😴 أذكار النوم</button>

<button class="azkar-btn" onclick="showAzkar('أذكار بعد الصلاة')">🕌 أذكار بعد الصلاة</button>

<button class="close-btn" onclick="closeMenu()">إغلاق</button>

</div>
`;

document.body.appendChild(menu);

// فتح القائمة
menuBtn.onclick = () => {
    menu.style.right = "0";
};

// غلق القائمة
function closeMenu() {
    menu.style.right = "-350px";
}

// عرض الأذكار
function showAzkar(type) {

    closeMenu();

    const list = azkarData[type];

    let html = `<h2 style="text-align:center">${type}</h2>`;

    list.forEach((z, i) => {

        html += `
        <div style="
        background:#ffffff;
        margin:15px;
        padding:20px;
        border-radius:15px;
        color:#222;
        font-size:20px;
        line-height:2;
        ">
        <b>${i + 1}</b><br><br>
        ${z}
        </div>
        `;

    });

    document.body.innerHTML = `
    <div style="
    background:#0d8a63;
    min-height:100vh;
    padding:20px;
    ">

    <button onclick="location.reload()" style="
    width:100%;
    height:55px;
    border:none;
    border-radius:12px;
    font-size:20px;
    margin-bottom:20px;
    cursor:pointer;
    ">
    ⬅ الرجوع
    </button>

    ${html}

    </div>
    `;
}
