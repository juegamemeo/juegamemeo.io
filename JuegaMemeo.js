var scene, camera, renderer, clock, deltaTime, totalTime;
var arToolkitSource, arToolkitContext;
var p002, p004, p005, p006, p007, p008, p009, p010, p011, p012, p013, p014, p015, p016;
var mesh1, mesh2, mesh3,  mesh4, mesh5, mesh6, mesh7, mesh8, mesh9, mesh10;
var markerRoot1, markerRoot2;
var RhinoMesh, RhinoMesh2, RhinoMesh3 ;
var video = document.getElementById('video');
var marker1, marker2;
var loaderFont= new THREE.FontLoader();
let raycaster; //permite apuntar o detectar objetos en nuestra aplicacion  
let mouse = new THREE.Vector2();
let INTERSECTED; //guarda info sobre los objetos intersectados por mi raycast
let objects = []; //guarda los objetos que quiero detectar
var sprite4; //variable para el label
var canvas1, context1, texture1; // variables para creacion del label

loaderFont.load('./data/gentilis_bold.typeface.json', function(font){   
	init(font);
    animate();
});

function main() {
}

function init() {

	///////CREACION DE UNA ESCENA///////////////////
	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );

	let light = new THREE.PointLight(0xffffff, 1, 100); //creo nueva luz 
	light.position.set(0, 4, 4); //indico la posicion de la luz 
	light.castShadow = true; //activo la capacidad de generar sombras.
	scene.add(light); //agrego la luz a mi escena    
    light.shadow.mapSize.width = 4096; //resolucion mapa de sombras ancho 
	light.shadow.mapSize.height = 4096;// resolucion mapa de sombras alto
	
	///////CREACION DE UNA LUCES////////////////////
	let lightSphere = new THREE.Mesh(
		new THREE.SphereGeometry(0.1),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.8
		})
	);

	lightSphere.position.copy(light);
	scene.add(lightSphere);

	///////CREACION DE UNA CAMARA///////////////////
	camera = new THREE.Camera();
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
	scene.add(camera);

	 //raycaster
	 raycaster = new THREE.Raycaster();


	///////CREACION DEL RENDERER///////////////////
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize(1920, 1080);
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	document.body.appendChild(renderer.domElement);

	///////CREACION DE UN COUNTER///////////////////
	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;

	///////////setup arToolkitSource/////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType: 'webcam',
	});

	function onResize() {
		arToolkitSource.onResize()
		arToolkitSource.copySizeTo(renderer.domElement)
		if (arToolkitContext.arController !== null) {
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
		}
	}

	arToolkitSource.init(function onReady() {
		onResize()
	});

	// handle resize event
	window.addEventListener('resize', function () {
		onResize()
	});

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono'
	});

	// copy projection matrix to camera when initialization complete
	arToolkitContext.init(function onCompleted() {
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});

    /////////////////////////////////////////////////
    ////////////////MARKER SET UP////////////////////
    /////////////////////////////////////////////////

    markerRoot1 = new THREE.Group(); //creamos un grupo de objetos
    scene.add(markerRoot1); // agregamos el grupo a la escena. 

    //Creamos nuestro marcador 
    let markerControl = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {

        type: 'pattern', patternUrl: 'data/caja.patt',
    });

    markerRoot2 = new THREE.Group(); //creamos un grupo de objetos
    scene.add(markerRoot2); // agregamos el grupo a la escena. 

    //Creamos nuestro marcador 
    let markerControl1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot2, {

        type: 'pattern', patternUrl: 'data/entrada.patt',
    });

    /////////////////////////////////////////////////
    /////////////////////GEOMETRY////////////////////
    /////////////////////////////////////////////////

    //Creo una geometria cubo
    let geo1 = new THREE.CubeGeometry(.75, .75, .75); // crear la plantilla
    //creo material 
    let material1 = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }); //creamos el material 

    //Creo una geometria 
    let geo2 = new THREE.CubeGeometry(.75, .75, .75); // crear la plantilla
    //creo material 
    let material2 = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }); //creamos el material

    //////////////MESH1/////////////////////////////////
    //creo un mesh con la geometria y el material 
    mesh1 = new THREE.Mesh(geo1, material1); //nuestro mesh 
    //CAMBIO LA POSICION DE MI MESH 
    mesh1.position.y = 0.5;
    mesh1.position.z = -0.3;

    //activo el recibir y proyectar sombras en otros meshes
    mesh1.castShadow = true;
    mesh1.receiveShadow = true;

    /////////////////MESH2//////////////////////////////
    //creo un mesh con la geometria y el material 
    mesh2 = new THREE.Mesh(geo2, material2); //nuestro mesh 
    //CAMBIO LA POSICION DE MI MESH 
    mesh2.position.x = 0.75;
    mesh2.position.y = 1.0;
    //activo el recibir y proyectar sombras en otros meshes
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;


    ////////////////////PISO////////////////////////////
    let floorGeometry = new THREE.PlaneGeometry(20, 20);
    let floorMaterial = new THREE.ShadowMaterial();
    floorMaterial.opacity = 0.25;

    let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    markerRoot1.add(floorMesh);

	////////////////////////////////////////////////////////////////////
	////////////////////////OBJETOS 3D MEMEO////////////////////////////
	////////////////////////////////////////////////////////////////////

    function onProgress(xhr) { console.log((xhr.loaded / xhr.total * 100) + "% loaded"); }
    function onError(xhr) { console.log("ha ocurrido un error") };

    //////OBJETO RHINO 1///////////////
    new THREE.MTLLoader()
        .setPath('data/models/')
        .load('capa1.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('data/models/')
                .load('capa1.obj', function (group) {
                    RhinoMesh = group.children[0];
                    RhinoMesh.material.side = THREE.DoubleSide;
                    RhinoMesh.scale.set(0.001, 0.001, 0.001);
                    RhinoMesh.castShadow = true;
                    RhinoMesh.receiveShadow = true;

                    markerRoot1.add(RhinoMesh);
                }, onProgress, onError);
        });

    //////OBJETO RHINO 2///////////////
    new THREE.MTLLoader()
        .setPath('data/models/')
        .load('capa2.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('data/models/')
                .load('capa2.obj', function (group) {
                    RhinoMesh2 = group.children[0];
                    RhinoMesh2.material.side = THREE.DoubleSide;
                    RhinoMesh2.scale.set(0.001, 0.001, 0.001);
                    RhinoMesh2.castShadow = true;
                    RhinoMesh2.receiveShadow = true;

                    markerRoot1.add(RhinoMesh2);
                }, onProgress, onError);
        });

    //////OBJETO RHINO 3///////////////
    new THREE.MTLLoader()
        .setPath('data/models/')
        .load('memeologo.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('data/models/')
                .load('memeologo.obj', function (group) {
                    RhinoMesh3 = group.children[0];
                    RhinoMesh3.material.side = THREE.DoubleSide;
                    RhinoMesh3.scale.set(0.1, 0.1, 0.1);
                    RhinoMesh3.castShadow = true;
                    RhinoMesh3.receiveShadow = true;

                    markerRoot2.add(RhinoMesh3);
                }, onProgress, onError);
		});
		
	////////////////////////////////////////////////////////////////////
	////////////////////////FOTOS MEMEO/////////////////////////////////
	////////////////////////////////////////////////////////////////////

	//bienvenida
	p002 = new THREE.Group();
	p002.name = 'marker4';
	scene.add(p002);
	let markerControls2 = new THREEx.ArMarkerControls(arToolkitContext, p002, {
		type: 'pattern',
			patternUrl: "data/bienvenida.patt",
	})
	
	let meme002 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader002 = new THREE.TextureLoader();
	let texture002 = loader002.load('./images/2.png')
	let material002 = new THREE.MeshBasicMaterial({map:texture002});
	
	let foto002 = new THREE.Mesh(meme002, material002);
	foto002.rotation.x = -Math.PI / 2;
	p002.add(foto002);	

	//Instructivo
	p004 = new THREE.Group();
	p004.name = 'marker4';
	scene.add(p004);
	let markerControls4 = new THREEx.ArMarkerControls(arToolkitContext, p004, {
		type: 'pattern',
			patternUrl: "data/instructivo.patt",
	})
	
	let meme004 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader004 = new THREE.TextureLoader();
	let texture004 = loader004.load('./images/4.png')
	let material004 = new THREE.MeshBasicMaterial({map:texture004});
	
	let foto004 = new THREE.Mesh(meme004, material004);
	foto004.rotation.x = -Math.PI / 2;
	p004.add(foto004);	

	//Valeria
	p005 = new THREE.Group();
	p005.name = 'marker5';
	scene.add(p005);
	let markerControls5 = new THREEx.ArMarkerControls(arToolkitContext, p005, {
		type: 'pattern',
		patternUrl: "data/valeria.patt",
	})

	let meme005 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader005 = new THREE.TextureLoader();
	let texture005 = loader005.load('./images/5.png')
	let material005 = new THREE.MeshBasicMaterial({map:texture005});

	let foto005 = new THREE.Mesh(meme005, material005);
	foto005.rotation.x = -Math.PI / 2;
	p005.add(foto005);

	//Antonia
	p006 = new THREE.Group();
	p006.name = 'marker6';
	scene.add(p006);
	let markerControls6 = new THREEx.ArMarkerControls(arToolkitContext, p006, {
		type: 'pattern',
		patternUrl: "data/antonia.patt",
	})

	let meme006 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader006 = new THREE.TextureLoader();
	let texture006 = loader006.load('./images/6.png')
	let material006 = new THREE.MeshBasicMaterial({map:texture006});

	let foto006 = new THREE.Mesh(meme006, material006);
	foto006.rotation.x = -Math.PI / 2;
	p006.add(foto006);	


	//Rodrigo
	p007 = new THREE.Group();
	p007.name = 'marker7';
	scene.add(p007);
	let markerControls7 = new THREEx.ArMarkerControls(arToolkitContext, p007, {
		type: 'pattern',
		patternUrl: "data/rodrigo.patt",
	})

	let meme007 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader007 = new THREE.TextureLoader();
	let texture007 = loader007.load('./images/7.png')
	let material007 = new THREE.MeshBasicMaterial({map:texture007});

	let foto007 = new THREE.Mesh(meme007, material007);
	foto007.rotation.x = -Math.PI / 2;
	p007.add(foto007);

	//pancha
	p008 = new THREE.Group();
	p008.name = 'marker8';
	scene.add(p008);
	let markerControls8 = new THREEx.ArMarkerControls(arToolkitContext, p008, {
		type: 'pattern',
		patternUrl: "data/pancha.patt",
	})

	let meme008 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader008 = new THREE.TextureLoader();
	let texture008 = loader008.load('./images/8.png')
	let material008 = new THREE.MeshBasicMaterial({map:texture008});

	let foto008 = new THREE.Mesh(meme008, material008);
	foto008.rotation.x = -Math.PI / 2;
	p008.add(foto008);

	//Angeles
	p009 = new THREE.Group();
	p009.name = 'marker9';
	scene.add(p009);
	let markerControls9 = new THREEx.ArMarkerControls(arToolkitContext, p009, {
		type: 'pattern',
			patternUrl: "data/angeles.patt",
	})

	let meme009 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader009 = new THREE.TextureLoader();
	let texture009 = loader009.load('./images/9.png')
	let material009 = new THREE.MeshBasicMaterial({map:texture009});

	let foto009 = new THREE.Mesh(meme009, material009);
	foto009.rotation.x = -Math.PI / 2;
	p009.add(foto009);

	//juan
	p010 = new THREE.Group();
	p010.name = 'marker10';
	scene.add(p010);
	let markerControls10 = new THREEx.ArMarkerControls(arToolkitContext, p010, {
		type: 'pattern',
			patternUrl: "data/juan.patt",
	})

	let meme010 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader010 = new THREE.TextureLoader();
	let texture010 = loader010.load('./images/10.png')
	let material010 = new THREE.MeshBasicMaterial({map:texture010});

	let foto010 = new THREE.Mesh(meme010, material010);
	foto010.rotation.x = -Math.PI / 2;
	p010.add(foto010);	

	//Daniel
	p011 = new THREE.Group();
	p011.name = 'marker11';
	scene.add(p011);
	let markerControls11 = new THREEx.ArMarkerControls(arToolkitContext, p011, {
		type: 'pattern',
		patternUrl: "data/daniel.patt",
	})

	let meme011 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader011 = new THREE.TextureLoader();
	let texture011 = loader011.load('./images/11.png')
	let material011 = new THREE.MeshBasicMaterial({map:texture011});

	let foto011 = new THREE.Mesh(meme011, material011);
	foto011.rotation.x = -Math.PI / 2;
	p011.add(foto011);

	//josefina
	p012 = new THREE.Group();
	p012.name = 'marker12';
	scene.add(p012);
	let markerControls12 = new THREEx.ArMarkerControls(arToolkitContext, p012, {
		type: 'pattern',
		patternUrl: "data/josefina.patt",
	})

	let meme012 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader012 = new THREE.TextureLoader();
	let texture012 = loader012.load('./images/12.png')
	let material012 = new THREE.MeshBasicMaterial({map:texture012});

	let foto012 = new THREE.Mesh(meme012, material012);
	foto012.rotation.x = -Math.PI / 2;
	p012.add(foto012);	

	//caro
	p013 = new THREE.Group();
	p013.name = 'marker13';
	scene.add(p013);
	let markerControls13 = new THREEx.ArMarkerControls(arToolkitContext, p013, {
		type: 'pattern',
		patternUrl: "data/carolina.patt",
	})

	let meme013 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader013 = new THREE.TextureLoader();
	let texture013 = loader013.load('./images/13.png')
	let material013 = new THREE.MeshBasicMaterial({map:texture013});

	let foto013 = new THREE.Mesh(meme013, material013);
	foto013.rotation.x = -Math.PI / 2;
	p013.add(foto013);

	//javiera
	p014 = new THREE.Group();
	p014.name = 'marker14';
	scene.add(p014);
	let markerControls14 = new THREEx.ArMarkerControls(arToolkitContext, p014, {
		type: 'pattern',
		patternUrl: "data/javiera.patt",
	})

	let meme014 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader014 = new THREE.TextureLoader();
	let texture014 = loader014.load('./images/14.png')
	let material014 = new THREE.MeshBasicMaterial({map:texture014});

	let foto014 = new THREE.Mesh(meme014, material014);
	foto014.rotation.x = -Math.PI / 2;
	p014.add(foto014);

	//pablo
	p015 = new THREE.Group();
	p015.name = 'marker15';
	scene.add(p015);
	let markerControls15 = new THREEx.ArMarkerControls(arToolkitContext, p015, {
		type: 'pattern',
			patternUrl: "data/pablo.patt",
	})
	
	let meme015 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader015 = new THREE.TextureLoader();
	let texture015 = loader015.load('./images/15.png')
	let material015 = new THREE.MeshBasicMaterial({map:texture015});
	
	let foto015 = new THREE.Mesh(meme015, material015);
	foto015.rotation.x = -Math.PI / 2;
	p015.add(foto015);

	//Mai
	p016 = new THREE.Group();
	p016.name = 'marker16';
	scene.add(p016);
	let markerControls16 = new THREEx.ArMarkerControls(arToolkitContext, p016, {
		type: 'pattern',
			patternUrl: "data/mai.patt",
	})
	
	let meme016 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader016 = new THREE.TextureLoader();
	let texture016 = loader016.load('./images/16.png')
	let material016 = new THREE.MeshBasicMaterial({map:texture016});
	
	let foto016 = new THREE.Mesh(meme016, material016);
	foto016.rotation.x = -Math.PI / 2;
	p016.add(foto016);	

	////////////////////////////////////////////////////////////////////
	////////////////////////VIDEO MEMEO/////////////////////////////////
	////////////////////////////////////////////////////////////////////

    //Marcador
    marker1 = new THREE.Group();
    //marker1.name = 'marker1';
    scene.add(marker1); //agregamos el marcador a la escena 

    let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, marker1, {
        type: 'pattern',
        patternUrl: "data/video.patt",
    })   

    //////CREACION VIDEO///////////////
    let geoVideo = new THREE.PlaneBufferGeometry(2,2,4,4); //molde geometria

    
    video.muted= true;
    video.pause();
    let texture =  new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter= THREE.LinearFilter;
    texture.format =  THREE.RGBFormat;

    let material10 = new THREE.MeshBasicMaterial(
        {

            map:texture
    }
    );

    mesh3 = new THREE.Mesh(geoVideo, material10);
    mesh3.rotation.x = -Math.PI/2;

	marker1.add(mesh3);
	
	////////////////////////////////////////////////////////////////////
	///////////////////////INTERACCIÓN MEMEO////////////////////////////
	////////////////////////////////////////////////////////////////////

	//Marcador 2
    marker2 = new THREE.Group();
    marker2.name = 'marker17';
    scene.add(marker2); //agregamos el marcador a la escena 

    let markerControls3 = new THREEx.ArMarkerControls(arToolkitContext, marker2, {
        type: 'pattern',
        patternUrl: "data/notocar.patt",
    })

    ////////////GEOMETRIAS//////////////////////////////////////

    //paso 1 - creo geometria 
    let box = new THREE.CubeGeometry(.5, .5, .5); //plantilla para crear geometrias cubo

    //Paso 2 - creo materiales
    //material 1
    let matBox01 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    //material 2
    let matBox02 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    let matBox03 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    let matBox04 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    let matBox05 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    let matBox06 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

    let matBox07 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );


    //paso 3 - Creo Meshes

    //mesh1
    mesh4 = new THREE.Mesh(box, matBox01);
    mesh4.position.y = 0.5;
    mesh4.name = 'Jugaste Memeo?'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    //mesh2
    mesh5 = new THREE.Mesh(box, matBox02);
    mesh5.position.y = 1;
    mesh5.position.x = 1.5;
    mesh5.position.z = -0.5;
    //mesh2.position.x = -.6;
    mesh5.name = 'MEMEMOOO!'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    //mesh3
    mesh6 = new THREE.Mesh(box, matBox03);
    mesh6.position.y = 1.5;
    mesh6.position.x = -0.5;
    mesh6.position.z = 1;
    //mesh2.position.x = -.6;
    mesh6.name = 'Mearse de la risa!'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    //mesh4
    mesh7 = new THREE.Mesh(box, matBox04);
    mesh7.position.y = 2;
    mesh7.position.x = -1.5;
    mesh7.position.z = -1.5;
    //mesh2.position.x = -.6;
    mesh7.name = '¿Memeamos?!'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    //mesh5
    mesh8 = new THREE.Mesh(box, matBox05);
    mesh8.position.y = 2.5;
    mesh8.position.x = 1.5;
    mesh8.position.z = -1;

    //mesh2.position.x = -.6;
    mesh8.name = 'JAJAJAJAJA!'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    //mesh6
    mesh9 = new THREE.Mesh(box, matBox06);
    mesh9.position.y = 3;
    mesh9.position.x = -1;
    mesh9.position.z = 0.5;

    //mesh2.position.x = -.6;
    mesh9.name = 'Sigue a Memeo'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    //mesh7
    mesh10 = new THREE.Mesh(box, matBox07);
    mesh10.position.y = 3;
    mesh10.position.x = 0.5;
    mesh10.position.z = -0.5;

    //mesh2.position.x = -.6;
    mesh10.name = 'Era de Memes'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse

    /////////CREACION ELEMENTOS TEXTO//////////////////////
    //CREACION DE CANVAS 
    canvas1 = document.createElement('canvas');
    context1 = canvas1.getContext('2d');
    context1.font = "Bold 14px Arial";
    context1.fillStyle = "rgba(0,0,0,0.95)";
    context1.fillText('Hello', 0, 1);

    //los contenidos del canvas seran usados como textura 
    texture1 = new THREE.Texture(canvas1);
    texture1.needsUpdate = true;


    //creacion del sprite
    var spriteMaterial = new THREE.SpriteMaterial(
        {
            map: texture1
        }
    )
    sprite4 = new THREE.Sprite(spriteMaterial);
    sprite4.scale.set(1.5, 1.5, 1.5);
    //sprite1.position.set(5, 5, 0);

    ////////////AGREGAMOS OBJETOS A ESCeNA Y ARRAY OBJECTS


    //Agregamos objetos a detectar a nuestro array objects
    objects.push(mesh4);
    objects.push(mesh5);
    objects.push(mesh6);
    objects.push(mesh7);
    objects.push(mesh8);
    objects.push(mesh9);
    objects.push(mesh10);
    //agregamos nuestros objetos a la escena mediante el objeto marker1
    marker2.add(sprite4);
    marker2.add(mesh4);
    marker2.add(mesh5);
    marker2.add(mesh6);
    marker2.add(mesh7);
    marker2.add(mesh8);
    marker2.add(mesh9);
    marker2.add(mesh10);
    //////////EVENT LISTERNERS/////////////////////////////////
    document.addEventListener('mousemove', onDocumentMouseMove, false);// detecta movimiento del mouse
}
///////automatico///////////////////////

