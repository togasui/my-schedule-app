import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

type Reservation = {
    date: string;
    start: string;
    end: string;
    memo: string;
};

function App() {
    const [date, setDate] = useState(new Date());
    const [darkMode, setDarkMode] = useState(true);

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [memo, setMemo] = useState('');
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const handleSave = () => {
        const newReservation: Reservation = {
            date: date.toDateString(),
            start: startTime,
            end: endTime,
            memo,
        };

        const updated = [...reservations, newReservation];
        setReservations(updated);
        localStorage.setItem('my-reservations', JSON.stringify(updated)); // ←保存！

        setStartTime('');
        setEndTime('');
        setMemo('');
    };

    //削除
    const handleDelete = (index: number) => {
        const updated = reservations.filter((_, i) => i !== index);
        setReservations(updated);
        localStorage.setItem('my-reservations', JSON.stringify(updated));
    };

    useEffect(() => {
        const stored = localStorage.getItem('my-reservations');
        if (stored) {
            setReservations(JSON.parse(stored));
        }
    }, []);

    return (
        <div className={darkMode ? 'app dark' : 'app light'}>
            <header>
                <h1 className="text-2xl font-bold text-blue-600">予約カレンダー</h1>
                <button onClick={toggleTheme}>
                    {darkMode ? '🌞ライトモード' : '🌙ダークモード'}
                </button>
            </header>

            <Calendar onChange={setDate} value={date} />
            <p>選択された日付: {date.toLocaleDateString('ja-JP', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>予約入力</h2>
            <div>
                <label>開始時間：</label>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
            <div>
                <label>終了時間：</label>
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
            <div>
                <label>メモ：</label>
                <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                />
            </div>
            <button onClick={handleSave}>保存</button>

            <h2>予約一覧</h2>
            <ul>
                {reservations.map((r, i) => (
                    <li key={i}>
                        📅 {new Date(r.date).toLocaleDateString('ja-JP', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                        🕒 {r.start}〜{r.end} 📝 {r.memo}
                        <button
                            style={{ marginLeft: '1rem', color: 'red' }}
                            onClick={() => handleDelete(i)}
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
