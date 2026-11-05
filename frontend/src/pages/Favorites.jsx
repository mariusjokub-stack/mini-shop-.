function Favorites({ products, favorites, onToggleFavorite, onClose }) {
  const favoriteProducts = products.filter((product) =>
    favorites.includes(product._id)
  )

  return (
    <div className="cart-dropdown">
      <h3>❤️ Mėgstamiausios prekės</h3>

      {favoriteProducts.length === 0 ? (
        <p>Mėgstamiausių prekių dar nėra.</p>
      ) : (
        favoriteProducts.map((product) => (
          <div className="favorite-item" key={product._id}>
            {product.image && (
              <img
                className="favorite-image"
                src={product.image}
                alt={product.title}
              />
            )}

            <div className="favorite-details">
              <p>{product.title}</p>
              <strong>{product.price} €</strong>
            </div>

            <button onClick={() => onToggleFavorite(product._id)}>
              ❤️ Pašalinti
            </button>
          </div>
        ))
      )}

      <button onClick={onClose}>Uždaryti</button>
    </div>
  )
}

export default Favorites
