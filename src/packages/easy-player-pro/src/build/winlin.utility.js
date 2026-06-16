function padding(number, length, prefix) {
    if(String(number).length >= length){
        return String(number);
    }
    return padding(prefix+number, length, prefix);
}

function system_array_remove(arr, elem) {
    if (!arr) {
        return;
    }

    var removed = true;
    var i = 0;
    while (removed) {
        removed = false;
        for (; i < arr.length; i++) {
            if (elem == arr[i]) {
                arr.splice(i, 1);
                removed = true;
                break;
            }
        }
    }
}

function system_array_contains(arr, elem_or_function) {
    return system_array_get(arr, elem_or_function) != null;
}

function system_array_get(arr, elem_or_function) {
    for (var i = 0; i < arr.length; i++) {
        if (typeof elem_or_function == "function") {
            if (elem_or_function(arr[i])) {
                return arr[i];
            }
        } else {
            if (elem_or_function == arr[i]) {
                return arr[i];
            }
        }
    }
    return null;
}

function system_array_foreach(arr, pfn) {
    if (!pfn) {
        return false;
    }

    for (var i = 0; i < arr.length; i++) {
        if (!pfn(arr[i], i)) {
            return false;
        }
    }

    return true;
}

function system_string_startswith(str, flag) {
    if (typeof flag == "object" && flag.constructor == Array) {
        for (var i = 0; i < flag.length; i++) {
            if (system_string_startswith(str, flag[i])) {
                return true;
            }
        }
    }

    return str && flag && str.length >= flag.length && str.indexOf(flag) == 0;
}

function system_string_endswith(str, flag) {
    if (typeof flag == "object" && flag.constructor == Array) {
        for (var i = 0; i < flag.length; i++) {
            if (system_string_endswith(str, flag[i])) {
                return true;
            }
        }
    }

    return str && flag && str.length >= flag.length && str.indexOf(flag) == str.length - flag.length;
}

function system_string_trim(str, flag) {
    if (!flag || !flag.length || typeof flag != "string") {
        return str;
    }

    while (system_string_startswith(str, flag)) {
        str = str.slice(flag.length);
    }

    while (system_string_endswith(str, flag)) {
        str = str.slice(0, str.length - flag.length);
    }

    return str;
}

function array_sort_asc(elem_a, elem_b) {
    if (elem_a > elem_b) {
        return 1;
    }
    return (elem_a < elem_b)? -1 : 0;
}
function array_sort_desc(elem_a, elem_b) {
    return -1 * array_sort_asc(elem_a, elem_b);
}
function system_array_sort_asc(elem_a, elem_b) {
    return array_sort_asc(elem_a, elem_b);
}
function system_array_sort_desc(elem_a, elem_b) {
    return -1 * array_sort_asc(elem_a, elem_b);
}

function parse_query_string(){
    var obj = {};

    // add the uri object.
    // parse the host(hostname:http_port), pathname(dir/filename)
    obj.host = window.location.host;
    obj.hostname = window.location.hostname;
    obj.http_port = (window.location.port == "")? 80:window.location.port;
    obj.pathname = window.location.pathname;
    if (obj.pathname.lastIndexOf("/") <= 0) {
        obj.dir = "/";
        obj.filename = "";
    } else {
        obj.dir = obj.pathname.slice(0, obj.pathname.lastIndexOf("/"));
        obj.filename = obj.pathname.slice(obj.pathname.lastIndexOf("/"));
    }

    // pure user query object.
    obj.user_query = {};

    // parse the query string.
    var query_string = String(window.location.search).replace(" ", "").split("?")[1];
    if(query_string === undefined){
        query_string = String(window.location.hash).replace(" ", "").split("#")[1];
        if(query_string === undefined){
            return obj;
        }
    }

    __fill_query(query_string, obj);

    return obj;
}

function __fill_query(query_string, obj) {
    // pure user query object.
    obj.user_query = {};

    if (query_string.length === 0) {
        return;
    }

    // split again for angularjs.
    if (query_string.indexOf("?") >= 0) {
        query_string = query_string.split("?")[1];
    }

    var queries = query_string.split("&");
    for (var i = 0; i < queries.length; i++) {
        var elem = queries[i];

        var query = elem.split("=");
        obj[query[0]] = query[1];
        obj.user_query[query[0]] = query[1];
    }

    // alias domain for vhost.
    if (obj.domain) {
        obj.vhost = obj.domain;
    }
}

