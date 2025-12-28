// Service Worker for Pusher Beams and Connectivity
importScripts('https://js.pusher.com/beams/service-worker.js');

self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
});
