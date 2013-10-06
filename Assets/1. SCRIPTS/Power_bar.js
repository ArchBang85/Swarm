#pragma strict
// Power Bar Script
// This controls the behaviour of the speed boost to players and the associated energy bars in the GUI

// Improved to accommodate up to 4 players

var total_players : int = 4; 

private var playernumber : int = 1;
private var tagger : String = "";

// Set relative positions and sizes of the bars
var pos : Vector2 = new Vector2(120,20);
var size : Vector2 = new Vector2(120, 20);

var move_script : Force_Movement;

// Speed alteration variables
var set_max_speed : float = 1000;
var set_speed : float = 300;
var set_attack : int = 10;
var reset_max_speed : float = 1000;
var reset_speed : float = 300;
var reset_attack : int = 0;
var drain_speed : float = 0.009;
var replenish_speed : float = 0.005;

// Initialises the arrays for the bars
var PowerBar_Empty_1 : Texture2D;
var PowerBar_Full_1 : Texture2D;
var PowerBar_Empty_2 : Texture2D;
var PowerBar_Full_2 : Texture2D;
var PowerBar_Empty_3 : Texture2D;
var PowerBar_Full_3 : Texture2D;
var PowerBar_Empty_4 : Texture2D;
var PowerBar_Full_4 : Texture2D;
var full_bar_array = new Array();
var empty_bar_array = new Array();

var BarDisplay1 : float = 1;
var BarDisplay2 : float = 1;
var BarDisplay3 : float = 1;
var BarDisplay4 : float = 1;
var bar_display_array : float[];

// Draining flags. When these are true, the bar has to replenish completely before the power can be used
var flag1 : boolean = false;
var flag2 : boolean = false;
var flag3 : boolean = false;
var flag4 : boolean = false;

function Start()
{
	// Fetches number of players from main control unit
	empty_bar_array.push(PowerBar_Empty_1);
	full_bar_array.push(PowerBar_Full_1);
	empty_bar_array.push(PowerBar_Empty_2);
	full_bar_array.push(PowerBar_Full_2);
	empty_bar_array.push(PowerBar_Empty_3);
	full_bar_array.push(PowerBar_Full_3);;
	empty_bar_array.push(PowerBar_Empty_4);
	full_bar_array.push(PowerBar_Full_4);
	
	bar_display_array = new float[4];
	bar_display_array[0] = (BarDisplay1);
	bar_display_array[1] = (BarDisplay2);
	bar_display_array[2] = (BarDisplay3);
	bar_display_array[3] = (BarDisplay4);
	
	// fetches total player amount from scene settings
	var universal : GameObject = GameObject.Find("Universal_Settings");
	var scene_settings : Scene_settings = universal.GetComponent(Scene_settings);
	total_players = scene_settings.total_players; 
	
}

function OnGUI()
{ 	
    // draw the background:
    var i : int = 0;

    while (i < total_players)
 	{
    	GUI.BeginGroup (new Rect (pos.x, pos.y+(i*25), size.x, size.y));

       		GUI.Box (Rect (0,0, size.x, size.y), PowerBar_Empty_1);
 		 	// draw the filled-in part of the powerbars:
 		 		var extent : float = bar_display_array[i];
		        GUI.BeginGroup (new Rect (0, 0, size.x * extent, size.y));
		            GUI.Box (Rect (0,0, size.x, size.y), PowerBar_Full_1);
		        GUI.EndGroup (); 
	        GUI.EndGroup (); 
	        i = i + 1;
 	}     
} 
 
function Update()
{

	//Debug.Log(bar_display_array[0]);
	// Cycles through all players in turn
 	playernumber = 1;
 	while (playernumber < 5){
		if (playernumber == 1){
			tagger = "player1";
			Player1_bar();	
		}
		else if (playernumber == 2){
			tagger = "player2";
			Player2_bar();
		}
		else if (playernumber == 3){
			tagger = "player3";
			Player3_bar();
		}
		else if (playernumber == 4){
			tagger = "player4";
			Player4_bar();
		}
		playernumber += 1;
	}
		
}

