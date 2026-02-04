# SRS: Team Management (team.html)

## 1. Functional Requirements

### FR-1: Team Invitation Workflow
- **Description**: The system shall allow administrative users to invite new members to the analytics workspace.
- **Action**: Primary "Invite Member" button triggers a workflow to add email-based identities.

### FR-2: Role-Based Access Control (RBAC) Visualization
- **Description**: The system shall categorize users into clear permission tiers.
- **Roles**:
  - **Superadmin**: Full unrestricted access to system configuration and user management.
  - **Admin**: Standard management permissions.
  - **Viewer**: Read-only access to analytics and reporting.
- **Visuals**: Role-specific color-coded badges.

### FR-3: User Presence & Status Tracking
- **Description**: The system shall monitor the status and recency of team member activity.
- **Metrics**: 
  - **Status**: Live state (Active/Inactive).
  - **Last Active**: Timestamp of the user's most recent interaction with the dashboard.

### FR-4: Member Lifecycle Management
- **Description**: The system shall provide administrative controls for existing member records.
- **Actions**:
  - **Edit**: Modify role or profile info.
  - **Remove**: Revoke access (Vodafone Red accent).

### FR-5: Administrative Context Awareness
- **Description**: The system shall provide visual confirmation when a user is operating under high-privilege permissions.
- **Visuals**: A persistent "Superadmin View" banner in the header for appropriate users.

## 2. Non-Functional Requirements

### NFR-1: Identity Clarity
- **Requirement**: Use high-contrast avatars with name initials for rapid visual identification of team members in the table.
- **Rationale**: Facilitate quick scanning of the team roster.

### NFR-2: Security UX (Caution)
- **Requirement**: The "Remove" action must require distinct color highlighting (Red) to indicate its destructive nature.
- **Rationale**: Prevent accidental removal of key personnel.

### NFR-3: Responsive Layout
- **Requirement**: The team table must utilize flexible container widths and safe horizontal scrolling for mobile devices.
- **Rationale**: Support administrative tasks across various hardware.
