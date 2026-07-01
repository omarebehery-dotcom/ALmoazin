async function loadPrayers() {
  const times = await getPrayerTimes();

  document.getElementById("fajr").textContent = times.Fajr;
  document.getElementById("dhuhr").textContent = times.Dhuhr;
  document.getElementById("asr").textContent = times.Asr;
  document.getElementById("maghrib").textContent = times.Maghrib;
  document.getElementById("isha").textContent = times.Isha;
}

loadPrayers();
