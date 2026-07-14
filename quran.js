// ==========================
// Prayer Pro - Quran
// ==========================

const quranModal = document.getElementById("quranModal");
const surahList = document.getElementById("surahList");

// مصفوفة أسماء السور الـ 114 كاملة بالترتيب الصحيح
const surahNames = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];

// فتح القرآن
function openQuran() {
    quranModal.style.display = "flex";
    loadSurahs();
}

// غلق القرآن
function closeQuran() {
    quranModal.style.display = "none";
}

// تحميل قائمة السور بالأسماء الحقيقية
function loadSurahs() {
    let html = "";

    for (let i = 1; i <= 114; i++) {
        const nameOfSurah = surahNames[i - 1]; 

        html += `
        <div class="surah-item" onclick="openSurah(${i})">
            <span>${i}</span>
            <strong>سورة ${nameOfSurah}</strong>
        </div>
        `;
    }

    surahList.innerHTML = html;
}

// فتح سورة وعرض آياتها بالتشكيل العثماني مباشرة
async function openSurah(number) {
    // رسالة تحميل خفيفة لحين جلب البيانات
    surahList.innerHTML = `<h3 style="text-align:center; color:#0b7a57; padding:20px;">جاري تحميل آيات السورة الكريمة...</h3>`;

    try {
        // جلب نص السورة بالتشكيل من سيرفر خارجي سريع
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}`);
        const data = await response.json();
        const surah = data.data;

        let html = `
        <button class="back-btn" onclick="loadSurahs()">
            ⬅ رجوع للقائمة
        </button>

        <h2 style="text-align:center; color:#0b7a57; margin-bottom:20px; background:none; padding:0; font-weight:bold;">
            ${surah.name}
        </h2>
        
        <div class="quran-reading-view" style="padding: 5px;">
        `;

        // عرض الآيات آية آية
        surah.ayahs.forEach((ayah) => {
            html += `
            <p class="ayah">
                ${ayah.text}
                <span class="ayah-number">﴿${ayah.numberInSurah}﴾</span>
            </p>
            `;
        });

        html += `</div>`;

        surahList.innerHTML = html;
        surahList.scrollTop = 0; // رفع التمرير لأعلى الصفحة

    } catch (e) {
        surahList.innerHTML = `
        <h3 style="text-align:center; color:red; padding:20px;">
            حدث خطأ في تحميل السورة. تأكد من اتصالك بالإنترنت وحاول مجدداً.
        </h3>
        <button class="back-btn" onclick="loadSurahs()">⬅ رجوع</button>
        `;
        console.error(e);
    }
}
