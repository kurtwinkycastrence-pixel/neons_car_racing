import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   NEON RUSH 3D
   FINAL VERSION
========================================================= */


/* =========================================================
   DOM
========================================================= */

const game = document.getElementById("game");

const speedText = document.getElementById("speed");
const distanceText = document.getElementById("distance");
const nitroFill = document.getElementById("nitro-fill");

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");

const gameOverScreen = document.getElementById("game-over");
const finalDistance = document.getElementById("final-distance");

const carButtons = document.querySelectorAll(".car-button");

const speedStat = document.getElementById("speed-stat");
const accelStat = document.getElementById("accel-stat");
const handlingStat = document.getElementById("handling-stat");


/* =========================================================
   CAR TYPES
========================================================= */

const carTypes = [

    {
        name: "STREET",
        color: 0x00ffff,
        accent: 0x0066ff,

        maxSpeed: 72,
        acceleration: 26,
        handling: 8.5,

        health: 100
    },

    {
        name: "SPORT",
        color: 0xff3355,
        accent: 0xff0033,

        maxSpeed: 82,
        acceleration: 32,
        handling: 9.5,

        health: 90
    },

    {
        name: "GT",
        color: 0xffaa00,
        accent: 0xff3300,

        maxSpeed: 92,
        acceleration: 30,
        handling: 7.8,

        health: 110
    }

];

let selectedCar = 0;


/* =========================================================
   GARAGE
========================================================= */

function updateGarage() {

    const car = carTypes[selectedCar];

    carButtons.forEach((button, index) => {

        button.classList.toggle(
            "active",
            index === selectedCar
        );

    });

    if (speedStat) {

        speedStat.style.width =
            ((car.maxSpeed - 50) / 45 * 100) + "%";

    }

    if (accelStat) {

        accelStat.style.width =
            ((car.acceleration - 20) / 15 * 100) + "%";

    }

    if (handlingStat) {

        handlingStat.style.width =
            ((car.handling - 6) / 4 * 100) + "%";

    }

}


carButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        selectedCar = index;

        updateGarage();

    });

});


updateGarage();


/* =========================================================
   THREE.JS SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x03040c);

scene.fog = new THREE.FogExp2(
    0x050716,
    0.018
);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    0,
    4.3,
    8
);


/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

game.appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

const ambientLight =
    new THREE.HemisphereLight(
        0x4466aa,
        0x050509,
        1.7
    );

scene.add(ambientLight);


const moonLight =
    new THREE.DirectionalLight(
        0x6688ff,
        1.2
    );

moonLight.position.set(
    -30,
    50,
    20
);

moonLight.castShadow = true;

moonLight.shadow.mapSize.width = 1024;
moonLight.shadow.mapSize.height = 1024;

scene.add(moonLight);


const cityGlow =
    new THREE.PointLight(
        0x00ffff,
        12,
        100
    );

cityGlow.position.set(
    0,
    12,
    -20
);

scene.add(cityGlow);


/* =========================================================
   ROAD
========================================================= */

const ROAD_WIDTH = 16;
const ROAD_LENGTH = 1200;

const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x080b14,
        roughness: 0.72,
        metalness: 0.25
    });


const road =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            ROAD_WIDTH,
            ROAD_LENGTH
        ),
        roadMaterial
    );

road.rotation.x = -Math.PI / 2;

road.position.y = -0.15;

road.position.z = -ROAD_LENGTH / 2;

road.receiveShadow = true;

scene.add(road);


/* =========================================================
   SIDEWALKS
========================================================= */

function createSidewalk(x) {

    const sidewalk =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                0.25,
                ROAD_LENGTH
            ),
            new THREE.MeshStandardMaterial({
                color: 0x101525,
                roughness: 0.8
            })
        );

    sidewalk.position.set(
        x,
        -0.02,
        -ROAD_LENGTH / 2
    );

    sidewalk.receiveShadow = true;

    scene.add(sidewalk);

}


createSidewalk(-10.5);
createSidewalk(10.5);


/* =========================================================
   NEON ROAD EDGES
========================================================= */

function createNeonEdge(x, color) {

    const edge =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.12,
                0.12,
                ROAD_LENGTH
            ),
            new THREE.MeshBasicMaterial({
                color
            })
        );

    edge.position.set(
        x,
        0.03,
        -ROAD_LENGTH / 2
    );

    scene.add(edge);

}


