# Turf Website

A modern, responsive website for booking sports turf facilities. Built with React and Vite, this application allows users to view services, browse galleries, and make bookings for football and other sports activities.

## Features

### 🏟️ **Elite Services**
- **Team Bookings**: Professional training slots for local clubs and academies with high-intensity equipment access ($120/hr)
- **Premium Tournaments**: Full-day facility rental including locker rooms, scoreboard, and on-site physical therapist ($850/day)
- **Individual Drills**: Quarter-field access for skill building or private coaching ($45/hr)

### 📅 **Booking System**
- Interactive calendar for date selection
- Time slot availability (morning, afternoon, evening)
- Dynamic pricing based on time slots
- Sport selection (currently supports Football)
- Real-time availability checking

### 📱 **Responsive Design**
- Mobile-first approach with dedicated mobile navigation
- Quick book button for easy access
- Optimized layouts for all screen sizes

### 🖼️ **Gallery & Sections**
- Hero section with compelling visuals
- About section highlighting facility features
- Services showcase with pricing
- Image gallery of the turf and facilities
- Contact information and location details

### 🧭 **Navigation**
- Fixed navbar with smooth scrolling
- Mobile bottom navigation for easy access
- Quick booking shortcuts

## Technologies Used

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Custom CSS with responsive design
- **Linting**: ESLint with React plugins
- **Icons**: Material Symbols

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/turf-website.git
   cd turf-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
turf-website/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Footer.jsx
│   │   ├── MobileBottomNav.jsx
│   │   ├── Navbar.jsx
│   │   └── QuickBookButton.jsx
│   ├── pages/              # Main page components
│   │   ├── Booking.jsx
│   │   └── Home.jsx
│   ├── sections/           # Home page sections
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Gallery.jsx
│   │   ├── Hero.jsx
│   │   └── Services.jsx
│   ├── styles/             # CSS files
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact us through the website's contact section.
