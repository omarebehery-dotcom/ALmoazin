let currentRotation = 0;
let targetRotation = 0;
let qiblaAngle = 135; // زاوية افتراضية
let compassStarted = false; // للتأكد إن البوصلة مشتغلتش مرتين

// 1. دالة التنعيم وحركة السهم
function animateCompass() {
    if (isNaN(currentRotation)) currentRotation = 0;
    if (isNaN(targetRotation)) targetRotation = 0;

    currentRotation += (targetRotation - currentRotation) * 0.1;
    
    const needleElement = document.querySelector('.needle');
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

// 3. دالة تفعيل البوصلة عند اللمس
function startCompass() {
    if (compassStarted) return; // لو شغالة فعلاً متشتغلش تاني
    
    // تشغيل الأنميشن فوراً
    animateCompass();

    // طلب إذن البوصلة (مهم جداً للآيفون والأجهزة الحديثة)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    compassStarted = true;
                } else {
                    alert("يجب السماح بالوصول للحساس لتشغيل البوصلة");
                }
            })
            .catch(console.error);
    } else {
        // للأندرويد وباقي الأجهزة
        if ('ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        } else if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', handleOrientation, true);
        }
        compassStarted = true;
    }

http://googleusercontent.com/map_location_reference/1
    // تفعيل الـ GPS بدقة لموقعك وتحديث اتجاه [الكعبة](http://googleusercontent.com/map_location_reference/0) الشريفة بالملّي
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

// 4. ربط اللمس بالبوصلة
// بنخلي الكود يستمع لأي لمسة على البوصلة أو الشاشة لتفعيل الحركة
document.addEventListener('DOMContentLoaded', () => {
    const compassContainer = document.querySelector('.compass') || document.querySelector('.needle');
    if (compassContainer) {
        // لو لمس البوصلة تشتغل فوراً
        compassContainer.addEventListener('click', startCompass);
        compassContainer.addEventListener('touchstart', startCompass);
    } else {
        // لو ملقاش البوصلة، خلي اللمس في أي مكان في الشاشة يشغلها كأمان
        document.body.addEventListener('click', startCompass);
    }
});

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
