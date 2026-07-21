/* ============================================================
   PowerTools AI Creator Suite
   app.js
   Version : 1.0.0
   Part    : 1
============================================================ */

"use strict";

/* ============================================================
   GLOBAL NAMESPACE
============================================================ */

window.PowerTools = window.PowerTools || {};

const PowerTools = window.PowerTools;


/* ============================================================
   APPLICATION INFO
============================================================ */

PowerTools.info = {

    name: "PowerTools AI Creator Suite",

    version: "1.0.0",

    author: "PowerTools",

    build: "Stable"

};


/* ============================================================
   CONFIGURATION
============================================================ */

PowerTools.config = {

    debug: true,

    animation: true,

    autoSave: true,

    autoSaveInterval: 30000,

    notificationDuration: 3500,

    maxHistory: 100,

    theme: "dark"

};


/* ============================================================
   APPLICATION STATE
============================================================ */

PowerTools.state = {

    initialized: false,

    loading: false,

    currentPage: "dashboard",

    sidebarCollapsed: false,

    modalOpened: false,

    activeProject: null,

    currentTemplate: null,

    unsavedChanges: false

};


/* ============================================================
   MEMORY CACHE
============================================================ */

PowerTools.cache = {

    prompts: [],

    templates: [],

    history: [],

    notifications: [],

    generators: {},

    images: [],

    videos: [],

    characters: [],

    products: [],

    storyboards: []

};


/* ============================================================
   DOM REFERENCES
============================================================ */

PowerTools.dom = {};


/* ============================================================
   UTILITIES
============================================================ */

PowerTools.utils = {};


/* ============================================================
   UUID
============================================================ */

PowerTools.utils.uuid = function () {

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

        .replace(/[xy]/g, function (c) {

            const r = Math.random() * 16 | 0;

            const v = c === "x"

                ? r

                : (r & 0x3 | 0x8);

            return v.toString(16);

        });

};


/* ============================================================
   RANDOM INTEGER
============================================================ */

PowerTools.utils.random = function (min, max) {

    return Math.floor(

        Math.random() * (max - min + 1)

    ) + min;

};


/* ============================================================
   CLAMP
============================================================ */

PowerTools.utils.clamp = function (value, min, max) {

    return Math.min(

        Math.max(value, min),

        max

    );

};


/* ============================================================
   DELAY
============================================================ */

PowerTools.utils.delay = function (ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

};


/* ============================================================
   DEBOUNCE
============================================================ */

PowerTools.utils.debounce = function (callback, wait = 250) {

    let timeout;

    return function (...args) {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            callback.apply(this, args);

        }, wait);

    };

};


/* ============================================================
   THROTTLE
============================================================ */

PowerTools.utils.throttle = function (callback, delay = 200) {

    let last = 0;

    return function (...args) {

        const now = Date.now();

        if (now - last >= delay) {

            last = now;

            callback.apply(this, args);

        }

    };

};


/* ============================================================
   QUERY SELECTOR
============================================================ */

PowerTools.utils.$ = function (selector) {

    return document.querySelector(selector);

};

PowerTools.utils.$$ = function (selector) {

    return [...document.querySelectorAll(selector)];

};


/* ============================================================
   EVENT BUS
============================================================ */

PowerTools.events = {

    listeners: {}

};


/* ============================================================
   SUBSCRIBE
============================================================ */

PowerTools.events.on = function (event, callback) {

    if (!this.listeners[event]) {

        this.listeners[event] = [];

    }

    this.listeners[event].push(callback);

};


/* ============================================================
   EMIT
============================================================ */

PowerTools.events.emit = function (event, payload = {}) {

    if (!this.listeners[event]) return;

    this.listeners[event].forEach(fn => {

        fn(payload);

    });

};


/* ============================================================
   REMOVE EVENT
============================================================ */

PowerTools.events.off = function (event, callback) {

    if (!this.listeners[event]) return;

    this.listeners[event] =

        this.listeners[event]

            .filter(fn => fn !== callback);

};


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        PowerTools.bootstrap();

    }

);


/* ============================================================
   BOOTSTRAP
============================================================ */

PowerTools.bootstrap = function () {

    console.log(

        "%c========================================",

        "color:#06b6d4"

    );

    console.log(

        "%c PowerTools AI Creator Suite ",

        "color:#22c55e;font-size:16px;font-weight:bold"

    );

    console.log(

        "%c Version " + PowerTools.info.version,

        "color:#38bdf8"

    );

    console.log(

        "%c Initializing...",

        "color:#f59e0b"

    );

    PowerTools.state.initialized = true;

    PowerTools.events.emit("app:ready");

};

/* ============================================================
   CORE MANAGER
============================================================ */

