
 const SERIE_TARGET = 5;
const POINTS_PER_SERIE = 100;
const WIN_SCORE = 1000;
const AI_STORAGE_KEY = "quiz-bible-ai-config";
const AI_REQUEST_TIMEOUT_MS = 9000;

const DEFAULT_AI_CONFIG = {
    enabled: false,
    apiKey: "",
    model: "gemini-2.0-flash",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
};

const DIFFICULTY_CONFIG = {
    easy: { label: "Facile", totalQuestions: 10, level: 1 },
    medium: { label: "Moyen", totalQuestions: 12, level: 2 },
    hard: { label: "Difficile", totalQuestions: 15, level: 3 },
    "very-hard": { label: "Tres difficile", totalQuestions: 18, level: 4 }
};

const DIFFICULTY_ORDER = ["easy", "medium", "hard", "very-hard"];

const CHARACTER_FACTS = [
    { name: "Moise", role: "le conducteur d'Israel hors d'Egypte", action: "a recu les dix commandements", difficulty: 1, testament: "old" },
    { name: "Noe", role: "le constructeur de l'arche", action: "a survecu au deluge", difficulty: 1, testament: "old" },
    { name: "David", role: "le roi berger qui a vaincu Goliath", action: "a vaincu Goliath", difficulty: 1, testament: "old" },
    { name: "Salomon", role: "le roi connu pour sa sagesse", action: "a construit le premier temple", difficulty: 1, testament: "old" },
    { name: "Esther", role: "la reine qui a protege son peuple", action: "a intercede devant le roi", difficulty: 2, testament: "old" },
    { name: "Daniel", role: "le prophete reste fidele en exil", action: "a ete jete dans la fosse aux lions", difficulty: 2, testament: "old" },
    { name: "Elie", role: "le prophete du feu sur le mont Carmel", action: "a confronte les prophetes de Baal", difficulty: 2, testament: "old" },
    { name: "Jonas", role: "le prophete envoye a Ninive", action: "a ete avale par un grand poisson", difficulty: 2, testament: "old" },
    { name: "Pierre", role: "l'apotre qui a renie puis affirme sa foi", action: "a renie Jesus trois fois", difficulty: 2, testament: "new" },
    { name: "Paul", role: "l'apotre missionnaire des nations", action: "a ecrit de nombreuses epitres", difficulty: 2, testament: "new" },
    { name: "Josue", role: "le successeur de Moise", action: "a mene Israel a Jericho", difficulty: 3, testament: "old" },
    { name: "Nehemie", role: "le rebatisseur des murailles de Jerusalem", action: "a reconstruit les murailles", difficulty: 3, testament: "old" },
    { name: "Debora", role: "la juge et prophetesse d'Israel", action: "a conduit Israel avec Barak", difficulty: 3, testament: "old" },
    { name: "Barnabas", role: "le compagnon encourageant de Paul", action: "a accompagne Paul en mission", difficulty: 3, testament: "new" },
    { name: "Timothee", role: "le jeune responsable forme par Paul", action: "a recu des lettres pastorales", difficulty: 3, testament: "new" },
    { name: "Melchisedek", role: "le roi-sacrificateur de Salem", action: "a beni Abraham", difficulty: 4, testament: "old" },
    { name: "Apollos", role: "l'orateur eloquent instruit dans les Ecritures", action: "a enseigne avec puissance", difficulty: 4, testament: "new" },
    { name: "Onesime", role: "l'esclave devenu frere en Christ", action: "est mentionne dans l'epitre a Philemon", difficulty: 4, testament: "new" }
];

const EVENT_FACTS = [
    { event: "la chute des murailles de Jericho", who: "Josue", where: "Jericho", difficulty: 2, testament: "old" },
    { event: "la traversee de la mer Rouge", who: "Moise", where: "mer Rouge", difficulty: 1, testament: "old" },
    { event: "la naissance de Jesus", who: "Jesus", where: "Bethleem", difficulty: 1, testament: "new" },
    { event: "la Pentecote", who: "les apotres", where: "Jerusalem", difficulty: 2, testament: "new" },
    { event: "la reconstruction des murailles", who: "Nehemie", where: "Jerusalem", difficulty: 3, testament: "old" },
    { event: "la vision des ossements desseches", who: "Ezechiel", where: "Babylone", difficulty: 4, testament: "old" }
];

const RELATION_QUESTIONS = [
    {
        prompt: "Qui etait le pere de Jean-Baptiste ?",
        correct: "Zacharie",
        options: ["Zacharie", "Simeon", "Eli", "Gamaliel"],
        difficulty: 3,
        testament: "new"
    },
    {
        prompt: "Quel disciple etait surnomme le jumeau ?",
        correct: "Thomas",
        options: ["Thomas", "Philippe", "Andre", "Matthieu"],
        difficulty: 3,
        testament: "new"
    },
    {
        prompt: "Qui succeda a Elie dans le ministere prophetique ?",
        correct: "Elisee",
        options: ["Elisee", "Esaie", "Jeremie", "Osee"],
        difficulty: 4,
        testament: "old"
    },
    {
        prompt: "Dans quel livre trouve-t-on principalement la sagesse de Salomon ?",
        correct: "Proverbes",
        options: ["Proverbes", "Exode", "Nehemie", "Aggee"],
        difficulty: 4,
        testament: "old"
    }
];

