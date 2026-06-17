#!/usr/bin/env bash
set -e

echo "==> Installing frontend dependencies..."
cd frontend
npm install

echo "==> Building frontend..."
npm run build

echo "==> Installing backend dependencies..."
cd ../backend
python3 -m ensurepip --upgrade
python3 -m pip install --break-system-packages -r requirements.txt

echo "==> Build complete."
