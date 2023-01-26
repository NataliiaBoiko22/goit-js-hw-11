import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
export const fetchApi = async function (query, options, page) {
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

    if (page === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`, {
        position: 'right-top',
      });
    }
    if (response.data.totalHits === 0) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`,
        {
          position: 'right-top',
        }
      );
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};
