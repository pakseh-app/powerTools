/* ============================================================
   POWERTOOLS AI CREATOR SUITE
   exportEngine.js

   Universal Export Engine

   Support:
   - TXT
   - JSON
   - Markdown
   - HTML
   - PDF
   - DOCX
   - ZIP
   - Clipboard

============================================================ */



/* ============================================================
   EXPORT ENGINE
============================================================ */

class ExportEngine {

    constructor(){

        this.name =
            "PowerTools Export Engine";

        this.version =
            "1.0.0";

        this.exports = [];

        this.history = [];

        this.settings = {

            prettyJSON: true,

            markdownTitle: true,

            htmlTheme: "dark",

            autoDownload: false,

            filePrefix: "PowerTools",

            includeTimestamp: true

        };

    }



/* ============================================================
   EXPORT REGISTRY
============================================================ */

registerExport(name, handler){

    if(typeof handler !== "function"){

        console.warn(
            "Invalid export handler:",
            name
        );

        return false;

    }

    this.exports.push({

        name,

        handler

    });

    return true;

}



/* ============================================================
   GET EXPORT LIST
============================================================ */

getExportList(){

    return this.exports.map(

        item => item.name

    );

}



/* ============================================================
   SETTINGS
============================================================ */

setSetting(key,value){

    this.settings[key]=value;

}



getSetting(key){

    return this.settings[key];

}



/* ============================================================
   CREATE FILE NAME
============================================================ */

createFileName(

    name,

    extension

){

    const prefix =
        this.settings.filePrefix;

    const timestamp =
        this.settings.includeTimestamp
        ?
        "_" +
        Date.now()
        :
        "";

    return `${prefix}_${name}${timestamp}.${extension}`;

}



/* ============================================================
   HISTORY
============================================================ */

addHistory(

    format,

    filename

){

    this.history.push({

        format,

        filename,

        exportedAt:
            new Date().toISOString()

    });

}



getHistory(){

    return this.history;

}



/* ============================================================
   CLEAR HISTORY
============================================================ */

clearHistory(){

    this.history=[];

}

/* ============================================================
   UNIVERSAL SERIALIZER
============================================================ */

serialize(data, format = "json"){

    switch(format.toLowerCase()){

        case "json":
            return this.buildJSON(data);

        case "txt":
            return this.buildTXT(data);

        case "md":
        case "markdown":
            return this.buildMarkdown(data);

        case "html":
            return this.buildHTML(data);

        default:
            return JSON.stringify(data, null, 2);

    }

}



/* ============================================================
   DATA CLEANER
============================================================ */

cleanData(data){

    if(data === undefined || data === null){

        return {};

    }

    return JSON.parse(

        JSON.stringify(data)

    );

}



/* ============================================================
   METADATA
============================================================ */

generateMetadata(){

    return {

        engine : this.name,

        version : this.version,

        exportedAt :

            new Date().toISOString()

    };

}



/* ============================================================
   JSON BUILDER
============================================================ */

buildJSON(data){

    const payload = {

        metadata :

            this.generateMetadata(),

        content :

            this.cleanData(data)

    };



    return this.settings.prettyJSON

        ?

        JSON.stringify(

            payload,

            null,

            2

        )

        :

        JSON.stringify(payload);

}



/* ============================================================
   TXT BUILDER
============================================================ */

buildTXT(data){

    const meta =

        this.generateMetadata();



    let txt = "";



    txt +=

`========================================
POWERTOOLS AI CREATOR SUITE
========================================

Engine  : ${meta.engine}
Version : ${meta.version}
Export  : ${meta.exportedAt}

========================================

`;



    txt +=

        JSON.stringify(

            this.cleanData(data),

            null,

            2

        );



    return txt;

}



/* ============================================================
   MARKDOWN BUILDER
============================================================ */

buildMarkdown(data){

    const meta =

        this.generateMetadata();



    let md = "";



    if(this.settings.markdownTitle){

        md +=

`# PowerTools AI Creator Suite

`;

    }



    md +=

`**Engine:** ${meta.engine}

**Version:** ${meta.version}

**Exported:** ${meta.exportedAt}

---

`;



    md +=

"```json\n";



    md +=

JSON.stringify(

    this.cleanData(data),

    null,

    2

);



    md +=

"\n```\n";



    return md;

}



/* ============================================================
   HTML BUILDER
============================================================ */

buildHTML(data){

    const meta =

        this.generateMetadata();



    const theme =

        this.settings.htmlTheme;



    const background =

        theme === "dark"

        ? "#111827"

        : "#ffffff";



    const color =

        theme === "dark"

        ? "#f3f4f6"

        : "#111111";



    return `<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>PowerTools Export</title>

<style>

body{

font-family:Arial,sans-serif;

padding:40px;

background:${background};

color:${color};

}

pre{

padding:20px;

border-radius:8px;

overflow:auto;

background:#1f2937;

}

</style>

</head>

<body>

<h1>PowerTools AI Creator Suite</h1>

<p><strong>Engine:</strong> ${meta.engine}</p>

<p><strong>Version:</strong> ${meta.version}</p>

<p><strong>Exported:</strong> ${meta.exportedAt}</p>

<hr>

<pre>${JSON.stringify(

this.cleanData(data),

null,

2

)}</pre>

</body>

</html>`;

}

