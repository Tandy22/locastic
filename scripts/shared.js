/**
 * This script is used for storing and loading shared functions for
 * declaring events, initializing and updating some background data
 * and showing them to HTML DOM in a proper way.
 * Here developer can find functions in next domains:
 *  - header
 *  - sidebar
 */


/********************************************************************
 ********************************************************************
 * HTML TAG REFERENCES
 */

let body = document.querySelector("body");

// HEADER
let cartNotEmptyIcon = document.querySelector(".header__cart-image--not-empty");
let cartText= document.querySelector(".header__cart-text");

// SIDEBAR
// let sidebar = document.querySelector(".cart-section");
let sidebar = document.querySelector(".cart");
let sidebarOpen= document.querySelector(".header__cart-container");
// let sidebarClose = sidebar.querySelector(".cart-section__close-icon");
let sidebarClose = sidebar.querySelector(".cart__close");

// let cartSidebarNotEmptyIcon = sidebar.querySelector(".cart-container__cart-not-empty");
// let cartSidebarText= sidebar.querySelector(".cart-container__cart-text");
// let cartItemsContainer = sidebar.querySelector(".in-cart-items__list");
// let cartSidebarSubtotal = sidebar.querySelector(".subtotal-container__pricing .pricing__price");
// let cartSidebarSubtotalCurrency = sidebar.querySelector(".subtotal-container__pricing .pricing__currency");
let cartSidebarNotEmptyIcon = sidebar.querySelector(".cart__cart-icon--not-empty");
let cartSidebarText= sidebar.querySelector(".cart__status-text");
let cartItemsContainer = sidebar.querySelector(".cart__items");
let cartSidebarSubtotal = sidebar.querySelector(".cart__subtotal-price-amount");
let cartSidebarSubtotalCurrency = sidebar.querySelector(".cart__subtotal-price-currency");

// CHECKOUT FORM
/* // fix background scroll - START
let indexSite = document.querySelector(".main");
let inIndexSite = indexSite != null;
let workshopSite = document.querySelector(".workshop-site");
let similarWorkshops = document.querySelector(".similar-workshops");
let inWorkshopSite = workshopSite != null && similarWorkshops != null;
// fix background scroll - END */
// this section doesn't have to exist, for example in index page
let buyNowSection = document.querySelector(".buy-now-section");
// let checkout = sidebar.querySelector(".checkout-button");
let checkout = sidebar.querySelector(".cart__checkout");
let modalBackground = document.querySelector(".modal__background");
// checkout form modal
let modalCheckoutForm = document.querySelector(".modal__checkout");
// let modalCheckoutFormConfirm = modalCheckoutForm.querySelector(".form-checkout-button");
let modalCheckoutFormExit= modalCheckoutForm.querySelector(".checkout__close");
// checkout done form moodal
let modalCheckoutDoneDialog = document.querySelector(".modal__checkout-done");
let modalCheckoutDoneDialogExit = modalCheckoutDoneDialog.querySelector(".checkout-done__button");

// CHECKOUT FORM - IN DETAIL
let checkoutForm = modalCheckoutForm.querySelector(".checkout__form");
// fields:
let firstName = checkoutForm.querySelector("#first-name");
let lastName = checkoutForm.querySelector("#last-name");
let emailAddress = checkoutForm.querySelector("#email");
let dateOfBirth = checkoutForm.querySelector("#calendar");
let gender = checkoutForm.querySelector("#gender");
let address = checkoutForm.querySelector("#address");
let zipCode = checkoutForm.querySelector("#zip-code");
// error fields:
let firstNameError = firstName.previousElementSibling;
let lastNameError = lastName.previousElementSibling;
let emailAddressError = emailAddress.previousElementSibling;
// let dateOfBirthError = dateOfBirth.previousElementSibling;
// let genderError = gender.previousElementSibling;
// let addressError = address.previousElementSibling;
// let zipCodeError = zipCode.previousElementSibling;


