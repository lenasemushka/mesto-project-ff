
// @todo: Темплейт карточки

// @todo: DOM узлы
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
export function createCard(card, handleLikeClick, handleImageClick, deleteCard) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;

  likeButton.addEventListener("click", handleLikeClick);
  cardDeleteButton.addEventListener('click', () => deleteCard(cardElement));
  cardImage.addEventListener("click", () => handleImageClick(card));
  
  return cardElement;
}

// Функция, обработывающая событие лайка
export function handleLikeClick(event) {
  const likeButton = event.target.closest('.card__like-button');
  if (likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
  };
}

// @todo: Функция удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
}