function Player1_bar(){
	
	var z : float;
	z = bar_display_array[0];
	// Would it be faster to link to the main col control unit list?
	var friends : GameObject[] = GameObject.FindGameObjectsWithTag (tagger) as GameObject[];
    // for this example, the bar display is linked to the current time,
    // however you would set this value based on your desired display
    // eg, the loading progress, the player's health, or whatever.
    
    // If the bar is plentiful and the draining flag isn't set to true
    if(Input.GetKey("joystick 1 button 7") && bar_display_array[0] > 0.1 && flag1 == false)
    	{ 
			for (var unit: GameObject in friends) 
			{
				move_script = unit.GetComponent(Force_Movement);
    			
    			// Boosts speed and max speed for all friends whilst mousebutton is held
    			move_script.speed = Random.Range(set_max_speed * 0.9, set_max_speed);
    			//move_script.speed = set_speed;
    			//move_script.defense_boost = set_attack;	
	    		
	    	}
	    	
	    	bar_display_array[0] = bar_display_array[0] - drain_speed;
    	}

    else if(z < 0.1)
    	{
    		flag1 = true;
    		bar_display_array[0] = bar_display_array[0] + replenish_speed;
    		for (var unit : GameObject in friends) 
				{
					move_script = unit.GetComponent(Force_Movement);
					
					// Resets speed to hardcoded figures
	    			move_script.speed = reset_speed;
	    		//	move_script.speed = reset_speed;
	    			//move_script.defense_boost = reset_attack;	
    			}
    	} 	
    else if(bar_display_array[0] >= 1)
    	{
    		flag1 = false;
    	}  	
    else 
    	{
    		if (bar_display_array[0] < 1)
    		{	
				for (var unit : GameObject in friends) 
				{
					move_script = unit.GetComponent(Force_Movement);
					
					// Resets speed to hardcoded figures
	    			move_script.speed = Random.Range(set_max_speed * 0.9, set_max_speed);
	    			move_script.speed = reset_speed;
	    			//move_script.defense_boost = reset_attack;			
	    		}
	    		bar_display_array[0] = bar_display_array[0] + replenish_speed;
    		}
    	}	

}

function Player2_bar(){

	//Debug.Log("P2");
	var units : GameObject[] = GameObject.FindGameObjectsWithTag (tagger) as GameObject[];
	
    if(Input.GetKey("joystick 2 button 7") && bar_display_array[1] > 0.1 && flag2 == false)
    	{ 
			for (var unit : GameObject in units) 
			{
				move_script = unit.GetComponent(Force_Movement);
    			
    			move_script.speed = Random.Range(set_max_speed * 0.9, set_max_speed);
    			//move_script.speed = set_speed;	
    			//move_script.defense_boost = set_attack;	
	    		
	    	}
	    	
	    	bar_display_array[1] = bar_display_array[1] - drain_speed;
    	}

    else if(bar_display_array[1] < 0.1)
    	{
    		flag2 = true;
    		bar_display_array[1] = bar_display_array[1] + replenish_speed;
    		for (var unit : GameObject in units) 
				{
					move_script = unit.GetComponent(Force_Movement);
					// Resets speed to hardcoded figures
//	    			move_script.speed = reset_max_speed;
	    			move_script.speed = reset_speed;
	//    			move_script.defense_boost = reset_attack;	
    			}
    	}
    	
    else if(bar_display_array[1] >= 1)
    	{
    		flag2 = false;
    	}
    	
    else 
    	{
    		if (bar_display_array[1] < 1)
    		{	
				for (var unit : GameObject in units) 
				{
					move_script = unit.GetComponent(Force_Movement);
					// Resets speed to hardcoded figures
	    			//move_script.max_speed = reset_max_speed;
	    			move_script.speed = reset_speed;	
	    			//move_script.defense_boost = reset_attack;
	    			
	    		}
	    		bar_display_array[1] = bar_display_array[1] + replenish_speed;
    		}
    	}
    	
}

