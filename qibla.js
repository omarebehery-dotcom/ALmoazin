let currentRotation = 0;
let qiblaAngle = 135; // زاوية افتراضية (لمصر مثلاً) لحد ما الـ GPS يشتغل

// 1. تشغيل البوصلة فوراً بناءً على الحساس ومن غير ما تستنى الـ GPS
window.addEventListener('deviceorientation', event => {
    const compassHeading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
    const targetRotation = qiblaAngle - compassHeading;
    
    // التنعيم الهادي
    currentRotation += (targetRotation - currentRotation) * 0.1;
    
    const needleElement = document.querySelector('.needle');
    if (needleElement) {
        needleElement.style.transform = `rotate(${currentRotation}deg)`;
    }
});

// 2. تحديث الزاوية بدقة أول ما الـ GPS يلقط الموقع
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // حساب الزاوية الحقيقية لموقعك بالملّي
        qiblaAngle = calculateQibla(userLat, userLng);
    }, error => {
        console.log("الـ GPS غير مفعّل، شغال على الزاوية الافتراضية");
    });
}

// دالة الحساب الرياضية
function calculateQibla(lat, lng) {
    const makkahLat = 21.4225 * Math.PI / 180;
    const makkahLng = 39.8262 * Math.PI / 180;
    const myLat = lat * Math.PI / 180;
    const myLng = lng * Math.PI / 180;

    const y = Math.sin(makkahLng - myLng);
    const x = Math.cos(myLat) * Math.tan(makkahLat) - Math.sin(myLat) * Math.cos(makkahLng - myLng);
    
    let qibla = Math.atan2(y, x) * 180 / Math.PI;
    return (qibla + 360) % 360;
}
