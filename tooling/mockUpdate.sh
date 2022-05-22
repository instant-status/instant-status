#!/usr/bin/env bash
# Available flags:
# [s] - Stack name, defaults to randomly generated
# [e] - Stack environment, defaults to 'dev'
# [n] - Number of other (non-chosen) servers to create, defaults to 1
# [v] - App Version, defaults to 'v1'
# e.g. mockUpdate.sh -s custom-name
# e.g. mockUpdate.sh -s custom-name -e prod -n 2 -v v1.1

STACK_NAME="$RANDOM-$RANDOM-$RANDOM"
STACK_ENVIRONMENT="dev"
OTHER_SERVERS_TO_CREATE=1
appVersion='v1'

while getopts 's:e:n:v:' flag; do
  case "${flag}" in
  s) STACK_NAME="${OPTARG}" ;;
  e) STACK_ENVIRONMENT="${OPTARG}" ;;
  n) OTHER_SERVERS_TO_CREATE="${OPTARG}" ;;
  v) appVersion="${OPTARG}" ;;
  *)
    echo 'Unsupported flag'
    ;;
  esac
done

ec2InstanceIdChosen="i-$RANDOM$RANDOM$RANDOM$RANDOM"
ec2InstanceIdOthers="i-$RANDOM$RANDOM$RANDOM$RANDOM"
while [[ "$OTHER_SERVERS_TO_CREATE" -gt 1 ]]
do
  ec2InstanceIdOthers+=" i-$RANDOM$RANDOM$RANDOM$RANDOM"
  OTHER_SERVERS_TO_CREATE=$(($OTHER_SERVERS_TO_CREATE - 1))
done

ec2InstanceIds="$ec2InstanceIdChosen $ec2InstanceIdOthers"
lastUpdateId=0
ec2Region='us-east-1'
ec2AZ='us-east-1a'
ec2UserDataStackLower=$(echo "$STACK_NAME" | tr '[:upper:]' '[:lower:]')

DEV_JWT='eyJ'
SERVER_JWT='eyJ'

function statusAPI_POSTDEV() {
  curl -s -X POST \
    http://localhost:3000/v2/"$1" \
    -H "Authorization: Bearer $DEV_JWT" \
    -H 'Content-Type: application/json' \
    --data-raw "$2"
}

function statusAPI_GET() {
  curl -s -X GET \
    http://localhost:3000/v2/"$1" \
    -H "Authorization: Bearer $SERVER_JWT" \
    -H 'Content-Type: application/json' \
    --data-raw "$2"
}

function statusAPI_POST() {
  curl -s -X POST \
    http://localhost:3000/v2/"$1" \
    -H "Authorization: Bearer $SERVER_JWT" \
    -H 'Content-Type: application/json' \
    --data-raw "$2"
}

# create stack
JSONData="{
  \"name\": $(jq -R <<<"$STACK_NAME"),
  \"update_app_to\": \"v1\",
  \"run_migrations\": false
}"
response=$(statusAPI_POSTDEV "stack" "$JSONData")
echo "$response" | jq -r .

# startup
JSONData="{
  \"stack_name\": $(jq -R <<<"$STACK_NAME")
}"
response=$(statusAPI_GET "stack/get-id" "$JSONData")
echo "$response" | jq -r .

stackId=$(echo "$response" | jq -r '."id"')

# # checkin (slim)
# JSONData="{
#   \"is_slim_check_in\": true,
#   \"server_id\": $(jq -R <<<"$ec2InstanceId"),
#   \"stack_id\": $(jq -R <<<"$stackId"),
#   \"last_update_id\": $(jq -R <<<"$lastUpdateId"),
#   \"server_disk_used_gb\": 10,
#   \"server_health_updated_at\": \"$(date '+%Y-%m-%dT%H:%M:%SZ')\",
#   \"server_health_code\": 1,
#   \"server_health_message\": \"Update in Progress, full healthcheck not performed.\"
# }"
# response=$(statusAPI_POST "check-in" "$JSONData")
# echo "$response" | jq -r .

# checkin
healthCode=0
healthMessage="All Good!"

for ec2InstanceId in $ec2InstanceIds
do
  JSONData="{
    \"server_id\": $(jq -R <<<"$ec2InstanceId"),
    \"stack_id\": $(jq -R <<<"$stackId"),
    \"last_update_id\": $(jq -R <<<"$lastUpdateId"),
    \"stack_region\": $(jq -R <<<"$ec2Region"),
    \"stack_environment\": $(jq -R <<<"$STACK_ENVIRONMENT"),
    \"stack_logo_url\": \"https://logo.clearbit.com/flamingtext.com\",
    \"stack_app_url\": \"https://example.org/login\",
    \"stack_logs_url\": $(jq -R <<<"https://$ec2Region.console.aws.amazon.com/cloudwatch/home?region=$ec2Region#logStream:group=app-$ec2UserDataStackLower"),
    \"server_public_ip\": \"1.1.1.1\",
    \"server_app_version\": $(jq -R <<<"$appVersion"),
    \"server_disk_used_gb\": 10,
    \"server_disk_total_gb\": 40,
    \"server_key_file_name\": \"key.pem\",
    \"server_availability_zone\": $(jq -R <<<"$ec2AZ"),
    \"server_type\": \"t3.medium\",
    \"server_health_updated_at\": \"$(date '+%Y-%m-%dT%H:%M:%SZ')\",
    \"server_health_code\": $healthCode,
    \"server_health_message\": $(jq -R <<<"$healthMessage"),
    \"server_update_progress\": 100
  }"
  response=$(statusAPI_POST "check-in" "$JSONData")
  echo "$response" | jq -r .

  updateId=$(echo "$response" | jq -r '."update_id"')

  ##### UPDATE STATUS #####
  JSONData="{
    \"update_id\": $(jq -R <<<"$updateId"),
    \"server_id\": $(jq -R <<<"$ec2InstanceId"),
    \"server_update_progress\": 5,
    \"server_update_stage\": \"election\",
    \"server_update_message\": \"Casting Vote...\"
  }"
  response=$(statusAPI_POST "update" "$JSONData")
  echo "$response" | jq -r .

  ##### UPDATE STATUS #####
  JSONData="{
    \"update_id\": $(jq -R <<<"$updateId"),
    \"server_id\": $(jq -R <<<"$ec2InstanceId"),
    \"server_update_progress\": 25,
    \"server_update_stage\": \"installation\",
    \"server_update_message\": \"Downloading Code...\"
  }"
  response=$(statusAPI_POST "update" "$JSONData")
  echo "$response" | jq -r .
