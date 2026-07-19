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

})(window);

/*
============================================================
 PowerTools AI Creator Suite
 promptEngine.js
 PART 2A
 CORE PROMPT BUILDER
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

