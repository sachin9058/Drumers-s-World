const drumSounds = {
  a: "sounds/tom-1.mp3",
  s: "sounds/tom-2.mp3",
  d: "sounds/tom-3.mp3",
  f: "sounds/tom-4.mp3",
  j: "sounds/snare.mp3",
  k: "sounds/crash.mp3",
  l: "sounds/kick-bass.mp3"
};

function playSound(key) {
  const soundFile = drumSounds[key];
  if (soundFile) {
    const audio = new Audio(soundFile);
    audio.play();
    animateButton(key);
    if (isRecording) {
      recordedKeys.push({ key, time: Date.now() - startTime });
    }
  }
}

function animateButton(key) {
  const button = document.querySelector(`.drum[data-key="${key}"]`);
  if (button) {
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 150);
  }
}

document.querySelectorAll(".drum").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-key");
    playSound(key);
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  playSound(key);
});

let isRecording = false;
let recordedKeys = [];
let startTime = 0;
let mediaRecorder;
let audioChunks = [];
let recordingInterval;
const maxRecordingTime = 60; 

const startBtn = document.getElementById("start-record");
const stopBtn = document.getElementById("stop-record");
const timerDisplay = document.getElementById("recording-timer");
const progressBar = document.getElementById("recording-progress");

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");
  timerDisplay.textContent = `⏱ ${mins}:${secs}`;

  const progress = Math.min((elapsed / maxRecordingTime) * 100, 100);
  progressBar.style.width = `${progress}%`;

  if (elapsed >= maxRecordingTime) {
    stopRecording();
  }
}

async function startRecording() {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    alert("Recording not supported.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = "drum-recording.webm";
      a.click();
    };

    mediaRecorder.start();
    isRecording = true;
    startTime = Date.now();
    recordedKeys = [];
    timerDisplay.textContent = "⏱ 00:00";
    progressBar.style.width = "0%";

    startBtn.disabled = true;
    stopBtn.disabled = false;

    recordingInterval = setInterval(updateTimer, 1000);
  } catch (err) {
    alert("Microphone access denied or error occurred.");
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }

  isRecording = false;
  clearInterval(recordingInterval);
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);

function playSound(key) {
  const soundFile = drumSounds[key];
  if (soundFile) {
    const audio = new Audio(soundFile);
    audio.play();
    animateButton(key);
    if (isRecording) {
      recordedKeys.push({ key, time: Date.now() - startTime });
    }
  }
}

function animateButton(key) {
  const button = document.querySelector(`.drum[data-key="${key}"]`);
  if (button) {
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 150);
  }
}

document.querySelectorAll(".drum").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-key");
    playSound(key);
  });
});

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  playSound(key);
});

const toggle = document.getElementById("darkToggle");


if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", toggle.checked);
  localStorage.setItem("theme", toggle.checked ? "dark" : "light");
});

