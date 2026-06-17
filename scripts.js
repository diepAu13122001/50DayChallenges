const APP_STORAGE_KEY = "50_days_discipline_data_store_v2";

// Simulated Date Offset to jump days for testing
let simulatedDateOffset = 0;

function getTodayString(offset = 0) {
  const d = new Date();
  if (offset !== 0) {
    d.setDate(d.getDate() + offset);
  }
  return d.toISOString().split("T")[0];
}

// Default configuration (designed to show beautiful demo history for new users)
const defaultState = {
  startDate: getTodayString(-5),
  priorityGoal: "finance",
  goals: {
    finance: {
      coreGoal: "Tích lũy 12 triệu dọn ra ở riêng",
      easyHabit: "Ghi lại chi tiêu chi tiết hàng ngày",
      mediumHabit: "Kiểm tra tài sản trong app chứng khoán",
      hardHabit: "Học 30 phút về đầu tư & tài chính",
      completedEasy: [
        getTodayString(-5),
        getTodayString(-4),
        getTodayString(-3),
        getTodayString(-2),
        getTodayString(-1),
        getTodayString(0),
      ],
      completedMedium: [
        getTodayString(-5),
        getTodayString(-4),
        getTodayString(-2),
        getTodayString(-1),
      ],
      completedHard: [
        getTodayString(-5),
        getTodayString(-3),
        getTodayString(-2),
      ],
    },
    personal: {
      coreGoal: "Giảm 3kg mỡ thừa & cải thiện sự tập trung tinh thần",
      easyHabit: "Uống đủ 2L nước lọc tinh khiết",
      mediumHabit: "Tập thể dục/Squat cường độ cao 15 phút",
      hardHabit: "Tập thiền tĩnh tâm 15 phút trước khi đi ngủ",
      completedEasy: [
        getTodayString(-5),
        getTodayString(-4),
        getTodayString(-3),
        getTodayString(-2),
        getTodayString(-1),
        getTodayString(0),
      ],
      completedMedium: [
        getTodayString(-5),
        getTodayString(-4),
        getTodayString(-3),
      ],
      completedHard: [getTodayString(-5), getTodayString(-1)],
    },
    professional: {
      coreGoal: "Hoàn thành khóa học Front-End Senior & code dự án",
      easyHabit: "Đọc 1 bài blog công nghệ/kỹ thuật sâu",
      mediumHabit: "Giải thành công 1 bài thuật toán LeetCode",
      hardHabit: "Dành 1 tiếng code dự án cá nhân",
      completedEasy: [
        getTodayString(-5),
        getTodayString(-4),
        getTodayString(-3),
        getTodayString(-2),
        getTodayString(-1),
      ],
      completedMedium: [
        getTodayString(-5),
        getTodayString(-4),
        getTodayString(-1),
      ],
      completedHard: [getTodayString(-5), getTodayString(-2)],
    },
    relationship: {
      coreGoal: "Kết nối chất lượng cao hơn với gia đình & bạn bè tri kỷ",
      easyHabit: "Nhắn tin chúc ngày mới tốt lành hoặc hỏi thăm người thân",
      mediumHabit: "Gọi điện thoại tâm sự cùng bố mẹ ít nhất 10 phút",
      hardHabit: "Hẹn gặp mặt cà phê chất lượng hoặc hỗ trợ thiết thực",
      completedEasy: [
        getTodayString(-5),
        getTodayString(-4),
        getTodayString(-3),
        getTodayString(-1),
        getTodayString(0),
      ],
      completedMedium: [getTodayString(-5), getTodayString(-3)],
      completedHard: [getTodayString(-4)],
    },
  },
  oneTimeTasks: [
    {
      id: "t1",
      date: getTodayString(-4),
      text: "Nộp báo cáo tuần tóm tắt cho sếp",
      completed: true,
    },
    {
      id: "t2",
      date: getTodayString(-1),
      text: "Mua quà sinh nhật gửi về quê cho bố mẹ (Nhiệm vụ dồn hôm qua)",
      completed: false,
    },
    {
      id: "t3",
      date: getTodayString(0),
      text: "Dọn dẹp phòng ngủ, tủ quần áo gọn gàng",
      completed: false,
    },
  ],
  journals: {
    [getTodayString(-5)]:
      "Ngày đầu tiên của thử thách 50 ngày kỷ luật thép! Cảm thấy cực kỳ hào hứng. Ghi chép tài chính cẩn thiện và thiền 15 phút rất sâu.",
    [getTodayString(-4)]:
      "Hôm nay công việc ở cơ quan rất bận rộn nhưng vẫn cố gắng hoàn thành việc tập thể dục. Đã gọi điện hỏi thăm gia đình.",
    [getTodayString(-3)]:
      "Có chút mỏi cơ từ hôm qua nhưng vẫn hoàn thành thói quen. Sổ ghi chép chi tiêu bắt đầu đi vào nếp.",
    [getTodayString(-2)]:
      "Hôm nay bận họp đột xuất muộn nên bỏ lỡ việc giải Leetcode và thiền tối. Ngày mai phải nghiêm khắc hơn với bản thân!",
    [getTodayString(-1)]:
      "Đã bù đắp lại tinh thần bằng việc tập thể dục đầy đủ. Đang quen dần với thói quen uống nước đều.",
    [getTodayString(0)]:
      "Cố gắng giữ nhịp độ này. Đang chuẩn bị viết nhật ký ngày hôm nay.",
  },
};

