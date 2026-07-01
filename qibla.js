async function loadQibla() {
  const res = await fetch("https://api.aladhan.com/v1/qibla/30.0444/31.2357");
  const data = await res.json();

  document.getElementById("qibla").textContent =
    "اتجاه القبلة: " + Math.round(data.data.direction) + "°";
}

loadQibla();
