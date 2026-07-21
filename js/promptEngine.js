/* ============================================================
 * PowerTools AI Creator Suite
 * promptEngine.js
 * PART 1
 * Core Engine + Configuration + Utilities
 * ============================================================
 */

(function () {

"use strict";

/* ============================================================
 * Namespace
 * ============================================================
 */

window.PowerTools = window.PowerTools || {};

PowerTools.promptEngine = {};


/* ============================================================
 * Version
 * ============================================================
 */

PowerTools.promptEngine.version = "1.0.0";


/* ============================================================
 * Default Configuration
 * ============================================================
 */

PowerTools.promptEngine.config = {

    language: "english",

    provider: "universal",

    quality: "ultra",

    creativity: 70,

    detailLevel: 100,

    cinematic: true,

    lighting: true,

    camera: true,

    realism: true,

    safety: true,

    negativePrompt: true,

    autoEnhance: true,

    autoTranslate: false

};


/* ============================================================
 * Runtime State
 * ============================================================
 */

PowerTools.promptEngine.state = {

    initialized: false,

    generating: false,

    lastPrompt: "",

    history: [],

    cache: {},

    variables: {},

    provider: null

};


/* ============================================================
 * Constants
 * ============================================================
 */

PowerTools.promptEngine.constants = {

    MAX_HISTORY: 100,

    MAX_CACHE: 300,

    MAX_LENGTH: 25000,

    DEFAULT_RATIO: "16:9",

    DEFAULT_STYLE: "cinematic",

    DEFAULT_QUALITY: "8K",

    DEFAULT_LIGHTING: "volumetric",

    DEFAULT_CAMERA: "cinema camera"

};


/* ============================================================
 * Internal Database
 * ============================================================
 */

PowerTools.promptEngine.db = {

    styles: {},

    cameras: {},

    lenses: {},

    lighting: {},

    moods: {},

    colors: {},

    render: {},

    quality: {},

    providers: {},

    templates: {},

    negatives: {},

    genres: {},

    materials: {},

    environments: {},

    characters: {},

    products: {},

    poses: {},

    expressions: {}

};


/* ============================================================
 * Utilities
 * ============================================================
 */

PowerTools.promptEngine.utils = {

    uuid() {

        return "pt-" +

            Math.random().toString(36).substring(2, 10) +

            "-" +

            Date.now();

    },

    clone(obj) {

        return JSON.parse(JSON.stringify(obj));

    },

    capitalize(text) {

        if (!text) return "";

        return text.charAt(0).toUpperCase() +

            text.slice(1);

    },

    lower(text) {

        return String(text || "").toLowerCase();

    },

    clean(text) {

        if (!text) return "";

        return String(text)

            .replace(/\s+/g, " ")

            .replace(/\n+/g, "\n")

            .trim();

    },

    unique(array) {

        return [...new Set(array)];

    },

    join(list) {

        return list

            .filter(Boolean)

            .join(", ");

    },

    limit(text, max) {

        if (!text) return "";

        if (text.length <= max) return text;

        return text.substring(0, max);

    },

    random(list) {

        if (!Array.isArray(list)) return null;

        if (!list.length) return null;

        return list[Math.floor(Math.random() * list.length)];

    },

    bool(value) {

        return !!value;

    }

};


/* ============================================================
 * Logger
 * ============================================================
 */

PowerTools.promptEngine.log = {

    info(...args) {

        console.log(

            "%cPromptEngine",

            "color:#38bdf8;font-weight:bold",

            ...args

        );

    },

    warn(...args) {

        console.warn(

            "%cPromptEngine",

            "color:#f59e0b;font-weight:bold",

            ...args

        );

    },

    error(...args) {

        console.error(

            "%cPromptEngine",

            "color:#ef4444;font-weight:bold",

            ...args

        );

    }

};


/* ============================================================
 * Event System
 * ============================================================
 */

PowerTools.promptEngine.events = {

    listeners: {},

    on(name, callback) {

        if (!this.listeners[name]) {

            this.listeners[name] = [];

        }

        this.listeners[name].push(callback);

    },

    emit(name, payload) {

        if (!this.listeners[name]) return;

        this.listeners[name].forEach(fn => {

            try {

                fn(payload);

            }

            catch (e) {

                console.error(e);

            }

        });

    }

};


/* ============================================================
 * Cache Manager
 * ============================================================
 */

PowerTools.promptEngine.cache = {

    set(key, value) {

        PowerTools.promptEngine.state.cache[key] = value;

    },

    get(key) {

        return PowerTools.promptEngine.state.cache[key];

    },

    has(key) {

        return key in PowerTools.promptEngine.state.cache;

    },

    clear() {

        PowerTools.promptEngine.state.cache = {};

    }

};


/* ============================================================
 * History Manager
 * ============================================================
 */

PowerTools.promptEngine.history = {

    add(prompt) {

        const state = PowerTools.promptEngine.state;

        state.history.unshift({

            id: PowerTools.promptEngine.utils.uuid(),

            date: new Date(),

            prompt

        });

        if (

            state.history.length >

            PowerTools.promptEngine.constants.MAX_HISTORY

        ) {

            state.history.pop();

        }

    },

    all() {

        return PowerTools.promptEngine.state.history;

    },

    clear() {

        PowerTools.promptEngine.state.history = [];

    }

};


/* ============================================================
 * Initializer
 * ============================================================
 */

PowerTools.promptEngine.initialize = function () {

    if (this.state.initialized) return;

    this.state.initialized = true;

    this.log.info("Prompt Engine Initialized");

};


/* ============================================================
 * Boot
 * ============================================================
 */

PowerTools.promptEngine.initialize();

/* ============================================================
 * PART 2
 * Style Library + Camera Library + Lighting Library
 * ============================================================
 */


/* ============================================================
 * STYLE LIBRARY
 * ============================================================
 */

Object.assign(PowerTools.promptEngine.db.styles, {

    cinematic:
        "cinematic composition, movie still, blockbuster quality",

    realistic:
        "photorealistic, ultra realistic, lifelike details",

    hyperrealistic:
        "hyper realistic, microscopic details, true-to-life textures",

    anime:
        "anime illustration, vibrant colors, Japanese animation style",

    manga:
        "manga style, black and white illustration, detailed line art",

    disney:
        "Disney inspired 3D animation, expressive characters",

    pixar:
        "Pixar inspired 3D movie quality, beautiful storytelling",

    clay:
        "clay animation, handcrafted clay textures",

    lowpoly:
        "low poly art style",

    voxel:
        "voxel art style",

    watercolor:
        "watercolor painting, soft pigment",

    oilpainting:
        "oil painting masterpiece",

    digitalpainting:
        "digital painting, concept art",

    conceptart:
        "AAA concept art",

    fantasy:
        "epic fantasy artwork",

    scifi:
        "science fiction environment",

    cyberpunk:
        "cyberpunk atmosphere, neon lights",

    steampunk:
        "steampunk machinery, brass details",

    gothic:
        "dark gothic atmosphere",

    horror:
        "dark horror aesthetic",

    cute:
        "cute illustration",

    kawaii:
        "kawaii style",

    comic:
        "comic illustration",

    cartoon:
        "high quality cartoon",

    realistic3d:
        "high quality 3D rendering",

    octane:
        "Octane Render",

    unreal:
        "Unreal Engine 5 render",

    blender:
        "Blender Cycles render",

    redshift:
        "Redshift Render",

    vray:
        "V-Ray render"

});


/* ============================================================
 * CAMERA LIBRARY
 * ============================================================
 */

Object.assign(PowerTools.promptEngine.db.cameras, {

    cinematic:
        "cinema camera",

    arri:
        "ARRI Alexa LF",

    red:
        "RED V-Raptor",

    sony:
        "Sony FX6",

    canon:
        "Canon EOS R5",

    nikon:
        "Nikon Z9",

    bmpcc:
        "Blackmagic Pocket Cinema Camera",

    drone:
        "drone aerial camera",

    fpv:
        "FPV drone",

    handheld:
        "handheld camera",

    gopro:
        "GoPro Hero",

    iphone:
        "iPhone cinematic mode"

});


/* ============================================================
 * LENS LIBRARY
 * ============================================================
 */

Object.assign(PowerTools.promptEngine.db.lenses, {

    ultraWide:
        "14mm ultra wide lens",

    wide:
        "24mm wide lens",

    standard:
        "50mm lens",

    portrait:
        "85mm portrait lens",

    tele:
        "200mm telephoto lens",

    macro:
        "100mm macro lens",

    fisheye:
        "fisheye lens",

    anamorphic:
        "anamorphic lens"

});


/* ============================================================
 * CAMERA ANGLES
 * ============================================================
 */

PowerTools.promptEngine.db.cameraAngles = {

    eye:
        "eye level shot",

    low:
        "low angle shot",

    high:
        "high angle shot",

    bird:
        "bird's eye view",

    worm:
        "worm's eye view",

    overShoulder:
        "over the shoulder shot",

    closeup:
        "close-up shot",

    medium:
        "medium shot",

    fullbody:
        "full body shot",

    extremeClose:
        "extreme close-up",

    aerial:
        "aerial shot"

};


/* ============================================================
 * LIGHTING LIBRARY
 * ============================================================
 */

Object.assign(PowerTools.promptEngine.db.lighting, {

    daylight:
        "natural daylight",

    sunrise:
        "golden sunrise",

    sunset:
        "golden hour",

    bluehour:
        "blue hour",

    studio:
        "professional studio lighting",

    soft:
        "soft lighting",

    hard:
        "hard lighting",

    rim:
        "rim lighting",

    volumetric:
        "volumetric lighting",

    dramatic:
        "dramatic cinematic lighting",

    moody:
        "moody lighting",

    neon:
        "neon lighting",

    candle:
        "candle light",

    fire:
        "fire lighting",

    moon:
        "moonlight",

    overcast:
        "soft cloudy daylight"

});


/* ============================================================
 * SHADOWS
 * ============================================================
 */

PowerTools.promptEngine.db.shadows = {

    soft:
        "soft shadows",

    realistic:
        "realistic shadows",

    raytraced:
        "ray traced shadows",

    ambient:
        "ambient occlusion",

    cinematic:
        "cinematic shadow depth"

};


/* ============================================================
 * COLOR GRADING
 * ============================================================
 */

Object.assign(PowerTools.promptEngine.db.colors, {

    tealorange:
        "teal and orange color grading",

    kodak:
        "Kodak Vision3 film color",

    fuji:
        "Fuji film color",

    pastel:
        "soft pastel colors",

    vibrant:
        "vibrant colors",

    muted:
        "muted colors",

    monochrome:
        "black and white",

    vintage:
        "vintage cinematic colors",

    hdr:
        "HDR color grading",

    natural:
        "natural color tones"

});


/* ============================================================
 * QUALITY PRESETS
 * ============================================================
 */

Object.assign(PowerTools.promptEngine.db.quality, {

    draft:
        "good quality",

    standard:
        "high quality",

    premium:
        "ultra high quality",

    ultra:
        "masterpiece, best quality, ultra detailed",

    extreme:
        "masterpiece, absurdres, 16k, HDR, highly detailed"

});


/* ============================================================
 * RENDER ENGINES
 * ============================================================
 */

Object.assign(PowerTools.promptEngine.db.render, {

    octane:
        "Octane Render",

    unreal:
        "Unreal Engine 5",

    cycles:
        "Blender Cycles",

    vray:
        "V-Ray",

    redshift:
        "Redshift",

    arnold:
        "Arnold Renderer"

});


/* ============================================================
 * PROMPT COMPONENT HELPERS
 * ============================================================
 */

PowerTools.promptEngine.components = {

    style(name) {

        return PowerTools.promptEngine.db.styles[name] || "";

    },

    camera(name) {

        return PowerTools.promptEngine.db.cameras[name] || "";

    },

    lens(name) {

        return PowerTools.promptEngine.db.lenses[name] || "";

    },

    angle(name) {

        return PowerTools.promptEngine.db.cameraAngles[name] || "";

    },

    lighting(name) {

        return PowerTools.promptEngine.db.lighting[name] || "";

    },

    color(name) {

        return PowerTools.promptEngine.db.colors[name] || "";

    },

    quality(name) {

        return PowerTools.promptEngine.db.quality[name] || "";

    },

    render(name) {

        return PowerTools.promptEngine.db.render[name] || "";

    }

};

 /* ============================================================
 * PART 3
 * Subject Builder + Character Builder
 * Product Builder + Environment Builder
 * Composition Builder
 * ============================================================
 */


/* ============================================================
 * SUBJECT BUILDER
 * ============================================================
 */

PowerTools.promptEngine.subjectBuilder = {

    build(data = {}) {

        const parts = [];

        if (data.subject) {
            parts.push(data.subject);
        }

        if (data.description) {
            parts.push(data.description);
        }

        if (data.action) {
            parts.push(data.action);
        }

        if (data.location) {
            parts.push("located in " + data.location);
        }

        return PowerTools.promptEngine.utils.clean(
            parts.join(", ")
        );

    }

};


/* ============================================================
 * CHARACTER BUILDER
 * ============================================================
 */

PowerTools.promptEngine.characterBuilder = {

    build(character = {}) {

        const p = [];

        if (character.gender)
            p.push(character.gender);

        if (character.age)
            p.push(character.age);

        if (character.ethnicity)
            p.push(character.ethnicity);

        if (character.face)
            p.push(character.face);

        if (character.hair)
            p.push(character.hair);

        if (character.eyes)
            p.push(character.eyes);

        if (character.expression)
            p.push(character.expression);

        if (character.body)
            p.push(character.body);

        if (character.skin)
            p.push(character.skin);

        if (character.clothes)
            p.push(character.clothes);

        if (character.accessories)
            p.push(character.accessories);

        if (character.pose)
            p.push(character.pose);

        return PowerTools.promptEngine.utils.clean(
            p.join(", ")
        );

    }

};


/* ============================================================
 * PRODUCT BUILDER
 * ============================================================
 */

PowerTools.promptEngine.productBuilder = {

    build(product = {}) {

        const p = [];

        if (product.name)
            p.push(product.name);

        if (product.category)
            p.push(product.category);

        if (product.material)
            p.push(product.material);

        if (product.color)
            p.push(product.color);

        if (product.size)
            p.push(product.size);

        if (product.finish)
            p.push(product.finish);

        if (product.brand)
            p.push(product.brand);

        if (product.feature)
            p.push(product.feature);

        return PowerTools.promptEngine.utils.clean(
            p.join(", ")
        );

    }

};


/* ============================================================
 * ENVIRONMENT BUILDER
 * ============================================================
 */

PowerTools.promptEngine.environmentBuilder = {

    build(env = {}) {

        const p = [];

        if (env.place)
            p.push(env.place);

        if (env.weather)
            p.push(env.weather);

        if (env.time)
            p.push(env.time);

        if (env.season)
            p.push(env.season);

        if (env.atmosphere)
            p.push(env.atmosphere);

        if (env.background)
            p.push(env.background);

        if (env.details)
            p.push(env.details);

        return PowerTools.promptEngine.utils.clean(
            p.join(", ")
        );

    }

};


/* ============================================================
 * COMPOSITION BUILDER
 * ============================================================
 */

PowerTools.promptEngine.compositionBuilder = {

    build(comp = {}) {

        const p = [];

        if (comp.shot)
            p.push(comp.shot);

        if (comp.angle)
            p.push(
                PowerTools.promptEngine.components.angle(
                    comp.angle
                )
            );

        if (comp.camera)
            p.push(
                PowerTools.promptEngine.components.camera(
                    comp.camera
                )
            );

        if (comp.lens)
            p.push(
                PowerTools.promptEngine.components.lens(
                    comp.lens
                )
            );

        if (comp.depth)
            p.push(comp.depth);

        if (comp.framing)
            p.push(comp.framing);

        if (comp.focus)
            p.push(comp.focus);

        if (comp.motion)
            p.push(comp.motion);

        return PowerTools.promptEngine.utils.clean(
            p.join(", ")
        );

    }

};


/* ============================================================
 * LIGHTING BUILDER
 * ============================================================
 */

PowerTools.promptEngine.lightingBuilder = {

    build(light = {}) {

        const p = [];

        if (light.type)
            p.push(
                PowerTools.promptEngine.components.lighting(
                    light.type
                )
            );

        if (light.shadow)
            p.push(
                PowerTools.promptEngine.db.shadows[
                    light.shadow
                ] || ""
            );

        if (light.color)
            p.push(
                PowerTools.promptEngine.components.color(
                    light.color
                )
            );

        if (light.extra)
            p.push(light.extra);

        return PowerTools.promptEngine.utils.clean(
            p.join(", ")
        );

    }

};


/* ============================================================
 * QUALITY BUILDER
 * ============================================================
 */

PowerTools.promptEngine.qualityBuilder = {

    build(options = {}) {

        const p = [];

        p.push(
            PowerTools.promptEngine.components.quality(
                options.quality ||
                PowerTools.promptEngine.config.quality
            )
        );

        if (options.render)
            p.push(
                PowerTools.promptEngine.components.render(
                    options.render
                )
            );

        if (options.resolution)
            p.push(options.resolution);

        if (options.extra)
            p.push(options.extra);

        return PowerTools.promptEngine.utils.clean(
            p.join(", ")
        );

    }

};


/* ============================================================
 * NEGATIVE PROMPT BUILDER
 * ============================================================
 */

PowerTools.promptEngine.negativeBuilder = {

    defaults: [

        "low quality",
        "worst quality",
        "low resolution",
        "blurry",
        "pixelated",
        "artifact",
        "watermark",
        "signature",
        "logo",
        "cropped",
        "duplicate",
        "deformed",
        "bad anatomy",
        "bad hands",
        "extra fingers",
        "missing fingers",
        "extra limbs",
        "mutated",
        "text"

    ],

    build(extra = []) {

        return PowerTools.promptEngine.utils.unique(
            this.defaults.concat(extra)
        ).join(", ");

    }

};

/* ============================================================
 * PART 4
 * Prompt Assembler + AI Provider Formatter
 * Generate Pipeline
 * ============================================================
 */


/* ============================================================
 * MASTER PROMPT ASSEMBLER
 * ============================================================
 */

PowerTools.promptEngine.assembler = {

    assemble(data = {}) {

        const blocks = [];

        /* Subject */

        if (data.subject) {

            blocks.push(

                PowerTools.promptEngine.subjectBuilder.build(

                    data.subject

                )

            );

        }

        /* Character */

        if (data.character) {

            blocks.push(

                PowerTools.promptEngine.characterBuilder.build(

                    data.character

                )

            );

        }

        /* Product */

        if (data.product) {

            blocks.push(

                PowerTools.promptEngine.productBuilder.build(

                    data.product

                )

            );

        }

        /* Environment */

        if (data.environment) {

            blocks.push(

                PowerTools.promptEngine.environmentBuilder.build(

                    data.environment

                )

            );

        }

        /* Composition */

        if (data.composition) {

            blocks.push(

                PowerTools.promptEngine.compositionBuilder.build(

                    data.composition

                )

            );

        }

        /* Lighting */

        if (data.lighting) {

            blocks.push(

                PowerTools.promptEngine.lightingBuilder.build(

                    data.lighting

                )

            );

        }

        /* Style */

        if (data.style) {

            blocks.push(

                PowerTools.promptEngine.components.style(

                    data.style

                )

            );

        }

        /* Quality */

        blocks.push(

            PowerTools.promptEngine.qualityBuilder.build(

                data.quality || {}

            )

        );

        /* Extra */

        if (Array.isArray(data.extra)) {

            data.extra.forEach(item => {

                if (item) {

                    blocks.push(item);

                }

            });

        }

        return PowerTools.promptEngine.utils.clean(

            blocks

                .filter(Boolean)

                .join(", ")

        );

    }

};


/* ============================================================
 * AI PROVIDER FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers = {

    universal(prompt) {

        return prompt;

    },

    chatgpt(prompt) {

        return prompt;

    },

    gemini(prompt) {

        return prompt;

    },

    claude(prompt) {

        return prompt;

    },

    leonardo(prompt) {

        return prompt;

    },

    midjourney(prompt) {

        return prompt;

    },

    flux(prompt) {

        return prompt;

    },

    sdxl(prompt) {

        return prompt;

    },

    stableDiffusion(prompt) {

        return prompt;

    },

    ideogram(prompt) {

        return prompt;

    },

    firefly(prompt) {

        return prompt;

    },

    veo(prompt) {

        return prompt;

    },

    kling(prompt) {

        return prompt;

    },

    runway(prompt) {

        return prompt;

    },

    pika(prompt) {

        return prompt;

    },

    luma(prompt) {

        return prompt;

    }

};


/* ============================================================
 * FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.format = function (

    provider,

    prompt

) {

    provider = (provider || "universal")

        .toLowerCase();

    if (

        this.providers[provider]

    ) {

        return this.providers[provider](prompt);

    }

    return prompt;

};


/* ============================================================
 * BUILD NEGATIVE
 * ============================================================
 */

PowerTools.promptEngine.buildNegative = function (

    data = {}

) {

    if (

        data.disableNegative

    ) {

        return "";

    }

    return this.negativeBuilder.build(

        data.extraNegative || []

    );

};


/* ============================================================
 * RESULT OBJECT
 * ============================================================
 */

PowerTools.promptEngine.createResult = function (

    prompt,

    negative,

    provider

) {

    return {

        id:

            PowerTools.promptEngine.utils.uuid(),

        provider:

            provider ||

            "universal",

        created:

            new Date()

                .toISOString(),

        prompt,

        negative,

        length:

            prompt.length

    };

};


/* ============================================================
 * BEFORE GENERATE
 * ============================================================
 */

PowerTools.promptEngine.beforeGenerate = function (

    payload

) {

    this.state.generating = true;

    this.events.emit(

        "beforeGenerate",

        payload

    );

};


/* ============================================================
 * AFTER GENERATE
 * ============================================================
 */

PowerTools.promptEngine.afterGenerate = function (

    result

) {

    this.state.generating = false;

    this.state.lastPrompt =

        result.prompt;

    this.history.add(

        result.prompt

    );

    this.events.emit(

        "afterGenerate",

        result

    );

};


/* ============================================================
 * MAIN GENERATE
 * ============================================================
 */

PowerTools.promptEngine.generate = function (

    payload = {}

) {

    this.beforeGenerate(

        payload

    );

    const provider =

        payload.provider ||

        this.config.provider;

    let prompt =

        this.assembler.assemble(

            payload

        );

    prompt =

        this.format(

            provider,

            prompt

        );

    const negative =

        this.buildNegative(

            payload

        );

    const result =

        this.createResult(

            prompt,

            negative,

            provider

        );

    this.afterGenerate(

        result

    );

    return result;

};


/* ============================================================
 * QUICK GENERATE
 * ============================================================
 */

PowerTools.promptEngine.quick = function (

    subject,

    style = "cinematic"

) {

    return this.generate({

        subject: {

            subject

        },

        style

    });

};

 /* ============================================================
 * PART 5
 * Smart Prompt Enhancer
 * Prompt Optimizer
 * Variable Resolver
 * Template Engine
 * ============================================================
 */


/* ============================================================
 * VARIABLE RESOLVER
 * ============================================================
 */

PowerTools.promptEngine.variables = {

    values: {},

    set(name, value) {

        this.values[name] = value;

        return this;

    },

    get(name) {

        return this.values[name];

    },

    has(name) {

        return Object.prototype.hasOwnProperty.call(

            this.values,

            name

        );

    },

    remove(name) {

        delete this.values[name];

    },

    clear() {

        this.values = {};

    },

    resolve(text) {

        if (!text) return "";

        return String(text).replace(

            /\{\{(.*?)\}\}/g,

            (match, key) => {

                key = key.trim();

                return this.has(key)

                    ? this.get(key)

                    : "";

            }

        );

    }

};


/* ============================================================
 * TEMPLATE ENGINE
 * ============================================================
 */

PowerTools.promptEngine.templateEngine = {

    templates: {},

    register(name, template) {

        this.templates[name] = template;

    },

    get(name) {

        return this.templates[name] || "";

    },

    build(name, variables = {}) {

        const tpl = this.get(name);

        if (!tpl) return "";

        Object.keys(variables).forEach(key => {

            PowerTools.promptEngine.variables.set(

                key,

                variables[key]

            );

        });

        return PowerTools.promptEngine.variables.resolve(

            tpl

        );

    }

};


/* ============================================================
 * DEFAULT TEMPLATES
 * ============================================================
 */

PowerTools.promptEngine.templateEngine.register(

    "portrait",

    "{{subject}}, portrait, {{style}}, {{lighting}}, masterpiece"

);

PowerTools.promptEngine.templateEngine.register(

    "product",

    "{{product}}, commercial photography, {{background}}, premium advertisement"

);

PowerTools.promptEngine.templateEngine.register(

    "landscape",

    "{{environment}}, epic landscape, {{lighting}}, ultra realistic"

);

PowerTools.promptEngine.templateEngine.register(

    "cinematic",

    "{{subject}}, blockbuster movie scene, {{camera}}, {{lighting}}, dramatic atmosphere"

);


/* ============================================================
 * PROMPT ENHANCER
 * ============================================================
 */

PowerTools.promptEngine.enhancer = {

    enhance(prompt = "") {

        const extra = [

            "ultra detailed",

            "professional composition",

            "sharp focus",

            "high dynamic range",

            "physically based rendering",

            "realistic textures",

            "beautiful color grading"

        ];

        const result = [

            prompt,

            ...extra

        ];

        return PowerTools.promptEngine.utils.clean(

            result.join(", ")

        );

    }

};


/* ============================================================
 * PROMPT OPTIMIZER
 * ============================================================
 */

PowerTools.promptEngine.optimizer = {

    optimize(prompt = "") {

        let text = String(prompt);

        text = text.replace(/\s+/g, " ");

        text = text.replace(/,+/g, ",");

        text = text.replace(/\s+,/g, ",");

        text = text.replace(/,\s*,/g, ",");

        text = text.replace(/^,/g, "");

        text = text.replace(/,$/g, "");

        return text.trim();

    }

};


/* ============================================================
 * DEDUPLICATION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.deduplicate = function (

    prompt

) {

    const items = prompt

        .split(",")

        .map(item => item.trim())

        .filter(Boolean);

    return [

        ...new Set(items)

    ].join(", ");

};


/* ============================================================
 * PROMPT PIPELINE
 * ============================================================
 */

PowerTools.promptEngine.pipeline = function (

    prompt

) {

    prompt =

        this.enhancer.enhance(

            prompt

        );

    prompt =

        this.optimizer.optimize(

            prompt

        );

    prompt =

        this.deduplicate(

            prompt

        );

    return prompt;

};


/* ============================================================
 * EXTENDED GENERATE
 * ============================================================
 */

PowerTools.promptEngine.generatePrompt = function (

    payload = {}

) {

    const result =

        this.generate(

            payload

        );

    result.prompt =

        this.pipeline(

            result.prompt

        );

    result.length =

        result.prompt.length;

    return result;

};


/* ============================================================
 * SMART TITLE
 * ============================================================
 */

PowerTools.promptEngine.createTitle = function (

    text = ""

) {

    const words =

        text

            .split(" ")

            .slice(0, 8);

    return words.join(" ");

};


/* ============================================================
 * PROMPT PREVIEW
 * ============================================================
 */

PowerTools.promptEngine.preview = function (

    payload = {}

) {

    const assembled =

        this.assembler.assemble(

            payload

        );

    return this.pipeline(

        assembled

    );

};


/* ============================================================
 * VALIDATION
 * ============================================================
 */

PowerTools.promptEngine.validate = function (

    payload = {}

) {

    const errors = [];

    if (

        !payload.subject &&

        !payload.character &&

        !payload.product

    ) {

        errors.push(

            "Subject is required."

        );

    }

    return {

        valid:

            errors.length === 0,

        errors

    };

};


/* ============================================================
 * END PART 5
 * ============================================================
 */

 /* ============================================================
 * PART 6
 * AI Prompt Expansion Engine
 * Cinematic Engine
 * Storytelling Engine
 * Emotion Engine
 * Keyword Weighting Engine
 * ============================================================
 */


/* ============================================================
 * PROMPT EXPANSION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.expander = {

    library: {

        quality: [

            "masterpiece",

            "best quality",

            "extremely detailed",

            "professional",

            "award winning",

            "ultra realistic",

            "highly detailed",

            "8K",

            "HDR",

            "incredible details"

        ],

        realism: [

            "physically based rendering",

            "global illumination",

            "ray tracing",

            "accurate reflections",

            "realistic materials",

            "natural skin texture",

            "micro details",

            "realistic shadows"

        ],

        cinematic: [

            "movie still",

            "Hollywood blockbuster",

            "cinematic composition",

            "epic atmosphere",

            "dramatic perspective",

            "immersive storytelling",

            "professional cinematography",

            "film quality"

        ]

    },

    expand(prompt = "") {

        const parts = [

            prompt,

            ...this.library.quality,

            ...this.library.realism,

            ...this.library.cinematic

        ];

        return PowerTools.promptEngine.utils.clean(

            parts.join(", ")

        );

    }

};


/* ============================================================
 * CINEMATIC ENGINE
 * ============================================================
 */

PowerTools.promptEngine.cinematicEngine = {

    build(options = {}) {

        const blocks = [];

        if (options.establishing)
            blocks.push("establishing shot");

        if (options.movie)
            blocks.push("feature film quality");

        if (options.epic)
            blocks.push("epic cinematic atmosphere");

        if (options.depth)
            blocks.push("strong cinematic depth");

        if (options.bokeh)
            blocks.push("beautiful cinematic bokeh");

        if (options.dof)
            blocks.push("shallow depth of field");

        if (options.filmGrain)
            blocks.push("subtle film grain");

        if (options.colorGrade)
            blocks.push("professional color grading");

        return blocks.join(", ");

    }

};


/* ============================================================
 * STORYTELLING ENGINE
 * ============================================================
 */

PowerTools.promptEngine.storyEngine = {

    build(scene = {}) {

        const parts = [];

        if (scene.introduction)
            parts.push(scene.introduction);

        if (scene.main)
            parts.push(scene.main);

        if (scene.conflict)
            parts.push(scene.conflict);

        if (scene.action)
            parts.push(scene.action);

        if (scene.climax)
            parts.push(scene.climax);

        if (scene.ending)
            parts.push(scene.ending);

        return PowerTools.promptEngine.utils.clean(

            parts.join(", ")

        );

    }

};


/* ============================================================
 * EMOTION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.emotionEngine = {

    emotions: {

        happy:
            "joyful atmosphere",

        sad:
            "melancholic atmosphere",

        angry:
            "intense emotional tension",

        peaceful:
            "peaceful atmosphere",

        mysterious:
            "mysterious mood",

        horror:
            "terrifying atmosphere",

        romantic:
            "romantic ambience",

        inspirational:
            "uplifting emotional feeling",

        dramatic:
            "high emotional impact",

        fantasy:
            "magical emotional tone"

    },

    build(name) {

        return this.emotions[name] || "";

    }

};


/* ============================================================
 * KEYWORD WEIGHTING ENGINE
 * ============================================================
 */

PowerTools.promptEngine.keywordWeight = {

    apply(prompt = "", keywords = []) {

        if (!keywords.length)

            return prompt;

        const weighted = keywords.map(item => {

            if (typeof item === "string") {

                return "(" + item + ":1.3)";

            }

            return "(" +

                item.keyword +

                ":" +

                (item.weight || 1.3) +

                ")";

        });

        return [

            prompt,

            ...weighted

        ].join(", ");

    }

};


/* ============================================================
 * SMART ENHANCE PIPELINE
 * ============================================================
 */

PowerTools.promptEngine.smartEnhance = function (

    prompt,

    options = {}

) {

    let result = prompt;

    if (options.expand !== false) {

        result =

            this.expander.expand(

                result

            );

    }

    if (options.cinematic) {

        result += ", " +

            this.cinematicEngine.build(

                options.cinematic

            );

    }

    if (options.story) {

        result += ", " +

            this.storyEngine.build(

                options.story

            );

    }

    if (options.emotion) {

        result += ", " +

            this.emotionEngine.build(

                options.emotion

            );

    }

    if (options.weight) {

        result =

            this.keywordWeight.apply(

                result,

                options.weight

            );

    }

    result =

        this.optimizer.optimize(

            result

        );

    result =

        this.deduplicate(

            result

        );

    return result;

};


/* ============================================================
 * ADVANCED GENERATE
 * ============================================================
 */

PowerTools.promptEngine.generateAdvanced = function (

    payload = {}

) {

    const validation =

        this.validate(payload);

    if (!validation.valid) {

        return {

            success: false,

            errors: validation.errors

        };

    }

    const result =

        this.generate(payload);

    result.prompt =

        this.smartEnhance(

            result.prompt,

            payload

        );

    result.title =

        this.createTitle(

            result.prompt

        );

    result.length =

        result.prompt.length;

    result.success = true;

    return result;

};

 /* ============================================================
 * PART 7
 * Character Consistency Engine
 * Product Consistency Engine
 * Face Lock Engine
 * Style Lock Engine
 * Scene Lock Engine
 * Prompt Memory Engine
 * ============================================================
 */


/* ============================================================
 * CHARACTER CONSISTENCY ENGINE
 * ============================================================
 */

PowerTools.promptEngine.characterConsistency = {

    profile: {},

    save(profile = {}) {

        this.profile = PowerTools.promptEngine.utils.clone(profile);

        return this.profile;

    },

    load() {

        return PowerTools.promptEngine.utils.clone(this.profile);

    },

    merge(data = {}) {

        return Object.assign(

            {},

            this.profile,

            data

        );

    },

    clear() {

        this.profile = {};

    }

};


/* ============================================================
 * PRODUCT CONSISTENCY ENGINE
 * ============================================================
 */

PowerTools.promptEngine.productConsistency = {

    profile: {},

    save(profile = {}) {

        this.profile = PowerTools.promptEngine.utils.clone(profile);

    },

    load() {

        return PowerTools.promptEngine.utils.clone(this.profile);

    },

    merge(data = {}) {

        return Object.assign(

            {},

            this.profile,

            data

        );

    },

    clear() {

        this.profile = {};

    }

};


/* ============================================================
 * FACE LOCK ENGINE
 * ============================================================
 */

PowerTools.promptEngine.faceLock = {

    enabled: false,

    profile: {},

    enable(profile = {}) {

        this.enabled = true;

        this.profile =

            PowerTools.promptEngine.utils.clone(profile);

    },

    disable() {

        this.enabled = false;

        this.profile = {};

    },

    apply(character = {}) {

        if (!this.enabled)

            return character;

        return Object.assign(

            {},

            character,

            this.profile

        );

    }

};


/* ============================================================
 * STYLE LOCK ENGINE
 * ============================================================
 */

PowerTools.promptEngine.styleLock = {

    enabled: false,

    style: null,

    lock(style) {

        this.enabled = true;

        this.style = style;

    },

    unlock() {

        this.enabled = false;

        this.style = null;

    },

    apply(style) {

        if (!this.enabled)

            return style;

        return this.style;

    }

};


/* ============================================================
 * SCENE LOCK ENGINE
 * ============================================================
 */

PowerTools.promptEngine.sceneLock = {

    enabled: false,

    environment: {},

    enable(data = {}) {

        this.enabled = true;

        this.environment =

            PowerTools.promptEngine.utils.clone(data);

    },

    disable() {

        this.enabled = false;

        this.environment = {};

    },

    apply(environment = {}) {

        if (!this.enabled)

            return environment;

        return Object.assign(

            {},

            this.environment,

            environment

        );

    }

};


/* ============================================================
 * PROMPT MEMORY ENGINE
 * ============================================================
 */

PowerTools.promptEngine.memory = {

    prompts: [],

    save(result) {

        this.prompts.unshift({

            id: PowerTools.promptEngine.utils.uuid(),

            created: new Date(),

            data: result

        });

        if (this.prompts.length > 200) {

            this.prompts.pop();

        }

    },

    latest() {

        return this.prompts[0] || null;

    },

    all() {

        return this.prompts;

    },

    clear() {

        this.prompts = [];

    }

};


/* ============================================================
 * CONSISTENCY MANAGER
 * ============================================================
 */

PowerTools.promptEngine.consistency = {

    apply(payload = {}) {

        if (payload.character) {

            payload.character =

                PowerTools.promptEngine.faceLock.apply(

                    payload.character

                );

            payload.character =

                PowerTools.promptEngine.characterConsistency.merge(

                    payload.character

                );

        }

        if (payload.product) {

            payload.product =

                PowerTools.promptEngine.productConsistency.merge(

                    payload.product

                );

        }

        if (payload.environment) {

            payload.environment =

                PowerTools.promptEngine.sceneLock.apply(

                    payload.environment

                );

        }

        if (payload.style) {

            payload.style =

                PowerTools.promptEngine.styleLock.apply(

                    payload.style

                );

        }

        return payload;

    }

};


/* ============================================================
 * GENERATE WITH CONSISTENCY
 * ============================================================
 */

PowerTools.promptEngine.generateConsistent = function (

    payload = {}

) {

    payload =

        this.consistency.apply(payload);

    const result =

        this.generateAdvanced(payload);

    if (result.success) {

        this.memory.save(result);

    }

    return result;

};


/* ============================================================
 * QUICK SAVE HELPERS
 * ============================================================
 */

PowerTools.promptEngine.saveCharacter = function (

    profile

) {

    this.characterConsistency.save(profile);

};

PowerTools.promptEngine.saveProduct = function (

    profile

) {

    this.productConsistency.save(profile);

};

PowerTools.promptEngine.lockStyle = function (

    style

) {

    this.styleLock.lock(style);

};

PowerTools.promptEngine.lockScene = function (

    scene

) {

    this.sceneLock.enable(scene);

};

PowerTools.promptEngine.lockFace = function (

    profile

) {

    this.faceLock.enable(profile);

};


/* ============================================================
 * END PART 7
 * ============================================================
 */

 /* ============================================================
 * PART 8
 * Universal Prompt Generator
 * Category Engine
 * Preset Builder
 * ============================================================
 */


/* ============================================================
 * CATEGORY DATABASE
 * ============================================================
 */

Object.assign(PowerTools.promptEngine.db.templates, {

    poster: {
        style: "cinematic",
        camera: "cinematic",
        lighting: "dramatic"
    },

    product: {
        style: "realistic",
        camera: "canon",
        lighting: "studio"
    },

    portrait: {
        style: "realistic",
        camera: "arri",
        lighting: "soft"
    },

    food: {
        style: "realistic",
        camera: "sony",
        lighting: "studio"
    },

    architecture: {
        style: "realistic",
        camera: "drone",
        lighting: "daylight"
    },

    interior: {
        style: "realistic",
        camera: "canon",
        lighting: "soft"
    },

    landscape: {
        style: "cinematic",
        camera: "drone",
        lighting: "sunrise"
    },

    fashion: {
        style: "realistic",
        camera: "sony",
        lighting: "studio"
    },

    vehicle: {
        style: "cinematic",
        camera: "arri",
        lighting: "sunset"
    },

    logo: {
        style: "digitalpainting"
    },

    thumbnail: {
        style: "cinematic"
    },

    wallpaper: {
        style: "fantasy"
    },

    illustration: {
        style: "digitalpainting"
    },

    anime: {
        style: "anime"
    },

    clay: {
        style: "clay"
    }

});


/* ============================================================
 * CATEGORY ENGINE
 * ============================================================
 */

PowerTools.promptEngine.categoryEngine = {

    get(name) {

        return PowerTools.promptEngine.db.templates[name] || {};

    },

    exists(name) {

        return !!PowerTools.promptEngine.db.templates[name];

    },

    list() {

        return Object.keys(

            PowerTools.promptEngine.db.templates

        );

    }

};


/* ============================================================
 * PRESET BUILDER
 * ============================================================
 */

PowerTools.promptEngine.presetBuilder = {

    build(category, payload = {}) {

        const preset =

            PowerTools.promptEngine.categoryEngine.get(

                category

            );

        return {

            ...preset,

            ...payload

        };

    }

};


/* ============================================================
 * UNIVERSAL GENERATOR
 * ============================================================
 */

PowerTools.promptEngine.universalGenerator = {

    generate(category, payload = {}) {

        const config =

            PowerTools.promptEngine.presetBuilder.build(

                category,

                payload

            );

        return PowerTools.promptEngine.generateConsistent(

            config

        );

    }

};


/* ============================================================
 * QUICK GENERATORS
 * ============================================================
 */

PowerTools.promptEngine.poster = function(payload = {}) {

    return this.universalGenerator.generate(

        "poster",

        payload

    );

};


PowerTools.promptEngine.product = function(payload = {}) {

    return this.universalGenerator.generate(

        "product",

        payload

    );

};


PowerTools.promptEngine.portrait = function(payload = {}) {

    return this.universalGenerator.generate(

        "portrait",

        payload

    );

};


PowerTools.promptEngine.food = function(payload = {}) {

    return this.universalGenerator.generate(

        "food",

        payload

    );

};


PowerTools.promptEngine.landscape = function(payload = {}) {

    return this.universalGenerator.generate(

        "landscape",

        payload

    );

};


PowerTools.promptEngine.vehicle = function(payload = {}) {

    return this.universalGenerator.generate(

        "vehicle",

        payload

    );

};


PowerTools.promptEngine.architecture = function(payload = {}) {

    return this.universalGenerator.generate(

        "architecture",

        payload

    );

};


PowerTools.promptEngine.interior = function(payload = {}) {

    return this.universalGenerator.generate(

        "interior",

        payload

    );

};


PowerTools.promptEngine.logo = function(payload = {}) {

    return this.universalGenerator.generate(

        "logo",

        payload

    );

};


PowerTools.promptEngine.thumbnail = function(payload = {}) {

    return this.universalGenerator.generate(

        "thumbnail",

        payload

    );

};


PowerTools.promptEngine.wallpaper = function(payload = {}) {

    return this.universalGenerator.generate(

        "wallpaper",

        payload

    );

};


PowerTools.promptEngine.illustration = function(payload = {}) {

    return this.universalGenerator.generate(

        "illustration",

        payload

    );

};


PowerTools.promptEngine.anime = function(payload = {}) {

    return this.universalGenerator.generate(

        "anime",

        payload

    );

};


PowerTools.promptEngine.clay = function(payload = {}) {

    return this.universalGenerator.generate(

        "clay",

        payload

    );

};


/* ============================================================
 * CATEGORY ALIAS
 * ============================================================
 */

PowerTools.promptEngine.create = function(

    category,

    payload = {}

) {

    return this.universalGenerator.generate(

        category,

        payload

    );

};


/* ============================================================
 * CATEGORY INFO
 * ============================================================
 */

PowerTools.promptEngine.categories = function() {

    return this.categoryEngine.list();

};


/* ============================================================
 * END PART 8
 * ============================================================
 */

 /* ============================================================
 * PART 9
 * Prompt Intelligence Engine
 * Prompt Analyzer
 * AI Intent Detection
 * Prompt Scoring
 * ============================================================
 */


/* ============================================================
 * PROMPT INTELLIGENCE ENGINE
 * ============================================================
 */

PowerTools.promptEngine.intelligence = {

    version: "1.0",

    analyze(payload = {}) {

        return {

            intent:
                this.detectIntent(payload),

            category:
                this.detectCategory(payload),

            complexity:
                this.detectComplexity(payload),

            completeness:
                this.detectCompleteness(payload),

            recommendations:
                this.getRecommendations(payload)

        };

    }

};


/* ============================================================
 * AI INTENT DETECTION
 * ============================================================
 */

PowerTools.promptEngine.intelligence.detectIntent = function (

    payload = {}

) {

    if (payload.product)

        return "product";

    if (payload.character)

        return "character";

    if (payload.story)

        return "story";

    if (payload.video)

        return "video";

    if (payload.poster)

        return "poster";

    if (payload.logo)

        return "logo";

    if (payload.food)

        return "food";

    if (payload.vehicle)

        return "vehicle";

    if (payload.architecture)

        return "architecture";

    return "general";

};


/* ============================================================
 * CATEGORY DETECTION
 * ============================================================
 */

PowerTools.promptEngine.intelligence.detectCategory = function (

    payload = {}

) {

    if (payload.category)

        return payload.category;

    if (payload.style)

        return payload.style;

    return "universal";

};


/* ============================================================
 * COMPLEXITY DETECTOR
 * ============================================================
 */

PowerTools.promptEngine.intelligence.detectComplexity = function (

    payload = {}

) {

    let score = 0;

    Object.keys(payload).forEach(key => {

        const value = payload[key];

        if (!value)

            return;

        score++;

        if (

            typeof value === "object"

        ) {

            score +=

                Object.keys(value).length;

        }

    });

    if (score <= 5)

        return "simple";

    if (score <= 15)

        return "medium";

    if (score <= 30)

        return "advanced";

    return "professional";

};


/* ============================================================
 * COMPLETENESS DETECTOR
 * ============================================================
 */

PowerTools.promptEngine.intelligence.detectCompleteness = function (

    payload = {}

) {

    const fields = [

        "subject",

        "character",

        "environment",

        "composition",

        "lighting",

        "style",

        "quality"

    ];

    let completed = 0;

    fields.forEach(field => {

        if (payload[field])

            completed++;

    });

    return Math.round(

        completed /

        fields.length *

        100

    );

};


/* ============================================================
 * RECOMMENDATION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.intelligence.getRecommendations = function (

    payload = {}

) {

    const tips = [];

    if (!payload.style)

        tips.push(

            "Specify visual style."

        );

    if (!payload.lighting)

        tips.push(

            "Add lighting information."

        );

    if (!payload.composition)

        tips.push(

            "Define camera composition."

        );

    if (!payload.environment)

        tips.push(

            "Describe the environment."

        );

    if (!payload.quality)

        tips.push(

            "Choose a quality preset."

        );

    return tips;

};


/* ============================================================
 * PROMPT ANALYZER
 * ============================================================
 */

PowerTools.promptEngine.analyzer = {

    analyze(prompt = "") {

        const words =

            prompt

                .split(/\s+/)

                .filter(Boolean);

        const commas =

            (prompt.match(/,/g) || []).length;

        const length =

            prompt.length;

        return {

            length,

            words:

                words.length,

            commas,

            estimatedTokens:

                Math.ceil(

                    words.length * 1.35

                ),

            readable:

                length > 80,

            rich:

                commas >= 8

        };

    }

};


/* ============================================================
 * PROMPT SCORE ENGINE
 * ============================================================
 */

PowerTools.promptEngine.scoreEngine = {

    score(prompt = "") {

        const info =

            PowerTools.promptEngine.analyzer.analyze(

                prompt

            );

        let score = 0;

        if (

            info.length > 100

        )

            score += 15;

        if (

            info.length > 250

        )

            score += 15;

        if (

            info.words > 40

        )

            score += 15;

        if (

            info.words > 80

        )

            score += 15;

        if (

            info.commas > 8

        )

            score += 10;

        if (

            info.commas > 15

        )

            score += 10;

        if (

            /masterpiece/i.test(prompt)

        )

            score += 5;

        if (

            /cinematic/i.test(prompt)

        )

            score += 5;

        if (

            /lighting/i.test(prompt)

        )

            score += 5;

        if (

            /camera/i.test(prompt)

        )

            score += 5;

        return Math.min(

            score,

            100

        );

    }

};


/* ============================================================
 * QUALITY CLASSIFIER
 * ============================================================
 */

PowerTools.promptEngine.scoreEngine.grade = function (

    score

) {

    if (score >= 95)

        return "Legendary";

    if (score >= 90)

        return "Excellent";

    if (score >= 80)

        return "Professional";

    if (score >= 70)

        return "Good";

    if (score >= 60)

        return "Average";

    return "Needs Improvement";

};


/* ============================================================
 * FULL ANALYSIS
 * ============================================================
 */

PowerTools.promptEngine.inspect = function (

    payload = {}

) {

    const preview =

        this.preview(payload);

    const intelligence =

        this.intelligence.analyze(

            payload

        );

    const analysis =

        this.analyzer.analyze(

            preview

        );

    const score =

        this.scoreEngine.score(

            preview

        );

    return {

        preview,

        intelligence,

        analysis,

        score,

        grade:

            this.scoreEngine.grade(

                score

            )

    };

};


/* ============================================================
 * PROMPT BENCHMARK
 * ============================================================
 */

PowerTools.promptEngine.benchmark = function (

    payload = {}

) {

    const result =

        this.inspect(

            payload

        );

    return {

        success: true,

        timestamp:

            Date.now(),

        benchmark:

            result

    };

};


/* ============================================================
 * END PART 9
 * ============================================================
 */

 /* ============================================================
 * PART 10
 * Prompt Auto Improvement Engine
 * Weak Prompt Detector
 * Missing Information Detector
 * Smart Completion Engine
 * Prompt Repair Engine
 * ============================================================
 */


/* ============================================================
 * WEAK PROMPT DETECTOR
 * ============================================================
 */

PowerTools.promptEngine.weakDetector = {

    keywords: [

        "beautiful",
        "nice",
        "good",
        "cool",
        "awesome",
        "photo",
        "picture",
        "image",
        "art"

    ],

    detect(prompt = "") {

        const issues = [];

        const text = String(prompt).toLowerCase();

        if (text.length < 120) {

            issues.push({
                type: "length",
                message: "Prompt is too short."
            });

        }

        this.keywords.forEach(keyword => {

            if (text === keyword) {

                issues.push({

                    type: "generic",

                    message:

                        "Prompt is too generic."

                });

            }

        });

        if (!/,/.test(text)) {

            issues.push({

                type: "structure",

                message:

                    "Prompt lacks descriptive segments."

            });

        }

        return issues;

    }

};


/* ============================================================
 * MISSING INFORMATION DETECTOR
 * ============================================================
 */

PowerTools.promptEngine.missingDetector = {

    detect(payload = {}) {

        const missing = [];

        if (!payload.subject)

            missing.push("subject");

        if (!payload.style)

            missing.push("style");

        if (!payload.lighting)

            missing.push("lighting");

        if (!payload.composition)

            missing.push("composition");

        if (!payload.environment)

            missing.push("environment");

        if (!payload.quality)

            missing.push("quality");

        return missing;

    }

};


/* ============================================================
 * SMART COMPLETION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.smartCompletion = {

    defaults: {

        style:
            "cinematic",

        lighting: {

            type:
                "volumetric"

        },

        composition: {

            camera:
                "arri",

            lens:
                "anamorphic",

            angle:
                "eye"

        },

        quality: {

            quality:
                "ultra",

            render:
                "octane"

        },

        environment: {

            atmosphere:
                "immersive cinematic atmosphere"

        }

    },

    apply(payload = {}) {

        const clone =

            PowerTools.promptEngine.utils.clone(

                payload

            );

        Object.keys(

            this.defaults

        ).forEach(key => {

            if (!clone[key]) {

                clone[key] =

                    PowerTools.promptEngine.utils.clone(

                        this.defaults[key]

                    );

            }

        });

        return clone;

    }

};


/* ============================================================
 * PROMPT REPAIR ENGINE
 * ============================================================
 */

PowerTools.promptEngine.repairEngine = {

    repair(payload = {}) {

        payload =

            PowerTools.promptEngine.smartCompletion.apply(

                payload

            );

        return payload;

    }

};


/* ============================================================
 * AUTO IMPROVEMENT ENGINE
 * ============================================================
 */

PowerTools.promptEngine.improver = {

    improve(payload = {}) {

        payload =

            PowerTools.promptEngine.repairEngine.repair(

                payload

            );

        let preview =

            PowerTools.promptEngine.preview(

                payload

            );

        preview =

            PowerTools.promptEngine.smartEnhance(

                preview,

                {

                    cinematic: {

                        movie: true,

                        epic: true,

                        dof: true,

                        colorGrade: true

                    },

                    expand: true

                }

            );

        return {

            payload,

            preview

        };

    }

};


/* ============================================================
 * QUALITY CHECK ENGINE
 * ============================================================
 */

PowerTools.promptEngine.qualityCheck = {

    run(payload = {}) {

        const missing =

            PowerTools.promptEngine

                .missingDetector

                .detect(payload);

        const preview =

            PowerTools.promptEngine

                .preview(payload);

        const issues =

            PowerTools.promptEngine

                .weakDetector

                .detect(preview);

        const score =

            PowerTools.promptEngine

                .scoreEngine

                .score(preview);

        return {

            missing,

            issues,

            score,

            passed:

                score >= 80

        };

    }

};


/* ============================================================
 * AUTO FIX
 * ============================================================
 */

PowerTools.promptEngine.autoFix = function (

    payload = {}

) {

    const report =

        this.qualityCheck.run(

            payload

        );

    if (

        report.passed

    ) {

        return payload;

    }

    return this.repairEngine.repair(

        payload

    );

};


/* ============================================================
 * GENERATE PROFESSIONAL
 * ============================================================
 */

PowerTools.promptEngine.generateProfessional = function (

    payload = {}

) {

    payload =

        this.autoFix(

            payload

        );

    const result =

        this.generateConsistent(

            payload

        );

    result.report =

        this.qualityCheck.run(

            payload

        );

    result.analysis =

        this.inspect(

            payload

        );

    result.professional = true;

    return result;

};


/* ============================================================
 * AUTO COMPLETE API
 * ============================================================
 */

PowerTools.promptEngine.complete = function (

    payload = {}

) {

    return this.smartCompletion.apply(

        payload

    );

};


/* ============================================================
 * REPAIR API
 * ============================================================
 */

PowerTools.promptEngine.repair = function (

    payload = {}

) {

    return this.repairEngine.repair(

        payload

    );

};


/* ============================================================
 * IMPROVE API
 * ============================================================
 */

PowerTools.promptEngine.improve = function (

    payload = {}

) {

    return this.improver.improve(

        payload

    );

};


/* ============================================================
 * END PART 10
 * ============================================================
 */

 /* ============================================================
 * PART 11
 * Leonardo AI Formatter
 * Midjourney Formatter
 * FLUX Formatter
 * SDXL Formatter
 * Stable Diffusion Formatter
 * ============================================================
 */


/* ============================================================
 * PROVIDER FORMAT HELPERS
 * ============================================================
 */

PowerTools.promptEngine.providerUtils = {

    clean(prompt = "") {

        return PowerTools.promptEngine.optimizer.optimize(

            PowerTools.promptEngine.deduplicate(prompt)

        );

    },

    append(prompt, items = []) {

        const list = [];

        list.push(prompt);

        items.forEach(item => {

            if (item) {

                list.push(item);

            }

        });

        return this.clean(

            list.join(", ")

        );

    }

};


/* ============================================================
 * LEONARDO AI FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.leonardo = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "masterpiece",

            "best quality",

            "ultra detailed",

            "photorealistic",

            "8k",

            "HDR",

            "sharp focus",

            "realistic lighting",

            "highly detailed textures",

            "professional composition",

            "octane render"

        ]

    );

};


/* ============================================================
 * MIDJOURNEY FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.midjourney = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "cinematic",

            "beautiful composition",

            "hyper detailed",

            "award winning",

            "epic lighting",

            "dramatic atmosphere",

            "--stylize 250",

            "--chaos 8",

            "--quality 2"

        ]

    );

};


/* ============================================================
 * FLUX FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.flux = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "natural language prompt",

            "high realism",

            "fine textures",

            "accurate lighting",

            "cinematic depth",

            "professional photography",

            "ultra sharp",

            "HDR"

        ]

    );

};


/* ============================================================
 * SDXL FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.sdxl = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "masterpiece",

            "best quality",

            "ultra detailed",

            "8k wallpaper",

            "professional photography",

            "volumetric lighting",

            "global illumination",

            "realistic shadows"

        ]

    );

};


/* ============================================================
 * STABLE DIFFUSION FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.stableDiffusion = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "masterpiece",

            "best quality",

            "highly detailed",

            "ultra realistic",

            "cinematic composition",

            "sharp focus",

            "HDR",

            "depth of field"

        ]

    );

};


/* ============================================================
 * NEGATIVE PROMPT LIBRARY
 * ============================================================
 */

PowerTools.promptEngine.providerNegative = {

    default: [

        "worst quality",

        "low quality",

        "low resolution",

        "blurry",

        "pixelated",

        "jpeg artifacts",

        "watermark",

        "signature",

        "logo",

        "text",

        "duplicate",

        "bad anatomy",

        "bad proportions",

        "extra fingers",

        "missing fingers",

        "mutated hands",

        "extra limbs",

        "cropped",

        "out of frame"

    ],

    portrait: [

        "cross eyes",

        "deformed face",

        "asymmetrical face",

        "bad skin",

        "deformed mouth",

        "ugly face"

    ],

    product: [

        "damaged product",

        "broken",

        "dirty",

        "dust",

        "scratches"

    ]

};


/* ============================================================
 * BUILD NEGATIVE FOR PROVIDER
 * ============================================================
 */

PowerTools.promptEngine.buildProviderNegative = function (

    type = "default",

    extra = []

) {

    const base =

        this.providerNegative.default.slice();

    if (

        this.providerNegative[type]

    ) {

        base.push(

            ...this.providerNegative[type]

        );

    }

    base.push(

        ...extra

    );

    return this.deduplicate(

        base.join(", ")

    );

};


/* ============================================================
 * PROVIDER INFO
 * ============================================================
 */

PowerTools.promptEngine.providerInfo = {

    leonardo: {

        supportsNegative: true,

        naturalLanguage: true

    },

    midjourney: {

        supportsNegative: false,

        parameters: true

    },

    flux: {

        supportsNegative: false,

        naturalLanguage: true

    },

    sdxl: {

        supportsNegative: true

    },

    stableDiffusion: {

        supportsNegative: true

    }

};


/* ============================================================
 * FORMAT WITH PROVIDER PROFILE
 * ============================================================
 */

PowerTools.promptEngine.formatProvider = function (

    provider,

    prompt,

    options = {}

) {

    provider =

        (provider || "universal")

        .toLowerCase();

    let formatted =

        this.format(

            provider,

            prompt

        );

    const negative =

        this.buildProviderNegative(

            options.type || "default",

            options.extraNegative || []

        );

    return {

        provider,

        prompt: formatted,

        negative,

        profile:

            this.providerInfo[provider] ||

            {}

    };

};


/* ============================================================
 * END PART 11
 * ============================================================
 */

 /* ============================================================
 * PART 12
 * Google Imagen Formatter
 * Ideogram Formatter
 * Adobe Firefly Formatter
 * ChatGPT Image Formatter
 * Gemini Image Formatter
 * Claude Formatter
 * Universal Provider Router v2
 * ============================================================
 */


/* ============================================================
 * GOOGLE IMAGEN FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.imagen = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "natural language",

            "photorealistic",

            "physically accurate lighting",

            "cinematic composition",

            "professional photography",

            "ultra realistic",

            "high dynamic range",

            "beautiful color grading",

            "fine textures",

            "realistic atmosphere"

        ]

    );

};


/* ============================================================
 * IDEOGRAM FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.ideogram = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "clean composition",

            "balanced layout",

            "graphic design quality",

            "precise typography",

            "sharp edges",

            "high contrast",

            "premium branding style",

            "studio lighting"

        ]

    );

};


/* ============================================================
 * ADOBE FIREFLY FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.firefly = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "commercial advertising",

            "creative direction",

            "premium branding",

            "professional studio",

            "photo realistic",

            "editorial quality",

            "advertisement ready",

            "magazine quality"

        ]

    );

};


/* ============================================================
 * CHATGPT IMAGE FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.chatgpt = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "extremely descriptive",

            "coherent composition",

            "high realism",

            "physically accurate lighting",

            "consistent perspective",

            "fine details",

            "professional photography",

            "natural colors",

            "immersive atmosphere"

        ]

    );

};


/* ============================================================
 * GEMINI IMAGE FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.gemini = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "high fidelity",

            "balanced composition",

            "accurate materials",

            "cinematic realism",

            "natural lighting",

            "detailed environment",

            "realistic shadows",

            "professional visual quality"

        ]

    );

};


/* ============================================================
 * CLAUDE FORMATTER
 * ============================================================
 */

PowerTools.promptEngine.providers.claude = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "clear visual description",

            "logical scene structure",

            "cohesive composition",

            "rich environmental details",

            "natural storytelling",

            "professional cinematic quality"

        ]

    );

};


