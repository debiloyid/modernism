document.addEventListener('DOMContentLoaded', () => {
    const detailsButtons = document.querySelectorAll('.details-btn');
    const buyButtons = document.querySelectorAll('.buy-btn');
    const cartCountEl = document.querySelector('.cart-count');
    
    let cartCount = 0;

    detailsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentCard = e.target.closest('.product-card');
            const currentGrid = currentCard.closest('.products-grid');
            const isExpanded = currentCard.classList.contains('expanded');

            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.remove('expanded');
            });
            document.querySelectorAll('.products-grid').forEach(grid => {
                grid.classList.remove('has-expanded');
            });

            if (!isExpanded) {
                currentCard.classList.add('expanded');
                currentGrid.classList.add('has-expanded');
                e.target.textContent = 'згорнути';
                
                currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                e.target.textContent = 'подробиці';
            }

            detailsButtons.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherCard = otherBtn.closest('.product-card');
                    otherBtn.textContent = otherCard.classList.contains('expanded') ? 'згорнути' : 'подробиці';
                }
            });
        });
    });

    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            cartCount++;
            cartCountEl.textContent = `(${cartCount})`;
            
            btn.style.backgroundColor = '#2d6a4f';
            btn.textContent = 'додано';
            
            setTimeout(() => {
                btn.style.backgroundColor = '#1b4332';
                btn.textContent = 'у кошик';
            }, 1000);
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const detailsButtons = document.querySelectorAll('.details-btn');
    const buyButtons = document.querySelectorAll('.buy-btn');
    const cartCountEl = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    
    let cart = JSON.parse(localStorage.getItem('modernism_cart')) || [];

    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartCountEl) {
            cartCountEl.textContent = `(${totalItems})`;
        }
    }

    function saveCart() {
        localStorage.setItem('modernism_cart', JSON.stringify(cart));
        updateCartCounter();
    }

    updateCartCounter();

    detailsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentCard = e.target.closest('.product-card');
            const currentGrid = currentCard.closest('.products-grid');
            const isExpanded = currentCard.classList.contains('expanded');

            document.querySelectorAll('.product-card').forEach(card => card.classList.remove('expanded'));
            document.querySelectorAll('.products-grid').forEach(grid => grid.classList.remove('has-expanded'));

            if (!isExpanded) {
                currentCard.classList.add('expanded');
                currentGrid.classList.add('has-expanded');
                e.target.textContent = 'згорнути';
                currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                e.target.textContent = 'подробиці';
            }

            detailsButtons.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherCard = otherBtn.closest('.product-card');
                    otherBtn.textContent = otherCard.classList.contains('expanded') ? 'згорнути' : 'подробиці';
                }
            });
        });
    });

    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('.product-title').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''), 10);

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.qty++;
            } else {
                cart.push({ title, price, qty: 1 });
            }

            saveCart();
            
            btn.style.backgroundColor = '#2d6a4f';
            btn.textContent = 'додано';
            setTimeout(() => {
                btn.style.backgroundColor = '#1b4332';
                btn.textContent = 'у кошик';
            }, 1000);
        });
    });

    function renderCartPage() {
        if (!cartItemsContainer) return;

        const totalQtyEl = document.getElementById('total-qty');
        const totalPriceEl = document.getElementById('total-price');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Ваш кошик наразі порожній. Оберіть видання у каталозі.</p>';
            totalQtyEl.textContent = '0';
            totalPriceEl.textContent = '0 ₴';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let totalQty = 0;
        let totalPrice = 0;

        cart.forEach((item, index) => {
            totalQty += item.qty;
            totalPrice += item.price * item.qty;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span>${item.price} ₴ / прим.</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                    <button class="remove-btn" data-index="${index}">видалити</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        totalQtyEl.textContent = totalQty;
        totalPriceEl.textContent = `${totalPrice} ₴`;

        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart[e.target.dataset.index].qty++;
                saveCart();
                renderCartPage();
            });
        });

        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                if (cart[idx].qty > 1) {
                    cart[idx].qty--;
                } else {
                    cart.splice(idx, 1);
                }
                saveCart();
                renderCartPage();
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart.splice(e.target.dataset.index, 1);
                saveCart();
                renderCartPage();
            });
        });
    }

    renderCartPage();

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) return;
            alert('Дякуємо за замовлення! Ми зв’яжемося з вами найближчим часом.');
            cart = [];
            saveCart();
            renderCartPage();
            checkoutForm.reset();
        });
    }
});
