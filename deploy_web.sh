#!/usr/bin/env bash

echo "uploading if changed"
aws s3 sync /Users/patricekerremans/git/FinancialRegistryService/src/main/resources/website/ s3://www.thewearablebank.com/ --region eu-central-1 --acl public-read --exclude ".DS_Store"

