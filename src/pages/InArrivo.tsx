interface InArrivoProps {
  titolo: string;
}

function InArrivo({ titolo }: InArrivoProps) {
  return (
    <div className="in-arrivo">
      <h1>{titolo}</h1>
      <p>Questa sezione arriva in uno dei prossimi task.</p>
    </div>
  );
}

export default InArrivo;
