// Counter functionality
let counter = 0;

const counterDisplay = document.getElementById('counter');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');

function updateCounter() {
    counterDisplay.textContent = counter;
    counterDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        counterDisplay.style.transform = 'scale(1)';
    }, 200);
}

incrementBtn.addEventListener('click', () => {
    counter++;
    updateCounter();
});

decrementBtn.addEventListener('click', () => {
    counter--;
    updateCounter();
});

resetBtn.addEventListener('click', () => {
    counter = 0;
    updateCounter();
});

// Action button functionality
const actionBtn = document.getElementById('actionBtn');
const messageDisplay = document.getElementById('message');

actionBtn.addEventListener('click', () => {
    const messages = [
        'Hello! 👋',
        'Great to see you!',
        'JavaScript is working perfectly!',
        'Keep clicking for more messages!',
        'You\'re doing great!',
        'This is interactive and fun!'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageDisplay.textContent = randomMessage;
    messageDisplay.style.display = 'block';
    
    // Add animation
    messageDisplay.style.opacity = '0';
    messageDisplay.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        messageDisplay.style.transition = 'all 0.3s ease';
        messageDisplay.style.opacity = '1';
        messageDisplay.style.transform = 'translateY(0)';
    }, 10);
});

// Console log to confirm script is loaded
console.log('Script loaded successfully!');
console.log('Interactive elements initialized');

// Add smooth transition to counter
counterDisplay.style.transition = 'transform 0.2s ease';

