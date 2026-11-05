
function ProductCard({
  product,
  favorites,
  toggleFavorite,
  addToCart,
  setSelectedProduct,
}) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            onClick={() => setSelectedProduct(product)}
            style={{ cursor: "pointer" }}
          />
        )}

        <button
          className="product-heart"
          onClick={() => toggleFavorite(product._id)}
          title="Pridėti prie mėgstamiausių"
        >
          {favorites.includes(product._id) ? "❤️" : "♡"}
        </button>
      </div>

      <h3>{product.title}</h3>
      <p>{product.price} €</p>

      <button onClick={() => addToCart(product)}>Į krepšelį</button>
    </div>
  )
}

export default ProductCard