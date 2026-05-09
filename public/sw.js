// Service Worker for FountainHome
const CACHE_NAME = 'fountainhome-v1'
const RUNTIME_CACHE = 'fountainhome-runtime'
const IMAGE_CACHE = 'fountainhome-images'

const URLS_TO_CACHE = [
  '/',
  '/history',
  '/downloads',
  '/updates',
  '/settings',
  '/about',
  '/contact',
]

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch(() => {
        // If some URLs fail, that's okay - continue
        return true
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - implement cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Strategy for images - cache first, fallback to network
  if (request.destination === 'image' || url.hostname.includes('tmdb.org') || url.hostname.includes('image.')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          }).catch(() => {
            // Return placeholder on failure
            return caches.match('/placeholder.jpg') || new Response('Image not available', { status: 404 })
          })
        })
      })
    )
    return
  }

  // Strategy for API calls - network first, fallback to cache
  if (url.hostname.includes('api.themoviedb.org')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            return new Response(
              JSON.stringify({ error: 'Offline - no cached data available' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            )
          })
        })
    )
    return
  }

  // Strategy for documents - network first, fallback to cache
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/') || new Response('Offline', { status: 503 })
          })
        })
    )
    return
  }

  // Default strategy - cache first, fallback to network
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response
      }
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }
        const responseClone = response.clone()
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone)
        })
        return response
      }).catch(() => {
        return new Response('Offline', { status: 503 })
      })
    })
  )
})

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    let cacheSize = 0
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => {
          return caches.open(cacheName).then((cache) => {
            return cache.keys().then((requests) => {
              return Promise.all(
                requests.map((request) => {
                  return cache.match(request).then((response) => {
                    if (response) {
                      cacheSize += new Blob([response.body || '']).size
                    }
                  })
                })
              )
            })
          })
        })
      ).then(() => {
        event.ports[0].postMessage({ cacheSize })
      })
    })
  }
})
