'use strict';
const nav_pomodoro = document.querySelector('.pomodoro');
const nav_short_break = document.querySelector('.short-break');
const nav_long_break = document.querySelector('.long-break');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnOpenModal = document.querySelector('.icon');
const btnCloseModal = document.querySelector('.close-modal');
const timerLabel = document.getElementById('timer_label');
const timerPause = document.querySelector('.timer_pause');
const shortInput = document.getElementById('shortInput');
const longInput = document.getElementById('longInput');
const pomodoroInput = document.getElementById('pomodoroInput');
const font1 = document.getElementById('font_1');
const font2 = document.getElementById('font_2');
const font3 = document.getElementById('font_3');
const apply = document.getElementById('apply-btn');
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnOpenModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
apply.addEventListener('click', closeModal);

const getSiblings = targetNode => {
  [...targetNode.parentNode.children].filter(
    siblings => siblings !== targetNode
  );
};
// declaring objects
const defaultLength = {
  pomodoro: 1500,
  short: 300,
  long: 900,
};
const btn_state = {
  pause: 'PAUSE',
  play: 'PLAY',
  start: 'START',
  reset: 'RESET',
  stop: 'STOP',
};
var currentLength = defaultLength;
let TIME_LIMIT;
// after windows loading
window.onload = () => {
  nav_pomodoro.classList.add('active');
  timerPause.innerText = btn_state.start;
  timerLabel.innerHTML = '25:00';
  TIME_LIMIT = currentLength.pomodoro;
  font1.classList.add('active');
};
nav_pomodoro.addEventListener('click', function () {
  nav_pomodoro.classList.add('active');
  nav_short_break.classList.remove('active');
  nav_long_break.classList.remove('active');
  timerLabel.innerHTML = '25:00';
  TIME_LIMIT = currentLength.pomodoro;
});
nav_long_break.addEventListener('click', function () {
  nav_long_break.classList.add('active');
  nav_pomodoro.classList.remove('active');
  nav_short_break.classList.remove('active');
  TIME_LIMIT = currentLength.long;
  timerLabel.innerHTML = '15:00';
});
nav_short_break.addEventListener('click', function () {
  nav_short_break.classList.add('active');
  nav_pomodoro.classList.remove('active');
  nav_long_break.classList.remove('active');
  TIME_LIMIT = currentLength.short;
  timerLabel.innerHTML = '5:00';
});
var currentLength = defaultLength;

let timePassed = 0; // initial time passed
let timeLeft = TIME_LIMIT;
let timerInterval = null;

const title = document.title;
let timeLeftWhenPaused = TIME_LIMIT;
let timePassedWhenPaused = 0;

//various timer functions

//formatin seconds into time
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
// start the timer function

const startTimer = () => {
  timerInterval = setInterval(() => {
    timerPause.innerText = btn_state.pause;

    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    timerLabel.innerHTML = formatTime(timeLeft);
    if (document.hidden) {
      document.title = `Remaining : ${formatTime(timeLeft)}`;
    } else {
      document.title = title;
    }
    if (timeLeft <= 0) {
      resetTimer();
    }
  }, 1000);
};
const pauseTimer = () => {
  timeLeftWhenPaused = timeLeft;
  timePassedWhenPaused = timePassed;
  clearInterval(timerInterval);
  timerPause.innerText = btn_state.play;
};
// reset the time
function resetTimer() {
  clearInterval(timerInterval); // inbuilt function
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  timerInterval = null;
  timerPause.innerText = btn_state.start;
}
const playTimer = () => {
  timeLeft = timeLeftWhenPaused;
  timePassed = timePassedWhenPaused;
  timerInterval = setInterval(() => {
    timerPause.innerText = btn_state.pause;

    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;

    timerLabel.innerHTML = formatTime(timeLeft);

    if (document.hidden) {
      document.title = `Remaining : ${formatTime(timeLeft)}  | ${title}`;
    } else {
      document.title = title;
    }

    if (timeLeft <= 0) {
      resetTimer();
    }
  }, 1000);
};

timerPause.addEventListener('click', function () {
  var currentState = timerPause.innerText;
  switch (currentState) {
    case btn_state.start:
      startTimer();
      break;
    case btn_state.pause:
      pauseTimer();
      break;
    case btn_state.play:
      playTimer();
      break;
  }
});

// settings

const updateLength = () => {
  let inputLength;
  currentLength.pomodoro = pomodoroInput.value * 60;
  currentLength.short = shortInput.value * 60;
  currentLength.long = longInput.value * 60;
  if (nav_pomodoro.classList.contains('active')) {
    inputLength = currentLength.pomodoro;
    TIME_LIMIT = currentLength.pomodoro;
  } else if (nav_short_break.classList.contains('active')) {
    inputLength = currentLength.short;
    TIME_LIMIT = currentLength.short;
  } else {
    inputLength = currentLength.long;
    TIME_LIMIT = currentLength.long;
  }
  timerLabel.innerHTML = formatTime(inputLength);
  resetTimer();
  console.log(currentLength);
};
// Change timer length
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('change', updateLength);
  input.addEventListener('input', updateLength);
  input.addEventListener('keyup', updateLength);
});

// change font settings

document.querySelectorAll('[data-font]').forEach(font => {
  font.addEventListener('click', e => {
    document.body.style.setProperty('--font', `"${e.target.dataset.font}"`);

    console.log(e.target.id);

    // getSiblings(e.target).forEach(siblings => {
    //   siblings.classList.remove('active');
    // });
    // e.target.classList.add('active');

    if (e.target.id === font2) {
      font1.classList.remove('active');
      font3.classList.remove('active');
    } else if (e.target.id === font3) {
      font1.classList.remove('active');
      font2.classList.remove('active');
    } else {
      font2.classList.remove('active');
      font3.classList.remove('active');
    }
    e.target.classList.add('active');
  });
});

// change the theme
document.querySelectorAll('[data-theme]').forEach(theme => {
  theme.addEventListener('click', e => {
    document.body.style.setProperty('--primary', e.target.dataset.theme);
    console.log(e.target);
    getSiblings(e.target).forEach(sibling => {
      sibling.classList.remove('active');
    });
    e.target.classList.add('active');
  });
});
