type el = HTMLElement;

function $(selector: string): el {
  return document.querySelector(selector);
}

// const mainContents: el = $('.main');
// const errorModal: el = $('.server-modal');
// const closeButton: el = $('.close-btn');
// const closeIcon: el = $('btn-close');

// const body: el = $('body');
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
  console.log(main);
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
    const sectionName = `<i class="fa fa-list-alt"></i> ${section.name} <a class="total-content-select">${totalContentTime}분</a>`;
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
  const contents: any = document.getElementsByTagName('li');
  console.log(contents);
  addButton.addEventListener('click', addAddedStudyTime);
  subButton.addEventListener('click', subAddedStudyTime);

  for (const content of contents as el[]) {
    content.addEventListener('click', calcStudyTime);
  }
}
const pre = 0;

function changeSpeed() {
  const selectedSpeed = $('.form-select') as HTMLSelectElement;
  const optionIndex = selectedSpeed.options.selectedIndex;
  const speed = selectedSpeed.options[optionIndex].value;
  lectureStudyTime.innerText = parseInt(
    (Number(lectureStudyTime.innerText) / Number(speed)).toString()
  ).toString();
}

function addAddedStudyTime() {
  if (addInput.value !== '') {
    console.log(addInput.value);
    addedStudyTime.innerText = (
      Number(addedStudyTime.innerText) + Number(addInput.value)
    ).toString();
    calcTotal();
  }
}

function subAddedStudyTime() {
  if (subInput.value !== '') {
    console.log(subInput.value);
    const calcResult =
      Number(addedStudyTime.innerText) - Number(subInput.value);
    addedStudyTime.innerText = calcResult > 0 ? calcResult.toString() : '0';
    calcTotal();
  }
}

function calcStudyTime(e: Event) {
  const target = e.target as HTMLElement;
  console.log(e.target);
  const content = target.parentNode.querySelector(
    '.lecture-time'
  ) as HTMLElement;
  const liTag = target.parentNode as el;
  console.log(liTag);
  // console.log(content);
  const contentTime = Number(content.innerText.replace('분', ''));
  if (liTag.classList.contains('done')) {
    liTag.classList.remove('done');
    lectureStudyTime.innerText = (
      Number(lectureStudyTime.innerText) - contentTime
    ).toString();
  } else {
    liTag.classList.add('done');
    lectureStudyTime.innerText = (
      Number(lectureStudyTime.innerText) + contentTime
    ).toString();
  }
  calcTotal();
}

function calcTotal() {
  totalStudyTime.innerText = (
    Number(lectureStudyTime.innerText) + Number(addedStudyTime.innerText)
  ).toString();
}
