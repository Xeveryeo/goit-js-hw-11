export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '42872667-a32b7cb89a6fea6915bc24608';

export const options = {
  params: {
    key: API_KEY,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};
