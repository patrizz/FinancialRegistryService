#!/usr/bin/env bash
echo "uploading if changed"
aws s3 sync /Users/patricekerremans/git/FinancialRegistryService/target/ s3://deployjar-ireland/ --exclude "*" --include "financial-registry-service-1.0-SNAPSHOT.jar"

#echo "creating iban-service-auth function"
#aws lambda create-function \
#--region eu-west-1 \
#--function-name 'iban-service-auth' \
#--code S3Bucket=deployjar-ireland,S3Key=financial-registry-service-1.0-SNAPSHOT.jar \
#--role 'arn:aws:iam::521480341421:role/OpenLabelsLambda' \
#--handler 'com.threeandahalfroses.aws.lambda.ServiceAuthLambdaHandler' \
#--runtime 'java8' \
#--memory-size 640

echo "setting code for iban-service-auth function"
aws lambda update-function-code \
--region eu-west-1 \
--function-name 'iban-service-auth' \
--s3-bucket deployjar-ireland \
--s3-key financial-registry-service-1.0-SNAPSHOT.jar

#echo "creating get-iban function"
#aws lambda create-function \
#--region eu-west-1 \
#--function-name 'get-iban' \
#--code S3Bucket=deployjar-ireland,S3Key=financial-registry-service-1.0-SNAPSHOT.jar \
#--role 'arn:aws:iam::521480341421:role/OpenLabelsLambda' \
#--handler 'com.threeandahalfroses.frs.lambda.IbanRedirecterLambda' \
#--runtime 'java8' \
#--memory-size 640

echo "setting code for get-iban function"
aws lambda update-function-code \
--region eu-west-1 \
--function-name 'get-iban' \
--s3-bucket deployjar-ireland \
--s3-key financial-registry-service-1.0-SNAPSHOT.jar

#aws apigateway import-rest-api \
#--region eu-west-1 \
#--body 'file:///Users/patricekerremans/git/FinancialRegistryService/src/main/resources/iban.json'

echo "updating api"
aws apigateway put-rest-api \
--region eu-west-1 \
--rest-api-id glozrhoqo9 \
--body 'file:///Users/patricekerremans/git/FinancialRegistryService/src/main/resources/iban.json'