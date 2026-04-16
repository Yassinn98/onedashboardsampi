# OneDashboard — BigQuery Data Warehouse Specification

> **Scope**: `index.html`, `dashboard.html`, `network-monitoring.html`, `crash-reporting.html`

---

## 1. Overview Page (`index.html`)

### 1.1 KPI Cards (Hero Stats)

| KPI | Source Selector | Sample Value | Description |
|-----|----------------|-------------|-------------|
| Total Sessions | `.hero-stat-value` (1st) | 4.8M | Total app sessions across all platforms |
| Active Users | `.hero-stat-value` (2nd) | 321.5k | Unique users who opened the app |
| Crash-Free Rate | `.hero-stat-value` (3rd) | 99.2% | Percentage of sessions without crashes |
| App Rating | `.hero-stat-value` (4th) | 4.5★ | Average App Store rating |

### 1.2 Insight Cards

| Metric | Source Selector | Sample Value | Description |
|--------|----------------|-------------|-------------|
| App Performance | `.insight-card.green .card-value` | 99.99% | Backend uptime percentage |
| Crash Reporting | `.insight-card.red .card-value` | 142 | Total active crashes |
| Network Monitoring | Summary card | 98.2% | API success rate |
| User Satisfaction | `.insight-card.orange .card-value` | 4.5★ | Review avg from 12,458 reviews |

### 1.3 Charts — Data Required

#### Chart 1: Session Growth (Last 7 Days)
- **Type**: Line chart with area fill
- **Canvas ID**: `#sessionChart`
- **X-Axis**: Day of week labels (`Mon`–`Sun`)
- **Y-Axis**: Session count (values like `650k`–`850k`)
- **Data**: `[650000, 720000, 680000, 750000, 800000, 820000, 850000]`

#### Chart 2: Crash Trend (Last 7 Days)
- **Type**: Line chart with area fill
- **Canvas ID**: `#crashChart`
- **X-Axis**: Day of week labels (`Mon`–`Sun`)
- **Y-Axis**: Crash count
- **Data**: `[52, 48, 45, 42, 38, 35, 29]`

---

## 2. App Summary Page (`dashboard.html`)

### 2.1 KPI Cards

| KPI | Source Selector / ID | Sample Value | Description |
|-----|---------------------|-------------|-------------|
| Session Count | `#sessionCount` | 4.8M | Total sessions in selected period |
| Active Users | `#activeUsers` | 321.5k | Unique users |
| Installs | `#installs` | 48,912 | New app installations |
| App Uptime | `#uptime` | 99.99% | Backend availability |

### 2.2 Filters

| Filter | ID | Values |
|--------|-----|--------|
| Start Date | `#startDate` | ISO date (default: `2025-12-07`) |
| End Date | `#endDate` | ISO date (default: `2026-01-06`) |
| Platform | `#platform` | `all`, `ios`, `android` |
| App Version | `#appVersion` | `v2.1.0`, `v2.0.8`, `v2.0.7` |
| Percentile | `#percentile` | `p95`, `p80`, `p50` |

### 2.3 Charts — Data Required (6 charts, 30-day series)

#### Chart 1: Visits
- **Type**: Line (area fill) | **Canvas ID**: `#visitsChart`
- **Data**: `generateData(base=15000, variance=3000)` → 30 daily points
- **Fields needed**: `date`, `visit_count`

#### Chart 2: Unique Visitors
- **Type**: Line (area fill) | **Canvas ID**: `#uniqueVisitorsChart`
- **Data**: `generateData(base=8000, variance=1500)` → 30 daily points
- **Fields needed**: `date`, `unique_visitor_count`

#### Chart 3: Page Views Trend
- **Type**: Line (area fill) | **Canvas ID**: `#pageViewChart`
- **Data**: `generateData(base=600, variance=200)` → 30 daily points
- **Filter**: Page path dropdown (`all`, `/home`, `/product-detail`, `/checkout`)
- **Fields needed**: `date`, `page_path`, `page_view_count`

