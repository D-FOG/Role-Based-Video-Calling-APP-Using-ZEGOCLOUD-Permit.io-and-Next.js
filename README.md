# MeetHub – Seamless Meeting Collaboration for Teams

![MeetHub](https://github.com/user-attachments/assets/265228ab-da63-4a24-92b0-e53b06d48350)

MeetHub is a modern meeting management app built with **Next.js**, **Tailwind CSS**, **shadcn/ui**, and **Permit.io** for fine-grained role-based access control. It helps teams schedule, manage, and host virtual meetings efficiently.

---

## ✨ Features

- 🔐 User Authentication  
- 🗓️ Meeting Scheduling  
- 🎥 Video Conferencing  
- 🛠️ Role & Permission Management via Permit.io  
- 👥 Invite & Manage Participants  
- 📱 Fully Responsive Design  

---

## ⚙️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)  
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)  
- **ReBAC**: [Permit.io](https://www.permit.io)  
- **Deployment**: [Vercel](https://vercel.com)

---

## 🚀 Getting Started

### 1. Set Up Permit.io

1. Go to [https://app.permit.io](https://app.permit.io) and sign in.
2. Create a **new project** and define a resource (e.g., `zego-one`) with relevant roles (`host`, `speaker`, `listener`, etc.).
3. Assign policies and permissions as needed.
4. Generate your **PDP API Key** from the **Environment > PDP** tab.

---

### 2. Run the PDP Locally (Docker)

Permit.io PDP (Policy Decision Point) must be running locally to make authorization decisions.

Use this command to start the PDP container:

```bash
docker run -it -p 7766:7000 \
  --env PDP_API_KEY=your_permit_key_here \
  --env PDP_DEBUG=True \
  --env PDP_CORS_ALLOW_ORIGINS=http://localhost:3000 \
  permitio/pdp-v2:latest

### Prerequisites

- Node.js 18.x or later
- npm 

###  Clone the Repository

git clone https://github.com/D-FOG/Role-Based-Video-Calling-APP-Using-ZEGOCLOUD-Permit.io-and-Next.js.git
cd Role-Based-Video-Calling-APP-Using-ZEGOCLOUD-Permit.io-and-Next.js


### Installation
- npm install
- npm run dev