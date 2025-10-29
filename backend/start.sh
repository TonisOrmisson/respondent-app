#!/bin/bash

echo "🚀 Starting SurveyApp Backend Server..."
echo "📍 API will be available at: http://localhost:8088"
echo "📁 Working directory: $(pwd)"
echo ""

# Create storage directories if they don't exist
mkdir -p storage/sessions
mkdir -p storage

# Set proper permissions
chmod 755 storage/
chmod 755 storage/sessions/

echo "✅ Storage directories ready"

# Install dependencies if composer.lock doesn't exist
if [ ! -f "composer.lock" ]; then
    echo "📦 Installing PHP dependencies..."
    composer install
fi

echo "🔥 Starting PHP development server on port 8088..."
echo "💡 Press Ctrl+C to stop the server"
echo ""

# Start the PHP development server
php -S localhost:8088 -t public public/index.php