const TERM_MEANING_QUESTIONS = [
    {
        prompt: "Que signifie l'expression Ichabod ?",
        correct: "La gloire s'est retiree",
        options: ["La gloire s'est retiree", "L'Eternel pourvoira", "Dieu est ma lumiere", "Paix soit sur toi"],
        difficulty: 2,
        testament: "old"
    },
    {
        prompt: "Que signifie Jehovah Jireh ?",
        correct: "L'Eternel pourvoira",
        options: ["L'Eternel pourvoira", "L'Eternel est paix", "L'Eternel guerit", "L'Eternel est ma banniere"],
        difficulty: 2,
        testament: "old"
    },
    {
        prompt: "Que signifie Emmanuel ?",
        correct: "Dieu avec nous",
        options: ["Dieu avec nous", "Dieu est juge", "Dieu console", "Dieu se souvient"],
        difficulty: 1,
        testament: "all"
    },
    {
        prompt: "Que signifie Ebenezer dans le contexte biblique ?",
        correct: "Pierre de secours",
        options: ["Pierre de secours", "Maison de paix", "Porte de grace", "Temple de louange"],
        difficulty: 3,
        testament: "old"
    },
    {
        prompt: "Que signifie Bethel ?",
        correct: "Maison de Dieu",
        options: ["Maison de Dieu", "Montagne sainte", "Ville du roi", "Source de vie"],
        difficulty: 2,
        testament: "old"
    },
    {
        prompt: "Que signifie Golgotha ?",
        correct: "Lieu du crane",
        options: ["Lieu du crane", "Lieu du sacrifice", "Lieu de la resurrection", "Lieu des prophetes"],
        difficulty: 3,
        testament: "new"
    },
    {
        prompt: "Que signifie Maranatha ?",
        correct: "Notre Seigneur vient",
        options: ["Notre Seigneur vient", "Dieu est amour", "Louange au Roi", "Esprit de verite"],
        difficulty: 4,
        testament: "new"
    }
];

const state = {
    verses: [],
    filteredVerses: [],
    currentIndex: -1,
    currentQuestion: null,
    gameRunning: false,
    score: 0,
    streak: 0,
    targetQuestions: DIFFICULTY_CONFIG["very-hard"].totalQuestions,
    difficulty: "easy",
    localAIEnabled: true,
    lifelines: {
        fifty: true,
        phone: true,
        audience: true
    },
    soundEnabled: true,
    audioContext: null,
    generiquePlaying: false,
    generiqueTimers: [],
    backgroundMusicTimer: null,
    askedQuestionSignaturesByDifficulty: {}
};

const testamentSelect = document.getElementById("testament-select");
const onlineAIToggle = document.getElementById("online-ai-toggle");
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
const progressText = document.getElementById("progress-text");
const progressTrack = document.getElementById("progress-track");
const progressFill = document.getElementById("progress-fill");
const verseCount = document.getElementById("verse-count");
const generiqueOverlay = document.getElementById("generique-overlay");
const generiqueLine = document.getElementById("generique-line");
const generiqueSubline = document.getElementById("generique-subline");
const generiqueSkip = document.getElementById("generique-skip");
const replayGeneriqueButton = document.getElementById("replay-generique");
const configureAIButton = document.getElementById("configure-ai-btn");
const aiConfigPanel = document.getElementById("ai-config-panel");
const aiConfigBadge = document.getElementById("ai-config-badge");
const aiEndpointInput = document.getElementById("ai-endpoint-input");
const aiModelInput = document.getElementById("ai-model-input");
const aiKeyInput = document.getElementById("ai-key-input");
const aiSaveButton = document.getElementById("ai-save-btn");
const aiClearButton = document.getElementById("ai-clear-btn");
const aiCloseButton = document.getElementById("ai-close-btn");
const aiConfigStatus = document.getElementById("ai-config-status");
const gameOverBanner = document.getElementById("game-over-banner");
const gainWinBanner = document.getElementById("gain-win-banner");
const gainWinTitle = document.getElementById("gain-win-title");
const gainWinAmount = document.getElementById("gain-win-amount");
const newGameOverlay = document.getElementById("new-game-overlay");
const ngFallbackAmount = document.getElementById("ng-fallback-amount");
const ngRestartBtn = document.getElementById("ng-restart-btn");
const celebrationOverlay = document.getElementById("celebration-overlay");
const celebrationAmount = document.getElementById("celebration-amount");
const celebrationRestartBtn = document.getElementById("celebration-restart-btn");
const confettiContainer = document.getElementById("confetti-container");

let gainBannerTimer = null;
let newGameOverlayTimer = null;

function maskApiKey(apiKey) {
    if (!apiKey) {
        return "Aucune cle enregistree";
    }

    if (apiKey.length <= 8) {
        return "Cle enregistree";
    }

    return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}

function populateAIConfigForm() {
    if (!aiEndpointInput || !aiModelInput || !aiKeyInput) {
        return;
    }

    aiEndpointInput.value = state.aiConfig.endpoint || DEFAULT_AI_CONFIG.endpoint;
    aiModelInput.value = state.aiConfig.model || DEFAULT_AI_CONFIG.model;
    aiKeyInput.value = state.aiConfig.apiKey || "";
}

function updateAIConfigPanelState() {
    if (!aiConfigPanel || !aiConfigBadge || !aiConfigStatus) {
        return;
    }

    const hasKey = Boolean(state.aiConfig.apiKey);
    aiConfigBadge.textContent = hasKey ? "Configuree" : "Non configuree";
    aiConfigBadge.classList.toggle("configured", hasKey);
    aiConfigStatus.textContent = hasKey
        ? `Cle detectee: ${maskApiKey(state.aiConfig.apiKey)}. Modele actif: ${state.aiConfig.model}.`
        : "Le moteur local reste actif tant qu'aucune cle n'est enregistree.";
}

function setAIConfigPanelOpen(isOpen) {
    if (!aiConfigPanel || !configureAIButton) {
        return;
    }

    aiConfigPanel.hidden = !isOpen;
    aiConfigPanel.classList.toggle("open", isOpen);
    configureAIButton.classList.toggle("open", isOpen);
    configureAIButton.textContent = isOpen ? "Masquer IA" : (state.aiConfig.apiKey ? "IA configuree" : "Configurer IA");

    if (isOpen) {
        populateAIConfigForm();
        updateAIConfigPanelState();
        aiKeyInput.focus();
    }
}

function toggleAIConfigPanel() {
    setAIConfigPanelOpen(aiConfigPanel.hidden);
}

