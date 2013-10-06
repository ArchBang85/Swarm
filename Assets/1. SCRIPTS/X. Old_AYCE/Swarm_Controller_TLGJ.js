#pragma strict

// Controller Script --- 14/04/2013 
// The idea is that for each player there exists a visible/invisible controller disc towards which all the units
// belonging to that player move each turn. This is the unified script that controls controllers. The key thing
// to change is the player_number variable which corresponds to the player number the controller belongs to. 
// Setting ai_control to 1 will enable AI on the unit.

var target_countdown_timer : int = 500;
var player_number : int;
var ai_control : int = 0;
var controller_disc_speed : float;
var init_speed : float = 5;
private var camera_y : float;
private var steering_target : Vector2;
private var total_players : int;
var potential_targets = new Array();
var target_counter : int = 1;
var target : GameObject;
private var active_target : int;

function Start () {

	// Get the camera z-distance in order to work mouse movement correctly
	camera_y = GameObject.Find("Main Camera").transform.position.y;		
	//var Main_monitor = GameObject.Find("Main_monitor");
	
	// Get the total player amount from the main collision management script
	total_players = 2; //collision_script.total_players;
	
	// AI
	// Populates a list of potential enemies for AI to target but excludes self
	for (var i = 0; i < total_players; i++)
	{
		if(i + 1 != player_number)
		{
			potential_targets.push(i);
		}
	}
	
	
}

function Update () {

	// Check if this is under human control	
	if (ai_control == 0)
	{
	
		if (player_number == 1) // Mouse control
		{ 
			if(Input.GetMouseButtonDown(0))
			{
				var mousePos = Input.mousePosition;

				mousePos.y = -camera_y; // As long as the camera is at Z -100, have this at 100, etc - now linked to camera location variable
				var worldPos = Camera.main.ScreenToWorldPoint(mousePos);
				transform.position.x = worldPos.x;
				transform.position.z = worldPos.z;
				transform.position.y = worldPos.y;
			}
		}
		else if (player_number == 2) // Keyboard Control 1
		{
			
			if (Input.GetKeyDown(KeyCode.Space)) {
			controller_disc_speed = init_speed * 2;
			}
			if (Input.GetKeyUp(KeyCode.Space)) {
			controller_disc_speed = init_speed;
			}
		
			if (Input.GetKey(KeyCode.UpArrow)) {
			transform.position.y = transform.position.y + controller_disc_speed;
			}
			
			if (Input.GetKey(KeyCode.DownArrow)) {
			transform.position.y = transform.position.y - controller_disc_speed;
			}
			
			if (Input.GetKey(KeyCode.LeftArrow)) {
			transform.position.x = transform.position.x - controller_disc_speed;
			}
			
			if (Input.GetKey(KeyCode.RightArrow)) {
			transform.position.x = transform.position.x + controller_disc_speed;
			}
			
			// r resets the disc to the middle of the screen
			if (Input.GetKey(KeyCode.R))
			{
				transform.position.x = 0;
				transform.position.y = 0;
			
			}
			else if (player_number == 3) // Keyboard Control 2
			{
			
			}
			else if (player_number == 4) // Keyboard Control 3
			{
			
			}
		}
	}
	else // AI Control
	{
			// THIS IS WHERE THE COMPUTER BRAINS ARE AND WILL BE IMPROVED

			target_counter = target_counter - 1;
			// Randomised, non-self target:
			// Should have a 5 - 10 second counter
			if(target_counter <= 1)
			{
				var r = Random.Range(0,9);
				if (r < 2) 
				{
				// temp measure
				target = GameObject.Find("Flanking_tackle_3");
				target_counter = target_countdown_timer;
				}
				else
				{
			//	Debug.Log(potential_targets);
				active_target = potential_targets[Random.Range(0, potential_targets.length)];
				//Debug.Log(active_target);
				target_counter = target_countdown_timer;
			
				var t_name : String = "Flanking_tackle_" + (active_target + 1);//active_target.ToString;					
				target = GameObject.Find(t_name);
				}
				
			}
		
		// Actually move the controller
		transform.position.x = target.transform.position.x;
		transform.position.y = target.transform.position.y;
	}
}