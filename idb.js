const DB_NAME = '3D_Gallery_DB';
const STORE_NAME = 'user_models';
const DB_VERSION = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

export async function saveModel(file, dataArrayBuffer) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const model = {
            name: file.name.replace(/\.glb$/i, ''),
            originalName: file.name,
            data: dataArrayBuffer,
            date: Date.now(),
            type: 'user'
        };
        const request = store.add(model);
        request.onsuccess = () => {
            tx.oncomplete = () => resolve({ ...model, id: request.result });
            tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function getAllUserModels() {
    try {
        const db = await openDB();
        const models = await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            tx.onerror = () => reject(tx.error);
        });
        return Array.isArray(models) ? models : [];
    } catch (err) {
        console.error('getAllUserModels error:', err);
        return [];
    }
}

export async function deleteUserModel(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
    });
}

export { openDB };