/********************************************************************
 ********************************************************************
 * CONSTANTS AND VARIABLES
 */

const operation = {
  INCREASE: 0,
  DECREASE: 1
};
const cartStatus = {
  NOT_EMPTY: 0,
  EMPTY: 1
};

// 'cartSidebarRenderedItemsById' is tracking what cart items are
//  already rendered so program don't spend time on going through
//  all cart items every time
let cartSidebarRenderedItemsById = [];
let subtotal = 0;
let conversionRate = 0;
// let checkoutOk = false;


/********************************************************************
 ********************************************************************
 * HEADER AND SIDEBAR VIEW HANDLING AND EVENT HANDLING FUNCTIONS
 */

let headerHandler = {
  views: {
    init: {
      setupHeaderVisual: (newCartStatus, sum = 0) => {
        /**
         * On header, show or unshow blue dot on a cart icon and set
         * proper text next to cart icon.
         */
      
        headerHandler.views.update.updateHeaderVisual(newCartStatus, sum);
      },
      
    },
    update: {
      updateHeaderVisual: (newCartStatus, sum = 0) => {
        /**
         * On header, show or unshow blue dot on a cart icon and set
         * proper text next to cart icon.
         */
      
        if (newCartStatus === cartStatus.NOT_EMPTY) {
          if (cartNotEmptyIcon.classList.contains("hidden")) {
            cartNotEmptyIcon.classList.remove("hidden");
          }
          cartText.innerHTML = sum + " Workshop in Cart";
        }
        else {
          if (!cartNotEmptyIcon.classList.contains("hidden")) {
            cartNotEmptyIcon.classList.add("hidden");
          }
          cartText.innerHTML = "Cart is Empty";
        }
      }
    }
  }
}

