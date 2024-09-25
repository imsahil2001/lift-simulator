class Queue {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  remove() {
    if (this.items.length == 0)
      return "empty queue";
    else
      return this.items.shift();
  }

  size() {
    return this.items.length;
  }

  front() {
    return this.items[0];
  }

  printQueue() {
    let str = "";
    for (let i = 0; i < this.items.length; i++)
      str += this.items[i] + " ";
    return str;
  }
}

class Lift {
  constructor(id) {
    this.id = id;
    this.state = "free";  // free, moving, dooranimation
    this.currentFloor = 1;
    this.destinationFloor = -1;
    this.previousFloor = 1;
    this.translateY = 0;
    this.btnDirect = ""
  }

  getCurrentFloor() {
    return this.currentFloor;
  }

  getDestinationFloor() {
    return this.destinationFloor;
  }

  getState() {
    return this.state;
  }

  getId() {
    return this.id;
  }

  getPreivousFloor() {
    return this.previousFloor;
  }

  getTranslateY() {
    return this.translateY;
  }

  getBtnDirect() {
    return this.btnDirect;
  }

  setState(state) {
    this.state = state;
  }

  setCurrentFloor(floorNo) {
    this.currentFloor = floorNo;
  }

  setDestinationFloor(floorNo) {
    this.destinationFloor = floorNo;
  }

  setPreviousFloor(floorNo) {
    this.previousFloor = floorNo;
  }

  setTranslateY(translateY) {
    this.translateY = translateY;
  }

  setBtnDirect(btnDirect) {
    this.btnDirect = btnDirect;
  }

  removeDestinationFloor() {
    this.destinationFloor = -1;
  }

  print() {
    let str = "";
    str = `id->${this.id}, currentFloor->${this.currentFloor}, destinationFloor${this.destinationFloor}`;
    return str;
  }
}

class Floor {
  constructor(id) {
    this.id = id;
    this.upBtnDisabled = false;
    this.downBtnDisabled = false;
  }

  getId() {
    return this.id;
  }

  getBtnUp() {
    return this.upBtnDisabled;
  }
  getDownUp() {
    return this.downBtnDisabled;
  }

  setId(id) {
    this.id = id;
  }

  setUpBtnDisable(upBtnDisabled) {
    document.querySelector(`#up-${this.id}`).disabled = upBtnDisabled;
    this.upBtnDisabled = upBtnDisabled;
  }
  setDownBtnDisable(downBtnDisabled) {
    document.querySelector(`#down-${this.id}`).disabled = downBtnDisabled;
    this.downBtnDisabled = downBtnDisabled;
  }


}

const btn = document.querySelector(".submitBtn");
let floorElem = document.getElementById("floorsdata");
const lift = document.getElementById("liftsdata");
const liftForm = document.getElementById("liftForm");
const mainFloorBody = document.querySelector(".mainFloorBody");
let floor = 0;
let lifts = 0;
let liftPresenceAr = [];
let interval;
let liftQueueMap = new Map();
let liftObjArr = [];
let inputs = document.getElementsByTagName("input");
let resetBtn = document.querySelector(".redoBtn");
let mainRequestQueue = new Queue();
let floorArr = [];


/** Preventing user to enter any character value */
Array.from(inputs).forEach(input => {
  input.addEventListener("keypress", (e) => {
    let regex = /^[0-9]*$/;
    let char = String.fromCharCode(e.keyCode);
    if (!regex.test(char)) {
      e.preventDefault();
      return;
    }

  })
});