PowerTools.core = {

    version: "1.0.0",

    modules: {},

    services: {},

    startupQueue: [],

    shutdownQueue: [],

    initializedModules: [],

    failedModules: [],

    started: false

};


/* ============================================================
   MODULE REGISTRY
============================================================ */

PowerTools.core.registerModule = function (name, module) {

    if (!name) {

        console.warn("Module name is required.");

        return false;

    }

    if (this.modules[name]) {

        console.warn(`Module '${name}' already exists.`);

        return false;

    }

    this.modules[name] = {

        name,

        instance: module,

        initialized: false,

        enabled: true,

        created: Date.now()

    };

    if (PowerTools.config.debug) {

        console.log(

            `%c[Module Registered] ${name}`,

            "color:#22c55e"

        );

    }

    return true;

};


/* ============================================================
   GET MODULE
============================================================ */

PowerTools.core.getModule = function (name) {

    return this.modules[name]

        ? this.modules[name].instance

        : null;

};


/* ============================================================
   HAS MODULE
============================================================ */

PowerTools.core.hasModule = function (name) {

    return !!this.modules[name];

};


/* ============================================================
   ENABLE MODULE
============================================================ */

PowerTools.core.enableModule = function (name) {

    if (!this.modules[name]) return;

    this.modules[name].enabled = true;

};


/* ============================================================
   DISABLE MODULE
============================================================ */

PowerTools.core.disableModule = function (name) {

    if (!this.modules[name]) return;

    this.modules[name].enabled = false;

};


/* ============================================================
   REMOVE MODULE
============================================================ */

PowerTools.core.removeModule = function (name) {

    if (!this.modules[name]) return false;

    delete this.modules[name];

    return true;

};


/* ============================================================
   LIST MODULES
============================================================ */

PowerTools.core.listModules = function () {

    return Object.keys(this.modules);

};


/* ============================================================
   SERVICE REGISTRY
============================================================ */

PowerTools.core.registerService = function (name, service) {

    if (!name) return false;

    this.services[name] = service;

    if (PowerTools.config.debug) {

        console.log(

            `%c[Service Registered] ${name}`,

            "color:#38bdf8"

        );

    }

    return true;

};


/* ============================================================
   GET SERVICE
============================================================ */

PowerTools.core.getService = function (name) {

    return this.services[name] || null;

};


/* ============================================================
   HAS SERVICE
============================================================ */

PowerTools.core.hasService = function (name) {

    return !!this.services[name];

};


/* ============================================================
   REMOVE SERVICE
============================================================ */

PowerTools.core.removeService = function (name) {

    delete this.services[name];

};


/* ============================================================
   STARTUP QUEUE
============================================================ */

PowerTools.core.addStartupTask = function (task) {

    if (typeof task !== "function") return;

    this.startupQueue.push(task);

};


/* ============================================================
   SHUTDOWN QUEUE
============================================================ */

PowerTools.core.addShutdownTask = function (task) {

    if (typeof task !== "function") return;

    this.shutdownQueue.push(task);

};

/* ============================================================
   STARTUP EXECUTOR
============================================================ */

PowerTools.core.runStartupQueue = async function () {

    if (PowerTools.config.debug) {

        console.log(

            "%cRunning Startup Queue...",

            "color:#f59e0b"

        );

    }

    for (const task of this.startupQueue) {

        try {

            await task();

        }

        catch (error) {

            console.error(

                "[Startup Queue]",

                error

            );

        }

    }

};


/* ============================================================
   SHUTDOWN EXECUTOR
============================================================ */

PowerTools.core.runShutdownQueue = async function () {

    for (const task of this.shutdownQueue) {

        try {

            await task();

        }

        catch (error) {

            console.error(

                "[Shutdown Queue]",

                error

            );

        }

    }

};


/* ============================================================
   INITIALIZE MODULE
============================================================ */

PowerTools.core.initializeModule = async function (name) {

    const module = this.modules[name];

    if (!module) return false;

    if (!module.enabled) return false;

    if (module.initialized) return true;

    try {

        if (

            module.instance &&

            typeof module.instance.init === "function"

        ) {

            await module.instance.init();

        }

        module.initialized = true;

        this.initializedModules.push(name);

        if (PowerTools.config.debug) {

            console.log(

                `%c✔ Module Initialized : ${name}`,

                "color:#22c55e"

            );

        }

        return true;

    }

    catch (error) {

        console.error(

            `[Module Error] ${name}`,

            error

        );

        this.failedModules.push({

            module: name,

            error,

            time: Date.now()

        });

        return false;

    }

};


/* ============================================================
   INITIALIZE ALL MODULES
============================================================ */

PowerTools.core.initializeAllModules = async function () {

    const names = Object.keys(this.modules);

    for (const name of names) {

        await this.initializeModule(name);

    }

};


/* ============================================================
   SAFE EXECUTE
============================================================ */

