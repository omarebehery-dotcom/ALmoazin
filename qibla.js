// إحداثيات الكعبة المشرفة التقريبية
const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

let userLat, userLng;
let qiblaAngle = 0;
let isVibrating = false;

// 1. تحديد موقع المستخدم وحساب زاوية القبلة
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        
        qiblaAngle = calculateQiblaAngle(userLat, userLng);
        const dirText = document.getElementById('qiblaDirection');
        if (dirText) {
            dirText.innerText = `اتجاه القبلة: ${Math.round(qiblaAngle)}°`;
        }
    }, error => {
        console.error("خطأ في تحديد الموقع (GPS):", error);
        const dirText = document.getElementById('qiblaDirection');
        if (dirText) dirText.innerText = "يرجى تفعيل الموقع (GPS) لحساب القبلة";
    });
}

// الدالة الرياضية لحساب زاوية القبلة
function calculateQiblaAngle(lat, lng) {
    const phiK = MECCA_LAT * Math.PI / 180;
    const lambdaK = MECCA_LNG * Math.PI / 180;
    const phi = lat * Math.PI / 180;
    const lambda = lng * Math.PI / 180;

    const y = Math.sin(lambdaK - lambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
    
    let angle = Math.atan2(y, x) * 180 / Math.PI;
    return (angle + 360) % 360;
}

// 2. طلب صلاحيات المستشعر وتشغيل البوصلة عند اللمس
function initCompass() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // هواتف الآيفون (iOS)
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                } else {
                    alert('يجب السماح بالوصول للمستشعرات لتشغيل البوصلة');
                }
            }).catch(console.error);
    } else {
        // هواتف الأندرويد وباقي المتصفحات
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
    }
}

// 3. تحريك الإبرة وتشغيل الهزاز عند الاتجاه المظبوط
function handleOrientation(event) {
    // قراءة اتجاه الموصلة بشتى الطرق المتاحة في المتصفحات
    let heading = event.webkitCompassHeading || event.alpha;
    
    if (heading !== null && heading !== undefined) {
        const needle = document.getElementById('needle');
        if (!needle) return;

        // تعديل الحسابات بناء على نوع المستشعر المتاح
        if (!event.webkitCompassHeading && event.absolute === false) {
            heading = 360 - heading; 
        }

        // حساب زاوية دوران الإبرة المطلوبة للتوجه للقبلة
        let totalRotation = qiblaAngle - heading;
        totalRotation = (totalRotation + 360) % 360;

        // تحريك الإبرة بالاعتماد على الـ transform-origin المكتوب في الـ CSS بتاعك
        needle.style.transform = `translate(-50%, -100%) rotate(${totalRotation}deg)`;

        // التحقق إذا كانت الإبرة تشير للقبلة بالظبط (سماحية 4 درجات يمين أو يسار)
        if (totalRotation <= 4 || totalRotation >= 356) {
            // تشغيل الهزاز (Vibration)
            if (!isVibrating && navigator.vibrate) {
                navigator.vibrate(200); // هزة مدتها 200 مللي ثانية
                isVibrating = true; 
            }
            // تغيير لون الإبرة للأخضر كدليل بصري إضافي على صحة الاتجاه
            needle.style.background = 'linear-gradient(to top, #00ff95, #22c98d)';
        } else {
            isVibrating = false;
            // إرجاع لون الإبرة للون الأحمر الأصلي اللي في الـ CSS بتاعك
            needle.style.background = 'linear-gradient(to top, #ff0000, #ff5555)';
            if (navigator.vibrate) {
                navigator.vibrate(0); // إيقاف الهز عند الابتعاد عن القبلة
            }
        }
    }
}

// ربط تشغيل المستشعرات بلمسة المستخدم على سيكشن البوصلة بالكامل
document.querySelector('.compass-section').addEventListener('click', () => {
    initCompass();
});
