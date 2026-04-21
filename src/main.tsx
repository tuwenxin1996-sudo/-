import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { PlaceholderPage } from './pages/Placeholder';
import { PerformanceLayout } from './pages/performance/PerformanceLayout';
import { PerformanceOverview } from './pages/performance/Overview';
import { PerformanceQuestions } from './pages/performance/Questions';
import { PerformanceAnswerDetail } from './pages/performance/AnswerDetail';
import { AccountsLayout } from './pages/accounts/AccountsLayout';
import { AccountsOverview } from './pages/accounts/Overview';
import { AccountDetail } from './pages/accounts/Detail';
import { MatrixSynergy } from './pages/accounts/Synergy';
import { NotesOverview } from './pages/notes/Overview';
import { NoteDetail } from './pages/notes/Detail';
import { CompetitorsOverview } from './pages/competitors/Overview';
import { TopicsOverview } from './pages/topics/Overview';
import { InsightsOverview } from './pages/insights/Overview';
import { SettingsOverview } from './pages/settings/Overview';
import { ReportsOverview } from './pages/reports/Overview';
import { AccountSettings } from './pages/account/Overview';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="performance" element={<PerformanceLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<PerformanceOverview />} />
            <Route path="questions" element={<PerformanceQuestions />} />
            <Route path="answers/:answer_id" element={<PerformanceAnswerDetail />} />
          </Route>
          <Route path="accounts" element={<AccountsLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AccountsOverview />} />
            <Route path="synergy" element={<MatrixSynergy />} />
            <Route path=":id" element={<AccountDetail />} />
          </Route>
          <Route path="notes">
            <Route index element={<NotesOverview />} />
            <Route path=":id" element={<NoteDetail />} />
          </Route>
          <Route path="competitors" element={<CompetitorsOverview />} />
          <Route path="topics" element={<TopicsOverview />} />
          <Route path="insights" element={<InsightsOverview />} />
          <Route path="reports" element={<ReportsOverview />} />
          <Route path="settings" element={<SettingsOverview />} />
          <Route path="account" element={<AccountSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
