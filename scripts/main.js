document.addEventListener('DOMContentLoaded', function () {
    const djButton = document.querySelector('button.music');
    const bodyEl = document.querySelector('body');
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
