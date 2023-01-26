import { fetchApi } from './fetchApi';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryItem = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form__input');
const infinityItem = document.querySelector('.footer');
let lastQuery = null;
let page = 1;
let per_page = 40;

const lightbox = new SimpleLightbox('.gallery .gallery-item');
function onSearch() {
  const query = searchInput.value;

  if (query === lastQuery) {
    return;
  } else {
    galleryItem.innerHTML = '';
  }

  lastQuery = query;
  page = 1;
  fetchApi(query, {}, page, per_page).then(({ data }) => {
    renderGallery(data.hits);
    if (query !== '') {
      infinityObserver.observe(infinityItem);
      return;
    }
  });
}
function renderGallery(images) {
  const renderImg = images
    .map(image => {
      return `
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
  </a>`;
    })
    .join();
  galleryItem.insertAdjacentHTML('beforeend', renderImg);
  lightbox.refresh();
  if (page > 1) {
    scroll();
  }
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  galleryItem.innerHTML = '';

  let query = searchInput.value;
  if (query !== '') {
    page = 1;
    onSearch();
  }
});

const infinityObserver = new IntersectionObserver(function (entries, observer) {
  if (entries[0].isIntersecting === false) return;
  page += 1;
  console.log(page);
  fetchApi(lastQuery, {}, page, per_page).then(({ data }) => {
    renderGallery(data.hits);
    const totalPages = Math.ceil(data.totalHits / per_page);
    console.log(totalPages);
    if (page === totalPages) {
      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        {
          position: 'right-bottom',
        }
      );
      searchForm.reset();
    }
    return;
  });
});
function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
