import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "simplelightbox/dist/simple-lightbox.min.css";

const galleryItem = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form__input');
const infinityItem = document.querySelector('.footer');

let page = 1;
let totalPages = 0;
const lightbox = new SimpleLightbox('.gallery .gallery-item');
const fetchApi = async function (query, options, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '33010792-9be0a9a8fe82c8e51d7216432',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
        ...options,
      },
    });

    totalPages = Math.ceil(response.data.totalHits / 40);

    
    if (page === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`, {
        position: 'right-top',
      });
    }
    if (response.data.totalHits === 0) {
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.`, {
          position: 'right-top',
        });
      };
    return response.data.hits;
  } catch (error) {
    console.log(error);
  }
}

function renderGallery(dataFromApi) {
  let item = '';
  dataFromApi.map(image => {
    item += `
    <a class="gallery-item" href="${image.largeImageURL}">
    <div class="photo-card">
    <img class="gallery-img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${image.likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${image.views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${image.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${image.downloads}
      </p>
    </div>
  </div>
  </a>`
  });

  galleryItem.innerHTML += item;
  lightbox.refresh();
    if (page > 1) {
  scroll()
    };
    }

 const onSearch = async function () {
        const query = searchInput.value;
        page = 1;
        const dataFromApi = await fetchApi(query, {}, page);
        renderGallery(dataFromApi);
        infinityObserver.observe(infinityItem);
    };
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  onSearch();
});

const infinityObserver = new IntersectionObserver(async function (entries, observer) {
    if (entries[0].isIntersecting === false) return;
    const query = searchInput.value;
    page += 1;
    const dataFromApi = await fetchApi(query, {}, page);
    renderGallery(dataFromApi);
    if (page === totalPages) {
      Notify.info("We're sorry, but you've reached the end of search results.", {
        position: 'right-bottom',
      });
      return;
    }
  });
function scroll() {
const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
})};
// console.log("Hello");