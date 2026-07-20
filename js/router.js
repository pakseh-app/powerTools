/**
 * ==========================================================
 * PowerTools Router
 * File    : router.js
 * Version : 1.0.0
 * Author  : PowerTools
 * ==========================================================
 */

class Router {

    constructor(options = {}) {

        this.options = {
            mode: "history",
            root: "/",
            hashPrefix: "",
            caseSensitive: false,
            strictTrailingSlash: false,
            interceptLinks: true,
            scrollRestoration: true,
            debug: false,
            ...options
        };

        this.routes = [];
        this.routeNames = new Map();
        this.middlewares = [];
        this.beforeHooks = [];
        this.afterHooks = [];
        this.errorHandlers = [];

        this.current = null;
        this.previous = null;

        this.started = false;
        this.navigating = false;

        this.events = new Map();

        this.cache = new Map();

        this.navigationQueue = [];

        this._boundPopState =
            this._handlePopState.bind(this);

        this._boundHashChange =
            this._handleHashChange.bind(this);

        this._boundClick =
            this._handleLinkClick.bind(this);

    }

    /* ======================================================
       Event System
    ====================================================== */

    on(event, listener) {

        if (typeof listener !== "function") {
            throw new TypeError(
                "Listener must be a function."
            );
        }

        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        this.events
            .get(event)
            .push(listener);

        return this;

    }

    once(event, listener) {

        const wrapper = (...args) => {

            this.off(event, wrapper);

            listener(...args);

        };

        return this.on(event, wrapper);

    }

    off(event, listener) {

        if (!this.events.has(event)) {
            return this;
        }

        const list = this.events.get(event);

        const index =
            list.indexOf(listener);

        if (index >= 0) {
            list.splice(index, 1);
        }

        return this;

    }

    emit(event, ...args) {

        if (!this.events.has(event)) {
            return;
        }

        for (const listener of this.events.get(event)) {

            try {

                listener(...args);

            } catch (error) {

                this._emitError(error);

            }

        }

    }

    removeAllListeners(event) {

        if (event) {

            this.events.delete(event);

            return this;

        }

        this.events.clear();

        return this;

    }

    /* ======================================================
       Route Registration
    ====================================================== */

    add(path, handler, options = {}) {

        this._assertPath(path);

        this._assertFunction(handler);

        const record =
            this._createRouteRecord(
                path,
                handler,
                options
            );

        this.routes.push(record);

        if (record.name) {

            if (
                this.routeNames.has(
                    record.name
                )
            ) {

                throw new Error(
                    `Route "${record.name}" already exists.`
                );

            }

            this.routeNames.set(
                record.name,
                record
            );

        }

        return this;

    }

    get(path, handler, options = {}) {

        return this.add(
            path,
            handler,
            {
                ...options,
                method: "GET"
            }
        );

    }

    post(path, handler, options = {}) {

        return this.add(
            path,
            handler,
            {
                ...options,
                method: "POST"
            }
        );

    }

    put(path, handler, options = {}) {

        return this.add(
            path,
            handler,
            {
                ...options,
                method: "PUT"
            }
        );

    }

    patch(path, handler, options = {}) {

        return this.add(
            path,
            handler,
            {
                ...options,
                method: "PATCH"
            }
        );

    }

    delete(path, handler, options = {}) {

        return this.add(
            path,
            handler,
            {
                ...options,
                method: "DELETE"
            }
        );

    }

    any(path, handler, options = {}) {

        return this.add(
            path,
            handler,
            {
                ...options,
                method: "*"
            }
        );

    }

    has(name) {

        return this.routeNames.has(name);

    }

    route(name) {

        return this.routeNames.get(name) || null;

    }

    /* ======================================================
       Middleware
    ====================================================== */

    use(middleware) {

        this._assertFunction(
            middleware
        );

        this.middlewares.push(
            middleware
        );

        return this;

    }

    before(handler) {

        this._assertFunction(
            handler
        );

        this.beforeHooks.push(
            handler
        );

        return this;

    }

    after(handler) {

        this._assertFunction(
            handler
        );

        this.afterHooks.push(
            handler
        );

        return this;

    }

    onError(handler) {

        this._assertFunction(
            handler
        );

        this.errorHandlers.push(
            handler
        );

        return this;

    }

    /* ======================================================
       Validation
    ====================================================== */

    _assertPath(path) {

        if (typeof path !== "string") {

            throw new TypeError(
                "Path must be string."
            );

        }

        if (!path.trim()) {

            throw new Error(
                "Path cannot be empty."
            );

        }

    }

    _assertFunction(fn) {

        if (typeof fn !== "function") {

            throw new TypeError(
                "Expected function."
            );

        }

    }
        /* ======================================================
       Route Record Factory
    ====================================================== */

    _createRouteRecord(
        path,
        handler,
        options = {}
    ) {

        const normalized =
            this._normalizePath(path);

        const compiled =
            this._compilePath(normalized);

        return {

            id: this._generateRouteId(),

            name:
                options.name || null,

            path:
                normalized,

            originalPath:
                path,

            method:
                (
                    options.method ||
                    "GET"
                ).toUpperCase(),

            handler,

            meta:
                options.meta || {},

            alias:
                options.alias || null,

            redirect:
                options.redirect || null,

            middlewares:
                Array.isArray(
                    options.middlewares
                )
                    ? [
                        ...options.middlewares
                    ]
                    : [],

            regex:
                compiled.regex,

            keys:
                compiled.keys

        };

    }

    /* ======================================================
       Route Utilities
    ====================================================== */

    _generateRouteId() {

        return (
            "route_" +
            Math.random()
                .toString(36)
                .slice(2) +
            "_" +
            Date.now()
                .toString(36)
        );

    }

    _normalizePath(path) {

        let result =
            String(path).trim();

        if (!result.startsWith("/")) {

            result =
                "/" + result;

        }

        if (
            !this.options
                .strictTrailingSlash &&
            result.length > 1 &&
            result.endsWith("/")
        ) {

            result =
                result.slice(0, -1);

        }

        if (
            !this.options
                .caseSensitive
        ) {

            result =
                result.toLowerCase();

        }

        return result;

    }

    _compilePath(path) {

        const keys = [];

        let source = path.replace(
            /([.+?^=!:${}()|[\]/\\])/g,
            "\\$1"
        );

        source = source.replace(
            /\/\*/g,
            "/(.*)"
        );

        source = source.replace(
            /:([A-Za-z0-9_]+)/g,
            (_, key) => {

                keys.push(key);

                return "([^/]+)";

            }
        );

        return {

            keys,

            regex: new RegExp(
                "^" +
                source +
                "$"
            )

        };

    }

    _extractParams(
        route,
        pathname
    ) {

        const match =
            pathname.match(
                route.regex
            );

        if (!match) {

            return null;

        }

        const params = {};

        route.keys.forEach(
            (key, index) => {

                params[key] =
                    decodeURIComponent(
                        match[index + 1]
                    );

            }
        );

        return params;

    }

    /* ======================================================
       Query String Utilities
    ====================================================== */

    _parseQuery(search) {

        const query = {};

        if (!search) {

            return query;

        }

        const value =
            search.startsWith("?")
                ? search.slice(1)
                : search;

        if (!value) {

            return query;

        }

        const pairs =
            value.split("&");

        for (const pair of pairs) {

            if (!pair) {

                continue;

            }

            const parts =
                pair.split("=");

            const key =
                decodeURIComponent(
                    parts[0]
                );

            const val =
                decodeURIComponent(
                    parts[1] || ""
                );

            if (
                Object.prototype.hasOwnProperty.call(
                    query,
                    key
                )
            ) {

                if (
                    Array.isArray(
                        query[key]
                    )
                ) {

                    query[key].push(val);

                } else {

                    query[key] = [
                        query[key],
                        val
                    ];

                }

            } else {

                query[key] = val;

            }

        }

        return query;

    }

    _stringifyQuery(
        object = {}
    ) {

        const parts = [];

        for (const key of Object.keys(object)) {

            const value =
                object[key];

            if (
                Array.isArray(value)
            ) {

                for (const item of value) {

                    parts.push(
                        encodeURIComponent(
                            key
                        ) +
                        "=" +
                        encodeURIComponent(
                            item
                        )
                    );

                }

                continue;

            }

            parts.push(
                encodeURIComponent(
                    key
                ) +
                "=" +
                encodeURIComponent(
                    value
                )
            );

        }

        return parts.join("&");

    }
        /* ======================================================
       URL Utilities
    ====================================================== */

    _splitURL(url = "") {

        const source = String(url);

        const hashIndex = source.indexOf("#");
        const queryIndex = source.indexOf("?");

        let pathname = source;
        let search = "";
        let hash = "";

        if (queryIndex >= 0) {

            pathname = source.slice(0, queryIndex);

            if (hashIndex >= 0) {

                search = source.slice(
                    queryIndex,
                    hashIndex
                );

            } else {

                search = source.slice(
                    queryIndex
                );

            }

        }

        if (hashIndex >= 0) {

            if (queryIndex < 0) {

                pathname = source.slice(
                    0,
                    hashIndex
                );

            }

            hash = source.slice(hashIndex);

        }

        pathname =
            this._normalizePath(
                pathname || "/"
            );

        return {

            pathname,
            search,
            hash,
            query:
                this._parseQuery(
                    search
                )

        };

    }

