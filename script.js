function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}
// Fly-in animation using Intersection Observer API
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fly-in");
    const observerOptions = {
        root: null, // Sets the viewport as the root
        threshold: 0.8, // 50% of the element must be visible
        rootMargin: "0px 0px -40% 0px" // Delay trigger until 20% of the element is above the bottom of the viewport
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fly-in-visible");
               // observer.unobserve(entry.target); // Unobserve after animation is triggered
            } else {
                entry.target.classList.remove("fly-in-visible"); // Remove class to reset animation
            }
        });
    });

    elements.forEach((element) => {
        observer.observe(element);
    });


    const canvas = document.getElementById("flappyBirdGame");
const ctx = canvas.getContext("2d");

// Load the bird image
const birdImage = new Image();
birdImage.src = "assets/bird.png"; // Path to your bird image

let bird = { x: 100, y: 250, width: 60, height: 60, gravity: 1, lift: -13, velocity: 0 }; // Bigger bird, start closer to the middle
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;
let particles = [];

// Particle class remains the same
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.5;
        this.opacity = Math.random() * 0.5;
    }

    update() {
        this.y -= this.speed;
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for(let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

// Display "Press Space to Start" message
function displayStartMessage() {
    // Draw background with gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a192f');
    gradient.addColorStop(0.5, '#1a365d');
    gradient.addColorStop(1, '#2a4c7c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    ctx.fillStyle = "#d4d7dd";
    ctx.font = "30px Inconsolata";
    ctx.textAlign = "center";
    ctx.fillText("Press Space", canvas.width / 2, canvas.height / 2);
}

// Add event listener for spacebar to make the bird "flap" or start the game
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        event.preventDefault();  // Prevents the spacebar from scrolling the page

        if (!gameStarted) {
            startGame();  // Start the game on the first spacebar press
        } else if (!gameOver) {
            bird.velocity = bird.lift;  // Control the bird if the game has already started
        } else if (gameOver) {
            resetGame();  // Reset the game if space is pressed after game over
        }
    }
});

// Pipe constructor
// Adjust bird, pipes, and game parameters for larger canvas
const MIN_PIPE_GAP = 110; // Set the minimum gap to 80 pixels
// Pipe constructor
function Pipe() {
    const maxPipeHeight = canvas.height - MIN_PIPE_GAP;
    this.top = Math.random() * (canvas.height / 2);
    this.bottom = Math.random() * (canvas.height / 2);
    this.x = canvas.width;
    this.width = 50;  // Slightly wider pipes
    this.speed = 5;
    
    // Ensure minimum gap
    const pipeGap = canvas.height - this.top - this.bottom;
    if (pipeGap < MIN_PIPE_GAP) {
        this.bottom = canvas.height - this.top - MIN_PIPE_GAP;
    }

    this.draw = function() {
        // Create gradient for pipes
        let pipeGradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        pipeGradient.addColorStop(0, '#1a365d');    // Darker edge
        pipeGradient.addColorStop(0.5, '#2a4c7c');  // Lighter middle
        pipeGradient.addColorStop(1, '#1a365d');    // Darker edge
        
        ctx.fillStyle = pipeGradient;
        
        // Draw top pipe with rounded corners at bottom
        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x + this.width, 0);
        ctx.lineTo(this.x + this.width, this.top - 10);
        ctx.quadraticCurveTo(this.x + this.width, this.top, this.x + this.width - 10, this.top);
        ctx.lineTo(this.x + 10, this.top);
        ctx.quadraticCurveTo(this.x, this.top, this.x, this.top - 10);
        ctx.closePath();
        ctx.fill();
        
        // Add highlight effect
        let highlightGradient = ctx.createLinearGradient(this.x, 0, this.x + 5, 0);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.fillRect(this.x, 0, 5, this.top);
        
        // Draw bottom pipe with rounded corners at top
        ctx.fillStyle = pipeGradient;
        ctx.beginPath();
        ctx.moveTo(this.x, canvas.height);
        ctx.lineTo(this.x + this.width, canvas.height);
        ctx.lineTo(this.x + this.width, canvas.height - this.bottom + 10);
        ctx.quadraticCurveTo(this.x + this.width, canvas.height - this.bottom, 
                            this.x + this.width - 10, canvas.height - this.bottom);
        ctx.lineTo(this.x + 10, canvas.height - this.bottom);
        ctx.quadraticCurveTo(this.x, canvas.height - this.bottom, 
                            this.x, canvas.height - this.bottom + 10);
        ctx.closePath();
        ctx.fill();
        
        // Add highlight to bottom pipe
        ctx.fillStyle = highlightGradient;
        ctx.fillRect(this.x, canvas.height - this.bottom, 5, this.bottom);
        
        // Optional: Add subtle border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    this.update = function() {
        this.x -= this.speed;
        this.draw();
    };
}

// Draw bird
function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height); // Draw bird image instead of rectangle
}

// Update bird position with gravity
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent bird from going off-screen (game over if bird touches the ground)
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
        gameOver = true;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

// Check for collisions with pipes
function checkCollision(pipe) {
    if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
        gameOver = true;
    }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background with gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a192f');
    gradient.addColorStop(0.5, '#1a365d');
    gradient.addColorStop(1, '#2a4c7c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw and update pipes
    if (frame % 100 === 0) {
        pipes.push(new Pipe());
    }

    pipes.forEach(function (pipe) {
        pipe.update();
        checkCollision(pipe);
    });

    // Remove pipes that go off the screen
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Draw and update bird
    drawBird();
    updateBird();

    // Display score
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 40, 20);

    // Increase score over time
    if (frame % 100 === 0 && !gameOver) {
        score++;
    }

    frame++;

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = "white";
        ctx.font = "30px Inconsolata";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Inconsolata";
        ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 40);
    }
}

// Start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameOver = false;
        pipes = [];
        score = 0;
        frame = 0;
        bird.y = 150;
        bird.velocity = 0;
        if (particles.length === 0) {
            initParticles();
        }
        gameLoop();
    }
}

// Reset the game after game over
function resetGame() {
    gameOver = false;
    gameStarted = true;
    pipes = [];  // Clear existing pipes
    score = 0;  // Reset score
    frame = 0;  // Reset frame counter
    bird.y = 150;  // Reset bird position
    bird.velocity = 0;  // Reset bird velocity
    gameLoop();  // Restart the game loop
}

// Initialize particles when the game loads
initParticles();
displayStartMessage();


    // Create astronaut
    const astronaut = document.createElement('div');
    astronaut.className = 'astronaut';
    document.body.appendChild(astronaut);
    
    // Initial position
    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;
    let velX = 1;  // Initial horizontal drift
    let velY = 0.5;  // Initial vertical drift
    
    function updatePosition() {
        astronaut.style.left = posX + 'px';
        astronaut.style.top = posY + 'px';
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', function(e) {
        const moveSpeed = 3;
        switch(e.key.toLowerCase()) {
            case 'w': velY = -moveSpeed; break;
            case 's': velY = moveSpeed; break;
            case 'a': velX = -moveSpeed; break;
            case 'd': velX = moveSpeed; break;
        }
    });
    
    // Animation loop
    function animate() {
        posX += velX;
        posY += velY;
        
        // Bounce off edges
        if (posX <= 0 || posX >= window.innerWidth - 30) velX *= -1;
        if (posY <= 0 || posY >= window.innerHeight - 30) velY *= -1;
        
        updatePosition();
        requestAnimationFrame(animate);
    }
    
    animate();


});