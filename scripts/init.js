/********************************************************************
 ********************************************************************
 * CONSTANTS AND VARIABLES
 * (this part of init.js script can be modified by following obvious form)
 */

// 'itemsTypes' list define item types in a project
let itemTypes = [
  {
    id: 1,
    name: "design",
    price: 495.00,
    imageLocation: "assets/Workshop-image.jpg",
    headerImageLocation: "assets/Workshop-header.jpg",
    cartImageLocation: "assets/Cart-workshop-item-picture.jpg",
    iconLocation: "assets/Design-icon-white.svg",
    invertIconColor: false,
    onPageCount: 13
  },
  {
    id: 2,
    name: "frontend",
    price: 350.00,
    imageLocation: "assets/Workshop-image.jpg",
    headerImageLocation: "assets/Workshop-header.jpg",
    cartImageLocation: "assets/Cart-workshop-item-picture.jpg",
    iconLocation: "assets/Frontend-icon.svg",
    invertIconColor: true,
    onPageCount: 19
  },
  {
    id: 3,
    name: "backend",
    price: 410.00,
    imageLocation: "assets/Workshop-image.jpg",
    headerImageLocation: "assets/Workshop-header.jpg",
    cartImageLocation: "assets/Cart-workshop-item-picture.jpg",
    iconLocation: "assets/Backend-icon.svg",
    invertIconColor: true,
    onPageCount: 7
  },
  {
    id: 4,
    name: "marketing",
    price: 530.00,
    imageLocation: "assets/Workshop-image.jpg",
    headerImageLocation: "assets/Workshop-header.jpg",
    cartImageLocation: "assets/Cart-workshop-item-picture.jpg",
    iconLocation: "assets/Marketing-icon.svg",
    invertIconColor: true,
    onPageCount: 15
  },
];
const initialItemsLoad = 9;
const itemsPerLoad = 9;
// 'cartItems' list define items that are in the cart and how much
//  subtotal we have when we first load a page
//  id is each workshop item's unique id (data-id) and typeId is that
//  same item's type (data-typeId), where this typeId is in relation
//  with id from 'itemTypes' list
let cartItems = [
  {
    id: 1,
    typeId: 1,
    amount: 2
  },
  {
    id: 2,
    typeId: 1,
    amount: 1
  }
];

let supportedCurrencies = {
  EUR: "EUR",
  HRK: "HRK"
};
// conversionRate = 7.54 for 1 EUR = 7.54 HRK at 2020-12-06
// it defines next: from item price to price client will have to pay
//  with its desired currency
let conversionRates = {
  "EUR_HRK": 7.54,
  "HRK_EUR": 1 / 7.54
}
const itemPriceCurrency = supportedCurrencies.EUR;
const subtotalCurrency = supportedCurrencies.HRK;

const itemsCountMin = 0;
const itemsCountMax = 10;
