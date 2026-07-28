# CrowOps Domain Model

## Purpose

This document defines the core business entities of CrowOps.

It describes what each entity represents before implementation.

---

# Core Entities

## User

Represents a system administrator who can access CrowOps.

Responsibilities:

- Authenticate
- Manage servers
- Execute operations
- View infrastructure

---

## Server

Represents a managed machine.

A server may be:

- Linux
- Windows
- Virtual Machine
- Cloud Instance

A server is the central entity of CrowOps.

---

## SSH Credential

Represents the authentication method used to access a server.

Authentication may use:

- Password
- SSH Key

Credentials belong to one server.

---

# Future Entities

- Docker Host
- Docker Container
- Docker Image
- Linux Service
- Database Instance
- Alert
- Metric
- Notification
- Scheduled Job
- Workflow

---

# Initial MVP

The MVP focuses on only three entities:

- User
- Server
- SSH Credential