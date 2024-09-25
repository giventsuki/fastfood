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
      if (!catalog.classList.contains('none')) {
        catalog.classList.add('none');
      }
    });

    const activeCatalog = document.querySelector(`#${dataId}`);
    if (activeCatalog) {
      
      activeCatalog.classList.remove("none");
    }
  });
});

const basketCards = document.querySelector('.basket_cards');
const totalPriceElement = document.querySelector('.total-price'); // Элемент для отображения итога
const cardBtns = document.querySelectorAll('.card-btn');

let totalPrice = 0; // Общая сумма

// Функция для обновления общей суммы
function updateTotalPrice() {
  totalPrice = 0;
  basketCards.querySelectorAll('.card').forEach(card => {
    const cardPrice = Number(card.querySelector('.card-price').textContent.split(' ')[0]);
    totalPrice += cardPrice;
  });
  totalPriceElement.textContent = `Итого: ${totalPrice} ₽`;
}

cardBtns.forEach(cardBtn => {
  cardBtn.addEventListener('click', e => {
    const cardPrice = Number(e.target.parentElement.querySelector('.card-price').textContent.split(' ')[0]);
    const cardName = e.target.parentElement.querySelector('.card-name').textContent;
    const cardSrc = e.target.parentElement.querySelector('.card-img').getAttribute('src');
    const cardAlt = e.target.parentElement.querySelector('.card-img').getAttribute('alt');
    const cardWeight = e.target.parentElement.querySelector('.card-weight').textContent;
    
    let count = 1;
    let currentPrice = cardPrice;

    // Проверяем, есть ли уже такой товар в корзине
    let existingCard = Array.from(basketCards.children).find(basketCard => 
      basketCard.querySelector('.card-name').textContent === cardName
    );

    function calculatePrice(card, currentCount) {
      const counterText = card.querySelector('.counter-text');
      const priceText = card.querySelector('.card-price');
      counterText.textContent = `${currentCount} шт`;
      const updatedPrice = cardPrice * currentCount;
      priceText.textContent = `${updatedPrice} ₽`;
      updateTotalPrice(); // Обновляем общую сумму после изменения цены
    }

    if (existingCard) {
      // Если такой товар уже есть, увеличиваем количество
      let currentCount = parseInt(existingCard.querySelector('.counter-text').textContent.split(' ')[0]);
      currentCount++; // Увеличиваем текущее количество на 1
      calculatePrice(existingCard, currentCount);
    } else {
      // Если товара нет, добавляем новый
      basketCards.insertAdjacentHTML('beforeend', `
        <div id="basket-card" class="catalog" style="width: 300px; margin-top: 15px;">
          <div class="card" style="padding:5px 15px">
            <img
              width="270px"
              height="200px"
              src="${cardSrc}"
              alt="${cardAlt}"
              class="card-img"
            />
            <h4 class="card-price">${cardPrice} ₽</h4>
            <p class="card-name">${cardName}</p>
            <p class="card-weight">${cardWeight}</p>
            <div class="counter">
              <h4 class="counter-text">${count} шт</h4>
              <div class="basket-btns">
                <button class="basket-btn increment-btn" style="border: 1px solid black; width: 80px; height: 20px">+</button>
                <button class="basket-btn decrement-btn" style="border: 1px solid black; width: 80px; height: 20px">-</button>
              </div>
            </div>
          </div>
        </div>
      `);

      const basketCard = basketCards.querySelector('#basket-card:last-child');
      calculatePrice(basketCard, count);

      const incrementBtn = basketCard.querySelector('.increment-btn');
      const decrementBtn = basketCard.querySelector('.decrement-btn');

      incrementBtn.addEventListener('click', () => {
        count++;
        calculatePrice(basketCard, count);
      });

      decrementBtn.addEventListener('click', () => {
        if (count > 1) {
          count--;
          calculatePrice(basketCard, count);
        } else {
          basketCard.remove();
          updateTotalPrice(); // Обновляем общую сумму при удалении товара
        }
      });
    }

    // Проверяем, нужно ли показывать границу корзины
    basketCards.children.length > 0 ? basketCards.style.border = '1px solid black' : basketCards.style.border = 'none';
  });
});
