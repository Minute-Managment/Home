function validateInput() {
    const minput = document.getElementById('work-mtimer');
    const sinput = document.getElementById('work-stimer');
    const errorMessage = document.getElementById('error-message');
    const maxMinutes = 999;
    const maxSeconds = 59;

    // Remove non-digit characters
    minput.value = minput.value.replace(/[^0-9]/g, '');
    sinput.value = sinput.value.replace(/[^0-9]/g, '');

    if (minput.value > 99) {
        minput.style.fontSize = '4rem'
        sinput.focus();
    } else {
        minput.style.fontSize = '6rem'
    }

    if (minput.value > maxMinutes) {
        errorMessage.textContent = `The maximum allowed time is ${maxMinutes} minutes.`;
        minput.value = maxMinutes;
        errorMessage.style.opacity = 1;
    } else {
        errorMessage.style.opacity = 0;
    }

    if (sinput.value > maxSeconds) {
        errorMessage.textContent = `The maximum allowed time is ${maxSeconds} seconds.`;
        sinput.value = maxSeconds;
        errorMessage.style.opacity = 1;
    } else {
        errorMessage.style.opacity = 0;
    }
}

function startTimer() {
    toggleButtons();
    const minput = document.getElementById('work-mtimer');
    const sinput = document.getElementById('work-stimer');
    const timer = document.getElementById('timer');
    if (minput.value == '') {
        minput.value = 0
    }
    if (sinput.value == '') {
        sinput.value = 0
    }
    let time = (parseInt(minput.value) * 60) + parseInt(sinput.value); // Convert minutes to seconds
    const ftime = time

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (time <= 0) {
            minput.style.pointerEvents = 'all';
            sinput.style.pointerEvents = 'all';
            clearInterval(timerInterval);
            // alert("Time's up!");
            minput.value = '';
            sinput.value = '';
            timer.style.boxShadow = `inset 0 0 0 0rem #99999933`;
            alrt();
            toggleButtons();
        } else {
            minput.style.pointerEvents = 'none';
            sinput.style.pointerEvents = 'none';
            time--;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            minput.value = `${minutes < 10 ? '0' : ''}${minutes}`;
            sinput.value = `${seconds < 10 ? '0' : ''}${seconds}`;
            timer.style.boxShadow = `inset 0 0 1rem ${(1 - (time / ftime)) * 9}rem #99999933`;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    const minput = document.getElementById('work-mtimer');
    const sinput = document.getElementById('work-stimer');
    minput.style.pointerEvents = 'all';
    sinput.style.pointerEvents = 'all';
    minput.value = ''; // Clear the input value
    sinput.value = ''; // Clear the input value
    timer.style.boxShadow = `inset 0 0 0 0rem #99999933`;
    toggleButtons();
}

function toggleButtons() {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');

    if (isTimerRunning) {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
    } else {
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
    }
    isTimerRunning = !isTimerRunning;
}


function alrt(){
    document.body.classList.add('shake');
    playSound();
    
    document.body.addEventListener('click', function() {
        document.body.classList.remove('shake');
        stopSound();
    });
}
// Function to play the sound
function playSound() {
    audio.play().catch(error => {
        console.error('Error playing sound:', error);
    });
}
function stopSound() {
    audio.pause().catch(error => {
        console.error('Error playing sound:', error);
    });
}