/* ============================================================
 * PROVIDER CAPABILITY DATABASE
 * ============================================================
 */

PowerTools.promptEngine.providerCapabilities = {

    universal: {

        image: true,

        video: true,

        negativePrompt: true,

        parameters: false

    },

    chatgpt: {

        image: true,

        video: false,

        naturalLanguage: true,

        negativePrompt: false

    },

    gemini: {

        image: true,

        video: true,

        naturalLanguage: true,

        negativePrompt: false

    },

    claude: {

        image: false,

        video: false,

        promptWriting: true

    },

    leonardo: {

        image: true,

        negativePrompt: true,

        promptWeight: true

    },

    midjourney: {

        image: true,

        parameters: true,

        stylize: true,

        chaos: true

    },

    flux: {

        image: true,

        naturalLanguage: true

    },

    sdxl: {

        image: true,

        negativePrompt: true,

        lora: true

    },

    stableDiffusion: {

        image: true,

        negativePrompt: true,

        embeddings: true

    },

    imagen: {

        image: true,

        naturalLanguage: true

    },

    ideogram: {

        image: true,

        typography: true

    },

    firefly: {

        image: true,

        commercial: true

    }

};


/* ============================================================
 * UNIVERSAL ROUTER
 * ============================================================
 */

PowerTools.promptEngine.routeProvider = function (

    provider,

    prompt,

    options = {}

) {

    provider =

        String(

            provider ||

            "universal"

        ).toLowerCase();

    if (

        typeof this.providers[provider] ===

        "function"

    ) {

        const formatted =

            this.providers[provider](

                prompt

            );

        return {

            provider,

            prompt: formatted,

            negative:

                this.buildProviderNegative(

                    options.type ||

                    "default",

                    options.extraNegative ||

                    []

                ),

            capabilities:

                this.providerCapabilities[provider] ||

                {}

        };

    }

    return {

        provider: "universal",

        prompt,

        negative:

            this.buildProviderNegative(),

        capabilities:

            this.providerCapabilities.universal

    };

};


