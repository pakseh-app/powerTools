/* ============================================================
   PowerTools AI Creator Suite
   APP.JS REBUILD V2
   PART 1
   CORE FOUNDATION
============================================================ */

"use strict";

/* ============================================================
   ROOT NAMESPACE
============================================================ */

const PowerTools = (() => {

    /* ========================================================
       INTERNAL OBJECT
    ======================================================== */

    const App = {};

    /* ========================================================
       APPLICATION INFO
    ======================================================== */

    App.info = {

        name: "PowerTools AI Creator Suite",

        version: "2.0.0",

        build: "REBUILD",

        author: "OpenAI"

    };

    /* ========================================================
       CONFIG
    ======================================================== */

    App.config = {

        debug: true,

        autosave: true,

        animation: true,

        theme: "dark",

        storagePrefix: "PowerTools.",

        toastDuration: 3000,

        notificationDuration: 5000,

        mobileBreakpoint: 992

    };

    /* ========================================================
       GLOBAL STATE
    ======================================================== */

    App.state = {

        initialized: false,

        booted: false,

        loading: false,

        currentPage: "dashboard",

        currentWorkspace: "default",

        currentTheme: "dark",

        currentModal: null,

        sidebarCollapsed: false,

        activeTool: null,

        searchKeyword: "",

        debug: true

    };

    /* ========================================================
       STORE
    ======================================================== */

    App.store = {

        modules: {},

        cache: {},

        settings: {},

        history: [],

        notifications: [],

        performance: {},

        shortcuts: {}

    };

    /* ========================================================
       DOM CACHE
    ======================================================== */

    App.dom = {};

    /* ========================================================
       COMPONENT REGISTRY
    ======================================================== */

    App.registry = {

        components: {},

        register(name, object) {

            this.components[name] = object;

        },

        get(name) {

            return this.components[name] || null;

        },

        exists(name) {

            return name in this.components;

        }

    };

    /* ========================================================
       UTILITIES
    ======================================================== */

    App.utils = {

        $(selector, root = document) {

            return root.querySelector(selector);

        },

        $$(selector, root = document) {

            return [...root.querySelectorAll(selector)];

        },

        id(id) {

            return document.getElementById(id);

        },

        create(tag) {

            return document.createElement(tag);

        },

        text(text) {

            return document.createTextNode(text);

        },

        random(min, max) {

            return Math.floor(

                Math.random() * (max - min + 1)

            ) + min;

        },

        uuid() {

            return (

                "PT-" +

                Date.now().toString(36) +

                "-" +

                Math.random()

                .toString(36)

                .substring(2, 10)

            );

        },

        clone(obj) {

            return structuredClone(obj);

        },

        delay(ms) {

            return new Promise(resolve => {

                setTimeout(resolve, ms);

            });

        },

        capitalize(text = "") {

            if (!text.length) return "";

            return text.charAt(0).toUpperCase()

                + text.slice(1);

        },

        now() {

            return performance.now();

        }

    };

    /* ========================================================
       LOGGER
    ======================================================== */

    App.log = {

        info(...msg) {

            console.log(

                "%cPowerTools",

                "background:#2563eb;color:#fff;padding:3px 8px;border-radius:4px",

                ...msg

            );

        },

        warn(...msg) {

            console.warn(

                "%cPowerTools",

                "background:#f59e0b;color:#000;padding:3px 8px;border-radius:4px",

                ...msg

            );

        },

        error(...msg) {

            console.error(

                "%cPowerTools",

                "background:#dc2626;color:#fff;padding:3px 8px;border-radius:4px",

                ...msg

            );

        }

    };

    /* ========================================================
       EVENT BUS
    ======================================================== */

    App.events = (() => {

        const listeners = new Map();

        return {

            on(event, callback) {

                if (!listeners.has(event)) {

                    listeners.set(event, []);

                }

                listeners.get(event).push(callback);

            },

            off(event, callback) {

                if (!listeners.has(event)) return;

                listeners.set(

                    event,

                    listeners

                    .get(event)

                    .filter(fn => fn !== callback)

                );

            },

            emit(event, payload = null) {

                if (!listeners.has(event)) return;

                listeners

                    .get(event)

                    .forEach(fn => {

                        try {

                            fn(payload);

                        }

                        catch (err) {

                            console.error(err);

                        }

                    });

            },

            clear() {

                listeners.clear();

            }

        };

    })();

    /* ========================================================
       PERFORMANCE TIMER
    ======================================================== */

    App.performance = {

        bootStart: performance.now(),

        bootEnd: 0,

        total: 0

    };

    /* ========================================================
       CONSOLE HEADER
    ======================================================== */

    console.clear();

    console.log(

        "%c==============================================",

        "color:#38bdf8"

    );

    console.log(

        "%cPowerTools AI Creator Suite",

        "background:#0f172a;color:#22c55e;font-size:16px;font-weight:bold;padding:8px"

    );

    console.log(

        "%cAPP.JS REBUILD V2 INITIALIZED",

        "color:#60a5fa;font-weight:bold"

    );

    console.log(

        "%cVersion : " + App.info.version,

        "color:#a3e635"

    );

    console.log(

        "%c==============================================",

        "color:#38bdf8"

    );

    return App;

})();

/* ============================================================
   EXPORT
============================================================ */

window.PowerTools = PowerTools;

/* ============================================================
   PART 2
   DOM MANAGER
   COMPONENT MANAGER
   MODULE LOADER
   BOOT SYSTEM
============================================================ */

