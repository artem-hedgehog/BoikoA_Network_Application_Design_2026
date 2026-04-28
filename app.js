import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { openDB, getAllUserModels, deleteUserModel, saveModel } from './idb.js';

// Конфигурация предустановленных моделей
const PRESET_MODELS = [
    { id: 'preset_gram', name: 'Граммофон', type: 'preset', url: 'models/Gramophone.glb', isPair: false },
    { id: 'preset_tel', name: 'Телефон', type: 'preset', url: 'models/Telephone.glb', isPair: false },
    { id: 'preset_angel', name: 'Ангел', type: 'preset', url: 'models/Angel.glb', isPair: false },
    { id: 'preset_gate', name: 'Забор', type: 'preset', url: 'models/Gate.glb', isPair: false },
    { 
        id: 'preset_gram_tel', name: 'Граммофон + телефон', type: 'preset', isPair: true, 
        models: [
            { url: 'models/Gramophone.glb', offsetX: -0.9 },
            { url: 'models/Telephone.glb', offsetX: 0.9 }
        ]
    }
];

let galleryGrid = document.getElementById('galleryGrid');

// Рендер одиночной модели
function renderSinglePreview(canvas, modelUrl, modelName, isUserModel = false, arrayBuffer = null) {
    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) {
        console.warn(`renderSinglePreview: нулевые размеры для ${modelName}`);
        return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a24);
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 3);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
    renderer.setSize(width, height);
    renderer.setClearColor(0x1a1a24);
    
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);
    const backLight = new THREE.PointLight(0x556688, 0.5);
    backLight.position.set(-1, 1, -2);
    scene.add(backLight);
    
    const loader = new GLTFLoader();
    let loadPromise;
    if (isUserModel && arrayBuffer) {
        loadPromise = loader.parseAsync(arrayBuffer, '');
    } else if (modelUrl) {
        loadPromise = loader.loadAsync(modelUrl);
    } else {
        console.error('Нет данных для загрузки', modelName);
        renderer.dispose();
        return;
    }
    
    loadPromise.then(gltf => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const minY = box.min.y;
        model.position.y = -minY;
        scene.add(model);
        renderer.render(scene, camera);
        console.log(`✓ Превью: ${modelName}`);
    }).catch(err => {
        console.error(`✗ Ошибка превью ${modelName}:`, err);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a24';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffaa66';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ошибка загрузки', width/2, height/2);
        renderer.dispose();
    });
}

// Рендер парной модели
function renderPairPreview(canvas, modelsArray, pairName) {
    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a24);
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 3.5);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
    renderer.setSize(width, height);
    renderer.setClearColor(0x1a1a24);
    
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);
    const backLight = new THREE.PointLight(0x556688, 0.5);
    backLight.position.set(-1, 1, -2);
    scene.add(backLight);
    
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
        console.log(`✓ Парное превью: ${pairName}`);
    }).catch(err => {
        console.error(`✗ Ошибка парного превью ${pairName}:`, err);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a24';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffaa66';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ошибка пары', width/2, height/2);
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
            if (confirm(`Удалить "${modelData.name}"?`)) {
                await deleteUserModel(userId);
                card.remove();
            }
        });
        infoDiv.appendChild(delBtn);
    }
    
    card.appendChild(canvas);
    card.appendChild(infoDiv);
    
    if (modelData.isPair) {
        renderPairPreview(canvas, modelData.models, modelData.name);
    } else if (isUser && userBuffer) {
        renderSinglePreview(canvas, null, modelData.name, true, userBuffer);
    } else if (modelData.url) {
        renderSinglePreview(canvas, modelData.url, modelData.name, false);
    } else {
        console.warn('Нет данных для превью', modelData);
    }
    
    card.addEventListener('click', () => {
        const params = new URLSearchParams();
        params.set('name', modelData.name);
        if (modelData.isPair) {
            params.set('type', 'pair');
            params.set('models', JSON.stringify(modelData.models));
        } else if (isUser && userBuffer) {
            params.set('type', 'user');
            params.set('id', userId);
            const bufferArray = Array.from(new Uint8Array(userBuffer));
            sessionStorage.setItem(`user_model_${userId}`, JSON.stringify(bufferArray));
        } else if (modelData.url) {
            params.set('type', 'preset');
            params.set('url', modelData.url);
        }
        window.location.href = `detail.html?${params.toString()}`;
    });
    
    return card;
}

// Загрузка галереи
async function loadAllModels() {
    console.log('🔄 loadAllModels: начата');
    galleryGrid.innerHTML = '';
    
    // Предустановленные модели
    for (const preset of PRESET_MODELS) {
        try {
            const card = createCard(preset, false);
            galleryGrid.appendChild(card);
        } catch (err) {
            console.error('Ошибка карточки пресета', preset.name, err);
        }
    }
    
    // Пользовательские модели
    let userModels = [];
    try {
        userModels = await getAllUserModels();
        if (!Array.isArray(userModels)) userModels = [];
        console.log(`📦 Пользовательских моделей: ${userModels.length}`);
    } catch (err) {
        console.error('Ошибка получения пользовательских моделей:', err);
        userModels = [];
    }
    
    for (const user of userModels) {
        try {
            const cardData = { name: user.name, isPair: false };
            const card = createCard(cardData, true, user.data, user.id);
            galleryGrid.appendChild(card);
        } catch (err) {
            console.error('Ошибка карточки пользователя', user.name, err);
        }
    }
    console.log('✅ loadAllModels: завершена');
}

// Обработка загрузки файла
async function handleFileUpload(file) {
    console.log(`📁 Загрузка файла: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    if (!file.name.endsWith('.glb')) {
        alert('Пожалуйста, выберите файл .glb');
        return;
    }
    try {
        const arrayBuffer = await file.arrayBuffer();
        await saveModel(file, arrayBuffer);
        alert(`✅ Модель "${file.name}" загружена!`);
        await loadAllModels();
    } catch (err) {
        console.error('❌ Ошибка загрузки:', err);
        alert('Ошибка загрузки модели. Смотрите консоль (F12).');
    }
}

// Инициализация событий
document.getElementById('modelUpload').addEventListener('change', async (e) => {
    if (e.target.files.length) {
        await handleFileUpload(e.target.files[0]);
        e.target.value = '';
    }
});

// Запуск
loadAllModels();