let sidebarHandler = {
  views: {
    init: {
      setupSidebarHeaderVisual: (newCartStatus, sum = 0) => {
        /**
         * On sidebar, show or unshow blue dot on a cart icon and set
         * proper text next to cart icon.
         */
      
        sidebarHandler.views.update.updateSidebarHeaderVisual(newCartStatus, sum);
      },
      setupSidebarCartItemsVisual: (newCartStatus) => {
        /**
         * Loads initial user's cart items ('cartItems' list) to
         * sidebar's cart items list.
         */
        
        // empty the list (remove whatever was inside)
        cartItemsContainer.innerHTML = "";
        // set 'cartSidebarRenderedItemsById' to empty as nothing is
        //  rendered
        cartSidebarRenderedItemsById = [];
      
        if (newCartStatus === cartStatus.NOT_EMPTY) {
          cartItems.forEach(cartItem => {
            // if for some reason this item is in the cart, but
            //  amount is 0, ignore it, else continue...
            if (cartItem.amount > 0) {
              // get item info by its type
              let itemByType = itemTypes.find(itemType => itemType.id === cartItem.typeId);
      
              // create new cart item for sidebar's cart items container
              let cartItemObject = sidebarHandler.utils.builders.getCartItemTemplate(
                cartItem.id, itemByType, cartItem.amount);
              
              cartItemsContainer.appendChild(cartItemObject);
              // add this item's id in list of element id's that are in
              //  the sidebar
              cartSidebarRenderedItemsById.push(cartItem.id);
            }
          });
        }
      },
      setupSidebarSubtotalVisual: () => {
        /**
         * On sidebar, show current subtotal based on items in the
         * cart.
         */
      
        cartSidebarSubtotal.innerHTML = formatToCurrency(subtotal);
        cartSidebarSubtotalCurrency.innerHTML = subtotalCurrency;
      }
    },
    update: {
      updateSidebarHeaderVisual: (newCartStatus, sum = 0) => {
        /**
         * On sidebar, show or unshow blue dot on a cart icon and set
         * proper text next to cart icon.
         */
      
        if (newCartStatus === cartStatus.NOT_EMPTY) {
          if (cartSidebarNotEmptyIcon.classList.contains("hidden")) {
            cartSidebarNotEmptyIcon.classList.remove("hidden");
          }
          cartSidebarText.innerHTML = sum + " Workshops";
        }
        else {
          if (!cartSidebarNotEmptyIcon.classList.contains("hidden")) {
            cartSidebarNotEmptyIcon.classList.add("hidden");
          }
          cartSidebarText.innerHTML = "Cart is Empty";
        }
      },
      updateSidebarCartItemsVisual: () => {
        /**
         * Loads new or updated user's items ('cartItems' list) from
         * the cart to sidebar's cart items list.
         */
      
        cartItems.forEach(cartItem => {
          // if current item is already in the sidebar...
          if (cartSidebarRenderedItemsById.indexOf(cartItem.id) !== -1) {
            // current item is in the sidebar...
            sidebarHandler.views.update.updateSidebarCartItemAmount(cartItem);
          }
          else {
            // current item is not in the sidebar...
            // get item info by its type
            let itemByType = itemTypes.find(itemType => itemType.id === cartItem.typeId);
    
            // create new cart item for sidebar's cart items container
            let cartItemObject = sidebarHandler.utils.builders.getCartItemTemplate(
              cartItem.id, itemByType, cartItem.amount);
            
            cartItemsContainer.appendChild(cartItemObject);
            // enable events for new cart item
            sidebarHandler.events.enableSidebarItemInteractions(cartItemObject.firstElementChild);
            // add this item's id in list of element id's that are in
            //  the sidebar...
            cartSidebarRenderedItemsById.push(cartItem.id);
          }
        });
      },
      updateSidebarSubtotalVisual: () => {
        /**
         * On sidebar, show current subtotal based on items in the
         * cart.
         */
      
        sidebarHandler.views.init.setupSidebarSubtotalVisual();
      },
      updateSidebarCartItemAmount: (cartItem) => {
        /**
         * Updates sidebar item's visual representation of input
         * number.
         */
        
        // iterate through all rendered items in the cart
        for (let i = 0; i < cartItemsContainer.childNodes.length; i++) {
          if (parseInt(
            // get article element inside of cart item's <li> tag
            cartItemsContainer.childNodes[i].firstElementChild
            .getAttribute("data-id")) === cartItem.id) {
            cartItemsContainer.childNodes[i]
            .querySelector(".cart__item-amount-number-field").value = cartItem.amount;
          }
        }
      }
    }
  },
  events: {
    enableToggleSidebar: () => {
      /**
       * Enables open/close sidebar.
       * Sidebar is opened when user clicks on area around cart icon
       * or text next to icon, and closes on X when sidebar is opened.
       */
    
      sidebarOpen.addEventListener("click", function() {
        if (sidebar.classList.contains("hidden")) {
          // show sidebar immediately as data is injected upon each new
          //  'Add to cart' button press
          sidebar.classList.remove("hidden");
        }
      });
      sidebarClose.addEventListener("click", function() {
        if (!sidebar.classList.contains("hidden")) {
          sidebar.classList.add("hidden");
        }
      });
    },
    enableSidebarItemInteractions: (sidebarCartItem) => {
      /**
       * Activates events for given sidebar item:
       *  - delete item
       *  - arrow down
       *  - custom amount
       */
    
      let deleteItem = sidebarCartItem.querySelector(".cart__item-remove");
      let decreaseAmount = sidebarCartItem.querySelector(".cart__item-amount-decrease");
      let inputField = sidebarCartItem.querySelector(".cart__item-amount-number-field");
    
      deleteItem.addEventListener("click", function() {
        // delete from 'cartItems' list (don't use 'updateCart()'
        //  function as its logic works in a way that it lowers
        //  number first, which user can see before item is actualy
        //  deleted..)
        for (let i = 0; i < cartItems.length; i++) {
          if (cartItems[i].id === parseInt(
            sidebarCartItem.getAttribute("data-id"))) {
            cartItems.splice(i, 1);
          }
        }

        // delete sidebar item explicitly
        // article.list-item.list-container remove list-item
        sidebarCartItem.parentNode.parentNode.removeChild(sidebarCartItem.parentNode);
        // remove this item's id in list of element id's that are in
        //  the sidebar
        let cartItemRenderingIndex = cartSidebarRenderedItemsById.indexOf(
          parseInt(sidebarCartItem.getAttribute("data-id")));
        cartSidebarRenderedItemsById.splice(cartItemRenderingIndex, 1);

        // update visuals
        updateVisuals(sidebarFirst = true);
      });
    
      decreaseAmount.addEventListener("click", function() {
        if (inputField.value > 0) {
          updateCart(
            parseInt(sidebarCartItem.getAttribute("data-id")),
            parseInt(sidebarCartItem.getAttribute("data-typeId")),
            1,
            operation.DECREASE
          );
          updateVisuals(sidebarFirst = true);
        }
      });
    
      inputField.addEventListener("keyup", function() {
        // if client tries to delete all numbers, or tries to put
        //  'minus' character or puts '000..'...
        if (inputField.value === '' || inputField.value.slice(-1) === '-' || parseInt(inputField.value) === 0)
          inputField.value = itemsCountMin;
        // if client tries to put more than max number of items in
        //  one shipment, for example...
        else if (inputField.value > itemsCountMax)
          // inputField.value = itemsCountMax;
          inputField.value = inputField.value.slice(-1);
        // if client tries to enter all zeros or first one is zero
        //  and starts typing numbers > 0, then put on last number...
        else if (parseInt(inputField.value.slice(-2, -1)) === 0 && inputField.value.slice(-1) !== 0)
          inputField.value = inputField.value.slice(-1);
        
        // update cart for difference in numbers
        let difference = cartItems.find(
          item => item.id === parseInt(sidebarCartItem.getAttribute("data-id"))
          ).amount - parseInt(inputField.value);
    
        if (difference < 0) {
          // new value is bigger...
          updateCart(
            parseInt(sidebarCartItem.getAttribute("data-id")),
            parseInt(parseInt(sidebarCartItem.getAttribute("data-typeId"))),
            Math.abs(difference),
            operation.INCREASE
            );
        }
        else {
          // new value is lesser...
          updateCart(
            parseInt(sidebarCartItem.getAttribute("data-id")),
            parseInt(parseInt(sidebarCartItem.getAttribute("data-typeId"))),
            Math.abs(difference),
            operation.DECREASE
            );
        }
        updateVisuals();
      });
    },
    enableSidebarItemsInteractions: () => {
      /**
       * Activates events for multiple sidebar items (all items that
       * are in the cart, eg. sidebar). Sidebar should be populated
       * with newest items from the cart for this to work.
       */
    
      cartItemsContainer.childNodes.forEach(sidebarCartItem => {
        sidebarHandler.events.enableSidebarItemInteractions(sidebarCartItem.firstElementChild);
      });
    },
    enableSidebarCheckout: () => {
      /**
       * Handles how checkout procedure will happen in matter of
       * visual effects.
       */
    
      checkout.addEventListener("click", function() {
        // body.classList.add("no-scroll");
        /* if (inWorkshopSite) {
          workshopSite.classList.add("hidden");
          similarWorkshops.classList.add("hidden");
        }
        else if (inIndexSite) {
          indexSite.classList.add("hidden");
        } */
        if (buyNowSection != null) {
          buyNowSection.classList.add("hidden");
        }

        sidebar.classList.add("hidden");
        modalBackground.classList.add("modal--visible");
        modalCheckoutForm.classList.add("modal--visible");
      });
      // exit onClick for gray area around modal
      modalBackground.addEventListener("click", function() {
        // body.classList.remove("no-scroll");
        /* if (inWorkshopSite) {
          workshopSite.classList.remove("hidden");
          similarWorkshops.classList.remove("hidden");
        }
        else if (inIndexSite) {
          indexSite.classList.remove("hidden");
        } */
        if (buyNowSection != null) {
          buyNowSection.classList.remove("hidden");
        }

        modalBackground.classList.remove("modal--visible");
        // to this line modalCheckoutForm is also loosing *-active
        //  class for some reason (examine why)
        modalCheckoutForm.classList.remove("modal--visible");
        modalCheckoutDoneDialog.classList.remove("modal--visible");

        // clear all errors and field contents on exit
        clearCheckoutFormFields();
      });
      modalCheckoutFormExit.addEventListener("click", function() {
        // body.classList.remove("no-scroll");
        /* if (inWorkshopSite) {
          workshopSite.classList.remove("hidden");
          similarWorkshops.classList.remove("hidden");
        }
        else if (inIndexSite) {
          indexSite.classList.remove("hidden");
        } */
        if (buyNowSection != null) {
          buyNowSection.classList.remove("hidden");
        }

        modalCheckoutForm.classList.remove("modal--visible");
        modalBackground.classList.remove("modal--visible");

        // clear all errors and field contents on exit
        clearCheckoutFormFields();
      });
      // 'modalCheckoutFormConfirm' onClick listener won't work
      //  properly as 'checkoutOk' is being put to 'true' after this
      //  function is called (onSubmit is called after this function)
      // modalCheckoutFormConfirm.addEventListener("click", function() {
      //   if (checkoutOk) {
      //     modalCheckoutForm.classList.remove("modal-background-active");
      //     modalCheckoutDoneDialog.classList.add("modal-background-active");
      //   }
      // });
      modalCheckoutDoneDialogExit.addEventListener("click", function() {
        // body.classList.remove("no-scroll");
        /* if (inWorkshopSite) {
          workshopSite.classList.remove("hidden");
          similarWorkshops.classList.remove("hidden");
        }
        else if (inIndexSite) {
          indexSite.classList.remove("hidden");
        } */
        if (buyNowSection != null) {
          buyNowSection.classList.remove("hidden");
        }

        modalCheckoutDoneDialog.classList.remove("modal--visible");
        modalBackground.classList.remove("modal--visible");
      });
    }
  },
  utils: {
    builders: {
      getCartItemTemplate: (id, itemType, amount) => {
        /**
         * Builds sidebar's cart item template.
         */
      
        let cartItem = document.createElement("li");        
        cartItem.classList.add("cart__item");
        cartItem.innerHTML = `
          <article class="cart__item-info" data-id="${id}" data-typeId="${itemType.id}">
      
            <div class="cart__item-image-container">
              <img class="cart__item-image" src="${itemType.cartImageLocation}"
                  alt="workshop image">
            </div>
      
            <div class="cart__item-details">
      
              <div class="cart__item-header">
                  <a href="Workshop.html?id=${id}&typeId=${itemType.id}">
                    <h4 class="cart__item-name">Interaction ${itemType.name[0].toUpperCase() + itemType.name.slice(1)} Workshop</h4>
                  </a>
                  <div class="cart__item-remove">
                    <img class="cart__item-remove-icon" src="assets/Trash-icon.svg" alt="delete icon">
                  </div>
              </div>
      
              <div class="cart__item-status">
                  <form>
                    <div class="cart__item-amount">
                        <div class="cart__item-amount-number">
                          <input class="cart__item-amount-number-field" type="number" step="1" min="${itemsCountMin}" max="${itemsCountMax}" value="${amount}">
                        </div>
                        <span class="cart__item-amount-decrease">
                          <img class="cart__item-amount-decrease-icon" src="assets/Arrow-down-black-icon.svg" alt="down arrow icon">
                        </span>
                    </div>
                  </form>
      
                  <div class="cart__item-price">
                    <h3 class="cart__item-price-amount h3-mobile">${formatToCurrency(itemType.price)}</h3>
                    <h6 class="cart__item-price-currency h6-mobile">${itemPriceCurrency}</h6>
                  </div>
              </div>
            </div>
      
          </article>
          `;

        return cartItem;
      }
    }
  }
}


