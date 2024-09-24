let simulate = document.querySelector(".createLiftFloorButton");
// console.log(simulate); //<button class="createLiftFloorButton">Simulate</button>

let restart = document.querySelector(".goToFirstPage");
//console.log(restart) //<button class="goToFirstPage">Back</button>

//adding eventListener click on button back
restart.addEventListener("click", hideSecondPage);

//add event listener on button simulate and e means event
simulate.addEventListener("click", (e) => {
  e.preventDefault();
  //when we click simulate button please collect the input no. of floor and lift value
  let floorInputValue = document.querySelector("#floorNumber").value;
  let liftInputValue = document.querySelector("#liftNumber").value;

  // console.log(floorInputValue);
  // console.log(window.innerWidth);

  //if we don't give input no. of floor and lift value
  if (floorInputValue == "" || liftInputValue == "") {
    alert("please enter the value");
  }
  //if we give input no. of floor>=8
  else if (floorInputValue >= 8) {
    alert("please enter max 7 floor");
  }
  //if media query width of window<=500 and (+)means convert string into number
  //i do this to make lift simulation everydevice size friendly
  else if (window.innerWidth <= 500 && +liftInputValue > 4) {
    alert("This screen size can't have more than 4 lifts");
  } else if (
    window.innerWidth > 500 &&
    window.innerWidth <= 768 &&
    +liftInputValue > 5
  ) {
    alert("This screen size can't have more than 5 lifts");
  } else if (
    window.innerWidth > 500 &&
    window.innerWidth <= 1024 &&
    +liftInputValue > 7
  ) {
    alert("This screen size can't have more than 7 lifts");
  } else if (
    window.innerWidth > 500 &&
    window.innerWidth <= 1440 &&
    +liftInputValue > 11
  ) {
    alert("This screen size can't have more than 11 lifts");
  } else if (
    window.innerWidth > 500 &&
    window.innerWidth <= 2560 &&
    +liftInputValue > 20
  ) {
    alert("This screen size can't have more than 20 lifts");
  }

  //when simulate button clicked hide .firstPage class div and display .secondPage class div
  else {
    document.querySelector(".firstPage").style.display = "none";
    document.querySelector(".secondPage").style.display = "block";
    // console.log('second')
    makingFloors();
  }
});

//when  button back clicked hide .secondPage class div and display .firstPage class div
function hideSecondPage() {
  document.querySelector(".secondPage").style.display = "none";
  document.querySelector(".firstPage").style.display = "flex";

  deletingFloors();
}

//Now Lets create a floor

