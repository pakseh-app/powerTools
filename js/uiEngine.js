/* ============================================================
   POWERTOOLS AI CREATOR SUITE
   uiEngine.js

   User Interface Engine

   Manage:
   - Dashboard
   - Sidebar
   - Workspace
   - Preview
   - Status
   - Theme
============================================================ */



/* ============================================================
   UI ENGINE
============================================================ */

class UIEngine{

    constructor(){

        this.name =
            "PowerTools UI Engine";

        this.version =
            "1.0.0";

        this.elements = {};

        this.pages = {};

        this.panels = {};

        this.state = {

            page:"dashboard",

            loading:false,

            theme:"dark",

            sidebar:true,

            preview:true

        };

    }



/* ============================================================
   INITIALIZE
============================================================ */

init(){

    console.log(

        "Initializing UI Engine..."

    );



    this.cacheElements();

    this.registerPages();

    this.registerPanels();

    this.bindEvents();

    this.updateStatus();

}



/* ============================================================
   CACHE ELEMENTS
============================================================ */

cacheElements(){

    this.elements = {

        app:

            document.querySelector("#app"),

        sidebar:

            document.querySelector("#sidebar"),

        dashboard:

            document.querySelector("#dashboard"),

        workspace:

            document.querySelector("#workspace"),

        preview:

            document.querySelector("#preview"),

        navbar:

            document.querySelector("#navbar"),

        footer:

            document.querySelector("#footer"),

        loading:

            document.querySelector("#loading"),

        notification:

            document.querySelector("#notification")

    };

}



/* ============================================================
   REGISTER PAGES
============================================================ */

registerPages(){

    this.pages = {

        dashboard:

            document.querySelector("#dashboard"),

        prompt:

            document.querySelector("#prompt-page"),

        character:

            document.querySelector("#character-page"),

        product:

            document.querySelector("#product-page"),

        story:

            document.querySelector("#story-page"),

        scene:

            document.querySelector("#scene-page"),

        voice:

            document.querySelector("#voice-page"),

        video:

            document.querySelector("#video-page"),

        export:

            document.querySelector("#export-page")

    };

}



/* ============================================================
   REGISTER PANELS
============================================================ */

registerPanels(){

    this.panels = {

        left:

            document.querySelector("#left-panel"),

        center:

            document.querySelector("#center-panel"),

        right:

            document.querySelector("#right-panel"),

        preview:

            document.querySelector("#preview-panel"),

        toolbox:

            document.querySelector("#toolbox-panel")

    };

}



/* ============================================================
   GET ELEMENT
============================================================ */

get(id){

    return this.elements[id];

}



/* ============================================================
   GET PAGE
============================================================ */

getPage(name){

    return this.pages[name];

}



/* ============================================================
   GET PANEL
============================================================ */

getPanel(name){

    return this.panels[name];

}

/* ============================================================
   PAGE NAVIGATION
============================================================ */

showPage(pageName){

    Object.keys(this.pages).forEach(page=>{

        const element = this.pages[page];

        if(!element) return;

        element.style.display =

            page === pageName

            ? "block"

            : "none";

    });

    this.state.page = pageName;

    this.updateStatus();

}



/* ============================================================
   NEXT PAGE
============================================================ */

nextPage(){

    const list = Object.keys(this.pages);

    let index = list.indexOf(this.state.page);

    index++;

    if(index >= list.length){

        index = 0;

    }

    this.showPage(list[index]);

}



/* ============================================================
   PREVIOUS PAGE
============================================================ */

previousPage(){

    const list = Object.keys(this.pages);

    let index = list.indexOf(this.state.page);

    index--;

    if(index < 0){

        index = list.length - 1;

    }

    this.showPage(list[index]);

}



/* ============================================================
   SIDEBAR
============================================================ */

toggleSidebar(){

    const sidebar = this.get("sidebar");

    if(!sidebar) return;

    this.state.sidebar = !this.state.sidebar;

    sidebar.style.display =

        this.state.sidebar

        ? "block"

        : "none";

}



/* ============================================================
   PREVIEW PANEL
============================================================ */

togglePreview(){

    const preview = this.getPanel("preview");

    if(!preview) return;

    this.state.preview = !this.state.preview;

    preview.style.display =

        this.state.preview

        ? "block"

        : "none";

}



/* ============================================================
   PANEL
============================================================ */

showPanel(name){

    const panel = this.getPanel(name);

    if(panel){

        panel.style.display = "block";

    }

}



hidePanel(name){

    const panel = this.getPanel(name);

    if(panel){

        panel.style.display = "none";

    }

}



/* ============================================================
   THEME
============================================================ */

setTheme(theme="dark"){

    document.body.dataset.theme = theme;

    this.state.theme = theme;

}



toggleTheme(){

    if(this.state.theme === "dark"){

        this.setTheme("light");

    }

    else{

        this.setTheme("dark");

    }

}



/* ============================================================
   LOADING
============================================================ */

showLoading(message="Loading..."){

    const loading = this.get("loading");

    if(!loading) return;

    loading.style.display = "flex";

    loading.textContent = message;

    this.state.loading = true;

}



hideLoading(){

    const loading = this.get("loading");

    if(!loading) return;

    loading.style.display = "none";

    this.state.loading = false;

}



/* ============================================================
   NOTIFICATION
============================================================ */

notify(

    message,

    type="info"

){

    const box = this.get("notification");

    if(!box){

        console.log(message);

        return;

    }

    box.className =

        "notification " + type;

    box.innerHTML = message;

    box.style.display = "block";



    setTimeout(()=>{

        box.style.display = "none";

    },3000);

}



/* ============================================================
   STATUS
============================================================ */

updateStatus(){

    const footer = this.get("footer");

    if(!footer) return;

    footer.innerHTML =

        `Page : ${this.state.page}
         | Theme : ${this.state.theme}
         | Loading : ${this.state.loading}`;

}



/* ============================================================
   KEYBOARD SHORTCUT
============================================================ */

bindKeyboard(){

    document.addEventListener(

        "keydown",

        (event)=>{

            if(event.ctrlKey && event.key==="1"){

                this.showPage("dashboard");

            }



            if(event.ctrlKey && event.key==="2"){

                this.showPage("prompt");

            }



            if(event.ctrlKey && event.key==="3"){

                this.showPage("character");

            }



            if(event.ctrlKey && event.key==="b"){

                this.toggleSidebar();

            }



            if(event.ctrlKey && event.key==="p"){

                this.togglePreview();

            }



            if(event.ctrlKey && event.key==="d"){

                this.toggleTheme();

            }

        }

    );

}