/********************************************************************
 ********************************************************************
 * FUNCTIONS
 */


/*******************
 * VISUAL FORMATTERS
 */

function formatToCurrency(num) {
  /**
   * Properly format item prices and subtotal (put dot for each
   * thousand and put comma instead of a dot).
   */
  
  let numberParts = num.toString().split(".");
  let wholeNumber = "";
  let isNegative = false;

  // format decimal part
  if (numberParts.length === 1) {
    // it's integer number, so add zeroes at the end...
    numberParts.push("00");
  }
  // script goes in next 2 else if's if number has decimal part
  //  (numberParts.length === 2)
  else if (numberParts[1].length > 2) {
    // if decimal part is for example .12345, then slice it to .12...
    numberParts[1] = numberParts[1].slice(0, 2);
  }
  else if (numberParts[1].length === 1) {
    // if decimal part is for example .1 then extend it to .10...
    numberParts[1] += "0";
  }

  // format integer part
  if (numberParts[0][0] === '-') {
    // as when value is going to minus is causing bugs, ignore minus
    //  until loop below is executed
    isNegative = true;
    numberParts[0] = numberParts[0].slice(1);
  }
  for (let i = 0; i < numberParts[0].length; i++ ) {
    if ((numberParts[0].length - i) % 3 == 0 && i != 0) {
      wholeNumber += ".";
    }
    wholeNumber += numberParts[0][i];
  }
  if (isNegative) {
    wholeNumber = '-' + wholeNumber;
  }

  // connect integer and decimal part and return it
  return wholeNumber + "," + numberParts[1];
}

