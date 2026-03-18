import AutoLogin from '@/auth/pages/autologin.tsx';
import { RequireAuth } from '@/auth/require-auth';
import { Layout } from '@/layouts/layout';
import { DefaultPage } from '@/pages/dashboard';
import { Route, Routes } from 'react-router';

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route path="/ssologin/:token_auth" element={<AutoLogin />} />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DefaultPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
