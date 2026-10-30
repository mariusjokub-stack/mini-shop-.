import { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites")
    return savedFavorites ? JSON.parse(savedFavorites) : []
  })

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  function toggleFavorite(productId) {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    )
  }

  const [products, setProducts] = useState([])
const [currentPage, setCurrentPage] = useState(1)
const productsPerPage = 6



  const [searchText, setSearchText] = useState("")
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  const [showAbout, setShowAbout] = useState(false)
  const [showContacts, setShowContacts] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState("")

  const [showProductsMenu, setShowProductsMenu] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

const [showPayment, setShowPayment] = useState(false)
const [selectedPayment, setSelectedPayment] = useState("")



  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
      })
  }, [])

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data)
      })
  }, [])

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id)

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const increaseQuantity = (index) => {
    setCart(
      cart.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }


const decreaseQuantity = (index) => {
  setCart(
    cart
      .map((item, i) =>
        i === index
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  )
}


  

  const total = cart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  )

  const filteredProducts = products
    .filter((product) => {
      const nameMatch = product.title
        .toLowerCase()
        .includes(searchText.toLowerCase())

      const categoryMatch =
        !selectedCategory || product.category === selectedCategory

      const priceMatch =
        (!minPrice || product.price >= Number(minPrice)) &&
        (!maxPrice || product.price <= Number(maxPrice))

      return nameMatch && categoryMatch && priceMatch
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price
      }

      if (sortBy === "price-desc") {
        return b.price - a.price
      }

   
      return 0
    })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const startIndex = (currentPage - 1) * productsPerPage

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  )

 


  return (
    <div>

      {showPayment ? (
  <div className="checkout-page">
    <button
      className="checkout-back"
      onClick={() => {
        setShowPayment(false)
        setShowCheckout(true)
      }}
    >
      ← Grįžti į užsakymą
    </button>

    <div className="checkout-heading">
      <span>🐝</span>
      <h1>Apmokėjimas</h1>
      <p>Pasirinktas mokėjimo būdas</p>
    </div>

    <div className="checkout-layout">
      <div className="checkout-card">
        <h2>💳 Jūsų mokėjimas</h2>

        <p>
          Mokėjimo būdas: <strong>{selectedPayment}</strong>
        </p>

        <p>
          Tai bandomasis apmokėjimo puslapis.
          Tikras mokėjimas dar neprijungtas.
        </p>

        <button
          className="checkout-submit"
          type="button"
          onClick={() => {
            alert("Tikras mokėjimas dar neprijungtas.")
          }}
        >
          Pereiti prie mokėjimo →
        </button>
      </div>
    </div>
  </div>
) : showCheckout ? (
    
        <div className="checkout-page">
          <button
            className="checkout-back"
            onClick={() => setShowCheckout(false)}
          >
            ← Grįžti į krepšelį
          </button>

          <div className="checkout-heading">
            <span>🐝</span>
            <h1>Atsiskaitymas</h1>
            <p>Dar vienas žingsnis iki jūsų užsakymo!</p>
          </div>

          <div className="checkout-layout">
            <form
              className="checkout-form"

            onSubmit={(e) => {
  e.preventDefault()

  const formData = new FormData(e.currentTarget)
  const paymentMethod = formData.get("paymentMethod")

  setSelectedPayment(paymentMethod)
  setShowCheckout(false)
  setShowPayment(true)
}}
            >
              <section className="checkout-card">
                <h2>👤 Pirkėjo duomenys</h2>

                <label>
                  Vardas ir pavardė
                  <input
                    type="text"
                    name="name"
                    placeholder="Įveskite vardą ir pavardę"
                    required
                  />
                </label>

                <label>
                  Telefonas
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+370..."
                    required
                  />
                </label>

                <label>
                  El. paštas
                  <input
                    type="email"
                    name="email"
                    placeholder="vardas@email.com"
                    required
                  />
                </label>
              </section>

             
<section className="checkout-card">
  <h2>📦 Pristatymo adresas</h2>

  <label>
    Gatvė
    <input
      type="text"
      name="street"
      placeholder="Įveskite gatvės pavadinimą"
      required
    />
  </label>

  <label>
    Namo numeris
    <input
      type="text"
      name="houseNumber"
      placeholder="Įveskite namo numerį"
      required
    />
  </label>

  <label>
    Butas
    <input
      type="text"
      name="apartment"
      placeholder="Įveskite buto numerį (jei yra)"
    
    />
  </label>

  <label>
    Miestas
    <input
      type="text"
      name="city"
      placeholder="Įveskite miestą"
      required
    />
  </label>

<label>
  Pašto kodas
  <input
    type="text"
    name="postalCode"
    placeholder="Įveskite pašto kodą"
    autoComplete="postal-code"
    required
  />
</label>



  <label>
    Šalis
    <select name="country" defaultValue="Lietuva" required>
      <option value="Lietuva">Lietuva</option>
      <option value="Latvija">Latvija</option>
      <option value="Estija">Estija</option>
      <option value="Lenkija">Lenkija</option>
    </select>
  </label>
</section>


                          

              {/* MOKĖJIMO BŪDO PASIRINKIMAS */}
              <section className="checkout-card">
                <h2>💳 Mokėjimo būdas</h2>
                <p>Pasirinkite, kaip norite sumokėti</p>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="swedbank"
                    required
                  />
                  <span>🏦 Swedbank</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="seb"
                  />
                  <span>🏦 SEB bankas</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="revolut"
                  />
                  <span>📱 Revolut</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                  />
                  <span>💳 Mokėjimo kortelė</span>
                </label>

                <p className="payment-note">
                  Mokėjimų sistema dar neprijungta.
                </p>
              </section>

         

              <button className="checkout-submit" type="submit">
                Tęsti apmokėjimą
              </button>

              <p className="checkout-note">
                🔒 Jūsų duomenys naudojami užsakymui pateikti.
              </p>
            </form>
          </div>
        </div>
      ) : showFavorites ? (
        <div className="cart-dropdown">
          <h3>❤️ Mėgstamiausios prekės</h3>

          {products
            .filter((product) => favorites.includes(product._id))
            .map((product) => (
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

                <button onClick={() => toggleFavorite(product._id)}>
                  ❤️ Pašalinti
                </button>
              </div>
            ))}

          <button onClick={() => setShowFavorites(false)}>Uždaryti</button>
        </div>
      ) : showCart ? (
        <div className="cart-dropdown">
          <h3>🛒 Krepšelis</h3>

          {cart.length === 0 ? (
            <p>Krepšelis tuščias</p>
          ) : (
            cart.map((product, index) => (
              <div className="cart-item" key={product._id || index}>
                <img
                  className="cart-item-image"
                  src={product.image || product.thumbnail}
                  alt={product.title}
                />

                <div className="cart-item-info">
                  <strong>{product.title}</strong>

                  <p>{(product.price * product.quantity).toFixed(2)} €</p>

                  <div className="cart-quantity">
                    <button
                      onClick={() => decreaseQuantity(index)}
                      
                    >
                      −
                    </button>

                    <span>{product.quantity}</span>

                    <button onClick={() => increaseQuantity(index)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}

          <hr />

          <h3>Bendra suma: {total.toFixed(2)} €</h3>

          {cart.length > 0 && (
            <button onClick={() => setShowCheckout(true)}>
              Tęsti atsiskaitymą
            </button>
          )}

          <p>
            <button onClick={() => setShowCart(false)}>Uždaryti</button>
          </p>
        </div>
      ) : (
        <>
          <header>
            {/* Pirmas headeris */}
            <div className="top-bar">
              <div className="contact-info">
                <a
                  href="tel:+37067446159"
                  onClick={(e) => {
                    if (window.innerWidth > 768) {
                      e.preventDefault()
                      navigator.clipboard.writeText("+37067446159")
                      alert("Telefono numeris nukopijuotas!")
                    }
                  }}
                >
                  📞 +370 67446159
                </a>
                &nbsp;&nbsp;
                <a
                  href="https://mail.google.com/mail/u/0/?fs=1&to=marius.jokub@gmail.com&su=&body=&tf=cm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ✉️ marius.jokub@gmail.com
                </a>
              </div>

              <div className="social-icons">
                <div className="social-dropdown">
                  <button className="social-button">
                    Socialiniai tinklai ▼
                  </button>

                  <div className="social-dropdown-menu">
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Facebook
                    </a>

                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Antras headeris */}
            <nav className="nav-first">
              <div className="logo">
                <h3>🐝 Bitininko parduotuvė</h3>
                <p>Kokybiški bitininkystės produktai ir reikmenys</p>
              </div>

              <div className="search">
                <input
                  type="text"
                  placeholder="🔍 Ieškoti prekių"
                  value={searchText}
                 onChange={(e) => {
  setSearchText(e.target.value)
  setCurrentPage(1)
}}
                />
              </div>

              <button
                className="heart-button"
                title="Mėgstamiausios prekės"
                onClick={() => {
                  setShowFavorites(!showFavorites)
                  setShowCart(false)
                }}
              >
                ❤️ {favorites.length}
              </button>

              <span
                title="Krepšelis"
                onClick={() => {
                  setShowCart(!showCart)
                  setShowFavorites(false)
                }}
                style={{ cursor: "pointer" }}
              >
                🛒
              </span>

              <span title="Bendra suma">{total.toFixed(2)} €</span>

              <button
                type="button"
                onClick={() => {
                  setShowRegister(false)
                  setShowLogin(true)
                }}
              >
                Prisijungti
              </button>

              {showLogin && (
                <div className="login-popup">
                  <h3>👤 Prisijungimas</h3>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()

                      const email = e.target.email.value
                      const password = e.target.password.value

                      try {
                        const response = await fetch(
                          "http://localhost:5000/auth/login",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email, password }),
                          }
                        )

                        const data = await response.json()

                        if (!response.ok) {
                          alert(data.message || "Prisijungti nepavyko")
                          return
                        }

                        localStorage.setItem("token", data.token)
                        alert("Sėkmingai prisijungei!")
                        setShowLogin(false)
                      } catch (error) {
                        alert("Nepavyksta susisiekti su serveriu.")
                      }
                    }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="El. paštas"
                      required
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Slaptažodis"
                      required
                    />

                    <button type="submit">Prisijungti</button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(false)
                        setShowRegister(true)
                      }}
                    >
                      Registruotis
                    </button>

                    <button type="button" onClick={() => setShowLogin(false)}>
                      Uždaryti
                    </button>
                  </form>
                </div>
              )}

              {showRegister && (
                <div className="login-popup">
                  <h3>📝 Registracija</h3>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()

                      const name = e.target.name.value
                      const email = e.target.email.value
                      const password = e.target.password.value

                      try {
                        const response = await fetch(
                          "http://localhost:5000/auth/register",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ name, email, password }),
                          }
                        )

                        const data = await response.json()

                        if (!response.ok) {
                          alert(data.message || "Registracija nepavyko")
                          return
                        }

                        alert("Registracija sėkminga! Dabar gali prisijungti.")

                        setShowLogin(true)
                        setShowRegister(false)
                      } catch (error) {
                        alert("Nepavyksta susisiekti su serveriu.")
                      }
                    }}
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Vardas"
                      required
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="El. paštas"
                      required
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Slaptažodis"
                      minLength={6}
                      required
                    />

                    <button type="submit">Sukurti paskyrą</button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(true)
                        setShowRegister(false)
                      }}
                    >
                      Grįžti į prisijungimą
                    </button>
                  </form>
                </div>
              )}
            </nav>

            {/* Trečias headeris */}
            <nav className="nav-second">
              <div className="products-menu">
                <button onClick={() => setShowProductsMenu(!showProductsMenu)}>
                  ☰ PREKĖS IR PRODUKTAI
                </button>

                {showProductsMenu && (
                  <div className="products-menu-list">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        onClick={() => {
                          setSelectedCategory(category.name)
                          setShowProductsMenu(false)
                        }}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="main-menu">
                <button
                  onClick={() => {
                    setShowAbout(false)
                    setShowContacts(false)
                    setSelectedProduct(null)
                    setShowCart(false)
                    setShowFavorites(false)
                    setShowCheckout(false)
                    setShowProductsMenu(false)
                    setSelectedCategory("")
                    setMinPrice("")
                    setMaxPrice("")
                    setSearchText("")
                  }}
                >
                  Pradinis
                </button>

                <button
                  onClick={() => {
                    setShowAbout(true)
                    setShowContacts(false)
                    setSelectedProduct(null)
                    setShowCart(false)
                    setShowFavorites(false)
                    setShowCheckout(false)
                  }}
                >
                  Apie mus
                </button>

                <button
                  onClick={() => {
                    setShowContacts(true)
                    setShowAbout(false)
                    setSelectedProduct(null)
                    setShowCart(false)
                    setShowFavorites(false)
                    setShowCheckout(false)
                  }}
                >
                  Kontaktai
                </button>
              </div>

              <div className="right-logo">
                🐝 Sveikos bitės – stiprus ūkis!
              </div>
            </nav>
          </header>

          {showContacts ? (
            <div className="about-page">
              <button
                onClick={() => {
                  setShowContacts(false)
                  setShowAbout(false)
                }}
              >
                ← Atgal į parduotuvę
              </button>

              <h1>Kontaktai</h1>

              <p>
                📞 Telefonas: <a href="tel:+37067446159">+370 67446159</a>{" "}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("+37067446159")
                    alert("Telefono numeris nukopijuotas!")
                  }}
                >
                  Kopijuoti
                </button>
              </p>

              <p>
                ✉️ El. paštas:{" "}
                <a
                  href="https://mail.google.com/mail/u/0/?fs=1&to=marius.jokub@gmail.com&tf=cm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  marius.jokub@gmail.com
                </a>{" "}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("marius.jokub@gmail.com")
                    alert("El. paštas nukopijuotas!")
                  }}
                >
                  Kopijuoti
                </button>
              </p>

              <p>
                📍 Parduotuvės adresas:{" "}
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sruogos+7+Kaunas+Lithuania"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sruogos g. 7, Kaunas, Lietuva
                </a>
              </p>
            </div>
          ) : showAbout ? (
            <div className="about-page">
              <button onClick={() => setShowAbout(false)}>
                ← Atgal į parduotuvę
              </button>

              <h1>Apie mus</h1>
              <p>Sveiki atvykę į Bitininko parduotuvę!</p>
              <p>
                Čia rasite bitininkystės produktus ir reikmenis
                pradedantiesiems bei patyrusiems bitininkams.
              </p>
            </div>
          ) : (
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
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="€"
                      />
                    </label>

                    <label>
                      Iki
                      <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="€"
                      />
                    </label>
                  </div>

                  <div className="price-slider">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
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
                    <div className="products-grid">
                     {currentProducts.map((product) => (



            
                        <div className="product-card" key={product._id}>
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

                          <button onClick={() => addToCart(product)}>
                            Į krepšelį
                          </button>
                        </div>
                      ))}
                    </div>

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
                        (_, i) => i + 1
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
                          setCurrentPage((page) =>
                            Math.min(totalPages, page + 1)
                          )
                        }
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                      >
                        ›
                      </button>

                    </div>
                     </>
                  )}
                </section>

              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default App
           