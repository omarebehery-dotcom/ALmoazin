async function getPrayerTimes() {
  const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=EG");
  const data = await res.json();
  return data.data.timings;
}
