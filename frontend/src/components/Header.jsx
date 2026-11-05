import { useNavigate } from "react-router"

function Header({
  searchText,
  setSearchText,
  setCurrentPage,
  favorites,
  setShowFavorites,
  showFavorites,
  setShowCart,
  total,
  showLogin,
  setShowLogin,
  showRegister,
  setShowRegister,
  categories,
  showProductsMenu,
  setShowProductsMenu,
  setSelectedCategory,
  setShowProducts,
  setShowAbout,
  setShowContacts,
  setSelectedProduct,
  setShowCheckout,
  setMinPrice,
  setMaxPrice,
}) {
  const navigate = useNavigate()

  return (
    <header>
      <div className="top-bar">
        <div className="contact-info">
          <a href="tel:+37067446159">📞 +370 67446159</a>
          <a href="mailto:marius.jokub@gmail.com">✉️ marius.jokub@gmail.com</a>
        </div>

        <div className="social-icons">
          <div className="social-dropdown">
            <button className="social-button" type="button">
              Socialiniai tinklai ▼
            </button>
            <div className="social-dropdown-menu">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

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
            onChange={(event) => {
  setSearchText(event.target.value)
  setCurrentPage(1)
  setSelectedProduct(null)
  navigate("/products")
}}
          />
        </div>

        <button
          className="heart-button"
          title="Mėgstamiausios prekės"
       onClick={() => navigate("/favorites")}
        >
          ❤️ {favorites.length}
        </button>

        <button
          type="button"
          title="Krepšelis"
          onClick={() => navigate("/cart")}
        >
          🛒
        </button>

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
              onSubmit={async (event) => {
                event.preventDefault()
                const email = event.target.email.value
                const password = event.target.password.value

                try {
                  const response = await fetch("http://localhost:5000/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                  })
                  const data = await response.json()

                  if (!response.ok) {
                    alert(data.message || "Prisijungti nepavyko")
                    return
                  }

                  localStorage.setItem("token", data.token)
                  alert("Sėkmingai prisijungei!")
                  setShowLogin(false)
                } catch {
                  alert("Nepavyksta susisiekti su serveriu.")
                }
              }}
            >
              <input type="email" name="email" placeholder="El. paštas" required />
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
              onSubmit={async (event) => {
                event.preventDefault()
                const name = event.target.name.value
                const email = event.target.email.value
                const password = event.target.password.value

                try {
                  const response = await fetch("http://localhost:5000/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                  })
                  const data = await response.json()

                  if (!response.ok) {
                    alert(data.message || "Registracija nepavyko")
                    return
                  }

                  alert("Registracija sėkminga! Dabar gali prisijungti.")
                  setShowLogin(true)
                  setShowRegister(false)
                } catch {
                  alert("Nepavyksta susisiekti su serveriu.")
                }
              }}
            >
              <input type="text" name="name" placeholder="Vardas" required />
              <input type="email" name="email" placeholder="El. paštas" required />
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
              <button type="button" onClick={() => setShowRegister(false)}>
                Uždaryti
              </button>
            </form>
          </div>
        )}
      </nav>

      <nav className="nav-second">
        <div className="products-menu">
          <button
            type="button"
            onClick={() => setShowProductsMenu(!showProductsMenu)}
          >
            ☰ PREKĖS IR PRODUKTAI
          </button>

          {showProductsMenu && (
            <div className="products-menu-list">
          <div
  onClick={() => {
    setSelectedCategory("")
    setShowProductsMenu(false)
    setCurrentPage(1)
    navigate("/products")
  }}
>
  Visos prekės
</div>


              {categories.map((category) => (
                <div
                  key={category._id}
             onClick={() => {
  setSelectedCategory(category.name)
  setShowProductsMenu(false)
  setCurrentPage(1)
  navigate("/products")
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
  type="button"
  onClick={() => {
    setSelectedProduct(null)
    setSelectedCategory("")
    setMinPrice("")
    setMaxPrice("")
    setSearchText("")
    setCurrentPage(1)
    setShowProductsMenu(false)
    navigate("/")
  }}
>
  Pradinis
</button>

      <button
  type="button"
  onClick={() => navigate("/about")}
>
  Apie mus
</button>    

         <button
  type="button"
  onClick={() => navigate("/contacts")}
>
  Kontaktai
</button>
        </div>

        <div className="right-logo">🐝 Sveikos bitės – stiprus ūkis!</div>
      </nav>
    </header>
  )
}

export default Header
