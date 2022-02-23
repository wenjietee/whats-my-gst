const assets = [
	'/',
	'/index.html',
	'/css/normalize.min.css',
	'/css/skeleton.min.css',
	'/css/styles.css',
	'/scripts/jquery-3.5.1.min.js',
	'/scripts/app.js',
	'/favicon/favicon.ico',
	'/manifest.json',
];

self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open('whatsMyGst').then(function (cache) {
			return cache.addAll(assets);
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});