createNeonEdge(
    -8,
    0x00ffff
);

createNeonEdge(
    8,
    0xff0088
);


/* =========================================================
   LANE MARKINGS
========================================================= */

const laneMarkers = [];

const laneMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xeeeeee
    });


for (
    let z = 0;
    z > -ROAD_LENGTH;
    z -= 12
) {

    for (
        let x = -4;
        x <= 4;
        x += 4
    ) {

        const marker =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.14,
                    0.03,
                    5
                ),
                laneMaterial
            );

        marker.position.set(
            x,
            0.025,
            z
        );

        scene.add(marker);

        laneMarkers.push(marker);

    }

}


/* =========================================================
   CITY BUILDINGS
========================================================= */

const buildingColors = [
    0x11152b,
    0x17152d,
    0x0e1b2f,
    0x191020,
    0x101a25
];


function createBuilding(x, z) {

    const width =
        4 + Math.random() * 5;

    const depth =
        5 + Math.random() * 7;

    const height =
        7 + Math.random() * 25;


    const material =
        new THREE.MeshStandardMaterial({
            color:
                buildingColors[
                    Math.floor(
                        Math.random() *
                        buildingColors.length
                    )
                ],
            roughness: 0.85,
            metalness: 0.15
        });


    const building =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            material
        );


    building.position.set(
        x,
        height / 2 - 0.1,
        z
    );

    building.castShadow = true;
    building.receiveShadow = true;

    scene.add(building);


    /* Windows */

    const windowMaterial =
        new THREE.MeshBasicMaterial({
            color:
                Math.random() > 0.5
                    ? 0x00ffff
                    : 0xff2277
        });


    const rows =
        Math.floor(height / 2.2);

    const columns =
        Math.floor(width / 1.5);


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let column = 0;
            column < columns;
            column++
        ) {

            if (Math.random() > 0.45) {

                const window =
                    new THREE.Mesh(
                        new THREE.BoxGeometry(
                            0.45,
                            0.6,
                            0.04
                        ),
                        windowMaterial
                    );


                window.position.set(
                    x -
                    width / 2 +
                    0.8 +
                    column * 1.4,

                    1.5 +
                    row * 2.1,

                    z -
                    depth / 2 -
                    0.03
                );


                scene.add(window);

            }

        }

    }

}


/* Generate city */

for (
    let z = -15;
    z > -ROAD_LENGTH;
    z -= 20
) {

    createBuilding(
        -14 - Math.random() * 7,
        z
    );

    createBuilding(
        14 + Math.random() * 7,
        z
    );

}


/* =========================================================
   STREET LIGHTS
========================================================= */

function createStreetLight(x, z) {

    const group =
        new THREE.Group();


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.08,
                0.12,
                5,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x202532
            })
        );


    pole.position.y = 2.5;

    group.add(pole);


    const lamp =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.18,
                8,
                8
            ),
            new THREE.MeshBasicMaterial({
                color: 0x00ffff
            })
        );


    lamp.position.y = 5;

    group.add(lamp);


    const light =
        new THREE.PointLight(
            0x00ffff,
            4,
            18
        );


    light.position.y = 4.7;

    group.add(light);


    group.position.set(
        x,
        0,
        z
    );


    scene.add(group);

}


for (
    let z = -10;
    z > -ROAD_LENGTH;
    z -= 35
) {

    createStreetLight(-9.2, z);
    createStreetLight(9.2, z - 17);

}


/* =========================================================
   PLAYER CAR
========================================================= */

let playerCar;


