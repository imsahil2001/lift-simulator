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
  console.log(`${input}`);
});


btn.addEventListener("click", (event) => {
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
  liftForm.reset();
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


    if (floor !== floorElem.value - 1)
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
    console.log(`lift enetered`);
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
  }

  // console.log(`${liftObjArr[0].print()} ${liftObjArr[1].print()} ${liftObjArr[2].print()}`);

  floorContainer.appendChild(liftContainer);
  removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);
}

mainFloorBody.addEventListener("click", (event) => {
  if ((event.target.tagName = "BUTTON")) {
    // console.log(event.target);
    moveLifts(parseInt(event.target.getAttribute("floor")));
  }
});


// attribute based moving lifts function 

// function moveLifts(floorNo) {
//   let allLifts = document.querySelectorAll(".lift");

//   // Need to check first is there any lift present at that floor
//   console.log(`Lift no --> ${liftPresenceAr[floorNo]} already present`);
//   if (liftPresenceAr[floorNo] != -1) return;

//   // Logic to move the Lift to the desired Floor
//   for (let i = 0; i < allLifts.length; i++) {

//     // let liftCurrentFloor = allLifts[i].getAttribute("currentFloor");
//     let liftCurrentFloor = liftObjArr[i].getCurrentFloor();

//     if (allLifts[i].getAttribute("state") == "free" || allLifts[i].getAttribute("state") == "moving") {

//       /**
//        * moving lift ka purana position remove krna cuz new position destination wala ban chuka hai
//        */
//       removingLiftPresenceFromFloorInArr(allLifts, allLifts[i], floorNo, liftPresenceAr);

//       // console.log(allLifts[i]);
//       let currentLiftQueue = liftQueueMap.get(parseInt(allLifts[i].getAttribute("id")));
//       let totalDuration = 2 * Math.abs(floorNo - liftCurrentFloor);
//       console.log(`duration --> ${totalDuration}`);
//       if (floorNo > parseInt(allLifts[i].getAttribute("currentFloor"))) {
//         currentLiftQueue = liftQueueMap.get(parseInt(allLifts[i].getAttribute("id")));
//         currentLiftQueue.add(floorNo);
//         currentLiftQueue.items.sort((a, b) => a - b); // agr chota floor milta hai raste mein to lift ko sahi floor par rokne ke liye
//         console.log(`queue data --> ${currentLiftQueue.printQueue()}`)
//       }
//       else
//         continue;

//       let freelift = allLifts[i];
//       let currentFloor = parseInt(freelift.getAttribute("currentFloor"));
//       freelift.setAttribute("state", "moving");
//       freelift.setAttribute("destinationFloor", currentLiftQueue.front());
//       freelift.style.transform = `translateY(${-80 * (floorNo - 1)}px)`;
//       freelift.style.transition = `all ${2 * Math.abs(floorNo - currentFloor)}s`;
//       freelift.style.backgroundColor = `blue`;


//       let updatedCurrentFloorInt;
//       const updateCurrentFloor = (() => {
//         updatedCurrentFloorInt = setInterval(() => {
//           console.log(performance.now());
//           currentFloor = Math.min(currentFloor + 1, floorNo)
//           freelift.setAttribute("currentFloor", currentFloor);
//           if (currentFloor == floorNo)
//             clearInterval(updatedCurrentFloorInt)
//         }, 2000);
//       });

//       updateCurrentFloor();

//       // updateLiftPosition(freelift, currentLiftQueue,
//       // removingLiftPresenceFromFloorInArr, allLifts, floorNo, liftPresenceAr);

//       /* 
//       logic to timely remove the busy state from the lift 
//       and adding the presence in the arr that lift is there
//       */
//       setTimeout(() => {
//         if (freelift.getAttribute("state") == "moving") {
//           freelift.setAttribute("state", "doorAnimating");
//           freelift.setAttribute("currentFloor", floorNo);

//           liftPresenceAr[floorNo] = parseInt(freelift.getAttribute("id"));
//           console.log(liftPresenceAr);
//           currentLiftQueue.remove();
//           let doors = doorAnimation(freelift);

//           removingLiftPresenceFromFloorInArr(allLifts, allLifts[i], floorNo, liftPresenceAr);
//           setTimeout(() => {
//             doors[0].classList.remove("left-door-animation");
//             doors[1].classList.remove("right-door-animation");
//             lift.setAttribute("state", "free");

