// universal block type to hold stats
class block {
    constructor(name, cost$, costM, health, weight, procPower, reqEnergy, other, otherType, reqMechanic, reqEngineer) {
        this.name = name;
        this.cost$ = Number(cost$);
        this.costM = Number(costM);
        this.health = Number(health);
        this.weight = Number(weight);
        this.procPower = Number(procPower);
        this.reqEnergy = Number(reqEnergy);
        // other is used for unique block elements
        // eg power generators generated power
        // or cargo holds storage capicity
        this.other = Number(other);
        this.otherType = otherType;
    
        //required crew per block
        this.reqCrewMechanic = Number(reqMechanic);
        this.reqCrewEngineer = Number(reqEngineer);
    }
}

// universal material type to hold an array of blocks
class material {
    constructor(blankHull, smartHull, armor, engine, cargoBay, crewQuarters, thruster, directionalThruster, gyroArray, inertialDampner, framework, scaffold, hangar, dock, turretRotationLock, flightRecorder, assembly, torpedoLauncher, torpedoStorage, turretBase, shieldGenerator, energyContainer, generator, integrityFieldGenerator, computerCore, hyperspaceCore, transporter, academy, cloningPods, solarPanel, light, glow, glass, reflector, stone, hologram, richStone, superRichStone, shipName, shipEmblem, hullAPA, hullVC, hullWSA) {
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
        this.generator = generator; 
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

// class containing array of all material types
class allBlocks {
    constructor(filePath) {
       // this.loadFromCSV(filePath);
    }

    //loadFromCSV(filePath) {
        //todo
        
    //}

    //takes csv data turning it into useable data
    convertCSVIntoData(csvDataString) {
        //splits css string an array of arrays
        let blocks = csvDataString.split('\n').map(line => line.split(','));
        //list of every block
        let allBlocks = [];
        blocks.forEach(element => {
            allBlocks.push( 
                new block(
                    element[0],
                    element[1],
                    element[2],
                    element[3],
                    element[4],
                    element[5],
                    element[6],
                    element[7],
                    element[8],
                    element[9],
                    element[10]
                ) 
            )
        });

        //sorting blocks into materials
        //allBlocks.slice(0,42) cuts the array into a smaller chunk to be fed into the new material
        //... spreads the new smaller array across all needed inputs
        
       //iron
        this.iron = new material (...allBlocks.slice(0,43));

        //titanium
        this.titanium = new material (...allBlocks.slice(43,86));
        
        //naonite
        this.naonite = new material(...allBlocks.slice(86,129));
        
        //trinium
        this.trinium = new material(...allBlocks.slice(129,172));
        
        //xanion
        this.xanion = new material(...allBlocks.slice(172,215));
        
        //ogonite
        this.ogonite = new material(...allBlocks.slice(215,258));
        
        //avorion
        this.avorion = new material(...allBlocks.slice(258,301));
    }
}


//exporting
export default allBlocks;