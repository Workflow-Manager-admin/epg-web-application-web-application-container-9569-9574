#!/bin/bash
cd "$(dirname "$0")/program_schedule_component" || exit 1
npm install --no-audit --no-fund
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

