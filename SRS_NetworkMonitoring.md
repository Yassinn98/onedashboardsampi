# SRS: Network Monitoring (network-monitoring.html)

## 1. Functional Requirements

### FR-1: Real-time Traffic Volume Chart
- **Description**: The system shall visualize network request volume and success/error ratios.
- **Visuals**: A stacked bar chart using Chart.js, categorized by hours.
- **Data Series**:
  - 2xx Success (Green Gradient).
  - 4xx/5xx Errors (Red Gradient).

### FR-2: Advanced Log Filtering
- **Description**: The system shall allow users to filter network logs based on multiple criteria.
- **Supported Filters**:
  - Search Endpoint (Text-based).
  - Date Range (Start/End date).
  - HTTP Status Code (All, 200, 404, 500).
  - Platform (iOS, Android).
  - App Version (v2.1.0, v2.0.8, v2.0.7).
- **Processing**: Instant table refresh upon filter application.

### FR-3: Conditional Troubleshooting Context (User Steps)
- **Description**: The system shall provide behavioral context for troubleshooting failed requests.
- **Logic**: 
  - **Failed Requests (non-200)**: Display an active "View Steps" button.
  - **Successful Requests (200)**: Display "Not available" text.
- **Output**: Clicking "View Steps" shall open an overlay with a checklist of the last 10 user actions leading to that request.

### FR-4: Comprehensive Log Metadata
- **Description**: The system shall present detailed metadata for each network event.
- **Attributes**: Timestamp, HTTP Method (GET/POST/etc.), Endpoint Path, Status Badge (Color-coded), Latency (ms), App Version, Platform, and Source Screen.

### FR-5: Latency Classification
- **Description**: The system shall color-code latency values to highlight performance issues.
- **Thresholds**:
  - < 100ms: Green (Good).
  - 100ms - 200ms: Orange (Warning).
  - > 200ms: Red (Critical).

## 2. Non-Functional Requirements

### NFR-1: Error Visibility
- **Requirement**: Use high-contrast status badges (e.g., Red for 500, Orange for 404) in the results table.
- **Rationale**: Allow engineers to spot failures at a glance during scrolling.

### NFR-2: Search Performance
- **Requirement**: Endpoint searching must filter 500+ records in under 200ms.
- **Rationale**: Ensure a fluid data discovery experience.

### NFR-3: Data Integrity (Simulation)
- **Requirement**: In the absence of a backend, the system shall generate a deterministic set of 500 events spanning the last 24 hours.
- **Rationale**: Provide a consistent environment for demonstration and UI testing.
