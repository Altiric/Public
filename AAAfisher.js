/*
    TODO:
    -Improve sailing/collison avoidance
    -Add Land/Dungeon fishing
    -Add lobster fishing functions to gump
*/
const settings = {
    script      : "Altiric's Amazing Angler",
    version     : "0.3",
    subkey      : 'Software\\OrionAssistant\\vars\\Fisher\\'+Player.Serial(),
    
    menu    : {
        serial  : 10000,
        bkground: 0x13EC,
        width   : 355,
        height  : 250,
    },
};
    
const color   = {
    label   : '0x008E',  // Change this to update gump colors!
    value   : '0x0037',  // Change this to update gump colors!

    black   : '0x0000',
    green   : {
        light: '0x0046', 
        norm: '0x0044', 
        dark: '0x00A7'
    },
    blue    : {
        light: '0x0064', 
        norm: '0x0062', 
        dark: '0x00C5'
    },
    red     : {
        light: '0x0028', 
        norm: '0x0026', 
        dark: '0x0089'
    },
    occ  : {
        light: '0x002D', 
        norm: '0x002B', 
        dark: '0x008E'
    },
    purple  : {
        light: '0x001E', 
        norm: '0x0017', 
        dark: '0x007A'
    },
    yellow  : {
        light: '0x0037', 
        norm: '0x0035', 
        dark: '0x0098'
    },
    white   : {
        light: '0x7FA',  
        norm: '0x7EE',  
        dark: '0x7E2' 
    }
};
    
const items = {
    "fishpole"	: '0x0DBF',
    "mib"		: '0xA30C',
    "eatfish"	: '0x0DD6',
    "gate"		: '0x0DDB',
    "boots"		: '0x170F|0x1710|0x170E|0x170D|0x170C|0x170B|0x1711|0x1712',
    "goat"		: '0x00D1',
    "pearls"	: '0x3196',
    "scales"	: '0x08A0',
    "nets"		: '0x0DCA',
    "cutfish"	: '0x09CC|0x09CF|0x09CE|0x09CD',
    "knife"		: '0x13F6',
    "atlas"		: '0x9C16',
    "arrows"    : '0x0F3F',
    "gold"      : '0x0EED',
    "hides"     : '0x1078',
    "leather"   : '0x1081',
    "emptyTrap" : '0x44CF',
    "scissors"  : '0x0F9E',
};

const fish = [
    {name: 'Amberjack', 			id: '0x44C6', cut: true, waters: "deep"},
    {name: 'Black seabass', 		id: '0x09CE', cut: true, waters: "deep"},
    {name: 'Blue Grouper', 			id: '0x4306', cut: true, waters: "deep"},
    {name: 'Bluefish', 				id: '0x09CC', cut: true, waters: "deep"},
    {name: 'Bluegill Sunfish', 		id: '0x4306', cut: true, waters: "shore"},
    {name: 'Bonefish', 				id: '0x44C3', cut: true, waters: "deep"},
    {name: 'Bonito', 				id: '0x4303', cut: true, waters: "deep"},
    {name: 'Brook Trout', 			id: '0x09CC', cut: true, waters: "shore"},
    {name: 'Cape Cod', 				id: '0x4306', cut: true, waters: "deep"},
    {name: 'Captain Snook', 		id: '0x44C5', cut: true, waters: "deep"},
    {name: 'Cobia', 				id: '0x4303', cut: true, waters: "deep"},
    {name: 'Crag Snapper', 			waters: "dungeon"},
    {name: 'Cutthroat Trout', 		waters: "dungeon"},
    {name: 'Darkfish', 				waters: "dungeon"},
    {name: 'Demon Trout', 			waters: "dungeon"},
    {name: 'Drake Fish', 			waters: "dungeon"},
    {name: 'Dungeon Chub', 			waters: "dungeon"},
    {name: 'Gray snapper', 			id: '0x4302', cut: true, waters: "deep"},
    {name: 'Green Catfish', 		id: '0x44C6', cut: true, waters: "shore"},
    {name: 'Grim Cisco', 			waters: "dungeon"},
    {name: 'Haddock', 				id: '0x09CC', cut: true, waters: "deep"},
    {name: 'Infernal Tuna', 		waters: "dungeon"},
    {name: 'Kokanee Salmon', 		id: '0x4303', waters: "shore"},
    {name: 'Lurker Fish', 			waters: "dungeon"},
    {name: 'Mahi-Mahi', 			id: '0x44C5', cut: true, waters: "deep"},    
    {name: "Orc Bass", 				waters: "dungeon"},
    {name: "Pike", 					id: '0x44C4', cut: true, waters: 'shore'},
    {name: "Pumpkinseed Sunfish",	id: '0x4307', cut: true, waters: "shore"},
    {name: "Rainbow Trout", 		id: '0x4302', cut: true, waters: "shore"},
    {name: "Red Drum", 				id: '0x4302', cut: true, waters: "deep"},
    {name: "Red Grouper", 			id: '0x4307', cut: true, waters: "deep"},
    {name: "Red snook", 			id: '0x09CD', cut: true, waters: "deep"},
    {name: "Redbelly bream", 		id: '0x4307', cut: true, waters: "shore"},
    {name: "Shad", 					id: '0x4302', waters: "deep"},
    {name: "Smallmouth bass", 		id: '0x09CD', cut: true, waters: "deep"},
    {name: "Snaggletooth bass", 	waters: "dungeon"},
    {name: "Tarpon", 				id: '0x44C3', cut: true, waters: "deep"},
    {name: "Tormented Pike", 		waters: "deep"},
    {name: "Uncommon Shiner", 		id: '0x09CE', cut: true, waters: "shore"},
    {name: "Walleye", 				id: '0x09CF', cut: true, waters: "shore"},
    {name: "Yellow Perch", 			id: '0x4303', cut: true, waters: "shore"},
    {name: "Yellowfin Tuna", 		id: '0x44C4', cut: true, waters: "deep"},
    // Rare Fish
    {name: "A Big Fish",            id: '0x09CC', color: '0x0847|0x058C', cut: true, bigFish: true},
    {name: "Autumn Dragonfish",     waters: "Ilshhenar"},
    {name: "Bull Fish",             waters: "Labyrinth"},
    {name: "Crystal Fish",          waters: "Prism of Light"},
    {name: "Fairy Salmon",          waters: "Ter Mur"},
    {name: "Fire Fish",             waters: "Shame"},
    {name: "Giant Koi",             id: '0x44C5|0x44C6', color: '0x04E9', cut: true, bigFish: true, waters: "Tokuno Deep"},
    {name: "Great Barracuda",       id: '0x44C4', color: '0x0A13', cut: true, bigFish: true, waters: "deep"},
    {name: "Holy Mackerel",         waters: "Gravewater Lake"},
    {name: "Lava Fish",             waters: "Stygian Abyss"},
    {name: "Reaper Fish",           waters: "Doom"},
    {name: "Summer Dragonfish",     waters: "Destard"},
    {name: "Unicorn Fish",          waters: "Twisted Weald"},
    {name: "Yellowtail Barracuda",  waters: "Tram Deep"},
    // Legendary Fish
    {name: "Abyssal Dragonfish",    waters: "Destard"},
    {name: "Black Marlin",          waters: "Felicca Deep"},
    {name: "Blue Marlin",           waters: "Tram Deep"},
    {name: "Dungeon Pike",          waters: "Terathan Keep"},
    {name: "Giant Samurai Fish",    waters: "Tokuno Deep"},
    {name: "Golden Tuna",           waters: "Tokuno Deep"},
    {name: "Kingfish",              id: '0x0A2C', color: '0x0A2C', cut: true, waters: "deep"},
    {name: "Lantern Fish",          waters: "Prism of Light"},
    {name: "Rainbow Fish",          waters: "Twisted Weald"},
    {name: "Seeker Fish",           waters: "Labyrinth"},
    {name: "Spring Dragonfish",     waters: "Ilshenar"},
    {name: "Stone Fish",            waters: "LostLand/Tram"},
    {name: "Winter Dragonfish",     waters: "Ice Dungeon"},
    {name: "Zonbie Fish",           waters: "Gravewater Lake"}

];

