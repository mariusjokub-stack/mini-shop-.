function Contacts({ onBack }) {
  return (
    <div className="about-page">
      <button onClick={onBack}>← Atgal į parduotuvę</button>

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
        ✉️ El. paštas: {" "}
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
        📍 Parduotuvės adresas: {" "}
        <a
          href="https://www.google.com/maps/search/?api=1&query=Sruogos+7+Kaunas+Lithuania"
          target="_blank"
          rel="noreferrer"
        >
          Sruogos g. 7, Kaunas, Lietuva
        </a>
      </p>
    </div>
  )
}

export default Contacts
