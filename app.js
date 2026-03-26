import SumasGame from './games/sumas.js';
import PoleasGame from './games/poleas.js';
import EngranajesGame from './games/engranajes.js';
import ElectricidadGame from './games/electricidad.js';

const GAME_MAP = {
    sumas:        { module: SumasGame,        screen: 'sumas-screen' },
    poleas:       { module: PoleasGame,       screen: 'poleas-screen' },
    engranajes:   { module: EngranajesGame,   screen: 'engranajes-screen' },
    electricidad: { module: ElectricidadGame, screen: 'electricidad-screen' },
};

const App = {
    isLocked: false,
    currentGame: null,
    totalStars: 0,
    elements: {},

    // ================= INIT =================
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadStars();
    },

    // ================= CACHE ELEMENTS =================
    cacheElements() {
        this.elements = {
            characterMsg: document.getElementById('character-msg')
        };
    },

    // ================= EVENTS =================
    bindEvents() {
        // Botones de juegos
        document.querySelectorAll('.game-card').forEach(btn => {
            btn.addEventListener('click', () => this.launchGame(btn.dataset.game));
        });

        // Botones volver
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => this.goHome());
        });

        // Botón repetir (si existe)
        const repeatBtn = document.getElementById('btn-repeat');
        if (repeatBtn) {
            repeatBtn.addEventListener('click', () => {
                const text = this.elements.characterMsg?.textContent || "";
                this.speak("JUANA, " + text);
            });
        }
    },

    // ================= NAVEGACIÓN =================
    launchGame(gameName) {
        if (this.isLocked) return;

        const entry = GAME_MAP[gameName];
        if (!entry) return;

        this.isLocked = true;
        this.currentGame = entry.module;

        this.showScreen(entry.screen);
        entry.module.start(this);

        // 🔊 mensaje inicial
        this.speak("JUANA, VAMOS A JUGAR " + gameName);

        setTimeout(() => { this.isLocked = false; }, 400);
    },

    goHome() {
        if (this.isLocked) return;

        this.isLocked = true;

        if (this.currentGame && typeof this.currentGame.stop === 'function') {
            this.currentGame.stop();
        }

        this.currentGame = null;
        this.showScreen('home-screen');

        setTimeout(() => { this.isLocked = false; }, 400);
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });

        const target = document.getElementById(screenId);
        if (target) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => target.classList.add('active'));
            });
        }
    },

    // ================= MENSAJES =================
    updateCharacterMessage(msg) {
        if (!this.elements.characterMsg) return;

        this.elements.characterMsg.style.opacity = 0;

        setTimeout(() => {
            this.elements.characterMsg.textContent = msg;
            this.elements.characterMsg.style.opacity = 1;

            // 🔊 VOZ AUTOMÁTICA
            this.speak("JUANA, " + msg);

        }, 200);
    },

    // ================= VOZ =================
    speak(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "es-AR";
        msg.rate = 0.9;
        msg.pitch = 1.2;

        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
    },

    // ================= ESTRELLAS =================
    addStar(gamePrefix) {
        this.totalStars++;
        this.saveStars();

        const gameStarEl = document.getElementById(`${gamePrefix}-stars`);
        if (gameStarEl) {
            gameStarEl.textContent = parseInt(gameStarEl.textContent || '0') + 1;
        }

        const totalEl = document.getElementById('total-stars');
        if (totalEl) totalEl.textContent = this.totalStars;
    },

    saveStars() {
        try {
            localStorage.setItem('princess_stars', this.totalStars);
        } catch(e) {}
    },

    loadStars() {
        try {
            const saved = parseInt(localStorage.getItem('princess_stars') || '0');
            this.totalStars = saved;

            const totalEl = document.getElementById('total-stars');
            if (totalEl) totalEl.textContent = this.totalStars;
        } catch(e) {}
    }
};

// ================= START =================
document.addEventListener('DOMContentLoaded', () => App.init());

export default App;