const crustations = [
    // Common Lobster
    {name: 'Crusty Lobster',      id: 0x44D3},
    {name: 'Fred Lobster',        id: 0x44D4},
    {name: 'Hummer Lobster',      id: 0x44D3},
    {name: 'Rock Lobster',        id: 0x44D4},
    {name: 'Shovel-Nose Lobster', id: 0x44D4},
    {name: 'Spiney Lobster',      id: 0x44D3},
    // Rare Lobster
    {name: 'Blue Lobstr',         id: 0},
    //Legendary Lobster
    {name: 'Blood Lobster',       id: 0},
    {name: 'Dread Lobster',       id: 0},
    {name: 'Void Lobster',        id: 0},
    // Common Crab
    {name: 'Apple Crab',          id: 0x44D2},
    {name: 'Blue Crab',           id: 0x44D2},
    {name: 'Dungeoness Crab',     id: 0x44D1},
    {name: 'King Crab',           id: 0x44D1},
    {name: 'Rock Crab',           id: 0x44D2},
    {name: 'Snow Crab',           id: 0x44D1},
    // Rare Crab
    {name: 'Stone Crab',          id: 0},
    {name: 'Spider Crab',         id: 0},
    // Legendary Crab
    {name: 'Tunnel Crab',         id: 0},
    {name: 'Void Crab',           id: 0}
];

const zones = [
    // City
    ["Despise", 5566, 645, 5594, 621],
];

function findZone(){
    var zone = Shared.GetVar('zone');
    zones.forEach(function(area){
        if(Player.X() > area[1] && Player.Y() > area[4])
            if(Player.X() < area[3] && Player.Y() < area[2])
                if(area[0] != city){
                    Shared.AddVar('zone', area[0]);
                    Orion.Print("Entered: " +area[0]);
                 }
    });
    Orion.Wait(500);
}

function Autostart(){
    Orion.ResetSearchArea();
    Shared.ClearArrays();
    display();
    save('auto', false);
    save('boat', false);
    setStatus("Ready...");
    while(Orion.Connected()){
        if(Player.Dead())
            correct('dead');

        if(load('boat')){
            fishArea();
            if(load('boat')){
                var sx = Player.X(), sy = Player.Y();
                Orion.Say("Forward");
                Orion.SetTimer('sailing');
                while(Orion.GetDistance(sx, sy) < 16){
                    if(Orion.Timer('sailing') > 10000)
                        break;
                    Orion.Wait(100);
                }
                Orion.Say("Stop");
                Orion.Wait(1000);
            }
        }   

        if(load('crab')){
            crabFishing();
        }

        Orion.Wait(250);
    }
}

/**********************************************
 *  GUI/Gump Functions
 **********************************************/

