chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.scheduleType === "oneTimeSchedule") handleAlarmsForOneTime();
  else if (message.scheduleType === "regularTimeSchedule")
    handleAlarmsForRegularTime();
  else handleAlarmsForFrequentlyTime();
});

const handleAlarmsForOneTime = () => {
  chrome.storage.local.get("oneTimeSchedule").then((result) => {
    const scheduleList = result.oneTimeSchedule;

    if (!scheduleList) return;
    Object.keys(scheduleList).forEach((item) => {
      chrome.alarms.clear(`${item}-oneTimeSchedule`);
      const { taskDate, taskTime } = scheduleList[item];

      const scheduledTime = new Date(`${taskDate}T${taskTime}:00`);

      const currentTime = new Date().getTime();
      const delay = scheduledTime - currentTime;

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
      const { taskTime } = scheduleList[item];
      const [hours, minutes] = taskTime.split(":");
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      const currentTime = new Date();

      if (scheduledTime < currentTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      const timeGap = scheduledTime - currentTime;
      chrome.alarms.create(`${item}-regularTimeSchedule`, {
        when: Date.now() + timeGap,
        periodInMinutes: 24 * 60,
      });
    });
  });
};
const handleAlarmsForFrequentlyTime = () => {
  chrome.storage.local.get("frequentlyTimeSchedule").then((result) => {
    const scheduleList = result.frequentlyTimeSchedule;

    if (!scheduleList) return;
    Object.keys(scheduleList).forEach((item) => {
      const schedule = scheduleList[item];
      const { dayAndTime } = schedule;

      // It is need to be clear because someting after updating it might be reamin some alarm that set previously but rececntly it is unselected so so that alarm should be clear
      for (let i = 0; i < 7; i++)
        chrome.alarms.clear(`${i}_${item}-frequentlyTimeSchedule`);

      dayAndTime.forEach((eachDayAndTime) => {
        const { day, time } = eachDayAndTime;

        const [hours, minutes] = time.split(":");
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        scheduledTime.setDate(
          scheduledTime.getDate() + ((+day - scheduledTime.getDay() + 7) % 7)
        );
        const currentTime = new Date();

        const timeGap = scheduledTime - currentTime;

        if (timeGap > 0)
          chrome.alarms.create(`${day}_${item}-frequentlyTimeSchedule`, {
            when: Date.now() + timeGap,
            periodInMinutes: 7 * 24 * 60,
          });
      });
    });
  });
};
chrome.alarms.onAlarm.addListener((alarm) => {
  let [id, scheduleType] = alarm?.name.split("-");

  if (scheduleType === "oneTimeSchedule")
    handleNotificationTriggerOneTime(id, scheduleType);
  else handleNotificationTriggerRegularTimeAndFrequentlyTime(id, scheduleType);
});
const handleNotificationTriggerOneTime = (id, scheduleType) => {
  chrome.storage.local.get(scheduleType).then((result) => {
    const schedules = result[scheduleType];
    const scheduleData = schedules[id];

    notification(scheduleData.taskTitle, scheduleData.taskDescription);
    delete schedules[id];

    chrome.storage.local.set({ [scheduleType]: schedules });

    chrome.runtime.sendMessage({
      type: scheduleType,
    });
  });
};
const handleNotificationTriggerRegularTimeAndFrequentlyTime = (
  id,
  scheduleType
) => {
  if (scheduleType === "frequentlyTimeSchedule") id = id.split("_")[1];
  chrome.storage.local.get(scheduleType).then((result) => {
    const schedules = result[scheduleType];
    const scheduleData = schedules[id];

    notification(scheduleData.taskTitle, scheduleData.taskDescription);
  });
};

const notification = (title, description) => {
  const notificationOptions = {
    type: "basic",
    title: title,
    message: description,
    iconUrl: "images/assets/128.png",
  };

  chrome.notifications.create("", notificationOptions);
};
