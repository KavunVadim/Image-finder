'use strict';
import axios from 'axios';
// import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';

export default {
    key: '15710546-4d802d844bffb0342b908b572',
    page: 1,
    perPage: 12,
    word: '',

    async getPicture() {
        const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.word}&page=${this.page}&per_page=${this.perPage}&lang=ru&key=${this.key}`;
        try {
            const picture = await axios.get(url);
            return picture.data.hits;
        } catch {
            console.log(error);
        }
    },

    nextPage() {
        this.page += 1;
    },

    changeWord(word) {
        this.word = word;
        this.page = 1;
    },
};