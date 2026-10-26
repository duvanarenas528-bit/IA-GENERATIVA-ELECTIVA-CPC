/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId } from './types';
import { AuthProvider } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';
import { Header } from './components/Header';
import { GlobalScreenSwitcher } from './components/GlobalScreenSwitcher';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { NuevoPreperitajeScreen } from './screens/NuevoPreperitajeScreen';
import { FichaVentaScreen } from './screens/FichaVentaScreen';
import { AnalisisVivoScreen } from './screens/AnalisisVivoScreen';
import { InformeDetalladoScreen } from './screens/InformeDetalladoScreen';
import { VisorA4Screen } from './screens/VisorA4Screen';
import { GuiaInspeccionScreen } from './screens/GuiaInspeccionScreen';
import { PerfilScreen } from './screens/PerfilScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { AdminAuditoriaScreen } from './screens/AdminAuditoriaScreen';
import { AdminMetricasScreen } from './screens/AdminMetricasScreen';
import { LoginScreen } from './screens/LoginScreen';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current screen is user-facing and should display standard header
  const isUserHeaderScreen = [
    'dashboard',
    'nuevo-preperitaje',
    'ficha-venta',
    'analisis-vivo',
    'informe-detallado',
    'guia-inspeccion',
    'perfil',
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Standard Header for user screens */}
      {isUserHeaderScreen && (
        <Header currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}

      {/* Screen Views */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'dashboard' && (
          <DashboardScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'nuevo-preperitaje' && (
          <NuevoPreperitajeScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'ficha-venta' && (
          <FichaVentaScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'analisis-vivo' && (
          <AnalisisVivoScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'informe-detallado' && (
          <InformeDetalladoScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'visor-a4' && (
          <VisorA4Screen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'guia-inspeccion' && (
          <GuiaInspeccionScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'perfil' && (
          <PerfilScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'admin-dashboard' && (
          <AdminDashboardScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'admin-auditoria' && (
          <AdminAuditoriaScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'admin-metricas' && (
          <AdminMetricasScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'login-user' && (
          <LoginScreen initialRole="user" onNavigate={handleNavigate} />
        )}

        {currentScreen === 'login-admin' && (
          <LoginScreen initialRole="admin" onNavigate={handleNavigate} />
        )}
      </div>

      {/* Floating Screen Switcher widget to jump between all screens */}
      <GlobalScreenSwitcher
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <AppContent />
      </VehicleProvider>
    </AuthProvider>
  );
}