function clearCheckoutFormFields() {
  /**
   * Sets all checkout form's fields to empty or default values and
   * clears all error messages.
   */

  // fields:
  firstName.value = "";
  lastName.value = "";
  emailAddress.value = "";
  dateOfBirth.value = "";
  gender.value = "other";
  address.value = "";
  zipCode.value = "";
  // error fields:
  firstNameError.textContent = "";
  lastNameError.textContent = "";
  emailAddressError.textContent = "";
  // dateOfBirthError.textContent = "";
  // genderError.textContent = "";
  // addressError.textContent = "";
  // zipCodeError.textContent = "";
}


/*******************
 * DATA HANDLERS
 */

// CART
function countCartItems() {
  /**
   * Counts how many cart items is in the cart (sums amounts of all
   * items in the cart).
   */

  let sum = 0;

  cartItems.forEach(cartItem => sum += cartItem.amount);

  return sum;
}

function updateCart(itemId, itemType, itemAmount, op = null) {
  /**
   * Updates the cart.
   */

  let cartItem = cartItems.find(cartItm => {
    return cartItm.id === itemId ? cartItm : null
    });

  // if this item is already in the cart...
  if (cartItem) {
    if (op === operation.INCREASE) {
      cartItem.amount += itemAmount;
    }
    else if (op === operation.DECREASE) {
      cartItem.amount -= itemAmount;
    }
  }
  // if item is not in the cart...
  else {
    cartItems.push({
      id: itemId,
      typeId: itemType,
      amount: itemAmount
    });
  }
}

