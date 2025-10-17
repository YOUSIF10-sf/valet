# Easy Valet Application Blueprint

## Overview

Easy Valet is a modern web application designed to provide a seamless and elegant user experience for valet services. It allows users to create, view, and manage daily valet reports.

## Project Outline

### v1.2 - Report Creation Form

*   **Feature:** A form for users to input daily valet data.
*   **Layout:** The form is centered with the title "Easy Valet" at the top.
*   **Components:**
    *   **Date Input:** To select the date of the report.
    *   **Hotels Table:** A table to input data for specific hotels (DoubleTree, Marriott, etc.). Columns include: Number of Cars, Parking Fees, Valet Fees, and Budget.
    *   **Exempted Cars Input:** A field to enter the number of exempted cars.
    *   **Notes:** A textarea for any additional comments.
    *   **Submit Button:** A button to submit the form, which then navigates to a new page to display the generated report.
*   **Functionality:** Form submission is handled by a Next.js Server Action, which processes the data and redirects the user to the report view page.

### v1.1 - Minimalist Design (Superseded)

*   **Theme:** Clean, simple, and minimalist with a white background.
*   **Styling:** Featured a prominent, lifted title box.

### v1.0 - Initial Neon Design (Superseded)

*   **Theme:** Modern, dark, and vibrant with a neon glow text effect.

## Current Plan & Steps

### Objective: Implement the Report Creation Form & Report Display Page

*   **User Request:** "اجعل العنوان اعلي الصفحة في الوسط الان نفس الصفحه اجعلها لادخال بيانات لانشاء تقرير..."
*   **Plan:**
    1.  **Update Blueprint:** Reflect the new features in `blueprint.md`.
    2.  **Create `app/report/page.tsx`:** This new route will display the formatted report after submission. It will read data from URL query parameters.
    3.  **Create `app/actions.ts`:** Create a Server Action (`createReport`) to handle form submission, process `FormData`, and redirect to the `/report` page with the data.
    4.  **Update `globals.css`:** Add styles for the form, table, input fields, and the report page layout to ensure a clean and official look.
    5.  **Refactor Homepage (`app/page.tsx`):**
        *   Move the "Easy Valet" title to the top center.
        *   Implement the report creation form, including the date picker, hotels table, and other input fields.
        *   The form will use the `createReport` Server Action.
