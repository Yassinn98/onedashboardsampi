# SRS: App Summary Dashboard (dashboard.html)

## 1. Functional Requirements

### FR-1: High-Fidelity Performance KPIs
- **Description**: The system shall present core analytics for the selected app environment.
- **Metrics**: 
  - **Session Count**: Total discrete user sessions.
  - **Active Users**: Unique users within the timeframe.
  - **Crash-Free Rate**: Percentage of sessions without fatal errors.
  - **App Rating**: Current store/in-app aggregated rating.
- **Support**: Each KPI shall include an informational tooltip explaining the calculation logic.

### FR-2: Data Export Engine
- **Description**: The system shall allow stakeholders to export dashboard data for offline reporting.
- **Supported Formats**:
  - **CSV**: Downloadable flat-file of raw metrics.
  - **PDF**: Visual snapshot of the current dashboard view using `jspdf` and `html2canvas`.

### FR-3: Analytics Filtering
- **Description**: The system shall allow users to slice data for deep-dive analysis.
- **Filters**:
  - Date Range (Start/End).
  - Platform (iOS, Android, All).
  - App Version.
  - **Data Percentile**: Selection between **P95**, **P80**, and **P50** to filter outliers in latency/performance data.

### FR-4: Multi-View Analytics Charts
- **Description**: The system shall visualize trends using interactive Chart.js components.
- **Visualizations**:
  - **Daily Sessions**: Line chart showing growth trends.
  - **Platform Distribution**: Doughnut chart showing iOS vs. Android market share.
  - **Status Code Breakdown**: Comparison of Success (200) vs. Client (4xx) vs. Server (5xx) errors.
  - **Latency Trend**: Response time fluctuations over time.

## 2. Non-Functional Requirements

### NFR-1: Accessibility (A11y)
- **Requirement**: All interactive elements (KPI info buttons, filters) must have descriptive `aria-labels` and `focus-visible` state indicators.
- **Rationale**: Ensure compliance with corporate accessibility standards for internal tools.

### NFR-2: Export Integrity
- **Requirement**: PDF exports must maintain the visual layout and color scheme of the live dashboard.
- **Rationale**: Ensure consistency when reports are shared in executive meetings.

### NFR-3: Cross-Browser Compatibility
- **Requirement**: Charts and layouts must render correctly across Chrome, Safari, and Edge.
- **Rationale**: Support diverse internal device ecosystems.
