# Software Requirements Specification (SRS)
## SMAPI Analytics Dashboard with GCP Integration

**Version:** 1.0  
**Date:** January 7, 2026  
**Project:** SMAPI Analytics Dashboard  
**Author:** Development Team

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for developing a fully functional analytics dashboard that displays real-time mobile application metrics by integrating with Google Cloud Platform (GCP) BigQuery.

### 1.2 Scope
The SMAPI Analytics Dashboard is a web-based application that provides:
- Real-time visualization of mobile app KPIs
- Interactive filtering and data exploration
- Integration with GCP BigQuery for live data
- Export capabilities for reports
- Responsive design for desktop viewing

### 1.3 Definitions and Acronyms
- **SRS**: Software Requirements Specification
- **GCP**: Google Cloud Platform
- **KPI**: Key Performance Indicator
- **API**: Application Programming Interface
- **CORS**: Cross-Origin Resource Sharing
- **P95/P90/P50**: 95th, 90th, 50th percentile metrics
- **REST**: Representational State Transfer

### 1.4 References
- Google Cloud BigQuery Documentation
- Chart.js Documentation (v4.x)
- Google Cloud Functions Documentation

---

## 2. System Overview

### 2.1 System Architecture

```
┌─────────────────┐
│  Mobile App     │
│  (iOS/Android)  │
└────────┬────────┘
         │ Analytics Events
         ▼
┌─────────────────┐
│      SMAPI      │
└────────┬────────┘
         │ Export
         ▼
┌─────────────────┐       ┌──────────────────┐
│   BigQuery      │◄──────│  Cloud Function  │
│   (Data Store)  │       │  (API Endpoint)  │
└─────────────────┘       └────────┬─────────┘
                                   │ REST API
                                   ▼
                          ┌──────────────────┐
                          │  Web Dashboard   │
                          │  (Frontend UI)   │
                          └──────────────────┘
```

### 2.2 Components
1. **Frontend Dashboard** - HTML/CSS/JavaScript single-page application
2. **Backend API** - Node.js Cloud Function
3. **Data Layer** - BigQuery tables and datasets
4. **Authentication** - GCP IAM and service accounts

---

## 3. Functional Requirements

### 3.1 Dashboard UI Requirements

#### FR-1: Sidebar Filters
**Priority:** HIGH  
**Description:** The dashboard shall provide a fixed sidebar with filtering controls.

**Acceptance Criteria:**
- Display date range picker with format "YYYY/MM/DD - YYYY/MM/DD"
- Provide platform dropdown (All Platforms, iOS, Android)
- Provide app version dropdown (dynamic list from data)
- Provide data percentile selector (P95, P90, P50)
- Filters shall persist during session
- Applying filters shall trigger data refresh

#### FR-2: KPI Cards Display
**Priority:** HIGH  
**Description:** Display four primary KPI metrics in card format.

**Acceptance Criteria:**
- Session Count - total sessions in selected period
- Active Users - unique active users
- Installs - new app installations
- App Uptime - percentage uptime with green color coding
- Values shall update based on filter selections
- Display loading state while fetching data
- Format large numbers (e.g., 4.8M, 321.5k)

#### FR-3: Page Views Chart
**Priority:** HIGH  
**Description:** Display 30-day trend of page views with sub-filtering.

**Acceptance Criteria:**
- Line chart showing daily page views
- Dropdown to filter by specific pages (Overall, /home, /product-detail, /checkout)
- X-axis shows dates with smart label limiting
- Y-axis starts at zero
- Smooth line with tension curve
- Hover shows exact values
- Updates based on sidebar filters

#### FR-4: Network Requests Chart
**Priority:** MEDIUM  
**Description:** Display total vs failed network requests over time.

**Acceptance Criteria:**
- Dual-line chart (Total in blue, Failed in red)
- Legend displayed in top-right
- Both metrics on same time scale
- Failed requests highlighted in danger color
- Updates based on sidebar filters

#### FR-5: App Launch Time Chart
**Priority:** MEDIUM  
**Description:** Display app launch performance metrics.

**Acceptance Criteria:**
- Line chart with filled area
- Y-axis in milliseconds
- Green color scheme for positive metric
- Shows percentile data (P95/P90/P50 based on filter)
- Updates based on sidebar filters

#### FR-6: Element Load Time Chart
**Priority:** MEDIUM  
**Description:** Display key element load performance.

**Acceptance Criteria:**
- Line chart showing daily P95 load times
- Y-axis in milliseconds
- Orange/amber color scheme
- Updates based on sidebar filters

#### FR-7: Export Functionality
**Priority:** LOW  
**Description:** Allow users to export dashboard data.

