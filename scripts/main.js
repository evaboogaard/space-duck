const bodyEl = document.querySelector('body');
const djButton = document.querySelector('button.music');
const djAudio = new Audio('audio/music.mp3');
const audioBars = document.getElementById('audioBars');
const allSpeakers = document.querySelectorAll('.speaker .big, .speaker .small');
const blackholeButton = document.querySelector('button.blackhole');
const blackholeAudio = new Audio('audio/blackhole.mp3');
const quackAudio = new Audio('audio/quack.mp3');
const sunButton = document.querySelector('button.sun');
const sunAudio = new Audio('audio/sun.mp3');
let audioTimeout;
let quackInterval; // Variable to store the interval ID
let quackCount = 0;

function resetState() {
    bodyEl.classList.remove('music-state', 'black-hole-state', 'sun-state');
    djAudio.pause();
    blackholeAudio.pause();
    quackAudio.pause();
    sunAudio.pause();
    clearInterval(quackInterval);
    quackCount = 0;
    clearTimeout(audioTimeout);
}

document.addEventListener('DOMContentLoaded', function () {
    let audioContext, analyser, bufferLength, dataArray, animationFrameId;

    djButton.addEventListener('click', () => {
        resetState();
        bodyEl.classList.toggle('music-state');

        if (bodyEl.classList.contains('music-state')) {
            initAudioBars();
            djAudio.play();
            animateAudioBars();
        } else {
            cancelAnimationFrame(animationFrameId);
            djAudio.pause();
        }
    });

    function initAudioBars() {
        if (audioContext) {
            audioContext.close().then(() => {
                audioContext = new (window.AudioContext ||
                    window.webkitAudioContext)();
                createAudioAnalyser();
            });
        } else {
            audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
            createAudioAnalyser();
        }
    }

    function createAudioAnalyser() {
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(djAudio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        audioBars.innerHTML = '';

        for (let i = 0; i < bufferLength; i++) {
            const bar = document.createElement('div');
            bar.classList.add('audio-bar');
            audioBars.appendChild(bar);
        }
    }

    function animateAudioBars() {
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < bufferLength; i++) {
            const amplitude = dataArray[i] / 2;
            const shade = Math.floor((amplitude / 128) * 128);
            const redComponent = Math.floor((amplitude / 128) * 127);

            const bar = audioBars.children[i];
            bar.style.backgroundColor = `rgb(${
                redComponent + 128
            }, ${shade}, ${shade})`;
            bar.style.height = amplitude + 'px';

            // Scale the speakers based on the loudness
            if (i % 4 === 0) {
                const scaleFactor = 0.5 + (amplitude / 128) * 0.7; // Scale factor between 0.5 and 1.2
                const speakerIndex = i / 4;
                const speaker = allSpeakers[speakerIndex];

                if (speaker) {
                    speaker.style.transform = `scale(${scaleFactor})`;
                }
            }
        }

        animationFrameId = requestAnimationFrame(animateAudioBars);
    }
});

blackholeButton.addEventListener('click', () => {
    resetState();
    bodyEl.classList.toggle('black-hole-state');

    if (bodyEl.classList.contains('black-hole-state')) {
        // Play blackhole audio
        blackholeAudio.play();

        // Set interval to play quack audio every 3 seconds
        quackInterval = setInterval(() => {
            quackAudio.currentTime = 0;
            quackAudio.play();
            quackCount++;

            // Stop playing quack after 3 times
            if (quackCount >= 3) {
                clearInterval(quackInterval);
                quackCount = 0;
            }
        }, 3000);

        // Set a timeout to stop both audios after 15 seconds
        audioTimeout = setTimeout(() => {
            clearInterval(quackInterval);
            quackCount = 0;

            quackAudio.pause();
            quackAudio.currentTime = 0; // Reset the quack audio to the beginning
        }, 15000); // 15 seconds in milliseconds
    } else {
        clearInterval(quackInterval);
        quackCount = 0;

        quackAudio.pause();
        quackAudio.currentTime = 0; // Reset the quack audio to the beginning
    }
});

sunButton.addEventListener('click', () => {
    resetState();
    bodyEl.classList.toggle('sun-state');
    sunAudio.play();
});

const reloadButton = document.querySelector('button.reload-page');

reloadButton.addEventListener('click', () => {
    location.reload();
});

// Functie om de loader aan te sturen
function runLoader() {
    const loaderElement = document.getElementById('percentage');
    const totalTime = 10000; // Totaal aantal milliseconden
    const updateInterval = 100; // Interval om het percentage bij te werken

    let currentTime = 0;

    const updatePercentage = () => {
        const percentage = Math.min((currentTime / totalTime) * 100, 100);
        loaderElement.textContent = `${percentage.toFixed(0)}%`;
    };

    const loaderInterval = setInterval(() => {
        currentTime += updateInterval;

        if (currentTime <= totalTime) {
            updatePercentage();
        } else {
            clearInterval(loaderInterval);
        }
    }, updateInterval);
}

// Start de loader wanneer het document is geladen
document.addEventListener('DOMContentLoaded', () => {
    runLoader();
});

document.addEventListener('DOMContentLoaded', function () {
    // Wait for the document to be fully loaded
    setTimeout(function () {
        // Get the loader element
        var loader = document.querySelector('.loader');

        // Add a class to hide the loader
        loader.classList.add('hidden');

        // Add another timeout to add 'none' class after 1 second (1000 milliseconds)
        setTimeout(function () {
            loader.classList.add('none');
        }, 1000);
    }, 12000); // 12 seconds in milliseconds
});

const buttons = document.querySelectorAll('.button-wrapper button');

buttons.forEach((button) => {
    button.addEventListener('mouseover', () => {
        buttons.forEach((otherButton) => {
            if (otherButton !== button) {
                otherButton.style.transform = 'scale(0.8)';
            }
        });
    });

    button.addEventListener('mouseout', () => {
        buttons.forEach((otherButton) => {
            if (otherButton !== button) {
                otherButton.style.transform = 'scale(1)';
            }
        });
    });
});