/* ============================================================
 * PROVIDER DETECTOR
 * ============================================================
 */

PowerTools.promptEngine.detectProvider = function (

    name

) {

    if (!name)

        return "universal";

    name =

        String(name)

        .toLowerCase()

        .trim();

    const aliases = {

        sd:

            "stableDiffusion",

        stable:

            "stableDiffusion",

        stable_diffusion:

            "stableDiffusion",

        mj:

            "midjourney",

        leo:

            "leonardo",

        gpt:

            "chatgpt",

        openai:

            "chatgpt",

        google:

            "gemini"

    };

    return aliases[name] ||

        name;

};


/* ============================================================
 * FORMAT RESULT OBJECT
 * ============================================================
 */

PowerTools.promptEngine.prepareProviderResult = function (

    provider,

    prompt,

    options = {}

) {

    provider =

        this.detectProvider(

            provider

        );

    return this.routeProvider(

        provider,

        prompt,

        options

    );

};


/* ============================================================
 * END PART 12
 * ============================================================
 */

 /* ============================================================
 * PART 13
 * Video AI Foundation Engine
 * Universal Video Prompt Builder
 * Camera Motion Engine
 * Subject Motion Engine
 * Environment Motion Engine
 * ============================================================
 */


/* ============================================================
 * VIDEO ENGINE DATABASE
 * ============================================================
 */