function parse_rtmp_url(rtmp_url) {
    // @see: http://stackoverflow.com/questions/10469575/how-to-use-location-object-to-parse-url-without-redirecting-the-page-in-javascri
    var a = document.createElement("a");
    a.href = rtmp_url.replace("rtmp://", "http://")
        .replace("webrtc://", "http://")
        .replace("rtc://", "http://");

    var vhost = a.hostname;
    var app = a.pathname.substring(1, a.pathname.lastIndexOf("/"));
    var stream = a.pathname.slice(a.pathname.lastIndexOf("/") + 1);

    // parse the vhost in the params of app, that srs supports.
    app = app.replace("...vhost...", "?vhost=");
    if (app.indexOf("?") >= 0) {
        var params = app.slice(app.indexOf("?"));
        app = app.slice(0, app.indexOf("?"));

        if (params.indexOf("vhost=") > 0) {
            vhost = params.slice(params.indexOf("vhost=") + "vhost=".length);
            if (vhost.indexOf("&") > 0) {
                vhost = vhost.slice(0, vhost.indexOf("&"));
            }
        }
    }

    // when vhost equals to server, and server is ip,
    // the vhost is __defaultVhost__
    if (a.hostname === vhost) {
        var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if (re.test(a.hostname)) {
            vhost = "__defaultVhost__";
        }
    }
    
    // parse the schema
    var schema = "rtmp";
    if (rtmp_url.indexOf("://") > 0) {
        schema = rtmp_url.slice(0, rtmp_url.indexOf("://"));
    }

    var port = a.port;
    if (!port) {
        if (schema === 'http') {
            port = 80;
        } else if (schema === 'https') {
            port = 443;
        } else if (schema === 'rtmp') {
            port = 1935;
        }
    }

    var ret = {
        url: rtmp_url,
        schema: schema,
        server: a.hostname, port: port,
        vhost: vhost, app: app, stream: stream
    };
    __fill_query(a.search, ret);

    // For webrtc API, we use 443 if page is https, or schema specified it.
    if (!ret.port) {
        if (schema === 'webrtc' || schema === 'rtc') {
            if (ret.user_query.schema === 'https') {
                ret.port = 443;
            } else if (window.location.href.indexOf('https://') === 0) {
                ret.port = 443;
            } else {
                // For WebRTC, SRS use 1985 as default API port.
                ret.port = 1985;
            }
        }
    }

    return ret;
}

function get_browser_agents() {
    var agent = navigator.userAgent;

    return {
        // platform
        Android: agent.indexOf("Android") != -1,
        Windows: agent.indexOf("Windows") != -1,
        iPhone: agent.indexOf("iPhone") != -1,
        // Windows Browsers
        Chrome: agent.indexOf("Chrome") != -1,
        Firefox: agent.indexOf("Firefox") != -1,
        QQBrowser: agent.indexOf("QQBrowser") != -1,
        MSIE: agent.indexOf("MSIE") != -1,
        // Android Browsers
        Opera: agent.indexOf("Presto") != -1,
        MQQBrowser: agent.indexOf("MQQBrowser") != -1
    };
}

function relative_seconds_to_HHMMSS(seconds){
    var date = new Date();
    date.setTime(Number(seconds) * 1000);

    var ret = padding(date.getUTCHours(), 2, '0')
        + ":" + padding(date.getUTCMinutes(), 2, '0')
        + ":" + padding(date.getUTCSeconds(), 2, '0');

    return ret;
}

function absolute_seconds_to_HHMMSS(seconds){
    var date = new Date();
    date.setTime(Number(seconds) * 1000);

    var ret = padding(date.getHours(), 2, '0')
        + ":" + padding(date.getMinutes(), 2, '0')
        + ":" + padding(date.getSeconds(), 2, '0');

    return ret;
}

function absolute_seconds_to_YYYYmmdd(seconds) {
    var date = new Date();
    date.setTime(Number(seconds) * 1000);

    var ret = date.getFullYear()
        + "-" + padding(date.getMonth() + 1, 2, '0')
        + "-" + padding(date.getDate(), 2, '0');

    return ret;
}

function YYYYmmdd_parse(str) {
    var date = new Date();
    date.setTime(Date.parse(str));
    return date;
}

function AsyncRefresh(pfn, refresh_interval) {
    this.refresh_interval = refresh_interval;

    this.__handler = null;
    this.__pfn = pfn;

    this.__enabled = true;
}

AsyncRefresh.prototype.refresh_disable = function() {
    this.__enabled = false;
}
AsyncRefresh.prototype.refresh_enable = function() {
    this.__enabled = true;
}
AsyncRefresh.prototype.refresh_is_enabled = function() {
    return this.__enabled;
}

AsyncRefresh.prototype.request = function(timeout) {
    if (this.__handler) {
        clearTimeout(this.__handler);
    }

    this.__handler = setTimeout(this.__pfn, timeout);
}

function AsyncRefresh2() {
    this.on_before_call_pfn = null;

    // use a anonymous function to call, and check the enabled when actually invoke.
    this.__call = {
        pfn: null,
        timeout: 0,
        __enabled: false,
        __handler: null
    };
}

var async_refresh2 = new AsyncRefresh2();

AsyncRefresh2.prototype.initialize = function(pfn, timeout) {
    this.refresh_change(pfn, timeout);
}

AsyncRefresh2.prototype.stop = function() {
    this.__call.__enabled = false;
}

AsyncRefresh2.prototype.restart = function() {
    this.__call.__enabled = true;
    this.request(0);
}

AsyncRefresh2.prototype.refresh_change = function(pfn, timeout) {
    // cancel the previous call.
    if (this.__call.__handler) {
        clearTimeout(this.__handler);
    }
    this.__call.__enabled = false;

    // setup new call.
    this.__call = {
        pfn: pfn,
        timeout: timeout,
        __enabled: true,
        __handler: null
    };
}

AsyncRefresh2.prototype.request = function(timeout) {
    var self = this;
    var this_call = this.__call;

    // clear previous timeout.
    if (this_call.__handler) {
        clearTimeout(this_call.__handler);
    }

    // override the timeout
    if (timeout == undefined) {
        timeout = this_call.timeout;
    }

    // if user disabled refresher.
    if (this_call.pfn == null || timeout == null) {
        return;
    }

    this_call.__handler = setTimeout(function(){
        // cancelled by refresh_change, ignore.
        if (!this_call.__enabled) {
            return;
        }

        // callback if the handler installled.
        if (self.on_before_call_pfn) {
            if (!self.on_before_call_pfn()) {
                return;
            }
        }

        // do the actual call.
        this_call.pfn();
    }, timeout);
}

