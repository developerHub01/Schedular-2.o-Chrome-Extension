const title = document.querySelector(".title");
const description = document.querySelector("#description");

document.addEventListener("DOMContentLoaded", (e) => {
  chrome.storage.local.get("message").then((result) => {
    let messageData = result.message;
    if (!messageData) return chrome.storage.local.remove("message");
    const { messageTitle, messageDescription } = messageData;
    title.innerText = messageTitle;
    description.value = messageDescription;
    chrome.storage.local.remove("message");
  });
});