PowerTools.core.safeExecute = async function (

    callback,

    fallback = null

) {

    try {

        return await callback();

    }

    catch (error) {

        console.error(error);

        if (

            typeof fallback === "function"

        ) {

            return fallback(error);

        }

        return null;

    }

};


/* ============================================================
   PERFORMANCE TIMER
============================================================ */

PowerTools.core.timer = {

    records: {}

};


PowerTools.core.timer.start = function (label) {

    this.records[label] = performance.now();

};


PowerTools.core.timer.stop = function (label) {

    if (!(label in this.records)) return 0;

    const elapsed =

        performance.now()

        -

        this.records[label];

    delete this.records[label];

    return elapsed;

};


PowerTools.core.timer.log = function (label) {

    const time = this.stop(label);

    console.log(

        `%c${label} : ${time.toFixed(2)} ms`,

        "color:#0ea5e9"

    );

};


/* ============================================================
   LOGGER
============================================================ */

PowerTools.logger = {

    enabled: true,

    history: []

};


PowerTools.logger.write = function (

    type,

    message,

    data = null

) {

    const entry = {

        id: PowerTools.utils.uuid(),

        type,

        message,

        data,

        time: new Date()

    };

    this.history.push(entry);

    if (

        this.history.length >

        PowerTools.config.maxHistory

    ) {

        this.history.shift();

    }

};


PowerTools.logger.info = function (

    message,

    data = null

) {

    this.write(

        "info",

        message,

        data

    );

    if (this.enabled)

        console.log(message, data);

};


PowerTools.logger.warn = function (

    message,

    data = null

) {

    this.write(

        "warning",

        message,

        data

    );

    if (this.enabled)

        console.warn(message, data);

};


PowerTools.logger.error = function (

    message,

    data = null

) {

    this.write(

        "error",

        message,

        data

    );

    if (this.enabled)

        console.error(message, data);

};


/* ============================================================
   GLOBAL ERROR HANDLER
============================================================ */

window.addEventListener(

    "error",

    function (event) {

        PowerTools.logger.error(

            event.message,

            event.error

        );

    }

);


window.addEventListener(

    "unhandledrejection",

    function (event) {

        PowerTools.logger.error(

            "Unhandled Promise",

            event.reason

        );

    }

);

/* ============================================================
   DOM CACHE MANAGER
============================================================ */

PowerTools.domCache = {

    elements: new Map(),

    initialized: false

};


/* ============================================================
   REGISTER ELEMENT
============================================================ */

PowerTools.domCache.register = function (

    key,

    selector

) {

    if (!key || !selector) return null;

    const element = document.querySelector(selector);

    if (element) {

        this.elements.set(key, element);

    }

    return element;

};


/* ============================================================
   REGISTER MULTIPLE
============================================================ */

PowerTools.domCache.registerMany = function (

    list = {}

) {

    Object.entries(list).forEach(

        ([key, selector]) => {

            this.register(

                key,

                selector

            );

        }

    );

};


/* ============================================================
   GET ELEMENT
============================================================ */

PowerTools.domCache.get = function (

    key

) {

    if (

        this.elements.has(key)

    ) {

        return this.elements.get(key);

    }

    return null;

};


/* ============================================================
   HAS ELEMENT
============================================================ */

PowerTools.domCache.has = function (

    key

) {

    return this.elements.has(key);

};


/* ============================================================
   REMOVE ELEMENT
============================================================ */

PowerTools.domCache.remove = function (

    key

) {

    this.elements.delete(key);

};


/* ============================================================
   CLEAR CACHE
============================================================ */

PowerTools.domCache.clear = function () {

    this.elements.clear();

};


/* ============================================================
   SCAN DATA-REF
============================================================ */

PowerTools.domCache.scan = function () {

    document

        .querySelectorAll("[data-ref]")

        .forEach(element => {

            const key =

                element.dataset.ref;

            this.elements.set(

                key,

                element

            );

        });

    this.initialized = true;

};


/* ============================================================
   STORAGE MANAGER
============================================================ */

PowerTools.storage = {

    prefix: "powertools_"

};


/* ============================================================
   BUILD KEY
============================================================ */

PowerTools.storage.key = function (

    name

) {

    return this.prefix + name;

};


/* ============================================================
   SAVE
============================================================ */

PowerTools.storage.save = function (

    key,

    value

) {

    try {

        localStorage.setItem(

            this.key(key),

            JSON.stringify(value)

        );

        return true;

    }

    catch (error) {

        console.error(error);

        return false;

    }

};


/* ============================================================
   LOAD
============================================================ */

PowerTools.storage.load = function (

    key,

    fallback = null

) {

    try {

        const data = localStorage.getItem(

            this.key(key)

        );

        if (!data) return fallback;

        return JSON.parse(data);

    }

    catch (error) {

        console.error(error);

        return fallback;

    }

};


