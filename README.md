# JB Test Task — Instapoke (Fullstack)

This repository contains both the backend (Fastify service) and frontend (React app) for the Instapoke assignment.  
The project implements an Instagram-like Pokémon feed with infinite scroll, optional hashtag filtering (by generation), and smooth virtualization.

## Tech Stack

### Backend
- **Fastify** + **TypeScript**
- **Zod** (validation)
- **@fastify/swagger** (API docs)
- **PokeAPI** as data source

### Frontend
- **React** + **TypeScript** (Vite)
- **Redux Toolkit** + **RTK Query**
- Custom infinite scroll hook (**IntersectionObserver**)
