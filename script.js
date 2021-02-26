"use strict";

window.addEventListener("DOMContentLoaded", init);

//placeholder array
let studentListArr = [];

//Prototype for all students
const StudentList = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
  gender: "",
  blood: "",
  expelled: false,
  inquisitional: false,
  prefect: false,
};

// global filter object
const settings = {
  filter: "all",
  sortBy: " ",
};

function init() {
  loadJSON();
  document
    .querySelectorAll(".filter")
    .forEach((filter) => filter.addEventListener("change", selectFilter));
  document
    .querySelectorAll(".sort")
    .forEach((sort) => sort.addEventListener("change", sortBy));
}

//SELECTS VALUE OF ALL SORTING AND CALLS SORT FUNC
function sortBy(e) {
  const sortValue = e.target.value;
  // console.log(sortValue);
  // const sortResult = getSortResult(sortValue);

  setSort(sortValue);
}

function setSort(value) {
  settings.sortBy = value;
  buildList();
}
//GETS SORTING BY ASC ORDER (alphabetically)
function getSortResult(sorted) {
  if (settings.sortBy === "firstName") {
    sorted = studentListArr.sort(function (a, b) {
      if (a.firstName < b.firstName) {
        return -1;
      } else {
        return 1;
      }
    });
  } else if (settings.sortBy === "lastName") {
    sorted = studentListArr.sort(function (a, b) {
      if (a.lastName < b.lastName) {
        return -1;
      } else {
        return 1;
      }
    });
  } else if (settings.sortBy === "house") {
    sorted = studentListArr.sort(function (a, b) {
      if (a.house < b.house) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  return sorted;
}

//SELECTS VALUE OF ALL FILTERS AND CALLS FILTER FUNC
function selectFilter(e) {
  const filterValue = e.target.value;
  // const filterResult = getFilterResults(filterValue);
  setFilter(filterValue); //only to call new list to display
}

//BUILDS NEW LIST SO SORTING AND FILTERING WORK WITH NO INTERFERANCE
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function buildList() {
  //new list for filter
  const filteredList = filterList(studentListArr);
  displayStudent(filteredList);

  //new list for sort from filtered to work together
  const sortedList = getSortResult(studentListArr);
  displayStudent(filteredList);

  //UPDATE NUMBER ACCORDING TO FILTERED
  document.querySelector(
    ".studentNumber"
  ).textContent = `Student Number: ${filteredList.length}`;
}

//GET FILTERS  settings.filterBy=value
function filterList(filtered) {
  //takes all array to sort and filtered
  if (settings.filterBy === "Ravenclaw") {
    filtered = studentListArr.filter(isRavenclaw);
  } else if (settings.filterBy === "Gryffindor") {
    filtered = studentListArr.filter(isGryffindor);
  } else if (settings.filterBy === "Slytherin") {
    filtered = studentListArr.filter(isSlytherin);
  } else if (settings.filterBy === "Hufflepuff") {
    filtered = studentListArr.filter(isHufflepuff);
  } else if (settings.filterBy === "girl") {
    filtered = studentListArr.filter(isGirl);
  } else if (settings.filterBy === "boy") {
    filtered = studentListArr.filter(isBoy);
  } else if (settings.filterBy === "expelled") {
    filtered = studentListArr.filter(isExpelled);
  } else if (settings.filterBy === "not-expelled") {
    filtered = studentListArr.filter(isNotExpelled);
  } else if (settings.filterBy === "inquisitional") {
    filtered = studentListArr.filter(isInquisitional);
  }
  return filtered;
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function isGirl(student) {
  if (student.gender === "girl") {
    return true;
  } else {
    return false;
  }
}

function isBoy(student) {
  if (student.gender === "boy") {
    return true;
  } else {
    return false;
  }
}

//EXPELLED
function isExpelled(student) {
  // console.log(student.expelled);
  if (student.expelled) {
    return true;
  } else {
    return false;
  }
}

//NOT EXPELLED
function isNotExpelled(student) {
  // console.log(student.expelled);
  if (student.expelled === false) {
    return true;
  } else {
    return false;
  }
}

//PREFECT
function isInquisitional(student) {
  if (student.inquisitional) {
    return true;
  } else {
    return false;
  }
}

//async function
async function loadJSON() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await response.json();

  //Get bloodstatus data
  const responseB = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  const jsonDataB = await responseB.json();
  prepareObjects(jsonData);
  giveBloodStatus(jsonDataB);
}

// calculate blood status
function giveBloodStatus(jsonDataB) {
  console.log(jsonDataB);
  studentListArr.forEach((student) => {
    if (jsonDataB.pure.includes(student.lastName)) {
      student.bloodStatus = "Pure";
    } else if (jsonDataB.half.includes(student.lastName)) {
      student.bloodStatus = "Half";
    } else {
      student.bloodStatus = "Muggleborn";
    }
    // console.log(student);
    displaySingleStudent(student);
  });
}

//prepare data
function prepareObjects(jsonData) {
  const newStudentList = jsonData.map(prepareObject);
  displayStudent(newStudentList);
  //SEARCH FILTER EVENT
  document.querySelector(".search").addEventListener("input", searchStudent);
}

//SEARCH STUDENTS TODO: clear "X" on search
function searchStudent() {
  const searchValue = document.querySelector(".search").value;
  //FILTER THROUGH SEARCH WITH ANY CAPITALIZATION
  const search = studentListArr.filter(
    (student) =>
      student.firstName.toUpperCase().includes(searchValue.toUpperCase()) ||
      student.firstName.toLowerCase().includes(searchValue.toLowerCase())
  );
  displayStudent(search);
  //UPDATE NUMBER ACCORDING TO FILTERED
  document.querySelector(
    ".studentNumber"
  ).textContent = `Student Number: ${search.length}`;
}

//CLEAN LIST; MAKE NEW OBJ; PUSH TO ARR
function prepareObject(listedStudent) {
  let newList = listedStudent.fullname.trim();
  //find first and last space
  const firstSpace = newList.indexOf(" ");
  const lastSpace = newList.lastIndexOf(" ");
  //name first letter capital, rest lowercase
  let name = newList.substring(firstSpace, 0);
  let firstName =
    name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
  if (firstName == "") {
    firstName = newList.substring(lastSpace + 1);
  }
  //find middle name using space&make capitals where needed
  const middle = newList.substring(firstSpace + 1, lastSpace);
  let middleName =
    middle.charAt(0).toUpperCase() + middle.substring(1).toLowerCase();
  if (middleName.includes(" ") || middleName.includes('"')) {
    middleName = undefined;
  }
  //find nickname and remove ""
  let nickname = newList.substring(firstSpace + 1, lastSpace);
  let nickName;
  if (nickname.includes('"')) {
    nickName = nickname.substring(1, nickname.length - 1);
  }
  //find lastname using spaces&capitalize where needed
  const last = newList.substring(lastSpace + 1);
  let lastName = last.charAt(0).toUpperCase() + last.substring(1).toLowerCase();
  if (lastName.includes("-")) {
    lastName = lastName.split("-");
    lastName[1] =
      lastName[1].charAt(0).toUpperCase() +
      lastName[1].substring(1).toLowerCase();
    lastName = lastName.join("-");
  }
  //trim space in front of string&capitalize
  let trimStartHouse = listedStudent.house.trimStart();
  const house =
    trimStartHouse.charAt(0).toUpperCase() +
    trimStartHouse.substring(1).toLowerCase();
  //gender
  const gender = listedStudent.gender;

  //create object from protoype
  const newStudentList = Object.create(StudentList);

  newStudentList.firstName = firstName;
  newStudentList.middleName = middleName;
  newStudentList.nickName = nickName;
  newStudentList.lastName = lastName;
  newStudentList.house = house;
  newStudentList.gender = gender;

  //push in Arr
  studentListArr.push(newStudentList);

  return newStudentList;
}

//DISPLAY STUDENTS
function displayStudent(students) {
  // clear the list
  document.querySelector("main").innerHTML = " ";
  //display nr of students
  document.querySelector(
    ".studentNumber"
  ).textContent = `Student Number: ${studentListArr.length}`;
  students.forEach(displaySingleStudent);
}

//DISPLAY EACH STUDENT
function displaySingleStudent(student) {
  console.log(student);
  const clone = document.querySelector("template").content.cloneNode(true);
  clone.querySelector(
    "[data-field=firstname]"
  ).textContent = `${student.firstName}`;
  clone.querySelector("[data-field=middlename]").textContent =
    student.middleName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  if (student.lastName == "Leanne") {
    student.lastName = "";
  }
  clone.querySelector(
    "[data-field=house]"
  ).textContent = `HOUSE: ${student.house}`;
  //images- cleaned and added
  const img = clone.querySelector("#card img");
  img.src =
    "./images/" +
    student.lastName.toLowerCase() +
    "_" +
    student.firstName[0].substring(0, 1).toLowerCase() +
    ".png";

  if (student.firstName === "Padma") {
    img.src =
      "./images/" + student.lastName.toLowerCase() + "_" + "padma" + ".png";
  } else if (student.lastName === "Patil") {
    img.src =
      "./images/" +
      student.lastName.toLowerCase() +
      "_" +
      student.firstName.toLowerCase() +
      ".png";
  } else if (student.lastName === "Finch-Fletchley") {
    img.src =
      "./images/" +
      "fletchley" +
      "_" +
      student.firstName.substring(0, 1).toLowerCase() +
      ".png";
  } else if (student.firstName === "Leanne") {
    img.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/140px-No_image_available.svg.png";
    img.style.borderColor = "#14075a";
  }

  //MODAL EVENT
  clone.querySelector(".btn").addEventListener("click", (e) => {
    openModal(e);
  });
  function openModal(e) {
    //FIND WHICH BUTTON IS CLICKED, MUST BE UNIQUE ex firstname
    const studentName = e.target.parentNode.querySelector(
      "[data-field=firstname]"
    ).textContent;
    if (student.firstName == studentName) {
      //crest img and background color
      const crestImg = document.querySelector(".house-crest img");
      const bckgrColor = document.querySelector(".modal-data");
      crestImg.style.width = "762px";
      if (student.house === "Gryffindor") {
        bckgrColor.style.backgroundColor = "rgb(116, 8, 8)";
        crestImg.src = "./images/" + student.house.toLowerCase() + ".png";
      } else if (student.house === "Slytherin") {
        bckgrColor.style.backgroundColor = "rgb(3, 54, 29)";
        crestImg.src = "./images/" + student.house + ".png";
      } else if (student.house === "Hufflepuff") {
        crestImg.src = "./images/" + student.house + ".png";
        bckgrColor.style.backgroundColor = "rgba(114, 85, 5)";
      } else if (student.house === "Ravenclaw") {
        crestImg.src = "./images/" + student.house + ".png";
        bckgrColor.style.backgroundColor = "rgb(7, 16, 145)";
      }

      //student img
      const img = document.querySelector(".modal-img img");
      img.src =
        "./images/" +
        student.lastName.toLowerCase() +
        "_" +
        student.firstName[0].substring(0, 1).toLowerCase() +
        ".png";

      if (student.firstName === "Padma") {
        img.src =
          "./images/" + student.lastName.toLowerCase() + "_" + "padma" + ".png";
      } else if (student.lastName === "Patil") {
        img.src =
          "./images/" +
          student.lastName.toLowerCase() +
          "_" +
          student.firstName.toLowerCase() +
          ".png";
      } else if (student.lastName === "Finch-Fletchley") {
        img.src =
          "./images/" +
          "fletchley" +
          "_" +
          student.firstName.substring(0, 1).toLowerCase() +
          ".png";
      } else if (student.firstName === "Leanne") {
        img.src =
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/140px-No_image_available.svg.png";
        img.style.borderColor = "#14075a";
      }

      document.querySelector(
        ".studentfirstName"
      ).textContent = `${student.firstName}`;
      document.querySelector(
        ".studentlastName"
      ).textContent = `${student.lastName}`;
      if (student.middleName === undefined) {
        document.querySelector(".studentmiddleName").style.display = "none";
      } else {
        document.querySelector(
          ".studentmiddleName"
        ).textContent = `${student.middleName}`;
      }

      if (student.nickName === undefined) {
        document.querySelector(".studentnickName").style.display = "none";
      } else {
        document.querySelector(
          ".studentnickName"
        ).textContent = `${student.nickName}`;
      }

      document.querySelector(
        ".studentHouse"
      ).textContent = `HOUSE: ${student.house}`;
      document.querySelector(
        ".studentGender"
      ).textContent = `GENDER: ${student.gender}`;

      document.querySelector(
        ".studentBlood"
      ).textContent = `BLOOD: ${student.bloodStatus.toLowerCase()}`;

      //TODO: if prefect or if expelled in modal

      document.querySelector("#modal").classList.remove("hide");
      document.querySelector(".close-btn").addEventListener("click", () => {
        document.querySelector("#modal").classList.add("hide");
      });
    }
  }

  //EXPELLED
  //won´t work without (e)
  clone
    .querySelector("[data-field=expelled]")
    .addEventListener("click", (e) => {
      expellClicked(e);
    });

  //function to call expel outside with right param
  function expellClicked(e) {
    toggleExpel(e, student);
  }

  //INQUISITIONAL
  clone
    .querySelector("[data-field=inquisitional]")
    .addEventListener("click", (e) => {
      inquiClicked(e);
    });

  //function to call inquisitional outside with right param
  function inquiClicked(e) {
    toggleInquisitional(e, student);
  }

  //PREFECT
  clone.querySelector("[data-field=prefect]").addEventListener("click", (e) => {
    prefectClicked(e);
  });

  //function to call prefect outside with right param
  function prefectClicked(e) {
    togglePrefect(e, student);
  }

  // append clone to list
  document.querySelector("main").appendChild(clone);
}

//TOGGLE EXPELL
function toggleExpel(e, student) {
  //toogle false /true
  if (student.expelled === false) {
    student.expelled = true;
    e.target.style.backgroundColor = "red";
    e.target.textContent = "✗";
  } else {
    student.expelled = false;
    e.target.style.backgroundColor = "rgba(241, 233, 71, 0.9)";
    e.target.textContent = "✓";
  }

  // TODO: remove from UI
}

// TOGGLE INQUISITIONAL
function toggleInquisitional(e, student) {
  if (student.inquisitional === false) {
    student.inquisitional = true;
    e.target.style.backgroundColor = "#C0C0C0";
    e.target.textContent = "✟";
  } else {
    student.inquisitional = false;
    e.target.style.backgroundColor = "rgba(221, 217, 142, 0.9)";
    e.target.textContent = "♢";
  }
  //Inqui popup
  if (student.house != "Slytherin" && student.bloodStatus != "Pure") {
    student.inquisitional = false;
    document.querySelector("#inqui-modal").classList.remove("hide");
    document.querySelector(".inquiTxt").textContent =
      "Slytherin and pure only!";
    e.target.style.backgroundColor = "rgba(221, 217, 142, 0.9)";
    e.target.textContent = "♢";
    document.querySelector(".closebtn").addEventListener("click", () => {
      document.querySelector("#inqui-modal").classList.add("hide");
    });
  }
}

//toggle prefect btns and status
function togglePrefect(e, student) {
  if (student.prefect === false) {
    student.prefect = true;
    e.target.style.backgroundColor = "yellow";
    e.target.textContent = "PREF★";
    prefectList(student);
  } else {
    student.prefect = false;
    e.target.style.backgroundColor = "rgba(221, 217, 142, 0.9)";
    e.target.textContent = "☆ ";
    displayAsNotPrefect(student);
  }
}

//display as not prefect
function displayAsNotPrefect(student) {
  console.log(student);
  student.prefect = false;
  document.querySelector(".prefect").style.backgroundColor =
    "rgba(221, 217, 142, 0.9)";
  // e.target.textContent = "☆ ";
}

//make array and filter according to prefect status
function prefectList() {
  const studentNr = studentListArr.filter((student) => student.prefect);
  const prefects = studentNr.length;
  // console.log(student);
  if (prefects > 2) {
    showPopUp(studentNr);
  }
}

//show popup and add listeners to btns for removing
function showPopUp(studentNr) {
  console.log(studentNr);
  document.querySelector("#prefect-modal").classList.remove("hide");
  document.querySelector(".prefAlert h4").textContent =
    "There can only be two prefects!";
  document.querySelector(
    ".a"
  ).textContent = `remove: ${studentNr[0].firstName}`;
  document.querySelector(
    ".b"
  ).textContent = `remove: ${studentNr[1].firstName}`;

  document.querySelector(".a").addEventListener("click", removeFirst);
  document.querySelector(".b").addEventListener("click", removeSecond);
}

//remove first student
function removeFirst() {
  const studentNr = studentListArr.filter((student) => student.prefect);
  let removed = studentNr.shift();
  document.querySelector("#prefect-modal").classList.add("hide");
  alert("selected prefect is removed, prefect btn status error");
  //TODO: remove prefect status from btn

  displayAsNotPrefect(removed);
  //close if you want to leave it without removing
  document.querySelector(".close_but").addEventListener("click", () => {
    document.querySelector("#prefect-modal").classList.add("hide");
  });
}

//remove second student NEED array param
function removeSecond() {
  const studentNr = studentListArr.filter((student) => student.prefect);
  let removed = studentNr.slice(1, 2);

  console.log("selected prefect is removed, prefect btn status error");
  document.querySelector("#prefect-modal").classList.add("hide");

  //TODO: remove prefect status from btn
  alert("selected prefect is removed, prefect btn status error");
  //close if you want to leave it without removing
  document.querySelector(".close_but").addEventListener("click", () => {
    document.querySelector("#prefect-modal").classList.add("hide");
  });
}
