// ==========================
// Prayer Pro - Quran
// ==========================

const quranModal = document.getElementById("quranModal");
const surahList = document.getElementById("surahList");

// فتح نافذة القرآن
function openQuran() {
    quranModal.style.display = "flex";
    loadSurahs();
}

// غلق النافذة
function closeQuran() {
    quranModal.style.display = "none";
}

// تحميل جميع السور
async function loadSurahs() {

    surahList.innerHTML = "<h3 style='text-align:center'>جاري تحميل السور...</h3>";

    try {

        const res = await fetch("https://api.alquran.cloud/v1/surah");

        const data = await res.json();

        surahList.innerHTML = "";

        data.data.forEach((surah) => {

            const div = document.createElement("div");

            div.className = "surah-item";

            div.innerHTML = `
                <span>${surah.number}</span>
                <strong>${surah.name}</strong>
                <small>${surah.numberOfAyahs} آية</small>
            `;

            div.onclick = () => openSurah(surah.number);

            surahList.appendChild(div);

        });

    } catch (e) {

        surahList.innerHTML =
        "<h3 style='text-align:center'>❌ تعذر تحميل السور</h3>";

    }

}

// فتح سورة
async function openSurah(number) {

    surahList.innerHTML =
    "<h3 style='text-align:center'>جاري تحميل السورة...</h3>";

    try {

        const res = await fetch(
            `https://api.alquran.cloud/v1/surah/${number}`
        );

        const data = await res.json();

        let html = `
        <button class="back-btn" onclick="loadSurahs()">
        ⬅ رجوع
        </button>

        <h2 style="text-align:center">
        ${data.data.name}
        </h2>
        `;

        data.data.ayahs.forEach((ayah) => {

            html += `
            <div class="ayah">

                ${ayah.text}

                <span class="ayah-number">
                ﴿${ayah.numberInSurah}﴾
                </span>

            </div>
            `;

        });

        surahList.innerHTML = html;

    } catch (e) {

        surahList.innerHTML =
        "<h3 style='text-align:center'>❌ حدث خطأ</h3>";

    }

}
