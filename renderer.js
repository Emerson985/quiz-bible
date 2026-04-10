const MONEY_LADDER = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const SAFE_INDEXES = new Set([4, 9]);

const state = {
    verses: [],
    filteredVerses: [],
    currentIndex: -1,
    currentQuestion: null,
    gameRunning: false,
    guaranteedGain: 0,
    currentGain: 0,
    lifelines: {
        fifty: true,
        phone: true,
        audience: true
    },
    soundEnabled: true,
    audioContext: null,
    generiquePlaying: false,
    generiqueTimers: [],
    backgroundMusicTimer: null
};

const testamentSelect = document.getElementById("testament-select");
const soundToggle = document.getElementById("sound-toggle");
const startButton = document.getElementById("start-game");
const takeMoneyButton = document.getElementById("take-money");
const lifeline5050Button = document.getElementById("lifeline-5050");
const lifelinePhoneButton = document.getElementById("lifeline-phone");
const lifelineAudienceButton = document.getElementById("lifeline-audience");
const answerButtons = [0, 1, 2, 3].map((index) => document.getElementById(`answer-${index}`));
const roundLabel = document.getElementById("round-label");
const verseHint = document.getElementById("verse-hint");
const questionText = document.getElementById("question-text");
const hostMessage = document.getElementById("host-message");
const currentGain = document.getElementById("current-gain");
const verseCount = document.getElementById("verse-count");
const generiqueOverlay = document.getElementById("generique-overlay");
const generiqueLine = document.getElementById("generique-line");
const generiqueSubline = document.getElementById("generique-subline");
const generiqueSkip = document.getElementById("generique-skip");
const replayGeneriqueButton = document.getElementById("replay-generique");
const gameOverBanner = document.getElementById("game-over-banner");
const gainWinBanner = document.getElementById("gain-win-banner");
const gainWinAmount = document.getElementById("gain-win-amount");
const newGameOverlay = document.getElementById("new-game-overlay");
const ngFallbackAmount = document.getElementById("ng-fallback-amount");
const ngRestartBtn = document.getElementById("ng-restart-btn");

let gainBannerTimer = null;
let newGameOverlayTimer = null;

function showNewGameOverlay(fallback) {
    const card = newGameOverlay.querySelector(".new-game-card");
    card.classList.remove("animate-in");
    void card.offsetWidth;
    card.classList.add("animate-in");
    ngFallbackAmount.innerText = formatMoney(fallback);
    newGameOverlay.classList.add("visible");
}

ngRestartBtn.addEventListener("click", () => {
    newGameOverlay.classList.remove("visible");
    startGame();
});

function hideGameOverBanner() {
    gameOverBanner.classList.remove("visible");
}

function showGameOverBanner() {
    gameOverBanner.classList.add("visible");
}

function showGainBanner(amount) {
    if (gainBannerTimer) {
        clearTimeout(gainBannerTimer);
        gainBannerTimer = null;
    }

    gainWinAmount.innerText = `+${formatMoney(amount)}`;
    gainWinBanner.classList.add("visible");

    gainBannerTimer = setTimeout(() => {
        gainWinBanner.classList.remove("visible");
    }, 1400);
}

function normaliserTexte(texte) {
    return (texte || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9: ]/g, " ")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function estNouveauTestament(verse) {
    return verse.book >= 40;
}

function formatMoney(value) {
    return `$${value.toLocaleString("en-US")}`;
}

function ensureAudioContext() {
    if (!state.soundEnabled) {
        return null;
    }

    if (!state.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            return null;
        }
        state.audioContext = new AudioCtx();
    }

    if (state.audioContext.state === "suspended") {
        state.audioContext.resume().catch(() => {});
    }

    return state.audioContext;
}

function playTone(type) {
    if (!state.soundEnabled) {
        return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) {
        return;
    }

    const now = ctx.currentTime;
    const patterns = {
        lock: [400, 450],
        correct: [500, 650, 800],
        gain: [620, 740, 930, 1180],
        wrong: [350, 260, 180],
        win: [420, 540, 680, 860]
    };

    const pattern = patterns[type];
    if (!pattern) {
        return;
    }

    pattern.forEach((freq, idx) => {
        const start = now + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.09);
    });
}

