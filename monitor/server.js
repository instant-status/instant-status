import axios from "axios";
import { execSync } from "child_process";
import { APP_CONFIG } from "../config";

const processStartDate = new Date();
console.log(`Time right now: ${processStartDate}`);

const secondValueToRunOn = 33;
const secondsToWait = (
  (secondValueToRunOn - processStartDate.getSeconds()) < 0
    ? (60 - processStartDate.getSeconds()) + secondValueToRunOn
    : secondValueToRunOn - processStartDate.getSeconds()
);
const healthAlertMemory = {};

/*
For example, if the first alert was send at 00[h]:00[m], subsequent ones would be on:
00[h]:15[m], 00[h]:30[m], and so on if the value here is '15'[number].

Note: If the alert is not identical, the cooldown is skipped.
See 'checkAlertPreconditions'[function].
*/
const healthAlertCooldownMinutes = 15;

/*
The number of consecutive health check truancies required before considering a instance truant
*/
const truancyThreshold = 2;

/*
The number of consecutive health check reports required before considering
a previously truant instance no longer truant.
*/
const attendanceThreshold = 3;

console.log(`Waiting ${secondsToWait} seconds for first-run...`);
// execSync(`sleep ${secondsToWait}`);

const checkHealth = async () => {
  let timeNow = new Date();
  console.log(`Time now is: ${timeNow}`);
  const url = `http://127.0.0.1:3000/instances?groupBy=stackName`
  const config = {
    headers: {
      'Authorization': `Bearer ${APP_CONFIG.BEARER_TOKEN}`
    }
  };
  const res = await axios.get(url, config);
  const stacks = Object.entries(res.data);
  if (stacks.length > 0) {
    stacks.forEach(stack => {
      console.log(`Checking data for '${stack[0]}'`);
      stack[1].forEach(instance => {
        let instanceHasWarningHealthIssues = false;
        let instanceHasEmergencyHealthIssues = false;
        let instanceHasNotReportedHealth = false;

        if (typeof (instance.instanceLastHealthyAt) !== "undefined") {
          const instanceTime = new Date(instance.instanceLastHealthyAt);
          if (
            `${instanceTime.getDay()}${instanceTime.getHours()}${instanceTime.getMinutes()}`
            !=
            `${timeNow.getDay()}${timeNow.getHours()}${timeNow.getMinutes()}`
          ) {
            instanceHasNotReportedHealth = true;
          }
        }

        if (typeof (instance.instanceHealthCode) !== "undefined") {
          if (typeof (healthAlertMemory[instance.instanceID]) == "undefined") {
            healthAlertMemory[instance.instanceID] = {};
          }
          switch (instance.instanceHealthCode) {
            case 8:
              instanceHasEmergencyHealthIssues = true;
              break;
            case 7:
              instanceHasWarningHealthIssues = true;
              break;
            case 5:
              delete (healthAlertMemory[instance.instanceID].alertLastHealthCode)
              delete (healthAlertMemory[instance.instanceID].alertLastHealthMessage)
              delete (healthAlertMemory[instance.instanceID].alertLastSentAt)
          }
        }

        if (instanceHasNotReportedHealth) {
          console.log(`'${instance.instanceID}' has not reported its health...`);
          if (typeof (healthAlertMemory[instance.instanceID].truancyCount) == "undefined") {
            healthAlertMemory[instance.instanceID].truancyCount = 1;
          } else {
            healthAlertMemory[instance.instanceID].truancyCount++;
          }
          let newHealthCode = 5;
          (healthAlertMemory[instance.instanceID].truancyCount >= truancyThreshold) ? newHealthCode = 8 : newHealthCode = 7
          var payload = `{
            "instanceID": "${instance.instanceID}",
            "instanceHealthCode": ${newHealthCode},
            "instanceHealthMessage": "Instance has not reported health ${healthAlertMemory[instance.instanceID].truancyCount} consecutive time(s)."
          }`
          updateInstance(payload);
          instance.instanceHealthCode = newHealthCode
          instance.instanceHealthMessage = `Instance has not reported health ${healthAlertMemory[instance.instanceID].truancyCount} consecutive time(s).`
          if (healthAlertMemory[instance.instanceID].truancyCount == truancyThreshold) {
            if (checkAlertPreconditions(instance, timeNow)) {
              sendAlert(stack[0], instance, "emergency", ["slack"]);
              healthAlertMemory[instance.instanceID].alertLastHealthCode = instance.instanceHealthCode;
              healthAlertMemory[instance.instanceID].alertLastHealthMessage = instance.instanceHealthMessage;
              healthAlertMemory[instance.instanceID].alertLastSentAt = timeNow.toISOString();
            }
          }
        } else {
          if (instanceHasEmergencyHealthIssues) {
            if (checkAlertPreconditions(instance, timeNow)) {
              console.log(`'${instance.instanceID}' has reported emergency health issues, sending Alert`);
              // sendAlert(stack[0], instance, "warning", ["slack"]);
              healthAlertMemory[instance.instanceID].alertLastHealthCode = instance.instanceHealthCode;
              healthAlertMemory[instance.instanceID].alertLastHealthMessage = instance.instanceHealthMessage;
              healthAlertMemory[instance.instanceID].alertLastSentAt = timeNow.toISOString();
            } else {
              console.log(`'${instance.instanceID}' has reported emergency health issues, but not sending Alert because preconditions were not satisfied`);
            }
          }

          if (instanceHasWarningHealthIssues) {
            if (checkAlertPreconditions(instance, timeNow)) {
              console.log(`'${instance.instanceID}' reported warning health issues, sending Alert`);
              // sendAlert(stack[0], instance, "warning", ["slack"]);
              healthAlertMemory[instance.instanceID].alertLastHealthCode = instance.instanceHealthCode;
              healthAlertMemory[instance.instanceID].alertLastHealthMessage = instance.instanceHealthMessage;
              healthAlertMemory[instance.instanceID].alertLastSentAt = timeNow.toISOString();
            } else {
              console.log(`'${instance.instanceID}' reported warning health issues, but not sending Alert because preconditions were not satisfied`);
            }
          }
        }
      })
    })
  } else {
    console.log('No Stacks, so nothing to report on...')
  };

  var checkingMinuteInterval = (
    timeNow.getHours() > 8 && timeNow.getHours() < 18 ? 1 : 30
  );
  console.log(`Running again in ${checkingMinuteInterval} minute(s)`);
  setTimeout(checkHealth, 60 * checkingMinuteInterval * 1000);
}