let state = null;
let calendarViewMode = "month";

function loadState() {
  const stored = localStorage.getItem(APP_STORAGE_KEY);
  if (stored) {
    try {
      state = JSON.parse(stored);
      if (!state.journals) state.journals = {};
    } catch (e) {
      console.error("Lỗi đọc dữ liệu lưu trữ, khởi tạo mặc định.", e);
      state = JSON.parse(JSON.stringify(defaultState));
    }
  } else {
    state = JSON.parse(JSON.stringify(defaultState));
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
}

function dateDiffInDays(d1, d2) {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

function getSimulatedDate() {
  const today = new Date();
  today.setDate(today.getDate() + simulatedDateOffset);
  return today;
}

function getSimulatedDateString() {
  const sim = getSimulatedDate();
  return sim.toISOString().split("T")[0];
}

function getTargetDaysForLevel(level) {
  switch (level) {
    case "easy":
      return 45;
    case "medium":
      return 30;
    case "hard":
      return 25;
    default:
      return 30;
  }
}

function getChallengeDayDetails() {
  const start = new Date(state.startDate);
  const simDate = getSimulatedDate();

  const diff = dateDiffInDays(start, simDate);
  const currentDayIndex = diff + 1;

  const end = new Date(state.startDate);
  end.setDate(end.getDate() + 49);
  const endDateString = end.toISOString().split("T")[0];

  const daysRemaining = 50 - currentDayIndex;

  return {
    currentDayIndex: currentDayIndex,
    daysRemaining: Math.max(0, daysRemaining),
    endDate: endDateString,
    isBefore: currentDayIndex < 1,
    isAfter: currentDayIndex > 50,
    isValidChallengeTime: currentDayIndex >= 1 && currentDayIndex <= 50,
  };
}

function showToast(msg, isSuccess = true) {
  const toast = document.getElementById("toast-banner");
  const text = document.getElementById("toast-message");

  text.innerText = msg;
  if (!isSuccess) {
    toast.classList.replace("text-pink-600", "text-red-600");
    toast.classList.replace("border-pink-200", "border-red-200");
    toast.querySelector("i").className =
      "fa-solid fa-circle-xmark text-red-500 text-lg";
  } else {
    toast.classList.replace("text-red-600", "text-pink-600");
    toast.classList.replace("border-red-200", "border-pink-200");
    toast.querySelector("i").className =
      "fa-solid fa-heart-circle-check text-pink-500 text-lg";
  }

  toast.classList.remove("opacity-0", "translate-y-20", "pointer-events-none");
  toast.classList.add("opacity-100", "translate-y-0");

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-20", "pointer-events-none");
    toast.classList.remove("opacity-100", "translate-y-0");
  }, 3000);
}

function switchTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove(
      "bg-white",
      "text-pink-600",
      "shadow-sm",
      "border",
      "border-pink-200/40",
    );
    btn.classList.add("text-slate-500");
  });

  const activeContent = document.getElementById(`tab-${tabId}`);
  if (activeContent) activeContent.classList.remove("hidden");

  const activeBtn = document.getElementById(`btn-tab-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-500");
    activeBtn.classList.add(
      "bg-white",
      "text-pink-600",
      "shadow-sm",
      "border",
      "border-pink-200/40",
    );
  }

  if (tabId === "dashboard") {
    renderDashboard();
  } else if (tabId === "today") {
    renderTodayTasks();
  } else if (tabId === "calendar") {
    renderCalendar();
  } else if (tabId === "settings") {
    renderSettings();
  }
}

function renderDashboard() {
  const details = getChallengeDayDetails();
  const simString = getSimulatedDateString();

  const remDaysEl = document.getElementById("days-remaining");
  const badgeChallengeStatus = document.getElementById(
    "badge-challenge-status",
  );

  if (details.isBefore) {
    remDaysEl.innerText = "50";
    badgeChallengeStatus.innerText = "Chưa Bắt Đầu";
    badgeChallengeStatus.className =
      "px-2.5 py-0.5 text-[10px] rounded-full font-bold bg-amber-100 text-amber-700 border border-amber-200";
  } else if (details.isAfter) {
    remDaysEl.innerText = "0";
    badgeChallengeStatus.innerText = "Đã Hoàn Thành";
    badgeChallengeStatus.className =
      "px-2.5 py-0.5 text-[10px] rounded-full font-bold bg-green-100 text-green-700 border border-green-200";
  } else {
    remDaysEl.innerText = details.daysRemaining;
    badgeChallengeStatus.innerText = `Đang chạy (Day ${details.currentDayIndex}/50)`;
    badgeChallengeStatus.className =
      "px-2.5 py-0.5 text-[10px] rounded-full font-bold bg-pink-100 text-pink-700 border border-pink-200";
  }

  document.getElementById("sidebar-start-date").innerText = formatDateShort(
    state.startDate,
  );
  document.getElementById("sidebar-end-date").innerText = formatDateShort(
    details.endDate,
  );

  document.getElementById("summary-start-date").innerText = formatDateFull(
    state.startDate,
  );
  document.getElementById("summary-end-date").innerText = formatDateFull(
    details.endDate,
  );

  const dayIdxEl = document.getElementById("challenge-day-index");
  if (details.isBefore) {
    dayIdxEl.innerText = "Chưa Bắt Đầu";
  } else if (details.isAfter) {
    dayIdxEl.innerText = "Kết thúc chu kỳ";
  } else {
    dayIdxEl.innerText = `Day ${details.currentDayIndex}/50`;
  }

  // Star Highlight Priority Goal
  document
    .querySelectorAll('[id^="star-"]')
    .forEach((el) => el.classList.add("hidden"));
  const priorityStar = document.getElementById(`star-${state.priorityGoal}`);
  if (priorityStar) priorityStar.classList.remove("hidden");

  const mapGoalName = {
    finance: "Tài Chính (Finance) 💰",
    personal: "Cá Nhân & Sức Khỏe (Personal) 🏃‍♂️",
    professional: "Sự Nghiệp & Kỹ Năng (Professional) 💼",
    relationship: "Mối Quan Hệ (Relationship) 🤝",
  };
  document.getElementById("summary-priority-goal").innerText =
    mapGoalName[state.priorityGoal] || "Chưa thiết lập";

  // Aspect specific details calculations
  const aspects = ["finance", "personal", "professional", "relationship"];
  let grandTotalCompleted = 0;

  aspects.forEach((aspect) => {
    const goal = state.goals[aspect];
    document.getElementById(`dash-goal-${aspect}`).innerText =
      `Mục tiêu: ${goal.coreGoal || "Chưa thiết lập mục tiêu"}`;

    const levels = ["easy", "medium", "hard"];
    levels.forEach((lvl) => {
      const arrName = "completed" + lvl.charAt(0).toUpperCase() + lvl.slice(1);
      const datesArr = goal[arrName] || [];

      const validCompleted = datesArr.filter((d) => {
        const diff = dateDiffInDays(new Date(state.startDate), new Date(d));
        return diff >= 0 && diff < 50;
      }).length;

      grandTotalCompleted += validCompleted;

      const targetDays = getTargetDaysForLevel(lvl);
      const pct = Math.min(
        100,
        Math.round((validCompleted / targetDays) * 100),
      );

      document.getElementById(`dash-habit-title-${aspect}-${lvl}`).innerText =
        goal[`${lvl}Habit`] || "Chưa thiết lập";
      document.getElementById(`dash-habit-pct-${aspect}-${lvl}`).innerText =
        `${validCompleted}/${targetDays}d (${pct}%)`;
      document.getElementById(
        `dash-habit-progress-${aspect}-${lvl}`,
      ).style.width = `${pct}%`;
    });
  });

  const avgIndex = Math.round((grandTotalCompleted / (50 * 12)) * 100);
  document.getElementById("discipline-index").innerText = `${avgIndex}%`;

  updateBadgeTodayTasksCount();
}

function formatDateShort(dateStr) {
  if (!dateStr) return "--/--";
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}`;
}