function saveAIConfigFromPanel() {
    const nextEndpoint = (aiEndpointInput.value || "").trim() || DEFAULT_AI_CONFIG.endpoint;
    const nextModel = (aiModelInput.value || "").trim() || DEFAULT_AI_CONFIG.model;
    const nextApiKey = (aiKeyInput.value || "").trim();

    state.aiConfig = {
        ...state.aiConfig,
        endpoint: nextEndpoint,
        model: nextModel,
        apiKey: nextApiKey,
        enabled: Boolean(nextApiKey)
    };

    saveAIConfig();
    updateAIControls();
    updateAIConfigPanelState();

    if (!state.aiConfig.apiKey) {
        updateStatusMessage("Configuration IA enregistree, mais aucune cle API active. Le moteur local reste utilise.");
        return;
    }

    updateStatusMessage(`Configuration IA enregistree. Modele actif: ${state.aiConfig.model}.`);
}

function clearAIConfigFromPanel() {
    state.aiConfig = {
        ...state.aiConfig,
        apiKey: "",
        enabled: false
    };

    saveAIConfig();
    populateAIConfigForm();
    updateAIControls();
    updateAIConfigPanelState();
    updateStatusMessage("Cle API effacee. Le moteur local est a nouveau actif.");
}

function handleAIConfigTyping() {
    if (!aiConfigStatus || !aiConfigBadge) {
        return;
    }

    const draftKey = (aiKeyInput.value || "").trim();
    const draftModel = (aiModelInput.value || "").trim() || DEFAULT_AI_CONFIG.model;
    const hasKey = Boolean(draftKey);

    aiConfigBadge.textContent = hasKey ? "Pret a activer" : "Non configuree";
    aiConfigBadge.classList.toggle("configured", hasKey);
    aiConfigStatus.textContent = hasKey
        ? `Cle saisie: ${maskApiKey(draftKey)}. Le modele ${draftModel} sera active apres enregistrement.`
        : "Le moteur local reste actif tant qu'aucune cle n'est enregistree.";
}

function pickRandom(list) {
    if (!list.length) {
        return null;
    }
    return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
    const data = [...list];
    for (let i = data.length - 1; i > 0; i -= 1) {
        const r = Math.floor(Math.random() * (i + 1));
        [data[i], data[r]] = [data[r], data[i]];
    }
    return data;
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

function matchSelectedTestament(itemTestament) {
    const selected = testamentSelect.value;
    if (selected === "all") {
        return true;
    }

    if (itemTestament === "all") {
        return true;
    }

    return itemTestament === selected;
}

function formatPoints(value) {
    return `${value} pts`;
}

function getDifficultyQuestionHistory(difficulty) {
    if (!state.askedQuestionSignaturesByDifficulty[difficulty]) {
        state.askedQuestionSignaturesByDifficulty[difficulty] = new Set();
    }
    return state.askedQuestionSignaturesByDifficulty[difficulty];
}

function buildQuestionSignature(question) {
    const prompt = normaliserTexte(question?.prompt || "");
    const hint = normaliserTexte(question?.verseHint || "");
    const options = Array.isArray(question?.options)
        ? question.options.map((opt) => normaliserTexte(opt)).sort().join("|")
        : "";
    const correct = Number.isInteger(question?.correctIndex)
        ? normaliserTexte(question.options[question.correctIndex] || "")
        : "";

    return `${prompt}::${hint}::${options}::${correct}`;
}

function isQuestionShapeValid(question) {
    if (!question || typeof question !== "object") {
        return false;
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
        return false;
    }

    if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
        return false;
    }

    const correctOption = question.options[question.correctIndex];
    if (typeof correctOption !== "string" || !correctOption.trim()) {
        return false;
    }

    return true;
}

function difficultyLevel() {
    return DIFFICULTY_CONFIG[state.difficulty]?.level || 1;
}

function getNextDifficulty(difficulty) {
    const index = DIFFICULTY_ORDER.indexOf(difficulty);
    if (index === -1 || index >= DIFFICULTY_ORDER.length - 1) {
        return null;
    }
    return DIFFICULTY_ORDER[index + 1];
}

function getEnvVar(name) {
    try {
        if (typeof process !== "undefined" && process.env && process.env[name]) {
            return process.env[name];
        }
    } catch (error) {
        return "";
    }
    return "";
}

function loadAIConfig() {
    const config = { ...DEFAULT_AI_CONFIG };

    try {
        const raw = localStorage.getItem(AI_STORAGE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            if (saved && typeof saved === "object") {
                config.enabled = Boolean(saved.enabled);
                config.apiKey = typeof saved.apiKey === "string" ? saved.apiKey.trim() : "";
                config.model = typeof saved.model === "string" && saved.model.trim() ? saved.model.trim() : DEFAULT_AI_CONFIG.model;
                config.endpoint = typeof saved.endpoint === "string" && saved.endpoint.trim() ? saved.endpoint.trim() : DEFAULT_AI_CONFIG.endpoint;
            }
        }
    } catch (error) {
        // Ignore invalid local storage payload.
    }

    const envApiKey = getEnvVar("GEMINI_API_KEY") || getEnvVar("OPENAI_API_KEY");
    const envModel = getEnvVar("GEMINI_MODEL") || getEnvVar("OPENAI_MODEL");
    const envEndpoint = getEnvVar("GEMINI_ENDPOINT") || getEnvVar("OPENAI_ENDPOINT");

    if (!config.apiKey && envApiKey) {
        config.apiKey = envApiKey.trim();
    }
    if (!config.model && envModel) {
        config.model = envModel.trim();
    }
    if (!config.endpoint && envEndpoint) {
        config.endpoint = envEndpoint.trim();
    }

    if (!config.apiKey) {
        // Keep enabled state even without API key — toggle is free like sound toggle
    }

    state.aiConfig = config;
}

function saveAIConfig() {
    try {
        localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(state.aiConfig));
    } catch (error) {
        // Ignore storage failures.
    }
}

