/********************************************************************
 ********************************************************************
 * HTML TAG REFERENCES
 */

let mainWorkshop = document.querySelector(".workshop-site");

// BLOCK: BUY YOUR TICKET
//  -> interaction controls
let decreaseAmount = mainWorkshop.querySelector(".buy-now__item-amount-decrease-icon");
let inputField = mainWorkshop.querySelector(".buy-now__item-amount-number-field");
let addToCart = mainWorkshop.querySelector(".buy-now__button");
//  -> view control
let subtotalPreview = mainWorkshop.querySelector(".buy-now__subtotal-amount");

// WORKSHOP CARDS AT BOTTOM
//  -> 3 cards at "normal" resolutions
let workshopCards = document.querySelectorAll(".workshop-card");
//  -> same 3 cards at mobile resolutions
// let workshopCardsMobile = document.querySelectorAll(".main-section__workshop-card-mobile");


/********************************************************************
 ********************************************************************
 * CONSTANTS AND VARIABLES
 */

let itemType = null;


/********************************************************************
 ********************************************************************
 * FUNCTIONS
 */


/********************************
 * WALL CONTENT -  INITIALIZATION
 */

// VISUAL
function setupSubtotalPreview() {
  /**
   * Sets subtotal preview when user is changing input value for
   * item's page. That subtotal (preview subtotal) is showing how
   * much would something cost if user clicks 'Add to Cart' button.
   */

  subtotalPreview.innerHTML = formatToCurrency(
    subtotal + inputField.value * itemType.price * conversionRate);
}

function updateSubtotalPreview() {
  /**
   * Updates subtotal preview. This function should be called each
   * time explicitly to show to user new preview value.
   */

  setupSubtotalPreview();
}

function setupMainWorkshop() {
  /**
   * Sets up item's info according to which item is selected before
   * entering current item's info from Index.html page.
   */

  let queryString = window.location.search;
  let params = new URLSearchParams(queryString);
  let itemId = params.get("id");
  let itemTypeId = params.get("typeId");

  itemType = itemTypes.find(type => type.id === parseInt(itemTypeId));

  if (itemType === undefined || itemType === null) {
    itemId = 1;
    itemTypeId = 1;
    itemType = itemTypes[0];
  }

  // item's meta data
  mainWorkshop.setAttribute("data-id", itemId);
  mainWorkshop.setAttribute("data-typeId", itemTypeId);
  // item's image
  mainWorkshop.querySelector(".workshop-site__header-image").src = itemType.imageLocation;
  // item's icon
  mainWorkshop.querySelector(".workshop-in-detail__icon").src = itemType.iconLocation;
  if (itemType.invertIconColor) {
    mainWorkshop.querySelector(".workshop-in-detail__icon").style = "filter: invert(100%);";
  }
  // item's title
  mainWorkshop.querySelector(".workshop-in-detail__title")
    .innerHTML = `Interaction ${
      itemType.name[0].toUpperCase() + itemType.name.slice(1)} Workshop`;
  // display item's price and price currency
  mainWorkshop.querySelector(".buy-now__price__ammount")
    .innerHTML = formatToCurrency(itemType.price);
  mainWorkshop.querySelector(".buy-now__price__currency")
    .innerHTML = itemPriceCurrency;
  // input field
  // set number at input at max allowed
  inputField.value = itemsCountMax;
  // subtotal and subtotal currency
  setupSubtotalPreview();
  mainWorkshop.querySelector(".buy-now__subtotal-currency")
    .innerHTML = subtotalCurrency;
}