function createPlayerCar(type) {

    const group =
        new THREE.Group();


    const data =
        carTypes[type];


    /* BODY */

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: data.color,
            metalness: 0.65,
            roughness: 0.25
        });


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                0.65,
                4.5
            ),
            bodyMaterial
        );


    body.position.y = 0.72;

    body.castShadow = true;

    group.add(body);


    /* HOOD */

    const hood =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.25,
                0.25,
                1.4
            ),
            bodyMaterial
        );


    hood.position.set(
        0,
        1.03,
        -1.2
    );

    hood.castShadow = true;

    group.add(hood);


    /* ROOF */

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x101522,
            metalness: 0.4,
            roughness: 0.2
        });


    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.8,
                0.65,
                1.8
            ),
            roofMaterial
        );


    roof.position.set(
        0,
        1.35,
        0.45
    );

    roof.castShadow = true;

    group.add(roof);


    /* WINDOWS */

    const glassMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x06121f,
            metalness: 0.4,
            roughness: 0.05,
            transparent: true,
            opacity: 0.85
        });


    const windshield =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.55,
                0.45,
                0.08
            ),
            glassMaterial
        );


    windshield.position.set(
        0,
        1.37,
        -0.48
    );

    windshield.rotation.x =
        -0.25;

    group.add(windshield);


    const rearWindow =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.55,
                0.45,
                0.08
            ),
            glassMaterial
        );


    rearWindow.position.set(
        0,
        1.37,
        1.35
    );

    rearWindow.rotation.x =
        0.25;

    group.add(rearWindow);


    /* WHEELS */

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.8
        });


    const rimMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x777777,
            metalness: 0.8,
            roughness: 0.2
        });


    const wheelPositions = [
        [-1.25, 0.45, -1.45],
        [1.25, 0.45, -1.45],
        [-1.25, 0.45, 1.45],
        [1.25, 0.45, 1.45]
    ];


    wheelPositions.forEach(
        position => {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.48,
                        0.48,
                        0.3,
                        16
                    ),
                    wheelMaterial
                );


            wheel.rotation.z =
                Math.PI / 2;


            wheel.position.set(
                ...position
            );


            wheel.castShadow = true;

            group.add(wheel);


            const rim =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.22,
                        0.22,
                        0.32,
                        12
                    ),
                    rimMaterial
                );


            rim.rotation.z =
                Math.PI / 2;


            rim.position.set(
                ...position
            );


            group.add(rim);

        }
    );


    /* HEADLIGHTS */

    const headlightMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });


    [-0.75, 0.75].forEach(
        x => {

            const light =
                new THREE.Mesh(
                    new THREE.SphereGeometry(
                        0.16,
                        10,
                        10
                    ),
                    headlightMaterial
                );


            light.position.set(
                x,
                0.92,
                -2.27
            );


            group.add(light);

        }
    );


    /* HEADLIGHT BEAMS */

    [-0.75, 0.75].forEach(
        x => {

            const spotlight =
                new THREE.SpotLight(
                    0xffffff,
                    4,
                    35,
                    Math.PI / 7,
                    0.5,
                    1
                );


            spotlight.position.set(
                x,
                1,
                -2
            );


            spotlight.target.position.set(
                x,
                0,
                -15
            );


            group.add(
                spotlight
            );

            group.add(
                spotlight.target
            );

        }
    );


    /* SPOILER */

    if (type !== 0) {

        const spoiler =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    2.0,
                    0.15,
                    0.35
                ),
                bodyMaterial
            );


        spoiler.position.set(
            0,
            1.35,
            2.05
        );

        group.add(spoiler);


        const support1 =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.12,
                    0.55,
                    0.12
                ),
                bodyMaterial
            );


        support1.position.set(
            -0.7,
            1.15,
            2.0
        );


        group.add(support1);


        const support2 =
            support1.clone();


        support2.position.x =
            0.7;

        group.add(support2);

    }


    /* NEON UNDERGLOW */

    const underGlow =
        new THREE.PointLight(
            data.accent,
            3,
            6
        );


    underGlow.position.y =
        0.15;

    group.add(underGlow);


    group.position.set(
        0,
        0,
        2
    );


    return group;

}


playerCar =
    createPlayerCar(selectedCar);

scene.add(playerCar);


/* =========================================================
   GAME VARIABLES
========================================================= */

let speed = 0;

let distance = 0;

let health =
    carTypes[selectedCar].health;

let nitro = 100;

let gameRunning = false;

let gamePaused = false;

let countdownRunning = false;

let crashCooldown = 0;

let cameraShake = 0;

let difficulty = 1;

let bestDistance =
    Number(
        localStorage.getItem(
            "neonRushBest"
        )
    ) || 0;


/* =========================================================
   CONTROLS
========================================================= */

const keys = {};

window.addEventListener(
    "keydown",
    event => {

        keys[event.code] = true;


        if (
            event.code === "Escape" &&
            gameRunning &&
            !countdownRunning
        ) {

            togglePause();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.code] = false;

    }
);


/* =========================================================
   AUDIO
========================================================= */

let audioContext;

let engineOscillator;

let engineGain;


function startAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    if (!engineOscillator) {

        engineOscillator =
            audioContext.createOscillator();

        engineGain =
            audioContext.createGain();


        engineOscillator.type =
            "sawtooth";


        engineOscillator.frequency.value =
            70;


        engineGain.gain.value =
            0.025;


        engineOscillator.connect(
            engineGain
        );


        engineGain.connect(
            audioContext.destination
        );


        engineOscillator.start();

    }

}


function playSound(
    frequency,
    duration,
    volume = 0.05,
    type = "square"
) {

    if (!audioContext)
        return;


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = type;

    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime +
        duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime +
        duration
    );

}


/* =========================================================
   TRAFFIC
========================================================= */

const traffic = [];

const trafficColors = [
    0xff2244,
    0x3366ff,
    0xffaa00,
    0xeeeeee,
    0x9933ff,
    0x00cc88
];


function createTrafficCar() {

    const color =
        trafficColors[
            Math.floor(
                Math.random() *
                trafficColors.length
            )
        ];


    const group =
        new THREE.Group();


    const material =
        new THREE.MeshStandardMaterial({
            color,
            metalness: 0.5,
            roughness: 0.35
        });


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.3,
                0.65,
                4.2
            ),
            material
        );


    body.position.y = 0.7;

    body.castShadow = true;

    group.add(body);


    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.7,
                0.65,
                1.8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x10131c,
                roughness: 0.2
            })
        );


    roof.position.set(
        0,
        1.2,
        0.35
    );

    group.add(roof);


    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x030303
        });


    [
        [-1.15, 0.4, -1.35],
        [1.15, 0.4, -1.35],
        [-1.15, 0.4, 1.35],
        [1.15, 0.4, 1.35]
    ].forEach(
        position => {

            const wheel =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.43,
                        0.43,
                        0.28,
                        12
                    ),
                    wheelMaterial
                );


            wheel.rotation.z =
                Math.PI / 2;


            wheel.position.set(
                ...position
            );


            group.add(wheel);

        }
    );


    const rearLights =
        new THREE.MeshBasicMaterial({
            color: 0xff0033
        });


    [-0.7, 0.7].forEach(
        x => {

            const light =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        0.35,
                        0.15,
                        0.05
                    ),
                    rearLights
                );


            light.position.set(
                x,
                0.85,
                2.12
            );


            group.add(light);

        }
    );


    const lane =
        Math.floor(
            Math.random() * 4
        );


    const lanePositions = [
        -6,
        -2,
        2,
        6
    ];


    group.position.set(
        lanePositions[lane],
        0,
        -150 -
        Math.random() * 250
    );


    group.userData.speed =
        20 +
        Math.random() * 30;


    group.userData.lane =
        lanePositions[lane];


    group.userData.hit = false;


    scene.add(group);

    traffic.push(group);

}


function spawnTraffic() {

    if (
        traffic.length <
        Math.min(
            10,
            4 +
            Math.floor(
                difficulty * 1.5
            )
        )
    ) {

        if (Math.random() < 0.025) {

            createTrafficCar();

        }

    }

}


/* =========================================================
   RAIN
========================================================= */

const rainCount = 1200;

const rainGeometry =
    new THREE.BufferGeometry();

const rainPositions =
    new Float32Array(
        rainCount * 3
    );


for (
    let i = 0;
    i < rainCount;
    i++
) {

    rainPositions[i * 3] =
        (Math.random() - 0.5) * 80;

    rainPositions[i * 3 + 1] =
        Math.random() * 45;

    rainPositions[i * 3 + 2] =
        -Math.random() * 500;

}


rainGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        rainPositions,
        3
    )
);


const rainMaterial =
    new THREE.PointsMaterial({
        color: 0x9edcff,
        size: 0.09,
        transparent: true,
        opacity: 0.6
    });


const rain =
    new THREE.Points(
        rainGeometry,
        rainMaterial
    );


scene.add(rain);


/* =========================================================
   SPEED LINES
========================================================= */

const speedLines = [];

const speedLineMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x66ddff,
        transparent: true,
        opacity: 0.5
    });


for (
    let i = 0;
    i < 70;
    i++
) {

    const line =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.025,
                0.025,
                2 +
                Math.random() * 4
            ),
            speedLineMaterial
        );


    line.position.set(
        (Math.random() - 0.5) * 35,
        Math.random() * 8,
        -Math.random() * 80
    );


    scene.add(line);

    speedLines.push(line);

}


/* =========================================================
   CRASH PARTICLES
========================================================= */

const crashParticles = [];


