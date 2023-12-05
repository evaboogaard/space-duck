const bodyEl = document.querySelector('body');

document.addEventListener('DOMContentLoaded', function () {
    const djButton = document.querySelector('button.music');
    const djAudio = new Audio('audio/interstellar_remix.mp3');
    const audioBars = document.getElementById('audioBars'); // Assuming you have an element with id 'audioBars'

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
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(djAudio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Create audio bars
        audioBars.innerHTML = ''; // Clear existing bars
        for (let i = 0; i < bufferLength; i++) {
            const bar = document.createElement('div');
            bar.classList.add('audio-bar');
            audioBars.appendChild(bar);
        }
    }

    function animateAudioBars() {
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < bufferLength; i++) {
            const bar = audioBars.children[i];
            const amplitude = dataArray[i] / 2; // Scale down for better visualization
            const shade = Math.floor((amplitude / 128) * 128); // Map amplitude to a shade of grey (adjust as needed)
            const blueComponent = Math.floor((amplitude / 128) * 127); // Map amplitude to a shade of blue (adjust as needed)

            // Set the background color with an RGB value using a mix of grey and blue
            bar.style.backgroundColor = `rgb(${shade}, ${shade}, ${
                blueComponent + 128
            })`;
            bar.style.height = amplitude + 'px';
        }

        animationFrameId = requestAnimationFrame(animateAudioBars);
    }
});

const blackholeButton = document.querySelector('button.blackhole');
const blackholeAudio = new Audio('audio/blackhole.mp3');

// Set the loop property to true

let audioTimeout;

blackholeButton.addEventListener('click', () => {
    bodyEl.classList.toggle('black-hole-state');

    if (bodyEl.classList.contains('black-hole-state')) {
        blackholeAudio.play();
        // Set a timeout to stop the audio after 15 seconds
        audioTimeout = setTimeout(() => {
            blackholeAudio.pause();
            blackholeAudio.currentTime = 0; // Reset the audio to the beginning
        }, 15000); // 15 seconds in milliseconds
    } else {
        blackholeAudio.pause();
        // Clear the timeout if the black hole state is deactivated before 15 seconds
        clearTimeout(audioTimeout);
    }
});
