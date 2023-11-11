const taskToast = Array.from(document.querySelectorAll(".taskToast"));
const tabContent = Array.from(document.querySelectorAll(".tabContent"));
const taskType = Array.from(document.querySelectorAll(".tabs input"));
const addTask = document.querySelector(".addTask");
const clearTask = document.querySelector(".clearTask");
const addItem = document.querySelector(".addItem");
const hidePopUpIcons = Array.from(document.querySelectorAll(".hidePopUpIcon"));
const addTaskItemForm = document.querySelector("#addTaskItemForm");
const typeSchedul = document.querySelector(".typeSchedul");
const taskTypeForm = Array.from(
  document.querySelectorAll("#addSchedulType input")
);
const addSchedulType = document.querySelector("#addSchedulType");
const dateSchedulePopUp = document.querySelector(".dateSchedulePopUp");
const daySchedulePopUp = document.querySelector(".daySchedulePopUp");
const timeSchedulePopUp = document.querySelector(".timeSchedulePopUp");
const timeScheduleType = document.querySelector("#timeScheduleType");
const dayWrapper = document.querySelectorAll(".dayWrapper");
const daySchedulType = document.querySelector("#daySchedulType");
const errorPopUp = document.querySelector(".errorPopUp");
const errorPopUpText = errorPopUp.querySelector(".errorText");
const successPopUp = document.querySelector(".successPopUp");
const successText = successPopUp.querySelector(".successText");
const popUp = Array.from(document.querySelectorAll(".popUp"));
const dateScheduleType = document.querySelector("#dateScheduleType");
const oneTimeInnerContent = document.querySelector(".oneTimeInnerContent");
const regularTimeInnerTabContent = document.querySelector(
  ".regularTimeInnerTabContent"
);
const frequentlyTimeInnerContent = document.querySelector(
  ".frequentlyTimeInnerContent"
);
const viewItem = document.querySelector(".viewItem");
const viewDetailsForm = document.querySelector("#viewDetailsForm");
const updateTitleDescription = document.querySelector(
  ".updateTitleDescription"
);
const updateTitleDescriptionForm = document.querySelector(
  "#updateTitleDescriptionForm"
);
const updateDateSchedule = document.querySelector(".updateDateSchedule");
const updateDateScheduleForm = document.querySelector(
  "#updateDateScheduleForm"
);
const updateTimeSchedule = document.querySelector(".updateTimeSchedule");
const updateTimeScheduleForm = document.querySelector(
  "#updateTimeScheduleForm"
);
const updateDaySchedule = document.querySelector(".updateDaySchedule");
const updateDayScheduleForm = document.querySelector("#updateDayScheduleForm");

let formData = {};
let updateFormData = {};
let updateDataTaskId = null;

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const allMonthName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getTimeFormate = (time) => {
  const [hour, min] = time.split(":");
  return [hour % 12 ? hour % 12 : 12, min, hour < 12 ? "AM" : "PM"];
};
const get24HoursFormate = (time) => {
  const [hours, min, amPm] = time;
  return [
    amPm === "AM" ? (+hours < 10 ? "0" + +hours : +hours) : +hours + 12,
    +min < 10 ? "0" + +min : +min,
  ];
};
const get12HoursFormate = (time) => {
  const [hours, min] = time.split(":");
  return [hours % 12, min, hours <= 12 ? "AM" : "PM"];
};
const getFormatedDateAndTime = (time, date) => {
  time = get24HoursFormate(get12HoursFormate(time));
  time = `${date}T${time.join(":")}:00`;
  return new Date(time);
};

const varifyTimeInput = (time, date) => {
  const currentTime = new Date();
  const givenTime = getFormatedDateAndTime(time, date);
  return givenTime > currentTime;
};

taskType.forEach((item, i) => {
  item.addEventListener("click", (e) => {
    taskType.forEach((item, i) => {
      item.parentElement.classList.remove("active");
      tabContent[i].classList.remove("active");
    });
    if (e.target.checked) {
      e.target.parentElement.classList.add("active");
      tabContent[i].classList.add("active");
    }
  });
});

// const ovserver = new IntersectionObserver(
//   (item) => {
//     item.forEach((task) => {
//       if (task.isIntersecting) {
//         task.target.classList.add("active");
//       } else {
//         task.target.classList.remove("active");
//       }
//     });
//   },
//   { threshold: 0.5 }
// );
// taskToast.forEach((item) => {
//   ovserver.observe(item);
// });

