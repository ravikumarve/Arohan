#!/bin/bash

# AROHAN Dashboard - Development Server Management Script

case "$1" in
    start)
        echo "🚀 Starting AROHAN Dashboard development server..."
        cd /media/matrix/DATA/opencode_projects/AROHAN/dashboard
        mkdir -p logs
        nohup npm run dev > logs/server.log 2>&1 &
        echo $! > logs/server.pid
        echo "✅ Dashboard started! PID: $(cat logs/server.pid)"
        echo "🌐 Access at: http://localhost:3000"
        echo "📋 Logs: tail -f /media/matrix/DATA/opencode_projects/AROHAN/dashboard/logs/server.log"
        ;;

    stop)
        echo "🛑 Stopping AROHAN Dashboard development server..."
        if [ -f /media/matrix/DATA/opencode_projects/AROHAN/dashboard/logs/server.pid ]; then
            pid=$(cat /media/matrix/DATA/opencode_projects/AROHAN/dashboard/logs/server.pid)
            kill $pid 2>/dev/null
            rm /media/matrix/DATA/opencode_projects/AROHAN/dashboard/logs/server.pid
            echo "✅ Dashboard stopped (PID: $pid)"
        else
            echo "⚠️  No server PID found. Trying to find process..."
            pkill -f "next dev"
            echo "✅ Killed all Next.js dev processes"
        fi
        ;;

    restart)
        echo "🔄 Restarting AROHAN Dashboard development server..."
        $0 stop
        sleep 2
        $0 start
        ;;

    status)
        if [ -f /media/matrix/DATA/opencode_projects/AROHAN/dashboard/logs/server.pid ]; then
            pid=$(cat /media/matrix/DATA/opencode_projects/AROHAN/dashboard/logs/server.pid)
            if ps -p $pid > /dev/null 2>&1; then
                echo "✅ Dashboard is running (PID: $pid)"
                echo "🌐 Access at: http://localhost:3000"
            else
                echo "❌ Dashboard PID exists but process is not running"
                rm /media/matrix/DATA/opencode_projects/AROHAN/dashboard/logs/server.pid
            fi
        else
            echo "❌ Dashboard is not running"
        fi
        ;;

    logs)
        echo "📋 Following dashboard logs..."
        tail -f /media/matrix/DATA/opencode_projects/AROHAN/dashboard/logs/server.log
        ;;

    build)
        echo "🔨 Building AROHAN Dashboard for production..."
        cd /media/matrix/DATA/opencode_projects/AROHAN/dashboard
        npm run build
        echo "✅ Build complete!"
        ;;

    clean)
        echo "🧹 Cleaning build artifacts and cache..."
        cd /media/matrix/DATA/opencode_projects/AROHAN/dashboard
        rm -rf .next logs
        echo "✅ Clean complete!"
        ;;

    *)
        echo "AROHAN Dashboard - Development Server Management"
        echo ""
        echo "Usage: ./dashboard.sh {command}"
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
        echo "  ./dashboard.sh start"
        echo "  ./dashboard.sh logs"
        echo "  ./dashboard.sh build"
        ;;
esac
