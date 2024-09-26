const navList = document.querySelector(".nav-list");
const navBtns = document.querySelectorAll(".nav-btn");
const catalogs = document.querySelectorAll(".shop .catalog");

navBtns.forEach((navBtn) => {
  navBtn.addEventListener("click", () => {
    navBtns.forEach((btn) => btn.classList.remove("active"));
    navBtn.classList.add("active");
    //
    const dataId = navBtn.getAttribute("data-id").replace("Btn", "");
    catalogs.forEach((catalog) => {
      if (!catalog.classList.contains("none")) {
        catalog.classList.add("none");
      }
    });

    const activeCatalog = document.querySelector(`#${dataId}`);
    if (activeCatalog) {
      activeCatalog.classList.remove("none");
    }
  });
});

const basketCards = document.querySelector(".basket_cards");
const totalPriceElement = document.querySelector(".total-price"); // Элемент для отображения итога
const cardBtns = document.querySelectorAll(".card-btn");

let totalPrice = 0; // Общая сумма

// Функция для обновления общей суммы
function updateTotalPrice() {
  totalPrice = 0;
  basketCards.querySelectorAll(".card").forEach((card) => {
    const cardPrice = Number(
      card.querySelector(".card-price").textContent.split(" ")[0]
    );
    totalPrice += cardPrice;
  });
  totalPriceElement.textContent = `Итого: ${totalPrice} ₽`;
}

cardBtns.forEach((cardBtn) => {
  cardBtn.addEventListener("click", (e) => {
    const cardPrice = Number(
      e.target.parentElement
        .querySelector(".card-price")
        .textContent.split(" ")[0]
    );
    const cardName =
      e.target.parentElement.querySelector(".card-name").textContent;
    const cardSrc = e.target.parentElement
      .querySelector(".card-img")
      .getAttribute("src");
    const cardAlt = e.target.parentElement
      .querySelector(".card-img")
      .getAttribute("alt");
    const cardWeight =
      e.target.parentElement.querySelector(".card-weight").textContent;

    // Проверяем, есть ли уже такой товар в корзине
    let existingCard = Array.from(basketCards.children).find(
      (basketCard) =>
        basketCard.querySelector(".card-name").textContent === cardName
    );

    function calculatePrice(card, currentCount) {
      const counterText = card.querySelector(".counter-text");
      const priceText = card.querySelector(".card-price");
      counterText.textContent = `${currentCount}`; // Обновляем отображаемое количество
      const updatedPrice = cardPrice * currentCount;
      priceText.textContent = `${updatedPrice} ₽`; // Обновляем цену на основе количества
      updateTotalPrice(); // Обновляем общую сумму
    }

    function updateBasketBorder() {
      // Проверяем количество элементов в корзине и отображаем/скрываем границу
      basketCards.children.length > 0
        ? (basketCards.style.border = "1px solid black")
        : (basketCards.style.border = "none");
    }

    if (existingCard) {
      // Если товар уже есть, увеличиваем количество
      let currentCount = parseInt(
        existingCard.querySelector(".counter-text").textContent
      ); // Читаем текущее количество
      currentCount++; // Увеличиваем на 1
      calculatePrice(existingCard, currentCount); // Обновляем цену и количество
    } else {
      // Если товара нет, добавляем новый
      basketCards.insertAdjacentHTML(
        "beforeend",
        `
        <div class="basket-card" class="catalog" style="width: 300px; margin: 8px 0;">
          <div class="card" style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            padding: 0 5px;
          ">
            <img
              width="120px"
              height="100px"
              src="${cardSrc}"
              alt="${cardAlt}"
              class="card-img"
            />
            <div class="card-info" style="width: 80px;">
              <p class="card-name">${cardName}</p>
              <h4 class="card-price">${cardPrice} ₽</h4>
              <p class="card-weight">${cardWeight}</p>
            </div>
            <div class="card-counter" style="
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 10px;
              padding: 0 5px;
              width 60px;
            ">
              <button class="basket-btn decrement-btn" style="border: none; font-size: 20px; cursor: pointer;">-</button>
              <h4 class="counter-text">1</h4> <!-- Начальное количество = 1 -->
              <button class="basket-btn increment-btn" style="border: none; font-size: 20px; cursor: pointer;">+</button>
            </div>
          </div>
        </div>
      `
      );

      const basketCard = basketCards.querySelector(".basket-card:last-child");
      const counterText = basketCard.querySelector(".counter-text");
      let currentCount = 1; // Начальное количество товара

      calculatePrice(basketCard, currentCount); // Устанавливаем начальную цену и количество

      const incrementBtn = basketCard.querySelector(".increment-btn");
      const decrementBtn = basketCard.querySelector(".decrement-btn");

      incrementBtn.addEventListener("click", () => {
        currentCount = parseInt(counterText.textContent); // Получаем текущее количество
        currentCount++; // Увеличиваем количество
        calculatePrice(basketCard, currentCount); // Обновляем цену и количество
      });

      decrementBtn.addEventListener("click", () => {
        currentCount = parseInt(counterText.textContent); // Получаем текущее количество
        if (currentCount > 1) {
          currentCount--; // Уменьшаем количество только если оно больше 1
          calculatePrice(basketCard, currentCount);
        } else {
          basketCard.remove(); // Удаляем карточку
          updateTotalPrice(); // Обновляем общую сумму при удалении товара
          updateBasketBorder(); // Проверяем, нужно ли скрыть границу корзины после удаления
        }
      });
    }
  });
});

const modal = document.querySelector(".modal");
const payment = document.querySelector(".payment");
const creditCard = document.querySelector(".credit-card");

creditCard.addEventListener("click", (e) => {
  console.log(`Количество дочерних элементов в корзине: ${basketCards.childElementCount}`);

  // Проверяем, есть ли дочерние элементы в корзине
  if (basketCards.childElementCount === 0) {
    alert("Ваша корзина пустая");
  } else {
    modal.classList.remove("none"); // Убираем класс .none у оверлея
    document.body.classList.add("no-scroll"); // Отключаем прокрутку
    modal.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});


modal.addEventListener("click", (e) => {
  // Проверяем, что клик был по оверлею
  if (e.target === modal) {
    // Это условие проверяет, что клик произошел на оверлее
    modal.classList.add("none"); // Скрываем модальное окно
    document.body.classList.remove("no-scroll"); // Включаем прокрутку
  }
});

const address = document.querySelectorAll(".delivery-input"); // Это коллекция элементов
const radioButtons = document.querySelectorAll('input[name="choice"]');

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("change", (e) => {
    if (radioButton.checked && radioButton.value === "self-call") {
      address.forEach((input) => input.classList.add("none")); // Прячем все элементы с классом 'delivery-input'
    } else {
      address.forEach((input) => input.classList.remove("none")); // Показываем все элементы с классом 'delivery-input'
    }
  });
});