/* <div class="box">
<div class="buttonLift">
    <div class="button">
        <button class="up" id="up1">Up</button>
        <button class="down" id="down1">Down</button>
     </div>
     <div class="mainLift">
        <div class="lift" id="lift1" flag="free">
          <div class="gates" id="gates">
             <div class="gate1"></div>
             <div class="gate2"></div>
          </div>
         <div>
      </div>
  </div>
  <div class="hrfloorName">
      <hr>
      <span>Floor 1</span>
  </div>
</div> */
function makingFloors() {
  // collect the input no. of floor and lift value
  let floorInput = document.querySelector("#floorNumber").value;
  let liftInput = document.querySelector("#liftNumber").value;

  for (let i = floorInput; i > 0; i--) {
    // <div class="box"></div>
    let floordiv = document.createElement("div");
    floordiv.className = "box";

    // <div class="buttonLift"></div>
    let buttonLift = document.createElement("div");
    buttonLift.className = "buttonLift";

    // <div class="button"></div>
    let buttondiv1 = document.createElement("div");
    buttondiv1.className = "button";

    //button1 create
    // <button class="up" id="up1">Up</button>
    let button1 = document.createElement("button");
    let text1 = document.createTextNode("Up");
    button1.className = "up";
    button1.setAttribute("id", `up${i}`);
    button1.appendChild(text1);

    // select krh rha hu button id

    //button2 create
    // <button class="down" id="down1">Down</button>
    let button2 = document.createElement("button");
    let text2 = document.createTextNode("Down");
    button2.className = "down";
    button2.setAttribute("id", `down${i}`);
    button2.appendChild(text2);

    //button1 and button2 append in this div <div class="button"></div>
    buttondiv1.appendChild(button1);
    buttondiv1.appendChild(button2);

    // buttondiv1 append in <div class="buttonLift"></div>
    buttonLift.appendChild(buttondiv1);

    //buttonLift append in this div <div class="box"></div>
    floordiv.appendChild(buttonLift);

    //Creating HrFloor
    //<div class="hrfloorName"></div>
    let hrdiv = document.createElement("div");
    hrdiv.className = "hrfloorName";

    //<hr>
    let hr = document.createElement("hr");

    //<span>Floor 1</span>
    let spanFloorNo = document.createElement("span");
    spanFloorNo.innerText = `Floor ${i}`;

    //<hr> append in this div <div class="hrfloorName"></div>
    hrdiv.appendChild(hr);

    //<span>Floor 1</span> append in this div <div class="hrfloorName"></div>
    hrdiv.appendChild(spanFloorNo);

    //<div class="hrfloorName"></div> is append in this div <div class="box"></div>
    floordiv.appendChild(hrdiv);

    //<div class="box"></div>  is append in this div <div class="secondPage"></div>
    document.querySelector(".secondPage").appendChild(floordiv);
    if (i == floorInput) {
      button1.style.display = "none";
    }
    if (i == 1) {
      button2.style.display = "none";
    }
  }

  //lets create a lift i.e.

  // this is whole we create in below
  //   <div class="mainLift">
  //     <div class="lift" id="lift1" flag="free">
  //       <div class="gates" id="gates">
  //          <div class="gate1"></div>
  //          <div class="gate2"></div>
  //       </div>
  //      <div>
  //   </div>

  // <div class="mainLift"></div>
  let mainLift = document.createElement("div");
  mainLift.className = "mainLift";

  for (let j = 1; j <= liftInput; j++) {
    // <div class="lift" id="lift1" flag="free"></div>
    let liftdiv = document.createElement("div");
    liftdiv.className = "lift";
    liftdiv.setAttribute("id", `lift${j}`);

    //adding flag="free" attribute in <div class="lift" id="lift1" flag="free"></div>
    liftdiv.setAttribute("flag", `free`);

    // <div class="gates" id="gates"></div>
    let gates = document.createElement("div");
    gates.className = "gates";

    gates.setAttribute("id", `gates`);
    let headingFloorno = document.createElement("div");

    headingFloorno.className = "floornobox";
    headingFloorno.setAttribute("id", `lifts${j}`);
    // headingFloorno.id=`lift${j}`
    gates.appendChild(headingFloorno);
    // <div class="gate1"></div>
    let gate1 = document.createElement("div");
    gate1.className = "gate1";
    // <div class="gate1"></div> append in this div <div class="gates" id="gates"></div>
    gates.appendChild(gate1);

    // <div class="gate2"></div>
    let gate2 = document.createElement("div");
    gate2.className = "gate2";
    // <div class="gate2"></div> append in this div <div class="gates" id="gates"></div>
    gates.appendChild(gate2);

    // <div class="gates" id="gates"></div> append in this div <div class="lift" id="lift1" flag="free"></div>
    liftdiv.appendChild(gates);

    // <div class="lift" id="lift1" flag="free"></div> append in this div <div class="mainLift"></div>
    mainLift.appendChild(liftdiv);
  }

  // Now, We want to add all lifts we created above in last box button div i.e.

  //   <div class="box">
  //     <div class="buttonLift">
  //        <div class="button">
  //           <button class="up" id="up1">Up</button>
  //           <button class="down" id="down1">Down</button>
  //         </div>
  //     </div>

  //selecting all the div class .buttonLift we created using querySelectorAll
  const mainbuttonlift = document.querySelectorAll(".buttonLift");
  // console.log(mainbuttonlift);

  //selecting last div class .buttonLift
  const lastbox = mainbuttonlift[mainbuttonlift.length - 1];
  // console.log(lastbox)

  // <div class="mainLift"></div> append in this div <div class="buttonLift"></div>
  lastbox.appendChild(mainLift);

  //  select all lift we created above using querySelectorAll
  let selectAllLift = document.querySelectorAll(".lift");

  for (let i = 0; i < selectAllLift.length; i++) {
    selectAllLift[i].setAttribute("liftno", `${i + 1}`);
    // console.log('s',selectAllLift[i])
  }

  // select all up button <button class="up" id="up1">Up</button> using querySelectorAll
  let up = document.querySelectorAll(".up");

  // select all down button <button class="down" id="down1">Down</button> using querySelectorAll
  let down = document.querySelectorAll(".down");

  //store no. of lifts in nUp
  let nUp = up.length;
  console.log(nUp);
  let prev = 0;

  //create oldFloorValueArray for calculation purpose
  let oldFloorValueArray = [];

  for (let i = 0; i < selectAllLift.length; i++) {
    oldFloorValueArray.push(1);
    // selectAllLift
  }

  // console.log(oldFloorValueArray)//oldFloorValueArray=[1,1,1,1];

  //Now we loop through all up button and add eventListener in all up button
  up.forEach((e, i) => {
    e.addEventListener("click", () => {
      //create floorValue for calculation purpose
      let floorValue = nUp - i;
      console.log(floorValue);

      for (let i = 0; i < selectAllLift.length; i++) {
        // console.log(selectAllLift)

        //check <div class="lift" id="lift1" flag="free"> lift attribute flag has value free
        if (selectAllLift[i].getAttribute("flag") === "free") {
          // set attribute flag value busy i.e. <div class="lift" id="lift1" flag="busy">
          selectAllLift[i].setAttribute("flag", "busy");

          // document.querySelector('.liftHeadingTo').innerText = floorValue;

          //call a function moveLift
          moveLift(selectAllLift[i], i, floorValue, oldFloorValueArray[i]);
          headingTo(floorValue, i, selectAllLift[i]);
          oldFloorValueArray[i] = floorValue;
          // console.log(oldFloorValueArray);
          // console.log(selectAllLift[i]);
          break;
        }
      }
    });
  });

  //same steps like above we do in up button now we are going to do in down buttons
  down.forEach((e, i) => {
    e.addEventListener("click", () => {
      let floorValue = nUp - i;
      for (let i = 0; i < selectAllLift.length; i++) {
        // console.log(selectAllLift)
        if (selectAllLift[i].getAttribute("flag") === "free") {
          selectAllLift[i].setAttribute("flag", "busy");

          moveLift(selectAllLift[i], i, floorValue, oldFloorValueArray[i]);
          // document.querySelector('.liftHeadingTo').innerText = floorValue;
          oldFloorValueArray[i] = floorValue;
          // console.log(oldFloorValueArray);
          // console.log(selectAllLift[i]);
          break;
        }
      }
    });
  });
  function liftstop(n) {
    let liftEnter = document.querySelector(".enterliftno");
    document.getElementById(
      "liftNumbers"
    ).placeholder = `Type number less than ${n}`;
    // console.log(selectAllLift)
    liftEnter.addEventListener("click", stoplift);
    function stoplift() {
      let liftno = document.querySelector(".liftNumbers").value;
      for (let i = 0; i < selectAllLift.length; i++) {
        if (String(liftno) === selectAllLift[i].getAttribute("liftno")) {
          if (selectAllLift[i].getAttribute("flag") === "free") {
            selectAllLift[i].className = "disabled";
            selectAllLift[i].style.marginRight = "55px";
            selectAllLift[i].setAttribute("flag", "busy");
            selectAllLift[i].style.transform = `translateY(${
              -95 + disableFloor[i]
            }px)`;
            selectAllLift[i].style.transitionDuration = "2s";
            opendoor(selectAllLift[i]);
          }
        }
      }
    }
    // console.log(selectAllLift)
  }
  liftstop(liftInput);
}

