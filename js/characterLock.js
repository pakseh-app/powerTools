/*
============================================================
 PowerTools AI Creator Suite
 characterLock.js
 PART 1
 CHARACTER LOCK CORE ENGINE
============================================================
*/


/*
============================================================
 CharacterLock Constructor
============================================================
*/

class CharacterLock {


    constructor(){


        this.version="1.0.0";


        this.character={

            id:null,

            name:"",

            description:"",

            referenceImage:null,

            faceData:{},

            appearance:{},

            outfit:{},

            consistencyLevel:100,

            notes:""

        };



        this.history=[];


        this.status="initialized";


        console.log(

            "%cCharacterLock Engine Initialized",

            "color:#ec4899;font-weight:bold;"

        );


    }


/*
============================================================
 Create Character ID
============================================================
*/


generateID(){


    return (

        "CHAR_"

        +

        Date.now()

    );


}



/*
============================================================
 Create Character Profile
============================================================
*/


createProfile(data={}){


    this.character.id=

        this.generateID();



    this.character={

        ...this.character,

        ...data

    };



    this.saveHistory();



    return this.character;


}



/*
============================================================
 Update Character Data
============================================================
*/


update(key,value){


    if(

        this.character.hasOwnProperty(key)

    ){


        this.character[key]=value;


        this.saveHistory();


        return true;


    }


    return false;


}



/*
============================================================
 Save History
============================================================
*/


saveHistory(){


    this.history.push(

        JSON.parse(

            JSON.stringify(

                this.character

            )

        )

    );



    if(

        this.history.length>20

    ){

        this.history.shift();

    }


}



/*
============================================================
 Get Character
============================================================
*/


getCharacter(){


    return this.character;


}



/*
============================================================
 Reset Character
============================================================
*/


reset(){


    this.character={


        id:null,

        name:"",

        description:"",

        referenceImage:null,

        faceData:{},

        appearance:{},

        outfit:{},

        consistencyLevel:100,

        notes:""


    };


}



/*
============================================================
 Status
============================================================
*/


getStatus(){


    return {


        engine:

        "CharacterLock",


        version:

        this.version,


        status:

        this.status,


        characterID:

        this.character.id


    };


}



}


/*
============================================================
 Global Export
============================================================
*/


window.CharacterLock=

    CharacterLock;



console.log(

"%cCharacterLock PART 1 Loaded",

"color:#ec4899;font-weight:bold;"

);

/*
============================================================
 PowerTools AI Creator Suite
 characterLock.js
 PART 2
 REFERENCE IMAGE SYSTEM
============================================================
*/


/*
============================================================
 Set Reference Image
============================================================
*/

CharacterLock.prototype.setReferenceImage=function(
    image
){

    this.character.referenceImage={

        source:image,

        uploaded:

        new Date()

        .toISOString()

    };


    this.saveHistory();



    return this.character.referenceImage;

};


/*
============================================================
 Remove Reference Image
============================================================
*/

CharacterLock.prototype.removeReferenceImage=function(){

    this.character.referenceImage=null;


    this.saveHistory();


    return true;

};


/*
============================================================
 Get Reference Image
============================================================
*/

CharacterLock.prototype.getReferenceImage=function(){

    return this.character.referenceImage;

};


/*
============================================================
 Image Metadata
============================================================
*/

CharacterLock.prototype.setImageMetadata=function(
    data={}
){

    this.character.faceData={

        ...this.character.faceData,

        ...data

    };


    this.saveHistory();



    return this.character.faceData;

};


/*
============================================================
 Upload Handler
============================================================
*/

CharacterLock.prototype.handleUpload=function(
    file
){

    if(!file)

        return false;



    let data={


        name:file.name || "",


        type:file.type || "",


        size:file.size || 0,


        lastModified:

        file.lastModified || null


    };



    this.character.referenceImage={


        file:file,


        metadata:data,


        uploaded:

        new Date()

        .toISOString()


    };



    this.saveHistory();



    return this.character.referenceImage;

};


/*
============================================================
 Validate Image
============================================================
*/

