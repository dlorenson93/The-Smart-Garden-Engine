#!/bin/bash
# Simple script to run npm install in both backend and frontend for CI/CD
set -e

cd "$(dirname "$0")"

npm install
npm install --workspace=backend
npm install --workspace=frontend
