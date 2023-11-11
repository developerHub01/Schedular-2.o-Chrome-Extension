chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.scheduleType === "oneTimeSchedule") {
    console.log(message.scheduleType);
    handleAlarmsForOneTime();
  } else if (message.scheduleType === "regularTimeSchedule") {
    console.log(message.scheduleType);
  } else {
    console.log(message.scheduleType);
  }
});

const handleAlarmsForOneTime = () => {
  chrome.storage.local.get("oneTimeSchedule").then((result) => {
    const scheduleList = result.oneTimeSchedule;
    console.log("===================");
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

      console.log(scheduleList[item]);

      // if schedule day is earlier than current date
      if (delay <= 0) {
        delete scheduleList[item];
        chrome.storage.local.set({
          oneTimeSchedule: scheduleList,
        });
      } else {
        chrome.alarms.create(item + "-" + "oneTimeSchedule", {
          when: currentTime + delay,
        });
      }
    });
  });
};
chrome.alarms.onAlarm.addListener((alarm) => {
  const [id, scheduleType] = alarm?.name.split("-");
  console.log(id, scheduleType);
  chrome.storage.local.get(scheduleType).then((result) => {
    const schedules = result[scheduleType];
    const scheduleData = schedules[id];
    const notificationOptions = {
      type: "basic",
      title: scheduleData.taskTitle,
      message: scheduleData.taskDescription,
      iconUrl: "images/assets/128.png",
    };
    delete schedules[id];
    console.log(schedules);
    chrome.storage.local.set({ [scheduleType]: schedules });
    chrome.notifications.create("", notificationOptions);

    chrome.runtime.sendMessage({
      type: scheduleType,
    });
  });
});
