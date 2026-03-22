# Blockchain-secured Earth Observation Data Platform

A decentralized marketplace and secure repository for **Earth Observation (EO) data**. This platform leverages blockchain technology to ensure data integrity, transparent transactions, and secure access to satellite imagery and geospatial datasets.

## 🚀 Overview

This project provides a robust framework for satellite data providers and consumers to interact in a trustless environment. By utilizing blockchain, we solve common issues in the EO industry such as data provenance, unauthorized redistribution, and complex licensing agreements.

## ✨ Key Features

* **Secure Data Marketplace:** Buy and sell Earth Observation datasets using smart contracts.
* **Data Integrity:** Every dataset is hashed and recorded on-chain to ensure what you buy is what you get.
* **Decentralized Storage:** Metadata and data pointers are handled securely to prevent single points of failure.
* **Developer Friendly:** Built with a modern tech stack (TypeScript, React, Node.js) for high performance and type safety.

## 🛠️ Tech Stack

* **Frontend:** [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
* **Backend:** [Node.js](https://nodejs.org/) / Express
* **Database/ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (97% of project)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## 📂 Project Structure

```text
├── client/           # Frontend React application
├── server/           # Backend API and blockchain logic
├── shared/           # Shared types and schemas (Zod/Drizzle)
├── script/           # Deployment and utility scripts
├── drizzle.config.ts # Database configuration
└── tailwind.config.ts # Styling configuration
```

## ⚙️ Getting Started

### Prerequisites
* Node.js (Latest LTS recommended)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Nishita2309/Blockchain_secured_Earth_Observation_Data_Platform.git
    cd Blockchain_secured_Earth_Observation_Data_Platform
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your database and blockchain provider credentials (see `.env.example` if available).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    
