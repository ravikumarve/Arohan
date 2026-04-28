#!/bin/bash

# AROHAN Landing Page - Development Server Management Script

case "$1" in
    start)
        echo "🚀 Starting AROHAN Landing Page development server..."
        cd frontend
        mkdir -p logs
        nohup npm run dev > logs/server.log 2>&1 &
        echo $! > logs/server.pid
        echo "✅ Server started! PID: $(cat logs/server.pid)"
        echo "🌐 Access at: http://localhost:3000"
        echo "📋 Logs: tail -f frontend/logs/server.log"
        ;;
    
    stop)
        echo "🛑 Stopping AROHAN Landing Page development server..."
        if [ -f frontend/logs/server.pid ]; then
            pid=$(cat frontend/logs/server.pid)
            kill $pid 2>/dev/null
            rm frontend/logs/server.pid
            echo "✅ Server stopped (PID: $pid)"
        else
            echo "⚠️  No server PID found. Trying to find process..."
            pkill -f "next dev"
            echo "✅ Killed all Next.js dev processes"
        fi
        ;;
    
    restart)
        echo "🔄 Restarting AROHAN Landing Page development server..."
        $0 stop
        sleep 2
        $0 start
        ;;
    
    status)
        if [ -f frontend/logs/server.pid ]; then
            pid=$(cat frontend/logs/server.pid)
            if ps -p $pid > /dev/null 2>&1; then
                echo "✅ Server is running (PID: $pid)"
                echo "🌐 Access at: http://localhost:3000"
            else
                echo "❌ Server PID exists but process is not running"
                rm frontend/logs/server.pid
            fi
        else
            echo "❌ Server is not running"
        fi
        ;;
    
    logs)
        echo "📋 Following server logs..."
        tail -f frontend/logs/server.log
        ;;
    
    build)
        echo "🔨 Building AROHAN Landing Page for production..."
        cd frontend
        npm run build
        echo "✅ Build complete!"
        ;;
    
    clean)
        echo "🧹 Cleaning build artifacts and cache..."
        cd frontend
        rm -rf .next logs
        echo "✅ Clean complete!"
        ;;
    
    *)
        echo "AROHAN Landing Page - Development Server Management"
        echo ""
        echo "Usage: ./landing-page.sh {command}"
        echo ""
        echo "Commands:"
        echo "  start    - Start development server"
        echo "  stop     - Stop development server"
        echo "  restart  - Restart development server"
        echo "  status   - Check server status"
        echo "  logs     - Follow server logs"
        echo "  build    - Build for production"
        echo "  clean    - Clean build artifacts"
        echo ""
        echo "Examples:"
        echo "  ./landing-page.sh start"
        echo "  ./landing-page.sh logs"
        echo "  ./landing-page.sh build"
        ;;
esac
