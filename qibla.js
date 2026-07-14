let currentRotation = 0;
let targetRotation = 0;
let qiblaAngle = 135; // زاوية افتراضية لحد ما الـ GPS يشتغل
let compassStarted = false;

// 1. دالة التنعيم المستمر وثبات السهم وتغيير اللون
function animateCompass() {
    let diff = targetRotation - currentRotation;
    
    // حل مشكلة الـ 360 درجة لعدم حدوث قفزات مفاجئة
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    // حركة ناعمة جداً وثابتة (0.04)
    currentRotation += diff * 0.04;

    if (isNaN(currentRotation)) currentRotation = 0;

    const needleElement = document.getElementById('needle');
    
    if (needleElement) {
        // بنحرك السهم بالدوران فقط
        needleElement.style.transform = `rotate(${currentRotation}deg)`;
        
        // حساب الزاوية الفعلية الحالية بين السهم والصفر (القبلة)
        let normalizedAngle = Math.abs((currentRotation % 360 + 360) % 360);
        if (normalizedAngle > 180) {
            normalizedAngle = 360 - normalizedAngle;
        }
        
        // لو السهم على القبلة بالظبط (بين 0 و 5 درجات) يقلب أخضر، غير كده يرجع أحمر
        if (normalizedAngle <= 5) {
            needleElement.style.background = 'linear-gradient(to top, #00aa44, #00ff95)'; // أخضر مضيء ومميز
        } else {
            needleElement.style.background = 'linear-gradient(to top, #ff0000, #ff5555)'; // أحمر
        }
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

// 3. دالة تفعيل البوصلة باللمس
function startCompass() {
    if (compassStarted) return;
    
    animateCompass();

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    compassStarted = true;
                } else {
                    alert("يا بطل وافق على إذن الحركة لتشغيل البوصلة");
                }
            })
            .catch(console.error);
    } else {
        if ('ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        } else if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', handleOrientation, true);
        }
        compassStarted = true;
    }

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

// 4. ربط اللمس بالبوصلة والشاشة
document.addEventListener('DOMContentLoaded', () => {
    const compassContainer = document.querySelector('.compass');
    
    if (compassContainer) {
        compassContainer.addEventListener('click', startCompass);
        compassContainer.addEventListener('touchstart', startCompass);
    }
    
    document.body.addEventListener('click', startCompass);
    document.body.addEventListener('touchstart', startCompass);
});

// دالة حساب القبلة
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
