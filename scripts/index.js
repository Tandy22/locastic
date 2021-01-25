/********************************************************************
 ********************************************************************
 * HTML TAG REFERENCES
 */

// GO TO PREVIOUS PAGE
// let arrowGoBack = document.querySelector(".aside-navigation__icon");

// WORKSHOP CARDS RELATED
let numberOfDisplayedCards = document.querySelector(".main__header-items-displayed-count");
let workshopCardsContainer = document.querySelector(".main__workshops");


/********************************************************************
 ********************************************************************
 * FUNCTIONS
 */


/********************************
 * WALL CONTENT -  INITIALIZATION
 */

// VISUAL
function getWorkshopCardTemplate(id, itemType, section) {
  /**
   * Builds and returns new workshop card either for Index.html or
   * for Workshop.html.
   */

  let iconClass = "";

  if (section === "frontend")
    iconClass = "frontend-icon";
  else if (section === "backend")
    iconClass = "backend-icon";
  else if (section === "marketing")
    iconClass = "marketing-icon";

  let workshopCard = document.createElement("article");
  workshopCard.classList.add("workshop-card");
  workshopCard.setAttribute("data-id", id);
  workshopCard.setAttribute("data-typeId", itemType.id);
  workshopCard.innerHTML = `
    <div class="workshop-card__image-container">
      <img class="workshop-card__image" src="${itemType.headerImageLocation}" alt="card header image">
      <img class="workshop-card__image--mobile" src="${itemType.cartImageLocation}" alt="card header image">
    </div>
    <div class="workshop-card__flex-row">
      <div class="workshop-card__icon-container">
        <img class="workshop-card__icon ${iconClass}" style="${itemType.invertIconColor ? "filter: invert(100%);" : ""}" src="${itemType.iconLocation}" alt="workshop icon">
      </div>
      <section class="workshop-card__time-container">
        <div class="workshop-card__time-container__calendar">
            <img class="workshop-card__time-container__calendar-icon" src="assets/Calendar-icon.svg" alt="calendar icon">
            <time datetime="27-6-2020">
              <h6>27.6.2020</h6>
            </time>
        </div>
        <div class="workshop-card__time-container__clock">
            <img class="workshop-card__time-container__clock-icon" src="assets/Clock-icon.svg" alt="clock icon">
            <time datetime="9:00">
              <h6>9:00h</h6>
            </time>
        </div>
      </section>
      <a href="Workshop.html?id=${id}&typeId=${itemType.id}">
        <h4 class="workshop-card__title">Interaction Design Workshop</h4>
      </a>
      <section class=workshop-card__price-container>
        <h3 class="workshop-card__price__ammount">${formatToCurrency(itemType.price)}</h3>
        <h6 class="workshop-card__price__currency">${itemPriceCurrency}</h6>
      </section>
      <button class="workshop-card__buy-button">
        <span class="workshop-card__buy-button-text">Add to Cart</span>
        <img class="workshop-card__buy-button-icon" src="assets/Cart-icon.svg" alt="cart icon">
      </button>
    </div>
    `;
  
  return workshopCard;
}

function loadWorkshopCards() {
  /**
   * Loads workshop cards into an Index page and sets some of them as
   * hidden.
   * It tracks what kind of workshop cards to load depending on
   * 'section' URL parameter. Parameter 'section' can have any kind
   * of value from name attribute in 'itemTypes' declared in init.js.
   * 
   * NOTICE: All existing cards are added to HTML DOM, but some will
   *         not be shown.
   */

  // clean all current workshop cards on a page
  numberOfDisplayedCards.innerHTML = 0;
  workshopCardsContainer.innerHTML = "";

  let queryString = window.location.search;
  let params = new URLSearchParams(queryString);
  let section = params.get("section");
  let itemsDisplayed = 0;

  if (!section) {
    // if section is not defined, set 'design' section as default
    section = "design";
  }
  
  if (section === "all") {
    let id = 1;

    itemTypes.forEach(itemType => {
      for (let i = 0; i < itemType.onPageCount; i++) {
        let workshopCard = getWorkshopCardTemplate(id, itemType, section);
        id += 1
        
        if (id - 1 > initialItemsLoad) {
          workshopCard.classList.add("workshop-card--hidden");
        }
        else {
          itemsDisplayed += 1;
        }

        workshopCardsContainer.appendChild(workshopCard);
      }
    });
  }
  else {
    let itemType = itemTypes.find(itemType => itemType.name === section);

    if (itemType) {
      // if itemType exists, load cards with itemType's kind of data
      for (let i = 0; i < itemType.onPageCount; i++) {
        let workshopCard = getWorkshopCardTemplate(i + 1, itemType, section);
        
        if (i >= initialItemsLoad) {
          workshopCard.classList.add("workshop-card--hidden");
        }
        else {
          itemsDisplayed += 1;
        }

        workshopCardsContainer.appendChild(workshopCard);
      }
    }
  }
  numberOfDisplayedCards.innerHTML = itemsDisplayed;
}

// EVENTS
function enableWorkshopCardsAddToCart() {
  /**
   * Enables events to interact with workshop cards taht are initialy
   * loaded into 'workshopCardsContainer'. It consists of visible and
   * invisible cards if wall contains many more cards.
   */

  workshopCardsContainer.childNodes.forEach(workshopCard => {
    workshopCard.querySelector(".workshop-card__buy-button")
      .addEventListener("click", function() {
      updateCart(
        parseInt(workshopCard.getAttribute("data-id")),
        parseInt(workshopCard.getAttribute("data-typeId")),
        1,
        operation.INCREASE
      );
      updateVisuals(sidebarFirst = false);
    });
  });
}


/**************************
 * WALL CONTENT - LOAD MORE
 */

// VISUAL
function loadMoreWorkshopCards() {
  /**
   * Loads more workshop cards from list of already hidden cards.
   * Function takes first 'itemsPerLoad' hidden cards and shows them.
   */

  let hiddenWorkshopCards = workshopCardsContainer.querySelectorAll(".workshop-card--hidden");

  for (let i = 0; i < hiddenWorkshopCards.length; i++) {
    if (i < itemsPerLoad) {
      hiddenWorkshopCards[i].classList.remove("workshop-card--hidden");
      numberOfDisplayedCards.innerHTML = parseInt(numberOfDisplayedCards.innerHTML) + 1;
    }
  }
}

// EVENTS
function enableLoadMore() {
  /**
   * Enables link at bottom right part of the page to load more cards
   * that are invisible, on user's request.
   */

  document.querySelector(".load-more__text")
    .addEventListener("click", function() {
    loadMoreWorkshopCards();
  });
}


/********************************************************************
 ********************************************************************
 * SCRIPT LOADING CODE
 */

// GLOBAL (eg. shared)
setupVisuals();
enableSidebarEvents();

// VISUAL
loadWorkshopCards();

// EVENTS
enableWorkshopCardsAddToCart();
enableLoadMore();