    _buildURL(
        pathname,
        query = {},
        hash = ""
    ) {

        const normalized =
            this._normalizePath(
                pathname
            );

        const search =
            this._stringifyQuery(
                query
            );

        let result = normalized;

        if (search) {

            result +=
                "?" + search;

        }

        if (hash) {

            if (
                !hash.startsWith("#")
            ) {

                result += "#";

            }

            result +=
                hash.replace(/^#/, "");

        }

        return result;

    }

    _getCurrentLocation() {

        if (
            this.options.mode ===
            "hash"
        ) {

            const hash =
                window.location.hash
                    .replace(/^#/, "");

            return this._splitURL(
                hash || "/"
            );

        }

        return this._splitURL(
            window.location.pathname +
            window.location.search +
            window.location.hash
        );

    }

    /* ======================================================
       Route Matching
    ====================================================== */

    _matchRoute(
        pathname,
        method = "GET"
    ) {

        const target =
            this._normalizePath(
                pathname
            );

        const httpMethod =
            String(method)
                .toUpperCase();

        for (const route of this.routes) {

            if (
                route.method !== "*" &&
                route.method !== httpMethod
            ) {

                continue;

            }

            const params =
                this._extractParams(
                    route,
                    target
                );

            if (!params) {

                continue;

            }

            return {

                route,
                params

            };

        }

        return null;

    }

    _resolveTarget(
        target,
        method = "GET"
    ) {

        if (
            typeof target !==
            "string"
        ) {

            throw new TypeError(
                "Navigation target must be a string."
            );

        }

        const location =
            this._splitURL(
                target
            );

        const matched =
            this._matchRoute(
                location.pathname,
                method
            );

        if (!matched) {

            return null;

        }

        return {

            route:
                matched.route,

            pathname:
                location.pathname,

            query:
                location.query,

            hash:
                location.hash,

            params:
                matched.params,

            fullPath:
                this._buildURL(
                    location.pathname,
                    location.query,
                    location.hash
                )

        };

    }

    /* ======================================================
       Context Factory
    ====================================================== */

    _createContext(
        resolved
    ) {

        return {

            id:
                resolved.route.id,

            name:
                resolved.route.name,

            path:
                resolved.pathname,

            fullPath:
                resolved.fullPath,

            params:
                Object.freeze({
                    ...resolved.params
                }),

            query:
                Object.freeze({
                    ...resolved.query
                }),

            hash:
                resolved.hash,

            meta:
                resolved.route.meta,

            method:
                resolved.route.method,

            route:
                resolved.route

        };

    }
        /* ======================================================
       Navigation Context
    ====================================================== */

    _setCurrentContext(context) {

        this.previous = this.current;
        this.current = context;

        return context;

    }

    _createNavigationResult(
        context,
        success = true
    ) {

        return {

            success,

            context,

            current: this.current,

            previous: this.previous

        };

    }

    /* ======================================================
       Middleware Pipeline
    ====================================================== */

    async _runMiddlewares(context) {

        for (const middleware of this.middlewares) {

            const result =
                await middleware(
                    context
                );

            if (result === false) {

                return false;

            }

        }

        return true;

    }

    async _runRouteMiddlewares(context) {

        const list =
            context.route.middlewares;

        for (const middleware of list) {

            const result =
                await middleware(
                    context
                );

            if (result === false) {

                return false;

            }

        }

        return true;

    }

    async _runBeforeHooks(context) {

        for (const hook of this.beforeHooks) {

            const result =
                await hook(context);

            if (result === false) {

                return false;

            }

        }

        return true;

    }

    async _runAfterHooks(context) {

        for (const hook of this.afterHooks) {

            await hook(context);

        }

    }

    /* ======================================================
       Handler Execution
    ====================================================== */

    async _executeHandler(context) {

        return await context
            .route
            .handler(context);

    }

    async _invokeErrorHandlers(error) {

        if (
            this.errorHandlers.length === 0
        ) {

            throw error;

        }

        for (const handler of this.errorHandlers) {

            try {

                await handler(error);

            } catch (_) {

            }

        }

    }

    _emitError(error) {

        if (
            this.errorHandlers.length
        ) {

            for (const handler of this.errorHandlers) {

                try {

                    handler(error);

                } catch (_) {

                }

            }

            return;

        }

        if (this.options.debug) {

            console.error(error);

        }

    }

    /* ======================================================
       Route Cache
    ====================================================== */

    _setCache(key, value) {

        this.cache.set(
            key,
            value
        );

        return value;

    }

    _getCache(key) {

        return this.cache.has(key)
            ? this.cache.get(key)
            : null;

    }

    _hasCache(key) {

        return this.cache.has(key);

    }

    _removeCache(key) {

        return this.cache.delete(key);

    }

    _clearCache() {

        this.cache.clear();

    }

    /* ======================================================
       Navigation Queue
    ====================================================== */

    _enqueue(task) {

        this.navigationQueue.push(
            task
        );

    }

    _dequeue() {

        if (
            this.navigationQueue.length === 0
        ) {

            return null;

        }

        return this.navigationQueue.shift();

    }

    _clearQueue() {

        this.navigationQueue.length = 0;

    }
        /* ======================================================
       Router Lifecycle
    ====================================================== */

    start() {

        if (this.started) {
            return this;
        }

        this.started = true;

        if (this.options.mode === "history") {

            window.addEventListener(
                "popstate",
                this._boundPopState
            );

        } else {

            window.addEventListener(
                "hashchange",
                this._boundHashChange
            );

        }

        if (this.options.interceptLinks) {

            document.addEventListener(
                "click",
                this._boundClick
            );

        }

        this.emit("start");

        this.navigate(
            this._getCurrentLocation().pathname,
            {
                replace: true,
                silent: false
            }
        );

        return this;

    }

    stop() {

        if (!this.started) {
            return this;
        }

        this.started = false;

        window.removeEventListener(
            "popstate",
            this._boundPopState
        );

        window.removeEventListener(
            "hashchange",
            this._boundHashChange
        );

        document.removeEventListener(
            "click",
            this._boundClick
        );

        this.emit("stop");

        return this;

    }

    restart() {

        this.stop();

        this.start();

        return this;

    }

    isStarted() {

        return this.started;

    }

    /* ======================================================
       Browser Events
    ====================================================== */

    _handlePopState() {

        const location =
            this._getCurrentLocation();

        this.navigate(
            location.pathname,
            {
                replace: true,
                historyEvent: true
            }
        );

    }

    _handleHashChange() {

        const location =
            this._getCurrentLocation();

        this.navigate(
            location.pathname,
            {
                replace: true,
                historyEvent: true
            }
        );

    }

    _handleLinkClick(event) {

        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {

            return;

        }

        const link =
            event.target.closest("a");

        if (!link) {
            return;
        }

        const href =
            link.getAttribute("href");

        if (
            !href ||
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {

            return;

        }

        event.preventDefault();

        this.navigate(href);

    }

    /* ======================================================
       Current Route
    ====================================================== */

    currentRoute() {

        return this.current;

    }

    previousRoute() {

        return this.previous;

    }

    isCurrent(path) {

        if (!this.current) {
            return false;
        }

        return (
            this.current.path ===
            this._normalizePath(path)
        );

    }
        /* ======================================================
       Navigation API
    ====================================================== */

    async navigate(
        target,
        options = {}
    ) {

        if (this.navigating) {

            this._enqueue({
                target,
                options
            });

            return false;

        }

        this.navigating = true;

        try {

            const resolved =
                this._resolveTarget(
                    target
                );

            if (!resolved) {

                this.navigating = false;

                return this._handleNotFound(
                    target
                );

            }

            const context =
                this._createContext(
                    resolved
                );

            const allowed =
                await this._runPipeline(
                    context
                );

            if (!allowed) {

                this.navigating = false;

                return false;

            }

            this._setCurrentContext(
                context
            );

            if (
                !options.historyEvent
            ) {

                this._updateBrowserURL(
                    context.fullPath,
                    options
                );

            }

            await this._executeHandler(
                context
            );

            await this._runAfterHooks(
                context
            );

            this.emit(
                "navigate",
                context
            );

            return this._createNavigationResult(
                context
            );

        } catch (error) {

            await this._invokeErrorHandlers(
                error
            );

            return false;

        } finally {

            this.navigating = false;

            await this._flushQueue();

        }

    }

    push(
        target,
        options = {}
    ) {

        return this.navigate(
            target,
            {
                ...options,
                replace: false
            }
        );

    }

    replace(
        target,
        options = {}
    ) {

        return this.navigate(
            target,
            {
                ...options,
                replace: true
            }
        );

    }

    back() {

        window.history.back();

        return this;

    }

    forward() {

        window.history.forward();

        return this;

    }

    go(distance = 0) {

        window.history.go(distance);

        return this;

    }

    /* ======================================================
       Navigation Pipeline
    ====================================================== */

    async _runPipeline(
        context
    ) {

        const global =
            await this._runMiddlewares(
                context
            );

        if (!global) {

            return false;

        }

        const before =
            await this._runBeforeHooks(
                context
            );

        if (!before) {

            return false;

        }

        const local =
            await this._runRouteMiddlewares(
                context
            );

        if (!local) {

            return false;

        }

        return true;

    }

    async _flushQueue() {

        if (
            this.navigating
        ) {

            return;

        }

        const next =
            this._dequeue();

        if (!next) {

            return;

        }

        await this.navigate(
            next.target,
            next.options
        );

    }
        /* ======================================================
       Browser History
    ====================================================== */

    _updateBrowserURL(
        url,
        options = {}
    ) {

        const replace =
            options.replace === true;

        if (
            this.options.mode === "hash"
        ) {

            const target =
                "#" +
                this.options.hashPrefix +
                url;

            if (
                window.location.hash !== target
            ) {

                window.location.hash =
                    target;

            }

            return;

        }

        const state = {
            path: url,
            timestamp: Date.now()
        };

        if (replace) {

            window.history.replaceState(
                state,
                "",
                url
            );

        } else {

            window.history.pushState(
                state,
                "",
                url
            );

        }

    }

    /* ======================================================
       Route Resolver Helpers
    ====================================================== */

    resolve(
        target,
        method = "GET"
    ) {

        const resolved =
            this._resolveTarget(
                target,
                method
            );

        if (!resolved) {
            return null;
        }

        return this._createContext(
            resolved
        );

    }

    exists(
        path,
        method = "GET"
    ) {

        return (
            this._resolveTarget(
                path,
                method
            ) !== null
        );

    }

    /* ======================================================
       Named Route Helpers
    ====================================================== */

    url(
        name,
        params = {},
        query = {},
        hash = ""
    ) {

        const route =
            this.route(name);

        if (!route) {

            throw new Error(
                `Unknown route "${name}".`
            );

        }

        let path =
            route.path;

        for (const key of route.keys) {

            if (
                !Object.prototype.hasOwnProperty.call(
                    params,
                    key
                )
            ) {

                throw new Error(
                    `Missing route parameter "${key}".`
                );

            }

            path =
                path.replace(
                    ":" + key,
                    encodeURIComponent(
                        params[key]
                    )
                );

        }

        return this._buildURL(
            path,
            query,
            hash
        );

    }

    /* ======================================================
       Route Information
    ====================================================== */

    list() {

        return this.routes.map(
            route => ({

                id: route.id,
                name: route.name,
                path: route.path,
                method: route.method,
                meta: {
                    ...route.meta
                }

            })
        );

    }

    count() {

        return this.routes.length;

    }

    clearRoutes() {

        this.routes.length = 0;
        this.routeNames.clear();

        return this;

    }

    /* ======================================================
       Not Found
    ====================================================== */

    async _handleNotFound(
        target
    ) {

        this.emit(
            "notfound",
            target
        );

        if (
            typeof this.notFoundHandler ===
            "function"
        ) {

            return await this.notFoundHandler(
                target
            );

        }

        return false;

    }
        /* ======================================================
       Redirect & Alias
    ====================================================== */

    redirect(from, to, options = {}) {

        return this.add(
            from,
            () => {},
            {
                ...options,
                redirect: to
            }
        );

    }

    alias(aliasPath, targetPath, options = {}) {

        return this.add(
            aliasPath,
            () => {},
            {
                ...options,
                alias: targetPath
            }
        );

    }

    async _resolveRedirect(route, context) {

        if (!route.redirect) {
            return null;
        }

        let destination = route.redirect;

        if (typeof destination === "function") {

            destination =
                await destination(context);

        }

        return destination;

    }

    async _followAlias(route) {

        if (!route.alias) {
            return null;
        }

        return this._resolveTarget(
            route.alias,
            route.method
        );

    }

    /* ======================================================
       Meta Helpers
    ====================================================== */

    setMeta(name, meta = {}) {

        const route = this.route(name);

        if (!route) {
            return false;
        }

        route.meta = {
            ...route.meta,
            ...meta
        };

        return true;

    }

    getMeta(name) {

        const route = this.route(name);

        return route
            ? { ...route.meta }
            : null;

    }

    /* ======================================================
       Route Search
    ====================================================== */

    find(predicate) {

        if (typeof predicate !== "function") {
            throw new TypeError(
                "Predicate must be a function."
            );
        }

        return (
            this.routes.find(predicate) ||
            null
        );

    }

    filter(predicate) {

        if (typeof predicate !== "function") {
            throw new TypeError(
                "Predicate must be a function."
            );
        }

        return this.routes.filter(
            predicate
        );

    }

    first() {

        return this.routes[0] || null;

    }

    last() {

        return (
            this.routes[
                this.routes.length - 1
            ] || null
        );

    }

    /* ======================================================
       Route Remove
    ====================================================== */

    remove(name) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        const index =
            this.routes.indexOf(route);

        if (index >= 0) {

            this.routes.splice(
                index,
                1
            );

        }

        this.routeNames.delete(name);

        return true;

    }

    clearCache() {

        this._clearCache();

        return this;

    }

    clearListeners() {

        this.removeAllListeners();

        return this;

    }
        /* ======================================================
       Lazy Route Support
    ====================================================== */

    lazy(path, loader, options = {}) {

        this._assertPath(path);

        this._assertFunction(loader);

        let loadedHandler = null;

        const handler = async (context) => {

            if (!loadedHandler) {

                const module =
                    await loader();

                if (
                    typeof module === "function"
                ) {

                    loadedHandler = module;

                } else if (
                    module &&
                    typeof module.default === "function"
                ) {

                    loadedHandler =
                        module.default;

                } else {

                    throw new Error(
                        "Lazy route module must export a function."
                    );

                }

            }

            return loadedHandler(context);

        };

        return this.add(
            path,
            handler,
            {
                ...options,
                lazy: true
            }
        );

    }

    /* ======================================================
       Async Route Loading
    ====================================================== */

    async preload(
        name
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        if (
            !route.lazy
        ) {

            return true;

        }

        return true;

    }

    async preloadAll() {

        const tasks = [];

        for (const route of this.routes) {

            if (route.lazy) {

                tasks.push(
                    this.preload(
                        route.name
                    )
                );

            }

        }

        await Promise.all(tasks);

        return true;

    }

    /* ======================================================
       Route Guard Helpers
    ====================================================== */

    canNavigate(handler) {

        return this.before(
            handler
        );

    }

    canLeave(handler) {

        return this.after(
            handler
        );

    }

    /* ======================================================
       Parameter Utilities
    ====================================================== */

    params(path) {

        const resolved =
            this.resolve(path);

        if (!resolved) {

            return null;

        }

        return {
            ...resolved.params
        };

    }

    query(path) {

        const location =
            this._splitURL(
                path
            );

        return {
            ...location.query
        };

    }

    /* ======================================================
       URL State
    ====================================================== */

    state() {

        return {

            current:
                this.current,

            previous:
                this.previous,

            started:
                this.started,

            navigating:
                this.navigating

        };

    }

    snapshot() {

        return JSON.parse(
            JSON.stringify({
                current: this.current,
                previous: this.previous
            })
        );

    }
        /* ======================================================
       Router Configuration
    ====================================================== */

    configure(options = {}) {

        this.options = {
            ...this.options,
            ...options
        };

        return this;

    }

    option(key, value) {

        if (
            typeof value === "undefined"
        ) {

            return this.options[key];

        }

        this.options[key] = value;

        return this;

    }

    /* ======================================================
       Debug Utilities
    ====================================================== */

    debug(enabled = true) {

        this.options.debug =
            Boolean(enabled);

        return this;

    }

    log(...args) {

        if (
            !this.options.debug
        ) {

            return;

        }

        console.log(
            "[PowerTools Router]",
            ...args
        );

    }

    /* ======================================================
       Route Inspection
    ====================================================== */

    inspect(path) {

        const resolved =
            this.resolve(
                path
            );

        if (!resolved) {

            return {

                matched: false,
                path

            };

        }

        return {

            matched: true,

            route:
                resolved.route,

            params:
                resolved.params,

            query:
                resolved.query,

            meta:
                resolved.meta

        };

    }

    explain(path) {

        const result = [];

        const target =
            this._normalizePath(
                path
            );

        for (const route of this.routes) {

            const matched =
                route.regex.test(
                    target
                );

            result.push({

                route:
                    route.path,

                method:
                    route.method,

                matched

            });

        }

        return result;

    }

    /* ======================================================
       Route Ordering
    ====================================================== */

    move(
        name,
        position
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        const currentIndex =
            this.routes.indexOf(
                route
            );

        if (currentIndex < 0) {

            return false;

        }

        this.routes.splice(
            currentIndex,
            1
        );

        this.routes.splice(
            position,
            0,
            route
        );

        return true;

    }

    beforeRoute(
        name,
        targetName
    ) {

        const route =
            this.route(name);

        const target =
            this.route(targetName);

        if (
            !route ||
            !target
        ) {

            return false;

        }

        const routeIndex =
            this.routes.indexOf(
                route
            );

        const targetIndex =
            this.routes.indexOf(
                target
            );

        if (
            routeIndex <
            targetIndex
        ) {

            return true;

        }

        this.routes.splice(
            targetIndex,
            0,
            this.routes.splice(
                routeIndex,
                1
            )[0]
        );

        return true;

    }

    /* ======================================================
       Route Clone
    ====================================================== */

    cloneRoutes() {

        return this.routes.map(
            route => ({

                ...route,

                meta: {
                    ...route.meta
                },

                middlewares:
                    [
                        ...route.middlewares
                    ]

            })
        );

    }
        /* ======================================================
       Nested Route Support
    ====================================================== */

    group(
        prefix,
        callback,
        options = {}
    ) {

        this._assertPath(prefix);

        if (
            typeof callback !== "function"
        ) {

            throw new TypeError(
                "Group callback must be a function."
            );

        }

        const parent =
            this;

        const groupRouter = {

            add(
                path,
                handler,
                routeOptions = {}
            ) {

                const fullPath =
                    parent._joinPaths(
                        prefix,
                        path
                    );

                return parent.add(
                    fullPath,
                    handler,
                    {
                        ...options,
                        ...routeOptions
                    }
                );

            },

            get(
                path,
                handler,
                routeOptions = {}
            ) {

                return this.add(
                    path,
                    handler,
                    {
                        ...routeOptions,
                        method: "GET"
                    }
                );

            },

            post(
                path,
                handler,
                routeOptions = {}
            ) {

                return this.add(
                    path,
                    handler,
                    {
                        ...routeOptions,
                        method: "POST"
                    }
                );

            },

            put(
                path,
                handler,
                routeOptions = {}
            ) {

                return this.add(
                    path,
                    handler,
                    {
                        ...routeOptions,
                        method: "PUT"
                    }
                );

            },

            delete(
                path,
                handler,
                routeOptions = {}
            ) {

                return this.add(
                    path,
                    handler,
                    {
                        ...routeOptions,
                        method: "DELETE"
                    }
                );

            }

        };

        callback(
            groupRouter
        );

        return this;

    }

    _joinPaths(
        first,
        second
    ) {

        const left =
            first.endsWith("/")
                ? first.slice(0, -1)
                : first;

        const right =
            second.startsWith("/")
                ? second
                    .slice(1)
                : second;

        return (
            left +
            "/" +
            right
        );

    }

    /* ======================================================
       Route Prefix
    ====================================================== */

    prefix(
        value
    ) {

        this.options.root =
            this._normalizePath(
                value
            );

        return this;

    }

    root() {

        return this.options.root;

    }

    /* ======================================================
       Base Path Resolver
    ====================================================== */

    absolute(
        path
    ) {

        return this._joinPaths(
            this.options.root,
            path
        );

    }

    relative(
        path
    ) {

        const root =
            this.options.root;

        const normalized =
            this._normalizePath(
                path
            );

        if (
            normalized.startsWith(root)
        ) {

            return normalized.slice(
                root.length
            ) || "/";

        }

        return normalized;

    }

    /* ======================================================
       Route Matching Helpers
    ====================================================== */

    match(
        pathname,
        method = "GET"
    ) {

        const result =
            this._matchRoute(
                pathname,
                method
            );

        if (!result) {

            return null;

        }

        return {

            route:
                result.route,

            params:
                result.params

        };

    }

    matches(
        pathname
    ) {

        const list = [];

        for (const route of this.routes) {

            const params =
                this._extractParams(
                    route,
                    pathname
                );

            if (params) {

                list.push({

                    route,

                    params

                });

            }

        }

        return list;

    }
        /* ======================================================
       Route Parameter Generator
    ====================================================== */

    compile(
        name,
        params = {}
    ) {

        const route =
            this.route(name);

        if (!route) {

            throw new Error(
                `Route "${name}" not found.`
            );

        }

        let path =
            route.path;

        path =
            path.replace(
                /:([A-Za-z0-9_]+)/g,
                (_, key) => {

                    if (
                        !Object.prototype
                            .hasOwnProperty
                            .call(
                                params,
                                key
                            )
                    ) {

                        throw new Error(
                            `Missing parameter "${key}".`
                        );

                    }

                    return encodeURIComponent(
                        params[key]
                    );

                }
            );

        return path;

    }

    /* ======================================================
       Optional Parameters
    ====================================================== */

    optional(
        path
    ) {

        const normalized =
            this._normalizePath(
                path
            );

        return normalized.replace(
            /\/:([A-Za-z0-9_]+)/g,
            "(?:/:$1)?"
        );

    }

    /* ======================================================
       Wildcard Routes
    ====================================================== */

    wildcard(
        path,
        handler,
        options = {}
    ) {

        const wildcardPath =
            path.endsWith("*")
                ? path
                : path + "/*";

        return this.add(
            wildcardPath,
            handler,
            options
        );

    }

    /* ======================================================
       Route Priority
    ====================================================== */

    priority(
        name,
        value = 0
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        route.priority =
            Number(value);

        this.routes.sort(
            (a, b) => {

                return (
                    (b.priority || 0) -
                    (a.priority || 0)
                );

            }
        );

        return true;

    }

    /* ======================================================
       Enhanced Resolver
    ====================================================== */

    resolveAdvanced(
        target,
        method = "GET"
    ) {

        const result =
            this._resolveTarget(
                target,
                method
            );

        if (!result) {

            return null;

        }

        const context =
            this._createContext(
                result
            );

        return {

            ...context,

            matched:
                true,

            params:
                {
                    ...context.params
                },

            query:
                {
                    ...context.query
                }

        };

    }

    /* ======================================================
       Route Serialization
    ====================================================== */

    serialize() {

        return JSON.stringify(
            this.routes.map(
                route => ({

                    id:
                        route.id,

                    name:
                        route.name,

                    path:
                        route.path,

                    method:
                        route.method,

                    meta:
                        route.meta

                })
            )
        );

    }

    restore(
        data
    ) {

        if (
            typeof data !== "string"
        ) {

            throw new TypeError(
                "Serialized routes must be string."
            );

        }

        const routes =
            JSON.parse(
                data
            );

        if (
            !Array.isArray(routes)
        ) {

            return false;

        }

        for (const item of routes) {

            if (
                !this.routeNames.has(
                    item.name
                )
            ) {

                this.add(
                    item.path,
                    () => {},
                    {
                        name:
                            item.name,

                        method:
                            item.method,

                        meta:
                            item.meta
                    }
                );

            }

        }

        return true;

    }
        /* ======================================================
       Request Context Helpers
    ====================================================== */

    createRequest(
        context
    ) {

        return {

            path:
                context.path,

            params:
                {
                    ...context.params
                },

            query:
                {
                    ...context.query
                },

            meta:
                context.meta,

            route:
                context.route,

            method:
                context.method

        };

    }

    /* ======================================================
       Handler Wrapper
    ====================================================== */

    wrap(
        handler,
        options = {}
    ) {

        this._assertFunction(
            handler
        );

        return async (
            context
        ) => {

            if (
                options.cache
            ) {

                const key =
                    context.fullPath;

                if (
                    this._hasCache(key)
                ) {

                    return this._getCache(
                        key
                    );

                }

                const result =
                    await handler(
                        context
                    );

                this._setCache(
                    key,
                    result
                );

                return result;

            }

            return await handler(
                context
            );

        };

    }

    /* ======================================================
       Route Handler Replacement
    ====================================================== */

    update(
        name,
        handler
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        this._assertFunction(
            handler
        );

        route.handler =
            handler;

        return true;

    }

    updateMeta(
        name,
        meta
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        route.meta =
            {
                ...route.meta,
                ...meta
            };

        return true;

    }

    /* ======================================================
       Route Enable / Disable
    ====================================================== */

    disable(
        name
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        route.disabled =
            true;

        return true;

    }

    enable(
        name
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        route.disabled =
            false;

        return true;

    }

    isDisabled(
        name
    ) {

        const route =
            this.route(name);

        return Boolean(
            route &&
            route.disabled
        );

    }

    /* ======================================================
       Resolver With State
    ====================================================== */

    resolveState(
        target
    ) {

        const resolved =
            this.resolve(
                target
            );

        if (!resolved) {

            return {

                exists:
                    false,

                target

            };

        }

        return {

            exists:
                true,

            path:
                resolved.path,

            params:
                resolved.params,

            query:
                resolved.query,

            route:
                resolved.route

        };

    }

    /* ======================================================
       History State Helpers
    ====================================================== */

    saveState(
        data = {}
    ) {

        const state = {

            router:
                true,

            data,

            time:
                Date.now()

        };

        window.history.replaceState(
            state,
            ""
        );

        return state;

    }

    getHistoryState() {

        return window.history.state;

    }

    clearHistoryState() {

        window.history.replaceState(
            null,
            ""
        );

        return this;

    }
        /* ======================================================
       Scroll Behavior
    ====================================================== */

    scrollBehavior(
        handler
    ) {

        this.scrollHandler =
            handler;

        return this;

    }

    async _handleScroll(
        context
    ) {

        if (
            typeof this.scrollHandler !==
            "function"
        ) {

            return;

        }

        await this.scrollHandler(
            context
        );

    }

    /* ======================================================
       View Transition Support
    ====================================================== */

    transition(
        handler
    ) {

        this.transitionHandler =
            handler;

        return this;

    }

    async _runTransition(
        context
    ) {

        if (
            typeof this.transitionHandler !==
            "function"
        ) {

            return;

        }

        await this.transitionHandler(
            context
        );

    }

    /* ======================================================
       Navigation Guards
    ====================================================== */

    addGuard(
        guard
    ) {

        this._assertFunction(
            guard
        );

        if (
            !this.guards
        ) {

            this.guards = [];

        }

        this.guards.push(
            guard
        );

        return this;

    }

    removeGuard(
        guard
    ) {

        if (
            !this.guards
        ) {

            return false;

        }

        const index =
            this.guards.indexOf(
                guard
            );

        if (
            index < 0
        ) {

            return false;

        }

        this.guards.splice(
            index,
            1
        );

        return true;

    }

    async _runGuards(
        context
    ) {

        if (
            !this.guards
        ) {

            return true;

        }

        for (
            const guard of this.guards
        ) {

            const result =
                await guard(
                    context
                );

            if (
                result === false
            ) {

                return false;

            }

        }

        return true;

    }

    /* ======================================================
       Route Access Control
    ====================================================== */

    protect(
        name,
        checker
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        this._assertFunction(
            checker
        );

        route.guard =
            checker;

        return true;

    }

    async _checkRouteAccess(
        context
    ) {

        if (
            typeof context.route.guard !==
            "function"
        ) {

            return true;

        }

        return await context.route.guard(
            context
        );

    }

    /* ======================================================
       Analytics Hook
    ====================================================== */

    track(
        handler
    ) {

        this._assertFunction(
            handler
        );

        this.analyticsHandler =
            handler;

        return this;

    }

    async _track(
        context
    ) {

        if (
            typeof this.analyticsHandler !==
            "function"
        ) {

            return;

        }

        await this.analyticsHandler(
            context
        );

    }
        /* ======================================================
       Plugin System
    ====================================================== */

    usePlugin(
        plugin,
        options = {}
    ) {

        if (
            typeof plugin !== "function"
        ) {

            throw new TypeError(
                "Plugin must be a function."
            );

        }

        plugin(
            this,
            options
        );

        return this;

    }

    /* ======================================================
       Route Events
    ====================================================== */

    onRouteAdded(
        handler
    ) {

        return this.on(
            "route:added",
            handler
        );

    }

    onRouteRemoved(
        handler
    ) {

        return this.on(
            "route:removed",
            handler
        );

    }

    onNavigation(
        handler
    ) {

        return this.on(
            "navigation",
            handler
        );

    }

    /* ======================================================
       Enhanced Route Registration
    ====================================================== */

    register(
        routes = []
    ) {

        if (
            !Array.isArray(routes)
        ) {

            throw new TypeError(
                "Routes must be an array."
            );

        }

        for (
            const item of routes
        ) {

            if (
                !item.path ||
                !item.handler
            ) {

                continue;

            }

            this.add(
                item.path,
                item.handler,
                item.options || {}
            );

            this.emit(
                "route:added",
                item
            );

        }

        return this;

    }

    mount(
        prefix,
        routes = []
    ) {

        if (
            !Array.isArray(routes)
        ) {

            throw new TypeError(
                "Mounted routes must be an array."
            );

        }

        for (
            const item of routes
        ) {

            this.add(
                this._joinPaths(
                    prefix,
                    item.path
                ),
                item.handler,
                item.options || {}
            );

        }

        return this;

    }

    /* ======================================================
       Router Information
    ====================================================== */

    info() {

        return {

            version:
                "1.0.0",

            mode:
                this.options.mode,

            routes:
                this.routes.length,

            started:
                this.started,

            current:
                this.current,

            plugins:
                true

        };

    }

    version() {

        return "1.0.0";

    }

    /* ======================================================
       Memory Management
    ====================================================== */

    reset() {

        this.routes.length = 0;

        this.routeNames.clear();

        this.middlewares.length = 0;

        this.beforeHooks.length = 0;

        this.afterHooks.length = 0;

        this.errorHandlers.length = 0;

        this.cache.clear();

        this._clearQueue();

        this.current = null;

        this.previous = null;

        return this;

    }

    destroy() {

        this.stop();

        this.reset();

        this.removeAllListeners();

        return this;

    }
        /* ======================================================
       Advanced Middleware Control
    ====================================================== */

    addMiddleware(
        middleware,
        position = null
    ) {

        this._assertFunction(
            middleware
        );

        if (
            position === null ||
            position >= this.middlewares.length
        ) {

            this.middlewares.push(
                middleware
            );

        } else {

            this.middlewares.splice(
                position,
                0,
                middleware
            );

        }

        return this;

    }

    removeMiddleware(
        middleware
    ) {

        const index =
            this.middlewares.indexOf(
                middleware
            );

        if (
            index === -1
        ) {

            return false;

        }

        this.middlewares.splice(
            index,
            1
        );

        return true;

    }

    clearMiddlewares() {

        this.middlewares.length = 0;

        return this;

    }

    /* ======================================================
       Request Lifecycle Hooks
    ====================================================== */

    beforeResolve(
        handler
    ) {

        this.resolveHooks =
            this.resolveHooks || [];

        this._assertFunction(
            handler
        );

        this.resolveHooks.push(
            handler
        );

        return this;

    }

    async _runResolveHooks(
        context
    ) {

        if (
            !this.resolveHooks
        ) {

            return true;

        }

        for (
            const hook of this.resolveHooks
        ) {

            const result =
                await hook(
                    context
                );

            if (
                result === false
            ) {

                return false;

            }

        }

        return true;

    }

    /* ======================================================
       Route Resolver Extension
    ====================================================== */

    resolveByName(
        name,
        params = {},
        query = {}
    ) {

        const route =
            this.route(name);

        if (!route) {

            return null;

        }

        const path =
            this.compile(
                name,
                params
            );

        return {

            path,

            url:
                this._buildURL(
                    path,
                    query
                ),

            route

        };

    }

    /* ======================================================
       Route Dependency Container
    ====================================================== */

    provide(
        key,
        value
    ) {

        if (
            !this.container
        ) {

            this.container = new Map();

        }

        this.container.set(
            key,
            value
        );

        return this;

    }

    inject(
        key,
        fallback = null
    ) {

        if (
            !this.container
        ) {

            return fallback;

        }

        return this.container.has(key)
            ? this.container.get(key)
            : fallback;

    }

    /* ======================================================
       Route Metadata Helpers
    ====================================================== */

    hasMeta(
        name,
        key
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        return Object.prototype.hasOwnProperty.call(
            route.meta,
            key
        );

    }

    removeMeta(
        name,
        key
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        delete route.meta[key];

        return true;

    }
        /* ======================================================
       Route Matching Cache
    ====================================================== */

    enableMatchCache(
        enabled = true
    ) {

        this.matchCacheEnabled =
            Boolean(enabled);

        return this;

    }

    _getMatchCacheKey(
        pathname,
        method
    ) {

        return (
            method +
            "::" +
            pathname
        );

    }

    _cachedMatch(
        pathname,
        method
    ) {

        if (
            !this.matchCacheEnabled
        ) {

            return null;

        }

        const key =
            this._getMatchCacheKey(
                pathname,
                method
            );

        return this._getCache(
            key
        );

    }

    _storeMatchCache(
        pathname,
        method,
        value
    ) {

        if (
            !this.matchCacheEnabled
        ) {

            return;

        }

        const key =
            this._getMatchCacheKey(
                pathname,
                method
            );

        this._setCache(
            key,
            value
        );

    }

    /* ======================================================
       Route Testing
    ====================================================== */

    test(
        path,
        method = "GET"
    ) {

        const result =
            this._matchRoute(
                path,
                method
            );

        return Boolean(
            result
        );

    }

    testRoute(
        route,
        path
    ) {

        if (
            !route ||
            !route.regex
        ) {

            return false;

        }

        return route.regex.test(
            this._normalizePath(
                path
            )
        );

    }

    /* ======================================================
       Route Statistics
    ====================================================== */

    statistics() {

        const methods = {};

        for (
            const route of this.routes
        ) {

            if (
                !methods[route.method]
            ) {

                methods[route.method] = 0;

            }

            methods[route.method]++;

        }

        return {

            total:
                this.routes.length,

            methods,

            named:
                this.routeNames.size,

            middleware:
                this.middlewares.length,

            cache:
                this.cache.size

        };

    }

    /* ======================================================
       Route Export Helpers
    ====================================================== */

    exportRoutes() {

        return this.routes.map(
            route => ({

                name:
                    route.name,

                path:
                    route.path,

                method:
                    route.method,

                meta:
                    {
                        ...route.meta
                    }

            })
        );

    }

    importRoutes(
        definitions = []
    ) {

        if (
            !Array.isArray(definitions)
        ) {

            throw new TypeError(
                "Route definitions must be an array."
            );

        }

        definitions.forEach(
            definition => {

                this.add(
                    definition.path,
                    definition.handler,
                    definition.options || {}
                );

            }
        );

        return this;

    }

    /* ======================================================
       Environment Helpers
    ====================================================== */

    isBrowser() {

        return (
            typeof window !==
            "undefined"
        );

    }

    isServer() {

        return !this.isBrowser();

    }

    platform() {

        return this.isBrowser()
            ? "browser"
            : "server";

    }
        /* ======================================================
       Server Side Compatibility Helpers
    ====================================================== */

    setLocationAdapter(
        adapter
    ) {

        if (
            typeof adapter !== "object" ||
            adapter === null
        ) {

            throw new TypeError(
                "Location adapter must be an object."
            );

        }

        this.locationAdapter =
            adapter;

        return this;

    }

    _getAdapterLocation() {

        if (
            !this.locationAdapter
        ) {

            return null;

        }

        if (
            typeof this.locationAdapter.get ===
            "function"
        ) {

            return this.locationAdapter.get();

        }

        return null;

    }

    /* ======================================================
       Custom History Adapter
    ====================================================== */

    setHistoryAdapter(
        adapter
    ) {

        if (
            typeof adapter !== "object" ||
            adapter === null
        ) {

            throw new TypeError(
                "History adapter must be an object."
            );

        }

        this.historyAdapter =
            adapter;

        return this;

    }

    _pushHistory(
        url,
        replace = false
    ) {

        if (
            this.historyAdapter
        ) {

            if (
                replace &&
                typeof this.historyAdapter.replace ===
                "function"
            ) {

                return this.historyAdapter.replace(
                    url
                );

            }

            if (
                typeof this.historyAdapter.push ===
                "function"
            ) {

                return this.historyAdapter.push(
                    url
                );

            }

        }

        return null;

    }

    /* ======================================================
       Route Snapshot Management
    ====================================================== */

    createSnapshot() {

        return {

            routes:
                this.cloneRoutes(),

            options:
                {
                    ...this.options
                },

            current:
                this.current,

            timestamp:
                Date.now()

        };

    }

    restoreSnapshot(
        snapshot
    ) {

        if (
            !snapshot ||
            !Array.isArray(
                snapshot.routes
            )
        ) {

            return false;

        }

        this.routes =
            snapshot.routes.map(
                item => ({
                    ...item
                })
            );

        this.options =
            {
                ...snapshot.options
            };

        this.current =
            snapshot.current || null;

        return true;

    }

    /* ======================================================
       Route Locking
    ====================================================== */

    lock() {

        this.locked =
            true;

        return this;

    }

    unlock() {

        this.locked =
            false;

        return this;

    }

    isLocked() {

        return Boolean(
            this.locked
        );

    }

    /* ======================================================
       Protected Registration
    ====================================================== */

    _canModifyRoutes() {

        return !this.locked;

    }

    safeAdd(
        path,
        handler,
        options = {}
    ) {

        if (
            !this._canModifyRoutes()
        ) {

            throw new Error(
                "Router is locked."
            );

        }

        return this.add(
            path,
            handler,
            options
        );

    }
        /* ======================================================
       Route Validation
    ====================================================== */

    validateRoute(
        route
    ) {

        if (!route) {

            return false;

        }

        if (
            typeof route.path !== "string"
        ) {

            return false;

        }

        if (
            typeof route.handler !== "function"
        ) {

            return false;

        }

        if (
            !route.regex
        ) {

            return false;

        }

        return true;

    }

    validateAllRoutes() {

        const invalid = [];

        for (
            const route of this.routes
        ) {

            if (
                !this.validateRoute(route)
            ) {

                invalid.push(
                    route
                );

            }

        }

        return {

            valid:
                invalid.length === 0,

            invalid

        };

    }

    /* ======================================================
       Route Repair Utilities
    ====================================================== */

    repair() {

        this.routes =
            this.routes.filter(
                route =>
                    this.validateRoute(
                        route
                    )
            );

        this.routeNames.clear();

        for (
            const route of this.routes
        ) {

            if (
                route.name
            ) {

                this.routeNames.set(
                    route.name,
                    route
                );

            }

        }

        return this;

    }

    /* ======================================================
       Navigation Cancellation
    ====================================================== */

    cancelNavigation() {

        this.cancelled =
            true;

        return this;

    }

    resetCancellation() {

        this.cancelled =
            false;

        return this;

    }

    isNavigationCancelled() {

        return Boolean(
            this.cancelled
        );

    }

    /* ======================================================
       Navigation State Helpers
    ====================================================== */

    createNavigationState(
        context,
        data = {}
    ) {

        return {

            id:
                context.id,

            path:
                context.path,

            data,

            created:
                Date.now()

        };

    }

    storeNavigationState(
        key,
        value
    ) {

        if (
            !this.navigationState
        ) {

            this.navigationState =
                new Map();

        }

        this.navigationState.set(
            key,
            value
        );

        return this;

    }

    getNavigationState(
        key
    ) {

        if (
            !this.navigationState
        ) {

            return null;

        }

        return (
            this.navigationState.get(
                key
            ) || null
        );

    }

    removeNavigationState(
        key
    ) {

        if (
            !this.navigationState
        ) {

            return false;

        }

        return this.navigationState.delete(
            key
        );

    }

    clearNavigationState() {

        if (
            this.navigationState
        ) {

            this.navigationState.clear();

        }

        return this;

    }

    /* ======================================================
       Route Middleware Grouping
    ====================================================== */

    middlewareGroup(
        names = [],
        middleware
    ) {

        this._assertFunction(
            middleware
        );

        for (
            const name of names
        ) {

            const route =
                this.route(name);

            if (
                route
            ) {

                route.middlewares.push(
                    middleware
                );

            }

        }

        return this;

    }
        /* ======================================================
       Route Batch Operations
    ====================================================== */

    addMany(
        routes = []
    ) {

        if (
            !Array.isArray(routes)
        ) {

            throw new TypeError(
                "Routes must be an array."
            );

        }

        for (
            const item of routes
        ) {

            this.add(
                item.path,
                item.handler,
                item.options || {}
            );

        }

        return this;

    }

    removeMany(
        names = []
    ) {

        if (
            !Array.isArray(names)
        ) {

            return false;

        }

        for (
            const name of names
        ) {

            this.remove(
                name
            );

        }

        return true;

    }

    /* ======================================================
       Route Alias Management
    ====================================================== */

    addAlias(
        name,
        alias
    ) {

        const route =
            this.route(name);

        if (!route) {

            return false;

        }

        route.aliases =
            route.aliases || [];

        if (
            !route.aliases.includes(alias)
        ) {

            route.aliases.push(
                alias
            );

        }

        return true;

    }

    removeAlias(
        name,
        alias
    ) {

        const route =
            this.route(name);

        if (
            !route ||
            !route.aliases
        ) {

            return false;

        }

        const index =
            route.aliases.indexOf(
                alias
            );

        if (
            index < 0
        ) {

            return false;

        }

        route.aliases.splice(
            index,
            1
        );

        return true;

    }

    aliases(
        name
    ) {

        const route =
            this.route(name);

        if (
            !route
        ) {

            return [];

        }

        return [
            ...(route.aliases || [])
        ];

    }

    /* ======================================================
       Route Permissions
    ====================================================== */

    permission(
        name,
        permissions = []
    ) {

        const route =
            this.route(name);

        if (
            !route
        ) {

            return false;

        }

        route.permissions =
            Array.isArray(
                permissions
            )
                ? permissions
                : [];

        return true;

    }

    hasPermission(
        name,
        permission
    ) {

        const route =
            this.route(name);

        if (
            !route ||
            !route.permissions
        ) {

            return false;

        }

        return route.permissions.includes(
            permission
        );

    }

    /* ======================================================
       Route Groups With Middleware
    ====================================================== */

    middleware(
        prefix,
        middleware,
        callback
    ) {

        this._assertFunction(
            middleware
        );

        this.group(
            prefix,
            group => {

                callback(
                    group
                );

            },
            {
                middlewares: [
                    middleware
                ]
            }
        );

        return this;

    }
        /* ======================================================
       Route Filtering System
    ====================================================== */

    where(
        callback
    ) {

        this._assertFunction(
            callback
        );

        return this.routes.filter(
            callback
        );

    }

    findByPath(
        path
    ) {

        const normalized =
            this._normalizePath(
                path
            );

        return (
            this.routes.find(
                route =>
                    route.path === normalized
            ) || null
        );

    }

    findByMethod(
        method
    ) {

        const target =
            String(method)
                .toUpperCase();

        return this.routes.filter(
            route =>
                route.method === target
        );

    }

    findByMeta(
        key,
        value
    ) {

        return this.routes.filter(
            route =>
                route.meta &&
                route.meta[key] === value
        );

    }

    /* ======================================================
       Route Priority Queue
    ====================================================== */

    sortRoutes(
        comparator
    ) {

        if (
            typeof comparator !== "function"
        ) {

            throw new TypeError(
                "Comparator must be a function."
            );

        }

        this.routes.sort(
            comparator
        );

        return this;

    }

    prioritize(
        name,
        weight = 0
    ) {

        const route =
            this.route(name);

        if (
            !route
        ) {

            return false;

        }

        route.weight =
            Number(weight);

        this.routes.sort(
            (a, b) => {

                return (
                    (b.weight || 0) -
                    (a.weight || 0)
                );

            }
        );

        return true;

    }

    /* ======================================================
       Route Duplication
    ====================================================== */

    duplicate(
        sourceName,
        targetName,
        overrides = {}
    ) {

        const source =
            this.route(sourceName);

        if (
            !source
        ) {

            return false;

        }

        const copy = {

            ...source,

            name:
                targetName,

            ...overrides

        };

        delete copy.id;

        this.add(
            copy.path,
            copy.handler,
            {
                name:
                    copy.name,

                method:
                    copy.method,

                meta:
                    copy.meta,

                middlewares:
                    copy.middlewares
            }
        );

        return true;

    }

    /* ======================================================
       Runtime Route Updates
    ====================================================== */

    updatePath(
        name,
        newPath
    ) {

        const route =
            this.route(name);

        if (
            !route
        ) {

            return false;

        }

        route.path =
            this._normalizePath(
                newPath
            );

        const compiled =
            this._compilePath(
                route.path
            );

        route.regex =
            compiled.regex;

        route.keys =
            compiled.keys;

        return true;

    }

    updateMethod(
        name,
        method
    ) {

        const route =
            this.route(name);

        if (
            !route
        ) {

            return false;

        }

        route.method =
            String(method)
                .toUpperCase();

        return true;

    }
        /* ======================================================
       Route Parameter Validation
    ====================================================== */

    validateParams(
        route,
        params = {}
    ) {

        if (
            !route
        ) {

            return false;

        }

        for (
            const key of route.keys
        ) {

            if (
                !Object.prototype
                    .hasOwnProperty
                    .call(
                        params,
                        key
                    )
            ) {

                return false;

            }

        }

        return true;

    }

    assertParams(
        name,
        params = {}
    ) {

        const route =
            this.route(name);

        if (
            !route
        ) {

            throw new Error(
                `Route "${name}" not found.`
            );

        }

        if (
            !this.validateParams(
                route,
                params
            )
        ) {

            throw new Error(
                "Invalid route parameters."
            );

        }

        return true;

    }

    /* ======================================================
       Route Parameter Encoding
    ====================================================== */

    encodeParams(
        params = {}
    ) {

        const encoded = {};

        for (
            const key of Object.keys(params)
        ) {

            encoded[key] =
                encodeURIComponent(
                    params[key]
                );

        }

        return encoded;

    }

    decodeParams(
        params = {}
    ) {

        const decoded = {};

        for (
            const key of Object.keys(params)
        ) {

            decoded[key] =
                decodeURIComponent(
                    params[key]
                );

        }

        return decoded;

    }

    /* ======================================================
       Route Matching Options
    ====================================================== */

    setCaseSensitive(
        enabled = true
    ) {

        this.options.caseSensitive =
            Boolean(enabled);

        this._rebuildRoutes();

        return this;

    }

    setTrailingSlash(
        enabled = true
    ) {

        this.options.strictTrailingSlash =
            Boolean(enabled);

        this._rebuildRoutes();

        return this;

    }

    _rebuildRoutes() {

        for (
            const route of this.routes
        ) {

            const compiled =
                this._compilePath(
                    route.path
                );

            route.regex =
                compiled.regex;

            route.keys =
                compiled.keys;

        }

        return this;

    }

    /* ======================================================
       Route Metadata Collection
    ====================================================== */

    collectMeta(
        key
    ) {

        const result = [];

        for (
            const route of this.routes
        ) {

            if (
                route.meta &&
                Object.prototype
                    .hasOwnProperty
                    .call(
                        route.meta,
                        key
                    )
            ) {

                result.push(
                    route.meta[key]
                );

            }

        }

        return result;

    }

    allMeta() {

        return this.routes.map(
            route => ({
                name:
                    route.name,

                meta:
                    {
                        ...route.meta
                    }
            })
        );

    }

    /* ======================================================
       Route Debug Tree
    ====================================================== */

    tree() {

        const tree = {};

        for (
            const route of this.routes
        ) {

            const parts =
                route.path
                    .split("/")
                    .filter(Boolean);

            let node =
                tree;

            for (
                const part of parts
            ) {

                if (
                    !node[part]
                ) {

                    node[part] = {};

                }

                node =
                    node[part];

            }

            node.$route =
                route.name || route.path;

        }

        return tree;

    }
        /* ======================================================
       Navigation History Manager
    ====================================================== */

    enableNavigationHistory(
        enabled = true
    ) {

        this.navigationHistoryEnabled =
            Boolean(enabled);

        if (
            this.navigationHistoryEnabled &&
            !this.navigationHistory
        ) {

            this.navigationHistory = [];

        }

        return this;

    }

    _storeNavigationHistory(
        context
    ) {

        if (
            !this.navigationHistoryEnabled
        ) {

            return;

        }

        this.navigationHistory.push({

            path:
                context.fullPath,

            name:
                context.name,

            timestamp:
                Date.now()

        });

    }

    getNavigationHistory() {

        return [
            ...(this.navigationHistory || [])
        ];

    }

    clearNavigationHistory() {

        if (
            this.navigationHistory
        ) {

            this.navigationHistory.length = 0;

        }

        return this;

    }

    /* ======================================================
       Navigation Event Pipeline Extension
    ====================================================== */

    async _beforeNavigation(
        context
    ) {

        this.emit(
            "before:navigate",
            context
        );

        const guards =
            await this._runGuards(
                context
            );

        if (
            !guards
        ) {

            return false;

        }

        const resolve =
            await this._runResolveHooks(
                context
            );

        return resolve;

    }

    async _afterNavigation(
        context
    ) {

        this._storeNavigationHistory(
            context
        );

        await this._handleScroll(
            context
        );

        await this._runTransition(
            context
        );

        await this._track(
            context
        );

        this.emit(
            "after:navigate",
            context
        );

    }

    /* ======================================================
       Navigation Lock
    ====================================================== */

    lockNavigation() {

        this.navigationLocked =
            true;

        return this;

    }

    unlockNavigation() {

        this.navigationLocked =
            false;

        return this;

    }

    isNavigationLocked() {

        return Boolean(
            this.navigationLocked
        );

    }

    /* ======================================================
       Enhanced Navigation Check
    ====================================================== */

    async checkNavigation(
        target
    ) {

        const context =
            this.resolve(
                target
            );

        if (
            !context
        ) {

            return false;

        }

        return await this._beforeNavigation(
            context
        );

    }

    /* ======================================================
       Router Event Helpers
    ====================================================== */

    ready(
        callback
    ) {

        if (
            this.started
        ) {

            callback(
                this
            );

        } else {

            this.once(
                "start",
                () => {

                    callback(
                        this
                    );

                }
            );

        }

        return this;

    }
        /* ======================================================
       Router Performance Monitor
    ====================================================== */

    enablePerformanceMonitor(
        enabled = true
    ) {

        this.performanceEnabled =
            Boolean(enabled);

        if (
            this.performanceEnabled &&
            !this.performanceLog
        ) {

            this.performanceLog = [];

        }

        return this;

    }

    _startTimer(
        label
    ) {

        if (
            !this.performanceEnabled
        ) {

            return null;

        }

        return {

            label,

            start:
                performance.now()

        };

    }

    _endTimer(
        timer
    ) {

        if (
            !timer ||
            !this.performanceEnabled
        ) {

            return;

        }

        const result = {

            label:
                timer.label,

            duration:
                performance.now() -
                timer.start,

            timestamp:
                Date.now()

        };

        this.performanceLog.push(
            result
        );

        return result;

    }

    getPerformanceLog() {

        return [
            ...(this.performanceLog || [])
        ];

    }

    clearPerformanceLog() {

        if (
            this.performanceLog
        ) {

            this.performanceLog.length = 0;

        }

        return this;

    }

    /* ======================================================
       Route Execution Statistics
    ====================================================== */

    recordExecution(
        route,
        duration
    ) {

        if (
            !route
        ) {

            return;

        }

        route.statistics =
            route.statistics || {

                count: 0,

                totalTime: 0,

                averageTime: 0

            };

        route.statistics.count++;

        route.statistics.totalTime +=
            duration;

        route.statistics.averageTime =
            route.statistics.totalTime /
            route.statistics.count;

    }

    getExecutionStatistics(
        name
    ) {

        const route =
            this.route(name);

        if (
            !route
        ) {

            return null;

        }

        return (
            route.statistics || null
        );

    }

    /* ======================================================
       Router Health Check
    ====================================================== */

    health() {

        return {

            status:
                "ok",

            routes:
                this.routes.length,

            listeners:
                this.events.size,

            cache:
                this.cache.size,

            started:
                this.started,

            navigating:
                this.navigating,

            locked:
                this.locked || false

        };

    }

    /* ======================================================
       Internal Diagnostics
    ====================================================== */

    diagnose() {

        return {

            validation:
                this.validateAllRoutes(),

            statistics:
                this.statistics(),

            health:
                this.health(),

            options:
                {
                    ...this.options
                }

        };

    }

    /* ======================================================
       Route Execution Wrapper
    ====================================================== */

    async execute(
        context
    ) {

        const timer =
            this._startTimer(
                "route-execution"
            );

        const start =
            Date.now();

        try {

            const result =
                await this._executeHandler(
                    context
                );

            return result;

        } finally {

            const duration =
                Date.now() -
                start;

            this.recordExecution(
                context.route,
                duration
            );

            this._endTimer(
                timer
            );

        }

    }
        /* ======================================================
       Router Event Queue
    ====================================================== */

    enqueueEvent(
        event,
        payload = {}
    ) {

        if (
            !this.eventQueue
        ) {

            this.eventQueue = [];

        }

        this.eventQueue.push({

            event,

            payload,

            timestamp:
                Date.now()

        });

        return this;

    }

    dequeueEvent() {

        if (
            !this.eventQueue ||
            this.eventQueue.length === 0
        ) {

            return null;

        }

        return this.eventQueue.shift();

    }

    processEventQueue() {

        if (
            !this.eventQueue
        ) {

            return this;

        }

        let item;

        while (
            (
                item =
                    this.dequeueEvent()
            )
        ) {

            this.emit(
                item.event,
                item.payload
            );

        }

        return this;

    }

    /* ======================================================
       Route Lifecycle Manager
    ====================================================== */

    addLifecycle(
        stage,
        handler
    ) {

        this._assertFunction(
            handler
        );

        if (
            !this.lifecycle
        ) {

            this.lifecycle = {};

        }

        if (
            !this.lifecycle[stage]
        ) {

            this.lifecycle[stage] = [];

        }

        this.lifecycle[stage].push(
            handler
        );

        return this;

    }

    async runLifecycle(
        stage,
        context
    ) {

        if (
            !this.lifecycle ||
            !this.lifecycle[stage]
        ) {

            return true;

        }

        for (
            const handler of this.lifecycle[stage]
        ) {

            const result =
                await handler(
                    context
                );

            if (
                result === false
            ) {

                return false;

            }

        }

        return true;

    }

    removeLifecycle(
        stage,
        handler
    ) {

        if (
            !this.lifecycle ||
            !this.lifecycle[stage]
        ) {

            return false;

        }

        const index =
            this.lifecycle[stage]
                .indexOf(
                    handler
                );

        if (
            index === -1
        ) {

            return false;

        }

        this.lifecycle[stage].splice(
            index,
            1
        );

        return true;

    }

    /* ======================================================
       Route Error Recovery
    ====================================================== */

    recover(
        handler
    ) {

        this._assertFunction(
            handler
        );

        this.recoveryHandler =
            handler;

        return this;

    }

    async _recover(
        error,
        context
    ) {

        if (
            typeof this.recoveryHandler !==
            "function"
        ) {

            throw error;

        }

        return await this.recoveryHandler(
            error,
            context
        );

    }

    /* ======================================================
       Router Backup
    ====================================================== */

    backup() {

        return {

            routes:
                this.cloneRoutes(),

            options:
                {
                    ...this.options
                },

            current:
                this.current,

            previous:
                this.previous,

            created:
                Date.now()

        };

    }

    restoreBackup(
        backup
    ) {

        if (
            !backup ||
            !Array.isArray(
                backup.routes
            )
        ) {

            return false;

        }

        this.routes =
            backup.routes.map(
                route => ({
                    ...route
                })
            );

        this.options =
            {
                ...backup.options
            };

        this.current =
            backup.current || null;

        this.previous =
            backup.previous || null;

        this.repair();

        return true;

    }
        /* ======================================================
       Router Request Pipeline
    ====================================================== */

    async request(
        target,
        options = {}
    ) {

        const context =
            this.resolve(
                target,
                options.method || "GET"
            );

        if (
            !context
        ) {

            return this._handleNotFound(
                target
            );

        }

        const allowed =
            await this.checkNavigation(
                target
            );

        if (
            !allowed
        ) {

            return false;

        }

        return await this.navigate(
            target,
            options
        );

    }

    /* ======================================================
       Route Request Context
    ====================================================== */

    createContext(
        data = {}
    ) {

        return {

            id:
                this._generateId(),

            timestamp:
                Date.now(),

            ...data

        };

    }

    mergeContext(
        context,
        data = {}
    ) {

        return {

            ...context,

            ...data

        };

    }

    /* ======================================================
       Router ID Generator
    ====================================================== */

    _generateId() {

        return (
            "route_" +
            Math.random()
                .toString(36)
                .slice(2) +
            "_" +
            Date.now()
        );

    }

    /* ======================================================
       Request Interceptors
    ====================================================== */

    addInterceptor(
        interceptor
    ) {

        this._assertFunction(
            interceptor
        );

        if (
            !this.interceptors
        ) {

            this.interceptors = [];

        }

        this.interceptors.push(
            interceptor
        );

        return this;

    }

    removeInterceptor(
        interceptor
    ) {

        if (
            !this.interceptors
        ) {

            return false;

        }

        const index =
            this.interceptors.indexOf(
                interceptor
            );

        if (
            index < 0
        ) {

            return false;

        }

        this.interceptors.splice(
            index,
            1
        );

        return true;

    }

    async runInterceptors(
        context
    ) {

        if (
            !this.interceptors
        ) {

            return context;

        }

        let result =
            context;

        for (
            const interceptor of this.interceptors
        ) {

            result =
                await interceptor(
                    result
                );

            if (
                result === false
            ) {

                return false;

            }

        }

        return result;

    }

    /* ======================================================
       Route Request Transformation
    ====================================================== */

    transform(
        handler
    ) {

        this._assertFunction(
            handler
        );

        this.transformHandler =
            handler;

        return this;

    }

    async _transform(
        context
    ) {

        if (
            typeof this.transformHandler !==
            "function"
        ) {

            return context;

        }

        return await this.transformHandler(
            context
        );

    }

    /* ======================================================
       Route Response Handling
    ====================================================== */

    response(
        handler
    ) {

        this._assertFunction(
            handler
        );

        this.responseHandler =
            handler;

        return this;

    }

    async _handleResponse(
        result,
        context
    ) {

        if (
            typeof this.responseHandler !==
            "function"
        ) {

            return result;

        }

        return await this.responseHandler(
            result,
            context
        );

    }
        /* ======================================================
       Router Request Guards
    ====================================================== */

    addRequestGuard(
        guard
    ) {

        this._assertFunction(
            guard
        );

        if (
            !this.requestGuards
        ) {

            this.requestGuards = [];

        }

        this.requestGuards.push(
            guard
        );

        return this;

    }

    removeRequestGuard(
        guard
    ) {

        if (
            !this.requestGuards
        ) {

            return false;

        }

        const index =
            this.requestGuards.indexOf(
                guard
            );

        if (
            index === -1
        ) {

            return false;

        }

        this.requestGuards.splice(
            index,
            1
        );

        return true;

    }

    async runRequestGuards(
        context
    ) {

        if (
            !this.requestGuards
        ) {

            return true;

        }

        for (
            const guard of this.requestGuards
        ) {

            const result =
                await guard(
                    context
                );

            if (
                result === false
            ) {

                return false;

            }

        }

        return true;

    }

    /* ======================================================
       Router Request Cache
    ====================================================== */

    enableRequestCache(
        enabled = true
    ) {

        this.requestCacheEnabled =
            Boolean(enabled);

        return this;

    }

    cacheRequest(
        key,
        value
    ) {

        if (
            !this.requestCache
        ) {

            this.requestCache =
                new Map();

        }

        this.requestCache.set(
            key,
            value
        );

        return this;

    }

    getRequestCache(
        key
    ) {

        if (
            !this.requestCache
        ) {

            return null;

        }

        return (
            this.requestCache.get(
                key
            ) || null
        );

    }

    removeRequestCache(
        key
    ) {

        if (
            !this.requestCache
        ) {

            return false;

        }

        return this.requestCache.delete(
            key
        );

    }

    clearRequestCache() {

        if (
            this.requestCache
        ) {

            this.requestCache.clear();

        }

        return this;

    }

    /* ======================================================
       Router State Machine
    ====================================================== */

    setState(
        state,
        value
    ) {

        if (
            !this.states
        ) {

            this.states =
                new Map();

        }

        this.states.set(
            state,
            value
        );

        return this;

    }

    getState(
        state,
        fallback = null
    ) {

        if (
            !this.states
        ) {

            return fallback;

        }

        return this.states.has(state)
            ? this.states.get(state)
            : fallback;

    }

    removeState(
        state
    ) {

        if (
            !this.states
        ) {

            return false;

        }

        return this.states.delete(
            state
        );

    }

    clearStates() {

        if (
            this.states
        ) {

            this.states.clear();

        }

        return this;

    }
        /* ======================================================
       Router Data Store
    ====================================================== */

    store(
        key,
        value
    ) {

        if (
            !this.storeData
        ) {

            this.storeData =
                new Map();

        }

        this.storeData.set(
            key,
            value
        );

        return this;

    }

    retrieve(
        key,
        fallback = null
    ) {

        if (
            !this.storeData
        ) {

            return fallback;

        }

        return this.storeData.has(key)
            ? this.storeData.get(key)
            : fallback;

    }

    forget(
        key
    ) {

        if (
            !this.storeData
        ) {

            return false;

        }

        return this.storeData.delete(
            key
        );

    }

    flushStore() {

        if (
            this.storeData
        ) {

            this.storeData.clear();

        }

        return this;

    }

    /* ======================================================
       Router Shared Context
    ====================================================== */

    setContext(
        key,
        value
    ) {

        if (
            !this.sharedContext
        ) {

            this.sharedContext =
                {};

        }

        this.sharedContext[key] =
            value;

        return this;

    }

    getContext(
        key,
        fallback = null
    ) {

        if (
            !this.sharedContext
        ) {

            return fallback;

        }

        return Object.prototype.hasOwnProperty.call(
            this.sharedContext,
            key
        )
            ? this.sharedContext[key]
            : fallback;

    }

    removeContext(
        key
    ) {

        if (
            !this.sharedContext
        ) {

            return false;

        }

        if (
            !Object.prototype.hasOwnProperty.call(
                this.sharedContext,
                key
            )
        ) {

            return false;

        }

        delete this.sharedContext[key];

        return true;

    }

    clearContext() {

        this.sharedContext =
            {};

        return this;

    }

    /* ======================================================
       Router Module Registry
    ====================================================== */

    registerModule(
        name,
        module
    ) {

        if (
            !this.modules
        ) {

            this.modules =
                new Map();

        }

        this.modules.set(
            name,
            module
        );

        return this;

    }

    getModule(
        name
    ) {

        if (
            !this.modules
        ) {

            return null;

        }

        return (
            this.modules.get(name) ||
            null
        );

    }

    removeModule(
        name
    ) {

        if (
            !this.modules
        ) {

            return false;

        }

        return this.modules.delete(
            name
        );

    }

    modulesList() {

        if (
            !this.modules
        ) {

            return [];

        }

        return Array.from(
            this.modules.keys()
        );

    }

    /* ======================================================
       Router Command System
    ====================================================== */

    command(
        name,
        handler
    ) {

        this._assertFunction(
            handler
        );

        if (
            !this.commands
        ) {

            this.commands =
                new Map();

        }

        this.commands.set(
            name,
            handler
        );

        return this;

    }

    async executeCommand(
        name,
        payload = {}
    ) {

        if (
            !this.commands ||
            !this.commands.has(name)
        ) {

            return null;

        }

        const handler =
            this.commands.get(
                name
            );

        return await handler(
            payload,
            this
        );

    }

    removeCommand(
        name
    ) {

        if (
            !this.commands
        ) {

            return false;

        }

        return this.commands.delete(
            name
        );

    }
        /* ======================================================
       Router Task Scheduler
    ====================================================== */

    schedule(
        name,
        handler,
        delay = 0
    ) {

        this._assertFunction(
            handler
        );

        if (
            !this.tasks
        ) {

            this.tasks =
                new Map();

        }

        const task = {

            name,

            handler,

            delay,

            timer:
                setTimeout(
                    async () => {

                        await handler(
                            this
                        );

                    },
                    delay
                )

        };

        this.tasks.set(
            name,
            task
        );

        return this;

    }

    cancelTask(
        name
    ) {

        if (
            !this.tasks ||
            !this.tasks.has(name)
        ) {

            return false;

        }

        const task =
            this.tasks.get(
                name
            );

        clearTimeout(
            task.timer
        );

        this.tasks.delete(
            name
        );

        return true;

    }

    clearTasks() {

        if (
            !this.tasks
        ) {

            return this;

        }

        for (
            const task of this.tasks.values()
        ) {

            clearTimeout(
                task.timer
            );

        }

        this.tasks.clear();

        return this;

    }

    /* ======================================================
       Router Notification System
    ====================================================== */

    notify(
        type,
        message,
        data = {}
    ) {

        if (
            !this.notifications
        ) {

            this.notifications =
                [];

        }

        const item = {

            type,

            message,

            data,

            timestamp:
                Date.now()

        };

        this.notifications.push(
            item
        );

        this.emit(
            "notification",
            item
        );

        return item;

    }

    notificationsList() {

        return [
            ...(this.notifications || [])
        ];

    }

    clearNotifications() {

        if (
            this.notifications
        ) {

            this.notifications.length = 0;

        }

        return this;

    }

    /* ======================================================
       Router Feature Flags
    ====================================================== */

    feature(
        name,
        enabled = true
    ) {

        if (
            !this.features
        ) {

            this.features =
                new Map();

        }

        this.features.set(
            name,
            Boolean(enabled)
        );

        return this;

    }

    hasFeature(
        name
    ) {

        if (
            !this.features
        ) {

            return false;

        }

        return Boolean(
            this.features.get(
                name
            )
        );

    }

    removeFeature(
        name
    ) {

        if (
            !this.features
        ) {

            return false;

        }

        return this.features.delete(
            name
        );

    }

    listFeatures() {

        if (
            !this.features
        ) {

            return {};

        }

        return Object.fromEntries(
            this.features
        );

    }

    /* ======================================================
       Router Versioning
    ====================================================== */

    versioning(
        version
    ) {

        this.versionName =
            version;

        return this;

    }

    getVersion() {

        return this.versionName || null;

    }

    /* ======================================================
       Router Deprecation
    ====================================================== */

    deprecate(
        name,
        message = ""
    ) {

        const route =
            this.route(name);

        if (
            !route
        ) {

            return false;

        }

        route.deprecated =
            true;

        route.deprecationMessage =
            message;

        return true;

    }

    isDeprecated(
        name
    ) {

        const route =
            this.route(name);

        return Boolean(
            route &&
            route.deprecated
        );

    }
        /* ======================================================
       Router Migration Tools
    ====================================================== */

    migrate(
        source
    ) {

        if (
            !source ||
            typeof source !== "object"
        ) {

            throw new TypeError(
                "Migration source must be an object."
            );

        }

        if (
            Array.isArray(source.routes)
        ) {

            this.importRoutes(
                source.routes
            );

        }

        if (
            source.options
        ) {

            this.configure(
                source.options
            );

        }

        return this;

    }

    exportConfiguration() {

        return {

            options:
                {
                    ...this.options
                },

            routes:
                this.exportRoutes(),

            version:
                this.versionName || null

        };

    }

    importConfiguration(
        configuration
    ) {

        if (
            !configuration
        ) {

            return false;

        }

        if (
            configuration.options
        ) {

            this.configure(
                configuration.options
            );

        }

        if (
            Array.isArray(
                configuration.routes
            )
        ) {

            this.importRoutes(
                configuration.routes
            );

        }

        return true;

    }

    /* ======================================================
       Router Backup Scheduler
    ====================================================== */

    enableAutoBackup(
        interval = 60000
    ) {

        this.disableAutoBackup();

        this.backupTimer =
            setInterval(
                () => {

                    this.lastBackup =
                        this.backup();

                },
                interval
            );

        return this;

    }

    disableAutoBackup() {

        if (
            this.backupTimer
        ) {

            clearInterval(
                this.backupTimer
            );

            this.backupTimer =
                null;

        }

        return this;

    }

    getLastBackup() {

        return (
            this.lastBackup ||
            null
        );

    }

    /* ======================================================
       Router Runtime Flags
    ====================================================== */

    flag(
        name,
        value = true
    ) {

        if (
            !this.runtimeFlags
        ) {

            this.runtimeFlags =
                {};

        }

        this.runtimeFlags[name] =
            value;

        return this;

    }

    getFlag(
        name,
        fallback = false
    ) {

        if (
            !this.runtimeFlags
        ) {

            return fallback;

        }

        return Object.prototype.hasOwnProperty.call(
            this.runtimeFlags,
            name
        )
            ? this.runtimeFlags[name]
            : fallback;

    }

    removeFlag(
        name
    ) {

        if (
            !this.runtimeFlags
        ) {

            return false;

        }

        delete this.runtimeFlags[name];

        return true;

    }

    clearFlags() {

        this.runtimeFlags =
            {};

        return this;

    }

    /* ======================================================
       Router Command History
    ====================================================== */

    recordCommand(
        command,
        payload = {}
    ) {

        if (
            !this.commandHistory
        ) {

            this.commandHistory =
                [];

        }

        this.commandHistory.push({

            command,

            payload,

            timestamp:
                Date.now()

        });

        return this;

    }

    getCommandHistory() {

        return [
            ...(this.commandHistory || [])
        ];

    }

    clearCommandHistory() {

        if (
            this.commandHistory
        ) {

            this.commandHistory.length = 0;

        }

        return this;

    }
        /* ======================================================
       Router Access Log
    ====================================================== */

    enableAccessLog(
        enabled = true
    ) {

        this.accessLogEnabled =
            Boolean(enabled);

        if (
            this.accessLogEnabled &&
            !this.accessLog
        ) {

            this.accessLog = [];

        }

        return this;

    }

    logAccess(
        context,
        result = null
    ) {

        if (
            !this.accessLogEnabled
        ) {

            return;

        }

        this.accessLog.push({

            path:
                context.path,

            route:
                context.name,

            result,

            timestamp:
                Date.now()

        });

    }

    getAccessLog() {

        return [
            ...(this.accessLog || [])
        ];

    }

    clearAccessLog() {

        if (
            this.accessLog
        ) {

            this.accessLog.length = 0;

        }

        return this;

    }

    /* ======================================================
       Router Rate Limiter
    ====================================================== */

    enableRateLimit(
        options = {}
    ) {

        this.rateLimitOptions = {

            max:
                options.max || 100,

            window:
                options.window || 60000

        };

        this.rateLimitStore =
            new Map();

        return this;

    }

    checkRateLimit(
        key = "default"
    ) {

        if (
            !this.rateLimitOptions
        ) {

            return true;

        }

        const now =
            Date.now();

        const record =
            this.rateLimitStore.get(
                key
            ) || {

                count: 0,

                start: now

            };

        if (
            now - record.start >
            this.rateLimitOptions.window
        ) {

            record.count = 0;

            record.start = now;

        }

        record.count++;

        this.rateLimitStore.set(
            key,
            record
        );

        return (
            record.count <=
            this.rateLimitOptions.max
        );

    }

    resetRateLimit(
        key
    ) {

        if (
            !this.rateLimitStore
        ) {

            return false;

        }

        return this.rateLimitStore.delete(
            key
        );

    }

    /* ======================================================
       Router Request Metadata
    ====================================================== */

    addRequestMetadata(
        key,
        value
    ) {

        if (
            !this.requestMetadata
        ) {

            this.requestMetadata =
                {};

        }

        this.requestMetadata[key] =
            value;

        return this;

    }

    getRequestMetadata(
        key,
        fallback = null
    ) {

        if (
            !this.requestMetadata
        ) {

            return fallback;

        }

        return Object.prototype.hasOwnProperty.call(
            this.requestMetadata,
            key
        )
            ? this.requestMetadata[key]
            : fallback;

    }

    clearRequestMetadata() {

        this.requestMetadata =
            {};

        return this;

    }

    /* ======================================================
       Router Runtime Information
    ====================================================== */

    runtime() {

        return {

            started:
                this.started,

            current:
                this.current,

            previous:
                this.previous,

            routes:
                this.routes.length,

            memory:
                this.cache.size,

            platform:
                this.platform(),

            version:
                this.version()

        };

    }
        /* ======================================================
       Router Security Layer
    ====================================================== */

    enableSecurity(
        options = {}
    ) {

        this.securityOptions = {

            sanitize:
                options.sanitize !== false,

            validate:
                options.validate !== false,

            strict:
                Boolean(
                    options.strict
                )

        };

        return this;

    }

    sanitizeInput(
        value
    ) {

        if (
            typeof value !== "string"
        ) {

            return value;

        }

        return value
            .replace(
                /[<>]/g,
                ""
            );

    }

    validateInput(
        value,
        rules = {}
    ) {

        if (
            rules.required &&
            (
                value === null ||
                typeof value === "undefined" ||
                value === ""
            )
        ) {

            return false;

        }

        if (
            rules.type &&
            typeof value !== rules.type
        ) {

            return false;

        }

        return true;

    }

    /* ======================================================
       Router Token Storage
    ====================================================== */

    setToken(
        token
    ) {

        this.routerToken =
            token;

        return this;

    }

    getToken() {

        return this.routerToken || null;

    }

    clearToken() {

        this.routerToken =
            null;

        return this;

    }

    /* ======================================================
       Router Session Manager
    ====================================================== */

    createSession(
        data = {}
    ) {

        const id =
            this._generateId();

        if (
            !this.sessions
        ) {

            this.sessions =
                new Map();

        }

        const session = {

            id,

            data,

            created:
                Date.now()

        };

        this.sessions.set(
            id,
            session
        );

        return session;

    }

    getSession(
        id
    ) {

        if (
            !this.sessions
        ) {

            return null;

        }

        return (
            this.sessions.get(
                id
            ) || null
        );

    }

    removeSession(
        id
    ) {

        if (
            !this.sessions
        ) {

            return false;

        }

        return this.sessions.delete(
            id
        );

    }

    clearSessions() {

        if (
            this.sessions
        ) {

            this.sessions.clear();

        }

        return this;

    }

    /* ======================================================
       Router Localization
    ====================================================== */

    locale(
        language
    ) {

        this.currentLocale =
            language;

        return this;

    }

    getLocale(
        fallback = "en"
    ) {

        return (
            this.currentLocale ||
            fallback
        );

    }

    translate(
        key,
        params = {}
    ) {

        if (
            !this.translations
        ) {

            return key;

        }

        let value =
            this.translations[
                this.getLocale()
            ]?.[key];

        if (
            !value
        ) {

            return key;

        }

        for (
            const param of Object.keys(params)
        ) {

            value =
                value.replace(
                    `{${param}}`,
                    params[param]
                );

        }

        return value;

    }

    addTranslations(
        language,
        dictionary = {}
    ) {

        if (
            !this.translations
        ) {

            this.translations =
                {};

        }

        this.translations[language] =
            {
                ...(this.translations[language] || {}),
                ...dictionary
            };

        return this;

    }
        /* ======================================================
       Router Localization Helpers
    ====================================================== */

    removeTranslations(
        language
    ) {

        if (
            !this.translations
        ) {

            return false;

        }

        if (
            !this.translations[language]
        ) {

            return false;

        }

        delete this.translations[language];

        return true;

    }

    availableLocales() {

        if (
            !this.translations
        ) {

            return [];

        }

        return Object.keys(
            this.translations
        );

    }

    /* ======================================================
       Router Event Broadcasting
    ====================================================== */

    broadcast(
        event,
        payload = {}
    ) {

        this.emit(
            event,
            {
                ...payload,

                timestamp:
                    Date.now()

            }
        );

        return this;

    }

    subscribe(
        event,
        handler
    ) {

        return this.on(
            event,
            handler
        );

    }

    unsubscribe(
        event,
        handler
    ) {

        if (
            !this.events.has(event)
        ) {

            return false;

        }

        const listeners =
            this.events.get(
                event
            );

        const index =
            listeners.indexOf(
                handler
            );

        if (
            index === -1
        ) {

            return false;

        }

        listeners.splice(
            index,
            1
        );

        return true;

    }

    /* ======================================================
       Router Metrics Collector
    ====================================================== */

    enableMetrics(
        enabled = true
    ) {

        this.metricsEnabled =
            Boolean(enabled);

        if (
            this.metricsEnabled &&
            !this.metrics
        ) {

            this.metrics =
                {};

        }

        return this;

    }

    metric(
        key,
        value = 1
    ) {

        if (
            !this.metricsEnabled
        ) {

            return;

        }

        if (
            !this.metrics[key]
        ) {

            this.metrics[key] = 0;

        }

        this.metrics[key] += value;

    }

    getMetrics() {

        return {

            ...(this.metrics || {})

        };

    }

    clearMetrics() {

        this.metrics =
            {};

        return this;

    }

    /* ======================================================
       Router Feature Configuration
    ====================================================== */

    configureFeature(
        name,
        config = {}
    ) {

        if (
            !this.featureConfig
        ) {

            this.featureConfig =
                {};

        }

        this.featureConfig[name] =
            {
                ...(this.featureConfig[name] || {}),
                ...config
            };

        return this;

    }

    getFeatureConfig(
        name
    ) {

        if (
            !this.featureConfig
        ) {

            return null;

        }

        return (
            this.featureConfig[name] ||
            null
        );

    }

    removeFeatureConfig(
        name
    ) {

        if (
            !this.featureConfig
        ) {

            return false;

        }

        delete this.featureConfig[name];

        return true;

    }
        /* ======================================================
       Router Plugin Lifecycle
    ====================================================== */

    install(
        plugin,
        options = {}
    ) {

        if (
            typeof plugin !== "function"
        ) {

            throw new TypeError(
                "Plugin installer must be a function."
            );

        }

        if (
            !this.installedPlugins
        ) {

            this.installedPlugins =
                new Map();

        }

        const name =
            plugin.name ||
            this._generateId();

        const result =
            plugin(
                this,
                options
            );

        this.installedPlugins.set(
            name,
            {

                plugin,

                options,

                result

            }
        );

        return this;

    }

    uninstall(
        name
    ) {

        if (
            !this.installedPlugins ||
            !this.installedPlugins.has(name)
        ) {

            return false;

        }

        const item =
            this.installedPlugins.get(
                name
            );

        if (
            item.plugin.dispose &&
            typeof item.plugin.dispose === "function"
        ) {

            item.plugin.dispose(
                this
            );

        }

        this.installedPlugins.delete(
            name
        );

        return true;

    }

    plugins() {

        if (
            !this.installedPlugins
        ) {

            return [];

        }

        return Array.from(
            this.installedPlugins.keys()
        );

    }

    /* ======================================================
       Router Diagnostics Export
    ====================================================== */

    exportDiagnostics() {

        return {

            info:
                this.info(),

            health:
                this.health(),

            runtime:
                this.runtime(),

            statistics:
                this.statistics(),

            metrics:
                this.getMetrics(),

            performance:
                this.getPerformanceLog()

        };

    }

    /* ======================================================
       Router Cleanup Utilities
    ====================================================== */

    cleanup() {

        this.clearCache();

        this.clearRequestCache();

        this.clearNavigationState();

        this.clearNotifications();

        this.clearCommandHistory();

        this.clearAccessLog();

        this.clearMetrics();

        return this;

    }

    /* ======================================================
       Router Global Variables
    ====================================================== */

    setGlobal(
        key,
        value
    ) {

        if (
            !this.globals
        ) {

            this.globals =
                {};

        }

        this.globals[key] =
            value;

        return this;

    }

    getGlobal(
        key,
        fallback = null
    ) {

        if (
            !this.globals
        ) {

            return fallback;

        }

        return Object.prototype.hasOwnProperty.call(
            this.globals,
            key
        )
            ? this.globals[key]
            : fallback;

    }

    removeGlobal(
        key
    ) {

        if (
            !this.globals
        ) {

            return false;

        }

        delete this.globals[key];

        return true;

    }

    clearGlobals() {

        this.globals =
            {};

        return this;

    }

    /* ======================================================
       Router Environment Variables
    ====================================================== */

    env(
        key,
        value
    ) {

        if (
            !this.environment
        ) {

            this.environment =
                {};

        }

        if (
            typeof value === "undefined"
        ) {

            return (
                this.environment[key] ??
                null
            );

        }

        this.environment[key] =
            value;

        return this;

    }

    clearEnvironment() {

        this.environment =
            {};

        return this;

    }
        /* ======================================================
       Router State Persistence
    ====================================================== */

    persist(
        key,
        value
    ) {

        if (
            typeof localStorage === "undefined"
        ) {

            return false;

        }

        localStorage.setItem(
            key,
            JSON.stringify(
                value
            )
        );

        return true;

    }

    restorePersisted(
        key,
        fallback = null
    ) {

        if (
            typeof localStorage === "undefined"
        ) {

            return fallback;

        }

        const value =
            localStorage.getItem(
                key
            );

        if (
            value === null
        ) {

            return fallback;

        }

        try {

            return JSON.parse(
                value
            );

        } catch {

            return fallback;

        }

    }

    removePersisted(
        key
    ) {

        if (
            typeof localStorage === "undefined"
        ) {

            return false;

        }

        localStorage.removeItem(
            key
        );

        return true;

    }

    clearPersisted() {

        if (
            typeof localStorage === "undefined"
        ) {

            return false;

        }

        localStorage.clear();

        return true;

    }

    /* ======================================================
       Router Configuration Profiles
    ====================================================== */

    createProfile(
        name,
        configuration = {}
    ) {

        if (
            !this.profiles
        ) {

            this.profiles =
                new Map();

        }

        this.profiles.set(
            name,
            {
                ...configuration
            }
        );

        return this;

    }

    applyProfile(
        name
    ) {

        if (
            !this.profiles ||
            !this.profiles.has(name)
        ) {

            return false;

        }

        const profile =
            this.profiles.get(
                name
            );

        this.configure(
            profile
        );

        return true;

    }

    removeProfile(
        name
    ) {

        if (
            !this.profiles
        ) {

            return false;

        }

        return this.profiles.delete(
            name
        );

    }

    listProfiles() {

        if (
            !this.profiles
        ) {

            return [];

        }

        return Array.from(
            this.profiles.keys()
        );

    }

    /* ======================================================
       Router Snapshot History
    ====================================================== */

    enableSnapshots(
        enabled = true
    ) {

        this.snapshotsEnabled =
            Boolean(enabled);

        if (
            this.snapshotsEnabled &&
            !this.snapshots
        ) {

            this.snapshots =
                [];

        }

        return this;

    }

    saveSnapshot(
        label = "default"
    ) {

        if (
            !this.snapshotsEnabled
        ) {

            return null;

        }

        const snapshot = {

            label,

            data:
                this.createSnapshot(),

            created:
                Date.now()

        };

        this.snapshots.push(
            snapshot
        );

        return snapshot;

    }

    getSnapshots() {

        return [
            ...(this.snapshots || [])
        ];

    }

    restoreSnapshotByLabel(
        label
    ) {

        if (
            !this.snapshots
        ) {

            return false;

        }

        const snapshot =
            this.snapshots.find(
                item =>
                    item.label === label
            );

        if (
            !snapshot
        ) {

            return false;

        }

        return this.restoreSnapshot(
            snapshot.data
        );

    }
        /* ======================================================
       Router Analytics Collector
    ====================================================== */

    enableAnalytics(
        enabled = true
    ) {

        this.analyticsEnabled =
            Boolean(enabled);

        if (
            this.analyticsEnabled &&
            !this.analytics
        ) {

            this.analytics =
                [];

        }

        return this;

    }

    track(
        event,
        data = {}
    ) {

        if (
            !this.analyticsEnabled
        ) {

            return false;

        }

        const record = {

            event,

            data,

            timestamp:
                Date.now()

        };

        this.analytics.push(
            record
        );

        this.emit(
            "analytics",
            record
        );

        return true;

    }

    getAnalytics() {

        return [
            ...(this.analytics || [])
        ];

    }

    clearAnalytics() {

        if (
            this.analytics
        ) {

            this.analytics.length = 0;

        }

        return this;

    }

    /* ======================================================
       Router Request History
    ====================================================== */

    enableRequestHistory(
        enabled = true
    ) {

        this.requestHistoryEnabled =
            Boolean(enabled);

        if (
            this.requestHistoryEnabled &&
            !this.requestHistory
        ) {

            this.requestHistory =
                [];

        }

        return this;

    }

    recordRequest(
        request
    ) {

        if (
            !this.requestHistoryEnabled
        ) {

            return;

        }

        this.requestHistory.push({

            ...request,

            timestamp:
                Date.now()

        });

    }

    getRequestHistory() {

        return [
            ...(this.requestHistory || [])
        ];

    }

    clearRequestHistory() {

        if (
            this.requestHistory
        ) {

            this.requestHistory.length = 0;

        }

        return this;

    }

    /* ======================================================
       Router Maintenance Mode
    ====================================================== */

    maintenance(
        enabled = true,
        message = "Service unavailable."
    ) {

        this.maintenanceMode =
            Boolean(enabled);

        this.maintenanceMessage =
            message;

        return this;

    }

    isMaintenanceMode() {

        return Boolean(
            this.maintenanceMode
        );

    }

    getMaintenanceMessage() {

        return (
            this.maintenanceMessage ||
            null
        );

    }

    /* ======================================================
       Router Access Policy
    ====================================================== */

    setPolicy(
        name,
        handler
    ) {

        this._assertFunction(
            handler
        );

        if (
            !this.policies
        ) {

            this.policies =
                new Map();

        }

        this.policies.set(
            name,
            handler
        );

        return this;

    }

    async checkPolicy(
        name,
        context
    ) {

        if (
            !this.policies ||
            !this.policies.has(name)
        ) {

            return true;

        }

        const policy =
            this.policies.get(
                name
            );

        return await policy(
            context
        );

    }

    removePolicy(
        name
    ) {

        if (
            !this.policies
        ) {

            return false;

        }

        return this.policies.delete(
            name
        );

    }
        /* ======================================================
       Router Access Control Groups
    ====================================================== */

    createAccessGroup(
        name,
        rules = {}
    ) {

        if (
            !this.accessGroups
        ) {

            this.accessGroups =
                new Map();

        }

        this.accessGroups.set(
            name,
            {
                ...rules
            }
        );

        return this;

    }

    getAccessGroup(
        name
    ) {

        if (
            !this.accessGroups
        ) {

            return null;

        }

        return (
            this.accessGroups.get(
                name
            ) || null
        );

    }

    removeAccessGroup(
        name
    ) {

        if (
            !this.accessGroups
        ) {

            return false;

        }

        return this.accessGroups.delete(
            name
        );

    }

    listAccessGroups() {

        if (
            !this.accessGroups
        ) {

            return [];

        }

        return Array.from(
            this.accessGroups.keys()
        );

    }

    /* ======================================================
       Router Command Middleware
    ====================================================== */

    addCommandMiddleware(
        middleware
    ) {

        this._assertFunction(
            middleware
        );

        if (
            !this.commandMiddlewares
        ) {

            this.commandMiddlewares =
                [];

        }

        this.commandMiddlewares.push(
            middleware
        );

        return this;

    }

    async executeCommandWithMiddleware(
        name,
        payload = {}
    ) {

        let context = {

            name,

            payload,

            router:
                this

        };

        if (
            this.commandMiddlewares
        ) {

            for (
                const middleware of this.commandMiddlewares
            ) {

                context =
                    await middleware(
                        context
                    );

                if (
                    context === false
                ) {

                    return false;

                }

            }

        }

        return await this.executeCommand(
            name,
            context.payload
        );

    }

    removeCommandMiddleware(
        middleware
    ) {

        if (
            !this.commandMiddlewares
        ) {

            return false;

        }

        const index =
            this.commandMiddlewares.indexOf(
                middleware
            );

        if (
            index === -1
        ) {

            return false;

        }

        this.commandMiddlewares.splice(
            index,
            1
        );

        return true;

    }

    /* ======================================================
       Router Dynamic Configuration
    ====================================================== */

    setConfig(
        key,
        value
    ) {

        if (
            !this.dynamicConfig
        ) {

            this.dynamicConfig =
                {};

        }

        this.dynamicConfig[key] =
            value;

        return this;

    }

    getConfig(
        key,
        fallback = null
    ) {

        if (
            !this.dynamicConfig
        ) {

            return fallback;

        }

        return Object.prototype.hasOwnProperty.call(
            this.dynamicConfig,
            key
        )
            ? this.dynamicConfig[key]
            : fallback;

    }

    removeConfig(
        key
    ) {

        if (
            !this.dynamicConfig
        ) {

            return false;

        }

        delete this.dynamicConfig[key];

        return true;

    }

    clearConfig() {

        this.dynamicConfig =
            {};

        return this;

    }

    /* ======================================================
       Router Runtime Events
    ====================================================== */

    startListening() {

        this.listening =
            true;

        this.emit(
            "listener:start",
            {
                timestamp:
                    Date.now()
            }
        );

        return this;

    }

    stopListening() {

        this.listening =
            false;

        this.emit(
            "listener:stop",
            {
                timestamp:
                    Date.now()
            }
        );

        return this;

    }

    isListening() {

        return Boolean(
            this.listening
        );

    }
        /* ======================================================
       Router Observer System
    ====================================================== */

    observe(
        event,
        callback
    ) {

        this._assertFunction(
            callback
        );

        if (
            !this.observers
        ) {

            this.observers =
                new Map();

        }

        if (
            !this.observers.has(event)
        ) {

            this.observers.set(
                event,
                []
            );

        }

        this.observers
            .get(event)
            .push(
                callback
            );

        return this;

    }

    notifyObservers(
        event,
        payload = {}
    ) {

        if (
            !this.observers ||
            !this.observers.has(event)
        ) {

            return this;

        }

        for (
            const observer of this.observers.get(event)
        ) {

            observer(
                payload
            );

        }

        return this;

    }

    removeObserver(
        event,
        callback
    ) {

        if (
            !this.observers ||
            !this.observers.has(event)
        ) {

            return false;

        }

        const list =
            this.observers.get(
                event
            );

        const index =
            list.indexOf(
                callback
            );

        if (
            index === -1
        ) {

            return false;

        }

        list.splice(
            index,
            1
        );

        return true;

    }

    clearObservers() {

        if (
            this.observers
        ) {

            this.observers.clear();

        }

        return this;

    }

    /* ======================================================
       Router Runtime Hooks
    ====================================================== */

    hook(
        name,
        callback
    ) {

        this._assertFunction(
            callback
        );

        if (
            !this.hooks
        ) {

            this.hooks =
                new Map();

        }

        if (
            !this.hooks.has(name)
        ) {

            this.hooks.set(
                name,
                []
            );

        }

        this.hooks
            .get(name)
            .push(
                callback
            );

        return this;

    }

    async runHook(
        name,
        payload = {}
    ) {

        if (
            !this.hooks ||
            !this.hooks.has(name)
        ) {

            return true;

        }

        for (
            const callback of this.hooks.get(name)
        ) {

            const result =
                await callback(
                    payload
                );

            if (
                result === false
            ) {

                return false;

            }

        }

        return true;

    }

    removeHook(
        name,
        callback
    ) {

        if (
            !this.hooks ||
            !this.hooks.has(name)
        ) {

            return false;

        }

        const list =
            this.hooks.get(
                name
            );

        const index =
            list.indexOf(
                callback
            );

        if (
            index === -1
        ) {

            return false;

        }

        list.splice(
            index,
            1
        );

        return true;

    }

    /* ======================================================
       Router Final Diagnostics
    ====================================================== */

    summary() {

        return {

            routes:
                this.routes.length,

            current:
                this.current,

            previous:
                this.previous,

            version:
                this.getVersion(),

            features:
                this.listFeatures(),

            plugins:
                this.plugins(),

            profiles:
                this.listProfiles(),

            timestamp:
                Date.now()

        };

    }

    destroy() {

        this.stop();

        this.cleanup();

        this.clearTasks();

        this.clearObservers();

        this.disableAutoBackup();

        this.clearGlobals();

        this.clearEnvironment();

        return true;

    }
        /* ======================================================
       Router Final Utility Layer
    ====================================================== */

    inspect(
        target = null
    ) {

        return {

            target,

            router:
                this,

            state:
                {
                    current:
                        this.current,

                    previous:
                        this.previous,

                    routes:
                        this.routes.length
                },

            generated:
                Date.now()

        };

    }

    clone(
        value
    ) {

        if (
            value === null ||
            typeof value !== "object"
        ) {

            return value;

        }

        return JSON.parse(
            JSON.stringify(
                value
            )
        );

    }

    compare(
        first,
        second
    ) {

        return JSON.stringify(
            first
        ) === JSON.stringify(
            second
        );

    }

    /* ======================================================
       Router Import Export Helpers
    ====================================================== */

    serialize() {

        return JSON.stringify(
            this.exportConfiguration()
        );

    }

    deserialize(
        payload
    ) {

        if (
            typeof payload !== "string"
        ) {

            return false;

        }

        try {

            const data =
                JSON.parse(
                    payload
                );

            return this.importConfiguration(
                data
            );

        } catch {

            return false;

        }

    }

    /* ======================================================
       Router Debug Utilities
    ====================================================== */

    debug(
        enabled = true
    ) {

        this.debugMode =
            Boolean(enabled);

        return this;

    }

    isDebug() {

        return Boolean(
            this.debugMode
        );

    }

    log(
        ...args
    ) {

        if (
            !this.debugMode
        ) {

            return;

        }

        if (
            typeof console !== "undefined"
        ) {

            console.log(
                "[Router]",
                ...args
            );

        }

    }

    warn(
        ...args
    ) {

        if (
            typeof console !== "undefined"
        ) {

            console.warn(
                "[Router]",
                ...args
            );

        }

    }

    error(
        ...args
    ) {

        if (
            typeof console !== "undefined"
        ) {

            console.error(
                "[Router]",
                ...args
            );

        }

    }

    /* ======================================================
       Router Compatibility Layer
    ====================================================== */

    supports(
        feature
    ) {

        const available = [

            "middleware",

            "guards",

            "events",

            "plugins",

            "cache",

            "history"

        ];

        return available.includes(
            feature
        );

    }

    capabilities() {

        return [

            "routes",

            "navigation",

            "middleware",

            "events",

            "plugins",

            "sessions",

            "analytics",

            "security",

            "persistence"

        ];

    }

    /* ======================================================
       Router Final Reset
    ====================================================== */

    reset() {

        this.current =
            null;

        this.previous =
            null;

        this.navigating =
            false;

        this.cancelled =
            false;

        this.clearCache();

        this.clearNavigationState();

        return this;

    }
        /* ======================================================
       Router Final Validation
    ====================================================== */

    finalize() {

        const validation =
            this.validateAllRoutes();

        if (
            !validation.valid
        ) {

            return {

                success:
                    false,

                errors:
                    validation.invalid

            };

        }

        this.lock();

        return {

            success:
                true,

            routes:
                this.routes.length,

            timestamp:
                Date.now()

        };

    }

    /* ======================================================
       Router Ready State
    ====================================================== */

    isReady() {

        return Boolean(
            this.started &&
            !this.locked
        );

    }

    /* ======================================================
       Router Shutdown Handler
    ====================================================== */

    shutdown() {

        this.stop();

        this.destroy();

        this.started =
            false;

        this.listening =
            false;

        return true;

    }

    /* ======================================================
       Router Version Information
    ====================================================== */

    versionInfo() {

        return {

            name:
                "PowerTools Router",

            version:
                this.versionName || "1.0.0",

            routes:
                this.routes.length,

            generated:
                Date.now()

        };

    }

}

/* ======================================================
   Router Export
====================================================== */

export default Router;
