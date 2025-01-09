function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createParticles); 