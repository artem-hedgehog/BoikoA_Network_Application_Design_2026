const DB_NAME = '3D_Gallery_DB';
const STORE_NAME = 'user_models';
const DB_VERSION = 1;

export function openDB() {
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
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const model = {
        name: file.name.replace(/\.glb$/i, ''),
        originalName: file.name,
        data: dataArrayBuffer,
        date: Date.now(),
        type: 'user'
    };
    const id = await store.add(model);
    await tx.done;
    return { ...model, id };
}

export async function getAllUserModels() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const models = await store.getAll();
    await tx.done;
    return models || []; // всегда массив
}

export async function deleteUserModel(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.delete(id);
    await tx.done;
}