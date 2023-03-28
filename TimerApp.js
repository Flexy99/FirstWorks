let seconds = 00;
let tens = 0;
let outPutSeconds = document.getElementById('seconds');
let outPutTens = document.getElementById('tens');
let buttonStart = document.getElementById('button-start');
let buttonStop = document.getElementById('button-stop');
let buttonReset = document.getElementById('button-reset')
let interval;


buttonStart.addEventListener('click', () => {
    clearInterval(interval);
    interval = setInterval(startTime, 10);
})

buttonStop.addEventListener('click',() => {
    clearInterval(interval);
})

buttonReset.addEventListener('click',() => {
    clearInterval(interval);
    tens = 0;
    seconds = 00;
    outPutSeconds.innerHTML = formatTime(seconds);
    outPutTens.innerHTML = formatTime(tens);
})

function formatTime(num) {
    return String(num).padStart(2, '0');
}

function startTime(){ 
    tens++
    outPutTens.innerHTML = formatTime(tens);
    if(tens === 99){
        tens = 0;
        seconds++;
        outPutSeconds.innerHTML = formatTime(seconds);
        outPutTens.innerHTML = formatTime(tens);
    }
}
