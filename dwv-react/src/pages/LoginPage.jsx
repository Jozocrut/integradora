import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Por favor, ingresa correo y contraseña.');
            setLoading(false);
            return;
        }

        //ingresar con supabase
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (authError) {
                throw authError;
            }

            const { data: sessionData } = await supabase.auth.getSession();

            onLoginSuccess(sessionData.session);

        } catch (err) {
            console.error('Error de autenticación:', err);
            setError('Credenciales incorrectas o el usuario no existe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#222'
        }}>
            <div style={{
                padding: '40px',
                maxWidth: '400px',
                width: '100%',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
                <h2 style={{ textAlign: 'center', color: '#333' }}>INGRESAR CUENTA</h2>
                <h3 style={{ textAlign: 'center', color: '#007bff' }}>VISOR DICOM</h3>

                <form onSubmit={handleLogin}>

                    <label style={{ display: 'block', margin: '15px 0 5px 0' }}>Usuario (Correo):</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', margin: '0 0 15px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                    />

                    <label style={{ display: 'block', margin: '5px 0' }}>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', margin: '0 0 25px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                    />

                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Ingresando...' : 'INGRESAR'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;