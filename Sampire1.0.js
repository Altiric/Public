const color = {
  label: '0x008E',
  value: '0x0037',
  black: '0x0000',
  green:  { light: '0x0046', norm: '0x0044', dark: '0x00A7' },
  blue:   { light: '0x0064', norm: '0x0062', dark: '0x00C5' },
  red:    { light: '0x0028', norm: '0x0026', dark: '0x0089' },
  occ:    { light: '0x002D', norm: '0x002B', dark: '0x008E' },
  purple: { light: '0x001E', norm: '0x0017', dark: '0x007A' },
  yellow: { light: '0x0037', norm: '0x0035', dark: '0x0098' },
  white:  { light: '0x7FA',  norm: '0x7EE',  dark: '0x7E2' }
};

function Autostart(){
    Orion.ClearJournal();
    Orion.ClientViewRange(24);

    while(Orion.Connected()){
        //Open paperdoll and save config every 5 minutes (to keep mobTypes updated)
        if(!Orion.TimerExists('antiIdle') || Orion.Timer('antiIdle') > 300000){
            Orion.SetTimer('antiIdle');
            Orion.OpenPaperdoll(Player.Serial());
            Orion.SaveConfig();
        }

        //Don't take any actions while dead
        if(Player.Dead()){
            while(Player.Dead())
                Orion.Wait(500);
            Orion.Wait(3000);
            //Equip gear set when alive
            Orion.Dress('sampire');
        }
        
        //Scan all local mobs, and add to mobTypes if not found
        var mobList = Orion.GetFindList('mobTypes').Items().map(function(mob){ return mob.Graphic() });
        loadMobs().filter(function(mob){
            return mobList.indexOf(mob.Graphic()) === -1;
        }).forEach(function(mob){
            if(mob.Name())
                Orion.AddFindList('mobTypes', mob.Graphic(), 'any', mob.Name() +'|false|false');
            
        });

        Orion.Wait(500);
    }
}

function loadMobs(dist){
    var noto = Player.Notoriety() === 6 ? 'innocent|criminal|enemy|murderer' : 'innocent|gray|criminal|enemy|murderer';
    dist = dist ? dist : Orion.OAOptionGet('MaxTargetDistance');
    var mobs = Orion.FindTypeEx(any, any, ground, 'mobile|live|ignoreself|ignorefriends', dist, noto);
    return mobs || false;
}

function honor(mob){
    if(Orion.HaveTarget())
        Orion.CancelTarget();
    Orion.CancelWaitTarget();
    Orion.AddHighlightCharacter(mob.Serial(), color.green.norm, false);
    if(mob.Distance() < 8 && mob.Hits("%") === 100){
        Orion.InvokeVirtue('Honor');
        if(Orion.WaitForTarget())
            Orion.TargetObject(mob.Serial());
        Orion.Wait(100);
        if(Orion.HaveTarget())
            Orion.CancelTarget();
    }
}