CharacterLock.prototype.validateImage=function(
    file
){

    if(!file)

        return {


            valid:false,


            message:"No image selected"


        };



    let allowed=[

        "image/jpeg",

        "image/png",

        "image/webp"

    ];



    if(

        !allowed.includes(

            file.type

        )

    ){

        return {


            valid:false,


            message:"Unsupported image format"


        };


    }



    return {


        valid:true,


        message:"Image accepted"


    };


};


/*
============================================================
 Identity Reference Builder
============================================================
*/

CharacterLock.prototype.buildIdentityReference=function(){

    let data=[];



    if(

        this.character.name

    )

        data.push(

            this.character.name

        );



    if(

        this.character.description

    )

        data.push(

            this.character.description

        );



    Object.values(

        this.character.appearance

    )

    .forEach(value=>{


        if(value)

            data.push(value);


    });



    return data.join(", ");

};


/*
============================================================
 Generate Face Lock Data
============================================================
*/

CharacterLock.prototype.generateFaceLock=function(){

    return {


        identity:

        this.buildIdentityReference(),


        reference:

        this.character.referenceImage,


        consistency:

        this.character.consistencyLevel,


        instruction:

        [

            "preserve same face",

            "maintain facial identity",

            "keep character consistent"

        ].join(", ")


    };

};


/*
============================================================
 Connect To Prompt Engine
============================================================
*/

CharacterLock.prototype.connectPromptEngine=function(
    engine
){

    if(!engine)

        return false;



    engine.characterMemory={

        ...engine.characterMemory,


        ...this.character


    };



    engine.injectCharacterLock();



    return true;

};



