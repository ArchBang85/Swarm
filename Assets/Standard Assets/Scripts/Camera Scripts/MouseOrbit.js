var target : Transform;
var distance : float = 10.0;
var zoom_speed : float = 10.0;
var xSpeed : float = 250.0;
var ySpeed : float = 120.0;

var yMinLimit : float = -20;
var yMaxLimit : float= 80;

var distanceMinLimit : float = 400;
var distanceMaxLimit : float= 800;

private var x : float = 0.0;
private var y : float = 0.0;

@script AddComponentMenu("Camera-Control/Mouse Orbit")

function Start () {
    var angles : Vector3 = transform.eulerAngles;
    x = angles.y;
    y = angles.x;

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function LateUpdate () {
    if (Input.GetAxis("Mouse ScrollWheel") < 0) // back
        {
            distance = distance + 100;
			distance = ClampDistance(distance, distanceMinLimit, distanceMaxLimit);
 			var position : Vector3 = Vector3(0.0,  distance, 0.0) + target.position;
 			transform.position = position;
 
        }
        
        if (Input.GetAxis("Mouse ScrollWheel") > 0) // forward
        {
          if (target) {
	        
	        distance = distance - 100;
	        distance = ClampDistance(distance, distanceMinLimit, distanceMaxLimit);
		    position = Vector3(0.0, distance, 0.0) + target.position;
		    
		    transform.position = position;
    	}
        }
    
	if(Input.GetButton("Fire1")){
    	if (target) {
	        x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
	        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
		 		
		 	y = ClampAngle(y, yMinLimit, yMaxLimit);
		 		       
		    rotation = Quaternion.Euler(y, x, 0);
		    position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
		        
		    transform.rotation = rotation;
		    transform.position = position;
    	}
    }
    

   
   /*if(Input.GetButton("Fire3")){
		if (collider.Raycast (ray, hit, 1000.0)) {
			
		}
		
	}*/
}

static function ClampDistance (distance : float, min : float, max : float) {
	if (distance < min)
		distance = min;
	if (distance > max)
		distance = max;
	return distance;
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}