  /* ============================================================
   ENGINE CONNECTOR
============================================================ */

connectEngines(){

    this.engines = {

        prompt:
            window.promptEngine,

        character:
            window.characterLock,

        product:
            window.productLock,

        scene:
            window.sceneEngine,

        story:
            window.storyEngine,

        voice:
            window.voiceEngine,

        video:
            window.videoEngine,

        integration:
            window.integrationEngine,

        export:
            window.exportEngine

    };

}



/* ============================================================
   ENGINE STATUS
============================================================ */

getEngineStatus(){

    const status = {};

    Object.keys(this.engines).forEach(name=>{

        status[name] =

            this.engines[name]

            ? "CONNECTED"

            : "OFFLINE";

    });

    return status;

}



/* ============================================================
   GENERATE
============================================================ */

generate(input={}){

    if(!this.engines.integration){

        this.notify(

            "Integration Engine not found",

            "error"

        );

        return;

    }



    this.showLoading(

        "Generating AI Project..."

    );



    try{

        const result =

            this.engines.integration.process(

                input

            );



        this.renderPreview(result);



        this.notify(

            "Generation Complete",

            "success"

        );



        this.autoSave(result);



        return result;

    }

    catch(error){

        console.error(error);

        this.notify(

            error.message,

            "error"

        );

    }

    finally{

        this.hideLoading();

    }

}



/* ============================================================
   EXPORT
============================================================ */

exportProject(format="json"){

    if(!this.engines.export){

        return;

    }



    const data =

        this.workspace || {};



    return this.engines.export.exportFile(

        data,

        format,

        "PowerTools_Project"

    );

}



/* ============================================================
   PREVIEW
============================================================ */

renderPreview(data){

    const panel =

        this.getPanel("preview");



    if(!panel){

        return;

    }



    panel.innerHTML =

`<pre>${JSON.stringify(

data,

null,

2

)}</pre>`;



    this.workspace = data;

}



/* ============================================================
   AUTO SAVE
============================================================ */

autoSave(data){

    try{

        localStorage.setItem(

            "powertools_workspace",

            JSON.stringify(data)

        );

    }

    catch(error){

        console.warn(

            "AutoSave Failed"

        );

    }

}



/* ============================================================
   RESTORE
============================================================ */

restoreWorkspace(){

    try{

        const data =

            localStorage.getItem(

                "powertools_workspace"

            );



        if(!data){

            return;

        }



        this.workspace =

            JSON.parse(data);



        this.renderPreview(

            this.workspace

        );

    }

    catch(error){

        console.warn(

            "Restore Failed"

        );

    }

}



/* ============================================================
   EVENT DISPATCHER
============================================================ */

dispatch(

    eventName,

    detail={}

){

    document.dispatchEvent(

        new CustomEvent(

            eventName,

            {

                detail

            }

        )

    );

}



/* ============================================================
   EVENT LISTENER
============================================================ */

listen(

    eventName,

    callback

){

    document.addEventListener(

        eventName,

        callback

    );

}



/* ============================================================
   BUTTON BINDER
============================================================ */

bindButtons(){

    document

    .querySelectorAll(

        "[data-action]"

    )

    .forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                const action =

                    button.dataset.action;



                switch(action){

                    case "generate":

                        this.generate();

                        break;



                    case "export-json":

                        this.exportProject(

                            "json"

                        );

                        break;



                    case "export-html":

                        this.exportProject(

                            "html"

                        );

                        break;



                    case "theme":

                        this.toggleTheme();

                        break;



                    case "sidebar":

                        this.toggleSidebar();

                        break;



                    case "preview":

                        this.togglePreview();

                        break;

                }

            }

        );

    });

}



