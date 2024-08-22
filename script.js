// alert('The website is under development, So you may face some bugs');
let timerInterval;
let isTimerRunning = true;
const audio = new Audio('Source/alarm.wav');
showSection('home');

function showSection(sectionId) {
    const contents = document.getElementsByClassName('content');
    const home = document.getElementById('home-content');
    const timer = document.getElementById('timer-content');
    const calendar = document.getElementById('calendar-content');
    const task = document.getElementById('task-content');
    const feedback = document.getElementById('feedback-content');

    // Loop through all content sections and apply scale(0) to hide them
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.transform = 'scale(0)';
        contents[i].style.opacity = '0';
    }

    // Show the selected section
    if (sectionId == 'home') {
        home.style.transform = 'scale(1)';
        home.style.opacity = '1';
    } else if (sectionId == 'timer') {
        timer.style.transform = 'scale(1)';
        timer.style.opacity = '1';
    } else if (sectionId == 'calendar') {
        calendar.style.transform = 'scale(1)';
        calendar.style.opacity = '1';
    } else if (sectionId == 'task') {
        task.style.transform = 'scale(1)';
        task.style.opacity = '1';
    } else if (sectionId == 'feedback') {
        feedback.style.transform = 'scale(1)';
        feedback.style.opacity = '1';
    }
}


document.addEventListener('mousemove',
    function(event) {

    let moveX = event.clientX / 50;
    let moveY = event.clientY / 50;
    // console.log(`${moveX}, ${moveY}`)
    
    document.body.style.backgroundPosition = `${moveX}px ${moveY}px`
})