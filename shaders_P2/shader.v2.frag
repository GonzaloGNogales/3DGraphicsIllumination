#version 330 core

out vec4 outColor;

in vec3 color;
in vec3 vpos;
in vec3 vnormal;
in vec3 vtangent;
in vec2 vtexcoord;

uniform sampler2D colorTex;
uniform sampler2D emiTex;
uniform sampler2D specularTex;
uniform mat4 view;

uniform sampler2D normalTex;

// Variables de la luz
// Coeficientes de atenuación para luces posicionales
float cp0 = 1.000;
float cp1 = 0.220;
float cp2 = 0.200;

// Coeficientes de atenuación para luces focales
float cf0 = 1.000;
float cf1 = 0.090;
float cf2 = 0.032;

// Luz Ambiente
vec3 Ia = vec3(0.3);

// Luz 1: Posicional --> Coordenadas del MV
vec3 Il1 = vec3(1.0, 0.0, 0.0);							// Color
vec3 lpos1 = vec3(4.0, 0.0, 0.0);		// Posición --> sist. referencia del MV

// Luz 2: Posicional --> Coordenadas del MV
vec3 Il2 = vec3(0.0, 0.0, 1.0);							// Color
vec3 lpos2 = vec3(-4.0, 0.0, 0.0);		// Posición

// Luz 3: Direccional --> Coordenadas del MV
vec3 Il3 = vec3(0.0, 0.5, 0.0);							// Color
vec3 Idir3 = vec3(0.0, 0.0, 1.0);		// Dirección

// Luz 4: Focal 
vec3 Il4 = vec3(1.0, 0.0, 1.0);			// Color
vec3 lpos4 = vec3(0.0);					//Posición --> coordenadas de la cámara
vec3 Idir4 = vec3(0.0, 0.0, -1.0);		//Dirección
float focalAngle = 0.1;					// Ángulo de apertura en radianes

// Variables del objeto
vec3 pos;
vec3 N;
vec3 Ka;
vec3 Kd;
vec3 Ks;
float n;
vec3 Ke;

///////////////////////////	Luz Posicional	///////////////////////////
vec3 positionalLight (vec3 lpos, vec3 Il, vec3 pos){
	
	vec3 cPositional = vec3(0.0);	
	lpos = (view *vec4(lpos, 0.0)).xyz;

	// Atenuación 1
	float d = length(lpos - pos);
    float factorAtenuacion1 = min(1.0/(cp0 + cp1*d + cp2*pow(d,2)), 1.0);
	
	// Calcular y añadir difusa 1
	vec3 L = normalize(lpos - pos);
	N = normalize(N);
	vec3 difusa = Il * Kd * max(0.0, dot(N, L));
		 
	// Calcular y añadir especular 1
	vec3 V = normalize(-pos);
	vec3 R = reflect(-L, N);
	vec3 especular = Il1 * Ks * pow(max(dot(R, V), 0.0), n);
	
	// Aplicar atenuación por distancia
	cPositional = factorAtenuacion1 * (difusa + especular);

	return cPositional;
}

///////////////////////////		Luz Direccional	///////////////////////////
vec3 directionalLight (vec3 Ldir, vec3 Il, vec3 pos){
	
	vec3 cDirectional = vec3(0.0);	
	Ldir = (view *vec4(Ldir, 0.0)).xyz;

	// Calcular y añadir difusa 3
	vec3 L = -Ldir;
	N = normalize(N);
	cDirectional += Il * Kd * max(0.0, dot(N, L));
	 
	// Calcular y añadir especular 3
	vec3 V = normalize(-pos);
	vec3 R = reflect(-L, N);
	cDirectional += Il * Ks * pow(max(dot(R, V), 0.0), n);

	return cDirectional;
}

///////////////////////////		Luz Focal	///////////////////////////
vec3 focalLight (vec3 lpos, vec3 Il, vec3 pos, vec3 Ldir){
	
	vec3 cFocal = vec3(0.0);	

	// Atenuación
	float d4 = length(lpos - pos);
    float factorAtenuacion = min(1.0/(cf0 + cf1*d4 + cf2*pow(d4,2)), 1.0);

	// Calcular y añadir difusa
	vec3 L = normalize(lpos - pos);
	N = normalize(N);
	vec3 difusa = Il4 * Kd * max(0.0, dot(N, L));
	 
	// Calcular y añadir especular
	vec3 V = normalize(-pos);
	vec3 R = reflect(-L, N);
	vec3 especular = Il4 * Ks * pow(max(dot(R, V), 0.0), n);

	// Calcular la incidencia de los rayos dentro del ángulo del foco y aplicar factor de atenuación respecto a la distancia
	float fDir = 0.0;
	if (cos(focalAngle) < (dot(-L, Ldir))) fDir = 1.0;
	cFocal = factorAtenuacion * fDir * (difusa + especular);

	return cFocal;
}


vec3 shade() 
{
	vec3 c = vec3(0.0);

	// Añadir intensidad ambiental
	c += Ia * Ka;

	// Calculamos las luces posicionales
	c += positionalLight(lpos1, Il1, pos);
	c += positionalLight(lpos2, Il2, pos);

	// Calculamos las luces direccionales
	c += directionalLight(Idir3, Il3, pos);

	// Calculamos las luces focales
	c += focalLight(lpos4, Il4, pos, Idir4);

	// Añadir intensidad emisiva
	c += Ke;

	return c;
}

void main()
{
	pos = vpos;
	//Bump Mapping
	N = 2 * texture(normalTex, vtexcoord).rgb - vec3(1.0);  //Normales de la textura normalizadas entre -1 y 1 (vienen entre 0 y 1)
	mat3 vTBN = mat3(vtangent, cross(vnormal, vtangent), vnormal);  //Matriz para cambiar de sistema de coordenadas de la textura a la camara
	N = vTBN * N;

	Kd = texture(colorTex, vtexcoord).rgb;
	Ka = Kd;
	Ks = texture(specularTex, vtexcoord).rgb;
	n = 50.0;
	Ke = texture(emiTex, vtexcoord).rgb;
	outColor = vec4(shade(), 1.0);   
}