**Acceptance Criteria:**
- CSV export button (downloads current filtered data)
- PDF export button (generates PDF report)
- Exports include current filter selections
- Filename includes date range

#### FR-8: System Status Footer
**Priority:** LOW  
**Description:** Display system operational status.

**Acceptance Criteria:**
- Show "Operational" status in green when healthy
- Show copyright and platform info
- Update status based on API health checks

### 3.2 Backend API Requirements

#### FR-9: KPI Endpoint
**Priority:** HIGH  
**Description:** Provide REST endpoint for KPI metrics.

**Endpoint:** `GET /api/kpis`

**Query Parameters:**
- `startDate` (required) - ISO 8601 date
- `endDate` (required) - ISO 8601 date
- `platform` (optional) - "ios", "android", or "all"
- `appVersion` (optional) - version string
- `percentile` (optional) - "p95", "p90", "p50"

**Response Format:**
```json
{
  "sessionCount": 4800000,
  "activeUsers": 321500,
  "installs": 48912,
  "uptime": 99.99
}
```

**Acceptance Criteria:**
- Execute BigQuery query with filters
- Return data within 2 seconds
- Handle missing parameters with defaults
- Return 400 for invalid date ranges
- Include CORS headers

#### FR-10: Page Views Endpoint
**Priority:** HIGH  
**Description:** Provide daily page view trend data.

**Endpoint:** `GET /api/page-views`

**Query Parameters:**
- `startDate`, `endDate`, `platform`, `appVersion` (same as FR-9)
- `page` (optional) - specific page path or "all"
- `days` (optional) - number of days (default 30)

**Response Format:**
```json
{
  "labels": ["Jan 1", "Jan 2", ...],
  "data": [650, 720, 580, ...]
}
```

**Acceptance Criteria:**
- Return daily aggregated data
- Filter by page if specified
- Generate date labels in "MMM D" format
- Handle timezone conversions

#### FR-11: Network Requests Endpoint
**Priority:** MEDIUM  
**Description:** Provide network request metrics.

**Endpoint:** `GET /api/network-requests`

**Response Format:**
```json
{
  "labels": ["Jan 1", "Jan 2", ...],
  "total": [2200, 2350, ...],
  "failed": [15, 22, ...]
}
```

**Acceptance Criteria:**
- Return both total and failed request counts
- Daily aggregation
- Calculate failure rate

#### FR-12: Launch Time Endpoint
**Priority:** MEDIUM  
**Description:** Provide app launch performance data.

**Endpoint:** `GET /api/launch-time`

**Response Format:**
```json
{
  "labels": ["Jan 1", "Jan 2", ...],
  "data": [430, 445, 420, ...]
}
```

**Acceptance Criteria:**
- Return percentile-based metrics (P95/P90/P50)
- Values in milliseconds
- Daily aggregation

#### FR-13: Element Load Endpoint
**Priority:** MEDIUM  
**Description:** Provide element load time data.

**Endpoint:** `GET /api/element-load`

**Response Format:**
```json
{
  "labels": ["Jan 1", "Jan 2", ...],
  "data": [900, 850, 920, ...]
}
```

**Acceptance Criteria:**
- Return P95 load times by default
- Values in milliseconds
- Track key UI elements

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### NFR-1: Response Time
- API endpoints shall respond within 2 seconds for 95% of requests
- Dashboard shall load initial view within 3 seconds
- Chart rendering shall complete within 500ms after data received

#### NFR-2: Scalability
- API shall handle 100 concurrent requests
- BigQuery queries shall be optimized with proper indexing
- Support up to 1 year of historical data queries

#### NFR-3: Availability
- System uptime target: 99.9%
- Graceful degradation when API unavailable
- Cache recent data for offline viewing

### 4.2 Security Requirements

#### NFR-4: Authentication
- Cloud Function shall use service account authentication
- API keys required for dashboard access (production)
- No sensitive data in client-side code

#### NFR-5: Data Protection
- HTTPS only for all communications
- BigQuery data encrypted at rest
- No PII (Personally Identifiable Information) in logs

#### NFR-6: CORS Policy
- Development: Allow all origins
- Production: Whitelist specific dashboard domains
- Validate origin headers

### 4.3 Usability Requirements

#### NFR-7: Browser Compatibility
- Support Chrome 90+
- Support Firefox 88+
- Support Safari 14+
- Support Edge 90+

#### NFR-8: Responsive Design
- Optimized for desktop (1920x1080, 1366x768)
- Minimum supported resolution: 1280x720
- Sidebar fixed, main content scrollable