const sendAlert = (stack, instance, type, platforms) => {
  if (platforms.indexOf("slack") > -1 && APP_CONFIG.SLACK_API_KEYS && typeof (APP_CONFIG.SLACK_API_KEYS[type]) !== "undefined") {
    const url = `https://hooks.slack.com/services/${APP_CONFIG.SLACK_API_KEYS[type]}`;
    const errorMessage = instance.instanceHealthMessage || "No Health Message was provided, please check this server manually!"
    const color = (
      (type === "warning")
        ? "fcaf17"
        : "ee2f01"
    );
    const data = `{
      "icon_emoji": ":warning:",
      "username": "Curatr ( ${stack.toUpperCase()} ) ${type.toUpperCase()}",
      "text": "*Affects This Server: *\`${instance.instancePublicIP}\` | \`${instance.instanceID}\`",
      "attachments": [
        {
        "title": "App URL",
        "text": "${instance.stackAppUrl}",
        "color": "149cce"
        },
        {
        "title": "Message",
        "text": "\`\`\`${errorMessage}\`\`\`",
        "color": "${color}"
        }
      ]
    }`;
    axios.post(url, data);
  }
}

const updateInstance = (payload) => {
  const url = `http://127.0.0.1:3000/instance/update`
  const config = {
    headers: {
      'Authorization': `Bearer ${APP_CONFIG.BEARER_TOKEN}`,
      'Content-Type': `application/json`
    }
  };
  const data = payload;
  axios.patch(url, data, config);
}

const checkAlertPreconditions = (instance, timeNow) => {
  let alertShouldBeSent = false;
  if (
    typeof (healthAlertMemory[instance.instanceID].alertLastSentAt) == "undefined" || typeof (healthAlertMemory[instance.instanceID].alertLastHealthCode) == "undefined" || typeof (healthAlertMemory[instance.instanceID].alertLastHealthMessage) == "undefined"
    ||
    Math.floor(((Math.abs(timeNow - new Date(healthAlertMemory[instance.instanceID].alertLastSentAt))) / 1000) / 60) >= healthAlertCooldownMinutes
    ||
    instance.instanceHealthCode != healthAlertMemory[instance.instanceID].alertLastHealthCode
    ||
    instance.instanceHealthMessage != healthAlertMemory[instance.instanceID].alertLastHealthMessage
  ) {
    alertShouldBeSent = true;
  }
  return alertShouldBeSent;
}

setTimeout(checkHealth);
