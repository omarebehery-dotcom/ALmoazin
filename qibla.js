let currentRotation = 0;
let targetRotation = 0;
let qiblaAngle = 135; // زاوية افتراضية لمصر لحد ما الـ GPS يشتغل

// 1. دالة التنعيم وحركة السهم (محمية 100% ضد التهنيج)
function animateCompass() {
    // لو حصل أي خطأ وبقت القيمة مش رقم، بنرجعها لـ 0 عشان متهنجش
    if (isNaN(currentRotation)) currentRotation = 0;
    if (isNaN(targetRotation)) targetRotation = 0;

    // معادلة التنعيم (السهم بيتحرك براحة وهدوء)
    currentRotation += (targetRotation - currentRotation) * 0.1;
    
    const needleElement = document.querySelector('.needle');
    if (needleElement) {
        needleElement.style.transform = `rotate(${currentRotation}deg)`;
    }
    
    requestAnimationFrame(animateCompass);
}

// تشغيل الأنميشن فوراً أول ما الصفحة تفتح
animateCompass();

// 2. دالة استقبال حركة الموبايل
function handleOrientation(event) {
    let heading = null;

    // للأيفون (iOS)
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        heading = event.webkitCompassHeading;
    } 
    // للأندرويد (Android)
    else if (event.alpha !== undefined && event.alpha !== null) {
        heading = 360 - event.alpha;
    }

    // تحديث زاوية السهم لو الأرقام سليمة
    if (heading !== null && !isNaN(heading)) {
        targetRotation = qiblaAngle - heading;
    }
}

// 3. تشغيل الحساس المناسب لجهازك (أندرويد أو آيفون)
if ('ondeviceorientationabsolute' in window) {
    // للأندرويد الحديث
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
} else if ('ondeviceorientation' in window) {
    // للأيفون وباقي الأجهزة
    window.addEventListener('deviceorientation', handleOrientation, true);
}

// 4. تحديث اتجاه القبلة بالـ GPS بدقة
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        if (!isNaN(userLat) && !isNaN(userLng)) {
            const calculated = calculateQibla(userLat, userLng);
            if (!isNaN(calculated)) {
                qiblaAngle = calculated; // تحديث الزاوية بدقة بلدك
            }
        }
    }, error => {
        console.log("الـ GPS مش مفعّل، شغالين بالزاوية الافتراضية");
    });
}

// دالة حساب القبلة الرياضية
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
