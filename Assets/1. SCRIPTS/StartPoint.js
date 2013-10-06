#pragma strict
// Pautio 01/06/2013 This spawns the player units upon the scene awakening

var starting_units : int = 1; // 10 times this will be spawned
var player_unit : GameObject;
var distance_increment : int = 1;


function Start () {
	//var unit_collider = player_unit.GetComponent(SphereCollider);
	var radius : float = player_unit.renderer.bounds.size.x * 2;
    for (var z = 0; z < starting_units; z++) {
        for (var x = 0; x < 10; x++) {
        		// Make sure the units don't get spawned right on top of each other
        		Instantiate(player_unit, Vector3 (transform.position.x + x * radius + distance_increment, transform.position.y, transform.position.z + z * radius + distance_increment), Quaternion.identity);
        }
    }
}