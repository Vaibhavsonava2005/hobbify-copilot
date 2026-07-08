# HobbyFi Copilot — Multi-Agent CRM Prototype

This repository contains the prototype for **HobbyFi Copilot**, a production-grade AI CRM assistant for the HobbyFi Vendor Portal.

## 🚀 The Upgrade

This project has been massively upgraded into a **Multi-Agent Orchestration System**:
- **Supervisor Agent**: Routes requests intelligently.
- **Analytics Agent**: Reads revenue, bookings, and court utilization via specialized tools.
- **Action Agent**: Performs write operations safely via the **Approval Engine**.
- **Planner Agent**: Breaks down complex operations.

## 🛠 Tech Stack
- **Frontend**: Clean SaaS UI, Inter Typography, HTML5/CSS3/Vanilla JS (No Glassmorphism)
- **Backend**: Node.js, Hono API
- **AI Framework**: Mastra (Multi-Agent orchestration)
- **Database**: Drizzle ORM + SQLite (24+ Tables)
- **Security**: Strict Approval Payload Engine, PII Masking, Prompt Injection Detection

## 📊 Features
1. **Interactive SaaS Dashboard**: Real-time KPI cards and a Chart.js Venue Utilization graph.
2. **AI Drawer**: A seamless chat interface to instruct the Mastra Copilot.
3. **Approval Workflows**: If the AI attempts to write to the database (e.g., cancel a booking, create a coupon), an Approval Card is dynamically injected into the chat feed for vendor review.
4. **Rich Schema**: Supports Sports, Venues, Courts, Coaches, Swipe Matches, Community Groups, and Discounts.

## 🏃‍♂️ How to Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Copilot Backend & UI**
   ```bash
   npm run dev
   ```
   *The server runs locally on Port 3015. It automatically serves the UI.*

3. **Interact**
   - Open your browser to `http://localhost:3015`
   - Ask the Copilot to *"Show me this week's revenue"*
   - Ask the Copilot to *"Create a 20% discount coupon"* (Watch the approval flow trigger!)

## 📖 Documentation
Read the highly detailed internal engineering specifications:
- `docs/ARCHITECTURE.md` (System Design & Multi-Agent orchestration)
- `docs/APPENDIX.md` (REST API, Tool Schemas, JSON models)

---
*Author: Vaibhav Sonava | Principal AI Engineer*