function playBackgroundPhrase() {
    if (!state.soundEnabled) {
        return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) {
        return;
    }

    const now = ctx.currentTime;
    const beat = 0.46;

    function note(freq, start, len, volume, wave = "sine") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.03, len * 0.25));
        gain.gain.exponentialRampToValueAtTime(0.0001, start + len);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + len + 0.04);
    }

    // Pulse discret pour garder le suspense sans saturer.
    for (let i = 0; i < 10; i++) {
        const t = now + i * beat;
        note(293.66, t, 0.05, 0.015, "triangle");
    }

    // Mélodie simple, sombre et plus propre.
    note(293.66, now + beat * 0,  beat * 1.1, 0.04, "sine");
    note(349.23, now + beat * 1,  beat * 1.1, 0.045, "sine");
    note(440.0,  now + beat * 2,  beat * 1.1, 0.048, "sine");
    note(392.0,  now + beat * 3,  beat * 1.0, 0.044, "sine");
    note(349.23, now + beat * 4,  beat * 1.1, 0.045, "sine");
    note(293.66, now + beat * 5,  beat * 1.3, 0.05, "sine");

    // Fond harmonique léger.
    note(146.83, now,            beat * 3.2, 0.016, "triangle");
    note(220.0,  now + beat * 3, beat * 3.0, 0.014, "triangle");
}

function stopBackgroundMusic() {
    if (state.backgroundMusicTimer) {
        clearInterval(state.backgroundMusicTimer);
        state.backgroundMusicTimer = null;
    }
}

function startBackgroundMusic() {
    if (!state.soundEnabled || state.backgroundMusicTimer) {
        return;
    }

    playBackgroundPhrase();
    state.backgroundMusicTimer = setInterval(() => {
        if (!state.gameRunning || !state.soundEnabled) {
            stopBackgroundMusic();
            return;
        }
        playBackgroundPhrase();
    }, 2600);
}

function clearGeneriqueTimers() {
    state.generiqueTimers.forEach((timer) => clearTimeout(timer));
    state.generiqueTimers = [];
}

function playGeneriqueMusic() {
    if (!state.soundEnabled) {
        return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) {
        return;
    }

    const now = ctx.currentTime;

    const lead = [262, 330, 392, 523, 466, 587, 698, 784];
    const bass = [131, 131, 147, 147, 165, 165, 196, 196];

    for (let i = 0; i < lead.length; i += 1) {
        const start = now + i * 0.24;

        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = "sawtooth";
        leadOsc.frequency.setValueAtTime(lead[i], start);
        leadGain.gain.setValueAtTime(0.0001, start);
        leadGain.gain.exponentialRampToValueAtTime(0.14, start + 0.03);
        leadGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
        leadOsc.connect(leadGain);
        leadGain.connect(ctx.destination);
        leadOsc.start(start);
        leadOsc.stop(start + 0.24);

        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = "triangle";
        bassOsc.frequency.setValueAtTime(bass[i], start);
        bassGain.gain.setValueAtTime(0.0001, start);
        bassGain.gain.exponentialRampToValueAtTime(0.08, start + 0.03);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.23);
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(start);
        bassOsc.stop(start + 0.24);
    }

    // Two strong impact pulses to imitate TV-show stingers.
    [now + 1.2, now + 2.2].forEach((impactStart) => {
        const impactOsc = ctx.createOscillator();
        const impactGain = ctx.createGain();
        impactOsc.type = "square";
        impactOsc.frequency.setValueAtTime(90, impactStart);
        impactOsc.frequency.exponentialRampToValueAtTime(55, impactStart + 0.26);
        impactGain.gain.setValueAtTime(0.0001, impactStart);
        impactGain.gain.exponentialRampToValueAtTime(0.22, impactStart + 0.03);
        impactGain.gain.exponentialRampToValueAtTime(0.0001, impactStart + 0.28);
        impactOsc.connect(impactGain);
        impactGain.connect(ctx.destination);
        impactOsc.start(impactStart);
        impactOsc.stop(impactStart + 0.3);
    });
}

