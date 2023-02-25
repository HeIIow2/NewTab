const form_elem = document.getElementById("search-form");
const query_element = document.getElementById("query-elem");
const all_options_elem = document.getElementById("engine-elem");
const option_elements = all_options_elem.getElementsByClassName("option");


const LAST_USED_COOKIE_NAME = "engine"


// add event listeners
form_elem.addEventListener("keydown", function (e) {
    if (e.key === 'Enter') {
        submit();
    } else if (e.key === 'ArrowUp') {
        set_engine(all_options_elem.lastElementChild);
    } else if (e.key === 'ArrowDown') {
        set_engine(all_options_elem.children[1], true);
    }
});
for (const option of option_elements) {
    option.addEventListener("click", clicked_option);
}

// if another search engine is chosen
function clicked_option(option) {
    const object = option.target
    set_engine(object);
}

function set_engine(object, first_to_last = false) {
    const clicked_id = object.getAttribute("id");
    console.log("Setting search engine to: " + clicked_id);

    all_options_elem.setAttribute("value", clicked_id)

    // set the cookie to the engine.
    document.cookie = LAST_USED_COOKIE_NAME + "=" + clicked_id;

    // move the clicked element to the top of all children
    all_options_elem.insertBefore(object, all_options_elem.firstChild);

    if (first_to_last) {
        all_options_elem.appendChild(all_options_elem.children[1]);
    }
}

function set_engine_to_name(engine_name, first_to_last = false) {
    let engine_object = document.getElementById(engine_name);
    set_engine(engine_object, first_to_last=first_to_last);
}

// if form got submitted
function submit() {
    const hentai_tag_regex = new RegExp("\\d{6}");
    const url_regex = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    const search_query = query_element.value;
    const search_engine = all_options_elem.getAttribute("value");

    if (search_query.match(url_regex)) {
        go_to(search_query)
        return;
    }

    if (search_query.match(hentai_tag_regex)) {
        const url = "https://nhentai.net/g/" + search_query;
        go_to(url)
        return;
    }

    const base_urls = {
        "nix": "https://search.nixos.org/packages?channel=22.11&from=0&size=50&sort=relevance&type=packages&query=",
        "duck-duck-go": "https://duckduckgo.com/?q=",
        "google": "https://www.google.com/search?q=",
        "youtube": "https://www.youtube.com/results?search_query=",
        "rule34": "https://rule34.xxx/index.php?page=post&s=list&tags=",
        "bing": "https://www.bing.com/search?q=",
        "yahoo": "https://de.search.yahoo.com/search?p=",
        "yandex": "https://yandex.com/search/?text=",
        "brave": "https://search.brave.com/search?q="
    };

    const url = base_urls[search_engine] + search_query.replace(" ", "+");
    go_to(url)
}

function go_to(url) {
    setTimeout(function () {
        window.open(url, "_self");
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}


// loading last used engine, if the cookie can be found
let engine_name_from_cookie = getCookie(LAST_USED_COOKIE_NAME);
if (engine_name_from_cookie !== "") {
    set_engine_to_name(engine_name_from_cookie);
} else {
    // if the cookie has not been set yet it needs to load the default search engine, 
    // which just is the first option in the html list

    let firstOption = document.getElementById("engine-elem").querySelector(".option");
    set_engine(firstOption);
}