btn.addEventListener("click", (event) => {
  if (mainFloorBody.innerHTML !== "") {
    alert("Please reset before starting a new simulation!");
    return;
  }

  mainFloorBody.innerHTML = "";
  event.preventDefault();
  // console.log(`btn pressed`);
  // console.log(typeof floorElem.value);


  if ((floorElem.value === "" && lift.value === "") || floorElem.value === "" || lift.value === "") {
    alert("Floors and lifts are required for Simulation to run");
    return;
  }

  floor = parseInt(floorElem.value.trim());
  lifts = parseInt(lift.value.trim());
  if (floor == 0 && lifts == 0 || floor == 0) {
    alert("No Lifts are required for 0 floors");
    return;
  } else if (lifts == 0) {
    alert("Lifts are required for simulation to get executed");
    return;
  }
  console.log(`${floor}`);

  // floorBuilding(floor, lifts);
  creatingFloors(floor, lifts);
  // liftForm.reset();
});

function creatingFloors(floor, lifts) {
  let floordiv;
  let floorContainer;
  while (floor--) {
    liftPresenceAr.push(-1);


    floorContainer = document.createElement("div");
    floorContainer.className = "floor";

    // floor formualation
    let actualfloor = document.createElement("div");
    actualfloor.className = "actualfloor";
    actualfloor.innerHTML = `Floor ${floor + 1}`;

    // button formulation
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");
    let btnUp = document.createElement("button");
    let btnDown = document.createElement("button");
    btnUp.textContent = "UP";
    btnDown.textContent = "DOWN";
    btnUp.setAttribute("floor", floor + 1);
    btnDown.setAttribute("floor", floor + 1);
    btnUp.classList.add("floor-btn");
    btnDown.classList.add("floor-btn");;
    btnUp.setAttribute("id", `up-${floor + 1}`);
    btnDown.setAttribute("id", `down-${floor + 1}`);


    if (parseInt(floorElem.value) === 1 || floor !== parseInt(floorElem.value) - 1)
      buttonContainer.appendChild(btnUp);

    if (floor !== 0)
      buttonContainer.appendChild(btnDown);

    floorContainer.appendChild(actualfloor);
    floorContainer.appendChild(buttonContainer);
    mainFloorBody.appendChild(floorContainer);
  }
  liftPresenceAr.push(-1);


  floorContainer.classList.add("groundFloor");

  let liftContainer = document.createElement("div");
  liftContainer.classList.add("liftContainer");



  // Lift creation
  for (let i = 1; i <= lifts; i++) {
    liftQueueMap.set(i, new Queue());
    liftObjArr.push(new Lift(i));
    // console.log(`lift enetered`);
    let liftbox = document.createElement("div");
    liftbox.className = "lift";
    liftbox.setAttribute("state", "free");
    liftbox.setAttribute("currentFloor", 1);
    liftbox.setAttribute("destinationFloor", 0);
    liftbox.setAttribute("id", `lift-${i}`);

    //adding doors
    let leftDoor = document.createElement("span");
    leftDoor.classList.add("left-door");
    leftDoor.setAttribute("left-door-id", i);
    let rightDoor = document.createElement("span");
    rightDoor.classList.add("right-door");
    rightDoor.setAttribute("right-door-id", i);


    //adding lift counter
    let counter = document.createElement("span");
    counter.classList.add("counter");
    counter.setAttribute("id", `counter-${i}`);
    counter.innerText = i;

    liftbox.appendChild(leftDoor);
    liftbox.appendChild(rightDoor);
    liftbox.appendChild(counter);
    liftContainer.appendChild(liftbox);

    // intializing floor arr 
  }
  floorArr.push(new Floor(0))
  for (let i = 1; i <= parseInt(floorElem.value); i++) {
    floorArr.push(new Floor(i));
  }

  floorContainer.appendChild(liftContainer);
  removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);
}

mainFloorBody.addEventListener("click", (event) => {
  // console.log(`${event.target.tagName}`);
  if ((event.target.tagName === "BUTTON")) {
    // console.log(event.target);
    moveLifts(parseInt(event.target.getAttribute("floor")), event.target.getAttribute("id"));
  }
});


// objects based moving lifts function 

