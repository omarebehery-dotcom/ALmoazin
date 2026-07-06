// ==========================
// Prayer Pro - Qibla Compass
// ==========================

const needle = document.getElementById("needle");
const qiblaDirection = document.getElementById("qiblaDirection");

// إحداثيات الكعبة
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

// حساب اتجاه القبلة
function calculateQibla(lat, lon) {

    const φK = KAABA_LAT * Math.PI / 180;
    const λK = KAABA_LON * Math.PI / 180;

    const φ = lat * Math.PI / 180;
    const λ = lon * Math.PI / 180;

    const y = Math.sin(λK - λ);

    const x =
        Math.cos(φ) * Math.tan(φK) -
        Math.sin(φ) * Math.cos(λK - λ);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;

    bearing = (bearing + 360) % 360;

    return bearing;
}

// تشغيل البوصلة
function startCompass(lat, lon) {

    const qibla = calculateQibla(lat, lon);

    qiblaDirection.textContent =
        "اتجاه القبلة";

    if (window.DeviceOrientationEvent) {

        window.addEventListener(
            "deviceorientation",
            function (event) {

                const heading =
                    event.webkitCompassHeading ??
                    (360 - event.alpha);

                if (heading == null) return;

                const angle =
                    qibla - heading;

                needle.style.transform =
                    `translate(-50%, -100%) rotate(${angle}deg)`;

            },
            true
        );

    } else {

        qiblaDirection.textContent =
            "البوصلة غير مدعومة";

    }

}

// الحصول على الموقع
navigator.geolocation.getCurrentPosition(

    (position) => {

        startCompass(

            position.coords.latitude,

            position.coords.longitude

        );

    },

    () => {

        qiblaDirection.textContent =
            "تعذر تحديد الموقع";

    }

);
