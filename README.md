# Medical VQA Frontend

A React frontend for the Agentic Multimodal Medical QA system.

This app gives users a clean chat interface to sign in, upload a medical image, ask questions in natural language, and continue the conversation across multiple turns. It connects to the FastAPI backend and shows responses, uploaded images, and chat history in one place.

## What it does

- User registration and login with JWT authentication
- Protected chat interface
- Send text questions with or without a medical image
- Continue existing chat sessions
- View and delete previous conversations
- Render model responses with markdown formatting

## Stack

- React
- Vite
- React Router
- Axios
- Tailwind CSS

## Backend connection

Set the backend API URL with:

```bash
VITE_API_URL=http://localhost:8000
```

If `VITE_API_URL` is not provided, the app uses the fallback URL defined in the frontend config.

Backend repository:
[agentic_multimodal_qa](https://github.com/senghuyjr11/agentic_multimodal_qa.git)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

This frontend is built to work with the backend medical QA system. Authentication, chat history, image upload, and multi-turn conversation all depend on the backend API being available.
