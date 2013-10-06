#pragma strict
// Petri Autio 1.6.2013
// Assign this code to the Gameobject you want to register controller clicks on, i.e. primarily TERRAIN

var controller : GameObject;
var order_sound : AudioClip; 
// Whatever you want to function as the game controller needs to be named "Controller" in the scene
function Start(){
	controller = GameObject.Find("Controller1");
}

function Update(){
    var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
    var hit : RaycastHit;
    // Control currently set to the left mouse button, change here if necessary.
    if(Input.GetButton("Fire1")){
		if (collider.Raycast (ray, hit, 5000.0)) { // distance is set to 1000
		    controller.transform.position = hit.point;
		}
	}
}