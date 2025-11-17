const calendarDiv = document.getElementById("calendar");
const notifyBtn = document.getElementById("notifyBtn");
let gomiData = {};

// JSONを読み込む
fetch("gomi.json")
  .then(response => response.json())
  .then(data => {
    gomiData = data;
    renderCalendar();
  });

// カレンダー表示
function renderCalendar() {
  calendarDiv.innerHTML = "";
  const allDates = Object.keys(gomiData).sort();
  allDates.forEach(dateStr => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    const kind = gomiData[dateStr];
    dayDiv.textContent = `${dateStr.split("-")[2]}日\n${kind}`;
    if (kind === "燃えるごみ") dayDiv.classList.add("burnable");
    if (kind === "資源ごみ") dayDiv.classList.add("recyclable");
    calendarDiv.appendChild(dayDiv);
  });
}

// リマインド機能
notifyBtn.addEventListener("click", () => {
  if (!("Notification" in window)) {
    alert("このブラウザは通知に対応していません");
    return;
  }
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      checkRemind();
      alert("リマインドがオンになりました");
    }
  });
});

function checkRemind() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");
  const key = `${yyyy}-${mm}-${dd}`;
  if (gomiData[key]) {
    new Notification(`明日はごみの日です！`, {
      body: `${gomiData[key]}`
    });
  }
}