function formatDateFull(dateStr) {
  if (!dateStr) return "--/--/----";
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getDayOfWeekName(dateObj) {
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  return days[dateObj.getDay()];
}

function renderTodayTasks() {
  const simString = getSimulatedDateString();
  const details = getChallengeDayDetails();

  const dayNumText = details.isValidChallengeTime
    ? `Day ${details.currentDayIndex}`
    : details.isBefore
      ? "Chưa bắt đầu"
      : "Hoàn thành 50 ngày";
  const formattedDate = formatDateFull(simString);
  const dayName = getDayOfWeekName(getSimulatedDate());
  document.getElementById("today-panel-date").innerText =
    `Thử thách: ${dayNumText} (${dayName}, ngày ${formattedDate})`;

  // RENDER DAILY HABITS (4 Aspects with 3 levels each)
  const habitsContainer = document.getElementById("today-habits-container");
  habitsContainer.innerHTML = "";

  const aspects = ["finance", "personal", "professional", "relationship"];
  const colors = {
    finance: { border: "border-amber-200", text: "text-amber-600" },
    personal: { border: "border-pink-200", text: "text-pink-600" },
    professional: { border: "border-amber-200", text: "text-amber-600" },
    relationship: { border: "border-pink-200", text: "text-pink-600" },
  };

  aspects.forEach((aspect) => {
    const goal = state.goals[aspect];
    const isPriority = state.priorityGoal === aspect;
    const clr = colors[aspect];

    const aspectCard = document.createElement("div");
    aspectCard.className = `glass-panel border ${clr.border} rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden`;

    aspectCard.innerHTML = `
                <div>
                    <div class="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <span class="text-xs font-extrabold uppercase ${clr.text}">${aspect}</span>
                        ${isPriority ? '<span class="text-[10px] font-black bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full border border-amber-200">⭐ Trọng Tâm</span>' : ""}
                    </div>
                    <h4 class="font-extrabold text-sm text-slate-800 leading-snug">${goal.coreGoal || "Mục tiêu: Chưa thiết lập"}</h4>
                </div>
                <div class="space-y-2.5 pt-2.5 border-t border-pink-100/40">
                    <!-- Easy Habit Toggle -->
                    ${createHabitItemHTML(aspect, "easy", goal.easyHabit, goal.completedEasy.includes(simString), "emerald")}
                    <!-- Medium Habit Toggle -->
                    ${createHabitItemHTML(aspect, "medium", goal.mediumHabit, goal.completedMedium.includes(simString), "amber")}
                    <!-- Hard Habit Toggle -->
                    ${createHabitItemHTML(aspect, "hard", goal.hardHabit, goal.completedHard.includes(simString), "pink")}
                </div>
            `;
    habitsContainer.appendChild(aspectCard);
  });

  // YESTERDAY'S MISSED HABITS (RED XS DISPLAY)
  const yesterdayString = getTodayString(simulatedDateOffset - 1);
  const diffYesterday = dateDiffInDays(
    new Date(state.startDate),
    new Date(yesterdayString),
  );
  const wasYesterdayInChallenge = diffYesterday >= 0 && diffYesterday < 50;

  const missedAlertBox = document.getElementById(
    "yesterday-habits-missed-alert",
  );
  const missedListContainer = document.getElementById(
    "yesterday-habits-missed-list",
  );
  missedListContainer.innerHTML = "";
  let missedCount = 0;

  if (wasYesterdayInChallenge) {
    aspects.forEach((aspect) => {
      const goal = state.goals[aspect];
      const levels = ["easy", "medium", "hard"];
      levels.forEach((lvl) => {
        const arrName =
          "completed" + lvl.charAt(0).toUpperCase() + lvl.slice(1);
        const completedArr = goal[arrName] || [];
        const yesterdayFinished = completedArr.includes(yesterdayString);

        if (!yesterdayFinished) {
          missedCount++;
          const rawHabitText = goal[`${lvl}Habit`] || `Thói quen ${lvl}`;
          const div = document.createElement("div");
          div.className =
            "flex items-center gap-2 p-2 bg-red-100/50 border border-red-200/50 rounded-xl text-red-800 font-medium";
          div.innerHTML = `
                            <span class="text-red-500 font-bold shrink-0"><i class="fa-solid fa-circle-xmark"></i></span>
                            <span class="truncate"><strong>${aspect.toUpperCase()} (${lvl}):</strong> ${rawHabitText}</span>
                        `;
          missedListContainer.appendChild(div);
        }
      });
    });
  }

  if (missedCount > 0) {
    missedAlertBox.classList.remove("hidden");
  } else {
    missedAlertBox.classList.add("hidden");
  }

  // ONE-TIME TASKS & CARRYOVER CUMULATIVE LOGIC
  const carryoverContainer = document.getElementById(
    "carryover-tasks-container",
  );
  const todayTasksContainer = document.getElementById("today-tasks-container");
  const carryoverSection = document.getElementById("carryover-section");

  carryoverContainer.innerHTML = "";
  todayTasksContainer.innerHTML = "";

  let carryoverCount = 0;
  let todayCount = 0;

  state.oneTimeTasks.forEach((task) => {
    const isCompleted = task.completed;
    const taskDate = task.date;

    if (taskDate < simString) {
      if (!isCompleted) {
        carryoverCount++;
        const item = createOneTimeTaskElement(task, true);
        carryoverContainer.appendChild(item);
      }
    } else if (taskDate === simString) {
      todayCount++;
      const item = createOneTimeTaskElement(task, false);
      todayTasksContainer.appendChild(item);
    }
  });

  if (carryoverCount > 0) {
    carryoverSection.classList.remove("hidden");
  } else {
    carryoverSection.classList.add("hidden");
  }

  if (todayCount === 0) {
    todayTasksContainer.innerHTML = `
                <div class="text-center py-8 text-slate-400 text-xs font-semibold leading-relaxed">
                    <i class="fa-solid fa-cookie-bite text-3xl mb-2.5 block text-pink-300"></i>
                    Chưa có nhiệm vụ cá nhân riêng được lập cho hôm nay.<br>Bấm nút thêm việc nếu bạn có kế hoạch đặc biệt nhé!
                </div>
            `;
  }

  const journalTextarea = document.getElementById("today-journal-textarea");
  journalTextarea.value = state.journals[simString] || "";

  updateBadgeTodayTasksCount();
}

function createHabitItemHTML(aspect, level, name, isChecked, colorPrefix) {
  const labelColors = {
    emerald: "text-emerald-700 bg-emerald-100 border-emerald-200",
    amber: "text-amber-700 bg-amber-100 border-amber-200",
    pink: "text-pink-700 bg-pink-100 border-pink-200",
  };

  const activeBadgeColor = {
    emerald: "bg-emerald-500 text-white border-transparent",
    amber: "bg-amber-400 text-white border-transparent",
    pink: "bg-pink-400 text-white border-transparent",
  };

  const habitNameText = name || `Chưa cấu hình thói quen ${level}`;
  const checkedClass = isChecked
    ? `${activeBadgeColor[colorPrefix]} shadow-sm shadow-pink-100`
    : "border-pink-100 bg-white text-slate-300 hover:border-pink-300 hover:text-pink-500";

  return `
            <div class="flex items-center justify-between gap-3 p-2 bg-white/40 border border-pink-100/30 rounded-xl hover:border-pink-200 transition-all">
                <div class="flex-1 overflow-hidden">
                    <span class="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${labelColors[colorPrefix]} mb-1">${level}</span>
                    <p class="text-xs text-slate-700 truncate font-semibold">${habitNameText}</p>
                </div>
                <button onclick="toggleHabit('${aspect}', '${level}')" class="w-7 h-7 rounded-lg flex items-center justify-center border transition-all shrink-0 ${checkedClass}">
                    <i class="fa-solid ${isChecked ? "fa-check text-xs" : "fa-plus text-[10px]"}"></i>
                </button>
            </div>
        `;
}

function createOneTimeTaskElement(task, isCarryover = false) {
  const div = document.createElement("div");
  div.className =
    "flex items-center justify-between p-3 bg-white/80 border border-pink-100 rounded-xl hover:border-pink-300 transition-all gap-3 group shadow-sm";

  const badgeHTML = isCarryover
    ? `<span class="inline-flex items-center text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200/60 px-2 py-0.5 rounded-full shrink-0"><i class="fa-solid fa-clock-rotate-left mr-1 animate-pulse"></i> Cộng dồn từ ${formatDateShort(task.date)}</span>`
    : "";

  div.innerHTML = `
            <div class="flex items-center gap-3 flex-1 overflow-hidden">
                <button onclick="toggleOneTimeTask('${task.id}')" class="w-5 h-5 rounded border border-pink-200 flex items-center justify-center shrink-0 transition-all ${
                  task.completed
                    ? "bg-pink-500 border-transparent text-white shadow-sm shadow-pink-100"
                    : "hover:border-pink-400 hover:bg-pink-50 text-transparent"
                }">
                    <i class="fa-solid fa-check text-[9px]"></i>
                </button>
                <div class="flex flex-col gap-0.5 overflow-hidden">
                    <span class="text-xs text-slate-700 font-semibold truncate ${task.completed ? "line-through text-slate-400" : ""}">${task.text}</span>
                    ${badgeHTML}
                </div>
            </div>
            <button onclick="deleteTask('${task.id}')" class="text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-1">
                <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
        `;
  return div;
}

function toggleHabit(aspect, level) {
  const simString = getSimulatedDateString();
  const goal = state.goals[aspect];
  const arrName = "completed" + level.charAt(0).toUpperCase() + level.slice(1);

  if (!goal[arrName]) {
    goal[arrName] = [];
  }

  const idx = goal[arrName].indexOf(simString);
  if (idx > -1) {
    goal[arrName].splice(idx, 1);
    showToast(`Đã hủy thói quen ${aspect.toUpperCase()} (${level})`, false);
  } else {
    goal[arrName].push(simString);
    showToast(`Đã rèn luyện thói quen ${aspect.toUpperCase()} (${level})! ⭐`);
  }

  saveToStorage();
  renderTodayTasks();
  updateBadgeTodayTasksCount();
}

function toggleOneTimeTask(taskId) {
  const task = state.oneTimeTasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveToStorage();
    renderTodayTasks();
    if (task.completed) {
      showToast("Đã xong việc cá nhân tích lũy!");
    }
  }
}

