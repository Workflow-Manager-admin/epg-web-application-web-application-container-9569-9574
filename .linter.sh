#!/bin/bash
cd /home/kavia/workspace/epg-web-application-web-application-container-9569-9574/program_schedule_component
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

