import View from "./view.js";
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
    _parentElement = document.querySelector('.results')
    _message = 'we could find recipe , try agine'

    _generatorMarkup() {
            return this._data.map(this._generatorMarkupPreview).join('');
       
    }

    _generatorMarkupPreview(result) {
        const id = window.location.hash.slice(1)
        return `
                <li class="preview">
                <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">
                <figure class="preview__fig">
                    <img src="${result.image}" alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${result.title}</h4>
                    <p class="preview__publisher">${result.publisher}</p>
                </div>
                <div class="recipe__user-generated ${result.key ? '' : 'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
                </a>
            </li>
            `
    }
}

export default new ResultView();