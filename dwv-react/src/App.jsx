import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LoginPage from './pages/LoginPage.jsx';
import DwvComponent from './DwvComponent.jsx';
import DicomUploaderPage from './pages/DicomUploaderPage';
import DicomFormPage from './pages/DicomUpdateForm.jsx';
import DicomStudiesList from './components/DicomStudiesList.jsx';

function App() {
  const [session, setSession] = useState(null); // NUEVO: Estado de la sesión de Supabase
  const [loadingApp, setLoadingApp] = useState(true); // NUEVO: Para saber si la app está cargando la sesión

  const [currentView, setCurrentView] = useState('list');
  const [studyToEdit, setStudyToEdit] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingApp(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoadingApp(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const setView = (view) => {
    setCurrentView(view);

    if (view !== 'uploader') {
      setStudyToEdit(null);
    }
  };

  const handleSelectStudy = () => {
    setView('viewer');
  };

  const startEditing = (study) => {
    setStudyToEdit(study);
    setCurrentView('update');
  };
  const onOperationComplete = () => {
    setStudyToEdit(null);
    setCurrentView('list');
  };
  
  const handleLogout = async () => {
    console.log('Cerrando sesión...');
    await supabase.auth.signOut();
  };

  if (loadingApp) {
    return <p style={{ padding: '50px', textAlign: 'center' }}>Cargando aplicación...</p>;
  }

  if (!session) {
    return <LoginPage onLoginSuccess={(newSession) => setSession(newSession)} />;
  }

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ padding: '15px', background: '#333', color: 'white' }}>
        <h1>Visor DICOM</h1>
      </header>

      <nav style={{ background: '#f0f0f0', padding: '10px', borderBottom: '1px solid #ccc' }}>

        <button onClick={() => setView('list')} style={{ margin: '0 10px' }}>
          Lista de Estudios
        </button>

        <button onClick={() => setView('uploader')} style={{ margin: '0 10px' }}>
          Subir Nuevo Estudio (Create)
        </button>

        <button onClick={() => setView('viewer')} style={{ margin: '0 10px' }}>
          Visor DICOM
        </button>

        <button onClick={() => handleLogout()} style={{ margin: '0 10px' }}>
          Salir
        </button>

      </nav>

      <main style={{ padding: '20px' }}>
        {currentView === 'uploader' &&
          <DicomUploaderPage
            setView={setView}
          />
        }

        {currentView === 'update' && (
          <DicomFormPage
            studyToEdit={studyToEdit}
            onComplete={onOperationComplete}
            setView={setView}
          />
        )}

        {currentView === 'list' && (
          <DicomStudiesList
            onSelectStudy={handleSelectStudy}
            setView={setView}
            onEditStudy={startEditing}
          />
        )}

        {currentView === 'viewer' && (
          <DwvComponent />
        )}

      </main>

    </div>
  );
}


export default App;