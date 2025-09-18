# JB test task API (Backend)

This is the backend service for the **Instapoke** assignment.  
It provides a paginated Pokémon image feed API, with optional filtering by generation (hashtags).

---

## Tech Stack
- [Fastify](https://fastify.dev/) + TypeScript
- [PokeAPI](https://pokeapi.co/) as the data source
- [Zod](https://zod.dev/) for validation
- [@fastify/swagger](https://github.com/fastify/fastify-swagger) for documentation

---

## Setup

Clone the repository and install dependencies:

```bash
npm install
```

Copy the environment variables file:

```bash
cp env.example .env
```

Edit `.env` if necessary (port, CORS origin, etc.).

## 🔧 Available Scripts
```bash
# Start in watch mode (development)
npm run dev

# Build for production
npm run build

# Start compiled code
npm start

# Lint and fix issues
npm run lint:fix
```

## API Endpoints
### Health check

```http
GET /health
```

### Response

```json
{ "ok": true, "env": "development" }
```

### Feed

```http
GET /api/images?page=1&pageSize=20
```

### Query parameters:

- `page` (integer, default 1)
- `pageSize` (1–200, default 50)
- `search` (optional, one of gen-i … gen-ix)

### Response example:

```json
{
  "items": [
    {
      "id": 1,
      "name": "bulbasaur",
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      "tags": ["gen-i"]
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 151,
  "hasNext": true
}
```

### API Docs (Swagger UI)

```http
GET /docs
```

## Example Requests

```bash
# First page of global feed
curl "http://localhost:3000/api/images?page=1&pageSize=5"

# Only Generation III Pokémon
curl "http://localhost:3000/api/images?page=1&pageSize=10&search=gen-iii"
```

## Notes

- Images come directly from PokeAPI sprites
- Generations are determined using National Pokédex ranges:
    - Gen I: #001–151
    - Gen II: #152–251
    - … up to Gen IX: #906–1025
    - This backend does not store data; it proxies PokeAPI responses page by page.