/* ============================================================
   BIND EVENTS
============================================================ */

bindEvents(){

    this.bindKeyboard();

    this.bindButtons();

    this.restoreWorkspace();

}

  /* ============================================================
   WORKSPACE MANAGER
============================================================ */

createWorkspace(name = "Untitled Project"){

    this.workspace = {

        id: "WS_" + Date.now(),

        name,

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

        activeTab: "dashboard",

        history: [],

        data: {}

    };

    return this.workspace;

}



/* ============================================================
   UPDATE WORKSPACE
============================================================ */

updateWorkspace(key, value){

    if(!this.workspace){

        this.createWorkspace();

    }



    this.workspace.data[key] = value;

    this.workspace.updatedAt =

        new Date().toISOString();

}



/* ============================================================
   TAB MANAGER
============================================================ */

switchTab(tab){

    if(!this.pages[tab]){

        return;

    }



    this.workspace.activeTab = tab;

    this.showPage(tab);

}



/* ============================================================
   RECENT PROJECT
============================================================ */

addRecentProject(project){

    const recent =

        JSON.parse(

            localStorage.getItem(

                "powertools_recent"

            ) || "[]"

        );



    recent.unshift(project);



    localStorage.setItem(

        "powertools_recent",

        JSON.stringify(

            recent.slice(0,10)

        )

    );

}



getRecentProjects(){

    return JSON.parse(

        localStorage.getItem(

            "powertools_recent"

        ) || "[]"

    );

}



/* ============================================================
   ACTION HISTORY
============================================================ */

pushHistory(action, payload={}){

    if(!this.workspace){

        return;

    }



    this.workspace.history.push({

        action,

        payload,

        time:new Date().toISOString()

    });

}



/* ============================================================
   UNDO
============================================================ */

undo(){

    if(

        !this.workspace ||

        this.workspace.history.length===0

    ){

        return null;

    }



    return this.workspace.history.pop();

}



/* ============================================================
   REDO STACK
============================================================ */

createRedoStack(){

    this.redoStack = [];

}



redo(){

    if(

        !this.redoStack ||

        this.redoStack.length===0

    ){

        return null;

    }



    return this.redoStack.pop();

}



/* ============================================================
   SPLIT VIEW
============================================================ */

setSplitView(enable=true){

    const center =

        this.getPanel("center");



    const preview =

        this.getPanel("preview");



    if(!center || !preview){

        return;

    }



    if(enable){

        center.style.width = "50%";

        preview.style.display = "block";

        preview.style.width = "50%";

    }

    else{

        center.style.width = "100%";

        preview.style.display = "none";

    }

}



