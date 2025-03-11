import { toggleLike, deleteCardApi } from "./api.js";

const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
export function createCard(card, handleLikeClick, handleImageClick, userId) { 
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  cardElement.dataset.cardId = card._id || '';

  const cardImage = cardElement.querySelector('.card__image');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;

  cardImage.addEventListener("click", handleImageClick);

  const likesArray = Array.isArray(card.likes) ? card.likes : [];
  likeCounter.textContent = likesArray.length;
  likeButton.classList.toggle("card__like-button_is-active", likesArray.some(user => user._id === userId));

  if (cardDeleteButton) {
    if (card.owner?._id === userId) { 
      cardDeleteButton.addEventListener('click', () => confirmDeleteCard(cardElement, card._id));
    } else {
      cardDeleteButton.remove(); 
    }
  }

  likeButton.addEventListener("click", (event) => handleLikeClick(event, card, userId));

  return cardElement;
}

// Функция, обработывающая событие лайка
export function handleLikeClick(event, card, userId) {
  const likeButton = event.target;
  const cardElement = likeButton.closest(".places__item");

  if (!cardElement) {
    console.error("Ошибка: карточка не найдена.");
    return;
  }

  const cardId = cardElement.dataset.cardId;
  if (!cardId) {
    console.error("Ошибка: у карточки нет ID.");
    return;
  }

  const likeCounter = cardElement.querySelector(".card__like-counter");
  if (!likeCounter) {
    console.error("Ошибка: счётчик лайков не найден");
    return;
  }
  
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  
  toggleLike(cardId, isLiked)
    .then((updatedCard) => {
      if (!updatedCard || !updatedCard.likes) {
        throw new Error("Некорректные данные карточки");
      }

      likeCounter.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active", updatedCard.likes.some(user => user._id === userId));
    })
    .catch((err) => {
      console.error("Ошибка при изменении лайка:", err);
      likeButton.classList.toggle("card__like-button_is-active", !isLiked);
      likeCounter.textContent = isLiked ? parseInt(likeCounter.textContent, 10) - 1 : parseInt(likeCounter.textContent, 10) + 1;
    });
}

// Функция удаления карточки
function confirmDeleteCard(cardElement, cardId) {
  const isConfirmed = confirm("Вы уверены?");
  if (!isConfirmed) return;

  deleteCardApi(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    });
}