#!/bin/bash
# Safe Cache Clear Script for Next.js
# Prevents webpack state mismatch by ensuring proper restart procedure

set -e  # Exit on error

echo "🔍 Checking for running Next.js dev server..."

# Check if Next.js dev server is running
if pgrep -f "next dev" > /dev/null; then
    echo "⚠️  WARNING: Next.js dev server is currently running!"
    echo ""
    echo "To safely clear cache:"
    echo "1. Stop the dev server (Ctrl+C in the terminal where 'npm run dev' is running)"
    echo "2. Then run this script again"
    echo ""
    read -p "Do you want to kill the dev server process? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted. Please stop the dev server manually first."
        exit 1
    fi
    echo "🛑 Stopping dev server..."
    pkill -f "next dev" || echo "No dev server process found"
    sleep 2  # Wait for process to fully stop
fi

echo "🧹 Clearing Next.js cache (.next directory)..."
rm -rf .next
echo "✅ Cache cleared successfully!"

echo ""
echo "✅ Next steps:"
echo "   1. Run 'npm run dev' to start the dev server"
echo "   2. Verify routes work correctly (check for 'GET / 200' in terminal)"
echo "   3. Test the application in browser"
echo ""
echo "💡 Tip: Never clear cache while dev server is running to avoid webpack state mismatch"

