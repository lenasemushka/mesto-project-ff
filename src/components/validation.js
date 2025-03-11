export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Функция, которая добавляет класс с ошибкой
const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
  const errorElement = formElement.querySelector(`#${inputElement.id} + .popup__input-error`);
  
  inputElement.classList.add(validationConfig.inputErrorClass);
  // Заменим содержимое span с ошибкой на переданный параметр
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  // Очистим ошибку
  errorElement.textContent = "";
  errorElement.classList.remove(validationConfig.errorClass);
};

const isValid = (formElement, inputElement, validationConfig) => {
  let errorMessage = "";
  
  if (inputElement.validity.valueMissing) {
    errorMessage = "Вы пропустили это поле";
  } else if (inputElement.validity.tooShort) {
    errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${inputElement.value.length} символ.`;
  } else if (inputElement.validity.typeMismatch && inputElement.type === "url") {
    errorMessage = "Введите корректный URL";
  } else if (inputElement.validity.patternMismatch && inputElement.dataset.errorMessage) {
    errorMessage = inputElement.dataset.errorMessage;
  } else {
    inputElement.setCustomValidity("");
  }

  inputElement.setCustomValidity(errorMessage);

  if (errorMessage) {
    inputElement.setCustomValidity(errorMessage);
    showInputError(formElement, inputElement, errorMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

const hasInvalidInput = (inputList) => {
  // проходим по этому массиву методом some
  return inputList.some((inputElement) => !inputElement.validity.valid);
  // Если поле не валидно, колбэк вернёт true
  // Обход массива прекратится и вся функция
  // hasInvalidInput вернёт true
}; 

export const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  // Если есть хотя бы один невалидный инпут
  if (hasInvalidInput(inputList)) {
    // сделай кнопку неактивной
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    // иначе сделай кнопку активной
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
}; 

const setEventListeners = (formElement, validationConfig) => {
  // Находим все поля внутри формы,
  // сделаем из них массив методом Array.from
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  
  toggleButtonState(inputList, buttonElement, validationConfig);

  // Обойдём все элементы полученной коллекции
  inputList.forEach((inputElement) => {
    // каждому полю добавим обработчик события input
    inputElement.addEventListener('input', () => {
      // Внутри колбэка вызовем isValid,
      // передав ей форму и проверяемый элемент
      isValid(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
}; 

export const enableValidation = (validationConfig) => {
  // Найдём все формы с указанным классом в DOM,
  // сделаем из них массив методом Array.from
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  // Переберём полученную коллекцию
  formList.forEach((formElement) => {
    // Для каждой формы вызовем функцию setEventListeners,
    // передав ей элемент формы
    setEventListeners(formElement, validationConfig);
  });
};

//функция, которая очищает ошибки валидации формы и делает кнопку неактивной
export const clearValidation = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig); // скрываем все ошибки
    inputElement.setCustomValidity(""); // Очищаем кастомные сообщения
  });

  toggleButtonState(inputList, buttonElement, validationConfig);
};

