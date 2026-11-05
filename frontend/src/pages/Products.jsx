import ProductCard from "../components/ProductCard"

function Products({
  selectedProduct,
  setSelectedProduct,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  currentProducts,
  totalPages,
  currentPage,
  setCurrentPage,
  favorites,
  toggleFavorite,
  addToCart,
}) {
  return (
    <>
      <h2>Prekės</h2>

      <div className="shop-layout">
        <aside className="filter-sidebar">
          <h4>Kaina:</h4>

          <div className="price-inputs">
            <label>
              Nuo
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="€"
              />
            </label>

            <label>
              Iki
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="€"
              />
            </label>
          </div>

          <div className="price-slider">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="">Rūšiuoti pagal</option>
              <option value="price-asc">Pigiausia viršuje</option>
              <option value="price-desc">Brangiausia viršuje</option>
            </select>
          </div>
        </aside>

        <section className="products-section">
          {selectedProduct ? (
            <div className="selected-product">
              <button onClick={() => setSelectedProduct(null)}>
                ← Atgal į prekes
              </button>

              <h1>{selectedProduct.title}</h1>

              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                style={{
                  display: "block",
                  maxWidth: "600px",
                  maxHeight: "500px",
                  objectFit: "contain",
                  margin: "20px auto",
                }}
              />

              <h2>{selectedProduct.price} €</h2>
              <h3>Prekės aprašymas</h3>
              <p>Čia įrašyk prekės aprašymą.</p>

              <button onClick={() => addToCart(selectedProduct)}>
                Į krepšelį
              </button>
            </div>
          ) : (
            <>
              {currentProducts.length === 0 ? (
                <p>Prekių pagal pasirinktus kriterijus nerasta.</p>
              ) : (
                <div className="products-grid">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      addToCart={addToCart}
                      setSelectedProduct={setSelectedProduct}
                    />
                  ))}
                </div>
              )}

              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  ›
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}

export default Products