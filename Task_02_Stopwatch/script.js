document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display'); 
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');

    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const lapButton = document.getElementById('lapButton');
    const lapsList = document.getElementById('lapsList');

    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let running = false;
    let lapNumber = 1;

    function formatTime(time) {
        const totalMilliseconds = time;
        const ms = String(totalMilliseconds % 1000).padStart(3, '0');
        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const s = String(totalSeconds % 60).padStart(2, '0');
        const m = String(Math.floor(totalSeconds / 60) % 60).padStart(2, '0');
        return { m, s, ms };
    }

    function updateDisplay() {
        const currentTime = Date.now();
        const timePassed = currentTime - startTime + elapsedTime;
        const formattedTime = formatTime(timePassed);

        minutesDisplay.textContent = formattedTime.m;
        secondsDisplay.textContent = formattedTime.s;
        millisecondsDisplay.textContent = formattedTime.ms;
    }

    function startTimer() {
        if (!running) {
            startTime = Date.now();
            timerInterval = setInterval(updateDisplay, 10);
            running = true;

            displayElement.classList.add('circular-active'); 

            startButton.textContent = 'Resume';
            startButton.disabled = true;
            startButton.classList.remove('running');

            pauseButton.disabled = false;
            resetButton.disabled = false;
            lapButton.disabled = false;
        }
    }

    function pauseTimer() {
        if (running) {
            clearInterval(timerInterval);
            elapsedTime += Date.now() - startTime;
            running = false;
            startButton.textContent = 'Resume';
            startButton.disabled = false;
            startButton.classList.add('running');

            pauseButton.disabled = true;
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        running = false;
        elapsedTime = 0;
        lapNumber = 1;

        displayElement.classList.remove('circular-active'); 

        minutesDisplay.textContent = '00';
        secondsDisplay.textContent = '00';
        millisecondsDisplay.textContent = '000';

        lapsList.innerHTML = '';

        startButton.textContent = 'Start';
        startButton.disabled = false;
        startButton.classList.remove('running');

        pauseButton.disabled = true;
        resetButton.disabled = true;
        lapButton.disabled = true;
    }

    function recordLap() {
        if (running) {
            const currentFormattedTime = formatTime(Date.now() - startTime + elapsedTime);
            const lapTime = `${currentFormattedTime.m}:${currentFormattedTime.s}:${currentFormattedTime.ms}`;
            
            const listItem = document.createElement('li');

            const lapNumSpan = document.createElement('span');
            lapNumSpan.classList.add('lap-number');
            lapNumSpan.textContent = `Lap ${lapNumber}`;

            const lapTimeSpan = document.createElement('span');
            lapTimeSpan.classList.add('lap-time');
            lapTimeSpan.textContent = lapTime;

            listItem.appendChild(lapNumSpan);
            listItem.appendChild(lapTimeSpan);
            lapsList.prepend(listItem);
            lapNumber++;
        }
    }

    startButton.addEventListener('click', () => {
        if (startButton.textContent === 'Start' || startButton.textContent === 'Resume') {
            startTimer();
        }
    });
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    lapButton.addEventListener('click', recordLap);

    resetTimer();
    startButton.disabled = false;
});