function headingTo(n, i, liftno) {
  const liftHeadingTo = document.getElementById(`lifts${i + 1}`);
  console.log(liftHeadingTo);
  liftHeadingTo.setAttribute("whichFloor", n);
}

var disableFloor = [];
for (let i = 0; i < 4; i++) {
  disableFloor.push(0);
}
function moveLift(liftno, no, floorNo, oldFloorValue) {
  console.log("f", floorNo);
  //add styling transform to move lift smooth in Y direction using transform property
  liftno.style.transform = `translateY(${-95 * (floorNo - 1)}px)`;
  if (floorNo > 1) {
    disableFloor[no] = -95 * (floorNo - 1);
  } else {
    disableFloor[no] = -95;
  }
  // console.log(disableFloor)
  // console.log(no)
  // add styling transition-duration to particular lift i.e. we do this because Lift moving at 2s per floor
  let prev = `${2 * Math.abs(floorNo - oldFloorValue)}s`;
  liftno.style.transitionDuration = prev;
  // console.log('snjh',2*(floorNo -oldFloorValue));

  //What we are doing in below steps
  // we want that Lift stopping at every floor where it was called after 2sec we set attribute flag value free
  // and then we want ki Lift having doors open in 2.5s, then closing in another 2.5s for that we call function gateopenclose(liftno);
  setTimeout(() => {
    if (liftno.getAttribute("flag") === "busy") {
      const liftHeadingTo = document.getElementById(`lifts${no + 1}`);
      const liveFloor = liftHeadingTo.getAttribute("whichFloor");
      // console.log('lo',liveFloor);
      liftHeadingTo.innerText = liveFloor;
    }
    gateopenclose(liftno);
    setTimeout(() => {
      liftno.setAttribute("flag", "free");
      document.getElementById(`lifts${no + 1}`).innerText = "";
    }, 5500);
    // console.log(liftno.getAttribute('flag'))
  }, 2 * Math.abs(floorNo - oldFloorValue) * 1000);
}