function fermerGenerique() {
    state.generiquePlaying = false;
    clearGeneriqueTimers();
    generiqueOverlay.classList.remove("visible");

    if (state.gameRunning) {
        startBackgroundMusic();
    }
}

function lancerGenerique() {
    if (state.generiquePlaying) {
        return;
    }

    state.generiquePlaying = true;
    clearGeneriqueTimers();
    generiqueOverlay.classList.add("visible");
    generiqueLine.innerText = "Qui Veut Gagner Des Millions";
    generiqueSubline.innerText = "Edition Biblique";
    playGeneriqueMusic();

    state.generiqueTimers.push(setTimeout(() => {
        generiqueLine.innerText = "15 Questions, 3 Jokers";
        generiqueSubline.innerText = "Et peut-etre le million";
    }, 1800));

    state.generiqueTimers.push(setTimeout(() => {
        generiqueLine.innerText = "Que le jeu commence";
        generiqueSubline.innerText = "Appuyez sur Commencer";
    }, 3600));

    state.generiqueTimers.push(setTimeout(() => {
        fermerGenerique();
    }, 5600));
}

function shuffle(list) {
    const data = [...list];
    for (let i = data.length - 1; i > 0; i -= 1) {
        const r = Math.floor(Math.random() * (i + 1));
        [data[i], data[r]] = [data[r], data[i]];
    }
    return data;
}

function uniqueBookNames() {
    return [...new Set(state.filteredVerses.map((verse) => verse.book_name))];
}

function buildBookQuestion(verse) {
    const books = uniqueBookNames().filter((name) => name !== verse.book_name);
    const wrong = shuffle(books).slice(0, 3);
    const options = shuffle([verse.book_name, ...wrong]);

    return {
        prompt: "Dans quel livre se trouve ce verset ?",
        verseHint: verse.text,
        options,
        correctIndex: options.indexOf(verse.book_name)
    };
}

function buildReferenceQuestion(verse) {
    const correct = `${verse.book_name} ${verse.chapter}:${verse.verse}`;
    const wrongSet = new Set();

    while (wrongSet.size < 3) {
        const chapter = Math.max(1, verse.chapter + Math.floor(Math.random() * 8) - 4);
        const verseNum = Math.max(1, verse.verse + Math.floor(Math.random() * 12) - 6);
        const ref = `${verse.book_name} ${chapter}:${verseNum}`;
        if (normaliserTexte(ref) !== normaliserTexte(correct)) {
            wrongSet.add(ref);
        }
    }

    const options = shuffle([correct, ...wrongSet]);

    return {
        prompt: `Quelle est la référence de ce verset dans ${verse.book_name} ?`,
        verseHint: verse.text,
        options,
        correctIndex: options.indexOf(correct)
    };
}

function buildQuestion() {
    const verse = state.filteredVerses[Math.floor(Math.random() * state.filteredVerses.length)];
    const generator = Math.random() > 0.45 ? buildBookQuestion : buildReferenceQuestion;
    return generator(verse);
}

function setAnswerButtonsEnabled(enabled) {
    answerButtons.forEach((btn) => {
        if (!btn.classList.contains("hidden-by-fifty")) {
            btn.disabled = !enabled;
        }
    });
}

function clearAnswerStyles() {
    answerButtons.forEach((btn) => {
        btn.classList.remove("correct", "wrong", "hidden-by-fifty");
        btn.style.visibility = "visible";
    });
}

function updateLifelineButtons() {
    lifeline5050Button.disabled = !state.gameRunning || !state.lifelines.fifty;
    lifelinePhoneButton.disabled = !state.gameRunning || !state.lifelines.phone;
    lifelineAudienceButton.disabled = !state.gameRunning || !state.lifelines.audience;
}

function renderLadder() {
    if (currentGain) {
        currentGain.innerText = formatMoney(state.currentGain);
    }
}