function createCrashEffect(position) {

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const particle =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.08,
                    0.08,
                    0.08
                ),
                new THREE.MeshBasicMaterial({
                    color:
                        Math.random() > 0.5
                            ? 0xffaa00
                            : 0xff2244
                })
            );


        particle.position.copy(
            position
        );


        particle.userData.velocity =
            new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                Math.random() * 8,
                (Math.random() - 0.5) * 8
            );


        particle.userData.life =
            1;


        scene.add(particle);

        crashParticles.push(
            particle
        );

    }

}


/* =========================================================
   COLLISION
========================================================= */

function checkCollisions() {

    if (crashCooldown > 0)
        return;


    for (
        let i = traffic.length - 1;
        i >= 0;
        i--
    ) {

        const enemy =
            traffic[i];


        const dx =
            Math.abs(
                enemy.position.x -
                playerCar.position.x
            );


        const dz =
            Math.abs(
                enemy.position.z -
                playerCar.position.z
            );


        if (
            dx < 2.0 &&
            dz < 3.0
        ) {

            health -= 25;

            crashCooldown = 1.2;

            cameraShake = 0.6;

            createCrashEffect(
                playerCar.position
            );


            playSound(
                80,
                0.4,
                0.12,
                "sawtooth"
            );


            enemy.position.z =
                -300;


            if (
                health <= 0
            ) {

                endGame();

            }

        }

    }

}


/* =========================================================
   NITRO
========================================================= */

function updateNitro(delta) {

    const usingNitro =
        (
            keys["Space"] ||
            keys["ShiftLeft"]
        ) &&
        nitro > 0 &&
        speed > 20;


    if (usingNitro) {

        nitro -=
            35 * delta;

        speed +=
            22 * delta;


        camera.fov +=
            (78 - camera.fov) *
            delta * 5;


        if (
            Math.random() < 0.3
        ) {

            createNitroParticle();

        }

    } else {

        nitro +=
            7 * delta;


        camera.fov +=
            (65 - camera.fov) *
            delta * 4;

    }


    nitro =
        THREE.MathUtils.clamp(
            nitro,
            0,
            100
        );


    nitroFill.style.width =
        nitro + "%";

}


function createNitroParticle() {

    const particle =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.08,
                6,
                6
            ),
            new THREE.MeshBasicMaterial({
                color:
                    Math.random() > 0.5
                        ? 0x00ffff
                        : 0xffaa00
            })
        );


    particle.position.copy(
        playerCar.position
    );


    particle.position.z +=
        2.2;


    particle.position.y +=
        0.3;


    particle.userData.life =
        0.5;


    particle.userData.velocity =
        new THREE.Vector3(
            (Math.random() - 0.5),
            Math.random() * 0.5,
            5 +
            Math.random() * 4
        );


    scene.add(particle);

    crashParticles.push(
        particle
    );

}


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer(delta) {

    const car =
        carTypes[selectedCar];


    const accelerating =
        keys["KeyW"] ||
        keys["ArrowUp"];


    const braking =
        keys["KeyS"] ||
        keys["ArrowDown"];


    if (accelerating) {

        speed +=
            car.acceleration *
            delta;

    } else {

        speed -=
            8 *
            delta;

    }


    if (braking) {

        speed -=
            32 *
            delta;

    }


    const nitroActive =
        (
            keys["Space"] ||
            keys["ShiftLeft"]
        ) &&
        nitro > 0;


    let maximum =
        car.maxSpeed;


    if (nitroActive) {

        maximum *= 1.38;

    }


    speed =
        THREE.MathUtils.clamp(
            speed,
            0,
            maximum
        );


    /* Steering */

    let steering = 0;


    if (
        keys["KeyA"] ||
        keys["ArrowLeft"]
    ) {

        steering -= 1;

    }


    if (
        keys["KeyD"] ||
        keys["ArrowRight"]
    ) {

        steering += 1;

    }


    playerCar.position.x +=
        steering *
        car.handling *
        delta *
        (
            0.35 +
            speed /
            car.maxSpeed
        );


    playerCar.position.x =
        THREE.MathUtils.clamp(
            playerCar.position.x,
            -6.7,
            6.7
        );


    /* Car tilt */

    playerCar.rotation.z +=
        (
            -steering *
            0.15 -
            playerCar.rotation.z
        ) *
        delta * 8;


    playerCar.rotation.y +=
        (
            -steering *
            0.08 -
            playerCar.rotation.y
        ) *
        delta * 8;


    /* Distance */

    distance +=
        speed *
        delta;


    /* Difficulty */

    difficulty =
        1 +
        distance / 500;


    /* Engine */

    if (engineOscillator) {

        engineOscillator.frequency.value =
            55 +
            speed * 3.2;

        engineGain.gain.value =
            gameRunning
                ? 0.02 +
                  speed /
                  5000
                : 0;

    }


    /* Camera */

    const targetCameraX =
        playerCar.position.x * 0.35;


    camera.position.x +=
        (
            targetCameraX -
            camera.position.x
        ) *
        delta * 4;


    camera.position.y +=
        (
            4.3 +
            speed / 100 -
            camera.position.y
        ) *
        delta * 3;


    camera.lookAt(
        playerCar.position.x * 0.15,
        0.8,
        -8
    );

}


