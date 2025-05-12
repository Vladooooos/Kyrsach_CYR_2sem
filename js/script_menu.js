function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});