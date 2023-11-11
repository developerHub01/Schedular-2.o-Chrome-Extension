chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.scheduleType === "oneTimeSchedule") handleAlarmsForOneTime();
  else if (message.scheduleType === "regularTimeSchedule")
    handleAlarmsForRegularTime();
  else {
    console.log(message.scheduleType);
  }
});

const handleAlarmsForOneTime = () => {
  chrome.storage.local.get("oneTimeSchedule").then((result) => {
    const scheduleList = result.oneTimeSchedule;

    if (!scheduleList) return;
    Object.keys(scheduleList).forEach((item) => {
      // To set the schedule first clearing all if it aleary sets then it will update
      chrome.alarms.clear(item + "-" + "oneTimeSchedule");
      const { taskDate, taskTime } = scheduleList[item];

      // get scheduled date
      const scheduledTime = new Date(`${taskDate}T${taskTime}:00`);

      // get current date
      const currentTime = new Date().getTime();
      console.log(currentTime);

      const delay = scheduledTime - currentTime;

      // if schedule day is earlier than current date
      if (delay <= 0) {
        delete scheduleList[item];
        chrome.storage.local.set({
          oneTimeSchedule: scheduleList,
        });
      } else {
        chrome.alarms.create(`${item}-oneTimeSchedule`, {
          when: currentTime + delay,
        });
      }
    });
  });
};
const handleAlarmsForRegularTime = () => {
  chrome.storage.local.get("regularTimeSchedule").then((result) => {
    const scheduleList = result.regularTimeSchedule;

    if (!scheduleList) return;
    Object.keys(scheduleList).forEach((item) => {
      console.log(scheduleList[item]);
      const { taskTime } = scheduleList[item];
      const [hours, minutes] = taskTime.split(":");
      console.log(hours, minutes);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      const currentTime = new Date();

      if (scheduledTime < currentTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      const timeGap = scheduledTime - currentTime;
      console.log(`${item}-regularTimeSchedule`);
      chrome.alarms.create(`${item}-regularTimeSchedule`, {
        when: Date.now() + timeGap,
        periodInMinutes: 24 * 60,
      });
    });
  });
};
chrome.alarms.onAlarm.addListener((alarm) => {
  const [id, scheduleType] = alarm?.name.split("-");
  console.log(id, scheduleType);
  chrome.storage.local.get(scheduleType).then((result) => {
    const schedules = result[scheduleType];
    console.log(schedules);
    const scheduleData = schedules[id];
    console.log(scheduleData);
    const notificationOptions = {
      type: "basic",
      title: scheduleData.taskTitle,
      message: scheduleData.taskDescription,
      iconUrl: "images/assets/128.png",
    };
    delete schedules[id];
    console.log(schedules);

    chrome.notifications.create("", notificationOptions);
    if (scheduleType === "oneTimeSchedule") {
      chrome.storage.local.set({ [scheduleType]: schedules });

      chrome.runtime.sendMessage({
        type: scheduleType,
      });
    }
  });
});
