const notes = [
  { symbol: "𝅝", name: "ตัวกลม" },
  { symbol: "𝅗𝅥", name: "ตัวขาว" },
  { symbol: "♩", name: "ตัวดำ" },
  { symbol: "♪", name: "ตัวเขบ็ต" }
];

let currentNote;
let score = 0;
let questionNumber = 1;
const totalQuestions = 15;
let canAnswer = true;

// === SOUND EFFECT ===
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = (type === "correct") ? 800 : 200;
  gain.gain.value = 0.2;

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}
// ====================

function setButtonsDisabled(state) {
  document.querySelectorAll(".buttons button").forEach(btn => {
    btn.disabled = state;
  });
}

function newNote() {
  if (questionNumber > totalQuestions) {
    endGame();
    return;
  }

  currentNote = notes[Math.floor(Math.random() * notes.length)];
  document.getElementById("note").textContent = currentNote.symbol;
  document.getElementById("result").textContent = "";
  document.getElementById("question").textContent =
    "ข้อที่ " + questionNumber + " / " + totalQuestions;

  canAnswer = true;
  setButtonsDisabled(false); // 🔓 เปิดปุ่ม
}

function checkAnswer(answer) {
  if (!canAnswer) return;

  canAnswer = false;
  setButtonsDisabled(true); // 🔒 ปิดปุ่มทันที

  const result = document.getElementById("result");

  if (answer === currentNote.name) {
    result.textContent = "🎉 ถูกต้อง!";
    result.style.color = "#2e7d32";
    score++;
    playSound("correct");
  } else {
    result.textContent = "❌ ผิด! คำตอบคือ " + currentNote.name;
    result.style.color = "#c62828";
    playSound("wrong");
  }

  document.getElementById("score").textContent = "คะแนน: " + score;
  questionNumber++;

  setTimeout(newNote, 1000);
}

function endGame() {
  document.getElementById("note").textContent = "🎓";
  document.getElementById("result").textContent =
    "จบเกม! ได้ " + score + " จาก " + totalQuestions + " คะแนน";
  document.getElementById("result").style.color = "#1565c0";

  document.getElementById("restartBtn").style.display = "inline-block";
  setButtonsDisabled(true);
}

function restartGame() {
  score = 0;
  questionNumber = 1;
  canAnswer = true;

  document.getElementById("score").textContent = "คะแนน: 0";
  document.getElementById("restartBtn").style.display = "none";

  newNote();
}

newNote();
