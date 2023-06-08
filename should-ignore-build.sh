#!/bin/bash
echo "Checking if ${PROJECT_NAME} has affected changes..."

source "apps/${PROJECT_NAME}/dependencies.sh"

if [ -z ${DEPENDENCIES+x} ] || [ "${COMMIT_REF}" == "${CACHED_COMMIT_REF}" ]
then
  echo "Skipping check and building project..."
  exit 1
else
  echo "Comparing last cached commit ${CACHED_COMMIT_REF} with current commit ${COMMIT_REF}"
  git diff --quiet "${CACHED_COMMIT_REF}" "${COMMIT_REF}" ${DEPENDENCIES}
fi