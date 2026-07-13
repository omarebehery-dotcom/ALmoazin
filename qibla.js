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

    return (bearing + 360) % 360;
}

// تشغيل البوصلة
function startCompass(lat, lon) {

    const qibla = calculateQibla(lat, lon);

    qiblaDirection.textContent = "🕋 اتجاه القبلة";

    function startOrientation() {

        window.addEventListener(
            "deviceorientation",
            function (event) {

                let heading;

                // أجهزة iPhone
                if (event.webkitCompassHeading !== undefined) {
                    heading = event.webkitCompassHeading;
                }
                // أجهزة Android
                else if (event.alpha !== null) {
                    heading = 360 - event.alpha;
                } else {
                    return;
                }

                let angle = (qibla - heading + 360) % 360;

                needle.style.transform =
                    `translate(-50%, -100%) rotate(${angle}deg)`;

            },
            true
        );
    }

    // دعم iPhone
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        document.body.addEventListener(
            "click",
            function () {

                DeviceOrientationEvent.requestPermission()
                    .then((response) => {

                        if (response === "granted") {
                            startOrientation();
                        }

                    })
                    .catch(console.error);

            },
            { once: true }
        );

        qiblaDirection.textContent =
            "اضغط أي مكان على الشاشة لتشغيل البوصلة";

    } else {

        startOrientation();

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
