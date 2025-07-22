# JSON Response Generator v2.0 - Go + Next.js Edition

A modern, high-performance solution for generating and sending JSON responses to Indonesian customs/import API endpoints. Built with **Next.js frontend** and **Go API backend** for optimal performance, scalability, and user experience.

## ✨ Features

### 🌐 Modern Web Interface (Next.js)
- **React-based dashboard** with responsive Tailwind CSS design
- **TypeScript** for type safety and better development experience
- **Step-by-step wizard forms** with real-time validation
- **Drag-and-drop Excel upload** with progress indicators
- **Syntax-highlighted JSON preview** with copy/download functionality
- **Real-time API status monitoring** and health checks
- **Mobile-first responsive design** optimized for all devices
- **Modern UI components** with smooth animations and transitions

### 🔧 Go API Backend
- **RESTful API** built with Gin framework and CORS support
- **High-performance Excel processing** with excelize library
- **Comprehensive data validation** using Go structs and validation tags
- **Multiple authentication methods** (API Key, Basic Auth, No Auth)
- **Structured logging** with logrus for production reliability
- **Template generation** with sample data and proper structure
- **Concurrent processing** with Goroutines for optimal performance

### 💻 Command Line Interface
- **Native Go binary** with fast startup and low memory usage
- **Batch processing capabilities** for automation and scripting
- **File I/O support** - save/load JSON data to/from files
- **Configuration management** via environment variables
- **Web server management** through CLI commands

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)
```bash
# Start all services
make up

# Or build and start
make up-build
```
This will start:
- Go API server on port 5001
- Next.js frontend on port 3000
- Nginx reverse proxy on port 80

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
# Go dependencies
make deps

# Frontend dependencies
cd frontend
npm install
cd ..
```

#### 2. Environment Configuration
```bash
# Copy environment template (if exists)
cp .env.example .env
# Edit .env with your API settings

# Frontend environment
echo "NEXT_PUBLIC_API_URL=http://localhost:5001" > frontend/.env.local
```

#### 3. Start Development Servers
```bash
# Terminal 1: Start Go API server
make run

# Terminal 2: Start frontend
cd frontend
npm run dev
```

#### 4. Access the Application
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 📦 Installation

### Prerequisites
- **Python 3.7+** for the API backend
- **Node.js 18+** for the Next.js frontend
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### System Requirements
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 500MB for dependencies
- **Network**: Internet connection for package installation

## 📖 Usage

### 🌐 Web Interface Workflow

1. **Start the application:**
   ```bash
   python start_nextjs.py
   # Choose option 1 (Start Development Servers)
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Choose your data input method:**
   - **Manual Input**: Step-by-step wizard forms
   - **Excel Upload**: Drag-and-drop file processing
   - **API Configuration**: Endpoint and authentication setup

4. **Generate and send JSON:**
   - Preview the generated JSON with syntax highlighting
   - Test your API connection
   - Send data with dry-run option first

### 📊 Excel Upload Workflow

1. **Download the Excel template** from the web interface
2. **Fill in your data** following the template structure:
   - **MainData sheet**: Document information, financial data
   - **Barang sheet**: Goods/items with specifications
   - **Entitas sheet**: Entities (importers, exporters, etc.)
   - **Kemasan sheet**: Packaging information
   - **Kontainer sheet**: Container details
   - **Dokumen sheet**: Supporting documents
   - **Pengangkut sheet**: Transportation details
3. **Upload the completed file** through the drag-and-drop interface
4. **Review and generate JSON** from the parsed data

### 💻 Command Line Interface

```bash
# Generate sample JSON
python main.py generate --pretty

# Test API connection
python main.py test --endpoint "https://your-api.com/endpoint"

# Send data with dry run
python main.py send --endpoint "https://your-api.com/endpoint" --dry-run

# Start web servers via CLI
python main.py web --port 5000 --debug

# View configuration
python main.py config
```

## 🏗️ Architecture

### Frontend (Next.js)
```
frontend/
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── page.tsx        # Dashboard
│   │   ├── manual-input/   # Manual input wizard
│   │   ├── excel-upload/   # Excel upload interface
│   │   └── api-config/     # API configuration
│   ├── components/         # Reusable React components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── modals/         # Modal components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and API client
│   └── types/              # TypeScript type definitions
├── package.json
├── tailwind.config.js
└── next.config.js
```

### Backend (Python API)
```
├── src/
│   ├── models.py           # Pydantic data models
│   ├── json_generator.py   # JSON generation service
│   ├── api_client.py       # API client service
│   ├── excel_handler.py    # Excel processing service
│   └── main.py            # CLI application
├── api_server.py          # Flask API server
├── requirements.txt       # Python dependencies
└── .env.example          # Environment template
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# API Configuration
API_ENDPOINT=https://your-api-endpoint.com/api/data
API_KEY=your-api-key-here
API_USERNAME=your-username
API_PASSWORD=your-password
API_TIMEOUT=30

# Server Configuration
API_PORT=5000
API_HOST=127.0.0.1
FLASK_SECRET_KEY=your-secret-key
FLASK_DEBUG=False

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

#### Frontend (frontend/.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🚀 Production Deployment

### Build for Production
```bash
python start_nextjs.py
# Choose option 5 (Build for Production)
```

### Start Production Servers
```bash
python start_nextjs.py
# Choose option 6 (Start Production Servers)
```

### Docker Deployment (Optional)
```bash
# Build images
docker build -t json-generator-api .
docker build -t json-generator-frontend ./frontend

# Run with docker-compose
docker-compose up -d
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
npm run type-check
npm run lint
```

### Backend Testing
```bash
python -m pytest tests/
python main.py test --endpoint "http://localhost:5000/api/health"
```

## 📚 API Documentation

### Health Check
```
GET /api/health
```

### Configuration
```
GET /api/config
```

### Excel Operations
```
POST /api/upload-excel
GET /api/download-template
```

### JSON Generation
```
POST /api/generate-json
GET /api/sample-data
```

### API Operations
```
POST /api/test-connection
POST /api/send-to-api
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 3000 and 5000
   npx kill-port 3000 5000
   ```

2. **Dependencies not found**
   ```bash
   # Reinstall dependencies
   pip install -r requirements.txt
   cd frontend && npm install
   ```

3. **CORS errors**
   - Ensure API server is running on port 5000
   - Check FRONTEND_URL in .env matches your frontend URL

4. **Excel upload fails**
   - Check file size (max 16MB)
   - Ensure file format is .xlsx or .xls
   - Verify all required sheets are present

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆕 What's New in v2.0

- **Complete frontend rewrite** with Next.js and TypeScript
- **Modern UI/UX** with Tailwind CSS and Framer Motion
- **Improved performance** with React 18 and Next.js 14
- **Better error handling** and user feedback
- **Enhanced mobile experience** with responsive design
- **Type safety** throughout the application
- **Modular architecture** for better maintainability
