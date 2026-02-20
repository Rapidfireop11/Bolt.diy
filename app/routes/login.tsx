import { useState } from 'react';

export default function Login() {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This saves the code in your browser's memory
    document.cookie = `invite_code=${code}; path=/; max-age=86400`; 
    window.location.href = '/'; 
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Oman's Private AI</h1>
      <p style={{ color: '#888', marginBottom: '20px' }}>Enter your invite code to start.</p>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column' }}>
        <input 
          type="text" 
          placeholder="Invite Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#111', color: '#fff', marginBottom: '10px', textAlign: 'center' }}
        />
        <button type="submit" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#8B5CF6', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Verify Access
        </button>
      </form>
    </div>
  );
}
