/*==========================================================
    POWERTOOLS
    Ultimate AI Creator Suite

    app.js

    Version : 1.0 Alpha
==========================================================*/

"use strict";

/*==========================================================
    APP
==========================================================*/

const PowerTools = {

    version: "1.0.0",

    name: "PowerTools",

    author: "PowerTools Team",

    started: false,

    loading: true,

    darkMode: true,

    currentPage: "dashboard",

    currentModule: "",

    language: "id",

    projects: [],

    templates: [],

    history: [],

    favorites: [],

    notifications: [],

    clipboard: [],

    engines: {},

    modules: {},

    cache: {},

    ui: {},

    data: {}

};

/*==========================================================
    SELECTOR
==========================================================*/

const $ = (selector)=>{

    return document.querySelector(selector);

};

const $$ = (selector)=>{

    return document.querySelectorAll(selector);

};

/*==========================================================
    READY
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        bootPowerTools();

    }

);

/*==========================================================
    BOOT
==========================================================*/

function bootPowerTools(){

    console.clear();

    console.log(

        "%c⚡ PowerTools",

        "color:#38bdf8;font-size:20px;font-weight:bold;"

    );

    console.log(

        "%cUltimate AI Creator Suite",

        "color:#22c55e;font-size:14px;"

    );

    console.log(

        "Version",

        PowerTools.version

    );

    PowerTools.started=true;

    initialize();

}

/*==========================================================
    INITIALIZE
==========================================================*/

function initialize(){

    cacheElements();

    registerEvents();

    initializeModules();

    initializeWorkspace();

    initializeHistory();

    initializeTemplates();

    initializeSettings();

    hideLoading();

}

/*==========================================================
    CACHE
==========================================================*/

function cacheElements(){

    PowerTools.ui.app=$("#app");

    PowerTools.ui.sidebar=$("#sidebar");

    PowerTools.ui.main=$("#main");

    PowerTools.ui.page=$("#page-content");

    PowerTools.ui.loading=$("#loading-screen");

    PowerTools.ui.toast=$("#toast-root");

    PowerTools.ui.modal=$("#modal-root");

}

/*==========================================================
    EVENT
==========================================================*/

function registerEvents(){

    window.addEventListener(

        "resize",

        handleResize

    );

}

/*==========================================================
    LOADING
==========================================================*/

function hideLoading(){

    if(!PowerTools.ui.loading)return;

    setTimeout(()=>{

        PowerTools.ui.loading.style.opacity="0";

        setTimeout(()=>{

            PowerTools.ui.loading.style.display="none";

        },500);

    },1200);

}

/*==========================================================
    ROUTER
==========================================================*/

function navigate(page){

    if(!page) return;

    PowerTools.currentPage = page;

    updatePageTitle(page);

    activateMenu(page);

    loadModule(page);

}

function updatePageTitle(page){

    const title = document.querySelector("#topbar h1");

    if(!title) return;

    title.textContent = capitalize(page);

}

function activateMenu(page){

    document
        .querySelectorAll(".menu-item")
        .forEach(item=>{

            item.classList.remove("active");

            if(item.dataset.page===page){

                item.classList.add("active");

            }

        });

}

function capitalize(text){

    return text.charAt(0).toUpperCase()+text.slice(1);

}

/*==========================================================
    MODULE LOADER
==========================================================*/

function loadModule(name){

    console.log(

        "Loading Module :",

        name

    );

    if(

        PowerTools.modules[name]

    ){

        PowerTools.modules[name]();

        return;

    }

    console.warn(

        "Module belum tersedia."

    );

}

/*==========================================================
    MODULE REGISTER
==========================================================*/

function registerModule(

    name,

    callback

){

    PowerTools.modules[name]=callback;

}

/*==========================================================
    STORAGE
==========================================================*/

const Storage={

    save(key,value){

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },

    load(key,defaultValue=[]){

        const data=

            localStorage.getItem(key);

        if(!data)

            return defaultValue;

        try{

            return JSON.parse(data);

        }

        catch(e){

            return defaultValue;

        }

    },

    remove(key){

        localStorage.removeItem(key);

    },

    clear(){

        localStorage.clear();

    }

};