/* ============================================================
   COMMAND PALETTE
============================================================ */

openCommandPalette(){

    this.notify(

        "Command Palette (Coming Soon)",

        "info"

    );

}



/* ============================================================
   DRAG & DROP
============================================================ */

enableDragDrop(){

    const workspace =

        this.get("workspace");



    if(!workspace){

        return;

    }



    workspace.addEventListener(

        "dragover",

        event=>{

            event.preventDefault();

        }

    );



    workspace.addEventListener(

        "drop",

        event=>{

            event.preventDefault();



            const files =

                event.dataTransfer.files;



            this.dispatch(

                "asset:dropped",

                {

                    files

                }

            );



        }

    );

}



/* ============================================================
   SESSION MANAGER
============================================================ */

startSession(){

    this.session = {

        id:

            "SESSION_" + Date.now(),

        startedAt:

            new Date().toISOString()

    };

}



endSession(){

    if(!this.session){

        return;

    }



    this.session.endedAt =

        new Date().toISOString();

}



/* ============================================================
   RESIZABLE PANEL
============================================================ */

enableResizablePanels(){

    document

    .querySelectorAll(

        ".resizable"

    )

    .forEach(panel=>{

        panel.style.resize = "both";

        panel.style.overflow = "auto";

    });

}

  /* ============================================================
   UI STATISTICS
============================================================ */

getStatistics(){

    return{

        pages:

            Object.keys(this.pages).length,

        panels:

            Object.keys(this.panels).length,

        elements:

            Object.keys(this.elements).length,

        workspace:

            this.workspace

            ?

            this.workspace.name

            :

            "None",

        theme:

            this.state.theme,

        version:

            this.version

    };

}



/* ============================================================
   HEALTH CHECK
============================================================ */

healthCheck(){

    return{

        ui:true,

        integration:

            !!window.integrationEngine,

        prompt:

            !!window.promptEngine,

        character:

            !!window.characterLock,

        product:

            !!window.productLock,

        story:

            !!window.storyEngine,

        scene:

            !!window.sceneEngine,

        voice:

            !!window.voiceEngine,

        video:

            !!window.videoEngine,

        export:

            !!window.exportEngine

    };

}



/* ============================================================
   RESET UI
============================================================ */

reset(){

    this.workspace = null;

    this.pages = {};

    this.panels = {};

    this.elements = {};



    this.state = {

        page:"dashboard",

        loading:false,

        sidebar:true,

        preview:true,

        theme:"dark"

    };

}



/* ============================================================
   REFRESH UI
============================================================ */

refresh(){

    this.cacheElements();

    this.registerPages();

    this.registerPanels();

    this.updateStatus();

}



/* ============================================================
   FULL INITIALIZATION
============================================================ */

boot(){

    console.log(

        "Booting PowerTools UI..."

    );



    this.connectEngines();

    this.init();

    this.startSession();

    this.enableDragDrop();

    this.enableResizablePanels();

    this.createRedoStack();



    this.notify(

        "UI Ready",

        "success"

    );

}



/* ============================================================
   DESTROY
============================================================ */

destroy(){

    this.endSession();

    this.reset();

}



/* ============================================================
   ENGINE INFO
============================================================ */

getInfo(){

    return{

        name:

            this.name,

        version:

            this.version,

        state:

            this.state,

        statistics:

            this.getStatistics(),

        health:

            this.healthCheck()

    };

}

} // ===== END CLASS =====



/* ============================================================
   SINGLETON
============================================================ */

const uiEngine =

    new UIEngine();



/* ============================================================
   GLOBAL
============================================================ */

if(typeof window !== "undefined"){

    window.uiEngine =

        uiEngine;

}



/* ============================================================
   AUTO BOOT
============================================================ */

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        uiEngine.boot();

    }

);



/* ============================================================
   READY MESSAGE
============================================================ */

console.log(

"%c============================================",

"color:#06b6d4"

);

console.log(

"%c PowerTools AI Creator Suite",

"color:#22c55e;font-size:15px;font-weight:bold"

);

console.log(

"%c UI Engine Loaded",

"color:#38bdf8;font-weight:bold"

);

console.log(

"%c Version : 1.0.0",

"color:#facc15"

);

console.log(

"%c Status  : READY",

"color:#4ade80"

);

console.log(

"%c============================================",

"color:#06b6d4"

);
