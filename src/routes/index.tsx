import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProfilePage } from './ProfilePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <ProfilePage />
        </Layout>
      } />
      {/*<Route path="/map" element={
        <Layout>
          <MapPage />
        </Layout>
      } /> - feature route map */}
    </Routes>
  );
}