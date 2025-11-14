//handles the calculation for ship stats
class shipCalculator {
    constructor (buildingKnowledge) {
        this.buildingKnowledge = buildingKnowledge;

        // set default PPLimit
        this.setPPLimitToBK()

        //selects block palette 
        this.selectBlockPalette(false)
    }

    changeBuildingKnowledge(newBK) {
        this.buildingKnowledge = newBK;
    }

    // currently doesnt have palettes to pull from
    // could make custom palettes too
    // will be similar to material class in blockStats
    //light will find the most weight effcient per blocks unique output
    //pp efficient will select the material with highest unique output

    //selects the palette of blocks to calculate stats with based on the Building Knowledge Level
    selectBlockPalette(lightWeight) {
        //light weight determines if the palette should focus on weight efficiency or processing power efficiency
        //true = weigh efficient
        //false = processing power efficiency
        if (lightWeight) {
            if (this.buildingKnowledge = "Iron") {this.palette = ironPaletteLight}
            else if (this.buildingKnowledge = "Titanium") {this.palette = titaniumPaletteLight}
            else if (this.buildingKnowledge = "Naonite") {this.palette = naonitePaletteLight}
            else if (this.buildingKnowledge = "Trinium") {this.palette = triniumPaletteLight}
            else if (this.buildingKnowledge = "Xanion") {this.palette = xanionPaletteLight}
            else if (this.buildingKnowledge = "Ogonite") {this.palette = ogonitePaletteLight}
            else if (this.buildingKnowledge = "Avorion") {this.palette = avorionPaletteLight}
        }
        else {
            if (this.buildingKnowledge = "Iron") {this.palette = ironPalette}
            else if (this.buildingKnowledge = "Titanium") {this.palette = titaniumPalette}
            else if (this.buildingKnowledge = "Naonite") {this.palette = naonitePalette}
            else if (this.buildingKnowledge = "Trinium") {this.palette = triniumPalette}
            else if (this.buildingKnowledge = "Xanion") {this.palette = xanionPalette}
            else if (this.buildingKnowledge = "Ogonite") {this.palette = ogonitePalette}
            else if (this.buildingKnowledge = "Avorion") {this.palette = avorionPalette}
        }
    }

    
    //sets the PPLimit based on building Knowledge level
    setPPLimitToBK() {
        if (this.buildingKnowledge = "Iron") {this.PPLimit = 128}
        else if (this.buildingKnowledge = "Titanium") {this.PPLimit = 800}
        else if (this.buildingKnowledge = "Naonite") {this.PPLimit = 2000}
        else if (this.buildingKnowledge = "Trinium") {this.PPLimit = 5000}
        else if (this.buildingKnowledge = "Xanion") {this.PPLimit = 12500}
        else if (this.buildingKnowledge = "Ogonite") {this.PPLimit = 31250}
        else if (this.buildingKnowledge = "Avorion") {this.PPLimit = 78125}
    }

    //manually insert PPLimit
    changePPLimit(newLimit) {
        this.PPLimit = newLimit;
    }
}