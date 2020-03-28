'use strict';
import apiService from '../js/apiService.js';
import templatesCard from '../templates/templat-item-cards.hbs';
import templatSearchForm from '../templates/templat-search-form.hbs';
import templatGalleryList from '../templates/templat-gallery-list.hbs';
import templatBtn from '../templates/templat-btn.hbs';

class SearchImages {
    constructor() {
        this.container = document.querySelector('body');
        this.searchForm = null;
        this.galleryList = null;
        this.btn = null;
    }

    start = () => {
        this.addToScreen(this.container, 'beforeend', templatSearchForm());
        this.addToScreen(this.container, 'beforeend', templatGalleryList());

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
        this.clearList();
        this.removeBtn();

        apiService.changeWord(this.searchInput.value);
        apiService.getPicture();
        this.renderImg();
    };

    renderImg = async() => {
        this.length = this.galleryList.clientHeight;
        const arrImg = await apiService.getPicture();
        const render = this.renderMarkup(arrImg);

        if (arrImg.length) {
            this.addToScreen(this.container, 'beforeend', templatBtn());
            this.btn = document.querySelector('.load-btn');
            this.btn.addEventListener('click', this.loadMoreBtn);
        }
        return render;
    };

    scroll = () => {
        window.scrollTo({
            top: this.length,
            behavior: 'smooth',
        });
    };

    renderMarkup = items => {
        const markup = items.reduce((acc, el) => templatesCard(el) + acc, '');
        this.addToScreen(this.galleryList, 'beforeend', markup);
    };

    loadMoreBtn = async() => {
        this.removeBtn();
        apiService.nextPage();
        const nextRender = await this.renderImg();
        this.scroll();
    };

    removeBtn = () => {
        if (this.btn) {
            this.btn.remove();
        }
    };

    clearList = () => {
        this.galleryList.innerHTML = '';
    };
}

new SearchImages().start();