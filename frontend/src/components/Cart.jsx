function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  total,
  setShowCheckout,
  setShowCart,
}) {
  return (
    <div className="cart-dropdown">
      <h3>🛒 Jūsų krepšelis</h3>

      {cart.length === 0 ? (
        <p>Krepšelis tuščias</p>
      ) : (
        cart.map((product) => (
          <div className="cart-item" key={product._id}>
            <img
              className="cart-item-image"
              src={product.image || product.thumbnail}
              alt={product.title}
            />

            <div className="cart-item-info">
              <strong>{product.title}</strong>

              <p>{(product.price * product.quantity).toFixed(2)} €</p>

              <div className="cart-quantity">
                <button onClick={() => decreaseQuantity(product._id)}>
                  −
                </button>

                <span>{product.quantity}</span>

                <button onClick={() => increaseQuantity(product._id)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <hr />

      <h3>Bendra suma: {total.toFixed(2)} €</h3>

      <div className="cart-actions">
        {cart.length > 0 && (
          <button onClick={() => setShowCheckout(true)}>
            Tęsti atsiskaitymą
          </button>
        )}

        <button onClick={() => setShowCart(false)}>Uždaryti</button>
      </div>
    </div>
  )
}

export default Cart