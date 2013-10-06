#pragma strict

// Keyboard control 06/07/2013
// The idea is that for each player there exists a visible/invisible controller disc towards which all the units
// belonging to that player move each turn.

var controller_disc_speed : float = 20; 
var controller : GameObject;
var ai_control : int = 1;

var Waypoint1 : GameObject;
var Waypoint2 : GameObject;
var Waypoint3 : GameObject;
private var target_switch_counter : float = 3;
private var target_counter : int = 0;

function Start () {

}





function Update () {
			
			if (ai_control == 0){
			
				if (Input.GetKey(KeyCode.UpArrow)) {
				transform.position.z = transform.position.z + controller_disc_speed * Time.deltaTime;
				}
				
				if (Input.GetKey(KeyCode.DownArrow)) {
				transform.position.z = transform.position.z - controller_disc_speed * Time.deltaTime;
				}
				
				if (Input.GetKey(KeyCode.LeftArrow)) {
				transform.position.x = transform.position.x - controller_disc_speed * Time.deltaTime;
				}
				
				if (Input.GetKey(KeyCode.RightArrow)) {
				transform.position.x = transform.position.x + controller_disc_speed * Time.deltaTime;
				}
							
			} else {
			
			// AI Control
				Debug.Log(target_switch_counter);
				if(target_switch_counter < 0){
					target_switch_counter = 3;
					
					target_counter = target_counter + 1;
					
					if(target_counter > 3){ target_counter = 1; }
					
					if(target_counter == 1){				
						transform.position = Waypoint1.transform.position;
					}
					
					if(target_counter == 2){
						transform.position = Waypoint2.transform.position;
					}
					if(target_counter == 3){
						transform.position = Waypoint3.transform.position;
					}
					
				} else {
				target_switch_counter = target_switch_counter - Time.deltaTime;
				}
				
			}
			
			
			//var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
    		//var hit : RaycastHit;
    	
    	
    		//if(Input.GetButton("Fire1")){
			//if (collider.Raycast (ray, hit, 3000.0)) { // distance is set to 1000
		   // 	controller.transform.position = hit.point;
			//}
//	}
			
}