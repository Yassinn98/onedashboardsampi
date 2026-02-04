# SRS: Project Configuration (configuration.html)

## 1. Functional Requirements

### FR-1: Project Metadata Management
- **Description**: The system shall allow administrators to manage basic project identity and environment defaults.
- **Attributes**: 
  - Project Name (Editable).
  - Package Name / Bundle ID (Immutable/Read-only).
  - Default environment selection (Dev/Staging/Prod).
  - System Timezone localization (e.g., Europe/London).

### FR-2: Third-Party Integration Management
- **Description**: The system shall support secure connections to external engineering tools.
- **Supported Services**:
  - **Jira**: Host URL, Auth Identity, and API Token.
  - **Slack**: Webhook URL for real-time crash alerting.
- **Verification**: Provide a "Test Connection" trigger to validate credentials without full save.

### FR-3: API Security & Key Lifecycle
- **Description**: The system shall expose and manage credentials for SDK-to-Cloud communication.
- **Components**:
  - **Project ID**: Global unique identifier.
  - **Client Token**: Public key for client-side instrumentation.
  - **Secret Key**: High-security server-side key.
- **Lifecycle Actions**: Support one-click "Regenerate" for Secret Keys to mitigate credential leakage.

### FR-4: GDPR & Privacy Controls
- **Description**: The system shall provide granular switches to ensure PII (Personally Identifiable Information) compliance.
- **Toggles**:
  - **Mask Text Inputs**: Redact text entry during session recording.
  - **Mask Images**: Obfuscate image assets in replay thumbnails.
- **Retention**: Configurable data lifecycle policy (30, 60, 90, or 365 days).

### FR-5: Developer Onboarding (SDK snippets)
- **Description**: The system shall provide ready-to-use dependency snippets for rapid integration.
- **Platforms**: iOS (podspec) and Android (gradle implementation).

## 2. Non-Functional Requirements

### NFR-1: Sensitive Data Protection
- **Requirement**: Use password masking (••••) for API Tokens and Secret Keys in the default view state.
- **Rationale**: Prevent "shoulder-surfing" leaks of sensitive credentials.

### NFR-2: Strategic Caution Visuals
- **Requirement**: Destruction-level actions (Regenerate) must be styled in Vodafone Red with clear separation from safe actions.
- **Rationale**: Prevent accidental invalidation of production API keys.

### NFR-3: Form Usability
- **Requirement**: All inputs must support standard browser autocomplete where safe and provide real-time focus feedback.
- **Rationale**: Streamline the administrative overhead of project setup.
