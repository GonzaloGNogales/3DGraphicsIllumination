#version 330 core

in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;
in vec2 inTexCoord;	
in vec3 inTangent;	//Accedemos a las tangentes del modelo

uniform mat4 model;
uniform mat4 modelViewProj;
uniform mat4 modelView;
uniform mat4 normal;
uniform mat4 view;

out vec3 color;
out vec3 vpos;
out vec3 vnormal;
out vec3 vtangent;
out vec2 vtexcoord;

out mat4 vTBN;


void main()
{
	color = inColor;
	vpos = (modelView * vec4(inPos, 1.0)).xyz;	//--> l estará en coord de la camara
	vnormal = (normal * vec4(inNormal, 0.0)).xyz; //El vector normal esta en coord de la camara
	vtangent = (modelView * vec4(inTangent, 0.0)).xyz;  //El vector tangente en coord de la camara
	vtexcoord = inTexCoord;

	gl_Position =  modelViewProj * vec4(inPos,1.0);
}
