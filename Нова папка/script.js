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
