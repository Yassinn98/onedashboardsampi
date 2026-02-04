# SRS: Market & Platform Selection (select.html)

## 1. Functional Requirements

### FR-1: User Authentication
- **Description**: The system shall provide an email-based authentication mechanism.
- **Input**: User email address (e.g., `user@vodafone.com`).
- **Processing**: 
  - Validate email format using regex.
  - Match email domain or specific email address against the `MARKET_ACCESS_CONFIG`.
- **Output**: Display "Preferences" section if authorized, or an error message if unauthorized.

### FR-2: Domain-Based Access Control
- **Description**: The system shall restrict market access based on the email domain or specific email identity.
- **Logic**:
  - `.ie` domain -> Ireland (IE) market.
  - `.pt` domain -> Portugal (PT) market.
  - `.co.uk` domain -> United Kingdom (UK) market.
  - `.com` / specified overrrides -> All available markets.

### FR-3: Platform Selection
- **Description**: Authorized users shall be able to choose between "Mobile App" and "Web Platform".
- **Visuals**: Icons for App (📲) and Web (💻).

### FR-4: Dynamic Market Selection
- **Description**: The system shall dynamically populate the Market dropdown based on the user's authorized access levels.
- **Content**: Market flag icon and ID (e.g., 🇮🇪 IE).

### FR-5: Session Persistence (Selection)
- **Description**: The system shall store the user's email, platform, and market selection in LocalStorage to maintain state across sessions.

### FR-6: Redirect to Dashboard
- **Description**: Upon successful selection, the system shall redirect the user to the main dashboard (`index.html`) with selection parameters as query strings.

## 2. Non-Functional Requirements

### NFR-1: Feedback & Usability
- **Requirement**: Display clear success/error messages for authentication steps with brief animations (shake/fade).
- **Rationale**: Ensure users understand why a login failed (e.g., invalid domain).

### NFR-2: Performance
- **Requirement**: Authentication processing and dropdown population should occur in under 1 second.
- **Rationale**: Maintain a "premium" and responsive feel.

### NFR-3: Security
- **Requirement**: Use HTTPS (implied) and clear LocalStorage upon "Change User" action.
- **Rationale**: Minimal security for sensitive access.
