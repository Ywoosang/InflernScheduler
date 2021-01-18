function $(selector) {
    return document.querySelector(selector);
}
function makeResponse(url) {
    var requrl = "/crawldata";
    var data = {
        url: url
    };
    console.log(data);
    fetch(requrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(function (res) {
        return res.json();
    })
        .then(function (response) {
        console.log(response);
        createDom(response);
    })["catch"](function (error) {
        // if status code is 403
        console.log(error);
    });
}
// sections > section > contents > content
setTimeout(function () {
    var url = $('.hidden-url').innerHTML;
    console.log(url);
    makeResponse(url);
}, 40);
function createDom(res) {
    var alignSection1 = $('.as-1');
    var alignSection2 = $('.as-2');
    var alignSection3 = $('.as-3');
    var main = $('.main');
    var sectionNumber = 0;
    var sections = res.sections;
    for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
        var section = sections_1[_i];
        var sectionWrapper = document.createElement('ul');
        var totalContentTime = 0;
        for (var _a = 0, _b = section['contents']; _a < _b.length; _a++) {
            var content = _b[_a];
            var sectionContentTag = document.createElement('li');
            sectionContentTag.classList.add('content');
            var videoLengthString = content.time;
            var videolength = void 0;
            if (videoLengthString === '1분 미만') {
                videolength = 1;
            }
            else {
                videolength = Number(videoLengthString.replace('분', ''));
            }
            var contentName = "<a class=\"content-name\">" + content.name + " </a><a class='content-length'><span class=\"lecture-time\" style=\"color:crimson\">" + videolength + "</span>\uBD84</a>";
            sectionContentTag.innerHTML = contentName;
            sectionWrapper.appendChild(sectionContentTag);
            totalContentTime += videolength;
        }
        var sectionNameTag = document.createElement('li');
        sectionNameTag.classList.add('title');
        var sectionName = "<i class=\"fa fa-list-alt\"></i> \uC139\uC158 " + (sectionNumber + 1) + ": " + section.name + " <a class=\"total-content-select\">" + totalContentTime + "\uBD84</a>";
        sectionNameTag.innerHTML = sectionName;
        sectionWrapper.prepend(sectionNameTag);
        var selectAlignSection = sectionNumber % 3;
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
    var lectureTitle = document.createElement('article');
    lectureTitle.classList.add('lecture-title');
    var title = document.createElement('h3');
    title.classList.add('lec-title');
    title.innerText = '강좌명 : ' + res.title;
    lectureTitle.appendChild(title);
    main.prepend(lectureTitle);
    setEvent();
}
var totalStudyTime = $('.std-time-1');
var lectureStudyTime = $('.std-time-2');
var addedStudyTime = $('.std-time-3');
var addInput = $('.add-input');
var subInput = $('.sub-input');
var addButton = $('.add-btn');
var subButton = $('.sub-btn');
function setEvent() {
    var contents = document.getElementsByClassName('content');
    var sectionTitles = document.getElementsByClassName('title');
    addButton.addEventListener('click', addAddedStudyTime);
    subButton.addEventListener('click', subAddedStudyTime);
    for (var _i = 0, _a = contents; _i < _a.length; _i++) {
        var content = _a[_i];
        content.addEventListener('click', toggleStudyTime);
    }
    for (var _b = 0, sectionTitles_1 = sectionTitles; _b < sectionTitles_1.length; _b++) {
        var sectionTitle = sectionTitles_1[_b];
        sectionTitle.addEventListener('click', sectionDoneToggle);
    }
}
function sectionDoneToggle() {
    console.log(this);
    this.classList.toggle('section-done');
    this.parentNode.querySelectorAll('.content').forEach(function (element) {
        element.classList.add('done');
    });
    if (this.classList.contains('section-done')) {
        this.parentNode.querySelectorAll('.content').forEach(function (element) {
            element.classList.remove('done');
        });
    }
    calcLectureStudyTime();
}
function addAddedStudyTime() {
    if (addInput.value !== '') {
        console.log(addInput.value);
        addedStudyTime.innerText = (Number(addedStudyTime.innerText) + Number(addInput.value)).toString();
        addInput.value = '';
        calcTotal();
    }
}
function subAddedStudyTime() {
    if (subInput.value !== '') {
        console.log(subInput.value);
        var calcResult = Number(addedStudyTime.innerText) - Number(subInput.value);
        addedStudyTime.innerText = calcResult > 0 ? calcResult.toString() : '0';
        subInput.value = '';
        calcTotal();
    }
}
var lecTime = 0;
/*
강의가 추가또는 삭제 될 경우 전체 시간을 계산
*/
function toggleStudyTime(e) {
    var target = e.target;
    console.log(e.target);
    var liTag = target;
    console.log(liTag);
    liTag.classList.toggle('done');
    calcLectureStudyTime();
}
function calcLectureStudyTime() {
    var doneList = document.querySelectorAll('.done');
    console.log(doneList);
    doneList.forEach(function (element) {
        lecTime += Number(element.getElementsByClassName('lecture-time')[0].innerHTML);
        console.log(lecTime);
    });
    lectureStudyTime.innerText = Math.round(lecTime / speedOption).toString();
    lecTime = 0;
    calcTotal();
}
/*
배속 조정
*/
var speedOption = 1;
function changeSpeed() {
    var selectedSpeed = $('.form-select');
    var optionIndex = selectedSpeed.options.selectedIndex;
    var speed = Number(selectedSpeed.options[optionIndex].value);
    speedOption = speed;
    calcLectureStudyTime();
}
function calcTotal() {
    totalStudyTime.innerText = (Number(lectureStudyTime.innerText) + Number(addedStudyTime.innerText)).toString();
}
if (screen.availWidth < 768) {
}