/* =========================================================
   TRAFFIC MOVEMENT
========================================================= */

function updateTraffic(delta) {

    for (
        let i = traffic.length - 1;
        i >= 0;
        i--
    ) {

        const car =
            traffic[i];


        const relativeSpeed =
            speed -
            car.userData.speed;


        car.position.z +=
            relativeSpeed *
            delta;


        /* Small lane movement */

        car.position.x +=
            (
                car.userData.lane -
                car.position.x
            ) *
            delta *
            1.5;


        if (
            car.position.z >
            15
        ) {

            scene.remove(car);

            traffic.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   ROAD MOVEMENT EFFECT
========================================================= */

function updateRoad(delta) {

    const movement =
        speed *
        delta;


    laneMarkers.forEach(
        marker => {

            marker.position.z +=
                movement;


            if (
                marker.position.z >
                10
            ) {

                marker.position.z -=
                    ROAD_LENGTH;

            }

        }
    );


    speedLines.forEach(
        line => {

            line.position.z +=
                movement *
                2.2;


            if (
                line.position.z >
                8
            ) {

                line.position.z =
                    -100 -
                    Math.random() * 50;

            }

        }
    );

}


/* =========================================================
   RAIN UPDATE
========================================================= */

function updateRain(delta) {

    const positions =
        rain.geometry.attributes
            .position.array;


    const fallSpeed =
        35 +
        speed * 0.3;


    for (
        let i = 0;
        i < rainCount;
        i++
    ) {

        positions[i * 3 + 1] -=
            fallSpeed *
            delta;


        positions[i * 3 + 2] +=
            speed *
            delta;


        if (
            positions[i * 3 + 1] <
            0
        ) {

            positions[i * 3 + 1] =
                35;

        }


        if (
            positions[i * 3 + 2] >
            10
        ) {

            positions[i * 3 + 2] =
                -500;

        }

    }


    rain.geometry.attributes
        .position.needsUpdate = true;

}


/* =========================================================
   PARTICLE UPDATE
========================================================= */

function updateParticles(delta) {

    for (
        let i = crashParticles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            crashParticles[i];


        particle.userData.life -=
            delta;


        particle.position.addScaledVector(
            particle.userData.velocity,
            delta
        );


        particle.userData.velocity.y -=
            10 *
            delta;


        particle.scale.multiplyScalar(
            0.97
        );


        if (
            particle.userData.life <=
            0
        ) {

            scene.remove(
                particle
            );

            crashParticles.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   CAMERA SHAKE
========================================================= */

function updateCameraShake(delta) {

    if (
        cameraShake > 0
    ) {

        cameraShake -=
            delta;


        camera.position.x +=
            (
                Math.random() -
                0.5
            ) *
            cameraShake;


        camera.position.y +=
            (
                Math.random() -
                0.5
            ) *
            cameraShake;

    }

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    speedText.textContent =
        Math.round(
            speed * 2.1
        );


    distanceText.textContent =
        Math.floor(
            distance
        );


    if (
        nitroFill
    ) {

        nitroFill.style.width =
            nitro + "%";

    }

}


/* =========================================================
   COUNTDOWN
========================================================= */

function showCountdown() {

    countdownRunning = true;


    const countdown =
        document.createElement(
            "div"
        );


    countdown.id =
        "countdown";


    Object.assign(
        countdown.style,
        {
            position: "fixed",
            inset: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "1000",
            color: "#00ffff",
            fontSize: "90px",
            fontWeight: "900",
            fontFamily: "Arial, sans-serif",
            textShadow:
                "0 0 20px #00ffff, 0 0 50px #0088ff",
            pointerEvents: "none"
        }
    );


    document.body.appendChild(
        countdown
    );


    const numbers = [
        "3",
        "2",
        "1",
        "GO!"
    ];


    let index = 0;


    function nextNumber() {

        countdown.textContent =
            numbers[index];


        countdown.animate(
            [
                {
                    transform:
                        "scale(1.5)",
                    opacity: 0
                },
                {
                    transform:
                        "scale(1)",
                    opacity: 1
                }
            ],
            {
                duration: 700,
                easing: "ease-out"
            }
        );


        index++;


        if (
            index <
            numbers.length
        ) {

            setTimeout(
                nextNumber,
                850
            );

        } else {

            setTimeout(
                () => {

                    countdown.remove();

                    countdownRunning =
                        false;

                },
                750
            );

        }

    }


    nextNumber();

}


/* =========================================================
   PAUSE
========================================================= */

let pauseScreen;


function createPauseScreen() {

    pauseScreen =
        document.createElement(
            "div"
        );


    pauseScreen.id =
        "pause-screen";


    Object.assign(
        pauseScreen.style,
        {
            position: "fixed",
            inset: "0",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            zIndex: "999",
            background:
                "rgba(0,0,0,0.65)",
            backdropFilter:
                "blur(8px)",
            color: "white",
            fontFamily:
                "Arial, sans-serif"
        }
    );


    pauseScreen.innerHTML = `

        <h1 style="
            color:#00ffff;
            font-size:50px;
            letter-spacing:8px;
            text-shadow:0 0 20px #00ffff;
        ">
            PAUSED
        </h1>

        <p style="
            font-size:16px;
            letter-spacing:3px;
        ">
            PRESS ESC TO CONTINUE
        </p>

    `;


    document.body.appendChild(
        pauseScreen
    );

}


createPauseScreen();


function togglePause() {

    gamePaused =
        !gamePaused;


    pauseScreen.style.display =
        gamePaused
            ? "flex"
            : "none";

}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    startAudio();


    /* Remove previous car */

    if (playerCar) {

        scene.remove(
            playerCar
        );

    }


    /* Create selected car */

    playerCar =
        createPlayerCar(
            selectedCar
        );


    scene.add(
        playerCar
    );


    /* Reset */

    const car =
        carTypes[selectedCar];


    speed = 0;

    distance = 0;

    nitro = 100;

    health =
        car.health;

    difficulty = 1;

    crashCooldown = 0;

    cameraShake = 0;

    gamePaused = false;


    /* Remove traffic */

    traffic.forEach(
        car => scene.remove(car)
    );

    traffic.length = 0;


    /* Remove particles */

    crashParticles.forEach(
        particle =>
            scene.remove(particle)
    );

    crashParticles.length = 0;


    playerCar.position.set(
        0,
        0,
        2
    );


    gameRunning = true;


    startScreen.style.display =
        "none";


    gameOverScreen.style.display =
        "none";


    showCountdown();

}


/* =========================================================
   END GAME
========================================================= */

function endGame() {

    gameRunning = false;

    speed = 0;


    if (
        distance >
        bestDistance
    ) {

        bestDistance =
            Math.floor(distance);


        localStorage.setItem(
            "neonRushBest",
            bestDistance
        );

    }


    finalDistance.textContent =
        Math.floor(distance);


    gameOverScreen.style.display =
        "flex";


    playSound(
        55,
        0.8,
        0.15,
        "sawtooth"
    );

}


/* =========================================================
   BUTTONS
========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


const restartButton =
    document.getElementById(
        "restart-button"
    );


restartButton.addEventListener(
    "click",
    () => {

        startGame();

    }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

    }
);


/* =========================================================
   MAIN GAME LOOP
========================================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    if (
        gameRunning &&
        !gamePaused
    ) {

        updatePlayer(
            delta
        );


        updateNitro(
            delta
        );


        updateTraffic(
            delta
        );


        updateRoad(
            delta
        );


        updateRain(
            delta
        );


        updateParticles(
            delta
        );


        updateCameraShake(
            delta
        );


        spawnTraffic();


        checkCollisions();


        if (
            crashCooldown > 0
        ) {

            crashCooldown -=
                delta;

        }


        updateHUD();

    }


    renderer.render(
        scene,
        camera
    );

}


animate();