PowerTools.promptEngine.video = {};

PowerTools.promptEngine.video.database = {

    duration: [

        "5 seconds",
        "8 seconds",
        "10 seconds",
        "15 seconds",
        "20 seconds",
        "30 seconds",
        "60 seconds"

    ],

    fps: [

        "24 fps",
        "30 fps",
        "60 fps"

    ],

    resolution: [

        "1080p",
        "2K",
        "4K",
        "8K"

    ]

};


/* ============================================================
 * CAMERA MOVEMENT LIBRARY
 * ============================================================
 */

PowerTools.promptEngine.video.camera = {

    static:
        "static camera",

    handheld:
        "subtle handheld movement",

    dollyIn:
        "slow dolly in",

    dollyOut:
        "slow dolly out",

    truckLeft:
        "camera trucking left",

    truckRight:
        "camera trucking right",

    panLeft:
        "smooth pan left",

    panRight:
        "smooth pan right",

    tiltUp:
        "slow tilt up",

    tiltDown:
        "slow tilt down",

    craneUp:
        "crane shot upward",

    craneDown:
        "crane shot downward",

    orbit:
        "360 degree orbit shot",

    fpv:
        "dynamic FPV movement",

    drone:
        "cinematic drone shot",

    zoomIn:
        "slow cinematic zoom in",

    zoomOut:
        "slow cinematic zoom out"

};


