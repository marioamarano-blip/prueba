import SumasGame     from './games/sumas.js';
import PoleasGame    from './games/poleas.js';
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

    init() {
        this.bindEvents();
        this.loadStars();
    },

    bindEvents() {
        // Game card buttons on home screen
        document.querySelectorAll('.game-card').forEach(btn => {
            btn.addEventListener('click', () => this.launchGame(btn.dataset.game));
        });

        // All back buttons
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => this.goHome());
        });
    },

    launchGame(gameName) {
        if (this.isLocked) return;
        const entry = GAME_MAP[gameName];
        if (!entry) return;

        this.isLocked = true;
        this.currentGame = entry.module;

        this.showScreen(entry.screen);
        entry.module.start(this);

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
            // small delay to allow CSS transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => target.classList.add('active'));
            });
        }
    },

    updateCharacterMessage(gamePrefix, msg) {
        const el = document.getElementById(`${gamePrefix}-character-msg`);
        if (!el) return;
        el.style.opacity = 0;
        setTimeout(() => {
            el.textContent = msg;
            el.style.opacity = 1;
        }, 180);
    },

    addStar(gamePrefix) {
        this.totalStars++;
        this.saveStars();

        // update game counter
        const gameStarEl = document.getElementById(`${gamePrefix}-stars`);
        if (gameStarEl) {
            gameStarEl.textContent = parseInt(gameStarEl.textContent || '0') + 1;
        }

        // update home total
        const totalEl = document.getElementById('total-stars');
        if (totalEl) totalEl.textContent = this.totalStars;
    },

    saveStars() {
        try { localStorage.setItem('princess_stars', this.totalStars); } catch(e) {}
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

document.addEventListener('DOMContentLoaded', () => App.init());
export default App;