function display(page){
    const menu = Orion.CreateCustomGump(settings.menu.serial);
    menu.Clear();
    menu.SetCallback('process');
    menu.SetNoClose(true);
    menu.SetX(10);
    menu.SetY(50);
    menu.AddResizepic(0, 0, settings.menu.bkground, settings.menu.width, settings.menu.height); //gumpBg
    menu.AddResizepic(20, 10, 0x1400, 250, 20); // logoBg
    menu.AddText(55, 8, color.yellow.norm, "<h3><basefont size=18>" +settings.script +"</H3>", 500, 10001);                
    menu.AddResizepic((settings.menu.width-250), (settings.menu.height-15), 0x254E, 260, 25); //statusBg
    menu.AddText((settings.menu.width-230), (settings.menu.height-12), color.yellow.norm, "Loading...", 250, 10017);
    menu.AddButton(11000, settings.menu.width-55, 5, 0x138C, 0x138C, 0x138D, 0x0000);
    menu.AddTooltip("Minimize");
    menu.AddButton(11002, settings.menu.width-30, 5, 0x13BC, 0x13BC, 0x13BD, 0x0000);
    menu.AddTooltip("Close/Quit");
    menu.AddButton(11003, 10, -17, 0x138E, 0x138F, 0x138E, 0x0000);
    menu.AddTooltip("Land/Dungeon Fishing Page");
    menu.AddText(25, -18, color.label, "<small>Land/Dungeon</small>", 200, 10006);
    menu.AddButton(11004, 93, -17, 0x138E, 0x138F, 0x138E, 0x0000);
    menu.AddTooltip("Boat Fishing Page");
    menu.AddText(115, -18, color.label, "<small>Deep Sea</small>", 200, 10007);
    menu.AddButton(11005, 176, -17, 0x138E, 0x138F, 0x138E, 0x0000);
    menu.AddTooltip("Lobster Fishing");
    menu.AddText(200, -18, color.label, "<small>Lobster</small>", 200, 10008);
    menu.AddButton(11006, 259, -17, 0x138E, 0x138E, 0x138E, 0x0000);
    menu.AddTooltip("SoS Fishing");
    menu.AddText(285, -18, color.label, "<small>SoS/MiB</small>", 200, 10009);
    menu.AddButton(11001, settings.menu.width-25, settings.menu.height-13, 0x82E, 0x82F, 0x82E, 0x0000, 0, 1);
    menu.AddTooltip("Settings");
    menu.AddText((settings.menu.width-230), (settings.menu.height-12), color.yellow.norm, Shared.GetVar('msg'), 250, 10017);

    if(page)
        menu.SetPage(page);

    menu.AddPage(1);
        menu.AddText(25, 50, color.label, "Rune Book:");
        menu.AddButton(13103, 125, 55, 0x939, 0x939, 0x939, 0x0000);
        menu.AddTooltip("Set Travel Book");
        var book = Orion.FindObject(load('book'));
        menu.AddText(140, 50, color.value,  book ? book.Name() : "Missing", 300, 13001);   

        menu.AddText(25, 70, color.label, "Travel Method:");
        menu.AddComboBox(13100, 125, 70, '0xBB8', 0, '0xBB8', 185, 0);
        menu.AddComboBoxText("None/Pause when full", color.black, load('method') == 1 ? 1: 0);
        menu.AddComboBoxText("Recall", color.black, load('method')  == 1 ? 1 : 0);
        menu.AddComboBoxText("Sacred Journey", color.black, load('method') == 2 ? 1 : 0);
        menu.AddComboBoxText("Gate Travel", color.black, load('method') == 3 ? 1 : 0);

        menu.AddText(25, 90, color.label, "Secure Rune:");
        menu.AddComboBox(13101, 125, 90, '0xBB8', 0, '0xBB8', 50, 0);
        for(i=1;i<17;i++)
            menu.AddComboBoxText(i, color.black, load('srune') == i ? 1 : 0);

        menu.AddText(25, 110, color.label, "Boat Rune:");
        menu.AddComboBox(13102, 125, 110, '0xBB8', 0, '0xBB8', 50, 0);
        for(i=1;i<17;i++)
            menu.AddComboBoxText(i, color.black, load('brune') == i ? 1 : 0);

        menu.AddText(25, 130, color.label, "Tillerman/Pilot:");
        menu.AddButton(13104, 125, 135, 0x939, 0x939, 0x939, 0x0000);
        menu.AddTooltip("Set Tillerman/Pilot");
        var tiller = Orion.FindObject(load('tiller'));
        menu.AddText(140, 130, color.value, tiller ? tiller.Name() : "Missing", 300, 13006);

        menu.AddText(25, 150, color.label, "Secure:");
        menu.AddButton(13110, 125, 155, 0x939, 0x939, 0x939, 0x0000);
        menu.AddTooltip("Set Secure, press escape for Bank");
        menu.AddText(140, 150, color.value, load('secureID').length ? load('secureID') : "Not set", 300, 13007);

        menu.AddButton(13107, 125, 175, 0x84A, 0x84B, 0x84C, 0x0000);
        menu.Update();
        
    menu.AddPage(2);
        menu.AddResizepic(20, 33, 0x1400, 100, 15);
        menu.AddText(25, 30, color.label, "Land Fishing", 300, 12000);
        menu.Update();
        
    menu.AddPage(3);
        menu.AddResizepic(20, 33, 0x1400, 100, 15);
        menu.AddText(25, 30, color.label, "Boat Fishing", 300, 13000);
        
        var skill = [
            {name: 1044091, value: Orion.SkillValue('Archery')},
            {name: 1044100, value: Orion.SkillValue('Swordsmanship')},
            {name: 1044102, value: Orion.SkillValue('Fencing')},
            {name: 1044101, value: Orion.SkillValue('Mace Fighting')},
            {name: 1044085, value: Orion.SkillValue('Magery')}
        ].sort(function(a, b){
            return b.value - a.value;
        }).shift();

        save('weapon', Orion.GetCliLocString(skill.name));
        menu.AddResizepic(20, 50, 0x1400, 160, 150);
        menu.AddText(35, 55, color.label, "Kill Method:");
        menu.AddText(110, 55, color.value, Orion.GetCliLocString(skill.name), 300, 13108);
        if(skill == Orion.GetCliLocString(1044091))
            menu.AddText(175, 55, color.value, "(Arrows: {item:0x0F3F})", 13111);

        menu.AddText(35, 70, color.label, "Serpents:");
        menu.AddText(110, 70, color.value, load('serpents'), 300, 13113);

        menu.AddText(35, 85, color.label, "MiBs:");
        menu.AddText(110, 85, color.value, load('mibs'), 300, 13109);

        menu.AddText(35, 100, color.label, "Pearls:");
        menu.AddText(110, 100, color.value, load('pearl'), 300, 13110);

        menu.AddText(35, 115, color.label, "Nets:");
        menu.AddText(110, 115, color.value, load('nets'), 300, 13111);

        menu.AddText(35, 130, color.label, "Color Nets:");
        menu.AddText(110, 130, color.value, load('cnets'), 300, 13112);

        menu.AddResizepic(190, 50, 0x1400, 150, 170);
        menu.AddButton(11010, 200, 55, load('useHold') ? 0x9CF : 0x9CE, 0x9CF, 0x9CE, 0x0000);
        menu.AddText(215, 55, color.value, "Use Cargo Hold");
        menu.AddButton(11011, 200, 70, load('cutFish') ? 0x9CF : 0x9CE, 0x9CF, 0x9CE, 0x0000);
        menu.AddText(215, 70, color.value, "Cut All Fish");
        menu.AddButton(11012, 200, 85, load('lootNets') ? 0x9CF : 0x9CE, 0x9CF, 0x9CE, 0x0000);
        menu.AddText(215, 85, color.value, "Loot Nets");
        menu.AddButton(11013, 200, 100, load('lootCNet') ? 0x9CF : 0x9CE, 0x9CF, 0x9CE, 0x0000);
        menu.AddText(215, 100, color.value, "Loot Colored Net");
        menu.AddButton(11014, 200, 115, load('lootScale') ? 0x9CF : 0x9CE, 0x9CF, 0x9CE, 0x0000);
        menu.AddText(215, 115, color.value, "Loot Scales");
        menu.AddButton(11015, 200, 130, load('lootGold') ? 0x9CF : 0x9CE, 0x9CF, 0x9CE, 0x0000);
        menu.AddText(215, 130, color.value, "Loot Gold");
        menu.AddButton(11016, 200, 145, load('lootHides') ? 0x9CF : 0x9CE, 0x9CF, 0x9CE, 0x0000);
        menu.AddText(215, 145, color.value, "Loot Hides");
        menu.AddButton(11017, 200, 160, load('cutBigFish') ? 0x9CF : 0x9CE, 0x9CF, 0x9CE, 0x0000);
        menu.AddText(215, 160, color.value, "Cut Big Fish");

        menu.AddButton(13105, 40, 205, 0x83F, 0x841, 0x840, 0x0000)
        menu.AddTooltip("Begin Fishing");
        menu.AddButton(13106, 100, 205, 0x842, 0x844, 0x843, 0x0000);
        menu.AddTooltip("Stop Fishing");
        menu.Update();
        
    menu.AddPage(4);
        menu.AddResizepic(20, 33, 0x1400, 100, 15);
        menu.AddText(25, 30, color.label, "crab Fishing", 300, 14000);
        menu.AddTilePic(settings.menu.width-85, 35, 0x14EE, 0x0000);

        menu.Update();
        
    menu.AddPage(5);
        menu.AddResizepic(20, 33, 0x1400, 100, 15);
        menu.AddText(25, 30, color.label, "SoS/MiBs", 300, 15000);
        menu.Update();
}