/* ============================================================
   DOM MANAGER
============================================================ */

PowerTools.domManager = {

    selectors: {

        app: "#app",

        body: "body",

        sidebar: "#sidebar",

        topbar: "#topbar",

        pageContent: "#page-content",

        statusBar: "#status-bar",

        loading: "#loading-screen",

        modalRoot: "#modal-root",

        toastRoot: "#toast-root",

        drawerRoot: "#drawer-root",

        contextRoot: "#context-menu-root",

        floatingRoot: "#floating-panel-root"

    },

    scan() {

        Object.entries(this.selectors).forEach(

            ([key, selector]) => {

                PowerTools.dom[key] =

                    document.querySelector(selector);

            }

        );

    },

    find(selector, root = document) {

        return root.querySelector(selector);

    },

    findAll(selector, root = document) {

        return [...root.querySelectorAll(selector)];

    }

};

/* ============================================================
   COMPONENT MANAGER
============================================================ */

PowerTools.components = {

    scan() {

        this.sidebarItems =

            PowerTools.domManager.findAll(

                ".menu-item"

            );

        this.buttons =

            PowerTools.domManager.findAll(

                "button"

            );

        this.inputs =

            PowerTools.domManager.findAll(

                "input"

            );

        this.cards =

            PowerTools.domManager.findAll(

                ".tool-card"

            );

        this.heroButtons =

            PowerTools.domManager.findAll(

                ".primary-btn,.secondary-btn"

            );

        this.forms =

            PowerTools.domManager.findAll(

                "form"

            );

    }

};

/* ============================================================
   MODULE LOADER
============================================================ */

PowerTools.modules = {

    list: {

        PromptEngine: null,

        CharacterLock: null,

        ProductLock: null,

        SceneEngine: null,

        StoryEngine: null,

        VoiceEngine: null,

        VideoEngine: null,

        IntegrationEngine: null,

        ExportEngine: null,

        UIEngine: null

    },

    discover() {

        Object.keys(this.list).forEach(

            module => {

                if (window[module]) {

                    this.list[module] =

                        window[module];

                    PowerTools.log.info(

                        module,

                        "connected"

                    );

                }

                else {

                    PowerTools.log.warn(

                        module,

                        "not found"

                    );

                }

            }

        );

    },

    initialize() {

        Object.values(this.list)

            .forEach(module => {

                if (

                    module &&

                    typeof module.init ===

                    "function"

                ) {

                    try {

                        module.init();

                    }

                    catch (err) {

                        PowerTools.log.error(

                            err

                        );

                    }

                }

            });

    }

};

/* ============================================================
   LIFE CYCLE
============================================================ */

PowerTools.lifecycle = {

    bootTasks: [],

    readyTasks: [],

    destroyTasks: [],

    boot(fn) {

        this.bootTasks.push(fn);

    },

    ready(fn) {

        this.readyTasks.push(fn);

    },

    destroy(fn) {

        this.destroyTasks.push(fn);

    }

};

/* ============================================================
   BOOT LOADER
============================================================ */

PowerTools.boot = async function () {

    if (PowerTools.state.booted)

        return;

    PowerTools.log.info(

        "Boot started"

    );

    PowerTools.domManager.scan();

    PowerTools.components.scan();

    PowerTools.modules.discover();

    for (

        const task of

        PowerTools.lifecycle.bootTasks

    ) {

        await task();

    }

    PowerTools.modules.initialize();

    for (

        const task of

        PowerTools.lifecycle.readyTasks

    ) {

        await task();

    }

    PowerTools.state.booted = true;

    PowerTools.state.initialized = true;

    PowerTools.performance.bootEnd =

        performance.now();

    PowerTools.performance.total =

        PowerTools.performance.bootEnd -

        PowerTools.performance.bootStart;

    PowerTools.events.emit(

        "app:ready"

    );

    PowerTools.log.info(

        "Boot finished",

        PowerTools.performance.total.toFixed(2),

        "ms"

    );

};

/* ============================================================
   EVENT DELEGATION
============================================================ */

PowerTools.delegate = function (

    selector,

    event,

    handler

) {

    document.addEventListener(

        event,

        e => {

            const target =

                e.target.closest(selector);

            if (!target)

                return;

            handler(e, target);

        }

    );

};

/* ============================================================
   APP READY
============================================================ */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        PowerTools.boot();

    }

);

PowerTools.log.info(

    "DOM Manager Ready"

);

PowerTools.log.info(

    "Component Manager Ready"

);

PowerTools.log.info(

    "Module Loader Ready"

);

PowerTools.log.info(

    "Boot System Ready"

);

/* ============================================================
   PART 3A
   ROUTER ENGINE
   PAGE REGISTRY
============================================================ */

PowerTools.router = {

    routes: new Map(),

    current: null,

    previous: null,

    defaultPage: "dashboard",

    initialized: false,

    init() {

        this.scan();

        this.initialized = true;

        PowerTools.log.info("Router Ready");

    },

    scan() {

        const pages = document.querySelectorAll("[data-page]");

        pages.forEach(page => {

            const id = page.dataset.page;

            if (!id) return;

            this.routes.set(id, page);

        });

    },

    register(name, element) {

        if (!name || !element) return;

        this.routes.set(name, element);

    },

    exists(name) {

        return this.routes.has(name);

    },

    get(name) {

        return this.routes.get(name);

    },

    show(name) {

        if (!this.exists(name)) {

            PowerTools.log.warn(

                "Page not found:",

                name

            );

            return false;

        }

        this.routes.forEach(page => {

            page.hidden = true;

            page.classList.remove("active");

        });

        const target = this.get(name);

        target.hidden = false;

        target.classList.add("active");

        this.previous = this.current;

        this.current = name;

        PowerTools.state.currentPage = name;

        PowerTools.events.emit(

            "page:change",

            {

                page: name,

                previous: this.previous

            }

        );

        return true;

    },

    go(name) {

        return this.show(name);

    },

    back() {

        if (!this.previous) return;

        this.show(this.previous);

    }

};

