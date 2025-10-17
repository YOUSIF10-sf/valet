'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from './context/TranslationContext';
import { translations } from '../lib/translations';

export default function Home() {
  const { language } = useTranslation();
  const t = translations[language] || translations.en;

  const router = useRouter();
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState('');

  const hotels = [
    'DoubleTree',
    'Marriott',
    'Hilton Conferences',
    'Hilton Suites',
    'Hyatt Regency',
    'Conrad',
    'Jumeirah',
  ];

  const initialHotelData = hotels.reduce((acc, hotel) => {
    const key = hotel.replace(/\s/g, '_');
    acc[key] = { cars: '', parking: '', valet: '', budget: '' };
    return acc;
  }, {});

  const [hotelData, setHotelData] = useState(initialHotelData);
  const [exemptedCars, setExemptedCars] = useState('');
  const [notes, setNotes] = useState('');
  const [totalOnHand, setTotalOnHand] = useState('');
  const [difference, setDifference] = useState('');
  const [shift, setShift] = useState('Morning');
  const [valetCash, setValetCash] = useState('');
  const [valetCredit, setValetCredit] = useState('');
  const [lostTickets, setLostTickets] = useState('');
  const [damageClaims, setDamageClaims] = useState('');

  useEffect(() => {
    const dayIndex = new Date(reportDate).getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setDay(t[days[dayIndex]]);
  }, [reportDate, t]);

  const handleInputChange = (hotel, field, value) => {
    const key = hotel.replace(/\s/g, '_');
    setHotelData(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({ date: reportDate });
    for (const hotel in hotelData) {
      queryParams.append(`${hotel}_cars`, hotelData[hotel].cars || '0');
      queryParams.append(`${hotel}_parking`, hotelData[hotel].parking || '0.00');
      queryParams.append(`${hotel}_valet`, hotelData[hotel].valet || '0.00');
      queryParams.append(`${hotel}_budget`, hotelData[hotel].budget || '0.00');
    }
    queryParams.append('exemptedCars', exemptedCars || '0');
    queryParams.append('notes', notes || t.noNotes);
    queryParams.append('totalOnHand', totalOnHand || '0.00');
    queryParams.append('difference', difference || '0.00');
    queryParams.append('shift', shift);
    queryParams.append('valetCash', valetCash || '0.00');
    queryParams.append('valetCredit', valetCredit || '0.00');
    queryParams.append('lostTickets', lostTickets || '0');
    queryParams.append('damageClaims', damageClaims || '0');

    router.push(`/report?${queryParams.toString()}`);
  };

  return (
      <main className="main-container">
        <div className="form-container">
          <h1 className="page-title">{t.dailyReport}</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
                <div className="date-container">
                    <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} className="form-input" />
                    {day && <span className="day-display">{day}</span>}
                </div>
            </div>

            <div className="form-section">
              <h2>{t.hotelData}</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.hotel}</th>
                    <th>{t.numberOfCars}</th>
                    <th>{t.parkingFees}</th>
                    <th>{t.valetFees}</th>
                    <th>{t.budget}</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map(hotel => {
                    const key = hotel.replace(/\s/g, '_');
                    return (
                      <tr key={hotel}>
                        <td>{hotel}</td>
                        <td><input type="number" value={hotelData[key].cars} onChange={e => handleInputChange(hotel, 'cars', e.target.value)} /></td>
                        <td><input type="number" step="0.01" value={hotelData[key].parking} onChange={e => handleInputChange(hotel, 'parking', e.target.value)} /></td>
                        <td><input type="number" step="0.01" value={hotelData[key].valet} onChange={e => handleInputChange(hotel, 'valet', e.target.value)} /></td>
                        <td><input type="number" step="0.01" value={hotelData[key].budget} onChange={e => handleInputChange(hotel, 'budget', e.target.value)} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="form-section">
              <h2>{t.valetReport}</h2>
              <div className="grid-container">
                <div>
                  <label>{t.shift}</label>
                  <select value={shift} onChange={e => setShift(e.target.value)} className="form-select">
                    <option value="Morning">{t.morning}</option>
                    <option value="Evening">{t.evening}</option>
                    <option value="Night">{t.night}</option>
                  </select>
                </div>
                <div>
                  <label>{t.valetCash}</label>
                  <input type="number" step="0.01" value={valetCash} onChange={e => setValetCash(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label>{t.valetCredit}</label>
                  <input type="number" step="0.01" value={valetCredit} onChange={e => setValetCredit(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label>{t.lostTickets}</label>
                  <input type="number" value={lostTickets} onChange={e => setLostTickets(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label>{t.damageClaims}</label>
                  <input type="number" value={damageClaims} onChange={e => setDamageClaims(e.target.value)} className="form-input" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>{t.exemptedCars}</h2>
              <input type="number" value={exemptedCars} onChange={e => setExemptedCars(e.target.value)} className="form-input" placeholder='Number of exempted cars' />
            </div>

            <div className="form-section">
              <h2>{t.totalOnHand}</h2>
              <input type="number" step="0.01" value={totalOnHand} onChange={e => setTotalOnHand(e.target.value)} className="form-input" placeholder='Total cash on hand' />
            </div>

            <div className="form-section">
              <h2>{t.difference}</h2>
              <input type="number" step="0.01" value={difference} onChange={e => setDifference(e.target.value)} className="form-input" placeholder='Difference from budget' />
            </div>

            <div className="form-section">
              <h2>{t.notes}</h2>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="form-textarea" rows="4" placeholder='Add any notes here...' />
            </div>

            <button type="submit" className="submit-btn">{t.generateReport}</button>
          </form>
        </div>
      </main>
  );
}
