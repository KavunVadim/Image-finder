'use strict';
import ApiService from '../js/apiService.js';
import templatesCard from '../templates/templat-item-cards.hbs';
import templatSearchForm from '../templates/templat-search-form.hbs';
import templatGalleryList from '../templates/templat-gallery-list.hbs';
import templatBtn from '../templates/templat-btn.hbs';

const apiService = new ApiService();

class SearchImagesPlugin {
    constructor() {
        this.container = document.querySelector('body');
        this.searchForm = null;
        this.galleryList = null;
        this.btn = null;
    }

    start = (formClass, inputClass, galleryClass) => {
        this.addToScreen(this.container, 'beforeend', templatSearchForm());
        this.addToScreen(this.container, 'beforeend', templatGalleryList());
        this.getDOMElement(formClass, inputClass, galleryClass);

        this.searchForm.addEventListener('submit', this.galleryRequest);
    };

    getDOMElement = (formClass, inputClass, galleryClass) => {
        this.searchForm = document.querySelector(`.${formClass}`);
        this.searchInput = document.querySelector(`.${inputClass}`);
        this.galleryList = document.querySelector(`.${galleryClass}`);
    };

    addToScreen = (container, position, el) => {
        container.insertAdjacentHTML(position, el);
    };

    galleryRequest = async e => {
        e.preventDefault();
        if (this.searchInput.value) {
            this.clearList();
            this.removeBtn();

            apiService.changeWord(this.searchInput.value);
            const arrImg = await apiService.getPicture();
            this.renderImg(arrImg);
        }
    };

    renderImg = arrImg => {
        this.length = this.galleryList.clientHeight;
        this.renderMarkup(arrImg);

        if (arrImg.length) {
            this.addToScreen(this.container, 'beforeend', templatBtn());
            this.btn = document.querySelector('.load-btn');
            this.btn.addEventListener('click', this.loadMoreBtn);
        }
    };
    loadMoreBtn = async() => {
        apiService.nextPage();
        const arrImg = await apiService.getPicture();
        this.removeBtn();
        this.renderImg(arrImg);
        this.scroll();
    };

    scroll = () => {
        window.scrollTo({
            top: this.length - 90,
            behavior: 'smooth',
        });
    };

    renderMarkup = items => {
        const markup = items.reduce((acc, el) => templatesCard(el) + acc, '');
        this.addToScreen(this.galleryList, 'beforeend', markup);
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

new SearchImagesPlugin().start('search-form', 'search-input', 'gallery');