/* ============================================================
   PAGE MANAGER
============================================================ */

PowerTools.pages = {

    title: "",

    subtitle: "",

    titles: {

        dashboard: "Dashboard",

        prompt: "Smart Prompt",

        affiliate: "Affiliate Studio",

        image: "Image Studio",

        video: "Video Studio",

        storyboard: "Storyboard",

        narrator: "AI Narrator",

        workspace: "Workspace",

        library: "Prompt Library",

        settings: "Settings"

    },

    update(page) {

        const title =

            this.titles[page] ||

            PowerTools.utils.capitalize(page);

        const h1 =

            document.querySelector(

                ".page-title h1"

            );

        const span =

            document.querySelector(

                ".page-title span"

            );

        if (h1)

            h1.textContent = title;

        if (span)

            span.textContent =

                "PowerTools AI Creator Suite";

    }

};

/* ============================================================
   ROUTE API
============================================================ */

PowerTools.route = function(name){

    return PowerTools.router.go(name);

};

/* ============================================================
   PAGE EVENT
============================================================ */

PowerTools.events.on(

    "page:change",

    data=>{

        PowerTools.pages.update(

            data.page

        );

    }

);

/* ============================================================
   ROUTER BOOT
============================================================ */

PowerTools.lifecycle.boot(

    async()=>{

        PowerTools.router.init();

    }

);

PowerTools.lifecycle.ready(

    async()=>{

        PowerTools.router.go(

            PowerTools.router.defaultPage

        );

    }

);

PowerTools.log.info(

    "Dynamic Router Engine Loaded"

);

/* ============================================================
   PART 3B
   SIDEBAR ENGINE
   NAVIGATION ENGINE
============================================================ */

/* ============================================================
   SIDEBAR ENGINE
============================================================ */

PowerTools.sidebar = {

    element: null,

    items: [],

    toggleButton: null,

    collapsed: false,

    init() {

        this.element = PowerTools.dom.sidebar;

        this.toggleButton = PowerTools.utils.id("menu-toggle");

        this.refresh();

        this.bind();

        PowerTools.log.info("Sidebar Ready");

    },

    refresh() {

        this.items = [

            ...document.querySelectorAll(

                ".menu-item"

            )

        ];

    },

    bind() {

        if (this.toggleButton) {

            this.toggleButton.addEventListener(

                "click",

                () => this.toggle()

            );

        }

    },

    collapse() {

        this.collapsed = true;

        PowerTools.state.sidebarCollapsed = true;

        document.body.classList.add(

            "sidebar-collapsed"

        );

        PowerTools.events.emit(

            "sidebar:collapse"

        );

    },

    expand() {

        this.collapsed = false;

        PowerTools.state.sidebarCollapsed = false;

        document.body.classList.remove(

            "sidebar-collapsed"

        );

        PowerTools.events.emit(

            "sidebar:expand"

        );

    },

    toggle() {

        this.collapsed ?

            this.expand()

            :

            this.collapse();

    },

    activate(route) {

        this.items.forEach(item => {

            item.classList.remove("active");

            if (

                item.dataset.route === route

            ) {

                item.classList.add("active");

            }

        });

    }

};

/* ============================================================
   NAVIGATION ENGINE
============================================================ */

PowerTools.navigation = {

    navigate(route) {

        if (!route) return;

        PowerTools.router.go(route);

        PowerTools.sidebar.activate(route);

        PowerTools.events.emit(

            "navigation",

            route

        );

    }

};

/* ============================================================
   GLOBAL ACTION DISPATCHER
============================================================ */

PowerTools.actions = {

    list: new Map(),

    register(name, handler) {

        this.list.set(

            name,

            handler

        );

    },

    execute(name, payload = null) {

        if (

            !this.list.has(name)

        ) {

            PowerTools.log.warn(

                "Unknown action:",

                name

            );

            return;

        }

        try {

            this.list

                .get(name)

                (payload);

        }

        catch (err) {

            PowerTools.log.error(err);

        }

    }

};

/* ============================================================
   DEFAULT ACTIONS
============================================================ */

PowerTools.actions.register(

    "dashboard",

    () =>

        PowerTools.navigation.navigate(

            "dashboard"

        )

);

PowerTools.actions.register(

    "prompt",

    () =>

        PowerTools.navigation.navigate(

            "prompt"

        )

);

PowerTools.actions.register(

    "affiliate",

    () =>

        PowerTools.navigation.navigate(

            "affiliate"

        )

);

PowerTools.actions.register(

    "image",

    () =>

        PowerTools.navigation.navigate(

            "image"

        )

);

PowerTools.actions.register(

    "video",

    () =>

        PowerTools.navigation.navigate(

            "video"

        )

);

PowerTools.actions.register(

    "storyboard",

    () =>

        PowerTools.navigation.navigate(

            "storyboard"

        )

);

