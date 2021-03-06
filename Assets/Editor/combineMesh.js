@script ExecuteInEditMode()

@script RequireComponent(MeshFilter)
	@script RequireComponent(MeshRenderer)
	function Start () {
		var meshFilters = GetComponentsInChildren(MeshFilter);
		var combine : CombineInstance[] = new CombineInstance[meshFilters.Length];
		for (var i = 0; i < meshFilters.Length; i++){
			combine[i].mesh = meshFilters[i].sharedMesh;
			combine[i].transform = meshFilters[i].transform.localToWorldMatrix;
			meshFilters[i].gameObject.active = false;
		}
		transform.GetComponent(MeshFilter).mesh = new Mesh();
		transform.GetComponent(MeshFilter).mesh.CombineMeshes(combine);
		transform.gameObject.active = true;
	}