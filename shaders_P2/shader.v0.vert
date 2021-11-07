#version 330 core

in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;

uniform mat4 modelViewProj;
uniform mat4 modelView;
uniform mat4 normal;

// uniform vec3 Ia;
// uniform vec3 Il;
// uniform vec3 lpos;

// Variables de la luz
vec3 Ia = vec3(0.3);
vec3 Il = vec3(1.0);
vec3 lpos = vec3(0.0);

// Variables del objeto
vec3 pos;
vec3 N;
vec3 Ka;
vec3 Kd;
vec3 Ks;
float n;
vec3 Ke;

out vec3 color;

vec3 shade() 
{
	vec3 c = vec3(0.0);

	// Ambient intensity
	c += Ia * Ka;

	// Diffuse intensity
	vec3 L = normalize(lpos - pos);
	N = normalize(N);
	c += Il * Kd * max(0.0, dot(N, L));
	 
	// Specular intensity
	vec3 V = normalize(-pos);
	vec3 R = reflect(-L, N);
	c += Il * Ks * pow(max(dot(R, V), 0.0), n);

	return c;
}

void main()
{
	pos = (modelView * vec4(inPos, 1.0)).xyz;
	N = (normal * vec4(inNormal, 0.0)).xyz;
	Kd = inColor;
	Ka = Kd;
	Ks = vec3(1.0);
	n = 10.0;

	color = shade();

	gl_Position =  modelViewProj * vec4(inPos,1.0);
}
