# SRS: Crash Reporting (crash-reporting.html)

## 1. Functional Requirements

### FR-1: Aggregated Crash KPIs
- **Description**: The system shall track and display critical stability metrics.
- **Metrics**:
  - Crash-Free Users Percentage (Target > 99%).
  - Total Crashes (Counter for current period).
  - Affected Users (Count of unique users encountering crashes).
  - Active Crash Groups (Current unresolved error buckets).

### FR-2: Crash Trend Visualization
- **Description**: The system shall visualize the daily crash count over a 30-day rolling window.
- **Visuals**: Line chart using Chart.js with smoothing and gradient area fill.

### FR-3: Crash Group Management
- **Description**: The system shall bucket individual crash instances into distinct groups based on root cause.
- **Table Data**: Error Message, Stack Trace Type, Severity (Critical/High/Med/Low), Occurrences, Affected Users, Platform, and Recency.

### FR-4: Multi-Dimensional Crash Filtering
- **Description**: The system shall allow troubleshooting isolation through filters.
- **Filters**: Date range, Platform (iOS/Android), App Version, and Severity Level.

### FR-5: Error Contextualization (Crash Detail Modal)
- **Description**: Clicking a crash group shall open an investigation modal.
- **Components**:
  - **Stack Trace**: Formatted, monospaced view of the error log.
  - **User Behavioral Context**: A "User Steps (Last 10)" list showing exactly what the user was doing before the app crashed.
- **Action**: Direct removal of "Session Replay" links in favor of behavioral steps to respect support constraints.

### FR-6: In-Table Search
- **Description**: Maintain a real-time search input to filter the crash table by error message or type.

## 2. Non-Functional Requirements

### NFR-1: Priority Visuals
- **Requirement**: "Critical" and "High" severity crashes must be highlighted with Vodafone red and amber accent bars respectively.
- **Rationale**: Ensure engineers focus on the most impactful issues first.

### NFR-2: Readability
- **Requirement**: Stack traces must use a dark, high-contrast theme (Green on Black) with horizontal and vertical overflow handling.
- **Rationale**: Prevent eye strain during deep-dive debugging.

### NFR-3: Performance
- **Requirement**: The detail modal must transition in under 300ms with a dimming background overlay.
- **Rationale**: Maintain a high-quality, professional dashboard feel.
