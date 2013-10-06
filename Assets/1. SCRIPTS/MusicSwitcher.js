#pragma strict

//Declare Audio Sources for Music Clips

var levelMusicClip: int = 0;
var bossMusicClip: int = 0;

var isBossAttacking = false;

var bossAttackStarted = false;

var bossHealth = 100;

var bossHealthHalved = false;

var bossDefeated = false;

var music_tribal: AudioClip[];

var music_about_to_die: AudioClip;

var music_boss: AudioClip[];

var dangerMusicClip : int = 0;
var music_danger: AudioClip[];
var swarmHealthLow : boolean = false;
var swarmHealthVeryLow : boolean = false;
//var music_boss_bed: AudioClip;
//var music_boss_half_life_start: AudioClip;
//var music_boss_half_life_bed: AudioClip;
//var music_boss_killed: AudioClip;

var levelMusic: Array = new Array();


// Petri 9/6/2013
var swarm_script : GameObject;
var swarm_health : float;


function Start () {
	swarm_script = GameObject.Find("GUI Text");
	
//levelMusic = [music_tribal];

//start music
NextClipLevelMusic();


}

function NextClipLevelMusic() {

	if (isBossAttacking == false && swarmHealthLow == false){

	PlayClip(music_tribal[levelMusicClip], transform);
	
	Invoke("NextClipLevelMusic", music_tribal[levelMusicClip].length);
		
	levelMusicClip = Random.Range(0, 6);	
	}
	

}


function NextClipBossMusic(){

if (isBossAttacking == true){

	PlayClip(music_boss[bossMusicClip], transform);
	
	Invoke("NextClipBossMusic", music_boss[bossMusicClip].length);
	
		if (bossMusicClip == 1) {
		bossMusicClip = 2;
	
	}
	
//		if (bossMusicClip == 3){
	//	levelMusicClip = 0;
	//	isBossAttacking = false;
	//	bossAttackStarted = false;
	//	NextClipLevelMusic();

	
	//	}
	

	}

}



//		if (bossMusicClip == 3){
	//	levelMusicClip = 0;
	//	isBossAttacking = false;
	//	bossAttackStarted = false;
	//	NextClipLevelMusic();

	
	//	}
	

function NextClipDangerMusic(){

	if (swarmHealthLow == true){
	
		PlayClip(music_danger[dangerMusicClip], transform);
		Invoke("NextClipDangerMusic", music_danger[dangerMusicClip].length);
		
		if (dangerMusicClip == 0) {
			dangerMusicClip = 1;
		}
	}

}



function TransitionBackToLevelMusic(){

	//PlayClip(music_boss[bossMusicClip], transform);
		levelMusicClip = 0;
		isBossAttacking = false;
		bossAttackStarted = false;
		bossHealth = 100;

		
		bossHealthHalved = false;

		bossDefeated = false;
		
		swarmHealthLow = false;
		
		Invoke("NextClipLevelMusic", music_boss[bossMusicClip].length);

}



function PlayClip(sound : AudioClip, tf : Transform) {
	
	var soundObject = new GameObject("TempLevelMusicEmitter");
	var soundSource: AudioSource = soundObject.AddComponent(AudioSource);
	soundSource.clip = sound;
	soundSource.volume = 0.3;

	soundObject.transform.parent = tf;
	soundObject.transform.position = tf.position;
	soundSource.priority = 1;
		
	soundSource.Play();
	Destroy(soundObject, sound.length + 0.1);
	

}


function StopCurrentMusic(){

	var stopMusic: GameObject = GameObject.Find("TempLevelMusicEmitter");

	stopMusic.audio.Stop();
}


function Update () {

	swarm_health = swarm_script.GetComponent(GUI_Stuff).BarDisplay1;

if (isBossAttacking == true){
		
		if (bossAttackStarted == false) {
			
			bossAttackStarted = true;
	
			StopCurrentMusic();
			bossMusicClip = 0;
			NextClipBossMusic();
		}

}


if (bossHealth <= 50){

	if (bossHealthHalved == false){
		
		bossHealthHalved = true;
		bossMusicClip = 1;
	
	}
}
	
//if Boss health less than 50% 
	//set bossMusicClip = 1
	
	
if (bossHealth == 0){

		if(bossDefeated == false){
			bossDefeated = true;
			StopCurrentMusic();
			bossMusicClip = 3;
			TransitionBackToLevelMusic();
		}
}	
// if Boss health = 0%
	//set bossMusicClip = 3


// Panic music if swarm health is low

if (swarm_health <= 0.35){
	
	if(swarmHealthLow == false){
		swarmHealthLow = true;
		StopCurrentMusic();
		dangerMusicClip = 0;
		NextClipDangerMusic();
	}
	
}

if (swarm_health > 0.35){

	if(swarmHealthLow){
		swarmHealthLow = false;
		StopCurrentMusic();
		TransitionBackToLevelMusic();
	}
	
}

//Debug.Log(swarmHealthLow);
/*
if (swarm_health < 0.4){
	
	if(swarmHealthVeryLow == false){
		swarmHealthVeryLow = true;
		StopCurrentMusic();
		dangerMusicClip = 1;
		NextClipDangerMusic();
	}
}
*/
}



