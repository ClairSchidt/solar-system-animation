// Solar System Animation JavaScript

// Animation control variables
let isPaused = false;

// Planet data
const planetData = {
    mercury: { name: 'Mercury', color: '#8c7853' },
    venus: { name: 'Venus', color: '#ffc649' },
    earth: { name: 'Earth', color: '#4a90e2' },
    mars: { name: 'Mars', color: '#e27b58' },
    jupiter: { name: 'Jupiter', color: '#c88b3a' },
    saturn: { name: 'Saturn', color: '#fad5a5' },
    uranus: { name: 'Uranus', color: '#4fd0e7' },
    neptune: { name: 'Neptune', color: '#4166f5' }
};

// Initialize planets position and labels
document.addEventListener('DOMContentLoaded', () => {
    initializePlanets();
    setupEventListeners();
});

// Position planets and labels on their orbits
function initializePlanets() {
    const planets = document.querySelectorAll('.planet');
    const labels = document.querySelectorAll('.planet-label');
    
    planets.forEach((planet, index) => {
        const orbit = planet.previousElementSibling;
        const orbitRadius = orbit.offsetWidth / 2;
        const planetRadius = planet.offsetWidth / 2;
        
        // Set planet starting position
        planet.style.left = `calc(50% + ${orbitRadius}px - ${planetRadius}px)`;
        planet.style.top = `calc(50% - ${planetRadius}px)`;
        
        // Apply the same animation as the planet to the label
        const label = labels[index];
        if (label) {
            label.style.left = `calc(50% + ${orbitRadius + 20}px)`;
            label.style.top = `calc(50% - 10px)`;
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Planet click event
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
        planet.addEventListener('click', showPlanetInfo);
        planet.addEventListener('mouseenter', showPlanetInfo);
        planet.addEventListener('mouseleave', hidePlanetInfo);
    });
    
    // Pause/Resume buttons
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    
    pauseBtn.addEventListener('click', pauseAnimation);
    resumeBtn.addEventListener('click', resumeAnimation);
}

// Show planet information
function showPlanetInfo(event) {
    const planet = event.currentTarget;
    const planetName = planet.dataset.planet;
    const distance = planet.dataset.distance;
    const period = planet.dataset.period;
    const infoDiv = document.getElementById('planetInfo');
    
    infoDiv.innerHTML = `
        <h3>${planetData[planetName].name}</h3>
        <p><strong>Distance from Sun:</strong> ${distance}</p>
        <p><strong>Orbital Period:</strong> ${period}</p>
    `;
    infoDiv.style.display = 'block';
}

// Hide planet information
function hidePlanetInfo() {
    const infoDiv = document.getElementById('planetInfo');
    infoDiv.style.display = 'none';
}

// Pause animation
function pauseAnimation() {
    const animatedElements = document.querySelectorAll('.planet, .planet-label');
    
    animatedElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const matrix = style.transform;
        const angle = getRotationAngle(matrix);
        
        // Store current angle and pause animation
        element.style.transform = `rotate(${angle}deg)`;
        element.style.animationPlayState = 'paused';
        element.dataset.currentAngle = angle;
    });
    
    isPaused = true;
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('resumeBtn').style.display = 'inline-block';
}

// Resume animation
function resumeAnimation() {
    const animatedElements = document.querySelectorAll('.planet, .planet-label');
    
    animatedElements.forEach(element => {
        const angle = parseFloat(element.dataset.currentAngle) || 0;
        
        // Reset transform and resume animation
        element.style.transform = '';
        element.style.animationPlayState = 'running';
        
        // Adjust animation to start from current position
        const computedStyle = window.getComputedStyle(element);
        const animationDuration = computedStyle.animationDuration;
        const animationDelay = computedStyle.animationDelay;
        
        // Restart animation with same settings
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = `rotate ${animationDuration} linear infinite`;
    });
    
    isPaused = false;
    document.getElementById('pauseBtn').style.display = 'inline-block';
    document.getElementById('resumeBtn').style.display = 'none';
}

// Get rotation angle from matrix transform
function getRotationAngle(matrix) {
    if (matrix === 'none') return 0;
    
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    
    if (angle < 0) angle += 360;
    
    return angle;
}

// Add stars background effect
function createStars() {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: twinkle ${Math.random() * 3 + 2}s infinite;
        `;
        container.appendChild(star);
    }
}

// Create star twinkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize stars on page load
window.addEventListener('load', createStars);
