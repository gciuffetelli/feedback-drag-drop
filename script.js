const feedbackItems = [
  {
    text: "You need to be more professional. This has been an issue lately.",
    issuesPresent: ["Vague language", "Judgmental wording", "Lacks examples"]
  },
  {
    text: "Great job overall, but try to be more proactive.",
    issuesPresent: ["Vague language", "Lacks examples", "Lacks guidance"]
  },
  {
    text: "Your attitude in meetings hasn’t been great.",
    issuesPresent: ["Judgmental wording", "Personality-focused", "Likely defensiveness"]
  },
  {
    text: "You always miss important details.",
    issuesPresent: ["Absolute language", "Judgmental wording", "Lacks examples"]
  },
  {
    text: "You explained the process clearly, but engage the audience more.",
    issuesPresent: ["Vague language", "Lacks guidance"]
  },
  {
    text: "Please respond faster to emails.",
    issuesPresent: ["Lacks context", "Lacks examples"]
  },
  {
    text: "Your communication style needs improvement.",
    issuesPresent: ["Vague language", "Personality-focused", "Lacks guidance"]
  },
  {
    text: "You’re doing fine, just keep pushing yourself.",
    issuesPresent: ["Too general", "Lacks examples", "Not actionable"]
  },
  {
    text: "You didn’t prepare enough for today’s meeting.",
    issuesPresent: ["Lacks examples", "Could trigger defensiveness"]
  },
  {
    text: "Good presentation, but be more confident.",
    issuesPresent: ["Personality-focused", "Vague language", "Lacks guidance"]
  }
];

const allLabels = [
  "Vague language",
  "Judgmental wording",
  "Lacks examples",
  "Lacks guidance",
  "Personality-focused",
  "Absolute language",
  "Likely defensiveness",
  "Too general",
  "Not actionable",
  "Lacks context"
];

let currentIndex = 0;
let draggedItem = null;

const feedbackText = document.getElementById("feedbackText");
const dragItemsContainer = document.getElementById("dragItems");
const dropZones = document.querySelectorAll(".drop-zone");
const feedbackBox = document.getElementById("feedback");
const counter = document.getElementById("counter");
const checkBtn = document.getElementById("checkAnswers");
const nextBtn = document.getElementById("nextItem");

function loadItem() {
  feedbackBox.classList.add("hidden");
  nextBtn.disabled = true;

  counter.textContent = `Item ${currentIndex + 1} of ${feedbackItems.length}`;
  feedbackText.textContent = `“${feedbackItems[currentIndex].text}”`;

  dragItemsContainer.innerHTML = "";
  dropZones.forEach(zone => zone.querySelectorAll(".drag-item").forEach(i => i.remove()));

  allLabels.forEach(label => {
    const div = document.createElement("div");
    div.className = "drag-item";
    div.textContent = label;
    div.draggable = true;
    div.dataset.correct = feedbackItems[currentIndex].issuesPresent.includes(label)
      ? "present"
      : "not-present";
    addDragEvents(div);
    dragItemsContainer.appendChild(div);
  });
}

function addDragEvents(item) {
  item.addEventListener("dragstart", () => draggedItem = item);
  item.addEventListener("dragend", () => draggedItem = null);
}

dropZones.forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());
  zone.addEventListener("drop", () => {
    if (draggedItem) zone.appendChild(draggedItem);
  });
});

checkBtn.addEventListener("click", () => {
  let correct = 0;
  const total = allLabels.length;

  document.querySelectorAll(".drag-item").forEach(item => {
    item.classList.remove("correct", "incorrect");
    const placed = item.parentElement.dataset.zone;
    const actual = item.dataset.correct;

    if (
      (placed === "present" && actual === "present") ||
      (placed === "not-present" && actual === "not-present")
    ) {
      item.classList.add("correct");
      correct++;
    } else {
      item.classList.add("incorrect");
    }
  });

  feedbackBox.classList.remove("hidden");
  feedbackBox.innerHTML = `
    <strong>${correct} of ${total} correctly sorted.</strong>
    <p>
      Notice the patterns: vague wording, judgments, and missing guidance
      consistently reduce the usefulness of feedback.
    </p>
  `;
  nextBtn.disabled = false;
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < feedbackItems.length) {
    loadItem();
  } else {
    feedbackText.textContent = "✅ You’ve completed all critique items.";
    dragItemsContainer.innerHTML = "";
    dropZones.forEach(zone => zone.innerHTML = "<h2>Done</h2>");
    counter.textContent = "";
    checkBtn.disabled = true;
    nextBtn.disabled = true;
  }
});

loadItem();
