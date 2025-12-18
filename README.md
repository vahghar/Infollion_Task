# Chatbot

A web-based chatbot application that allows users to interact with Google’s Gemini API.  
The project connects a Node.js backend with a frontend UI to enable real-time AI-powered conversations.

---

## Overview

Gemini Chatbot is a full-stack web application designed to demonstrate the integration of Google’s Gemini AI models into a chat-based interface.  
The backend securely communicates with the Gemini API, while the frontend provides a simple and user-friendly chat experience.

## Prerequisites

- Node.js (v16 or higher)
- npm
- Gemini API Key (https://aistudio.google.com/)

---

## Installation

### Clone the repository

```bash
git clone https://github.com/vahghar/Infollion_Task
cd chatbot
```

### Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory and add:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

---

## Running the Application

### Start the backend server

```bash
node server.js
```

### Start the frontend

```bash
npm start
```


---

## License

This project is intended for educational and assignment purposes.