/* ============================================================
 * SUBJECT MOTION LIBRARY
 * ============================================================
 */

PowerTools.promptEngine.video.subject = {

    idle:
        "standing naturally",

    walking:
        "walking naturally",

    running:
        "running smoothly",

    smiling:
        "gentle smile",

    laughing:
        "laughing naturally",

    talking:
        "natural lip movement",

    waving:
        "waving hand",

    turning:
        "turning around slowly",

    looking:
        "looking toward camera",

    blinking:
        "natural eye blinking",

    breathing:
        "natural breathing motion"

};


/* ============================================================
 * ENVIRONMENT MOTION
 * ============================================================
 */

PowerTools.promptEngine.video.environment = {

    leaves:
        "leaves gently moving",

    wind:
        "soft wind movement",

    rain:
        "realistic rainfall",

    fog:
        "moving cinematic fog",

    smoke:
        "slow cinematic smoke",

    water:
        "flowing realistic water",

    fire:
        "dynamic fire movement",

    dust:
        "floating dust particles",

    clouds:
        "slow moving clouds",

    birds:
        "birds flying naturally"

};


/* ============================================================
 * CAMERA MOTION BUILDER
 * ============================================================
 */

PowerTools.promptEngine.video.cameraBuilder = {

    build(data = {}) {

        const result = [];

        if (data.type)

            result.push(

                PowerTools.promptEngine.video.camera[
                    data.type
                ] || ""

            );

        if (data.speed)

            result.push(

                data.speed +

                " movement"

            );

        if (data.smooth)

            result.push(

                "smooth cinematic stabilization"

            );

        if (data.extra)

            result.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            result.join(", ")

        );

    }

};