PowerTools.actions.register(

    "narrator",

    () =>

        PowerTools.navigation.navigate(

            "narrator"

        )

);

PowerTools.actions.register(

    "library",

    () =>

        PowerTools.navigation.navigate(

            "library"

        )

);

PowerTools.actions.register(

    "workspace",

    () =>

        PowerTools.navigation.navigate(

            "workspace"

        )

);

PowerTools.actions.register(

    "settings",

    () =>

        PowerTools.navigation.navigate(

            "settings"

        )

);

/* ============================================================
   EVENT DELEGATION
============================================================ */

PowerTools.delegate(

    ".menu-item",

    "click",

    (event, element) => {

        const route =

            element.dataset.route;

        if (route) {

            PowerTools.navigation.navigate(

                route

            );

            return;

        }

        const label =

            element

            .textContent

            .trim()

            .toLowerCase();

        if (

            label.includes("dashboard")

        )

            return PowerTools.actions.execute(

                "dashboard"

            );

        if (

            label.includes("smart")

        )

            return PowerTools.actions.execute(

                "prompt"

            );

        if (

            label.includes("affiliate")

        )

            return PowerTools.actions.execute(

                "affiliate"

            );

        if (

            label.includes("image")

        )

            return PowerTools.actions.execute(

                "image"

            );

        if (

            label.includes("video")

        )

            return PowerTools.actions.execute(

                "video"

            );

        if (

            label.includes("story")

        )

            return PowerTools.actions.execute(

                "storyboard"

            );

        if (

            label.includes("narrator")

        )

            return PowerTools.actions.execute(

                "narrator"

            );

        if (

            label.includes("library")

        )

            return PowerTools.actions.execute(

                "library"

            );

        if (

            label.includes("workspace")

        )

            return PowerTools.actions.execute(

                "workspace"

            );

        if (

            label.includes("setting")

        )

            return PowerTools.actions.execute(

                "settings"

            );

    }

);

/* ============================================================
   ROUTER SYNC
============================================================ */

PowerTools.events.on(

    "page:change",

    data => {

        PowerTools.sidebar.activate(

            data.page

        );

    }

);

/* ============================================================
   BOOT
============================================================ */

PowerTools.lifecycle.boot(

    async () => {

        PowerTools.sidebar.init();

    }

);

PowerTools.log.info(

    "Navigation Engine Loaded"

);

/* ============================================================
   PART 3C
   DASHBOARD ENGINE
   HERO ENGINE
   TOOL CARD ENGINE
   WORKSPACE MANAGER
============================================================ */

/* ============================================================
   DASHBOARD ENGINE
============================================================ */

PowerTools.dashboard = {

    heroButtons: [],

    toolCards: [],

    searchInput: null,

    initialized: false,

    init() {

        this.heroButtons = [

            ...document.querySelectorAll(

                ".primary-btn,.secondary-btn"

            )

        ];

        this.toolCards = [

            ...document.querySelectorAll(

                ".tool-card"

            )

        ];

        this.searchInput =

            document.querySelector(

                "#global-search"

            );

        this.bind();

        this.initialized = true;

        PowerTools.log.info(

            "Dashboard Ready"

        );

    },

    bind() {

        this.bindHero();

        this.bindCards();

        this.bindSearch();

    },

/* ============================================================
   HERO BUTTON
============================================================ */

    bindHero() {

        this.heroButtons.forEach(

            button => {

                button.addEventListener(

                    "click",

                    () => {

                        const text =

                            button.innerText

                            .toLowerCase();

                        if (

                            text.includes("mulai")

                        ) {

                            PowerTools.navigation.navigate(

                                "prompt"

                            );

                            return;

                        }

                        if (

                            text.includes("template")

                        ) {

                            PowerTools.navigation.navigate(

                                "library"

                            );

                            return;

                        }

                        PowerTools.events.emit(

                            "hero:click",

                            button

                        );

                    }

                );

            }

        );

    },

/* ============================================================
   TOOL CARD
============================================================ */

    bindCards() {

        this.toolCards.forEach(

            card => {

                card.addEventListener(

                    "click",

                    () => {

                        const title =

                            card.querySelector("h3")

                            ?.textContent

                            .trim()

                            .toLowerCase();

                        if (!title) return;

                        if (

                            title.includes("smart")

                        ) {

                            return PowerTools.navigation.navigate(

                                "prompt"

                            );

                        }

                        if (

                            title.includes("affiliate")

                        ) {

                            return PowerTools.navigation.navigate(

                                "affiliate"

                            );

                        }

                        if (

                            title.includes("image")

                        ) {

                            return PowerTools.navigation.navigate(

                                "image"

                            );

                        }

                        if (

                            title.includes("video")

                        ) {

                            return PowerTools.navigation.navigate(

                                "video"

                            );

                        }

                        if (

                            title.includes("story")

                        ) {

                            return PowerTools.navigation.navigate(

                                "storyboard"

                            );

                        }

                        if (

                            title.includes("narrator")

                        ) {

                            return PowerTools.navigation.navigate(

                                "narrator"

                            );

                        }

                        if (

                            title.includes("library")

                        ) {

                            return PowerTools.navigation.navigate(

                                "library"

                            );

                        }

                        PowerTools.events.emit(

                            "tool:open",

                            title

                        );

                    }

                );

            }

        );

    },

/* ============================================================
   SEARCH ENGINE
============================================================ */

    bindSearch() {

        if (!this.searchInput)

            return;

        this.searchInput.addEventListener(

            "input",

            event => {

                this.filter(

                    event.target.value

                );

            }

        );

    },

    filter(keyword = "") {

        keyword =

            keyword

            .trim()

            .toLowerCase();

        PowerTools.state.searchKeyword =

            keyword;

        this.toolCards.forEach(

            card => {

                const text =

                    card.innerText

                    .toLowerCase();

                card.style.display =

                    text.includes(keyword)

                        ? ""

                        : "none";

            }

        );

    }

};

