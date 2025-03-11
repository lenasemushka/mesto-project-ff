// адрес сервера, токен и идентификатор
const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-33',
  headers: {
    authorization: 'ca81240d-8b66-453d-9ae0-10c4aecf042f',
    'Content-Type': 'application/json'
  }
}

// Обработка ответа сервера
const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((err) => {
    throw new Error(`Ошибка ${res.status}: ${err.message || "Неизвестная ошибка"}`);
  });
};

// Загрузка информации о пользователе с сервера (пункт 3)
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, { 
    headers: config.headers })
    .then(handleResponse)
    .catch((err) => console.error("Ошибка загрузки информации о пользователе с сервера:", err));
};

// Загрузка карточек с сервера (пункт 4)
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, { 
    headers: config.headers })
    .then(handleResponse)
    .then((cards) => {
      return cards;
    })
    .catch((err) => console.error("Ошибка загрузки карточки с сервера:", err));;
};

// редактирование профиля (пункт 5)
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: {
      authorization: config.headers.authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, about }),
  })
    .then(handleResponse)
    .catch((err) => console.error("Ошибка редактирования профиля:", err));
};

// Добавление новой карточки (пункт 6)
export const addNewCard = (name, link, userId) => {
  return fetch(`${config.baseUrl}/cards`, { 
    method: "POST",
    headers: {
      authorization: config.headers.authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, link, owner: userId })
  })
    .then(handleResponse)
    .then((card) => {
      console.log("Добавлена карточка с сервера:", card);
      card.likes = card.likes || [];
      return card;
    })
    .catch((err) => console.error("Ошибка добавления новой карточки:", err));
};

// удаление карточки (пункт 8)
export function deleteCardApi(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers
  })
  .then(handleResponse)
  .catch((err) => {
    console.error("Ошибка при удалении карточки:", err);
    throw err;
  });
}

// постановка и снятие лайка (пункт 9)
export const toggleLike = (cardId, isLiked) => {
  const method = isLiked ? "DELETE" : "PUT";
  const url = `${config.baseUrl}/cards/likes/${cardId}`;

  return fetch(url, {
    method: method,
    headers: config.headers,
  })
    .then(handleResponse)
    .then((updatedCard) => {
      if (!updatedCard || !updatedCard._id) {
        throw new Error("Некорректные данные карточки");
      }
      return updatedCard;
    })
    .catch((err) => {
      console.error("Ошибка при смене лайка:", err);
      throw err;
    });
};

// обновление аватара пользователя (пункт 10)
export function updateAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl }),
  })
    .then(handleResponse)
    .then((updatedUser) => {
      if (!updatedUser || !updatedUser.avatar) {
        throw new Error("Некорректные данные пользователя");
      }
      return updatedUser;
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
      throw err;
    });
}