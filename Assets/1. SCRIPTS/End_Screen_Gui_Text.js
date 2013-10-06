#pragma strict
var end_text : Transform;

function Start() {

end_text.guiText.text = "ALL YOU CAN EAT\nOver The Top\nThe London Game Jam 2013\nPetri Autio        Carl Bateman\nSimon Gumbleton  Mike Tree\nYOUR WORTH: " + PlayerPrefs.GetInt("score");
end_text.guiText.material.color = Color.red;

}