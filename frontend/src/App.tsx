import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { ViewBlockPage } from './pages/ViewBlockPage';
import { MyBlocksPage } from './pages/MyBlocksPage';
import { EditBlockPage } from './pages/EditBlockPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/p/:slug"
          element={<ViewBlockPage />}
        />
        <Route
          path="/my-blocks"
          element={<MyBlocksPage />}
        />
        <Route
          path="/edit/:slug"
          element={<EditBlockPage />}
        />
      </Route>
    </Routes>
  );
}