function process(_hidden){
    const menu = Orion.CreateCustomGump(settings.menu.serial);
    var button = CustomGumpResponse.ReturnCode(), toggle;
    //Shared.AddVar('gx', menu.X());
    //Shared.AddVar('gy', menu.Y());

    switch(button){
        case 11002:
            menu.Close();
        break;
        case 11001:
            menu.SetPage(1);
            Shared.AddVar('page', 1);
            menu.Update();
        break;
        case 11003:
            menu.SetPage(2);
            Shared.AddVar('page', 2);
            menu.Update();
        break;
        case 11004:
            menu.SetPage(3);
            Shared.AddVar('page', 3);
            menu.Update();
        break;
        case 11005:
            menu.SetPage(4);
            Shared.AddVar('page', 4);
            menu.Update();
        break;
        case 11006:
            menu.SetPage(5);
            Shared.AddVar('page', 5);
            menu.Update();
        break;
        case 11010:
            toggle = !load('useHold');
            save('useHold', toggle);
            display(3);
        break;
        case 11011:
            toggle = !load('cutFish');
            save('cutFish', toggle);
            display(3);
        break;
        case 11012:
            toggle = !load('lootNets');
            save('lootNets', toggle);
            display(3);
        break;
        case 11013:
            toggle = !load('lootCNet');
            save('lootCNet', toggle);
            display(3);
        break;
        case 11014:
            toggle = !load('lootScale');
            save('lootScale', toggle);
            display(3);
        break;
        case 11015:
            toggle = !load('lootGold');
            save('lootGold', toggle);
            display(3);
        break;
        case 11016:
            toggle = !load('lootHides');
            save('lootHides', toggle);
            display(3);
        break;
        case 11017:
            toggle = !load('cutBigFish');
            save('cutBigFish', toggle);
            display(3);
        break;
        case 13103:
            Orion.CharPrint(self, color.yellow.norm, "Select your Rune Book");
            Orion.WaitForAddObject('target');
            var object = Orion.FindObject('target');
            Orion.RemoveObject('target');
            save('book', object.Serial());
            display(1);
        break;

        case 13104:
            Orion.CharPrint(self, color.yellow.norm, "Select your Pilot/Tillerman");
            Orion.WaitForAddObject('tiller');
            var tiller = Orion.FindObject('tiller');
            save('tiller', tiller.Serial());
            display(1);
            Orion.RemoveObject('tiller');
        break;

        case 13105: // Start boat fishing
            Orion.ResumeScript('Autostart');
            if(!Orion.ScriptRunning('Autostart'))
                Orion.ToggleScript('Autostart', true);
            save('boat', true);
        break;

        case 13106: // Stop Automation
            save('auto', false);
            menu.AddText(55, 8, color.yellow.norm, "<h3><basefont size=18>" +settings.script +"</H3>", 500, 10001);
            menu.Update();
            setStatus("Fishing Stopped...");
        break;

        case 13107: // Save settings
            save('method', CustomGumpResponse.ComboBox(13100));
            save('srune', CustomGumpResponse.ComboBox(13101)+1);
            save('brune', CustomGumpResponse.ComboBox(13102)+1);
            display(Shared.GetVar('page'));
        break;

        case 13108: // crab Fishing
            if(!Orion.ScriptRunning('Autostart'))
                Orion.Exec('Autostart', true);
            save('auto', 'crab');
            crabFishing();
        break;

        case 13109: // Stop Automation
            save('boat', false);
            setStatus("Stopped Fishing...");
        break;

        case 13110: // Set Secure
            Orion.CharPrint(self, color.value, "Select Secure, cencel for Bank");
            Orion.WaitForAddObject('setSecure');
            var addSec = Orion.FindObject('setSecure');
            Orion.RemoveObject('setSecure');
            if(!addSec)
                var sec = Player.BankSerial();
            else
                var sec = addSec.Serial();
            save('secureID', sec);
            display(1);
        break;
        default:
            return;            
    }
}

function setStatus(msg){
    Shared.AddVar('msg', msg);
    display(Shared.GetVar('page'));
}
    
/**********************************************
 *  Boat Functions
 **********************************************/

function fishArea(){
    for(x=-4;x<8;x+=8){
        for(y=-4;y<8;y+=8){
            fishSpot(Player.X()+x, Player.Y()+y);
        }
    }
}

function fishSpot(x, y, relative){
	Orion.ClearJournal();
    do {
        var tiller = Orion.FindObject(load('tiller'));
        if(!tiller || !tiller.Exists())
            travel(load('book'), load('method'), load('brune'));
    } while(!tiller);
    
    var tiller = Orion.FindObject(load('tiller'));
	setStatus("Fishing Area");
    var string = Orion.GetCliLocString(503168) +'|' +
                 Orion.GetCliLocString(503169) +'|' +
                 Orion.GetCliLocString(500976) +'|' +
                 Orion.GetCliLocString(500977) +'|' +
                 Orion.GetCliLocString(500778) +'|' +
                 Orion.GetCliLocString(500979) +'|' +
                 "You pull up a heavy chest";
	while(!Orion.InJournal(string)){//} && load('auto') == 'boat'){
        if(load('weapon') == 'mage' && !Orion.BuffExists('Protection'))
            cast('Protection');

        var serp = Orion.FindType(0x0096, any, ground, 'mobile', 10)[0];
        if(serp){
            addCount('serpents');
            menu.AddText(110, 70, color.value, load('serpents'), 300, 13113);
            attack(serp);
        }

        // Start Fishing
		if(!Orion.DisplayTimerExists('fishing') && !serp){
			if(Orion.ObjAtLayer('Mount')){
				Orion.UseObject('self');
				Orion.Wait('useitemdelay');
			}
			feedGoat();
			checkWeight();
            if(setRod()){
				Orion.AddDisplayTimer('fishing', 8000, 'UnderChar', 'Line|Bar', 'Fishing', 0, 0, 'any', -1, '0x0000FFFE');
                Orion.WaitForTarget();
                Orion.TargetTile('water', x, y, Player.Z());
            } else {
                var hold = openHold();
                var poles = Orion.FindTypeEx(items["fishpole"], any, hold.Serial()).shift();
                if(poles){
                    Orion.MoveItem(poles.Serial(), 0, backpack);
                    Orion.Wait('moveitemdelay');
                } else
                    correct("pole");
            }
        }

        if(load('cutBigFish')){
            var cutFish = fish.filter(function(f){
                return f.bigFish === true;
            }).forEach(function(f){
                var cutFish = Orion.FindType(f.id, f.color, backpack).shift();
                if(cutFish && cutFish.length){
                    Orion.UseType(items['knife']);
                    Orion.WaitTargetObject(cutFish);
                    Orion.Wait('useitemdelay');
                }
            });
            if(cutFish && cutFish.length)
                Orion.Print("Cut: " +cutFish.length);
        }

        if(Orion.Count(items['hides']) > 0 && Orion.Count(items['scissors']) > 0){
            Orion.UseType(items['scissors']);
            Orion.WaitTargetType(items['hides'], any, backpack);
            Orion.Wait('useitemdelay');
        }
		
        // Loot any corpses
		var corpse = Orion.FindTypeEx(0x2006, any, ground, 'item', 10)[0];
		if(corpse){
            setStatus("Looting");
			var sx = Player.X(), sy = Player.Y();
            //if(!walkTo(corpse.X(), corpse.Y(), 2))
                //sailTo(corpse.X(), corpse.Y(), 2);
            if(load('lootHides')){
                Orion.Wait('useitemdelay');
                Orion.WaitTargetObject(corpse.Serial());
                Orion.UseType(items["knife"]);
                Orion.Wait('useitemdelay');
            }

			Orion.UseObject(corpse.Serial());
			Orion.WaitForContainerGump();
            var corp = Orion.GetLastGump();
			Orion.Wait('useitemdelay');
            Orion.CheckLag();

			Orion.FindTypeEx(any, any, 'lastcontainer').forEach(function(obj){
                if(obj.Graphic() == items['mib']){
                    Orion.MoveItem(obj.Serial(), 0, backpack);
                    addCount('mibs');
                    Orion.Wait('moveitemdelay');
                } else if(obj.Graphic() == items['nets']){
                    if(load('lootNets') || (load('lootCNet') && obj.Color() != '0x08A0')){
                        if(obj.Color() == '0x08A0'){
                            addCount('nets');
                        } else if(load('lootCNet') == 'true'){
                            addCount('cnets');
                        }
                        menu.Update();
                        Orion.MoveItem(obj.Serial(), 0, backpack);
                        Orion.Wait('moveitemdelay');
                    }
                } else if(obj.Graphic() == items['gold'] && load('lootGold')){
                    Orion.MoveItem(obj.Serial(), 0, backpack);
                    Orion.Wait('moveitemdelay');
                } else if(obj.Graphic() == items['hides'] && load('lootHides')){
                    addCount('hides', obj.Count());
                    Orion.MoveItem(obj.Serial(), 0, backpack);
                    Orion.Wait('moveitemdelay');
                } else if(obj.Graphic() == items["scales"] && load('lootScales')){
                    addCount('scales');
                    Orion.MoveItem(obj.Serial(), 0, backpack);
                    Orion.Wait('moveitemdelay');
                }
                Orion.Wait('moveitemdelay');
                corp.Close();
            });
            Orion.Wait('moveitemdelay');
            Orion.FindTypeEx(items['boots'], any, backpack).forEach(function(boot){
                Orion.MoveItem(boot.Serial(), 0, 'lastcontainer');
                Orion.Wait('moveitemdelay');
            });
			Orion.Ignore(corpse.Serial());
            setStatus("Fishing");
		}

		if(Orion.Count(items['eatfish']) > 0){
			Orion.UseType(items['eatfish']);
			Orion.Wait('useitemdelay');
		}

        // Journal Scans
		if(Orion.InJournal(Orion.GetCliLocString(1072597))){
			Orion.ClearJournal(Orion.GetCliLocString(1072597));
			addCount('pearl');
		}
        var istring = Orion.GetCliLocString(1008124);
        istring = istring.split(':')[0];
		if(Orion.InJournal(istring)){
            var found = false;
			var item = Orion.LastJournalMessage().Text().split(': ')[1];
            for(i in fish){
                if(fish[i].name.toLowerCase() == item)
                    found = true;
            }   
            if(found)
                addCount(item);
			Orion.ClearJournal(istring);
			Orion.RemoveDisplayTimer('fishing');
		}
		Orion.Wait(500);
	}
}

