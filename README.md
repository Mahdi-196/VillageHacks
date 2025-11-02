# MedeSense

**Your AI-Powered Healthcare Companion with Infinite Memory And Real Data**

MedeSense is a HIPAA-compliant chatbot that remembers your exact medical information and provides personalized health insights based on your real medical records.

## What It Does

An intelligent health assistant that:
- **Remembers** your complete medical history
- **Analyzes** medication conflicts and interactions
- **Provides** personalized diet and lifestyle recommendations
- **Understands** your medical documents instantly
- **Protects** your privacy with HIPAA-compliant PHI stripping

## How It Works

1. **Upload** your medical documents (labs, prescriptions, records)
2. **Ask** questions in natural language
3. **Get** personalized answers based on YOUR data

**Example:**
*"What is my hemoglobin level from my lab?"*
→ *"Your hemoglobin level is 14.8 g/dL according to your uploaded medical records."*

## Privacy & Compliance

**HIPAA-Compliant Architecture:**
- Documents are **never** written to disk
- All sensitive data (PHI) is **automatically stripped** using AWS Textract + Comprehend
- De-identified data stored in **encrypted** memory system
- Each user's data is **completely isolated**

## Tech Stack

### Frontend
- **React** + **TypeScript** + **Vite**

### Backend
- **FastAPI** (Python 3.11)
- **AWS Lambda** (serverless)
- **PostgreSQL** (user authentication)
- **JWT** authentication

### AI & Memory
- **OpenAI GPT-4o-mini** (chat intelligence)
- **Supermemory API v4** (infinite memory RAG)
- Per-user document isolation with tagged storage

### Security & Compliance
- **AWS Textract** (OCR for medical documents)
- **AWS Comprehend Medical** (PHI detection & removal)
- **Dedicated compliance Lambda** (PHI stripping pipeline)

### Infrastructure
- **AWS CloudFront** (global CDN)
- **AWS API Gateway** (API routing)
- **AWS Lambda** (compute)
- **Render PostgreSQL** (database)

## Features

- **Document Upload** - PDFs, images (JPEG, PNG, TIFF)
- **OCR Processing** - Extract text from scanned documents
- **PHI Stripping** - Automatic removal of sensitive health data
- **Smart Search** - Find relevant info across all your documents
- **Context-Aware Chat** - AI answers using YOUR medical history
- **Medication Checking** - Identify potential drug interactions
- **Multi-User Support** - Complete data isolation per user

## Use Cases

- Check if a new medication conflicts with your current prescriptions
- Get diet recommendations based on your lab results
- Ask questions about specific values in your medical reports
- Understand complex medical documents in plain language
- Track changes in your health metrics over time

## Deployment

**Production URL:** [https://medesense.site](https://medesense.site)

### Architecture

![MedeSense AWS Architecture](https://mahdi-readme-images.s3.us-east-1.amazonaws.com/MedeSense_AWS++)


## Getting Started

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
OPENAI_API_KEY=sk-proj-...
SUPERMEMORY_API_KEY=sm_...
PHI_STRIPPER_LAMBDA_API_URL=https://...
SECRET_KEY=your-secret-key
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-api-url
```

## Project Structure

```
VillageHacks/
├── frontend/              # React TypeScript frontend
│   ├── src/
│   │   ├── pages/        # Chat, Landing pages
│   │   ├── components/   # Reusable UI components
│   │   └── services/     # API client
│   └── dist/             # Build output
│
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── core/        # Config, security
│   └── lambda_extracted/ # Lambda deployment package
│
└── compliance_lambda/    # PHI stripping Lambda (separate)
```

## API Endpoints

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/documents/upload-document` - Upload medical document
- `POST /api/chat` - Chat with AI about your health data
- `GET /api/debug/whoami` - Get current user info

## Security Features

- **Authentication:** JWT-based with secure token expiration
- **HIPAA Compliance:** Automatic PHI detection and removal
- **Data Encryption:** All data encrypted in transit and at rest
- **User Isolation:** Complete separation of user data
- **Safety Checks:** Input validation and content filtering

## Contributing

This project was built for VillageHacks 2025.

## License

MIT License

---

*Powered by Supermemory*