function setupWorkshopCards() {
  /**
   * Sets up item infos according to which item is selected before
   * entering current item's info from Index.html page. This function
   * assigns to 3 cards at bottom of the page right meta data and
   * info with the same tipe as main item has.
   */

  let mainWorkshopId = parseInt(mainWorkshop.getAttribute("data-id"));
  let idDifference = 1;
  let workshopTitle = `Interaction ${
    itemType.name[0].toUpperCase() + itemType.name.slice(1)} Workshop`;

  workshopCards.forEach(workshop => {
    // item's meta data
    workshop.setAttribute("data-id", mainWorkshopId + idDifference);
    workshop.setAttribute("data-typeId", itemType.id);
    // item's image
    workshop.querySelector(".workshop-card__image").src = itemType.headerImageLocation;
    workshop.querySelector(".workshop-card__image--mobile").src = itemType.cartImageLocation;
    // item's icon
    workshop.querySelector(".workshop-card__icon").src = itemType.iconLocation;

    // put helper CSS class to icon (not all icons are in white by default)
    if (itemType.invertIconColor)
      workshop.querySelector(".workshop-card__icon").style = "filter: invert(100%);";

    // item's title (wrap it in a link)
    let titleContainer = workshop.querySelector(".workshop-card__title");
    titleContainer.innerHTML = workshopTitle;
    let titleLinkWrapper = document.createElement("a");
    titleLinkWrapper.href = `Workshop.html?id=${mainWorkshopId + idDifference}&typeId=${itemType.id}`;
    titleLinkWrapper.innerHTML = titleContainer.outerHTML;
    
    let insertBefore = titleContainer.nextElementSibling;
    // children[1] because it wants to search for parent of title
    //  object, and flex based class is its parent...
    workshop.children[1].removeChild(titleContainer);
    workshop.children[1].insertBefore(titleLinkWrapper, insertBefore);

    // display item's price and price currency
    workshop.querySelector(".workshop-card__price__ammount").innerHTML = formatToCurrency(itemType.price);
    workshop.querySelector(".workshop-card__price__currency").innerHTML = itemPriceCurrency;

    idDifference += 1;
  });

  idDifference = 1;
  
  /* workshopCardsMobile.forEach(workshop => {
    // item's meta data
    workshop.setAttribute("data-id", mainWorkshopId + idDifference);
    workshop.setAttribute("data-typeId", itemType.id);
    // item's image
    workshop.querySelector(".image-container__image").src = itemType.headerImageLocation;
    // item's icon
    workshop.querySelector(".workshop-card__icon-mobile").src = itemType.iconLocation;

    // item's title (wrap it in a link)
    let titleContainer = workshop.querySelector(".heading-container__title");
    titleContainer.innerHTML = workshopTitle;
    let titleLinkWrapper = document.createElement("a");
    titleLinkWrapper.href = `Workshop.html?id=${mainWorkshopId + idDifference}&typeId=${itemType.id}`;
    titleLinkWrapper.innerHTML = titleContainer.outerHTML;
    
    let parentElement = titleContainer.parentElement;
    parentElement.removeChild(titleContainer);
    parentElement.appendChild(titleLinkWrapper);
    
    // display item's price and price currency
    workshop.querySelector(".price-container__ammount").innerHTML = formatToCurrency(itemType.price);
    workshop.querySelector(".price-container__currency").innerHTML = itemPriceCurrency;

    idDifference += 1;
  }); */
}

// EVENTS
function enableMainWorkshopEvents() {
  /**
   * Enables interaction with the item, eg. assigns listeners to that
   * item's controls from 'Buy your ticket' section.
   */

  decreaseAmount.addEventListener("click", function() {
    if (inputField.value > 0) {
      inputField.value -= 1;
      // update subtotal at buy now block and update other parts of
      //  the website
      updateSubtotalPreview();
    }
  });

  inputField.addEventListener("keyup", function() {
    // if client tries to delete all numbers, or tries to put 'minus' character or puts
    //  '000..'...
    if (inputField.value === '' || inputField.value.slice(-1) === '-' || parseInt(inputField.value) === 0)
      inputField.value = itemsCountMin;
    // if client tries to put more than max number of items in one shipment, for example...
    else if (inputField.value > itemsCountMax)
      // inputField.value = itemsCountMax;
      inputField.value = inputField.value.slice(-1);
    // if client tries to enter all zeros or first one is zero and starts typing
    //  numbers > 0, then put on last number
    else if (parseInt(inputField.value.slice(-2, -1)) === 0 && inputField.value.slice(-1) !== 0)
      inputField.value = inputField.value.slice(-1);
    
    updateSubtotalPreview();
  });

  addToCart.addEventListener("click", function() {
    updateCart(
      parseInt(mainWorkshop.getAttribute("data-id")),
      parseInt(mainWorkshop.getAttribute("data-typeId")),
      parseInt(inputField.value),
      operation.INCREASE
    );
    updateVisuals(sidebarFirst = false);
    updateSubtotalPreview();
  });
}

function enableWorkshopCardsAddToCart() {
  /**
   * Enables interaction with items at bottom of the page, eg.
   * assigns listener to each item's 'Add to Cart' button.
   */

  workshopCards.forEach(workshop => {
    workshop.querySelector(".workshop-card__buy-button")
      .addEventListener("click", function() {
      updateCart(
        parseInt(workshop.getAttribute("data-id")),
        parseInt(workshop.getAttribute("data-typeId")),
        1,
        operation.INCREASE
      );
      updateVisuals(sidebarFirst = false);
      updateSubtotalPreview();
    });
  });

  /* workshopCardsMobile.forEach(workshop => {
    workshop.querySelector(".card-mobile__add-cart-container img")
      .addEventListener("click", function() {
      updateCart(
        parseInt(workshop.getAttribute("data-id")),
        parseInt(workshop.getAttribute("data-typeId")),
        1,
        operation.INCREASE
      );
      updateVisuals(sidebarFirst = false);
      updateSubtotalPreview();
    });
  }); */
}


/********************************************************************
 ********************************************************************
 * SCRIPT LOADING CODE
 */

// GLOBAL (eg. shared)
setupVisuals();
enableSidebarEvents();

// VISUAL
setupMainWorkshop();
setupWorkshopCards();

// EVENTS
enableMainWorkshopEvents();
enableWorkshopCardsAddToCart();