/**********************************************
 *  crab Fishing
 **********************************************/
function getTraps(qty){
    setStatus("Grabbing traps from Hold");
    var sx = Player.X(), sy = Player.Y();
    var hold = openHold();
    var available = Orion.FindTypeEx(0x44CF, 0x0000, hold.Serial())[0];
    if(!available || available.Count() < qty)
        correct("traps");

    Orion.MoveItem(available.Serial(), qty, backpack);
    Orion.Wait('moveitemdelay');
    walkTo(sx, sy);
}

function crabFishing(){
    var pilot = Orion.FindObject(load('tiller'));
    if(!pilot)
        correct('ship');

    while(pilot.Direction() != 4){
        Orion.Say("Turn Right");
        Orion.Wait(1000);
        Orion.CheckLag();
    }

    if(Orion.Count(0x44CF, any, backpack) < 10)
        getTraps(10);

    placeTraps();
    setStatus("Watching for bobs...");

    while(true){
        if(Player.Weight("%") > 85)
            emptyToHold();
        
        if(Orion.Count(0x44CF, any, backpack) < 3)
            getTraps(5);
        
        //checkFullTraps();
        cleanTraps();
        //checkLostTraps();
        Orion.Wait(500);
    }
}

function checkFullTraps(){
    Shared.GetArray('locations').forEach(function(trap){
        walkTo(trap.x, trap.y, 3, 5000);
        Orion.UseObject(trap.id);
        Orion.Wait('useitemdelay');
        setBouy(trap.x, trap.y);
    })

}

function showBobs(){
    var bobs = Shared.GetArray('locations');
    for(i in bobs){
        if(bobs[i].empty == false)
            Orion.Print(JSON.stringify(bobs[i]));
    }
}

function cleanTraps(){
    Orion.FindTypeEx('0x44D0', 'any', 'backpack').forEach(function(fullTrap){
        Orion.UseObject(fullTrap.Serial());
        Orion.Wait('useitemdelay');
        Orion.MoveItem(fullTrap.Serial(), 0, backpack);
        Orion.Wait('moveitemdelay');
    });
}

function logBobs(){
    while(true){//load('auto') == 'crab'){
        Orion.FindTypeEx('0x44CB', 'any', 'ground', 'item', 12).forEach(function(bouy){
            var logged = Shared.GetArray('locations');
            for(i in logged){
                if(logged[i].id == bouy.Serial()){
                    logged[i].empty = false;
                    logged.filter(function(log){
                        return Orion.FindObject(log.id);
                    });
                    Shared.AddArray('locations', logged);
                    //display(4);
                }
            }
        });
        Orion.Wait(500);
    }
}

function placeTraps(){
    var pilot = Orion.FindObject(load('tiller'));
    if(!pilot)
        correct("ship");

    Orion.Exec('logBobs', true);
    walkTo(pilot.X()+1, pilot.Y()+2, 0, 10000);

    setStatus("Finding front of boat");
    while(Orion.CanWalk(4, Player.X(), Player.Y()+2, Player.Z()))
        walkTo(Player.X(), Player.Y()+1);

    setStatus("Placing Traps");
    setBouy(Player.X()+3, Player.Y()+3);
    setBouy(Player.X()+3, Player.Y()+1);
    setBouy(Player.X()+3, Player.Y()-3);
    while(Orion.CanWalk(0, Player.X(), Player.Y()-1, Player.Z())){
        Orion.Step(0);
        setBouy(Player.X()+3, Player.Y()-3);
    }
    walkTo(Player.X()-2, Player.Y());
    setBouy(Player.X()-3, Player.Y()-3);
    setBouy(Player.X()-3, Player.Y()-1);
    setBouy(Player.X()-3, Player.Y()+1);
    setBouy(Player.X()-3, Player.Y()+3);
    while(Orion.CanWalk(4, Player.X(), Player.Y()+1, Player.Z())){
        Orion.Step(4);
        setBouy(Player.X()-3, Player.Y()+3);
    }
    setStatus("Waiting for bobs...");
}

function checkBouy(x, y){
    Orion.SetSearchArea(x-1, y-1, x+1, y+1);
    var bouy = Orion.FindTypeEx('0x44CC|0x44CB', 0x0000, ground);
    Orion.ResetSearchArea();
    if(bouy && bouy.length)
        return bouy[0];
    return false;
}

function setBouy(x, y){
    var coords = Shared.GetArray('locations');
    var cnt = coords.length;

    if(checkBouy(x, y))
        return false;

    if(Orion.Count(0x44CF, any, backpack) < 1)
        getTraps(5);

    walkTo(x, y, 3, 10000);
    
    if(Orion.UseType(0x44CF, any, backpack)){
        Orion.WaitTargetTile('any', x, y, Player.Z());
        Orion.Wait(2000);
    } else
        return;
    if(Orion.HaveTarget()){
        Orion.CancelTarget();
        return false;
    }
    
    var bouy = checkBouy(x, y);
    if(!Orion.Contains(coords, bouy.Serial()))
        coords.push({id: bouy.Serial(), x: x, y: y, empty: false});
    
    coords.filter(function(coord){
        return Orion.FindObject(coord.id);
    });

    Shared.AddArray('locations', coords);
    menu.AddText(115, 70, color.value, coords.length, 75, 14001);
    menu.Update();
}

