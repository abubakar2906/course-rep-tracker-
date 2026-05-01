# Architecture Redesign: Cohort-Based Hierarchy

Your description perfectly outlines a real-world university structure. To achieve this without the platform feeling disconnected or messy, we need to introduce the concept of **Cohorts**.

A **Cohort** is a specific group of students (e.g., **"400L Cybersecurity students in the Computer Science Dept, Faculty of Computing"**). 
- A **Course Rep** manages a Cohort.
- A **Lecturer** teaches a Course (e.g., CYB401).
- The **Connection**: A Course is assigned to one or more Cohorts. 

This creates a perfect bridge: The Lecturer teaches CYB401, and sees that the "400L Cybersecurity Cohort" (managed by Course Rep John) and the "400L Software Engineering Cohort" (managed by Course Rep Jane) are taking it. The connection is seamless!

## Proposed Changes

### 1. Database Restructuring (The Cohort Model)
We will perform a database migration to implement this exact hierarchy.

#### [MODIFY] [schema.prisma](file:///c:/Users/HP/Desktop/course-rep-tracker--master/Backend/prisma/schema.prisma)
- **New `Cohort` Model**:
  - Fields: `faculty`, `department`, `program` (e.g., Cybersecurity), `level`.
  - Relations: Belongs to a Course Rep (`User`), contains many `Students`, and takes many `Courses`.
- **Updated `Course` Model**:
  - Belongs to a Lecturer (`User`).
  - Linked to many `Cohorts` (meaning multiple groups of students can take the same course, and the Lecturer will automatically see all the Course Reps for those groups).
- **Updated `Student` Model**:
  - Belongs to a `Cohort`.
- **Updated `Tracker` Model**:
  - Linked to a `Course` AND a `Cohort` (so when a Rep takes attendance, it is specifically for their cohort's session of that course).

### 2. Onboarding Flow Updates
Because the database is changing, onboarding must capture this hierarchy:
- **Lecturers**: Select their Faculty & Department, then create/claim Courses (e.g., CYB401).
- **Course Reps**: Create their Cohort (Faculty > Dept > Program > Level). They then select which Courses their cohort is taking. This automatically connects them to the Lecturers of those courses!
- **Students**: Simply select their Cohort (e.g., "400L Cybersecurity") to automatically be linked to their Course Rep and all their Lecturer's courses.

### 3. The Lightweight Tracking Hub UI
- **Lecturer View**: When a Lecturer opens CYB401, they see a breakdown by Cohort. They can see exactly how the 400L Cybersecurity students are performing versus the 400L Software Engineering students. They can also directly message the Course Reps for those cohorts.
- **Course Rep View**: When they open CYB401, they only see their specific Cohort. They click "Track Attendance", and it generates a list of just their students.

## User Review Required

> [!WARNING]  
> This is a structural change to the database. It perfectly answers your question of *"how will they be connected like a lecturer with the course rep for that level and specific course"* by using **Cohorts** as the bridge. 
> 
> Because this changes the database, we will need to completely wipe the existing dummy data (`npx prisma migrate reset`) and update the Onboarding UI to ask for Faculty, Department, and Program. 
> 
> Are you ready to approve this Cohort-based architecture?
