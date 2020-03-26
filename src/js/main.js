'use strict';
import apiService from '../js/apiService.js';
import templates from '../templates/templat-item-cards.hbs';

class Form {
    constructor() {
        this.container = document.querySelector('body');
        this.searchForm = null;
        this.galleryList = null;
        this.btn = null;

        this.start();
    }

    renderSearchForm = () => {
        return `
        <form class="search-form" id="search-form">
        <input
        class="search-input"
          type="text"
          name="query"
          autocomplete="off"
          placeholder="Search images..."
        />
      </form>`;
    };
    renderImgList = () => {
        return `<ul class="gallery card-list js-card-list"></ul>`;
    };
    renderBtn = () => {
        return `<button type="button" class = "load-btn">Load more</button>`;
    };

    start = () => {
        this.addToScreen(this.container, 'beforeend', this.renderSearchForm());
        this.addToScreen(this.container, 'beforeend', this.renderImgList());

        this.searchForm = document.querySelector('#search-form');
        this.searchInput = document.querySelector('.search-input');
        this.galleryList = document.querySelector('.gallery');

        this.searchForm.addEventListener('submit', this.searchImg);
    };

    addToScreen = (container, position, el) => {
        container.insertAdjacentHTML(position, el);
    };

    searchImg = e => {
        e.preventDefault();
        this.clear();
        if (this.btn) this.btn.remove();
        apiService.changeWord(this.searchInput.value);
        apiService.getPicture();
        this.render();
    };

    render = async() => {
        this.length = this.galleryList.clientHeight;
        const api = await apiService.getPicture();
        const render = this.build(api);

        if (api.length) {
            this.addToScreen(this.container, 'beforeend', this.renderBtn());
            this.btn = document.querySelector('.load-btn');
            this.btn.addEventListener('click', this.loadMoreBtn);
            return;
        }
        return render;
    };

    scroll = () => {
        window.scrollTo({
            top: this.length + 90,
            behavior: 'smooth',
        });
    };

    build = items => {
        const markup = items.reduce((acc, el) => templates(el) + acc, '');
        this.galleryList.insertAdjacentHTML('beforeend', markup);
    };

    clear = () => {
        this.galleryList.innerHTML = '';
    };

    loadMoreBtn = async() => {
        if (this.btn) {
            this.btn.remove();
            apiService.nextPage();
        }
        const nextRender = await this.render();
        this.scroll();
    };
}

new Form();