document.addEventListener('DOMContentLoaded', function() {
    const sneakersContainer = document.getElementById('sneakers-container');
    const sortButton = document.getElementById('sortButton');
    const sortDropdown = document.getElementById('sortDropdown');
    
    let sneakersData = [];
    const currentGender = document.body.getAttribute('data-gender'); 
    
    fetch('/xml/sneakers_men.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            // Получаем все элементы sneaker
            const sneakers = data.querySelectorAll('sneaker');
            
          
            let allSneakers = Array.from(sneakers).map(sneaker => ({
                id: sneaker.getAttribute('id'),
                gender: sneaker.getAttribute('gender'),
                name: sneaker.querySelector('name').textContent,
                price: parseInt(sneaker.querySelector('price').textContent),
                size: sneaker.querySelector('size').textContent,
                image: sneaker.querySelector('image').textContent
            }));
            
            // Фильтруем данные по текущему значению gender
            sneakersData = allSneakers.filter(s => s.gender === currentGender);
            
            // Отображаем только отфильтрованные записи
            displaySneakers(sneakersData);
        })
        .catch(error => console.error('Error loading sneakers data:', error));
    
    
    sortButton.addEventListener('click', function(e) {
        e.stopPropagation();
        sortDropdown.classList.toggle('show');
    });
    
   
    document.addEventListener('click', function() {
        sortDropdown.classList.remove('show');
    });
    
  
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const sortType = this.getAttribute('data-sort'); 
            sortSneakers(sortType);
            sortDropdown.classList.remove('show');
            
           
            sortButton.innerHTML = `Сортировка <span class="sort-icon">${
                sortType === 'asc' ? '▲' : '▼'
            }</span>`;
        });
    });
    
    // Функция сортировки данных по цене
    function sortSneakers(sortType) {
        const sortedData = [...sneakersData];
        sortedData.sort((a, b) => 
            sortType === 'asc' ? a.price - b.price : b.price - a.price
        );
        displaySneakers(sortedData);
    }
    
    // Функция отображения кроссовок на странице
    function displaySneakers(sneakers) {
        const container = sneakersContainer;
        container.innerHTML = '';
        
        sneakers.forEach(sneaker => {
            const sneakerElement = document.createElement('div');
            sneakerElement.className = 'sneaker';
            
           
            const genderPath = currentGender === 'men' ? 'men' : 'women';
            
            sneakerElement.innerHTML = `
            <img class="sneaker-image" src="/images/${genderPath}/${sneaker.image}" alt="${sneaker.name}">
            <div class="sneaker-info">
                <h3 class="sneaker-name">${sneaker.name}</h3>
                <p class="sneaker-price">${sneaker.price.toLocaleString()} BYN</p>
                <div class="size-selector" data-id="${sneaker.id}">
                    ${sneaker.size.split(',').map(size => 
                        `<button class="size-btn" data-size="${size}">${size}</button>`
                    ).join('')}
                </div>
            </div>
            <button class="add-to-cart" 
                data-id="${sneaker.id}" 
                data-name="${sneaker.name}"
                data-price="${sneaker.price}"
                data-image="${sneaker.image}">
                    В корзину
            </button>
        `;
        
            container.appendChild(sneakerElement);
        });
        
        
        initCartButtons();
        initSizeSelection();
    }
    
    // Инициализация кнопок добавления в корзину
    function initCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const sizeSelector = this.closest('.sneaker').querySelector('.size-selector');
                const selectedSizeBtn = sizeSelector.querySelector('.size-btn.active');
                
                if (!selectedSizeBtn) {
                    alert('Пожалуйста, выберите размер');
                    return;
                }
                
                const selectedSize = selectedSizeBtn.getAttribute('data-size');
                const product = {
                    id: this.getAttribute('data-id'),
                    name: this.getAttribute('data-name'),
                    price: parseInt(this.getAttribute('data-price')),
                    image: this.getAttribute('data-image'),
                    size: selectedSize,
                    quantity: 1,
                    gender: currentGender 
                };
                
                addToCart(product);
            });
        });
    }
    
    // Добавление товара в корзину
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItem = cart.find(item => 
            item.id === product.id && 
            item.size === product.size
        );
        
        if (existingItem) {

            existingItem.quantity += 1;
        } else {
        
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size,
                quantity: 1,
                gender: currentGender 
            });
        }
        
        // Сохраняем обновленную корзину
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Обновляем счетчик и показываем уведомление
        updateCartCounter();
        showCartNotification(product.name);
    }
    
    // Обновление счетчика товаров в корзине
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            counter.textContent = totalItems;
        }
    }
    
    function showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = `${productName} добавлен в корзину!`;
        document.body.appendChild(notification);
        setTimeout(() => { notification.classList.add('show'); }, 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    

    function initSizeSelection() {
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const parent = this.closest('.size-selector');
                if (parent) {
                    parent.style.animation = '';
                }
            });
        });
    }
    
    // Обновляем счетчик товаров в корзине при загрузке страницы
    updateCartCounter();
});
