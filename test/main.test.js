import { setBrowserVariable, getBrowserVariable } from '../src/functions';
import { Character, Enemy } from '../src/character';
import { Combat } from '../src/battle';

describe('Character', function () {


  it('gets a variable from the browser', function () {
    setBrowserVariable("name", "Sir knight");
    expect("Sir knight").toEqual(getBrowserVariable("name"));
    setBrowserVariable("name", "");
    //Test content will go here.
  });

  it('creates a character', function () {
    let knight = new Character({
      created: Date.now(),
      name: "Sir Knight",
      class: "Knight",
      race: "Human",
      strength: 15,
      vitality: 12
    });
    expect(knight.name).toEqual("Sir Knight");
    expect(knight.class).toEqual("Knight");
    expect(knight.race).toEqual("Human");
    expect(knight.strength).toEqual(15);
    expect(knight.vitality).toEqual(12);
    expect(knight.intelligence).toEqual(10);
    expect(knight.dexterity).toEqual(10);
    expect(knight.wisdom).toEqual(10);
  });
});

describe('Combat', function () {
  let knight;
  let enemy1, enemy2, enemy3, jaredsStupidMagazineEater;

  beforeEach(function() {
    knight = new Character({
      name: "Sir Knight",
      class: "Knight",
      race: "Human",
      allegiance: "Honor",
      strength: 15,
      vitality: 12
    });
    enemy1 = new Enemy({
      name: "Creature1",
      vitality: 5,
      strength: 2,
      dexterity: 8,
      allegiance: "Monster"
    });
    enemy2 = new Enemy({
      name: "Creature2",
      vitality: 20,
      strength: 20,
      dexterity: 20,
      allegiance: "Monster"
    });
    enemy3 = new Enemy({
      name:"Tom BombAhill"
    });
    jaredsStupidMagazineEater = new Enemy({
      name: "Durr The Mag Muncher",
      vitality: 1,
      level: 5,
      strength: -3,
      dexterity: 0.5
    });

  });

  it('create combat', function () {
    let combat = new Combat([knight, enemy1, enemy2]);
    expect(combat.combattants[0].name).toEqual("Sir Knight");
    expect(combat.combattants[1].name).toEqual("Creature1");
    expect(combat.combattants[2].name).toEqual("Creature2");
  });


  it('combat turn', function () {
    let combat = new Combat([knight, enemy1, enemy2]);
    expect(combat.turnOrder[0].name).toEqual("Creature2");
    expect(combat.turnOrder[1].name).toEqual("Sir Knight");
    expect(combat.turnOrder[2].name).toEqual("Creature1");
    expect(combat.getCurrentTurn().name).toEqual("Creature2");
    combat.advanceTurn();
    expect(combat.getCurrentTurn().name).toEqual("Sir Knight");
    combat.advanceTurn();
    expect(combat.getCurrentTurn().name).toEqual("Creature1");
  });

  it('combat attack', function () {
    let combat = new Combat([knight, enemy1, enemy2]);
    let enemyHpBefore = knight.healthCurrent; 
    combat.Attack("Sir Knight");
    let enemyHpAfter = knight.healthCurrent;
    expect(enemyHpAfter).toEqual(enemyHpBefore - enemy2.getAttackStrength());
  });

  it('you got knocked da fk out', function() {
    let combat = new Combat([knight, enemy1, enemy2]);
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    expect(knight.status).toEqual("Unconscious");
  });

  it('killed sir knight', function() {
    let combat = new Combat([knight, enemy1, enemy2]);
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    expect(knight.status).toEqual("Dead");
  });

  it('skipped dead sir knight', function() {
    let combat = new Combat([knight, enemy1, enemy2]);
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.advanceTurn();
    expect(combat.getCurrentTurn().name).toEqual("Creature1");
  });

  it('will give xp after a kill', function() {
    let combat = new Combat([knight, enemy1, enemy2]);
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    expect(enemy2.xp).toEqual(3);
  });

  it('will level up', function() {
    let combat = new Combat([knight, jaredsStupidMagazineEater]);
    combat.Attack("Durr The Mag Muncher");
    combat.Attack("Durr The Mag Muncher");
    expect(knight.level).toEqual(3);
  });

  // it('Will end Comabat', function() {
  //   let combat = new Combat([knight, jaredsStupidMagazineEater]);
  //   combat.Attack("Durr The Mag Muncher");
  //   combat.Attack("Durr The Mag Muncher");
  //   expect(jaredsStupidMagazineEater.status).toEqual("Dead");
  //   expect(combat.status).toEqual("Finished");
  // })
  // get xp amount = 1/4 of same level enemy

  it('Will end combat 1X1', function() {
    let combat = new Combat([knight, jaredsStupidMagazineEater]);
    combat.Attack("Durr The Mag Muncher");
    combat.Attack("Durr The Mag Muncher");    
    expect(combat.status).toEqual("Finished");
  })

  it('Will end combat 1X2', function() {
    let combat = new Combat([enemy2, knight, enemy1]);
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    combat.Attack("Sir Knight");
    expect(combat.status).toEqual("Finished");
  })
});