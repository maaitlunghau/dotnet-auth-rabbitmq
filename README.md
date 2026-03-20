# 🛡️ Advanced Authentication & Real-Time Notification System

> A production-ready, full-stack identity management system built to demonstrate complex security workflows, session concurrency, and real-time event-driven architecture.

![Backend](https://img.shields.io/badge/ASP.NET_Core_Web_API-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Frontend](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Message Broker](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![WebSockets](https://img.shields.io/badge/SignalR-0078D4?style=for-the-badge&logo=microsoft&logoColor=white)

## 📖 Overview

This repository showcases a comprehensive approach to modern application security and communication. Designed beyond a standard login page, the system tackles real-world challenges such as multi-device session handling, secure token rotation, and asynchronous real-time user notifications. 

## ✨ Key Features

### 🔐 Robust Identity & Access Management
* **Role-Based Access Control (RBAC):** Granular authorization flow ensuring secure resource protection based on user roles and permissions.
* **Complete User Management Core:** Administrative control over user lifecycles, account statuses, and secure credential handling.
* **Automated Email Verification:** Integrated email dispatching for rigorous account activation and identity confirmation.

### 🛡️ Enterprise-Grade Security Flow
* **JWT & Refresh Token Rotation:** Secure, stateless authentication preventing token hijacking and maintaining continuous, secure user sessions.
* **Multi-Device Concurrency:** Engineered session architecture that safely enables and tracks a single account logged in across multiple devices simultaneously.

### ⚡ Event-Driven Real-time Notifications
* **RabbitMQ Integration:** Utilizes a message broker to decouple the notification logic from the core authentication flow, ensuring high scalability and fault tolerance.
* **SignalR WebSockets:** Instantly pushes critical security alerts and system events to the Next.js frontend, providing a dynamic and responsive user experience.

## 🛠️ Tech Stack & Architecture

* **Backend:** ASP.NET Core Web API
* **Frontend:** Next.js
* **Message Broker:** RabbitMQ
* **Real-time Engine:** SignalR

## 💡 Why This Project?

I built this project to challenge myself with architectural structures typically found in enterprise environments. By decoupling the notification engine using RabbitMQ and implementing strict token rotation for cross-device concurrency, this system demonstrates a deep understanding of back-end performance, modern security primitives, and full-stack integration.
