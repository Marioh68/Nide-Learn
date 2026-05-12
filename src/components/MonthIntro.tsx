'use client';

interface MonthIntroProps {
  onStart: () => void;
}

export function MonthIntro({ onStart }: MonthIntroProps) {
  return (
    <div className="month-intro">
      <div className="month-intro-icon">📋</div>
      <h2 className="month-intro-title">Marraskuu 2026</h2>
      <div className="month-intro-story">
        <p>
          Kati Mäkinen on juuri perustanut toiminimensä. Hän on graafinen suunnittelija,
          joka työskentelee kotoa käsin — ensimmäinen asiakas odottaa jo.
        </p>
        <p>
          Sinun tehtäväsi on kirjata Katin yrityksen marraskuun tapahtumat kirjanpitoon.
          Jokaisesta tositteesta näet, mitä on tapahtunut — sitten kirjaat sen ensin
          <strong> tiliristikkoon</strong> ja sen jälkeen <strong>muistiotositteelle</strong>.
        </p>
        <p>
          Aloitetaan helpoimmmasta: Kati siirtää rahaa omalta tililtään yrityksen käyttöön.
        </p>
      </div>
      <div className="month-intro-meta">
        <span>📅 Marraskuu 2026</span>
        <span>🏢 Asiakas Tmi — Kati Mäkinen</span>
        <span>🏦 Nide Bank</span>
      </div>
      <button className="month-intro-btn" onClick={onStart}>
        Aloita marraskuun kirjaukset →
      </button>
    </div>
  );
}
