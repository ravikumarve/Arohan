#!/bin/bash

# AROHAN Console - Internal Operations Center Management Script

case "$1" in
    start)
        echo "🚀 Starting AROHAN Console..."
        cd /media/matrix/DATA/opencode_projects/DONE/AROHAN/console
        mkdir -p logs
        nohup npm run dev > logs/server.log 2>&1 &
        echo $! > logs/server.pid
        echo "✅ Console started! PID: $(cat logs/server.pid)"
        echo "🌐 Access at: http://localhost:3000"
        echo "📋 Logs: tail -f /media/matrix/DATA/opencode_projects/DONE/AROHAN/console/logs/server.log"
        ;;

    stop)
        echo "🛑 Stopping AROHAN Console..."
        if [ -f /media/matrix/DATA/opencode_projects/DONE/AROHAN/console/logs/server.pid ]; then
            pid=$(cat /media/matrix/DATA/opencode_projects/DONE/AROHAN/console/logs/server.pid)
            kill $pid 2>/dev/null
            rm /media/matrix/DATA/opencode_projects/DONE/AROHAN/console/logs/server.pid
            echo "✅ Console stopped (PID: $pid)"
        else
            echo "⚠️  No server PID found. Trying to find process..."
            pkill -f "next dev"
            echo "✅ Killed all Next.js dev processes"
        fi
        ;;

    restart)
        echo "🔄 Restarting AROHAN Console..."
        $0 stop
        sleep 2
        $0 start
        ;;

    status)
        if [ -f /media/matrix/DATA/opencode_projects/DONE/AROHAN/console/logs/server.pid ]; then
            pid=$(cat /media/matrix/DATA/opencode_projects/DONE/AROHAN/console/logs/server.pid)
            if ps -p $pid > /dev/null 2>&1; then
                echo "✅ Console is running (PID: $pid)"
                echo "🌐 Access at: http://localhost:3000"
            else
                echo "❌ Console PID exists but process is not running"
                rm /media/matrix/DATA/opencode_projects/DONE/AROHAN/console/logs/server.pid
            fi
        else
            echo "❌ Console is not running"
        fi
        ;;

    logs)
        echo "📋 Following console logs..."
        tail -f /media/matrix/DATA/opencode_projects/DONE/AROHAN/console/logs/server.log
        ;;

    build)
        echo "🔨 Building AROHAN Console for production..."
        cd /media/matrix/DATA/opencode_projects/DONE/AROHAN/console
        npm run build
        echo "✅ Build complete!"
        ;;

    clean)
        echo "🧹 Cleaning build artifacts and cache..."
        cd /media/matrix/DATA/opencode_projects/DONE/AROHAN/console
        rm -rf .next logs
        echo "✅ Clean complete!"
        ;;

    *)
        echo "AROHAN Console - Internal Operations Center"
        echo ""
        echo "Usage: ./console.sh {command}"
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
        echo "  ./console.sh start"
        echo "  ./console.sh logs"
        echo "  ./console.sh build"
        ;;
esac
