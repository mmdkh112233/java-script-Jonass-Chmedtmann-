import icons from 'url:../../img/icons.svg';

export default class View {
    _data;

    /**
     * resive Object to the DOM
     * @param {Object | Object[]} data the data to be rendered 
     * @returns {undefined | string} A markup returned
     * @this {Object} View instance
     */
    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError(this._message)
        this._data = data
        const markup = this._generatorMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin' , markup)
    } 

    _clear() {
        this._parentElement.innerHTML = '';
    }

    update(data) {
      this._data = data
      const newMarkup = this._generatorMarkup();
      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElement = Array.from(newDOM.querySelectorAll('*'));
      const curElement = Array.from(this._parentElement.querySelectorAll('*'));
      
      newElement.forEach((newEl , i) => {
        const curEl = curElement[i];
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
            curEl.textContent = newEl.textContent
        }

        if(!newEl.isEqualNode(curEl)){
          Array.from(newEl.attributes).forEach(att => curEl.setAttribute(att.name , att.value))
        }
      })
    }


    
    renderSpinner = function () {
        const markup = `
             <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div> 
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin' , markup)
      }

      renderError (message = this._message) {
          const markup = `
                <div class="error">
                  <div>
                    <svg>
                      <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                  </div>
                  <p>${message}</p>
                </div>
          `;
          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin' , markup);
      }

      renderMessage (message = this._message) {
        const markup = `

              <div class="recipe">
              <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin' , markup);
    }
}