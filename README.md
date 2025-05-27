# A4Hub - You Are More Than a CV

A4Hub is a modern job platform that uses AI-driven case studies and video CVs to connect top talent with companies.

## Features

- AI-powered case studies for each role
- Video CV uploads for better candidate insights
- Smart matching algorithm
- Real-time application tracking
- Modern, responsive design

## Deployment

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v14 or higher)
2. Install [Firebase CLI](https://firebase.google.com/docs/cli):
   ```bash
   npm install -g firebase-tools
   ```

### Setup

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Select your Firebase project
   - Use "." as your public directory
   - Configure as a single-page app: Yes
   - Don't overwrite index.html: No

3. Update Firebase configuration:
   - Open `js/firebase-config.js`
   - Replace the placeholder values with your Firebase project configuration

### Deploy

1. Build and deploy:
   ```bash
   firebase deploy
   ```

2. Your site will be live at: `https://YOUR-PROJECT-ID.web.app`

## Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/a4hub.git
   cd a4hub
   ```

2. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

## Project Structure

```
a4hub/
├── index.html              # Landing page
├── pages/
│   ├── auth/              # Authentication pages
│   │   ├── login.html
│   │   └── signup.html
│   ├── recruiter/         # Recruiter pages
│   │   └── dashboard.html
│   └── jobseeker/         # Jobseeker pages
│       └── dashboard.html
├── js/
│   ├── app.js            # Main application logic
│   └── firebase-config.js # Firebase configuration
├── firebase.json         # Firebase configuration
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 