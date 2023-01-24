import { fetchApi } from './fetchApi';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryItem = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form__input');
const infinityItem = document.querySelector('.footer');

let page = 1;
const lightbox = new SimpleLightbox('.gallery .gallery-item');
const onSearch = async function () {
  galleryItem.innerHTML = '';
  const query = searchInput.value.trim();
  page = 1;
  const dataFromApi = await fetchApi(query, {}, page);
  console.log(dataFromApi);
  renderGallery(dataFromApi);
  infinityObserver.observe(infinityItem);
  // return;
};
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
  </a>`;
  });

  galleryItem.innerHTML += item;
  lightbox.refresh();
  if (page > 1) {
    scroll();
  }
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  onSearch();
});

const infinityObserver = new IntersectionObserver(async function (
  entries,
  observer
) {
  if (entries[0].isIntersecting === false) return;
  const query = searchInput.value;
  page += 1;
  console.log(page);
  const dataFromApi = await fetchApi(query, {}, page, totalPages);
  console.log(totalPages);
  renderGallery(dataFromApi);
  if (page === totalPages) {
    Notify.info("We're sorry, but you've reached the end of search results.", {
      position: 'right-bottom',
    });
    searchForm.reset();
    return;
  }
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