#### NFR-9: Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Color contrast ratio 4.5:1 minimum
- Alt text for visual elements

### 4.4 Maintainability Requirements

#### NFR-10: Code Quality
- ESLint compliance for JavaScript
- Commented code for complex logic
- Modular function structure
- Error logging to Cloud Logging

#### NFR-11: Documentation
- API endpoint documentation
- BigQuery schema documentation
- Deployment guide
- Troubleshooting guide

---

## 5. Data Requirements

### 5.1 BigQuery Schema

#### Table: `analytics_sessions`
**Purpose:** Store session and user data

| Column | Type | Description |
|--------|------|-------------|
| session_id | STRING | Unique session identifier |
| user_id | STRING | Unique user identifier |
| timestamp | TIMESTAMP | Session start time |
| platform | STRING | "ios" or "android" |
| app_version | STRING | App version (e.g., "2.1.0") |
| session_duration | INTEGER | Duration in seconds |

#### Table: `analytics_page_views`
**Purpose:** Store page view events

| Column | Type | Description |
|--------|------|-------------|
| event_id | STRING | Unique event identifier |
| session_id | STRING | Associated session |
| timestamp | TIMESTAMP | Event time |
| page_path | STRING | Page URL path |
| platform | STRING | "ios" or "android" |
| app_version | STRING | App version |

#### Table: `analytics_network`
**Purpose:** Store network request metrics

| Column | Type | Description |
|--------|------|-------------|
| request_id | STRING | Unique request identifier |
| timestamp | TIMESTAMP | Request time |
| endpoint | STRING | API endpoint called |
| status_code | INTEGER | HTTP status code |
| response_time | INTEGER | Time in milliseconds |
| platform | STRING | "ios" or "android" |
| app_version | STRING | App version |

#### Table: `analytics_performance`
**Purpose:** Store app performance metrics

| Column | Type | Description |
|--------|------|-------------|
| event_id | STRING | Unique event identifier |
| timestamp | TIMESTAMP | Event time |
| metric_type | STRING | "launch_time" or "element_load" |
| metric_value | INTEGER | Value in milliseconds |
| element_name | STRING | Element identifier (for load times) |
| platform | STRING | "ios" or "android" |
| app_version | STRING | App version |

#### Table: `analytics_installs`
**Purpose:** Store app installation events

| Column | Type | Description |
|--------|------|-------------|
| install_id | STRING | Unique install identifier |
| timestamp | TIMESTAMP | Install time |
| user_id | STRING | Unique user identifier |
| platform | STRING | "ios" or "android" |
| app_version | STRING | Installed version |

### 5.2 Data Retention
- Raw event data: 13 months
- Aggregated daily data: 3 years
- Partitioned by date for query optimization

### 5.3 Data Volume Estimates
- Sessions: ~150k per day
- Page views: ~5M per day
- Network requests: ~20M per day
- Performance events: ~500k per day

---

## 6. Technical Specifications

### 6.1 Frontend Stack
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript (ES6+)** - Async/await, Fetch API
- **Chart.js 4.x** - Data visualization library

### 6.2 Backend Stack
- **Runtime:** Node.js 20
- **Framework:** Google Cloud Functions (2nd gen)
- **Database Client:** @google-cloud/bigquery v7.x
- **HTTP Framework:** Express.js (via functions-framework)

### 6.3 Infrastructure
- **Hosting:** Cloud Storage (static hosting) or Cloud Run
- **API:** Cloud Functions
- **Database:** BigQuery
- **Region:** us-central1 (or user-specified)
- **Authentication:** Service Account with BigQuery Data Viewer role

### 6.4 Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Local Testing:** @google-cloud/functions-framework
- **Deployment:** gcloud CLI

---

## 7. API Specifications

### 7.1 Base URL
- **Development:** `http://localhost:8080`
- **Production:** `https://REGION-PROJECT_ID.cloudfunctions.net/analytics-api`

### 7.2 Common Headers
**Request:**
```
Content-Type: application/json
```

**Response:**
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### 7.3 Error Responses

**400 Bad Request:**
```json
{
  "error": "Invalid date range",
  "message": "startDate must be before endDate"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Query execution failed",
  "message": "BigQuery error: [details]"
}
```

### 7.4 Rate Limiting
- 100 requests per minute per IP
- 429 status code when exceeded
- Retry-After header included

---

## 8. User Interface Requirements

### 8.1 Color Scheme
- **Background:** `#f6f8f9`
- **Sidebar:** `#ffffff`
- **Border:** `#e1e6eb`
- **Text:** `#2d333a`
- **Accent:** `#6366f1` (indigo)
- **Success:** `#2da44e` (green)
- **Danger:** `#df514c` (red)
- **Warning:** `#f59e0b` (amber)

