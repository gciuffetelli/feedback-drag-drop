/* -------------------------------
   FEEDBACK ITEM BANK (10 ITEMS)
--------------------------------*/

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
    issuesPresent: ["Lacks examples", "Likely defensiveness"]
  },
  {
    text: "Good presentation, but be more confident.",
    issuesPresent: ["Personality-focused", "Vague language", "Lacks guidance"]
  }
];

/* -------------------------------
   ALL POSSIBLE ISSUE LABELS
--------------------------------*/

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

/* -------------------------------
   STATE VARIABLES
--------------------------------*/

let currentIndex = 0;
let draggedItem = null;
let cumulativeCorrect = 0;
let cumulativeTotal = feedbackItems.length * allLabels.length;

/* -------------------------------
   DOM REFERENCES
--------------------------------*/

const feedbackText = document.getElementById("feedbackText");
const dragItemsContainer = document.getElementById("dragItems");
const dropZones = document.querySelectorAll(".drop-zone");
const feedbackBox = document.getElementById("feedback");
const counter = document.getElementById("counter");
const checkBtn = document.getElementById("checkAnswers");
const nextBtn = document.getElementById("nextItem");

/* -------------------------------
   LOAD CURRENT ITEM
--------------------------------*/

function loadItem() {
  feedbackBox.classList.add("hidden");
  checkBtn.disabled = false;
  nextBtn.disabled = true;

  counter.textContent = `Item ${currentIndex + 1} of ${feedbackItems.length}`;
  feedbackText.textContent = `“${feedbackItems[currentIndex].text}”`;

  dragItemsContainer.innerHTML = "";
  dropZones.forEach(zone =>
    zone.querySelectorAll(".drag-item").forEach(i => i.remove())
  );

  allLabels.forEach(label => {
    const div = document.createElement("div");
    div.className = "drag-item";
    div.textContent = label;
    div.draggable = true;
    div.dataset.correct = feedbackItems[currentIndex].issuesPresent.includes(label)
      ? "present"
      : "not-present";

    div.addEventListener("dragstart", () => draggedItem = div);
    div.addEventListener("dragend", () => draggedItem = null);

    dragItemsContainer.appendChild(div);
  });
}

/* -------------------------------
   DROP ZONE BEHAVIOR
--------------------------------*/

dropZones.forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());
  zone.addEventListener("drop", () => {
    if (draggedItem) zone.appendChild(draggedItem);
  });
});

/* -------------------------------
   CHECK ANSWERS
--------------------------------*/

checkBtn.addEventListener("click", () => {
  let correctThisItem = 0;

  document.querySelectorAll(".drag-item").forEach(item => {
    item.classList.remove("correct", "incorrect");
    const placed = item.parentElement.dataset.zone;
    const actual = item.dataset.correct;

    if (
      (placed === "present" && actual === "present") ||
      (placed === "not-present" && actual === "not-present")
    ) {
      item.classList.add("correct");
      correctThisItem++;
    } else {
      item.classList.add("incorrect");
    }
  });

  cumulativeCorrect += correctThisItem;

  feedbackBox.classList.remove("hidden");
  feedbackBox.innerHTML = `
    <strong>${correctThisItem} of ${allLabels.length} correct for this item.</strong>
    <p>
      Cumulative score: <strong>${cumulativeCorrect}</strong>
      out of <strong>${cumulativeTotal}</strong>
    </p>
    <p>
      Notice recurring issues: vague wording, judgment, and missing guidance
      consistently weaken feedback.
    </p>
  `;

  checkBtn.disabled = true;
  nextBtn.disabled = false;
});

/* -------------------------------
   NEXT ITEM / FINAL SUMMARY
--------------------------------*/

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex < feedbackItems.length) {
    loadItem();
  } else {
    const percentage = Math.round(
      (cumulativeCorrect / cumulativeTotal) * 100
    );

    feedbackText.textContent = "✅ You’ve completed all critique items.";
    dragItemsContainer.innerHTML = "";
    dropZones.forEach(zone => zone.innerHTML = "<h2>Complete</h2>");
    counter.textContent = "";

    feedbackBox.classList.remove("hidden");
    feedbackBox.innerHTML = `
      <h3>Final Score</h3>
      <p><strong>${cumulativeCorrect}</strong> out of <strong>${cumulativeTotal}</strong> correct</p>
      <p>Overall accuracy: <strong>${percentage}%</strong></p>
      <p>
        Strong feedback judgment comes from recognizing patterns—not memorizing phrases.
      </p>
    `;

    checkBtn.disabled = true;
    nextBtn.disabled = true;
  }
});

/* -------------------------------
   INITIAL LOAD
--------------------------------*/

loadItem();
