function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function onload() {
    const catgirl_elem = document.getElementById("popup-catgirl");

    let catgirl_is_visible = false;


    randomly_catgirl();
    function toggle_catgirl() {
        if (catgirl_is_visible) {
            catgirl_elem.style.transform = "translateY(300px)";
            catgirl_is_visible = false;
        } else {
            catgirl_elem.style.transform = "translateY(0)";
            catgirl_is_visible = true;
        }
    }

    function randomly_catgirl() {
        toggle_catgirl()
        setTimeout(randomly_catgirl, random(1000, 10000));
    }
}

function show_catgirl() {
    const catgirl_elem = document.getElementById("popup-catgirl");

    catgirl_elem.style.transform = "translateY(0)";

    setTimeout(function () {
        catgirl_elem.style.transform = "translateY(300px)";
    }, 10000);
}
