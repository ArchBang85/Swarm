#pragma strict
// Gamepad controls 
var speed : int;
var extra_speed : int = 10;
var reset_speed : int = 5;

private var x_min : float;
private var x_max : float;
private var z_min : float;
private var z_max : float;
var buffer : int = 60;


function Start () {

	// Fetch max extents of the playing field from the general settings
/*	var Universal_settings : GameObject = GameObject.Find("Universal_Settings");
	var scene_settings : Scene_settings = Universal_settings.GetComponent(Scene_settings);
	var GUI_Bars : GameObject = GameObject.Find("GUI_Bars");
	var Power_bar : Power_bar = GUI_Bars.GetComponent("Power_bar");
	speed = Power_bar.set_speed; */
	reset_speed = speed;
	extra_speed = reset_speed * 2;
	
	/*x_min = scene_settings.x_minimum;
	x_max = scene_settings.x_maximum;
	z_min = scene_settings.z_minimum;
	z_max = scene_settings.z_maximum;*/

	// ... Or just pull them via the camera
	
	var dist = Camera.main.transform.position.y;
 
	x_min = Camera.main.ViewportToWorldPoint(Vector3(0,0,dist)).x + buffer;
    x_max = Camera.main.ViewportToWorldPoint(Vector3(1,0,dist)).x - buffer;
 	
    z_min = Camera.main.ViewportToWorldPoint(Vector3(0,0,dist)).z + buffer;
    z_max = Camera.main.ViewportToWorldPoint(Vector3(0,1,dist)).z - buffer;
	
}

function Update () {

	var x : float = Input.GetAxis ("Horizontal");
	var z : float = Input.GetAxis ("Vertical");
	// joybutton 5 is right upper trig, 7 lower
	if(Input.GetKey ("joystick 1 button 6"))
	{
		speed = extra_speed;
	} else{
		speed = reset_speed;
	}
	
	
	if((transform.position.x >= x_min && transform.position.x <= x_max) && (transform.position.z >= z_min && transform.position.z <= z_max)) {
	// Moves the unit by the horizontal and vertical portions of the analog control	
			//transform.position = transform.position + Vector3(x * speed * Time.deltaTime, 0, z * speed * Time.deltaTime);
			var dir : Vector3 = Vector3(x, 0, z);
			if(dir.magnitude > 0.2){
				this.rigidbody.AddForce(dir.normalized * speed, ForceMode.Impulse);
			}
							
	} else if (transform.position.x < x_min) {
			transform.position.x = x_min;
	} else if (transform.position.x > x_max) {
			transform.position.x = x_max;
	} else if (transform.position.z < z_min) {
			transform.position.z = z_min;
	} else if (transform.position.z > z_max) {
			transform.position.z = z_max;
	}			
										
	// Let's see if we can rotate crap:
	
																																					
}

function LateUpdate(){


}