function updateAIControls() {
    if (onlineAIToggle) {
        onlineAIToggle.checked = Boolean(state.aiConfig.enabled);
        onlineAIToggle.disabled = false;
    }

    if (configureAIButton) {
        const isConfigured = Boolean(state.aiConfig.apiKey);
        const isPanelOpen = aiConfigPanel ? !aiConfigPanel.hidden : false;
        configureAIButton.textContent = isPanelOpen ? "Masquer IA" : (isConfigured ? "IA configuree" : "Configurer IA");
        configureAIButton.title = isConfigured
            ? `IA configuree (${state.aiConfig.model})`
            : "Configurer l'IA Gemini";
        configureAIButton.classList.toggle("configured", isConfigured);
    }

    updateAIConfigPanelState();
}

function stripCodeFence(text) {
    return (text || "")
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
}

function validateAIQuestion(payload) {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    if (typeof payload.prompt !== "string") {
        return null;
    }

    if (!Array.isArray(payload.options) || payload.options.length !== 4) {
        return null;
    }

    const options = payload.options.map((item) => String(item || "").trim()).filter(Boolean);
    if (options.length !== 4) {
        return null;
    }

    const unique = new Set(options.map((item) => normaliserTexte(item)));
    if (unique.size < 4) {
        return null;
    }

    const correctIndex = Number(payload.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
        return null;
    }

    return {
        prompt: payload.prompt.trim(),
        verseHint: typeof payload.verseHint === "string" && payload.verseHint.trim() ? payload.verseHint.trim() : "Question IA en ligne.",
        options,
        correctIndex
    };
}

async function buildOnlineAIQuestion() {
    if (!state.aiConfig.enabled) {
        return null;
    }
    if (!state.aiConfig.apiKey) {
        return null;
    }

    const sampleVerse = pickVerseForDifficulty();
    const difficultyLabel = DIFFICULTY_CONFIG[state.difficulty].label;
    const testamentLabel = testamentSelect.value === "old"
        ? "Ancien Testament"
        : testamentSelect.value === "new"
            ? "Nouveau Testament"
            : "Toute la Bible";

    const systemInstruction = "Tu es un generateur de quiz biblique. Tu renvoies uniquement du JSON valide.";
    const userInstruction = [
        `Cree UNE question biblique de niveau ${difficultyLabel} pour un quiz en francais.`,
        `Portion choisie: ${testamentLabel}.`,
        "La question doit porter sur versets, personnages, roles, evenements, liens ou significations d'expressions bibliques.",
        "Inclure regulierement des questions du type: Que signifie Ichabod ? ou Que signifie Jehovah Jireh ?",
        "Retourne uniquement un objet JSON avec les champs: prompt, verseHint, options, correctIndex.",
        "options doit contenir exactement 4 propositions plausibles.",
        "correctIndex doit etre un entier entre 0 et 3.",
        "N'inclus aucun commentaire, aucun markdown.",
        sampleVerse ? `Contexte possible (optionnel): ${sampleVerse.book_name} ${sampleVerse.chapter}:${sampleVerse.verse} - ${sampleVerse.text}` : ""
    ].filter(Boolean).join("\n");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(state.aiConfig.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.aiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: state.aiConfig.model,
                temperature: 0.8,
                max_tokens: 280,
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: userInstruction }
                ]
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) {
            return null;
        }

        const parsed = JSON.parse(stripCodeFence(content));
        const question = validateAIQuestion(parsed);
        return question;
    } catch (error) {
        return null;
    } finally {
        clearTimeout(timeoutId);
    }
}

function showNewGameOverlay(score) {
    const card = newGameOverlay.querySelector(".new-game-card");
    card.classList.remove("animate-in");
    void card.offsetWidth;
    card.classList.add("animate-in");
    ngFallbackAmount.innerText = formatPoints(score);
    newGameOverlay.classList.add("visible");
}

function hideCelebrationOverlay() {
    celebrationOverlay.classList.remove("visible");
    if (confettiContainer) {
        confettiContainer.innerHTML = "";
    }
}

function launchConfettiBurst() {
    if (!confettiContainer) {
        return;
    }

    const colors = ["#ffd166", "#ef476f", "#06d6a0", "#118ab2", "#f4a261", "#ffffff"];
    confettiContainer.innerHTML = "";

    for (let i = 0; i < 120; i += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = `${6 + Math.random() * 7}px`;
        piece.style.height = `${10 + Math.random() * 9}px`;
        piece.style.animationDuration = `${1500 + Math.random() * 1700}ms`;
        piece.style.animationDelay = `${Math.random() * 500}ms`;
        piece.style.setProperty("--drift-x", `${-140 + Math.random() * 280}px`);
        piece.style.setProperty("--rot", `${220 + Math.random() * 760}deg`);
        confettiContainer.appendChild(piece);
    }
}

function showCelebrationOverlay(score) {
    celebrationAmount.innerText = formatPoints(score);
    celebrationOverlay.classList.add("visible");
    launchConfettiBurst();
}

ngRestartBtn.addEventListener("click", () => {
    newGameOverlay.classList.remove("visible");
    startGame();
});

celebrationRestartBtn.addEventListener("click", () => {
    hideCelebrationOverlay();
    startGame();
});

function hideGameOverBanner() {
    gameOverBanner.classList.remove("visible");
}

function showGameOverBanner() {
    gameOverBanner.classList.add("visible");
}

