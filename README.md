# Mis Notas PWA

Caso de uso: Aplicación web progresiva para tomar notas rápidas que funciona sin conexión a internet.

## Tecnologías
- HTML, CSS, JavaScript
- IndexedDB para persistencia de datos
- Service Worker para caché y modo offline
- Web API: Geolocalización

## Cómo ejecutar localmente
1. Clona el repositorio.
2. Ejecuta `python -m http.server 8000` en la carpeta del proyecto.
3. Abre `http://localhost:8000`.

## Despliegue
La PWA está desplegada en: [TU_URL_DE_VERCEL_AQUI]

## Características PWA
- Instalable (Manifest + Iconos)
- Modo Offline (Service Worker Cache First)
- Persistencia local (IndexedDB)
- API de Geolocalización integrada.