/* ============================================================
   REMOVE
============================================================ */

PowerTools.storage.remove = function (

    key

) {

    localStorage.removeItem(

        this.key(key)

    );

};


/* ============================================================
   EXISTS
============================================================ */

PowerTools.storage.exists = function (

    key

) {

    return (

        localStorage.getItem(

            this.key(key)

        ) !== null

    );

};


/* ============================================================
   CLEAR APP STORAGE
============================================================ */

PowerTools.storage.clear = function () {

    Object.keys(localStorage)

        .forEach(key => {

            if (

                key.startsWith(

                    this.prefix

                )

            ) {

                localStorage.removeItem(

                    key

                );

            }

        });

};


/* ============================================================
   EXPORT STORAGE
============================================================ */

PowerTools.storage.export = function () {

    const result = {};

    Object.keys(localStorage)

        .forEach(key => {

            if (

                key.startsWith(

                    this.prefix

                )

            ) {

                result[key] =

                    localStorage.getItem(

                        key

                    );

            }

        });

    return result;

};


/* ============================================================
   IMPORT STORAGE
============================================================ */

PowerTools.storage.import = function (

    data = {}

) {

    Object.entries(data)

        .forEach(

            ([key, value]) => {

                localStorage.setItem(

                    key,

                    value

                );

            }

        );

};

/* ============================================================
   SESSION STORAGE MANAGER
============================================================ */

PowerTools.session = {

    prefix: "powertools_session_"

};


/* ============================================================
   SESSION KEY
============================================================ */

PowerTools.session.key = function (name) {

    return this.prefix + name;

};


/* ============================================================
   SESSION SAVE
============================================================ */

PowerTools.session.save = function (key, value) {

    try {

        sessionStorage.setItem(

            this.key(key),

            JSON.stringify(value)

        );

        return true;

    }

    catch (error) {

        console.error(error);

        return false;

    }

};


/* ============================================================
   SESSION LOAD
============================================================ */

PowerTools.session.load = function (

    key,

    fallback = null

) {

    try {

        const data = sessionStorage.getItem(

            this.key(key)

        );

        if (!data) return fallback;

        return JSON.parse(data);

    }

    catch (error) {

        console.error(error);

        return fallback;

    }

};


/* ============================================================
   SESSION REMOVE
============================================================ */

PowerTools.session.remove = function (key) {

    sessionStorage.removeItem(

        this.key(key)

    );

};


/* ============================================================
   SESSION CLEAR
============================================================ */

PowerTools.session.clear = function () {

    Object.keys(sessionStorage)

        .forEach(key => {

            if (

                key.startsWith(

                    this.prefix

                )

            ) {

                sessionStorage.removeItem(key);

            }

        });

};



/* ============================================================
   SETTINGS MANAGER
============================================================ */

PowerTools.settings = {

    data: {

        theme: "dark",

        language: "id",

        animations: true,

        autoSave: true,

        autoSaveInterval: 30000,

        compactMode: false,

        sidebarCollapsed: false

    }

};


/* ============================================================
   LOAD SETTINGS
============================================================ */

PowerTools.settings.load = function () {

    const saved =

        PowerTools.storage.load(

            "settings",

            {}

        );

    this.data = {

        ...this.data,

        ...saved

    };

};


/* ============================================================
   SAVE SETTINGS
============================================================ */

PowerTools.settings.save = function () {

    PowerTools.storage.save(

        "settings",

        this.data

    );

};


/* ============================================================
   GET SETTING
============================================================ */

PowerTools.settings.get = function (key) {

    return this.data[key];

};


/* ============================================================
   SET SETTING
============================================================ */

PowerTools.settings.set = function (

    key,

    value

) {

    this.data[key] = value;

    this.save();

};


/* ============================================================
   RESET SETTINGS
============================================================ */

PowerTools.settings.reset = function () {

    this.data = {

        theme: "dark",

        language: "id",

        animations: true,

        autoSave: true,

        autoSaveInterval: 30000,

        compactMode: false,

        sidebarCollapsed: false

    };

    this.save();

};



/* ============================================================
   THEME MANAGER
============================================================ */

PowerTools.theme = {};



/* ============================================================
   APPLY THEME
============================================================ */

PowerTools.theme.apply = function (

    theme = "dark"

) {

    document.documentElement

        .setAttribute(

            "data-theme",

            theme

        );

    PowerTools.settings.set(

        "theme",

        theme

    );

};


/* ============================================================
   TOGGLE THEME
============================================================ */

PowerTools.theme.toggle = function () {

    const current =

        PowerTools.settings.get(

            "theme"

        );

    const next =

        current === "dark"

            ? "light"

            : "dark";

    this.apply(next);

};


