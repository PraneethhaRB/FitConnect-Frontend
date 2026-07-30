# FitConnect 🤖💪

An **AI Agent-powered fitness community platform** that combines social accountability, real-time collaboration, and personalized health intelligence to help users achieve their fitness goals.

FitConnect is inspired by the social layer of platforms like Strava, but instead of focusing on activity logging, it focuses on **behavior change through goal-based communities, AI coaching, and health insights**.

Users can join communities based on goals such as **weight loss, muscle building, and healthy lifestyle improvement**, share progress updates through real-time chat, receive AI-generated coaching, and access health-related recommendations throughout their fitness journey.

---

# Why FitConnect is Different

Most fitness applications assume users are already active and only need tools to track workouts.

FitConnect focuses on users who are:
- Starting their fitness journey
- Struggling with consistency
- Looking for accountability and motivation
- Need personalized guidance instead of generic advice

The core loop is:

```
Set Goal
  ↓
Join Fitness Community
  ↓
Share Progress
  ↓
Receive AI Coaching
  ↓
Track Health Improvements
```

Instead of:

```
Log workout → Get statistics → Repeat
```

FitConnect combines **community support + AI intelligence + real health tracking**.

---

# 🤖 AI Agent Features

## AI Fitness Coach Agent

FitConnect includes an **AI Fitness Coach Agent** that goes beyond a traditional chatbot.

The agent has access to user context and can reason about the user's fitness journey before generating recommendations.

### Agent Capabilities

The AI Agent can:

- Read user fitness data
  - Goals
  - Progress percentage
  - Check-in history
  - Current streak
  - Community activity

- Analyze user behavior
  - Detect lack of consistency
  - Identify progress patterns
  - Understand challenges from recent messages

- Generate personalized coaching
  - Fitness recommendations
  - Motivation messages
  - Actionable daily goals

- Perform actions
  - Provide community-specific encouragement
  - Post coaching insights as the FitConnect Coach

---

## Why It is an AI Agent and not a Chatbot

A chatbot only responds to user messages.

The FitConnect Coach Agent follows an agent workflow:

```
User Data
   |
   ↓
Perception
(Read profile, goals, messages, activity)
   |
   ↓
Reasoning
(LLM analyzes context)
   |
   ↓
Decision
(Generate personalized recommendation)
   |
   ↓
Action
(Post guidance / suggest next step)
```

The agent has access to tools:

1. User Data Retrieval Tool
2. Community Activity Analysis Tool
3. Fitness Knowledge Retrieval Tool
4. Community Messaging Action Tool

---

# 🧠 RAG-Based Fitness Knowledge System

FitConnect implements a **Retrieval Augmented Generation (RAG)** pipeline to provide reliable fitness answers.

Instead of directly asking an LLM and depending only on its training data:

```
User Question
   |
   ↓
Retrieve Relevant Fitness Knowledge
   |
   ↓
Augment LLM Prompt
   |
   ↓
Generate Grounded Answer
```

The system retrieves relevant fitness information from a curated knowledge base before generating responses.

**Example:**

User:
```
How much protein should I eat for muscle gain?
```

System retrieves:
```
Protein intake: 1.6-2.2g/kg bodyweight
Caloric surplus: 200-300 calories
```

The retrieved information is then provided to the LLM to generate a personalized answer.

---

# Features

## Authentication & Security

- JWT-based authentication
- Signup/Login system
- BCrypt password hashing
- Stateless authentication
- Secure user identity extraction using SecurityContextHolder
- Role-based authorization

---

## Goal-Based Fitness Communities

Users can:

- Discover communities based on fitness goals
- Request membership
- Join after admin approval
- Participate in private discussions

Community examples:

- Weight Loss
- Muscle Building
- Healthy Lifestyle
- Beginner Fitness

---

## Community Management

Implemented two-step membership workflow:

```
User Request
   |
   ↓
Admin Review
   |
   ↓
Approve / Reject
```

Security rules:

- Admins can manage only their own communities
- Users cannot access private communities without membership

---

# 💬 Real-Time Community Chat

Implemented real-time communication using:

- WebSocket
- STOMP
- SockJS

Features:

- Live group messaging
- Image sharing
- Progress photo updates
- Community discussions

Architecture:

```
User
  |
  ↓
REST API
(Authentication + Validation + Persistence)
  |
  ↓
Database
  |
  ↓
WebSocket Broadcast
  |
  ↓
Community Members
```

---

# 🏗️ Architecture Highlights

## Stateless JWT Authentication

The backend never trusts client-provided user IDs.

Flow:

```
JWT Token
   |
   ↓
SecurityContextHolder
   |
   ↓
Authenticated User
```

---

## Hybrid REST + WebSocket Architecture

REST handles:

- Authentication
- Authorization
- Validation
- Database persistence

WebSocket handles:

- Real-time message delivery

This avoids duplicate business logic.

---

## Secure WebSocket Subscriptions

Implemented custom STOMP channel interceptor.

Every subscription verifies:

- JWT validity
- User identity
- Community membership

Unauthorized users cannot directly connect and listen to private chats.

---

## Scalable Storage Design

Implemented:

```
StorageService Interface
        |
   -----------
   |         |
Local     AWS S3
Storage
```

Current:
- Local disk storage

Future:
- AWS S3 migration without changing business logic

---

# Tech Stack

## Backend

- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- MySQL
- JWT (JJWT)
- WebSocket (STOMP)
- REST APIs

## Frontend

- React.js (Vite)
- Tailwind CSS
- React Router
- Axios
- STOMP.js
- SockJS

## AI Stack

- Groq API / LLM API
- AI Agent Architecture
- Prompt Engineering
- Retrieval Augmented Generation (RAG)

---

# Running Locally

## Backend

```bash
cd fitconnect-backend

# Create MySQL database
fitconnect

# Configure application.properties

mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

## Frontend

```bash
cd fitconnect-frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# API Overview

| Endpoint                                      | Description                        |
| ---------------------------------------------- | ----------------------------------- |
| POST /auth/signup                             | Create account                     |
| POST /auth/login                              | Authenticate user                  |
| GET /dashboard                                | User dashboard                     |
| PUT /dashboard/goal                           | Update fitness goal                |
| POST /dashboard/ask                           | Ask AI fitness questions using RAG |
| POST /communities/{id}/join                   | Request community membership       |
| GET /communities/{id}/pending                 | View pending requests              |
| POST /communities/{id}/approve/{membershipId} | Approve member                     |
| POST /communities/{id}/reject/{membershipId}  | Reject member                      |
| GET /communities/{id}/messages                | Fetch chat history                 |
| POST /communities/{id}/messages               | Send message                       |
| GET /communities/{id}/coach                   | Get AI Coach Agent insight         |
| WebSocket /ws                                 | Real-time community communication  |

---

# Future Improvements

- Vector database integration (Pinecone / pgvector / Chroma)
- Embedding-based semantic retrieval
- Wearable device integration
- AI-generated workout plans
- Nutrition tracking using computer vision
- Cloud deployment with AWS

---

# Project Impact

FitConnect transforms fitness from a solo tracking activity into an **AI-assisted community health ecosystem** where users receive:

✅ Accountability
✅ Real-time social support
✅ Personalized AI coaching
✅ Evidence-based fitness guidance

The platform demonstrates the integration of:

**Full Stack Development + AI Agents + RAG + Real-Time Systems + Secure Architecture**<img width="1512" height="982" alt="Screenshot 2026-07-30 at 4 12 37 PM" src="https://github.com/user-attachments/assets/5a8db9ed-47ed-476e-9b90-b165b2213c51" />
<img width="1512" height="982" alt="Screenshot 2026-07-30 at 4 11 48 PM" src="https://github.com/user-attachments/assets/a1492ae0-53ee-4bef-8843-8705fcbead8d" />
<img width="1512" height="982" alt="Screenshot 2026-07-30 at 4 12 19 PM" src="https://github.com/user-attachments/assets/eba6ece8-da97-4eee-9b7e-7b0004a028b5" />
<img width="1512" height="982" alt="Screenshot 2026-07-30 at 4 11 07 PM" src="https://github.com/user-attachments/assets/c79b7f92-357d-4859-a687-53f41d664e84" />
<img width="1512" height="982" alt="Screenshot 2026-07-30 at 4 11 01 PM" src="https://github.com/user-attachments/assets/05f2bcbf-c2a7-46f2-8f48-0f98ba401b9c" />
<img width="1512" height="982" alt="Screenshot 2026-07-30 at 4 12 27 PM" src="https://github.com/user-attachments/assets/feeb6ff7-0fc5-42ca-b348-4e2de4a40bdf" />
<img width="1512" height="982" alt="Screenshot 2026-07-30 at 4 11 10 PM" src="https://github.com/user-attachments/assets/636843fa-1326-4241-9229-c241da8fd15e" />
<img width="1512" height="982" alt="Screenshot 2026-07-30 at 4 13 13 PM" src="https://github.com/user-attachments/assets/b4f81021-b541-43a3-8f7d-fe25268f277c" />

