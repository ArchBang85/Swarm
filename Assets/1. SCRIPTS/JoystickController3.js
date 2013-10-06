#pragma strict
// Gamepad controls
var speed : int;
var extra_speed : int;
var reset_speed : int;
private var x_min : float;
private var x_max : float;
private var z_min : float;
private var z_max : float;
var buffer : int = 60;


function Start () {
	// Fetch max extents of the playing field from the general settings
	var Universal_settings : GameObject = GameObject.Find("Universal_Settings");
	var scene_settings : Scene_settings = Universal_settings.GetComponent(Scene_settings);
	var GUI_Bars : GameObject = GameObject.Find("GUI_Bars");
	var Power_bar : Power_bar = GUI_Bars.GetComponent("Power_bar");
	speed = Power_bar.set_speed; 
	reset_speed = speed;
	extra_speed = reset_speed * 2;
	

	// ... Or just pull them via the camera
	
	var dist = Camera.main.transform.position.y;
 
	x_min = Camera.main.ViewportToWorldPoint(Vector3(0,0,dist)).x + buffer * 2;
    x_max = Camera.main.ViewportToWorldPoint(Vector3(1,0,dist)).x - buffer * 2;
 	
    z_min = Camera.main.ViewportToWorldPoint(Vector3(0,0,dist)).z + buffer;
    z_max = Camera.main.ViewportToWorldPoint(Vector3(0,1,dist)).z - buffer;
	
}

function Update () {

	var x : float = Input.GetAxis ("Horizontal3");
	var z : float = Input.GetAxis ("Vertical3");
	// joybutton 5 is right upper trig, 7 lower
	if(Input.GetKey ("joystick 3 button 6"))
	{
		speed = extra_speed;
	} else{
		speed = reset_speed;
	}
	
	if((transform.position.x >= x_min && transform.position.x <= x_max) && (transform.position.z >= z_min && transform.position.z <= z_max)) {
		
			transform.position = transform.position + Vector3(x * speed * Time.deltaTime, 0, z * speed * Time.deltaTime);

	} else if (transform.position.x < x_min) {
			transform.position.x = x_min;
	} else if (transform.position.x > x_max) {
			transform.position.x = x_max;
	} else if (transform.position.z < z_min) {
			transform.position.z = z_min;
	} else if (transform.position.z > z_max) {
			transform.position.z = z_max;
	}			
	
	
	//var tmppos : Vector3 = transform.position;
	//tmppos.z = Mathf.Clamp(transform.position.z,z_min,z_max);
	//transform.position = tmppos;
	//	} 		
	//} else { 	// What happens when the borders are reached
	//	transform.position = transform.position + Vector3(-x * speed * Time.deltaTime * 10, 0, -z * speed * Time.deltaTime * 10);
	//}
	//transform.position.x = Mathf.Clamp(transform.position.x,x_min,x_max);
    
										
}

function LateUpdate(){


}