function About({ onBack }) {
  return (
    <div className="about-page">
      {onBack && (
        <button onClick={onBack}>← Atgal į parduotuvę</button>
      )}

      <h1>Apie mus</h1>

      <p>
        Sveiki atvykę į mūsų bitininko parduotuvę!
      </p>

      <p>
        Čia rasite kokybiškų bitininkystės produktų ir reikmenų,
        skirtų tiek pradedantiesiems, tiek patyrusiems bitininkams.
      </p>

      <p>
        Mūsų tikslas – padėti bitininkams rūpintis bitėmis
        ir sėkmingai plėtoti savo ūkį.
      </p>
    </div>
  )
}

export default About
