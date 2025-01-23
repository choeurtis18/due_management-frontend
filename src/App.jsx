import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Categories from './pages/Categories/Categories';
import Categorie from './pages/Categories/Categorie';
import AddCategory from './pages/Categories/AddCategorie';
import UpdateCategorie from './pages/Categories/UpdateCategorie';
import Members from './pages/Members/Members';
import Member from './pages/Members/Member';
import UpdateMember from './pages/Members/UpdateMember';
import AddMember from './pages/Members/AddMember';
import Dues from './pages/Dues/Dues';
import Login from './pages/Auth/Login';
import NoPage from './pages/NoPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Vérifie si l'utilisateur est connecté

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Pages Global */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NoPage />} />

        {/* Pages Categories */}
        <Route path="/categories" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Categories />
          </ProtectedRoute>
        } />
        <Route path="/categories/add" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AddCategory />
          </ProtectedRoute>
        } />
        <Route path="/categories/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Categorie />
          </ProtectedRoute>
        } />
        <Route path="/categories/:id/update" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UpdateCategorie />
          </ProtectedRoute>
        } />

        {/* Pages Membres */}
        <Route path="/members" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Members />
          </ProtectedRoute>
        } />
        <Route path="/members/add" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AddMember />
          </ProtectedRoute>
        } />
        <Route path="/members/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Member />
          </ProtectedRoute>
        } />
        <Route path="/members/:id/update" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UpdateMember />
          </ProtectedRoute>
        } />

        {/* Pages Cotisations */}
        <Route path="/dues" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dues />
          </ProtectedRoute>
        } />

        {/* Page Login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