hidePopUpIcons.forEach((item) => {
  item.addEventListener("click", (e) => {
    item.parentElement.parentElement.classList.remove("active");
    popUp.forEach((element) => {
      if (element.parentElement.querySelector("form")) {
        element.parentElement.querySelector("form").reset();
      }
    });
  });
});

taskTypeForm.forEach((item, i) => {
  item.addEventListener("click", (e) => {
    taskTypeForm.forEach((item, i) => {
      if (item.checked) {
        e.target.parentElement.classList.add("active");
      } else {
        item.parentElement.classList.remove("active");
      }
    });
  });
});

dayWrapper.forEach((wrapper, i) => {
  let idPrefix = "add";
  if (i) idPrefix = "update";
  wrapper.innerHTML = "";
  days.forEach((item, i) => {
    wrapper.innerHTML += `
      <div class="dayInpBox">
        <input
          type="checkbox"
          name="scheduleDay"
          id="${idPrefix}_${item}"
          value="${i}"
        />
        <label for="${idPrefix}_${item}" class="flex justify-between item-center">
          <span class="pointCheck"></span>
          <h4 class="w-full">${item}</h4>
          <input
            type="time"
            name="taskTime"
            id="taskTime"
            class="w-full text-center"
          />
        </label>
      </div>
    `;
  });
});

const handleDayData = (target) => {
  const dayData = [];
  for (let i = 0; i < target.length - 1; i += 2) {
    if (!target[i].checked && !target[i + 1].value) {
      continue;
    } else if (target[i].checked && target[i + 1].value) {
      dayData.push({
        day: target[i].value,
        time: target[i + 1].value,
      });
    } else {
      errorPopUp.classList.add("active");
      errorPopUpText.innerHTML = `If you select any day then must select it's time`;
    }
  }
  return dayData;
};

const dateFormatter = (date) => {
  date = date.split("-");
  return `${date[2] < 10 ? "0" + +date[2] : +date[2]} ${
    allMonthName[+date[1] - 1]
  } ${date[0] < 10 ? "0" + +date[0] : +date[0]}`;
};
const timeFormatter = (time) => {
  time = time.split(":");

  time[2] = time[0] <= 12 ? "AM" : "PM";
  time[1] = time[1] < 10 ? "0" + +time[1] : time[1];
  time[0] =
    +time[0] <= 12
      ? +time[0] < 10
        ? "0" + +time[0]
        : +time[0]
      : time[0] - 12 < 10
      ? "0" + (time[0] - 12)
      : time[0] - 12;

  return `${time[0]}:${[time[1]]}:${time[2]}`;
};