function cleanupBouy(){
    setStatus("Cleaning up traps");
    Orion.FindTypeEx('0x44CC|0x44CB', any, ground, 'item', 16).sort(function(a, b){
        return a.Distance() - b.Distance();
    }).forEach(function(bouy){
        walkTo(bouy.X(), bouy.Y(), 3);
        Orion.UseObject(bouy.Serial());
        Orion.Wait('useitemdelay');
    });
    cleanTraps();
    setStatus("All clear");
}

/**********************************************
 *  General Functions
 **********************************************/
function attack(target){
    Orion.CancelWaitTarget();
    if(Orion.HaveTarget())
        Orion.CancelTarget();
    if(!target)
        target = Orion.FindObject(Orion.ClientLastAttack());
    else
        target = Orion.FindObject(target);

    if(!target)
        return;

    setStatus("Fighting: " +target.Name());
    if(load('weapon') == Orion.GetCliLocString(1044085)){
        while(target.Exists()){
            var eval = Orion.SkillValue('Evaluating Intelligence');
            if(eval < 600)
                cast('Mind Blast', target.Serial());
            else if(Orion.SkillValue('Magery') < 800)
                cast('Lightning', target.Serial());
            else
                cast('Energy Bolt', target.Serial());
            if(Player.Poisoned())
                cast('Cure', self);
            else if(Player.Hits("%") < 90)
                cast('Greater Heal', self);
            Orion.Wait(250);
        }
    } else {
        var weapon = Orion.FindTypeEx(any, any, backpack).filter(function(weap){
            return Orion.Contains(weap.Properties(), 'Skill Required: ' +load('weapon'));
        })[0];
        if(!weapon)
            correct("weapon");
        if(load("weapon") == "Archery" && Orion.Count(items['arrows']) < 10)
            correct("arrows");

        Orion.Equip(weapon.Serial());
        Orion.Wait('moveitemdelay');
        if(Orion.SkillValue('Bushido') > 0 && target.Hits("%") == 100){
            Orion.WaitTargetObject(target.Serial());
            Orion.InvokeVirtue('Honor');
            Orion.Wait(100);
        }
        Orion.Attack(target.Serial());
        while(target.Exists()){
            if(target.Distance() > range){
                if(!walkTo(target.Z(), target.Y(), range)){
                    sailTo(target.X(), target.Y(), range);
                }
            }
            Orion.Wait(500);
        }
        if(Player.WarMode())
            Orion.WarMode(0);
    }
}

function correct(item){
    if(item == 'dead'){
        setStatus("Uhh, you died...");
    }
    if(item == 'weapon'){
        setStatus("Can not find " +load("weapon") +" type weapon in pack");
    }
    if(item == 'arrows'){
        setStatus("Need more arrows");
        var hold = openHold();
        if(useHold){
            if(Orion.MoveItemType(items["arrows"], hold.Serial(), 1, backpack)){
                Orion.Wait('moveitemdelay');
                return;
            }
        }
    }
    if(item == 'pole'){
        setStatus("Out of fishing poles");
    }
    if(item == 'knife'){
        setStatus("Need a knife or cutting tool");
        var hold = openHold();
        if(useHold){
            if(Orion.MoveItemType(items["knife"], hold.Serial(), 1, backpack)){
                Orion.Wait('moveitemdelay');
                return;
            }
        }
    }
    if(item == 'ship'){
        setStatus("Could not locate ship");
    }
    if(item == 'traps'){
        setStatus("Out of Lobster Traps");
    }
    if(item == 'fullhold'){
        setStatus("Cargo Hold is Full");
    }
    if(item == 'weight'){
        setStatus("Max Weight Reached");
    }
    Orion.PauseScript();
}

function travel(book, method, rune, attempts){
    attempts = attempts > 0 ? attempts : 5;
    var sx = Player.X(), sy = Player.Y(), runs = 0;
    while(Player.X() == sx && Player.Y() == sy && runs < attempts){
        runs++;
        Orion.CancelWaitTarget();
        if(Orion.HaveTarget())
            Orion.CancelTarget();
        
        Orion.Wait('useitemdelay');
        Orion.UseObject(book);
        Orion.WaitForGump(5000);
        var rbook = Orion.GetLastGump();
        if(method == 1 || method.match(/recall/i)){
            var hook = 29+Number(rune);
            setStatus("Recalling");
        } else if(method == 2 || method.match(/sacred journey/ig)){
            var hook = 74+Number(rune);
            setStatus("Sacred Journey");
        } else if(method == 3 || mathod.match(/gate travel/ig)){
            var hook = 99+Number(rune);
            setStatus("Gate Travel");
        }
        rbook.Select(Orion.CreateGumpHook(hook));
        Orion.Wait(2000);
        if(method == 3){
            Orion.WaitTargetType('0x0DDB|0x0F6C', any, ground, 'item', 2);
            Orion.Wait(1000);
            Orion.SetTimer('travel');
            while(Player.X() == sx && Player.Y() == sy && Orion.Timer('travel') < 6000){
                Orion.UseFromGround('0x0DDB|0x0F6C', any, 2, 'item');
                Orion.Wait(2000);
            }
        }
        Orion.Wait(3000);
        Orion.CheckLag();
    }
    if(Player.X() == sx && Player.Y() == sy)
        return false;
    return true;
}

function discordPost(msg){
    var key = getKey();
    if(key){
        param = "content=" + Player.Name() +': ' +msg +'\n' +JSON.stringify(jack, 0, 2);
        Orion.HttpPost(urlHook, param);
        return;
    }
    return false;
}

function getKey(_hidden){
    var file = Orion.NewFile();
    file.Open('discord.key');
    var key = Orion.ReadLine();
    file.Close();
    if(key)
        return key;
    return false;
}

function addCount(item){
    var counters = Shared.GetArray('counter', []);
    var count = counters.map(function(c){
        return c[0] == item;
    }).indexOf(item);
    
    Orion.Print(color.green.norm, count);
    Shared.AddArray('counter', counters);
    var cnt = load(item);
    cnt++;
	save(item, cnt);
	setStatus(cap(item) +": "  +"(" +cnt +")");
}

function showCounter(){
    var counter = Shared.GetArray('counter');
    Orion.Print("Items: " +counter.length);
    for(i in counter)
        Orion.Print(i +" " +JSON.stringify(counter[i]));
}

function cast(spell, target){
    Orion.CancelWaitTarget();
    if(Orion.HaveTarget())
        Orion.CancelTarget();
    if(Player.Frozen())
        return;
    if(target)
        Orion.WaitTargetObject(target);
    Orion.Cast(spell);
    Orion.Wait(500);
    while(Player.Frozen())
        Orion.Wait(100);
    var fcr = (6 - Player.FCR()) / 4 * 1000 + 250;
    Orion.Wait(fcr);
}