console.log(
"%cCharacterLock PART 2 Loaded",
"color:#f472b6;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 characterLock.js
 PART 3
 FACE CONSISTENCY ENGINE
============================================================
*/


/*
============================================================
 Appearance Lock
============================================================
*/

CharacterLock.prototype.setAppearanceLock=function(
    data={}
){

    this.character.appearance={

        ...this.character.appearance,

        ...data

    };


    this.saveHistory();


    return this.character.appearance;

};


/*
============================================================
 Outfit Lock
============================================================
*/

CharacterLock.prototype.setOutfitLock=function(
    data={}
){

    this.character.outfit={

        ...this.character.outfit,

        ...data

    };


    this.saveHistory();


    return this.character.outfit;

};


/*
============================================================
 Face Attribute Lock
============================================================
*/

CharacterLock.prototype.setFaceAttributes=function(
    data={}
){

    this.character.faceData={

        ...this.character.faceData,

        ...data

    };


    this.saveHistory();


    return this.character.faceData;

};


/*
============================================================
 Consistency Level
============================================================
*/

CharacterLock.prototype.setConsistencyLevel=function(
    level
){

    level=

    Math.max(

        0,

        Math.min(

            100,

            level

        )

    );



    this.character.consistencyLevel=

        level;



    return level;

};


/*
============================================================
 Generate Consistency Instruction
============================================================
*/

CharacterLock.prototype.generateConsistencyPrompt=function(){

    let instructions=[

        "same person identity",

        "preserve exact facial structure",

        "maintain character appearance",

        "consistent face across all images"

    ];



    if(

        this.character.consistencyLevel>=80

    ){

        instructions.push(

            "maximum identity preservation"

        );

    }



    if(

        this.character.outfit

    &&

        Object.keys(

            this.character.outfit

        ).length

    ){

        instructions.push(

            "keep same outfit design"

        );

    }



    return instructions.join(", ");

};


/*
============================================================
 Build Character Prompt
============================================================
*/

CharacterLock.prototype.buildCharacterPrompt=function(){

    let result=[];



    let identity=

        this.buildIdentityReference();



    if(identity)

        result.push(identity);



    let consistency=

        this.generateConsistencyPrompt();



    if(consistency)

        result.push(consistency);



    Object.values(

        this.character.faceData

    )

    .forEach(value=>{


        if(value)

            result.push(value);


    });



    Object.values(

        this.character.outfit

    )

    .forEach(value=>{


        if(value)

            result.push(value);


    });



    return result.join(", ");

};


/*
============================================================
 Scene Character Data
============================================================
*/

CharacterLock.prototype.createSceneCharacter=function(
    sceneID,
    action=""
){

    return {


        scene:sceneID,


        characterID:

        this.character.id,


        identity:

        this.buildCharacterPrompt(),


        action:action,


        consistency:

        this.character.consistencyLevel


    };

};


/*
============================================================
 Multi Scene Lock
============================================================
*/

CharacterLock.prototype.generateMultiSceneLock=function(
    scenes=[]
){

    return scenes.map(

        scene=>{


            return this.createSceneCharacter(

                scene.id,

                scene.action || ""

            );


        }

    );

};


/*
============================================================
 Character Variation
============================================================
*/

CharacterLock.prototype.createVariation=function(
    options={}
){

    return {


        baseCharacter:

        this.character.id,


        variation:

        options,


        preserve:

        [

            "face",

            "identity",

            "main features"

        ],


        allowChange:

        [

            "pose",

            "camera",

            "environment"

        ]


    };

};


/*
============================================================
 Final Character Package
============================================================
*/

CharacterLock.prototype.exportCharacterPackage=function(){

    return {


        character:

        this.character,


        faceLock:

        this.generateFaceLock(),


        consistency:

        this.generateConsistencyPrompt()


    };

};



console.log(
"%cCharacterLock PART 3 Loaded",
"color:#db2777;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 characterLock.js
 PART 4
 ADVANCED IDENTITY MEMORY ENGINE
============================================================
*/


/*
============================================================
 Character Library
============================================================
*/

CharacterLock.prototype.characterLibrary=[];


/*
============================================================
 Save Character Profile
============================================================
*/

CharacterLock.prototype.saveProfile=function(){

    let profile=

    JSON.parse(

        JSON.stringify(

            this.character

        )

    );


    this.characterLibrary.push(

        profile

    );


    return profile;

};


/*
============================================================
 Load Character Profile
============================================================
*/

CharacterLock.prototype.loadProfile=function(
    id
){

    let profile=

        this.characterLibrary.find(

            item=>item.id===id

        );



    if(!profile)

        return false;



    this.character=

        JSON.parse(

            JSON.stringify(

                profile

            )

        );



    return this.character;

};


/*
============================================================
 Delete Character Profile
============================================================
*/

CharacterLock.prototype.deleteProfile=function(
    id
){

    this.characterLibrary=

    this.characterLibrary.filter(

        item=>item.id!==id

    );


    return true;

};


/*
============================================================
 Get Character Library
============================================================
*/

CharacterLock.prototype.getLibrary=function(){

    return this.characterLibrary;

};


/*
============================================================
 Clone Character
============================================================
*/

CharacterLock.prototype.cloneCharacter=function(){

    return JSON.parse(

        JSON.stringify(

            this.character

        )

    );

};


/*
============================================================
 Character Prompt Injection
============================================================
*/

CharacterLock.prototype.injectPrompt=function(
    prompt=""
){

    let characterPrompt=

        this.buildCharacterPrompt();



    return (

        characterPrompt

        +

        ", "

        +

        prompt

    );


};


/*
============================================================
 AI Model Instructions
============================================================
*/

CharacterLock.prototype.generateAIInstruction=function(){

    return {


        identity:

        this.buildIdentityReference(),


        rules:

        [

            "keep same face",

            "maintain identity",

            "preserve hairstyle",

            "preserve body characteristics",

            "keep visual consistency"

        ],


        consistency:

        this.character.consistencyLevel


    };

};


/*
============================================================
 Character Comparison Data
============================================================
*/

CharacterLock.prototype.compareIdentity=function(
    characterData
){

    let score=0;


    let base=

        this.character;



    if(

        characterData.faceData

    &&

        JSON.stringify(

            characterData.faceData

        )

        ===

        JSON.stringify(

            base.faceData

        )

    ){

        score+=40;

    }



    if(

        characterData.appearance

        &&

        JSON.stringify(

            characterData.appearance

        )

        ===

        JSON.stringify(

            base.appearance

        )

    ){

        score+=30;

    }



    if(

        characterData.outfit

        &&

        JSON.stringify(

            characterData.outfit

        )

        ===

        JSON.stringify(

            base.outfit

        )

    ){

        score+=30;

    }



    return {


        matchScore:score,


        sameIdentity:

        score>=70


    };


};


/*
============================================================
 Character Export JSON
============================================================
*/

CharacterLock.prototype.exportJSON=function(){

    return JSON.stringify(

        this.exportCharacterPackage(),

        null,

        4

    );

};


/*
============================================================
 Character Import JSON
============================================================
*/

CharacterLock.prototype.importJSON=function(
    json
){

    try{


        let data=

            typeof json==="string"

            ?

            JSON.parse(json)

            :

            json;



        this.character=

            data.character ||

            data;



        return true;


    }

    catch(error){


        console.error(error);


        return false;


    }

};


/*
============================================================
 Engine Ready
============================================================
*/

CharacterLock.prototype.ready=function(){

    return {


        engine:

        "CharacterLock",


        version:

        this.version,


        status:

        "READY",


        features:[

            "Face Consistency",

            "Identity Memory",

            "Character Library",

            "Prompt Injection",

            "Multi Scene Lock"

        ]


    };

};



console.log(
"%cCharacterLock PART 4 Loaded",
"color:#be185d;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 characterLock.js
 PART 5
 FINAL INTEGRATION API
============================================================
*/


/*
============================================================
 Event System
============================================================
*/

CharacterLock.prototype.events={};


/*
============================================================
 Register Event
============================================================
*/

CharacterLock.prototype.on=function(
    event,
    callback
){

    if(

        !this.events[event]

    ){

        this.events[event]=[];

    }


    this.events[event].push(

        callback

    );

};


/*
============================================================
 Trigger Event
============================================================
*/

CharacterLock.prototype.emit=function(
    event,
    data
){

    if(

        !this.events[event]

    )

        return;



    this.events[event]

    .forEach(callback=>{


        callback(data);


    });


};


/*
============================================================
 Enhanced Profile Update
============================================================
*/

CharacterLock.prototype.updateProfile=function(
    data={}
){

    this.character={

        ...this.character,

        ...data

    };


    this.saveHistory();


    this.emit(

        "characterUpdated",

        this.character

    );


    return this.character;

};


/*
============================================================
 Connect Prompt Engine Advanced
============================================================
*/

CharacterLock.prototype.attachPromptEngine=function(
    engine
){

    if(!engine)

        return false;



    this.promptEngine=

        engine;



    engine.characterMemory={

        ...engine.characterMemory,


        ...this.character


    };



    engine.characterData={

        ...engine.characterData,


        identity:

        this.buildCharacterPrompt()


    };



    return true;

};


/*
============================================================
 Generate Final Character Prompt
============================================================
*/

CharacterLock.prototype.generateFinalPrompt=function(
    basePrompt=""
){

    let identity=

        this.buildCharacterPrompt();



    return [

        identity,

        this.generateConsistencyPrompt(),

        basePrompt

    ]

    .filter(Boolean)

    .join(", ");

};


/*
============================================================
 Upload Preview Data
============================================================
*/

CharacterLock.prototype.createPreviewData=function(){

    return {


        id:

        this.character.id,


        name:

        this.character.name,


        image:

        this.character.referenceImage,


        status:

        "locked"



    };

};


/*
============================================================
 Character Package For Export
============================================================
*/

CharacterLock.prototype.exportPackage=function(){

    return {


        engine:

        "PowerTools CharacterLock",


        version:

        this.version,


        created:

        new Date()

        .toISOString(),


        character:

        this.character,


        aiInstruction:

        this.generateAIInstruction(),


        preview:

        this.createPreviewData()


    };

};


/*
============================================================
 Destroy Instance
============================================================
*/

CharacterLock.prototype.destroy=function(){

    this.character=null;

    this.history=[];

    this.characterLibrary=[];

    this.events={};


};


/*
============================================================
 Global Factory
============================================================
*/

window.createCharacterLock=function(){

    return new CharacterLock();

};


/*
============================================================
 Final Ready Message
============================================================
*/

console.log(
"%cCharacterLock COMPLETE - READY",
"color:#22c55e;font-weight:bold;font-size:15px;"
);
