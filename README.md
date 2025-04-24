# A4Hub - Job Application Platform

A4Hub is a modern job application platform that connects job seekers with recruiters through an innovative application process.

## Features

- Job posting and management
- Video introductions
- Business case challenges
- Application tracking
- Interview scheduling
- Candidate rating system

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/a4hub.git
cd a4hub
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and add your configuration:
- Create a `.env` file in the root directory
- Add your Firebase configuration:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

### Netlify

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect to Netlify:
- Go to [Netlify](https://www.netlify.com/)
- Click "New site from Git"
- Select your repository
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- Click "Deploy site"

3. Set up environment variables in Netlify:
- Go to Site settings > Build & deploy > Environment
- Add your Firebase configuration variables

## Development

- `npm run dev`: Start development server with hot reloading
- `npm run build`: Build for production
- `npm run start`: Start production server

## Technologies Used

- Firebase (Authentication, Firestore, Storage)
- HTML5, CSS3, JavaScript
- Netlify for hosting
- Google Meet API for interviews

## License

MIT 