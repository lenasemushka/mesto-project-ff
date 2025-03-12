import './pages/index.css';
import './images/logo.svg';
import './images/avatar.jpg';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, updateAvatar } from './components/api.js';
import { createCard, handleLikeClick } from './components/card.js';
import { openModal, closeModal, setPopupListeners } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

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
const profileImage = document.querySelector('.profile__image');
const popupAvatarEdit = document.querySelector(".popup_type_avatar-edit");
const avatarForm = document.forms["avatar-edit"];

const formEditProfile = document.querySelector(".popup__form[name='edit-profile']");
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const descriptionInput = formEditProfile.querySelector(".popup__input_type_description");

const formAddCard = document.querySelector(".popup__form[name='new-place']");
const placeNameInput = formAddCard.querySelector(".popup__input_type_card-name");
const linkInput = formAddCard.querySelector(".popup__input_type_url");

let userId = null; 

const renderUserInfo = (userData) => {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileImage.style.backgroundImage = `url(${userData.avatar})`;
};

function renderCards(cards, userId) {
  cards.forEach((card) => addCardToDOM(card, userId));
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id; 
    renderUserInfo(userData);
    renderCards(cards, userId);
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });

editProfileButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent; 
  descriptionInput.value = profileDescription.textContent; 
  formEditProfile.reset();
  clearValidation(formEditProfile, validationConfig);
  openModal(popupEditProfile);
});

profileImage.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(popupAvatarEdit);
});

addCardButton.addEventListener("click", () => {
  formAddCard.reset();
  clearValidation(formAddCard, validationConfig);
  openModal(popupAddCard);
});

function handleFormSubmit(form, submitCallback) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const saveButton = form.querySelector(".popup__button");
    const originalText = saveButton.textContent;
    saveButton.textContent = "Сохранение...";

    const inputList = Array.from(form.querySelectorAll(validationConfig.inputSelector));
    const isFormValid = inputList.every((inputElement) => inputElement.validity.valid);

    if (!isFormValid) {
      saveButton.textContent = originalText;
      return;
    }

    submitCallback()
      .then(() => { 
        closeModal(form.closest(".popup"));
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        const errorElement = form.querySelector(`.${validationConfig.inputErrorClass}`);
        errorElement.textContent = err.message || "Произошла ошибка";
      })
      .finally(() => {
        saveButton.textContent = originalText;
      });
  });
}

handleFormSubmit(avatarForm, () => {
  const avatarUrl = avatarForm.elements.avatar.value;
  return updateAvatar(avatarUrl).then((updatedUser) => {
    profileImage.style.backgroundImage = `url('${updatedUser.avatar}')`;
  })
});

handleFormSubmit(formEditProfile, () => {
  return updateUserInfo(nameInput.value, descriptionInput.value)
  .then((userData) => {
    renderUserInfo(userData);
  })
});

handleFormSubmit(formAddCard, () => {
  const name = placeNameInput.value;
  const link = linkInput.value;
  return addNewCard(name, link, userId)
  .then((card) => {
    addCardToDOM(card, userId);
  });
});

function addCardToDOM(card, userId) {
  const cardElement = createCard(card, handleLikeClick, () => handleImageClick(card), userId);
  placesList.prepend(cardElement);
}

function handleImageClick(card ) {
  popupImg.src = card.link;
  popupImg.alt = card.name;
  popupCaption.textContent = card.name;
  openModal(popupImage);
}

setPopupListeners(popupEditProfile);
setPopupListeners(popupAvatarEdit);
setPopupListeners(popupAddCard);
setPopupListeners(popupImage);

enableValidation(validationConfig);