/*==========================================================
    SETTINGS
==========================================================*/

function initializeSettings(){

    PowerTools.darkMode=

        Storage.load(

            "darkMode",

            true

        );

}

/*==========================================================
    WORKSPACE
==========================================================*/

function initializeWorkspace(){

    PowerTools.projects=

        Storage.load(

            "projects",

            []

        );

}

function saveWorkspace(){

    Storage.save(

        "projects",

        PowerTools.projects

    );

}

/*==========================================================
    TEMPLATE
==========================================================*/

function initializeTemplates(){

    PowerTools.templates=[];

}

/*==========================================================
    HISTORY
==========================================================*/

function initializeHistory(){

    PowerTools.history=

        Storage.load(

            "history",

            []

        );

}

function addHistory(data){

    PowerTools.history.unshift(data);

    if(

        PowerTools.history.length>100

    ){

        PowerTools.history.pop();

    }

    Storage.save(

        "history",

        PowerTools.history

    );

}

/*==========================================================
    RESIZE
==========================================================*/

function handleResize(){

    console.log(

        "Window :",

        window.innerWidth,

        "x",

        window.innerHeight

    );

}

/*==========================================================
    TOAST ENGINE
==========================================================*/

function showToast(

    message,

    type="info",

    duration=3000

){

    if(!PowerTools.ui.toast) return;

    const toast=document.createElement("div");

    toast.className=`toast toast-${type}`;

    toast.innerHTML=`

        <div class="toast-icon">

            ${getToastIcon(type)}

        </div>

        <div class="toast-message">

            ${message}

        </div>

    `;

    PowerTools.ui.toast.appendChild(toast);

    requestAnimationFrame(()=>{

        toast.classList.add("show");

    });

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },duration);

}

