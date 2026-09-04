import { useRef, useState } from "react";
import { LuVolume2, LuVolumeX } from "react-icons/lu";

function calcolaStagione(): string {
  const oggi = new Date();
  const anno = oggi.getFullYear();
  const mese = oggi.getMonth() + 1;
  return mese >= 8 ? `${anno}/${anno + 1}` : `${anno - 1}/${anno}`;
}

function LaScuola() {
  const stagione = calcolaStagione();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [conAudio, setConAudio] = useState(false);
  const [pronto, setPronto] = useState(false);

  function toggleAudio() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) {
      video.volume = 0.3;
    }
    setConAudio(!video.muted);
  }

  return (
    <section className="scuola-section" id="scuola">
      <div className="scuola-destra">
        <span className="tag-stagione">Stagione {stagione}</span>
        <span className="scuola-virgoletta">”</span>
        <p className="scuola-citazione">
          La danza non è solo movimento: è il modo in cui il corpo racconta ciò
          che le parole non arrivano a dire.
        </p>
        <span className="scuola-didascalia">Il nostro metodo</span>
      </div>
      <div className={`scuola-video${pronto ? " pronto" : ""}`}>
        <video
          ref={videoRef}
          className="scuola-video-player"
          autoPlay
          muted
          loop
          playsInline
          onClick={toggleAudio}
          onLoadedData={() => setPronto(true)}
        >
          <source
            src="/Video_CapStone_Mobile.mp4"
            media="(max-width: 991.98px)"
          />
          <source src="/Video_CapStone_Desktop.mp4" />
        </video>
        <button
          type="button"
          className="scuola-video-audio"
          onClick={toggleAudio}
          aria-label={conAudio ? "Disattiva audio" : "Attiva audio"}
        >
          {conAudio ? <LuVolume2 size={18} /> : <LuVolumeX size={18} />}
        </button>
      </div>
    </section>
  );
}

export default LaScuola;
