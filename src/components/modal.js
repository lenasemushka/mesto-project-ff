const handleEscKeyUp = (e) => {
  if (e.key === "Escape") {
    const popup = document.querySelector(".popup_is-opened"); // находим открытый попап
    if (popup) closeModal(popup);
  }
};

export const openModal = (modal) => {
  modal.classList.add("popup_is-opened"); // добавить класс открытия попапа
  document.addEventListener("keydown", handleEscKeyUp); // добавить слушатель на кнопку Escape
};

export const closeModal = (modal) => {
  modal.classList.remove("popup_is-opened"); // удалить класс открытия попапа
  document.removeEventListener("keydown", handleEscKeyUp); // удалить слушатель на кнопку Escape
};

export const setPopupListeners = (popupElement) => {
  const closeButton = popupElement.querySelector(".popup__close"); // ищем кнопку крестик в попапе
  closeButton.addEventListener("click", () => {
    closeModal(popupElement); // закрываем попап
  });

  popupElement.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains("popup")) { // если event.target содержит класс "popup", то закрываем
      closeModal(popupElement);
    }
  });
};




