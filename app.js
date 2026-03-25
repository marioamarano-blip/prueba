import SumasGame from './games/sumas.js';

const App = {
    isLocked: false,

    elements: {
        homeScreen: document.getElementById('home-screen'),
        gameScreen: document.getElementById('game-screen'),
        btnPlay: document.getElementById('btn-play'),
        btnBack: document.getElementById('btn-back'),
        num1Display: document.getElementById('num1'),
        num2Display: document.getElementById('num2'),
        feedback: document.getElementById('feedback-msg'),
        characterMsg: document.getElementById('character-msg'),
        optionsContainer: document.getElementById('options-container')
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        this.elements.btnPlay.addEventListener('click', () => this.switchScreen('game'));
        this.elements.btnBack.addEventListener('click', () => this.switchScreen('home'));
    },

    switchScreen(screenName) {
        if (screenName === 'game') {
            this.elements.homeScreen.classList.remove('active');
            this.elements.gameScreen.classList.add('active');
            SumasGame.start(this);
        } else {
            this.elements.gameScreen.classList.remove('active');
            this.elements.homeScreen.classList.add('active');
        }
    },

    updateCharacterMessage(msg) {
        this.elements.characterMsg.textContent = msg;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