// SUBTOTAL
function setupSubtotal() {
  /**
   * Sets value for all stuff that user picked, in desired currency.
   */

  subtotal = 0;

  cartItems.forEach(cartItem => {
    subtotal += itemTypes.find(itemType =>
      itemType.id === cartItem.typeId
      ).price * cartItem.amount * conversionRate;
  });
}

function updateSubtotal(itemCount, itemPrice, op) {
  /**
   * Updates subtotal.
   */

  if (op === operation.INCREASE) {
    subtotal += itemCount * itemPrice * conversionRate;
  }
  else {
    subtotal -= itemCount * itemPrice * conversionRate;
  }
}


/********************************************************************
 ********************************************************************
 * CART CHECKOUT VALIDATION
 */

function showFirstNameError(control, errorMessageControl) {
  /**
   * Validates specific cases for the first name field.
   */

  errorMessageControl.textContent = "";

  if (control.validity.valueMissing) {
    errorMessageControl.textContent = "First name is required.";
  }
  else if (!isWithoutInvalidCharacters(control.value)) {
    errorMessageControl.textContent = "First name field contains invalid characters.";
  }

  errorMessageControl.classList.add("alert-text--visible");
  errorMessageControl.nextElementSibling.classList.add("alert-border");
}

function showLastNameError(control, errorMessageControl) {
  /**
   * Validates specific cases for the last name field.
   */

  errorMessageControl.textContent = "";

  if (control.validity.valueMissing) {
    errorMessageControl.textContent = "Last name is required.";
  }
  else if (!isWithoutInvalidCharacters(control.value)) {
    errorMessageControl.textContent = "Last name field contains invalid characters.";
  }

  errorMessageControl.classList.add("alert-text--visible");
  errorMessageControl.nextElementSibling.classList.add("alert-border");
}

