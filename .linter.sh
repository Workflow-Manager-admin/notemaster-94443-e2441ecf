#!/bin/bash
cd /home/kavia/workspace/code-generation/notemaster-94443-e2441ecf/notes_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

