import AutoLogin from '@/auth/pages/autologin.tsx';
import { RequireAuth } from '@/auth/require-auth';
import { Layout } from '@/layouts/layout';
import { DefaultPage } from '@/pages/dashboard';
import { Route, Routes } from 'react-router';
import QuoteEdit from '@/pages/QuoteEdit.tsx';
import { OrderProvider } from '@/partials/reservations/context/OrderProvider.tsx';
import ReservationShow from '@/pages/ReservationShow.tsx';

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route path="/ssologin/:token_auth" element={<AutoLogin />} />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DefaultPage />} />

          <Route path="/ordenes/cotizacion/crear" element={
            <OrderProvider model='quote'>
              <QuoteEdit/>
            </OrderProvider>
          } />
          <Route path="/orders/reservacion/:ruid" element={
            <OrderProvider model="reservation">
              <ReservationShow/>
            </OrderProvider>
          }/>

        </Route>
      </Route>
    </Routes>
  );
}