  /* ============================================================
   DOWNLOAD MANAGER
============================================================ */

download(

    content,

    filename,

    mimeType = "text/plain"

){

    const blob = new Blob(

        [content],

        { type: mimeType }

    );



    const url =

        URL.createObjectURL(blob);



    const link =

        document.createElement("a");



    link.href = url;

    link.download = filename;



    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);



    URL.revokeObjectURL(url);



    return filename;

}



/* ============================================================
   EXPORT FILE
============================================================ */

exportFile(

    data,

    format = "json",

    fileName = "export"

){

    let content = "";

    let extension = "";

    let mime = "text/plain";



    switch(format.toLowerCase()){

        case "json":

            content = this.buildJSON(data);

            extension = "json";

            mime = "application/json";

            break;



        case "txt":

            content = this.buildTXT(data);

            extension = "txt";

            mime = "text/plain";

            break;



        case "markdown":

        case "md":

            content = this.buildMarkdown(data);

            extension = "md";

            mime = "text/markdown";

            break;



        case "html":

            content = this.buildHTML(data);

            extension = "html";

            mime = "text/html";

            break;



        default:

            throw new Error(

                "Unsupported export format."

            );

    }



    const filename =

        this.createFileName(

            fileName,

            extension

        );



    this.download(

        content,

        filename,

        mime

    );



    this.addHistory(

        format,

        filename

    );



    return {

        success:true,

        filename,

        format

    };

}



/* ============================================================
   EXPORT MULTIPLE FORMAT
============================================================ */

exportMultiple(

    data,

    formats = []

){

    const result = [];



    formats.forEach(format=>{

        try{

            result.push(

                this.exportFile(

                    data,

                    format,

                    "PowerTools"

                )

            );

        }

        catch(error){

            result.push({

                success:false,

                format,

                error:error.message

            });

        }

    });



    return result;

}



/* ============================================================
   EXPORT QUEUE
============================================================ */

createQueue(){

    this.queue = [];

}



/* ============================================================
   ADD QUEUE
============================================================ */

queueExport(

    data,

    format,

    fileName

){

    if(!this.queue){

        this.createQueue();

    }



    this.queue.push({

        data,

        format,

        fileName

    });

}



/* ============================================================
   PROCESS QUEUE
============================================================ */

processQueue(){

    if(!this.queue){

        return [];

    }



    const results = [];



    while(this.queue.length){

        const item =

            this.queue.shift();



        results.push(

            this.exportFile(

                item.data,

                item.format,

                item.fileName

            )

        );

    }



    return results;

}



/* ============================================================
   COPY TO CLIPBOARD
============================================================ */

async copyToClipboard(data){

    const text =

        typeof data === "string"

        ?

        data

        :

        JSON.stringify(

            data,

            null,

            2

        );



    try{

        await navigator.clipboard.writeText(text);



        return {

            success:true

        };

    }

    catch(error){

        return{

            success:false,

            error:error.message

        };

    }

}



/* ============================================================
   PROGRESS INFO
============================================================ */

getProgress(){

    return{

        queue:

            this.queue

            ?

            this.queue.length

            :

            0,



        exported:

            this.history.length

    };

}

  /* ============================================================
   AI PROVIDER EXPORT
============================================================ */

buildProviderBundle(data){

    return {

        metadata: this.generateMetadata(),

        prompt: data.prompt || "",

        character: data.character || {},

        product: data.product || {},

        story: data.story || {},

        scene: data.scene || {},

        voice: data.voice || {},

        video: data.video || {}

    };

}



/* ============================================================
   CHATGPT EXPORT
============================================================ */

