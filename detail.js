import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { openDB } from './idb.js';

const container = document.getElementById('detailCanvas');
let scene, camera, renderer, controls, currentModelGroup;
let animationId;

const params = new URLSearchParams(window.location.search);
const modelName = params.get('name') || 'Модель';
document.getElementById('modelTitle').textContent = modelName;

// Настройка сцены
function initScene() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    scene.fog = new THREE.FogExp2(0x111122, 0.008);
    
    camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
    camera.position.set(3, 2, 4);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.2;
    controls.target.set(0, 0.5, 0);
    
    // Свет
    const ambient = new THREE.AmbientLight(0x404060);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(2, 3, 2);
    scene.add(mainLight);
    const fillLight = new THREE.PointLight(0x556688, 0.5);
    fillLight.position.set(-1, 1.5, 2);
    scene.add(fillLight);
    const backLight = new THREE.PointLight(0x8866aa, 0.4);
    backLight.position.set(0, 1, -3);
    scene.add(backLight);
    
    // Пол помощник (прозрачная сетка)
    const gridHelper = new THREE.GridHelper(8, 20, 0x88aaff, 0x335588);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);
    
    animate();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update(); // обновляем, даже если нет модели
    renderer.render(scene, camera);
}

// Центрирование модели по основанию
function centerModelByBase(model) {
    const box = new THREE.Box3().setFromObject(model);
    const minY = box.min.y;
    const offsetY = -minY;
    model.position.y = offsetY;
    // опционально центрируем по X,Z
    const centerX = (box.min.x + box.max.x) / 2;
    const centerZ = (box.min.z + box.max.z) / 2;
    model.position.x -= centerX;
    model.position.z -= centerZ;
    return model;
}

// Загрузка одиночной модели (preset или user)
async function loadSingleModel(url, arrayBuffer = null) {
    const loader = new GLTFLoader();
    let gltf;
    if (arrayBuffer) {
        gltf = await loader.parseAsync(arrayBuffer, '');
    } else {
        gltf = await loader.loadAsync(url);
    }
    const model = gltf.scene;
    centerModelByBase(model);
    scene.add(model);
    return model;
}

// Загрузка парной модели
async function loadPairModels(modelsArray) {
    const loader = new GLTFLoader();
    const loadPromises = modelsArray.map(async (item) => {
        const gltf = await loader.loadAsync(item.url);
        const model = gltf.scene;
        centerModelByBase(model);
        model.position.x = item.offsetX || 0;
        return model;
    });
    const models = await Promise.all(loadPromises);
    models.forEach(m => scene.add(m));
    return models;
}

// Управление камерой (ракурсы)
function setupViewControls() {
    document.getElementById('viewFront').addEventListener('click', () => {
        camera.position.set(0, 1.2, 4);
        controls.target.set(0, 0.8, 0);
        controls.update();
    });
    document.getElementById('viewBack').addEventListener('click', () => {
        camera.position.set(0, 1.2, -4);
        controls.target.set(0, 0.8, 0);
        controls.update();
    });
    document.getElementById('viewLeft').addEventListener('click', () => {
        camera.position.set(-4, 1.2, 0);
        controls.target.set(0, 0.8, 0);
        controls.update();
    });
    document.getElementById('viewRight').addEventListener('click', () => {
        camera.position.set(4, 1.2, 0);
        controls.target.set(0, 0.8, 0);
        controls.update();
    });
    document.getElementById('viewReset').addEventListener('click', () => {
        camera.position.set(3, 2, 4);
        controls.target.set(0, 0.8, 0);
        controls.update();
    });
    document.getElementById('zoomIn').addEventListener('click', () => {
        camera.position.multiplyScalar(0.9);
        controls.update();
    });
    document.getElementById('zoomOut').addEventListener('click', () => {
        camera.position.multiplyScalar(1.1);
        controls.update();
    });
    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.back();
    });
}

// Инициализация страницы
async function initDetail() {
    initScene();
    setupViewControls();
    
    const type = params.get('type');
    try {
        if (type === 'pair') {
            const modelsJson = params.get('models');
            const modelsArray = JSON.parse(modelsJson);
            await loadPairModels(modelsArray);
        } 
        else if (type === 'user') {
            const userId = params.get('id');
            const db = await openDB();
            const tx = db.transaction('user_models', 'readonly');
            const store = tx.objectStore('user_models');
            const userModel = await store.get(Number(userId));
            if (userModel && userModel.data) {
                await loadSingleModel(null, userModel.data);
            } else {
                console.error('Модель не найдена в IDB');
            }
        }
        else { // preset
            const url = params.get('url');
            if (url) {
                await loadSingleModel(url);
            }
        }
    } catch (err) {
        console.error('Ошибка загрузки модели', err);
        const fallbackText = document.createElement('div');
        fallbackText.textContent = '❌ Не удалось загрузить модель. Проверьте файл.';
        fallbackText.style.color = 'white';
        fallbackText.style.position = 'absolute';
        fallbackText.style.bottom = '50px';
        fallbackText.style.left = '20px';
        fallbackText.style.background = 'rgba(0,0,0,0.7)';
        fallbackText.style.padding = '8px 16px';
        fallbackText.style.borderRadius = '20px';
        container.appendChild(fallbackText);
    }
}

initDetail();

// Адаптивный resize
window.addEventListener('resize', () => {
    if (renderer && camera) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
});