function showEmailAddressError(control, errorMessageControl) {
  /**
   * Validates specific cases for the email address field.
   */

  errorMessageControl.textContent = "";

  if (control.validity.valueMissing) {
    errorMessageControl.textContent = "Email is required.";
  }
  else if (control.validity.typeMismatch) {
    errorMessageControl.textContent = "Email is not in valid format.";
  }

  errorMessageControl.classList.add("alert-text--visible");
  errorMessageControl.nextElementSibling.classList.add("alert-border");
}

function clearErrorMessage(errorMessageControl) {
  /**
   * Sets given input's error message field and hids it from the user.
   */

  errorMessageControl.classList.remove("alert-text--visible");
  // errorMessageControl.textContent = "";
  errorMessageControl.nextElementSibling.classList.remove("alert-border");
}

function isWithoutInvalidCharacters(inputValue) {
  /**
   * Validates given value and checks if it has any other than
   * alphanumeric characters and returns proper response.
   */

  let expression = new RegExp("^[A-Za-z ]*$");

  if (expression.test(inputValue)) {
    return true;
  }

  return false;
}

function enableCheckoutValidation() {
  /**
   * Enables checkout form validation in terms of checking if all
   * required fields are not empty, user didn't put any invalid
   * characters inside and so on. Together with validating inputs at
   * form submit, for each field's input update it calls proper
   * functions to display an error if must.
   */

  // functions that listen for each user's input change:
  firstName.addEventListener("input", function() {
    if (!firstName.validity.valid || !isWithoutInvalidCharacters(firstName.value)) {
      showFirstNameError(firstName, firstNameError);
    }
    else {
      clearErrorMessage(firstNameError);
    }
  });

  lastName.addEventListener("input", function() {
    if (!lastName.validity.valid || !isWithoutInvalidCharacters(lastName.value)) {
      showLastNameError(lastName, lastNameError);
    }
    else {
      clearErrorMessage(lastNameError);
    }
  });

  emailAddress.addEventListener("input", function() {
    if (!emailAddress.validity.valid) {
      showEmailAddressError(emailAddress, emailAddressError);
    }
    else {
      clearErrorMessage(emailAddressError);
    }
  });

  checkoutForm.addEventListener("submit", function(event) {
    let formOk = true;

    // call isWithoutInvalidCharacters(some_value) for each field
    //  that doesn't tolerate anything except A-Z or a-z as default
    //  JS validation API won't put ...validity.valid to false if
    //  encounters something different
    if (!firstName.validity.valid || !isWithoutInvalidCharacters(firstName.value)) {
      formOk = false;
      showFirstNameError(firstName, firstNameError);
    }
    if (!lastName.validity.valid || !isWithoutInvalidCharacters(lastName.value)) {
      formOk = false;
      showLastNameError(lastName, lastNameError);
    }
    if (!emailAddress.validity.valid) {
      formOk = false;
      showEmailAddressError(emailAddress, emailAddressError);
    }

    if (!formOk) {
      event.preventDefault();
    }
    else {
      // checkoutOk = true;
      // here also prevent default so 'OK' dialog can be shown (don't
      //  refresh the page)
      event.preventDefault();
      // do closing (don't register onClick event for checkout
      //  button because it checks if 'checkoutOk' is set to true,
      //  but program enters there first, then here where
      //  'checkoutOk' is being set to true)
      modalCheckoutForm.classList.remove("modal--visible");
      modalCheckoutDoneDialog.classList.add("modal--visible");
      // clear all errors and field contents on exit (no errors, but
      //  it uses same function so...)
      clearCheckoutFormFields();
    }
  });
}


