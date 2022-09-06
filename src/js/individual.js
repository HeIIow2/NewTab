let cards;
let card_pos = [];


function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

let catgirl_is_visible = false;
let catgirl_element;

function show_catgirl() {
    catgirl_element.style.transform = "translateY(0)";
    catgirl_is_visible = true;

    setTimeout(hide_catgirl, random(1000, 10000));
}

function hide_catgirl() {
    catgirl_element.style.transform = "translateY(300px)";
    catgirl_is_visible = false;

    setTimeout(show_catgirl, random(10000, 100000));
}

function onload() {
    catgirl_element = document.getElementById("popup-catgirl");
    setTimeout(show_catgirl, random(10000, 100000));

    cards = document.getElementsByClassName("card-wrapper")
    for (const c of cards) {
        card_pos.push(getCoords(c));
    }
    console.log(card_pos)
}


let dde = document.documentElement;

dde.addEventListener("mousemove", e => {
    if (cards != null) {
        modify_card_size(e);
    }
});

function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}



function modify_card_size(e) {
    const x = e.clientX;
    const y = e.clientY;
    for (var i=0; i<cards.length; i++) {
        const card = cards[i];
        const x_c = card_pos[i]["left"];
        const y_c = card_pos[i]["top"];
        const distance = Math.abs(x - x_c) + Math.abs(y - y_c);

        let size = 100 - (distance/20);
        if (size < 50) {
            size = 50;
        }
        card.style.setProperty("--width", size.toString() + "%");
        card.style.setProperty("--height", size.toString() + "%");
    }
}