function onDocumentMouseMove(event) {
    event.preventDefault();
    sprite4.position.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0);
    sprite4.renderOrder = 999;
    sprite4.onBeforeRender = function (renderer) { renderer.clearDepth(); }

    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1); //mouse pos

    raycaster.setFromCamera(mouse, camera); //creo el rayo que va desde la camara , pasa por el frustrum 
    let intersects = raycaster.intersectObjects(objects, true); //buscamos las intersecciones

    if (intersects.length > 0) {
        if (intersects[0].object != INTERSECTED) {
            if (INTERSECTED) {
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            }
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.setHex(0xffff00);

            if (INTERSECTED.name) {
                context1.clearRect(0, 0, 10, 10);
                let message = INTERSECTED.name;
                let metrics = context1.measureText(message);
                let width = metrics.width;
                context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
                context1.fillRect(0, 0, width + 8, 20 + 8);
                context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
                context1.fillRect(2, 2, width + 4, 20 + 4);
                context1.fillStyle = "rgba(0,0,0,1)"; // text color
                context1.fillText(message, 5, 20);
                texture1.needsUpdate = true;
            }
            else {
                context1.clearRect(0, 0, 10, 10);
                texture1.needsUpdate = true;
            }
        }

    }
    //si no encuentra intersecciones
    else {
        if (INTERSECTED) {
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex); //devolviendo el color original al objeto            
        }
        INTERSECTED = null;
        context1.clearRect(0, 0, 300, 300);
        texture1.needsUpdate = true;
    }
}

function update() {
	// update artoolkit on every frame
	if (arToolkitSource.ready !== false)
		arToolkitContext.update(arToolkitSource.domElement);
}

function render() {
	renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    deltaTime = clock.getDelta();
    totalTime += deltaTime;
    render();
    update();
    video.play();
}

function playVideo(){
	let video = document.getElementById('video');
	video.play();
}

