import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';

const AppRoutes = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/" element={<Authenticate />} />
      <Route path="/authenticate" element={<Authenticate />} />
      <Route path="/project/*" element={<Project />} />
      <Route path="*" element={<PageError />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
