const draggables = document.querySelectorAll(".drag-item");
const dropZones = document.querySelectorAll(".drop-zone");
const feedback = document.getElementById("feedback");
const checkButton = document.getElementById("checkAnswers");

let draggedItem = null;

draggables.forEach(item => {
  item.addEventListener("dragstart", () => {
    draggedItem = item;
    setTimeout(() => item.classList.add("dragging"), 0);
  });

  item.addEventListener("dragend", () => {
    item.classList.remove("dragging");
    draggedItem = null;
  });
});

dropZones.forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());

  zone.addEventListener("drop", () => {
    if (draggedItem) {
      zone.appendChild(draggedItem);
    }
  });
});

checkButton.addEventListener("click", () => {
  let correct = 0;
  let total = draggables.length;

  draggables.forEach(item => {
    const parentZone = item.parentElement.dataset.zone;
    const correctZone = item.dataset.correct;

    item.classList.remove("correct", "incorrect");

    if (
      (parentZone === "present" && correctZone === "present") ||
      (parentZone === "not-present" && correctZone === "not-present")
    ) {
      item.classList.add("correct");
      correct++;
    } else {
      item.classList.add("incorrect");
    }
  });

  feedback.classList.remove("hidden");
  feedback.innerHTML = `
    <strong>${correct} out of ${total} correct.</strong>
    <p>
      Effective feedback is specific, behavior‑focused, and actionable.
      Vague or judgmental language reduces clarity and can trigger defensiveness.
    </p>
  `;
});
