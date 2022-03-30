const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');


function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function() {
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    this.currentEnemy = this.enemies[0];

    inquirer
      .prompt({
          type: 'text',
          name: 'name',
          message: 'what is your name?'
      })
      //destructure name from the prompt object
      .then(({ name }) => {
          this.player = new Player(name);

          this.startNewBattle();
      });

};

Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('your stats are as follows:');
    console.table(this.player.getStats());

    console.log(this.currentEnemy.getDescription());

    this.battle();
};

//battle() method:
//if Player turn: 
    //prompt user to attack or use a Potion
    //if using a Potion:
        //display a list of Potion objects to user
        //apply selected Potion effect to Player
    //if attacking: 
        //subtract health from the Enemy based on Player attack value
//if Enemy turn:
    //subtract health from the Player based on Enemy attack value

Game.prototype.battle = function() {
    if (this.isPlayerTurn) {
        inquirer
          .prompt({
              type: 'list',
              message: 'what would you like to do?',
              name: 'action',
              choices: ['attack', 'use potion']
          })
          .then(({ action }) => {
              if (action === 'use potion') {
                  if (!this.player.getInventory()) {
                      console.log("you don't have any potions!");
                      return this.checkEndOfBattle();
                  }
                  inquirer
                    .prompt({
                        type: 'list',
                        message: 'which potion would you like to use?',
                        name: 'action',
                        choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                    })
                    .then(({ action }) => {
                        const potionDetails = action.split(': ');

                        this.player.usePotion(potionDetails[0] - 1);
                        console.log(`you used a ${potionDetails[1]} potion.`);

                        this.checkEndOfBattle();
                    });
              } else {
                  const damage = this.player.getAttackValue();
                  this.currentEnemy.reduceHealth(damage);

                  console.log(`you attacked the ${this.currentEnemy.name}`);
                  console.log(this.currentEnemy.getHealth());

                  this.checkEndOfBattle();
              }
          });
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`you were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
};

Game.prototype.checkEndOfBattle = function() {
    if(this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`you've defeated the ${this.currentEnemy.name}!`);

        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion!`);

        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log('you win!');
        }
    } else {
        console.log('you lose!');
    }
};

module.exports = Game;