function moveLifts(floorNo, btnDirection) {
  if (liftPresenceAr[floorNo] !== -1) {
    console.log(`Lift no --> ${liftPresenceAr[floorNo]} already present`);

    let liftObj = liftObjArr[liftPresenceAr[floorNo] - 1];
    document.querySelector(`#counter-${liftObj.getId()}`).innerHTML = liftObj.getCurrentFloor();
    let freelift = document.querySelector(`#lift-${liftObj.getId()}`);
    let doors = doorAnimation(freelift);
    // liftObj.setDestinationFloor(-1);
    liftObj.setState("doorAnimating");

    // removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);
    setTimeout(() => {
      doors[0].classList.remove("left-door-animation");
      doors[1].classList.remove("right-door-animation");
      liftObj.setState("free");
      liftObj.setState("free");
    }, 5000);

    return
  };

  let nearestLiftId = findNearestLift(floorNo, liftObjArr, btnDirection);
  let liftObj = liftObjArr[nearestLiftId - 1];

  if (nearestLiftId !== - 1 && liftObjArr[nearestLiftId - 1].getState() == "free") {
    liftPresenceAr[liftObj.getPreivousFloor()] = -1;

    if (btnDirection.includes("up")) {
      floorArr[floorNo].setUpBtnDisable(true);
      liftObj.setBtnDirect("up")
    } else {
      floorArr[floorNo].setDownBtnDisable(true);
      liftObj.setBtnDirect("down")
    }
    liftObj.setState("moving");

    console.log(`Free lift available initiating lift-${liftObj.getId()}`);

    // document.querySelector(`#${btnDirection}`).disabled = true;



    // Logic to move the Lift to the desired Floor
    // let liftCurrentFloor = allLifts[i].getAttribute("currentFloor");
    let liftCurrentFloor = liftObj.getCurrentFloor();

    /**
     * moving lift ka purana position remove krna cuz new position destination wala ban chuka hai
     */
    // removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);

    // console.log(allLifts[i]);
    // let currentLiftQueue = liftQueueMap.get(liftObj.getId());
    let totalDuration = 2 * Math.abs(floorNo - liftCurrentFloor);
    // console.log(`duration --> ${totalDuration}`);
    let direction = "up";
    if (floorNo > liftCurrentFloor) {
      // currentLiftQueue.items.sort((a, b) => a - b); // agr chota floor milta hai raste mein to lift ko sahi floor par rokne ke liye
      // console.log(`queue data --> ${currentLiftQueue.printQueue()}`)
    }
    else
      direction = "down";

    console.log(`${direction}`);
    // currentLiftQueue.add(floorNo);

    let freelift = document.querySelector(`#lift-${liftObj.getId()}`);
    // freelift.setAttribute("state", "moving");

    // freelift.setAttribute("destinationFloor", currentLiftQueue.front());
    liftObj.setDestinationFloor(floorNo);

    let test = "";
    if (direction === "up") {
      freelift.style.transform = `translateY(${(-80 * (floorNo - liftCurrentFloor)) + liftObj.getTranslateY()}px)`;
      liftObj.setTranslateY(
        (-80 * (floorNo - liftCurrentFloor)) + liftObj.getTranslateY()
      );
      test = `translateY(${-80 * (floorNo - 1)}px)`;
    }
    else {
      freelift.style.transform = `translateY(${(80 * (liftCurrentFloor - floorNo)) + liftObj.getTranslateY()}px)`;
      liftObj.setTranslateY(
        (80 * (liftCurrentFloor - floorNo)) + liftObj.getTranslateY()
      );
      test = `translateY(${80 * (floorNo - liftCurrentFloor)}px)`;
    }
    console.log(`${test}`);

    freelift.style.transition = `all ${2 * Math.abs(floorNo - liftCurrentFloor)}s`;
    freelift.style.backgroundColor = `blue`;


    let updatedCurrentFloorInt;
    const updateCurrentFloor = (() => {
      updatedCurrentFloorInt = setInterval(() => {
        if (direction === "up")
          liftCurrentFloor = Math.min(liftCurrentFloor + 1, floorNo)
        else
          liftCurrentFloor = Math.max(liftCurrentFloor - 1, floorNo)
        // freelift.setAttribute("currentFloor", liftCurrentFloor);
        liftObj.setCurrentFloor(liftCurrentFloor);
        if (liftCurrentFloor == floorNo)
          clearInterval(updatedCurrentFloorInt)
      }, 2000);
    });

    updateCurrentFloor();

    // updateLiftPosition(freelift, currentLiftQueue,
    // removingLiftPresenceFromFloorInArr, allLifts, floorNo, liftPresenceAr);

    /* 
    logic to timely remove the busy state from the lift 
    and adding the presence in the arr that lift is there
    */
    setTimeout(() => {
      if (liftObj.getState() == "moving") {
        liftObj.setCurrentFloor(floorNo);

        liftObj.setState("doorAnimating");
        let doors = doorAnimation(freelift);

        liftPresenceAr[floorNo] = parseInt(liftObj.getId());
        liftCurrentFloor[liftObj.getPreivousFloor()] = -1;
        removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);

        document.querySelector(`#counter-${liftObj.getId()}`).innerHTML = liftObj.getCurrentFloor();


        // if (liftObj.getBtnDirect() == "up")
        //   document.querySelector(`#up-${liftObj.getCurrentFloor()}`).disabled = false;
        // else
        //   document.querySelector(`#down-${liftObj.getCurrentFloor()}`).disabled = false;



        // freelift.setAttribute("state", "doorAnimating");
        // freelift.setAttribute("currentFloor", floorNo);

        console.log(liftPresenceAr);
        // currentLiftQueue.remove();
        // mainRequestQueue.remove();
        liftObj.setPreviousFloor(liftObj.getCurrentFloor());
        liftObj.setDestinationFloor(-1);


        setTimeout(() => {
          doors[0].classList.remove("left-door-animation");
          doors[1].classList.remove("right-door-animation");
          liftObj.setState("free");

          if (liftObj.getBtnDirect() === "up") {
            floorArr[floorNo].setUpBtnDisable(false);
            liftObj.setBtnDirect("up")
          } else if ((liftObj.getBtnDirect() === "down")) {
            floorArr[floorNo].setDownBtnDisable(false);
            liftObj.setBtnDirect("down")
          }

          if (mainRequestQueue.size() > 0)
            updateLiftPos(mainRequestQueue, mainRequestQueue.front(), liftPresenceAr, liftObj, liftObjArr);
          // if (currentLiftQueue.size() > 0)
          //   updateLiftPos(currentLiftQueue, currentLiftQueue.front(), liftPresenceAr, liftObj, liftObjArr);
        }, 5000);

      }
    }, totalDuration * 1000);
  } else {
    //
    // console.log(`NO FREE LIFT adding floorNO-${floorNo} in queue lift-${liftObj.getId()}`);
    // let currentLiftQueue = liftQueueMap.get(liftObj.getId());
    // currentLiftQueue.add(floorNo);
  }

}



function removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr) {

  //reset the liftpresenceArr
  liftPresenceAr.fill(-1);

  for (let i = 0; i < liftObjArr.length; i++) {
    liftPresenceAr[liftObjArr[i].getCurrentFloor()] = liftObjArr[i].getId();
  }

  //nearest lift 1st floor pr assign nhi hoti or line mein nearest ke next wale lift ko 1floor assign hota h 
  //jo ki technically dekha jaye sahi nhi hai
  for (let i = 0; i < liftObjArr.length; i++) {
    if (liftObjArr[i].getCurrentFloor() == 1 && liftObjArr[i].getState() == "free")
      liftPresenceAr[1] = Math.min(liftPresenceAr[1], liftObjArr[i].getId());
  }

}


// lift obj based update lift position
function updateLiftPos(mainRequestQueue, floorNo, liftPresenceAr, liftObj, liftObjArr) {
  mainRequestQueue.remove();
  /**
   * moving lift ka purana position remove krna cuz new position destination wala ban chuka hai
   */
  // Logic to move the Lift to the desired Floor
  // let liftCurrentFloor = allLifts[i].getAttribute("currentFloor");
  let liftCurrentFloor = liftObj.getCurrentFloor();

  /**
   * moving lift ka purana position remove krna cuz new position destination wala ban chuka hai
   */
  // removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);

  // console.log(allLifts[i]);

  let totalDuration = 2 * Math.abs(floorNo - liftCurrentFloor);
  // console.log(`duration --> ${totalDuration}`);
  let direction = "up";
  if (floorNo > liftCurrentFloor) {
    // currentLiftQueue.items.sort((a, b) => a - b); // agr chota floor milta hai raste mein to lift ko sahi floor par rokne ke liye
    // console.log(`queue data --> ${currentLiftQueue.printQueue()}`)
  }
  else
    direction = "down";


  let freelift = document.querySelector(`#lift-${liftObj.getId()}`);
  // freelift.setAttribute("state", "moving");
  liftObj.setState("moving")
  // freelift.setAttribute("destinationFloor", currentLiftQueue.front());
  liftObj.setDestinationFloor(floorNo);


  let test = "";
  if (direction === "up") {
    freelift.style.transform = `translateY(${(-80 * (floorNo - liftCurrentFloor)) + liftObj.getTranslateY()}px)`;
    liftObj.setTranslateY(
      (-80 * (floorNo - liftCurrentFloor)) + liftObj.getTranslateY()
    );
    test = `translateY(${-80 * (floorNo - 1)}px)`;
  }
  else {
    freelift.style.transform = `translateY(${(80 * (liftCurrentFloor - floorNo)) + liftObj.getTranslateY()}px)`;
    liftObj.setTranslateY(
      (80 * (liftCurrentFloor - floorNo)) + liftObj.getTranslateY()
    );
    test = `translateY(${80 * (floorNo - liftCurrentFloor)}px)`;
  }
  console.log(`${test}`);

  freelift.style.transition = `all ${2 * Math.abs(floorNo - liftCurrentFloor)}s`;
  freelift.style.backgroundColor = `blue`;


  let updatedCurrentFloorInt;
  const updateCurrentFloor = (() => {
    updatedCurrentFloorInt = setInterval(() => {
      if (direction === "up")
        liftCurrentFloor = Math.min(liftCurrentFloor + 1, floorNo)
      else
        liftCurrentFloor = Math.max(liftCurrentFloor - 1, floorNo)
      // freelift.setAttribute("currentFloor", liftCurrentFloor);
      liftObj.setCurrentFloor(liftCurrentFloor);
      if (liftCurrentFloor == floorNo)
        clearInterval(updatedCurrentFloorInt)
    }, 2000);
  });

  updateCurrentFloor();

  // updateLiftPosition(freelift, currentLiftQueue,
  // removingLiftPresenceFromFloorInArr, allLifts, floorNo, liftPresenceAr);

  /* 
  logic to timely remove the busy state from the lift 
  and adding the presence in the arr that lift is there
  */
  setTimeout(() => {
    if (liftObj.getState() == "moving") {
      liftObj.setCurrentFloor(floorNo);
      liftObj.setState("doorAnimating");
      let doors = doorAnimation(freelift);

      liftPresenceAr[floorNo] = parseInt(liftObj.getId());
      liftCurrentFloor[liftObj.getPreivousFloor()] = -1;

      removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);
      document.querySelector(`#counter-${liftObj.getId()}`).innerHTML = liftObj.getCurrentFloor();

      // freelift.setAttribute("state", "doorAnimating");
      // freelift.setAttribute("currentFloor", floorNo);

      console.log(liftPresenceAr);
      // currentLiftQueue.remove();
      // mainRequestQueue.remove();
      liftObj.setPreviousFloor(liftObj.getCurrentFloor());
      liftObj.setDestinationFloor(-1);

      setTimeout(() => {
        doors[0].classList.remove("left-door-animation");
        doors[1].classList.remove("right-door-animation");
        liftObj.setState("free");

        console.log(`lift-${liftObj.getId()} id getting free, it should enable ${liftObj.getBtnDirect()} btn`);

        if (liftObj.getCurrentFloor() === 1 || liftObj.getCurrentFloor() === parseInt(floorElem.value)) {
          if (liftObj.getCurrentFloor() === 1) {
            console.log(`lift-${liftObj.getId()} curr floor->${liftObj.getCurrentFloor()}`);
            floorArr[liftObj.getCurrentFloor()].setUpBtnDisable(false);
          } else if ((liftObj.getCurrentFloor() === parseInt(floorElem.value))) {
            console.log(`lift-${liftObj.getId()} curr floor->${liftObj.getCurrentFloor()}`);
            floorArr[liftObj.getCurrentFloor()].setDownBtnDisable(false);
          }
        }
        else {
          if (liftObj.getBtnDirect() === "up") {
            console.log(`lift-${liftObj.getId()} curr floor->${liftObj.getCurrentFloor()}`);
            floorArr[liftObj.getCurrentFloor()].setUpBtnDisable(false);
          } else if (liftObj.getBtnDirect() === "down") {
            console.log(`lift-${liftObj.getId()} curr floor->${liftObj.getCurrentFloor()}`);
            floorArr[liftObj.getCurrentFloor()].setDownBtnDisable(false);
          }
        }

        console.log(`lift-${liftObj.getId()} has reached curr floor->${liftObj.getCurrentFloor()}, remvoing btn dir ${liftObj.getBtnDirect()}`);
        // liftObj.setBtnDirect("");

        if (mainRequestQueue.size() > 0)
          updateLiftPos(mainRequestQueue, mainRequestQueue.front(), liftPresenceAr, liftObj, liftObjArr);
      }, 5000);

    }
  }, totalDuration * 1000);
}




