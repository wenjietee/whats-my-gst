const assets = [
	'/',
	'/index.html',
	'/css/normalize.min.css',
	'/css/skeleton.min.css',
	'/css/styles.css',
	'/scripts/jquery-3.5.1.min.js',
	'/scripts/app.js',
	'/favicon/favicon.ico',
	'/registerServiceWorker.js',
	'/manifest.json',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('whatsMyGst').then((cache) => {
			Promise.all(
				assets.map((asset) => {
					return cache.add(asset).catch((error) => {
						console.log(
							`Failed to add ${asset} to cache. Reason: ${String(
								error
							)}`
						);
					});
				})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});
