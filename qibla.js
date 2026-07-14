let currentRotation = 0;
let targetRotation = 0;
let qiblaAngle = 135; 
let compassStarted = false;

// دالة التنعيم المستمر (السر في الـ 0.04 دي هتخلي الحركة هادية جداً)
function animateCompass() {
    // حساب الفرق بين الزاوية الحالية والمستهدفة بأقصر طريق
    let diff = targetRotation - currentRotation;
    
    // حل مشكلة الـ 360 درجة (عشان السهم ميتجننش عند نقطة الصفر)
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    // 0.04 هي سرعة الاستجابة (كل ما قلت، كل ما زاد الثبات)
    currentRotation += diff * 0.04; 

    const needleElement = document.getElementById('needle');
    if (needleElement) {
        needleElement.style.transform = `rotate(${currentRotation}deg)`;
    }
    
    requestAnimationFrame(animateCompass);
}

// دالة استقبال الحركة
function handleOrientation(event) {
    let heading = null;

    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        heading = event.webkitCompassHeading;
    } else if (event.alpha !== undefined && event.alpha !== null) {
        // حساب الاتجاه للأندرويد
        heading = 360 - event.alpha;
    }

    if (heading !== null) {
        // الزاوية المستهدفة
        targetRotation = qiblaAngle - heading;
    }
}

// باقي كود التشغيل (نفس اللي فات)
function startCompass() {
    if (compassStarted) return;
    animateCompass();

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation, true);
                compassStarted = true;
            }
        });
    } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
        compassStarted = true;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            qiblaAngle = calculateQibla(position.coords.latitude, position.coords.longitude);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', startCompass, { once: true });
    document.body.addEventListener('touchstart', startCompass, { once: true });
});

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
