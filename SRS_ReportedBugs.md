# SRS: Reported Bugs (reported-bugs.html)

## 1. Functional Requirements

### FR-1: Jira Ecosystem Integration
- **Description**: The system shall indicate the active connection to internal bug tracking systems (Atlassian Jira).
- **Visuals**: Primary blue "Jira Integration Active" badge in the page header.

### FR-2: Lifecycle Status Monitoring
- **Description**: The system shall summarize the current state of reported application errors.
- **Metrics**: 
  - **Open Count**: Issues awaiting triage or primary action.
  - **In Progress Count**: Issues currently being addressed by engineering.
  - **Resolved Count**: Confirmed fixes.
  - **Avg Resolution Time**: Performance metric for the bug-fixing lifecycle.

### FR-3: Tabbed Status Filtering
- **Description**: The system shall allow users to filter the bug list through persistent tabs.
- **Tabs**: All, Open, In Progress, and Resolved.
- **Processing**: Instant DOM filtering without page reload.

### FR-4: Bug Metadata Visualization
- **Description**: The system shall maintain a structured table of all Jira-synced bugs.
- **Attributes**:
  - Jira Ticket ID with external link.
  - Issue Title & Source (e.g., In-app feedback).
  - Status & Priority Badges (Critical/High/Med/Low).
  - Assigned Personnel.
  - Time elapsed since report creation.

### FR-5: Investigative Linking (Session Replay)
- **Description**: The system shall provide a direct link to the recorded user session associated with the bug report.
- **Action**: "Play Session" link redirects to the `session-replay.html` analysis tool.

## 2. Non-Functional Requirements

### NFR-1: Informational Hierarchy
- **Requirement**: Use a distinct blue color palette (#0052CC) for Jira-related elements to separate "bugs" from "crashes" (red).
- **Rationale**: Maintain semantic color isolation between different monitoring modules.

### NFR-2: Dynamic Interactivity
- **Requirement**: The status tabs must update the table view with a transition delay under 100ms.
- **Rationale**: Support rapid triaging workflows during engineering stand-ups.

### NFR-3: Semantic Badge Usage
- **Requirement**: Priority levels must be clearly distinguishable using color-coded badges to facilitate urgent issue identification.
- **Rationale**: Reduce cognitive load during high-volume bug periods.
