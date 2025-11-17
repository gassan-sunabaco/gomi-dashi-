const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const notifyBtn = document.getElementById("notifyBtn");

let gomiData = {};
let currentDate = new Date("2025-11-01"); // 初期表示は11月

// JSON読み込み
fetch("gomi.json")
  .then(res => res.json())
  .then(data => {
    gomiData = data;
    renderCalendar(currentDate);
  });

// カレンダー描画
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  monthLabel.textContent = `${year}年${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  let html = "<tr>";
  const weekdays = ["日","月","火","水","木","金","土"];
  weekdays.forEach(d => html += `<th>${d}</th>`);
  html += "</tr><tr>";

  // 空白セル
  for (let i = 0; i < firstDay; i++) html += "<td></td>";

  for (let day = 1; day <= lastDate; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    let classes = "";
    if (gomiData[dateStr] === "燃えるごみ") classes = "burnable";
    if (gomiData[dateStr] === "資源ごみ") classes = "recyclable";

    html += `<td class="${classes}">${day}<br>${gomiData[dateStr] || ""}</td>`;

    if ((day + firstDay) % 7 === 0 && day !== lastDate) html += "</tr><tr>";
  }

  html += "</tr>";
  calendar.innerHTML = html;
}

// 月切替
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});
nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// 前日リマインド機能
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
    new Notification(`明日はごみの日です！`, { body: `${gomiData[key]}` });
  }
}
