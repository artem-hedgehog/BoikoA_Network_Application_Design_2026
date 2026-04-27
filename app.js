import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { openDB, getAllUserModels, deleteUserModel, saveModel } from './idb.js';

// Конфигурация предустановленных моделей
const PRESET_MODELS = [
    { id: 'preset_car', name: 'Граммофон', type: 'preset', url: 'models/Gramophone.glb', isPair: false },
    { id: 'preset_tree', name: 'Телефон', type: 'preset', url: 'models/Telephone.glb', isPair: false },
    { id: 'preset_tree1', name: 'Ангел', type: 'preset', url: 'models/Angel.glb', isPair: false },
    { id: 'preset_tree2', name: 'Забор', type: 'preset', url: 'models/Gate.glb', isPair: false },
    { 
        id: 'preset_car_tree', name: 'Граммофон + телефон', type: 'preset', isPair: true, 
        models: [
            { url: 'models/Gramophone.glb', offsetX: -0.9 },
            { url: 'models/Telephone.glb', offsetX: 0.9 }
        ]
    }
];

let galleryGrid = document.getElementById('galleryGrid');

// Рендер одного кадра для одиночной модели
function renderSinglePreview(canvas, modelUrl, modelName, isUserModel = false, arrayBuffer = null) {
    // Используем фиксированные размеры canvas (атрибуты width/height)
    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
    renderer.setSize(width, height);
    renderer.setClearColor(0x1a1a24);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a24);
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);
    const backLight = new THREE.PointLight(0x556688, 0.5);
    backLight.position.set(-1, 1, -2);
    scene.add(backLight);
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 3);
    camera.lookAt(0, 0, 0);
    
    const loader = new GLTFLoader();
    let objectLoaded = false;
    
    const loadModel = (url, buffer) => {
        if (buffer) {
            return loader.parseAsync(buffer, '');
        } else {
            return loader.loadAsync(url);
        }
    };
    
    const promise = isUserModel && arrayBuffer ? loadModel(null, arrayBuffer) : loadModel(modelUrl);
    
    promise.then(gltf => {
        const model = gltf.scene;
        // Центрирование по основанию (lowest y = 0)
        const box = new THREE.Box3().setFromObject(model);
        const minY = box.min.y;
        const offsetY = -minY;
        model.position.y = offsetY;
        scene.add(model);
        objectLoaded = true;
        renderer.render(scene, camera);
    }).catch(err => {
        console.warn(`Не удалось загрузить ${modelUrl || 'пользовательскую модель'}`, err);
        // Заглушка на canvas (2D контекст)
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#1a1a24';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#ffaa66';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🧩 Модель не найдена', width/2, height/2);
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#aaa';
            ctx.fillText(modelName, width/2, height/2 + 30);
        }
        renderer.dispose();
    });
    
    // Рендер хотя бы пустой сцены, если модель долго грузится
    setTimeout(() => {
        if (!objectLoaded) {
            renderer.render(scene, camera);
        }
    }, 500);
}

// Рендер парной модели (два объекта)
function renderPairPreview(canvas, modelsArray, pairName) {
    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
    renderer.setSize(width, height);
    renderer.setClearColor(0x1a1a24);
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a24);
    
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);
    const backLight = new THREE.PointLight(0x556688, 0.5);
    backLight.position.set(-1, 1, -2);
    scene.add(backLight);
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 3.5);
    camera.lookAt(0, 0, 0);
    
    const loader = new GLTFLoader();
    const promises = modelsArray.map(item => loader.loadAsync(item.url).then(gltf => ({ gltf, offsetX: item.offsetX })));
    
    Promise.all(promises).then(results => {
        results.forEach(({ gltf, offsetX }) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const minY = box.min.y;
            model.position.y = -minY;
            model.position.x = offsetX;
            scene.add(model);
        });
        renderer.render(scene, camera);
    }).catch(err => {
        console.warn('Ошибка загрузки парной модели', err);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a24';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffaa66';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧩 Ошибка загрузки пары', width/2, height/2);
        renderer.dispose();
    });
}

// Создание карточки
function createCard(modelData, isUser = false, userBuffer = null, userId = null) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const canvas = document.createElement('canvas');
    canvas.className = 'preview-canvas';
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.width = '100%';
    canvas.style.aspectRatio = '1 / 1';
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'card-info';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'card-name';
    nameSpan.textContent = modelData.name;
    infoDiv.appendChild(nameSpan);
    
    if (isUser) {
        const delBtn = document.createElement('button');
        delBtn.textContent = '✕';
        delBtn.className = 'delete-btn';
        delBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm(`Удалить модель "${modelData.name}"?`)) {
                await deleteUserModel(userId);
                card.remove();
                loadAllModels();
            }
        });
        infoDiv.appendChild(delBtn);
    }
    
    card.appendChild(canvas);
    card.appendChild(infoDiv);
    
    // Генерация превью (canvas уже в карточке, но ещё не в DOM – размеры берём из атрибутов)
    if (modelData.isPair) {
        renderPairPreview(canvas, modelData.models, modelData.name);
    } else if (isUser && userBuffer) {
        renderSinglePreview(canvas, null, modelData.name, true, userBuffer);
    } else {
        renderSinglePreview(canvas, modelData.url, modelData.name, false);
    }
    
    // Клик по карточке -> детальный просмотр
    card.addEventListener('click', () => {
        const params = new URLSearchParams();
        params.set('name', modelData.name);
        if (modelData.isPair) {
            params.set('type', 'pair');
            params.set('models', JSON.stringify(modelData.models));
        } else if (isUser && userBuffer) {
            params.set('type', 'user');
            params.set('id', userId);
            // Сохраняем буфер в sessionStorage (преобразуем в массив)
            const bufferArray = Array.from(new Uint8Array(userBuffer));
            sessionStorage.setItem(`user_model_${userId}`, JSON.stringify(bufferArray));
        } else {
            params.set('type', 'preset');
            params.set('url', modelData.url);
        }
        window.location.href = `detail.html?${params.toString()}`;
    });
    
    return card;
}

// Загрузка всех моделей (пресеты + пользовательские)
export async function loadAllModels() {
    galleryGrid.innerHTML = '';
    
    // Предустановленные
    for (const preset of PRESET_MODELS) {
        const card = createCard(preset, false);
        galleryGrid.appendChild(card);
    }
    
    // Пользовательские из IndexedDB
    const userModels = await getAllUserModels();
    for (const user of userModels) {
        const cardData = { name: user.name, isPair: false };
        const card = createCard(cardData, true, user.data, user.id);
        galleryGrid.appendChild(card);
    }
}

// Обработка загрузки файла
async function handleFileUpload(file) {
    if (!file.name.endsWith('.glb')) {
        alert('Пожалуйста, выберите файл .glb');
        return;
    }
    try {
        const arrayBuffer = await file.arrayBuffer();
        await saveModel(file, arrayBuffer);
        alert(`Модель "${file.name}" успешно загружена!`);
        await loadAllModels();
    } catch (err) {
        console.error('Ошибка при загрузке модели:', err);
        alert('Не удалось загрузить модель. Подробности в консоли (F12).');
    }
}

// Инициализация
document.getElementById('modelUpload').addEventListener('change', async (e) => {
    if (e.target.files.length) {
        await handleFileUpload(e.target.files[0]);
        e.target.value = '';
    }
});

loadAllModels();