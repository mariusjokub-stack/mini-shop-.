
function Checkout({ onBack, onContinue }) {
  function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const paymentMethod = formData.get("paymentMethod")

    onContinue(paymentMethod)
  }

  return (
    <div className="checkout-page">
      <button
        className="checkout-back"
        onClick={onBack}
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
          onSubmit={handleSubmit}
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
              <select
                name="country"
                defaultValue="Lietuva"
                required
              >
                <option value="Lietuva">Lietuva</option>
                <option value="Latvija">Latvija</option>
                <option value="Estija">Estija</option>
                <option value="Lenkija">Lenkija</option>
              </select>
            </label>
          </section>

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

          <button
            className="checkout-submit"
            type="submit"
          >
            Tęsti apmokėjimą
          </button>

          <p className="checkout-note">
            🔒 Jūsų duomenys naudojami užsakymui pateikti.
          </p>
        </form>
      </div>
    </div>
  )
}

export default Checkout
