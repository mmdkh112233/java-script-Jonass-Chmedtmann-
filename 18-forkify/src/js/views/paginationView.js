import View from "./view.js";
import icons from 'url:../../img/icons.svg';

class Pagination extends View {
    _parentElement = document.querySelector('.pagination')

    addHandlerPagination(handler) {
        this._parentElement.addEventListener('click' , function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;

            const goto  = +btn.dataset.goto;
            handler(goto)
        })
    }

    _generatorMarkup() {
        const curPage = this._data.page;
        const numPage = Math.ceil(this._data.results.length / this._data.resultPerPage);

        //Page 1
        if (curPage === 1 && numPage > 1) {
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }

        
        //last page
        if (curPage === numPage && numPage > 1) {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `

        }

        //other Page
        if (curPage < numPage) {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }

         //less an 1 Page
     
         return '';
    }
}

export default new Pagination();