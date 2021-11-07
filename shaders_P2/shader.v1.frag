#version 330 core

out vec4 outColor;

in vec3 color;
in vec3 vpos;
in vec3 vnormal;

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
	pos = vpos;
	N = vnormal;
	Kd = color;
	Ka = Kd;
	Ks = vec3(1.0);
	n = 50.0;
	// outColor = vec4(color, 1.0);   
	outColor = vec4(shade(), 1.0);   
}
