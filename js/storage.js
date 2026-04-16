// Мок-коллекция товаров (тема "кошки" – мягкие игрушки)
const defaultProducts = [
    {
        id: 1,
        name: "Мягкая игрушка Котик аниме",
        brand: "Бренд 1",
        price: 2239,
        oldPrice: 6990,
        discount: 66,
        rating: 4.9,
        reviews: 14,
        image: "https://trend-opt.ru/image/cache/catalog/2024g/to-103998/myagkaya-igrushka-kotik-anime-1000x1000.jpg",
        description: "Очаровательный аниме-кот. Мягкий, приятный на ощупь, станет лучшим другом.",
        likes: 0
    },
    {
        id: 2,
        name: "Кот-акула",
        brand: "Бренд 2",
        price: 1173,
        oldPrice: 3537,
        discount: 65,
        rating: 4.8,
        reviews: 63,
        image: "https://catalog-cdn.detmir.st/media/mfd5lm-e2i7PFYdXMp17y3adK6vQsLNkwOOnFUqTwCY=.jpeg",
        description: "Игрушка кот в образе акулы. Идеально для обнимашек.",
        likes: 0
    },
    {
        id: 3,
        name: "Котик-подушка",
        brand: "Бренд 3",
        price: 669,
        oldPrice: 1015,
        discount: 32,
        rating: 4.9,
        reviews: 173,
        image: "https://trend-opt.ru/image/cache/catalog/2023g/to-102756/myagkaya-igrushka-kot-akula-20sm-1000x1000.jpg",
        description: "Мягкая игрушка-подушка в виде кота. Спать с ним одно удовольствие.",
        likes: 0
    }
];

export function initStorage() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

export function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

export function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

export function copyFirstProduct() {
    const products = getProducts();
    if (products.length === 0) return null;
    const first = products[0];
    const newId = Date.now();
    const copy = {
        ...first,
        id: newId,
        name: first.name + " (копия)",
        reviews: 0,
        likes: 0
    };
    products.push(copy);
    saveProducts(products);
    return copy;
}

export function deleteProductById(id) {
    let products = getProducts();
    const deleted = products.find(p => p.id === id);
    if (!deleted) return false;
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    return deleted;
}

export function incrementLikes(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        product.likes = (product.likes || 0) + 1;
        saveProducts(products);
        return product.likes;
    }
    return null;
}