function cap(string){
	if(!string)
		return;
	return string.replace(/^./, string[0].toUpperCase());
}

function setRod(){
    Orion.CancelWaitTarget();
    if(Orion.HaveTarget())
        Orion.CancelTarget();
    Orion.Wait(100);
	var held = Orion.ObjAtLayer('LeftHand');
	if(held && Orion.Contains(held.Name(), "Fishing")){
		Orion.UseObject(held.Serial());
		Shared.AddVar('lastRod', held.Serial());
	} else if(Orion.FindObject(Shared.GetVar('lastRod')))
		Orion.UseObject(Shared.GetVar('lastRod'));
	else if(Orion.Count(items['fishpole']) > 0)
		Orion.UseType(items['fishpole'], any, backpack);
	else 
		return false;
	return true;
}

function checkWeight(){
	if(Player.Weight("%") < 50)
		return;
    if(load('cutFish')){
        Orion.Print("Cutting Fish");
        var find = fish.filter(function(f){
            return f.cut;
        }).map(function(f){
            return f.id;
        });
        Orion.FindType(find, any, backpack).forEach(function(f){
            Orion.UseType(items['knife']);
            Orion.WaitTargetObject(f);
            Orion.Wait('useitemdelay');
        })
    }
    if(Player.Weight("%") < 85)
        return;

    if(load('useHold')){
        var px = Player.X(), py = Player.Y();
        emptyToHold();
        walkTo(px, py, 0);
    }

    if(Player.Weight("%") < 85)
        return;

    if(Number(load('method')) > 0){    
        var px = Player.X(), py = Player.Y();
        Orion.Print("Traveling to Secure");
        travel(load('book'), load('method'), load('srune'));
        secure = Orion.FindObject(load('secureID'));
        walkTo(secure.X(), secure.Y(), 1, 10000);
        var find = fish.map(function(f){ return f.id; }).join('|') +'|' +
                crustations.map(function(c){ return c.id; }).join('|') +'|' +
                items["pearls"] +'|' +items["nets"] +'|' +items["hides"] +'|' +
                items["scales"] +'|' +items["gold"] +'|' +items["leather"] +'|' +
                items["mib"];
        Orion.FindType(find, any, backpack).forEach(function(item){
            Orion.MoveItem(item, 0, secure.Serial());
            Orion.Wait('moveitemdelay');
        });
        travel(load('book'), load('method'), load('brune'));
        walkTo(px, py);
    }

    if(Player.Weight("%") > 85)
        correct("weight");
    setStatus("Fishing");
}

function feedGoat(){
	var goat = Orion.FindType(0x00D1, any, ground, 'mobile|near')[0];
	if(!goat)
		return;
	Orion.FindType(items['boots'], any, backpack).forEach(function(boot){
		Orion.MoveItem(boot, 0, goat);
		Orion.Wait('moveitemdelay');
	});
}

function load(key){
    var string = Orion.RegRead(key, settings.subkey);
    if(string.toLowerCase() == "true") return true;
    if(string.toLowerCase() == "false") return false;
    return string;
}

function save(key, val){
    Orion.RegWrite(key, val, settings.subkey);
}

function emptyToHold(){
    setStatus("Moving items to cargo hold");
    var hold = openHold();
    var c1 = hold.Properties().match(/Contents:\s(.*)\/(.*)\sItems/)[1];
    var w1 = hold.Properties().match(/Items\,\s(.*)\/(.*)\sStones/)[1];
    var w2 = hold.Properties().match(/Items\,\s(.*)\/(.*)\sStones/)[2];
    if(c1 >= 125)
        return false;
    var find = crustations.map(function(crust){ return crust.id; }).join('|');
    find += "|"+fish.map(function(f){ return f.id; }).join('|');
    find += "'"+items["hides"] +"|"+items["leather"];
    Orion.FindTypeEx(find, any, backpack).forEach(function(item){
        var w3 = item.Properties().match(/Weight:\s(.*)\sStones/)[1];
        if(w3 > (w2-w1))
            correct("fullhold");
        Orion.MoveItem(item.Serial(), 0, hold.Serial());
        Orion.Wait('moveitemdelay');
    });
}

function openHold(){
    var holds = Orion.FindTypeEx(any, any, ground, 'item', 16).filter(function(item){
        return item.Name() == 'Cargo Hold';
    });

    if(holds && holds.length)
        var hold = holds.shift();
    else
        correct("ship");

    walkTo(hold.X(), hold.Y(), 2, 10000);
    Orion.UseObject(hold.Serial());
    Orion.Wait('useitemdelay');
    Orion.WaitForContainerGump(3000);
    return hold;
}

function walkTo(x, y, dist, delay){
    dist = dist ? dist : 0;
    delay = delay ? delay : 5000;
    if(Orion.WalkTo(x, y, Player.Z(), dist, 255, 2, 2, delay))
        return true;
    return false;
}

function fishSOS(){
    sortMibs();
    var mibs = Shared.GetArray('mibs');
    var mib = mibs.shift();
    Shared.AddArray('mibs', mibs);
    Orion.SetTrack(true, mib.x, mib.y);
    
    var lcnt;
    while(Orion.GetDistance(mib.x, mib.y) > 3){
        if(Orion.GetDistance(mib.x, mib.y) != lcnt){
            lcnt = Orion.GetDistance(mib.x, mib.y);
            Orion.Print("Sailing " +Orion.GetDistance(mib.x, mib.y) +" tiles.");
        }
        Orion.Wait(3000);
    }
    fishSpot(mib.x, mib.y);
    Orion.SetTrack(false);
}

function sailToCurrent(){
    var mibs = Shared.GetArray('mibs');
    var mib = mibs.shift();
    var tiller = Orion.FindObject(load('tiller'));
    var dest;
    while(Orion.GetDistance(mib.x, mib.y) > 4){
        if(Math.abs(Player.X() - mib.x) > 4 && Math.abs(Player.Y() - mib.y) > 4)
            dest = 7;
        if(Math.abs(Player.X() - mib.x) > 4 && Player.Y() == mib.y)
            dest = 6;
        if(Math.abs(Player.X() - mib.x) > 4 && Math.abs(Player.Y() - mib.y) < 4)
            dest = 5;
        if(Math.abs(Player.X() - mib.x) < 4 && Math.abs(Player.Y() - mib.y) > 4)
            dest = 1;
        if(Math.abs(Player.X() - mib.x) < 4 && Player.Y() == mib.y)
            dest = 2;
        if(Player.X() == mib.x && Math.abs(Player.Y() - mib.y) > 4)
            dest = 0;
        if(Math.abs(Player.X() - mib.x) < 4 && Math.abs(Player.Y() - mib.y) > 4)
            dest = 3;
        if(Player.X() == mib.x && Math.abs(Player.Y() - mib.y) < 4)
            dest = 4;
        Orion.Print("Sailing: " +dest);
        Orion.SailOnBoat(dest);
        Orion.Wait(1000);       
        if(dest == 0)
            while(Player.Y() > mib.y)
                Orion.Wait(100);
        else if(dest == 1)
            while(Player.Y() > mib.y && Player.X() < mib.x)
                Orion.Wait(100);
        else if(dest == 2)
            while(Player.X() < mib.x)
                Orion.Wait(100);
        else if(dest == 3)
            while(Player.X() < mib.x && Player.Y() < mib.y)
                Orion.Wait(100);
        else if(dest == 4)
            while(Player.Y() < mib.y)
                Orion.Wait(100);
        else if(dest == 5)
            while(Player.Y() < mib.y && Player.X() > mib.x)
                Orion.Wait(100);
        else if(dest == 6)
            while(Player.X() > mib.x)
                Orion.Wait(100);
        else if(dest == 7)
            while(Player.X() > mib.x && Player.Y() > mib.y)
                Orion.Wait(100);
        Orion.Say("Stop");
        Orion.Wait(1000);
    }
}

