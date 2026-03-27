// Definimos el mapa de juegos (ahora asumiendo que los objetos de juego son globales)
const GAME_MAP = {
    sumas:        { module: typeof SumasGame !== 'undefined' ? SumasGame : null,        screen: 'sumas-screen' },
    poleas:       { module: typeof PoleasGame !== 'undefined' ? PoleasGame : null,       screen: 'poleas-screen' },
    engranajes:   { module: typeof EngranajesGame !== 'undefined' ? EngranajesGame : null,   screen: 'engranajes-screen' },
    electricidad: { module: typeof ElectricidadGame !== 'undefined' ? ElectricidadGame : null, screen: 'electricidad-screen' },
};

const App = {
    isLocked: false,
    currentGame: null,
    totalStars: 0,
    elements: {},
    rumi: null, // Guardaremos a la asistente aquí

    // ================= INIT =================
    init() {
        // 1. Inicializamos a Rumi primero
        this.rumi = new RumiAssistant();
        
        this.cacheElements();
        this.bindEvents();
        this.loadStars();

        console.log("Laboratorio de Juanita listo con Rumi Assistant");
    }

    // ================= CACHE ELEMENTS =================
    cacheElements() {
        this.elements = {
            characterMsg: document.getElementById('character-msg')
        };
    }

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

        // Botón repetir
        const repeatBtn = document.getElementById('btn-repeat');
        if (repeatBtn) {
            repeatBtn.addEventListener('click', () => {
                const text = this.elements.characterMsg?.textContent || "¡Vamos a jugar!";
                this.speak(text);
            });
        }
    }

    // ================= NAVEGACIÓN =================
    launchGame(gameName) {
        if (this.isLocked) return;

        const entry = GAME_MAP[gameName];
        if (!entry || !entry.module) {
            console.error("Juego no encontrado o módulo no cargado:", gameName);
            return;
        }

        this.isLocked = true;
        this.currentGame = entry.module;

        this.showScreen(entry.screen);
        entry.module.start(this);

        // 🔊 Rumi presenta el juego
        this.rumi.speak("¡Juana! Prepárate para jugar a " + gameName + ". ¡Será una gran aventura científica!");

        setTimeout(() => { this.isLocked = false; }, 400);
    }

    goHome() {
        if (this.isLocked) return;
        this.isLocked = true;

        if (this.currentGame && typeof this.currentGame.stop === 'function') {
            this.currentGame.stop();
        }

        this.currentGame = null;
        this.showScreen('home-screen');

        setTimeout(() => { this.isLocked = false; }, 400);
    }

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
    }

    // ================= MENSAJES =================
    updateCharacterMessage(gameId, msg) {
        // Buscamos el contenedor de mensajes específico del juego o el general
        const msgEl = document.getElementById(`${gameId}-character-msg`) || this.elements.characterMsg;
        if (!msgEl) return;

        msgEl.style.opacity = 0;

        setTimeout(() => {
            msgEl.textContent = msg;
            msgEl.style.opacity = 1;
            // La voz se maneja desde la lógica del juego para usar celebrate/encourage
        }, 200);
    }

    // ================= VOZ (REDIRECCIONADA A RUMI) =================
    speak(text) {
        // Ahora usamos el motor de Rumi que gestiona colas y UI
        if (this.rumi) {
            this.rumi.speak(text);
        }
    }

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

        // 🎉 Rumi celebra el logro
        this.rumi.celebrate("¡Impresionante Juana! Has ganado una estrella científica.");
    }

    saveStars() {
        try {
            localStorage.setItem('princess_stars', this.totalStars);
        } catch(e) {}
    }

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

// Hacemos App global para que los módulos de juegos puedan acceder a ella
window.app = App;
