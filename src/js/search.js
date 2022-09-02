const query_element = document.getElementById("query-elem");
const engine_element = document.getElementById("engine-elem");


function search_in_web() {
    const hentai_tag_regex = new RegExp("\\d{6}");
    const url_regex = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    const search_query = query_element.value;
    const search_engine = engine_element.getAttribute("value");

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