function attack(){
    var mobs = loadMobs() // Load mobs to array
        .filter(function(m){ return m.InLOS() }) // Filter out of sight mobs
        .filter(function(m){ return !m.IsHuman() }) // Filter Humans
        .sort(function(a, b){ // Sort targets by distance, then health
            if(a.Distance() !== b.Distance())
                return a.Distance() - b.Distance();
            return a.Hits() - b.Hits();
        });
    var mob = mobs.shift(); // Select focused mob, or select weakest, closest mob from array
    if(!mob) return; // No mobs, leave function
    var primary = Orion.AbilityStatus('Primary');
    var secondary = Orion.AbilityStatus('Secondary');
    honor(mob); // Honor target

    var tags = loadTags(mob.Graphic())[0];
    if(tags)
        equipSlayer(tags.slayer);
    var combatStart = Orion.Now(); // Set combat timer
    Orion.Attack(mob.Serial()); // Attack mobile
    Orion.SetTimer('loadLocals');
    var inRange = 1;
    var mobType = mob.Graphic();
    var mastery = loadMastery();

    while(mob.Exists() && Player.WarMode()){ // While the mob is alive and player is in warmode
        inRange = loadMobs(1).length; // Load mobs in combat range to array
        var combatTime = Orion.Now() - combatStart; // determine length of combat so far
        var chivalry = Orion.SkillValue('Chivalry') > 500;
        if(mob.Distance() > 1 && combatTime > 3000) // If mob is out of range
            Orion.WalkTo(mob.X(), mob.Y(), mob.Z(), 1, 255, 1); // Get in range

        checkStance(); 

        if(inRange === 1 && !Orion.SpellStatus('onslaught') &&
            mastery.match(/Swordsmanship/gi) &&
            Player.Mana() > 20 && 
            Orion.ObjAtLayer('LeftHand').Graphic() != 0x26BD &&
            (!Orion.TimerExists('onslaught') || Orion.Timer('onslaught') > 6000)){
                Orion.SetTimer('onslaught');
                cast('onslaught'); // Use Onslaught!
        } else if(inRange === 2 && !Orion.SpellStatus('Momentum Strike')){
            cast('Momentum Strike'); // If 2 mobs are in range
        } else if(inRange > 2 && !primary && !secondary && !Orion.BuffExists('Momentum Strike')){
            if(!ability('Whirlwind Attack')) // If 3 or more are in range
                cast('Momentum Strike');
        } else if(!Orion.AbilityStatus('Primary') && 
                  !Orion.SpellStatus('Onslaught') && 
                  Player.Mana() > 30){
                        Orion.UseAbility('Primary');
                        Orion.Wait(750);
        }
        Orion.Attack(mob.Serial());
        Orion.Wait(50);
    }

    addKillCount(mobType); // Increase mobs kill count
    Orion.RemoveTimer('onslaught'); // Reset the onslaught timer
}

function loadMastery(){
    var book = Orion.FindTypeEx(0x225A, 0x0000, backpack)[0];
    return book.Properties().match(/(.*)\sMastery/gi)[0];
}

function checkStance(){
    if(Orion.SkillValue('Bushido') < 500) return;
    if(!Orion.BuffExists('Confidence') && !Orion.BuffExists('Evasion') && !Orion.BuffExists('Counter Attack') && Player.Mana() > 15){
        if(Player.Hits("%") < 30)
            cast('Evasion'); // Use evasion for ciritical health
        else if(Player.Hits("%") < 70)
            cast('Confidence'); // Use confidenc for a boost
        else
            cast('Counter Attack'); // Counter attack
    }
}

function addKillCount(type){
    var list = Orion.GetFindList('mobTypes');
    var items = list.Items();
    var object = items.filter(function(item){
        return item.Graphic() == type;
    }).forEach(function(item){
        var count = item.Count();
        count++;
        item.SetCount(count);
    });
    Orion.UpdateFindList(list);
}

function equipSlayer(graphic){
    var tags = loadTags(graphic);
    if(!tags.slayer) return;
    var weapon = Orion.FindTypeEx('0x0F4B', any, backpack).filter(function(weap){
        return Orion.Contains(weap.Properties(), tags.slayer +" Slayer");
    })[0];
    if(!weapon) return;
    Orion.SetTimer('weaponSwap');
    Orion.Print(color.purple.norm, tags.slayer +" slayer equipped");
    Orion.Wait('moveitemdelay');
    Orion.Equip(weapon.Serial());
}

function loadTags(graphic){
    var tags = Orion.GetFindList('mobTypes').Items()
        .filter(function(type){
            return type.Graphic() == graphic;
        }).map(function(tag){
            var comments = tag.Comment().split('|');
            return {
                name    : comments[0] ? comments[0].toString() : "missing",
                slayer  : comments[1] ? comments[1].toString() : false,
                ignore  : comments[2] ? Boolean(comments[1]) : false
            }
    });
    return tags || false;
}

