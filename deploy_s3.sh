#!/usr/bin/env bash

echo "uploading logon fragment for 310.be"
aws s3 sync /Users/patricekerremans/git/FinancialRegistryService/src/main/resources/s3/ s3://thewearablebank.com/be/310/ --acl public-read --exclude ".DS_Store"

