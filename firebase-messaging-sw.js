// استدعاء مكتبات فايربيس الخاصة بالـ Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// 1. ضع إعدادات الفايربيس الخاصة بمشروعك هنا (نفس الموجودة في إعدادات Firebase للويب)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة الفايربيس
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 2. هذه الدالة تعادل onMessageReceived في الأندرويد (تعمل في الخلفية)
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // استخراج البيانات بنفس طريقتك في الأندرويد
    const title = payload.data?.title || payload.notification?.title || "إشعار جديد";
    const message = payload.data?.message || payload.notification?.body || "لديك تنبيه جديد من النظام";
    const orderNumber = payload.data?.order_number || "";

    // إعداد شكل الإشعار (يعادل NotificationCompat.Builder)
    const notificationOptions = {
        body: message,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // ضع رابط أيقونة تطبيقك هنا
        data: { order_number: orderNumber }, // حفظ رقم الطلب عند الضغط على الإشعار
        dir: 'rtl'
    };

    // إظهار الإشعار (يعادل NotificationManager.notify)
    return self.registration.showNotification(title, notificationOptions);
});

// التعامل مع الضغط على الإشعار (يعادل PendingIntent في الأندرويد)
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const orderNumber = event.notification.data.order_number;
    
    // توجيه المستخدم لصفحة الطلبات عند الضغط على الإشعار
    event.waitUntil(
        clients.openWindow('orders.html?order=' + orderNumber)
    );
});
