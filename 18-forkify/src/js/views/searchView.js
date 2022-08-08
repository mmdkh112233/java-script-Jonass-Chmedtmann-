class SearchView {
#parentEl = document.querySelector('.search');

getQuery () {
    const query = this.#parentEl.querySelector('.search__field').value;
    this._clearInput()
    return query;
}

addHandelerSearch(handeler) {
    this.#parentEl.addEventListener('submit' , function (e) {
        e.preventDefault()
        handeler();
    })
}

_clearInput () {
    this.#parentEl.querySelector('.search__field').value = '';
}

}

export default new SearchView()