function Home({ onOpenProducts }) {
  return (
    <main className="home-page">
      <section className="home-welcome">
        <span className="home-bee" aria-hidden="true">🐝</span>
        <h1>Sveiki atvykę į Bitininko parduotuvę!</h1>
        <p>
          Čia rasite bitininkystės produktų ir reikmenų, skirtų tiek
          pradedantiesiems, tiek patyrusiems bitininkams.
        </p>
        <p>Rūpinkitės bitėmis ir plėskite savo ūkį su tinkamais įrankiais.</p>
        <button className="home-products-button" onClick={onOpenProducts}>
          Peržiūrėti prekes
        </button>
      </section>
    </main>
  )
}

export default Home
