#pragma strict

// This is to set a gameobject to stay on top of the terrain in the same position as the controller which goes under the terrain
var controller : GameObject;

function Start () {

}

function Update () {

	var raycastPosition : Vector3 = transform.position;
	var hit : RaycastHit;
	
	if (Physics.Raycast (raycastPosition, -Vector3.up, hit)){
		if(hit.collider.tag == "terrain"){
			var distanceToGround = hit.distance;
			//Debug.Log(hit.distance);
			transform.position.y = transform.position.y - hit.distance + 10;
		}
	}
	
	if (Physics.Raycast (raycastPosition, Vector3.up, hit)){
		if(hit.collider.tag == "terrain"){
			distanceToGround = hit.distance;
			//Debug.Log(hit.distance);
			transform.position.y = transform.position.y + hit.distance + 9;
		}
	}
	
	
	
}