//             if (currentLiftQueue.size() > 0)
//               updateLiftPos(currentLiftQueue, freelift, currentLiftQueue.front(), allLifts, liftPresenceAr);
//           }, 5000);

//         }
//       }, totalDuration * 1000);

//       break;
//     }
//   }
// }


// objects based moving lifts function 
function moveLifts(floorNo) {
  if (liftPresenceAr[floorNo] != -1) {
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

  let nearestLiftId = findNearestLift(floorNo, liftObjArr);
  let liftObj = liftObjArr[nearestLiftId - 1];

  if (liftObjArr[nearestLiftId - 1].getState() == "free") {

    console.log(`Free lift available initiating lift-${liftObj.getId()}`);

    liftPresenceAr[liftObj.getPreivousFloor()] = -1;
    liftObj.setState("moving");
    // Logic to move the Lift to the desired Floor
    // let liftCurrentFloor = allLifts[i].getAttribute("currentFloor");
    let liftCurrentFloor = liftObj.getCurrentFloor();

    /**
     * moving lift ka purana position remove krna cuz new position destination wala ban chuka hai
     */
    // removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);

    // console.log(allLifts[i]);
    let currentLiftQueue = liftQueueMap.get(liftObj.getId());
    let totalDuration = 2 * Math.abs(floorNo - liftCurrentFloor);
    console.log(`duration --> ${totalDuration}`);
    let direction = "up";
    if (floorNo > liftCurrentFloor) {
      // currentLiftQueue.items.sort((a, b) => a - b); // agr chota floor milta hai raste mein to lift ko sahi floor par rokne ke liye
      console.log(`queue data --> ${currentLiftQueue.printQueue()}`)
    }
    else
      direction = "down";

    console.log(`${direction}`);
    currentLiftQueue.add(floorNo);

    let freelift = document.querySelector(`#lift-${liftObj.getId()}`);
    // freelift.setAttribute("state", "moving");

    // freelift.setAttribute("destinationFloor", currentLiftQueue.front());
    liftObj.setDestinationFloor(currentLiftQueue.front());

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
        console.log(performance.now());
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
        removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);
        document.querySelector(`#counter-${liftObj.getId()}`).innerHTML = liftObj.getCurrentFloor();
        liftObj.setState("doorAnimating");
        // freelift.setAttribute("state", "doorAnimating");
        // freelift.setAttribute("currentFloor", floorNo);
        liftObj.setCurrentFloor(floorNo);

        liftPresenceAr[floorNo] = parseInt(liftObj.getId());
        console.log(liftPresenceAr);
        currentLiftQueue.remove();
        liftCurrentFloor[liftObj.getPreivousFloor()] = -1;
        liftObj.setPreviousFloor(liftObj.getCurrentFloor());
        let doors = doorAnimation(freelift);
        liftObj.setDestinationFloor(-1);


        setTimeout(() => {
          doors[0].classList.remove("left-door-animation");
          doors[1].classList.remove("right-door-animation");
          liftObj.setState("free");

          liftObj.setState("free");
          if (currentLiftQueue.size() > 0)
            updateLiftPos(currentLiftQueue, currentLiftQueue.front(), liftPresenceAr, liftObj, liftObjArr);
        }, 5000);

      }
    }, totalDuration * 1000);
  } else {
    //
    console.log(`NO FREE LIFT adding floorNO-${floorNo} in queue lift-${liftObj.getId()}`);
    let currentLiftQueue = liftQueueMap.get(liftObj.getId());
    currentLiftQueue.add(floorNo);
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

// attribute based upddate lift position
// function updateLiftPos(currentLiftQueue, freeLift, floorNo, allLifts, liftPresenceAr) {

//   /**
//    * moving lift ka purana position remove krna cuz new position destination wala ban chuka hai
//    */
//   removingLiftPresenceFromFloorInArr(allLifts, freeLift, floorNo, liftPresenceAr);

//   // console.log(allLifts[i]);
//   let liftCurrentFloor = parseInt(freeLift.getAttribute("currentFloor"));
//   let totalDuration = 2 * Math.abs(freeLift - liftCurrentFloor);
//   console.log(`duration --> ${totalDuration}`);

//   freeLift.setAttribute("state", "moving");
//   freeLift.setAttribute("destinationFloor", currentLiftQueue.front());
//   freeLift.style.transform = `translateY(${-80 * (floorNo - 1)}px)`;
//   freeLift.style.transition = `all ${2 * Math.abs(floorNo - liftCurrentFloor)}s`;
//   freeLift.style.backgroundColor = `blue`;


//   let updatedCurrentFloorInt;
//   const updateCurrentFloor = (() => {
//     updatedCurrentFloorInt = setInterval(() => {
//       console.log(performance.now());
//       liftCurrentFloor = Math.min(liftCurrentFloor + 1, floorNo)
//       freeLift.setAttribute("currentFloor", liftCurrentFloor);
//       if (liftCurrentFloor == floorNo)
//         clearInterval(updatedCurrentFloorInt)
//     }, 2000);
//   });

//   updateCurrentFloor();

//   // updateLiftPosition(freelift, currentLiftQueue,
//   // removingLiftPresenceFromFloorInArr, allLifts, floorNo, liftPresenceAr);

//   /* 
//   logic to timely remove the busy state from the lift 
//   and adding the presence in the arr that lift is there
//   */
//   setTimeout(() => {
//     if (freeLift.getAttribute("state") == "moving") {
//       freeLift.setAttribute("state", "doorAnimating");
//       freeLift.setAttribute("currentFloor", floorNo);

//       liftPresenceAr[floorNo] = parseInt(freeLift.getAttribute("id"));
//       console.log(liftPresenceAr);

//       currentLiftQueue.remove();

//       let doors = doorAnimation(freeLift);
//       console.log(`${currentLiftQueue.printQueue()}`);
//       removingLiftPresenceFromFloorInArr(allLifts, freeLift, floorNo, liftPresenceAr);

//       setTimeout(() => {
//         doors[0].classList.remove("left-door-animation");
//         doors[1].classList.remove("right-door-animation");
//         lift.setAttribute("state", "free");

//         if (currentLiftQueue.size() > 0)
//           updateLiftPos(currentLiftQueue, freeLift, currentLiftQueue.front(), allLifts, liftPresenceAr);
//       }, 5000);

//     }
//   }, totalDuration * 1000);
// }

// lift obj based update lift position
function updateLiftPos(currentLiftQueue, floorNo, liftPresenceAr, liftObj, liftObjArr) {

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
  console.log(`duration --> ${totalDuration}`);
  let direction = "up";
  if (floorNo > liftCurrentFloor) {
    // currentLiftQueue.items.sort((a, b) => a - b); // agr chota floor milta hai raste mein to lift ko sahi floor par rokne ke liye
    console.log(`queue data --> ${currentLiftQueue.printQueue()}`)
  }
  else
    direction = "down";


  let freelift = document.querySelector(`#lift-${liftObj.getId()}`);
  // freelift.setAttribute("state", "moving");
  liftObj.setState("moving")
  // freelift.setAttribute("destinationFloor", currentLiftQueue.front());
  liftObj.setDestinationFloor(currentLiftQueue.front());


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
      console.log(performance.now());
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
      removingLiftPresenceFromFloorInArr(liftPresenceAr, liftObjArr);
      document.querySelector(`#counter-${liftObj.getId()}`).innerHTML = liftObj.getCurrentFloor();
      liftObj.setState("doorAnimating");
      // freelift.setAttribute("state", "doorAnimating");
      // freelift.setAttribute("currentFloor", floorNo);
      liftObj.setCurrentFloor(floorNo);

      liftPresenceAr[floorNo] = parseInt(liftObj.getId());
      console.log(liftPresenceAr);
      currentLiftQueue.remove();
      liftCurrentFloor[liftObj.getPreivousFloor()] = -1;
      liftObj.setPreviousFloor(liftObj.getCurrentFloor());
      let doors = doorAnimation(freelift);
      liftObj.setDestinationFloor(-1);

      setTimeout(() => {
        doors[0].classList.remove("left-door-animation");
        doors[1].classList.remove("right-door-animation");
        liftObj.setState("free");

        liftObj.setState("free");
        if (currentLiftQueue.size() > 0)
          updateLiftPos(currentLiftQueue, currentLiftQueue.front(), liftPresenceAr, liftObj, liftObjArr);
      }, 5000);

    }
  }, totalDuration * 1000);
}