/* ============================================================
   LOAD SAVED THEME
============================================================ */

PowerTools.theme.load = function () {

    this.apply(

        PowerTools.settings.get(

            "theme"

        )

    );

};



/* ============================================================
   AUTO SAVE MANAGER
============================================================ */

PowerTools.autoSave = {

    timer: null

};


/* ============================================================
   START AUTO SAVE
============================================================ */

PowerTools.autoSave.start = function () {

    if (

        this.timer

    ) {

        clearInterval(

            this.timer

        );

    }

    if (

        !PowerTools.settings.get(

            "autoSave"

        )

    ) {

        return;

    }

    this.timer = setInterval(

        () => {

            PowerTools.events.emit(

                "autosave"

            );

        },

        PowerTools.settings.get(

            "autoSaveInterval"

        )

    );

};


/* ============================================================
   STOP AUTO SAVE
============================================================ */

PowerTools.autoSave.stop = function () {

    clearInterval(

        this.timer

    );

};

/* ============================================================
   CONFIG MANAGER
============================================================ */

PowerTools.configManager = {

    loaded: false

};


/* ============================================================
   LOAD CONFIG
============================================================ */

PowerTools.configManager.load = function () {

    const savedConfig = PowerTools.storage.load(

        "config",

        {}

    );

    PowerTools.config = {

        ...PowerTools.config,

        ...savedConfig

    };

    this.loaded = true;

};


/* ============================================================
   SAVE CONFIG
============================================================ */

PowerTools.configManager.save = function () {

    PowerTools.storage.save(

        "config",

        PowerTools.config

    );

};


/* ============================================================
   RESET CONFIG
============================================================ */

PowerTools.configManager.reset = function () {

    PowerTools.storage.remove("config");

};



/* ============================================================
   STATE MANAGER
============================================================ */

PowerTools.stateManager = {};



/* ============================================================
   GET STATE
============================================================ */

PowerTools.stateManager.get = function (key) {

    return PowerTools.state[key];

};



/* ============================================================
   SET STATE
============================================================ */

PowerTools.stateManager.set = function (

    key,

    value

) {

    const previous = PowerTools.state[key];

    PowerTools.state[key] = value;

    PowerTools.events.emit(

        "state:change",

        {

            key,

            oldValue: previous,

            newValue: value

        }

    );

};



/* ============================================================
   UPDATE MULTIPLE STATE
============================================================ */

PowerTools.stateManager.update = function (

    values = {}

) {

    Object.entries(values).forEach(

        ([key, value]) => {

            this.set(

                key,

                value

            );

        }

    );

};



/* ============================================================
   READY CALLBACKS
============================================================ */

PowerTools.readyCallbacks = [];



PowerTools.ready = function (

    callback

) {

    if (

        typeof callback !== "function"

    ) return;

    PowerTools.readyCallbacks.push(

        callback

    );

};



/* ============================================================
   EXECUTE READY CALLBACKS
============================================================ */

PowerTools.executeReadyCallbacks = async function () {

    for (

        const callback

        of PowerTools.readyCallbacks

    ) {

        try {

            await callback();

        }

        catch (error) {

            console.error(

                error

            );

        }

    }

};



/* ============================================================
   APPLICATION START
============================================================ */

PowerTools.start = async function () {

    if (
        PowerTools.state.loading
    ) return;

    PowerTools.state.loading = true;

    PowerTools.logger.info(
        "Starting PowerTools..."
    );

    PowerTools.configManager.load();

    PowerTools.settings.load();

    PowerTools.theme.load();

    PowerTools.domCache.scan();

    await PowerTools.core.runStartupQueue();

    await PowerTools.core.initializeAllModules();

    await PowerTools.executeReadyCallbacks();

    PowerTools.autoSave.start();

    PowerTools.state.loading = false;

    PowerTools.state.initialized = true;

    PowerTools.events.emit(
        "application:started"
    );

};


/* ============================================================
   APPLICATION SHUTDOWN
============================================================ */

PowerTools.shutdown = async function () {

    PowerTools.logger.info(

        "Shutting down..."

    );

    PowerTools.autoSave.stop();

    await PowerTools.core.runShutdownQueue();

    PowerTools.configManager.save();

    PowerTools.settings.save();

    PowerTools.events.emit(

        "application:shutdown"

    );

};



/* ============================================================
   BEFORE UNLOAD
============================================================ */

window.addEventListener(

    "beforeunload",

    function () {

        PowerTools.shutdown();

    }

);



/* ============================================================
   CONNECT BOOTSTRAP
============================================================ */

PowerTools.events.on(

    "app:ready",

    async function () {

        await PowerTools.start();

    }

);

/* ============================================================
   UI CORE
============================================================ */

