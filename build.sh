#!/usr/bin/env bash
set -e

echo "==> Installing frontend dependencies..."
cd frontend
npm install

echo "==> Building frontend..."
npm run build

echo "==> Installing pip..."
cd ../backend
curl -sS https://bootstrap.pypa.io/get-pip.py | python3

echo "==> Installing backend dependencies..."
python3 -m pip install -r requirements.txt

echo "==> Build complete."
