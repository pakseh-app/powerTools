/*=========================================================
    PowerTools Ultimate AI Suite
    app.js
=========================================================*/

"use strict";

/*=========================================================
    CONFIG
=========================================================*/

const APP = {

    name: "PowerTools",

    version: "2.0 Alpha",

    defaultPage: "dashboard",

    animation: 250

};

/*=========================================================
    STATE
=========================================================*/

const State = {

    page: APP.defaultPage,

    theme: "dark",

    loading: false,

    sidebar: true,

    drawer: false,

    modal: false,

    search: ""

};

/*=========================================================
    ELEMENT
=========================================================*/

const UI = {

    app: null,

    sidebar: null,

    topbar: null,

    pageContent: null,

    pageTitle: null,

    pageSubtitle: null,

    loading: null,

    toastRoot: null,

    modalRoot: null,

    drawerRoot: null,

    contextMenuRoot: null,

    floatingRoot: null

};

/*=========================================================
    PAGE
=========================================================*/

const Pages = {};

/*=========================================================
    SELECTOR
=========================================================*/

function $(selector){

    return document.querySelector(selector);

}

function $$(selector){

    return document.querySelectorAll(selector);

}

/*=========================================================
    CACHE ELEMENT
=========================================================*/

function cacheElement(){

    UI.app = $("#app");

    UI.sidebar = $("#sidebar");

    UI.topbar = $("#topbar");

    UI.pageContent = $("#page-content");

    UI.pageTitle = $("#page-title");

    UI.pageSubtitle = $("#page-subtitle");

    UI.loading = $("#loading-screen");

    UI.toastRoot = $("#toast-root");

    UI.modalRoot = $("#modal-root");

    UI.drawerRoot = $("#drawer-root");

    UI.contextMenuRoot = $("#context-menu-root");

    UI.floatingRoot = $("#floating-panel-root");

}

/*=========================================================
    REGISTER PAGE
=========================================================*/

function registerPage(id){

    const page = document.getElementById(id);

    if(page){

        Pages[id] = page;

    }

}

/*=========================================================
    REGISTER ALL PAGE
=========================================================*/

function registerPages(){

    registerPage("dashboard-page");

    registerPage("prompt-page");

    registerPage("affiliate-page");

    registerPage("image-page");

    registerPage("video-page");

    registerPage("storyboard-page");

    registerPage("narrator-page");

    registerPage("library-page");

    registerPage("optimizer-page");

    registerPage("workspace-page");

    registerPage("settings-page");

}

/*=========================================================
    PAGE MANAGER
=========================================================*/

function hideAllPages(){

    Object.values(Pages).forEach(page=>{

        page.hidden = true;

        page.classList.remove("active");

    });

}

function getPageId(name){

    return `${name}-page`;

}

function pageExists(name){

    return Pages.hasOwnProperty(getPageId(name));

}

function showPage(name){

    const id = getPageId(name);

    if(!Pages[id]){

        console.warn(`Page "${name}" tidak ditemukan`);

        return;

    }

    hideAllPages();

    Pages[id].hidden = false;

    Pages[id].classList.add("active");

    State.page = name;

    updateTitle(name);

    updateSidebar(name);

}

function updateTitle(name){

    const title={

        dashboard:"Dashboard",

        prompt:"Smart Prompt",

        affiliate:"Affiliate Studio",

        image:"Image Studio",

        video:"Video Studio",

        storyboard:"Storyboard AI",

        narrator:"AI Narrator",

        library:"Prompt Library",

        optimizer:"Prompt Optimizer",

        workspace:"Workspace",

        settings:"Settings"

    };

    const subtitle={

        dashboard:"Welcome to PowerTools",

        prompt:"Generate AI Prompt",

        affiliate:"Create Affiliate Content",

        image:"AI Image Generator",

        video:"AI Video Generator",

        storyboard:"Storyboard Generator",

        narrator:"Narrator Studio",

        library:"Prompt Collection",

        optimizer:"Improve Your Prompt",

        workspace:"Project Workspace",

        settings:"Application Settings"

    };

    if(UI.pageTitle){

        UI.pageTitle.textContent=

            title[name] || "PowerTools";

    }

    if(UI.pageSubtitle){

        UI.pageSubtitle.textContent=

            subtitle[name] || "";

    }

}

/*=========================================================
    SIDEBAR
=========================================================*/

function clearActiveMenu(){

    $$(".menu-item").forEach(item=>{

        item.classList.remove("active");

    });

}

function updateSidebar(page){

    clearActiveMenu();

    const btn=document.querySelector(

        `.menu-item[data-page="${page}"]`

    );

    if(btn){

        btn.classList.add("active");

    }

}

function bindSidebar(){

    $$(".menu-item").forEach(button=>{

        button.addEventListener("click",()=>{

            const page=

                button.dataset.page;

            showPage(page);

        });

    });

}

