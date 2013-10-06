#pragma strict

// Petri Autio 6/2013 -- General behaviour of monsters and food --Games

// --- VARIABLES --- //

var mobile : boolean; // Sets whether unit can ever move or not
var carcass : boolean = true; // Sets whether unit yields a carcass for the swarm at point of death
var CanFrightBack : boolean = true; // Can the unit cause damage
var sleeping : boolean = true; // Is the unit dormant
var dormancy_counter : float = 1000; // How many cycles before the unit awakens
var Harm_Multiplier : float = 2; // How much extra damage the enemy does to the swarm
var damage_threshold : int = 15; // How many units need to be nearby before damage even begins
var hp : int = 25;

var units : GameObject[];

private var GUI_fetch : GameObject;
private var counter : int;
private var old_counter : int;
private var i : int;
private var local_unit_counter : int;
private var target;
private var init_hp : int;
private var BeingHarmed : boolean;
private var eating_counter : int = 10;
private var first_target_set : boolean = false;

// -- MOVEMENT VARIABLES -- //
var mass : float = 1;
var max_speed : float = 0.5;
var max_force : float = 0.5;
private var velocity : Vector3 = Vector3(0.5, 0.5, 0.5);
private var acceleration : Vector3;
private var steering_force : Vector3 = Vector3(0.6, 0.6, 0.6);
private var steering_direction : Vector3 = Vector3(0, 0, 0);
private var aim_target : Vector3 = Vector3(50, 0, 50);

private var new_target_counter : float = 0;
private var new_target_counter_reset : int = 10; // How long until an active enemy chooses another target
//private var total_players : int;
private var player_number : String;

private var current_tag : String;
private var timer : int;
var controller : GameObject;

// -- SOUNDS -- //
private var notplayed : boolean = true;
private var death_notplayed : boolean = true;
var deathsound : AudioClip;
var musiccontrol : GameObject;
var being_attacked_sound : AudioClip;
private var sound_countdown : float = 10;

function Start () {
	GUI_fetch = GameObject.Find("GUI Text");
	musiccontrol =GameObject.Find("MusicControl");
	init_hp = hp;
	//play_death_sound = deathsound;
}

