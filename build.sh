#!/usr/bin/env bash
set -e

echo "==> Installing frontend dependencies..."
cd frontend
npm install

echo "==> Building frontend..."
npm run build

echo "==> Installing backend dependencies..."
cd ../backend
pip3 install -r requirements.txt

echo "==> Build complete."
