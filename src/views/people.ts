import {
  allEvidence,
  allPeople,
  allLocations,
  setCurrentPeopleTab,
} from "../state.js";

import { evidenceMentionsPerson } from "../utils.js";

import { renderEvidenceList } from "./evidence.js";

import type { PeopleTab } from "../state.js";

import type { Person } from "../types.js";

// ---------------------------------------------------------------------
// PEOPLE & LOCATIONS
// ---------------------------------------------------------------------

export function switchPeopleTab(tab: PeopleTab) {
  setCurrentPeopleTab(tab);

  var peoplePanel = document.getElementById("peoplePanel");
  var locationsPanel = document.getElementById("locationsPanel");
  var peopleTabBtn = document.getElementById("tabPeopleBtn");
  var locationsTabBtn = document.getElementById("tabLocationsBtn");

  if (!peoplePanel || !locationsPanel || !peopleTabBtn || !locationsTabBtn) {
    throw new Error("Could not find people/location tab elements.");
  }

  if (tab === "people") {
    peoplePanel.classList.remove("hidden");
    locationsPanel.classList.add("hidden");

    peopleTabBtn.classList.add("active");
    locationsTabBtn.classList.remove("active");
  } else {
    peoplePanel.classList.add("hidden");
    locationsPanel.classList.remove("hidden");

    peopleTabBtn.classList.remove("active");
    locationsTabBtn.classList.add("active");
  }
}

function countEvidenceForPerson(person: Person): number {
  var count = 0;

  for (const evidence of allEvidence) {
    if (evidenceMentionsPerson(evidence, person)) {
      count++;
    }
  }

  return count;
}

export function renderPeople() {
  var container = document.getElementById("peoplePanel");
  var html = "";

  if (!container) {
    throw new Error("Could not find peoplePanel.");
  }

  for (const person of allPeople) {
    var count = countEvidenceForPerson(person);

    html += '<div class="person-card">';

    html += '<div class="person-card-header">';

    html +=
      '<img class="person-avatar" src="' +
      person.avatar +
      '" alt="Portrait of ' +
      person.name +
      '">';

    html +=
      "<div><h3>" +
      person.name +
      '</h3><div class="person-role">' +
      person.role +
      "</div></div>";

    html += "</div>";

    html += "<p><strong>Speciality:</strong> " + person.speciality + "</p>";

    html += "<ul>";

    for (var r = 0; r < person.responsibilities.length; r++) {
      html += "<li>" + person.responsibilities[r] + "</li>";
    }

    html += "</ul>";

    html +=
      '<div class="person-statement">&ldquo;' +
      person.statement +
      "&rdquo;</div>";

    html +=
      "<p>" +
      count +
      " related evidence item" +
      (count === 1 ? "" : "s") +
      " &mdash; ";

    html +=
      '<button type="button" class="evidence-count-link" data-person-id="' +
      person.id +
      '">view</button></p>';

    html += "</div>";
  }

  container.innerHTML = html;

  var links = container.querySelectorAll(".evidence-count-link");
  const filterPerson = document.getElementById("filterPerson");

  if (!(filterPerson instanceof HTMLSelectElement)) {
    throw new Error("Could not find filterPerson select.");
  }

  for (const link of links) {
    link.addEventListener("click", function () {
      const personId = link.getAttribute("data-person-id");

      if (!personId) {
        return;
      }

      filterPerson.value = personId;

      // Equivalent to the old navigateTo("evidence"):
      // navigateTo only changed window.location.hash.
      window.location.hash = "evidence";

      setTimeout(function () {
        renderEvidenceList();
      }, 0);
    });
  }

}




export function renderLocations() {
  var container = document.getElementById("locationsPanel");

  if (!container) {
    throw new Error("Could not find locationsPanel.");
  }

  var html = "";

  for (const loc of allLocations) {

    html += '<div class="location-card">';

    html += "<h3>" + loc.id + " &mdash; " + loc.name + "</h3>";

    html += "<p>" + loc.description + "</p>";

    html += "<p><strong>Contains:</strong></p><ul>";

    for (var c = 0; c < loc.contains.length; c++) {
      html += "<li>" + loc.contains[c] + "</li>";
    }

    html += "</ul></div>";
  }

  container.innerHTML = html;
}
