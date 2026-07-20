/* ============================================================
   POWERTOOLS AI CREATOR SUITE
   integrationEngine.js

   Master Controller Engine

   Connect:
   - promptEngine
   - characterLock
   - productLock
   - sceneEngine
   - voiceEngine
   - storyEngine
   - videoEngine

============================================================ */


/* ============================================================
   GLOBAL ENGINE REGISTRY
============================================================ */

const PowerToolsRegistry = {

    prompt: null,

    character: null,

    product: null,

    scene: null,

    voice: null,

    story: null,

    video: null

};



/* ============================================================
   ENGINE CONNECTOR
============================================================ */

class IntegrationEngine {


    constructor(){

        this.name =
        "PowerTools AI Creator Suite Integration Engine";


        this.version =
        "1.0.0";


        this.pipeline = [];


        this.status =
        "initialized";


    }



/* ============================================================
   REGISTER ENGINE
============================================================ */

registerEngine(
    engineName,
    engineInstance
){

    if(!engineName){

        console.warn(
        "Engine name missing"
        );

        return false;

    }


    PowerToolsRegistry[engineName]
    =
    engineInstance;


    console.log(
        "Connected:",
        engineName
    );


    return true;

}



/* ============================================================
   CHECK ENGINE STATUS
============================================================ */

checkEngines(){


    const result = {};


    Object.keys(
        PowerToolsRegistry
    )
    .forEach(key=>{


        result[key] =
        PowerToolsRegistry[key]
        ?
        "CONNECTED"
        :
        "NOT CONNECTED";


    });



    return result;


}

/* ============================================================
   PIPELINE ORCHESTRATOR
============================================================ */

buildPipeline() {

    this.pipeline = [

        "prompt",

        "character",

        "product",

        "story",

        "scene",

        "voice",

        "video"

    ];

    return this.pipeline;

}



/* ============================================================
   RESET PIPELINE
============================================================ */

resetPipeline(){

    this.pipeline = [];

    this.status = "idle";

}



/* ============================================================
   EXECUTE PIPELINE
============================================================ */

runPipeline(input = {}){

    const output = {

        source: input,

        result: {}

    };

    this.status = "running";



    for(const engineName of this.pipeline){

        const engine = PowerToolsRegistry[engineName];



        if(!engine){

            console.warn(

                `Engine "${engineName}" not connected.`

            );

            continue;

        }



        try{

            if(typeof engine.process === "function"){

                output.result[engineName] =

                    engine.process(output);

            }

            else if(typeof engine.generate === "function"){

                output.result[engineName] =

                    engine.generate(output);

            }

            else{

                output.result[engineName] =

                    engine;

            }

        }

        catch(error){

            console.error(

                `Pipeline Error (${engineName})`,

                error

            );



            output.result[engineName] = {

                success:false,

                error:error.message

            };

        }

    }



    this.status = "completed";



    return output;

}



/* ============================================================
   GET PIPELINE STATUS
============================================================ */

getStatus(){

    return{

        engine:this.name,

        version:this.version,

        status:this.status,

        connected:this.checkEngines(),

        pipeline:this.pipeline

    };

}