// Behaviour for players 3 and 4

function Player3_bar(){

	//Debug.Log("P2");
	var units : GameObject[] = GameObject.FindGameObjectsWithTag (tagger) as GameObject[];
	
    if(Input.GetKey("joystick 3 button 7") && bar_display_array[2] > 0.1 && flag2 == false)
    	{ 
			for (var unit : GameObject in units) 
			{
				move_script = unit.GetComponent(Force_Movement);
    			
    			move_script.speed = Random.Range(set_max_speed * 0.9, set_max_speed);
    			//move_script.speed = set_speed;	
    			//move_script.defense_boost = set_attack;	
	    		
	    	}
	    	
	    	bar_display_array[2] = bar_display_array[2] - drain_speed;
    	}

    else if(bar_display_array[2] < 0.1)
    	{
    		flag2 = true;
    		bar_display_array[2] = bar_display_array[2] + replenish_speed;
    		for (var unit : GameObject in units) 
				{
					move_script = unit.GetComponent(Force_Movement);
					// Resets speed to hardcoded figures
//	    			move_script.speed = reset_max_speed;
	    			move_script.speed = reset_speed;
	//    			move_script.defense_boost = reset_attack;	
    			}
    	}
    	
    else if(bar_display_array[2] >= 1)
    	{
    		flag2 = false;
    	}
    	
    else 
    	{
    		if (bar_display_array[2] < 1)
    		{	
				for (var unit : GameObject in units) 
				{
					move_script = unit.GetComponent(Force_Movement);
					// Resets speed to hardcoded figures
	    			//move_script.max_speed = reset_max_speed;
	    			move_script.speed = reset_speed;	
	    			//move_script.defense_boost = reset_attack;
	    			
	    		}
	    		bar_display_array[2] = bar_display_array[2] + replenish_speed;
    		}
    	}
    	

}

function Player4_bar(){

	//Debug.Log("P4");
	var units : GameObject[] = GameObject.FindGameObjectsWithTag (tagger) as GameObject[];
	
    if(Input.GetKey("joystick 4 button 7") && bar_display_array[3] > 0.1 && flag2 == false)
    	{ 
			for (var unit : GameObject in units) 
			{
				move_script = unit.GetComponent(Force_Movement);
    			
    			move_script.speed = Random.Range(set_max_speed * 0.9, set_max_speed);
    			//move_script.speed = set_speed;	
    			//move_script.defense_boost = set_attack;	
	    		
	    	}
	    	
	    	bar_display_array[3] = bar_display_array[3] - drain_speed;
    	}

    else if(bar_display_array[3] < 0.1)
    	{
    		flag2 = true;
    		bar_display_array[3] = bar_display_array[3] + replenish_speed;
    		for (var unit : GameObject in units) 
				{
					move_script = unit.GetComponent(Force_Movement);
					// Resets speed to hardcoded figures
//	    			move_script.speed = reset_max_speed;
	    			move_script.speed = reset_speed;
	//    			move_script.defense_boost = reset_attack;	
    			}
    	}
    	
    else if(bar_display_array[3] >= 1)
    	{
    		flag2 = false;
    	}
    	
    else 
    	{
    		if (bar_display_array[3] < 1)
    		{	
				for (var unit : GameObject in units) 
				{
					move_script = unit.GetComponent(Force_Movement);
					// Resets speed to hardcoded figures
	    			//move_script.max_speed = reset_max_speed;
	    			move_script.speed = reset_speed;	
	    			//move_script.defense_boost = reset_attack;
	    			
	    		}
	    		bar_display_array[3] = bar_display_array[3] + replenish_speed;
    		}
    	}
    	
}
