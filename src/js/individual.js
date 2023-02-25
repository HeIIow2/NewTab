


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
}


let dde = document.documentElement;

dde.addEventListener("mousemove", e => {
    parallax(e);
});

function parallax(e) {
    let ow = dde.offsetWidth;
    let oh = dde.offsetHeight;
    dde.style.setProperty('--mouseX', e.clientX * 10 / ow + "%");
    dde.style.setProperty('--mouseY', e.clientY * 10 / oh + "%");
}