/* ============================================================
   WORKSPACE MANAGER
============================================================ */

PowerTools.workspace = {

    current: "default",

    set(name) {

        this.current = name;

        PowerTools.state.currentWorkspace =

            name;

        document.body.dataset.workspace =

            name;

        PowerTools.events.emit(

            "workspace:change",

            name

        );

    },

    get() {

        return this.current;

    }

};

/* ============================================================
   STATUS BAR
============================================================ */

PowerTools.status = {

    center: null,

    init() {

        this.center =

            document.querySelector(

                ".status-center"

            );

    },

    update(text) {

        if (!this.center)

            return;

        this.center.textContent = text;

    }

};

/* ============================================================
   EVENTS
============================================================ */

PowerTools.events.on(

    "page:change",

    data => {

        PowerTools.status.update(

            "Current Page : " +

            data.page

        );

    }

);

PowerTools.events.on(

    "workspace:change",

    workspace => {

        PowerTools.status.update(

            "Workspace : " +

            workspace

        );

    }

);

/* ============================================================
   READY
============================================================ */

PowerTools.lifecycle.boot(

    async () => {

        PowerTools.dashboard.init();

        PowerTools.status.init();

    }

);

PowerTools.lifecycle.ready(

    async () => {

        PowerTools.workspace.set(

            "default"

        );

    }

);

PowerTools.log.info(

    "Dashboard Engine Loaded"

);

PowerTools.log.info(

    "Workspace Manager Loaded"

);

/* ============================================================
   PART 4A
   MODAL ENGINE
   DRAWER ENGINE
============================================================ */

/* ============================================================
   MODAL ENGINE
============================================================ */

PowerTools.modal = {

    root: null,

    overlay: null,

    container: null,

    opened: false,

    init() {

        this.root = PowerTools.dom.modalRoot;

        if (!this.root) {

            this.root = document.createElement("div");

            this.root.id = "modal-root";

            document.body.appendChild(this.root);

        }

        this.build();

        PowerTools.log.info("Modal Engine Ready");

    },

    build() {

        this.root.innerHTML = "";

        this.overlay = document.createElement("div");

        this.overlay.className = "pt-modal-overlay";

        this.container = document.createElement("div");

        this.container.className = "pt-modal";

        this.overlay.appendChild(this.container);

        this.root.appendChild(this.overlay);

        this.overlay.style.display = "none";

        this.overlay.addEventListener(

            "click",

            e => {

                if (e.target === this.overlay) {

                    this.close();

                }

            }

        );

    },

    open(options = {}) {

        this.container.innerHTML = "";

        if (options.title) {

            const title = document.createElement("h2");

            title.className = "pt-modal-title";

            title.textContent = options.title;

            this.container.appendChild(title);

        }

        if (options.content instanceof HTMLElement) {

            this.container.appendChild(

                options.content

            );

        }

        else {

            const body = document.createElement("div");

            body.className = "pt-modal-body";

            body.innerHTML =

                options.content || "";

            this.container.appendChild(body);

        }

        this.overlay.style.display = "flex";

        this.opened = true;

        PowerTools.state.currentModal = options.title || "";

        PowerTools.events.emit(

            "modal:open",

            options

        );

    },

    close() {

        this.overlay.style.display = "none";

        this.container.innerHTML = "";

        this.opened = false;

        PowerTools.state.currentModal = null;

        PowerTools.events.emit(

            "modal:close"

        );

    },

    isOpen() {

        return this.opened;

    }

};

/* ============================================================
   DRAWER ENGINE
============================================================ */

PowerTools.drawer = {

    root: null,

    panel: null,

    opened: false,

    init() {

        this.root = PowerTools.dom.drawerRoot;

        if (!this.root) {

            this.root = document.createElement("div");

            this.root.id = "drawer-root";

            document.body.appendChild(

                this.root

            );

        }

        this.build();

        PowerTools.log.info(

            "Drawer Engine Ready"

        );

    },

    build() {

        this.panel =

            document.createElement("div");

        this.panel.className =

            "pt-drawer";

        this.root.appendChild(

            this.panel

        );

    },

    open(content = "") {

        this.panel.innerHTML =

            content;

        this.panel.classList.add(

            "open"

        );

        this.opened = true;

        PowerTools.events.emit(

            "drawer:open"

        );

    },

    close() {

        this.panel.classList.remove(

            "open"

        );

        this.panel.innerHTML = "";

        this.opened = false;

        PowerTools.events.emit(

            "drawer:close"

        );

    },

    toggle(content = "") {

        if (this.opened) {

            this.close();

        }

        else {

            this.open(content);

        }

    }

};

/* ============================================================
   BOOT
============================================================ */

PowerTools.lifecycle.boot(

    async () => {

        PowerTools.modal.init();

        PowerTools.drawer.init();

    }

);

PowerTools.log.info(

    "UI Layer Part 1 Loaded"

);

/* ============================================================
   PART 4B
   TOAST ENGINE
   NOTIFICATION CENTER
============================================================ */