function showGainBanner(title, detail) {
    if (gainBannerTimer) {
        clearTimeout(gainBannerTimer);
        gainBannerTimer = null;
    }

    gainWinTitle.innerText = title;
    gainWinAmount.innerText = detail;
    gainWinBanner.classList.add("visible");

    gainBannerTimer = setTimeout(() => {
        gainWinBanner.classList.remove("visible");
    }, 1400);
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

    for (let i = 0; i < 10; i += 1) {
        const t = now + i * beat;
        note(293.66, t, 0.05, 0.015, "triangle");
    }

    note(293.66, now + beat * 0, beat * 1.1, 0.04, "sine");
    note(349.23, now + beat * 1, beat * 1.1, 0.045, "sine");
    note(440.0, now + beat * 2, beat * 1.1, 0.048, "sine");
    note(392.0, now + beat * 3, beat * 1.0, 0.044, "sine");
    note(349.23, now + beat * 4, beat * 1.1, 0.045, "sine");
    note(293.66, now + beat * 5, beat * 1.3, 0.05, "sine");

    note(146.83, now, beat * 3.2, 0.016, "triangle");
    note(220.0, now + beat * 3, beat * 3.0, 0.014, "triangle");
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
    generiqueLine.innerText = "Qui Veut Mieux Connaitre la Bible";
    generiqueSubline.innerText = "Mode IA biblique";
    playGeneriqueMusic();

    state.generiqueTimers.push(setTimeout(() => {
        generiqueLine.innerText = "Questions sur versets et personnages";
        generiqueSubline.innerText = "Facile, moyen, difficile, tres difficile";
    }, 1800));

    state.generiqueTimers.push(setTimeout(() => {
        generiqueLine.innerText = "Enchaine des bonnes reponses";
        generiqueSubline.innerText = "5 bonnes d'affilee = 100 points";
    }, 3600));

    state.generiqueTimers.push(setTimeout(() => {
        fermerGenerique();
    }, 5600));
}

function uniqueBookNames() {
    return [...new Set(state.filteredVerses.map((verse) => verse.book_name))];
}

function pickVerseForDifficulty() {
    const level = difficultyLevel();
    let candidates = state.filteredVerses;

    if (level === 1) {
        candidates = state.filteredVerses.filter((verse) => (verse.text || "").length <= 130);
    } else if (level === 3) {
        candidates = state.filteredVerses.filter((verse) => (verse.text || "").length >= 70);
    } else if (level >= 4) {
        candidates = state.filteredVerses.filter((verse) => (verse.text || "").length >= 90);
    }

    if (!candidates.length) {
        candidates = state.filteredVerses;
    }

    return pickRandom(candidates);
}

function sanitizeWordToken(word) {
    return String(word || "")
        .replace(/[^A-Za-z0-9]/g, "")
        .trim();
}

function tokenizeVerseWords(text) {
    return String(text || "")
        .split(/\s+/)
        .map((token) => sanitizeWordToken(token))
        .filter((token) => token.length >= 4);
}

function truncateVerse(text, maxLen = 200) {
    const clean = String(text || "").trim();
    if (clean.length <= maxLen) {
        return clean;
    }
    return `${clean.slice(0, maxLen - 3)}...`;
}

function pickWordDistractors(excludedWord, count = 3) {
    const excluded = normaliserTexte(excludedWord);
    const words = new Set();

    for (let i = 0; i < 120 && words.size < count; i += 1) {
        const verse = pickRandom(state.filteredVerses);
        if (!verse) {
            break;
        }

        const candidates = tokenizeVerseWords(verse.text);
        const word = pickRandom(candidates);
        if (!word) {
            continue;
        }

        if (normaliserTexte(word) === excluded) {
            continue;
        }

        words.add(word);
    }

    return [...words];
}

function buildBookQuestion() {
    const verse = pickVerseForDifficulty();
    if (!verse) {
        return null;
    }

    const books = uniqueBookNames().filter((name) => name !== verse.book_name);
    if (books.length < 3) {
        return null;
    }

    const wrong = shuffle(books).slice(0, 3);
    const options = shuffle([verse.book_name, ...wrong]);

    return {
        prompt: "Dans quel livre se trouve ce passage ?",
        verseHint: verse.text,
        options,
        correctIndex: options.indexOf(verse.book_name)
    };
}

function buildReferenceQuestion() {
    const verse = pickVerseForDifficulty();
    if (!verse) {
        return null;
    }

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
        prompt: `Quelle est la reference biblique de ce verset dans ${verse.book_name} ?`,
        verseHint: verse.text,
        options,
        correctIndex: options.indexOf(correct)
    };
}

function buildMissingWordQuestion() {
    const verse = pickVerseForDifficulty();
    if (!verse || !verse.text) {
        return null;
    }

    const words = tokenizeVerseWords(verse.text);
    if (words.length < 6) {
        return null;
    }

    const correctWord = pickRandom(words);
    if (!correctWord) {
        return null;
    }

    const wrongWords = pickWordDistractors(correctWord, 3);
    if (wrongWords.length < 3) {
        return null;
    }

    const masked = String(verse.text).replace(new RegExp(`\\b${correctWord}\\b`, "i"), "____");
    const options = shuffle([correctWord, ...wrongWords]);

    return {
        prompt: "Quel mot manque dans ce verset ?",
        verseHint: truncateVerse(masked, 220),
        options,
        correctIndex: options.indexOf(correctWord)
    };
}

function buildChapterQuestion() {
    const verse = pickVerseForDifficulty();
    if (!verse) {
        return null;
    }

    const correct = String(verse.chapter);
    const wrong = new Set();

    while (wrong.size < 3) {
        const candidate = String(Math.max(1, verse.chapter + Math.floor(Math.random() * 10) - 5));
        if (candidate !== correct) {
            wrong.add(candidate);
        }
    }

    const options = shuffle([correct, ...wrong]);
    return {
        prompt: `Dans quel chapitre de ${verse.book_name} se trouve ce verset ?`,
        verseHint: truncateVerse(verse.text, 220),
        options,
        correctIndex: options.indexOf(correct)
    };
}

function buildVerseNumberQuestion() {
    const verse = pickVerseForDifficulty();
    if (!verse) {
        return null;
    }

    const correct = String(verse.verse);
    const wrong = new Set();

    while (wrong.size < 3) {
        const candidate = String(Math.max(1, verse.verse + Math.floor(Math.random() * 14) - 7));
        if (candidate !== correct) {
            wrong.add(candidate);
        }
    }

    const options = shuffle([correct, ...wrong]);
    return {
        prompt: `Quel est le numero de ce verset dans ${verse.book_name} ${verse.chapter} ?`,
        verseHint: truncateVerse(verse.text, 220),
        options,
        correctIndex: options.indexOf(correct)
    };
}

