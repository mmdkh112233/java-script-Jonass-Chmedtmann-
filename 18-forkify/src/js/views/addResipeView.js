import View from "./view.js";
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload')
    _message = 'recipe wase successfully uploaded :)'
    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _openbtn = document.querySelector('.nav__btn--add-recipe')
    _closebtn = document.querySelector('.btn--close-modal')
        
    constructor() {
        super();
        this._addHandelerShowWindow();
        this._addHandelerHiddenWindow()
    }
     
    toggleWindow () {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    _addHandelerShowWindow() {
        this._openbtn.addEventListener('click' , this.toggleWindow.bind(this))
    }

    _addHandelerHiddenWindow() {
        this._closebtn.addEventListener('click' , this.toggleWindow.bind(this))
        this._overlay.addEventListener('click' , this.toggleWindow.bind(this))
    }

    _addHandelerUpload (handeler) {
        this._parentElement.addEventListener('submit' , function (e) {
            e.preventDefault()
            const dataArr = [...new FormData(this)]
            const data = Object.fromEntries(dataArr)
            handeler(data);
        })
    }

    _generatorMarkup() {
        
    }
}

export default new AddRecipeView();