PowerTools.ui = {

    initialized: false,

    activePage: null,

    activeModal: null,

    activeDropdown: null,

    activeTab: null

};


/* ============================================================
   UI INIT
============================================================ */

PowerTools.ui.init = function () {

    if (this.initialized) return;

    this.cache();

    this.bindGlobalEvents();

    this.initialized = true;

};


/* ============================================================
   CACHE DOM
============================================================ */

PowerTools.ui.cache = function () {

    this.body = document.body;

    this.root = document.documentElement;

    this.main = document.querySelector("main");

    this.sidebar = document.querySelector(".sidebar");

    this.topbar = document.querySelector(".topbar");

};


/* ============================================================
   SHOW ELEMENT
============================================================ */

PowerTools.ui.show = function (target) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.hidden = false;

    element.style.display = "";

};


/* ============================================================
   HIDE ELEMENT
============================================================ */

PowerTools.ui.hide = function (target) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.hidden = true;

};


/* ============================================================
   TOGGLE ELEMENT
============================================================ */

PowerTools.ui.toggle = function (target) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.hidden

        ? this.show(element)

        : this.hide(element);

};


/* ============================================================
   ADD CLASS
============================================================ */

PowerTools.ui.addClass = function (

    target,

    className

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.classList.add(className);

};


/* ============================================================
   REMOVE CLASS
============================================================ */

PowerTools.ui.removeClass = function (

    target,

    className

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.classList.remove(className);

};


/* ============================================================
   TOGGLE CLASS
============================================================ */

PowerTools.ui.toggleClass = function (

    target,

    className

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.classList.toggle(className);

};


/* ============================================================
   SET HTML
============================================================ */

PowerTools.ui.html = function (

    target,

    html

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.innerHTML = html;

};


/* ============================================================
   SET TEXT
============================================================ */

PowerTools.ui.text = function (

    target,

    value

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.textContent = value;

};


/* ============================================================
   APPEND HTML
============================================================ */

PowerTools.ui.append = function (

    target,

    html

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.insertAdjacentHTML(

        "beforeend",

        html

    );

};


/* ============================================================
   EMPTY ELEMENT
============================================================ */

PowerTools.ui.clear = function (

    target

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.innerHTML = "";

};


/* ============================================================
   ENABLE ELEMENT
============================================================ */

PowerTools.ui.enable = function (

    target

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.disabled = false;

};


/* ============================================================
   DISABLE ELEMENT
============================================================ */

PowerTools.ui.disable = function (

    target

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.disabled = true;

};

/* ============================================================
   GLOBAL UI EVENTS
============================================================ */

PowerTools.ui.events = {

    initialized: false,

    delegatedEvents: []

};


/* ============================================================
   BIND GLOBAL EVENTS
============================================================ */

PowerTools.ui.bindGlobalEvents = function () {

    if (PowerTools.ui.events.initialized) {

        return;

    }

    document.addEventListener(

        "click",

        this.handleClick.bind(this)

    );

    document.addEventListener(

        "keydown",

        this.handleKeydown.bind(this)

    );

    window.addEventListener(

        "resize",

        PowerTools.utils.debounce(

            this.handleResize.bind(this),

            150

        )

    );

    document.addEventListener(

        "visibilitychange",

        this.handleVisibility.bind(this)

    );

    PowerTools.ui.events.initialized = true;

};


/* ============================================================
   CLICK HANDLER
============================================================ */

PowerTools.ui.handleClick = function (event) {

    const target = event.target;

    this.processDelegatedEvents(

        event,

        target

    );

};


/* ============================================================
   KEYBOARD HANDLER
============================================================ */

PowerTools.ui.handleKeydown = function (event) {

    PowerTools.events.emit(

        "keyboard",

        event

    );

};


/* ============================================================
   WINDOW RESIZE
============================================================ */

PowerTools.ui.handleResize = function () {

    PowerTools.events.emit(

        "window:resize",

        {

            width: window.innerWidth,

            height: window.innerHeight

        }

    );

};


/* ============================================================
   PAGE VISIBILITY
============================================================ */

PowerTools.ui.handleVisibility = function () {

    PowerTools.events.emit(

        document.hidden

            ? "page:hidden"

            : "page:visible"

    );

};


/* ============================================================
   REGISTER EVENT
============================================================ */

PowerTools.ui.on = function (

    selector,

    type,

    callback

) {

    PowerTools.ui.events.delegatedEvents.push({

        selector,

        type,

        callback

    });

};


/* ============================================================
   REMOVE EVENT
============================================================ */

PowerTools.ui.off = function (

    selector,

    type

) {

    PowerTools.ui.events.delegatedEvents =

        PowerTools.ui.events.delegatedEvents.filter(

            event =>

                !(

                    event.selector === selector &&

                    event.type === type

                )

        );

};