#### Chart 4: Network Requests
- **Type**: Dual-line (Total + Failed) | **Canvas ID**: `#networkChart`
- **Data Series 1**: Total Requests — `generateData(base=2200, variance=400)`
- **Data Series 2**: Failed Requests — `generateData(base=20, variance=40)`
- **Fields needed**: `date`, `total_requests`, `failed_requests`

#### Chart 5: Key Element Load Time
- **Type**: Line (area fill) | **Canvas ID**: `#elementLoadChart`
- **Data**: `generateData(base=900, variance=150)` → ms values
- **Fields needed**: `date`, `element_load_time_ms`

#### Chart 6: App Launch Time
- **Type**: Line (area fill) | **Canvas ID**: `#launchChart`
- **Data**: `generateData(base=430, variance=60)` → ms values
- **Fields needed**: `date`, `launch_time_ms`

---

## 3. Network Monitoring Page (`network-monitoring.html`)

### 3.1 Filters

| Filter | ID | Values |
|--------|-----|--------|
| Search Endpoint | `#searchEndpoint` | Free text |
| Start Date | `#startDate` | ISO date |
| End Date | `#endDate` | ISO date |
| Status | `#statusFilter` | `all`, `200`, `404`, `500` |
| Platform | `#platformFilter` | `all`, `iOS`, `Android` |
| App Version | `#versionFilter` | `all`, `v2.1.0`, `v2.0.8`, `v2.0.7` |

### 3.2 Charts — Data Required

#### Chart 1: Request Volume & Stability (Stacked Bar)
- **Type**: Stacked bar chart | **Canvas ID**: `#volumeChart`
- **X-Axis**: Hour of day (`0:00`–`23:00`)
- **Data Series 1**: `2xx Success` — hourly count of `status === 200`
- **Data Series 2**: `4xx/5xx Error` — hourly count of `status >= 400`
- **Fields needed**: `hour`, `success_count`, `error_count`

#### Chart 2: Top Failing Endpoints (Stacked Bar)
- **Type**: Stacked bar chart | **Canvas ID**: `#failingEndpointsChart`
- **X-Axis**: Top 5 endpoints by failure count (truncated path)
- **Data Series 1**: `4xx Errors` — count per endpoint where `400 <= status < 500`
- **Data Series 2**: `5xx Errors` — count per endpoint where `status >= 500`
- **Fields needed**: `endpoint`, `error_4xx_count`, `error_5xx_count`

### 3.3 Request Log Table — Columns

| Column | Data Field | Description |
|--------|-----------|-------------|
| Time | `timestamp` | HH:MM:SS format |
| Endpoint | `method` + `endpoint` | e.g., `GET /api/v1/cart/items` |
| Status | `status` | HTTP code (200, 404, 500) |
| Latency | `latency` | Response time in ms |
| Version | `version` | App version string |
| Platform | `platform` | iOS or Android |
| Screen | `screen` | UI screen name |
| User Steps | Button (errors only) | Opens user steps modal |

---

## 4. Crash Reporting Page (`crash-reporting.html`)

### 4.1 KPI Cards

| KPI | Source Selector / ID | Sample Value | Description |
|-----|---------------------|-------------|-------------|
| Crash-Free Users | `#crashFreeUsers` (`.kpi-card.green`) | 99.2% | Users without crashes |
| Total Crashes | `#totalCrashes` (`.kpi-card.red`) | 142 | Aggregate crash count in period |
| Affected Users | `#affectedUsers` (`.kpi-card.blue`) | 1,247 | Unique users who experienced crashes |
| Active Crash Groups | `#crashGroups` (`.kpi-card.purple`) | 12 | Distinct crash signatures |

### 4.2 Filters

| Filter | ID | Values |
|--------|-----|--------|
| Start Date | `#startDate` | ISO date |
| End Date | `#endDate` | ISO date |
| Platform | `#platform` | `all`, `ios`, `android` |
| App Version | `#appVersion` | `v2.1.0`, `v2.0.8`, `v2.0.7` |
| Severity | `#severity` | `all`, `critical`, `high`, `medium`, `low` |

