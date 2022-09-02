const all_options_elem = document.getElementById("engine-elem");
const option_elements = all_options_elem.getElementsByClassName("option");

for (const option of option_elements) {
    option.addEventListener("click", clicked_option);
}

function clicked_option(option) {
    // .setAttribute("attribute", "value");
    // let value = element.getAttribute(name);
    const object = option.target
    const clicked_id = object.getAttribute("id");
    all_options_elem.setAttribute("value", clicked_id)
    console.log(clicked_id + " got clicked.");

    moveChoiceTo(object, 1)
}

function moveChoiceTo(element) {
    all_options_elem.insertBefore(element, all_options_elem.firstChild);
}