function findNearestLift(destinationFloor, liftObjArr, btnDirection) {
  let minDistance = Infinity;
  let nearestLiftId = -1;

  for (const lift of liftObjArr) {
    let distance;
    if (lift.getState() === "free") {
      distance = Math.abs(lift.getCurrentFloor() - destinationFloor);
    }
    // else {
    //   // If the lift is moving, consider its destination floor
    //   distance = Math.abs(lift.getDestinationFloor() - destinationFloor);
    // }

    if (distance < minDistance) {
      minDistance = distance;
      nearestLiftId = lift.getId();
    }
  }
  if (nearestLiftId !== -1)
    return nearestLiftId;

  // for (const lift of liftObjArr) {
  //   let distance;
  //   if (lift.getState() === "doorAnimating" && lift.getState() !== "free") {
  //     distance = Math.abs(lift.getCurrentFloor() - destinationFloor);
  //   }

  //   if (distance < minDistance) {
  //     minDistance = distance;
  //     nearestLiftId = lift.getId();
  //   }
  // }

  mainRequestQueue.add(destinationFloor);
  if (btnDirection.includes("up"))
    floorArr[destinationFloor].setUpBtnDisable(true);
  else if (btnDirection.includes("down"))
    floorArr[destinationFloor].setDownBtnDisable(true);

  return nearestLiftId;
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




function doorAnimation(lift) {
  let leftDoor = lift.children[0];
  let rightDoor = lift.children[1];

  leftDoor.classList.add("left-door-animation");
  rightDoor.classList.add("right-door-animation");

  return [leftDoor, rightDoor];
}


function intializeState() {
  floor = 0;
  lifts = 0;
  liftPresenceAr = [];
  interval;
  liftQueueMap = new Map();
  liftObjArr = [];
}

resetBtn.addEventListener("click", () => {
  intializeState();
  mainFloorBody.innerHTML = "";
})