function updateStatusMessage(message) {
    hostMessage.innerHTML = message;
}

function showQuestion() {
    clearAnswerStyles();
    state.currentQuestion = buildQuestion();
    roundLabel.innerText = `Question ${state.currentIndex + 1}`;
    verseHint.innerText = state.currentQuestion.verseHint;
    questionText.innerText = state.currentQuestion.prompt;

    answerButtons.forEach((btn, idx) => {
        const label = btn.querySelector("strong");
        label.innerText = state.currentQuestion.options[idx];
        btn.disabled = false;
    });

    updateLifelineButtons();
    renderLadder();
    updateStatusMessage("Choisis une réponse, ou utilise un joker.");
}

function getGuaranteedGain(index) {
    let guaranteed = 0;
    SAFE_INDEXES.forEach((safeIdx) => {
        if (index >= safeIdx) {
            guaranteed = MONEY_LADDER[safeIdx];
        }
    });
    return guaranteed;
}

function endGame(message, wonAmount, showHostMessage = true) {
    state.gameRunning = false;
    stopBackgroundMusic();
    setAnswerButtonsEnabled(false);
    updateLifelineButtons();
    state.currentGain = wonAmount;
    renderLadder();
    if (showHostMessage) {
        updateStatusMessage(message);
    }
}

function moveNextQuestion() {
    state.currentIndex += 1;
    if (state.currentIndex >= MONEY_LADDER.length) {
        playTone("win");
        endGame("Incroyable. Tu as gagné le million !", MONEY_LADDER[MONEY_LADDER.length - 1]);
        questionText.innerText = "Victoire totale !";
        verseHint.innerText = "Tu as répondu correctement à toutes les questions.";
        return;
    }

    showQuestion();
}

function lockAnswer(index) {
    if (!state.gameRunning || !state.currentQuestion) {
        return;
    }

    setAnswerButtonsEnabled(false);
    playTone("lock");

    const correct = state.currentQuestion.correctIndex;
    const selectedButton = answerButtons[index];
    const correctButton = answerButtons[correct];

    setTimeout(() => {
        if (index === correct) {
            selectedButton.classList.add("correct");
            const wonNow = MONEY_LADDER[state.currentIndex];
            state.currentGain = wonNow;
            state.guaranteedGain = getGuaranteedGain(state.currentIndex);
            updateStatusMessage(`Bonne réponse ! Gain actuel: ${formatMoney(state.currentGain)}`);
            showGainBanner(wonNow);
            playTone("gain");

            setTimeout(() => {
                moveNextQuestion();
            }, 1000);
            return;
        }

        selectedButton.classList.add("wrong");
        correctButton.classList.add("correct");
        playTone("wrong");
        const fallback = state.guaranteedGain;
        showGameOverBanner();
        questionText.innerText = "GAME OVER";
        verseHint.innerText = "La bonne réponse est affichée en vert.";
        endGame(`GAME OVER. Mauvaise réponse. Tu repars avec ${formatMoney(fallback)}.`, fallback, false);
        newGameOverlayTimer = setTimeout(() => showNewGameOverlay(fallback), 1800);
    }, 700);
}

function applyFiftyFifty() {
    if (!state.gameRunning || !state.lifelines.fifty) {
        return;
    }

    state.lifelines.fifty = false;
    const correct = state.currentQuestion.correctIndex;
    const wrongIndexes = [0, 1, 2, 3].filter((index) => index !== correct);
    const toHide = shuffle(wrongIndexes).slice(0, 2);

    toHide.forEach((index) => {
        const btn = answerButtons[index];
        btn.classList.add("hidden-by-fifty");
        btn.style.visibility = "hidden";
        btn.disabled = true;
    });

    updateLifelineButtons();
    updateStatusMessage("Joker 50:50 utilisé. Deux mauvaises réponses retirées.");
}

