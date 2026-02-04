# SRS: Dashboard Overview (index.html)

## 1. Functional Requirements

### FR-1: Environment Configuration Verification
- **Description**: The system shall verify that the user has selected a platform and market before displaying the dashboard.
- **Logic**: If `userEmail`, `selectedPlatform`, or `selectedMarket` are missing from LocalStorage, redirect the user back to `select.html`.

### FR-2: Personalized Navigation (Breadcrumbs)
- **Description**: The dashboard shall display the current operating environment in a dedicated breadcrumb bar.
- **Components**:
  - Platform Icon and Name (📲 App / 💻 Web).
  - Market Flag and Code (e.g., 🇮🇪 IE).

### FR-3: High-Level Analytics Visualization (Hero Section)
- **Description**: The system shall present aggregated KPIs for the selected environment.
- **Metrics**:
  - Total Sessions (e.g., 4.8M).
  - Active Users (e.g., 321.5k).
  - Crash-Free Rate (e.g., 99.2%).
  - App Rating (e.g., 4.5★).

### FR-4: Centralized Module Navigation (Quick Actions & Insights)
- **Description**: The dashboard shall act as a central hub providing navigation to all monitoring modules.
- **Connected Modules**:
  - App Summary (`dashboard.html`).
  - Network Monitoring (`network-monitoring.html`).
  - Crash Reporting (`crash-reporting.html`).
  - In-App Ratings (`in-app-ratings.html`).
  - Bug Tracking (`reported-bugs.html`).
- **Feature Constraint**: **Session Insights** shall be displayed but visually marked as "Not Integrated" with navigation disabled.

### FR-5: Global System Navigation
- **Description**: A persistent sidebar shall allow the user to switch between Overview, Analytics, Monitoring, User Feedback, and Settings categories.

### FR-6: Dynamic Reconfiguration
- **Description**: A "Change Settings" button in the hero section shall allow users to return to the selection page to switch markets or platforms.

## 2. Non-Functional Requirements

### NFR-1: Responsiveness
- **Requirement**: The grid layout must collapse to a single column on screens narrower than 768px.
- **Rationale**: Support for on-the-go monitoring via tablet or mobile devices.

### NFR-2: Visual Consistency
- **Requirement**: Use Vodafone-standard red gradients for primary actions and status-specific colors (Green/Red/Orange/Blue/Purple) for category headers.
- **Rationale**: Intuitive navigation through color coding.

### NFR-3: Availability Status
- **Requirement**: Display a "System Operational" indicator in the footer with a pulse animation.
- **Rationale**: Provide basic confidence in the monitoring system's health.
