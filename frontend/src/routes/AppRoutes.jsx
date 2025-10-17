import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import ArticleForm from '../components/ArticleForm';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/articles/create" 
        element={
          <ProtectedRoute>
            <ArticleForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/articles/edit/:id" 
        element={
          <ProtectedRoute>
            <ArticleForm />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;