/*****************************
 * OTHER FUNCTIONS
 */

// VISUAL
function updateVisuals(sidebarFirst = false) {
  /**
   * Update page's header, sidebar's header and sidebar's content
   * visuals.
   */

  let cartItemsSum = countCartItems();
  let status = cartStatus.NOT_EMPTY;

  if (cartItemsSum <= 0) {
    status = cartStatus.EMPTY;
  }
  
  if (sidebarFirst) {
    // sidebar:
    sidebarHandler.views.update.updateSidebarHeaderVisual(status, cartItemsSum);
    sidebarHandler.views.update.updateSidebarCartItemsVisual();
    // header:
    headerHandler.views.update.updateHeaderVisual(status, cartItemsSum);
  }
  else {
    // header:
    headerHandler.views.update.updateHeaderVisual(status, cartItemsSum);
    // sidebar:
    sidebarHandler.views.update.updateSidebarHeaderVisual(status, cartItemsSum);
    sidebarHandler.views.update.updateSidebarCartItemsVisual();
  }

  // calculate subtotal...
  setupSubtotal();
  // subtotal in sidebar
  sidebarHandler.views.update.updateSidebarSubtotalVisual();
}

function setupVisuals() {
  /**
   * Sets page's header, sidebar's header and sidebar's content
   * visuals.
   */

  let cartItemsSum = countCartItems();

  if (cartItemsSum > 0) {
    // header:
    headerHandler.views.init.setupHeaderVisual(cartStatus.NOT_EMPTY, cartItemsSum);
    // sidebar:
    sidebarHandler.views.init.setupSidebarHeaderVisual(cartStatus.NOT_EMPTY, cartItemsSum);
    sidebarHandler.views.init.setupSidebarCartItemsVisual(cartStatus.NOT_EMPTY);
  }
  else {
    // header:
    headerHandler.views.init.setupHeaderVisual(cartStatus.EMPTY);
    // sidebar:
    sidebarHandler.views.init.setupSidebarHeaderVisual(cartStatus.EMPTY);
    sidebarHandler.views.init.setupSidebarCartItemsVisual(cartStatus.EMPTY);
  }

  // calculate subtotal...
  setupSubtotal();
  // subtotal in sidebar
  sidebarHandler.views.init.setupSidebarSubtotalVisual();
}

// EVENTS
function enableSidebarEvents() {
  /**
   * Enables sidebar toggle, cart items interactions and checkout
   * option.
   */

  sidebarHandler.events.enableToggleSidebar();
  sidebarHandler.events.enableSidebarItemsInteractions();
  sidebarHandler.events.enableSidebarCheckout();
}

// OTHER
function setupConversionRate() {
  /**
   * Sets conversion rate depending on what input and output
   * currencies user selected in init.js file.
   */

  // set conversion rate, starting point for subtotal and items in a
  //  cart
  let _ignore = false;

  // select conversion rate (default is 1 if not found)
  Object.keys(conversionRates).forEach(convertFromTo => {
    let currencies = convertFromTo.split("_");

    if (currencies[0] === itemPriceCurrency && currencies[1] === subtotalCurrency) {
      conversionRate = conversionRates[convertFromTo];
      _ignore = true;
    }
    else if (!_ignore) {
      conversionRate = 1;
    }
  });
}


/********************************************************************
 ********************************************************************
 * SCRIPT LOADING CODE
 */

setupConversionRate();

enableCheckoutValidation();