/* ============================================================
   TOAST ENGINE
============================================================ */

PowerTools.toast = {

    root: null,

    stack: [],

    init() {

        this.root = PowerTools.dom.toastRoot;

        if (!this.root) {

            this.root = document.createElement("div");

            this.root.id = "toast-root";

            document.body.appendChild(this.root);

        }

        this.root.classList.add("pt-toast-root");

        PowerTools.log.info("Toast Engine Ready");

    },

    show(options = {}) {

        const toast = document.createElement("div");

        toast.className = "pt-toast";

        toast.classList.add(

            options.type || "info"

        );

        const icon = document.createElement("div");

        icon.className = "pt-toast-icon";

        icon.textContent =

            options.icon ||

            this.icon(options.type);

        const body = document.createElement("div");

        body.className = "pt-toast-body";

        const title = document.createElement("div");

        title.className = "pt-toast-title";

        title.textContent =

            options.title ||

            "Notification";

        const message = document.createElement("div");

        message.className = "pt-toast-message";

        message.textContent =

            options.message ||

            "";

        body.appendChild(title);

        body.appendChild(message);

        toast.appendChild(icon);

        toast.appendChild(body);

        this.root.appendChild(toast);

        this.stack.push(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        const duration =

            options.duration ||

            PowerTools.config.toastDuration;

        setTimeout(() => {

            this.remove(toast);

        }, duration);

        PowerTools.events.emit(

            "toast:show",

            options

        );

    },

    remove(toast) {

        if (!toast) return;

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

            this.stack =

                this.stack.filter(

                    item => item !== toast

                );

        }, 250);

    },

    clear() {

        this.stack.forEach(

            toast => toast.remove()

        );

        this.stack = [];

    },

    icon(type) {

        switch (type) {

            case "success":

                return "✅";

            case "error":

                return "❌";

            case "warning":

                return "⚠️";

            default:

                return "ℹ️";

        }

    }

};

/* ============================================================
   NOTIFICATION CENTER
============================================================ */

PowerTools.notifications = {

    list: [],

    add(type, title, message) {

        const notification = {

            id: PowerTools.utils.uuid(),

            type,

            title,

            message,

            time: Date.now(),

            read: false

        };

        this.list.unshift(notification);

        PowerTools.store.notifications =

            this.list;

        PowerTools.toast.show({

            type,

            title,

            message

        });

        PowerTools.events.emit(

            "notification:add",

            notification

        );

        return notification;

    },

    success(title, message) {

        return this.add(

            "success",

            title,

            message

        );

    },

    error(title, message) {

        return this.add(

            "error",

            title,

            message

        );

    },

    warning(title, message) {

        return this.add(

            "warning",

            title,

            message

        );

    },

    info(title, message) {

        return this.add(

            "info",

            title,

            message

        );

    },

    remove(id) {

        this.list =

            this.list.filter(

                item => item.id !== id

            );

    },

    clear() {

        this.list = [];

    },

    unread() {

        return this.list.filter(

            item => !item.read

        );

    },

    markRead(id) {

        const item =

            this.list.find(

                n => n.id === id

            );

        if (item) {

            item.read = true;

        }

    }

};

/* ============================================================
   QUICK API
============================================================ */

PowerTools.notify = {

    success(message) {

        return PowerTools.notifications.success(

            "Success",

            message

        );

    },

    error(message) {

        return PowerTools.notifications.error(

            "Error",

            message

        );

    },

    warning(message) {

        return PowerTools.notifications.warning(

            "Warning",

            message

        );

    },

    info(message) {

        return PowerTools.notifications.info(

            "Information",

            message

        );

    }

};

/* ============================================================
   BOOT
============================================================ */

PowerTools.lifecycle.boot(

    async () => {

        PowerTools.toast.init();

    }

);

PowerTools.log.info(

    "Toast Engine Loaded"

);

PowerTools.log.info(

    "Notification Center Loaded"

);

/* ============================================================
   PART 5A
   LOADING MANAGER
============================================================ */