function gateopenclose(liftno) {
  let gates = liftno.firstChild;
  let gate1 = document.querySelector(".gate1");
  let gate2 = document.querySelector(".gate2");

  //gate open in 1sec and you see gate open smoothly because i decrease the width and
  // add transition property in css in class .gate1 , .gate2
  setTimeout(() => {
    //     <div class="gates" id="gates">
    //         <div class="gate1"></div> gates.children[0]
    //         <div class="gate2"></div>gates.children[1]
    //     </div>
    gates.children[1].style.width = "3px";
    gates.children[2].style.width = "3px";
  }, 1000);

  // gate close in 3.5s
  setTimeout(() => {
    gates.children[1].style.width = "25px";
    gates.children[2].style.width = "25px";
  }, 3500);
}

function opendoor(disablelift) {
  let gates = disablelift.firstChild;
  setTimeout(() => {
    gates.style.width = "50px";
    gates.children[1].style.width = "3px";
    gates.children[2].style.width = "3px";
  }, 1000);
  setTimeout(() => {
    liftno.setAttribute("flag", "busy");
  }, 0);
}

//after clicking back button we want that all floor <div class="box"></div> we created dynamically
// should be deleted using remove built-in method
function deletingFloors() {
  let floorInput = document.querySelector("#floorNumber").value;

  for (let i = floorInput; i > 0; i--) {
    let floordiv = document.querySelector(".box");
    floordiv.remove();
  }
}

class Lift {
  constructor(id) {
    this.id = id;
    this.currentFloor = 1;
    this.direction = null; // 'up' or 'down'
    this.queue = [];
    this.isMoving = false;
  }

  requestFloor(floor) {
    if (!this.isMoving) {
      this.moveToFloor(floor);
    } else {
      this.queue.push(floor);
    }
  }

  moveToFloor(floor) {
    this.isMoving = true;
    this.direction = floor > this.currentFloor ? "up" : "down";

    // Simulate the lift moving to the requested floor
    const moveLift = () => {
      if (this.currentFloor !== floor) {
        this.currentFloor += this.direction === "up" ? 1 : -1;
        document.getElementById("elevator").style.transform = `translateY(${
          (7 - this.currentFloor) * 50
        }px)`;
        setTimeout(moveLift, 1000); // Move every second
      } else {
        this.isMoving = false;
        this.direction = null;
        this.processQueue();
      }
    };

    moveLift();
  }

  processQueue() {
    if (this.queue.length > 0) {
      const nextFloor = this.queue.shift();
      this.moveToFloor(nextFloor);
    }
  }
}

const lifts = [new Lift(1), new Lift(2)];

document.querySelectorAll(".floor").forEach((floor) => {
  floor.addEventListener("click", () => {
    const requestedFloor = parseInt(floor.getAttribute("data-floor"));
    const availableLift = lifts.find((lift) => !lift.isMoving);

    if (availableLift) {
      availableLift.requestFloor(requestedFloor);
    } else {
      // Find the nearest lift
      const nearestLift = lifts.re;

      duce((prev, curr) => {
        return Math.abs(curr.currentFloor - requestedFloor) <
          Math.abs(prev.currentFloor - requestedFloor)
          ? curr
          : prev;
      });
      nearestLift.requestFloor(requestedFloor);
    }
  });
});
