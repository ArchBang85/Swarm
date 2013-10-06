#pragma strict

// Swarm unit movement script

// Petri Autio 6/2013 - archbang85@gmail.com

	// At each simulation step, behaviourally determined steering forces limited by max_force
	// are applied to the vehicle's point mass
	// This prodces an acceleration equal to the steering force divided by the vehicle's mass.
	// That acceleration is added to the old velocity to produce a new velocity, which is then
	// truncated by max_speed
	
// -- VARIABLES -- //

// Movement variables
var mass : float = 1;
var max_speed : float = 1;
var max_force : float = 1;

var proximity_distance : int = 100;
private var velocity : Vector3 = Vector3(0.1, 0.1, 0.1);
private var acceleration : Vector3;
//private var speed : float = 20.0;
private var steering_force : Vector3 = Vector3(0.6, 0.6, 0.6);
private var steering_direction : Vector3 = Vector3(0, 0, 0);
private var aim_target : Vector3 = Vector3(50, 0, 50);

var ControllerName : String = "Controller";

// Other variables 

private var total_players : int;
var player_number;
//var defense_boost : int;

// Need to set the controller so that the units know what to follow
var controller : GameObject;


// -- FUNCTIONS -- //	

function Start() {


	// Pick up the object named 'Controller' as the one to aim for		
	controller = GameObject.Find(ControllerName); // Change here if you want the unit to follow something else
}

function Update () {
		//Debug.Log(controller.transform.position);
		// Fetch current tag - useful for player determination and potential unit capture
		var unit_tag = this.tag;
		player_number = unit_tag.Substring(unit_tag.Length - 1);
		
		// Movement behaviour should always follow tagged side's movement target
		aim_target = Vector3(controller.transform.position.x, controller.transform.position.y, controller.transform.position.z);
	
			// If distance to target is small, slow it down...
		var own_position = Vector3(transform.position.x, transform.position.y, transform.position.z);
		// This functionality models inertia as the units slow down approaching the target,
		// also affects the way they pulse towards the centre when they huddle
		
								
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

		var distance : float = (aim_target-own_position).magnitude;
	
		if(distance < proximity_distance / 2) // Inner distance (push away)
		{
			//transform.Translate(steering_direction * Time.deltaTime/20);	// No movement!	
		}
		else if (distance > proximity_distance/2 && distance < proximity_distance/2*3) // Outer distance (slow down)
		{	
			transform.Translate(steering_direction * Time.deltaTime/10);
		}
		else if (distance > proximity_distance/2*3 && distance < proximity_distance) // Outer distance (slow down)
		{	
			transform.Translate(steering_direction * Time.deltaTime/2);
		}
		else
		{
			transform.Translate(steering_direction * Time.deltaTime); // ALWAYS REMEMBER DELTATIME, BOZO!
		}
}

function LateUpdate()
{

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

	// If the magnitutde of velocity and acceleration combined exceed the set maximum speed,
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
	var desired_velocity : Vector3;
	desired_velocity = Vector3((aim_target.x - curpos.x), (aim_target.y - curpos.y),(aim_target.z - curpos.z));
	desired_velocity = desired_velocity.normalized * max_speed;
	return desired_velocity;

}

