const form_elem = document.getElementById("search-form");
const query_element = document.getElementById("query-elem");
const all_options_elem = document.getElementById("engine-elem");
const option_elements = all_options_elem.getElementsByClassName("option");



// add event listeners
form_elem.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        submit();
    }
});
for (const option of option_elements) {
    option.addEventListener("click", clicked_option);
}

// if another search engine is chosen
function clicked_option(option) {
    const object = option.target
    const clicked_id = object.getAttribute("id");
    all_options_elem.setAttribute("value", clicked_id)
    // move the clicked element to the top of all children
    all_options_elem.insertBefore(object, all_options_elem.firstChild);
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