const interactiveOption = () => {
  handleDeleteOption();
  handleViewDetailsOption();
  handleUpdateOption();
};
const handleNoItemAdded = (element) => {
  element.innerHTML = `<h3 class="emptyList">No Item Added</h3>`;
};
const generateOneTimeSchedule = () => {
  chrome.storage.local.get("oneTimeSchedule").then((result) => {
    const oneTimeScheduleList = result.oneTimeSchedule || {};

    handleNoItemAdded(oneTimeInnerContent);

    if (Object.keys(oneTimeScheduleList).length) {
      oneTimeInnerContent.innerHTML = "";
    }

    for (let i in oneTimeScheduleList) {
      const taskData = oneTimeScheduleList[i];
      const { taskTitle, taskDescription, taskTime, taskDate } = taskData;

      oneTimeInnerContent.innerHTML += `
        <div class="taskToast" data-id="oneTimeSchedule-${i}">
          <div class="taskToastContent">
            <h3>${
              taskTitle?.length >= 25
                ? taskTitle?.slice(0, 25) + "..."
                : taskTitle
            }</h3>
            <span class="divider"></span>
            <p>${
              taskDescription?.length >= 25
                ? taskDescription?.slice(0, 30) + "..."
                : taskDescription
            }</p>
          </div>
          <div class="taskOption">
            <div class="left">
              <span class="scheduleTime"> ${timeFormatter(taskTime)} </span>
              <span class="scheduleDate"> ${dateFormatter(taskDate)}</span>
            </div>
            <div class="right">
              <span class="edit">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                >
                  <path
                  d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                  />
                </svg>
              </span>
              <span class="view">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 576 512"
              >
                <path
                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                />
                </svg>
              </span>
              <span class="delete">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                  viewBox="0 0 448 512"
                >
                  <path
                  d="M163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3C140.6 6.8 151.7 0 163.8 0zM32 128H416L394.8 467c-1.6 25.3-22.6 45-47.9 45H101.1c-25.3 0-46.3-19.7-47.9-45L32 128zm192 64c-6.4 0-12.5 2.5-17 7l-80 80c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V408c0 13.3 10.7 24 24 24s24-10.7 24-24V273.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-4.5-4.5-10.6-7-17-7z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    const ovserver = new IntersectionObserver(
      (item) => {
        item.forEach((task) => {
          if (task.isIntersecting) {
            task.target.classList.add("active");
          } else {
            task.target.classList.remove("active");
          }
        });
      },
      { threshold: 0.5 }
    );
    taskToast.forEach((item) => {
      ovserver.observe(item);
    });

    interactiveOption();
  });
};
const generateRegularTimeSchedule = () => {
  chrome.storage.local.get("regularTimeSchedule").then((result) => {
    const regularTimeScheduleList = result.regularTimeSchedule || {};
    handleNoItemAdded(regularTimeInnerTabContent);

    if (Object.keys(regularTimeScheduleList).length) {
      regularTimeInnerTabContent.innerHTML = "";
    }
    for (let i in regularTimeScheduleList) {
      const taskData = regularTimeScheduleList[i];
      const { taskTitle, taskDescription, taskTime } = taskData;

      regularTimeInnerTabContent.innerHTML += `
        <div class="taskToast" data-id="regularTimeSchedule-${i}">
          <div class="taskToastContent">
            <h3>${
              taskTitle?.length >= 25
                ? taskTitle?.slice(0, 25) + "..."
                : taskTitle
            }</h3>
            <span class="divider"></span>
            <p>${
              taskDescription?.length >= 25
                ? taskDescription?.slice(0, 30) + "..."
                : taskDescription
            }</p>
          </div>
          <div class="taskOption">
            <div class="left">
              <span class="scheduleTime"> ${timeFormatter(taskTime)} </span>
            </div>
            <div class="right">
              <span class="edit">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                >
                  <path
                  d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                  />
                </svg>
              </span>
              <span class="view">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 576 512"
              >
                <path
                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                />
                </svg>
              </span>
              <span class="delete">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                  viewBox="0 0 448 512"
                >
                  <path
                  d="M163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3C140.6 6.8 151.7 0 163.8 0zM32 128H416L394.8 467c-1.6 25.3-22.6 45-47.9 45H101.1c-25.3 0-46.3-19.7-47.9-45L32 128zm192 64c-6.4 0-12.5 2.5-17 7l-80 80c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V408c0 13.3 10.7 24 24 24s24-10.7 24-24V273.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-4.5-4.5-10.6-7-17-7z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }
    const ovserver = new IntersectionObserver(
      (item) => {
        item.forEach((task) => {
          if (task.isIntersecting) {
            task.target.classList.add("active");
          } else {
            task.target.classList.remove("active");
          }
        });
      },
      { threshold: 0.5 }
    );
    taskToast.forEach((item) => {
      ovserver.observe(item);
    });

    interactiveOption();
  });
};
const generateDaysSelected = (dayAndTime) => {
  let content = "";
  for (let item of dayAndTime) {
    content += `<div>
      <h4>${days[+item.day]}</h4>
      <span>${timeFormatter(item.time)}</span>
    </div>`;
  }
  return content;
};
const generateFrequentlyTimeSchedule = () => {
  chrome.storage.local.get("frequentlyTimeSchedule").then((result) => {
    const frquentlyTimeScheduleList = result.frequentlyTimeSchedule || {};
    handleNoItemAdded(frequentlyTimeInnerContent);

    if (Object.keys(frquentlyTimeScheduleList).length) {
      frequentlyTimeInnerContent.innerHTML = "";
    }
    for (let i in frquentlyTimeScheduleList) {
      const taskData = frquentlyTimeScheduleList[i];
      const { taskTitle, taskDescription, dayAndTime } = taskData;

      frequentlyTimeInnerContent.innerHTML += `
      <div class="taskToast" data-id="frequentlyTimeSchedule-${i}">
        <div class="taskToastContent">
          <h3>${
            taskTitle?.length >= 25
              ? taskTitle?.slice(0, 25) + "..."
              : taskTitle
          }</h3>
          <span class="divider"></span>
          <p>${
            taskDescription?.length >= 25
              ? taskDescription?.slice(0, 30) + "..."
              : taskDescription
          }</p>
        </div>
        <div class="frequentlyData">
          <div class="taskOption">
            <div class="left">
            ${generateDaysSelected(dayAndTime)}
            </div>
            <div class="right">
              <span class="edit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                  />
                </svg>
              </span>
              <span class="view">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 576 512"
                >
                  <path
                    d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                  />
                </svg>
              </span>
              <span class="delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3C140.6 6.8 151.7 0 163.8 0zM32 128H416L394.8 467c-1.6 25.3-22.6 45-47.9 45H101.1c-25.3 0-46.3-19.7-47.9-45L32 128zm192 64c-6.4 0-12.5 2.5-17 7l-80 80c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V408c0 13.3 10.7 24 24 24s24-10.7 24-24V273.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-4.5-4.5-10.6-7-17-7z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      `;
    }
    const ovserver = new IntersectionObserver(
      (item) => {
        item.forEach((task) => {
          if (task.isIntersecting) {
            task.target.classList.add("active");
          } else {
            task.target.classList.remove("active");
          }
        });
      },
      { threshold: 0.5 }
    );
    taskToast.forEach((item) => {
      ovserver.observe(item);
    });

    interactiveOption();
  });
};

const handleAddItemOneTimeSchedule = (addItemData) => {
  chrome.storage.local.get("oneTimeScheduleNo").then((result) => {
    const scheduleNo = updateDataTaskId || result.oneTimeScheduleNo || 0;
    chrome.storage.local.get("oneTimeSchedule").then((result) => {
      let oneTimeScheduleList = result.oneTimeSchedule || {};
      oneTimeScheduleList[scheduleNo] = {
        ...oneTimeScheduleList[scheduleNo],
        ...addItemData,
      };
      chrome.storage.local.set({
        oneTimeSchedule: oneTimeScheduleList,
      });
      chrome.storage.local.set({
        oneTimeScheduleNo: +scheduleNo + 1,
      });
      updateDataTaskId = null;
      updateFormData = {};
      generateOneTimeSchedule();
    });
  });
};
const handleAddItemRegularTimeSchedule = (addItemData) => {
  chrome.storage.local.get("regularTimeScheduleNo").then((result) => {
    const scheduleNo = updateDataTaskId || result.regularTimeScheduleNo || 0;
    chrome.storage.local.get("regularTimeSchedule").then((result) => {
      let regularTimeScheduleList = result.regularTimeSchedule || {};
      regularTimeScheduleList[scheduleNo] = {
        ...regularTimeScheduleList[scheduleNo],
        ...addItemData,
      };
      chrome.storage.local.set({
        regularTimeSchedule: regularTimeScheduleList,
      });
      chrome.storage.local.set({
        regularTimeScheduleNo: +scheduleNo + 1,
      });
      updateDataTaskId = null;
      updateFormData = {};
      generateRegularTimeSchedule();
    });
  });
};
const handleAddItemFrequentlyTimeSchedule = (addItemData) => {
  chrome.storage.local.get("frequentlyTimeScheduleNo").then((result) => {
    const scheduleNo = result.frequentlyTimeScheduleNo || 0;
    chrome.storage.local.get("frequentlyTimeSchedule").then((result) => {
      let frequentlyTimeScheduleList = result.frequentlyTimeSchedule || {};
      frequentlyTimeScheduleList[scheduleNo] = addItemData;
      chrome.storage.local.set({
        frequentlyTimeSchedule: frequentlyTimeScheduleList,
      });
      chrome.storage.local.set({
        frequentlyTimeScheduleNo: +scheduleNo + 1,
      });
      generateFrequentlyTimeSchedule();
    });
  });
};

const handleAddItem = (addItemData) => {
  errorPopUp.classList.remove("active");
  if (addItemData.scheduleTypeFormData === "oneTime")
    handleAddItemOneTimeSchedule(addItemData);
  else if (addItemData.scheduleTypeFormData === "regularTime")
    handleAddItemRegularTimeSchedule(addItemData);
  else handleAddItemFrequentlyTimeSchedule(addItemData);
};
clearTask.addEventListener("click", () => {
  chrome.storage.local.remove("oneTimeScheduleNo");
  chrome.storage.local.remove("oneTimeSchedule");
  chrome.storage.local.remove("regularTimeScheduleNo");
  chrome.storage.local.remove("regularTimeSchedule");
  chrome.storage.local.remove("frequentlyTimeScheduleNo");
  chrome.storage.local.remove("frequentlyTimeSchedule");
  generateOneTimeSchedule();
  generateRegularTimeSchedule();
  generateFrequentlyTimeSchedule();
});

addTask.addEventListener("click", (e) => {
  formData = {};
  addItem.classList.toggle("active");
});
addTaskItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  errorPopUp.classList.remove("active");
  for (let i = 0; i < e.target.length - 1; i++) {
    const inputItem = e.target[i];
    formData[inputItem.name] = inputItem.value;
  }
  e.target.reset();

  typeSchedul.classList.add("active");
  addItem.classList.remove("active");
});
addSchedulType.addEventListener("submit", (e) => {
  e.preventDefault();
  errorPopUp.classList.remove("active");
  const selectedSchedulType = addSchedulType.querySelector("input:checked");
  formData[selectedSchedulType.name] = selectedSchedulType.value;
  typeSchedul.classList.remove("active");

  addItem.classList.remove("active");
  if (formData.scheduleTypeFormData === "oneTime")
    dateSchedulePopUp.classList.add("active");
  else if (formData.scheduleTypeFormData === "regularTime") {
    timeSchedulePopUp.classList.add("active");
  } else {
    daySchedulePopUp.classList.add("active");
  }
});
timeScheduleType.addEventListener("submit", (e) => {
  e.preventDefault();
  errorPopUp.classList.remove("active");
  const dateAndTime = {};
  for (let i = 0; i < e.target.length - 1; i++) {
    const inputItem = e.target[i];
    dateAndTime[inputItem.name] = inputItem.value;
  }
  errorPopUp.classList.remove("active");
  e.target.reset();
  formData = {
    ...formData,
    ...dateAndTime,
  };
  timeSchedulePopUp.classList.remove("active");
  successPopUp.classList.add("active");
  errorPopUp.classList.remove("active");
  let parcent = 0;
  const interval = setInterval(() => {
    if (parcent === 100) {
      clearInterval(interval);
      successPopUp.classList.remove("active");
    }
    successText.innerHTML = `Successfully added ${parcent}%`;
    parcent++;
  }, 10);
  handleAddItem(formData);
});
dateScheduleType.addEventListener("submit", (e) => {
  e.preventDefault();
  errorPopUp.classList.remove("active");
  const dateAndTime = {};
  for (let i = 0; i < e.target.length - 1; i++) {
    const inputItem = e.target[i];
    dateAndTime[inputItem.name] = inputItem.value;
  }
  if (!varifyTimeInput(dateAndTime.taskTime, dateAndTime.taskDate)) {
    errorPopUpText.innerHTML = "Please select a valid time";
    errorPopUp.classList.add("active");
  } else {
    errorPopUp.classList.remove("active");
    e.target.reset();
    formData = {
      ...formData,
      ...dateAndTime,
    };
    dateSchedulePopUp.classList.remove("active");
    successPopUp.classList.add("active");
    errorPopUp.classList.remove("active");
    let parcent = 0;
    const interval = setInterval(() => {
      if (parcent === 100) {
        clearInterval(interval);
        successPopUp.classList.remove("active");
      }
      successText.innerHTML = `Successfully added ${parcent}%`;
      parcent++;
    }, 10);
    handleAddItem(formData);
  }
});
daySchedulType.addEventListener("submit", (e) => {
  e.preventDefault();
  errorPopUp.classList.remove("active");
  const dayData = handleDayData(e.target);
  if (dayData.length) {
    e.target.reset();
    formData.dayAndTime = dayData;
    daySchedulePopUp.classList.remove("active");
    errorPopUp.classList.remove("active");
    successPopUp.classList.add("active");
    let parcent = 0;
    const interval = setInterval(() => {
      if (parcent === 100) {
        clearInterval(interval);
        successPopUp.classList.remove("active");
      }
      successText.innerHTML = `Successfully added ${parcent}%`;
      parcent++;
    }, 10);

    handleAddItem(formData);
  } else {
    errorPopUp.classList.add("active");
    errorPopUpText.innerHTML = "Please fill atleast one of the following";
  }
});

