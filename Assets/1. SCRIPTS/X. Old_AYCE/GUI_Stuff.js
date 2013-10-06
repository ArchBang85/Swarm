#pragma strict
// Petri Autio 6/2013 //
// Holds all general stuff such as health bars, scoring, unit count, breeding etcetera

// -- VARIABLES -- //

// General settings
var max_units : int = 300;
var carcass_boost : int = 1; // How many extra units does eating a carcass provide
var food_boost : int = 1;

// Scoring variables
private var score : float; //
private var largest_herd : int; // Can use this to augment score
private var megascore : int;
static var output : String;

// Other variables
var u_counter : float = 1;
var unit_amount : int;
var units = new Array();
var text_array = new Array();
private var Harm_Multiplier_reset : int = 1;
private var Harm_Magnitude : float = 0.02;
private var food_increase : float = 0.0001;
private var breed_chance : int = 95;
private var death_roll : int;
private var notplayedend = true;

var food : boolean = false; // Is food being eaten
var carcass : boolean = false; // Eating a monster's carcass generates lots of food and insects
var Eating : boolean = true;
var BeingHarmed : boolean = false;
var Harm_Multiplier : float = 1;
var controller : GameObject;
var player_unit : GameObject;

// SOUNDS //
var low_on_health_music : AudioClip;
var really_low_on_health_music : AudioClip;
var deathsound : AudioClip;
var hurtsound : AudioClip;

// GUI SETTINGS //
// Set relative positions and sizes of the health bar
var pos : Vector2 = new Vector2(800,50);
var size : Vector2 = new Vector2(100, 20);

var gui_text : Transform;

var HealthBar_Empty_1 : Texture2D;
var HealthBar_Full_1 : Texture2D;
var BarDisplay1 :  float = 1;


function Start () {
    // Pick up controller, unit array and fetch the amount of units at the start
	controller = GameObject.Find("Controller");
	units = GameObject.FindGameObjectsWithTag("player1");
	unit_amount = (units.length * 100012) - Random.Range(1,40000);
}

function OnGUI(){
	// Do all the GUI magic for the health bar
	GUI.BeginGroup (new Rect (pos.x, pos.y + (10), size.x, size.y));
       		GUI.Box (Rect (0,0, size.x, size.y), HealthBar_Empty_1);
 		 	// draw the filled-in part:
		        GUI.BeginGroup (new Rect (0, 0, size.x * BarDisplay1, size.y));
		            GUI.Box (Rect (0,0, size.x, size.y), HealthBar_Full_1);
		        GUI.EndGroup (); 
	        GUI.EndGroup (); 
}


function Update () {
	// Clears the table from last turn
	
	text_array.Clear();
	output = "";
	
	units = GameObject.FindGameObjectsWithTag("player1");
	
	/// SCORE ///
	// Score is based on time survived (possibly with a multiplier -
	// TBI[based on how large your largest swarm was]:
	score += Time.deltaTime;
	megascore = Mathf.FloorToInt(score) * 98765;
	text_array.push("Score: " + megascore);

	/// HEALTH ///
	// The herd has a food-dependent generic health bar.
	// The lower this is, the faster the attrition rate.
	// The bigger the herd, the tougher it is to fill it.
	// If it is full (near full), the herd will propagate.
	HealthBar();

	/// UNIT AMOUNT ///
	u_counter = u_counter + Time.deltaTime;
	if(u_counter > 5){
		units.Clear();
		units = GameObject.FindGameObjectsWithTag("player1");
		unit_amount = (units.length * 100) - Random.Range(1,400);
		u_counter = 0;
		}
		
	if(unit_amount > largest_herd)
		largest_herd = unit_amount;
	
	if (unit_amount < 0)
		unit_amount = 0;
	
	text_array.push("Insects: " + unit_amount);
	text_array.push("Nutrition: ");
	
	
	// Format output array into a string with newlines
	for (var i : int = 0; i < text_array.length; i++)
	{
		output = output + text_array[i] + "\n";
	}
	
	// Outputs the result in the GUI
	gui_text.guiText.text = output;
	
	if(units.length==0){
	// Save Score
	// End Level
		if(notplayedend){
			audio.PlayOneShot(deathsound, 0.9);
			notplayedend = false;
		}
		PlayerPrefs.SetInt("score", megascore);
		LoadLevel(2, 3);	
	}
	//Debug.Log(BarDisplay1);
}