function buildCharacterRoleQuestion() {
    const candidates = CHARACTER_FACTS.filter((item) => item.difficulty <= difficultyLevel() && matchSelectedTestament(item.testament));
    const selected = pickRandom(candidates);
    if (!selected || candidates.length < 4) {
        return null;
    }

    const wrongRoles = shuffle(candidates.filter((item) => item.name !== selected.name).map((item) => item.role)).slice(0, 3);
    const options = shuffle([selected.role, ...wrongRoles]);

    return {
        prompt: `Qui etait ${selected.name} dans la Bible ?`,
        verseHint: "Question generee par le moteur IA biblique.",
        options,
        correctIndex: options.indexOf(selected.role)
    };
}

function buildCharacterIdentityQuestion() {
    const candidates = CHARACTER_FACTS.filter((item) => item.difficulty <= difficultyLevel() && matchSelectedTestament(item.testament));
    const selected = pickRandom(candidates);
    if (!selected || candidates.length < 4) {
        return null;
    }

    const wrongNames = shuffle(candidates.filter((item) => item.name !== selected.name).map((item) => item.name)).slice(0, 3);
    const options = shuffle([selected.name, ...wrongNames]);

    return {
        prompt: `Quel personnage biblique ${selected.action} ?`,
        verseHint: "Question de connaissance generale biblique.",
        options,
        correctIndex: options.indexOf(selected.name)
    };
}

function buildEventQuestion() {
    const candidates = EVENT_FACTS.filter((item) => item.difficulty <= difficultyLevel() && matchSelectedTestament(item.testament));
    const selected = pickRandom(candidates);
    if (!selected || candidates.length < 4) {
        return null;
    }

    const modeWho = Math.random() > 0.45;

    if (modeWho) {
        const wrong = shuffle(candidates.filter((item) => item.who !== selected.who).map((item) => item.who)).slice(0, 3);
        const options = shuffle([selected.who, ...wrong]);
        return {
            prompt: `Qui est associe a l'evenement suivant: ${selected.event} ?`,
            verseHint: "Question IA basee sur les recits bibliques.",
            options,
            correctIndex: options.indexOf(selected.who)
        };
    }

    const wrong = shuffle(candidates.filter((item) => item.where !== selected.where).map((item) => item.where)).slice(0, 3);
    const options = shuffle([selected.where, ...wrong]);
    return {
        prompt: `Ou se deroule principalement ${selected.event} ?`,
        verseHint: "Question IA basee sur les recits bibliques.",
        options,
        correctIndex: options.indexOf(selected.where)
    };
}

function buildRelationQuestion(minDifficulty = 1) {
    const candidates = RELATION_QUESTIONS.filter((item) => item.difficulty <= difficultyLevel() && item.difficulty >= minDifficulty && matchSelectedTestament(item.testament));
    const selected = pickRandom(candidates);
    if (!selected) {
        return null;
    }

    const options = shuffle([...selected.options]);

    return {
        prompt: selected.prompt,
        verseHint: "Question IA niveau avance.",
        options,
        correctIndex: options.indexOf(selected.correct)
    };
}

function buildExpressionMeaningQuestion(minDifficulty = 1) {
    const candidates = TERM_MEANING_QUESTIONS.filter((item) => item.difficulty <= difficultyLevel() && item.difficulty >= minDifficulty && matchSelectedTestament(item.testament));
    const selected = pickRandom(candidates);
    if (!selected) {
        return null;
    }

    const options = shuffle([...selected.options]);

    return {
        prompt: selected.prompt,
        verseHint: "Question de vocabulaire biblique.",
        options,
        correctIndex: options.indexOf(selected.correct)
    };
}

function buildAdvancedRelationQuestion() {
    return buildRelationQuestion(3);
}

function buildAdvancedMeaningQuestion() {
    return buildExpressionMeaningQuestion(3);
}

function buildLocalQuestion() {
    const generatorsByDifficulty = {
        easy: [
            buildCharacterRoleQuestion,
            buildCharacterRoleQuestion,
            buildCharacterIdentityQuestion,
            buildCharacterIdentityQuestion,
            buildExpressionMeaningQuestion,
            buildBookQuestion,
            buildBookQuestion,
            buildReferenceQuestion,
            buildMissingWordQuestion,
            buildChapterQuestion
        ],
        medium: [
            buildCharacterRoleQuestion,
            buildCharacterRoleQuestion,
            buildEventQuestion,
            buildEventQuestion,
            buildCharacterIdentityQuestion,
            buildBookQuestion,
            buildReferenceQuestion,
            buildMissingWordQuestion,
            buildChapterQuestion,
            buildVerseNumberQuestion
        ],
        hard: [
            buildBookQuestion,
            buildReferenceQuestion,
            buildReferenceQuestion,
            buildBookQuestion,
            buildMissingWordQuestion,
            buildChapterQuestion,
            buildVerseNumberQuestion
        ],
        "very-hard": [
            buildAdvancedRelationQuestion,
            buildAdvancedMeaningQuestion,
            buildAdvancedRelationQuestion,
            buildReferenceQuestion,
            buildEventQuestion,
            buildMissingWordQuestion,
            buildChapterQuestion,
            buildVerseNumberQuestion
        ]
    };

    const generators = generatorsByDifficulty[state.difficulty] || generatorsByDifficulty.easy;

    const history = getDifficultyQuestionHistory(state.difficulty);

    for (let attempt = 0; attempt < 400; attempt += 1) {
        const generator = pickRandom(generators);
        const question = generator ? generator() : null;
        if (question) {
            if (!isQuestionShapeValid(question)) {
                continue;
            }

            const signature = buildQuestionSignature(question);
            if (history.has(signature)) {
                continue;
            }

            history.add(signature);
            return question;
        }
    }

    // Emergency generator: still bible-based, tries to avoid stopping the game.
    const emergency = buildReferenceQuestion() || buildBookQuestion() || buildChapterQuestion() || buildVerseNumberQuestion();
    if (!emergency || !isQuestionShapeValid(emergency)) {
        return null;
    }

    const emergencySignature = buildQuestionSignature(emergency);
    if (history.has(emergencySignature)) {
        return null;
    }

    history.add(emergencySignature);
    return emergency;
}

