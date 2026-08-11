import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-media">
        <img
          src="/Direttrici_CapStone.png"
          alt="Direzione artistica MS Art Ballet"
          className="hero-img"
        />
        <span className="hero-badge">Direzione artistica</span>
      </div>
      <div className="hero-content">
        <span className="hero-kicker">MS Art Ballet</span>
        <h1 className="hero-title">
          <span className="hero-title-light">L'arte</span>
          <span className="hero-title-bold">del movimento</span>
        </h1>
        <p className="hero-text">
          Una scuola di danza dove tecnica e passione crescono insieme, per
          allievi di ogni età e livello.
        </p>
        <div className="hero-actions">
          <Link to="/corsi" className="btn-accent hero-cta">
            Guarda i corsi
          </Link>
          <a href="#scuola" className="hero-link">
            La nostra storia
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
