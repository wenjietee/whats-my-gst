const assets = [
	'/',
	'/index.html',
	'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
	'https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css',
	'https://code.jquery.com/jquery-3.5.1.min.js',
	'/styles.css',
	'/registerServiceWorker.js',
	'/app.js',
	'/favicon/favicon.ico',
	'/favicon/icon192x192.png',
	'/favicon/icon512x512.png',
	'/manifest.json',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open('whatsMyGst')
			.then((cache) => {
				return cache.addAll(assets);
			})
			.catch((error) => {
				console.log(error);
			})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (event.request.url.includes('data.gov.sg')) {
				return fetch(event.request);
			}
			return response || fetch(event.request);
		})
	);
});