const getDataTaskToast = (element) => {
  let parentTaskToast = element;
  while (parentTaskToast) {
    if (parentTaskToast.classList.contains("taskToast")) break;
    parentTaskToast = parentTaskToast.parentElement;
  }
  const dataId = parentTaskToast.getAttribute("data-id");
  return dataId.split("-");
};

const handleDeleteOption = () => {
  const deleteBtns = Array.from(document.querySelectorAll(".delete"));
  deleteBtns.forEach((item) => {
    item.addEventListener("click", (e) => {
      const [taskCategory, taskId] = getDataTaskToast(item);

      chrome.storage.local.get(taskCategory).then((result) => {
        const categoryDataList = result[taskCategory] || {};
        delete categoryDataList[taskId];
        chrome.storage.local
          .set({ [taskCategory]: categoryDataList })
          .then(() => {
            if (taskCategory === "oneTimeSchedule") generateOneTimeSchedule();
            else if (taskCategory === "regularTimeSchedule")
              generateRegularTimeSchedule();
            else generateFrequentlyTimeSchedule();
          });
      });
    });
  });
};
const handleViewDetailsOption = () => {
  const viewDetailsBtns = Array.from(document.querySelectorAll(".view"));
  viewDetailsBtns.forEach((item) => {
    item.addEventListener("click", (e) => {
      const [taskCategory, taskId] = getDataTaskToast(item);
      chrome.storage.local.get(taskCategory).then((result) => {
        const categoryDataList = result[taskCategory] || {};
        const { taskTitle, taskDescription } = categoryDataList[taskId];
        viewItem.classList.add("active");
        viewDetailsForm.querySelector("input").value = taskTitle;
        viewDetailsForm.querySelector("textarea").value = taskDescription;
      });
    });
  });
};
const handleUpdateOption = () => {
  const editBtns = Array.from(document.querySelectorAll(".edit"));
  editBtns.forEach((item) => {
    item.addEventListener("click", (e) => {
      const [taskCategory, taskId] = getDataTaskToast(item);
      chrome.storage.local.get(taskCategory).then((result) => {
        const categoryDataList = result[taskCategory] || {};
        updateFormData = { ...categoryDataList[taskId] };
        updateDataTaskId = taskId;
        console.log(updateFormData);
        const { taskTitle, taskDescription } = categoryDataList[taskId];
        console.log(taskCategory, taskId);
        updateTitleDescription.classList.add("active");
        updateTitleDescriptionForm.querySelector("input").value = taskTitle;
        updateTitleDescriptionForm.querySelector("textarea").value =
          taskDescription;
      });
    });
  });
};
updateTitleDescriptionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  for (let i = 0; i < e.target.length - 1; i++) {
    const inputItem = e.target[i];
    updateFormData[inputItem.name] = inputItem.value;
  }

  console.log(updateFormData);

  updateTitleDescription.classList.remove("active");
  if (updateFormData.scheduleTypeFormData === "oneTime") {
    updateDateSchedule.classList.add("active");
    updateDateScheduleForm.querySelectorAll("input")[0].value =
      updateFormData.taskTime;
    updateDateScheduleForm.querySelectorAll("input")[1].value =
      updateFormData.taskDate;
  } else if (updateFormData.scheduleTypeFormData === "regularTime") {
    updateTimeSchedule.classList.add("active");
    updateTimeScheduleForm.querySelector("input").value =
      updateFormData.taskTime;
  } else {
    updateDaySchedule.classList.add("active");
    console.log(updateDayScheduleForm);

    const { dayAndTime } = updateFormData;

    const dayInpBoxs = Array.from(
      updateDayScheduleForm.querySelectorAll(".dayInpBox")
    );

    dayAndTime.forEach((item, i) => {
      console.log(item);
      const { day, time } = item;
      const dayInpBoxDay = dayInpBoxs[day].querySelector(
        "input[type='checkbox']"
      );
      const dayInpBoxTime = dayInpBoxs[day].querySelector("input[type='time']");
      dayInpBoxDay.checked = true;
      dayInpBoxTime.value = time;
    });
  }
});
updateDateScheduleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  for (let i = 0; i < e.target.length - 1; i++) {
    const inputItem = e.target[i];
    updateFormData[inputItem.name] = inputItem.value;
  }
  handleAddItemOneTimeSchedule(updateFormData);
  updateDateSchedule.classList.remove("active");
});
updateTimeScheduleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  for (let i = 0; i < e.target.length - 1; i++) {
    const inputItem = e.target[i];
    updateFormData[inputItem.name] = inputItem.value;
  }
  handleAddItemRegularTimeSchedule(updateFormData);
  updateTimeSchedule.classList.remove("active");
});
updateDayScheduleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const dayData = handleDayData(e.target);
  if (dayData.length) {
    updateFormData.dayAndTime = dayData;
    handleAddItemFrequentlyTimeSchedule(updateFormData);
    updateDaySchedule.classList.remove("active");
  } else {
    errorPopUp.classList.add("active");
    errorPopUpText.innerHTML = "Please fill atleast one of the following";
  }
});
generateOneTimeSchedule();
generateRegularTimeSchedule();
generateFrequentlyTimeSchedule();