function Update () {

	units = GUI_fetch.GetComponent(GUI_Stuff).units;
	local_unit_counter = units.length;
	
	// Just a workaround to ensure that even small swarms have some chances...
	if (units.length < 5){
		local_unit_counter = 5;
		}
	
	// On occasion update old_counter
	if(i == 4){
				old_counter = counter;
				i = 0;
			}
	i++;
	
	// What happens if the unit is a monster (and not food)
	if(CanFrightBack){
		// Pain mechanic: count units colliding with the monster, if this goes above a threshold, inflict pain
		
		// What happens when a few player units are within the monster's trigger radius:
		if (counter > 5) //(Mathf.FloorToInt(local_unit_counter / 5) + 1))
		{
			// Initiate monster sound
			if(notplayed){
					audio.PlayOneShot(deathsound, 0.9);
					notplayed = false;
					// What we could do here is set a counter to a few hundred so that the sound
					// could be replayed after a suitable interval
				if (this.tag == "boss" && counter > 14){
					
					musiccontrol.GetComponent(MusicSwitcher).isBossAttacking = true;
				}
			}
			else
			{
				sound_countdown = sound_countdown - Time.deltaTime;
				if(sound_countdown < 0){
					sound_countdown = 10;
					notplayed = true;
				}
			}
			
			if(sleeping){
				mobile = true;
				//sleeping = false;
			}
			
			// If the monster is near lots of swarmies, then it also hurts the swarm a lot
			if (counter > (Mathf.FloorToInt(local_unit_counter/2) + 1))
			{
				//Debug.Log("Hurting loads!");
				GUI_fetch.GetComponent(GUI_Stuff).BeingHarmed = true;
				GUI_fetch.GetComponent(GUI_Stuff).Harm_Multiplier = Harm_Multiplier;
	
			}
			else
			{
				if (GUI_fetch.GetComponent(GUI_Stuff).BeingHarmed == false){
					GUI_fetch.GetComponent(GUI_Stuff).BeingHarmed = true;
	
				}
				//Debug.Log("Hurting!");
			}
		}
		else if (counter < 2 && old_counter > 0){
	
			GUI_fetch.GetComponent(GUI_Stuff).Harm_Multiplier = 1;
	
		}
	}
	
	else if (death_notplayed)
	{
		
		if(counter > 8){
		audio.PlayOneShot(deathsound, 1);
		death_notplayed = false;
		}
	
	}

	// -- DAMAGE TO MONSTER -- //
	
	if (counter > damage_threshold){
		if(this.tag == "boss"){
			//Debug.Log(hp);
		}
		// Set the swarms eating boolean to true!
		GUI_fetch.GetComponent(GUI_Stuff).Eating = true;

		var hit_chance : int = Random.Range(1,6);
		if (hit_chance > 4){
			hp = hp - Time.deltaTime;
		}
		
		// if is boss and hp < 50% then send instruction
		if (gameObject.tag == "boss"){
			if(hp < (init_hp / 2)){	
				musiccontrol.GetComponent(MusicSwitcher).bossHealth = 49;
				}
		}	
		// The purpose of this was to allow the eating to go on after the unit dies, BUT
		// when the unit is dead the eating will never cease...
		if(hp<=0){
			eating_counter = eating_counter - Time.deltaTime;
			if(eating_counter == 0){
				GUI_fetch.GetComponent(GUI_Stuff).Eating = false;
			}
		}
	
		
		if(hp == 0){
			
			Destroy (gameObject);
			if (this.tag == "boss"){
					musiccontrol.GetComponent(MusicSwitcher).bossHealth = 0;
				}
			hp--;
			if(carcass){
				GUI_fetch.GetComponent(GUI_Stuff).carcass = true;
			}			
		}
	}
	else {
			if(eating_counter <= 0){
				GUI_fetch.GetComponent(GUI_Stuff).Eating = false;
			}

	}
	
	
	// -- MOVEMENT -- // (if mobile):
		
	if(sleeping){
		if (dormancy_counter > 0){		
			dormancy_counter = dormancy_counter - Time.deltaTime;		
		}
		else if (dormancy_counter < 0 && mobile == false){
			mobile = true;
		}
	}
		
	//	Debug.Log(dormancy_counter);
	
		if(mobile){
			// Set first target
			if(!first_target_set){
				controller = units[Random.Range(0, units.length)]; 
				first_target_set = true;
			}
		
		    // Select random aiming target every now and then
		    new_target_counter = new_target_counter + Time.deltaTime;
		    
		    if (new_target_counter > new_target_counter_reset){
				controller = units[Random.Range(0, units.length)];
				new_target_counter = 0;
			}
			
			var unit_tag = this.tag;
			player_number = unit_tag.Substring(unit_tag.Length - 1);
		
			// Movement behaviour should always follow tagged side's movement target
			
			aim_target = Vector3(controller.transform.position.x, controller.transform.position.y, controller.transform.position.z);
			// If distance to target is small, slow it down...
			var own_position = Vector3(transform.position.x, transform.position.y, transform.position.z);
			
			// This functionality models inertia as the units slow down approaching the target,
			// also affects the way they pulse towards the centre when they huddle
			
			var distance = (aim_target - own_position);
			
			if(distance.magnitude < 30) // Inner distance (push away)
			{
				transform.Translate(distance * Time.deltaTime);
				
			}
			else if (distance.magnitude  < 60) // Outer distance (slow down)
			{	
				transform.Translate(distance* Time.deltaTime);

			}	
			else if (distance.magnitude < 120) // Outer distance (slow down)
			{	
				transform.Translate(distance * Time.deltaTime);
			}
			else
			{
										
				// Find all gameobjects that are controllers
				// and use the one that has the same tag as you do to follow
				// Fetches the steering force to see
				steering_force = truncate_steering(steering_direction, max_force);
				// Acceleration should be determined by the steering force divided by mass
				var acceleration = steering_force / mass;
				
				// Fetches velocity
				velocity = truncate_velocity(velocity, acceleration, max_speed);
			
				// Current position as a Vector3
				var curpos : Vector3 = Vector3(transform.position.x, transform.position.y, transform.position.z);
			
				//desired_velocity = seeking(curpos_x, curpos_y);//normalize (position - target) * max_speed
				var desired_velocity : Vector3;	
				desired_velocity = seeking(curpos);
			
				//// STEERING DIRECTION NEEDS TO BE UPDATED
																
				steering_direction = Vector3(desired_velocity.x, desired_velocity.y, desired_velocity.z); 
	
					transform.Translate(steering_direction * Time.deltaTime);
			}	
		}	
}	

// Count units within the trigger zone
function OnTriggerEnter(other : Collider) {
	counter++;
}

function OnTriggerExit(other : Collider) {
	counter--;
}

function OnTriggerStay (other : Collider) {

        //if (other.attachedRigidbody)
        //    other.attachedRigidbody.AddForce(Vector3.up * 10);
    }
    
    
// Caps the steering force at the maximum level
function truncate_steering(steering_direction : Vector3, max_force : float){
	
	if (steering_direction.magnitude > max_force){
		return steering_direction.normalized * max_force;
	} else { 
		return steering_direction;	
	}
}

// Caps velocity at maximum speed

// This needs to take the vector nature of velocity and acceleration into account
function truncate_velocity(velocity : Vector3, acceleration : Vector3, max_speed : float){

	// If the magniutde of velocity and acceleration combined exceed the set maximum speed,
	// the resulting vector gets capped at by max speed, else the inputs are returned
	if((velocity + acceleration).magnitude > max_speed){
		var new_velocity : Vector3 = (velocity + acceleration).normalized * max_speed;

		return new_velocity;
	} else {
		return (velocity + acceleration);
	}
}

// Seeking towards a target
function seeking(curpos : Vector3){

	// Desired velocity
	var desired_velocity : Vector3;
	// curpos start = (-100, -80), target start = (50,-50) result = 150, 30 || if ts (-120, -100) result = (-20, -20)
	// Ok, so it works better when the current position is subtracted from the target position, why?
	// Should be using local values, not global???
	desired_velocity = Vector3((aim_target.x - curpos.x), (aim_target.y - curpos.y),(aim_target.z - curpos.z));
	desired_velocity = desired_velocity.normalized * max_speed;

	return desired_velocity;
	
	// desired_velocity = normalize (position - target) * max_speed
	// steering = desired_velocity - velocity
}