function pointShip(dir){
    var tiller = Orion.FindObject(load('tiller'));
    var tdir = tiller.Direction(), set;
    switch(dir){
        case "n":
            dir = 0;
            break;
        case "e":
            dir = 2;
            break;
        case "s":
            dir = 4;
            break;
        case "w":
            dir = 6;
            break;
        default:
            dir = dir;
            break;
    }
        
    if(dir == 0){
        if(tdir == 2)
            Orion.Say("Turn Right");
        if(tdir == 6)
            Orion.Say("Turn Left");
        if(dir == 4)
            Orion.Say("Come About");
    } else if(dir == 2){
        if(tdir == 0)
            Orion.Say("Turn Right");
        if(dir == 4)
            Orion.Say("Turn Left");
        if(dir == 6)
            Orion.Say("Come About");
    } else if(dir == 4){
        if(tdir == 0)
            Orion.Say("Come About");
        if(tdir == 2)
            Orion.Say("Turn Right");
        if(tdir == 6)
            Orion.Say("Turn Left");
    } else if(dir == 6){
        if(tdir == 0)
            Orion.Say("Turn Left");
        if(tdir == 2)
            Orion.Say("Come About");
        if(tdir == 4)
            Orion.Say("Turn Right");
    }
    Orion.Wait(2000);
}

var range = getRange();;
function getRange(){
    var distance;
    var weapon = Orion.ObjAtLayer('RightHand') ? Orion.ObjAtLayer('RightHand') : Orion.ObjAtLayer('LeftHand');
    if(weapon && weapon.Properties().match(/weapon\sdamage/i))
        distance = 1;
    if(weapon && weapon.Properties().match(/range\s(.*)/i))
        distance = weapon.Properties().match(/range\s(.*)/i)[1];
    return distance;
}

/*
*   Fish Monger Quests
*/
function readBoxes(){
    Shared.RemoveArray('boxes');
    var hold = openHold();
    var boxList = Shared.GetArray('boxes');
    var boxes = Orion.FindTypeEx(0x09A9, any, hold.Serial()).forEach(function(box){
        var location = box.Properties().match(/Deliver\sTo\s(.*)/)[1];
        var fishInfo = box.Properties().match(/(.*): (\d+)\/(\d+)/);
        var fishName = fishInfo[1];
        var fishHave = fishInfo[2];
        var fishNeed = fishInfo[3];
        Orion.Print("Saving: " +location +" [" +fishName +": " +fishHave +"/" +fishNeed +"]")
        var elem = {id: box.Serial(), type: box.Graphic(), loc: location, name: fishName, have: fishHave, need: fishNeed};
        boxList.pushIfNotExist(elem, function(e){
            return e.id === elem.id;
        });
    });
    Shared.AddArray('boxes', boxList);
}

function showBoxes(){
    var boxes = Shared.GetArray('boxes');
    for(i in boxes)
        if(boxes[i].name.length)
            Orion.Print("Loc: " +boxes[i].loc +" Fish: " +boxes[i].name +"[" +boxes[i].have +"/" +boxes[i].need +"]");
}

function clearAll(){
    Shared.ClearArrays();
    Orion.CancelWaitTarget();
    Orion.CancelTarget();
}

const regions = [
    [1, 0, 1590, 330, 0],
    [2, 0, 2430, 970, 1590],
    [3, 0, 4096, 330, 2430],
    [4, 3370, 1190, 4100, 0],
    [5, 2000, 2125 ,3370, 1190],
    [6, 2050, 3450, 3550, 2450],
    [7, 3150, 3700, 4500, 3000],
    [8, 2500, 4096, 4300, 3700],
    [9, 1400, 4096, 2225, 3450],
    [10, 3550, 3100, 5000, 1450]
];

function loadMibs(){
	Orion.Wait('useitemdelay');
	var mapX, mapY, setZone;
	var mibs = Orion.FindTypeEx(0x14EE, any, 'lastcontainer', 'item', 3, '', true).map(function(mib){
		Orion.UseObject(mib.Serial());
		Orion.WaitForGump(3000);
		var info = Orion.GetLastGump();
		info.Close();
		Orion.Wait('useitemdelay');
		mapX = Orion.SextantToXY(info.Text(0)).X();
		mapY = Orion.SextantToXY(info.Text(0)).Y();
		for(i in regions){
			if(mapX >= regions[i][1] && mapX <= regions[i][4]){
				if(mapY >= regions[i][3] && mapY <= regions[i][2]){
					setZone = i;
				}
			}
		}
		setZone = setZone > 0 ? setZone : 0;
		return {id: mib.Serial(), 
				x: mapX,
				y: mapY,
				c: info.Text(0).toString(),
				zone: setZone
			};
        Orion.Print("Zone " +setZone);
	}).sort(function(a, b){
		return Orion.GetDistance(a.x, a.y) - Orion.GetDistance(b.x, b.y);
	});
	Shared.AddArray('mibs', mibs);

	for(i in mibs)
		Orion.Print("Mib: " +i +" " +mibs[i].c);
}

function sortMibs(){
	var mibs = Shared.GetArray('mibs', []);
	mibs.sort(function(a,b){
        return Orion.GetDistance(a.x, a.y) - Orion.GetDistance(b.x, b.y);
    });
    Shared.AddArray('mibs', mibs);
}

function sailMib(){
	//var tiller = Orion.FindObject(load('tiller'));
	var mibs = Shared.GetArray('mibs')//.sort(function(a, b){
		//return Orion.GetDistance(a.x, a.y) - Orion.GetDistance(b.x, b.y);
//	});
	var setDir, sayDir;
	var mib = mibs.shift();
	Orion.SetTrack(true, mib.x, mib.y);
	Orion.Print("Sailing to: " +mib.x+"x"+mib.y);
	//Orion.MoveItem(mib.id, 0, backpack);
	//Orion.Wait('moveitemdelay');
	
	sailTo(mib.x, mib.y, 4);
    fishSpot(mib.x, mib.y);
    Shared.AddArray('mibs', mibs);
}

function showMibs(){
    var mibs = Shared.GetArray('mibs');
    for(i in mibs)
        Orion.Print(i +": " +mibs[i].zone +"[" +mibs[i].x +"/" +mibs[i].y +"]");
}

function showStats(){
    Orion.Print("Travel: " +load('method'));
    Orion.Print("SecureID: " +load('secureID'));
    Orion.Print("SecureRune:" +load('srune'));
    Orion.Print("ShipRune:   " +load('brune'));
    Orion.Print("Book:   " +load('book'));
    Orion.Print("CutFish: " +load('cutFish'));
}