import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiKey = 'YOUR_PIXABAY_API_KEY';
const perPage = 40;
let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchQuery = form.searchQuery.value.trim();
  if (searchQuery === '') return;

  try {
    Notiflix.Loading.pulse('Searching...');

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: perPage,
      },
    });

    const { data } = response;
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (currentPage === 1) {
      gallery.innerHTML = '';
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    data.hits.forEach((image) => {
      const card = document.createElement('div');
      card.classList.add('photo-card');
      card.innerHTML = `
        <a href="${image.largeImageURL}" class="gallery-item">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      `;
      gallery.appendChild(card);
    });

    currentPage++;
    if (currentPage > Math.ceil(data.totalHits / perPage)) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.style.display = 'block';
    }

    Notiflix.Loading.remove();
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Error fetching images. Please try again later.');
  }
});

loadMoreBtn.addEventListener('click', () => {
  form.dispatchEvent(new Event('submit'));
});

