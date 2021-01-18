type el = HTMLElement;

function $(selector: string): el {
  return document.querySelector(selector);
}

function makeResponse(url: string) {
  const requrl = `/crawldata`;
  const data = {
    url: url,
  };
  console.log(data);
  fetch(requrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(res => {
      return res.json();
    })
    .then(response => {
      console.log(response);
      createDom(response);
    })
    .catch(error => {
      // if status code is 403
      console.log(error);
    });
}
// sections > section > contents > content
setTimeout(() => {
  const url = $('.hidden-url').innerHTML;
  console.log(url);
  makeResponse(url);
}, 40);

interface Content {
  name: string;
  time: string;
}

interface Section {
  name: string;
  contents: Content[];
}

interface ServerResponse {
  title: string;
  sections: Section[];
}
function createDom(res: ServerResponse): void {
  const alignSection1: el = $('.as-1');
  const alignSection2: el = $('.as-2');
  const alignSection3: el = $('.as-3');
  const main: el = $('.main');
  let sectionNumber = 0;
  const sections: Section[] = res.sections;
  for (const section of sections) {
    const sectionWrapper = document.createElement('ul');
    let totalContentTime = 0;
    for (const content of section['contents']) {
      const sectionContentTag = document.createElement('li');
      sectionContentTag.classList.add('content');

      const videoLengthString: string = content.time;
      let videolength;
      if (videoLengthString === '1분 미만') {
        videolength = 1;
      } else {
        videolength = Number(videoLengthString.replace('분', ''));
      }
      const contentName = `<a class="content-name">${content.name} </a><a class='content-length'><span class="lecture-time" style="color:crimson">${videolength}</span>분</a>`;
      sectionContentTag.innerHTML = contentName;
      sectionWrapper.appendChild(sectionContentTag);
      totalContentTime += videolength;
    }
    const sectionNameTag = document.createElement('li');
    sectionNameTag.classList.add('title');
    const sectionName = `<i class="fa fa-list-alt"></i> 섹션 ${
      sectionNumber + 1
    }: ${
      section.name
    } <a class="total-content-select">${totalContentTime}분</a>`;
    sectionNameTag.innerHTML = sectionName;
    sectionWrapper.prepend(sectionNameTag);
    const selectAlignSection: number = sectionNumber % 3;
    switch (selectAlignSection) {
      case 0:
        alignSection1.appendChild(sectionWrapper);
        sectionNumber++;
        break;
      case 1:
        alignSection2.appendChild(sectionWrapper);
        sectionNumber++;
        break;
      case 2:
        alignSection3.appendChild(sectionWrapper);
        sectionNumber++;
    }
  }
  const lectureTitle: el = document.createElement('article');
  lectureTitle.classList.add('lecture-title');
  const title: el = document.createElement('h3');
  title.classList.add('lec-title');
  title.innerText = '강좌명 : ' + res.title;
  lectureTitle.appendChild(title);
  main.prepend(lectureTitle);
  setEvent();
}

const totalStudyTime: el = $('.std-time-1');
const lectureStudyTime: el = $('.std-time-2');
const addedStudyTime: el = $('.std-time-3');
const addInput = $('.add-input') as HTMLInputElement;
const subInput = $('.sub-input') as HTMLInputElement;
const addButton = $('.add-btn') as HTMLButtonElement;
const subButton = $('.sub-btn') as HTMLButtonElement;
function setEvent() {
  const contents: any = document.getElementsByClassName('content');
  const sectionTitles: any = document.getElementsByClassName('title');
  addButton.addEventListener('click', addAddedStudyTime);
  subButton.addEventListener('click', subAddedStudyTime);
  for (const content of contents as el[]) {
    content.addEventListener('click', toggleStudyTime);
  }
  for (const sectionTitle of sectionTitles) {
    sectionTitle.addEventListener('click', sectionDoneToggle);
  }
}

function sectionDoneToggle() {
  console.log(this);
  this.classList.toggle('section-done');
  this.parentNode.querySelectorAll('.content').forEach((element: any) => {
    element.classList.add('done');
  });
  if (this.classList.contains('section-done')) {
    this.parentNode.querySelectorAll('.content').forEach((element: any) => {
      element.classList.remove('done');
    });
  }
  calcLectureStudyTime();
}

function addAddedStudyTime() {
  if (addInput.value !== '') {
    console.log(addInput.value);
    addedStudyTime.innerText = (
      Number(addedStudyTime.innerText) + Number(addInput.value)
    ).toString();
    addInput.value = '';
    calcTotal();
  }
}

function subAddedStudyTime() {
  if (subInput.value !== '') {
    console.log(subInput.value);
    const calcResult =
      Number(addedStudyTime.innerText) - Number(subInput.value);
    addedStudyTime.innerText = calcResult > 0 ? calcResult.toString() : '0';
    subInput.value = '';
    calcTotal();
  }
}
let lecTime = 0;

/*
강의가 추가또는 삭제 될 경우 전체 시간을 계산
*/
function toggleStudyTime(e: Event): void {
  const target = e.target as HTMLElement;
  console.log(e.target);
  const liTag = target as el;
  console.log(liTag);
  liTag.classList.toggle('done');
  calcLectureStudyTime();
}

function calcLectureStudyTime(): void {
  const doneList = document.querySelectorAll('.done');
  console.log(doneList);
  doneList.forEach((element: HTMLElement) => {
    lecTime += Number(
      element.getElementsByClassName('lecture-time')[0].innerHTML
    );
    console.log(lecTime);
  });
  lectureStudyTime.innerText = Math.round(lecTime / speedOption).toString();
  lecTime = 0;
  calcTotal();
}

/* 
배속 조정
*/
let speedOption = 1;

function changeSpeed() {
  const selectedSpeed = $('.form-select') as HTMLSelectElement;
  const optionIndex = selectedSpeed.options.selectedIndex;
  const speed = Number(selectedSpeed.options[optionIndex].value);
  speedOption = speed;
  calcLectureStudyTime();
}

function calcTotal() {
  totalStudyTime.innerText = (
    Number(lectureStudyTime.innerText) + Number(addedStudyTime.innerText)
  ).toString();
}

if (screen.availWidth < 768) {
}
