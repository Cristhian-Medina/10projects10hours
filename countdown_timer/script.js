const bodyEl = document.querySelector('body');

const daysEl = document.querySelector('#days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secondsEl = document.getElementById('seconds');

// date next year
const newYears = '1 Jan 2022';

const countdown = () => {
    const newYearsDate = new Date(newYears);
    const currentDate = new Date();
    
    const totalSeconds = (newYearsDate - currentDate) / 1000;
    
    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    // change background for new year
    if (days <= 1) {
        bodyEl.style.background = 'url(img02.jpg) center no-repeat';
        bodyEl.style.color = '#eee';
        bodyEl.style.textShadow = '2px 2px 7px #1a1a1a';
    }
    
    daysEl.innerText = days;
    hoursEl.innerText = formatTime(hours);
    minsEl.innerText = formatTime(mins);
    secondsEl.innerText = formatTime(seconds);
}

const formatTime = time => time < 10 ? `0${time}` : time;

// initial call
countdown();

setInterval(countdown, 1000);