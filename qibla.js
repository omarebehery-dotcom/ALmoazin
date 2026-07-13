let currentRotation = 0; // متغير عشان يخزن زاوية السهم الحالية ويحركها براحة

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // حساب زاوية القبلة الثابتة لموقعك
        const qiblaAngle = calculateQibla(userLat, userLng);
        
        window.addEventListener('deviceorientation', event => {
            // حساب اتجاه الموبايل
            const compassHeading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
            
            // الزاوية المستهدفة اللي السهم المفروض يروحلها
            const targetRotation = qiblaAngle - compassHeading;
            
            // معادلة التنعيم: السهم بيتحرك 10% بس في المرة فبيبان هادي جداً وبراحه
            currentRotation += (targetRotation - currentRotation) * 0.1;
            
            // تحريك السهم في التطبيق
            const needleElement = document.querySelector('.needle');
            if (needleElement) {
                needleElement.style.transform = `rotate(${currentRotation}deg)`;
            }
        });
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