/* ============================================================
 * SUBJECT MOTION BUILDER
 * ============================================================
 */

PowerTools.promptEngine.video.subjectBuilder = {

    build(data = {}) {

        const result = [];

        if (data.motion)

            result.push(

                PowerTools.promptEngine.video.subject[
                    data.motion
                ] || ""

            );

        if (data.expression)

            result.push(

                data.expression

            );

        if (data.pose)

            result.push(

                data.pose

            );

        if (data.extra)

            result.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            result.join(", ")

        );

    }

};


/* ============================================================
 * ENVIRONMENT MOTION BUILDER
 * ============================================================
 */

PowerTools.promptEngine.video.environmentBuilder = {

    build(data = {}) {

        const result = [];

        if (

            Array.isArray(

                data.effects

            )

        ) {

            data.effects.forEach(effect => {

                if (

                    PowerTools.promptEngine.video.environment[
                        effect
                    ]

                ) {

                    result.push(

                        PowerTools.promptEngine.video.environment[
                            effect
                        ]

                    );

                }

            });

        }

        if (data.extra)

            result.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            result.join(", ")

        );

    }

};


/* ============================================================
 * VIDEO PROMPT BUILDER
 * ============================================================
 */

PowerTools.promptEngine.video.builder = {

    build(payload = {}) {

        const sections = [];

        if (

            payload.prompt

        ) {

            sections.push(

                payload.prompt

            );

        }

        if (

            payload.camera

        ) {

            sections.push(

                PowerTools.promptEngine.video.cameraBuilder.build(

                    payload.camera

                )

            );

        }

        if (

            payload.subject

        ) {

            sections.push(

                PowerTools.promptEngine.video.subjectBuilder.build(

                    payload.subject

                )

            );

        }

        if (

            payload.environment

        ) {

            sections.push(

                PowerTools.promptEngine.video.environmentBuilder.build(

                    payload.environment

                )

            );

        }

        if (

            payload.duration

        ) {

            sections.push(

                "duration " +

                payload.duration

            );

        }

        if (

            payload.fps

        ) {

            sections.push(

                payload.fps

            );

        }

        if (

            payload.resolution

        ) {

            sections.push(

                payload.resolution

            );

        }

        return PowerTools.promptEngine.utils.clean(

            sections.join(", ")

        );

    }

};


/* ============================================================
 * VIDEO PRESET
 * ============================================================
 */

PowerTools.promptEngine.video.defaults = {

    duration:
        "8 seconds",

    fps:
        "24 fps",

    resolution:
        "4K"

};


/* ============================================================
 * QUICK VIDEO BUILD
 * ============================================================
 */

PowerTools.promptEngine.video.create = function (

    payload = {}

) {

    payload = Object.assign(

        {},

        this.defaults,

        payload

    );

    return this.builder.build(

        payload

    );

};


/* ============================================================
 * END PART 13
 * ============================================================
 */

 /* ============================================================
 * PART 14
 * Veo 3 Cinematic Engine
 * Timeline Engine
 * Camera Direction Engine
 * Actor Blocking Engine
 * Lighting Transition Engine
 * Director Notes Engine
 * ============================================================
 */


/* ============================================================
 * VEO 3 ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.veo = {

    version: "3.0",

    defaults: {

        duration: "8 seconds",

        fps: "24 fps",

        resolution: "4K",

        aspectRatio: "16:9"

    }

};


/* ============================================================
 * SHOT TIMELINE ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.timeline = {

    build(data = {}) {

        const timeline = [];

        if (data.beginning) {

            timeline.push(

                "Beginning: " +

                data.beginning

            );

        }

        if (data.middle) {

            timeline.push(

                "Middle: " +

                data.middle

            );

        }

        if (data.ending) {

            timeline.push(

                "Ending: " +

                data.ending

            );

        }

        return timeline.join(". ");

    }

};


/* ============================================================
 * CAMERA DIRECTION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.cameraDirection = {

    build(data = {}) {

        const result = [];

        if (data.start)

            result.push(

                "camera starts with " +

                data.start

            );

        if (data.transition)

            result.push(

                "transitions into " +

                data.transition

            );

        if (data.finish)

            result.push(

                "ends with " +

                data.finish

            );

        if (data.speed)

            result.push(

                data.speed +

                " camera movement"

            );

        if (data.stabilization)

            result.push(

                "cinematic stabilization"

            );

        return PowerTools.promptEngine.utils.clean(

            result.join(", ")

        );

    }

};


/* ============================================================
 * ACTOR BLOCKING ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.actorBlocking = {

    build(actor = {}) {

        const parts = [];

        if (actor.entry)

            parts.push(

                "actor enters " +

                actor.entry

            );

        if (actor.action)

            parts.push(

                actor.action

            );

        if (actor.interaction)

            parts.push(

                actor.interaction

            );

        if (actor.expression)

            parts.push(

                actor.expression

            );

        if (actor.exit)

            parts.push(

                "actor exits " +

                actor.exit

            );

        return PowerTools.promptEngine.utils.clean(

            parts.join(", ")

        );

    }

};


/* ============================================================
 * OBJECT PHYSICS ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.physics = {

    build(data = {}) {

        const parts = [];

        if (data.wind)

            parts.push(

                "objects react naturally to wind"

            );

        if (data.gravity)

            parts.push(

                "realistic gravity"

            );

        if (data.cloth)

            parts.push(

                "cloth simulation"

            );

        if (data.hair)

            parts.push(

                "natural hair movement"

            );

        if (data.water)

            parts.push(

                "physically accurate water physics"

            );

        if (data.particles)

            parts.push(

                "dynamic particle simulation"

            );

        if (data.extra)

            parts.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            parts.join(", ")

        );

    }

};


/* ============================================================
 * LIGHTING TRANSITION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.lightTransition = {

    build(data = {}) {

        const parts = [];

        if (data.start)

            parts.push(

                "lighting starts with " +

                data.start

            );

        if (data.change)

            parts.push(

                "gradually changes into " +

                data.change

            );

        if (data.end)

            parts.push(

                "finishes with " +

                data.end

            );

        if (data.extra)

            parts.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            parts.join(", ")

        );

    }

};


/* ============================================================
 * DIRECTOR NOTES ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.directorNotes = {

    build(data = {}) {

        const notes = [];

        if (data.mood)

            notes.push(

                "overall mood: " +

                data.mood

            );

        if (data.pacing)

            notes.push(

                "pacing: " +

                data.pacing

            );

        if (data.style)

            notes.push(

                "directing style: " +

                data.style

            );

        if (data.ending)

            notes.push(

                "final impression: " +

                data.ending

            );

        return PowerTools.promptEngine.utils.clean(

            notes.join(", ")

        );

    }

};


/* ============================================================
 * VEO MASTER BUILDER
 * ============================================================
 */

PowerTools.promptEngine.video.veo.build = function (

    payload = {}

) {

    const blocks = [];

    if (payload.prompt)

        blocks.push(

            payload.prompt

        );

    if (payload.timeline)

        blocks.push(

            PowerTools.promptEngine.video.timeline.build(

                payload.timeline

            )

        );

    if (payload.cameraDirection)

        blocks.push(

            PowerTools.promptEngine.video.cameraDirection.build(

                payload.cameraDirection

            )

        );

    if (payload.actor)

        blocks.push(

            PowerTools.promptEngine.video.actorBlocking.build(

                payload.actor

            )

        );

    if (payload.physics)

        blocks.push(

            PowerTools.promptEngine.video.physics.build(

                payload.physics

            )

        );

    if (payload.lighting)

        blocks.push(

            PowerTools.promptEngine.video.lightTransition.build(

                payload.lighting

            )

        );

    if (payload.director)

        blocks.push(

            PowerTools.promptEngine.video.directorNotes.build(

                payload.director

            )

        );

    blocks.push(

        payload.duration ||

        this.defaults.duration

    );

    blocks.push(

        payload.fps ||

        this.defaults.fps

    );

    blocks.push(

        payload.resolution ||

        this.defaults.resolution

    );

    blocks.push(

        payload.aspectRatio ||

        this.defaults.aspectRatio

    );

    return PowerTools.promptEngine.utils.clean(

        blocks.join(", ")

    );

};


/* ============================================================
 * QUICK VEO GENERATOR
 * ============================================================
 */

PowerTools.promptEngine.video.createVeoPrompt = function (

    payload = {}

) {

    return this.veo.build(

        payload

    );

};


/* ============================================================
 * END PART 14
 * ============================================================
 */

 /* ============================================================
 * PART 15
 * Kling AI Professional Engine
 * Motion Strength Engine
 * Camera Path Engine
 * Character Continuity Engine
 * Scene Continuity Engine
 * Frame Consistency Engine
 * ============================================================
 */


/* ============================================================
 * KLING AI ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.kling = {

    version: "1.0",

    defaults: {

        duration: "8 seconds",

        fps: "24 fps",

        resolution: "4K",

        aspectRatio: "16:9",

        motionStrength: "medium"

    }

};


/* ============================================================
 * MOTION STRENGTH LIBRARY
 * ============================================================
 */

PowerTools.promptEngine.video.motionStrength = {

    minimal:
        "very subtle natural movement",

    low:
        "gentle motion",

    medium:
        "balanced cinematic movement",

    high:
        "dynamic movement",

    extreme:
        "high energy action movement"

};


