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


