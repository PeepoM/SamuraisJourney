class BlockManager {
    constructor(level) {
        this.initBlockManager(level);
        this.loadLevelTilesetName();
    }

    initBlockManager(level) {
        this.LEVEL = Object.assign({}, level);
        this.LEVEL_LAYERS = [...this.LEVEL.layers];

        this.COLLISION_BLOCKS = this.getParticularLayerType(this.LEVEL_LAYERS, "collision");
        this.DRAWABLE_BLOCKS = this.getParticularLayerType(this.LEVEL_LAYERS, "drawable");

        this.TRIGGER_BLOCKS = this.setUpLayerBlocks(this.LEVEL_LAYERS, "triggers");
        this.MOBS = this.setUpLayerBlocks(this.LEVEL_LAYERS, "mobs");

        this.LEVEL_TILESET;

        this.LEVEL_W = this.LEVEL.width * this.LEVEL.tilewidth;
        this.LEVEL_H = this.LEVEL.height * this.LEVEL.tileheight;
    }

    setUpLayerBlocks(allLayers, layerPurpose) {
        let tB = [...this.getParticularLayerType(allLayers, layerPurpose)];
        let fakeTB = [];

        tB.forEach(trigger => {
            let tObj = Object.assign({}, trigger);
            if (tObj.properties !== undefined) {
                tObj.properties.forEach(property => {
                    tObj[property.name] = property.value;
                });
            }
            fakeTB.push(tObj);
        });

        return fakeTB;
    }

    getParticularLayerType(allLayers, layerPurpose) {
        let allLayersOfAParticularType = [];

        allLayers.forEach(layer => {
            layer.properties.forEach(property => {
                if (property.value == layerPurpose) {
                    if (layerPurpose == "drawable") {
                        let layerBlocks = [...layer.data];
                        let levelW = this.LEVEL.width;
                        let tempArray = [];

                        while (layerBlocks.length) tempArray.push(layerBlocks.splice(0, levelW));

                        allLayersOfAParticularType.push(tempArray);
                    } else if (layerPurpose == "collision" || layerPurpose == "triggers" || layerPurpose == "mobs")
                        allLayersOfAParticularType = layer.objects;
                }
            });
        });

        return allLayersOfAParticularType;
    }

    loadLevelTilesetName() {
        let levelTiles = this.LEVEL.tilesets;
        levelTiles.forEach(tiles => {
            let extensionIndex = tiles.source.search(".json");
            this.LEVEL_TILESET = tiles.source.slice(0, extensionIndex);
        });
    }
}