#pragma strict

// This places a trigger check on each playable unit
// Checks how many other units are in the trigger of it
// And changes owner accordingly


var counter : int;


//var staycounter : int;
private var counter_1 : int;
var counter_2 : int;
private var counter_3 : int;
private var counter_4 : int;

private var capture_threshold = 1;

var player1_colour : Color = Color(0.2, 0.2, 0.2, 1);
var player2_colour : Color = Color(0.9, 0.1, 0.1, 1);
var player3_colour : Color = Color(0.9, 0.1, 0.1, 1);
var player4_colour : Color = Color(0.9, 0.1, 0.1, 1);
var unitParticles : ParticleSystem;
private var cooldown : float = 0.5;
private var cooldown_reset : float = 0.5;

var parental : GameObject;

private var counter_old_1 : int;
private var counter_old_2 : int;
private var counter_old_3 : int;
private var counter_old_4 : int;
private var static_count_1 : int;
private var static_count_2 : int;
private var static_count_3 : int;
private var static_count_4 : int;
private var static_limit : int = 16;

function Start () {
	parental = this.transform.parent.gameObject;
	
	unitParticles = this.transform.parent.gameObject.GetComponent(ParticleSystem);
	
	if(parental.gameObject.tag == "player1"){
		unitParticles.startColor = player1_colour;
	}
	if(parental.gameObject.tag == "player2"){
		unitParticles.startColor = player2_colour;
	}
	if(parental.gameObject.tag == "player3"){
		unitParticles.startColor = player3_colour;
	}
	if(parental.gameObject.tag == "player4"){
		unitParticles.startColor = player4_colour;
	}	
	
	//other_players[1] = new Array(2,3,4);
	//other_players[2] = new Array(1,3,4);
	//other_players[3] = new Array(1,2,4);
	//other_players[4] = new Array(1,2,3);
	
	//Debug.Log(other_players[2][1]);
	//Debug.Log(other_players[1]);

}

function Update () {
	
	if (counter_old_1 == counter_1){
		static_count_1++;	
	}
	if (counter_old_2 == counter_2){
		static_count_2++;	
	}
	if (counter_old_3 == counter_3){
		static_count_3++;	
	}
	if (counter_old_4 == counter_4){
		static_count_4++;	
	}
	
	if (static_count_1 > static_limit){
		counter_1 = 0;
		static_count_1 = 0;
	}
	if (static_count_2 > static_limit){
		counter_2 = 0;
		static_count_2 = 0;
	}
	if (static_count_3 > static_limit){
		counter_3 = 0;
		static_count_3 = 0;
	}
	if (static_count_4 > static_limit){
		counter_4 = 0;
		static_count_4 = 0;
	}
	

	//Debug.Log(cooldown);
	if (counter_1 < 0) {
		counter_1 = 0;
	}
	
	if (counter_2 < 0) {
		counter_2 = 0;
	}
	
	if (counter_3 < 0) {
		counter_3 = 0;
	}
	
	if (counter_4 < 0) {
		counter_4 = 0;
	}
	
	
	// Check counters 
	
	if(cooldown <= 0){
	
	
		// Cycle through all players and change owner 		
		
		combat1();
			
		
	
	} else {	
		cooldown = cooldown - Time.deltaTime;
	}	
	
	counter_old_1 = counter_1;
	counter_old_2 = counter_2;	
	counter_old_3 = counter_3;
	counter_old_4 = counter_4;
}

function combat1(){
	var combat1 : Function[] = new Function [ 4 ]; 
	combat1[0] = resolve2;
	combat1[1] = resolve3;
	combat1[2] = resolve4;
	combat1[3] = resolve1;
			
	combat1[Random.Range(0, combat1.Length)]();

}

function combat2(){


}

function combat3(){


}

function combat4(){


}

function resolve1(){

		if(counter_1 > capture_threshold){
				// Change tag, colour and controller
				parental.gameObject.tag = "player1";
				unitParticles.startColor = player1_colour;
				var swarm_movement = parental.gameObject.GetComponent(Force_Movement);
				swarm_movement.controller = GameObject.Find("Controller1");
				cooldown = cooldown_reset;
			}
}

function resolve2(){

	if(counter_2 > capture_threshold){
				// Change tag, colour and controller
				parental.gameObject.tag = "player2";
				unitParticles.startColor = player2_colour;
				var swarm_movement = parental.GetComponent(Force_Movement);
				swarm_movement.controller = GameObject.Find("Controller2");
				cooldown = cooldown_reset;
			}

}

function resolve3(){
			
			if(counter_3 > capture_threshold){
				// Change tag, colour and controller
				parental.gameObject.tag = "player3";
				unitParticles.startColor = player3_colour;
				var swarm_movement = parental.gameObject.GetComponent(Force_Movement);
				swarm_movement.controller = GameObject.Find("Controller3");
				cooldown = cooldown_reset;
			}
			

}

function resolve4(){
	if(counter_4 > capture_threshold){
				// Change tag, colour and controller
				parental.gameObject.tag = "player4";
				unitParticles.startColor = player4_colour;
				var swarm_movement = parental.gameObject.GetComponent(Force_Movement);
				swarm_movement.controller = GameObject.Find("Controller4");
				cooldown = cooldown_reset;
			}
				

}



// Count proximities of

// friends

// each enemy

// establish a threshold for when capturing can happen


// Count units within the trigger zone if they are of the right type
function OnTriggerEnter(other : Collider) {
	//Debug.Log(other.gameObject.tag);
	//Debug.Log(other.collider.transform.parent.tag);
	if(other.CompareTag("player1")){
		counter_1++;

	}	
	
	if(other.CompareTag("player2")){
		counter_2++;
		
	}	
	
	if(other.CompareTag("player3")){
		counter_3++;
		
	}	
	
	if(other.CompareTag("player4")){
		counter_4++;
		
	}	
	
}

function OnTriggerExit(other : Collider) {

	
	if(other.CompareTag("player1")){
		counter_1--;
	}	
	  
	if(other.CompareTag("player2")){
		counter_2--;
	}	
	
	if(other.CompareTag("player3")){
		counter_3--;
	}	
	
	if(other.CompareTag("player4")){
		counter_4--;
	}	
	
}

function OnTriggerStay (other : Collider) {
	//staycounter++;
    }