### 4.3 Charts — Data Required

#### Chart: Crash Trend (30 Days)
- **Type**: Line chart (area fill) | **Canvas ID**: `#crashTrendChart`
- **X-Axis**: 30 daily labels (e.g., `Jan 1`, `Jan 2`, …)
- **Y-Axis**: Daily crash count
- **Data**: `[45, 52, 38, 41, 49, 55, 48, 42, 39, 44, 51, 47, 43, 40, 38, 35, 42, 39, 37, 41, 38, 36, 34, 32, 35, 38, 36, 33, 31, 29]`
- **Fields needed**: `date`, `crash_count`

### 4.4 Crash Groups Table — Columns

| Column | Data Field | Sample |
|--------|-----------|--------|
| Error | `error_message` + `error_type` | `NullPointerException in MainActivity.onCreate()` / `java.lang.NullPointerException` |
| Severity | `severity` | Critical, High, Medium, Low |
| Occurrences | `occurrences` | 342, 215, 178, 124, 89, 56 |
| Users Affected | `affected_users` | 298, 189, 156, 98, 67, 45 |
| Platform | `platform` | Android, iOS |
| Last Seen | `last_seen` | 2 hours ago, 1 day ago |

### 4.5 Crash Detail Overlay — Stack Traces & User Steps

Each crash group opens a modal (`#crashModal`) with the following data:

#### Crash Group 0: `NullPointerException in MainActivity.onCreate()`
```
java.lang.NullPointerException: Attempt to invoke virtual method
  'void android.widget.TextView.setText(java.lang.CharSequence)' on a null object reference
    at com.vodafone.app.MainActivity.onCreate(MainActivity.java:47)
    at android.app.Activity.performCreate(Activity.java:7136)
    at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1271)
    at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2893)
```

#### Crash Group 1: `Network timeout in API call`
```
NetworkException: Connection timeout after 30000ms
    at com.vodafone.app.network.ApiClient.makeRequest(ApiClient.java:124)
    at com.vodafone.app.services.DataService.fetchUserData(DataService.java:56)
    at com.vodafone.app.viewmodels.UserViewModel.loadData(UserViewModel.java:89)
```

#### Crash Group 2: `IndexOutOfBoundsException in ListView adapter`
```
java.lang.IndexOutOfBoundsException: Index: 5, Size: 3
    at java.util.ArrayList.get(ArrayList.java:437)
    at com.vodafone.app.adapters.ListAdapter.getView(ListAdapter.java:78)
    at android.widget.AbsListView.obtainView(AbsListView.java:2346)
```

#### Crash Group 3: `Memory warning - app terminated`
```
MemoryWarning: Received memory warning. Level=2
    at com.vodafone.app.utils.ImageCache.clearCache(ImageCache.java:145)
    at com.vodafone.app.MainActivity.onLowMemory(MainActivity.java:234)
```

#### Crash Group 4: `Database query failed`
```
android.database.sqlite.SQLiteException: no such table: users (code 1)
    at android.database.sqlite.SQLiteConnection.nativeExecuteForChangedRowCount(Native Method)
    at com.vodafone.app.database.UserDao.insert(UserDao.java:67)
```

#### Crash Group 5: `Image loading failed`
```
ImageLoadException: Failed to decode image
    at com.vodafone.app.utils.ImageLoader.loadBitmap(ImageLoader.java:89)
    at com.vodafone.app.views.ProfileView.setAvatar(ProfileView.java:123)
```

#### User Steps (Last 10 — shown for all crash groups)

| Step | Action |
|------|--------|
| 1 | User logged in |
| 2 | Navigated to Dashboard |
| 3 | Clicked on Crash Reporting |
| 4 | Scrolled through crash groups |
| 5 | Filtered by critical severity |
| 6 | Clicked on NullPointerException item |
| 7 | Viewed stack trace |
| 8 | Attempted to copy error log |
| 9 | Network request initiated |
| 10 | **App crashed with error** |
