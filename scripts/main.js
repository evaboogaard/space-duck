const bodyEl = document.querySelector('body');

document.addEventListener('DOMContentLoaded', function () {
    const bodyEl = document.querySelector('body');
    const djButton = document.querySelector('button.music');
    const djAudio = new Audio('audio/music.mp3');
    const audioBars = document.getElementById('audioBars');
    const allSpeakers = document.querySelectorAll(
        '.speaker .big, .speaker .small'
    );

    let audioContext, analyser, bufferLength, dataArray, animationFrameId;

    djButton.addEventListener('click', () => {
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

const blackholeButton = document.querySelector('button.blackhole');
const blackholeAudio = new Audio('audio/blackhole.mp3');
const quackAudio = new Audio('audio/quack.mp3');

let audioTimeout;
let quackInterval; // Variable to store the interval ID
let quackCount = 0;

blackholeButton.addEventListener('click', () => {
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

const sunButton = document.querySelector('button.sun');

sunButton.addEventListener('click', () => {
    bodyEl.classList.toggle('sun-state');
});

const reloadButton = document.querySelector('button.reload-page');

reloadButton.addEventListener('click', () => {
    location.reload();
});
