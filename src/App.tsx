import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import Navbar from './components/Navbar';
import MainMenu from './pages/MainMenu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import DataSekolahPage from './pages/DataSekolahPage';
import DataOkupasiPage from './pages/DataOkupasiPage';
import FormPage from './pages/FormPage';
import DataKonsentrasiPage from './pages/DataKonsentrasiPage';
import DataAssessmentPage from './pages/DataAssessmentPage';
import ProtectedRoute from './routes/ProtectedRoute';
import RedirectRoute from './routes/RedirectRoute';

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<MainMenu />}
        />
        <Route
          path='/login'
          element={<RedirectRoute element={<Login />} />}
        />
        <Route
          path='/pengguna'
          element={<ProtectedRoute element={<Signup />} />}
        />
        <Route
          path='/home'
          element={<HomePage />}
        />
        <Route
          path='/form'
          element={<FormPage />}
        />
        <Route
          path='/data-sekolah'
          element={<ProtectedRoute element={<DataSekolahPage />} />}
        />
        <Route
          path='/data-konsentrasi'
          element={<ProtectedRoute element={<DataKonsentrasiPage />} />}
        />
        <Route
          path='/data-assessment'
          element={<ProtectedRoute element={<DataAssessmentPage />} />}
        />
        <Route
          path='/data-okupasi'
          element={<ProtectedRoute element={<DataOkupasiPage />} />}
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <FormProvider>
        <ToastContainer />
        <Router>
          <AppContent />
        </Router>
      </FormProvider>
    </AuthProvider>
  );
};

export default App;
