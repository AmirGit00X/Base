// Service Worker for Tic-Tac-Toe Online
// این فایل برای اجازه دسترسی به قابلیت‌های ارتباطی در بستر HTTPS (گیت‌هاب) الزامی است

// لود کردن کتابخانه Pusher Beams (در صورت نیاز به نوتیفیکیشن در آینده)
importScripts('https://js.pusher.com/beams/service-worker.js');

const CACHE_NAME = 'tictactoe-v1';

// نصب سرویس ورکر
self.addEventListener('install', (event) => {
    console.log('SW: Service Worker Installed');
    self.skipWaiting();
});

// فعال‌سازی سرویس ورکر
self.addEventListener('activate', (event) => {
    console.log('SW: Service Worker Activated');
    event.waitUntil(clients.claim());
});

// مدیریت پیام‌های دریافتی (اختیاری)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.text() : 'نوبت شماست!';
    event.waitUntil(
        self.registration.showNotification('دوز آنلاین', {
            body: data,
            icon: '/icon.png'
        })
    );
});
