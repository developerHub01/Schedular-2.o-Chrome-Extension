chrome.storage.onChanged.addListener((changes, areaName) => {
  const scheduleType = Object.keys(changes)[0];
  if (scheduleType === "oneTimeSchedule") handleAlarmsForOneTime();
  else if (scheduleType === "regularTimeSchedule") handleAlarmsForRegularTime();
  else handleAlarmsForFrequentlyTime();
});

const handleAlarmsForOneTime = () => {
  chrome.storage.local.get("oneTimeSchedule").then((result) => {
    const scheduleList = result.oneTimeSchedule;

    if (!scheduleList) return;
    Object.keys(scheduleList).forEach((item) => {
      chrome.alarms.clear(`${item}-oneTimeSchedule`);

      if (!scheduleList[item]) return;

      const { taskDate, taskTime } = scheduleList[item];

      const scheduledTime = new Date(`${taskDate}T${taskTime}:00`);

      const currentTime = new Date().getTime();
      const timeGap = scheduledTime - currentTime;

      if (timeGap <= 0) {
        delete scheduleList[item];
        chrome.storage.local.set({
          oneTimeSchedule: scheduleList,
        });
      } else {
        chrome.alarms.create(`${item}-oneTimeSchedule`, {
          when: currentTime + timeGap,
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
      chrome.alarms.clear(`${item}-regularTimeSchedule`);

      if (!scheduleList[item]) return;

      const { taskTime } = scheduleList[item];
      const [hours, minutes] = taskTime.split(":");
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      const currentTime = new Date();

      if (scheduledTime < currentTime)
        scheduledTime.setDate(scheduledTime.getDate() + 1);
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
      if (!scheduleList[item]) return;
      const { dayAndTime } = scheduleList[item];

      // It is need to be clear because someting after updating it might be reamin some alarm that set previously but rececntly it is unselected so so that alarm should be clear
      for (let i = 0; i < 7; i++)
        chrome.alarms.clear(`${i}_${item}-frequentlyTimeSchedule`);

      dayAndTime.forEach((eachDayAndTime) => {
        if (!eachDayAndTime) return;

        const { day, time } = eachDayAndTime;

        const [hours, minutes] = time.split(":");
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        scheduledTime.setDate(
          scheduledTime.getDate() + ((+day - scheduledTime.getDay() + 7) % 7)
        );
        const currentTime = new Date();

        const timeGap = scheduledTime - currentTime;

        if (timeGap >= 0)
          chrome.alarms.create(`${day}_${item}-frequentlyTimeSchedule`, {
            when: Date.now() + timeGap,
            periodInMinutes: 7 * 24 * 60,
          });
      });
    });
  });
};
chrome.alarms.onAlarm.addListener((alarm) => {
  let [id, scheduleType] = alarm?.name?.split("-");

  if (scheduleType === "oneTimeSchedule")
    handleNotificationTriggerOneTime(id, scheduleType);
  else handleNotificationTriggerRegularTimeAndFrequentlyTime(id, scheduleType);
});
const handleNotificationTriggerOneTime = (id, scheduleType) => {
  chrome.storage.local.get(scheduleType).then((result) => {
    const schedules = result[scheduleType];

    if (!schedules) return;

    const { taskTitle, taskDescription } = schedules[id];

    notification(taskTitle, taskDescription, scheduleType);
    delete schedules[id];

    chrome.storage.local.set({ [scheduleType]: schedules });
  });
};
const handleNotificationTriggerRegularTimeAndFrequentlyTime = (
  id,
  scheduleType
) => {
  if (scheduleType === "frequentlyTimeSchedule") id = id.split("_")[1];
  chrome.storage.local.get(scheduleType).then((result) => {
    const schedules = result[scheduleType];

    if (!schedules) return;

    const { taskTitle, taskDescription } = schedules[id];

    notification(taskTitle, taskDescription, scheduleType);
  });
};

const notification = (title, description, scheduleType) => {
  let bannerImg = "";
  if (scheduleType === "oneTimeSchedule")
    bannerImg = chrome.runtime.getURL("images/oneTimeBanner.png");
  else if (scheduleType === "regularTimeSchedule")
    bannerImg = chrome.runtime.getURL("images/regularTimeBanner.png");
  else bannerImg = chrome.runtime.getURL("images/frequentlyTimeBanner.png");
  const notificationOptions = {
    type: "image",
    title: title,
    message:
      description.length >= 30 ? description.slice(0, 30) + "..." : description,
    iconUrl: chrome.runtime.getURL("images/assets/128.png"),
    imageUrl: bannerImg,
    buttons: [
      {
        title: "Open",
      },
    ],
  };

  chrome.notifications.create(notificationOptions);
  chrome.notifications.onButtonClicked.addListener(() => {
    chrome.windows.create(
      {
        type: "popup",
        url: "message.html",
        width: 500,
        height: 600,
      },
      (window) => {
        chrome.storage.local.get("message").then((result) => {
          let messageData = result.message;
          messageData = {
            ...messageData,
            messageTitle: title,
            messageDescription: description,
          };
          chrome.storage.local.set({
            message: messageData,
          });
        });
      }
    );
  });
};