/* ============================================================
 * CAMERA PATH ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.cameraPath = {

    build(data = {}) {

        const parts = [];

        if (data.start)

            parts.push(
                "camera begins at " +
                data.start
            );

        if (data.path)

            parts.push(
                "camera follows " +
                data.path
            );

        if (data.target)

            parts.push(
                "camera keeps focus on " +
                data.target
            );

        if (data.finish)

            parts.push(
                "camera ends at " +
                data.finish
            );

        if (data.extra)

            parts.push(data.extra);

        return PowerTools.promptEngine.utils.clean(
            parts.join(", ")
        );

    }

};


/* ============================================================
 * MOTION BRUSH ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.motionBrush = {

    build(data = {}) {

        const parts = [];

        if (Array.isArray(data.targets)) {

            data.targets.forEach(target => {

                parts.push(
                    "animate " + target
                );

            });

        }

        if (data.intensity)

            parts.push(
                "motion intensity " +
                data.intensity
            );

        if (data.extra)

            parts.push(data.extra);

        return PowerTools.promptEngine.utils.clean(
            parts.join(", ")
        );

    }

};


/* ============================================================
 * CHARACTER CONTINUITY ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.characterContinuity = {

    build(data = {}) {

        const parts = [

            "maintain identical facial features",

            "maintain hairstyle",

            "maintain clothing",

            "maintain body proportions"

        ];

        if (data.expression)

            parts.push(
                "expression changes naturally"
            );

        if (data.eyeContact)

            parts.push(
                "consistent eye direction"
            );

        if (data.extra)

            parts.push(
                data.extra
            );

        return PowerTools.promptEngine.utils.clean(
            parts.join(", ")
        );

    }

};


/* ============================================================
 * SCENE CONTINUITY ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.sceneContinuity = {

    build(data = {}) {

        const parts = [

            "consistent environment",

            "stable lighting",

            "consistent shadows",

            "maintain object positions"

        ];

        if (data.weather)

            parts.push(
                "weather remains consistent"
            );

        if (data.time)

            parts.push(
                "time of day remains consistent"
            );

        if (data.extra)

            parts.push(
                data.extra
            );

        return PowerTools.promptEngine.utils.clean(
            parts.join(", ")
        );

    }

};


/* ============================================================
 * FRAME CONSISTENCY ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.frameConsistency = {

    build(data = {}) {

        const parts = [

            "smooth frame interpolation",

            "consistent motion",

            "no flickering",

            "stable temporal coherence"

        ];

        if (data.detail)

            parts.push(
                "preserve fine details"
            );

        if (data.faces)

            parts.push(
                "preserve facial consistency"
            );

        if (data.extra)

            parts.push(
                data.extra
            );

        return PowerTools.promptEngine.utils.clean(
            parts.join(", ")
        );

    }

};


/* ============================================================
 * KLING MASTER BUILDER
 * ============================================================
 */

PowerTools.promptEngine.video.kling.build = function (

    payload = {}

) {

    const blocks = [];

    if (payload.prompt)
        blocks.push(payload.prompt);

    if (payload.cameraPath)
        blocks.push(
            PowerTools.promptEngine.video.cameraPath.build(
                payload.cameraPath
            )
        );

    if (payload.motionBrush)
        blocks.push(
            PowerTools.promptEngine.video.motionBrush.build(
                payload.motionBrush
            )
        );

    if (payload.characterContinuity)
        blocks.push(
            PowerTools.promptEngine.video.characterContinuity.build(
                payload.characterContinuity
            )
        );

    if (payload.sceneContinuity)
        blocks.push(
            PowerTools.promptEngine.video.sceneContinuity.build(
                payload.sceneContinuity
            )
        );

    if (payload.frameConsistency)
        blocks.push(
            PowerTools.promptEngine.video.frameConsistency.build(
                payload.frameConsistency
            )
        );

    blocks.push(

        PowerTools.promptEngine.video.motionStrength[
            payload.motionStrength ||
            this.defaults.motionStrength
        ]

    );

    blocks.push(
        payload.duration ||
        this.defaults.duration
    );

    blocks.push(
        payload.fps ||
        this.defaults.fps
    );

    blocks.push(
        payload.resolution ||
        this.defaults.resolution
    );

    blocks.push(
        payload.aspectRatio ||
        this.defaults.aspectRatio
    );

    return PowerTools.promptEngine.utils.clean(
        blocks.join(", ")
    );

};


/* ============================================================
 * QUICK KLING GENERATOR
 * ============================================================
 */

PowerTools.promptEngine.video.createKlingPrompt = function (

    payload = {}

) {

    return this.kling.build(payload);

};


/* ============================================================
 * REGISTER KLING PROVIDER
 * ============================================================
 */

PowerTools.promptEngine.providers.kling = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "cinematic video",

            "natural motion",

            "temporal consistency",

            "high quality video",

            "realistic movement",

            "smooth animation",

            "stable lighting",

            "professional cinematography"

        ]

    );

};


/* ============================================================
 * END PART 15
 * ============================================================
 */

 /* ============================================================
 * PART 16
 * Runway Gen-4 Professional Engine
 * Cinematic Shot Planner
 * Camera Rig Engine
 * Actor Performance Engine
 * Lens Transition Engine
 * Environmental Dynamics Engine
 * ============================================================
 */


/* ============================================================
 * RUNWAY GEN-4 ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.runway = {

    version: "4.0",

    defaults: {

        duration: "8 seconds",

        fps: "24 fps",

        resolution: "4K",

        aspectRatio: "16:9",

        quality: "cinematic"

    }

};


/* ============================================================
 * CINEMATIC SHOT PLANNER
 * ============================================================
 */

PowerTools.promptEngine.video.shotPlanner = {

    build(data = {}) {

        const blocks = [];

        if (data.opening)
            blocks.push(
                "Opening shot: " +
                data.opening
            );

        if (data.secondary)
            blocks.push(
                "Second shot: " +
                data.secondary
            );

        if (data.hero)
            blocks.push(
                "Hero shot: " +
                data.hero
            );

        if (data.closing)
            blocks.push(
                "Closing shot: " +
                data.closing
            );

        return PowerTools.promptEngine.utils.clean(
            blocks.join(", ")
        );

    }

};


/* ============================================================
 * CAMERA RIG ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.cameraRig = {

    build(data = {}) {

        const blocks = [];

        if (data.rig)
            blocks.push(
                data.rig
            );

        if (data.stabilizer)
            blocks.push(
                "camera stabilized with " +
                data.stabilizer
            );

        if (data.movement)
            blocks.push(
                data.movement
            );

        if (data.acceleration)
            blocks.push(
                data.acceleration +
                " acceleration"
            );

        if (data.extra)
            blocks.push(
                data.extra
            );

        return PowerTools.promptEngine.utils.clean(
            blocks.join(", ")
        );

    }

};


/* ============================================================
 * ACTOR PERFORMANCE ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.actorPerformance = {

    build(data = {}) {

        const blocks = [];

        if (data.performance)
            blocks.push(
                data.performance
            );

        if (data.expression)
            blocks.push(
                "natural facial expression"
            );

        if (data.eyeContact)
            blocks.push(
                "realistic eye contact"
            );

        if (data.handMovement)
            blocks.push(
                "natural hand gestures"
            );

        if (data.walking)
            blocks.push(
                "realistic walking cycle"
            );

        if (data.extra)
            blocks.push(
                data.extra
            );

        return PowerTools.promptEngine.utils.clean(
            blocks.join(", ")
        );

    }

};


/* ============================================================
 * LENS TRANSITION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.lensTransition = {

    build(data = {}) {

        const blocks = [];

        if (data.start)
            blocks.push(
                "starts with " +
                data.start
            );

        if (data.middle)
            blocks.push(
                "transitions to " +
                data.middle
            );

        if (data.end)
            blocks.push(
                "finishes with " +
                data.end
            );

        if (data.focus)
            blocks.push(
                "continuous focus transition"
            );

        if (data.extra)
            blocks.push(
                data.extra
            );

        return PowerTools.promptEngine.utils.clean(
            blocks.join(", ")
        );

    }

};


/* ============================================================
 * ENVIRONMENTAL DYNAMICS ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.environmentDynamics = {

    build(data = {}) {

        const blocks = [];

        if (data.wind)
            blocks.push(
                "natural wind simulation"
            );

        if (data.fog)
            blocks.push(
                "dynamic volumetric fog"
            );

        if (data.clouds)
            blocks.push(
                "moving cloud layers"
            );

        if (data.water)
            blocks.push(
                "physically accurate water movement"
            );

        if (data.fire)
            blocks.push(
                "dynamic fire simulation"
            );

        if (data.rain)
            blocks.push(
                "realistic rainfall"
            );

        if (data.snow)
            blocks.push(
                "natural snowfall"
            );

        if (data.extra)
            blocks.push(
                data.extra
            );

        return PowerTools.promptEngine.utils.clean(
            blocks.join(", ")
        );

    }

};


/* ============================================================
 * FRAME STRUCTURE ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.frameStructure = {

    build(data = {}) {

        const blocks = [];

        if (data.startFrame)
            blocks.push(
                "Start Frame: " +
                data.startFrame
            );

        if (data.keyFrame)
            blocks.push(
                "Key Frame: " +
                data.keyFrame
            );

        if (data.endFrame)
            blocks.push(
                "End Frame: " +
                data.endFrame
            );

        return PowerTools.promptEngine.utils.clean(
            blocks.join(", ")
        );

    }

};


/* ============================================================
 * RUNWAY MASTER BUILDER
 * ============================================================
 */

PowerTools.promptEngine.video.runway.build = function (

    payload = {}

) {

    const blocks = [];

    if (payload.prompt)
        blocks.push(payload.prompt);

    if (payload.shots)
        blocks.push(
            PowerTools.promptEngine.video.shotPlanner.build(
                payload.shots
            )
        );

    if (payload.cameraRig)
        blocks.push(
            PowerTools.promptEngine.video.cameraRig.build(
                payload.cameraRig
            )
        );

    if (payload.actor)
        blocks.push(
            PowerTools.promptEngine.video.actorPerformance.build(
                payload.actor
            )
        );

    if (payload.lens)
        blocks.push(
            PowerTools.promptEngine.video.lensTransition.build(
                payload.lens
            )
        );

    if (payload.environment)
        blocks.push(
            PowerTools.promptEngine.video.environmentDynamics.build(
                payload.environment
            )
        );

    if (payload.frames)
        blocks.push(
            PowerTools.promptEngine.video.frameStructure.build(
                payload.frames
            )
        );

    blocks.push(
        payload.duration ||
        this.defaults.duration
    );

    blocks.push(
        payload.fps ||
        this.defaults.fps
    );

    blocks.push(
        payload.resolution ||
        this.defaults.resolution
    );

    blocks.push(
        payload.aspectRatio ||
        this.defaults.aspectRatio
    );

    blocks.push(
        this.defaults.quality
    );

    return PowerTools.promptEngine.utils.clean(
        blocks.join(", ")
    );

};


/* ============================================================
 * QUICK RUNWAY GENERATOR
 * ============================================================
 */

PowerTools.promptEngine.video.createRunwayPrompt = function (

    payload = {}

) {

    return this.runway.build(payload);

};


/* ============================================================
 * REGISTER RUNWAY PROVIDER
 * ============================================================
 */

PowerTools.promptEngine.providers.runway = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "Runway Gen-4 cinematic video",

            "professional directing",

            "film-grade camera work",

            "natural actor performance",

            "consistent temporal coherence",

            "realistic environmental dynamics",

            "high fidelity motion",

            "production quality"

        ]

    );

};


/* ============================================================
 * END PART 16
 * ============================================================
 */

    /* ============================================================
 * PART 17
 * Pika 2.2 Professional Engine
 * Luma Dream Machine Engine
 * Hailuo AI Engine
 * PixVerse Engine
 * Higgsfield Engine
 * ============================================================
 */


/* ============================================================
 * PIKA AI ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.pika = {

    defaults: {

        duration: "8 seconds",

        fps: "24 fps",

        resolution: "4K",

        aspectRatio: "16:9"

    },

    build(payload = {}) {

        const blocks = [];

        if (payload.prompt)
            blocks.push(payload.prompt);

        blocks.push(
            "smooth cinematic animation"
        );

        blocks.push(
            "natural subject movement"
        );

        blocks.push(
            "stable camera motion"
        );

        blocks.push(
            "consistent lighting"
        );

        blocks.push(
            payload.duration || this.defaults.duration
        );

        blocks.push(
            payload.fps || this.defaults.fps
        );

        blocks.push(
            payload.resolution || this.defaults.resolution
        );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * LUMA DREAM MACHINE ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.luma = {

    build(payload = {}) {

        const blocks = [];

        if (payload.prompt)
            blocks.push(payload.prompt);

        blocks.push(
            "cinematic realism"
        );

        blocks.push(
            "film quality motion"
        );

        blocks.push(
            "natural camera behavior"
        );

        blocks.push(
            "photorealistic physics"
        );

        blocks.push(
            "dynamic cinematic lighting"
        );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * HAILUO AI ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.hailuo = {

    build(payload = {}) {

        const blocks = [];

        if (payload.prompt)
            blocks.push(payload.prompt);

        blocks.push(
            "smooth transition"
        );

        blocks.push(
            "realistic facial animation"
        );

        blocks.push(
            "continuous movement"
        );

        blocks.push(
            "professional storytelling"
        );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * PIXVERSE ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.pixverse = {

    build(payload = {}) {

        const blocks = [];

        if (payload.prompt)
            blocks.push(payload.prompt);

        blocks.push(
            "dynamic action sequence"
        );

        blocks.push(
            "realistic camera movement"
        );

        blocks.push(
            "vivid cinematic colors"
        );

        blocks.push(
            "smooth temporal consistency"
        );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * HIGGSFIELD ENGINE
 * ============================================================
 */

