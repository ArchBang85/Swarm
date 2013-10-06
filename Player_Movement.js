#pragma strict

	// Forward Euler integration for vehicular movement
	// At each simulation step, behaviourally determined steering forces limited by max_force
	// are applied to the vehicle's point mass
	// This prodces an acceleration equal to the steering force divided by the vehicle's mass.
	// That acceleration is added to the old velocity to produce a new velocity, which is then
	// truncated by max_speed
	
// -- VARIABLES -- //
var init_timer : float = 5;
var dispersion : float = 1;
var offset : float = 0.2;	
var mass : float = 1;
var speed : float = 1.0;
var max_speed : float = 0.5;
var max_force : float = 0.5;
var velocity : Vector2 = Vector2(0.5, 0.5);
var acceleration : Vector2;
var halt_counter : int = 2;
var invulnerable : int = 0;
var defense_boost : int;

var total_players : int;
var player_number;

var current_tag : String;

var steering_force : Vector2 = Vector2(0.6, 0.6);
var steering_direction : Vector2 = Vector2(0, 0);
var aim_target : Vector2 = Vector2(50, 50);

private var halt : boolean = false;
var timer : int;

private var camera_z : float;
private var Main_monitor : GameObject;
private var collision_script : Main_Collision_Control;

var controller : GameObject;

// -- FUNCTIONS -- //	


function Start() {
	Main_monitor = GameObject.Find("Main_monitor");
	collision_script = Main_monitor.GetComponent(Main_Collision_Control);
	total_players = collision_script.total_players;
	camera_z = GameObject.Find("Main Camera").transform.position.z;	
	var unit_tag = this.tag;
	player_number = unit_tag.Substring(unit_tag.Length - 1);
	var myParticles = this.GetComponent(ParticleSystem);
	if(unit_tag == "player1") 
	{	
		myParticles.startColor = Color.blue;
	}
	else if (unit_tag == "player2")
	{
		myParticles.startColor = Color.red;
	}
	
}

function Update () {

	var yes_no = Random.Range(0,2);
	
	if (yes_no == 0)
	{
	


		var unit_tag = this.tag;
		player_number = unit_tag.Substring(unit_tag.Length - 1);
	
		var controller = GameObject.Find("Controller" + player_number);
	
		if (defense_boost > 0)
		{
		defense_boost = defense_boost - 1;
		}
		if (invulnerable > 0)
		{
		invulnerable = invulnerable - 1;
		}

	// Movement behaviour should always follow tagged side's movement target
		
	// Halting behaviour
		//transform.Translate(Vector2(Random.Range(-0.3,0.3), Random.Range(-0.3,0.3)));
		// A bit of mouse control...
	/*	var mousePos = Input.mousePosition;
		mousePos.z = -camera_z; // As long as the camera is at Z -100, have this at 100, etc
		var worldPos = Camera.main.ScreenToWorldPoint(mousePos);		
		aim_target = Vector2(worldPos.x, worldPos.y);
	*/
	
		aim_target = Vector2(controller.transform.position.x, controller.transform.position.y);
		// If distance to target is small, slow it down...
		
	}
	
	/*else
	
	{
		var rox = Random.Range(0, collision_script.player1.length);
		aim_target = Vector2(collision_script.player1[rox].transform.position.x, collision_script.player1[rox].transform.position.y)  ;
		//Debug.Log('nony');
		
	}	
	*/	
		var own_position = Vector2(transform.position.x, transform.position.y);
		
		
		// This functionality models inertia as the units slow down approaching the target,
		// also affects the way they pulse towards the centre when they huddle
		
		if((aim_target - own_position).magnitude < 30) // Inner distance (push away)
		{
			transform.Translate((aim_target - own_position)/100);
			//detect_friends(steering_direction);
	
		}
		else if ((aim_target - own_position).magnitude < 60) // Outer distance (slow down)
		{	
			transform.Translate((aim_target - own_position)/80);
			//detect_friends(steering_direction);
		}	
		else if ((aim_target - own_position).magnitude < 120) // Outer distance (slow down)
		{	
			transform.Translate((aim_target - own_position)/60);
			//detect_friends(steering_direction);
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
		
			// Current position as a Vector2
			var curpos : Vector2 = Vector2(transform.position.x, transform.position.y);
		
			//desired_velocity = seeking(curpos_x, curpos_y);//normalize (position - target) * max_speed
			var desired_velocity : Vector2;	
			desired_velocity = seeking(curpos);
		
			//// STEERING DIRECTION NEEDS TO BE UPDATED
															
			steering_direction = Vector2(desired_velocity.x, desired_velocity.y); 

		//	if (halt_counter > 0)
		//	{
		//	halt_counter--;
		//	transform.Translate(steering_direction/4);
		//	}else{
				var collision_script : Main_Collision_Control = Main_monitor.GetComponent(Main_Collision_Control);
				var rando = Random.Range(0,2);	
				if (collision_script.collide == true && rando == 1){
						//detect_friends(steering_direction);
				}
				transform.Translate(steering_direction);
		//	} 
		}	
			//steering_direction = obstacle_detection(steering_direction);
			/*detect_obstacles();
			
		 	detect_friends(steering_direction);
			detect_round_obstacles();
			*/
			//transform.Translate(steering_direction);
			// transform.Translate moves the bit towards (x,y) 
		
		// This works pretty well!!!
	

}

