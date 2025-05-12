    document.addEventListener('DOMContentLoaded', function() {
        const cards = document.querySelectorAll('.athlete-card');
        let currentIndex = 0;
        
        function showNextCard() {
           
            cards[currentIndex].classList.remove('active');
            cards[currentIndex].classList.add('fade-out');
        
            currentIndex = (currentIndex + 1) % cards.length;
            
            setTimeout(() => {
                cards.forEach(card => {
                    card.classList.remove('fade-out');
                    card.classList.remove('active');
                });
                cards[currentIndex].classList.add('active');
            }, 2000);
        }
        
    
        setInterval(showNextCard, 6000);
    });