/*=========================================================
    MENU TOGGLE
=========================================================*/

function toggleSidebar(){

    State.sidebar=!State.sidebar;

    UI.sidebar.classList.toggle(

        "collapsed",

        !State.sidebar

    );

}

function bindMenuToggle(){

    const btn=$("#menu-toggle");

    if(!btn) return;

    btn.addEventListener(

        "click",

        toggleSidebar

    );

}

/*=========================================================
    TOAST
=========================================================*/

function toast(message = "", type = "success") {

    if (!UI.toastRoot) return;

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
        <div class="toast-icon">
            ${type === "success" ? "✅" :
              type === "error" ? "❌" :
              type === "warning" ? "⚠️" : "ℹ️"}
        </div>

        <div class="toast-text">

            ${message}

        </div>
    `;

    UI.toastRoot.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        },300);

    },3000);

}

/*=========================================================
    LOADING
=========================================================*/

function showLoading(){

    if(!UI.loading) return;

    State.loading = true;

    UI.loading.style.display = "flex";

    requestAnimationFrame(()=>{

        UI.loading.style.opacity = "1";

    });

}

function hideLoading(){

    if(!UI.loading) return;

    State.loading = false;

    UI.loading.style.opacity = "0";

    setTimeout(()=>{

        UI.loading.style.display = "none";

    },300);

}

/*=========================================================
    THEME
=========================================================*/

function applyTheme(){

    document.documentElement.setAttribute(

        "data-theme",

        State.theme

    );

}

function toggleTheme(){

    State.theme =

        State.theme === "dark"

        ? "light"

        : "dark";

    applyTheme();

    localStorage.setItem(

        "powertools-theme",

        State.theme

    );

}

function loadTheme(){

    const saved =

        localStorage.getItem(

            "powertools-theme"

        );

    if(saved){

        State.theme = saved;

    }

    applyTheme();

}

/*=========================================================
    SEARCH
=========================================================*/

function bindSearch(){

    const input = $("#global-search");

    if(!input) return;

    input.addEventListener("input",(e)=>{

        State.search =

            e.target.value.toLowerCase();

    });

}

/*=========================================================
    EVENT
=========================================================*/

function bindThemeButton(){

    const buttons =

        document.querySelectorAll(".icon-button");

    if(buttons.length > 1){

        buttons[1].addEventListener(

            "click",

            toggleTheme

        );

    }

}

function bindKeyboard(){

    document.addEventListener(

        "keydown",

        e=>{

            if(e.key==="Escape"){

                console.log(

                    "Escape pressed"

                );

            }

        }

    );

}

/*=========================================================
    STARTUP
=========================================================*/

function startup(){

    showLoading();

    setTimeout(()=>{

        hideLoading();

        toast(

            "PowerTools berhasil dimuat."

        );

    },600);

}

/*=========================================================
    ROUTER
=========================================================*/

function navigate(page){

    if(!page){

        page = APP.defaultPage;

    }

    if(!pageExists(page)){

        console.warn(

            `Halaman "${page}" tidak tersedia.`

        );

        page = APP.defaultPage;

    }

    showPage(page);

    location.hash = page;

}

function handleHashChange(){

    const hash =

        location.hash.replace("#","");

    if(hash===""){

        navigate(APP.defaultPage);

        return;

    }

    navigate(hash);

}

/*=========================================================
    MODULE
=========================================================*/

function registerModule(name, init){

    if(typeof init !== "function"){

        return;

    }

    try{

        init();

        console.log(

            `✔ Module : ${name}`

        );

    }

    catch(error){

        console.error(

            `✖ Module : ${name}`,

            error

        );

    }

}

/*=========================================================
    GLOBAL EVENT
=========================================================*/

function bindGlobalEvent(){

    window.addEventListener(

        "hashchange",

        handleHashChange

    );

    window.addEventListener(

        "resize",

        ()=>{

            console.log(

                "Resize",

                window.innerWidth,

                window.innerHeight

            );

        }

    );

}

/*=========================================================
    INIT
=========================================================*/

function init(){

    console.log(

        `${APP.name} ${APP.version}`

    );

    cacheElement();

    registerPages();

    loadTheme();

    bindSidebar();

    bindMenuToggle();

    bindThemeButton();

    bindSearch();

    bindKeyboard();

    bindGlobalEvent();

    startup();

    if(location.hash){

        handleHashChange();

    }else{

        navigate(APP.defaultPage);

    }

}

/*=========================================================
    PUBLIC API
=========================================================*/

window.PowerTools = {

    APP,

    State,

    UI,

    Pages,

    navigate,

    showPage,

    toast,

    showLoading,

    hideLoading,

    toggleTheme

};

/*=========================================================
    AUTO START
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    init

);
