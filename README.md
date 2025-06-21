# Mugi Frontend

This is the frontend repository for Mugi.pet
https://mugi.pet/

**Mugi** is a bilingual platform that helps pet owners find and book trusted local pet sitters, ensuring a seamless and flexible experience.

A demo of the app can be viewed here: https://www.youtube.com/watch?v=nf6tw-EHCgg

---

## Technology

- React
- TypeScript
- Axios
- Tailwind CSS
- Firebase
- i18next
- React Router

## Prerequisites

- Node.js
- npm
- Mugi Backend : https://github.com/cc-pet-sitter/backend

## Installation

### Clone the Repository

Clone this reposirtory in your local machine.

### Install Dependencies

Install the required dependencies.

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project directory and add the following variables.

```env
VITE_API_BASE_URL=your_api_url
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASURE_ID=your_firebase_measure_id
```

### Start the development server

```bash
npm run dev
```

Then open the Application in your browser.

## Docker development

### Compose

First, copy `docker-compose.yml.example` as `docker-compose.yml` and insert the required secrets:

- `FIREBASE_CREDENTIALS` - base64 encoded firebase credentials in JSON format
