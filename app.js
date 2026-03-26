import SumasGame from './games/sumas.js';

const App = {
    isLocked: false,
    elements: {
        screens: document.querySelectorAll('.screen'),
        homeScreen: document.getElementById('home-screen'),
        gameScreen: document.getElementById('game-screen'),
        btnPlay: document.getElementById('btn-play'),
        btnBack: document.getElementById('btn-back'),
        characterMsg: document.getElementById('character-msg'),
        optionsContainer: document.getElementById('options-container')
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        this.elements.btnPlay.onclick = () => this.goTo('game');
        this.elements.btnBack.onclick = () => this.goTo('home');
    },

    goTo(screenName) {
        if (this.isLocked) return;
        this.isLocked = true;

        this.elements.screens.forEach(s => s.classList.remove('active'));

        if (screenName === 'game') {
            this.elements.gameScreen.classList.add('active');
            SumasGame.start(this);
        } else {
            this.elements.homeScreen.classList.add('active');
        }

        setTimeout(() => { this.isLocked = false; }, 500);
    },

    updateCharacterMessage(msg) {
        this.elements.characterMsg.style.opacity = 0;
        setTimeout(() => {
            this.elements.characterMsg.textContent = msg;
            this.elements.characterMsg.style.opacity = 1;
        }, 200);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
export default App;