   /* ============================================================
   UNIFIED DATA MANAGER
============================================================ */

createSession(initialData = {}){

    this.session = {

        id: "PTS-" + Date.now(),

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

        data: {

            userInput: initialData,

            prompt: {},

            character: {},

            product: {},

            story: {},

            scene: {},

            voice: {},

            video: {},

            export: {}

        }

    };

    return this.session;

}



/* ============================================================
   GET SESSION
============================================================ */

getSession(){

    return this.session;

}



/* ============================================================
   UPDATE SESSION
============================================================ */

updateSection(section, value){

    if(!this.session){

        this.createSession();

    }

    this.session.data[section] = {

        ...this.session.data[section],

        ...value

    };

    this.session.updatedAt =

        new Date().toISOString();

}



/* ============================================================
   READ SECTION
============================================================ */

getSection(section){

    if(!this.session){

        return {};

    }

    return this.session.data[section] || {};

}



/* ============================================================
   SHARED MEMORY
============================================================ */

createSharedMemory(){

    this.sharedMemory = {

        characterLock: null,

        productLock: null,

        storyContext: null,

        sceneContext: null,

        voiceProfile: null,

        videoProfile: null,

        metadata: {}

    };

}



/* ============================================================
   WRITE MEMORY
============================================================ */

memorySet(key, value){

    if(!this.sharedMemory){

        this.createSharedMemory();

    }

    this.sharedMemory[key] = value;

}



/* ============================================================
   READ MEMORY
============================================================ */

memoryGet(key){

    if(!this.sharedMemory){

        this.createSharedMemory();

    }

    return this.sharedMemory[key];

}



/* ============================================================
   CONTEXT SYNCHRONIZER
============================================================ */

syncContext(){

    if(!this.session){

        return;

    }

    this.memorySet(

        "characterLock",

        this.getSection("character")

    );



    this.memorySet(

        "productLock",

        this.getSection("product")

    );



    this.memorySet(

        "storyContext",

        this.getSection("story")

    );



    this.memorySet(

        "sceneContext",

        this.getSection("scene")

    );



    this.memorySet(

        "voiceProfile",

        this.getSection("voice")

    );



    this.memorySet(

        "videoProfile",

        this.getSection("video")

    );

}



/* ============================================================
   BUILD GLOBAL CONTEXT
============================================================ */

buildContext(){

    return {

        sessionId: this.session?.id,

        prompt: this.getSection("prompt"),

        character: this.memoryGet("characterLock"),

        product: this.memoryGet("productLock"),

        story: this.memoryGet("storyContext"),

        scene: this.memoryGet("sceneContext"),

        voice: this.memoryGet("voiceProfile"),

        video: this.memoryGet("videoProfile")

    };

}

/* ============================================================
   MASTER INTEGRATION PROCESSOR
============================================================ */

process(input = {}){

    /* ---------------------------------------
       CREATE SESSION
    --------------------------------------- */

    this.createSession(input);

    this.createSharedMemory();

    this.buildPipeline();



    const context = this.buildContext();

    const result = {

        success: true,

        engines: {},

        context

    };



    /* ---------------------------------------
       PROMPT ENGINE
    --------------------------------------- */

    if(PowerToolsRegistry.prompt){

        const output =

            this.executeEngine(

                "prompt",

                input,

                context

            );



        this.updateSection(

            "prompt",

            output

        );



        result.engines.prompt = output;

    }



    /* ---------------------------------------
       CHARACTER ENGINE
    --------------------------------------- */

    if(PowerToolsRegistry.character){

        const output =

            this.executeEngine(

                "character",

                this.getSection("prompt"),

                this.buildContext()

            );



        this.updateSection(

            "character",

            output

        );



        result.engines.character = output;

    }



    /* ---------------------------------------
       PRODUCT ENGINE
    --------------------------------------- */

    if(PowerToolsRegistry.product){

        const output =

            this.executeEngine(

                "product",

                this.buildContext(),

                this.buildContext()

            );



        this.updateSection(

            "product",

            output

        );



        result.engines.product = output;

    }



    /* ---------------------------------------
       STORY ENGINE
    --------------------------------------- */

    if(PowerToolsRegistry.story){

        const output =

            this.executeEngine(

                "story",

                this.buildContext(),

                this.buildContext()

            );



        this.updateSection(

            "story",

            output

        );



        result.engines.story = output;

    }



    /* ---------------------------------------
       SCENE ENGINE
    --------------------------------------- */

    if(PowerToolsRegistry.scene){

        const output =

            this.executeEngine(

                "scene",

                this.buildContext(),

                this.buildContext()

            );



        this.updateSection(

            "scene",

            output

        );



        result.engines.scene = output;

    }



    /* ---------------------------------------
       VOICE ENGINE
    --------------------------------------- */

    if(PowerToolsRegistry.voice){

        const output =

            this.executeEngine(

                "voice",

                this.buildContext(),

                this.buildContext()

            );



        this.updateSection(

            "voice",

            output

        );



        result.engines.voice = output;

    }



    /* ---------------------------------------
       VIDEO ENGINE
    --------------------------------------- */

    if(PowerToolsRegistry.video){

        const output =

            this.executeEngine(

                "video",

                this.buildContext(),

                this.buildContext()

            );



        this.updateSection(

            "video",

            output

        );



        result.engines.video = output;

    }



    /* ---------------------------------------
       SYNCHRONIZE
    --------------------------------------- */

    this.syncContext();



    result.context =

        this.buildContext();



    result.package =

        this.buildFinalPackage();



    result.validation =

        this.validatePackage();



    return result;

}



/* ============================================================
   ENGINE EXECUTOR
============================================================ */

executeEngine(

    engineName,

    data,

    context

){

    const engine =

        PowerToolsRegistry[engineName];



    if(!engine){

        return {};

    }



    if(typeof engine.process === "function"){

        return engine.process(

            data,

            context

        );

    }



    if(typeof engine.generate === "function"){

        return engine.generate(

            data,

            context

        );

    }



    if(typeof engine.run === "function"){

        return engine.run(

            data,

            context

        );

    }



    return engine;

}

   /* ============================================================
   FINAL PACKAGE BUILDER
============================================================ */

buildFinalPackage(){

    return{

        version: this.version,

        createdAt: new Date().toISOString(),

        session: this.getSession(),

        context: this.buildContext(),

        sharedMemory: this.sharedMemory,

        status: this.status

    };

}



/* ============================================================
   VALIDATION ENGINE
============================================================ */

validatePackage(){

    const required = [

        "prompt",

        "character",

        "product",

        "story",

        "scene",

        "voice",

        "video"

    ];



    const validation = {

        success: true,

        missing: []

    };



    required.forEach(section=>{

        const data = this.getSection(section);

        if(

            !data ||

            Object.keys(data).length === 0

        ){

            validation.success = false;

            validation.missing.push(section);

        }

    });



    return validation;

}



/* ============================================================
   ERROR RECOVERY
============================================================ */

recover(error){

    console.error(

        "[IntegrationEngine]",

        error

    );



    return{

        success:false,

        message:error.message,

        timestamp:new Date().toISOString()

    };

}



/* ============================================================
   EXPORT JSON
============================================================ */

exportJSON(){

    return JSON.stringify(

        this.buildFinalPackage(),

        null,

        2

    );

}



/* ============================================================
   EXPORT PROMPT BUNDLE
============================================================ */

exportBundle(){

    return{

        prompt:this.getSection("prompt"),

        character:this.getSection("character"),

        product:this.getSection("product"),

        story:this.getSection("story"),

        scene:this.getSection("scene"),

        voice:this.getSection("voice"),

        video:this.getSection("video")

    };

}

} // ===== END CLASS =====



/* ============================================================
   SINGLETON INSTANCE
============================================================ */

const integrationEngine =
    new IntegrationEngine();



/* ============================================================
   AUTO REGISTER (OPTIONAL)
============================================================ */

if(typeof window !== "undefined"){

    window.integrationEngine =
        integrationEngine;

}



/* ============================================================
   READY MESSAGE
============================================================ */

console.log(

"%c========================================",

"color:#06b6d4"

);

console.log(

"%c PowerTools AI Creator Suite ",

"color:#22c55e;font-size:15px;font-weight:bold"

);

console.log(

"%c Integration Engine Loaded ",

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

"%c========================================",

"color:#06b6d4"

);
