#pragma strict

var x_minimum : int = -350;
var x_maximum : int = 350;
var z_minimum : int = -70;
var z_maximum : int = 400;

var total_players : int = 4;
function Start () {

	// Only activate the amount of players specified
	for(var x : int = 1; x <= total_players; x++){
	
		var startpoint = GameObject.Find("StartingPoint" + x.ToString());
		var script = startpoint.GetComponent(StartPoint);
		script.enabled = true;
	
		var controller = GameObject.Find("Controller" + x.ToString());
		var controller_indicator = controller.transform.FindChild("Controller_Indicator");
		controller_indicator.GetComponent(MeshRenderer).enabled = true;
	
	}

}

function Update () {

}