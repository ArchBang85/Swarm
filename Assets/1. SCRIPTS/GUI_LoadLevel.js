#pragma strict
var cubeRenderer:Renderer;

// Size and spacing of GUI button(s)
private var buttonWidth:int = 300;
private var buttonHeight:int = 50;
private var spacing:int = 30;


function OnGUI() {
	
	GUILayout.BeginArea(Rect(Screen.width  - 200 - buttonWidth/2, Screen.height - 80, buttonWidth, 400));

		
		if(GUILayout.Button("EAT", GUILayout.Height(50)))
		{
			Application.LoadLevel("Level_1");
		}

	// Use the following code to add further buttons if necessary
	/*	GUILayout.Space(spacing);
		if(GUILayout.Button("Options", GUILayout.Height(50)))
		{
			Application.LoadLevel("Options");
		}
		GUILayout.Space(spacing);
		if(GUILayout.Button("Quit", GUILayout.Height(50)))
		{
			Application.Quit();
		}*/

	GUILayout.EndArea();
}