PowerTools.promptEngine.video.higgsfield = {

    build(payload = {}) {

        const blocks = [];

        if (payload.prompt)
            blocks.push(payload.prompt);

        blocks.push(
            "high-end commercial quality"
        );

        blocks.push(
            "premium cinematography"
        );

        blocks.push(
            "luxury advertising style"
        );

        blocks.push(
            "film-grade realism"
        );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * QUICK VIDEO HELPERS
 * ============================================================
 */

PowerTools.promptEngine.video.createPikaPrompt = function (

    payload = {}

) {

    return this.pika.build(payload);

};


PowerTools.promptEngine.video.createLumaPrompt = function (

    payload = {}

) {

    return this.luma.build(payload);

};


PowerTools.promptEngine.video.createHailuoPrompt = function (

    payload = {}

) {

    return this.hailuo.build(payload);

};


PowerTools.promptEngine.video.createPixVersePrompt = function (

    payload = {}

) {

    return this.pixverse.build(payload);

};


PowerTools.promptEngine.video.createHiggsfieldPrompt = function (

    payload = {}

) {

    return this.higgsfield.build(payload);

};


/* ============================================================
 * REGISTER VIDEO PROVIDERS
 * ============================================================
 */

PowerTools.promptEngine.providers.pika = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "Pika cinematic video",

            "natural movement",

            "smooth animation",

            "realistic motion",

            "professional camera movement",

            "consistent lighting",

            "high quality video"

        ]

    );

};


PowerTools.promptEngine.providers.luma = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "Luma Dream Machine",

            "cinematic realism",

            "natural physics",

            "professional film look",

            "high fidelity motion",

            "beautiful lighting"

        ]

    );

};


PowerTools.promptEngine.providers.hailuo = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "Hailuo AI",

            "smooth storytelling",

            "natural facial expressions",

            "stable character consistency",

            "realistic cinematic motion"

        ]

    );

};


PowerTools.promptEngine.providers.pixverse = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "PixVerse AI",

            "dynamic camera",

            "epic cinematic sequence",

            "action realism",

            "high temporal consistency"

        ]

    );

};


PowerTools.promptEngine.providers.higgsfield = function (

    prompt

) {

    return PowerTools.promptEngine.providerUtils.append(

        prompt,

        [

            "Higgsfield AI",

            "luxury commercial",

            "premium product video",

            "fashion film",

            "award-winning cinematography"

        ]

    );

};


/* ============================================================
 * VIDEO PROVIDER ROUTER
 * ============================================================
 */

PowerTools.promptEngine.video.generate = function (

    provider,

    payload = {}

) {

    provider =

        String(provider || "")

        .toLowerCase();

    switch (provider) {

        case "veo":
            return this.createVeoPrompt(payload);

        case "kling":
            return this.createKlingPrompt(payload);

        case "runway":
            return this.createRunwayPrompt(payload);

        case "pika":
            return this.createPikaPrompt(payload);

        case "luma":
            return this.createLumaPrompt(payload);

        case "hailuo":
            return this.createHailuoPrompt(payload);

        case "pixverse":
            return this.createPixVersePrompt(payload);

        case "higgsfield":
            return this.createHiggsfieldPrompt(payload);

        default:
            return this.create(payload);

    }

};


/* ============================================================
 * END PART 17
 * ============================================================
 */

/* ============================================================
 * PART 18
 * Image → Video Prompt Engine
 * Image Analysis Schema
 * Start / End Frame Builder
 * Motion Planner
 * Transition Planner
 * ============================================================
 */


/* ============================================================
 * IMAGE TO VIDEO ENGINE
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo = {

    version: "1.0",

    defaults: {

        preserveCharacter: true,

        preserveProduct: true,

        preserveStyle: true,

        preserveLighting: true,

        preserveComposition: true,

        duration: "8 seconds",

        fps: "24 fps",

        resolution: "4K"

    }

};


/* ============================================================
 * IMAGE ANALYSIS SCHEMA
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.analysis = {

    analyze(image = {}) {

        return {

            subject:
                image.subject || "",

            environment:
                image.environment || "",

            style:
                image.style || "",

            lighting:
                image.lighting || "",

            camera:
                image.camera || "",

            composition:
                image.composition || "",

            colors:
                image.colors || "",

            mood:
                image.mood || ""

        };

    }

};


/* ============================================================
 * START FRAME BUILDER
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.startFrame = {

    build(data = {}) {

        const blocks = [];

        blocks.push(
            "Start Frame"
        );

        if (data.subject)
            blocks.push(data.subject);

        if (data.environment)
            blocks.push(data.environment);

        if (data.camera)
            blocks.push(data.camera);

        if (data.lighting)
            blocks.push(data.lighting);

        if (data.style)
            blocks.push(data.style);

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * END FRAME BUILDER
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.endFrame = {

    build(data = {}) {

        const blocks = [];

        blocks.push(
            "End Frame"
        );

        if (data.goal)
            blocks.push(data.goal);

        if (data.expression)
            blocks.push(data.expression);

        if (data.camera)
            blocks.push(data.camera);

        if (data.environment)
            blocks.push(data.environment);

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * MOTION PLANNER
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.motionPlanner = {

    build(data = {}) {

        const blocks = [];

        if (data.character)
            blocks.push(
                "character movement: " +
                data.character
            );

        if (data.camera)
            blocks.push(
                "camera movement: " +
                data.camera
            );

        if (data.environment)
            blocks.push(
                "environment movement: " +
                data.environment
            );

        if (data.object)
            blocks.push(
                "object movement: " +
                data.object
            );

        if (data.physics)
            blocks.push(
                "physics: " +
                data.physics
            );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * TRANSITION PLANNER
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.transitionPlanner = {

    build(data = {}) {

        const blocks = [];

        if (data.type)
            blocks.push(
                data.type +
                " transition"
            );

        if (data.speed)
            blocks.push(
                data.speed +
                " transition speed"
            );

        if (data.style)
            blocks.push(
                data.style
            );

        if (data.extra)
            blocks.push(
                data.extra
            );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * PRESERVATION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.preservation = {

    build(options = {}) {

        const rules = [];

        if (options.preserveCharacter !== false)

            rules.push(

                "maintain identical facial features, hairstyle, body proportions and clothing"

            );

        if (options.preserveProduct !== false)

            rules.push(

                "preserve product shape, texture, material and branding"

            );

        if (options.preserveStyle !== false)

            rules.push(

                "maintain identical artistic style"

            );

        if (options.preserveLighting !== false)

            rules.push(

                "keep lighting direction and color temperature consistent"

            );

        if (options.preserveComposition !== false)

            rules.push(

                "preserve framing and composition continuity"

            );

        return PowerTools.promptEngine.utils.clean(

            rules.join(", ")

        );

    }

};


/* ============================================================
 * IMAGE → VIDEO MASTER BUILDER
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.build = function (

    payload = {}

) {

    const blocks = [];

    const analysis =

        this.analysis.analyze(

            payload.image ||

            {}

        );

    blocks.push(

        this.startFrame.build(

            analysis

        )

    );

    if (payload.motion)

        blocks.push(

            this.motionPlanner.build(

                payload.motion

            )

        );

    if (payload.transition)

        blocks.push(

            this.transitionPlanner.build(

                payload.transition

            )

        );

    blocks.push(

        this.preservation.build(

            Object.assign(

                {},

                this.defaults,

                payload

            )

        )

    );

    if (payload.endFrame)

        blocks.push(

            this.endFrame.build(

                payload.endFrame

            )

        );

    blocks.push(

        payload.duration ||

        this.defaults.duration

    );

    blocks.push(

        payload.fps ||

        this.defaults.fps

    );

    blocks.push(

        payload.resolution ||

        this.defaults.resolution

    );

    return PowerTools.promptEngine.utils.clean(

        blocks.join(", ")

    );

};


/* ============================================================
 * QUICK IMAGE → VIDEO API
 * ============================================================
 */

PowerTools.promptEngine.createImageToVideoPrompt = function (

    payload = {}

) {

    return this.imageToVideo.build(

        payload

    );

};


/* ============================================================
 * END PART 18
 * ============================================================
 */

/* ============================================================
 * PART 19
 * Image → Video Fusion Engine
 * Character Preservation Engine
 * Product Preservation Engine
 * Motion Director
 * Physics Planner
 * AI Video Provider Fusion
 * ============================================================
 */


/* ============================================================
 * CHARACTER PRESERVATION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.characterPreservation = {

    build(data = {}) {

        const rules = [

            "maintain identical facial identity",

            "maintain eye shape",

            "maintain eyebrow shape",

            "maintain nose structure",

            "maintain mouth proportions",

            "maintain skin tone",

            "maintain hairstyle",

            "maintain clothing",

            "maintain accessories",

            "maintain body proportions"

        ];

        if (data.expression)

            rules.push(

                "allow only natural facial expression changes"

            );

        if (data.pose)

            rules.push(

                "allow smooth pose transition"

            );

        if (data.extra)

            rules.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            rules.join(", ")

        );

    }

};


/* ============================================================
 * PRODUCT PRESERVATION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.productPreservation = {

    build(data = {}) {

        const rules = [

            "preserve exact product dimensions",

            "preserve product geometry",

            "preserve logo position",

            "preserve label details",

            "preserve materials",

            "preserve reflections",

            "preserve packaging",

            "preserve textures"

        ];

        if (data.brand)

            rules.push(

                "maintain complete brand identity"

            );

        if (data.extra)

            rules.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            rules.join(", ")

        );

    }

};


/* ============================================================
 * MOTION DIRECTOR
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.motionDirector = {

    build(data = {}) {

        const blocks = [];

        if (data.primary)

            blocks.push(

                "primary motion: " +

                data.primary

            );

        if (data.secondary)

            blocks.push(

                "secondary motion: " +

                data.secondary

            );

        if (data.camera)

            blocks.push(

                "camera choreography: " +

                data.camera

            );

        if (data.speed)

            blocks.push(

                "motion speed: " +

                data.speed

            );

        if (data.intensity)

            blocks.push(

                "motion intensity: " +

                data.intensity

            );

        if (data.extra)

            blocks.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * PHYSICS PLANNER
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.physicsPlanner = {

    build(data = {}) {

        const blocks = [];

        if (data.gravity)

            blocks.push(

                "realistic gravity"

            );

        if (data.cloth)

            blocks.push(

                "cloth simulation"

            );

        if (data.hair)

            blocks.push(

                "natural hair physics"

            );

        if (data.wind)

            blocks.push(

                "environment reacts to wind"

            );

        if (data.water)

            blocks.push(

                "physically accurate water"

            );

        if (data.particles)

            blocks.push(

                "particle simulation"

            );

        if (data.shadow)

            blocks.push(

                "dynamic shadow consistency"

            );

        if (data.extra)

            blocks.push(

                data.extra

            );

        return PowerTools.promptEngine.utils.clean(

            blocks.join(", ")

        );

    }

};


/* ============================================================
 * VIDEO FUSION ENGINE
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.fusion = {

    providers: {

        veo: "Veo 3",

        kling: "Kling AI",

        runway: "Runway Gen-4",

        pika: "Pika",

        luma: "Luma Dream Machine",

        hailuo: "Hailuo AI",

        pixverse: "PixVerse",

        higgsfield: "Higgsfield"

    },

    build(provider, prompt) {

        provider =

            String(provider || "")

            .toLowerCase();

        return PowerTools.promptEngine.utils.clean(

            [

                this.providers[provider] ||

                "Universal Video AI",

                prompt

            ].join(", ")

        );

    }

};


/* ============================================================
 * ADVANCED IMAGE → VIDEO BUILDER
 * ============================================================
 */

PowerTools.promptEngine.imageToVideo.buildAdvanced = function (

    provider,

    payload = {}

) {

    const sections = [];

    sections.push(

        this.startFrame.build(

            this.analysis.analyze(

                payload.image ||

                {}

            )

        )

    );

    sections.push(

        this.characterPreservation.build(

            payload.character ||

            {}

        )

    );

    sections.push(

        this.productPreservation.build(

            payload.product ||

            {}

        )

    );

    sections.push(

        this.motionDirector.build(

            payload.motion ||

            {}

        )

    );

    sections.push(

        this.physicsPlanner.build(

            payload.physics ||

            {}

        )

    );

    sections.push(

        this.endFrame.build(

            payload.endFrame ||

            {}

        )

    );

    sections.push(

        payload.duration ||

        this.defaults.duration

    );

    sections.push(

        payload.fps ||

        this.defaults.fps

    );

    sections.push(

        payload.resolution ||

        this.defaults.resolution

    );

    return this.fusion.build(

        provider,

        PowerTools.promptEngine.utils.clean(

            sections.join(", ")

        )

    );

};


/* ============================================================
 * UNIVERSAL IMAGE → VIDEO ROUTER
 * ============================================================
 */

PowerTools.promptEngine.generateImageToVideo = function (

    provider,

    payload = {}

) {

    provider =

        String(provider || "")

        .toLowerCase();

    return this.imageToVideo.buildAdvanced(

        provider,

        payload

    );

};


/* ============================================================
 * END PART 19
 * ============================================================
 */


