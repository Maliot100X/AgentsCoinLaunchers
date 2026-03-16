#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing web package dependencies..."
cd packages/web
npm install

echo "Building web package..."
npm run build

echo "Build complete!"