function LateUpdate(){

}

function LoadLevel(level: int, delay: float){
  // wait the delay time...
  yield WaitForSeconds(delay);
  // then load the level:
  Application.LoadLevel(level);
}

function HealthBar(){

    // If the bar is plentiful and the draining flag isn't set to true
    if(BeingHarmed)
    	{ 
	    	BarDisplay1 = BarDisplay1 - (Harm_Multiplier * Harm_Magnitude * Time.deltaTime);
	    	death_roll = Random.Range(1,100);
	    	
	    	//Debug.Log("Hey!");
	  		
	    	
	    	// Swarm members start to die off when not well fed
	    	// The less food, the greater the likelihood of death
	    	if(BarDisplay1 < 0.4 && BarDisplay1 > 0.3){
	    		death_roll = Random.Range(1,100);
	    		if(death_roll > 95){
	    			death();
	    			//audio.PlayOneShot(hurtsound, 0.9);
	    		}
	    	}
	    	else if(BarDisplay1 < 0.3 && BarDisplay1 > 0.2){
	    		if(death_roll > 90){
	    			death();
	    		}
	    	}
	    	else if(BarDisplay1 < 0.2 && BarDisplay1 > 0.1){
	    		if(death_roll > 85){
	    		death();
	    		}
	    	}
	    	else if(BarDisplay1 < 0.1 && BarDisplay1 > 0.05){
	    		if(death_roll > 80){
	    		death();
	    		}
	    	}
	    	else if(BarDisplay1 < 0.05){
	    		if(death_roll > 75){
	    		death();
	    		}
	    	}
	    	
	    	// Set harmedness to false every cycle, attacking enemies need to reset it to true
	    	BeingHarmed = false;
    	}
 	
    if(BarDisplay1 > 1)
    	{
    		BarDisplay1 = 0.999;
    	}
     // What happens when not being harmed
     // A bit buggy atm 8/6/2013
    		if (Eating) // Is eating
    		{	
    		
    			BarDisplay1 = BarDisplay1 + food_increase * Time.deltaTime;
    			Eating = false;
    			
    			if (BarDisplay1 > 0.5) // Is healthy and fooded
    			{
    				if (units.length < max_units) {
						
    				// Plentiful food - Chance to Breed!!!
	    				var breeding_roll = Random.Range(1,100);
	    				if (breeding_roll > breed_chance){
		    			 	if(food){
		    			 		
					    		for(var y : int = 0; y < food_boost; y++)
					    		{
					    			birth();
					    		}
					    		food = false;
		    					// Play Sounds
		    				}
	    				}
    				}
    			}
	    		//BarDisplay1 = 0.8;
    		}
    		
    	
    	// EATING //
    	
    	// If eating a carcass, provide extra swarm
    	if(carcass){
    		BarDisplay1 = BarDisplay1 + 0.2;
    		var ra = Random.Range(1,5);
    		if(ra < 2){
    		for(var x : int = 0; x < carcass_boost; x++)
    		{
    			birth();
    		}
    		}
    		carcass = false;
    	
    	}
    	
    	//Debug.Log(BeingHarmed);
}

function death(){
	
	var unlucky_joe : GameObject = units[Random.Range(0, units.length)]; // May cause error if units has been made shorter and the array doesn't register this!!!
	
	Destroy(unlucky_joe, 2);
	
	// Play sound

}

function birth(){
	var lucky_joe : GameObject = units[Random.Range(0, units.length)];
	Instantiate(player_unit, Vector3(lucky_joe.transform.position.x, lucky_joe.transform.position.y + 80, lucky_joe.transform.position.z), Quaternion.identity);
}
