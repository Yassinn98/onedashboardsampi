# SRS: In-App Ratings (in-app-ratings.html)

## 1. Functional Requirements

### FR-1: Satisfaction KPI Aggregation
- **Description**: The system shall calculate and display the current average star rating.
- **Components**:
  - Digital Rating (e.g., 4.5).
  - Star Visualization (★★★★☆).
  - Total Review Volume (e.g., 12,458 reviews).

### FR-2: Rating Distribution Visualization
- **Description**: The system shall provide a breakdown of sentiment through star-level distribution.
- **Visuals**: Horizontal progress bars showing the proportional volume of 5, 4, 3, 2, and 1-star ratings.

### FR-3: Simplified Review Log
- **Description**: The system shall list the most recent user submissions to monitor live sentiment trends.
- **Constraint**: To ensure cross-market compliance and support simplicity, **review comments (text body)** and **timestamps** are omitted.
- **Attributes**: User Handle, Star Rating, App Version, and Platform (iOS/Android).

### FR-4: Sentiment & Engagement Insights
- **Description**: The system shall present high-level derived insights from the ratings data.
- **Metrics**:
  - **Overall Sentiment**: Categorical result (e.g., "Positive").
  - **Response Rate**: Percentage of reviews addressed by support teams.

## 2. Non-Functional Requirements

### NFR-1: Clarity & Minimalism
- **Requirement**: The UI must maintain a white-space heavy design focused on core metrics, having removed previously cluttered features (keywords and response times).
- **Rationale**: Allow managers to quickly gauge general sentiment without deep-diving into individual text logs.

### NFR-2: Mobile-First List View
- **Requirement**: Review cards must use a flex-column layout that scales gracefully between desktop and mobile devices.
- **Rationale**: Consistent accessibility for stakeholders.

### NFR-3: Visual Branding
- **Requirement**: Use a consistent "Gold" (#F59E0B) for satisfaction elements to align with standard industry rating colors.
- **Rationale**: Maintain user expectation for rating systems.
