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
        // بنجيب الاسم المظبوط من المصفوفة (بنطرح 1 لأن المصفوفة بتبدأ من الصفر 0)
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

// فتح سورة
async function openSurah(number) {
    try {
        const response = await fetch(`surah/surah_${number}.json`);
        const surah = await response.json();

        let html = `
        <button class="back-btn" onclick="loadSurahs()">
            ⬅ رجوع
        </button>

        <h2>${surah.name}</h2>
        `;

        surah.verses.forEach((ayah, index) => {
            html += `
            <p class="ayah">
                ${ayah.text}
                <span class="ayah-number">﴿${index + 1}﴾</span>
            </p>
            `;
        });

        surahList.innerHTML = html;

    } catch (e) {
        surahList.innerHTML = `
        <h3 style="text-align:center;color:red">
            حدث خطأ في تحميل السورة
        </h3>
        `;

        console.error(e);
    }
}
