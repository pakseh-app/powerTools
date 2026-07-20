/*==========================================================
    PowerTools Ultimate AI Suite
    app.js
==========================================================*/

"use strict";

/*==========================================================
    CONFIG
==========================================================*/

const APP = {

    name: "PowerTools",

    version: "2.0.0",

    author: "PowerTools",

    defaultPage: "dashboard",

    debug: true

};

/*==========================================================
    GLOBAL STATE
==========================================================*/

const State = {

    currentPage: APP.defaultPage,

    sidebarCollapsed: false,

    darkMode: true,

    loading: false,

    initialized: false

};

/*==========================================================
    ELEMENT CACHE
==========================================================*/

const UI = {

    app: null,

    sidebar: null,

    topbar: null,

    pageContent: null,

    pageTitle: null,

    pageSubtitle: null,

    loadingScreen: null,

    toastRoot: null,

    modalRoot: null,

    drawerRoot: null,

    contextRoot: null,

    floatingRoot: null

};

/*==========================================================
    QUERY
==========================================================*/

const $ = selector => document.querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);

/*==========================================================
    CACHE ELEMENT
==========================================================*/

function cacheElement(){

    UI.app = $("#app");

    UI.sidebar = $("#sidebar");

    UI.topbar = $("#topbar");

    UI.pageContent = $("#page-content");

    UI.pageTitle = $("#page-title");

    UI.pageSubtitle = $("#page-subtitle");

    UI.loadingScreen = $("#loading-screen");

    UI.toastRoot = $("#toast-root");

    UI.modalRoot = $("#modal-root");

    UI.drawerRoot = $("#drawer-root");

    UI.contextRoot = $("#context-menu-root");

    UI.floatingRoot = $("#floating-panel-root");

}

/*==========================================================
    LOG
==========================================================*/

function log(...msg){

    if(APP.debug){

        console.log(

            "[PowerTools]",

            ...msg

        );

    }

}

/*==========================================================
    PAGE
==========================================================*/

const Pages = new Map();

/*==========================================================
    REGISTER PAGE
==========================================================*/

function registerPages(){

    document

        .querySelectorAll(".page")

        .forEach(page=>{

            Pages.set(

                page.id,

                page

            );

        });

    log(

        "Page Registered :",

        Pages.size

    );

}

/*==========================================================
    TITLE
==========================================================*/

const PageTitle = {

    dashboard : {

        title : "Dashboard",

        subtitle : "Welcome to PowerTools"

    },

    prompt : {

        title : "Smart Prompt",

        subtitle : "AI Prompt Generator"

    },

    affiliate : {

        title : "Affiliate Studio",

        subtitle : "Affiliate Content Generator"

    },

    image : {

        title : "Image Studio",

        subtitle : "AI Image Generator"

    },

    video : {

        title : "Video Studio",

        subtitle : "AI Video Generator"

    },

    storyboard : {

        title : "Storyboard",

        subtitle : "Storyboard Builder"

    },

    narrator : {

        title : "AI Narrator",

        subtitle : "Voice & Narration"

    },

    library : {

        title : "Prompt Library",

        subtitle : "Prompt Collection"

    },

    optimizer : {

        title : "Prompt Optimizer",

        subtitle : "Improve Prompt"

    },

    workspace : {

        title : "Workspace",

        subtitle : "Project Workspace"

    },

    settings : {

        title : "Settings",

        subtitle : "Application Settings"

    }

};

/*==========================================================
    CHANGE TITLE
==========================================================*/

function setPageTitle(page){

    if(!UI.pageTitle) return;

    const data =

        PageTitle[page];

    if(!data) return;

    UI.pageTitle.textContent =

        data.title;

    if(UI.pageSubtitle){

        UI.pageSubtitle.textContent =

            data.subtitle;

    }

}

/*==========================================================
    SIDEBAR
==========================================================*/

function clearActiveMenu(){

    document

        .querySelectorAll(".menu-item")

        .forEach(menu=>{

            menu.classList.remove(

                "active"

            );

        });

}

function activateMenu(page){

    clearActiveMenu();

    const menu =

        document.querySelector(

            `.menu-item[data-page="${page}"]`

        );

    if(menu){

        menu.classList.add(

            "active"

        );

    }

}

/*==========================================================
    SHOW PAGE
==========================================================*/

function showPage(page){

    Pages.forEach(item=>{

        item.hidden = true;

        item.classList.remove(

            "active"

        );

    });

    const current =

        document.getElementById(

            page + "-page"

        );

    if(current){

        current.hidden = false;

        current.classList.add(

            "active"

        );

        State.currentPage = page;

        activateMenu(page);

        setPageTitle(page);

    }

}

/*==========================================================
    ROUTER BINDING
==========================================================*/

function bindRouter(){

    if(typeof router === "undefined"){

        console.warn(

            "router.js belum dimuat."

        );

        return;

    }

    log(

        "Router ditemukan."

    );

    if(typeof router.on === "function"){

        router.on(

            "change",

            route=>{

                const page =

                    route.name ||

                    route.path ||

                    APP.defaultPage;

                showPage(page);

            }

        );

    }

    if(typeof router.start === "function"){

        router.start();

    }

}

/*==========================================================
    SIDEBAR EVENT
==========================================================*/

function bindSidebar(){

    document

        .querySelectorAll(".menu-item")

        .forEach(menu=>{

            menu.addEventListener(

                "click",

                ()=>{

                    const page =

                        menu.dataset.page;

                    if(

                        typeof router !== "undefined" &&

                        typeof router.navigate === "function"

                    ){

                        router.navigate(page);

                    }

                    else{

                        showPage(page);

                    }

                }

            );

        });

}

/*==========================================================
    SEARCH
==========================================================*/

function bindSearch(){

    const input =

        $("#global-search");

    if(!input) return;

    input.addEventListener(

        "input",

        e=>{

            State.search =

                e.target.value;

        }

    );

}

/*==========================================================
    SIDEBAR COLLAPSE
==========================================================*/

function toggleSidebar(){

    State.sidebarCollapsed =

        !State.sidebarCollapsed;

    UI.sidebar.classList.toggle(

        "collapsed",

        State.sidebarCollapsed

    );

}

function bindMenuToggle(){

    const btn =

        $("#menu-toggle");

    if(!btn) return;

    btn.addEventListener(

        "click",

        toggleSidebar

    );

}