/* ============================================================
   PROCESS EVENTS
============================================================ */

PowerTools.ui.processDelegatedEvents = function (

    event,

    target

) {

    PowerTools.ui.events.delegatedEvents.forEach(

        item => {

            if (

                item.type !== event.type

            ) return;

            const matched =

                target.closest(

                    item.selector

                );

            if (!matched) return;

            item.callback(

                event,

                matched

            );

        }

    );

};


/* ============================================================
   WINDOW SIZE
============================================================ */

PowerTools.ui.window = {};

PowerTools.ui.window.width = function () {

    return window.innerWidth;

};

PowerTools.ui.window.height = function () {

    return window.innerHeight;

};


/* ============================================================
   RESPONSIVE
============================================================ */

PowerTools.ui.isMobile = function () {

    return window.innerWidth < 768;

};

PowerTools.ui.isTablet = function () {

    return (

        window.innerWidth >= 768 &&

        window.innerWidth < 1024

    );

};

PowerTools.ui.isDesktop = function () {

    return window.innerWidth >= 1024;

};


/* ============================================================
   FOCUS
============================================================ */

PowerTools.ui.focus = function (

    target

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    requestAnimationFrame(

        () => element.focus()

    );

};


/* ============================================================
   BLUR
============================================================ */

PowerTools.ui.blur = function (

    target

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.blur();

};


/* ============================================================
   SCROLL TO
============================================================ */

PowerTools.ui.scrollTo = function (

    target,

    behavior = "smooth"

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.scrollIntoView({

        behavior,

        block: "start"

    });

};


/* ============================================================
   SCROLL TOP
============================================================ */

PowerTools.ui.scrollTop = function (

    behavior = "smooth"

) {

    window.scrollTo({

        top: 0,

        behavior

    });

};

/* ============================================================
   UI ANIMATION ENGINE
============================================================ */

PowerTools.ui.animation = {

    duration: 250,

    easing: "ease"

};


/* ============================================================
   FADE IN
============================================================ */

PowerTools.ui.fadeIn = function (

    target,

    duration = this.animation.duration

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.style.opacity = 0;

    element.style.display = "";

    element.hidden = false;

    element.style.transition =

        `opacity ${duration}ms ${this.animation.easing}`;

    requestAnimationFrame(() => {

        element.style.opacity = 1;

    });

};


/* ============================================================
   FADE OUT
============================================================ */

PowerTools.ui.fadeOut = function (

    target,

    duration = this.animation.duration

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.style.transition =

        `opacity ${duration}ms ${this.animation.easing}`;

    element.style.opacity = 0;

    setTimeout(() => {

        element.hidden = true;

        element.style.display = "none";

    }, duration);

};


/* ============================================================
   SLIDE DOWN
============================================================ */

PowerTools.ui.slideDown = function (

    target,

    duration = 250

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.hidden = false;

    element.style.display = "";

    element.style.overflow = "hidden";

    element.style.maxHeight = "0px";

    element.style.transition =

        `max-height ${duration}ms ease`;

    requestAnimationFrame(() => {

        element.style.maxHeight =

            element.scrollHeight + "px";

    });

};


/* ============================================================
   SLIDE UP
============================================================ */

PowerTools.ui.slideUp = function (

    target,

    duration = 250

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.style.overflow = "hidden";

    element.style.maxHeight =

        element.scrollHeight + "px";

    requestAnimationFrame(() => {

        element.style.transition =

            `max-height ${duration}ms ease`;

        element.style.maxHeight = "0px";

    });

    setTimeout(() => {

        element.hidden = true;

        element.style.display = "none";

    }, duration);

};


/* ============================================================
   RIPPLE EFFECT
============================================================ */

PowerTools.ui.ripple = function (

    event

) {

    const button = event.currentTarget;

    if (!button) return;

    const circle = document.createElement("span");

    const diameter = Math.max(

        button.clientWidth,

        button.clientHeight

    );

    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();

    circle.style.width =

        circle.style.height =

        diameter + "px";

    circle.style.left =

        event.clientX -

        rect.left -

        radius +

        "px";

    circle.style.top =

        event.clientY -

        rect.top -

        radius +

        "px";

    circle.className = "pt-ripple";

    button.appendChild(circle);

    setTimeout(() => {

        circle.remove();

    }, 600);

};


/* ============================================================
   ENABLE RIPPLE
============================================================ */

PowerTools.ui.enableRipple = function (

    selector = ".btn"

) {

    document

        .querySelectorAll(selector)

        .forEach(button => {

            button.addEventListener(

                "click",

                PowerTools.ui.ripple

            );

        });

};


/* ============================================================
   CREATE ELEMENT
============================================================ */

