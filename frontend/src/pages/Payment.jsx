
function Payment({ selectedPayment, onBack }) {
  return (
    <div className="checkout-page">
      <button
        className="checkout-back"
        onClick={onBack}
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
  )
}

export default Payment
