#pragma strict
 
function Update(){
    var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
    var hit : RaycastHit;
    if (collider.Raycast (ray, hit, 100.0)) {
        Debug.DrawLine (ray.origin, hit.point);
    }
}