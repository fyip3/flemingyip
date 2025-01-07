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


// Display "Press Space to Start" message
function displayStartMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
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
    const maxPipeHeight = canvas.height - MIN_PIPE_GAP; // Max height a pipe can have, considering the minimum gap
    this.top = Math.random() * (canvas.height / 2);
    this.bottom = Math.random() * (canvas.height / 2);
    this.x = canvas.width;
    this.width = 30; // Adjust pipe width for bigger canvas
    this.speed = 5;  // Increase pipe speed slightly for more challenge
    const pipeGap = canvas.height - this.top - this.bottom; 
    if (pipeGap < MIN_PIPE_GAP) {
        this.bottom = canvas.height - this.top - MIN_PIPE_GAP; // Adjust the bottom pipe to ensure the gap is at least 80
    }

    this.draw = function () {
        ctx.fillStyle = "#228B22"; // Green pipes
        ctx.fillRect(this.x, 0, this.width, this.top); // Top pipe
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom); // Bottom pipe
    };

    this.update = function () {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

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
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 40, 20);

    // Increase score over time
    if (frame % 100 === 0 && !gameOver) {
        score++;
    }

    frame++;

    if (!gameOver) {
        requestAnimationFrame(gameLoop); // Keep the game going
    } else {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 40);
    }
}

// Start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;  // Set the game as started
        gameOver = false;
        pipes = [];  // Clear existing pipes
        score = 0;  // Reset score
        frame = 0;  // Reset frame counter
        bird.y = 150;  // Reset bird position
        bird.velocity = 0;  // Reset bird velocity
        gameLoop();  // Start the game loop
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

// Initial display of "Press Space to Start"
displayStartMessage();

    
});