PowerTools.loading = {

    element: null,

    spinner: null,

    text: null,

    progress: null,

    value: 0,

    visible: false,

    initialized: false,

    init() {

        this.element = PowerTools.dom.loading;

        if (!this.element) {

            this.create();

        } else {

            this.prepare();

        }

        this.initialized = true;

        PowerTools.log.info(

            "Loading Manager Ready"

        );

    },

    create() {

        this.element = document.createElement("div");

        this.element.id = "loading-screen";

        this.element.className = "pt-loading";

        this.element.innerHTML = `

            <div class="pt-loading-box">

                <div class="pt-loading-spinner"></div>

                <div class="pt-loading-text">

                    Loading...

                </div>

                <div class="pt-loading-progress">

                    <div class="pt-loading-bar"></div>

                </div>

            </div>

        `;

        document.body.appendChild(

            this.element

        );

        this.prepare();

    },

    prepare() {

        this.spinner =

            this.element.querySelector(

                ".pt-loading-spinner"

            );

        this.text =

            this.element.querySelector(

                ".pt-loading-text"

            );

        this.progress =

            this.element.querySelector(

                ".pt-loading-bar"

            );

        this.hide(true);

    },

    show(message = "Loading...") {

        this.visible = true;

        this.value = 0;

        PowerTools.state.loading = true;

        this.text.textContent = message;

        this.progress.style.width = "0%";

        this.element.style.display = "flex";

        requestAnimationFrame(() => {

            this.element.classList.add(

                "show"

            );

        });

        PowerTools.events.emit(

            "loading:show",

            message

        );

    },

    hide(immediate = false) {

        this.visible = false;

        PowerTools.state.loading = false;

        this.progress.style.width = "100%";

        if (immediate) {

            this.element.classList.remove(

                "show"

            );

            this.element.style.display = "none";

            return;

        }

        this.element.classList.remove(

            "show"

        );

        setTimeout(() => {

            this.element.style.display =

                "none";

        }, 250);

        PowerTools.events.emit(

            "loading:hide"

        );

    },

    set(value) {

        this.value =

            Math.max(

                0,

                Math.min(

                    100,

                    value

                )

            );

        this.progress.style.width =

            this.value + "%";

        PowerTools.events.emit(

            "loading:progress",

            this.value

        );

    },

    increase(step = 10) {

        this.set(

            this.value + step

        );

    },

    message(text) {

        this.text.textContent = text;

    },

    async run(

        task,

        message = "Loading..."

    ) {

        this.show(message);

        try {

            const result =

                await task();

            this.set(100);

            await PowerTools.utils.delay(

                150

            );

            return result;

        }

        catch (error) {

            PowerTools.log.error(error);

            throw error;

        }

        finally {

            this.hide();

        }

    },

    async fake(

        duration = 1000,

        message = "Loading..."

    ) {

        this.show(message);

        const step = 100 / 20;

        for (

            let i = 0;

            i <= 20;

            i++

        ) {

            this.set(

                Math.round(

                    i * step

                )

            );

            await PowerTools.utils.delay(

                duration / 20

            );

        }

        this.hide();

    }

};

/* ============================================================
   GLOBAL API
============================================================ */

PowerTools.showLoading = function (

    message

) {

    PowerTools.loading.show(

        message

    );

};

PowerTools.hideLoading = function () {

    PowerTools.loading.hide();

};

PowerTools.withLoading = async function (

    task,

    message

) {

    return PowerTools.loading.run(

        task,

        message

    );

};

/* ============================================================
   BOOT
============================================================ */

PowerTools.lifecycle.boot(

    async () => {

        PowerTools.loading.init();

    }

);

PowerTools.log.info(

    "Loading Manager Loaded"

);

/* ============================================================
   PART 5B
   THEME MANAGER
============================================================ */

PowerTools.theme = {

    current: PowerTools.state.currentTheme || "dark",

    available: [

        "dark",

        "light",

        "system"

    ],

    initialized: false,

    mediaQuery: null,

    init() {

        this.mediaQuery = window.matchMedia(

            "(prefers-color-scheme: dark)"

        );

        this.restore();

        this.bind();

        this.initialized = true;

        PowerTools.log.info(

            "Theme Manager Ready"

        );

    },

    bind() {

        this.mediaQuery.addEventListener(

            "change",

            () => {

                if (

                    this.current ===

                    "system"

                ) {

                    this.apply(

                        "system",

                        false

                    );

                }

            }

        );

    },

    restore() {

        const saved =

            localStorage.getItem(

                PowerTools.config

                    .storagePrefix +

                "theme"

            );

        if (

            saved &&

            this.available.includes(

                saved

            )

        ) {

            this.apply(

                saved,

                false

            );

        }

        else {

            this.apply(

                PowerTools.config.theme,

                false

            );

        }

    },

    apply(

        theme,

        save = true

    ) {

        if (

            !this.available.includes(

                theme

            )

        ) {

            theme = "dark";

        }

        this.current = theme;

        let active = theme;

        if (

            theme ===

            "system"

        ) {

            active =

                this.mediaQuery.matches

                    ? "dark"

                    : "light";

        }

        document.documentElement

            .setAttribute(

                "data-theme",

                active

            );

        document.body

            .setAttribute(

                "data-theme",

                active

            );

        document.body.classList.remove(

            "theme-dark",

            "theme-light"

        );

        document.body.classList.add(

            "theme-" + active

        );

        PowerTools.state.currentTheme =

            theme;

        if (save) {

            localStorage.setItem(

                PowerTools.config

                    .storagePrefix +

                    "theme",

                theme

            );

        }

        PowerTools.events.emit(

            "theme:change",

            {

                theme,

                active

            }

        );

    },

    set(theme) {

        this.apply(

            theme,

            true

        );

    },

    toggle() {

        const next =

            this.getActive()

            === "dark"

                ? "light"

                : "dark";

        this.set(next);

    },

    useSystem() {

        this.set("system");

    },

    dark() {

        this.set("dark");

    },

    light() {

        this.set("light");

    },

    get() {

        return this.current;

    },

    getActive() {

        if (

            this.current ===

            "system"

        ) {

            return this.mediaQuery.matches

                ? "dark"

                : "light";

        }

        return this.current;

    },

    isDark() {

        return (

            this.getActive() ===

            "dark"

        );

    },

    isLight() {

        return (

            this.getActive() ===

            "light"

        );

    }

};

/* ============================================================
   QUICK API
============================================================ */

PowerTools.darkMode = function () {

    PowerTools.theme.dark();

};

PowerTools.lightMode = function () {

    PowerTools.theme.light();

};

PowerTools.systemTheme = function () {

    PowerTools.theme.useSystem();

};

PowerTools.toggleTheme = function () {

    PowerTools.theme.toggle();

};

/* ============================================================
   EVENTS
============================================================ */

PowerTools.events.on(

    "theme:change",

    data => {

        PowerTools.log.info(

            "Theme Changed:",

            data.active

        );

    }

);

