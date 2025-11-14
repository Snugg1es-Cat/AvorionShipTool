// universal block type to hold stats
class block {
    constructor(name, cost$, costM, health, weight, procPower, reqEnergy, other, otherType) {
        this.name = name;
        this.cost$ = cost$;
        this.costM = costM;
        this.health = health;
        this.weight = weight;
        this.procPower = procPower;
        this.reqEnergy = reqEnergy;
        // other is used for unique block elements
        // eg power generators generated power
        // or cargo holds storage capicity
        this.other = other;
        this.otherType = otherType;
    }
}

// universal material type to hold an array of blocks
class material {
    constructor(blankHull, smartHull, armor, engine, cargoBay, crewQuarters, thruster, directionalThruster, gyroArray, inertialDampner, framework, scaffold, hangar, dock, turretRotationLock, flightRecorder, assembly, torpedoLauncher, torpedoStorage, turretBase, shieldGenerator, energyContainer, Generator, integrityFieldGenerator, computerCore, hyperspaceCore, transporter, academy, cloningPods, solarPanel, light, glow, glass, reflector, stone, hologram, richStone, superRichStone, shipName, shipEmblem, hullAPA, hullVC, hullWSA) {
        this.blankHull = blankHull;
        this.smartHull = smartHull;
        this.armor = armor;
        this.engine = engine; 
        this.cargoBay = cargoBay; 
        this.crewQuarters = crewQuarters; 
        this.thruster = thruster; 
        this.directionalThruster = directionalThruster; 
        this.gyroArray = gyroArray; 
        this.inertialDampner = inertialDampner; 
        this.framework = framework; 
        this.scaffold = scaffold; 
        this.hangar = hangar; 
        this.dock = dock; 
        this.turretRotationLock = turretRotationLock; 
        this.flightRecorder = flightRecorder; 
        this.assembly = assembly; 
        this.torpedoLauncher = torpedoLauncher; 
        this.torpedoStorage = torpedoStorage; 
        this.turretBase = turretBase; 
        this.shieldGenerator = shieldGenerator; 
        this.energyContainer = energyContainer; 
        this.Generator = Generator; 
        this.integrityFieldGenerator = integrityFieldGenerator; 
        this.computerCore = computerCore; 
        this.hyperspaceCore = hyperspaceCore; 
        this.transporter = transporter; 
        this.academy = academy; 
        this.cloningPods = cloningPods; 
        this.solarPanel = solarPanel; 
        this.light = light; 
        this.glow = glow; 
        this.glass = glass; 
        this.reflector = reflector; 
        this.stone = stone; 
        this.hologram = hologram; 
        this.richStone = richStone; 
        this.superRichStone = superRichStone; 
        this.shipName = shipName; 
        this.shipEmblem = shipEmblem; 
        // APA = Alternate Pattern A
        this.hullAPA = hullAPA; 
        // VC = Vivid Colors
        this.hullVC = hullVC; 
        // WSA = White Stripes A
        this.hullWSA = hullWSA;
    }

}
