// 1. نطلب موقع الـ GPS من المستخدم أول ما يفتح أو يضغط على البوصلة
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // حساب زاوية القبلة بناءً على موقع المستخدم وموقع مكة
        const qiblaAngle = calculateQibla(userLat, userLng);
        
        // 2. نربط الزاوية بحركة الحساس (البوصلة)
        window.addEventListener('deviceorientation', event => {
            // تختلف الحسبة حسب نوع الجهاز (أندرويد أو آيفون)
            const compassHeading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
            
            // الزاوية النهائية الحساسة اللي السهم هيلف بيها
            const finalDirection = qiblaAngle - compassHeading;
            
            // هنا بتعمل Rotate لعنصر السهم في الـ CSS
            document.querySelector('.needle').style.transform = `rotate(${finalDirection}deg)`;
        });
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