function LateUpdate()
{
		detect_obstacles();		
	// 	
		detect_round_obstacles();

}

// Caps the steering force at the maximum level
function truncate_steering(steering_direction : Vector2, max_force : float){
	
	if (steering_direction.magnitude > max_force){
		return steering_direction.normalized * max_force;
	} else { 
		return steering_direction;	
	}
}

// Caps velocity at maximum speed

// This needs to take the vector nature of velocity and acceleration into account
function truncate_velocity(velocity : Vector2, acceleration : Vector2, max_speed : float){

	// If the magniutde of velocity and acceleration combined exceed the set maximum speed,
	// the resulting vector gets capped at by max speed, else the inputs are returned
	if((velocity + acceleration).magnitude > max_speed){
		var new_velocity : Vector2 = (velocity + acceleration).normalized * max_speed;

		return new_velocity;
	} else {
		return (velocity + acceleration);
	}
}

// Seeking towards a target
function seeking(curpos : Vector2){

	// Desired velocity
	var desired_velocity : Vector2;
	// curpos start = (-100, -80), target start = (50,-50) result = 150, 30 || if ts (-120, -100) result = (-20, -20)
	// Ok, so it works better when the current position is subtracted from the target position, why?
	// Should be using local values, not global???
	desired_velocity = Vector2((aim_target.x - curpos.x), (aim_target.y - curpos.y));
	desired_velocity = desired_velocity.normalized * max_speed;

	return desired_velocity;
	
	// desired_velocity = normalize (position - target) * max_speed
	// steering = desired_velocity - velocity
}

function detect_friends(direction : Vector2){

	var collision_script : Main_Collision_Control = Main_monitor.GetComponent(Main_Collision_Control);
	var friends : GameObject[] = collision_script.all_units;
	//var friends : GameObject[] = GameObject.FindGameObjectsWithTag ("friend") as GameObject[];
	for (var friend : GameObject in friends) 
	{
	
		var distX = transform.position.x - friend.transform.position.x;
		var distY = transform.position.y - friend.transform.position.y;  
	
		//if (distX < 5 && distY < 5)
		//{
	
			var object_sizes: float = transform.localScale.x/2 + friend.transform.localScale.x/2 + dispersion; // Needs to be divided by 2 to give the RADIUS and not DIAMETER	
			var penetration : float = Vector2(distX, distY).magnitude - object_sizes;
			
			// If distance is less than the boundaries of the objects...	
			if (distX != 0 && distY != 0 && penetration < 0)
			{
				var Normal : Vector3 = (Vector3(distX, distY, 0) / Vector3(distX, distY, 0).magnitude);
				speed = 0;
				halt_counter = 1;
				// Randomise deflection angle
				var rotationAngle : int = Random.Range(-5,5);
				var rotation : Quaternion = Quaternion.AngleAxis(rotationAngle, Vector3.forward);							
				//Normal.transform.eulerAngles.z = Random.Range(90,180);
					
				Normal = rotation * Normal;
				transform.Translate(-Normal * penetration);
			}
		//}
	}
}
	
