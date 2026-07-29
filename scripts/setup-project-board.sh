#!/usr/bin/env bash
# =============================================================================
# GitHub Project Board & Issue Setup Script
# =============================================================================
# This script creates a GitHub Project V2 board and adds all issues to it.
#
# Prerequisites:
#   1. A GitHub PAT with 'project' scope (for users) OR
#      a classic token with 'project' scope
#   2. gh CLI installed and authenticated, OR use TOKEN env var
#
# Usage:
#   export GH_TOKEN=ghp_...    # optional, falls back to gh auth
#   bash setup-project-board.sh
# =============================================================================

set -euo pipefail

REPO="Waguy02/PHD-Research-Website"
OWNER="Waguy02"

echo "=== Creating Project Board: PhD Website Roadmap ==="

# Get owner ID via GraphQL
if [ -n "${GH_TOKEN:-}" ]; then
  AUTH_HEADER="Authorization: bearer $GH_TOKEN"
else
  echo "No GH_TOKEN set. Using gh auth..."
fi

# Create project board
echo "Creating project board..."
PROJECT_RESULT=$(gh api graphql -f query='
  mutation {
    createProjectV2(input: {
      ownerId: "U_kgDOAxT9IA"
      title: "PhD Website Roadmap"
    }) {
      projectV2 {
        id
        title
        url
        number
      }
    }
  }
')

echo "$PROJECT_RESULT"

# Extract project number
PROJECT_NUMBER=$(echo "$PROJECT_RESULT" | jq -r '.data.createProjectV2.projectV2.number')
PROJECT_ID=$(echo "$PROJECT_RESULT" | jq -r '.data.createProjectV2.projectV2.id')

if [ "$PROJECT_NUMBER" = "null" ] || [ -z "$PROJECT_NUMBER" ]; then
  echo "ERROR: Failed to create project board."
  echo "Make sure your token has 'project' scope."
  echo "Go to: https://github.com/settings/tokens"
  exit 1
fi

echo "Project created: https://github.com/$OWNER/projects/$PROJECT_NUMBER"
echo "Project ID: $PROJECT_ID"

echo ""
echo "=== Done ==="
echo ""
echo "Now go to https://github.com/$OWNER/projects/$PROJECT_NUMBER"
echo "and add the issues from the repo to the board manually."
echo "Issues are at: https://github.com/$REPO/issues"
