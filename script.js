// Coloque aqui o seu número de WhatsApp com o indicativo do país
const NUMERO_WHATSAPP = "258800000000"; 

const products = [
    { id: 1, name: "Tênis Esportivo", price: 1990.00, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
    { id: 2, name: "Relógio Digital", price: 1490.00, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" },
    { id: 3, name: "Fone Bluetooth", price: 890.00, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" }
];

let cart = [];

// Função com proteção para evitar erro de elementos nulos
function initStore() {
    renderProducts();
    updateCart();
}

function renderProducts() {
    const container = document.getElementById("products-container");
    if (!container) return; // Proteção contra erro de null

    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="product-title">${p.name}</div>
            <div class="product-price">MT ${p.price.toFixed(2)}</div>
            <button class="add-btn" onclick="addToCart(${p.id})">Adicionar</button>
        </div>
    `).join("");
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const itemInCart = cart.find(item => item.id === id);

    if (itemInCart) {
        itemInCart.qtd++;
    } else {
        cart.push({ ...product, qtd: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartCount || !cartTotal) return; // Proteção extra

    cartCount.innerText = cart.reduce((acc, item) => acc + item.qtd, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>O carrinho está vazio.</p>";
        cartTotal.innerText = "MT 0,00";
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.qtd}x MT ${item.price.toFixed(2)}</small>
            </div>
            <div>
                <button onclick="changeQtd(${item.id}, -1)">-</button>
                <span style="margin: 0 5px;">${item.qtd}</span>
                <button onclick="changeQtd(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join("");

    const total = cart.reduce((acc, item) => acc + (item.price * item.qtd), 0);
    cartTotal.innerText = `MT ${total.toFixed(2)}`;
}

function changeQtd(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qtd += delta;
    if (item.qtd <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCart();
}

function toggleCart() {
    const modal = document.getElementById("cart-modal");
    if (modal) {
        modal.classList.toggle("active");
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let message = "🛒 *Novo Pedido*\n\n";
    cart.forEach(item => {
        message += `• ${item.name} (${item.qtd}x) - MT ${(item.price * item.qtd).toFixed(2)}\n`;
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.qtd), 0);
    message += `\n*Total:* MT ${total.toFixed(2)}`;

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

// Garante que o código roda apenas depois de todo o HTML ser carregado
document.addEventListener("DOMContentLoaded", initStore);