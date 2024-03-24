
export const addDecimals = (num) => {
  return (Math.round(num * 100)/100).toFixed(2);
};



export const updateCart = (state) => {
     // calculate items price
     state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty , 0 ));
     // calculate shipping price
     state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
     // calculate tax price
     state.taxPrice = addDecimals(Number((state.itemsPrice * 0.15).toFixed(2)));
     // calculate tota price
     state.totalPrice = (
      Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
     ).toFixed(2);

     localStorage.setItem("cart" , JSON.stringify(state))
}