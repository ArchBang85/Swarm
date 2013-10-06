#pragma strict

var speed : int = 10;
var controller : GameObject;
var close_cutoff : int = 100;

function Start () {
	
	//speed = Random.Range(95,110);
	if(this.tag == "player1"){
		controller = GameObject.Find("Controller1");
	}
	if(this.tag == "player2"){
		controller = GameObject.Find("Controller2");
	}
	if(this.tag == "player3"){
		controller = GameObject.Find("Controller3");
	}
	if(this.tag == "player4"){
		controller = GameObject.Find("Controller4");
	}
}

function FixedUpdate () {

				var dir = controller.transform.position - this.transform.position;
				//if(dir.magnitude > close_cutoff){
					this.rigidbody.AddForce(dir.normalized * speed, ForceMode.Impulse);
			//	}
}
