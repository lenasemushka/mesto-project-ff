import './pages/index.css'; // добавьте импорт главного файла стилей 
import { openModal, closeModal, setPopupListeners } from './components/modal.js';
import { createCard, handleLikeClick, deleteCard } from './components/card.js';
import { initialCards } from './components/cards.js';
import './images/logo.svg';
import './images/avatar.jpg';

const popupEditProfile = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const popupImg = popupImage.querySelector(".popup__image");
const popupCaption = popupImage.querySelector(".popup__caption");

const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const placesList = document.querySelector(".places__list");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const formEditProfile = document.querySelector(".popup__form[name='edit-profile']");
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const descriptionInput = formEditProfile.querySelector(".popup__input_type_description");

const formAddCard = document.querySelector(".popup__form[name='new-place']");
const placeNameInput = formAddCard.querySelector(".popup__input_type_card-name");
const linkInput = formAddCard.querySelector(".popup__input_type_url");

editProfileButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(popupEditProfile);
});

// Обработчик отправки формы
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(popupEditProfile); // Закрываем попап после сохранения
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formEditProfile.addEventListener("submit", handleProfileFormSubmit);


// Добавление карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const newCard = createCard(
    {
      name: placeNameInput.value,
      link: linkInput.value
    },
    handleLikeClick,
    handleImageClick,
    deleteCard
  );

  placesList.prepend(newCard);

  closeModal(popupAddCard);
  formAddCard.reset();
}

formAddCard.addEventListener("submit", handleAddCardSubmit);

addCardButton.addEventListener("click", () => openModal(popupAddCard));

function handleImageClick(card) {
  popupImg.src = card.link;
  popupImg.alt = card.name;
  popupCaption.textContent = card.name;
  openModal(popupImage);
}


setPopupListeners(popupEditProfile);
setPopupListeners(popupAddCard);
setPopupListeners(popupImage);

// @todo: Вывести карточки на страницу
function showCards(cards) {
  cards.forEach((cardData) => {
      const card = createCard(cardData, handleLikeClick, handleImageClick, deleteCard);
      placesList.appendChild(card);
  });
}
showCards(initialCards);

