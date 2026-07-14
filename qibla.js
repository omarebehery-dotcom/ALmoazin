let currentRotation = 0;
let targetRotation = 0;
let qiblaAngle = 135; // زاوية افتراضية لحد ما الـ GPS يشتغل

// 1. تشغيل الحساس وحساب الاتجاه بحماية كاملة ضد التهنيج
window.addEventListener('deviceorientation', event => {
    let compassHeading = null;

    // التأكد إن الجهاز بيبعت بيانات حقيقية ومظبوطة
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        compassHeading = event.webkitCompassHeading;
    } else if (event.alpha !== undefined && event.alpha !== null) {
        compassHeading = 360 - event.alpha;
    }

    // لو القراءة سليمة ومفيش فيها أي خطأ، بنحدث الزاوية فوراً
    if (compassHeading !== null && !isNaN(compassHeading)) {
        targetRotation = qiblaAngle - compassHeading;
    }
}, true);

// 2. دالة التنعيم المستمر (مستحيل تقف)
function animateCompass() {
    // التأكد إن الأرقام سليمة قبل تحريك السهم
    if (!isNaN(targetRotation) && !isNaN(currentRotation)) {
        currentRotation += (targetRotation - currentRotation) * 0.1;
        
        const needleElement = document.querySelector('.needle');
        if (needleElement) {
            needleElement.style.transform = `rotate(${currentRotation}deg)`;
        }
    }
    
    // يفضل يحدث الحركة بنعومة بدون توقف
    requestAnimationFrame(animateCompass);
}

// تشغيل الأنميشن فوراً
animateCompass();

// 3. تحديث القبلة بالـ GPS أول ما يلقط موقعك
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        qiblaAngle = calculateQibla(userLat, userLng);
    }, error => {
        console.log("الـ GPS مش مفعّل، شغالين على الزاوية الافتراضية");
    });
}

// دالة حساب القبلة الرياضية الصحيحة
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
