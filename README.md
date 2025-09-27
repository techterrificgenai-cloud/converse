# ConferVerse

**ConferVerse** is a comprehensive prototype for a conference management platform. It is designed to streamline the entire event lifecycle, from creating agenda slots to post-event speaker recognition. The application is built with a modern tech stack: **Next.js, React, TypeScript, Tailwind CSS, and ShadCN** for a polished UI. The AI-powered features are driven by **Google's Genkit**.

## User Roles

The platform supports two main user roles, each with a dedicated dashboard and feature set:

### Dummy Authentication
- A complete login/logout system has been implemented.
- Users are redirected if they try to access dashboards without being logged in.
- Demo credentials:
  - **Organizer:** organizer@conferverse.com
  - **Speaker:** speaker@conferverse.com (or any newly created speaker account)

### Speaker Sign-Up
- Multi-step registration process for new speakers.
- **Profile Details:**
  - Personal Details: Name, DOB, Bio
  - Professional Information: Profession, Qualifications
  - Skills and Preferred Track (e.g., 'AI & ML', 'Frontend') – crucial for recommendations
- **Speaker Profile Page:** View and update profile information anytime.

## Organizer Dashboard

The Organizer Dashboard is the central hub for managing the conference:

### Agenda Slot Management
- **Create New Slots:** Specify Title, Track, Room, and Time. Slots become immediately available for speakers to apply.
- **Status View:** All agenda slots are displayed as cards with color-coded statuses:
  - **Green (Open):** No submissions yet.
  - **Orange (Conflict):** Multiple pending submissions require a decision.
  - **Blue (Filled):** A proposal has been accepted for this slot.

### AI-Powered Conflict Resolution
- Multiple applications for the same slot are flagged as a "Conflict."
- Organizers can review proposals side-by-side, including AI-generated scores (relevance, clarity, technical depth).
- Accepting one proposal automatically rejects the others, with AI-generated personalized feedback for rejected speakers.

### Other Features
- Build the final agenda
- Send communications (with AI email generation)
- View analytics
- Manage event-day tools like speaker check-in

## Speaker Dashboard

The Speaker Dashboard helps speakers manage their engagement:

### Personalized Recommendations
- Displays open agenda slots that match the speaker's preferred track, encouraging submissions.

### AI-Assisted Proposal Submission
- Submit proposals for available agenda slots.
- **AI Title Suggester:** Helps craft engaging session titles based on abstracts.

### Dashboard & Status Tracking
- Track onboarding progress and proposal status (Pending, Accepted, Rejected).
- Review feedback provided by AI or organizer.
- Complete pre-event tasks once a session is accepted (e.g., confirming availability).

### Event Tools
- Personal QR code for check-in
- Downloadable certificate of appreciation

---

ConferVerse demonstrates a full, interactive loop: organizers create opportunities, the system intelligently recommends them to relevant speakers, and AI assists in making fair, data-driven decisions while maintaining positive speaker relations.