function detect_round_obstacles(){	
	var planets : GameObject[] = GameObject.FindGameObjectsWithTag ("planet") as GameObject[];
	
	for (var planet : GameObject in planets) 
	{
	
		var sizes = transform.renderer.bounds.size.magnitude/2 + (planet.transform.localScale.x / 2); // Use localscale to get just the x-axis size
		//var sizes = transform.renderer.bounds.size.magnitude/2 + planet.renderer.bounds.size.magnitude/;
		var distX2 = transform.position.x - planet.transform.position.x;	
		var distY2 = transform.position.y - planet.transform.position.y;							
		var penetration2 : float = Vector2(distX2, distY2).magnitude - sizes;
																																						
		if (distX2 != 0 && distY2 != 0 && penetration2 < 0) 
		{ 
			//var planet_penetration : float = ;
			speed = 0;
			velocity = Vector2(0,0);
			halt_counter = 1;
			
			var Normal : Vector3 = Vector3(distX2, distY2, 0)/(Vector3(distX2, distY2, 0).magnitude);
			
			// Randomise deflection angle
			var rotationAngle : int = Random.Range(-25,25);
			var rotation : Quaternion = Quaternion.AngleAxis(rotationAngle, Vector3.forward);							
			//Normal.transform.eulerAngles.z = Random.Range(90,180);
				
			Normal = rotation * Normal;
			
			
			transform.Translate(-Normal * penetration2);
			
			//transform.Translate(Vector2((transform.position.x - planet.transform.position.x) * offset, (transform.position.y - planet.transform.position.y) * offset));
			
		}
	}	
}


function detect_obstacles(){

	var obstacles : GameObject[] = GameObject.FindGameObjectsWithTag ("obstacle") as GameObject[];
	
	for (var obstacle : GameObject in obstacles)
	{
	
		// Using Unity's built in methods to check for object intersection in 3 dimensions
		var bounds1 = transform.renderer.bounds;
		var bounds2 = obstacle.renderer.bounds;
		
		if (bounds1.Intersects(bounds2))
		{
				
			var circleX = transform.position.x;
			var circleY = transform.position.y;
			var boxX    = obstacle.transform.position.x;
			var boxY    = obstacle.transform.position.y;
			var obstacle_width  = obstacle.transform.localScale.x / 2;
			var obstacle_height = obstacle.transform.localScale.y / 2;		
			var radius = transform.renderer.bounds.size.magnitude / 2;
			
			var clamp_x : float;
			var clamp_y : float;
			clamp_x = Mathf.Max(-obstacle_width, Mathf.Min(obstacle_width, (circleX - boxX)));
			clamp_y = Mathf.Max(-obstacle_height, Mathf.Min(obstacle_height, (circleY - boxY)));
			
		//	Debug.DrawLine(Vector3(boxX, boxY, 0), Vector3(clamp_x, clamp_y,0));

			var distX = transform.position.x - obstacle.transform.position.x;
			var distY = transform.position.y - obstacle.transform.position.y;
			
			// How exactly can I tell whether penetration occurs?			
			var penetration : float = Vector2(distX, distY).magnitude - (radius + Vector2(clamp_x, clamp_y).magnitude);
			if (distX != 0 && distY != 0 && penetration < 0) 
			{
				//halt_counter = 1;
				var Normal = Vector3(distX, distY, 0) / (Vector3(distX, distY, 0).magnitude);
				
				// Randomise deflection angle
				var rotationAngle : int = Random.Range(-5,5);
				var rotation : Quaternion = Quaternion.AngleAxis(rotationAngle, Vector3.forward);							
				//Normal.transform.eulerAngles.z = Random.Range(90,180);
				
				Normal = rotation * Normal;
				
				transform.Translate(-Normal * penetration);
				
			}
		}
	
	}
		


}


			
			// Debug Lines //
			//Debug.DrawLine(Vector2(10,10), Vector2(-50,-50), Color.red, 100);
			//Debug.DrawLine(Vector2(transform.position.x -10, transform.position.y), Vector2((transform.position.x + steering_direction.x*20) - 10, transform.position.y + steering_direction.y*20), Color.green, 0);
			//Debug.DrawLine(Vector2(transform.position.x +10, transform.position.y), Vector2((transform.position.x + steering_direction.x*20) + 10, transform.position.y + steering_direction.y*20), Color.green, 0);
		
		/*	// DETECTS ENEMIES IN FRONT BY USING DOT PRODUCT
			var others : GameObject[];
			others = GameObject.FindGameObjectsWithTag ("friend");
			
			others = GameObject.FindGameObjectsWithTag ("friend") as GameObject[];
			for (var other : GameObject in others) 
			{		
				var toOther = other.transform.position - transform.position;		
				var pene : float = toOther.magnitude - 4; 
				if(Vector2.Dot(steering_direction.normalized, toOther.normalized) > 0.9 && toOther.magnitude < 5){
				 	var N : Vector2 = (toOther / toOther.magnitude);
					transform.Translate(-N * pene);		
				}
			}*/
		//	var uniter : GameObject = GameObject.FindGameObjectsWithTag("Main_monitor") as GameObject;
			