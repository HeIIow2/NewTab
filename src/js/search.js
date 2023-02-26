const LAST_USED_COOKIE_NAME = "engine";

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


function go_to(url) {
    setTimeout(function () {
        window.open(url, "_self");
    });
}

const REGEX = {
    HENTAI_TAG: new RegExp("\\d{6}"),
    URL: new RegExp(
        '^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i' // fragment locator
        ) 
}


const ELEMENTS = { 
    FORM: document.getElementById("search-form"),
    QUERY: document.getElementById("query-elem"),
    ALL_OPTIONS: document.getElementById("engine-elem"),
    OPTION_LIST: document.getElementById("engine-elem").getElementsByClassName("option"),
    ENGINE_BANG: document.getElementById("engine-bang")
}


class SearchEngine {
    constructor(name, url, bang) {
        // the name has to be the same than the id
        this.name = name;
        this.url = url;
        // for "google" bang could be "g". With the promt "!g querry"
        // it would automatically search with google
        this.bang = bang;
        this.dom_element;
    }

    set_bang_label() {
        ELEMENTS.ENGINE_BANG.innerText = "!" + this.bang;
    }

    set(first_to_last = false) {
        console.log("setting "+this.name+" as search engine");

        this.set_bang_label();
        ELEMENTS.ALL_OPTIONS.setAttribute("value", this.name);
        ELEMENTS.QUERY.placeholder = "search on " + this.name;
        document.cookie = LAST_USED_COOKIE_NAME + "=" + this.name;
    
        // move the clicked element to the top of all children
        ELEMENTS.ALL_OPTIONS.insertBefore(this.dom_element, ELEMENTS.ALL_OPTIONS.firstChild);
    
        if (first_to_last) {
            ELEMENTS.ALL_OPTIONS.appendChild(ELEMENTS.ALL_OPTIONS.children[1]);
        }    
    }

    search(search_query) {
        if (search_query.match(REGEX.URL)) {
            go_to(search_query)
            return;
        }
    
        if (search_query.match(REGEX.HENTAI_TAG)) {
            const url = "https://nhentai.net/g/" + search_query;
            go_to(url)
            return;
        }
    
        go_to(this.url + search_query.replace(" ", "+"));
    }
}


class Engines {
    static engines = Array.of(
        new SearchEngine("nix", "https://search.nixos.org/packages?channel=22.11&from=0&size=50&sort=relevance&type=packages&query=", "n"),
        new SearchEngine("duck-duck-go", "https://duckduckgo.com/?q=", "d"),
        new SearchEngine("google", "https://www.google.com/search?q=", "g"),
        new SearchEngine("youtube", "https://www.youtube.com/results?search_query=", "yt"),
        new SearchEngine("rule34", "https://rule34.xxx/index.php?page=post&s=list&tags=", "r34"),
        new SearchEngine("bing", "https://www.bing.com/search?q=", "bi"),
        new SearchEngine("yahoo", "https://de.search.yahoo.com/search?p=", "ya"),
        new SearchEngine("yandex", "https://yandex.com/search/?text=", "y"),
        new SearchEngine("brave", "https://search.brave.com/search?q=", "b")
    );
    static currentEngine = this.engines[0];

    static name_map = {};
    static bang_map = {};

    static initialize_maps() {
        for (var engineInstance of Engines.engines) {
            Engines.name_map[engineInstance.name] = engineInstance;
            Engines.bang_map[engineInstance.bang] = engineInstance;
        }
    }

    static initialize_dom_obj() {
        for (const object of ELEMENTS.OPTION_LIST) {
            var name = object.getAttribute("id");
            var engine_instance = Engines.name_map[name];

            engine_instance.dom_element = object;
        }
    }

    static initialize() {
        Engines.initialize_maps();
        Engines.initialize_dom_obj();

        // loading last used engine, if the cookie can be found
        let engine_name_from_cookie = getCookie(LAST_USED_COOKIE_NAME);

        if (engine_name_from_cookie !== "") {
            if (!engine_name_from_cookie in Engines.name_map) {
                console.error("ERROR READING COOKIES");
                return;
            }

            Engines.set_to_name(engine_name_from_cookie);
        } else {
            // if the cookie has not been set yet it needs to load the default search engine, 
            // which just is the first option in the html list

            let firstOption = ELEMENTS.OPTION_LIST[0];
            Engines.set_to_object(firstOption);
        }
    }

    static get_engine_by_name(engine_name) {
        if (!engine_name in Engines.name_map) {
            console.error("name is invalid, \""+engine_name+"\" hasn't been found");
            return;
        }
        return Engines.name_map[engine_name]
    }

    static set_to_name(engine_name, first_to_last = false) {
        let new_engine = Engines.get_engine_by_name(engine_name);
        if (new_engine === null) {
            return null;
        }

        Engines.currentEngine = new_engine; 
        Engines.currentEngine.set(first_to_last);
    }

    static set_to_object(object, first_to_last = false) {
        const engine_name = object.getAttribute("id");
        Engines.set_to_name(engine_name, first_to_last);
    }

    static search_at(name, query, fullQuery="") {
        if (name in Engines.bang_map) {
            return Engines.bang_map[name].search(query);
        } 
        if (name in Engines.name_map) {
            return Engines.name_map[name].search(query);
        }

        return Engines.currentEngine.search(fullQuery);
    }


}



// add event listeners
ELEMENTS.FORM.addEventListener("keydown", function (e) {
    if (e.key === 'Enter') {
        submit();
    } else if (e.key === 'ArrowUp') {
        Engines.set_to_object(ELEMENTS.ALL_OPTIONS.lastElementChild);
    } else if (e.key === 'ArrowDown') {
        Engines.set_to_object(ELEMENTS.ALL_OPTIONS.children[1], true);
    }
});

for (const option of ELEMENTS.OPTION_LIST) {
    option.addEventListener("click", clicked_option);
    option.addEventListener("mouseenter", onmousein_option);
    option.addEventListener("mouseout",  onmouseout_option);
}

// if another search engine is chosen
function clicked_option(option) {
    const object = option.target

    Engines.set_to_object(object);
}

function onmousein_option(option) {
    const object = option.target;

    let bang_engine = Engines.get_engine_by_name(object.getAttribute("id"));
    if (bang_engine === null) {
        return;
    }
    bang_engine.set_bang_label();
}

function onmouseout_option(option) {
    Engines.currentEngine.set_bang_label();
}



// if form got submitted
function submit() {
    const search_query = ELEMENTS.QUERY.value;
    if (search_query.charAt(0) === "!") {
        let first_space = search_query.indexOf(" ");
        let engine_name = search_query.slice(1, first_space); // substring between start and end
        let query = search_query.slice(first_space+1, first_space.length);

        Engines.search_at(engine_name, query, search_query);
        return;
    }

    Engines.currentEngine.search(search_query);
}


Engines.initialize();

