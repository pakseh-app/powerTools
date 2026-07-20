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
    ROUTER INTEGRATION
==========================================================*/

function bindRouter(){

    if(typeof router === "undefined"){

        console.warn(
            "Router belum tersedia."
        );

        return;

    }

    log("Router Connected");

    /*----------------------------------
        Router Started
    ----------------------------------*/

    router.on("start",()=>{

        log("Router Started");

    });

    /*----------------------------------
        Before Navigate
    ----------------------------------*/

    router.on(

        "before:navigate",

        context=>{

            log(

                "Navigate =>",

                context

            );

            showLoading();

        }

    );

    /*----------------------------------
        After Navigate
    ----------------------------------*/

    router.on(

        "after:navigate",

        context=>{

            hideLoading();

            let page = APP.defaultPage;

            if(context){

                if(context.name){

                    page = context.name;

                }
                else if(context.route){

                    if(context.route.name){

                        page = context.route.name;
                    }

                }
                else if(context.pathname){

                    page = context.pathname
                        .replace(/^\/+/,"")
                        .trim();

                    if(page===""){

                        page = APP.defaultPage;

                    }

                }

            }

            showPage(page);

            log(

                "Current Page :",

                page

            );

        }

    );

    /*----------------------------------
        Not Found
    ----------------------------------*/

    router.on(

        "notfound",

        target=>{

            console.warn(

                "Route Not Found",

                target

            );

            toast(

                "Halaman tidak ditemukan",

                "warning"

            );

        }

    );

    /*----------------------------------
        Start Router
    ----------------------------------*/

    router.start();

}

/*==========================================================
    SIDEBAR
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

                        typeof router !== "undefined"

                        &&

                        typeof router.navigate==="function"

                    ){

                        router.navigate(

                            "/" + page

                        );

                    }

                    else{

                        showPage(page);

                    }

                }

            );

        });

}

/*==========================================================
    MENU BUTTON
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