async function buildQuestion() {
    if (state.aiConfig?.enabled) {
        const history = getDifficultyQuestionHistory(state.difficulty);

        for (let attempt = 0; attempt < 4; attempt += 1) {
            const onlineQuestion = await buildOnlineAIQuestion();
            if (!onlineQuestion || !isQuestionShapeValid(onlineQuestion)) {
                continue;
            }

            const signature = buildQuestionSignature(onlineQuestion);
            if (history.has(signature)) {
                continue;
            }

            history.add(signature);
            return onlineQuestion;
        }
    }

    return buildLocalQuestion();
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

function renderScore() {
    currentGain.innerText = formatPoints(state.score);

    const clampedScore = Math.max(0, Math.min(WIN_SCORE, state.score));
    const percent = (clampedScore / WIN_SCORE) * 100;
    progressText.innerText = `${clampedScore} / ${WIN_SCORE}`;
    progressFill.style.width = `${percent}%`;
    progressTrack.setAttribute("aria-valuenow", String(clampedScore));
}

function updateStatusMessage(message) {
    hostMessage.innerHTML = message;
}

async function showQuestion() {
    clearAnswerStyles();
    state.currentQuestion = await buildQuestion();

    if (!state.currentQuestion) {
        endGame("Banque de questions epuisee pour ce niveau.", state.score);
        questionText.innerText = "Questions epuisees";
        verseHint.innerText = "Toutes les questions uniques de ce niveau ont deja ete posees.";
        showNewGameOverlay(state.score);
        return;
    }

    const difficultyLabel = DIFFICULTY_CONFIG[state.difficulty].label;
    roundLabel.innerText = `Question ${state.currentIndex + 1} - Niveau ${difficultyLabel} - Progression ${formatPoints(state.score)}/${formatPoints(WIN_SCORE)} - Serie ${state.streak}/${SERIE_TARGET}`;
    verseHint.innerText = state.currentQuestion.verseHint;
    questionText.innerText = state.currentQuestion.prompt;

    answerButtons.forEach((btn, idx) => {
        const label = btn.querySelector("strong");
        label.innerText = state.currentQuestion.options[idx];
        btn.disabled = false;
    });

    updateLifelineButtons();
    renderScore();
    updateStatusMessage("Choisis une reponse, ou utilise un joker.");
}

function endGame(message, finalScore, showHostMessage = true) {
    state.gameRunning = false;
    stopBackgroundMusic();
    setAnswerButtonsEnabled(false);
    updateLifelineButtons();
    state.score = finalScore;
    renderScore();
    if (showHostMessage) {
        updateStatusMessage(message);
    }
}

async function moveNextQuestion() {
    state.currentIndex += 1;
    await showQuestion();
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

    setTimeout(async () => {
        const selectedAnswer = state.currentQuestion.options[index] || "";
        const correctAnswer = state.currentQuestion.options[correct] || "";
        const isCorrectAnswer = index === correct || normaliserTexte(selectedAnswer) === normaliserTexte(correctAnswer);

        if (isCorrectAnswer) {
            selectedButton.classList.add("correct");
            playTone("correct");

            state.streak += 1;
            let gainedPoints = 0;

            if (state.streak % SERIE_TARGET === 0) {
                gainedPoints = POINTS_PER_SERIE;
                state.score += gainedPoints;
                if (state.score > WIN_SCORE) {
                    state.score = WIN_SCORE;
                }
                showGainBanner("Serie validee !", `+${formatPoints(gainedPoints)}`);
            } else {
                showGainBanner("Bonne reponse !", `Serie ${state.streak}/${SERIE_TARGET}`);
            }

            renderScore();
            updateStatusMessage(`Bonne reponse. Serie actuelle: ${state.streak}/${SERIE_TARGET}. Score: ${formatPoints(state.score)}.`);

            if (state.score >= WIN_SCORE) {
                const nextDifficulty = getNextDifficulty(state.difficulty);

                if (!nextDifficulty) {
                    endGame(`Felicitations ! Tu as atteint ${formatPoints(WIN_SCORE)} au niveau Tres difficile.`, WIN_SCORE);
                    questionText.innerText = "FELICITATIONS !";
                    verseHint.innerText = "Tu as valide tous les niveaux.";
                    playTone("win");
                    showCelebrationOverlay(WIN_SCORE);
                    return;
                }

                const oldLabel = DIFFICULTY_CONFIG[state.difficulty].label;
                const nextLabel = DIFFICULTY_CONFIG[nextDifficulty].label;
                state.difficulty = nextDifficulty;
                state.askedQuestionSignaturesByDifficulty[nextDifficulty] = new Set();
                state.score = 0;
                state.streak = 0;
                state.currentIndex = -1;
                renderScore();
                showGainBanner("Niveau valide !", `${oldLabel} -> ${nextLabel}`);
                updateStatusMessage(`Bravo ! Tu passes au niveau ${nextLabel}. Atteins encore ${formatPoints(WIN_SCORE)} pour passer au suivant.`);

                setTimeout(async () => {
                    await moveNextQuestion();
                }, 1100);
                return;
            }

            setTimeout(async () => {
                await moveNextQuestion();
            }, 1000);
            return;
        }

        selectedButton.classList.add("wrong");
        if (correctButton) {
            correctButton.classList.add("correct");
        }
        playTone("wrong");
        const finalScore = state.score;
        state.streak = 0;
        showGameOverBanner();
        questionText.innerText = "GAME OVER";
        verseHint.innerText = "La bonne reponse est affichee en vert.";
        endGame(`GAME OVER. Mauvaise reponse. Score final: ${formatPoints(finalScore)}.`, finalScore, false);
        newGameOverlayTimer = setTimeout(() => showNewGameOverlay(finalScore), 1800);
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
    updateStatusMessage("Joker 50:50 utilise. Deux mauvaises reponses retirees.");
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

async function startGame() {
    if (state.generiquePlaying) {
        return;
    }

    filterVerses();

    if (state.filteredVerses.length < 100) {
        updateStatusMessage("Pas assez de versets dans cette selection.");
        return;
    }

    state.gameRunning = true;
    state.currentIndex = -1;
    state.score = 0;
    state.streak = 0;
    state.difficulty = "easy";
    state.askedQuestionSignaturesByDifficulty = {
        easy: new Set(),
        medium: new Set(),
        hard: new Set(),
        "very-hard": new Set()
    };
    state.targetQuestions = 0;
    state.lifelines = { fifty: true, phone: true, audience: true };

    hideGameOverBanner();
    gainWinBanner.classList.remove("visible");
    newGameOverlay.classList.remove("visible");
    hideCelebrationOverlay();
    if (newGameOverlayTimer) {
        clearTimeout(newGameOverlayTimer);
        newGameOverlayTimer = null;
    }

    clearAnswerStyles();
    updateLifelineButtons();
    renderScore();
    updateStatusMessage("Partie demarree. Atteins 1000 points pour passer chaque niveau.");
    startBackgroundMusic();
    await moveNextQuestion();
}

function takeMoney() {
    if (!state.gameRunning) {
        return;
    }

    playTone("win");
    stopBackgroundMusic();
    endGame(`Partie terminee. Tu gardes ${formatPoints(state.score)}.`, state.score);
    questionText.innerText = "Partie terminee";
    verseHint.innerText = "Tu peux recommencer quand tu veux.";
    showNewGameOverlay(state.score);
}

function normalizeBibleDataset(rawBible) {
    const sourceVerses = Array.isArray(rawBible?.verses) ? rawBible.verses : [];
    const cleaned = [];
    const seen = new Set();
    let dropped = 0;

    for (const verse of sourceVerses) {
        if (!verse || typeof verse !== "object") {
            dropped += 1;
            continue;
        }

        const book = Number(verse.book);
        const chapter = Number(verse.chapter);
        const verseNum = Number(verse.verse);
        const text = String(verse.text || "").trim();
        const bookName = String(verse.book_name || "").trim();

        if (!Number.isFinite(book) || !Number.isFinite(chapter) || !Number.isFinite(verseNum)) {
            dropped += 1;
            continue;
        }

        if (!text || !bookName) {
            dropped += 1;
            continue;
        }

        const normalizedVerse = {
            ...verse,
            book,
            chapter,
            verse: verseNum,
            text,
            book_name: bookName
        };

        // Deduplicate on canonical biblical reference + exact text.
        const signature = `${book}|${chapter}|${verseNum}|${normaliserTexte(text)}`;
        if (seen.has(signature)) {
            dropped += 1;
            continue;
        }

        seen.add(signature);
        cleaned.push(normalizedVerse);
    }

    return {
        verses: cleaned,
        dropped
    };
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

function configureOnlineAI() {
    setAIConfigPanelOpen(true);
}

function registerEvents() {
    answerButtons.forEach((btn, idx) => {
        btn.addEventListener("click", () => lockAnswer(idx));
    });

    lifeline5050Button.addEventListener("click", applyFiftyFifty);
    lifelinePhoneButton.addEventListener("click", applyPhone);
    lifelineAudienceButton.addEventListener("click", applyAudience);
    startButton.addEventListener("click", async () => {
        await startGame();
    });
    takeMoneyButton.addEventListener("click", takeMoney);
    generiqueSkip.addEventListener("click", fermerGenerique);
    replayGeneriqueButton.addEventListener("click", lancerGenerique);
    configureAIButton.addEventListener("click", toggleAIConfigPanel);
    aiSaveButton.addEventListener("click", saveAIConfigFromPanel);
    aiClearButton.addEventListener("click", clearAIConfigFromPanel);
    aiCloseButton.addEventListener("click", () => setAIConfigPanelOpen(false));
    aiEndpointInput.addEventListener("input", handleAIConfigTyping);
    aiModelInput.addEventListener("input", handleAIConfigTyping);
    aiKeyInput.addEventListener("input", handleAIConfigTyping);

    onlineAIToggle.addEventListener("change", () => {
        if (onlineAIToggle.checked && !state.aiConfig.apiKey) {
            configureOnlineAI();
            if (!state.aiConfig.apiKey) {
                state.aiConfig.enabled = false;
                onlineAIToggle.checked = false;
                saveAIConfig();
                updateAIControls();
                updateStatusMessage("Aucune cle API detectee. Le mode IA reste local tant que la configuration n'est pas enregistree.");
                return;
            }
        }

        state.aiConfig.enabled = onlineAIToggle.checked;
        saveAIConfig();

        if (state.aiConfig.enabled) {
            if (state.aiConfig.apiKey) {
                updateStatusMessage(`Mode IA en ligne actif (${state.aiConfig.model}).`);
            } else {
                updateStatusMessage("Mode IA en ligne active, mais aucune cle API detectee. Fallback local actif.");
            }
        } else {
            updateStatusMessage("Mode IA local actif.");
        }
    });

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
        loadAIConfig();
        populateAIConfigForm();
        updateAIControls();
        registerEvents();
        const bible = await loadData();
        const normalized = normalizeBibleDataset(bible);
        state.verses = normalized.verses;
        verseCount.innerText = state.verses.length.toLocaleString("fr-FR");
        renderScore();
        updateLifelineButtons();
        if (normalized.dropped > 0) {
            updateStatusMessage(`Base locale chargee avec nettoyage: ${normalized.dropped} entree(s) invalide(s) retiree(s).`);
        } else if (state.aiConfig.enabled && state.aiConfig.apiKey) {
            updateStatusMessage(`Base locale chargee. Mode IA en ligne actif (${state.aiConfig.model}).`);
        } else if (state.aiConfig.enabled && !state.aiConfig.apiKey) {
            updateStatusMessage("Base locale chargee. IA en ligne active sans cle API, fallback local actif.");
        } else {
            updateStatusMessage("Base locale chargee. Mode IA local actif.");
        }
        lancerGenerique();
    } catch (error) {
        updateStatusMessage(`Erreur: ${error.message}`);
        questionText.innerText = "Le jeu ne peut pas demarrer sans les donnees bibliques.";
    }
}

init();
