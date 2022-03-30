const Potion = require('../lib/Potion');
const Character = require('./Character');


class Player extends Character {
    constructor(name = ''){
    super(name);

    this.inventory = [new Potion ('health'), new Potion()];
}

//inherit prototype methods from Character here:
//Player.prototype = Object.create(Character.prototype);

getStats() {
    return {
        potions: this.inventory.length,
        health: this.health,
        strength: this.strength,
        agility: this.agility
    };
};

getInventory() {
    if(this.inventory.length) {
        return this.inventory;
    }
    return false;
};

addPotion() {
    this.inventory.push(Potion);
};

usePotion(index) {
    const potion = this.getInventory().splice(index, 1)[0];

    switch (potion.name) {
        case 'agility':
            this.agility += potion.value;
            break;
        case 'health':
            this.health += potion.value;
            break;
        case 'strength':
            this.strength += potion.value;
            break;
    }
    }
};

module.exports = Player;