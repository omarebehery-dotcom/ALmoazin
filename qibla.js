let currentRotation = 0;
let targetRotation = 0;
let qiblaAngle = 135; // زاوية افتراضية لحد ما الـ GPS يشتغل
let compassStarted = false;

// 1. دالة التنعيم المستمر وحركة السهم
function animateCompass() {
    if (isNaN(currentRotation)) currentRotation = 0;
    if (isNaN(targetRotation)) targetRotation = 0;

    currentRotation += (targetRotation - currentRotation) * 0.1;
    
    // هنا بنمسك السهم بالـ ID المظبوط اللي في الـ HTML بتاعك (#needle)
    const needleElement = document.getElementById('needle');
    
    if (needleElement) {
        needleElement.style.transform = `rotate(${currentRotation}deg)`;
    }
    
    requestAnimationFrame(animateCompass);
}

// 2. دالة استقبال حركة الموبايل
function handleOrientation(event) {
    let heading = null;

    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        heading = event.webkitCompassHeading;
    } else if (event.alpha !== undefined && event.alpha !== null) {
        heading = 360 - event.alpha;
    }

    if (heading !== null && !isNaN(heading)) {
        targetRotation = qiblaAngle - heading;
    }
}

// 3. دالة تشغيل البوصلة فور لمسها
function startCompass() {
    if (compassStarted) return; // لو اشتغلت خلاص متشتغلش تاني
    
    animateCompass(); // ابدأ حركة السهم الناعمة

    // طلب الإذن للآيفون والأجهزة الحديثة
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    compassStarted = true;
                } else {
                    alert("يا بطل وافق على إذن الحركة عشان السهم يلف معاك");
                }
            })
            .catch(console.error);
    } else {
        // للأندرويد والأجهزة التانية
        if ('ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        } else if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', handleOrientation, true);
        }
        compassStarted = true;
    }

    // تفعيل الـ GPS بدقة لموقعك وتحديث مكان القبلة
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            if (!isNaN(userLat) && !isNaN(userLng)) {
                const calculated = calculateQibla(userLat, userLng);
                if (!isNaN(calculated)) {
                    qiblaAngle = calculated;
                }
            }
        });
    }
}

// 4. ربط اللمس بالبوصلة والسهم والشاشة
document.addEventListener('DOMContentLoaded', () => {
    // بنمسك ديف البوصلة الكبير اللي عندك في الـ HTML
    const compassContainer = document.querySelector('.compass');
    
    if (compassContainer) {
        compassContainer.addEventListener('click', startCompass);
        compassContainer.addEventListener('touchstart', startCompass);
    }
    
    // أمان إضافي: لو لمس الشاشة في أي مكان تشتغل البوصلة برضه
    document.body.addEventListener('click', startCompass);
    document.body.addEventListener('touchstart', startCompass);
});

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
