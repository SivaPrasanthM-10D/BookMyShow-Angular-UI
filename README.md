# BookMyShow Frontend

A modern, responsive Angular application that replicates the core features of BookMyShow, including movie browsing, seat selection, booking, payment, user management, and a fully adaptive dark/light theme.

## Features

- **User Authentication**: Secure login, signup, and session management.
- **Role-Based Dashboards**: Separate interfaces for Admin, Customer, and Theatre Owner.
- **Movie Management**: Add, edit, and delete movies (Admin).
- **Show & Screen Management**: Manage shows and screens (Theatre Owner).
- **Movie Browsing**: Search, filter, and view movie details.
- **Seat Selection**: Interactive seat selection with seat count editing and visual feedback.
- **Booking & Payment**: Book tickets, view bookings, and complete payments with a pre-payment note dialog.
- **Reviews & Ratings**: Add and view movie reviews and ratings.
- **Responsive UI**: Fully responsive layout for all devices.
- **Theme Switcher**: Toggle between dark and light themes, with persistent preference.
- **Modern UI/UX**: Adaptive colors, custom logo, theme-aware icons, and modern scrollbars.
- **Session Timeout Handling**: Snackbar notification and redirection on session expiry.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [Angular CLI](https://angular.io/cli) (v13 or above recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bookmyshow-frontend.git
   cd bookmyshow-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   ng serve
   ```
   The app will be available at `http://localhost:4200/`.

### Project Structure

```
src/app/
  admin/              # Admin dashboard and features
  customer/           # Customer dashboard, booking, payment, reviews
  theatre-owner/      # Theatre owner dashboard and management
  services/           # Shared Angular services (auth, booking, etc.)
  models/             # TypeScript models/interfaces
  shared/             # Shared components (profile, loader, etc.)
  interceptors/       # HTTP interceptors (auth, loader, error handling)
  guards/             # Route guards
  layout/             # Main layout and navigation
  login/              # Login page
  signup/             # Signup page
```

## Customization

- **Theme Colors**: Easily adjust theme colors via CSS variables in `src/styles.css`.
- **Logo**: Replace the logo in `src/assets/` and update references in the layout component.
- **API Integration**: Connect to your backend by updating API endpoints in the Angular services.

## Scripts

- `ng serve` — Run the app in development mode.
- `ng build` — Build the app for production.
- `ng test` — Run unit tests.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

**Developed with ❤️ using Angular.**
