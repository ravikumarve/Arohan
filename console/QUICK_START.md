# AROHAN Dashboard - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- AROHAN backend API running (optional for demo mode)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Navigate to Dashboard Directory**
   ```bash
   cd /media/matrix/DATA/opencode_projects/AROHAN/dashboard
   ```

2. **Install Dependencies** (if not already installed)
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Dashboard**
   - Local: http://localhost:3000
   - Network: http://192.168.0.179:3000

## 📱 Dashboard Overview

### Navigation
- **Sidebar**: 7 main tabs for different functions
- **Main Content**: Dynamic content based on selected tab
- **Responsive**: Works on desktop and tablet screens

### Tabs Overview

#### 1. Overview Tab
**Purpose**: System-wide monitoring and quick actions

**Features**:
- Real-time statistics (Total Sessions, Active Agents, Avg Score, Success Rate)
- System health status for all services
- Quick action buttons for testing

**Buttons**:
- **Live Status**: Refreshes all system metrics
- **Test IVR**: Initiates IVR call testing
- **Test WhatsApp**: Tests WhatsApp messaging
- **Test Agents**: Validates all AI agents
- **Run Diagnostics**: Executes system health check

#### 2. Agent Testing Tab
**Purpose**: Test and monitor AI agents

**Features**:
- Individual agent cards with status
- Success rate tracking
- Last run timestamps
- Configuration settings

**Agents**:
- **Proctor Agent**: Conducts adaptive voice interviews
- **Assessor Agent**: Analyzes transcripts and generates scorecards
- **Matchmaker Agent**: Matches candidates to job requisitions

**Buttons**:
- **Test Agent**: Tests individual agent functionality

#### 3. Sessions Tab
**Purpose**: View and manage interview sessions

**Features**:
- Session listing with candidate details
- Status tracking (completed, in_progress, failed)
- Score display for completed sessions
- Duration and date information

**Buttons**:
- **New Session**: Creates a new interview session
- **View**: Opens detailed session information

#### 4. Integrations Tab
**Purpose**: Test and monitor external service integrations

**Features**:
- Integration status for all services
- Last sync timestamps
- Connection health monitoring

**Integrations**:
- **Twilio**: IVR & SMS services
- **Meta WhatsApp**: Messaging platform
- **Bhashini**: Speech-to-Text (Indian languages)
- **OpenAI**: AI services (Whisper fallback)
- **Pinecone**: Vector database for trait scoring

**Buttons**:
- **Test Connection**: Validates integration connectivity

#### 5. Scorecards Tab
**Purpose**: View AI-generated candidate scorecards

**Features**:
- Recent scorecard listing
- Detailed assessment metrics
- AI-powered recommendations

**Note**: Currently shows placeholder; will be populated after backend integration

#### 6. Monitoring Tab
**Purpose**: Real-time system monitoring

**Features**:
- Performance metrics charts
- Resource usage (CPU, Memory, Network)
- Historical data visualization

**Note**: Currently shows placeholder; will be populated after Prometheus integration

#### 7. Settings Tab
**Purpose**: Configure system settings

**Features**:
- API configuration
- Notification settings
- Security settings

**Note**: Currently shows placeholder; will be functional after backend integration

## 🎯 Common Workflows

### Testing a New Candidate

1. **Navigate to Sessions Tab**
2. **Click "New Session" button**
3. **Enter candidate details** (backend integration required)
4. **Start interview** (IVR or WhatsApp)
5. **Monitor progress** in Sessions tab
6. **View scorecard** in Scorecards tab (after completion)

### Testing Agent Functionality

1. **Navigate to Agent Testing Tab**
2. **Select agent to test** (Proctor, Assessor, or Matchmaker)
3. **Click "Test Agent" button**
4. **Wait for test completion** (loading indicator)
5. **View results** in success alert

### Verifying Integrations

1. **Navigate to Integrations Tab**
2. **Select integration to test**
3. **Click "Test Connection" button**
4. **Wait for connection test** (loading indicator)
5. **View status** in success alert

### Monitoring System Health