function deleteTask(taskId) {
  state.oneTimeTasks = state.oneTimeTasks.filter((t) => t.id !== taskId);
  saveToStorage();
  renderTodayTasks();
  showToast("Đã xóa công việc", false);
}

function updateBadgeTodayTasksCount() {
  const simString = getSimulatedDateString();
  let uncompletedHabits = 0;
  const aspects = ["finance", "personal", "professional", "relationship"];
  const levels = ["easy", "medium", "hard"];

  aspects.forEach((aspect) => {
    const goal = state.goals[aspect];
    levels.forEach((lvl) => {
      const arrName = "completed" + lvl.charAt(0).toUpperCase() + lvl.slice(1);
      const completedArr = goal[arrName] || [];
      if (!completedArr.includes(simString)) {
        uncompletedHabits++;
      }
    });
  });

  const uncompletedOneTimes = state.oneTimeTasks.filter((task) => {
    const isUnfinished = !task.completed;
    const isOverdue = task.date < simString;
    const isToday = task.date === simString;
    return isUnfinished && (isOverdue || isToday);
  }).length;

  const totalUnfinished = uncompletedHabits + uncompletedOneTimes;
  const badge = document.getElementById("badge-today-count");
  if (totalUnfinished > 0) {
    badge.innerText = totalUnfinished;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

function saveTodayJournalOnInput() {
  const simString = getSimulatedDateString();
  const text = document.getElementById("today-journal-textarea").value;
  state.journals[simString] = text;
  saveToStorage();
}

function saveTodayJournalManual() {
  saveTodayJournalOnInput();
  showToast("Đã lưu nhật ký ngày hôm nay! 📝");
}

function toggleCalendarView(mode) {
  calendarViewMode = mode;
  const btnMonth = document.getElementById("btn-view-month");
  const btnWeek = document.getElementById("btn-view-week");

  if (mode === "month") {
    btnMonth.className =
      "px-4 py-2 rounded-xl text-xs font-bold transition-all bg-white text-pink-600 shadow-sm border border-pink-200/20";
    btnWeek.className =
      "px-4 py-2 rounded-xl text-xs font-bold transition-all text-slate-500 hover:text-pink-600";
  } else {
    btnWeek.className =
      "px-4 py-2 rounded-xl text-xs font-bold transition-all bg-white text-pink-600 shadow-sm border border-pink-200/20";
    btnMonth.className =
      "px-4 py-2 rounded-xl text-xs font-bold transition-all text-slate-500 hover:text-pink-600";
  }
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById("grid-50-days");
  grid.innerHTML = "";

  const start = new Date(state.startDate);
  const simString = getSimulatedDateString();

  const diffDays = dateDiffInDays(start, getSimulatedDate());
  const currentDayIndex = diffDays + 1;

  let startIdx = 1;
  let endIdx = 50;

  if (calendarViewMode === "week") {
    const currentWeek = Math.ceil(currentDayIndex / 7);
    const boundedWeek = Math.max(1, Math.min(7, currentWeek));

    startIdx = (boundedWeek - 1) * 7 + 1;
    endIdx = boundedWeek * 7;
    if (boundedWeek === 7) endIdx = 50;
  }

  for (let i = startIdx; i <= endIdx; i++) {
    const currentDateOfI = new Date(state.startDate);
    currentDateOfI.setDate(currentDateOfI.getDate() + (i - 1));
    const dateStr = currentDateOfI.toISOString().split("T")[0];

    let completedHabitsCount = 0;
    const aspects = ["finance", "personal", "professional", "relationship"];
    const levels = ["easy", "medium", "hard"];

    aspects.forEach((aspect) => {
      const goal = state.goals[aspect];
      levels.forEach((lvl) => {
        const arrName =
          "completed" + lvl.charAt(0).toUpperCase() + lvl.slice(1);
        const completedArr = goal[arrName] || [];
        if (completedArr.includes(dateStr)) {
          completedHabitsCount++;
        }
      });
    });

    const dayOneTimeTasks = state.oneTimeTasks.filter(
      (t) => t.date === dateStr,
    );
    const totalOneTimes = dayOneTimeTasks.length;
    const completedOneTimes = dayOneTimeTasks.filter((t) => t.completed).length;

    const isToday = dateStr === simString;
    const isPast = dateStr < simString;
    const isFuture = dateStr > simString;

    let bgClass =
      "bg-white hover:bg-pink-50/30 border-pink-100 text-slate-700 shadow-sm";
    let statusIconHTML = "";

    const totalScore = completedHabitsCount;

    if (isPast) {
      if (totalScore >= 6) {
        bgClass =
          "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/50";
        statusIconHTML = `<i class="fa-solid fa-circle-check text-[10px] text-emerald-500"></i>`;
      } else if (totalScore >= 3) {
        bgClass =
          "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/50";
        statusIconHTML = `<i class="fa-solid fa-circle-exclamation text-[10px] text-amber-500"></i>`;
      } else {
        bgClass =
          "bg-pink-50 border-pink-200 text-pink-800 hover:bg-pink-100/50";
        statusIconHTML = `<i class="fa-solid fa-circle-xmark text-[10px] text-pink-400"></i>`;
      }
    } else if (isToday) {
      bgClass =
        "border-2 border-pink-400 bg-white text-slate-800 shadow-md shadow-pink-100";
      statusIconHTML = `<span class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>`;
    } else if (isFuture) {
      bgClass =
        "bg-slate-50/50 text-slate-400 opacity-80 hover:opacity-100 border-slate-200";
      statusIconHTML = `<i class="fa-regular fa-calendar-plus text-[10px] text-slate-400"></i>`;
    }

    const hasJournal =
      state.journals[dateStr] && state.journals[dateStr].trim().length > 0;
    const journalMarkerHTML = hasJournal
      ? `<span class="text-pink-500" title="Đã có dòng nhật ký"><i class="fa-solid fa-heart"></i></span>`
      : "";

    const dayBox = document.createElement("button");
    dayBox.className = `${bgClass} rounded-2xl p-3.5 flex flex-col items-center justify-between min-h-[105px] border transition-all active:scale-95 relative overflow-hidden`;
    dayBox.onclick = () =>
      onSelectCalendarDay(dateStr, i, isPast, isToday, isFuture);

    dayBox.innerHTML = `
                <div class="flex items-center justify-between w-full text-[10px]">
                    <span class="font-extrabold tracking-wider text-slate-400">D-${i}</span>
                    <div class="flex items-center gap-1">
                        ${journalMarkerHTML}
                        ${statusIconHTML}
                    </div>
                </div>
                <div class="my-1">
                    <span class="block text-xs font-black">${formatDateShort(dateStr)}</span>
                </div>
                <div class="w-full flex justify-between items-center text-[9px] text-slate-400 font-bold">
                    <span title="Thói quen đạt"><i class="fa-solid fa-rotate-right text-pink-400 mr-0.5"></i>${completedHabitsCount}/12</span>
                    ${totalOneTimes > 0 ? `<span title="Việc một lần" class="text-amber-500 font-bold"><i class="fa-solid fa-list-check mr-0.5"></i>${completedOneTimes}/${totalOneTimes}</span>` : ""}
                </div>
            `;
    grid.appendChild(dayBox);
  }
}

function onSelectCalendarDay(dateStr, dayNum, isPast, isToday, isFuture) {
  if (isFuture) {
    openAddTaskModal(dateStr);
  } else {
    openDayDetailModal(dateStr, dayNum, isToday);
  }
}

function openAddTaskModal(targetDate) {
  const simString = getSimulatedDateString();
  const finalDate = targetDate === "today" ? simString : targetDate;

  document.getElementById("modal-task-date").value = finalDate;

  const dayOffset =
    dateDiffInDays(new Date(state.startDate), new Date(finalDate)) + 1;
  document.getElementById("modal-date-display").innerText =
    `${formatDateFull(finalDate)} (Day ${dayOffset})`;
  document.getElementById("modal-task-desc").value = "";

  const isToday = finalDate === simString;
  document.getElementById("modal-title-text").innerText = isToday
    ? "Thêm việc hôm nay"
    : "Lên kế hoạch tương lai";

  document.getElementById("task-modal").classList.remove("hidden");
}

function closeTaskModal() {
  document.getElementById("task-modal").classList.add("hidden");
}

function saveTaskModal() {
  const desc = document.getElementById("modal-task-desc").value.trim();
  const dateStr = document.getElementById("modal-task-date").value;

  if (!desc) {
    showToast("Vui lòng điền mô tả công việc!", false);
    return;
  }

  const newTask = {
    id: "t_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    date: dateStr,
    text: desc,
    completed: false,
  };

  state.oneTimeTasks.push(newTask);
  saveToStorage();
  closeTaskModal();
  showToast("Đã ghi nhận nhiệm vụ kế hoạch mới!");

  renderTodayTasks();
  renderCalendar();
}

function openDayDetailModal(dateStr, dayNum, isToday) {
  document.getElementById("detail-modal-title").innerText =
    `Nhật ký & Lịch sử Ngày D-${dayNum}`;

  const rawDate = new Date(dateStr);
  const dayName = getDayOfWeekName(rawDate);
  document.getElementById("detail-modal-subtitle").innerText =
    `${dayName}, ngày ${formatDateFull(dateStr)}`;

  const lockAlert = document.getElementById("detail-lock-indicator");
  const editContainer = document.getElementById(
    "detail-journal-edit-container",
  );
  const readOnlyContainer = document.getElementById("detail-journal-readonly");

  if (isToday) {
    lockAlert.className =
      "p-3 bg-pink-50 border border-pink-200 rounded-2xl text-pink-800 text-xs flex items-center gap-2 shadow-inner";
    lockAlert.innerHTML = `<i class="fa-solid fa-lock-open"></i> <span><strong>Ngày hôm nay đang hoạt động:</strong> Bạn hoàn toàn có thể ghi nhận hoặc điều chỉnh nhật ký và nhiệm vụ lúc này.</span>`;

    editContainer.classList.remove("hidden");
    readOnlyContainer.classList.add("hidden");
    document.getElementById("detail-journal-textarea").value =
      state.journals[dateStr] || "";
  } else {
    lockAlert.className =
      "p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center gap-2 shadow-inner";
    lockAlert.innerHTML = `<i class="fa-solid fa-lock"></i> <span><strong>Lịch sử đã đóng băng vĩnh viễn:</strong> Đã khóa quyền thay đổi để rèn luyện sự nghiêm khắc với quá khứ.</span>`;

    editContainer.classList.add("hidden");
    readOnlyContainer.classList.remove("hidden");
    const journalText = state.journals[dateStr];
    if (journalText && journalText.trim().length > 0) {
      readOnlyContainer.innerText = `"${journalText}"`;
      readOnlyContainer.className =
        "bg-pink-50/30 p-4 rounded-2xl border border-pink-100 text-slate-700 text-sm whitespace-pre-wrap italic min-h-[60px] relative leading-relaxed";
    } else {
      readOnlyContainer.innerText =
        "Không có dòng cảm xúc hay nhật ký nào được ghi lại cho ngày này.";
      readOnlyContainer.className =
        "bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-400 text-xs italic min-h-[60px] relative";
    }
  }

  // Render completed habits on that selected date
  const habitsList = document.getElementById("detail-habits-list");
  habitsList.innerHTML = "";

  const aspects = ["finance", "personal", "professional", "relationship"];
  const levels = ["easy", "medium", "hard"];

  aspects.forEach((aspect) => {
    const goal = state.goals[aspect];

    const aspectWrapper = document.createElement("div");
    aspectWrapper.className =
      "p-3 bg-white border border-pink-100 rounded-xl flex flex-col gap-1.5 shadow-sm";

    let html = `<span class="text-[10px] font-black text-slate-400 block uppercase mb-1 tracking-wider">${aspect}</span>`;

    levels.forEach((lvl) => {
      const arrName = "completed" + lvl.charAt(0).toUpperCase() + lvl.slice(1);
      const isDone = (goal[arrName] || []).includes(dateStr);

      const icon = isDone
        ? `<i class="fa-solid fa-circle-check text-emerald-500 text-sm"></i>`
        : `<i class="fa-solid fa-circle-xmark text-pink-300 text-sm"></i>`;

      const txt = goal[`${lvl}Habit`] || `Thói quen ${lvl}`;
      const strikeClass = isDone
        ? "text-slate-700 font-semibold"
        : "text-slate-400 line-through";

      html += `
                    <div class="flex items-center gap-2 text-xs">
                        ${icon}
                        <span class="truncate ${strikeClass}" title="${txt}">(${lvl.toUpperCase()}) ${txt}</span>
                    </div>
                `;
    });

    aspectWrapper.innerHTML = html;
    habitsList.appendChild(aspectWrapper);
  });

  // Render completed one-time tasks on that date
  const tasksList = document.getElementById("detail-tasks-list");
  tasksList.innerHTML = "";
  const dayTasks = state.oneTimeTasks.filter((t) => t.date === dateStr);

  if (dayTasks.length > 0) {
    dayTasks.forEach((task) => {
      const div = document.createElement("div");
      div.className =
        "flex items-center gap-2.5 p-2 bg-white border border-pink-100 rounded-lg text-xs font-semibold shadow-sm";
      const icon = task.completed
        ? `<i class="fa-solid fa-circle-check text-pink-500"></i>`
        : `<i class="fa-solid fa-circle-xmark text-slate-300"></i>`;
      const strikeClass = task.completed
        ? "line-through text-slate-400"
        : "text-slate-700";

      div.innerHTML = `${icon} <span class="${strikeClass}">${task.text}</span>`;
      tasksList.appendChild(div);
    });
  } else {
    tasksList.innerHTML = `<p class="text-xs text-slate-400 italic">Không có công việc cá nhân nào khác trong ngày này.</p>`;
  }

  window.activeDetailDate = dateStr;
  document.getElementById("day-detail-modal").classList.remove("hidden");
}

function closeDayDetailModal() {
  document.getElementById("day-detail-modal").classList.add("hidden");
}

function saveDetailModalJournal() {
  const text = document.getElementById("detail-journal-textarea").value;
  const dateStr = window.activeDetailDate;

  if (dateStr) {
    state.journals[dateStr] = text;
    saveToStorage();
    showToast("Cập nhật nhật ký hành trình thành công!");
    renderTodayTasks();
    renderCalendar();
  }
}

function renderSettings() {
  document.getElementById("settings-start-date").value = state.startDate;

  const details = getChallengeDayDetails();
  document.getElementById("settings-end-date").value = details.endDate;

  const radio = document.querySelector(
    `input[name="priorityGoal"][value="${state.priorityGoal}"]`,
  );
  if (radio) radio.checked = true;

  const aspects = ["finance", "personal", "professional", "relationship"];
  aspects.forEach((aspect) => {
    const goal = state.goals[aspect];
    document.getElementById(`settings-goal-${aspect}`).value =
      goal.coreGoal || "";
    document.getElementById(`settings-habit-${aspect}-easy`).value =
      goal.easyHabit || "";
    document.getElementById(`settings-habit-${aspect}-medium`).value =
      goal.mediumHabit || "";
    document.getElementById(`settings-habit-${aspect}-hard`).value =
      goal.hardHabit || "";
  });
}

function onStartDateChange() {
  const startVal = document.getElementById("settings-start-date").value;
  if (!startVal) return;

  state.startDate = startVal;

  const d = new Date(startVal);
  d.setDate(d.getDate() + 49);
  const endVal = d.toISOString().split("T")[0];
  document.getElementById("settings-end-date").value = endVal;
}

function onPriorityGoalChange(val) {
  state.priorityGoal = val;
}

function saveAllSettings() {
  const aspects = ["finance", "personal", "professional", "relationship"];

  aspects.forEach((aspect) => {
    const goal = state.goals[aspect];
    goal.coreGoal = document
      .getElementById(`settings-goal-${aspect}`)
      .value.trim();
    goal.easyHabit = document
      .getElementById(`settings-habit-${aspect}-easy`)
      .value.trim();
    goal.mediumHabit = document
      .getElementById(`settings-habit-${aspect}-medium`)
      .value.trim();
    goal.hardHabit = document
      .getElementById(`settings-habit-${aspect}-hard`)
      .value.trim();
  });

  saveToStorage();
  showToast("Đã cập nhật mục tiêu & 12 cấp thói quen thành công! 🔥");
  switchTab("dashboard");
}

function triggerResetChallenge() {
  document.getElementById("confirm-modal").classList.remove("hidden");
}

function closeConfirmModal() {
  document.getElementById("confirm-modal").classList.add("hidden");
}

function executeRestartChallenge() {
  const freshState = {
    startDate: getTodayString(0),
    priorityGoal: "finance",
    goals: {
      finance: {
        coreGoal: "Tiết kiệm 12 triệu để chuẩn bị dọn ra ở riêng",
        easyHabit: "Ghi chép chi tiêu chi tiết hàng ngày",
        mediumHabit: "Kiểm tra tài sản trong app chứng khoán",
        hardHabit: "Học 30 phút về đầu tư & tài chính",
        completedEasy: [],
        completedMedium: [],
        completedHard: [],
      },
      personal: {
        coreGoal: "Giảm 3kg mỡ thừa & tập trung tinh thần",
        easyHabit: "Uống đủ 2L nước lọc",
        mediumHabit: "Tập thể dục/Squat cường độ cao 15 phút",
        hardHabit: "Tập thiền tĩnh tâm 15 phút trước khi đi ngủ",
        completedEasy: [],
        completedMedium: [],
        completedHard: [],
      },
      professional: {
        coreGoal: "Hoàn thành khóa học Front-End Senior & code dự án",
        easyHabit: "Đọc 1 bài blog công nghệ/kỹ thuật sâu",
        mediumHabit: "Giải thành công 1 bài thuật toán LeetCode",
        hardHabit: "Dành 1 tiếng code dự án cá nhân",
        completedEasy: [],
        completedMedium: [],
        completedHard: [],
      },
      relationship: {
        coreGoal: "Kết nối chất lượng cao hơn với gia đình & tri kỷ",
        easyHabit: "Nhắn tin chúc ngày mới tốt lành hoặc hỏi thăm người thân",
        mediumHabit: "Gọi điện thoại tâm sự cùng bố mẹ ít nhất 10 phút",
        hardHabit: "Hẹn gặp mặt cà phê chất lượng hoặc hỗ trợ thiết thực",
        completedEasy: [],
        completedMedium: [],
        completedHard: [],
      },
    },
    oneTimeTasks: [],
    journals: {},
  };

  state = freshState;
  saveToStorage();

  simulatedDateOffset = 0;
  closeConfirmModal();
  showToast(
    "Khởi tạo thử thách 50 ngày mới thành công! Chúc bạn kiên định! 💪",
  );

  switchTab("dashboard");
}

function simulateNextDay() {
  simulatedDateOffset++;
  renderDashboard();
  renderTodayTasks();
  renderCalendar();

  showToast("⏳ Đã tua thời gian giả lập qua ngày hôm sau");
}

function resetSimulation() {
  simulatedDateOffset = 0;
  renderDashboard();
  renderTodayTasks();
  renderCalendar();

  showToast("⏱️ Đã đặt thời gian về đúng thực tế!");
}

// INITIAL SETUP
window.onload = function () {
  loadState();
  switchTab("dashboard");
};