function getToastIcon(type){

    switch(type){

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

/*==========================================================
    MODAL ENGINE
==========================================================*/

function openModal(

    title,

    content

){

    if(!PowerTools.ui.modal) return;

    PowerTools.ui.modal.innerHTML=`

        <div class="modal-overlay">

            <div class="modal-window">

                <div class="modal-header">

                    <h2>${title}</h2>

                    <button id="modal-close">

                        ✕

                    </button>

                </div>

                <div class="modal-body">

                    ${content}

                </div>

            </div>

        </div>

    `;

    document

        .querySelector("#modal-close")

        .onclick=closeModal;

}

function closeModal(){

    if(!PowerTools.ui.modal) return;

    PowerTools.ui.modal.innerHTML="";

}

/*==========================================================
    CLIPBOARD
==========================================================*/

async function copyText(text){

    try{

        await navigator.clipboard.writeText(text);

        PowerTools.clipboard.push(text);

        showToast(

            "Prompt berhasil disalin",

            "success"

        );

    }

    catch(error){

        console.error(error);

        showToast(

            "Gagal menyalin",

            "error"

        );

    }

}

/*==========================================================
    EXPORT TXT
==========================================================*/

function exportTXT(

    filename,

    content

){

    const blob=new Blob(

        [content],

        {

            type:"text/plain"

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=filename+".txt";

    a.click();

    URL.revokeObjectURL(url);

}

/*==========================================================
    EXPORT JSON
==========================================================*/

function exportJSON(

    filename,

    data

){

    const blob=new Blob(

        [

            JSON.stringify(

                data,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=filename+".json";

    a.click();

    URL.revokeObjectURL(url);

}

/*==========================================================
    IMPORT JSON
==========================================================*/

function importJSON(file){

    return new Promise(

        (resolve,reject)=>{

            const reader=new FileReader();

            reader.onload=()=>{

                try{

                    resolve(

                        JSON.parse(

                            reader.result

                        )

                    );

                }

                catch(error){

                    reject(error);

                }

            };

            reader.onerror=reject;

            reader.readAsText(file);

        }

    );

}

/*==========================================================
    EVENT BUS
==========================================================*/

const EventBus={

    events:{},

    on(event,callback){

        if(!this.events[event]){

            this.events[event]=[];

        }

        this.events[event].push(callback);

    },

    emit(event,data){

        if(!this.events[event]) return;

        this.events[event].forEach(callback=>{

            callback(data);

        });

    },

    off(event){

        delete this.events[event];

    }

};

/*==========================================================
    STARTUP MESSAGE
==========================================================*/

console.log(

    "%cPowerTools Engine Ready",

    "color:#22c55e;font-weight:bold;font-size:15px"

);

/*==========================================================
    PROMPT ENGINE CORE
==========================================================*/

const PromptEngine={

    version:"1.0",

    categories:[],

    styles:[],

    cameras:[],

    lightings:[],

    ratios:[],

    platforms:[],

    initialized:false

};

/*==========================================================
    INITIALIZE PROMPT ENGINE
==========================================================*/

function initializePromptEngine(){

    PromptEngine.categories=[

        {

            id:"food",

            keywords:[

                "bakso",

                "mie",

                "ayam",

                "sate",

                "es",

                "kopi",

                "minuman",

                "jus",

                "burger",

                "pizza",

                "warung",

                "cafe"

            ]

        },

        {

            id:"fashion",

            keywords:[

                "baju",

                "kaos",

                "hoodie",

                "sepatu",

                "tas",

                "fashion"

            ]

        },

        {

            id:"property",

            keywords:[

                "rumah",

                "tanah",

                "villa",

                "kost",

                "apartemen"

            ]

        },

        {

            id:"barbershop",

            keywords:[

                "barber",

                "haircut",

                "pomade",

                "hair tonic"

            ]

        },

        {

            id:"automotive",

            keywords:[

                "motor",

                "mobil",

                "helm",

                "oli",

                "ban"

            ]

        };

    PromptEngine.styles=[

        "Ultra Realistic",

        "Commercial Advertising",

        "Luxury",

        "Cinematic",

        "Professional Photography",

        "Studio Lighting",

        "Premium Branding",

        "HDR",

        "8K",

        "Hyper Detail"

    ];

    PromptEngine.cameras=[

        "Canon EOS R5",

        "Sony A7R V",

        "Nikon Z9",

        "RED Komodo",

        "ARRI Alexa Mini"

    ];

    PromptEngine.lightings=[

        "Soft Lighting",

        "Golden Hour",

        "Studio Lighting",

        "Natural Light",

        "Volumetric Lighting"

    ];

    PromptEngine.ratios=[

        "1:1",

        "4:5",

        "16:9",

        "9:16",

        "A4",

        "Banner"

    ];

    PromptEngine.platforms=[

        "ChatGPT",

        "Gemini",

        "Leonardo",

        "Midjourney",

        "Flux",

        "Imagen",

        "Ideogram",

        "Firefly",

        "Kling",

        "Veo",

        "Runway"

    ];

    PromptEngine.initialized=true;

}

/*==========================================================
    DETECT CATEGORY
==========================================================*/

function detectCategory(text){

    text=text.toLowerCase();

    for(const category of PromptEngine.categories){

        for(const keyword of category.keywords){

            if(text.includes(keyword)){

                return category.id;

            }

        }

    }

    return "general";

}

/*==========================================================
    CATEGORY PROFILE
==========================================================*/

function getCategoryProfile(category){

    const profile={

        style:"Commercial Advertising",

        camera:"Canon EOS R5",

        lighting:"Studio Lighting",

        ratio:"4:5"

    };

    switch(category){

        case "food":

            profile.style="Food Photography";

            profile.camera="Canon EOS R5";

            profile.lighting="Warm Restaurant Lighting";

            profile.ratio="4:5";

            break;

        case "fashion":

            profile.style="Luxury Fashion";

            profile.camera="Sony A7R V";

            profile.lighting="Soft Lighting";

            profile.ratio="4:5";

            break;

        case "property":

            profile.style="Luxury Real Estate";

            profile.camera="Canon EOS R5";

            profile.lighting="Golden Hour";

            profile.ratio="16:9";

            break;

        case "barbershop":

            profile.style="Barbershop Commercial";

            profile.camera="Sony A7R V";

            profile.lighting="Studio Lighting";

            profile.ratio="4:5";

            break;

    }

    return profile;

}

/*==========================================================
    START PROMPT ENGINE
==========================================================*/

initializePromptEngine();

console.log(

    "%cPrompt Engine Loaded",

    "color:#38bdf8;font-weight:bold"

);

/*==========================================================
    SMART PROMPT BUILDER
==========================================================*/

function generatePrompt(userInput){

    const category = detectCategory(userInput);

    const profile = getCategoryProfile(category);

    const result = {

        input:userInput,

        category,

        profile,

        prompt:"",

        negativePrompt:"",

        cameraPrompt:"",

        lightingPrompt:"",

        stylePrompt:"",

        platforms:{}

    };

    result.stylePrompt = buildStylePrompt(profile);

    result.cameraPrompt = buildCameraPrompt(profile);

    result.lightingPrompt = buildLightingPrompt(profile);

    result.negativePrompt = buildNegativePrompt(category);

    result.prompt = buildMasterPrompt(

        userInput,

        result

    );

    buildPlatformPrompts(result);

    addHistory(result);

    return result;

}

/*==========================================================
    STYLE
==========================================================*/

function buildStylePrompt(profile){

    return [

        profile.style,

        "Ultra Realistic",

        "Professional Advertising",

        "Highly Detailed",

        "8K",

        "Commercial Quality"

    ].join(", ");

}

/*==========================================================
    CAMERA
==========================================================*/

function buildCameraPrompt(profile){

    return [

        profile.camera,

        "85mm Lens",

        "HDR",

        "RAW",

        "Sharp Focus",

        "Depth of Field"

    ].join(", ");

}

/*==========================================================
    LIGHTING
==========================================================*/

function buildLightingPrompt(profile){

    return [

        profile.lighting,

        "Soft Shadow",

        "Natural Reflection",

        "Balanced Exposure"

    ].join(", ");

}

/*==========================================================
    NEGATIVE
==========================================================*/

function buildNegativePrompt(category){

    return [

        "low quality",

        "blurry",

        "pixelated",

        "noise",

        "watermark",

        "logo",

        "text",

        "cropped",

        "duplicate",

        "deformed",

        "bad anatomy",

        "bad hands",

        "extra fingers",

        "mutation",

        "oversaturated"

    ].join(", ");

}

/*==========================================================
    MASTER PROMPT
==========================================================*/

function buildMasterPrompt(

    userInput,

    result

){

    return `

${userInput},

${result.stylePrompt},

${result.cameraPrompt},

${result.lightingPrompt},

commercial composition,

premium branding,

award winning photography,

ultra realistic,

cinematic,

extremely detailed,

professional color grading

`.trim();

}

/*==========================================================
    PLATFORM PROMPT
==========================================================*/

function buildPlatformPrompts(result){

    const prompt = result.prompt;

    result.platforms.ChatGPT = prompt;

    result.platforms.Leonardo = prompt;

    result.platforms.Gemini = prompt;

    result.platforms.Midjourney = prompt;

    result.platforms.Flux = prompt;

    result.platforms.Imagen = prompt;

    result.platforms.Ideogram = prompt;

    result.platforms.Firefly = prompt;

    result.platforms.Kling = prompt;

    result.platforms.Veo = prompt;

    result.platforms.Runway = prompt;

}

/*==========================================================
    COPY
==========================================================*/

function copyPlatformPrompt(platform,result){

    if(

        !result.platforms[platform]

    ) return;

    copyText(

        result.platforms[platform]

    );

}

/*==========================================================
    TEST
==========================================================*/

console.log(

    "%cSmart Prompt Builder Ready",

    "color:#22c55e;font-size:14px;font-weight:bold;"

);

/*==========================================================
    AUTO START
==========================================================*/

(function(){

    console.log(

        "%c==========================================",

        "color:#38bdf8"

    );

    console.log(

        "%c PowerTools AI Creator Suite ",

        "color:#22c55e;font-size:18px;font-weight:bold"

    );

    console.log(

        "%c Version : " + PowerTools.version,

        "color:#facc15"

    );

    console.log(

        "%c Status  : Ready",

        "color:#22c55e"

    );

    console.log(

        "%c==========================================",

        "color:#38bdf8"

    );

})();

/*==========================================================
    END OF FILE

    PowerTools
    Ultimate AI Creator Suite

    app.js
    Version : 1.0 Alpha

==========================================================*/