/* ============================================================
   BOOT
============================================================ */

PowerTools.lifecycle.boot(

    async () => {

        PowerTools.theme.init();

    }

);

PowerTools.log.info(

    "Theme Manager Loaded"

);

/* ============================================================
   PART 5C
   STORAGE MANAGER
============================================================ */

PowerTools.storage = {

    prefix: PowerTools.config.storagePrefix,

    initialized: false,

    init() {

        this.prefix =

            PowerTools.config.storagePrefix;

        this.restoreState();

        this.autoSave();

        this.initialized = true;

        PowerTools.log.info(

            "Storage Manager Ready"

        );

    },

    /* ========================================================
       KEY
    ======================================================== */

    key(name) {

        return this.prefix + name;

    },

    /* ========================================================
       LOCAL STORAGE
    ======================================================== */

    set(name, value) {

        try {

            localStorage.setItem(

                this.key(name),

                JSON.stringify(value)

            );

            return true;

        }

        catch (error) {

            PowerTools.log.error(error);

            return false;

        }

    },

    get(name, fallback = null) {

        try {

            const value =

                localStorage.getItem(

                    this.key(name)

                );

            if (value === null) {

                return fallback;

            }

            return JSON.parse(value);

        }

        catch (error) {

            PowerTools.log.error(error);

            return fallback;

        }

    },

    remove(name) {

        localStorage.removeItem(

            this.key(name)

        );

    },

    has(name) {

        return (

            localStorage.getItem(

                this.key(name)

            ) !== null

        );

    },

    /* ========================================================
       SESSION STORAGE
    ======================================================== */

    sessionSet(name, value) {

        sessionStorage.setItem(

            this.key(name),

            JSON.stringify(value)

        );

    },

    sessionGet(name, fallback = null) {

        const value =

            sessionStorage.getItem(

                this.key(name)

            );

        if (value === null) {

            return fallback;

        }

        try {

            return JSON.parse(value);

        }

        catch {

            return fallback;

        }

    },

    sessionRemove(name) {

        sessionStorage.removeItem(

            this.key(name)

        );

    },

    /* ========================================================
       CACHE
    ======================================================== */

    cache(name, value) {

        PowerTools.store.cache[name] = value;

        return value;

    },

    cacheGet(name) {

        return PowerTools.store.cache[name];

    },

    cacheRemove(name) {

        delete PowerTools.store.cache[name];

    },

    cacheClear() {

        PowerTools.store.cache = {};

    },

    /* ========================================================
       APPLICATION STATE
    ======================================================== */

    saveState() {

        this.set(

            "state",

            PowerTools.state

        );

    },

    restoreState() {

        const state =

            this.get("state");

        if (!state) return;

        Object.assign(

            PowerTools.state,

            state

        );

    },

    saveSettings() {

        this.set(

            "settings",

            PowerTools.store.settings

        );

    },

    restoreSettings() {

        const settings =

            this.get(

                "settings",

                {}

            );

        PowerTools.store.settings =

            settings;

    },

    saveNotifications() {

        this.set(

            "notifications",

            PowerTools.notifications.list

        );

    },

    restoreNotifications() {

        const notifications =

            this.get(

                "notifications",

                []

            );

        PowerTools.notifications.list =

            notifications;

    },

    /* ========================================================
       BACKUP
    ======================================================== */

    export() {

        return {

            version:

                PowerTools.info.version,

            date:

                new Date()

                .toISOString(),

            state:

                structuredClone(

                    PowerTools.state

                ),

            store:

                structuredClone(

                    PowerTools.store

                )

        };

    },

    import(data) {

        if (!data) return;

        if (data.state) {

            Object.assign(

                PowerTools.state,

                data.state

            );

        }

        if (data.store) {

            Object.assign(

                PowerTools.store,

                data.store

            );

        }

        this.saveState();

        this.saveSettings();

    },

    clear() {

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

    },

    /* ========================================================
       AUTO SAVE
    ======================================================== */

    autoSave() {

        if (

            !PowerTools.config.autosave

        ) {

            return;

        }

        setInterval(() => {

            this.saveState();

            this.saveSettings();

            this.saveNotifications();

        }, 5000);

    }

};

/* ============================================================
   STORAGE EVENTS
============================================================ */

PowerTools.events.on(

    "workspace:change",

    () => {

        PowerTools.storage.saveState();

    }

);

PowerTools.events.on(

    "theme:change",

    () => {

        PowerTools.storage.saveState();

    }

);

PowerTools.events.on(

    "notification:add",

    () => {

        PowerTools.storage.saveNotifications();

    }

);

/* ============================================================
   QUICK API
============================================================ */

PowerTools.save = function () {

    PowerTools.storage.saveState();

    PowerTools.storage.saveSettings();

    PowerTools.storage.saveNotifications();

};

PowerTools.restore = function () {

    PowerTools.storage.restoreState();

    PowerTools.storage.restoreSettings();

    PowerTools.storage.restoreNotifications();

};

PowerTools.backup = function () {

    return PowerTools.storage.export();

};

PowerTools.resetStorage = function () {

    PowerTools.storage.clear();

};

/* ============================================================
   BOOT
============================================================ */

PowerTools.lifecycle.boot(

    async () => {

        PowerTools.storage.init();

        PowerTools.storage.restoreSettings();

        PowerTools.storage.restoreNotifications();

    }

);

PowerTools.log.info(

    "Storage Manager Loaded"

);


