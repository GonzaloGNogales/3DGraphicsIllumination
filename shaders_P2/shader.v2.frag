#version 330 core

out vec4 outColor;

in vec3 color;
in vec3 vpos;
in vec3 vnormal;
in vec2 vtexcoord;

uniform sampler2D colorTex;
uniform sampler2D emiTex;
uniform sampler2D specularTex;

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

// Luz 1: Posicional
vec3 Il1 = vec3(1.0, 0.0, 0.0);			// Color
vec3 lpos1 = vec3(0.0);					// Posición

// Luz 2: Posicional
vec3 Il2 = vec3(0.0, 0.0, 1.0);			// Color
vec3 lpos2 = vec3(6.0, 0.0, -6.0);		// Posición

// Luz 3: Direccional
vec3 Il3 = vec3(0.0, 1.0, 0.0);			// Color
vec3 Idir3 = vec3(1.0, 0.0, 0.0);		// Dirección

// Luz 4: Focal 
vec3 Il4 = vec3(1.0, 0.0, 0.0);			// Color
//vec3 lpos4 = vec3(-6.0, 0.0, -6.0);		// Posicion
vec3 lpos4 = vec3(0.0);
//vec3 Idir4 = vec3(1.0, 0.0, 0.0);		// Direccion
vec3 Idir4 = vec3(0.0, 0.0, -1.0);
float focalAngle = 0.1;					// Ángulo de apertura en radianes

// Variables del objeto
vec3 pos;
vec3 N;
vec3 Ka;
vec3 Kd;
vec3 Ks;
float n;
vec3 Ke;

vec3 shade() 
{
	vec3 c = vec3(0.0);

	// Añadir intensidad ambiental
	c += Ia * Ka;

	///////////////////////////		Luz 1: Posicional	///////////////////////////

	// Atenuación 1
	float d1 = length(lpos1 - pos);
    float factorAtenuacion1 = min(1.0/(cp0 + cp1*d1 + cp2*pow(d1,2)), 1.0);
	
	// Calcular y añadir difusa 1
	vec3 L1 = normalize(lpos1 - pos);
	N = normalize(N);
	vec3 difusa1 = Il1 * Kd * max(0.0, dot(N, L1));
		 
	// Calcular y añadir especular 1
	vec3 V1 = normalize(-pos);
	vec3 R1 = reflect(-L1, N);
	vec3 especular1 = Il1 * Ks * pow(max(dot(R1, V1), 0.0), n);
	
	// Aplicar atenuación por distancia
	c += factorAtenuacion1 * (difusa1 + especular1);

	///////////////////////////		Luz 2: Posicional	///////////////////////////

	// Atenuación 2
	float d2 = length(lpos2 - pos);
    float factorAtenuacion2 = min(1.0/(cp0 + cp1*d2 + cp2*pow(d2,2)), 1.0);

	// Calcular y añadir difusa 2
	vec3 L2 = normalize(lpos2 - pos);
	N = normalize(N);
	vec3 difusa2 = Il2 * Kd * max(0.0, dot(N, L2));
	 
	// Calcular y añadir especular 2
	vec3 V2 = normalize(-pos);
	vec3 R2 = reflect(-L2, N);
	vec3 especular2 = Il2 * Ks * pow(max(dot(R2, V2), 0.0), n);

	// Aplicar atenuación por distancia
	c += factorAtenuacion2 * (difusa2 + especular2);

	///////////////////////////		Luz 3: Direccional	///////////////////////////

	// Calcular y añadir difusa 3
	vec3 L3 = -Idir3;
	N = normalize(N);
	c += Il3 * Kd * max(0.0, dot(N, L3));
	 
	// Calcular y añadir especular 3
	vec3 V3 = normalize(-pos);
	vec3 R3 = reflect(-L3, N);
	c += Il3 * Ks * pow(max(dot(R3, V3), 0.0), n);

	///////////////////////////		Luz 4: focal	///////////////////////////

	// Atenuación 4
	float d4 = length(lpos4 - pos);
    float factorAtenuacion4 = min(1.0/(cf0 + cf1*d4 + cf2*pow(d4,2)), 1.0);

	// Calcular y añadir difusa 4
	vec3 L4 = normalize(lpos4 - pos);
	N = normalize(N);
	vec3 difusa4 = Il4 * Kd * max(0.0, dot(N, L4));
	 
	// Calcular y añadir especular 4
	vec3 V4 = normalize(-pos);
	vec3 R4 = reflect(-L4, N);
	vec3 especular4 = Il4 * Ks * pow(max(dot(R4, V4), 0.0), n);

	// Calcular la incidencia de los rayos dentro del ángulo del foco y aplicar factor de atenuación respecto a la distancia
	float fDir = 0.0;
	if (cos(focalAngle) < (dot(-L4, Idir4))) fDir = 1.0;
	c += factorAtenuacion4 * fDir * (difusa4 + especular4);

	// Añadir intensidad emisiva
	c += Ke;

	return c;
}

void main()
{
	pos = vpos;
	N = vnormal;
	Kd = texture(colorTex, vtexcoord).rgb;
	Ka = Kd;
	Ks = texture(specularTex, vtexcoord).rgb;
	n = 50.0;
	Ke = texture(emiTex, vtexcoord).rgb;
	outColor = vec4(shade(), 1.0);   
}
