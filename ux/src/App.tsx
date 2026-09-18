// src/App.tsx
import { useEffect, useState } from 'react';
import { NavBar } from './components/Layout/NavBar';
import { WelcomeToast } from './components/Layout/WelcomeToast';
import { LoginModal } from './components/Auth/LoginModal';
import { RegisterWizard } from './components/Auth/RegisterWizard';
import { PerfilView } from './pages/PerfilView';
import { Hero } from './components/Home/Hero';
import { CourseCatalog } from './components/Catalog/CourseCatalog';
import { CatalogModule } from './components/Catalog/CatalogModule';
import { Module1 } from './components/Modules/Module1';
import { Module2 } from './components/Modules/Module2';
import { Module3 } from './components/Modules/Module3';
import { Testimonials } from './components/Home/Testimonials';
import { Footer } from './components/Layout/Footer';

type AuthScreen = 'none' | 'login' | 'register';

export default function App() {
  const [currentView, setCurrentView] = useState<'main' | 'perfil'>('main');
  const [authed, setAuthed] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState<number | string>(1);
  const [currentUserObj, setCurrentUserObj] = useState<any>(null); // Guardamos el objeto de usuario activo
  const [authScreen, setAuthScreen] = useState<AuthScreen>('none');
  const [showToast, setShowToast] = useState(false);

  const [programaParaTest, setProgramaParaTest] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setAuthed(false);
    setUserName('');
    setUserId(1);
    setCurrentUserObj(null);
    setCurrentView('main');
  };

  const handleSeleccionarParaEvaluacion = (programa: any) => {
    setProgramaParaTest(programa.titulo || programa.nombre_curso || '');
    const modulo2Element = document.getElementById('evaluador-modulo-2');
    if (modulo2Element) {
      modulo2Element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  /*
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setAuthed(true);
        setUserName(u.nombres || u.nombre || '');
        setUserId(u.id);
        setCurrentUserObj(u);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);
  */

  const handleAuthSuccess = (userObj: any) => {
    if (userObj) {
      const apPaterno = userObj.apellido_paterno || '';
      const apMaterno = userObj.apellido_materno || '';
      const nombreMostrar = `${userObj.nombres || ''} ${apPaterno} ${apMaterno}`.trim();
      setAuthed(true);
      setUserName(nombreMostrar || userObj.nombres);
      setUserId(userObj.id);
      setCurrentUserObj(userObj);
      setShowToast(true);
      setAuthScreen('none');
    }
  };  

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <NavBar
        authed={authed}
        userName={userName}
        onLogin={() => setAuthScreen('login')}
        onRegister={() => setAuthScreen('register')}
        onLogout={handleLogout}
        onNavigatePerfil={() => setCurrentView('perfil')}
      />

      <main style={{ flex: 1 }}>
        {currentView === 'perfil' ? (
          /* PASAMOS initialData AL COMPONENTE DE PERFIL */
          <PerfilView 
            usuarioId={userId} 
            initialData={currentUserObj} 
            onVolver={() => setCurrentView('main')} 
          />
        ) : (
          <>
            <Hero authed={authed} onAuthRequired={() => setAuthScreen('login')} />
            <CourseCatalog />
            <CatalogModule onSeleccionarParaEvaluacion={handleSeleccionarParaEvaluacion} />
            <Module1 authed={authed} onAuthRequired={() => setAuthScreen('login')} />
            <Module2 
              authed={authed} 
              onAuthRequired={() => setAuthScreen('login')} 
              programaInicial={programaParaTest} 
            />
            <Module3 />
            <Testimonials />
          </>
        )}
      </main>

      {authScreen === 'login' && (
        <LoginModal
          onClose={() => setAuthScreen('none')}
          onGoRegister={() => setAuthScreen('register')}
          onSuccess={handleAuthSuccess}
        />
      )}

      {authScreen === 'register' && (
        <RegisterWizard
          onClose={() => setAuthScreen('none')}
          onGoLogin={() => setAuthScreen('login')}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showToast && (
        <WelcomeToast
          name={userName}
          onDismiss={() => setShowToast(false)}
        />
      )}

      <Footer />
    </div>
  );
}