PowerTools.ui.create = function (

    tag,

    options = {}

) {

    const element =

        document.createElement(tag);

    if (options.id)

        element.id = options.id;

    if (options.class)

        element.className =

            options.class;

    if (options.text)

        element.textContent =

            options.text;

    if (options.html)

        element.innerHTML =

            options.html;

    if (options.attributes) {

        Object.entries(

            options.attributes

        ).forEach(

            ([key, value]) => {

                element.setAttribute(

                    key,

                    value

                );

            }

        );

    }

    return element;

};


/* ============================================================
   REMOVE ELEMENT
============================================================ */

PowerTools.ui.remove = function (

    target

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (

        element &&

        element.parentNode

    ) {

        element.parentNode.removeChild(

            element

        );

    }

};


/* ============================================================
   EMPTY NODE
============================================================ */

PowerTools.ui.empty = function (

    target

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    while (

        element.firstChild

    ) {

        element.removeChild(

            element.firstChild

        );

    }

};


/* ============================================================
   PARSE HTML
============================================================ */

PowerTools.ui.parseHTML = function (

    html

) {

    const template =

        document.createElement(

            "template"

        );

    template.innerHTML =

        html.trim();

    return template.content.firstChild;

};


/* ============================================================
   APPEND NODE
============================================================ */

PowerTools.ui.appendNode = function (

    target,

    node

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.appendChild(node);

};


/* ============================================================
   PREPEND NODE
============================================================ */

PowerTools.ui.prependNode = function (

    target,

    node

) {

    const element =

        typeof target === "string"

            ? document.querySelector(target)

            : target;

    if (!element) return;

    element.prepend(node);

};

/* ============================================================
   LOADING MANAGER
============================================================ */

PowerTools.loading = {

    visible: false,

    message: "Loading...",

    overlay: null,

    spinner: null,

    text: null

};


/* ============================================================
   CREATE LOADING UI
============================================================ */

PowerTools.loading.create = function () {

    if (this.overlay) return;

    this.overlay = document.createElement("div");

    this.overlay.id = "pt-loading-overlay";

    this.overlay.className = "pt-loading-overlay hidden";

    this.overlay.innerHTML = `

        <div class="pt-loading-box">

            <div class="pt-loading-spinner"></div>

            <div class="pt-loading-text">

                Loading...

            </div>

        </div>

    `;

    document.body.appendChild(

        this.overlay

    );

    this.spinner =

        this.overlay.querySelector(

            ".pt-loading-spinner"

        );

    this.text =

        this.overlay.querySelector(

            ".pt-loading-text"

        );

};


/* ============================================================
   SHOW LOADING
============================================================ */

PowerTools.loading.show = function (

    message = "Loading..."

) {

    if (!this.overlay) {

        this.create();

    }

    this.message = message;

    this.text.textContent = message;

    this.overlay.classList.remove(

        "hidden"

    );

    this.overlay.classList.add(

        "visible"

    );

    document.body.classList.add(

        "pt-loading"

    );

    this.visible = true;

    PowerTools.events.emit(

        "loading:show",

        {

            message

        }

    );

};


/* ============================================================
   HIDE LOADING
============================================================ */

PowerTools.loading.hide = function () {

    if (!this.overlay) return;

    this.overlay.classList.remove(

        "visible"

    );

    this.overlay.classList.add(

        "hidden"

    );

    document.body.classList.remove(

        "pt-loading"

    );

    this.visible = false;

    PowerTools.events.emit(

        "loading:hide"

    );

};


/* ============================================================
   UPDATE MESSAGE
============================================================ */

PowerTools.loading.setMessage = function (

    message

) {

    this.message = message;

    if (this.text) {

        this.text.textContent = message;

    }

};


/* ============================================================
   TOGGLE
============================================================ */

PowerTools.loading.toggle = function (

    message = "Loading..."

) {

    if (this.visible) {

        this.hide();

    }

    else {

        this.show(message);

    }

};


/* ============================================================
   IS VISIBLE
============================================================ */

PowerTools.loading.isVisible = function () {

    return this.visible;

};


/* ============================================================
   LOCK UI
============================================================ */

PowerTools.loading.lock = function () {

    document.body.style.pointerEvents =

        "none";

};


/* ============================================================
   UNLOCK UI
============================================================ */

PowerTools.loading.unlock = function () {

    document.body.style.pointerEvents =

        "";

};


/* ============================================================
   SHOW + LOCK
============================================================ */

PowerTools.loading.open = function (

    message = "Loading..."

) {

    this.show(message);

    this.lock();

};


/* ============================================================
   HIDE + UNLOCK
============================================================ */

PowerTools.loading.close = function () {

    this.hide();

    this.unlock();

};


/* ============================================================
   AUTO CREATE
============================================================ */

PowerTools.ready(() => {

    PowerTools.loading.create();

});


