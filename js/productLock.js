/*
============================================================
 PowerTools AI Creator Suite
 productLock.js
 PART 1
 PRODUCT LOCK CORE ENGINE
============================================================
*/


/*
============================================================
 ProductLock Constructor
============================================================
*/

class ProductLock {


    constructor(){


        this.version="1.0.0";


        this.product={


            id:null,


            name:"",


            brand:"",


            category:"",


            description:"",


            referenceImage:null,


            identity:{},


            material:"",


            color:"",


            shape:"",


            packaging:{},


            features:[],


            benefits:[],


            consistencyLevel:100,


            notes:""


        };



        this.history=[];


        this.productLibrary=[];


        this.status="initialized";



        console.log(

            "%cProductLock Engine Initialized",

            "color:#14b8a6;font-weight:bold;"

        );


    }



/*
============================================================
 Generate Product ID
============================================================
*/


generateID(){


    return (

        "PROD_"

        +

        Date.now()

    );


}



/*
============================================================
 Create Product Profile
============================================================
*/


createProfile(data={}){


    this.product.id=

        this.generateID();



    this.product={

        ...this.product,

        ...data

    };



    this.saveHistory();



    return this.product;


}



/*
============================================================
 Update Product Data
============================================================
*/


update(key,value){


    if(

        this.product.hasOwnProperty(key)

    ){


        this.product[key]=value;



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

                this.product

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
 Get Product
============================================================
*/


getProduct(){


    return this.product;


}



/*
============================================================
 Reset Product
============================================================
*/


reset(){


    this.product={


        id:null,

        name:"",

        brand:"",

        category:"",

        description:"",

        referenceImage:null,

        identity:{},

        material:"",

        color:"",

        shape:"",

        packaging:{},

        features:[],

        benefits:[],

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

        "ProductLock",


        version:

        this.version,


        status:

        this.status,


        productID:

        this.product.id


    };


}



}


/*
============================================================
 Global Export
============================================================
*/


window.ProductLock=

    ProductLock;



console.log(

"%cProductLock PART 1 Loaded",

"color:#14b8a6;font-weight:bold;"

);

/*
============================================================
 PowerTools AI Creator Suite
 productLock.js
 PART 2
 PRODUCT REFERENCE IMAGE SYSTEM
============================================================
*/


/*
============================================================
 Set Product Reference Image
============================================================
*/

ProductLock.prototype.setReferenceImage=function(
    image
){

    this.product.referenceImage={

        source:image,

        uploaded:

        new Date()

        .toISOString()

    };


    this.saveHistory();



    return this.product.referenceImage;

};


/*
============================================================
 Remove Reference Image
============================================================
*/

ProductLock.prototype.removeReferenceImage=function(){

    this.product.referenceImage=null;


    this.saveHistory();


    return true;

};


/*
============================================================
 Get Reference Image
============================================================
*/

ProductLock.prototype.getReferenceImage=function(){

    return this.product.referenceImage;

};


/*
============================================================
 Handle Product Upload
============================================================
*/

ProductLock.prototype.handleUpload=function(
    file
){

    if(!file)

        return false;



    let metadata={


        name:

        file.name || "",


        type:

        file.type || "",


        size:

        file.size || 0,


        modified:

        file.lastModified || null


    };



    this.product.referenceImage={


        file:file,


        metadata:metadata,


        uploaded:

        new Date()

        .toISOString()


    };



    this.saveHistory();



    return this.product.referenceImage;

};


/*
============================================================
 Validate Product Image
============================================================
*/

ProductLock.prototype.validateImage=function(
    file
){

    if(!file)

        return {


            valid:false,


            message:

            "No product image selected"


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


            message:

            "Unsupported image format"


        };


    }



    return {


        valid:true,


        message:

        "Product image accepted"


    };


};


/*
============================================================
 Set Product Identity Data
============================================================
*/

ProductLock.prototype.setIdentity=function(
    data={}
){

    this.product.identity={

        ...this.product.identity,

        ...data

    };



    this.saveHistory();



    return this.product.identity;

};


/*
============================================================
 Set Packaging Data
============================================================
*/

ProductLock.prototype.setPackaging=function(
    data={}
){

    this.product.packaging={

        ...this.product.packaging,

        ...data

    };



    this.saveHistory();



    return this.product.packaging;

};


/*
============================================================
 Add Feature
============================================================
*/

ProductLock.prototype.addFeature=function(
    feature
){

    if(feature){


        this.product.features.push(

            feature

        );


    }


};


/*
============================================================
 Add Benefit
============================================================
*/

ProductLock.prototype.addBenefit=function(
    benefit
){

    if(benefit){


        this.product.benefits.push(

            benefit

        );


    }


};


/*
============================================================
 Build Product Image Data
============================================================
*/

ProductLock.prototype.getImageData=function(){

    return {


        image:

        this.product.referenceImage,


        identity:

        this.product.identity,


        consistency:

        this.product.consistencyLevel


    };


};



console.log(
"%cProductLock PART 2 Loaded",
"color:#2dd4bf;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 productLock.js
 PART 3
 PRODUCT CONSISTENCY ENGINE
============================================================
*/


/*
============================================================
 Set Consistency Level
============================================================
*/

ProductLock.prototype.setConsistencyLevel=function(
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



    this.product.consistencyLevel=

        level;



    return level;

};


/*
============================================================
 Material Lock
============================================================
*/

ProductLock.prototype.setMaterialLock=function(
    material
){

    this.product.material=

        material;



    this.saveHistory();



    return material;

};


/*
============================================================
 Color Lock
============================================================
*/

ProductLock.prototype.setColorLock=function(
    color
){

    this.product.color=

        color;



    this.saveHistory();



    return color;

};


/*
============================================================
 Shape Lock
============================================================
*/

ProductLock.prototype.setShapeLock=function(
    shape
){

    this.product.shape=

        shape;



    this.saveHistory();



    return shape;

};


/*
============================================================
 Brand Lock
============================================================
*/

ProductLock.prototype.setBrandLock=function(
    brand
){

    this.product.brand=

        brand;



    this.saveHistory();



    return brand;

};


/*
============================================================
 Generate Product Consistency Prompt
============================================================
*/

ProductLock.prototype.generateConsistencyPrompt=function(){

    let prompt=[];



    prompt.push(

        "same product identity",

        "preserve exact product shape",

        "maintain original color",

        "keep material texture",

        "consistent branding"

    );



    if(

        this.product.consistencyLevel>=80

    ){

        prompt.push(

            "maximum product preservation"

        );

    }



    return prompt.join(", ");

};


/*
============================================================
 Build Product Identity Prompt
============================================================
*/

ProductLock.prototype.buildIdentityPrompt=function(){

    let data=[];



    Object.keys(

        this.product.identity

    )

    .forEach(key=>{


        let value=

            this.product.identity[key];



        if(value)

            data.push(value);


    });



    return data.join(", ");

};


/*
============================================================
 Generate Product Lock Prompt
============================================================
*/

ProductLock.prototype.generateProductLockPrompt=function(){

    let prompt=[];



    if(

        this.product.name

    )

        prompt.push(

            this.product.name

        );



    if(

        this.product.brand

    )

        prompt.push(

            this.product.brand

        );



    if(

        this.product.category

    )

        prompt.push(

            this.product.category

        );



    let identity=

        this.buildIdentityPrompt();



    if(identity)

        prompt.push(identity);



    let consistency=

        this.generateConsistencyPrompt();



    prompt.push(consistency);



    if(

        this.product.material

    )

        prompt.push(

            "material: "+

            this.product.material

        );



    if(

        this.product.color

    )

        prompt.push(

            "color: "+

            this.product.color

        );



    return prompt.join(", ");

};


/*
============================================================
 Product AI Instruction
============================================================
*/

ProductLock.prototype.generateAIInstruction=function(){

    return {


        identity:

        this.generateProductLockPrompt(),


        rules:[


            "keep same product",

            "do not change logo",

            "preserve packaging",

            "maintain original proportions",

            "keep realistic material"

        ],


        consistency:

        this.product.consistencyLevel


    };

};


/*
============================================================
 Product Prompt Injection
============================================================
*/

ProductLock.prototype.injectPrompt=function(
    prompt=""
){

    return [

        this.generateProductLockPrompt(),

        prompt

    ]

    .filter(Boolean)

    .join(", ");

};



console.log(
"%cProductLock PART 3 Loaded",
"color:#0f766e;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 productLock.js
 PART 4
 PRODUCT PHOTOGRAPHY ENGINE
============================================================
*/


/*
============================================================
 Product Shot Library
============================================================
*/

ProductLock.prototype.shotLibrary={


    hero:{

        name:

        "Hero Product Shot",

        prompt:

        "premium hero product photography, product centered, commercial quality"

    },


    ecommerce:{

        name:

        "E-commerce Product Shot",

        prompt:

        "clean ecommerce photography, isolated product, professional catalog style"

    },


    lifestyle:{

        name:

        "Lifestyle Product Shot",

        prompt:

        "product placed in realistic lifestyle environment"

    },


    luxury:{

        name:

        "Luxury Advertising Shot",

        prompt:

        "luxury commercial advertisement, premium atmosphere"

    },


    macro:{

        name:

        "Macro Detail Shot",

        prompt:

        "macro photography, extreme product detail, texture focus"

    }


};


/*
============================================================
 Select Product Shot
============================================================
*/

ProductLock.prototype.setProductShot=function(
    type
){

    let shot=

        this.shotLibrary[type];


    if(!shot)

        return false;



    this.product.presentation=

        shot;



    return shot;

};


/*
============================================================
 Camera Preset
============================================================
*/

ProductLock.prototype.cameraLibrary={


    front:

    "front camera angle, straight product view",


    top:

    "top view camera angle, flat lay style",


    low:

    "low angle product shot, powerful perspective",


    close:

    "close up product detail shot",


    rotating:

    "360 degree product rotation view"


};


/*
============================================================
 Set Product Camera
============================================================
*/

ProductLock.prototype.setCamera=function(
    type
){

    if(

        this.cameraLibrary[type]

    ){

        this.product.camera=

            this.cameraLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Product Lighting Library
============================================================
*/

ProductLock.prototype.lightingLibrary={


    studio:

    "professional studio lighting, soft shadow",


    soft:

    "soft diffused lighting, clean highlights",


    dramatic:

    "dramatic cinematic lighting, deep contrast",


    natural:

    "natural daylight product lighting",


    neon:

    "modern neon commercial lighting"


};


/*
============================================================
 Set Product Lighting
============================================================
*/

ProductLock.prototype.setLighting=function(
    type
){

    if(

        this.lightingLibrary[type]

    ){

        this.product.lighting=

            this.lightingLibrary[type];


        return true;

    }


    return false;

};


/*
============================================================
 Affiliate Mode
============================================================
*/

ProductLock.prototype.enableAffiliateMode=function(){

    this.product.mode=

        "affiliate";



    this.product.affiliateRules=[


        "highlight product benefits",

        "show realistic usage",

        "create attractive marketing visual",

        "focus conversion"


    ];



    return this.product.affiliateRules;

};


/*
============================================================
 Build Product Marketing Prompt
============================================================
*/

ProductLock.prototype.buildMarketingPrompt=function(){

    let data=[];



    data.push(

        this.generateProductLockPrompt()

    );



    if(

        this.product.presentation

    ){

        data.push(

            this.product.presentation.prompt

        );

    }



    if(

        this.product.camera

    )

        data.push(

            this.product.camera

        );



    if(

        this.product.lighting

    )

        data.push(

            this.product.lighting

        );



    return data.join(", ");

};


/*
============================================================
 Product Video Scene
============================================================
*/

ProductLock.prototype.createVideoScene=function(
    data={}
){

    return {


        duration:

        data.duration || 8,


        product:

        this.generateProductLockPrompt(),


        action:

        data.action || "product showcase movement",


        camera:

        data.camera || this.product.camera,


        lighting:

        data.lighting || this.product.lighting


    };

};


/*
============================================================
 Generate Product Video Prompt
============================================================
*/

ProductLock.prototype.generateVideoPrompt=function(
    scene={}
){

    let video=

        this.createVideoScene(

            scene

        );



    return Object.values(video)

    .filter(Boolean)

    .join(", ");

};



console.log(
"%cProductLock PART 4 Loaded",
"color:#0d9488;font-weight:bold;"
);

/*
============================================================
 PowerTools AI Creator Suite
 productLock.js
 PART 5
 FINAL PRODUCT LOCK INTEGRATION
============================================================
*/


/*
============================================================
 Save Product Profile
============================================================
*/

ProductLock.prototype.saveProfile=function(){

    let profile=

    JSON.parse(

        JSON.stringify(

            this.product

        )

    );


    this.productLibrary.push(

        profile

    );


    return profile;

};


/*
============================================================
 Load Product Profile
============================================================
*/

ProductLock.prototype.loadProfile=function(
    id
){

    let profile=

        this.productLibrary.find(

            item=>item.id===id

        );



    if(!profile)

        return false;



    this.product=

        JSON.parse(

            JSON.stringify(

                profile

            )

        );



    return this.product;

};


/*
============================================================
 Get Product Library
============================================================
*/

ProductLock.prototype.getLibrary=function(){

    return this.productLibrary;

};


/*
============================================================
 Delete Product Profile
============================================================
*/

ProductLock.prototype.deleteProfile=function(
    id
){

    this.productLibrary=

    this.productLibrary.filter(

        item=>item.id!==id

    );


    return true;

};


/*
============================================================
 Connect Prompt Engine
============================================================
*/

ProductLock.prototype.attachPromptEngine=function(
    engine
){

    if(!engine)

        return false;



    this.promptEngine=

        engine;



    engine.productMemory={

        ...engine.productMemory,


        ...this.product


    };



    engine.injectProductLock();



    return true;

};


/*
============================================================
 Final Product Prompt
============================================================
*/

ProductLock.prototype.generateFinalPrompt=function(
    basePrompt=""
){

    return [

        this.generateProductLockPrompt(),

        this.buildMarketingPrompt(),

        basePrompt

    ]

    .filter(Boolean)

    .join(", ");

};


/*
============================================================
 Product Comparison
============================================================
*/

ProductLock.prototype.compareIdentity=function(
    productData
){

    let score=0;



    if(

        productData.color===

        this.product.color

    )

        score+=25;



    if(

        productData.material===

        this.product.material

    )

        score+=25;



    if(

        productData.shape===

        this.product.shape

    )

        score+=25;



    if(

        productData.brand===

        this.product.brand

    )

        score+=25;



    return {


        matchScore:score,


        sameProduct:

        score>=75


    };


};


/*
============================================================
 Export JSON
============================================================
*/

ProductLock.prototype.exportJSON=function(){

    return JSON.stringify(

        this.exportPackage(),

        null,

        4

    );

};


/*
============================================================
 Export Package
============================================================
*/

ProductLock.prototype.exportPackage=function(){

    return {


        engine:

        "PowerTools ProductLock",


        version:

        this.version,


        created:

        new Date()

        .toISOString(),


        product:

        this.product,


        aiInstruction:

        this.generateAIInstruction(),


        marketingPrompt:

        this.generateFinalPrompt()


    };

};


/*
============================================================
 Import JSON
============================================================
*/

ProductLock.prototype.importJSON=function(
    json
){

    try{


        let data=

        typeof json==="string"

        ?

        JSON.parse(json)

        :

        json;



        this.product=

            data.product ||

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
 Factory
============================================================
*/

window.createProductLock=function(){

    return new ProductLock();

};


/*
============================================================
 Ready Check
============================================================
*/

ProductLock.prototype.ready=function(){

    return {


        engine:

        "ProductLock",


        version:

        this.version,


        status:

        "READY",


        features:[


            "Product Identity Lock",


            "Brand Consistency",


            "Packaging Lock",


            "Product Photography",


            "Affiliate Mode",


            "Video Product Scene",


            "Prompt Injection"


        ]


    };

};



console.log(
"%cProductLock COMPLETE - READY",
"color:#22c55e;font-weight:bold;font-size:15px;"
);