function applyPhone() {
    if (!state.gameRunning || !state.lifelines.phone) {
        return;
    }

    state.lifelines.phone = false;
    const correct = state.currentQuestion.correctIndex;
    const confidence = Math.random() > 0.25 ? 90 : 60;
    const letter = ["A", "B", "C", "D"][correct];
    updateLifelineButtons();
    updateStatusMessage(`Ton ami pense que c'est ${letter} avec ${confidence}% de certitude.`);
}

function applyAudience() {
    if (!state.gameRunning || !state.lifelines.audience) {
        return;
    }

    state.lifelines.audience = false;
    const correct = state.currentQuestion.correctIndex;
    const base = [12, 16, 21, 24];
    base[correct] = 100 - (base.reduce((sum, value) => sum + value, 0) - base[correct]);
    const letters = ["A", "B", "C", "D"];
    const poll = letters.map((letter, idx) => `${letter}: ${base[idx]}%`).join(" | ");
    updateLifelineButtons();
    updateStatusMessage(`Vote du public: ${poll}`);
}

function filterVerses() {
    const selection = testamentSelect.value;

    if (selection === "old") {
        state.filteredVerses = state.verses.filter((verse) => !estNouveauTestament(verse));
        return;
    }

    if (selection === "new") {
        state.filteredVerses = state.verses.filter(estNouveauTestament);
        return;
    }

    state.filteredVerses = [...state.verses];
}

function startGame() {
    if (state.generiquePlaying) {
        return;
    }

    filterVerses();

    if (state.filteredVerses.length < 100) {
        updateStatusMessage("Pas assez de versets dans cette sélection.");
        return;
    }

    state.gameRunning = true;
    state.currentIndex = -1;
    state.guaranteedGain = 0;
    state.currentGain = 0;
    state.lifelines = { fifty: true, phone: true, audience: true };
    hideGameOverBanner();
    gainWinBanner.classList.remove("visible");
    newGameOverlay.classList.remove("visible");
    if (newGameOverlayTimer) { clearTimeout(newGameOverlayTimer); newGameOverlayTimer = null; }
    clearAnswerStyles();
    updateLifelineButtons();
    startBackgroundMusic();
    moveNextQuestion();
}

function takeMoney() {
    if (!state.gameRunning) {
        return;
    }

    playTone("win");
    stopBackgroundMusic();
    endGame(`Tu as choisi d'encaisser ${formatMoney(state.currentGain)}.`, state.currentGain);
}

async function loadData() {
    if (typeof require === "function") {
        try {
            return require("./data/segond_1910.json");
        } catch (error) {
            // Continue to fetch fallback for browser mode.
        }
    }

    const response = await fetch("./data/segond_1910.json", { cache: "no-cache" });
    if (!response.ok) {
        throw new Error("Impossible de charger la base biblique.");
    }
    return response.json();
}

function registerEvents() {
    answerButtons.forEach((btn, idx) => {
        btn.addEventListener("click", () => lockAnswer(idx));
    });

    lifeline5050Button.addEventListener("click", applyFiftyFifty);
    lifelinePhoneButton.addEventListener("click", applyPhone);
    lifelineAudienceButton.addEventListener("click", applyAudience);
    startButton.addEventListener("click", startGame);
    takeMoneyButton.addEventListener("click", takeMoney);
    generiqueSkip.addEventListener("click", fermerGenerique);
    replayGeneriqueButton.addEventListener("click", lancerGenerique);

    soundToggle.addEventListener("change", () => {
        state.soundEnabled = soundToggle.checked;
        if (state.soundEnabled) {
            ensureAudioContext();
            if (state.gameRunning) {
                startBackgroundMusic();
            }
        } else {
            stopBackgroundMusic();
        }
    });
}

async function init() {
    try {
        hideGameOverBanner();
        const bible = await loadData();
        state.verses = bible.verses;
        verseCount.innerText = state.verses.length.toLocaleString("fr-FR");
        registerEvents();
        renderLadder();
        updateLifelineButtons();
        lancerGenerique();
    } catch (error) {
        updateStatusMessage(`Erreur: ${error.message}`);
        questionText.innerText = "Le jeu ne peut pas démarrer sans les données bibliques.";
    }
}

init();
