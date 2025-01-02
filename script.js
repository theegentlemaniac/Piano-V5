const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheckbox = document.querySelector(".keys-checkbox input");
const sustainBtn = document.getElementById("sustain-btn");

let allkeys = [],
    isSustainActive = false, // To track sustain mode
    activeNotes = {}, // To keep track of notes that are currently playing
    audioInstances = {}; // To store audio instances for each key

const fadeOutDuration = 0.5; // Duration for fade-out in seconds

const playTune = (key) => {
    // If an audio instance for the key already exists, stop it first to avoid overlap
    if (audioInstances[key]) {
        audioInstances[key].pause();
        audioInstances[key].currentTime = 0;
    }

    // Create a new audio instance and play it
    const audio = new Audio(`tunes/${key}.wav`);
    audio.volume = volumeSlider.value; // Apply current volume
    audio.play();

    // Store the audio instance for sustain management
    audioInstances[key] = audio;

    // Highlight the key
    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    clickedKey.classList.add("active");
};

const stopTune = (key) => {
    // Stop the audio with a fade-out effect if sustain is not active
    if (!isSustainActive && audioInstances[key]) {
        const audio = audioInstances[key];
        const fadeInterval = setInterval(() => {
            if (audio.volume > 0) {
                audio.volume = Math.max(0, audio.volume - (volumeSlider.value / fadeOutDuration) * 0.1);
            } else {
                clearInterval(fadeInterval);
                audio.pause();
                audio.currentTime = 0;
                delete audioInstances[key]; // Remove reference to the audio instance
            }
        }, 50); // Adjust the interval for a smooth fade-out
    }

    // Remove key highlight
    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    if (clickedKey) clickedKey.classList.remove("active");
};

// Handle key press
const pressedKey = (e) => {
    if (allkeys.includes(e.key) && !activeNotes[e.key]) {
        playTune(e.key);
        activeNotes[e.key] = true; // Mark the key as active
    }
};

// Handle key release
const releasedKey = (e) => {
    if (allkeys.includes(e.key)) {
        stopTune(e.key);
        delete activeNotes[e.key]; // Mark the key as inactive
    }
};

// Toggle sustain mode
const toggleSustain = () => {
    isSustainActive = !isSustainActive;
    sustainBtn.classList.toggle("active");
    sustainBtn.textContent = isSustainActive ? "Sustain: On" : "Sustain: Off";
};

// Show or hide key labels
const showHideKeys = (e) => {
    pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

// Volume control
const handleVolume = (e) => {
    for (const key in audioInstances) {
        if (audioInstances[key]) {
            audioInstances[key].volume = e.target.value;
        }
    }
};

// Event Listeners for piano keys
pianoKeys.forEach((key) => {
    allkeys.push(key.dataset.key);
    key.addEventListener("mousedown", () => {
        playTune(key.dataset.key);
        activeNotes[key.dataset.key] = true;
    });
    key.addEventListener("mouseup", () => {
        stopTune(key.dataset.key);
        delete activeNotes[key.dataset.key];
    });
});

document.addEventListener("keydown", pressedKey);
document.addEventListener("keyup", releasedKey);
volumeSlider.addEventListener("input", handleVolume);
keysCheckbox.addEventListener("click", showHideKeys);
sustainBtn.addEventListener("click", toggleSustain);

// Dark mode toggle
const toggleButton = document.getElementById('toggle-theme');

toggleButton.addEventListener('click', () => {
    // Toggle dark mode on body and piano keys wrapper
    document.body.classList.toggle('dark-mode');
    document.querySelector('.wrapper').classList.toggle('dark-mode');
    document.querySelector('.piano-keys').classList.toggle('dark-mode');
});
