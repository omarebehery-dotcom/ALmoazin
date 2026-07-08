// ==========================
// Prayer Pro - Quran
// ==========================

const quranModal = document.getElementById("quranModal");
const surahList = document.getElementById("surahList");

// فتح القرآن
function openQuran() {
    quranModal.style.display = "flex";
    loadSurahs();
}

// غلق القرآن
function closeQuran() {
    quranModal.style.display = "none";
}

// تحميل قائمة السور
function loadSurahs() {

    let html = "";

    for (let i = 1; i <= 114; i++) {

        html += `
        <div class="surah-item" onclick="openSurah(${i})">
            <span>${i}</span>
            <strong>سورة ${i}</strong>
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
