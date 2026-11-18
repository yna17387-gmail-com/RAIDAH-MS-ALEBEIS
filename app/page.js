'use client';
import { useState, useEffect } from 'react';

export default function BankCardApp() {
  const [data, setData] = useState({ card: null, transactions: [] });
  const [amount, setAmount] = useState('');
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const res = await fetch('/api/card');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => { loadData(); }, []);

  const handleAction = async (action) => {
    setLoading(true);
    await fetch('/api/card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, amount, ref }),
    });
    setAmount('');
    setRef('');
    await loadData();
    setLoading(false);
  };

  if (!data.card) return <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>جاري تحميل البطاقة...</div>;

  return (
    <div dir="rtl" style={{ maxWidth: '480px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', borderRadius: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#1e293b' }}>محفظتي وبطاقتي البنكية</h2>

      <div style={{
        background: data.card.is_frozen ? 'linear-gradient(135deg, #64748b, #334155)' : 'linear-gradient(135deg, #0f172a, #1e3a8a)',
        color: 'white', padding: '25px', borderRadius: '18px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span>{data.card.is_frozen ? '❄️ مجمدة' : '✅ نشطة'}</span>
          <span style={{ fontWeight: 'bold', color: '#fb923c' }}>Orange Money Link</span>
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>الرصيد المتاح</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '5px 0 20px' }}>{data.card.balance} JOD</div>
        <div style={{ letterSpacing: '2px', fontSize: '18px', marginBottom: '15px' }} dir="ltr">{data.card.card_number}</div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>{data.card.holder_name}</div>
      </div>

      <button onClick={() => handleAction('toggle_freeze')} disabled={loading} style={{
        width: '100%', padding: '12px', borderRadius: '10px', border: 'none', marginBottom: '20px',
        backgroundColor: data.card.is_frozen ? '#10b981' : '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer'
      }}>
        {data.card.is_frozen ? 'تنشيط البطاقة الآن' : 'تجميد البطاقة مؤقتاً'}
      </button>

      <div style={{ background: 'white', padding: '18px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#ea580c' }}>العمليات عبر أورنج موني (Orange Money)</h3>
        <input type="number" placeholder="المبلغ بالدينار (JOD)" value={amount} onChange={(e) => setAmount(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        <input type="text" placeholder="رقم المحفظة أو مرجع العملية (CliQ)" value={ref} onChange={(e) => setRef(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleAction('orange_deposit')} disabled={loading || !amount || data.card.is_frozen}
            style={{ flex: 1, padding: '10px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            شحن البطاقة +
          </button>
          <button onClick={() => handleAction('orange_withdraw')} disabled={loading || !amount || data.card.is_frozen}
            style={{ flex: 1, padding: '10px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            سحب للمحفظة -
          </button>
        </div>
      </div>

      <div style={{ background: 'white', padding: '18px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>سجل الحركات المالية</h3>
        {data.transactions.length === 0 ? <p style={{ color: '#64748b', fontSize: '14px' }}>لا توجد حركات مسجلة بعد.</p> : (
          data.transactions.map((t) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{t.type}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{t.phone_or_ref || 'بدون مرجع'}</div>
              </div>
              <div style={{ fontWeight: 'bold', color: t.type.includes('شحن') ? '#10b981' : '#ef4444' }}>
                {t.type.includes('شحن') ? '+' : '-'}{t.amount} JOD
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
    }
    