### 8.2 Typography
- **Font Family:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Headings:** 600 weight
- **Body:** 400 weight
- **Labels:** 700 weight, uppercase, 11px

### 8.3 Layout
- **Sidebar Width:** 260px fixed
- **Main Padding:** 32px
- **Card Padding:** 20px
- **Grid Gap:** 16px (KPIs), 24px (charts)
- **Border Radius:** 4px

### 8.4 Interactive States
- **Hover:** Subtle background change on buttons
- **Loading:** Skeleton screens or spinners
- **Error:** Red border with error message
- **Disabled:** Reduced opacity (0.6)

---

## 9. Deployment Requirements

### 9.1 Prerequisites
- GCP project with billing enabled
- BigQuery API enabled
- Cloud Functions API enabled
- gcloud CLI installed and authenticated
- Node.js 20+ installed locally

### 9.2 Environment Variables
**Cloud Function:**
- `GCP_PROJECT_ID` - GCP project identifier
- `BIGQUERY_DATASET` - Dataset name (e.g., "analytics")
- `ALLOWED_ORIGINS` - Comma-separated allowed origins

**Dashboard:**
- `API_BASE_URL` - Cloud Function URL

### 9.3 Deployment Steps
1. Create BigQuery dataset and tables
2. Deploy Cloud Function
3. Test API endpoints
4. Update dashboard with API URL
5. Deploy dashboard to hosting
6. Configure custom domain (optional)
7. Set up monitoring and alerts

### 9.4 Monitoring
- Cloud Monitoring dashboards for API metrics
- Error rate alerts (>5% threshold)
- Latency alerts (>2s P95 threshold)
- BigQuery query cost monitoring

---

## 10. Testing Requirements

### 10.1 Unit Tests
- BigQuery query builders
- Data transformation functions
- Date range validation
- Error handling logic

### 10.2 Integration Tests
- End-to-end API endpoint tests
- BigQuery connection tests
- CORS configuration tests
- Authentication tests

### 10.3 UI Tests
- Chart rendering with sample data
- Filter interaction tests
- Responsive layout tests
- Error state display tests

### 10.4 Performance Tests
- Load testing (100 concurrent users)
- Query optimization validation
- Dashboard load time measurement
- API response time benchmarks

---

## 11. Acceptance Criteria

### 11.1 Dashboard Must:
- ✅ Load and display all KPI cards with real data
- ✅ Render all 4 charts correctly
- ✅ Apply filters and refresh data
- ✅ Show loading states during data fetch
- ✅ Display error messages when API fails
- ✅ Work in Chrome, Firefox, Safari, Edge
- ✅ Complete initial load in <3 seconds

### 11.2 API Must:
- ✅ Return data for all endpoints
- ✅ Respond within 2 seconds (P95)
- ✅ Handle invalid parameters gracefully
- ✅ Include proper CORS headers
- ✅ Log errors to Cloud Logging
- ✅ Execute optimized BigQuery queries

### 11.3 Data Must:
- ✅ Match BigQuery schema specification
- ✅ Be partitioned by date
- ✅ Include all required columns
- ✅ Have proper data types
- ✅ Support filtering by platform and version

---

## 12. Future Enhancements (Out of Scope)

- Real-time data streaming (currently batch updates)
- User authentication and multi-tenancy
- Custom dashboard builder
- Anomaly detection and alerts
- Mobile responsive design
- Dark mode theme
- Advanced filtering (custom date ranges, multiple platforms)
- Data export scheduling
- Comparison views (week-over-week, year-over-year)

---

## 13. Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| BigQuery costs exceed budget | HIGH | MEDIUM | Implement query result caching, partition tables, set query quotas |
| API rate limits hit | MEDIUM | LOW | Implement client-side caching, request throttling |
| Data schema changes | HIGH | MEDIUM | Version API endpoints, maintain backward compatibility |
| Browser compatibility issues | MEDIUM | LOW | Test on all supported browsers, use polyfills |
| GCP service outage | HIGH | LOW | Implement graceful degradation, cache recent data |

---

## 14. Glossary

- **Active Users:** Unique users who opened the app in the selected period
- **Session:** A period of app usage from open to close
- **P95/P90/P50:** Percentile metrics (95th, 90th, 50th percentile)
- **Element Load:** Time to render key UI components
- **Launch Time:** Time from app tap to interactive state
- **Uptime:** Percentage of time app backend services are operational

---

## 15. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| QA Lead | | | |
| DevOps Lead | | | |

---

**Document Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-07 | Development Team | Initial SRS creation |

