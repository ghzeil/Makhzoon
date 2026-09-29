// JavaScript source code
// 1. قاعدة بيانات النصوص للغتين (Localization)
const translations = {
    ar: {
        title: "نظام إدارة المخزون",
        totalProducts: "إجمالي المنتجات",
        lowStock: "نقص في المخزون",
        totalValue: "قيمة المخزون",
        addBtn: "إضافة منتج جديد",
        tableProduct: "المنتج",
        tableCategory: "الفئة",
        tableQty: "الكمية",
        tablePrice: "السعر",
        tableActions: "الإجراءات",
        placeholderSearch: "ابحث عن منتج...",
        dir: "rtl"
    },
    en: {
        title: "Inventory System",
        totalProducts: "Total Products",
        lowStock: "Low Stock",
        totalValue: "Total Value",
        addBtn: "Add New Product",
        tableProduct: "Product",
        tableCategory: "Category",
        tableQty: "Quantity",
        tablePrice: "Price",
        tableActions: "Actions",
        placeholderSearch: "Search product...",
        dir: "ltr"
    }
};

// 2. مصفوفة البيانات الأولية (المخزون)
// سنستخدم LocalStorage لاحقاً ليتم حفظ البيانات حتى بعد تحديث الصفحة
let inventory = JSON.parse(localStorage.getItem('myInventory')) || [
    { id: 1, name: "قهوة هرري", category: "بن", quantity: 15, price: 45 },
    { id: 2, name: "زعفران سوبر نقيل", category: "بهارات", quantity: 3, price: 120 },
    { id: 3, name: "هيل هندي", category: "بهارات", quantity: 20, price: 80 }
];

let currentLang = 'ar';

// 3. عناصر الواجهة (DOM Elements)
const productList = document.getElementById('product-list');
const langBtn = document.getElementById('lang-switch');
const totalProductsEl = document.getElementById('total-products');
const lowStockEl = document.getElementById('low-stock');
const totalValueEl = document.getElementById('total-value');

// 4. وظيفة عرض المنتجات في الجدول
function displayProducts() {
    productList.innerHTML = ""; // مسح الجدول الحالي

    inventory.forEach((product) => {
        const isLow = product.quantity < 5; // تنبيه إذا الكمية أقل من 5
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td class="${isLow ? 'text-danger' : ''}">${product.quantity} ${isLow ? '<i class="fas fa-exclamation-triangle"></i>' : ''}</td>
            <td>${product.price} ر.س</td>
            <td>
                <button onclick="deleteProduct(${product.id})" class="btn-delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        productList.appendChild(row);
    });

    updateStats();
    saveToLocalStorage();
}

// 5. وظيفة تحديث الإحصائيات (الكرتات العلوية)
function updateStats() {
    const total = inventory.length;
    const low = inventory.filter(p => p.quantity < 5).length;
    const value = inventory.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    totalProductsEl.innerText = total;
    lowStockEl.innerText = low;
    totalValueEl.innerText = `${value} ر.س`;
}

// 6. وظيفة إضافة منتج جديد (تجريبية عبر البرومبت حالياً لتبسيط الكود)
document.getElementById('openModal').addEventListener('click', () => {
    const name = prompt(currentLang === 'ar' ? "أدخل اسم المنتج:" : "Enter product name:");
    const category = prompt(currentLang === 'ar' ? "الفئة:" : "Category:");
    const quantity = parseInt(prompt(currentLang === 'ar' ? "الكمية:" : "Quantity:"));
    const price = parseFloat(prompt(currentLang === 'ar' ? "السعر:" : "Price:"));

    if (name && category && !isNaN(quantity) && !isNaN(price)) {
        const newProduct = {
            id: Date.now(), // رقم فريد باستخدام الوقت
            name,
            category,
            quantity,
            price
        };
        inventory.push(newProduct);
        displayProducts();
    }
});

// 7. وظيفة حذف منتج
function deleteProduct(id) {
    if (confirm(currentLang === 'ar' ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) {
        inventory = inventory.filter(p => p.id !== id);
        displayProducts();
    }
}

// 8. وظيفة تبديل اللغة (Localization Logic)
langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';

    // تحديث اتجاه الصفحة
    document.documentElement.dir = translations[currentLang].dir;
    langBtn.innerText = currentLang === 'ar' ? 'English' : 'العربية';

    // تحديث النصوص في الواجهة
    const t = translations[currentLang];
    document.querySelector('h1').innerText = t.title;
    document.querySelector('.btn-add').innerHTML = `<i class="fas fa-plus"></i> ${t.addBtn}`;

    // تحديث رؤوس الجدول
    const headers = document.querySelectorAll('th');
    headers[0].innerText = t.tableProduct;
    headers[1].innerText = t.tableCategory;
    headers[2].innerText = t.tableQty;
    headers[3].innerText = t.tablePrice;
    headers[4].innerText = t.tableActions;

    // تحديث الإحصائيات (الكلمات فقط)
    document.querySelectorAll('.stat-card h3')[0].innerText = t.totalProducts;
    document.querySelectorAll('.stat-card h3')[1].innerText = t.lowStock;
    document.querySelectorAll('.stat-card h3')[2].innerText = t.totalValue;
});

// 9. حفظ البيانات في متصفح المستخدم
function saveToLocalStorage() {
    localStorage.setItem('myInventory', JSON.stringify(inventory));
}

// تشغيل الوظيفة عند تحميل الصفحة لأول مرة
displayProducts();