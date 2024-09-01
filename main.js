const btn = document.querySelector(".submitBtn");
let floorElem = document.getElementById("floorsdata");
const lift = document.getElementById("liftsdata");
const liftForm = document.getElementById("liftForm");
const mainFloorBody = document.querySelector(".mainFloorBody");
let floor = 0;
let lifts = 0;

btn.addEventListener("click", (event) => {
  event.preventDefault();
  // console.log(`btn pressed`);
  // console.log(typeof floorElem.value);

  floor = parseInt(floorElem.value.trim());
  lifts = parseInt(lift.value.trim());
  console.log(`${floor}`);

  // floorBuilding(floor, lifts);
  creatingFloors(floor, lifts);
  liftForm.reset();
});

function creatingFloors(floor, lifts) {
  let floordiv;
  let floorContainer;
  while (floor--) {
    floorContainer = document.createElement("div");
    floorContainer.className = "floor";

    let actualfloor = document.createElement("div");
    actualfloor.className = "actualfloor";
    actualfloor.innerHTML = `Floor ${floor + 1}`;

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");
    let btnUp = document.createElement("button");
    let btnDown = document.createElement("button");
    btnUp.textContent = "UP";
    btnDown.textContent = "DOWN";
    btnUp.setAttribute("floor", floor + 1);
    btnDown.setAttribute("floor", floor + 1);
    buttonContainer.appendChild(btnUp);
    buttonContainer.appendChild(btnDown);

    floorContainer.appendChild(actualfloor);
    floorContainer.appendChild(buttonContainer);
    mainFloorBody.appendChild(floorContainer);
  }

  floorContainer.classList.add("groundFloor");

  let liftContainer = document.createElement("div");
  liftContainer.classList.add("liftContainer");
  while (lifts--) {
    console.log(`lift enetered`);
    let liftbox = document.createElement("div");
    liftbox.className = "lift";
    liftbox.setAttribute("state", "free");
    liftbox.setAttribute("currentFloor", 1);

    liftContainer.appendChild(liftbox);
  }
  floorContainer.appendChild(liftContainer);
}

mainFloorBody.addEventListener("click", (event) => {
  if ((event.target.tagName = "BUTTON")) {
    console.log(event.target);
    moveLifts(parseInt(event.target.getAttribute("floor")));
  }
});

function moveLifts(floorNo) {
  let allLifts = document.querySelectorAll(".lift");
  for (let i = 0; i < allLifts.length; i++) {
    if (allLifts[i].getAttribute("state") == "free") {
      console.log(allLifts[i]);
      let freelift = allLifts[i];
      freelift.setAttribute("state", "busy");
      freelift.style.transform = `translateY(${-80 * (floorNo - 1)}px)`;
      freelift.style.transition = `all ${
        2 * Math.abs(floorNo - freelift.getAttribute("currentFloor"))
      }s`;
      freelift.style.backgroundColor = `blue`;
      setTimeout(() => {
        if (freelift.getAttribute("state") == "busy") {
          freelift.setAttribute("state", "free");
          freelift.setAttribute("currentFloor", floorNo);
        }
      }, 2000);
      break;
    }
  }
}

/*
function floorBuilding(floor, lift) {
  console.log(`called`);
  let floorsHtml;

  floorsHtml = `
      <table>
      <tbody>
  `;
  while (floor--) {
    floorsHtml += `
      <tr class="floor-${floor + 1}>
        <td style="padding: 30px border: 1px solid red">Floor ${floor + 1}
        </td>
        <td style="padding: 30px; border: 1px solid red">
            <button class="up-btn-${floor + 1}">up</button>
            <br />
            <button class="down-btn-${floor + 1}">down</button>    
            <hr />        
        </td>
      </tr>
    `;
    // console.log(`${floor}`);
    // console.log(`${floorsHtml}`);
  }
  floorsHtml += `</tbody></table>`;

  mainFloorBody.innerHTML = floorsHtml;
}

function liftstart(event) {
  console.log(event);
}
*/
