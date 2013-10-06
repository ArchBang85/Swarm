#pragma strict

var units_player1 : GameObject[];
var units_player2 : GameObject[];
var units_player3 : GameObject[];
var units_player4 : GameObject[];
var gui_text : Transform;

var total_players : int;

function Start () {

	units_player1 = GameObject.FindGameObjectsWithTag ("player1") as GameObject[];
	units_player2 = GameObject.FindGameObjectsWithTag ("player2") as GameObject[];
	units_player3 = GameObject.FindGameObjectsWithTag ("player3") as GameObject[];;
	units_player4 = GameObject.FindGameObjectsWithTag ("player4") as GameObject[];;
	total_players = GameObject.Find("Universal_Settings").GetComponent(Scene_settings).total_players;

}

function Update () {
	
	var output = "";
	
	
	
	units_player1 = GameObject.FindGameObjectsWithTag ("player1") as GameObject[];
	units_player2 = GameObject.FindGameObjectsWithTag ("player2") as GameObject[];
	units_player3 = GameObject.FindGameObjectsWithTag ("player3") as GameObject[];;
	units_player4 = GameObject.FindGameObjectsWithTag ("player4") as GameObject[];;
	
	var units_numbers : Array = [units_player1.Length-1, units_player2.Length-1, units_player3.Length-1, units_player4.Length-1];
	
	
	for(var p : int = 1; p <= total_players; p++){
	
		output = output + "Player " + p + " units: " + (units_numbers[p-1]).ToString() +"\n";
	
	}
	
	Debug.Log(output);
	
	//output = "Player 1 units: " + (units_player1.Length - 1).ToString() +"\nPlayer 2 units: " + (units_player2.Length - 1).ToString();
	
	gui_text.guiText.text = output;
	
	//Debug.Log(units_player2.Length-1);
}