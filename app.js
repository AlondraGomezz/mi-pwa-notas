// --- 1. LÓGICA DE INSTALACIÓN (Manifest e Instalabilidad) ---
let deferredPrompt;
const btnInstalar = document.getElementById('btnInstalar');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btnInstalar.style.display = 'block'; // Mostrar botón de instalar
});

btnInstalar.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            btnInstalar.style.display = 'none';
        }
        deferredPrompt = null;
    }
});

// --- 2. BASE DE DATOS INDEXEDDB ---
let db;
const request = indexedDB.open("NotasDB", 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore("notas", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = (e) => {
    db = e.target.result;
    mostrarNotas(); // Cargar notas al iniciar
};

// --- 3. GUARDAR NOTA (Persistencia Local) ---
document.getElementById('formNota').addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = document.getElementById('inputNota').value;
    
    const transaction = db.transaction(["notas"], "readwrite");
    const store = transaction.objectStore("notas");
    store.add({ texto: texto, fecha: new Date().toLocaleString() });

    transaction.oncomplete = () => {
        document.getElementById('inputNota').value = '';
        mostrarNotas();
    };
});

// --- 4. MOSTRAR NOTAS (Renderizado CSR) ---
function mostrarNotas() {
    const lista = document.getElementById('listaNotas');
    lista.innerHTML = ''; // Limpiar contenedor

    const transaction = db.transaction(["notas"], "readonly");
    const store = transaction.objectStore("notas");
    const request = store.getAll();

    request.onsuccess = () => {
        request.result.forEach(nota => {
            const div = document.createElement('div');
            div.className = 'nota';
            div.innerHTML = `<span><strong>${nota.texto}</strong><br><small>${nota.fecha}</small></span>`;
            lista.appendChild(div);
        });
    };
}

// --- 5. WEB API NATIVA: GEOLOCALIZACIÓN ---
document.getElementById('btnUbicacion').addEventListener('click', () => {
    const textoUbicacion = document.getElementById('textoUbicacion');
    
    if (!navigator.geolocation) {
        textoUbicacion.textContent = "Tu navegador no soporta geolocalización.";
        return;
    }

    textoUbicacion.textContent = "Obteniendo ubicación...";
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            textoUbicacion.textContent = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
        },
        () => {
            textoUbicacion.textContent = "Error al obtener la ubicación.";
        }
    );
});

// --- 6. REGISTRO DEL SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registrado', reg))
            .catch(err => console.log('Error SW', err));
    });
}