1. **Navigate to Overview Tab**
2. **Review system health section**
3. **Check all service statuses**
4. **Click "Live Status"** to refresh
5. **Review quick actions** if issues detected

## 🔧 Advanced Usage

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file in the dashboard directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_WEBSOCKET=true
NEXT_PUBLIC_ENABLE_REALTIME=true
```

### Custom Configuration

Modify `dashboard/src/app/page.tsx` to customize:
- Agent configurations
- Integration settings
- Dashboard layout
- Color schemes

## 🐛 Troubleshooting

### Dashboard Not Loading

**Problem**: Dashboard shows blank screen or errors

**Solutions**:
1. Check if Node.js is installed: `node --version`
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Check port availability: `lsof -i :3000`

### Buttons Not Responding

**Problem**: Clicking buttons doesn't trigger any action

**Solutions**:
1. Check browser console for errors (F12)
2. Verify JavaScript is enabled
3. Clear browser cache and cookies
4. Try different browser

### Loading States Stuck

**Problem**: Button shows loading but never completes

**Solutions**:
1. Refresh the page
2. Check network connection
3. Verify backend API is accessible
4. Check browser console for API errors

### Port Already in Use

**Problem**: Error "Port 3000 is already in use"

**Solutions**:
1. Kill process using port 3000: `lsof -ti :3000 | xargs kill`
2. Use different port: `npm run dev -- -p 3001`
3. Check what's using port: `lsof -i :3000`

## 📊 Performance Tips

### For Development
- Use Turbopack (default in Next.js 16)
- Enable Fast Refresh
- Keep browser DevTools open for debugging

### For Production
- Enable production build: `npm run build`
- Use CDN for static assets
- Enable gzip compression
- Implement caching strategy

## 🔒 Security Considerations

### Current State
- **Authentication**: Not implemented (demo mode)
- **Authorization**: Not implemented (demo mode)
- **Data Encryption**: Not implemented (demo mode)

### Production Requirements
- Implement JWT authentication
- Add role-based access control (RBAC)
- Enable HTTPS/TLS
- Add rate limiting
- Implement CSRF protection
- Sanitize user inputs

## 📈 Next Steps

### Immediate
1. ✅ Test all button functionality
2. ✅ Verify loading states work correctly
3. ✅ Check responsive design on different screen sizes
4. ⏳ Connect to FastAPI backend
5. ⏳ Implement real-time updates

### Short-term
1. Replace mock data with real API calls
2. Add authentication/authorization
3. Implement error handling
4. Add toast notifications
5. Enable data persistence

### Long-term
1. Add advanced filtering and search
2. Implement export functionality
3. Add custom dashboards
4. Enable user preferences
5. Add audit logging

## 🎓 Learning Resources

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Turbopack Guide](https://nextjs.org/docs/architecture/turbopack)
- [App Router](https://nextjs.org/docs/app)

### React Documentation
- [React Docs](https://react.dev)
- [React Hooks](https://react.dev/reference/react)
- [State Management](https://react.dev/learn/state-a-components-memory)

### UI Libraries
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)

## 💡 Tips and Tricks

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Quick search (when implemented)
- `Ctrl/Cmd + /`: Show keyboard shortcuts (when implemented)

### Browser DevTools
- `F12` or `Ctrl/Cmd + Shift + I`: Open DevTools
- `Ctrl/Cmd + Shift + C`: Element inspector
- `Ctrl/Cmd + Shift + J`: Console

### Useful Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List installed packages
npm list

# Update packages
npm update

# Audit for vulnerabilities
npm audit
```

## 🆘 Support

### Getting Help
- Check the [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- Review [AGENTS.md](../AGENTS.md) for project context
- Check browser console for errors
- Review server logs in `/tmp/dashboard.log`

### Reporting Issues
When reporting issues, include:
1. Browser and version
2. Operating system
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Server logs (if applicable)

## 🎉 Conclusion

The AROHAN Dashboard is now ready for testing and development. All buttons are functional with proper loading states and user feedback. The next phase involves connecting to the FastAPI backend for real data operations.

Happy testing! 🚀
