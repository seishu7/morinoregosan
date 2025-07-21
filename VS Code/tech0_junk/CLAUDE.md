# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a meeting management application ("面談アプリ") for managing external meetings with contractors. The system allows users to register, track, and search meeting records with external partners.

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python + SQLAlchemy ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT with bcrypt password hashing
- **AI Integration**: OpenAI GPT-3.5-turbo for meeting content summarization
- **Deployment**: Render.com

## Development Commands

### Backend (FastAPI)
```bash
# Setup virtual environment (critical for package versions)
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run specific functionality tests
python test_openai.py      # Test OpenAI integration
python test_auth.py        # Test authentication system
python test_endpoints.py   # Test API endpoints
python test_password.py    # Test password hashing
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript checking
```

### Database Operations
```bash
# Apply schema
psql -f database/schema.sql

# Run database test scripts
cd backend
python check_db_data.py           # Verify data
python fix_database_schema.py     # Schema fixes
python test_location_field.py     # Test location field
```

## Environment Configuration

### Backend (.env)
```bash
DATABASE_URL=postgresql://username:password@hostname:port/database_name
SECRET_KEY=your_jwt_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Architecture Overview

### Core Data Flow Pattern
1. **Frontend** → API calls via `utils/api.ts` with JWT auth interceptors
2. **Backend Routers** → Route requests and handle business logic
3. **Models/Schemas** → ORM entities and Pydantic validation
4. **Services** → External integrations (OpenAI)
5. **Database** → PostgreSQL with complex many-to-many relationships

### Backend Structure (FastAPI)
- `main.py`: FastAPI application with CORS and debug endpoints
- `app/routers/`: HTTP route handlers (auth, contacts, business_cards, coworkers)
- `app/models/models.py`: SQLAlchemy ORM models with relationships
- `app/schemas/schemas.py`: Pydantic models for API validation
- `app/services/openai_service.py`: OpenAI integration with error handling
- `app/utils/auth.py`: JWT token and bcrypt password utilities
- `app/database/connection.py`: Database connection with Supabase config

### Frontend Structure (Next.js)
- `pages/`: Route-based pages with server-side navigation
- `components/`: Reusable UI components (Layout, Sidebar, SearchModal)
- `utils/api.ts`: Centralized API client with axios interceptors
- `types/index.ts`: TypeScript interfaces matching backend schemas
- `styles/globals.css`: Tailwind CSS with custom primary color scheme

### Database Schema Architecture
Complex many-to-many relationships via junction tables:
- `contact_person_table`: Links contacts ↔ business_cards
- `contact_companions_table`: Links contacts ↔ coworkers
- Status-based soft deletes (0=draft, 1=completed, 9=deleted)
- Department-level data isolation for multi-tenancy

## Critical Technical Considerations

### OpenAI Library Version Compatibility
**CRITICAL**: Uses `openai==1.3.8` with new AsyncOpenAI client pattern
- Modern `from openai import AsyncOpenAI` import syntax
- Uses `client.chat.completions.create()` method (not legacy ChatCompletion)
- Text validation: max 10,000 characters input
- Comprehensive error handling for API limits, billing issues, and model errors

### Authentication & Security Implementation
- JWT tokens with 30-minute expiration
- bcrypt password hashing with salt rounds
- Department-scoped data access (users only see their department's records)
- Frontend auth guards with automatic redirect on 401 errors
- Backend middleware validates JWT on all protected routes

### Multi-Select Form Patterns
- Person selection (external) and companion selection (internal) via SearchModal
- React Hook Form for form state with controlled components  
- Many-to-many updates require careful SQLAlchemy transaction handling
- Form validation with real-time error display

### Search Implementation Specifics
- Department-scoped search with OR conditions on title and person names
- Status filtering (only completed records visible in search)
- Pagination with estimated page counts (API doesn't return total)
- Search limited to records where `status=1` and same `department_id`

### Status-Based Record Management
- **Draft (0)**: Editable by creator only, visible in drafts list
- **Completed (1)**: Read-only, searchable department-wide, in history list  
- **Deleted (9)**: Soft delete, hidden from all UIs
- Status transitions controlled by save/draft/discard actions

## Key Business Logic Flows

### Meeting Record Creation
1. User selects external contacts via SearchModal (business_cards)
2. User selects internal attendees via SearchModal (coworkers)
3. User enters meeting details with optional location field
4. User can generate AI summary from raw meeting content
5. Save as draft (status=0) or complete (status=1)

### Search & Discovery
- Search scopes to user's department_id automatically
- Searches title and person names with ILIKE pattern matching
- Results show: creator name, meeting date, title
- Detail view excludes raw_text (summary only)
- Pagination handles large result sets

### AI Summarization Process
1. Validate input text (not empty, under 10K chars)
2. Call OpenAI GPT-3.5-turbo with structured prompt
3. Handle API errors gracefully (quota, rate limits, network)
4. Return user-friendly error messages for common issues
5. Store generated summary in summary_text field

## Development Debugging

### Common Issues & Solutions
- **OpenAI Import Errors**: Ensure correct package versions in virtual env
- **Database Connection**: Check Supabase URL encoding for special characters
- **Authentication Failures**: Verify bcrypt hash generation and JWT secrets
- **Form Validation**: Check Pydantic schema matches frontend TypeScript types
- **CORS Issues**: Verify frontend URL in FastAPI CORS middleware

### Useful Debug Endpoints
- `GET /debug/db`: Check database connection and record counts
- `GET /debug/auth`: Test password hashing functionality
- `GET /health`: Basic server health check

### Testing Scripts Available
- `test_openai.py`: Comprehensive OpenAI integration test
- `test_auth.py`: Authentication flow testing  
- `test_endpoints.py`: API endpoint validation
- `test_password.py`: Password hashing verification