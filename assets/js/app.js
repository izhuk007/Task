/* добавлен плавный переход по якорям */

const anchors = document.querySelectorAll('.btn[data-goto]')

for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()

        const gotoBlock = document.querySelector(anchor.dataset.goto);
        const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

        window.scrollTo({
            top: gotoBlockValue,
            behavior: "smooth"
        });
    })
}

let addShow;
let addHide;
let counter = 0;
let sceneActive = 0;
let allTitles = [];

let labels = [
    'Make my Sоft',
    'Разработка',
    'Тестирование',
    'Продвижение',
    'Работа у нас',
    'Контакты'
];

/*  Разбиваем текст загловков на отдельные слова  */

for (let i = 0; i < labels.length; i++) {
    labels[i] = '<span class="title__label">' + labels[i].split(' ').join('</span><span class="title__label">') + '</span>'
}

/*  Функция для запуска анимации  */

function showTitle(title, label, classAct) {
    title.innerHTML = label;
    const titleItems = title.querySelectorAll('.title__label');
    titleItems.forEach(e => e.classList.add(classAct));
}

/*  Добавлена анимация при наведении  */

const titles = document.querySelectorAll('.title');

for (let index = 0; index < titles.length; index++) {
    allTitles.push(titles[index]);
    const title = titles[index];
    title.innerHTML = labels[index];

    title.onmouseenter = function (e) {
        if (counter === 0) {
            addHide = setTimeout(() => {
                showTitle(title, labels[index], 'is-hide')
            }, 300);
            addShow = setTimeout(() => {
                showTitle(title, labels[index], 'is-show')
            }, 1300);
            counter = 1;
        }
    }

    title.onmouseleave = function (e) {
        if (sceneActive === 0) {
            title.innerHTML = labels[index];
            counter = 0;
            clearTimeout(addHide);
            clearTimeout(addShow);
        }
    }
}

const sections = document.querySelectorAll('.section');
const indexLabel = document.querySelector('.num__label');
const numberPage = document.querySelector('.num');
const controller = new ScrollMagic.Controller();


/*  Для каждой секции добавляем смену индекса  */

sections.forEach(function(section, index) {
    const triggerEl = section.querySelector('.title')
    const sectionTitles = section.querySelectorAll('.title')
    const sceneIndex = new ScrollMagic.Scene({
        triggerElement: section,
        triggerHook: triggerEl.offsetHeight / window.innerHeight
    })

    sceneIndex.on("start", function (event) {
        let pageNum = index + event.progress;
        indexLabel.innerHTML = pageNum < 10 ? "0" + pageNum : pageNum;
    })
    sceneIndex.addTo(controller)

    /*  Для каждой секции добавляем анимацию заголовков  */

    let sceneTitle = new ScrollMagic.Scene({
        triggerElement: section,
        triggerHook: triggerEl.offsetHeight / window.innerHeight,
        duration: triggerEl.offsetHeight + triggerEl.offsetTop
    })

    sceneTitle.on("enter", function (event) {
        counter = 1;
        sceneActive = 1;
        numberPage.style.top = ((triggerEl.offsetTop + (triggerEl.offsetHeight / 2) - numberPage.offsetHeight / 2) ) + 'px'
        for (let i = 0; i < sectionTitles.length; i++) {
            const sectionTitle = sectionTitles[i];
            setTimeout(() => {
                showTitle(sectionTitle, labels[allTitles.indexOf(sectionTitle)], 'is-hide')
            }, 300);
            setTimeout(() => {
                showTitle(sectionTitle, labels[allTitles.indexOf(sectionTitle)], 'is-show')
            }, 1300);
        }
        setTimeout(() => {
            counter = 0;
            sceneActive = 0;
        }, 2500);
    })

    window.addEventListener('resize', e => {
        sceneTitle.duration(triggerEl.offsetHeight + triggerEl.offsetTop);
        sceneTitle.refresh(true);
    })

    window.addEventListener('DOMContentLoaded', e => {
        sceneTitle.duration(triggerEl.offsetHeight + triggerEl.offsetTop);
        sceneTitle.refresh(true);
    })

    sceneTitle.addTo(controller);
})

/*  Добавлено появление попапа  */

const popupButtons = document.querySelectorAll('.popup-button');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 200;

if (popupButtons.length > 0) {
    for (let index = 0; index < popupButtons.length; index++) {
        const popupButton = popupButtons[index];
        popupButton.addEventListener("click", function (e) {
            const curentPopup = document.querySelector(popupButton.dataset.open);
            popupOpen(curentPopup);
            e.preventDefault()
        });
    }
}
const popupCloseButton = document.querySelectorAll('.popup__close');
if (popupCloseButton.length > 0) {
    for (let index = 0; index < popupCloseButton.length; index++) {
        const el = popupCloseButton[index];
        el.addEventListener('click', function (e) {
            popupClose(el.closest('.popup'));
            e.preventDefault()
        });
    }
}

function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open');
        curentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}

function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnlock) {
            bodyUnLock()
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

(function () {
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (css) {
            var node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();
(function () {
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;
    }
})();

/*  Добавлен скролл у контента в попапе  */

new SimpleBar(document.querySelector('.popup__wrap'));