/**
 * this was requestAnimationFrame code this will be used later not now
 */
function updateLiftPosition(freelift, currentLiftQueue,
  removingLiftPresenceFromFloorInArr, allLifts, floorNo, liftPresenceAr) {


  let startTime;
  let currentFloor = parseInt(freelift.getAttribute("currentFloor"));
  let destinationFloor = parseInt(freelift.getAttribute("destinationFloor"));
  let totalDuration = 2 * Math.abs(destinationFloor - currentFloor);
  freelift.style.transition = `all ${totalDuration}s ease`;

  function liftAnimation(timeStamp) {
    if (!startTime) startTime = timeStamp;
    let elapsedTime = (timeStamp - startTime) / 1000;


    if (elapsedTime < totalDuration) {
      let progress = Math.round((elapsedTime / totalDuration) * 100) / 100;
      console.log(`${progress}`)
      let currentPosition = Math.round(currentFloor + (destinationFloor - currentFloor) * progress);
      freelift.style.transform = `translateY(${-80 * (currentPosition - 1)}px)`;

      freelift.style.backgroundColor = `blue`;
      console.log(liftPresenceAr);

      if (currentPosition !== currentFloor) {
        liftPresenceAr[currentPosition] = parseInt(freelift.getAttribute("id"));
        currentFloor = currentPosition;
        freelift.setAttribute("currentFloor", currentFloor);
      }

      requestAnimationFrame(liftAnimation);
      freelift.setAttribute("currentFloor", currentPosition);
    } else {
      freelift.setAttribute("state", "free");
      freelift.setAttribute("currentFloor", destinationFloor);
      freelift.style.transform = `translateY(${-80 * (destinationFloor - 1)}px)`;
      freelift.setAttribute("destinationFloor", 0);

      freelift.addEventListener("transitionend", (() => {
        console.log("lift reached---. transition end");
        liftPresenceAr[destinationFloor] = parseInt(freelift.getAttribute("id"));
        console.log(liftPresenceAr);
        doorAnimation(freelift);
        currentLiftQueue.remove();

        // har lift ki simulation khtm hone ke baad uski correct position arr mein add krenge
        removingLiftPresenceFromFloorInArr(allLifts, freelift, floorNo, liftPresenceAr);
        if (currentLiftQueue.size() != 0) {
          console.log(`This lift ->${freelift.getAttribute("id")} has length ${currentLiftQueue.printQueue()}`)
          moveLifts(currentLiftQueue.front())
        }
      }))



    }

  }

  requestAnimationFrame(liftAnimation);

  // function trackingLift
  //   // console.log("Interval function executing");

  //   currentFloor = parseInt(freelift.getAttribute("currentFloor"));
  // destinationFloor = parseInt(freelift.getAttribute("destinationFloor"));

  // // console.log(`Current floor: ${currentFloor}, Destination floor: ${destinationFloor}`); // Debug log

  // if (destinationFloor === currentFloor) {
  //   freelift.setAttribute("destinationFloor", 0);
  //   clearInterval(interval);
  //   interval = null;
  //   return;
  // }
  // else {
  //   if (destinationFloor > currentFloor)
  //     currentFloor++;
  //   else
  //     currentFloor--;
  //   // console.log(`Lift --> ${freelift.getAttribute("id")} is at ${freelift.getAttribute("currentFloor")}`);
  // }
  // freelift.setAttribute("currentFloor", currentFloor);

  // console.log(`Lift --> ${freelift.getAttribute("id")} is at ${freelift.getAttribute("currentFloor")}`);


}


function findNearestLift(destinationFloor, liftObjArr) {
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

  for (const lift of liftObjArr) {
    let distance;
    if (lift.getState() === "doorAnimating" && lift.getState() !== "free") {
      distance = Math.abs(lift.getCurrentFloor() - destinationFloor);
    }

    if (distance < minDistance) {
      minDistance = distance;
      nearestLiftId = lift.getId();
    }
  }
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

  removeDestinationFloor() {
    this.destinationFloor = -1;
  }

  print() {
    let str = "";
    str = `id->${this.id}, currentFloor->${this.currentFloor}, destinationFloor${this.destinationFloor}`;
    return str;
  }
}

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