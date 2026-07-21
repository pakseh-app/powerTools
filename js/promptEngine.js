/*
============================================================
 PowerTools AI Creator Suite
 File : promptEngine.js
 Version : 2.0.0
 Status : CORE FOUNDATION
============================================================
*/

"use strict";

(function(window){

class PromptEngine{

    constructor(){

        this.version="2.0.0";

        this.project="PowerTools AI Creator Suite";

        this.author="OpenAI";

        this.state={};

        this.config={};

        this.events={};

        this.templates=new Map();

        this.fragments=new Map();

        this.variables=new Map();

        this.presets=new Map();

        this.aiProviders=new Map();

        this.sceneCache=[];

        this.characterCache=[];

        this.productCache=[];

        this.history=[];

        this.initialize();

    }

    initialize(){

        this.loadDefaultConfig();

        this.loadProviders();

        this.loadDefaultPresets();

        console.log(

            "%cPowerTools Prompt Engine v2 Ready",

            "color:#22c55e;font-size:14px;font-weight:bold"

        );

    }

    loadDefaultConfig(){

        this.config={

            language:"English",

            output:"image",

            quality:"ultra",

            aspectRatio:"auto",

            duration:8,

            creativity:80,

            detail:100,

            negativePrompt:true,

            autoOptimize:true,

            provider:"chatgpt"

        };

    }

    loadProviders(){

        const list=[

            "chatgpt",

            "gemini",

            "claude",

            "grok",

            "leonardo",

            "midjourney",

            "flux",

            "imagen",

            "ideogram",

            "veo",

            "kling",

            "runway",

            "hailuo",

            "pixverse",

            "luma"

        ];

        list.forEach(name=>{

            this.aiProviders.set(name,{

                id:name,

                enabled:true

            });

        });

    }

    loadDefaultPresets(){

        this.presets.set("quality",[

            "masterpiece",

            "best quality",

            "ultra detailed",

            "8K",

            "HDR"

        ]);

        this.presets.set("camera",[

            "cinematic",

            "professional composition",

            "sharp focus"

        ]);

        this.presets.set("video",[

            "smooth motion",

            "natural movement",

            "realistic physics",

            "cinematic camera movement"

        ]);

    }

    on(event,callback){

        if(!this.events[event]){

            this.events[event]=[];

        }

        this.events[event].push(callback);

    }

    emit(event,data){

        if(!this.events[event]) return;

        this.events[event].forEach(fn=>fn(data));

    }

    set(key,value){

        this.state[key]=value;

    }

    get(key){

        return this.state[key];

    }

    has(key){

        return Object.prototype.hasOwnProperty.call(

            this.state,

            key

        );

    }

    remove(key){

        delete this.state[key];

    }

    clearState(){

        this.state={};

    }

}

window.PowerTools=window.PowerTools||{};

window.PowerTools.promptEngine=new PromptEngine();

// })(window);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 2A
============================================================
*/


/*
============================================================
 Prompt Data Structure
============================================================
*/

PromptEngine.prototype.promptData = {

    subject:"",
    action:"",
    environment:"",
    style:"",
    camera:"",
    lighting:"",
    composition:"",
    mood:"",
    quality:"",
    details:"",
    negative:""

};


/*
============================================================
 Set Prompt Component
============================================================
*/

PromptEngine.prototype.setPromptPart=function(
    key,
    value
){

    if(
        this.promptData.hasOwnProperty(key)
    ){

        this.promptData[key]=value;

    }

};


/*
============================================================
 Get Prompt Component
============================================================
*/

PromptEngine.prototype.getPromptPart=function(key){

    return this.promptData[key] || "";

};


/*
============================================================
 Reset Prompt Data
============================================================
*/

PromptEngine.prototype.resetPrompt=function(){

    Object.keys(this.promptData)

    .forEach(key=>{

        this.promptData[key]="";

    });

};


/*
============================================================
 Add Template
============================================================
*/

PromptEngine.prototype.addTemplate=function(
    name,
    data
){

    this.templates.set(
        name,
        data
    );

};


/*
============================================================
 Get Template
============================================================
*/

PromptEngine.prototype.getTemplate=function(name){

    return this.templates.get(name);

};


/*
============================================================
 Remove Template
============================================================
*/

PromptEngine.prototype.removeTemplate=function(name){

    this.templates.delete(name);

};


/*
============================================================
 Create Variable
============================================================
*/

PromptEngine.prototype.setVariable=function(
    key,
    value
){

    this.variables.set(
        key,
        value
    );

};


/*
============================================================
 Replace Variables
============================================================
*/

PromptEngine.prototype.replaceVariables=function(text){

    let result=text;


    this.variables.forEach(
        (value,key)=>{


            result=result.replaceAll(

                "{{"+key+"}}",

                value

            );


        }
    );


    return result;

};


/*
============================================================
 Build Basic Prompt
============================================================
*/

PromptEngine.prototype.buildBasicPrompt=function(){

    let parts=[];


    Object.values(

        this.promptData

    )

    .forEach(value=>{


        if(

            value &&

            value.trim()!==""


        ){

            parts.push(value);

        }


    });


    return parts.join(", ");

};


/*
============================================================
 Prompt Cleaner
============================================================
*/

PromptEngine.prototype.cleanPrompt=function(prompt){

    return prompt

    .replace(/\s+/g," ")

    .replace(/,\s*,/g,",")

    .trim();

};


/*
============================================================
 Save History
============================================================
*/

PromptEngine.prototype.saveHistory=function(prompt){

    this.history.unshift({

        id:Date.now(),

        prompt:prompt,

        created:new Date()

    });


    if(

        this.history.length>100

    ){

        this.history.pop();

    }


};


/*
============================================================
 Generate Raw Prompt
============================================================
*/

PromptEngine.prototype.generateRaw=function(){

    let prompt=

        this.buildBasicPrompt();


    prompt=

        this.cleanPrompt(prompt);


    this.saveHistory(prompt);


    return prompt;


};


console.log(
"%cPromptEngine PART 2A Loaded",
"color:#38bdf8;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 2B
 ADVANCED PROMPT STRUCTURE
============================================================
*/


/*
============================================================
 Character Prompt Data
============================================================
*/

PromptEngine.prototype.characterData={

    name:"",

    gender:"",

    age:"",

    appearance:"",

    hairstyle:"",

    outfit:"",

    personality:"",

    expression:"",

    pose:"",

    consistency:""

};


/*
============================================================
 Product Prompt Data
============================================================
*/

PromptEngine.prototype.productData={

    name:"",

    category:"",

    material:"",

    color:"",

    texture:"",

    feature:"",

    branding:"",

    placement:"",

    presentation:""

};


/*
============================================================
 Scene Prompt Data
============================================================
*/

PromptEngine.prototype.sceneData={

    location:"",

    time:"",

    weather:"",

    atmosphere:"",

    background:"",

    foreground:"",

    action:"",

    story:""

};


/*
============================================================
 Camera System
============================================================
*/

PromptEngine.prototype.cameraData={

    shot:"",

    angle:"",

    movement:"",

    lens:"",

    focus:"",

    depth:"",

    framing:""

};


/*
============================================================
 Lighting System
============================================================
*/

PromptEngine.prototype.lightingData={

    type:"",

    direction:"",

    intensity:"",

    color:"",

    shadow:""

};


/*
============================================================
 Set Character Data
============================================================
*/

PromptEngine.prototype.setCharacterData=function(
    key,
    value
){

    if(

        this.characterData.hasOwnProperty(key)

    ){

        this.characterData[key]=value;

    }

};


/*
============================================================
 Set Product Data
============================================================
*/

PromptEngine.prototype.setProductData=function(
    key,
    value
){

    if(

        this.productData.hasOwnProperty(key)

    ){

        this.productData[key]=value;

    }

};


/*
============================================================
 Set Scene Data
============================================================
*/

PromptEngine.prototype.setSceneData=function(
    key,
    value
){

    if(

        this.sceneData.hasOwnProperty(key)

    ){

        this.sceneData[key]=value;

    }

};


/*
============================================================
 Set Camera Data
============================================================
*/

PromptEngine.prototype.setCameraData=function(
    key,
    value
){

    if(

        this.cameraData.hasOwnProperty(key)

    ){

        this.cameraData[key]=value;

    }

};


/*
============================================================
 Set Lighting Data
============================================================
*/

PromptEngine.prototype.setLightingData=function(
    key,
    value
){

    if(

        this.lightingData.hasOwnProperty(key)

    ){

        this.lightingData[key]=value;

    }

};


/*
============================================================
 Object To Prompt
============================================================
*/

PromptEngine.prototype.objectToPrompt=function(
    object
){

    let result=[];


    Object.values(object)

    .forEach(value=>{


        if(

            value &&

            String(value).trim()!==""


        ){

            result.push(value);

        }


    });


    return result.join(", ");

};


/*
============================================================
 Character Prompt Builder
============================================================
*/

PromptEngine.prototype.buildCharacterPrompt=function(){

    return this.objectToPrompt(

        this.characterData

    );

};


/*
============================================================
 Product Prompt Builder
============================================================
*/

PromptEngine.prototype.buildProductPrompt=function(){

    return this.objectToPrompt(

        this.productData

    );

};


/*
============================================================
 Scene Prompt Builder
============================================================
*/

PromptEngine.prototype.buildScenePrompt=function(){

    return this.objectToPrompt(

        this.sceneData

    );

};


/*
============================================================
 Camera Prompt Builder
============================================================
*/

PromptEngine.prototype.buildCameraPrompt=function(){

    return this.objectToPrompt(

        this.cameraData

    );

};


/*
============================================================
 Lighting Prompt Builder
============================================================
*/

PromptEngine.prototype.buildLightingPrompt=function(){

    return this.objectToPrompt(

        this.lightingData

    );

};


/*
============================================================
 Complete Structure Builder
============================================================
*/

PromptEngine.prototype.buildAdvancedPrompt=function(){

    let sections=[];


    const character=

        this.buildCharacterPrompt();


    const product=

        this.buildProductPrompt();


    const scene=

        this.buildScenePrompt();


    const camera=

        this.buildCameraPrompt();


    const lighting=

        this.buildLightingPrompt();



    if(character)
        sections.push(character);


    if(product)
        sections.push(product);


    if(scene)
        sections.push(scene);


    if(camera)
        sections.push(camera);


    if(lighting)
        sections.push(lighting);



    return this.cleanPrompt(

        sections.join(", ")

    );

};


/*
============================================================
 Merge Basic + Advanced Prompt
============================================================
*/

PromptEngine.prototype.generateFullPrompt=function(){

    let basic=

        this.generateRaw();



    let advanced=

        this.buildAdvancedPrompt();



    let final=[];


    if(basic)
        final.push(basic);


    if(advanced)
        final.push(advanced);



    return this.cleanPrompt(

        final.join(", ")

    );

};



console.log(
"%cPromptEngine PART 2B Loaded",
"color:#06b6d4;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 2C
 PROMPT INTELLIGENCE LAYER
============================================================
*/


/*
============================================================
 Enhancement Dictionary
============================================================
*/

PromptEngine.prototype.enhancementLibrary={


    cinematic:[

        "cinematic masterpiece",

        "professional film look",

        "dramatic storytelling",

        "movie quality",

        "Hollywood cinematography"

    ],


    realistic:[

        "photorealistic",

        "real world details",

        "natural skin texture",

        "realistic materials",

        "physically accurate"

    ],


    quality:[

        "ultra detailed",

        "high resolution",

        "8K quality",

        "sharp details",

        "premium quality"

    ],


    photography:[

        "professional photography",

        "studio camera",

        "perfect exposure",

        "sharp focus",

        "depth of field"

    ],


    video:[

        "smooth camera movement",

        "natural motion",

        "cinematic sequence",

        "realistic animation",

        "film production quality"

    ]


};


/*
============================================================
 Add Enhancement
============================================================
*/

PromptEngine.prototype.addEnhancement=function(
    category,
    value
){

    if(

        !this.enhancementLibrary[category]

    ){

        this.enhancementLibrary[category]=[];

    }


    this.enhancementLibrary[category]

    .push(value);

};


/*
============================================================
 Apply Enhancement
============================================================
*/

PromptEngine.prototype.applyEnhancement=function(
    prompt,
    categories=[]
){

    let result=[prompt];


    categories.forEach(category=>{


        let list=

            this.enhancementLibrary[category];


        if(list){


            result.push(

                list.join(", ")

            );


        }


    });


    return this.cleanPrompt(

        result.join(", ")

    );

};


/*
============================================================
 Auto Quality Booster
============================================================
*/

PromptEngine.prototype.autoQualityBoost=function(
    prompt
){

    return this.applyEnhancement(

        prompt,

        [

            "quality",

            "realistic",

            "cinematic"

        ]

    );

};


/*
============================================================
 Image Prompt Generator
============================================================
*/

PromptEngine.prototype.generateImagePrompt=function(){

    let prompt=

        this.generateFullPrompt();



    prompt=

        this.autoQualityBoost(

            prompt

        );



    return {

        type:"image",

        prompt:prompt,

        negative:this.generateNegativePrompt(),

        ai:this.config.provider

    };

};


/*
============================================================
 Video Prompt Generator
============================================================
*/

PromptEngine.prototype.generateVideoPrompt=function(){

    let prompt=

        this.generateFullPrompt();



    prompt=

        this.applyEnhancement(

            prompt,

            [

                "video",

                "cinematic",

                "quality"

            ]

        );



    return {

        type:"video",

        duration:this.config.duration,

        prompt:prompt,

        ai:this.config.provider

    };

};


/*
============================================================
 Negative Prompt Intelligence
============================================================
*/

PromptEngine.prototype.negativeLibrary=[


    "low quality",

    "blurry",

    "bad anatomy",

    "deformed",

    "extra fingers",

    "wrong proportion",

    "duplicate object",

    "watermark",

    "logo",

    "text artifact",

    "noise"


];



/*
============================================================
 Add Negative Keyword
============================================================
*/

PromptEngine.prototype.addNegative=function(
    value
){

    if(value){

        this.negativeLibrary.push(value);

    }

};


/*
============================================================
 Generate Negative Prompt
============================================================
*/

PromptEngine.prototype.generateNegativePrompt=function(){

    return this.negativeLibrary.join(", ");

};


/*
============================================================
 Prompt Analyzer
============================================================
*/

PromptEngine.prototype.analyzePrompt=function(
    prompt
){

    let length=

        prompt.length;



    let words=

        prompt.split(" ").length;



    let score=0;



    if(length>100)

        score+=20;


    if(length>300)

        score+=30;


    if(words>50)

        score+=30;


    if(

        prompt.includes("cinematic")

    )

        score+=10;



    if(

        prompt.includes("detailed")

    )

        score+=10;



    return {


        characters:length,

        words:words,

        score:Math.min(

            score,

            100

        )


    };

};


/*
============================================================
 Auto Optimize
============================================================
*/

PromptEngine.prototype.optimizeFinalPrompt=function(
    prompt
){

    let result=

        this.cleanPrompt(prompt);



    if(

        this.config.autoOptimize

    ){

        result=

            this.autoQualityBoost(

                result

            );

    }



    return result;

};



console.log(
"%cPromptEngine PART 2C Loaded",
"color:#a855f7;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 2D
 AI PROVIDER FORMATTER ENGINE
============================================================
*/


/*
============================================================
 AI Format Rules
============================================================
*/

PromptEngine.prototype.aiFormatRules={


    chatgpt:{

        name:"ChatGPT",

        type:"structured",

        suffix:"Create a highly detailed professional prompt"

    },


    gemini:{

        name:"Gemini",

        type:"descriptive",

        suffix:"Generate with maximum visual details"

    },


    leonardo:{

        name:"Leonardo AI",

        type:"image",

        suffix:"masterpiece, ultra detailed, cinematic lighting"

    },


    midjourney:{

        name:"Midjourney",

        type:"image",

        suffix:"--v 7 --style raw --quality 2"

    },


    flux:{

        name:"Flux",

        type:"realistic",

        suffix:"photorealistic, realistic texture, natural lighting"

    },


    imagen:{

        name:"Imagen",

        type:"photo",

        suffix:"professional photography, HDR, realistic details"

    },


    ideogram:{

        name:"Ideogram",

        type:"design",

        suffix:"clean design, readable typography, perfect layout"

    },


    veo:{

        name:"Veo",

        type:"video",

        suffix:"cinematic camera movement, realistic motion, 8 second scene"

    },


    kling:{

        name:"Kling",

        type:"video",

        suffix:"smooth movement, realistic animation, cinematic video"

    },


    runway:{

        name:"Runway",

        type:"video",

        suffix:"film quality, dynamic camera, professional production"

    }

};


/*
============================================================
 Set AI Provider
============================================================
*/

PromptEngine.prototype.setProvider=function(
    provider
){

    if(

        this.aiProviders.has(provider)

    ){

        this.config.provider=provider;

        return true;

    }


    return false;

};


/*
============================================================
 Get Current Provider
============================================================
*/

PromptEngine.prototype.getProvider=function(){

    return this.config.provider;

};


/*
============================================================
 Format Prompt For AI
============================================================
*/

PromptEngine.prototype.formatPromptForAI=function(
    prompt,
    provider=null
){


    provider=

        provider ||

        this.config.provider;



    let rule=

        this.aiFormatRules[provider];



    if(!rule)

        return prompt;



    return this.cleanPrompt(

        prompt+

        ", "+

        rule.suffix

    );

};


/*
============================================================
 ChatGPT Formatter
============================================================
*/

PromptEngine.prototype.formatChatGPT=function(
    prompt
){

    return {

        instruction:

        "Act as professional AI prompt engineer",

        prompt:prompt,

        output:

        "Return optimized prompt"

    };

};


/*
============================================================
 Image AI Formatter
============================================================
*/

PromptEngine.prototype.formatImageAI=function(
    prompt
){

    return this.formatPromptForAI(

        prompt,

        this.config.provider

    );

};


/*
============================================================
 Video AI Formatter
============================================================
*/

PromptEngine.prototype.formatVideoAI=function(
    prompt
){

    let result=

        this.formatPromptForAI(

            prompt,

            this.config.provider

        );



    return this.cleanPrompt(

        result+

        ", duration "+

        this.config.duration+

        " seconds"

    );

};


/*
============================================================
 Universal Generator
============================================================
*/

PromptEngine.prototype.generateAIOutput=function(){

    let prompt;



    if(

        this.config.output==="video"

    ){

        prompt=

            this.generateVideoPrompt();


    }else{


        prompt=

            this.generateImagePrompt();


    }



    let formatted=

        this.formatPromptForAI(

            prompt.prompt

        );



    return {


        provider:this.config.provider,


        type:prompt.type,


        prompt:formatted,


        negative:prompt.negative || "",


        settings:this.config


    };

};


/*
============================================================
 Export AI Result
============================================================
*/

PromptEngine.prototype.exportPromptData=function(){

    return JSON.stringify(

        this.generateAIOutput(),

        null,

        4

    );

};



console.log(
"%cPromptEngine PART 2D Loaded",
"color:#f97316;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 2E
 FINAL PROMPT PIPELINE API
============================================================
*/


/*
============================================================
 Prompt Memory System
============================================================
*/

PromptEngine.prototype.promptMemory=[];


/*
============================================================
 Save Prompt Version
============================================================
*/

PromptEngine.prototype.savePromptVersion=function(
    data
){

    this.promptMemory.unshift({

        id:Date.now(),

        timestamp:new Date()
            .toISOString(),

        provider:this.config.provider,

        data:data

    });


    if(

        this.promptMemory.length>50

    ){

        this.promptMemory.pop();

    }


};


/*
============================================================
 Get Prompt Memory
============================================================
*/

PromptEngine.prototype.getPromptMemory=function(){

    return this.promptMemory;

};


/*
============================================================
 Clear Prompt Memory
============================================================
*/

PromptEngine.prototype.clearPromptMemory=function(){

    this.promptMemory=[];

};


/*
============================================================
 Character Injection
============================================================
*/

PromptEngine.prototype.injectCharacter=function(
    character
){

    if(!character)

        return;



    Object.keys(character)

    .forEach(key=>{


        if(

            this.characterData

            .hasOwnProperty(key)

        ){

            this.characterData[key]=

                character[key];

        }


    });


};


/*
============================================================
 Product Injection
============================================================
*/

PromptEngine.prototype.injectProduct=function(
    product
){

    if(!product)

        return;



    Object.keys(product)

    .forEach(key=>{


        if(

            this.productData

            .hasOwnProperty(key)

        ){

            this.productData[key]=

                product[key];

        }


    });


};


/*
============================================================
 Scene Injection
============================================================
*/

PromptEngine.prototype.injectScene=function(
    scene
){

    if(!scene)

        return;



    Object.keys(scene)

    .forEach(key=>{


        if(

            this.sceneData

            .hasOwnProperty(key)

        ){

            this.sceneData[key]=

                scene[key];

        }


    });


};


/*
============================================================
 Master Prompt Pipeline
============================================================
*/

PromptEngine.prototype.buildMasterPrompt=function(){

    let promptParts=[];



    const basic=

        this.generateRaw();



    const advanced=

        this.buildAdvancedPrompt();



    if(basic)

        promptParts.push(basic);



    if(advanced)

        promptParts.push(advanced);



    let result=

        promptParts.join(", ");



    result=

        this.optimizeFinalPrompt(

            result

        );



    this.savePromptVersion(

        result

    );



    return result;

};


/*
============================================================
 Final Image Prompt
============================================================
*/

PromptEngine.prototype.createImagePrompt=function(){

    let prompt=

        this.buildMasterPrompt();



    let output=

        this.formatPromptForAI(

            prompt

        );



    return {


        type:"IMAGE",


        provider:this.config.provider,


        prompt:output,


        negative:

        this.generateNegativePrompt(),


        score:

        this.analyzePrompt(output)


    };

};


/*
============================================================
 Final Video Prompt
============================================================
*/

PromptEngine.prototype.createVideoPrompt=function(){

    let prompt=

        this.buildMasterPrompt();



    prompt=

        this.formatVideoAI(

            prompt

        );



    return {


        type:"VIDEO",


        provider:this.config.provider,


        duration:

        this.config.duration,


        prompt:prompt,


        score:

        this.analyzePrompt(prompt)


    };

};


/*
============================================================
 Universal Create
============================================================
*/

PromptEngine.prototype.create=function(){

    if(

        this.config.output==="video"

    ){

        return this.createVideoPrompt();

    }


    return this.createImagePrompt();

};


/*
============================================================
 Project Snapshot
============================================================
*/

PromptEngine.prototype.snapshot=function(){

    return {


        version:this.version,


        config:this.config,


        character:this.characterData,


        product:this.productData,


        scene:this.sceneData,


        camera:this.cameraData,


        lighting:this.lightingData,


        memory:this.promptMemory


    };

};


/*
============================================================
 Restore Snapshot
============================================================
*/

PromptEngine.prototype.restore=function(
    data
){

    if(!data)

        return false;



    this.config=

        data.config || this.config;



    this.characterData=

        data.character || this.characterData;



    this.productData=

        data.product || this.productData;



    this.sceneData=

        data.scene || this.sceneData;



    this.cameraData=

        data.camera || this.cameraData;



    this.lightingData=

        data.lighting || this.lightingData;



    return true;

};


/*
============================================================
 Engine Status
============================================================
*/

PromptEngine.prototype.status=function(){

    return {


        engine:

        "PromptEngine",


        version:

        this.version,


        provider:

        this.config.provider,


        output:

        this.config.output,


        templates:

        this.templates.size,


        providers:

        this.aiProviders.size,


        history:

        this.history.length


    };

};



console.log(
"%cPromptEngine PART 2E Loaded - CORE COMPLETE",
"color:#22c55e;font-weight:bold;font-size:14px;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3A
 SMART PROMPT INTELLIGENCE ENGINE
============================================================
*/


/*
============================================================
 Intelligence Database
============================================================
*/

PromptEngine.prototype.intelligence = {


    styles:{


        cinematic:[
            "cinematic film style",
            "Hollywood visual language",
            "dramatic storytelling",
            "movie frame composition"
        ],


        realistic:[
            "photorealistic",
            "real world accuracy",
            "natural details",
            "realistic texture"
        ],


        luxury:[
            "premium luxury aesthetic",
            "high-end commercial style",
            "elegant presentation",
            "expensive visual appearance"
        ],


        anime:[
            "anime illustration style",
            "detailed anime artwork",
            "beautiful character design",
            "dynamic anime composition"
        ],


        "3d":[
            "high quality 3D render",
            "realistic 3D character",
            "professional 3D modeling",
            "detailed materials"
        ],


        clay:[
            "clay animation style",
            "soft clay texture",
            "stop motion feeling",
            "handcrafted appearance"
        ]


    },


    cameras:{


        portrait:[
            "portrait camera shot",
            "85mm lens",
            "shallow depth of field"
        ],


        product:[
            "commercial product photography",
            "studio camera setup",
            "macro detail shot"
        ],


        cinematic:[
            "anamorphic cinematic lens",
            "film camera movement",
            "professional cinematography"
        ],


        drone:[
            "aerial drone shot",
            "high angle perspective",
            "wide environment view"
        ]


    },


    lighting:{


        studio:[
            "professional studio lighting",
            "softbox lighting",
            "controlled shadows"
        ],


        cinematic:[
            "dramatic cinematic lighting",
            "volumetric light",
            "realistic shadows"
        ],


        natural:[
            "natural daylight",
            "soft sunlight",
            "real environment lighting"
        ],


        neon:[
            "neon lighting",
            "colorful reflections",
            "night atmosphere"
        ]


    }


};


/*
============================================================
 Apply Intelligence Style
============================================================
*/

PromptEngine.prototype.applyStylePreset=function(
    style
){

    const data=

        this.intelligence.styles[style];


    if(!data)

        return false;



    this.promptData.style=

        data.join(", ");



    return true;

};


/*
============================================================
 Apply Camera Preset
============================================================
*/

PromptEngine.prototype.applyCameraPreset=function(
    camera
){

    const data=

        this.intelligence.cameras[camera];


    if(!data)

        return false;



    this.cameraData.shot=

        data.join(", ");



    return true;

};


/*
============================================================
 Apply Lighting Preset
============================================================
*/

PromptEngine.prototype.applyLightingPreset=function(
    lighting
){

    const data=

        this.intelligence.lighting[lighting];


    if(!data)

        return false;



    this.lightingData.type=

        data.join(", ");



    return true;

};


/*
============================================================
 Auto Enhance Section
============================================================
*/

PromptEngine.prototype.enhanceSection=function(
    section,
    values
){

    if(

        !this.promptData.hasOwnProperty(section)

    ){

        return false;

    }



    if(Array.isArray(values)){


        this.promptData[section]=

            values.join(", ");


    }

    else{


        this.promptData[section]=values;


    }



    return true;

};


/*
============================================================
 Smart Subject Builder
============================================================
*/

PromptEngine.prototype.createSubject=function(data){

    if(!data)

        return;



    let parts=[];



    if(data.object)

        parts.push(data.object);



    if(data.description)

        parts.push(data.description);



    if(data.material)

        parts.push(data.material);



    if(data.color)

        parts.push(data.color);



    this.promptData.subject=

        parts.join(", ");



};


/*
============================================================
 Smart Action Builder
============================================================
*/

PromptEngine.prototype.createAction=function(action){

    this.promptData.action=

        action || "";

};


/*
============================================================
 Smart Environment Builder
============================================================
*/

PromptEngine.prototype.createEnvironment=function(data){

    let parts=[];



    Object.values(data)

    .forEach(value=>{


        if(value)

            parts.push(value);


    });



    this.promptData.environment=

        parts.join(", ");


};


/*
============================================================
 Smart Mood Builder
============================================================
*/

PromptEngine.prototype.createMood=function(mood){

    this.promptData.mood=

        mood;


};


/*
============================================================
 Quality Intelligence
============================================================
*/

PromptEngine.prototype.applyQualityPreset=function(){

    this.promptData.quality=

    [

        "masterpiece",

        "ultra detailed",

        "8K resolution",

        "professional quality"

    ].join(", ");

};



console.log(
"%cPromptEngine PART 3A Loaded",
"color:#22c55e;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3B
 PROFESSIONAL TEMPLATE ENGINE
============================================================
*/


/*
============================================================
 Template Database
============================================================
*/

PromptEngine.prototype.templateLibrary={


    product_ads:{

        name:"Product Advertisement",

        type:"image",

        structure:{

            subject:"premium product",

            environment:"professional studio",

            camera:"commercial photography",

            lighting:"softbox lighting",

            style:"luxury commercial",

            quality:"high quality"

        }

    },


    affiliate_content:{

        name:"Affiliate Product Content",

        type:"image_video",

        structure:{

            subject:"product showcase",

            action:"demonstrating product usage",

            environment:"lifestyle scene",

            camera:"social media content camera",

            style:"modern influencer content",

            quality:"professional"

        }

    },


    character_portrait:{

        name:"Character Portrait",

        type:"image",

        structure:{

            subject:"human character",

            camera:"portrait shot",

            lighting:"cinematic lighting",

            style:"realistic character design",

            quality:"ultra detailed"

        }

    },


    fashion_model:{

        name:"Fashion Model",

        type:"image",

        structure:{

            subject:"fashion model",

            environment:"fashion studio",

            camera:"editorial photography",

            lighting:"professional studio",

            style:"high fashion magazine",

            quality:"8K"

        }

    },


    food_photography:{

        name:"Food Photography",

        type:"image",

        structure:{

            subject:"delicious food",

            environment:"restaurant setting",

            camera:"macro photography",

            lighting:"natural lighting",

            style:"food commercial",

            quality:"high detail"

        }

    },


    architecture:{

        name:"Architecture Visualization",

        type:"image",

        structure:{

            subject:"modern architecture",

            environment:"realistic environment",

            camera:"wide angle photography",

            lighting:"golden hour",

            style:"architectural visualization",

            quality:"photorealistic"

        }

    },


    cinematic_scene:{

        name:"Cinematic Scene",

        type:"video",

        structure:{

            subject:"main character",

            action:"story action",

            environment:"cinematic environment",

            camera:"film camera movement",

            lighting:"dramatic lighting",

            style:"movie scene",

            quality:"cinematic quality"

        }

    },


    youtube_thumbnail:{

        name:"YouTube Thumbnail",

        type:"image",

        structure:{

            subject:"main subject",

            composition:"dynamic composition",

            camera:"close up",

            lighting:"dramatic",

            style:"high CTR thumbnail",

            quality:"sharp details"

        }

    },


    social_reels:{

        name:"TikTok/Reels Content",

        type:"video",

        structure:{

            subject:"content creator",

            action:"engaging movement",

            camera:"vertical video",

            motion:"smooth movement",

            style:"viral social media",

            quality:"professional"

        }

    },


    image_to_video:{

        name:"Image To Video",

        type:"video",

        structure:{

            subject:"existing image",

            motion:"natural movement",

            camera:"cinematic camera motion",

            duration:"8 seconds",

            style:"realistic animation"

        }

    }


};


/*
============================================================
 Register Template
============================================================
*/

PromptEngine.prototype.registerTemplate=function(
    id,
    data
){

    this.templateLibrary[id]=data;

};


/*
============================================================
 Get Template
============================================================
*/

PromptEngine.prototype.getTemplateData=function(
    id
){

    return this.templateLibrary[id] || null;

};


/*
============================================================
 Apply Template
============================================================
*/

PromptEngine.prototype.applyTemplate=function(
    id
){

    const template=

        this.getTemplateData(id);



    if(!template)

        return false;



    const structure=

        template.structure;



    Object.keys(structure)

    .forEach(key=>{


        if(

            this.promptData.hasOwnProperty(key)

        ){

            this.promptData[key]=

                structure[key];

        }


    });



    this.config.output=

        template.type;



    return true;

};


/*
============================================================
 Create Template Prompt
============================================================
*/

PromptEngine.prototype.createFromTemplate=function(
    id,
    custom={}
){

    this.applyTemplate(id);



    Object.keys(custom)

    .forEach(key=>{


        if(

            this.promptData.hasOwnProperty(key)

        ){

            this.promptData[key]=

                custom[key];

        }


    });



    return this.buildMasterPrompt();

};


/*
============================================================
 Template List
============================================================
*/

PromptEngine.prototype.listTemplates=function(){

    return Object.keys(

        this.templateLibrary

    );

};



console.log(
"%cPromptEngine PART 3B Loaded",
"color:#06b6d4;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3C
 CREATIVE INTELLIGENCE ENGINE
============================================================
*/


/*
============================================================
 Creative Presets Database
============================================================
*/

PromptEngine.prototype.creativePresets={


    productPhotography:{

        subject:[

            "premium product",

            "clean product presentation"

        ],

        camera:[

            "commercial photography",

            "macro detail shot"

        ],

        lighting:[

            "studio lighting",

            "soft reflection"

        ],

        style:[

            "luxury advertisement",

            "professional branding"

        ]

    },


    affiliateMarketing:{

        subject:[

            "product demonstration",

            "real user experience"

        ],

        action:[

            "showing product benefits",

            "using product naturally"

        ],

        environment:[

            "modern lifestyle environment"

        ],

        style:[

            "viral social media content",

            "high engagement advertisement"

        ]

    },


    characterDesign:{

        subject:[

            "detailed character",

            "unique personality"

        ],

        camera:[

            "cinematic portrait"

        ],

        lighting:[

            "dramatic character lighting"

        ],

        style:[

            "professional character concept art"

        ]

    },


    storytelling:{

        scene:[

            "cinematic storytelling scene"

        ],

        camera:[

            "movie camera movement"

        ],

        lighting:[

            "emotional cinematic lighting"

        ],

        style:[

            "film production quality"

        ]

    },


    viralContent:{

        camera:[

            "vertical social media video",

            "dynamic camera angle"

        ],

        motion:[

            "engaging movement",

            "smooth transition"

        ],

        style:[

            "viral content style",

            "modern creator aesthetic"

        ]

    }


};


/*
============================================================
 Apply Creative Preset
============================================================
*/

PromptEngine.prototype.applyCreativePreset=function(
    name
){

    const preset=

        this.creativePresets[name];



    if(!preset)

        return false;



    Object.keys(preset)

    .forEach(section=>{


        const value=

            preset[section].join(", ");



        if(

            this.promptData.hasOwnProperty(section)

        ){

            this.promptData[section]=value;

        }



    });



    return true;

};


/*
============================================================
 Product Advertisement Builder
============================================================
*/

PromptEngine.prototype.buildProductAdPrompt=function(
    product={}
){

    this.applyCreativePreset(
        "productPhotography"
    );


    if(product.name)

        this.productData.name=

            product.name;


    if(product.color)

        this.productData.color=

            product.color;


    if(product.material)

        this.productData.material=

            product.material;


    return this.buildMasterPrompt();

};


/*
============================================================
 Affiliate Content Builder
============================================================
*/

PromptEngine.prototype.buildAffiliatePrompt=function(
    product={}
){

    this.applyCreativePreset(
        "affiliateMarketing"
    );


    this.productData=

    {

        ...this.productData,

        ...product

    };


    return this.buildMasterPrompt();

};


/*
============================================================
 Character Prompt Builder
============================================================
*/

PromptEngine.prototype.buildCharacterPromptAI=function(
    character={}
){

    this.applyCreativePreset(
        "characterDesign"
    );


    this.characterData=

    {

        ...this.characterData,

        ...character

    };


    return this.buildMasterPrompt();

};


/*
============================================================
 Story Scene Builder
============================================================
*/

PromptEngine.prototype.buildStoryPrompt=function(
    scene={}
){

    this.applyCreativePreset(
        "storytelling"
    );


    this.sceneData=

    {

        ...this.sceneData,

        ...scene

    };


    return this.buildMasterPrompt();

};


/*
============================================================
 Viral Video Builder
============================================================
*/

PromptEngine.prototype.buildViralVideoPrompt=function(
    data={}
){

    this.applyCreativePreset(
        "viralContent"
    );


    this.sceneData=

    {

        ...this.sceneData,

        ...data

    };


    this.config.output="video";


    return this.createVideoPrompt();

};


/*
============================================================
 Auto Category Detection
============================================================
*/

PromptEngine.prototype.detectPromptCategory=function(
    text
){

    const value=

        text.toLowerCase();



    if(

        value.includes("product")

        ||

        value.includes("brand")

    ){

        return "productPhotography";

    }



    if(

        value.includes("character")

        ||

        value.includes("person")

    ){

        return "characterDesign";

    }



    if(

        value.includes("story")

        ||

        value.includes("scene")

    ){

        return "storytelling";

    }



    if(

        value.includes("video")

        ||

        value.includes("reels")

    ){

        return "viralContent";

    }



    return "productPhotography";

};


/*
============================================================
 Smart Auto Build
============================================================
*/

PromptEngine.prototype.smartGenerate=function(
    request
){

    const category=

        this.detectPromptCategory(

            request

        );


    this.applyCreativePreset(

        category

    );


    this.promptData.subject=

        request;



    return this.create();

};



console.log(
"%cPromptEngine PART 3C Loaded",
"color:#a855f7;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3D
 ADVANCED VISUAL INTELLIGENCE ENGINE
============================================================
*/


/*
============================================================
 Camera Intelligence Database
============================================================
*/

PromptEngine.prototype.visualLibrary={


    shots:{


        closeup:

        "extreme close up shot, detailed subject focus",


        portrait:

        "portrait shot, professional framing",


        medium:

        "medium shot, balanced composition",


        fullbody:

        "full body shot, complete character visibility",


        wide:

        "wide cinematic shot, environmental storytelling",


        aerial:

        "aerial perspective, bird eye view"


    },


    angles:{


        low:

        "low angle shot, powerful perspective",


        high:

        "high angle shot, dramatic viewpoint",


        eye:

        "eye level camera angle, natural perspective",


        dutch:

        "dutch angle, dynamic cinematic feeling"


    },


    movements:{


        static:

        "static camera shot",


        dolly:

        "smooth dolly camera movement",


        orbit:

        "360 degree orbit camera movement",


        tracking:

        "tracking shot following subject",


        crane:

        "cinematic crane movement",


        zoom:

        "slow cinematic zoom"


    },


    lenses:{


        wide:

        "24mm wide angle lens",


        normal:

        "50mm lens natural perspective",


        portrait:

        "85mm portrait lens shallow depth of field",


        macro:

        "macro lens extreme detail",


        anamorphic:

        "anamorphic cinema lens"


    }


};


/*
============================================================
 Apply Shot
============================================================
*/

PromptEngine.prototype.setShot=function(
    type
){

    if(

        this.visualLibrary.shots[type]

    ){

        this.cameraData.shot=

            this.visualLibrary.shots[type];

        return true;

    }


    return false;

};


/*
============================================================
 Apply Camera Angle
============================================================
*/

PromptEngine.prototype.setCameraAngle=function(
    type
){

    if(

        this.visualLibrary.angles[type]

    ){

        this.cameraData.angle=

            this.visualLibrary.angles[type];

        return true;

    }


    return false;

};


/*
============================================================
 Apply Camera Movement
============================================================
*/

PromptEngine.prototype.setCameraMovement=function(
    type
){

    if(

        this.visualLibrary.movements[type]

    ){

        this.cameraData.movement=

            this.visualLibrary.movements[type];

        return true;

    }


    return false;

};


/*
============================================================
 Apply Lens
============================================================
*/

PromptEngine.prototype.setLens=function(
    type
){

    if(

        this.visualLibrary.lenses[type]

    ){

        this.cameraData.lens=

            this.visualLibrary.lenses[type];

        return true;

    }


    return false;

};


/*
============================================================
 Composition Intelligence
============================================================
*/

PromptEngine.prototype.compositionRules={


    rule_of_thirds:

    "rule of thirds composition",


    centered:

    "centered symmetrical composition",


    leading_lines:

    "leading lines composition",


    foreground:

    "foreground depth composition",


    cinematic:

    "cinematic balanced composition",


    minimal:

    "minimal clean composition"


};


/*
============================================================
 Set Composition
============================================================
*/

PromptEngine.prototype.setComposition=function(
    type
){

    if(

        this.compositionRules[type]

    ){

        this.promptData.composition=

            this.compositionRules[type];

        return true;

    }


    return false;

};


/*
============================================================
 Depth Intelligence
============================================================
*/

PromptEngine.prototype.depthPresets={


    shallow:

    "shallow depth of field, blurred background",


    deep:

    "deep depth of field, everything sharp",


    cinematic:

    "cinematic depth separation"


};


/*
============================================================
 Set Depth
============================================================
*/

PromptEngine.prototype.setDepth=function(
    type
){

    if(

        this.depthPresets[type]

    ){

        this.cameraData.depth=

            this.depthPresets[type];

        return true;

    }


    return false;

};


/*
============================================================
 Film Grammar Builder
============================================================
*/

PromptEngine.prototype.buildFilmShot=function(
    data={}
){

    if(data.shot)

        this.setShot(data.shot);


    if(data.angle)

        this.setCameraAngle(data.angle);


    if(data.movement)

        this.setCameraMovement(data.movement);


    if(data.lens)

        this.setLens(data.lens);


    if(data.composition)

        this.setComposition(data.composition);


    if(data.depth)

        this.setDepth(data.depth);



    return this.buildMasterPrompt();

};


/*
============================================================
 Image To Video Camera Builder
============================================================
*/

PromptEngine.prototype.buildVideoCamera=function(
    data={}
){

    this.config.output="video";


    this.buildFilmShot(data);


    this.promptData.action +=

    ", realistic movement";


    return this.createVideoPrompt();

};



console.log(
"%cPromptEngine PART 3D Loaded",
"color:#0ea5e9;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3E
 LIGHTING + COLOR SCIENCE ENGINE
============================================================
*/


/*
============================================================
 Lighting Intelligence Database
============================================================
*/

PromptEngine.prototype.lightingLibrary={


    studio:{

        type:"professional studio lighting",

        detail:

        "softbox lighting, controlled shadow, clean highlights"

    },


    cinematic:{

        type:"cinematic lighting",

        detail:

        "dramatic shadows, volumetric light, film atmosphere"

    },


    portrait:{

        type:"portrait lighting",

        detail:

        "soft facial light, natural skin tone, shallow shadows"

    },


    product:{

        type:"product lighting",

        detail:

        "commercial studio lighting, premium reflections, clean background"

    },


    goldenHour:{

        type:"golden hour lighting",

        detail:

        "warm sunlight, soft glow, cinematic atmosphere"

    },


    night:{

        type:"night lighting",

        detail:

        "dark atmosphere, realistic night illumination, ambient lights"

    },


    neon:{

        type:"neon lighting",

        detail:

        "colorful neon reflections, futuristic lighting"

    },


    dramatic:{

        type:"dramatic lighting",

        detail:

        "high contrast lighting, deep shadows, intense mood"

    }


};


/*
============================================================
 Apply Lighting Preset
============================================================
*/

PromptEngine.prototype.applyLighting=function(
    type
){

    const data=

        this.lightingLibrary[type];


    if(!data)

        return false;


    this.lightingData.type=

        data.type;


    this.lightingData.direction=

        data.detail;


    return true;

};


/*
============================================================
 Color Science Database
============================================================
*/

PromptEngine.prototype.colorLibrary={


    cinematic:

    "cinematic color grading, teal and orange tone",


    warm:

    "warm color palette, golden tones",


    cool:

    "cool color grading, blue atmosphere",


    luxury:

    "premium color grading, elegant tones",


    pastel:

    "soft pastel colors, gentle visual style",


    vibrant:

    "vibrant colors, high saturation",


    monochrome:

    "black and white cinematic style",


    cyberpunk:

    "neon cyberpunk color palette"


};


/*
============================================================
 Apply Color Style
============================================================
*/

PromptEngine.prototype.applyColorStyle=function(
    type
){

    if(

        this.colorLibrary[type]

    ){

        this.promptData.color=

            this.colorLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Atmosphere Engine
============================================================
*/

PromptEngine.prototype.atmosphereLibrary={


    peaceful:

    "peaceful atmosphere, calm environment",


    mysterious:

    "mysterious atmosphere, cinematic feeling",


    epic:

    "epic atmosphere, grand scale environment",


    emotional:

    "emotional atmosphere, storytelling mood",


    futuristic:

    "futuristic atmosphere, advanced technology",


    magical:

    "magical atmosphere, fantasy feeling"


};


/*
============================================================
 Set Atmosphere
============================================================
*/

PromptEngine.prototype.setAtmosphere=function(
    type
){

    if(

        this.atmosphereLibrary[type]

    ){

        this.sceneData.atmosphere=

            this.atmosphereLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Weather Intelligence
============================================================
*/

PromptEngine.prototype.weatherLibrary={


    sunny:

    "clear sunny weather, bright daylight",


    rainy:

    "rainy weather, wet surfaces, reflections",


    foggy:

    "foggy environment, cinematic mist",


    snowy:

    "snow atmosphere, winter environment",


    storm:

    "dramatic storm weather, dark clouds"


};


/*
============================================================
 Apply Weather
============================================================
*/

PromptEngine.prototype.setWeather=function(
    type
){

    if(

        this.weatherLibrary[type]

    ){

        this.sceneData.weather=

            this.weatherLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Time Of Day
============================================================
*/

PromptEngine.prototype.timeLibrary={


    morning:

    "morning sunlight, fresh atmosphere",


    afternoon:

    "bright afternoon lighting",


    sunset:

    "sunset golden light",


    midnight:

    "midnight dark cinematic scene"


};


/*
============================================================
 Set Time
============================================================
*/

PromptEngine.prototype.setTime=function(
    type
){

    if(

        this.timeLibrary[type]

    ){

        this.sceneData.time=

            this.timeLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Complete Visual Mood Builder
============================================================
*/

PromptEngine.prototype.buildVisualMood=function(
    data={}
){

    if(data.lighting)

        this.applyLighting(data.lighting);


    if(data.color)

        this.applyColorStyle(data.color);


    if(data.atmosphere)

        this.setAtmosphere(data.atmosphere);


    if(data.weather)

        this.setWeather(data.weather);


    if(data.time)

        this.setTime(data.time);



    return this.buildMasterPrompt();

};



console.log(
"%cPromptEngine PART 3E Loaded",
"color:#facc15;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3F
 CHARACTER CONSISTENCY INTELLIGENCE
============================================================
*/


/*
============================================================
 Character Memory Database
============================================================
*/

PromptEngine.prototype.characterMemory={

    id:null,

    name:"",

    description:"",

    gender:"",

    age:"",

    ethnicity:"",

    faceShape:"",

    eyes:"",

    nose:"",

    lips:"",

    hairstyle:"",

    hairColor:"",

    skinTone:"",

    bodyType:"",

    height:"",

    outfit:"",

    accessories:"",

    personality:"",

    signatureFeatures:[],

    referenceImage:null

};


/*
============================================================
 Create Character Profile
============================================================
*/

PromptEngine.prototype.createCharacterProfile=function(
    data={}
){

    this.characterMemory={

        ...this.characterMemory,

        ...data

    };


    this.characterCache.push(

        this.characterMemory

    );


    return this.characterMemory;

};


/*
============================================================
 Update Character Profile
============================================================
*/

PromptEngine.prototype.updateCharacterProfile=function(
    key,
    value
){

    if(

        this.characterMemory.hasOwnProperty(key)

    ){

        this.characterMemory[key]=value;

        return true;

    }


    return false;

};


/*
============================================================
 Add Signature Feature
============================================================
*/

PromptEngine.prototype.addCharacterFeature=function(
    feature
){

    if(feature){

        this.characterMemory

        .signatureFeatures

        .push(feature);

    }

};


/*
============================================================
 Reference Image Lock
============================================================
*/

PromptEngine.prototype.setCharacterReference=function(
    image
){

    this.characterMemory.referenceImage=

        image;


};


/*
============================================================
 Build Identity Description
============================================================
*/

PromptEngine.prototype.buildCharacterIdentity=function(){

    let data=[];


    Object.keys(

        this.characterMemory

    )

    .forEach(key=>{


        let value=

            this.characterMemory[key];



        if(

            Array.isArray(value)

        ){

            value=value.join(", ");

        }



        if(

            value &&

            key!=="referenceImage"

        ){

            data.push(value);

        }


    });



    return data.join(", ");

};


/*
============================================================
 Face Consistency Prompt
============================================================
*/

PromptEngine.prototype.buildFaceConsistency=function(){

    let identity=

        this.buildCharacterIdentity();



    return [

        "same character identity",

        "consistent facial features",

        "preserve face structure",

        identity

    ].join(", ");

};


/*
============================================================
 Character Lock Prompt
============================================================
*/

PromptEngine.prototype.generateCharacterLockPrompt=function(){

    let prompt=[];



    prompt.push(

        this.buildFaceConsistency()

    );


    if(

        this.characterMemory.outfit

    ){

        prompt.push(

            "same outfit: "+

            this.characterMemory.outfit

        );

    }



    if(

        this.characterMemory.personality

    ){

        prompt.push(

            "personality: "+

            this.characterMemory.personality

        );

    }



    return this.cleanPrompt(

        prompt.join(", ")

    );

};


/*
============================================================
 Pose Intelligence
============================================================
*/

PromptEngine.prototype.poseLibrary={


    standing:

    "natural standing pose, confident posture",


    sitting:

    "relaxed sitting pose, natural body position",


    walking:

    "walking movement, realistic body motion",


    action:

    "dynamic action pose, energetic movement",


    portrait:

    "professional portrait pose"


};


/*
============================================================
 Apply Pose
============================================================
*/

PromptEngine.prototype.setPose=function(
    type
){

    if(

        this.poseLibrary[type]

    ){

        this.characterData.pose=

            this.poseLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Expression Intelligence
============================================================
*/

PromptEngine.prototype.expressionLibrary={


    happy:

    "natural happy expression",


    serious:

    "serious confident expression",


    emotional:

    "deep emotional expression",


    smiling:

    "friendly realistic smile",


    mysterious:

    "mysterious cinematic expression"


};


/*
============================================================
 Apply Expression
============================================================
*/

PromptEngine.prototype.setExpression=function(
    type
){

    if(

        this.expressionLibrary[type]

    ){

        this.characterData.expression=

            this.expressionLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Character Prompt Injection
============================================================
*/

PromptEngine.prototype.injectCharacterLock=function(){

    this.promptData.character=

        this.generateCharacterLockPrompt();


};


/*
============================================================
 Character Snapshot
============================================================
*/

PromptEngine.prototype.saveCharacterMemory=function(){

    return JSON.parse(

        JSON.stringify(

            this.characterMemory

        )

    );

};



console.log(
"%cPromptEngine PART 3F Loaded",
"color:#ec4899;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3G
 PRODUCT LOCK INTELLIGENCE
============================================================
*/


/*
============================================================
 Product Memory Database
============================================================
*/

PromptEngine.prototype.productMemory={

    id:null,

    name:"",

    category:"",

    brand:"",

    description:"",

    material:"",

    shape:"",

    color:"",

    size:"",

    texture:"",

    logo:"",

    packaging:"",

    label:"",

    features:[],

    benefits:[],

    referenceImage:null,

    consistencyNotes:""

};


/*
============================================================
 Create Product Profile
============================================================
*/

PromptEngine.prototype.createProductProfile=function(
    data={}
){

    this.productMemory={

        ...this.productMemory,

        ...data

    };


    this.productCache.push(

        this.productMemory

    );


    return this.productMemory;

};


/*
============================================================
 Update Product Profile
============================================================
*/

PromptEngine.prototype.updateProductProfile=function(
    key,
    value
){

    if(

        this.productMemory.hasOwnProperty(key)

    ){

        this.productMemory[key]=value;

        return true;

    }


    return false;

};


/*
============================================================
 Set Product Reference Image
============================================================
*/

PromptEngine.prototype.setProductReference=function(
    image
){

    this.productMemory.referenceImage=

        image;

};


/*
============================================================
 Add Product Feature
============================================================
*/

PromptEngine.prototype.addProductFeature=function(
    feature
){

    if(feature){

        this.productMemory.features.push(

            feature

        );

    }

};


/*
============================================================
 Add Product Benefit
============================================================
*/

PromptEngine.prototype.addProductBenefit=function(
    benefit
){

    if(benefit){

        this.productMemory.benefits.push(

            benefit

        );

    }

};


/*
============================================================
 Build Product Identity
============================================================
*/

PromptEngine.prototype.buildProductIdentity=function(){

    let data=[];


    Object.keys(

        this.productMemory

    )

    .forEach(key=>{


        let value=

            this.productMemory[key];



        if(

            Array.isArray(value)

        ){

            value=value.join(", ");

        }



        if(

            value &&

            key!=="referenceImage"

        ){

            data.push(value);

        }


    });



    return data.join(", ");

};


/*
============================================================
 Product Consistency Prompt
============================================================
*/

PromptEngine.prototype.buildProductConsistency=function(){

    return [

        "same product identity",

        "preserve original product shape",

        "maintain exact color and material",

        "consistent branding",

        this.buildProductIdentity()

    ].join(", ");

};


/*
============================================================
 Product Lock Prompt
============================================================
*/

PromptEngine.prototype.generateProductLockPrompt=function(){

    let prompt=[];



    prompt.push(

        this.buildProductConsistency()

    );



    if(

        this.productMemory.packaging

    ){

        prompt.push(

            "packaging style: "+

            this.productMemory.packaging

        );

    }



    if(

        this.productMemory.features.length

    ){

        prompt.push(

            "features: "+

            this.productMemory.features.join(", ")

        );

    }



    return this.cleanPrompt(

        prompt.join(", ")

    );

};


/*
============================================================
 Product Photography Presets
============================================================
*/

PromptEngine.prototype.productShotLibrary={


    hero:

    "hero product shot, premium presentation",


    ecommerce:

    "clean ecommerce product photo, white background",


    lifestyle:

    "product in realistic lifestyle environment",


    luxury:

    "luxury commercial product advertising",


    macro:

    "macro product detail photography"


};


/*
============================================================
 Apply Product Shot
============================================================
*/

PromptEngine.prototype.setProductShot=function(
    type
){

    if(

        this.productShotLibrary[type]

    ){

        this.productData.presentation=

            this.productShotLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Product Scene Builder
============================================================
*/

PromptEngine.prototype.buildProductScene=function(
    scene={}
){

    this.productData={

        ...this.productData,

        ...scene

    };


    this.promptData.product=

        this.generateProductLockPrompt();


    return this.buildMasterPrompt();

};


/*
============================================================
 Product Injection
============================================================
*/

PromptEngine.prototype.injectProductLock=function(){

    this.promptData.product=

        this.generateProductLockPrompt();

};


/*
============================================================
 Product Snapshot
============================================================
*/

PromptEngine.prototype.saveProductMemory=function(){

    return JSON.parse(

        JSON.stringify(

            this.productMemory

        )

    );

};



console.log(
"%cPromptEngine PART 3G Loaded",
"color:#14b8a6;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3H
 STORYBOARD & SCENE INTELLIGENCE
============================================================
*/


/*
============================================================
 Scene Memory Database
============================================================
*/

PromptEngine.prototype.storyMemory={

    title:"",

    genre:"",

    theme:"",

    duration:0,

    scenes:[],

    characters:[],

    products:[],

    continuityNotes:""

};


/*
============================================================
 Scene Structure Template
============================================================
*/

PromptEngine.prototype.defaultScene={

    id:0,

    title:"",

    duration:8,

    description:"",

    location:"",

    time:"",

    character:"",

    action:"",

    camera:"",

    movement:"",

    lighting:"",

    mood:"",

    audio:"",

    transition:""

};


/*
============================================================
 Create Story
============================================================
*/

PromptEngine.prototype.createStory=function(
    data={}
){

    this.storyMemory={

        ...this.storyMemory,

        ...data

    };


    return this.storyMemory;

};


/*
============================================================
 Create Scene
============================================================
*/

PromptEngine.prototype.createScene=function(
    data={}
){

    let scene={

        ...this.defaultScene

    };


    scene={

        ...scene,

        ...data

    };


    scene.id=

        this.storyMemory.scenes.length+1;



    if(!scene.duration)

        scene.duration=8;



    this.storyMemory.scenes.push(

        scene

    );


    return scene;

};


/*
============================================================
 Add Scene
============================================================
*/

PromptEngine.prototype.addScene=function(
    scene
){

    return this.createScene(

        scene

    );

};


/*
============================================================
 Update Scene
============================================================
*/

PromptEngine.prototype.updateScene=function(
    id,
    data
){

    let scene=

        this.storyMemory.scenes.find(

            s=>s.id===id

        );


    if(!scene)

        return false;



    Object.assign(

        scene,

        data

    );


    return true;

};


/*
============================================================
 Generate Scene Prompt
============================================================
*/

PromptEngine.prototype.buildScenePrompt=function(
    scene
){

    let parts=[];



    Object.keys(scene)

    .forEach(key=>{


        if(

            key==="id"

        )

        return;



        let value=

            scene[key];



        if(

            value &&

            String(value).trim()!== ""

        ){

            parts.push(value);

        }


    });



    return this.cleanPrompt(

        parts.join(", ")

    );

};


/*
============================================================
 Generate Storyboard
============================================================
*/

PromptEngine.prototype.generateStoryboard=function(){

    return this.storyMemory.scenes.map(

        scene=>{


            return {

                id:scene.id,

                duration:scene.duration,

                prompt:

                this.buildScenePrompt(

                    scene

                )

            };


        }

    );

};


/*
============================================================
 Auto Scene Generator
============================================================
*/

PromptEngine.prototype.autoGenerateScenes=function(
    count=5,
    concept=""
){

    this.storyMemory.scenes=[];



    for(

        let i=1;

        i<=count;

        i++

    ){

        this.createScene({

            title:

            "Scene "+i,


            duration:8,


            description:

            concept,


            camera:

            "cinematic camera movement",


            lighting:

            "professional cinematic lighting",


            transition:

            "smooth transition"

        });

    }



    return this.storyMemory.scenes;

};


/*
============================================================
 Scene Continuity System
============================================================
*/

PromptEngine.prototype.buildContinuity=function(){

    let data=[];



    if(

        this.characterMemory.name

    ){

        data.push(

            "same character throughout all scenes"

        );

    }



    if(

        this.productMemory.name

    ){

        data.push(

            "same product appearance throughout scenes"

        );

    }



    data.push(

        "consistent visual style",

        "consistent color grading",

        "continuous storytelling"

    );



    this.storyMemory.continuityNotes=

        data.join(", ");



    return this.storyMemory.continuityNotes;

};


/*
============================================================
 Video Scene Prompt Generator
============================================================
*/

PromptEngine.prototype.generateVideoStoryboard=function(){

    this.config.output="video";



    let continuity=

        this.buildContinuity();



    return this.storyMemory.scenes.map(

        scene=>{


            return {

                scene:scene.id,

                duration:

                scene.duration || 8,


                prompt:

                this.cleanPrompt(

                    this.buildScenePrompt(scene)

                    +

                    ", "

                    +

                    continuity

                )

            };


        }

    );

};



console.log(
"%cPromptEngine PART 3H Loaded",
"color:#e11d48;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3I
 VOICE & AUDIO INTELLIGENCE ENGINE
============================================================
*/


/*
============================================================
 Voice Memory Database
============================================================
*/

PromptEngine.prototype.voiceMemory={

    narrator:"",

    language:"",

    tone:"",

    emotion:"",

    speed:"",

    style:"",

    scenes:[],

    script:""

};


/*
============================================================
 Voice Preset Library
============================================================
*/

PromptEngine.prototype.voiceLibrary={


    cinematic:{

        tone:

        "deep cinematic narration",

        emotion:

        "dramatic emotional storytelling",

        speed:

        "slow cinematic pace"

    },


    commercial:{

        tone:

        "professional advertising voice",

        emotion:

        "confident persuasive",

        speed:

        "clear medium pace"

    },


    documentary:{

        tone:

        "documentary narrator style",

        emotion:

        "informative calm",

        speed:

        "natural pace"

    },


    friendly:{

        tone:

        "friendly creator voice",

        emotion:

        "warm and engaging",

        speed:

        "natural conversational"

    },


    dramatic:{

        tone:

        "dramatic movie trailer voice",

        emotion:

        "powerful emotional delivery",

        speed:

        "slow intense"

    }


};


/*
============================================================
 Apply Voice Preset
============================================================
*/

PromptEngine.prototype.applyVoicePreset=function(
    type
){

    let preset=

        this.voiceLibrary[type];


    if(!preset)

        return false;



    this.voiceMemory={

        ...this.voiceMemory,

        ...preset

    };



    this.voiceMemory.style=

        type;



    return true;

};


/*
============================================================
 Set Voice Data
============================================================
*/

PromptEngine.prototype.setVoiceData=function(
    key,
    value
){

    if(

        this.voiceMemory.hasOwnProperty(key)

    ){

        this.voiceMemory[key]=value;


        return true;

    }


    return false;

};


/*
============================================================
 Create Narration Script
============================================================
*/

PromptEngine.prototype.createNarration=function(
    text,
    options={}
){

    this.voiceMemory.script=

        text;



    this.voiceMemory={

        ...this.voiceMemory,

        ...options

    };



    return this.voiceMemory;

};


/*
============================================================
 Scene Voice Mapping
============================================================
*/

PromptEngine.prototype.addSceneVoice=function(
    sceneId,
    text,
    emotion=""
){

    this.voiceMemory.scenes.push({

        scene:sceneId,

        text:text,

        emotion:emotion,

        duration:8

    });


};


/*
============================================================
 Auto Voice Script Generator
============================================================
*/

PromptEngine.prototype.generateVoiceScript=function(
    scenes=[]
){

    let script=[];



    scenes.forEach(

        scene=>{


            script.push(

                "Scene "+

                scene.id

                +

                ": "

                +

                scene.description

            );


        }

    );



    this.voiceMemory.script=

        script.join("\n");



    return this.voiceMemory.script;

};


/*
============================================================
 TTS Preparation Format
============================================================
*/

PromptEngine.prototype.prepareTTS=function(){

    return {


        voice:

        this.voiceMemory.narrator,


        language:

        this.voiceMemory.language,


        style:

        this.voiceMemory.style,


        tone:

        this.voiceMemory.tone,


        emotion:

        this.voiceMemory.emotion,


        speed:

        this.voiceMemory.speed,


        script:

        this.voiceMemory.script


    };

};


/*
============================================================
 Voice + Scene Timeline
============================================================
*/

PromptEngine.prototype.generateAudioTimeline=function(){

    return this.voiceMemory.scenes.map(

        item=>{


            return {


                scene:item.scene,


                duration:

                item.duration,


                narration:

                item.text,


                emotion:

                item.emotion


            };


        }

    );

};


/*
============================================================
 Complete Video Package
============================================================
*/

PromptEngine.prototype.buildVideoPackage=function(){

    return {


        storyboard:

        this.generateVideoStoryboard(),


        voice:

        this.prepareTTS(),


        audioTimeline:

        this.generateAudioTimeline()


    };

};



console.log(
"%cPromptEngine PART 3I Loaded",
"color:#38bdf8;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 3J
 FINAL SMART GENERATOR API
============================================================
*/


/*
============================================================
 Engine Bridge Registry
============================================================
*/

PromptEngine.prototype.modules={

    character:null,

    product:null,

    scene:null,

    storyboard:null,

    voice:null,

    export:null

};


/*
============================================================
 Connect Module
============================================================
*/

PromptEngine.prototype.connectModule=function(
    name,
    module
){

    if(

        this.modules.hasOwnProperty(name)

    ){

        this.modules[name]=module;

        return true;

    }


    return false;

};


/*
============================================================
 Get Module
============================================================
*/

PromptEngine.prototype.getModule=function(
    name
){

    return this.modules[name] || null;

};


/*
============================================================
 Prompt Score System
============================================================
*/

PromptEngine.prototype.calculatePromptScore=function(
    prompt
){

    let score=0;



    let checks=[


        {

            key:"subject",

            value:this.promptData.subject,

            point:15

        },


        {

            key:"environment",

            value:this.promptData.environment,

            point:10

        },


        {

            key:"style",

            value:this.promptData.style,

            point:15

        },


        {

            key:"camera",

            value:this.cameraData.shot,

            point:10

        },


        {

            key:"lighting",

            value:this.lightingData.type,

            point:10

        },


        {

            key:"character",

            value:this.characterMemory.name,

            point:10

        },


        {

            key:"product",

            value:this.productMemory.name,

            point:10

        },


        {

            key:"quality",

            value:this.promptData.quality,

            point:10

        }


    ];



    checks.forEach(item=>{


        if(item.value)

            score+=item.point;


    });



    return {


        score:Math.min(score,100),


        level:

        score>=80

        ?

        "Professional"

        :

        score>=50

        ?

        "Good"

        :

        "Basic"


    };

};


/*
============================================================
 Smart Final Generator
============================================================
*/

PromptEngine.prototype.smartCreate=function(
    options={}
){

    if(options.provider)

        this.setProvider(

            options.provider

        );



    if(options.output)

        this.config.output=

            options.output;



    let result=

        this.create();



    result.analysis=

        this.calculatePromptScore(

            result.prompt

        );



    return result;

};


/*
============================================================
 Generate Complete AI Package
============================================================
*/

PromptEngine.prototype.generateCreatorPackage=function(){

    return {


        image:

        this.createImagePrompt(),


        video:

        this.createVideoPrompt(),


        storyboard:

        this.generateVideoStoryboard(),


        voice:

        this.prepareTTS(),


        project:

        this.snapshot()


    };

};


/*
============================================================
 Quick Product Creator
============================================================
*/

PromptEngine.prototype.quickProductAI=function(
    data={}
){

    this.createProductProfile(

        data

    );


    this.applyCreativePreset(

        "productPhotography"

    );


    this.setProductShot(

        "hero"

    );


    return this.createImagePrompt();

};


/*
============================================================
 Quick Character Creator
============================================================
*/

PromptEngine.prototype.quickCharacterAI=function(
    data={}
){

    this.createCharacterProfile(

        data

    );


    this.injectCharacterLock();



    return this.createImagePrompt();

};


/*
============================================================
 Quick Video Creator
============================================================
*/

PromptEngine.prototype.quickVideoAI=function(
    scenes=[]
){

    this.storyMemory.scenes=

        scenes;



    this.config.output="video";



    return this.generateCreatorPackage();

};


/*
============================================================
 Export Ready Data
============================================================
*/

PromptEngine.prototype.exportReady=function(){

    return {


        engine:

        "PowerTools Prompt Engine",


        version:

        this.version,


        generated:

        new Date()

        .toISOString(),


        data:

        this.generateCreatorPackage()


    };

};


/*
============================================================
 Final Initialization Check
============================================================
*/

PromptEngine.prototype.ready=function(){

    return {


        status:

        "READY",


        engine:

        this.version,


        features:[

            "Smart Prompt Generator",

            "Character Lock",

            "Product Lock",

            "Storyboard",

            "Voice Engine",

            "AI Provider Formatter",

            "Export System"

        ]

    };

};



console.log(
"%cPromptEngine PART 3J Loaded - SMART ENGINE COMPLETE",
"color:#22c55e;font-weight:bold;font-size:15px;"
);
