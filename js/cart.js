document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Загрузка корзины из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
    
        if (cart.length === 0) {
            totalPriceElement.textContent = '0';
            return;
        }
    
        cart.forEach((item, index) => {
            const genderPath = item.gender === 'men' ? 'men' : 'women'; 
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            console.log("Путь к изображению:", `/images/${genderPath}/${item.image}`);
            itemElement.innerHTML = `
                <img src="/images/${genderPath}/${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${item.price.toLocaleString()} BYN</p>
                    <p class="cart-item-size">Размер: ${item.size}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                        <button class="remove-btn" data-index="${index}">
                            <img src="/images/Shopping_Cart/Trash.png" alt="Удалить">
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
    
        totalPriceElement.textContent = total.toLocaleString();
        initCartControls();
    }
    
    
    function initCartControls() {
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                decreaseQuantity(index);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                increaseQuantity(index);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                removeItem(index);
            });
        });
    }
    
    // Уменьшение количества
    function decreaseQuantity(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    }
    
    // Увеличение количества
    function increaseQuantity(index) {
        cart[index].quantity++;
        updateCart();
    }
    
    // Удаление товара
    function removeItem(index) {
        cart.splice(index, 1);
        updateCart();
    }
    
    // Обновление корзины
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCounter();
    }
    
    // Обновление счетчика в хедере
    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const counters = document.querySelectorAll('.cart-counter');
        counters.forEach(counter => {
            counter.textContent = totalItems;
        });
    }
    
    // Оформление заказа
    function checkout() {
        if (cart.length === 0) {
            alert('Ваша корзина пуста!');
            return;
        }
        
        alert(`Заказ оформлен! Сумма: ${totalPriceElement.textContent} BYN`);
        cart = [];
        updateCart();
    }
    
    // Инициализация
    renderCart();
    
    // Назначение обработчика кнопки оформления
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});