exportChatGPT(data){

    return {

        provider: "ChatGPT",

        content: this.buildTXT(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   GEMINI EXPORT
============================================================ */

exportGemini(data){

    return {

        provider: "Gemini",

        content: this.buildTXT(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   CLAUDE EXPORT
============================================================ */

exportClaude(data){

    return {

        provider: "Claude",

        content: this.buildTXT(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   LEONARDO EXPORT
============================================================ */

exportLeonardo(data){

    return {

        provider: "Leonardo AI",

        content: this.buildMarkdown(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   MIDJOURNEY EXPORT
============================================================ */

exportMidjourney(data){

    return {

        provider: "Midjourney",

        content: this.buildTXT(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   FLUX EXPORT
============================================================ */

exportFlux(data){

    return {

        provider: "FLUX",

        content: this.buildTXT(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   KLING EXPORT
============================================================ */

exportKling(data){

    return {

        provider: "Kling AI",

        content: this.buildMarkdown(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   VEO EXPORT
============================================================ */

exportVeo(data){

    return {

        provider: "Google Veo",

        content: this.buildMarkdown(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   RUNWAY EXPORT
============================================================ */

exportRunway(data){

    return {

        provider: "Runway",

        content: this.buildMarkdown(

            this.buildProviderBundle(data)

        )

    };

}



/* ============================================================
   PROMPT BUNDLE
============================================================ */

buildPromptBundle(data){

    return {

        imagePrompt:

            data.prompt || "",

        storyboard:

            data.story || {},

        sceneData:

            data.scene || {},

        narration:

            data.voice || {},

        videoPrompt:

            data.video || {},

        character:

            data.character || {},

        product:

            data.product || {}

    };

}



/* ============================================================
   EXPORT ALL PROVIDERS
============================================================ */

exportAllProviders(data){

    return {

        chatgpt:

            this.exportChatGPT(data),

        gemini:

            this.exportGemini(data),

        claude:

            this.exportClaude(data),

        leonardo:

            this.exportLeonardo(data),

        midjourney:

            this.exportMidjourney(data),

        flux:

            this.exportFlux(data),

        kling:

            this.exportKling(data),

        veo:

            this.exportVeo(data),

        runway:

            this.exportRunway(data)

    };

}



/* ============================================================
   PACKAGE SUMMARY
============================================================ */

buildSummary(data){

    return {

        exportedAt:

            new Date().toISOString(),

        providerCount: 9,

        promptLength:

            (data.prompt || "").length,

        hasCharacter:

            !!data.character,

        hasStory:

            !!data.story,

        hasScene:

            !!data.scene,

        hasVoice:

            !!data.voice,

        hasVideo:

            !!data.video

    };

}

  /* ============================================================
   PROJECT MANIFEST
============================================================ */

buildManifest(project = {}){

    return {

        projectName:

            project.name || "PowerTools Project",

        version:

            this.version,

        createdAt:

            new Date().toISOString(),

        engine:

            this.name,

        modules:[

            "promptEngine",

            "characterLock",

            "productLock",

            "sceneEngine",

            "storyEngine",

            "voiceEngine",

            "videoEngine",

            "integrationEngine",

            "exportEngine"

        ]

    };

}



/* ============================================================
   SAVE PROJECT
============================================================ */

saveProject(projectData){

    return {

        manifest:

            this.buildManifest(projectData),

        data:

            this.cleanData(projectData)

    };

}



/* ============================================================
   LOAD PROJECT
============================================================ */

loadProject(project){

    if(!project){

        return null;

    }

    return project.data || {};

}



/* ============================================================
   BACKUP
============================================================ */

createBackup(projectData){

    return {

        backupId:

            "BKP_" + Date.now(),

        createdAt:

            new Date().toISOString(),

        payload:

            this.saveProject(projectData)

    };

}



/* ============================================================
   RESTORE
============================================================ */

restoreBackup(backup){

    if(

        !backup ||

        !backup.payload

    ){

        return null;

    }

    return backup.payload.data;

}



/* ============================================================
   EXPORT STATISTICS
============================================================ */

getStatistics(){

    return {

        totalExport:

            this.history.length,

        registeredExporter:

            this.exports.length,

        queue:

            this.queue

            ?

            this.queue.length

            :

            0,

        version:

            this.version

    };

}



/* ============================================================
   RESET ENGINE
============================================================ */

reset(){

    this.history = [];

    this.exports = [];

    this.queue = [];

}



/* ============================================================
   ENGINE INFO
============================================================ */

getInfo(){

    return {

        name:

            this.name,

        version:

            this.version,

        settings:

            this.settings,

        statistics:

            this.getStatistics()

    };

}

} // ===== END CLASS =====



/* ============================================================
   SINGLETON
============================================================ */

const exportEngine =
    new ExportEngine();



/* ============================================================
   GLOBAL
============================================================ */

if(typeof window !== "undefined"){

    window.exportEngine =
        exportEngine;

}



/* ============================================================
   AUTO CONNECT
============================================================ */

if(

    typeof window !== "undefined" &&

    window.integrationEngine &&

    typeof window.integrationEngine.registerEngine === "function"

){

    window.integrationEngine.registerEngine(

        "export",

        exportEngine

    );

}



/* ============================================================
   READY
============================================================ */

console.log(

"%c==========================================",

"color:#06b6d4"

);

console.log(

"%c PowerTools AI Creator Suite",

"color:#22c55e;font-weight:bold;font-size:15px"

);

console.log(

"%c Export Engine Loaded",

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

"%c==========================================",

"color:#06b6d4"

);