done

for ec2InstanceId in $ec2InstanceIdOthers
do
  ##### UPDATE STATUS #####
  JSONData="{
    \"update_id\": $(jq -R <<<"$updateId"),
    \"server_id\": $(jq -R <<<"$ec2InstanceId"),
    \"server_update_progress\": 90,
    \"server_update_stage\": \"ready-to-switch\",
    \"server_update_message\": \"Waiting for Switch...\"
  }"
  response=$(statusAPI_POST "update" "$JSONData")
  echo "$response" | jq -r .
done

##### UPDATE STATUS #####
JSONData="{
  \"update_id\": $(jq -R <<<"$updateId"),
  \"server_id\": $(jq -R <<<"$ec2InstanceIdChosen"),
  \"server_update_progress\": 75,
  \"server_update_stage\": \"special\",
  \"server_update_message\": \"Running Special Tasks...\"
}"
response=$(statusAPI_POST "update" "$JSONData")
echo "$response" | jq -r .

##### UPDATE STATUS #####
JSONData="{
  \"update_id\": $(jq -R <<<"$updateId"),
  \"server_id\": $(jq -R <<<"$ec2InstanceId"),
  \"server_update_progress\": 90,
  \"server_update_stage\": \"ready-to-switch\",
  \"server_update_message\": \"Announcing Switch...\"
}"
response=$(statusAPI_POST "update" "$JSONData")
echo "$response" | jq -r .

for ec2InstanceId in $ec2InstanceIds
do
  ##### UPDATE STATUS #####
  JSONData="{
    \"update_id\": $(jq -R <<<"$updateId"),
    \"server_id\": $(jq -R <<<"$ec2InstanceId"),
    \"server_update_progress\": 99,
    \"server_update_stage\": \"special\",
    \"server_update_message\": \"Switching!\"
  }"
  response=$(statusAPI_POST "update" "$JSONData")
  echo "$response" | jq -r .

  ##### UPDATE STATUS #####
  JSONData="{
    \"update_id\": $(jq -R <<<"$updateId"),
    \"server_id\": $(jq -R <<<"$ec2InstanceId"),
    \"server_update_progress\": 100,
    \"server_update_stage\": \"finished\",
    \"server_update_message\": \"Update Finished!\"
  }"
  response=$(statusAPI_POST "update" "$JSONData")
  echo "$response" | jq -r .

  # checkin
  JSONData="{
    \"server_id\": $(jq -R <<<"$ec2InstanceId"),
    \"stack_id\": $(jq -R <<<"$stackId"),
    \"last_update_id\": $(jq -R <<<"$lastUpdateId"),
    \"stack_region\": $(jq -R <<<"$ec2Region"),
    \"stack_environment\": $(jq -R <<<"$STACK_ENVIRONMENT"),
    \"stack_logo_url\": \"https://logo.clearbit.com/flamingtext.com\",
    \"stack_app_url\": \"https://example.org/login\",
    \"stack_logs_url\": $(jq -R <<<"https://$ec2Region.console.aws.amazon.com/cloudwatch/home?region=$ec2Region#logStream:group=app-$ec2UserDataStackLower"),
    \"server_public_ip\": \"1.1.1.1\",
    \"server_app_version\": $(jq -R <<<"$appVersion"),
    \"server_disk_used_gb\": 10,
    \"server_disk_total_gb\": 40,
    \"server_key_file_name\": \"key.pem\",
    \"server_availability_zone\": $(jq -R <<<"$ec2AZ"),
    \"server_type\": \"t3.medium\",
    \"server_health_updated_at\": \"$(date '+%Y-%m-%dT%H:%M:%SZ')\",
    \"server_health_code\": $healthCode,
    \"server_health_message\": $(jq -R <<<"$healthMessage"),
    \"server_update_progress\": 100
  }"
  response=$(statusAPI_POST "check-in" "$JSONData")
  echo "$response" | jq -r .
done

echo "Finished mocking Stack '$STACK_NAME', with environment of '$STACK_ENVIRONMENT', '$OTHER_SERVERS_TO_CREATE' other (non-chosen) server(s), and app version '$appVersion'"
